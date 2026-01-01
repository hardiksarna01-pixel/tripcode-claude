/**
 * Airport Transfer Routes
 */

const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transfer.controller');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');

// Public routes
router.get('/locations', transferController.getLocationSuggestions);
router.get('/vehicle-types', transferController.getVehicleTypes);
router.post('/search', optionalAuth, transferController.search);
router.get('/:transferId', transferController.getTransferDetails);

// Protected routes
router.use(authenticate);

// Booking
router.post('/book', transferController.createBooking);
router.get('/booking/:bookingId', transferController.getBooking);
router.post('/cancel/:bookingId', transferController.cancelBooking);

module.exports = router;
