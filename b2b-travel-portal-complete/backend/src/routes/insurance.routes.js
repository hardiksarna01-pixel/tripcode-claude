/**
 * Travel Insurance Routes
 */

const express = require('express');
const router = express.Router();
const insuranceController = require('../controllers/insurance.controller');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');

// Public routes
router.get('/providers', insuranceController.getProviders);
router.get('/plans/:planId', insuranceController.getPlanDetails);
router.post('/search', optionalAuth, insuranceController.search);
router.post('/calculate', optionalAuth, insuranceController.calculatePremium);

// Protected routes
router.use(authenticate);

// Policy creation
router.post('/book', insuranceController.createPolicy);
router.get('/policy/:policyId', insuranceController.getPolicy);

// Claims
router.post('/claim', insuranceController.fileClaim);

module.exports = router;
