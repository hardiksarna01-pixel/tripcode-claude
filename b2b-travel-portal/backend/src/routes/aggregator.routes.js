const express = require('express');
const router = express.Router();
const aggregatorController = require('../controllers/aggregator.controller');

/**
 * @route   POST /api/v1/aggregator/search
 * @desc    Multi-supplier flight search (100+ APIs)
 * @access  Private
 */
router.post('/search', aggregatorController.searchFlights);

/**
 * @route   GET /api/v1/aggregator/suppliers
 * @desc    Get list of all registered suppliers
 * @access  Private
 */
router.get('/suppliers', aggregatorController.getSuppliers);

/**
 * @route   GET /api/v1/aggregator/health
 * @desc    Get aggregator and supplier health status
 * @access  Private
 */
router.get('/health', aggregatorController.getHealth);

/**
 * @route   GET /api/v1/aggregator/stats
 * @desc    Get aggregator statistics
 * @access  Private
 */
router.get('/stats', aggregatorController.getStats);

/**
 * @route   POST /api/v1/aggregator/suppliers
 * @desc    Register a new supplier
 * @access  Admin
 */
router.post('/suppliers', aggregatorController.registerSupplier);

/**
 * @route   PATCH /api/v1/aggregator/suppliers/:supplierId
 * @desc    Update supplier configuration
 * @access  Admin
 */
router.patch('/suppliers/:supplierId', aggregatorController.updateSupplier);

/**
 * @route   DELETE /api/v1/aggregator/suppliers/:supplierId
 * @desc    Remove a supplier
 * @access  Admin
 */
router.delete('/suppliers/:supplierId', aggregatorController.removeSupplier);

/**
 * @route   POST /api/v1/aggregator/cache/clear
 * @desc    Clear aggregator cache
 * @access  Admin
 */
router.post('/cache/clear', aggregatorController.clearCache);

module.exports = router;
