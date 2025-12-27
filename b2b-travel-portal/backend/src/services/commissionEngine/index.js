/**
 * Commission Engine
 * Main entry point for commission and service fee management
 */

const ruleEngine = require('./ruleEngine');
const calculator = require('./calculator');

module.exports = {
    // Rule Engine exports
    ruleEngine,

    // Calculator exports
    calculator,

    // Convenience methods
    calculateCommission: (bookingData) => calculator.calculate(bookingData),
    calculateBulk: (bookings) => calculator.calculateBulk(bookings),
    simulate: (baseParams, variations) => calculator.simulate(baseParams, variations),

    // Rule management
    createRule: (ruleData) => ruleEngine.createRule(ruleData),
    updateRule: (ruleId, updates) => ruleEngine.updateRule(ruleId, updates),
    deleteRule: (ruleId) => ruleEngine.deleteRule(ruleId),
    getRule: (ruleId) => ruleEngine.getRule(ruleId),
    getAllRules: (filters) => ruleEngine.getAllRules(filters),
    getRulesByType: (type) => ruleEngine.getRulesByType(type),

    // Agent group management
    createAgentGroup: (groupData) => ruleEngine.createAgentGroup(groupData),
    updateAgentGroup: (groupId, updates) => ruleEngine.updateAgentGroup(groupId, updates),
    deleteAgentGroup: (groupId) => ruleEngine.deleteAgentGroup(groupId),
    getAgentGroup: (groupId) => ruleEngine.getAgentGroup(groupId),
    getAllAgentGroups: () => ruleEngine.getAllAgentGroups(),
    addAgentToGroup: (groupId, agentId) => ruleEngine.addAgentToGroup(groupId, agentId),
    removeAgentFromGroup: (groupId, agentId) => ruleEngine.removeAgentFromGroup(groupId, agentId),
    getAgentGroups: (agentId) => ruleEngine.getAgentGroups(agentId),

    // API group management
    createApiGroup: (groupData) => ruleEngine.createApiGroup(groupData),
    updateApiGroup: (groupId, updates) => ruleEngine.updateApiGroup(groupId, updates),
    deleteApiGroup: (groupId) => ruleEngine.deleteApiGroup(groupId),
    getApiGroup: (groupId) => ruleEngine.getApiGroup(groupId),
    getAllApiGroups: () => ruleEngine.getAllApiGroups(),
    addApiToGroup: (groupId, apiId) => ruleEngine.addApiToGroup(groupId, apiId),
    removeApiFromGroup: (groupId, apiId) => ruleEngine.removeApiFromGroup(groupId, apiId),
    getApiGroups: (apiId) => ruleEngine.getApiGroups(apiId),
    linkApiGroupToAgentGroup: (agentGroupId, apiGroupId) =>
        ruleEngine.linkApiGroupToAgentGroup(agentGroupId, apiGroupId),

    // Agent overrides
    setAgentOverride: (agentId, overrideData) => ruleEngine.setAgentOverride(agentId, overrideData),
    getAgentOverride: (agentId) => ruleEngine.getAgentOverride(agentId),
    deleteAgentOverride: (agentId) => ruleEngine.deleteAgentOverride(agentId),
    getAllAgentOverrides: () => ruleEngine.getAllAgentOverrides(),

    // Service fees
    createServiceFee: (feeData) => ruleEngine.createServiceFee(feeData),
    updateServiceFee: (feeId, updates) => ruleEngine.updateServiceFee(feeId, updates),
    deleteServiceFee: (feeId) => ruleEngine.deleteServiceFee(feeId),
    getAllServiceFees: () => ruleEngine.getAllServiceFees(),

    // Summary
    getAgentCommissionSummary: (agentId) => calculator.getAgentCommissionSummary(agentId)
};
