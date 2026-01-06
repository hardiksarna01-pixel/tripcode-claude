/**
 * Customer Routes
 * B2C customer management
 */

const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const { authenticate, requireCustomer } = require('../middleware/auth.middleware');

router.use(authenticate);
router.use(requireCustomer);

// Profile
router.get('/profile', customerController.getProfile);
router.put('/profile', customerController.updateProfile);

// Saved travelers
router.get('/travelers', customerController.getSavedTravelers);
router.post('/travelers', customerController.saveTraveler);
router.put('/travelers/:travelerId', customerController.updateTraveler);
router.delete('/travelers/:travelerId', customerController.deleteTraveler);

// Bookings
router.get('/bookings', customerController.getBookings);
router.get('/bookings/:bookingId', customerController.getBookingDetails);

// Favorites/Wishlist
router.get('/wishlist', customerController.getWishlist);
router.post('/wishlist', customerController.addToWishlist);
router.delete('/wishlist/:itemId', customerController.removeFromWishlist);

// Saved searches
router.get('/saved-searches', customerController.getSavedSearches);
router.post('/saved-searches', customerController.saveSearch);
router.delete('/saved-searches/:searchId', customerController.deleteSavedSearch);

// Price alerts
router.get('/price-alerts', customerController.getPriceAlerts);
router.post('/price-alerts', customerController.createPriceAlert);
router.delete('/price-alerts/:alertId', customerController.deletePriceAlert);

// Reviews
router.get('/reviews', customerController.getMyReviews);
router.post('/reviews', customerController.createReview);

// Rewards/Loyalty
router.get('/rewards', customerController.getRewardsBalance);
router.get('/rewards/history', customerController.getRewardsHistory);

module.exports = router;
