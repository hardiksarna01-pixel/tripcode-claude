/**
 * Agent Management Routes (Admin)
 */

const express = require('express');
const router = express.Router();
const agentController = require('../../controllers/admin/agent-management.controller');

// Agent CRUD
router.get('/', agentController.list);
router.post('/', agentController.create);
router.get('/:agentId', agentController.get);
router.put('/:agentId', agentController.update);
router.delete('/:agentId', agentController.delete);

// Agent actions
router.post('/:agentId/approve', agentController.approve);
router.post('/:agentId/suspend', agentController.suspend);
router.get('/:agentId/kyc', agentController.getKYC);

module.exports = router;
