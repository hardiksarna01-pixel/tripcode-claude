/**
 * Commission Controller
 * Manages airline and class-level commission configuration
 */

const CommissionService = require('../services/commission.service');

class CommissionController {
    // ==================== AIRLINE COMMISSION MASTER ====================

    // List all airline commissions
    async listAirlineCommissions(req, res) {
        try {
            const { page = 1, limit = 20, airlineCode, supplierId } = req.query;
            const tenantId = req.admin.tenantId;

            // In production, query airline_commission_master table
            const mockData = [
                {
                    id: 1,
                    airlineCode: '6E',
                    airlineName: 'IndiGo',
                    supplierName: 'Amadeus',
                    defaultCommissionType: 'PERCENTAGE',
                    defaultCommissionValue: 5.0,
                    plbEnabled: true,
                    plbPercentage: 1.0,
                    hasClassRules: true,
                    hasRouteRules: false,
                    isActive: true
                },
                {
                    id: 2,
                    airlineCode: 'AI',
                    airlineName: 'Air India',
                    supplierName: 'Amadeus',
                    defaultCommissionType: 'PERCENTAGE',
                    defaultCommissionValue: 5.0,
                    plbEnabled: true,
                    plbPercentage: 1.5,
                    hasClassRules: true,
                    hasRouteRules: true,
                    isActive: true
                },
                {
                    id: 3,
                    airlineCode: 'UK',
                    airlineName: 'Vistara',
                    supplierName: 'Amadeus',
                    defaultCommissionType: 'PERCENTAGE',
                    defaultCommissionValue: 4.0,
                    plbEnabled: true,
                    plbPercentage: 1.0,
                    hasClassRules: true,
                    hasRouteRules: false,
                    isActive: true
                },
                {
                    id: 4,
                    airlineCode: 'SG',
                    airlineName: 'SpiceJet',
                    supplierName: 'Direct API',
                    defaultCommissionType: 'PERCENTAGE',
                    defaultCommissionValue: 5.5,
                    plbEnabled: false,
                    plbPercentage: 0,
                    hasClassRules: true,
                    hasRouteRules: false,
                    isActive: true
                },
                {
                    id: 5,
                    airlineCode: 'G8',
                    airlineName: 'Go First',
                    supplierName: 'TBO',
                    defaultCommissionType: 'PERCENTAGE',
                    defaultCommissionValue: 4.5,
                    plbEnabled: false,
                    plbPercentage: 0,
                    hasClassRules: false,
                    hasRouteRules: false,
                    isActive: true
                }
            ];

            res.json({
                success: true,
                data: {
                    airlines: mockData,
                    pagination: {
                        total: mockData.length,
                        page: parseInt(page),
                        totalPages: 1
                    }
                }
            });
        } catch (error) {
            console.error('List airline commissions error:', error);
            res.status(500).json({ success: false, message: 'Failed to list airline commissions' });
        }
    }

    // Create airline commission
    async createAirlineCommission(req, res) {
        try {
            const {
                supplierId,
                airlineCode,
                airlineName,
                defaultCommissionType,
                defaultCommissionValue,
                plbEnabled,
                plbPercentage,
                plbThresholdBookings,
                plbThresholdRevenue,
                incentiveSlabs,
                validFrom,
                validTo
            } = req.body;

            // In production, insert into airline_commission_master
            res.status(201).json({
                success: true,
                message: 'Airline commission created successfully',
                data: { id: Date.now() }
            });
        } catch (error) {
            console.error('Create airline commission error:', error);
            res.status(500).json({ success: false, message: 'Failed to create airline commission' });
        }
    }

    // Update airline commission
    async updateAirlineCommission(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;

            // In production, update airline_commission_master
            res.json({
                success: true,
                message: 'Airline commission updated successfully'
            });
        } catch (error) {
            console.error('Update airline commission error:', error);
            res.status(500).json({ success: false, message: 'Failed to update airline commission' });
        }
    }

    // ==================== CLASS COMMISSION RULES ====================

    // List class commission rules for an airline
    async listClassRules(req, res) {
        try {
            const { airlineCode } = req.params;

            const mockData = {
                '6E': [
                    { id: 1, cabinClass: 'ECONOMY', fareClasses: 'Y,B,M,H,K', commissionType: 'PERCENTAGE', commissionValue: 7.0, travelType: 'DOMESTIC', yqCommission: 0, isActive: true },
                    { id: 2, cabinClass: 'ECONOMY', fareClasses: 'L,Q,T,N,R,X,G,V', commissionType: 'PERCENTAGE', commissionValue: 5.0, travelType: 'DOMESTIC', yqCommission: 0, isActive: true },
                    { id: 3, cabinClass: 'ECONOMY', fareClasses: 'S,W', commissionType: 'PERCENTAGE', commissionValue: 3.0, travelType: 'DOMESTIC', yqCommission: 0, isActive: true },
                    { id: 4, cabinClass: 'ECONOMY', fareClasses: null, commissionType: 'PERCENTAGE', commissionValue: 4.0, travelType: 'INTERNATIONAL', yqCommission: 0, isActive: true }
                ],
                'AI': [
                    { id: 5, cabinClass: 'FIRST', fareClasses: 'F,A,P', commissionType: 'PERCENTAGE', commissionValue: 9.0, travelType: null, yqCommission: 2.0, isActive: true },
                    { id: 6, cabinClass: 'BUSINESS', fareClasses: 'J,C,D,I,Z', commissionType: 'PERCENTAGE', commissionValue: 7.0, travelType: null, yqCommission: 1.5, isActive: true },
                    { id: 7, cabinClass: 'PREMIUM_ECONOMY', fareClasses: 'W,E', commissionType: 'PERCENTAGE', commissionValue: 6.0, travelType: null, yqCommission: 1.0, isActive: true },
                    { id: 8, cabinClass: 'ECONOMY', fareClasses: 'Y,B,M,H,K', commissionType: 'PERCENTAGE', commissionValue: 5.0, travelType: 'DOMESTIC', yqCommission: 0, isActive: true },
                    { id: 9, cabinClass: 'ECONOMY', fareClasses: 'Y,B,M,H,K', commissionType: 'PERCENTAGE', commissionValue: 4.0, travelType: 'INTERNATIONAL', yqCommission: 0.5, isActive: true },
                    { id: 10, cabinClass: 'ECONOMY', fareClasses: 'L,Q,T,N,R,X,G,V', commissionType: 'PERCENTAGE', commissionValue: 3.0, travelType: null, yqCommission: 0, isActive: true }
                ],
                'UK': [
                    { id: 11, cabinClass: 'BUSINESS', fareClasses: 'J,C,D,I,Z', commissionType: 'PERCENTAGE', commissionValue: 7.5, travelType: null, yqCommission: 1.5, isActive: true },
                    { id: 12, cabinClass: 'PREMIUM_ECONOMY', fareClasses: 'W,P,E', commissionType: 'PERCENTAGE', commissionValue: 5.5, travelType: null, yqCommission: 1.0, isActive: true },
                    { id: 13, cabinClass: 'ECONOMY', fareClasses: 'Y,B,M,H,K', commissionType: 'PERCENTAGE', commissionValue: 5.0, travelType: null, yqCommission: 0.5, isActive: true },
                    { id: 14, cabinClass: 'ECONOMY', fareClasses: 'L,Q,T,N,R,V,S', commissionType: 'PERCENTAGE', commissionValue: 3.5, travelType: null, yqCommission: 0, isActive: true }
                ]
            };

            res.json({
                success: true,
                data: mockData[airlineCode] || []
            });
        } catch (error) {
            console.error('List class rules error:', error);
            res.status(500).json({ success: false, message: 'Failed to list class rules' });
        }
    }

    // Create class commission rule
    async createClassRule(req, res) {
        try {
            const {
                airlineCommissionId,
                airlineCode,
                cabinClass,
                fareClasses,
                commissionType,
                commissionValue,
                yqCommissionType,
                yqCommissionValue,
                minFare,
                maxFare,
                travelType,
                validFrom,
                validTo,
                priority
            } = req.body;

            // In production, insert into class_commission_rules
            res.status(201).json({
                success: true,
                message: 'Class commission rule created successfully',
                data: { id: Date.now() }
            });
        } catch (error) {
            console.error('Create class rule error:', error);
            res.status(500).json({ success: false, message: 'Failed to create class rule' });
        }
    }

    // Update class commission rule
    async updateClassRule(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;

            res.json({
                success: true,
                message: 'Class commission rule updated successfully'
            });
        } catch (error) {
            console.error('Update class rule error:', error);
            res.status(500).json({ success: false, message: 'Failed to update class rule' });
        }
    }

    // Delete class commission rule
    async deleteClassRule(req, res) {
        try {
            const { id } = req.params;

            res.json({
                success: true,
                message: 'Class commission rule deleted successfully'
            });
        } catch (error) {
            console.error('Delete class rule error:', error);
            res.status(500).json({ success: false, message: 'Failed to delete class rule' });
        }
    }

    // ==================== ROUTE COMMISSION RULES ====================

    // List route commission rules
    async listRouteRules(req, res) {
        try {
            const { airlineCode } = req.params;

            const mockData = [
                {
                    id: 1,
                    airlineCode: 'AI',
                    origin: 'DEL',
                    destination: 'BOM',
                    cabinClass: null,
                    fareClasses: null,
                    travelType: 'DOMESTIC',
                    commissionType: 'PERCENTAGE',
                    commissionValue: 6.0,
                    yqCommissionValue: 1.0,
                    validFrom: null,
                    validTo: null,
                    priority: 10,
                    isActive: true
                },
                {
                    id: 2,
                    airlineCode: 'AI',
                    origin: 'DEL',
                    destination: 'LHR',
                    cabinClass: 'BUSINESS',
                    fareClasses: null,
                    travelType: 'INTERNATIONAL',
                    commissionType: 'PERCENTAGE',
                    commissionValue: 8.0,
                    yqCommissionValue: 2.0,
                    validFrom: null,
                    validTo: null,
                    priority: 20,
                    isActive: true
                },
                {
                    id: 3,
                    airlineCode: 'AI',
                    origin: 'BOM',
                    destination: 'JFK',
                    cabinClass: null,
                    fareClasses: null,
                    travelType: 'INTERNATIONAL',
                    commissionType: 'PERCENTAGE',
                    commissionValue: 5.0,
                    yqCommissionValue: 1.5,
                    validFrom: null,
                    validTo: null,
                    priority: 5,
                    isActive: true
                }
            ];

            res.json({
                success: true,
                data: airlineCode === 'AI' ? mockData : []
            });
        } catch (error) {
            console.error('List route rules error:', error);
            res.status(500).json({ success: false, message: 'Failed to list route rules' });
        }
    }

    // Create route commission rule
    async createRouteRule(req, res) {
        try {
            const {
                airlineCommissionId,
                airlineCode,
                origin,
                destination,
                via,
                travelType,
                cabinClass,
                fareClasses,
                commissionType,
                commissionValue,
                yqCommissionType,
                yqCommissionValue,
                travelDateFrom,
                travelDateTo,
                bookingDateFrom,
                bookingDateTo,
                priority
            } = req.body;

            res.status(201).json({
                success: true,
                message: 'Route commission rule created successfully',
                data: { id: Date.now() }
            });
        } catch (error) {
            console.error('Create route rule error:', error);
            res.status(500).json({ success: false, message: 'Failed to create route rule' });
        }
    }

    // ==================== SPECIAL DEALS ====================

    // List special deals
    async listSpecialDeals(req, res) {
        try {
            const mockData = [
                {
                    id: 1,
                    dealName: 'Diwali Bonus',
                    dealCode: 'DIWALI2024',
                    airlineCodes: ['6E', 'AI', 'UK'],
                    cabinClasses: ['ECONOMY'],
                    boostType: 'ADDITIONAL_PERCENTAGE',
                    boostValue: 1.0,
                    startDate: '2024-10-15',
                    endDate: '2024-11-15',
                    isActive: true
                },
                {
                    id: 2,
                    dealName: 'Summer Special',
                    dealCode: 'SUMMER24',
                    airlineCodes: null, // All airlines
                    cabinClasses: null, // All classes
                    boostType: 'ADDITIONAL_FLAT',
                    boostValue: 100,
                    startDate: '2024-04-01',
                    endDate: '2024-06-30',
                    isActive: false
                }
            ];

            res.json({
                success: true,
                data: mockData
            });
        } catch (error) {
            console.error('List special deals error:', error);
            res.status(500).json({ success: false, message: 'Failed to list special deals' });
        }
    }

    // Create special deal
    async createSpecialDeal(req, res) {
        try {
            const {
                dealName,
                dealCode,
                airlineCodes,
                cabinClasses,
                fareClasses,
                routes,
                boostType,
                boostValue,
                targetBookings,
                targetRevenue,
                startDate,
                endDate,
                applicableDays
            } = req.body;

            res.status(201).json({
                success: true,
                message: 'Special deal created successfully',
                data: { id: Date.now() }
            });
        } catch (error) {
            console.error('Create special deal error:', error);
            res.status(500).json({ success: false, message: 'Failed to create special deal' });
        }
    }

    // ==================== COMMISSION CALCULATOR ====================

    // Calculate commission (preview)
    async calculateCommission(req, res) {
        try {
            const {
                airlineCode,
                cabinClass,
                fareClass,
                origin,
                destination,
                travelType,
                baseFare,
                yqAmount,
                taxes,
                totalFare
            } = req.body;

            const commissionService = new CommissionService();
            const result = await commissionService.calculateFlightCommission({
                tenantId: req.admin.tenantId,
                supplierId: 1,
                agentId: null,
                airlineCode,
                cabinClass,
                fareClass,
                origin,
                destination,
                travelType,
                baseFare,
                yqAmount: yqAmount || 0,
                taxes,
                totalFare,
                travelDate: new Date()
            });

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('Calculate commission error:', error);
            res.status(500).json({ success: false, message: 'Failed to calculate commission' });
        }
    }

    // ==================== AGENT OVERRIDES ====================

    // List agent overrides
    async listAgentOverrides(req, res) {
        try {
            const { agentId } = req.params;

            const mockData = [
                {
                    id: 1,
                    agentId: parseInt(agentId),
                    airlineCode: '6E',
                    cabinClass: null,
                    travelType: null,
                    commissionSharePercentage: 70,
                    validFrom: null,
                    validTo: null,
                    reason: 'Top performer bonus',
                    isActive: true
                }
            ];

            res.json({
                success: true,
                data: mockData
            });
        } catch (error) {
            console.error('List agent overrides error:', error);
            res.status(500).json({ success: false, message: 'Failed to list agent overrides' });
        }
    }

    // Create agent override
    async createAgentOverride(req, res) {
        try {
            const {
                agentId,
                airlineCode,
                cabinClass,
                travelType,
                commissionSharePercentage,
                fixedCommissionType,
                fixedCommissionValue,
                validFrom,
                validTo,
                reason
            } = req.body;

            res.status(201).json({
                success: true,
                message: 'Agent commission override created successfully',
                data: { id: Date.now() }
            });
        } catch (error) {
            console.error('Create agent override error:', error);
            res.status(500).json({ success: false, message: 'Failed to create agent override' });
        }
    }

    // ==================== REPORTS ====================

    // Commission calculation log/history
    async getCommissionLog(req, res) {
        try {
            const { page = 1, limit = 50, airlineCode, startDate, endDate } = req.query;

            res.json({
                success: true,
                data: {
                    logs: [],
                    pagination: { total: 0, page: 1, totalPages: 0 }
                }
            });
        } catch (error) {
            console.error('Get commission log error:', error);
            res.status(500).json({ success: false, message: 'Failed to get commission log' });
        }
    }

    // Commission summary by airline
    async getAirlineSummary(req, res) {
        try {
            const mockData = [
                { airlineCode: '6E', airlineName: 'IndiGo', bookings: 1250, revenue: 12500000, commission: 625000, avgCommission: 5.0 },
                { airlineCode: 'AI', airlineName: 'Air India', bookings: 890, revenue: 15600000, commission: 858000, avgCommission: 5.5 },
                { airlineCode: 'UK', airlineName: 'Vistara', bookings: 650, revenue: 9800000, commission: 490000, avgCommission: 5.0 },
                { airlineCode: 'SG', airlineName: 'SpiceJet', bookings: 420, revenue: 3150000, commission: 173250, avgCommission: 5.5 }
            ];

            res.json({
                success: true,
                data: mockData
            });
        } catch (error) {
            console.error('Get airline summary error:', error);
            res.status(500).json({ success: false, message: 'Failed to get airline summary' });
        }
    }
}

module.exports = new CommissionController();
