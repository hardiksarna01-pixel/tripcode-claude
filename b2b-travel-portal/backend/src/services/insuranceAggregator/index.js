/**
 * Insurance Aggregator Service
 * Main entry point for travel insurance functionality
 */

const supplierRegistry = require('./supplierRegistry');
const InsuranceQuoteAggregator = require('./quoteAggregator');
const policyManager = require('./policyManager');
const { InsuranceAdapterFactory } = require('./adapters');

// Create default quote aggregator instance
const quoteAggregator = new InsuranceQuoteAggregator();

/**
 * Insurance Service - Main API
 */
const InsuranceService = {
    // Quote Management
    async getQuotes(searchParams) {
        return quoteAggregator.getQuotes(searchParams);
    },

    async compareQuotes(quoteIds, allQuotes) {
        return quoteAggregator.comparePlans(quoteIds, allQuotes);
    },

    // Policy Management
    async createPolicy(policyRequest) {
        return policyManager.createPolicy(policyRequest);
    },

    async getPolicy(policyId) {
        return policyManager.getPolicy(policyId);
    },

    async getPoliciesByAgent(agentId, filters) {
        return policyManager.getPoliciesByAgent(agentId, filters);
    },

    async cancelPolicy(policyId, reason, requestedBy) {
        return policyManager.cancelPolicy(policyId, reason, requestedBy);
    },

    async downloadPolicy(policyId) {
        return policyManager.downloadPolicy(policyId);
    },

    // Claims
    async submitClaim(policyId, claimDetails) {
        return policyManager.submitClaim(policyId, claimDetails);
    },

    async getClaim(claimId) {
        return policyManager.getClaim(claimId);
    },

    async getClaimsByPolicy(policyId) {
        return policyManager.getClaimsByPolicy(policyId);
    },

    // Statistics
    async getAgentStatistics(agentId, dateRange) {
        return policyManager.getAgentStatistics(agentId, dateRange);
    },

    // Supplier Management
    getSuppliers() {
        return supplierRegistry.getEnabledSuppliers();
    },

    getSupplier(supplierId) {
        return supplierRegistry.getSupplier(supplierId);
    },

    getSuppliersByType(type) {
        return supplierRegistry.getSuppliersByType(type);
    },

    getSuppliersByCoverage(coverageType) {
        return supplierRegistry.getSuppliersByCoverage(coverageType);
    },

    getSuppliersByFeature(feature) {
        return supplierRegistry.getSuppliersByFeature(feature);
    },

    getSupplierStats(supplierId) {
        return supplierRegistry.getSupplierStats(supplierId);
    },

    getAllSupplierStats() {
        return supplierRegistry.getAllStats();
    },

    getCoverageTypes() {
        return supplierRegistry.getAllCoverageTypes();
    },

    getFeatures() {
        return supplierRegistry.getAllFeatures();
    }
};

/**
 * Admin Service - Administrative functions
 */
const InsuranceAdminService = {
    // Supplier Management
    addSupplier(supplier) {
        return supplierRegistry.addSupplier(supplier);
    },

    updateSupplier(supplierId, updates) {
        return supplierRegistry.updateSupplier(supplierId, updates);
    },

    removeSupplier(supplierId) {
        return supplierRegistry.removeSupplier(supplierId);
    },

    enableSupplier(supplierId) {
        return supplierRegistry.setSupplierEnabled(supplierId, true);
    },

    disableSupplier(supplierId) {
        return supplierRegistry.setSupplierEnabled(supplierId, false);
    },

    // Policy Management
    async getAllPolicies(filters) {
        return policyManager.getAllPolicies(filters);
    },

    async getPlatformStatistics(dateRange) {
        return policyManager.getPlatformStatistics(dateRange);
    },

    // Bulk Operations
    async bulkEnableSuppliers(supplierIds) {
        const results = supplierIds.map(id => ({
            supplierId: id,
            success: supplierRegistry.setSupplierEnabled(id, true)
        }));
        return { results };
    },

    async bulkDisableSuppliers(supplierIds) {
        const results = supplierIds.map(id => ({
            supplierId: id,
            success: supplierRegistry.setSupplierEnabled(id, false)
        }));
        return { results };
    }
};

module.exports = {
    InsuranceService,
    InsuranceAdminService,
    supplierRegistry,
    InsuranceQuoteAggregator,
    policyManager,
    InsuranceAdapterFactory
};
