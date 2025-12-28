/**
 * Flight Routes
 * Complete flight search, booking, and management
 */

const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flight.controller');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const { validate, flightSchemas } = require('../middleware/validation.middleware');

// Public routes (with optional auth for pricing)
router.get('/airports', flightController.getAirports);
router.get('/airlines', flightController.getAirlines);
router.get('/sectors', flightController.getSectors);

// Search (optional auth for personalized pricing)
router.post('/search', optionalAuth, validate(flightSchemas.search), flightController.search);

// Protected routes
router.use(authenticate);

// Reprice and booking
router.post('/reprice', validate(flightSchemas.reprice), flightController.reprice);
router.post('/ssr', flightController.getSSR);
router.post('/seatmap', flightController.getSeatMap);
router.post('/fare-rules', flightController.getFareRules);

// Booking
router.post('/book', validate(flightSchemas.booking), flightController.createBooking);
router.post('/book/:bookingId/confirm', flightController.confirmBooking);

// Ticket operations
router.get('/ticket/:pnr', flightController.getTicket);
router.post('/ticket/:pnr/cancel', flightController.cancelTicket);
router.get('/ticket/:pnr/cancellation-charges', flightController.getCancellationCharges);

module.exports = router;
