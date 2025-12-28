/**
 * Commission Scheme Routes
 */

const express = require('express');
const router = express.Router();
const schemeController = require('../../controllers/admin/scheme.controller');
const { authenticateAdmin } = require('../../middleware/auth.middleware');
const { requirePermission, requireTenantAccess } = require('../../middleware/permissions.middleware');
const { validate, adminSchemas } = require('../../middleware/validation.middleware');

router.use(authenticateAdmin);
router.use(requireTenantAccess);

// List schemes
router.get('/', requirePermission('schemes', 'read'), schemeController.listSchemes);

// Create scheme
router.post('/', requirePermission('schemes', 'create'), validate(adminSchemas.createScheme), schemeController.createScheme);

// Get scheme details
router.get('/:schemeId', requirePermission('schemes', 'read'), schemeController.getSchemeDetails);

// Update scheme
router.put('/:schemeId', requirePermission('schemes', 'update'), schemeController.updateScheme);

// Delete scheme
router.delete('/:schemeId', requirePermission('schemes', 'delete'), schemeController.deleteScheme);

// Scheme products
router.get('/:schemeId/products', requirePermission('schemes', 'read'), schemeController.getSchemeProducts);
router.put('/:schemeId/products', requirePermission('schemes', 'update'), schemeController.updateSchemeProducts);

// Scheme agents
router.get('/:schemeId/agents', requirePermission('schemes', 'read'), schemeController.getSchemeAgents);
router.post('/:schemeId/agents/assign', requirePermission('schemes', 'update'), schemeController.assignAgentsToScheme);

// Clone scheme
router.post('/:schemeId/clone', requirePermission('schemes', 'create'), schemeController.cloneScheme);

// Scheme activation
router.post('/:schemeId/activate', requirePermission('schemes', 'update'), schemeController.activateScheme);
router.post('/:schemeId/deactivate', requirePermission('schemes', 'update'), schemeController.deactivateScheme);

module.exports = router;
