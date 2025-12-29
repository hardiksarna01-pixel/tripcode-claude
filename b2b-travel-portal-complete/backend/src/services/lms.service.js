/**
 * LMS (Learning Management System) Service
 * Handles courses, enrollments, progress tracking, and certificates
 */

const { Op } = require('sequelize');
const crypto = require('crypto');
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');

class LMSService {
    constructor(db) {
        this.db = db;
    }

    // =====================================================
    // COURSE MANAGEMENT
    // =====================================================

    async getCourses({ tenantId, categoryId, certificationId, level, status, search, page = 1, limit = 20 }) {
        const where = { tenant_id: tenantId };

        if (categoryId) where.category_id = categoryId;
        if (certificationId) where.certification_id = certificationId;
        if (level) where.level = level;
        if (status) where.status = status;
        if (search) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const offset = (page - 1) * limit;

        const [courses] = await this.db.query(`
            SELECT c.*,
                   cc.name as category_name,
                   cert.name as certification_name,
                   cb.name as body_name,
                   (SELECT COUNT(*) FROM course_enrollments WHERE course_id = c.id) as enrolled_count
            FROM courses c
            LEFT JOIN course_categories cc ON c.category_id = cc.id
            LEFT JOIN certifications_catalog cert ON c.certification_id = cert.id
            LEFT JOIN certification_bodies cb ON cert.body_id = cb.id
            WHERE c.tenant_id = $1
            ${categoryId ? 'AND c.category_id = $2' : ''}
            ${status ? `AND c.status = '${status}'` : ''}
            ORDER BY c.is_featured DESC, c.display_order, c.created_at DESC
            LIMIT $3 OFFSET $4
        `, {
            bind: [tenantId, categoryId, limit, offset]
        });

        const [[{ count }]] = await this.db.query(`
            SELECT COUNT(*) FROM courses WHERE tenant_id = $1
        `, { bind: [tenantId] });

        return {
            courses,
            pagination: {
                page,
                limit,
                total: parseInt(count),
                pages: Math.ceil(count / limit)
            }
        };
    }

    async getCourseById(courseId, userId = null) {
        const [[course]] = await this.db.query(`
            SELECT c.*,
                   cc.name as category_name,
                   cert.name as certification_name,
                   cb.name as body_name, cb.logo_url as body_logo
            FROM courses c
            LEFT JOIN course_categories cc ON c.category_id = cc.id
            LEFT JOIN certifications_catalog cert ON c.certification_id = cert.id
            LEFT JOIN certification_bodies cb ON cert.body_id = cb.id
            WHERE c.id = $1
        `, { bind: [courseId] });

        if (!course) return null;

        // Get modules with lessons
        const [modules] = await this.db.query(`
            SELECT m.*,
                   json_agg(
                       json_build_object(
                           'id', l.id,
                           'title', l.title,
                           'content_type', l.content_type,
                           'duration_minutes', l.duration_minutes,
                           'is_preview', l.is_preview,
                           'display_order', l.display_order
                       ) ORDER BY l.display_order
                   ) FILTER (WHERE l.id IS NOT NULL) as lessons
            FROM course_modules m
            LEFT JOIN course_lessons l ON l.module_id = m.id AND l.is_active = true
            WHERE m.course_id = $1 AND m.is_active = true
            GROUP BY m.id
            ORDER BY m.display_order
        `, { bind: [courseId] });

        // Get instructors
        const [instructors] = await this.db.query(`
            SELECT * FROM instructors WHERE id = ANY($1::uuid[])
        `, { bind: [course.instructor_ids || []] });

        // Get reviews summary
        const [[reviewStats]] = await this.db.query(`
            SELECT
                COUNT(*) as total_reviews,
                AVG(rating) as avg_rating,
                COUNT(*) FILTER (WHERE rating = 5) as five_star,
                COUNT(*) FILTER (WHERE rating = 4) as four_star,
                COUNT(*) FILTER (WHERE rating = 3) as three_star,
                COUNT(*) FILTER (WHERE rating = 2) as two_star,
                COUNT(*) FILTER (WHERE rating = 1) as one_star
            FROM course_reviews WHERE course_id = $1 AND is_approved = true
        `, { bind: [courseId] });

        // Check enrollment status if user provided
        let enrollment = null;
        if (userId) {
            [[enrollment]] = await this.db.query(`
                SELECT * FROM course_enrollments WHERE course_id = $1 AND user_id = $2
            `, { bind: [courseId, userId] });
        }

        return {
            ...course,
            modules,
            instructors,
            reviewStats,
            enrollment
        };
    }

    async createCourse(data) {
        const slug = this.generateSlug(data.title);
        const code = `CRS-${Date.now().toString(36).toUpperCase()}`;

        const [[course]] = await this.db.query(`
            INSERT INTO courses (
                tenant_id, category_id, certification_id, code, title, slug, subtitle,
                description, short_description, course_type, level, language, languages_available,
                duration_hours, duration_weeks, original_price, selling_price, gst_percentage,
                discount_percentage, features, what_you_learn, requirements, target_audience,
                has_certificate, has_exam, passing_percentage, max_exam_attempts,
                instructor_ids, thumbnail_url, preview_video_url, status, created_by
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
                $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32
            ) RETURNING *
        `, {
            bind: [
                data.tenantId, data.categoryId, data.certificationId, code, data.title,
                slug, data.subtitle, data.description, data.shortDescription, data.courseType,
                data.level, data.language || 'English', data.languagesAvailable || ['English', 'Hindi'],
                data.durationHours, data.durationWeeks, data.originalPrice, data.sellingPrice,
                data.gstPercentage || 18, data.discountPercentage || 0, data.features,
                data.whatYouLearn, data.requirements, data.targetAudience, data.hasCertificate !== false,
                data.hasExam !== false, data.passingPercentage || 70, data.maxExamAttempts || 3,
                data.instructorIds, data.thumbnailUrl, data.previewVideoUrl, 'draft', data.createdBy
            ]
        });

        return course;
    }

    // =====================================================
    // ENROLLMENT MANAGEMENT
    // =====================================================

    async enrollUser({ tenantId, courseId, userId, userType, orderId, amountPaid, paymentMethod, transactionId }) {
        // Check if already enrolled
        const [[existing]] = await this.db.query(`
            SELECT * FROM course_enrollments WHERE course_id = $1 AND user_id = $2
        `, { bind: [courseId, userId] });

        if (existing) {
            throw new Error('Already enrolled in this course');
        }

        // Get course details
        const [[course]] = await this.db.query(`
            SELECT * FROM courses WHERE id = $1
        `, { bind: [courseId] });

        if (!course) throw new Error('Course not found');

        // Count total lessons
        const [[lessonCount]] = await this.db.query(`
            SELECT COUNT(*) as count FROM course_lessons WHERE course_id = $1 AND is_active = true
        `, { bind: [courseId] });

        const [[enrollment]] = await this.db.query(`
            INSERT INTO course_enrollments (
                tenant_id, course_id, user_id, user_type, order_id, amount_paid,
                payment_status, payment_method, transaction_id, status, total_lessons
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'enrolled', $10)
            RETURNING *
        `, {
            bind: [
                tenantId, courseId, userId, userType, orderId, amountPaid,
                amountPaid ? 'paid' : 'pending', paymentMethod, transactionId,
                parseInt(lessonCount.count)
            ]
        });

        // Update course enrollment count
        await this.db.query(`
            UPDATE courses SET enrolled_count = enrolled_count + 1 WHERE id = $1
        `, { bind: [courseId] });

        // Track revenue
        if (amountPaid) {
            await this.trackRevenue({
                tenantId,
                sourceType: 'course',
                sourceId: enrollment.id,
                courseId,
                enrollmentId: enrollment.id,
                userId,
                userType,
                grossAmount: amountPaid,
                gstAmount: amountPaid * 0.18 / 1.18,
                netAmount: amountPaid / 1.18,
                platformRevenue: amountPaid / 1.18,
                paymentMethod,
                transactionId
            });
        }

        return enrollment;
    }

    async getEnrollments({ tenantId, userId, userType, status, page = 1, limit = 20 }) {
        const offset = (page - 1) * limit;

        const [enrollments] = await this.db.query(`
            SELECT e.*,
                   c.title as course_title, c.thumbnail_url, c.duration_hours, c.level,
                   c.has_certificate, c.has_exam
            FROM course_enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = $1 AND e.user_type = $2
            ${status ? `AND e.status = '${status}'` : ''}
            ORDER BY e.enrolled_at DESC
            LIMIT $3 OFFSET $4
        `, { bind: [userId, userType, limit, offset] });

        return enrollments;
    }

    // =====================================================
    // PROGRESS TRACKING
    // =====================================================

    async updateLessonProgress({ enrollmentId, lessonId, userId, progress, videoPosition, completed }) {
        const [[existing]] = await this.db.query(`
            SELECT * FROM lesson_progress WHERE enrollment_id = $1 AND lesson_id = $2
        `, { bind: [enrollmentId, lessonId] });

        let lessonProgress;

        if (existing) {
            [[lessonProgress]] = await this.db.query(`
                UPDATE lesson_progress SET
                    progress_percentage = GREATEST(progress_percentage, $3),
                    video_position_seconds = $4,
                    status = CASE WHEN $5 THEN 'completed' ELSE status END,
                    completed_at = CASE WHEN $5 AND completed_at IS NULL THEN NOW() ELSE completed_at END,
                    time_spent_seconds = time_spent_seconds + 30,
                    last_accessed_at = NOW()
                WHERE enrollment_id = $1 AND lesson_id = $2
                RETURNING *
            `, { bind: [enrollmentId, lessonId, progress, videoPosition, completed] });
        } else {
            [[lessonProgress]] = await this.db.query(`
                INSERT INTO lesson_progress (
                    enrollment_id, lesson_id, user_id, status, progress_percentage,
                    video_position_seconds, started_at
                ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
                RETURNING *
            `, {
                bind: [
                    enrollmentId, lessonId, userId,
                    completed ? 'completed' : 'in_progress',
                    progress, videoPosition
                ]
            });
        }

        // Update enrollment progress
        await this.updateEnrollmentProgress(enrollmentId);

        return lessonProgress;
    }

    async updateEnrollmentProgress(enrollmentId) {
        const [[stats]] = await this.db.query(`
            SELECT
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE status = 'completed') as completed,
                SUM(time_spent_seconds) as total_time
            FROM lesson_progress WHERE enrollment_id = $1
        `, { bind: [enrollmentId] });

        const progress = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

        await this.db.query(`
            UPDATE course_enrollments SET
                progress_percentage = $2,
                lessons_completed = $3,
                time_spent_minutes = $4,
                status = CASE WHEN $2 >= 100 THEN 'completed' ELSE 'in_progress' END,
                completed_at = CASE WHEN $2 >= 100 AND completed_at IS NULL THEN NOW() ELSE completed_at END,
                last_accessed_at = NOW()
            WHERE id = $1
        `, {
            bind: [enrollmentId, progress, stats.completed, Math.floor(stats.total_time / 60)]
        });

        // Issue certificate if completed
        if (progress >= 100) {
            const [[enrollment]] = await this.db.query(`
                SELECT * FROM course_enrollments WHERE id = $1
            `, { bind: [enrollmentId] });

            if (enrollment && !enrollment.completion_certificate_id) {
                await this.issueCertificate({
                    tenantId: enrollment.tenant_id,
                    enrollmentId,
                    courseId: enrollment.course_id,
                    userId: enrollment.user_id,
                    userType: enrollment.user_type
                });
            }
        }
    }

    // =====================================================
    // EXAM ENGINE
    // =====================================================

    async startExam({ tenantId, examId, enrollmentId, userId, userType }) {
        // Check exam availability
        const [[exam]] = await this.db.query(`
            SELECT * FROM exams WHERE id = $1 AND is_active = true
        `, { bind: [examId] });

        if (!exam) throw new Error('Exam not found');

        // Check attempt limits
        const [[attemptCount]] = await this.db.query(`
            SELECT COUNT(*) as count FROM exam_attempts
            WHERE exam_id = $1 AND user_id = $2 AND status != 'expired'
        `, { bind: [examId, userId] });

        if (parseInt(attemptCount.count) >= exam.max_attempts) {
            throw new Error('Maximum attempts reached');
        }

        // Check gap between attempts
        const [[lastAttempt]] = await this.db.query(`
            SELECT * FROM exam_attempts
            WHERE exam_id = $1 AND user_id = $2
            ORDER BY created_at DESC LIMIT 1
        `, { bind: [examId, userId] });

        if (lastAttempt && exam.attempt_gap_hours) {
            const gapMs = exam.attempt_gap_hours * 60 * 60 * 1000;
            const timeSince = Date.now() - new Date(lastAttempt.created_at).getTime();
            if (timeSince < gapMs) {
                const hoursLeft = Math.ceil((gapMs - timeSince) / (60 * 60 * 1000));
                throw new Error(`Please wait ${hoursLeft} hours before next attempt`);
            }
        }

        // Get questions
        let questions;
        if (exam.question_selection === 'random') {
            [questions] = await this.db.query(`
                SELECT id, question_type, question_text, question_html, question_image_url,
                       options, marks, time_limit_seconds
                FROM question_bank
                WHERE exam_id = $1 AND is_active = true
                ORDER BY RANDOM()
                LIMIT $2
            `, { bind: [examId, exam.questions_per_attempt || exam.total_questions] });
        } else {
            [questions] = await this.db.query(`
                SELECT id, question_type, question_text, question_html, question_image_url,
                       options, marks, time_limit_seconds
                FROM question_bank
                WHERE exam_id = $1 AND is_active = true
                ORDER BY RANDOM()
            `, { bind: [examId] });
        }

        // Shuffle options if enabled
        if (exam.shuffle_options) {
            questions = questions.map(q => ({
                ...q,
                options: q.options ? this.shuffleArray(q.options) : null
            }));
        }

        // Create attempt
        const [[attempt]] = await this.db.query(`
            INSERT INTO exam_attempts (
                tenant_id, exam_id, enrollment_id, user_id, user_type,
                attempt_number, started_at, total_questions,
                questions_data, status
            ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, $8, 'in_progress')
            RETURNING *
        `, {
            bind: [
                tenantId, examId, enrollmentId, userId, userType,
                parseInt(attemptCount.count) + 1,
                questions.length,
                JSON.stringify(questions.map(q => ({ question_id: q.id })))
            ]
        });

        return {
            attempt,
            exam: {
                id: exam.id,
                title: exam.title,
                duration_minutes: exam.duration_minutes,
                total_questions: questions.length,
                total_marks: exam.total_marks,
                passing_marks: exam.passing_marks,
                show_correct_answers: exam.show_correct_answers,
                prevent_tab_switch: exam.prevent_tab_switch
            },
            questions: questions.map(q => ({
                ...q,
                options: q.options?.map(o => ({ id: o.id, text: o.text, image_url: o.image_url }))
            }))
        };
    }

    async submitExam({ attemptId, responses, timeTaken }) {
        const [[attempt]] = await this.db.query(`
            SELECT a.*, e.* FROM exam_attempts a
            JOIN exams e ON a.exam_id = e.id
            WHERE a.id = $1 AND a.status = 'in_progress'
        `, { bind: [attemptId] });

        if (!attempt) throw new Error('Attempt not found or already submitted');

        // Calculate score
        let totalMarks = 0;
        let obtainedMarks = 0;
        const evaluatedResponses = [];

        for (const response of responses) {
            const [[question]] = await this.db.query(`
                SELECT * FROM question_bank WHERE id = $1
            `, { bind: [response.questionId] });

            if (!question) continue;

            totalMarks += parseFloat(question.marks);

            let isCorrect = false;
            let marksObtained = 0;

            if (question.question_type === 'mcq_single') {
                isCorrect = question.correct_option_ids?.includes(response.selectedOptionIds?.[0]);
            } else if (question.question_type === 'mcq_multiple') {
                const correct = new Set(question.correct_option_ids || []);
                const selected = new Set(response.selectedOptionIds || []);
                isCorrect = correct.size === selected.size &&
                           [...correct].every(id => selected.has(id));
            } else if (question.question_type === 'true_false') {
                isCorrect = response.answerText?.toLowerCase() === question.correct_answer?.toLowerCase();
            }

            if (isCorrect) {
                marksObtained = parseFloat(question.marks);
            } else if (attempt.negative_marking && response.selectedOptionIds?.length > 0) {
                marksObtained = -(parseFloat(question.marks) * (attempt.negative_marks_percentage / 100));
            }

            obtainedMarks += marksObtained;

            // Save response
            await this.db.query(`
                INSERT INTO exam_responses (
                    attempt_id, question_id, selected_option_ids, answer_text,
                    is_correct, marks_obtained, time_spent_seconds, is_marked_for_review
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `, {
                bind: [
                    attemptId, response.questionId, response.selectedOptionIds,
                    response.answerText, isCorrect, marksObtained,
                    response.timeSpent, response.markedForReview
                ]
            });

            evaluatedResponses.push({
                questionId: response.questionId,
                isCorrect,
                marksObtained,
                correctAnswer: attempt.show_correct_answers ? question.correct_option_ids : null
            });
        }

        const percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;
        const isPassed = percentage >= attempt.passing_percentage;

        // Determine grade
        let grade = 'F';
        if (percentage >= 90) grade = 'A+';
        else if (percentage >= 80) grade = 'A';
        else if (percentage >= 70) grade = 'B+';
        else if (percentage >= 60) grade = 'B';
        else if (percentage >= 50) grade = 'C';
        else if (percentage >= 40) grade = 'D';

        // Update attempt
        const [[result]] = await this.db.query(`
            UPDATE exam_attempts SET
                submitted_at = NOW(),
                time_taken_seconds = $2,
                answered_questions = $3,
                status = 'evaluated',
                total_marks = $4,
                obtained_marks = $5,
                percentage = $6,
                is_passed = $7,
                grade = $8,
                evaluated_at = NOW()
            WHERE id = $1
            RETURNING *
        `, {
            bind: [attemptId, timeTaken, responses.length, totalMarks, obtainedMarks, percentage, isPassed, grade]
        });

        // Update enrollment exam status
        if (attempt.enrollment_id && isPassed) {
            await this.db.query(`
                UPDATE course_enrollments SET
                    exam_passed = true,
                    exam_score = $2,
                    exam_attempts = exam_attempts + 1
                WHERE id = $1
            `, { bind: [attempt.enrollment_id, percentage] });
        }

        return {
            result,
            responses: attempt.show_correct_answers ? evaluatedResponses : null,
            summary: {
                totalQuestions: responses.length,
                answered: responses.filter(r => r.selectedOptionIds?.length > 0).length,
                correct: evaluatedResponses.filter(r => r.isCorrect).length,
                totalMarks,
                obtainedMarks: Math.max(0, obtainedMarks),
                percentage: Math.max(0, percentage).toFixed(2),
                grade,
                isPassed
            }
        };
    }

    // =====================================================
    // CERTIFICATE GENERATION
    // =====================================================

    async issueCertificate({ tenantId, enrollmentId, courseId, examAttemptId, certificationId, userId, userType, recipientName }) {
        // Get user name if not provided
        if (!recipientName) {
            const [[user]] = await this.db.query(`
                SELECT name, business_name FROM agents WHERE id = $1
                UNION
                SELECT name, NULL FROM customers WHERE id = $1
            `, { bind: [userId] });
            recipientName = user?.business_name || user?.name || 'Participant';
        }

        // Get course/certification details
        let title, subtitle;
        if (courseId) {
            const [[course]] = await this.db.query(`SELECT title FROM courses WHERE id = $1`, { bind: [courseId] });
            title = `Certificate of Completion`;
            subtitle = course?.title;
        }

        // Generate unique certificate number and verification code
        const certificateNumber = `CERT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
        const verificationCode = crypto.randomBytes(8).toString('hex').toUpperCase();

        // Generate QR code
        const verificationUrl = `https://tripcode.in/verify/${verificationCode}`;
        const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl);

        const [[certificate]] = await this.db.query(`
            INSERT INTO issued_certificates (
                tenant_id, certificate_number, verification_code,
                user_id, user_type, recipient_name,
                course_id, enrollment_id, exam_attempt_id, certification_id,
                title, subtitle, issue_date, qr_code_url, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_DATE, $13, 'active')
            RETURNING *
        `, {
            bind: [
                tenantId, certificateNumber, verificationCode,
                userId, userType, recipientName,
                courseId, enrollmentId, examAttemptId, certificationId,
                title, subtitle, qrCodeDataUrl
            ]
        });

        // Update enrollment with certificate
        if (enrollmentId) {
            await this.db.query(`
                UPDATE course_enrollments SET completion_certificate_id = $2 WHERE id = $1
            `, { bind: [enrollmentId, certificate.id] });
        }

        return certificate;
    }

    async verifyCertificate(verificationCode) {
        const [[certificate]] = await this.db.query(`
            SELECT c.*,
                   course.title as course_title,
                   cert.name as certification_name,
                   cb.name as body_name
            FROM issued_certificates c
            LEFT JOIN courses course ON c.course_id = course.id
            LEFT JOIN certifications_catalog cert ON c.certification_id = cert.id
            LEFT JOIN certification_bodies cb ON cert.body_id = cb.id
            WHERE c.verification_code = $1
        `, { bind: [verificationCode] });

        if (!certificate) {
            return { valid: false, message: 'Certificate not found' };
        }

        // Increment view count
        await this.db.query(`
            UPDATE issued_certificates SET view_count = view_count + 1 WHERE id = $1
        `, { bind: [certificate.id] });

        return {
            valid: certificate.status === 'active',
            certificate: {
                certificateNumber: certificate.certificate_number,
                recipientName: certificate.recipient_name,
                title: certificate.title,
                subtitle: certificate.subtitle,
                courseName: certificate.course_title,
                certificationName: certificate.certification_name,
                issuingBody: certificate.body_name,
                issueDate: certificate.issue_date,
                validUntil: certificate.valid_until,
                status: certificate.status
            }
        };
    }

    // =====================================================
    // MEMBERSHIP APPLICATIONS
    // =====================================================

    async submitMembershipApplication(data) {
        const applicationNumber = `MEM-${Date.now().toString(36).toUpperCase()}`;

        const [[application]] = await this.db.query(`
            INSERT INTO membership_applications (
                tenant_id, body_id, certification_id, user_id, user_type,
                application_number, membership_type, applicant_name, business_name,
                email, phone, address, city, state, pincode,
                business_type, gst_number, pan_number, year_established,
                annual_turnover, employee_count, documents,
                application_fee, membership_fee, total_fee, our_commission,
                status, submitted_at
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
                $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, 'submitted', NOW()
            ) RETURNING *
        `, {
            bind: [
                data.tenantId, data.bodyId, data.certificationId, data.userId, data.userType,
                applicationNumber, data.membershipType, data.applicantName, data.businessName,
                data.email, data.phone, data.address, data.city, data.state, data.pincode,
                data.businessType, data.gstNumber, data.panNumber, data.yearEstablished,
                data.annualTurnover, data.employeeCount, JSON.stringify(data.documents || []),
                data.applicationFee, data.membershipFee, data.totalFee, data.ourCommission
            ]
        });

        return application;
    }

    // =====================================================
    // REVENUE TRACKING
    // =====================================================

    async trackRevenue(data) {
        await this.db.query(`
            INSERT INTO certification_revenue (
                tenant_id, source_type, source_id, course_id, enrollment_id,
                exam_attempt_id, membership_id, certification_id, body_id,
                user_id, user_type, gross_amount, discount_amount, gst_amount,
                net_amount, partner_share, platform_revenue,
                payment_status, payment_method, transaction_id, payment_date, description
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
                $15, $16, $17, $18, $19, $20, NOW(), $21
            )
        `, {
            bind: [
                data.tenantId, data.sourceType, data.sourceId, data.courseId,
                data.enrollmentId, data.examAttemptId, data.membershipId,
                data.certificationId, data.bodyId, data.userId, data.userType,
                data.grossAmount, data.discountAmount || 0, data.gstAmount || 0,
                data.netAmount, data.partnerShare || 0, data.platformRevenue,
                data.paymentStatus || 'paid', data.paymentMethod, data.transactionId,
                data.description
            ]
        });
    }

    async getRevenueStats({ tenantId, startDate, endDate, groupBy = 'day' }) {
        const [stats] = await this.db.query(`
            SELECT
                DATE_TRUNC($3, created_at) as period,
                source_type,
                COUNT(*) as transactions,
                SUM(gross_amount) as gross_revenue,
                SUM(platform_revenue) as net_revenue,
                SUM(partner_share) as partner_payouts
            FROM certification_revenue
            WHERE tenant_id = $1
            AND created_at BETWEEN $2 AND $4
            GROUP BY DATE_TRUNC($3, created_at), source_type
            ORDER BY period DESC
        `, { bind: [tenantId, startDate, groupBy, endDate] });

        return stats;
    }

    // =====================================================
    // HELPER METHODS
    // =====================================================

    generateSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') +
            '-' + Date.now().toString(36);
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

module.exports = LMSService;
