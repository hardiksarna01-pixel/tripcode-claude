const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flight.controller');
const { validateSearch, validateReprice, validateBooking } = require('../middleware/validation.middleware');

/**
 * @route   GET /api/v1/flights/sectors
 * @desc    Get available sectors and dates
 * @access  Private
 */
router.get('/sectors', flightController.getSectorAvailability);

/**
 * @route   GET /api/v1/flights/fare-types
 * @desc    Get available special fare types
 * @access  Private
 */
router.get('/fare-types', flightController.getFareTypes);

/**
 * @route   POST /api/v1/flights/search
 * @desc    Search for available flights with special fare support
 * @access  Private
 */
router.post('/search', validateSearch, flightController.searchFlights);

/**
 * @route   POST /api/v1/flights/reprice
 * @desc    Validate and lock fare for selected flights
 * @access  Private
 */
router.post('/reprice', validateReprice, flightController.repriceFlights);

/**
 * @route   POST /api/v1/flights/ssr
 * @desc    Get ancillary services (meals, baggage, etc.)
 * @access  Private
 */
router.post('/ssr', flightController.getSSR);

/**
 * @route   POST /api/v1/flights/seatmap
 * @desc    Get seat map for seat selection
 * @access  Private
 */
router.post('/seatmap', flightController.getSeatMap);

/**
 * @route   GET /api/v1/flights/airlines
 * @desc    Get list of supported airlines
 * @access  Private
 */
router.get('/airlines', flightController.getAirlines);

/**
 * @route   GET /api/v1/flights/airports
 * @desc    Get list of airports
 * @access  Private
 */
router.get('/airports', flightController.getAirports);

module.exports = router;
