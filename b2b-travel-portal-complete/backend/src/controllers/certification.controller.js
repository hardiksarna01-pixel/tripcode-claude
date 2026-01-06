/**
 * Certification & LMS Controller
 * Handles all certification, course, exam, and membership endpoints
 */

const LMSService = require('../services/lms.service');

class CertificationController {
    constructor() {
        this.lmsService = null; // Initialized with DB in routes
    }

    // =====================================================
    // CERTIFICATION BODIES & CATALOG
    // =====================================================

    async getCertificationBodies(req, res) {
        try {
            const { type, category, partnershipStatus } = req.query;
            const tenantId = req.tenantId;

            let query = `
                SELECT cb.*,
                       (SELECT COUNT(*) FROM certifications_catalog WHERE body_id = cb.id) as certifications_count
                FROM certification_bodies cb
                WHERE cb.is_active = true
            `;

            if (type) query += ` AND cb.type = '${type}'`;
            if (category) query += ` AND cb.category = '${category}'`;
            if (partnershipStatus) query += ` AND cb.partnership_status = '${partnershipStatus}'`;

            query += ` ORDER BY cb.category, cb.name`;

            const [bodies] = await req.db.query(query);

            // Group by category
            const grouped = bodies.reduce((acc, body) => {
                const cat = body.category || 'other';
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(body);
                return acc;
            }, {});

            res.json({
                success: true,
                data: { bodies, grouped }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getCertificationsCatalog(req, res) {
        try {
            const { bodyId, type, category, level, popular } = req.query;

            let query = `
                SELECT c.*,
                       cb.name as body_name, cb.code as body_code, cb.logo_url as body_logo,
                       cb.type as body_type
                FROM certifications_catalog c
                JOIN certification_bodies cb ON c.body_id = cb.id
                WHERE c.is_active = true
            `;

            if (bodyId) query += ` AND c.body_id = '${bodyId}'`;
            if (type) query += ` AND c.type = '${type}'`;
            if (category) query += ` AND c.category = '${category}'`;
            if (level) query += ` AND c.level = '${level}'`;
            if (popular === 'true') query += ` AND c.is_popular = true`;

            query += ` ORDER BY c.is_popular DESC, c.display_order, c.name`;

            const [certifications] = await req.db.query(query);

            res.json({
                success: true,
                data: certifications
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getCertificationDetails(req, res) {
        try {
            const { id } = req.params;

            const [[certification]] = await req.db.query(`
                SELECT c.*,
                       cb.name as body_name, cb.code as body_code, cb.logo_url as body_logo,
                       cb.website as body_website, cb.description as body_description
                FROM certifications_catalog c
                JOIN certification_bodies cb ON c.body_id = cb.id
                WHERE c.id = $1
            `, { bind: [id] });

            if (!certification) {
                return res.status(404).json({ success: false, message: 'Certification not found' });
            }

            // Get preparation course if available
            let preparationCourse = null;
            if (certification.preparation_course_id) {
                [[preparationCourse]] = await req.db.query(`
                    SELECT id, title, selling_price, duration_hours, level
                    FROM courses WHERE id = $1
                `, { bind: [certification.preparation_course_id] });
            }

            res.json({
                success: true,
                data: { ...certification, preparationCourse }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // =====================================================
    // COURSES
    // =====================================================

    async getCourses(req, res) {
        try {
            const { categoryId, certificationId, level, status, search, page, limit } = req.query;
            const tenantId = req.tenantId;

            const lms = new LMSService(req.db);
            const result = await lms.getCourses({
                tenantId,
                categoryId,
                certificationId,
                level,
                status: status || 'published',
                search,
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 20
            });

            res.json({ success: true, data: result });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getCourseDetails(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            const lms = new LMSService(req.db);
            const course = await lms.getCourseById(id, userId);

            if (!course) {
                return res.status(404).json({ success: false, message: 'Course not found' });
            }

            res.json({ success: true, data: course });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async createCourse(req, res) {
        try {
            const tenantId = req.tenantId;
            const createdBy = req.user.id;

            const lms = new LMSService(req.db);
            const course = await lms.createCourse({
                ...req.body,
                tenantId,
                createdBy
            });

            res.status(201).json({ success: true, data: course });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async updateCourse(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;

            const fields = Object.keys(updates)
                .map((key, i) => `${this.toSnakeCase(key)} = $${i + 2}`)
                .join(', ');

            const [[course]] = await req.db.query(`
                UPDATE courses SET ${fields}, updated_at = NOW()
                WHERE id = $1 RETURNING *
            `, { bind: [id, ...Object.values(updates)] });

            res.json({ success: true, data: course });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async addCourseModule(req, res) {
        try {
            const { courseId } = req.params;
            const { title, description, displayOrder } = req.body;

            const [[module]] = await req.db.query(`
                INSERT INTO course_modules (course_id, title, description, display_order)
                VALUES ($1, $2, $3, $4) RETURNING *
            `, { bind: [courseId, title, description, displayOrder] });

            res.status(201).json({ success: true, data: module });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async addCourseLesson(req, res) {
        try {
            const { courseId, moduleId } = req.params;
            const data = req.body;

            const [[lesson]] = await req.db.query(`
                INSERT INTO course_lessons (
                    course_id, module_id, title, description, content_type,
                    video_url, video_duration_seconds, video_provider,
                    document_url, html_content, resources,
                    duration_minutes, display_order, is_preview, is_mandatory
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
                RETURNING *
            `, {
                bind: [
                    courseId, moduleId, data.title, data.description, data.contentType,
                    data.videoUrl, data.videoDuration, data.videoProvider,
                    data.documentUrl, data.htmlContent, JSON.stringify(data.resources || []),
                    data.durationMinutes, data.displayOrder, data.isPreview || false, data.isMandatory !== false
                ]
            });

            res.status(201).json({ success: true, data: lesson });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // =====================================================
    // ENROLLMENTS
    // =====================================================

    async enrollInCourse(req, res) {
        try {
            const { courseId } = req.params;
            const userId = req.user.id;
            const userType = req.user.type;
            const tenantId = req.tenantId;
            const { paymentMethod, transactionId, amountPaid } = req.body;

            const lms = new LMSService(req.db);
            const enrollment = await lms.enrollUser({
                tenantId,
                courseId,
                userId,
                userType,
                amountPaid,
                paymentMethod,
                transactionId
            });

            res.status(201).json({ success: true, data: enrollment });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getMyEnrollments(req, res) {
        try {
            const userId = req.user.id;
            const userType = req.user.type;
            const tenantId = req.tenantId;
            const { status, page, limit } = req.query;

            const lms = new LMSService(req.db);
            const enrollments = await lms.getEnrollments({
                tenantId,
                userId,
                userType,
                status,
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 20
            });

            res.json({ success: true, data: enrollments });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getEnrollmentDetails(req, res) {
        try {
            const { enrollmentId } = req.params;
            const userId = req.user.id;

            const [[enrollment]] = await req.db.query(`
                SELECT e.*,
                       c.title, c.thumbnail_url, c.duration_hours, c.has_exam,
                       c.passing_percentage, c.max_exam_attempts
                FROM course_enrollments e
                JOIN courses c ON e.course_id = c.id
                WHERE e.id = $1 AND e.user_id = $2
            `, { bind: [enrollmentId, userId] });

            if (!enrollment) {
                return res.status(404).json({ success: false, message: 'Enrollment not found' });
            }

            // Get lesson progress
            const [progress] = await req.db.query(`
                SELECT lp.*, cl.title as lesson_title, cl.content_type
                FROM lesson_progress lp
                JOIN course_lessons cl ON lp.lesson_id = cl.id
                WHERE lp.enrollment_id = $1
                ORDER BY cl.display_order
            `, { bind: [enrollmentId] });

            res.json({
                success: true,
                data: { ...enrollment, lessonProgress: progress }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // =====================================================
    // LESSON PROGRESS
    // =====================================================

    async getLessonContent(req, res) {
        try {
            const { enrollmentId, lessonId } = req.params;
            const userId = req.user.id;

            // Verify enrollment
            const [[enrollment]] = await req.db.query(`
                SELECT * FROM course_enrollments WHERE id = $1 AND user_id = $2
            `, { bind: [enrollmentId, userId] });

            if (!enrollment) {
                return res.status(403).json({ success: false, message: 'Not enrolled' });
            }

            // Get lesson with full content
            const [[lesson]] = await req.db.query(`
                SELECT * FROM course_lessons WHERE id = $1
            `, { bind: [lessonId] });

            if (!lesson) {
                return res.status(404).json({ success: false, message: 'Lesson not found' });
            }

            // Get progress
            const [[progress]] = await req.db.query(`
                SELECT * FROM lesson_progress WHERE enrollment_id = $1 AND lesson_id = $2
            `, { bind: [enrollmentId, lessonId] });

            // Update last accessed
            await req.db.query(`
                UPDATE course_enrollments SET last_lesson_id = $2, last_accessed_at = NOW()
                WHERE id = $1
            `, { bind: [enrollmentId, lessonId] });

            res.json({
                success: true,
                data: { lesson, progress }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async updateLessonProgress(req, res) {
        try {
            const { enrollmentId, lessonId } = req.params;
            const userId = req.user.id;
            const { progress, videoPosition, completed } = req.body;

            const lms = new LMSService(req.db);
            const lessonProgress = await lms.updateLessonProgress({
                enrollmentId,
                lessonId,
                userId,
                progress,
                videoPosition,
                completed
            });

            res.json({ success: true, data: lessonProgress });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // =====================================================
    // EXAMS
    // =====================================================

    async getAvailableExams(req, res) {
        try {
            const { enrollmentId } = req.params;
            const userId = req.user.id;

            // Get enrollment
            const [[enrollment]] = await req.db.query(`
                SELECT * FROM course_enrollments WHERE id = $1 AND user_id = $2
            `, { bind: [enrollmentId, userId] });

            if (!enrollment) {
                return res.status(403).json({ success: false, message: 'Not enrolled' });
            }

            // Get exams for this course
            const [exams] = await req.db.query(`
                SELECT e.*,
                       (SELECT COUNT(*) FROM exam_attempts WHERE exam_id = e.id AND user_id = $2) as attempts_used
                FROM exams e
                WHERE e.course_id = $1 AND e.status = 'published' AND e.is_active = true
            `, { bind: [enrollment.course_id, userId] });

            res.json({ success: true, data: exams });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async startExam(req, res) {
        try {
            const { enrollmentId, examId } = req.params;
            const userId = req.user.id;
            const userType = req.user.type;
            const tenantId = req.tenantId;

            const lms = new LMSService(req.db);
            const result = await lms.startExam({
                tenantId,
                examId,
                enrollmentId,
                userId,
                userType
            });

            res.json({ success: true, data: result });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async submitExam(req, res) {
        try {
            const { attemptId } = req.params;
            const { responses, timeTaken } = req.body;

            const lms = new LMSService(req.db);
            const result = await lms.submitExam({
                attemptId,
                responses,
                timeTaken
            });

            res.json({ success: true, data: result });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getExamResult(req, res) {
        try {
            const { attemptId } = req.params;
            const userId = req.user.id;

            const [[attempt]] = await req.db.query(`
                SELECT a.*, e.title as exam_title, e.show_correct_answers
                FROM exam_attempts a
                JOIN exams e ON a.exam_id = e.id
                WHERE a.id = $1 AND a.user_id = $2
            `, { bind: [attemptId, userId] });

            if (!attempt) {
                return res.status(404).json({ success: false, message: 'Attempt not found' });
            }

            // Get responses if allowed
            let responses = [];
            if (attempt.show_correct_answers) {
                [responses] = await req.db.query(`
                    SELECT r.*, q.question_text, q.options, q.correct_option_ids, q.explanation
                    FROM exam_responses r
                    JOIN question_bank q ON r.question_id = q.id
                    WHERE r.attempt_id = $1
                `, { bind: [attemptId] });
            }

            res.json({
                success: true,
                data: { attempt, responses }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // =====================================================
    // CERTIFICATES
    // =====================================================

    async getMyCertificates(req, res) {
        try {
            const userId = req.user.id;

            const [certificates] = await req.db.query(`
                SELECT c.*,
                       course.title as course_title,
                       cert.name as certification_name,
                       cb.name as body_name
                FROM issued_certificates c
                LEFT JOIN courses course ON c.course_id = course.id
                LEFT JOIN certifications_catalog cert ON c.certification_id = cert.id
                LEFT JOIN certification_bodies cb ON cert.body_id = cb.id
                WHERE c.user_id = $1
                ORDER BY c.issue_date DESC
            `, { bind: [userId] });

            res.json({ success: true, data: certificates });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getCertificateDetails(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const [[certificate]] = await req.db.query(`
                SELECT c.*,
                       course.title as course_title,
                       cert.name as certification_name,
                       cb.name as body_name, cb.logo_url as body_logo
                FROM issued_certificates c
                LEFT JOIN courses course ON c.course_id = course.id
                LEFT JOIN certifications_catalog cert ON c.certification_id = cert.id
                LEFT JOIN certification_bodies cb ON cert.body_id = cb.id
                WHERE c.id = $1 AND c.user_id = $2
            `, { bind: [id, userId] });

            if (!certificate) {
                return res.status(404).json({ success: false, message: 'Certificate not found' });
            }

            res.json({ success: true, data: certificate });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async verifyCertificate(req, res) {
        try {
            const { code } = req.params;

            const lms = new LMSService(req.db);
            const result = await lms.verifyCertificate(code);

            res.json({ success: true, data: result });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // =====================================================
    // MEMBERSHIP APPLICATIONS
    // =====================================================

    async getMyMembershipApplications(req, res) {
        try {
            const userId = req.user.id;

            const [applications] = await req.db.query(`
                SELECT m.*,
                       cb.name as body_name, cb.code as body_code, cb.logo_url as body_logo,
                       c.name as certification_name
                FROM membership_applications m
                JOIN certification_bodies cb ON m.body_id = cb.id
                LEFT JOIN certifications_catalog c ON m.certification_id = c.id
                WHERE m.user_id = $1
                ORDER BY m.created_at DESC
            `, { bind: [userId] });

            res.json({ success: true, data: applications });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async submitMembershipApplication(req, res) {
        try {
            const userId = req.user.id;
            const userType = req.user.type;
            const tenantId = req.tenantId;

            const lms = new LMSService(req.db);
            const application = await lms.submitMembershipApplication({
                ...req.body,
                tenantId,
                userId,
                userType
            });

            res.status(201).json({ success: true, data: application });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getMembershipApplicationDetails(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const [[application]] = await req.db.query(`
                SELECT m.*,
                       cb.name as body_name, cb.website as body_website,
                       c.name as certification_name, c.documents_required
                FROM membership_applications m
                JOIN certification_bodies cb ON m.body_id = cb.id
                LEFT JOIN certifications_catalog c ON m.certification_id = c.id
                WHERE m.id = $1 AND m.user_id = $2
            `, { bind: [id, userId] });

            if (!application) {
                return res.status(404).json({ success: false, message: 'Application not found' });
            }

            res.json({ success: true, data: application });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // =====================================================
    // ADMIN - COURSE MANAGEMENT
    // =====================================================

    async adminListCourses(req, res) {
        try {
            const tenantId = req.tenantId;
            const { status, page, limit } = req.query;

            const offset = ((parseInt(page) || 1) - 1) * (parseInt(limit) || 20);

            const [courses] = await req.db.query(`
                SELECT c.*,
                       (SELECT COUNT(*) FROM course_enrollments WHERE course_id = c.id) as enrollments,
                       (SELECT SUM(amount_paid) FROM course_enrollments WHERE course_id = c.id AND payment_status = 'paid') as revenue
                FROM courses c
                WHERE c.tenant_id = $1
                ${status ? `AND c.status = '${status}'` : ''}
                ORDER BY c.created_at DESC
                LIMIT $2 OFFSET $3
            `, { bind: [tenantId, parseInt(limit) || 20, offset] });

            res.json({ success: true, data: courses });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async adminGetEnrollments(req, res) {
        try {
            const tenantId = req.tenantId;
            const { courseId, status, page, limit } = req.query;

            const offset = ((parseInt(page) || 1) - 1) * (parseInt(limit) || 20);

            const [enrollments] = await req.db.query(`
                SELECT e.*,
                       c.title as course_title,
                       a.name as agent_name, a.email as agent_email
                FROM course_enrollments e
                JOIN courses c ON e.course_id = c.id
                LEFT JOIN agents a ON e.user_id = a.id AND e.user_type = 'agent'
                WHERE e.tenant_id = $1
                ${courseId ? `AND e.course_id = '${courseId}'` : ''}
                ${status ? `AND e.status = '${status}'` : ''}
                ORDER BY e.enrolled_at DESC
                LIMIT $2 OFFSET $3
            `, { bind: [tenantId, parseInt(limit) || 20, offset] });

            res.json({ success: true, data: enrollments });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async adminGetRevenue(req, res) {
        try {
            const tenantId = req.tenantId;
            const { startDate, endDate, groupBy } = req.query;

            const lms = new LMSService(req.db);
            const stats = await lms.getRevenueStats({
                tenantId,
                startDate: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                endDate: endDate || new Date(),
                groupBy: groupBy || 'day'
            });

            // Summary stats
            const [[summary]] = await req.db.query(`
                SELECT
                    SUM(gross_amount) as total_gross,
                    SUM(platform_revenue) as total_net,
                    SUM(partner_share) as total_partner_payouts,
                    COUNT(*) as total_transactions,
                    COUNT(DISTINCT user_id) as unique_users
                FROM certification_revenue
                WHERE tenant_id = $1
                AND created_at >= $2 AND created_at <= $3
            `, { bind: [tenantId, startDate || '1970-01-01', endDate || new Date()] });

            res.json({
                success: true,
                data: { stats, summary }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // =====================================================
    // ADMIN - MEMBERSHIP MANAGEMENT
    // =====================================================

    async adminListMembershipApplications(req, res) {
        try {
            const tenantId = req.tenantId;
            const { status, bodyId, page, limit } = req.query;

            const offset = ((parseInt(page) || 1) - 1) * (parseInt(limit) || 20);

            const [applications] = await req.db.query(`
                SELECT m.*,
                       cb.name as body_name, cb.code as body_code,
                       c.name as certification_name
                FROM membership_applications m
                JOIN certification_bodies cb ON m.body_id = cb.id
                LEFT JOIN certifications_catalog c ON m.certification_id = c.id
                WHERE m.tenant_id = $1
                ${status ? `AND m.status = '${status}'` : ''}
                ${bodyId ? `AND m.body_id = '${bodyId}'` : ''}
                ORDER BY m.created_at DESC
                LIMIT $2 OFFSET $3
            `, { bind: [tenantId, parseInt(limit) || 20, offset] });

            res.json({ success: true, data: applications });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async adminUpdateMembershipApplication(req, res) {
        try {
            const { id } = req.params;
            const { status, membershipNumber, validFrom, validUntil, adminNotes, rejectionReason } = req.body;

            const [[application]] = await req.db.query(`
                UPDATE membership_applications SET
                    status = COALESCE($2, status),
                    membership_number = COALESCE($3, membership_number),
                    membership_valid_from = COALESCE($4, membership_valid_from),
                    membership_valid_until = COALESCE($5, membership_valid_until),
                    admin_notes = COALESCE($6, admin_notes),
                    rejection_reason = COALESCE($7, rejection_reason),
                    processed_at = CASE WHEN $2 IN ('approved', 'rejected') THEN NOW() ELSE processed_at END,
                    processed_by = $8,
                    updated_at = NOW()
                WHERE id = $1 RETURNING *
            `, {
                bind: [id, status, membershipNumber, validFrom, validUntil, adminNotes, rejectionReason, req.user.id]
            });

            res.json({ success: true, data: application });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // =====================================================
    // ADMIN - QUESTION BANK
    // =====================================================

    async adminCreateQuestion(req, res) {
        try {
            const tenantId = req.tenantId;
            const data = req.body;

            const [[question]] = await req.db.query(`
                INSERT INTO question_bank (
                    tenant_id, course_id, exam_id, section_id, question_type, difficulty,
                    question_text, question_html, question_image_url, options,
                    correct_option_ids, correct_answer, explanation, marks, tags, topic, created_by
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
                RETURNING *
            `, {
                bind: [
                    tenantId, data.courseId, data.examId, data.sectionId, data.questionType,
                    data.difficulty || 'medium', data.questionText, data.questionHtml,
                    data.questionImageUrl, JSON.stringify(data.options), data.correctOptionIds,
                    data.correctAnswer, data.explanation, data.marks || 1, data.tags, data.topic, req.user.id
                ]
            });

            res.status(201).json({ success: true, data: question });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async adminListQuestions(req, res) {
        try {
            const tenantId = req.tenantId;
            const { courseId, examId, difficulty, topic, page, limit } = req.query;

            const offset = ((parseInt(page) || 1) - 1) * (parseInt(limit) || 50);

            const [questions] = await req.db.query(`
                SELECT q.*, c.title as course_title, e.title as exam_title
                FROM question_bank q
                LEFT JOIN courses c ON q.course_id = c.id
                LEFT JOIN exams e ON q.exam_id = e.id
                WHERE q.tenant_id = $1 AND q.is_active = true
                ${courseId ? `AND q.course_id = '${courseId}'` : ''}
                ${examId ? `AND q.exam_id = '${examId}'` : ''}
                ${difficulty ? `AND q.difficulty = '${difficulty}'` : ''}
                ${topic ? `AND q.topic ILIKE '%${topic}%'` : ''}
                ORDER BY q.created_at DESC
                LIMIT $2 OFFSET $3
            `, { bind: [tenantId, parseInt(limit) || 50, offset] });

            res.json({ success: true, data: questions });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // =====================================================
    // HELPER METHODS
    // =====================================================

    toSnakeCase(str) {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    }
}

module.exports = new CertificationController();
