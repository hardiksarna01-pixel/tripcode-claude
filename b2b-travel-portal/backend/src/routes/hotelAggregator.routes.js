const express = require('express');
const router = express.Router();
const hotelAggregatorController = require('../controllers/hotelAggregator.controller');

/**
 * @route   POST /api/v1/hotel-aggregator/search
 * @desc    Multi-supplier hotel search (50+ providers)
 * @access  Private
 */
router.post('/search', hotelAggregatorController.searchHotels);

/**
 * @route   GET /api/v1/hotel-aggregator/suppliers
 * @desc    Get list of all registered hotel suppliers
 * @access  Private
 */
router.get('/suppliers', hotelAggregatorController.getSuppliers);

/**
 * @route   GET /api/v1/hotel-aggregator/health
 * @desc    Get aggregator and supplier health status
 * @access  Private
 */
router.get('/health', hotelAggregatorController.getHealth);

/**
 * @route   GET /api/v1/hotel-aggregator/stats
 * @desc    Get aggregator statistics
 * @access  Private
 */
router.get('/stats', hotelAggregatorController.getStats);

/**
 * @route   GET /api/v1/hotel-aggregator/details/:hotelId
 * @desc    Get hotel details from specific supplier
 * @access  Private
 */
router.get('/details/:hotelId', hotelAggregatorController.getHotelDetails);

/**
 * @route   POST /api/v1/hotel-aggregator/availability
 * @desc    Check room availability and rates
 * @access  Private
 */
router.post('/availability', hotelAggregatorController.checkAvailability);

/**
 * @route   POST /api/v1/hotel-aggregator/suppliers
 * @desc    Register a new supplier
 * @access  Admin
 */
router.post('/suppliers', hotelAggregatorController.registerSupplier);

/**
 * @route   POST /api/v1/hotel-aggregator/cache/clear
 * @desc    Clear aggregator cache
 * @access  Admin
 */
router.post('/cache/clear', hotelAggregatorController.clearCache);

module.exports = router;
