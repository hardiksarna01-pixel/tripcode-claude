/**
 * Holiday Package Routes
 * Complete holiday package management and booking
 */

const express = require('express');
const router = express.Router();
const holidayController = require('../controllers/holiday.controller');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const { validate, holidaySchemas } = require('../middleware/validation.middleware');

// Public routes
router.get('/destinations', holidayController.getDestinations);
router.get('/themes', holidayController.getThemes);
router.post('/search', optionalAuth, validate(holidaySchemas.search), holidayController.search);
router.get('/packages', optionalAuth, holidayController.listPackages);
router.get('/packages/:packageId', optionalAuth, holidayController.getPackageDetails);
router.get('/packages/:packageId/itinerary', holidayController.getItinerary);

// Protected routes
router.use(authenticate);

// Inquiry and booking
router.post('/inquiry', validate(holidaySchemas.inquiry), holidayController.createInquiry);
router.get('/inquiry/:inquiryId', holidayController.getInquiryStatus);

// Custom package
router.post('/custom-package', holidayController.createCustomPackage);
router.get('/custom-package/:packageId', holidayController.getCustomPackage);

// Booking
router.post('/book', holidayController.createBooking);
router.post('/book/:bookingId/confirm', holidayController.confirmBooking);
router.get('/booking/:bookingId', holidayController.getBookingDetails);
router.post('/cancel/:bookingId', holidayController.cancelBooking);

module.exports = router;
