/**
 * Agent Routes
 * Agent management (admin access)
 */

const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agent.controller');
const { authenticateAdmin } = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/permissions.middleware');
const { validate, adminSchemas, paginationSchema } = require('../middleware/validation.middleware');

router.use(authenticateAdmin);

// List agents
router.get('/', requirePermission('agents', 'read'), validate(paginationSchema, 'query'), agentController.listAgents);

// Create agent
router.post('/', requirePermission('agents', 'create'), validate(adminSchemas.createAgent), agentController.createAgent);

// Agent details
router.get('/:agentId', requirePermission('agents', 'read'), agentController.getAgentDetails);

// Update agent
router.put('/:agentId', requirePermission('agents', 'update'), agentController.updateAgent);

// Agent status
router.post('/:agentId/approve', requirePermission('agents', 'approve'), agentController.approveAgent);
router.post('/:agentId/suspend', requirePermission('agents', 'suspend'), agentController.suspendAgent);
router.post('/:agentId/activate', requirePermission('agents', 'approve'), agentController.activateAgent);

// Agent wallet
router.get('/:agentId/wallet', requirePermission('wallet', 'read'), agentController.getAgentWallet);
router.post('/:agentId/wallet/credit', requirePermission('wallet', 'credit'), agentController.creditAgentWallet);
router.post('/:agentId/wallet/debit', requirePermission('wallet', 'debit'), agentController.debitAgentWallet);

// Agent bookings
router.get('/:agentId/bookings', requirePermission('bookings', 'read'), agentController.getAgentBookings);

// Agent performance
router.get('/:agentId/performance', requirePermission('reports', 'read'), agentController.getAgentPerformance);

module.exports = router;
