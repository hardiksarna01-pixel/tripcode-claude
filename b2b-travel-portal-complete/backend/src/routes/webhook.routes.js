/**
 * Webhook Routes
 */

const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhook.controller');

// Payment webhooks
router.post('/payment', webhookController.handlePaymentWebhook);

// Supplier webhooks
router.post('/supplier', webhookController.handleSupplierWebhook);

// Insurance webhooks
router.post('/insurance', webhookController.handleInsuranceWebhook);

// SMS webhooks
router.post('/sms', webhookController.handleSMSWebhook);

// Email webhooks
router.post('/email', webhookController.handleEmailWebhook);

module.exports = router;
