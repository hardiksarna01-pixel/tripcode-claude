/**
 * Booking History Routes
 */

const express = require('express');
const router = express.Router();
const bookingHistoryController = require('../controllers/booking-history.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

// Get booking history
router.get('/', bookingHistoryController.getHistory);

// Get booking details
router.get('/:bookingId', bookingHistoryController.getBookingDetails);

// Get booking timeline
router.get('/:bookingId/timeline', bookingHistoryController.getTimeline);

// Download invoice
router.get('/:bookingId/invoice', bookingHistoryController.downloadInvoice);

module.exports = router;
