/**
 * Channel Distribution Routes
 * Manages B2B/B2C API and fare type distribution
 */

const express = require('express');
const router = express.Router();
const channelDistributionController = require('../../controllers/admin/channel-distribution.controller');

// Overview
router.get('/overview', channelDistributionController.getDistributionOverview);

// Suppliers
router.get('/suppliers', channelDistributionController.getSuppliers);
router.put('/suppliers/:id', channelDistributionController.updateSupplier);
router.post('/suppliers/:id/toggle-channel', channelDistributionController.toggleSupplierChannel);
router.put('/suppliers/:id/fare-restrictions', channelDistributionController.updateFareTypeRestrictions);

// Channel configs (B2B/B2C)
router.get('/channels/:channel', channelDistributionController.getChannelConfig);
router.put('/channels/:channel', channelDistributionController.updateChannelConfig);
router.put('/channels/:channel/products/:product', channelDistributionController.toggleChannelProduct);

// Fare type matrix
router.get('/fare-matrix', channelDistributionController.getFareTypeMatrix);
router.post('/fare-matrix/bulk-update', channelDistributionController.bulkUpdateFareRestrictions);

// B2C Optimization
router.get('/b2c/optimization', channelDistributionController.getB2COptimization);
router.put('/b2c/optimization', channelDistributionController.updateB2COptimization);

module.exports = router;
