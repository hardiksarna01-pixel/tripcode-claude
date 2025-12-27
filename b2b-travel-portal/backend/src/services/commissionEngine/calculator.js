/**
 * Commission Calculator
 * Calculates commission and service fees based on hierarchical rules
 *
 * Priority Hierarchy (highest to lowest):
 * 1. Agent-level override
 * 2. Route + Airline + Class specific rule
 * 3. Route + Airline rule
 * 4. Route + Class rule
 * 5. Route specific rule
 * 6. Airline + Class rule
 * 7. Airline specific rule
 * 8. Class specific rule
 * 9. API group rule
 * 10. Agent group rule
 * 11. Global default rule
 */

const ruleEngine = require('./ruleEngine');

class CommissionCalculator {
    constructor() {
        this.ruleEngine = ruleEngine;
    }

    /**
     * Calculate commission and service fee for a booking
     */
    calculate(bookingData) {
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
        } = bookingData;

        const totalFare = baseFare + (taxAmount || 0);

        // Get all applicable rules in priority order
        const applicableRules = this.getApplicableRules(bookingData);

        // Get agent-specific modifiers
        const agentModifiers = this.getAgentModifiers(agentId);

        // Get API-specific modifiers
        const apiModifiers = this.getApiModifiers(apiId, agentId);

        // Calculate base commission
        let commission = this.calculateBaseCommission(baseFare, applicableRules);

        // Apply class multiplier
        commission = this.applyClassMultiplier(commission, cabinClass, applicableRules);

        // Apply API group multiplier
        commission = this.applyApiMultiplier(commission, apiModifiers);

        // Apply agent group bonus/penalty
        commission = this.applyAgentBonus(commission, agentModifiers);

        // Apply agent-level override if exists
        const agentOverride = this.ruleEngine.getAgentOverride(agentId);
        if (agentOverride?.commissionOverride) {
            commission = this.applyAgentOverride(commission, baseFare, agentOverride);
        }

        // Calculate commission sharing (platform vs agent)
        const sharing = this.calculateSharing(commission, applicableRules, agentModifiers);

        // Calculate service fee
        const serviceFee = this.calculateServiceFee(bookingData, applicableRules, agentModifiers);

        // Build result
        const result = {
            baseFare,
            taxAmount: taxAmount || 0,
            totalFare,

            commission: {
                total: Math.round(commission * 100) / 100,
                platformShare: Math.round(sharing.platformAmount * 100) / 100,
                agentShare: Math.round(sharing.agentAmount * 100) / 100,
                percentage: Math.round((commission / baseFare) * 10000) / 100
            },

            serviceFee: {
                amount: Math.round(serviceFee * 100) / 100,
                type: this.getServiceFeeType(applicableRules)
            },

            netAmount: {
                platformReceives: Math.round((totalFare + serviceFee - sharing.agentAmount) * 100) / 100,
                agentReceives: Math.round(sharing.agentAmount * 100) / 100,
                customerPays: Math.round((totalFare + serviceFee) * 100) / 100
            },

            appliedRules: applicableRules.map(r => ({
                id: r.id,
                name: r.name,
                type: r.type,
                priority: r.priority
            })),

            modifiers: {
                agentGroup: agentModifiers.groupName,
                agentBonus: agentModifiers.commissionBonus,
                apiGroup: apiModifiers.groupName,
                apiMultiplier: apiModifiers.commissionMultiplier,
                hasAgentOverride: !!agentOverride
            }
        };

        return result;
    }

    /**
     * Get all applicable rules sorted by priority
     */
    getApplicableRules(bookingData) {
        const { origin, destination, airline, cabinClass, apiId } = bookingData;
        const allRules = this.ruleEngine.getAllRules({ active: true });
        const applicable = [];

        for (const rule of allRules) {
            if (this.ruleMatches(rule, bookingData)) {
                applicable.push(rule);
            }
        }

        // Sort by calculated priority score
        applicable.sort((a, b) => {
            const scoreA = this.calculateRulePriorityScore(a, bookingData);
            const scoreB = this.calculateRulePriorityScore(b, bookingData);
            return scoreB - scoreA;
        });

        return applicable;
    }

    /**
     * Check if a rule matches booking data
     */
    ruleMatches(rule, bookingData) {
        const { origin, destination, airline, cabinClass, apiId, isInternational } = bookingData;
        const conditions = rule.conditions || {};

        // Check validity period
        if (rule.validFrom && new Date() < new Date(rule.validFrom)) return false;
        if (rule.validTo && new Date() > new Date(rule.validTo)) return false;

        // Global rules always match
        if (rule.type === 'global') return true;

        // Route matching
        if (conditions.origin || conditions.destination) {
            const routeMatches = this.matchRoute(conditions, origin, destination);
            if (!routeMatches) return false;
        }

        // Airline matching
        if (conditions.airlines && conditions.airlines.length > 0) {
            if (!conditions.airlines.includes(airline)) return false;
        }

        // Class matching
        if (conditions.cabinClass) {
            if (conditions.cabinClass !== cabinClass) return false;
        }

        // API matching
        if (conditions.apis && conditions.apis.length > 0) {
            if (!conditions.apis.includes(apiId)) return false;
        }

        // International/Domestic matching
        if (conditions.tripCategory) {
            if (conditions.tripCategory === 'international' && !isInternational) return false;
            if (conditions.tripCategory === 'domestic' && isInternational) return false;
        }

        return true;
    }

    /**
     * Match route with bidirectional support
     */
    matchRoute(conditions, origin, destination) {
        if (conditions.bidirectional) {
            return (conditions.origin === origin && conditions.destination === destination) ||
                   (conditions.origin === destination && conditions.destination === origin);
        }

        if (conditions.origin && conditions.origin !== origin) return false;
        if (conditions.destination && conditions.destination !== destination) return false;

        return true;
    }

    /**
     * Calculate priority score for rule ordering
     */
    calculateRulePriorityScore(rule, bookingData) {
        let score = rule.priority * 10;
        const conditions = rule.conditions || {};

        // Add specificity bonus
        if (conditions.origin && conditions.destination) score += 100;
        else if (conditions.origin || conditions.destination) score += 50;

        if (conditions.airlines?.length > 0) score += 80;
        if (conditions.cabinClass) score += 40;
        if (conditions.apis?.length > 0) score += 30;

        return score;
    }

    /**
     * Calculate base commission from rules
     */
    calculateBaseCommission(baseFare, rules) {
        // Find the most specific applicable commission rule
        for (const rule of rules) {
            if (rule.commission && rule.commission.type !== 'multiplier') {
                if (rule.commission.type === 'percentage') {
                    return (baseFare * rule.commission.value) / 100;
                } else if (rule.commission.type === 'fixed') {
                    return rule.commission.value;
                }
            }
        }

        // Default 5% if no rule found
        return baseFare * 0.05;
    }

    /**
     * Apply cabin class multiplier
     */
    applyClassMultiplier(commission, cabinClass, rules) {
        for (const rule of rules) {
            if (rule.type === 'class' &&
                rule.conditions?.cabinClass === cabinClass &&
                rule.commission?.type === 'multiplier') {
                return commission * rule.commission.value;
            }
        }
        return commission;
    }

    /**
     * Get agent modifiers from groups
     */
    getAgentModifiers(agentId) {
        const groups = this.ruleEngine.getAgentGroups(agentId);

        if (groups.length === 0) {
            return {
                groupName: 'Standard',
                commissionBonus: 0,
                serviceFeeDiscount: 0,
                sharingOverride: null
            };
        }

        // Use the group with highest bonus
        const primaryGroup = groups.reduce((best, g) =>
            g.commissionBonus > best.commissionBonus ? g : best
        );

        return {
            groupId: primaryGroup.id,
            groupName: primaryGroup.name,
            commissionBonus: primaryGroup.commissionBonus || 0,
            serviceFeeDiscount: primaryGroup.serviceFeeDiscount || 0,
            sharingOverride: primaryGroup.sharingOverride || null
        };
    }

    /**
     * Get API modifiers from groups
     */
    getApiModifiers(apiId, agentId) {
        // Check if agent has specific API group access
        const agentGroups = this.ruleEngine.getAgentGroups(agentId);
        const allowedApiGroups = agentGroups.flatMap(g => g.apiGroups || []);

        const apiGroups = this.ruleEngine.getApiGroups(apiId);

        // Filter to allowed API groups if agent has restrictions
        let applicableGroups = apiGroups;
        if (allowedApiGroups.length > 0) {
            applicableGroups = apiGroups.filter(g => allowedApiGroups.includes(g.id));
        }

        if (applicableGroups.length === 0) {
            return {
                groupName: 'Default',
                commissionMultiplier: 1.0,
                serviceFeeOverride: null
            };
        }

        // Use the group with highest multiplier
        const primaryGroup = applicableGroups.reduce((best, g) =>
            g.commissionMultiplier > best.commissionMultiplier ? g : best
        );

        return {
            groupId: primaryGroup.id,
            groupName: primaryGroup.name,
            commissionMultiplier: primaryGroup.commissionMultiplier || 1.0,
            serviceFeeOverride: primaryGroup.serviceFeeOverride
        };
    }

    /**
     * Apply API multiplier to commission
     */
    applyApiMultiplier(commission, apiModifiers) {
        return commission * (apiModifiers.commissionMultiplier || 1.0);
    }

    /**
     * Apply agent group bonus to commission
     */
    applyAgentBonus(commission, agentModifiers) {
        const bonus = agentModifiers.commissionBonus || 0;
        return commission * (1 + bonus / 100);
    }

    /**
     * Apply agent-level override
     */
    applyAgentOverride(commission, baseFare, override) {
        if (override.commissionOverride.type === 'percentage') {
            return (baseFare * override.commissionOverride.value) / 100;
        } else if (override.commissionOverride.type === 'fixed') {
            return override.commissionOverride.value;
        } else if (override.commissionOverride.type === 'multiplier') {
            return commission * override.commissionOverride.value;
        }
        return commission;
    }

    /**
     * Calculate commission sharing between platform and agent
     */
    calculateSharing(totalCommission, rules, agentModifiers) {
        // Get sharing ratio from most specific rule
        let platformPercent = 40; // Default
        let agentPercent = 60;

        for (const rule of rules) {
            if (rule.commission?.sharing) {
                platformPercent = rule.commission.sharing.platform;
                agentPercent = rule.commission.sharing.agent;
                break;
            }
        }

        // Apply agent group override if exists
        if (agentModifiers.sharingOverride) {
            platformPercent = agentModifiers.sharingOverride.platform;
            agentPercent = agentModifiers.sharingOverride.agent;
        }

        return {
            platformPercent,
            agentPercent,
            platformAmount: (totalCommission * platformPercent) / 100,
            agentAmount: (totalCommission * agentPercent) / 100
        };
    }

    /**
     * Calculate service fee
     */
    calculateServiceFee(bookingData, rules, agentModifiers) {
        const { baseFare, passengers, segments, isInternational } = bookingData;
        let serviceFee = 0;

        // Find applicable service fee from rules
        for (const rule of rules) {
            if (rule.serviceFee && rule.serviceFee.value > 0) {
                const fee = rule.serviceFee;

                switch (fee.type) {
                    case 'fixed':
                        serviceFee = fee.value;
                        break;
                    case 'percentage':
                        serviceFee = (baseFare * fee.value) / 100;
                        break;
                    case 'per_pax':
                        serviceFee = fee.value * (passengers || 1);
                        break;
                    case 'per_segment':
                        serviceFee = fee.value * (segments || 1);
                        break;
                }
                break;
            }
        }

        // Apply agent group discount
        if (agentModifiers.serviceFeeDiscount > 0) {
            serviceFee = serviceFee * (1 - agentModifiers.serviceFeeDiscount / 100);
        }

        // Apply min/max constraints
        const allServiceFees = this.ruleEngine.getAllServiceFees();
        for (const fee of allServiceFees) {
            if (fee.active && fee.minAmount && serviceFee < fee.minAmount) {
                serviceFee = fee.minAmount;
            }
            if (fee.active && fee.maxAmount && serviceFee > fee.maxAmount) {
                serviceFee = fee.maxAmount;
            }
        }

        return Math.max(0, serviceFee);
    }

    /**
     * Get service fee type description
     */
    getServiceFeeType(rules) {
        for (const rule of rules) {
            if (rule.serviceFee?.value > 0) {
                return rule.serviceFee.type;
            }
        }
        return 'fixed';
    }

    /**
     * Bulk calculate for multiple bookings
     */
    calculateBulk(bookings) {
        return bookings.map(booking => ({
            bookingId: booking.bookingId,
            ...this.calculate(booking)
        }));
    }

    /**
     * Simulate calculation with different parameters
     */
    simulate(baseParams, variations) {
        const results = [];

        for (const variation of variations) {
            const params = { ...baseParams, ...variation };
            results.push({
                variation,
                result: this.calculate(params)
            });
        }

        return results;
    }

    /**
     * Get commission summary for an agent
     */
    getAgentCommissionSummary(agentId) {
        const groups = this.ruleEngine.getAgentGroups(agentId);
        const override = this.ruleEngine.getAgentOverride(agentId);

        return {
            agentId,
            groups: groups.map(g => ({
                id: g.id,
                name: g.name,
                commissionBonus: g.commissionBonus,
                serviceFeeDiscount: g.serviceFeeDiscount
            })),
            hasOverride: !!override,
            override: override ? {
                commissionOverride: override.commissionOverride,
                serviceFeeOverride: override.serviceFeeOverride
            } : null,
            linkedApiGroups: groups.flatMap(g => g.apiGroups || [])
        };
    }
}

module.exports = new CommissionCalculator();
module.exports.CommissionCalculator = CommissionCalculator;
