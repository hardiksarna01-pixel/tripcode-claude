/**
 * AI Subscription Routes
 * IMPORTANT: These subscriptions are billed DIRECTLY to the platform
 * White-label partners do NOT receive any revenue share from AI features
 */

const express = require('express');
const router = express.Router();
const aiSubscriptionController = require('../controllers/aiSubscription.controller');

/**
 * @route   GET /api/v1/ai-subscription
 * @desc    Get current AI subscription for logged-in agent
 * @access  Private (Agent)
 */
router.get('/', aiSubscriptionController.getAISubscription);

/**
 * @route   POST /api/v1/ai-subscription/subscribe
 * @desc    Subscribe to AI Pro plan (billed directly to platform)
 * @access  Private (Agent)
 */
router.post('/subscribe', aiSubscriptionController.subscribeToAIPro);

/**
 * @route   POST /api/v1/ai-subscription/cancel
 * @desc    Cancel AI Pro subscription
 * @access  Private (Agent)
 */
router.post('/cancel', aiSubscriptionController.cancelAISubscription);

/**
 * @route   GET /api/v1/ai-subscription/billing
 * @desc    Get AI billing history
 * @access  Private (Agent)
 */
router.get('/billing', aiSubscriptionController.getAIBillingHistory);

/**
 * @route   GET /api/v1/ai-subscription/platform-revenue
 * @desc    Get platform AI revenue summary (Super Admin only)
 * @access  Private (Super Admin)
 * @note    This shows direct platform revenue - partners get 0%
 */
router.get('/platform-revenue', aiSubscriptionController.getPlatformAIRevenue);

module.exports = router;
