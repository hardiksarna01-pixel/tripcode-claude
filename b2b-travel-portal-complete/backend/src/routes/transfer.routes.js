/**
 * Airport Transfer Routes
 */

const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transfer.controller');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');

// Public routes
router.get('/locations', transferController.getLocations);
router.get('/vehicle-types', transferController.getVehicleTypes);
router.post('/search', optionalAuth, transferController.search);
router.post('/quote', optionalAuth, transferController.getQuote);

// Protected routes
router.use(authenticate);

// Booking
router.post('/book', transferController.createBooking);
router.post('/book/:bookingId/confirm', transferController.confirmBooking);
router.get('/booking/:bookingId', transferController.getBookingDetails);
router.get('/voucher/:bookingId', transferController.getVoucher);
router.post('/cancel/:bookingId', transferController.cancelBooking);

// Driver tracking (if available)
router.get('/track/:bookingId', transferController.trackDriver);

module.exports = router;
