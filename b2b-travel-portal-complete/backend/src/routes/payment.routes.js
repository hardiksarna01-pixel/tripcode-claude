/**
 * Payment Routes
 * Payment processing for B2C bookings
 */

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');

// Payment gateways
router.get('/gateways', paymentController.getAvailableGateways);

// Create order
router.post('/create-order', authenticate, paymentController.createOrder);

// Gateway-specific callbacks
router.post('/razorpay/verify', paymentController.verifyRazorpay);
router.post('/payu/success', paymentController.payuSuccess);
router.post('/payu/failure', paymentController.payuFailure);
router.post('/stripe/verify', paymentController.verifyStripe);
router.post('/ccavenue/response', paymentController.ccavenueResponse);

// Payment status
router.get('/status/:orderId', optionalAuth, paymentController.getPaymentStatus);

// Refunds
router.post('/refund/:paymentId', authenticate, paymentController.initiateRefund);
router.get('/refund/:refundId/status', authenticate, paymentController.getRefundStatus);

module.exports = router;
