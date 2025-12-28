const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');

/**
 * @route   POST /api/v1/bookings/create
 * @desc    Create a new booking (temp booking)
 * @access  Private
 */
router.post('/create', bookingController.createBooking);

/**
 * @route   POST /api/v1/bookings/confirm
 * @desc    Confirm booking and issue ticket
 * @access  Private
 */
router.post('/confirm', bookingController.confirmBooking);

/**
 * @route   GET /api/v1/bookings/:refNo
 * @desc    Get booking details
 * @access  Private
 */
router.get('/:refNo', bookingController.getBookingDetails);

/**
 * @route   GET /api/v1/bookings
 * @desc    Get booking history
 * @access  Private
 */
router.get('/', bookingController.getBookingHistory);

/**
 * @route   POST /api/v1/bookings/:refNo/cancel
 * @desc    Cancel a booking
 * @access  Private
 */
router.post('/:refNo/cancel', bookingController.cancelBooking);

/**
 * @route   POST /api/v1/bookings/:refNo/release
 * @desc    Release a blocked PNR
 * @access  Private
 */
router.post('/:refNo/release', bookingController.releasePnr);

/**
 * @route   POST /api/v1/bookings/:refNo/ssr
 * @desc    Add post-booking SSR
 * @access  Private
 */
router.post('/:refNo/ssr', bookingController.addPostBookingSSR);

module.exports = router;
