/**
 * AI Features Routes
 */

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');

// Chatbot
router.post('/chat', optionalAuth, aiController.chatbot);

// Trip planner
router.post('/trip-planner', optionalAuth, aiController.tripPlanner);

// Image generation
router.post('/generate-image', optionalAuth, aiController.generateImage);

// Smart search
router.post('/smart-search', optionalAuth, aiController.smartSearch);

// Price prediction
router.post('/price-prediction', optionalAuth, aiController.pricePrediction);

// Content generation
router.post('/content', authenticate, aiController.contentGeneration);

module.exports = router;
