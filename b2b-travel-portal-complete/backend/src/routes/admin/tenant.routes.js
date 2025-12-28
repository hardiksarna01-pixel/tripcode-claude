/**
 * Tenant Management Routes (Multi-tenancy)
 */

const express = require('express');
const router = express.Router();
const tenantController = require('../../controllers/admin/tenant.controller');
const { authenticateSuperAdmin } = require('../../middleware/auth.middleware');

router.use(authenticateSuperAdmin);

// List tenants
router.get('/', tenantController.listTenants);

// Create tenant
router.post('/', tenantController.createTenant);

// Get tenant details
router.get('/:tenantId', tenantController.getTenantDetails);

// Update tenant
router.put('/:tenantId', tenantController.updateTenant);

// Tenant status
router.post('/:tenantId/activate', tenantController.activateTenant);
router.post('/:tenantId/suspend', tenantController.suspendTenant);
router.delete('/:tenantId', tenantController.deleteTenant);

// Tenant configuration
router.get('/:tenantId/config', tenantController.getTenantConfig);
router.put('/:tenantId/config', tenantController.updateTenantConfig);

// Tenant features
router.get('/:tenantId/features', tenantController.getTenantFeatures);
router.put('/:tenantId/features', tenantController.updateTenantFeatures);

// Tenant limits
router.get('/:tenantId/limits', tenantController.getTenantLimits);
router.put('/:tenantId/limits', tenantController.updateTenantLimits);

// Tenant admins
router.get('/:tenantId/admins', tenantController.getTenantAdmins);
router.post('/:tenantId/admins', tenantController.createTenantAdmin);

module.exports = router;
