/**
 * Image Generator Routes
 * Routes for AI-powered travel image generation
 */

const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageGenerator.controller');

// Get configuration (styles, categories, plans)
router.get('/config', imageController.getConfig);

// Get usage statistics
router.get('/usage', imageController.getUsage);

// Generate new image
router.post('/generate', imageController.generateImage);

// Get image history
router.get('/history', imageController.getHistory);

// Get single image
router.get('/:imageId', imageController.getImage);

// Delete image
router.delete('/:imageId', imageController.deleteImage);

// Subscribe to Pro plan
router.post('/subscribe', imageController.subscribePro);

// Cancel subscription
router.post('/cancel-subscription', imageController.cancelSubscription);

module.exports = router;
