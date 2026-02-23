/**
 * Activity/Tour Routes
 * Tours, sightseeing, and experiences
 */

const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity.controller');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');

// Public routes
router.get('/destinations', activityController.getDestinations);
router.get('/categories', activityController.getCategories);
router.get('/search', optionalAuth, activityController.search);
router.get('/:activityId', optionalAuth, activityController.getActivityDetails);
router.get('/:activityId/availability', activityController.checkAvailability);

// Protected routes
router.use(authenticate);

// Booking
router.post('/book', activityController.createBooking);
router.post('/book/:bookingId/confirm', activityController.confirmBooking);
router.get('/booking/:bookingId', activityController.getBookingDetails);
router.get('/voucher/:bookingId', activityController.getVoucher);
router.post('/cancel/:bookingId', activityController.cancelBooking);

module.exports = router;
