/**
 * Commission Calculation Service
 * Handles airline-level and class-of-service level commission calculations
 */

const { Op } = require('sequelize');

class CommissionService {
    constructor(db) {
        this.db = db;
    }

    /**
     * Calculate commission for a flight booking
     * @param {Object} params - Flight booking parameters
     * @returns {Object} Commission breakdown
     */
    async calculateFlightCommission({
        tenantId,
        supplierId,
        agentId,
        airlineCode,
        cabinClass,
        fareClass,
        origin,
        destination,
        travelType, // DOMESTIC or INTERNATIONAL
        baseFare,
        yqAmount = 0, // Fuel surcharge
        yrAmount = 0, // Other surcharges
        taxes,
        totalFare,
        travelDate,
        bookingDate = new Date()
    }) {
        const result = {
            ruleApplied: null,
            ruleId: null,
            baseFareCommission: 0,
            yqCommission: 0,
            totalSupplierCommission: 0,
            plbAmount: 0,
            incentiveAmount: 0,
            specialDealAmount: 0,
            agentSharePercentage: 0,
            agentCommission: 0,
            platformCommission: 0,
            breakdown: []
        };

        try {
            // Step 1: Get airline master commission
            const airlineMaster = await this._getAirlineCommission(tenantId, supplierId, airlineCode);

            if (!airlineMaster) {
                // Fallback to supplier default
                return this._applySupplierDefault(tenantId, supplierId, baseFare, totalFare);
            }

            // Step 2: Check for route-specific rules (highest priority)
            let commissionRule = await this._getRouteCommission(
                tenantId, airlineMaster.id, airlineCode,
                origin, destination, cabinClass, fareClass, travelType, travelDate
            );

            if (commissionRule) {
                result.ruleApplied = 'ROUTE_SPECIFIC';
                result.ruleId = commissionRule.id;
            }

            // Step 3: Check for class-specific rules if no route rule
            if (!commissionRule && airlineMaster.has_class_rules) {
                commissionRule = await this._getClassCommission(
                    tenantId, airlineMaster.id, airlineCode,
                    cabinClass, fareClass, travelType
                );

                if (commissionRule) {
                    result.ruleApplied = 'CLASS_SPECIFIC';
                    result.ruleId = commissionRule.id;
                }
            }

            // Step 4: Fallback to airline default
            if (!commissionRule) {
                commissionRule = {
                    commission_type: airlineMaster.default_commission_type,
                    commission_value: airlineMaster.default_commission_value,
                    yq_commission_type: null,
                    yq_commission_value: 0
                };
                result.ruleApplied = 'AIRLINE_DEFAULT';
            }

            // Step 5: Calculate base fare commission
            result.baseFareCommission = this._calculateAmount(
                baseFare,
                commissionRule.commission_type,
                commissionRule.commission_value
            );

            result.breakdown.push({
                component: 'Base Fare Commission',
                fare: baseFare,
                type: commissionRule.commission_type,
                rate: commissionRule.commission_value,
                amount: result.baseFareCommission
            });

            // Step 6: Calculate YQ commission if applicable
            if (commissionRule.yq_commission_type && yqAmount > 0) {
                result.yqCommission = this._calculateAmount(
                    yqAmount,
                    commissionRule.yq_commission_type,
                    commissionRule.yq_commission_value
                );

                result.breakdown.push({
                    component: 'YQ Commission',
                    fare: yqAmount,
                    type: commissionRule.yq_commission_type,
                    rate: commissionRule.yq_commission_value,
                    amount: result.yqCommission
                });
            }

            result.totalSupplierCommission = result.baseFareCommission + result.yqCommission;

            // Step 7: Check for PLB
            if (airlineMaster.plb_enabled) {
                const plbEligible = await this._checkPLBEligibility(
                    tenantId, agentId, airlineCode,
                    airlineMaster.plb_threshold_bookings,
                    airlineMaster.plb_threshold_revenue
                );

                if (plbEligible) {
                    result.plbAmount = (baseFare * airlineMaster.plb_percentage) / 100;
                    result.breakdown.push({
                        component: 'PLB Bonus',
                        rate: airlineMaster.plb_percentage,
                        amount: result.plbAmount
                    });
                }
            }

            // Step 8: Check for incentive slabs
            if (airlineMaster.incentive_slabs && airlineMaster.incentive_slabs.length > 0) {
                const incentive = await this._calculateIncentive(
                    tenantId, agentId, airlineCode, baseFare, airlineMaster.incentive_slabs
                );
                result.incentiveAmount = incentive;
            }

            // Step 9: Check for special deals
            const specialDeal = await this._getSpecialDeal(
                tenantId, airlineCode, cabinClass, fareClass, origin, destination, bookingDate
            );

            if (specialDeal) {
                result.specialDealAmount = this._calculateAmount(
                    result.totalSupplierCommission,
                    specialDeal.boost_type,
                    specialDeal.boost_value
                );
                result.breakdown.push({
                    component: `Special Deal: ${specialDeal.deal_name}`,
                    type: specialDeal.boost_type,
                    rate: specialDeal.boost_value,
                    amount: result.specialDealAmount
                });
            }

            // Step 10: Calculate agent share
            const agentOverride = await this._getAgentOverride(
                tenantId, agentId, airlineCode, cabinClass, travelType
            );

            if (agentOverride) {
                if (agentOverride.fixed_commission_type) {
                    result.agentCommission = this._calculateAmount(
                        baseFare,
                        agentOverride.fixed_commission_type,
                        agentOverride.fixed_commission_value
                    );
                    result.agentSharePercentage = 100;
                } else {
                    result.agentSharePercentage = agentOverride.commission_share_percentage;
                }
            } else {
                // Get from agent's scheme
                result.agentSharePercentage = await this._getSchemeCommissionShare(
                    agentId, travelType
                );
            }

            // Calculate agent commission from total
            const totalCommission = result.totalSupplierCommission +
                                   result.plbAmount +
                                   result.incentiveAmount +
                                   result.specialDealAmount;

            if (!agentOverride?.fixed_commission_type) {
                result.agentCommission = (totalCommission * result.agentSharePercentage) / 100;
            }

            result.platformCommission = totalCommission - result.agentCommission;

            // Round all values to 2 decimal places
            Object.keys(result).forEach(key => {
                if (typeof result[key] === 'number') {
                    result[key] = Math.round(result[key] * 100) / 100;
                }
            });

            return result;

        } catch (error) {
            console.error('Commission calculation error:', error);
            throw error;
        }
    }

    /**
     * Get airline commission master record
     */
    async _getAirlineCommission(tenantId, supplierId, airlineCode) {
        // In production, use actual Sequelize model
        const query = `
            SELECT * FROM airline_commission_master
            WHERE tenant_id = $1
            AND (supplier_id = $2 OR supplier_id IS NULL)
            AND airline_code = $3
            AND is_active = true
            AND (valid_from IS NULL OR valid_from <= CURRENT_DATE)
            AND (valid_to IS NULL OR valid_to >= CURRENT_DATE)
            ORDER BY supplier_id NULLS LAST
            LIMIT 1
        `;

        // Mock return for now
        return {
            id: 1,
            default_commission_type: 'PERCENTAGE',
            default_commission_value: 5.0,
            plb_enabled: true,
            plb_percentage: 1.0,
            plb_threshold_bookings: 50,
            plb_threshold_revenue: 500000,
            has_class_rules: true,
            has_route_rules: false,
            incentive_slabs: [
                { min: 0, max: 50, bonus: 0 },
                { min: 51, max: 100, bonus: 0.5 },
                { min: 101, max: 200, bonus: 1.0 }
            ]
        };
    }

    /**
     * Get route-specific commission
     */
    async _getRouteCommission(tenantId, airlineCommId, airlineCode, origin, destination, cabinClass, fareClass, travelType, travelDate) {
        const query = `
            SELECT * FROM route_commission_rules
            WHERE tenant_id = $1
            AND airline_code = $2
            AND is_active = true
            AND (origin IS NULL OR origin = $3)
            AND (destination IS NULL OR destination = $4)
            AND (cabin_class IS NULL OR cabin_class = $5)
            AND (fare_classes IS NULL OR fare_classes LIKE $6)
            AND (travel_type IS NULL OR travel_type = $7)
            AND (travel_date_from IS NULL OR travel_date_from <= $8)
            AND (travel_date_to IS NULL OR travel_date_to >= $8)
            ORDER BY priority DESC,
                     origin NULLS LAST,
                     destination NULLS LAST,
                     cabin_class NULLS LAST
            LIMIT 1
        `;

        // Return null for now - would query DB in production
        return null;
    }

    /**
     * Get class-specific commission
     */
    async _getClassCommission(tenantId, airlineCommId, airlineCode, cabinClass, fareClass, travelType) {
        // First try exact fare class match
        // Then try cabin class match
        // In production, would query class_commission_rules table

        // Mock return based on common patterns
        const classRules = {
            '6E': {
                'ECONOMY': { 'Y,B,M,H,K': 7.0, 'L,Q,T,N,R,X,G,V': 5.0, 'S,W': 3.0 }
            },
            'AI': {
                'FIRST': { default: 9.0 },
                'BUSINESS': { default: 7.0 },
                'PREMIUM_ECONOMY': { default: 6.0 },
                'ECONOMY': { 'Y,B,M,H,K': 5.0, default: 3.0 }
            }
        };

        const airlineRules = classRules[airlineCode];
        if (!airlineRules) return null;

        const cabinRules = airlineRules[cabinClass];
        if (!cabinRules) return null;

        // Find matching fare class rule
        for (const [classes, rate] of Object.entries(cabinRules)) {
            if (classes === 'default' || classes.split(',').includes(fareClass)) {
                return {
                    id: 1,
                    commission_type: 'PERCENTAGE',
                    commission_value: rate,
                    yq_commission_type: null,
                    yq_commission_value: 0
                };
            }
        }

        return null;
    }

    /**
     * Calculate amount based on type
     */
    _calculateAmount(baseAmount, type, value) {
        switch (type) {
            case 'PERCENTAGE':
                return (baseAmount * value) / 100;
            case 'FLAT':
                return value;
            case 'PER_PAX':
                return value; // Would multiply by pax count
            case 'ADDITIONAL_PERCENTAGE':
                return (baseAmount * value) / 100;
            case 'ADDITIONAL_FLAT':
                return value;
            default:
                return 0;
        }
    }

    /**
     * Check PLB eligibility
     */
    async _checkPLBEligibility(tenantId, agentId, airlineCode, thresholdBookings, thresholdRevenue) {
        // In production, would query booking stats for current month
        // Return true for demo
        return true;
    }

    /**
     * Calculate incentive based on slabs
     */
    async _calculateIncentive(tenantId, agentId, airlineCode, baseFare, slabs) {
        // Get current month booking count for this airline
        const bookingCount = 75; // Mock value

        for (const slab of slabs) {
            if (bookingCount >= slab.min && bookingCount <= slab.max) {
                return (baseFare * slab.bonus) / 100;
            }
        }
        return 0;
    }

    /**
     * Get active special deal
     */
    async _getSpecialDeal(tenantId, airlineCode, cabinClass, fareClass, origin, destination, bookingDate) {
        // In production, query special_commission_deals table
        return null;
    }

    /**
     * Get agent-specific override
     */
    async _getAgentOverride(tenantId, agentId, airlineCode, cabinClass, travelType) {
        // In production, query agent_commission_overrides table
        return null;
    }

    /**
     * Get commission share from agent's scheme
     */
    async _getSchemeCommissionShare(agentId, travelType) {
        // In production, join agents -> schemes table
        // Return share percentage
        return travelType === 'DOMESTIC' ? 60 : 50; // Mock values
    }

    /**
     * Apply supplier default commission
     */
    async _applySupplierDefault(tenantId, supplierId, baseFare, totalFare) {
        // Get supplier default commission
        return {
            ruleApplied: 'SUPPLIER_DEFAULT',
            baseFareCommission: baseFare * 0.05, // 5% default
            yqCommission: 0,
            totalSupplierCommission: baseFare * 0.05,
            plbAmount: 0,
            incentiveAmount: 0,
            specialDealAmount: 0,
            agentSharePercentage: 50,
            agentCommission: baseFare * 0.025,
            platformCommission: baseFare * 0.025,
            breakdown: [{
                component: 'Supplier Default',
                rate: 5,
                amount: baseFare * 0.05
            }]
        };
    }

    /**
     * Log commission calculation for audit
     */
    async logCalculation(bookingId, flightDetails, commissionResult) {
        const logEntry = {
            booking_id: bookingId,
            airline_code: flightDetails.airlineCode,
            flight_number: flightDetails.flightNumber,
            origin: flightDetails.origin,
            destination: flightDetails.destination,
            cabin_class: flightDetails.cabinClass,
            fare_class: flightDetails.fareClass,
            travel_type: flightDetails.travelType,
            base_fare: flightDetails.baseFare,
            yq_amount: flightDetails.yqAmount,
            yr_amount: flightDetails.yrAmount,
            taxes: flightDetails.taxes,
            total_fare: flightDetails.totalFare,
            rule_applied: commissionResult.ruleApplied,
            rule_id: commissionResult.ruleId,
            base_fare_commission: commissionResult.baseFareCommission,
            yq_commission: commissionResult.yqCommission,
            total_supplier_commission: commissionResult.totalSupplierCommission,
            plb_applicable: commissionResult.plbAmount > 0,
            plb_amount: commissionResult.plbAmount,
            incentive_amount: commissionResult.incentiveAmount,
            special_deal_amount: commissionResult.specialDealAmount,
            agent_share_percentage: commissionResult.agentSharePercentage,
            agent_commission: commissionResult.agentCommission,
            platform_commission: commissionResult.platformCommission
        };

        // In production, insert into commission_calculation_log table
        console.log('Commission logged:', logEntry);
        return logEntry;
    }

    /**
     * Get commission summary for airline
     */
    async getAirlineCommissionSummary(tenantId, airlineCode) {
        // Returns all commission rules for an airline
        return {
            airline: airlineCode,
            defaultCommission: { type: 'PERCENTAGE', value: 5.0 },
            classRules: [
                { cabinClass: 'ECONOMY', fareClasses: 'Y,B,M,H,K', rate: 7.0 },
                { cabinClass: 'ECONOMY', fareClasses: 'L,Q,T,N,R,X,G,V', rate: 5.0 },
                { cabinClass: 'BUSINESS', fareClasses: null, rate: 7.0 },
                { cabinClass: 'FIRST', fareClasses: null, rate: 9.0 }
            ],
            routeRules: [],
            plb: { enabled: true, percentage: 1.0 },
            specialDeals: []
        };
    }
}

module.exports = CommissionService;
