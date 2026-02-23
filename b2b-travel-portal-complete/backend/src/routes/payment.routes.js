/**
 * Payment Routes
 */

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');

// Payment methods
router.get('/methods', paymentController.getPaymentMethods);

// Create payment
router.post('/initiate', authenticate, paymentController.initiatePayment);
router.post('/verify', paymentController.verifyPayment);

// Payment status
router.get('/status/:paymentId', optionalAuth, paymentController.getPaymentStatus);

// Refunds
router.post('/refund', authenticate, paymentController.initiateRefund);
router.get('/refund/:refundId', authenticate, paymentController.getRefundStatus);

// Payment links
router.post('/create-link', authenticate, paymentController.createPaymentLink);

module.exports = router;
