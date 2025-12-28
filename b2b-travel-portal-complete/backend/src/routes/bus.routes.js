/**
 * Bus Routes
 * Complete bus search and booking
 */

const express = require('express');
const router = express.Router();
const busController = require('../controllers/bus.controller');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const { validate, busSchemas } = require('../middleware/validation.middleware');

// Public routes
router.get('/cities', busController.getCities);
router.get('/operators', busController.getOperators);

// Search
router.post('/search', optionalAuth, validate(busSchemas.search), busController.search);

// Protected routes
router.use(authenticate);

// Seat layout and booking
router.post('/seat-layout', validate(busSchemas.seatLayout), busController.getSeatLayout);
router.post('/boarding-points', busController.getBoardingPoints);

// Booking
router.post('/book', validate(busSchemas.booking), busController.createBooking);
router.post('/book/:bookingId/confirm', busController.confirmBooking);

// Ticket operations
router.get('/ticket/:bookingId', busController.getTicket);
router.post('/cancel/:bookingId', busController.cancelBooking);
router.get('/cancellation-policy/:bookingId', busController.getCancellationPolicy);

module.exports = router;
