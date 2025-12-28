/**
 * AI Features Routes
 * AI-powered trip planning and assistance
 */

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');

// Public AI features
router.post('/chat', optionalAuth, aiController.chat);
router.post('/trip-planner', optionalAuth, aiController.planTrip);
router.post('/recommend', optionalAuth, aiController.getRecommendations);

// Price prediction
router.post('/price-prediction', optionalAuth, aiController.predictPrice);
router.get('/best-time-to-book', aiController.getBestTimeToBook);

// Smart search
router.post('/smart-search', optionalAuth, aiController.smartSearch);
router.post('/natural-language-search', optionalAuth, aiController.naturalLanguageSearch);

// Protected AI features
router.use(authenticate);

// Chat history
router.get('/chat/history', aiController.getChatHistory);
router.get('/chat/session/:sessionId', aiController.getChatSession);
router.delete('/chat/session/:sessionId', aiController.deleteChatSession);

// Saved trips
router.get('/trips', aiController.getSavedTrips);
router.post('/trips', aiController.saveTrip);
router.put('/trips/:tripId', aiController.updateTrip);
router.delete('/trips/:tripId', aiController.deleteTrip);

// Personalized recommendations
router.get('/personalized', aiController.getPersonalizedRecommendations);

module.exports = router;
