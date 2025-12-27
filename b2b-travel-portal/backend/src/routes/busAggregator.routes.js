const express = require('express');
const router = express.Router();
const busAggregatorController = require('../controllers/busAggregator.controller');

/**
 * @route   POST /api/v1/bus-aggregator/search
 * @desc    Multi-supplier bus search (40+ operators)
 * @access  Private
 */
router.post('/search', busAggregatorController.searchBuses);

/**
 * @route   GET /api/v1/bus-aggregator/suppliers
 * @desc    Get list of all registered bus suppliers
 * @access  Private
 */
router.get('/suppliers', busAggregatorController.getSuppliers);

/**
 * @route   GET /api/v1/bus-aggregator/health
 * @desc    Get aggregator and supplier health status
 * @access  Private
 */
router.get('/health', busAggregatorController.getHealth);

/**
 * @route   GET /api/v1/bus-aggregator/stats
 * @desc    Get aggregator statistics
 * @access  Private
 */
router.get('/stats', busAggregatorController.getStats);

/**
 * @route   GET /api/v1/bus-aggregator/details/:busId
 * @desc    Get bus details including seat layout
 * @access  Private
 */
router.get('/details/:busId', busAggregatorController.getBusDetails);

/**
 * @route   POST /api/v1/bus-aggregator/seats
 * @desc    Get seat layout for a bus
 * @access  Private
 */
router.post('/seats', busAggregatorController.getSeatLayout);

/**
 * @route   POST /api/v1/bus-aggregator/block
 * @desc    Block seats temporarily
 * @access  Private
 */
router.post('/block', busAggregatorController.blockSeats);

/**
 * @route   POST /api/v1/bus-aggregator/suppliers
 * @desc    Register a new supplier
 * @access  Admin
 */
router.post('/suppliers', busAggregatorController.registerSupplier);

/**
 * @route   POST /api/v1/bus-aggregator/cache/clear
 * @desc    Clear aggregator cache
 * @access  Admin
 */
router.post('/cache/clear', busAggregatorController.clearCache);

module.exports = router;
