/**
 * Super Admin Routes
 * Platform-wide administration
 */

const express = require('express');
const router = express.Router();
const superadminController = require('../controllers/superadmin.controller');

// Platform dashboard
router.get('/dashboard', superadminController.getDashboard);

// Company management
router.get('/companies', superadminController.getCompanies);
router.post('/companies', superadminController.createCompany);
router.put('/companies/:companyId', superadminController.updateCompany);
router.post('/companies/:companyId/suspend', superadminController.suspendCompany);

// Subscription plans
router.get('/plans', superadminController.getPlans);

// Billing
router.get('/billing', superadminController.getBilling);

// System health
router.get('/health', superadminController.getSystemHealth);

// API usage
router.get('/api-usage', superadminController.getAPIUsage);

module.exports = router;
