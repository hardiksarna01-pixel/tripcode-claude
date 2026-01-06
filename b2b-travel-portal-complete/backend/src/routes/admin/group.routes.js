/**
 * Agent Group Management Routes
 */

const express = require('express');
const router = express.Router();
const groupController = require('../../controllers/admin/group.controller');

// List groups
router.get('/', groupController.list);
router.post('/', groupController.create);
router.get('/:groupId', groupController.get);
router.put('/:groupId', groupController.update);
router.delete('/:groupId', groupController.delete);
router.get('/:groupId/agents', groupController.getAgents);
router.put('/:groupId/markup', groupController.updateMarkup);

module.exports = router;
