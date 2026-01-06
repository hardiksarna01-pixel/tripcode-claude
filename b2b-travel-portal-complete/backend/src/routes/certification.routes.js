/**
 * Certification & LMS Routes
 * All routes for certification portal, courses, exams, and memberships
 */

const express = require('express');
const router = express.Router();
const certificationController = require('../controllers/certification.controller');
const { authMiddleware, adminAuthMiddleware } = require('../middleware/auth.middleware');

// =====================================================
// PUBLIC ROUTES
// =====================================================

// Certification Bodies & Catalog
router.get('/bodies', certificationController.getCertificationBodies);
router.get('/catalog', certificationController.getCertificationsCatalog);
router.get('/catalog/:id', certificationController.getCertificationDetails);

// Course Catalog (Public)
router.get('/courses', certificationController.getCourses);
router.get('/courses/:id', certificationController.getCourseDetails);

// Certificate Verification (Public)
router.get('/verify/:code', certificationController.verifyCertificate);

// =====================================================
// AGENT/USER ROUTES (Authenticated)
// =====================================================

// My Enrollments
router.get('/my/enrollments', authMiddleware, certificationController.getMyEnrollments);
router.get('/my/enrollments/:enrollmentId', authMiddleware, certificationController.getEnrollmentDetails);

// Enroll in Course
router.post('/courses/:courseId/enroll', authMiddleware, certificationController.enrollInCourse);

// Lesson Access & Progress
router.get('/enrollments/:enrollmentId/lessons/:lessonId', authMiddleware, certificationController.getLessonContent);
router.post('/enrollments/:enrollmentId/lessons/:lessonId/progress', authMiddleware, certificationController.updateLessonProgress);

// Exams
router.get('/enrollments/:enrollmentId/exams', authMiddleware, certificationController.getAvailableExams);
router.post('/enrollments/:enrollmentId/exams/:examId/start', authMiddleware, certificationController.startExam);
router.post('/exams/attempts/:attemptId/submit', authMiddleware, certificationController.submitExam);
router.get('/exams/attempts/:attemptId/result', authMiddleware, certificationController.getExamResult);

// Certificates
router.get('/my/certificates', authMiddleware, certificationController.getMyCertificates);
router.get('/my/certificates/:id', authMiddleware, certificationController.getCertificateDetails);

// Membership Applications
router.get('/my/memberships', authMiddleware, certificationController.getMyMembershipApplications);
router.post('/memberships/apply', authMiddleware, certificationController.submitMembershipApplication);
router.get('/my/memberships/:id', authMiddleware, certificationController.getMembershipApplicationDetails);

// =====================================================
// ADMIN ROUTES
// =====================================================

// Course Management
router.get('/admin/courses', adminAuthMiddleware, certificationController.adminListCourses);
router.post('/admin/courses', adminAuthMiddleware, certificationController.createCourse);
router.put('/admin/courses/:id', adminAuthMiddleware, certificationController.updateCourse);
router.post('/admin/courses/:courseId/modules', adminAuthMiddleware, certificationController.addCourseModule);
router.post('/admin/courses/:courseId/modules/:moduleId/lessons', adminAuthMiddleware, certificationController.addCourseLesson);

// Enrollment Management
router.get('/admin/enrollments', adminAuthMiddleware, certificationController.adminGetEnrollments);

// Revenue
router.get('/admin/revenue', adminAuthMiddleware, certificationController.adminGetRevenue);

// Membership Applications
router.get('/admin/memberships', adminAuthMiddleware, certificationController.adminListMembershipApplications);
router.put('/admin/memberships/:id', adminAuthMiddleware, certificationController.adminUpdateMembershipApplication);

// Question Bank
router.get('/admin/questions', adminAuthMiddleware, certificationController.adminListQuestions);
router.post('/admin/questions', adminAuthMiddleware, certificationController.adminCreateQuestion);

module.exports = router;
