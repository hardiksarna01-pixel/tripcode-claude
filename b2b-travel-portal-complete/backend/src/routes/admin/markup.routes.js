/**
 * Global Markup Rules Routes
 */

const express = require('express');
const router = express.Router();
const markupController = require('../../controllers/admin/markup.controller');
const { authenticateAdmin } = require('../../middleware/auth.middleware');
const { requirePermission, requireTenantAccess } = require('../../middleware/permissions.middleware');
const { validate, adminSchemas } = require('../../middleware/validation.middleware');

router.use(authenticateAdmin);
router.use(requireTenantAccess);

// List markup rules
router.get('/', requirePermission('markup', 'read'), markupController.listMarkupRules);

// Create markup rule
router.post('/', requirePermission('markup', 'create'), validate(adminSchemas.updateMarkup), markupController.createMarkupRule);

// Get markup rule details
router.get('/:markupId', requirePermission('markup', 'read'), markupController.getMarkupRuleDetails);

// Update markup rule
router.put('/:markupId', requirePermission('markup', 'update'), markupController.updateMarkupRule);

// Delete markup rule
router.delete('/:markupId', requirePermission('markup', 'delete'), markupController.deleteMarkupRule);

// Markup by product type
router.get('/product/:productType', requirePermission('markup', 'read'), markupController.getMarkupByProduct);

// Markup by agent/group
router.get('/agent/:agentId', requirePermission('markup', 'read'), markupController.getMarkupByAgent);
router.get('/group/:groupId', requirePermission('markup', 'read'), markupController.getMarkupByGroup);

// Bulk operations
router.post('/bulk', requirePermission('markup', 'create'), markupController.bulkCreateMarkup);
router.put('/bulk', requirePermission('markup', 'update'), markupController.bulkUpdateMarkup);

// Markup calculator (preview)
router.post('/calculate', requirePermission('markup', 'read'), markupController.calculateMarkup);

// Markup priority
router.put('/priority', requirePermission('markup', 'update'), markupController.updateMarkupPriority);

module.exports = router;
