/**
 * Public Routes
 * Public APIs that don't require authentication
 */

const express = require('express');
const router = express.Router();
const publicController = require('../controllers/public.controller');

// Static data
router.get('/countries', publicController.getCountries);
router.get('/states/:countryCode', publicController.getStates);
router.get('/cities/:stateCode', publicController.getCities);
router.get('/currencies', publicController.getCurrencies);

// Popular destinations
router.get('/destinations/popular', publicController.getPopularDestinations);
router.get('/destinations/trending', publicController.getTrendingDestinations);

// Deals and offers
router.get('/deals', publicController.getDeals);
router.get('/offers', publicController.getOffers);

// Blog/Content
router.get('/blog', publicController.getBlogPosts);
router.get('/blog/:slug', publicController.getBlogPost);

// FAQs
router.get('/faqs', publicController.getFAQs);
router.get('/faqs/:category', publicController.getFAQsByCategory);

// Contact
router.post('/contact', publicController.submitContactForm);
router.post('/newsletter/subscribe', publicController.subscribeNewsletter);

// Reviews
router.get('/reviews', publicController.getReviews);

// B2B Application
router.post('/agent-application', publicController.submitAgentApplication);

module.exports = router;
