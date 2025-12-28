/**
 * Webhook Routes
 * External service webhooks
 */

const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhook.controller');

// Payment webhooks
router.post('/razorpay', express.raw({ type: 'application/json' }), webhookController.razorpay);
router.post('/stripe', express.raw({ type: 'application/json' }), webhookController.stripe);
router.post('/payu', webhookController.payu);

// Supplier webhooks
router.post('/amadeus', webhookController.amadeus);
router.post('/tbo', webhookController.tbo);
router.post('/hotelbeds', webhookController.hotelbeds);

// SMS/Communication webhooks
router.post('/twilio', webhookController.twilio);
router.post('/msg91', webhookController.msg91);
router.post('/whatsapp', webhookController.whatsapp);

// Booking updates
router.post('/booking-update', webhookController.bookingUpdate);
router.post('/schedule-change', webhookController.scheduleChange);

module.exports = router;
