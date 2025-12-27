/**
 * Group Booking Routes
 */

const express = require('express');
const router = express.Router();
const groupBookingController = require('../controllers/groupBooking.controller');

// Get purposes and stats
router.get('/purposes', groupBookingController.getPurposes);
router.get('/stats', groupBookingController.getStats);

// CRUD operations
router.get('/', groupBookingController.getRequests);
router.post('/', groupBookingController.createRequest);
router.get('/:id', groupBookingController.getRequest);
router.put('/:id', groupBookingController.updateRequest);
router.post('/:id/cancel', groupBookingController.cancelRequest);

// Quote management
router.post('/:id/quotes', groupBookingController.addQuote);
router.post('/:id/accept-quote', groupBookingController.acceptQuote);

module.exports = router;
