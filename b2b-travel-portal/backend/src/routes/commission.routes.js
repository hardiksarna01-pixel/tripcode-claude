const express = require('express');
const router = express.Router();
const commissionController = require('../controllers/commission.controller');

// ==================== COMMISSION CALCULATION ====================

/**
 * @route   POST /api/v1/commission/calculate
 * @desc    Calculate commission for a booking
 * @access  Private
 */
router.post('/calculate', commissionController.calculateCommission);

/**
 * @route   POST /api/v1/commission/calculate/bulk
 * @desc    Calculate commission for multiple bookings
 * @access  Private
 */
router.post('/calculate/bulk', commissionController.calculateBulk);

/**
 * @route   POST /api/v1/commission/simulate
 * @desc    Simulate commission with different parameters
 * @access  Private
 */
router.post('/simulate', commissionController.simulate);

/**
 * @route   GET /api/v1/commission/summary/:agentId
 * @desc    Get commission summary for an agent
 * @access  Private
 */
router.get('/summary/:agentId', commissionController.getAgentSummary);

// ==================== COMMISSION RULES ====================

/**
 * @route   GET /api/v1/commission/rules
 * @desc    Get all commission rules
 * @access  Admin
 */
router.get('/rules', commissionController.getAllRules);

/**
 * @route   GET /api/v1/commission/rules/:ruleId
 * @desc    Get a specific rule
 * @access  Admin
 */
router.get('/rules/:ruleId', commissionController.getRule);

/**
 * @route   POST /api/v1/commission/rules
 * @desc    Create a new commission rule
 * @access  Admin
 */
router.post('/rules', commissionController.createRule);

/**
 * @route   PUT /api/v1/commission/rules/:ruleId
 * @desc    Update a commission rule
 * @access  Admin
 */
router.put('/rules/:ruleId', commissionController.updateRule);

/**
 * @route   DELETE /api/v1/commission/rules/:ruleId
 * @desc    Delete a commission rule
 * @access  Admin
 */
router.delete('/rules/:ruleId', commissionController.deleteRule);

/**
 * @route   GET /api/v1/commission/rules/type/:type
 * @desc    Get rules by type (global, airline, route, class, api, agent_group)
 * @access  Admin
 */
router.get('/rules/type/:type', commissionController.getRulesByType);

// ==================== AGENT GROUPS ====================

/**
 * @route   GET /api/v1/commission/agent-groups
 * @desc    Get all agent groups
 * @access  Admin
 */
router.get('/agent-groups', commissionController.getAllAgentGroups);

/**
 * @route   GET /api/v1/commission/agent-groups/:groupId
 * @desc    Get a specific agent group
 * @access  Admin
 */
router.get('/agent-groups/:groupId', commissionController.getAgentGroup);

/**
 * @route   POST /api/v1/commission/agent-groups
 * @desc    Create a new agent group
 * @access  Admin
 */
router.post('/agent-groups', commissionController.createAgentGroup);

/**
 * @route   PUT /api/v1/commission/agent-groups/:groupId
 * @desc    Update an agent group
 * @access  Admin
 */
router.put('/agent-groups/:groupId', commissionController.updateAgentGroup);

/**
 * @route   DELETE /api/v1/commission/agent-groups/:groupId
 * @desc    Delete an agent group
 * @access  Admin
 */
router.delete('/agent-groups/:groupId', commissionController.deleteAgentGroup);

/**
 * @route   POST /api/v1/commission/agent-groups/:groupId/agents
 * @desc    Add agent to group
 * @access  Admin
 */
router.post('/agent-groups/:groupId/agents', commissionController.addAgentToGroup);

/**
 * @route   DELETE /api/v1/commission/agent-groups/:groupId/agents/:agentId
 * @desc    Remove agent from group
 * @access  Admin
 */
router.delete('/agent-groups/:groupId/agents/:agentId', commissionController.removeAgentFromGroup);

/**
 * @route   POST /api/v1/commission/agent-groups/:groupId/link-api-group
 * @desc    Link API group to agent group
 * @access  Admin
 */
router.post('/agent-groups/:groupId/link-api-group', commissionController.linkApiGroupToAgentGroup);

// ==================== API GROUPS ====================

/**
 * @route   GET /api/v1/commission/api-groups
 * @desc    Get all API groups
 * @access  Admin
 */
router.get('/api-groups', commissionController.getAllApiGroups);

/**
 * @route   GET /api/v1/commission/api-groups/:groupId
 * @desc    Get a specific API group
 * @access  Admin
 */
router.get('/api-groups/:groupId', commissionController.getApiGroup);

/**
 * @route   POST /api/v1/commission/api-groups
 * @desc    Create a new API group
 * @access  Admin
 */
router.post('/api-groups', commissionController.createApiGroup);

/**
 * @route   PUT /api/v1/commission/api-groups/:groupId
 * @desc    Update an API group
 * @access  Admin
 */
router.put('/api-groups/:groupId', commissionController.updateApiGroup);

/**
 * @route   DELETE /api/v1/commission/api-groups/:groupId
 * @desc    Delete an API group
 * @access  Admin
 */
router.delete('/api-groups/:groupId', commissionController.deleteApiGroup);

/**
 * @route   POST /api/v1/commission/api-groups/:groupId/apis
 * @desc    Add API to group
 * @access  Admin
 */
router.post('/api-groups/:groupId/apis', commissionController.addApiToGroup);

/**
 * @route   DELETE /api/v1/commission/api-groups/:groupId/apis/:apiId
 * @desc    Remove API from group
 * @access  Admin
 */
router.delete('/api-groups/:groupId/apis/:apiId', commissionController.removeApiFromGroup);

// ==================== AGENT OVERRIDES ====================

/**
 * @route   GET /api/v1/commission/agent-overrides
 * @desc    Get all agent overrides
 * @access  Admin
 */
router.get('/agent-overrides', commissionController.getAllAgentOverrides);

/**
 * @route   GET /api/v1/commission/agent-overrides/:agentId
 * @desc    Get override for specific agent
 * @access  Admin
 */
router.get('/agent-overrides/:agentId', commissionController.getAgentOverride);

/**
 * @route   POST /api/v1/commission/agent-overrides/:agentId
 * @desc    Set agent override
 * @access  Admin
 */
router.post('/agent-overrides/:agentId', commissionController.setAgentOverride);

/**
 * @route   DELETE /api/v1/commission/agent-overrides/:agentId
 * @desc    Delete agent override
 * @access  Admin
 */
router.delete('/agent-overrides/:agentId', commissionController.deleteAgentOverride);

// ==================== SERVICE FEES ====================

/**
 * @route   GET /api/v1/commission/service-fees
 * @desc    Get all service fees
 * @access  Admin
 */
router.get('/service-fees', commissionController.getAllServiceFees);

/**
 * @route   POST /api/v1/commission/service-fees
 * @desc    Create a service fee rule
 * @access  Admin
 */
router.post('/service-fees', commissionController.createServiceFee);

/**
 * @route   PUT /api/v1/commission/service-fees/:feeId
 * @desc    Update a service fee rule
 * @access  Admin
 */
router.put('/service-fees/:feeId', commissionController.updateServiceFee);

/**
 * @route   DELETE /api/v1/commission/service-fees/:feeId
 * @desc    Delete a service fee rule
 * @access  Admin
 */
router.delete('/service-fees/:feeId', commissionController.deleteServiceFee);

module.exports = router;
