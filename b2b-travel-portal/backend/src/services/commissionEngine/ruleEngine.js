/**
 * Commission Rule Engine
 * Manages route-specific, airline-specific, and class-specific commission rules
 * Supports agent groups, individual agents, and API groupings
 */

const { v4: uuidv4 } = require('uuid');

class CommissionRuleEngine {
    constructor() {
        // Rule storage (use database in production)
        this.rules = new Map();
        this.agentGroups = new Map();
        this.apiGroups = new Map();
        this.agentOverrides = new Map();
        this.serviceFees = new Map();

        // Load default rules
        this.loadDefaultRules();
        this.loadDefaultGroups();

        console.log('[CommissionRuleEngine] Initialized');
    }

    /**
     * Load default commission rules
     */
    loadDefaultRules() {
        // Default global rule
        this.createRule({
            id: 'default_global',
            name: 'Default Global Commission',
            type: 'global',
            priority: 0,
            active: true,
            commission: {
                type: 'percentage', // percentage or fixed
                value: 5,
                sharing: {
                    platform: 40,  // Platform keeps 40%
                    agent: 60      // Agent gets 60%
                }
            },
            serviceFee: {
                type: 'fixed',
                value: 0
            }
        });

        // Sample airline-specific rules
        const airlineRules = [
            { airline: '6E', name: 'IndiGo', commission: 3, platformShare: 30 },
            { airline: 'SG', name: 'SpiceJet', commission: 4, platformShare: 35 },
            { airline: 'AI', name: 'Air India', commission: 5, platformShare: 40 },
            { airline: 'UK', name: 'Vistara', commission: 4.5, platformShare: 35 },
            { airline: 'G8', name: 'GoAir', commission: 3.5, platformShare: 30 },
            { airline: 'EK', name: 'Emirates', commission: 7, platformShare: 45 },
            { airline: 'EY', name: 'Etihad', commission: 6.5, platformShare: 45 },
            { airline: 'QR', name: 'Qatar Airways', commission: 7, platformShare: 45 }
        ];

        airlineRules.forEach(rule => {
            this.createRule({
                id: `airline_${rule.airline}`,
                name: `${rule.name} Commission`,
                type: 'airline',
                priority: 10,
                active: true,
                conditions: {
                    airlines: [rule.airline]
                },
                commission: {
                    type: 'percentage',
                    value: rule.commission,
                    sharing: {
                        platform: rule.platformShare,
                        agent: 100 - rule.platformShare
                    }
                }
            });
        });

        // Sample class-specific rules
        const classRules = [
            { class: 'economy', name: 'Economy Class', multiplier: 1.0 },
            { class: 'premium_economy', name: 'Premium Economy', multiplier: 1.2 },
            { class: 'business', name: 'Business Class', multiplier: 1.5 },
            { class: 'first', name: 'First Class', multiplier: 2.0 }
        ];

        classRules.forEach(rule => {
            this.createRule({
                id: `class_${rule.class}`,
                name: `${rule.name} Commission`,
                type: 'class',
                priority: 5,
                active: true,
                conditions: {
                    cabinClass: rule.class
                },
                commission: {
                    type: 'multiplier',
                    value: rule.multiplier
                }
            });
        });

        // Sample route-specific rules (high-value routes)
        const routeRules = [
            { origin: 'DEL', destination: 'BOM', name: 'Delhi-Mumbai', commission: 4, serviceFee: 150 },
            { origin: 'DEL', destination: 'BLR', name: 'Delhi-Bangalore', commission: 4, serviceFee: 150 },
            { origin: 'BOM', destination: 'BLR', name: 'Mumbai-Bangalore', commission: 3.5, serviceFee: 100 },
            { origin: 'DEL', destination: 'CCU', name: 'Delhi-Kolkata', commission: 3.5, serviceFee: 100 },
            { origin: 'DEL', destination: 'DXB', name: 'Delhi-Dubai', commission: 6, serviceFee: 500 },
            { origin: 'BOM', destination: 'LHR', name: 'Mumbai-London', commission: 7, serviceFee: 1000 },
            { origin: 'DEL', destination: 'JFK', name: 'Delhi-New York', commission: 8, serviceFee: 1500 }
        ];

        routeRules.forEach(rule => {
            this.createRule({
                id: `route_${rule.origin}_${rule.destination}`,
                name: `${rule.name} Route Commission`,
                type: 'route',
                priority: 20,
                active: true,
                conditions: {
                    origin: rule.origin,
                    destination: rule.destination,
                    bidirectional: true
                },
                commission: {
                    type: 'percentage',
                    value: rule.commission
                },
                serviceFee: {
                    type: 'fixed',
                    value: rule.serviceFee
                }
            });
        });
    }

    /**
     * Load default agent and API groups
     */
    loadDefaultGroups() {
        // Default agent groups
        this.createAgentGroup({
            id: 'premium_agents',
            name: 'Premium Agents',
            description: 'High-volume agents with better commission rates',
            commissionBonus: 10, // 10% extra on base commission
            agents: []
        });

        this.createAgentGroup({
            id: 'standard_agents',
            name: 'Standard Agents',
            description: 'Regular agents with standard rates',
            commissionBonus: 0,
            agents: []
        });

        this.createAgentGroup({
            id: 'new_agents',
            name: 'New Agents',
            description: 'New agents in probation period',
            commissionBonus: -20, // 20% less than standard
            agents: []
        });

        // Default API groups
        this.createApiGroup({
            id: 'gds_apis',
            name: 'GDS Providers',
            description: 'Amadeus, Sabre, Travelport',
            apis: ['amadeus', 'sabre', 'travelport'],
            commissionMultiplier: 1.0
        });

        this.createApiGroup({
            id: 'lcc_apis',
            name: 'LCC Direct APIs',
            description: 'Low-cost carrier direct connections',
            apis: ['indigo', 'spicejet', 'goair', 'airasia'],
            commissionMultiplier: 0.8 // Lower commission on LCC
        });

        this.createApiGroup({
            id: 'consolidator_apis',
            name: 'Consolidator APIs',
            description: 'TripJack, TBO, etc.',
            apis: ['tripjack', 'tbo', 'via', 'flightstore'],
            commissionMultiplier: 1.2 // Better commission from consolidators
        });

        this.createApiGroup({
            id: 'international_apis',
            name: 'International APIs',
            description: 'Emirates, Etihad, Qatar direct',
            apis: ['emirates', 'etihad', 'qatar', 'singapore_air'],
            commissionMultiplier: 1.5 // Higher commission on international
        });
    }

    // ==================== RULE MANAGEMENT ====================

    /**
     * Create a new commission rule
     */
    createRule(ruleData) {
        const rule = {
            id: ruleData.id || uuidv4(),
            name: ruleData.name,
            type: ruleData.type, // global, airline, route, class, api, agent_group
            priority: ruleData.priority || 0,
            active: ruleData.active !== false,
            conditions: ruleData.conditions || {},
            commission: ruleData.commission || { type: 'percentage', value: 0 },
            serviceFee: ruleData.serviceFee || { type: 'fixed', value: 0 },
            validFrom: ruleData.validFrom || null,
            validTo: ruleData.validTo || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.rules.set(rule.id, rule);
        return rule;
    }

    /**
     * Update an existing rule
     */
    updateRule(ruleId, updates) {
        const rule = this.rules.get(ruleId);
        if (!rule) return null;

        Object.assign(rule, updates, { updatedAt: new Date().toISOString() });
        return rule;
    }

    /**
     * Delete a rule
     */
    deleteRule(ruleId) {
        return this.rules.delete(ruleId);
    }

    /**
     * Get rule by ID
     */
    getRule(ruleId) {
        return this.rules.get(ruleId);
    }

    /**
     * Get all rules
     */
    getAllRules(filters = {}) {
        let rules = Array.from(this.rules.values());

        if (filters.type) {
            rules = rules.filter(r => r.type === filters.type);
        }
        if (filters.active !== undefined) {
            rules = rules.filter(r => r.active === filters.active);
        }

        return rules.sort((a, b) => b.priority - a.priority);
    }

    /**
     * Get rules by type
     */
    getRulesByType(type) {
        return Array.from(this.rules.values())
            .filter(r => r.type === type && r.active)
            .sort((a, b) => b.priority - a.priority);
    }

    // ==================== AGENT GROUP MANAGEMENT ====================

    /**
     * Create agent group
     */
    createAgentGroup(groupData) {
        const group = {
            id: groupData.id || uuidv4(),
            name: groupData.name,
            description: groupData.description,
            commissionBonus: groupData.commissionBonus || 0, // Percentage bonus/penalty
            serviceFeeDiscount: groupData.serviceFeeDiscount || 0,
            agents: groupData.agents || [],
            apiGroups: groupData.apiGroups || [], // Linked API groups
            customRules: groupData.customRules || [], // Custom rule IDs
            active: groupData.active !== false,
            createdAt: new Date().toISOString()
        };

        this.agentGroups.set(group.id, group);
        return group;
    }

    /**
     * Update agent group
     */
    updateAgentGroup(groupId, updates) {
        const group = this.agentGroups.get(groupId);
        if (!group) return null;

        Object.assign(group, updates);
        return group;
    }

    /**
     * Delete agent group
     */
    deleteAgentGroup(groupId) {
        return this.agentGroups.delete(groupId);
    }

    /**
     * Get agent group
     */
    getAgentGroup(groupId) {
        return this.agentGroups.get(groupId);
    }

    /**
     * Get all agent groups
     */
    getAllAgentGroups() {
        return Array.from(this.agentGroups.values());
    }

    /**
     * Add agent to group
     */
    addAgentToGroup(groupId, agentId) {
        const group = this.agentGroups.get(groupId);
        if (!group) return false;

        if (!group.agents.includes(agentId)) {
            group.agents.push(agentId);
        }
        return true;
    }

    /**
     * Remove agent from group
     */
    removeAgentFromGroup(groupId, agentId) {
        const group = this.agentGroups.get(groupId);
        if (!group) return false;

        group.agents = group.agents.filter(a => a !== agentId);
        return true;
    }

    /**
     * Get agent's group
     */
    getAgentGroups(agentId) {
        const groups = [];
        for (const [, group] of this.agentGroups) {
            if (group.agents.includes(agentId)) {
                groups.push(group);
            }
        }
        return groups;
    }

    /**
     * Link API group to agent group
     */
    linkApiGroupToAgentGroup(agentGroupId, apiGroupId) {
        const agentGroup = this.agentGroups.get(agentGroupId);
        const apiGroup = this.apiGroups.get(apiGroupId);

        if (!agentGroup || !apiGroup) return false;

        if (!agentGroup.apiGroups.includes(apiGroupId)) {
            agentGroup.apiGroups.push(apiGroupId);
        }
        return true;
    }

    // ==================== API GROUP MANAGEMENT ====================

    /**
     * Create API group
     */
    createApiGroup(groupData) {
        const group = {
            id: groupData.id || uuidv4(),
            name: groupData.name,
            description: groupData.description,
            apis: groupData.apis || [],
            commissionMultiplier: groupData.commissionMultiplier || 1.0,
            serviceFeeOverride: groupData.serviceFeeOverride || null,
            customRules: groupData.customRules || [],
            active: groupData.active !== false,
            createdAt: new Date().toISOString()
        };

        this.apiGroups.set(group.id, group);
        return group;
    }

    /**
     * Update API group
     */
    updateApiGroup(groupId, updates) {
        const group = this.apiGroups.get(groupId);
        if (!group) return null;

        Object.assign(group, updates);
        return group;
    }

    /**
     * Delete API group
     */
    deleteApiGroup(groupId) {
        return this.apiGroups.delete(groupId);
    }

    /**
     * Get API group
     */
    getApiGroup(groupId) {
        return this.apiGroups.get(groupId);
    }

    /**
     * Get all API groups
     */
    getAllApiGroups() {
        return Array.from(this.apiGroups.values());
    }

    /**
     * Add API to group
     */
    addApiToGroup(groupId, apiId) {
        const group = this.apiGroups.get(groupId);
        if (!group) return false;

        if (!group.apis.includes(apiId)) {
            group.apis.push(apiId);
        }
        return true;
    }

    /**
     * Remove API from group
     */
    removeApiFromGroup(groupId, apiId) {
        const group = this.apiGroups.get(groupId);
        if (!group) return false;

        group.apis = group.apis.filter(a => a !== apiId);
        return true;
    }

    /**
     * Get API's groups
     */
    getApiGroups(apiId) {
        const groups = [];
        for (const [, group] of this.apiGroups) {
            if (group.apis.includes(apiId)) {
                groups.push(group);
            }
        }
        return groups;
    }

    // ==================== AGENT-LEVEL OVERRIDES ====================

    /**
     * Set agent-level commission override
     */
    setAgentOverride(agentId, overrideData) {
        const override = {
            agentId,
            ...overrideData,
            updatedAt: new Date().toISOString()
        };

        this.agentOverrides.set(agentId, override);
        return override;
    }

    /**
     * Get agent override
     */
    getAgentOverride(agentId) {
        return this.agentOverrides.get(agentId);
    }

    /**
     * Delete agent override
     */
    deleteAgentOverride(agentId) {
        return this.agentOverrides.delete(agentId);
    }

    /**
     * Get all agent overrides
     */
    getAllAgentOverrides() {
        return Array.from(this.agentOverrides.values());
    }

    // ==================== SERVICE FEE MANAGEMENT ====================

    /**
     * Create service fee rule
     */
    createServiceFee(feeData) {
        const fee = {
            id: feeData.id || uuidv4(),
            name: feeData.name,
            type: feeData.type, // fixed, percentage, per_pax, per_segment
            value: feeData.value,
            conditions: feeData.conditions || {},
            appliesTo: feeData.appliesTo || 'all', // all, domestic, international
            minAmount: feeData.minAmount || 0,
            maxAmount: feeData.maxAmount || null,
            active: feeData.active !== false,
            createdAt: new Date().toISOString()
        };

        this.serviceFees.set(fee.id, fee);
        return fee;
    }

    /**
     * Update service fee
     */
    updateServiceFee(feeId, updates) {
        const fee = this.serviceFees.get(feeId);
        if (!fee) return null;

        Object.assign(fee, updates);
        return fee;
    }

    /**
     * Delete service fee
     */
    deleteServiceFee(feeId) {
        return this.serviceFees.delete(feeId);
    }

    /**
     * Get all service fees
     */
    getAllServiceFees() {
        return Array.from(this.serviceFees.values());
    }
}

module.exports = new CommissionRuleEngine();
module.exports.CommissionRuleEngine = CommissionRuleEngine;
