/**
 * Subscription Routes
 * Routes for subscription and billing management
 */

const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscription.controller');

// Get subscription for tenant
router.get('/:tenantId', subscriptionController.getSubscription);

// Start subscription
router.post('/:tenantId/start', subscriptionController.startSubscription);

// Cancel subscription
router.post('/:tenantId/cancel', subscriptionController.cancelSubscription);

// Change plan
router.post('/:tenantId/change-plan', subscriptionController.changePlan);

// Billing history
router.get('/:tenantId/billing-history', subscriptionController.getBillingHistory);

// Get invoice
router.get('/invoices/:invoiceId', subscriptionController.getInvoice);

// Process payment
router.post('/:tenantId/pay', subscriptionController.processPayment);

// Add payment method
router.post('/:tenantId/payment-methods', subscriptionController.addPaymentMethod);

// Revenue summary (Super Admin)
router.get('/admin/revenue', subscriptionController.getRevenueSummary);

module.exports = router;
