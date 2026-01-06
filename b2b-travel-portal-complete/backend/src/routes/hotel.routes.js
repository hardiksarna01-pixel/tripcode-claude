/**
 * Hotel Routes
 * Complete hotel search, booking, and management
 */

const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotel.controller');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const { validate, hotelSchemas } = require('../middleware/validation.middleware');

// Public routes
router.get('/destinations', hotelController.getDestinations);
router.get('/amenities', hotelController.getAmenities);

// Search
router.post('/search', optionalAuth, validate(hotelSchemas.search), hotelController.search);
router.get('/details/:hotelId', optionalAuth, hotelController.getHotelDetails);

// Protected routes
router.use(authenticate);

// Room details and booking
router.post('/rooms', validate(hotelSchemas.roomDetails), hotelController.getRoomDetails);
router.post('/reprice', hotelController.repriceRoom);

// Booking
router.post('/book', validate(hotelSchemas.booking), hotelController.createBooking);
router.post('/book/:bookingId/confirm', hotelController.confirmBooking);

// Voucher and cancellation
router.get('/voucher/:bookingId', hotelController.getVoucher);
router.post('/cancel/:bookingId', hotelController.cancelBooking);
router.get('/cancellation-policy/:bookingId', hotelController.getCancellationPolicy);

module.exports = router;
