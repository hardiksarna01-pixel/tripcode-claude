/**
 * Tenant Routes
 * Routes for multi-tenancy management
 */

const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenant.controller');

// Get subscription plans
router.get('/plans', tenantController.getPlans);

// Create new tenant
router.post('/', tenantController.createTenant);

// List all tenants (Super Admin)
router.get('/', tenantController.listTenants);

// Get tenant details
router.get('/:tenantId', tenantController.getTenant);

// Update tenant
router.put('/:tenantId', tenantController.updateTenant);

// Update branding
router.put('/:tenantId/branding', tenantController.updateBranding);

// Set custom domain
router.post('/:tenantId/domain', tenantController.setCustomDomain);

// Change subscription plan
router.post('/:tenantId/change-plan', tenantController.changePlan);

// Get usage statistics
router.get('/:tenantId/usage', tenantController.getUsage);

// Suspend tenant (Super Admin)
router.post('/:tenantId/suspend', tenantController.suspendTenant);

// Reactivate tenant (Super Admin)
router.post('/:tenantId/reactivate', tenantController.reactivateTenant);

module.exports = router;
