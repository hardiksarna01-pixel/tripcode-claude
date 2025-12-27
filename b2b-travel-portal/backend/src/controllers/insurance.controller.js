/**
 * Insurance Controller
 * Handles all insurance-related API requests for agent and admin panels
 */

const { InsuranceService, InsuranceAdminService, supplierRegistry } = require('../services/insuranceAggregator');

// ==========================================
// AGENT PANEL CONTROLLERS
// ==========================================

/**
 * Quote Management
 */
exports.searchQuotes = async (req, res) => {
    try {
        const searchParams = {
            tripType: req.body.tripType, // 'domestic', 'international', 'schengen'
            destination: req.body.destination,
            origin: req.body.origin,
            tripStartDate: req.body.tripStartDate,
            tripEndDate: req.body.tripEndDate,
            duration: req.body.duration,
            travelers: req.body.travelers, // Array of { age, name, gender }
            coverageType: req.body.coverageType, // 'student', 'senior', 'family', 'business'
            requiredFeatures: req.body.requiredFeatures, // ['covid_cover', 'adventure_sports']
            minCoverAmount: req.body.minCoverAmount,
            sortBy: req.body.sortBy || 'price'
        };

        const result = await InsuranceService.getQuotes(searchParams);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getQuoteDetails = async (req, res) => {
    try {
        const { quoteId } = req.params;
        // In production, fetch from cache/database
        res.json({
            success: true,
            message: 'Quote details should be fetched from cache using quoteId',
            quoteId
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.compareQuotes = async (req, res) => {
    try {
        const { quoteIds, quotes } = req.body;
        const result = await InsuranceService.compareQuotes(quoteIds, quotes);
        res.json({ success: true, comparison: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Policy Management
 */
exports.createPolicy = async (req, res) => {
    try {
        const policyRequest = {
            quoteId: req.body.quoteId,
            supplierId: req.body.supplierId,
            planId: req.body.planId,
            travelerDetails: req.body.travelerDetails,
            paymentInfo: req.body.paymentInfo,
            premium: req.body.premium,
            coverage: req.body.coverage,
            agentId: req.user?.id || req.body.agentId,
            bookingRef: req.body.bookingRef // Optional: link to flight/hotel booking
        };

        const result = await InsuranceService.createPolicy(policyRequest);

        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getAgentPolicies = async (req, res) => {
    try {
        const agentId = req.user?.id || req.query.agentId;
        const filters = {
            status: req.query.status,
            supplierId: req.query.supplierId,
            fromDate: req.query.fromDate,
            toDate: req.query.toDate,
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 20
        };

        const result = await InsuranceService.getPoliciesByAgent(agentId, filters);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getPolicy = async (req, res) => {
    try {
        const { policyId } = req.params;
        const result = await InsuranceService.getPolicy(policyId);

        if (result.success) {
            res.json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.cancelPolicy = async (req, res) => {
    try {
        const { policyId } = req.params;
        const { reason } = req.body;
        const requestedBy = req.user?.id || 'agent';

        const result = await InsuranceService.cancelPolicy(policyId, reason, requestedBy);

        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.downloadPolicy = async (req, res) => {
    try {
        const { policyId } = req.params;
        const result = await InsuranceService.downloadPolicy(policyId);

        if (result.success) {
            res.json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.resendPolicy = async (req, res) => {
    try {
        const { policyId } = req.params;
        const { email } = req.body;

        // In production, send email with policy document
        res.json({
            success: true,
            message: `Policy document will be sent to ${email}`
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Claims Management
 */
exports.submitClaim = async (req, res) => {
    try {
        const { policyId } = req.params;
        const claimDetails = {
            claimType: req.body.claimType,
            claimAmount: req.body.claimAmount,
            description: req.body.description,
            incidentDate: req.body.incidentDate,
            documents: req.body.documents
        };

        const result = await InsuranceService.submitClaim(policyId, claimDetails);

        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getPolicyClaims = async (req, res) => {
    try {
        const { policyId } = req.params;
        const result = await InsuranceService.getClaimsByPolicy(policyId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getClaimDetails = async (req, res) => {
    try {
        const { claimId } = req.params;
        const result = await InsuranceService.getClaim(claimId);

        if (result.success) {
            res.json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.uploadClaimDocuments = async (req, res) => {
    try {
        const { claimId } = req.params;
        // In production, handle file uploads
        res.json({
            success: true,
            message: 'Documents uploaded successfully',
            claimId
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Agent Statistics
 */
exports.getAgentStatistics = async (req, res) => {
    try {
        const agentId = req.user?.id || req.query.agentId;
        const dateRange = {
            from: req.query.fromDate,
            to: req.query.toDate
        };

        const result = await InsuranceService.getAgentStatistics(agentId, dateRange);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getAgentCommission = async (req, res) => {
    try {
        const agentId = req.user?.id || req.query.agentId;
        // In production, calculate from commission engine
        res.json({
            success: true,
            commission: {
                thisMonth: 0,
                lastMonth: 0,
                thisYear: 0,
                pending: 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Supplier Information (Agent View)
 */
exports.getSuppliers = async (req, res) => {
    try {
        const type = req.query.type;
        let suppliers;

        if (type) {
            suppliers = InsuranceService.getSuppliersByType(type);
        } else {
            suppliers = InsuranceService.getSuppliers();
        }

        // Return limited info for agents
        const agentView = suppliers.map(s => ({
            id: s.id,
            name: s.name,
            type: s.type,
            coverageTypes: s.coverageTypes,
            features: s.features,
            maxCoverAmount: s.maxCoverAmount
        }));

        res.json({ success: true, suppliers: agentView });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getCoverageTypes = async (req, res) => {
    try {
        const coverageTypes = InsuranceService.getCoverageTypes();
        res.json({ success: true, coverageTypes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getFeatures = async (req, res) => {
    try {
        const features = InsuranceService.getFeatures();
        res.json({ success: true, features });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==========================================
// ADMIN PANEL CONTROLLERS
// ==========================================

/**
 * Supplier Management (Admin)
 */
exports.adminGetAllSuppliers = async (req, res) => {
    try {
        const stats = InsuranceService.getAllSupplierStats();
        res.json({ success: true, suppliers: stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.adminGetSupplier = async (req, res) => {
    try {
        const { supplierId } = req.params;
        const stats = InsuranceService.getSupplierStats(supplierId);

        if (stats) {
            res.json({ success: true, supplier: stats });
        } else {
            res.status(404).json({ success: false, error: 'Supplier not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.adminAddSupplier = async (req, res) => {
    try {
        const supplier = InsuranceAdminService.addSupplier(req.body);
        res.status(201).json({ success: true, supplier });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.adminUpdateSupplier = async (req, res) => {
    try {
        const { supplierId } = req.params;
        const supplier = InsuranceAdminService.updateSupplier(supplierId, req.body);

        if (supplier) {
            res.json({ success: true, supplier });
        } else {
            res.status(404).json({ success: false, error: 'Supplier not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.adminDeleteSupplier = async (req, res) => {
    try {
        const { supplierId } = req.params;
        const result = InsuranceAdminService.removeSupplier(supplierId);

        if (result) {
            res.json({ success: true, message: 'Supplier removed' });
        } else {
            res.status(404).json({ success: false, error: 'Supplier not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.adminEnableSupplier = async (req, res) => {
    try {
        const { supplierId } = req.params;
        const result = InsuranceAdminService.enableSupplier(supplierId);

        if (result) {
            res.json({ success: true, message: 'Supplier enabled' });
        } else {
            res.status(404).json({ success: false, error: 'Supplier not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.adminDisableSupplier = async (req, res) => {
    try {
        const { supplierId } = req.params;
        const result = InsuranceAdminService.disableSupplier(supplierId);

        if (result) {
            res.json({ success: true, message: 'Supplier disabled' });
        } else {
            res.status(404).json({ success: false, error: 'Supplier not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.adminBulkEnableSuppliers = async (req, res) => {
    try {
        const { supplierIds } = req.body;
        const result = await InsuranceAdminService.bulkEnableSuppliers(supplierIds);
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.adminBulkDisableSuppliers = async (req, res) => {
    try {
        const { supplierIds } = req.body;
        const result = await InsuranceAdminService.bulkDisableSuppliers(supplierIds);
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.adminGetSupplierHealth = async (req, res) => {
    try {
        const { supplierId } = req.params;
        const stats = InsuranceService.getSupplierStats(supplierId);

        if (stats) {
            res.json({ success: true, health: stats.status });
        } else {
            res.status(404).json({ success: false, error: 'Supplier not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Policy Management (Admin)
 */
exports.adminGetAllPolicies = async (req, res) => {
    try {
        const filters = {
            status: req.query.status,
            supplierId: req.query.supplierId,
            agentId: req.query.agentId,
            fromDate: req.query.fromDate,
            toDate: req.query.toDate,
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 50
        };

        const result = await InsuranceAdminService.getAllPolicies(filters);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.adminGetPolicy = async (req, res) => {
    try {
        const { policyId } = req.params;
        const result = await InsuranceService.getPolicy(policyId);

        if (result.success) {
            res.json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.adminUpdatePolicyStatus = async (req, res) => {
    try {
        const { policyId } = req.params;
        const { status, reason } = req.body;
        // In production, update policy status
        res.json({
            success: true,
            message: `Policy ${policyId} status updated to ${status}`
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.adminForceCancelPolicy = async (req, res) => {
    try {
        const { policyId } = req.params;
        const { reason } = req.body;
        const result = await InsuranceService.cancelPolicy(policyId, reason, 'admin');

        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Claims Management (Admin)
 */
exports.adminGetAllClaims = async (req, res) => {
    try {
        // In production, fetch from database with filters
        res.json({
            success: true,
            claims: [],
            pagination: { total: 0, page: 1, limit: 50 }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.adminGetClaim = async (req, res) => {
    try {
        const { claimId } = req.params;
        const result = await InsuranceService.getClaim(claimId);

        if (result.success) {
            res.json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.adminUpdateClaimStatus = async (req, res) => {
    try {
        const { claimId } = req.params;
        const { status, notes } = req.body;
        // In production, update claim status
        res.json({
            success: true,
            message: `Claim ${claimId} status updated to ${status}`
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.adminProcessClaim = async (req, res) => {
    try {
        const { claimId } = req.params;
        const { action, amount, notes } = req.body; // action: 'approve', 'reject', 'request_info'
        // In production, process claim
        res.json({
            success: true,
            message: `Claim ${claimId} processed with action: ${action}`
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Platform Statistics (Admin)
 */
exports.adminGetPlatformStatistics = async (req, res) => {
    try {
        const dateRange = {
            from: req.query.fromDate,
            to: req.query.toDate
        };

        const result = await InsuranceAdminService.getPlatformStatistics(dateRange);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.adminGetSupplierReport = async (req, res) => {
    try {
        const stats = InsuranceService.getAllSupplierStats();
        const report = stats.map(s => ({
            id: s.id,
            name: s.name,
            type: s.type,
            enabled: s.enabled,
            health: s.status?.healthy,
            successRate: s.status?.successRate,
            avgResponseTime: s.status?.avgResponseTime,
            totalRequests: s.status?.totalRequests
        }));

        res.json({ success: true, report });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.adminGetAgentReport = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;
        const stats = await InsuranceAdminService.getPlatformStatistics({ from: fromDate, to: toDate });

        res.json({
            success: true,
            report: stats.statistics?.agentPerformance || {}
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.adminGetPeriodReport = async (req, res) => {
    try {
        const { period, fromDate, toDate } = req.query; // period: 'daily', 'weekly', 'monthly'
        // In production, generate period-based report
        res.json({
            success: true,
            period,
            report: {
                fromDate,
                toDate,
                totalPolicies: 0,
                totalPremium: 0,
                totalClaims: 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Configuration (Admin)
 */
exports.adminGetConfig = async (req, res) => {
    try {
        res.json({
            success: true,
            config: {
                defaultTimeout: 8000,
                minResponses: 3,
                earlyReturnThreshold: 0.6,
                enabledSuppliers: InsuranceService.getSuppliers().length,
                totalSuppliers: InsuranceService.getAllSupplierStats().length
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.adminUpdateConfig = async (req, res) => {
    try {
        const { config } = req.body;
        // In production, save to database
        res.json({ success: true, message: 'Configuration updated', config });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.adminGetCommissionSettings = async (req, res) => {
    try {
        // In production, fetch from commission engine
        res.json({
            success: true,
            settings: {
                defaultCommission: 10,
                minCommission: 5,
                maxCommission: 20,
                supplierSpecific: {}
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.adminUpdateCommissionSettings = async (req, res) => {
    try {
        const { settings } = req.body;
        // In production, save to commission engine
        res.json({ success: true, message: 'Commission settings updated', settings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Agent Group Insurance Settings (Admin)
 */
exports.adminGetAgentGroupInsurance = async (req, res) => {
    try {
        const { groupId } = req.params;
        // In production, fetch from database
        res.json({
            success: true,
            groupId,
            settings: {
                enabled: true,
                allowedSuppliers: [],
                commission: 10,
                maxCoverAmount: null
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.adminUpdateAgentGroupInsurance = async (req, res) => {
    try {
        const { groupId } = req.params;
        const settings = req.body;
        // In production, save to database
        res.json({ success: true, message: `Insurance settings updated for group ${groupId}`, settings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.adminSetGroupAllowedSuppliers = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { supplierIds } = req.body;
        // In production, save to database
        res.json({
            success: true,
            message: `Allowed suppliers set for group ${groupId}`,
            supplierIds
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * API Integration Testing (Admin)
 */
exports.adminTestSupplierConnection = async (req, res) => {
    try {
        const { supplierId } = req.params;
        const supplier = InsuranceService.getSupplier(supplierId);

        if (!supplier) {
            return res.status(404).json({ success: false, error: 'Supplier not found' });
        }

        // Test with sample search
        const testParams = {
            tripType: 'domestic',
            duration: 7,
            travelers: [{ age: 30 }]
        };

        const startTime = Date.now();
        try {
            const { InsuranceAdapterFactory } = require('../services/insuranceAggregator');
            const adapter = InsuranceAdapterFactory.createAdapter(supplier);
            const result = await adapter.getQuote(testParams);

            res.json({
                success: true,
                supplier: supplierId,
                responseTime: Date.now() - startTime,
                plansReturned: result.plans?.length || 0,
                status: 'connected'
            });
        } catch (error) {
            res.json({
                success: false,
                supplier: supplierId,
                responseTime: Date.now() - startTime,
                error: error.message,
                status: 'failed'
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.adminRunDiagnostics = async (req, res) => {
    try {
        const suppliers = InsuranceService.getSuppliers();
        const results = [];

        for (const supplier of suppliers.slice(0, 5)) { // Test first 5 for speed
            const startTime = Date.now();
            try {
                const { InsuranceAdapterFactory } = require('../services/insuranceAggregator');
                const adapter = InsuranceAdapterFactory.createAdapter(supplier);
                await adapter.getQuote({ tripType: 'domestic', duration: 7, travelers: [{ age: 30 }] });

                results.push({
                    supplierId: supplier.id,
                    name: supplier.name,
                    status: 'healthy',
                    responseTime: Date.now() - startTime
                });
            } catch (error) {
                results.push({
                    supplierId: supplier.id,
                    name: supplier.name,
                    status: 'unhealthy',
                    error: error.message
                });
            }
        }

        res.json({
            success: true,
            testedSuppliers: results.length,
            healthy: results.filter(r => r.status === 'healthy').length,
            unhealthy: results.filter(r => r.status === 'unhealthy').length,
            results
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
