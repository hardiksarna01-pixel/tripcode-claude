/**
 * Group Booking Routes
 * Complete group booking management
 */

const express = require('express');
const router = express.Router();
const groupBookingController = require('../controllers/group-booking.controller');
const { authenticate, authenticateAdmin } = require('../middleware/auth.middleware');

// ============================================
// CUSTOMER/AGENT GROUP BOOKING
// ============================================
router.use(authenticate);

// Create group booking inquiry
router.post('/inquiry', groupBookingController.createInquiry);

// Get my group inquiries
router.get('/my-inquiries', groupBookingController.getMyInquiries);

// Get inquiry details
router.get('/inquiry/:inquiryId', groupBookingController.getInquiryDetails);

// Update inquiry
router.put('/inquiry/:inquiryId', groupBookingController.updateInquiry);

// Upload passenger list (Excel/CSV)
router.post('/inquiry/:inquiryId/passengers', groupBookingController.uploadPassengerList);

// Get quote for group
router.get('/inquiry/:inquiryId/quote', groupBookingController.getQuote);

// Accept quote and confirm
router.post('/inquiry/:inquiryId/accept', groupBookingController.acceptQuote);

// Get group booking details
router.get('/:bookingId', groupBookingController.getGroupBookingDetails);

// Download passenger manifest
router.get('/:bookingId/manifest', groupBookingController.downloadManifest);

// ============================================
// ADMIN GROUP BOOKING MANAGEMENT
// ============================================
router.use('/admin', authenticateAdmin);

// List all group inquiries
router.get('/admin/inquiries', groupBookingController.listAllInquiries);

// Get pending inquiries
router.get('/admin/inquiries/pending', groupBookingController.getPendingInquiries);

// Assign inquiry to team member
router.post('/admin/inquiry/:inquiryId/assign', groupBookingController.assignInquiry);

// Create/update quote for group
router.post('/admin/inquiry/:inquiryId/quote', groupBookingController.createQuote);

// Approve group booking
router.post('/admin/inquiry/:inquiryId/approve', groupBookingController.approveBooking);

// Process group payment
router.post('/admin/:bookingId/payment', groupBookingController.processPayment);

// Issue group tickets
router.post('/admin/:bookingId/issue-tickets', groupBookingController.issueTickets);

module.exports = router;
