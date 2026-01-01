/**
 * API Key Management Routes
 */

const express = require('express');
const router = express.Router();
const apiKeyController = require('../../controllers/admin/api-key.controller');

// List API keys
router.get('/', apiKeyController.list);
router.post('/', apiKeyController.create);
router.delete('/:keyId', apiKeyController.revoke);
router.get('/:keyId/usage', apiKeyController.getUsage);

module.exports = router;
