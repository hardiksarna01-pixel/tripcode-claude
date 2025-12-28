const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

/**
 * @route   GET /api/v1/payments/gateways
 * @desc    Get available payment gateways
 * @access  Private
 */
router.get('/gateways', paymentController.getAvailableGateways);

/**
 * @route   GET /api/v1/payments/gateways/:gatewayId
 * @desc    Get gateway details
 * @access  Private
 */
router.get('/gateways/:gatewayId', paymentController.getGatewayDetails);

/**
 * @route   POST /api/v1/payments/gateways/preference
 * @desc    Set agent's preferred gateway
 * @access  Private
 */
router.post('/gateways/preference', paymentController.setPreference);

/**
 * @route   GET /api/v1/payments/gateways/preference
 * @desc    Get agent's preferred gateway
 * @access  Private
 */
router.get('/gateways/preference', paymentController.getPreference);

/**
 * @route   POST /api/v1/payments/initiate
 * @desc    Initiate a payment
 * @access  Private
 */
router.post('/initiate', paymentController.initiatePayment);

/**
 * @route   POST /api/v1/payments/verify
 * @desc    Verify payment after gateway callback
 * @access  Private
 */
router.post('/verify', paymentController.verifyPayment);

/**
 * @route   POST /api/v1/payments/refund
 * @desc    Process a refund
 * @access  Private
 */
router.post('/refund', paymentController.processRefund);

/**
 * @route   GET /api/v1/payments/transactions/:transactionId
 * @desc    Get transaction details
 * @access  Private
 */
router.get('/transactions/:transactionId', paymentController.getTransaction);

/**
 * @route   GET /api/v1/payments/transactions
 * @desc    Get agent's transactions
 * @access  Private
 */
router.get('/transactions', paymentController.getTransactions);

/**
 * @route   GET /api/v1/payments/booking/:bookingId
 * @desc    Get transactions for a booking
 * @access  Private
 */
router.get('/booking/:bookingId', paymentController.getBookingTransactions);

/**
 * @route   POST /api/v1/payments/calculate-fees
 * @desc    Calculate gateway fees for an amount
 * @access  Private
 */
router.post('/calculate-fees', paymentController.calculateFees);

/**
 * @route   POST /api/v1/payments/recommend
 * @desc    Get recommended gateway for transaction
 * @access  Private
 */
router.post('/recommend', paymentController.recommendGateway);

/**
 * @route   GET /api/v1/payments/stats
 * @desc    Get payment statistics
 * @access  Admin
 */
router.get('/stats', paymentController.getStats);

/**
 * @route   POST /api/v1/payments/webhook/:gatewayId
 * @desc    Handle gateway webhooks
 * @access  Public (verified by signature)
 */
router.post('/webhook/:gatewayId', paymentController.handleWebhook);

module.exports = router;
