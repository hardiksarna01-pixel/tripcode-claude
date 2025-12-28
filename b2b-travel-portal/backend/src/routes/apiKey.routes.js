/**
 * API Key Routes
 * Routes for API key management
 */

const express = require('express');
const router = express.Router();
const apiKeyController = require('../controllers/apiKey.controller');

// Get API endpoints documentation
router.get('/endpoints', apiKeyController.getEndpoints);

// Generate API keys
router.post('/generate', apiKeyController.generateKeys);

// Get keys for a tenant
router.get('/:tenantId', apiKeyController.getKeys);

// Get usage statistics
router.get('/:tenantId/usage', apiKeyController.getUsageStats);

// Rotate API key
router.post('/rotate', apiKeyController.rotateKey);

// Revoke API key
router.post('/revoke', apiKeyController.revokeKey);

module.exports = router;
