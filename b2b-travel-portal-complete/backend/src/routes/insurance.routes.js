/**
 * Travel Insurance Routes
 */

const express = require('express');
const router = express.Router();
const insuranceController = require('../controllers/insurance.controller');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');

// Public routes
router.get('/plans', optionalAuth, insuranceController.getPlans);
router.get('/plans/:planId', insuranceController.getPlanDetails);
router.post('/quote', optionalAuth, insuranceController.getQuote);

// Protected routes
router.use(authenticate);

// Booking
router.post('/book', insuranceController.createBooking);
router.post('/book/:bookingId/confirm', insuranceController.confirmBooking);
router.get('/policy/:policyId', insuranceController.getPolicyDetails);
router.get('/policy/:policyId/download', insuranceController.downloadPolicy);

// Claims
router.post('/claim', insuranceController.submitClaim);
router.get('/claim/:claimId', insuranceController.getClaimStatus);

module.exports = router;
