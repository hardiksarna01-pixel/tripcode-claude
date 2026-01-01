/**
 * Public Routes
 */

const express = require('express');
const router = express.Router();
const publicController = require('../controllers/public.controller');

// Home data
router.get('/home', publicController.getHomeData);

// Offers
router.get('/offers', publicController.getOffers);
router.post('/validate-coupon', publicController.validateCoupon);

// Blog
router.get('/blog', publicController.getBlog);

// Testimonials
router.get('/testimonials', publicController.getTestimonials);

// Contact
router.get('/contact', publicController.getContactInfo);
router.post('/contact', publicController.submitContactForm);
router.post('/newsletter', publicController.subscribeNewsletter);

module.exports = router;
