/**
 * Booking Routes
 * Unified booking management across all products
 */

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate, bookingSchemas, paginationSchema } = require('../middleware/validation.middleware');

router.use(authenticate);

// List bookings with filters
router.get('/', validate(paginationSchema, 'query'), bookingController.listBookings);

// Booking details
router.get('/:bookingId', bookingController.getBookingDetails);

// Booking actions
router.post('/:bookingId/cancel', validate(bookingSchemas.cancel), bookingController.cancelBooking);
router.post('/:bookingId/refund', bookingController.initiateRefund);
router.get('/:bookingId/refund-status', bookingController.getRefundStatus);

// Amendment
router.post('/:bookingId/amend', bookingController.requestAmendment);
router.get('/:bookingId/amendment-charges', bookingController.getAmendmentCharges);

// Documents
router.get('/:bookingId/invoice', bookingController.getInvoice);
router.get('/:bookingId/voucher', bookingController.getVoucher);
router.get('/:bookingId/ticket', bookingController.getTicket);
router.post('/:bookingId/resend-confirmation', bookingController.resendConfirmation);

// Passenger management
router.put('/:bookingId/passengers/:passengerId', validate(bookingSchemas.amendPassenger), bookingController.updatePassenger);

module.exports = router;
