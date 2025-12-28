/**
 * Agent Management Routes (Admin)
 */

const express = require('express');
const router = express.Router();
const agentController = require('../../controllers/admin/agent-management.controller');
const { authenticateAdmin } = require('../../middleware/auth.middleware');
const { requirePermission, requireTenantAccess } = require('../../middleware/permissions.middleware');

router.use(authenticateAdmin);
router.use(requireTenantAccess);

// List agents with filters
router.get('/', requirePermission('agents', 'read'), agentController.listAgents);
router.get('/pending', requirePermission('agents', 'read'), agentController.getPendingAgents);
router.get('/stats', requirePermission('agents', 'read'), agentController.getAgentStats);

// Agent CRUD
router.post('/', requirePermission('agents', 'create'), agentController.createAgent);
router.get('/:agentId', requirePermission('agents', 'read'), agentController.getAgentDetails);
router.put('/:agentId', requirePermission('agents', 'update'), agentController.updateAgent);
router.delete('/:agentId', requirePermission('agents', 'delete'), agentController.deleteAgent);

// Agent status management
router.post('/:agentId/approve', requirePermission('agents', 'approve'), agentController.approveAgent);
router.post('/:agentId/reject', requirePermission('agents', 'approve'), agentController.rejectAgent);
router.post('/:agentId/suspend', requirePermission('agents', 'suspend'), agentController.suspendAgent);
router.post('/:agentId/activate', requirePermission('agents', 'approve'), agentController.activateAgent);

// Agent configuration
router.get('/:agentId/config', requirePermission('agents', 'read'), agentController.getAgentConfig);
router.put('/:agentId/config', requirePermission('agents', 'update'), agentController.updateAgentConfig);

// Agent group/scheme
router.put('/:agentId/group', requirePermission('agents', 'update'), agentController.assignGroup);
router.put('/:agentId/scheme', requirePermission('agents', 'update'), agentController.assignScheme);

// Agent credit
router.get('/:agentId/credit', requirePermission('wallet', 'read'), agentController.getAgentCredit);
router.put('/:agentId/credit', requirePermission('wallet', 'adjust'), agentController.updateAgentCredit);

// Agent KYC
router.get('/:agentId/kyc', requirePermission('agents', 'read'), agentController.getAgentKYC);
router.put('/:agentId/kyc/approve', requirePermission('agents', 'approve'), agentController.approveKYC);
router.put('/:agentId/kyc/reject', requirePermission('agents', 'approve'), agentController.rejectKYC);

// Bulk operations
router.post('/bulk/approve', requirePermission('agents', 'approve'), agentController.bulkApprove);
router.post('/bulk/assign-group', requirePermission('agents', 'update'), agentController.bulkAssignGroup);

// Export
router.get('/export', requirePermission('agents', 'read'), agentController.exportAgents);

module.exports = router;
