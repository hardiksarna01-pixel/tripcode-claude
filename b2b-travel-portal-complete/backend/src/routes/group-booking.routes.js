/**
 * Group Booking Routes
 */

const express = require('express');
const router = express.Router();
const groupBookingController = require('../controllers/group-booking.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

// Create group request
router.post('/', groupBookingController.createRequest);

// Get all requests
router.get('/', groupBookingController.getRequests);

// Get request details
router.get('/:requestId', groupBookingController.getRequestDetails);

// Update request
router.put('/:requestId', groupBookingController.updateRequest);

// Cancel request
router.delete('/:requestId', groupBookingController.cancelRequest);

module.exports = router;
