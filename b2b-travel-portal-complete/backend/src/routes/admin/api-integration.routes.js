/**
 * API Integration Routes
 */

const express = require('express');
const router = express.Router();
const apiIntegrationController = require('../../controllers/admin/api-integration.controller');

// Integration management
router.get('/integrations', apiIntegrationController.getIntegrations);
router.post('/integrations', apiIntegrationController.createIntegration);
router.put('/integrations/:id', apiIntegrationController.updateIntegration);
router.delete('/integrations/:id', apiIntegrationController.deleteIntegration);
router.post('/integrations/:id/test', apiIntegrationController.testConnection);
router.post('/integrations/:id/toggle', apiIntegrationController.toggleIntegration);

// Endpoint management
router.post('/integrations/:id/endpoints', apiIntegrationController.addEndpoint);
router.post('/integrations/:integrationId/endpoints/:endpointId/execute', apiIntegrationController.executeCall);

// Webhooks
router.get('/webhooks', apiIntegrationController.getWebhooks);
router.post('/webhooks', apiIntegrationController.createWebhook);

// Utilities
router.get('/logs', apiIntegrationController.getLogs);
router.get('/mapping-templates', apiIntegrationController.getMappingTemplates);
router.get('/integrations/:id/generate-code', apiIntegrationController.generateClientCode);
router.post('/import-spec', apiIntegrationController.importFromSpec);
router.get('/stats', apiIntegrationController.getStats);

module.exports = router;
