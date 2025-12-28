/**
 * Agent Group Management Routes
 */

const express = require('express');
const router = express.Router();
const groupController = require('../../controllers/admin/group.controller');
const { authenticateAdmin } = require('../../middleware/auth.middleware');
const { requirePermission, requireTenantAccess } = require('../../middleware/permissions.middleware');

router.use(authenticateAdmin);
router.use(requireTenantAccess);

// List groups
router.get('/', requirePermission('groups', 'read'), groupController.listGroups);

// Create group
router.post('/', requirePermission('groups', 'create'), groupController.createGroup);

// Get group details
router.get('/:groupId', requirePermission('groups', 'read'), groupController.getGroupDetails);

// Update group
router.put('/:groupId', requirePermission('groups', 'update'), groupController.updateGroup);

// Delete group
router.delete('/:groupId', requirePermission('groups', 'delete'), groupController.deleteGroup);

// Group agents
router.get('/:groupId/agents', requirePermission('groups', 'read'), groupController.getGroupAgents);
router.post('/:groupId/agents', requirePermission('groups', 'update'), groupController.addAgentToGroup);
router.delete('/:groupId/agents/:agentId', requirePermission('groups', 'update'), groupController.removeAgentFromGroup);

// Group markup
router.get('/:groupId/markup', requirePermission('markup', 'read'), groupController.getGroupMarkup);
router.put('/:groupId/markup', requirePermission('markup', 'update'), groupController.updateGroupMarkup);

// Group commission
router.get('/:groupId/commission', requirePermission('groups', 'read'), groupController.getGroupCommission);
router.put('/:groupId/commission', requirePermission('groups', 'update'), groupController.updateGroupCommission);

module.exports = router;
