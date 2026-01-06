/**
 * Tenant Management Routes (Multi-tenancy)
 */

const express = require('express');
const router = express.Router();
const tenantController = require('../../controllers/admin/tenant.controller');

// List tenants
router.get('/', tenantController.list);
router.post('/', tenantController.create);
router.get('/:tenantId', tenantController.get);
router.put('/:tenantId', tenantController.update);
router.delete('/:tenantId', tenantController.delete);
router.get('/:tenantId/config', tenantController.getConfig);
router.put('/:tenantId/config', tenantController.updateConfig);

module.exports = router;
