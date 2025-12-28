/**
 * Amendment & Cancellation Routes
 * Complete booking changes management
 */

const express = require('express');
const router = express.Router();
const amendmentController = require('../controllers/amendment.controller');
const { authenticate, authenticateAdmin } = require('../middleware/auth.middleware');

// ============================================
// CUSTOMER/AGENT AMENDMENTS
// ============================================
router.use(authenticate);

// Get amendment options for a booking
router.get('/:bookingId/options', amendmentController.getAmendmentOptions);

// Get cancellation charges
router.get('/:bookingId/cancellation-charges', amendmentController.getCancellationCharges);

// Get date change charges
router.get('/:bookingId/date-change-charges', amendmentController.getDateChangeCharges);

// Get name change options
router.get('/:bookingId/name-change-options', amendmentController.getNameChangeOptions);

// Request date change
router.post('/:bookingId/date-change', amendmentController.requestDateChange);

// Request name change
router.post('/:bookingId/name-change', amendmentController.requestNameChange);

// Request sector change
router.post('/:bookingId/sector-change', amendmentController.requestSectorChange);

// Request upgrade
router.post('/:bookingId/upgrade', amendmentController.requestUpgrade);

// Add extra baggage
router.post('/:bookingId/add-baggage', amendmentController.addBaggage);

// Add meals
router.post('/:bookingId/add-meals', amendmentController.addMeals);

// Add seats
router.post('/:bookingId/add-seats', amendmentController.addSeats);

// Request cancellation
router.post('/:bookingId/cancel', amendmentController.requestCancellation);

// Get amendment history
router.get('/:bookingId/history', amendmentController.getAmendmentHistory);

// ============================================
// ADMIN AMENDMENT MANAGEMENT
// ============================================
router.use('/admin', authenticateAdmin);

// List all pending amendments
router.get('/admin/pending', amendmentController.listPendingAmendments);

// Get amendment request details
router.get('/admin/:requestId', amendmentController.getAmendmentRequest);

// Process amendment
router.post('/admin/:requestId/process', amendmentController.processAmendment);

// Approve amendment
router.post('/admin/:requestId/approve', amendmentController.approveAmendment);

// Reject amendment
router.post('/admin/:requestId/reject', amendmentController.rejectAmendment);

// Process refund
router.post('/admin/:requestId/refund', amendmentController.processRefund);

// Bulk process amendments
router.post('/admin/bulk-process', amendmentController.bulkProcessAmendments);

module.exports = router;
