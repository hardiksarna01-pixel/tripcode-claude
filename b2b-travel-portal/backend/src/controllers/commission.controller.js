/**
 * Commission Controller
 * Handles commission rules, agent groups, API groups, and calculations
 */

const commissionEngine = require('../services/commissionEngine');
const { catchAsync } = require('../utils/catchAsync');

// ==================== COMMISSION CALCULATION ====================

/**
 * Calculate commission for a booking
 */
exports.calculateCommission = catchAsync(async (req, res) => {
    const {
        agentId,
        apiId,
        baseFare,
        taxAmount,
        origin,
        destination,
        airline,
        cabinClass,
        passengers,
        segments,
        tripType,
        isInternational
    } = req.body;

    if (!baseFare || baseFare <= 0) {
        return res.status(400).json({
            success: false,
            error: 'Valid base fare is required'
        });
    }

    const result = commissionEngine.calculateCommission({
        agentId: agentId || req.user?.id,
        apiId,
        baseFare,
        taxAmount,
        origin,
        destination,
        airline,
        cabinClass: cabinClass || 'economy',
        passengers: passengers || 1,
        segments: segments || 1,
        tripType,
        isInternational: isInternational || false
    });

    res.json({
        success: true,
        data: result
    });
});

/**
 * Calculate commission for multiple bookings
 */
exports.calculateBulk = catchAsync(async (req, res) => {
    const { bookings } = req.body;

    if (!bookings || !Array.isArray(bookings) || bookings.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Bookings array is required'
        });
    }

    const results = commissionEngine.calculateBulk(bookings);

    res.json({
        success: true,
        data: {
            count: results.length,
            results
        }
    });
});

/**
 * Simulate commission with different parameters
 */
exports.simulate = catchAsync(async (req, res) => {
    const { baseParams, variations } = req.body;

    if (!baseParams || !variations || !Array.isArray(variations)) {
        return res.status(400).json({
            success: false,
            error: 'Base parameters and variations array are required'
        });
    }

    const results = commissionEngine.simulate(baseParams, variations);

    res.json({
        success: true,
        data: {
            baseParams,
            variations: results
        }
    });
});

/**
 * Get commission summary for an agent
 */
exports.getAgentSummary = catchAsync(async (req, res) => {
    const { agentId } = req.params;

    const summary = commissionEngine.getAgentCommissionSummary(agentId);

    res.json({
        success: true,
        data: summary
    });
});

// ==================== COMMISSION RULES ====================

/**
 * Get all commission rules
 */
exports.getAllRules = catchAsync(async (req, res) => {
    const { type, active } = req.query;

    const filters = {};
    if (type) filters.type = type;
    if (active !== undefined) filters.active = active === 'true';

    const rules = commissionEngine.getAllRules(filters);

    res.json({
        success: true,
        data: {
            count: rules.length,
            rules
        }
    });
});

/**
 * Get a specific rule
 */
exports.getRule = catchAsync(async (req, res) => {
    const { ruleId } = req.params;

    const rule = commissionEngine.getRule(ruleId);

    if (!rule) {
        return res.status(404).json({
            success: false,
            error: 'Rule not found'
        });
    }

    res.json({
        success: true,
        data: rule
    });
});

/**
 * Create a new commission rule
 */
exports.createRule = catchAsync(async (req, res) => {
    const {
        name,
        type,
        priority,
        active,
        conditions,
        commission,
        serviceFee,
        validFrom,
        validTo
    } = req.body;

    if (!name || !type) {
        return res.status(400).json({
            success: false,
            error: 'Name and type are required'
        });
    }

    const rule = commissionEngine.createRule({
        name,
        type,
        priority,
        active,
        conditions,
        commission,
        serviceFee,
        validFrom,
        validTo
    });

    res.status(201).json({
        success: true,
        message: 'Rule created successfully',
        data: rule
    });
});

/**
 * Update a commission rule
 */
exports.updateRule = catchAsync(async (req, res) => {
    const { ruleId } = req.params;
    const updates = req.body;

    const rule = commissionEngine.updateRule(ruleId, updates);

    if (!rule) {
        return res.status(404).json({
            success: false,
            error: 'Rule not found'
        });
    }

    res.json({
        success: true,
        message: 'Rule updated successfully',
        data: rule
    });
});

/**
 * Delete a commission rule
 */
exports.deleteRule = catchAsync(async (req, res) => {
    const { ruleId } = req.params;

    const deleted = commissionEngine.deleteRule(ruleId);

    if (!deleted) {
        return res.status(404).json({
            success: false,
            error: 'Rule not found'
        });
    }

    res.json({
        success: true,
        message: 'Rule deleted successfully'
    });
});

/**
 * Get rules by type
 */
exports.getRulesByType = catchAsync(async (req, res) => {
    const { type } = req.params;

    const rules = commissionEngine.getRulesByType(type);

    res.json({
        success: true,
        data: {
            type,
            count: rules.length,
            rules
        }
    });
});

// ==================== AGENT GROUPS ====================

/**
 * Get all agent groups
 */
exports.getAllAgentGroups = catchAsync(async (req, res) => {
    const groups = commissionEngine.getAllAgentGroups();

    res.json({
        success: true,
        data: {
            count: groups.length,
            groups
        }
    });
});

/**
 * Get a specific agent group
 */
exports.getAgentGroup = catchAsync(async (req, res) => {
    const { groupId } = req.params;

    const group = commissionEngine.getAgentGroup(groupId);

    if (!group) {
        return res.status(404).json({
            success: false,
            error: 'Agent group not found'
        });
    }

    res.json({
        success: true,
        data: group
    });
});

/**
 * Create a new agent group
 */
exports.createAgentGroup = catchAsync(async (req, res) => {
    const {
        name,
        description,
        commissionBonus,
        serviceFeeDiscount,
        agents,
        apiGroups,
        customRules
    } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            error: 'Group name is required'
        });
    }

    const group = commissionEngine.createAgentGroup({
        name,
        description,
        commissionBonus,
        serviceFeeDiscount,
        agents,
        apiGroups,
        customRules
    });

    res.status(201).json({
        success: true,
        message: 'Agent group created successfully',
        data: group
    });
});

/**
 * Update an agent group
 */
exports.updateAgentGroup = catchAsync(async (req, res) => {
    const { groupId } = req.params;
    const updates = req.body;

    const group = commissionEngine.updateAgentGroup(groupId, updates);

    if (!group) {
        return res.status(404).json({
            success: false,
            error: 'Agent group not found'
        });
    }

    res.json({
        success: true,
        message: 'Agent group updated successfully',
        data: group
    });
});

/**
 * Delete an agent group
 */
exports.deleteAgentGroup = catchAsync(async (req, res) => {
    const { groupId } = req.params;

    const deleted = commissionEngine.deleteAgentGroup(groupId);

    if (!deleted) {
        return res.status(404).json({
            success: false,
            error: 'Agent group not found'
        });
    }

    res.json({
        success: true,
        message: 'Agent group deleted successfully'
    });
});

/**
 * Add agent to group
 */
exports.addAgentToGroup = catchAsync(async (req, res) => {
    const { groupId } = req.params;
    const { agentId } = req.body;

    if (!agentId) {
        return res.status(400).json({
            success: false,
            error: 'Agent ID is required'
        });
    }

    const success = commissionEngine.addAgentToGroup(groupId, agentId);

    if (!success) {
        return res.status(404).json({
            success: false,
            error: 'Agent group not found'
        });
    }

    res.json({
        success: true,
        message: `Agent ${agentId} added to group ${groupId}`
    });
});

/**
 * Remove agent from group
 */
exports.removeAgentFromGroup = catchAsync(async (req, res) => {
    const { groupId, agentId } = req.params;

    const success = commissionEngine.removeAgentFromGroup(groupId, agentId);

    if (!success) {
        return res.status(404).json({
            success: false,
            error: 'Agent group not found'
        });
    }

    res.json({
        success: true,
        message: `Agent ${agentId} removed from group ${groupId}`
    });
});

/**
 * Link API group to agent group
 */
exports.linkApiGroupToAgentGroup = catchAsync(async (req, res) => {
    const { groupId } = req.params;
    const { apiGroupId } = req.body;

    if (!apiGroupId) {
        return res.status(400).json({
            success: false,
            error: 'API group ID is required'
        });
    }

    const success = commissionEngine.linkApiGroupToAgentGroup(groupId, apiGroupId);

    if (!success) {
        return res.status(404).json({
            success: false,
            error: 'Agent group or API group not found'
        });
    }

    res.json({
        success: true,
        message: `API group ${apiGroupId} linked to agent group ${groupId}`
    });
});

// ==================== API GROUPS ====================

/**
 * Get all API groups
 */
exports.getAllApiGroups = catchAsync(async (req, res) => {
    const groups = commissionEngine.getAllApiGroups();

    res.json({
        success: true,
        data: {
            count: groups.length,
            groups
        }
    });
});

/**
 * Get a specific API group
 */
exports.getApiGroup = catchAsync(async (req, res) => {
    const { groupId } = req.params;

    const group = commissionEngine.getApiGroup(groupId);

    if (!group) {
        return res.status(404).json({
            success: false,
            error: 'API group not found'
        });
    }

    res.json({
        success: true,
        data: group
    });
});

/**
 * Create a new API group
 */
exports.createApiGroup = catchAsync(async (req, res) => {
    const {
        name,
        description,
        apis,
        commissionMultiplier,
        serviceFeeOverride,
        customRules
    } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            error: 'Group name is required'
        });
    }

    const group = commissionEngine.createApiGroup({
        name,
        description,
        apis,
        commissionMultiplier,
        serviceFeeOverride,
        customRules
    });

    res.status(201).json({
        success: true,
        message: 'API group created successfully',
        data: group
    });
});

/**
 * Update an API group
 */
exports.updateApiGroup = catchAsync(async (req, res) => {
    const { groupId } = req.params;
    const updates = req.body;

    const group = commissionEngine.updateApiGroup(groupId, updates);

    if (!group) {
        return res.status(404).json({
            success: false,
            error: 'API group not found'
        });
    }

    res.json({
        success: true,
        message: 'API group updated successfully',
        data: group
    });
});

/**
 * Delete an API group
 */
exports.deleteApiGroup = catchAsync(async (req, res) => {
    const { groupId } = req.params;

    const deleted = commissionEngine.deleteApiGroup(groupId);

    if (!deleted) {
        return res.status(404).json({
            success: false,
            error: 'API group not found'
        });
    }

    res.json({
        success: true,
        message: 'API group deleted successfully'
    });
});

/**
 * Add API to group
 */
exports.addApiToGroup = catchAsync(async (req, res) => {
    const { groupId } = req.params;
    const { apiId } = req.body;

    if (!apiId) {
        return res.status(400).json({
            success: false,
            error: 'API ID is required'
        });
    }

    const success = commissionEngine.addApiToGroup(groupId, apiId);

    if (!success) {
        return res.status(404).json({
            success: false,
            error: 'API group not found'
        });
    }

    res.json({
        success: true,
        message: `API ${apiId} added to group ${groupId}`
    });
});

/**
 * Remove API from group
 */
exports.removeApiFromGroup = catchAsync(async (req, res) => {
    const { groupId, apiId } = req.params;

    const success = commissionEngine.removeApiFromGroup(groupId, apiId);

    if (!success) {
        return res.status(404).json({
            success: false,
            error: 'API group not found'
        });
    }

    res.json({
        success: true,
        message: `API ${apiId} removed from group ${groupId}`
    });
});

// ==================== AGENT OVERRIDES ====================

/**
 * Get all agent overrides
 */
exports.getAllAgentOverrides = catchAsync(async (req, res) => {
    const overrides = commissionEngine.getAllAgentOverrides();

    res.json({
        success: true,
        data: {
            count: overrides.length,
            overrides
        }
    });
});

/**
 * Get override for specific agent
 */
exports.getAgentOverride = catchAsync(async (req, res) => {
    const { agentId } = req.params;

    const override = commissionEngine.getAgentOverride(agentId);

    if (!override) {
        return res.status(404).json({
            success: false,
            error: 'No override found for this agent'
        });
    }

    res.json({
        success: true,
        data: override
    });
});

/**
 * Set agent override
 */
exports.setAgentOverride = catchAsync(async (req, res) => {
    const { agentId } = req.params;
    const {
        commissionOverride,
        serviceFeeOverride,
        sharingOverride,
        notes
    } = req.body;

    const override = commissionEngine.setAgentOverride(agentId, {
        commissionOverride,
        serviceFeeOverride,
        sharingOverride,
        notes
    });

    res.json({
        success: true,
        message: `Override set for agent ${agentId}`,
        data: override
    });
});

/**
 * Delete agent override
 */
exports.deleteAgentOverride = catchAsync(async (req, res) => {
    const { agentId } = req.params;

    const deleted = commissionEngine.deleteAgentOverride(agentId);

    if (!deleted) {
        return res.status(404).json({
            success: false,
            error: 'No override found for this agent'
        });
    }

    res.json({
        success: true,
        message: `Override deleted for agent ${agentId}`
    });
});

// ==================== SERVICE FEES ====================

/**
 * Get all service fees
 */
exports.getAllServiceFees = catchAsync(async (req, res) => {
    const fees = commissionEngine.getAllServiceFees();

    res.json({
        success: true,
        data: {
            count: fees.length,
            fees
        }
    });
});

/**
 * Create a service fee rule
 */
exports.createServiceFee = catchAsync(async (req, res) => {
    const {
        name,
        type,
        value,
        conditions,
        appliesTo,
        minAmount,
        maxAmount
    } = req.body;

    if (!name || !type || value === undefined) {
        return res.status(400).json({
            success: false,
            error: 'Name, type, and value are required'
        });
    }

    const fee = commissionEngine.createServiceFee({
        name,
        type,
        value,
        conditions,
        appliesTo,
        minAmount,
        maxAmount
    });

    res.status(201).json({
        success: true,
        message: 'Service fee created successfully',
        data: fee
    });
});

/**
 * Update a service fee rule
 */
exports.updateServiceFee = catchAsync(async (req, res) => {
    const { feeId } = req.params;
    const updates = req.body;

    const fee = commissionEngine.updateServiceFee(feeId, updates);

    if (!fee) {
        return res.status(404).json({
            success: false,
            error: 'Service fee not found'
        });
    }

    res.json({
        success: true,
        message: 'Service fee updated successfully',
        data: fee
    });
});

/**
 * Delete a service fee rule
 */
exports.deleteServiceFee = catchAsync(async (req, res) => {
    const { feeId } = req.params;

    const deleted = commissionEngine.deleteServiceFee(feeId);

    if (!deleted) {
        return res.status(404).json({
            success: false,
            error: 'Service fee not found'
        });
    }

    res.json({
        success: true,
        message: 'Service fee deleted successfully'
    });
});
