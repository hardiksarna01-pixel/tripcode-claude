/**
 * Itinerary Builder Routes
 * Routes for AI-powered travel itinerary generation
 */

const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itinerary.controller');

// Get configuration (templates, destinations, plans)
router.get('/config', itineraryController.getConfig);

// Get usage statistics
router.get('/usage', itineraryController.getUsage);

// Generate new itinerary
router.post('/generate', itineraryController.generateItinerary);

// Get all itineraries
router.get('/', itineraryController.getItineraries);

// Get single itinerary
router.get('/:itineraryId', itineraryController.getItinerary);

// Update itinerary
router.put('/:itineraryId', itineraryController.updateItinerary);

// Delete itinerary
router.delete('/:itineraryId', itineraryController.deleteItinerary);

// Export itinerary
router.get('/:itineraryId/export', itineraryController.exportItinerary);

// Duplicate itinerary
router.post('/:itineraryId/duplicate', itineraryController.duplicateItinerary);

module.exports = router;
