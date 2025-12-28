/**
 * API Key Management Routes
 */

const express = require('express');
const router = express.Router();
const apiKeyController = require('../../controllers/admin/api-key.controller');
const { authenticateAdmin } = require('../../middleware/auth.middleware');
const { requirePermission, requireTenantAccess } = require('../../middleware/permissions.middleware');

router.use(authenticateAdmin);
router.use(requireTenantAccess);

// List API keys
router.get('/', requirePermission('apiKeys', 'read'), apiKeyController.listApiKeys);

// Create API key
router.post('/', requirePermission('apiKeys', 'create'), apiKeyController.createApiKey);

// Get API key details
router.get('/:keyId', requirePermission('apiKeys', 'read'), apiKeyController.getApiKeyDetails);

// Update API key
router.put('/:keyId', requirePermission('apiKeys', 'update'), apiKeyController.updateApiKey);

// Delete/Revoke API key
router.delete('/:keyId', requirePermission('apiKeys', 'delete'), apiKeyController.revokeApiKey);

// Regenerate API key
router.post('/:keyId/regenerate', requirePermission('apiKeys', 'update'), apiKeyController.regenerateApiKey);

// API key usage
router.get('/:keyId/usage', requirePermission('apiKeys', 'read'), apiKeyController.getApiKeyUsage);
router.get('/:keyId/logs', requirePermission('apiKeys', 'read'), apiKeyController.getApiKeyLogs);

// API key permissions
router.get('/:keyId/permissions', requirePermission('apiKeys', 'read'), apiKeyController.getApiKeyPermissions);
router.put('/:keyId/permissions', requirePermission('apiKeys', 'update'), apiKeyController.updateApiKeyPermissions);

// API key rate limits
router.get('/:keyId/rate-limits', requirePermission('apiKeys', 'read'), apiKeyController.getApiKeyRateLimits);
router.put('/:keyId/rate-limits', requirePermission('apiKeys', 'update'), apiKeyController.updateApiKeyRateLimits);

// IP whitelist
router.get('/:keyId/ip-whitelist', requirePermission('apiKeys', 'read'), apiKeyController.getIpWhitelist);
router.put('/:keyId/ip-whitelist', requirePermission('apiKeys', 'update'), apiKeyController.updateIpWhitelist);

module.exports = router;
