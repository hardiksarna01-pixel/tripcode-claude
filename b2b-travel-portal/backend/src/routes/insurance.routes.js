/**
 * Insurance Routes
 * Handles both agent and admin panel routes for travel insurance
 */

const express = require('express');
const router = express.Router();
const insuranceController = require('../controllers/insurance.controller');

// ==========================================
// AGENT PANEL ROUTES
// ==========================================

/**
 * Quote Management
 */
// Search for insurance quotes
router.post('/quotes/search', insuranceController.searchQuotes);

// Get quote details
router.get('/quotes/:quoteId', insuranceController.getQuoteDetails);

// Compare multiple quotes
router.post('/quotes/compare', insuranceController.compareQuotes);

/**
 * Policy Management (Agent)
 */
// Create a new policy (book insurance)
router.post('/policies', insuranceController.createPolicy);

// Get agent's policies
router.get('/policies', insuranceController.getAgentPolicies);

// Get specific policy
router.get('/policies/:policyId', insuranceController.getPolicy);

// Cancel policy
router.post('/policies/:policyId/cancel', insuranceController.cancelPolicy);

// Download policy document
router.get('/policies/:policyId/download', insuranceController.downloadPolicy);

// Resend policy to email
router.post('/policies/:policyId/resend', insuranceController.resendPolicy);

/**
 * Claims Management (Agent)
 */
// Submit a claim
router.post('/policies/:policyId/claims', insuranceController.submitClaim);

// Get claims for a policy
router.get('/policies/:policyId/claims', insuranceController.getPolicyClaims);

// Get claim details
router.get('/claims/:claimId', insuranceController.getClaimDetails);

// Upload claim documents
router.post('/claims/:claimId/documents', insuranceController.uploadClaimDocuments);

/**
 * Agent Statistics
 */
// Get agent's insurance statistics
router.get('/statistics', insuranceController.getAgentStatistics);

// Get agent's commission summary
router.get('/commission-summary', insuranceController.getAgentCommission);

/**
 * Supplier Information (Agent View)
 */
// Get available insurance providers
router.get('/suppliers', insuranceController.getSuppliers);

// Get coverage types
router.get('/coverage-types', insuranceController.getCoverageTypes);

// Get features list
router.get('/features', insuranceController.getFeatures);

// ==========================================
// ADMIN PANEL ROUTES
// ==========================================

/**
 * Supplier Management (Admin)
 */
// Get all suppliers with status
router.get('/admin/suppliers', insuranceController.adminGetAllSuppliers);

// Get supplier details
router.get('/admin/suppliers/:supplierId', insuranceController.adminGetSupplier);

// Add new supplier
router.post('/admin/suppliers', insuranceController.adminAddSupplier);

// Update supplier
router.put('/admin/suppliers/:supplierId', insuranceController.adminUpdateSupplier);

// Delete supplier
router.delete('/admin/suppliers/:supplierId', insuranceController.adminDeleteSupplier);

// Enable supplier
router.post('/admin/suppliers/:supplierId/enable', insuranceController.adminEnableSupplier);

// Disable supplier
router.post('/admin/suppliers/:supplierId/disable', insuranceController.adminDisableSupplier);

// Bulk enable suppliers
router.post('/admin/suppliers/bulk-enable', insuranceController.adminBulkEnableSuppliers);

// Bulk disable suppliers
router.post('/admin/suppliers/bulk-disable', insuranceController.adminBulkDisableSuppliers);

// Get supplier health/performance
router.get('/admin/suppliers/:supplierId/health', insuranceController.adminGetSupplierHealth);

/**
 * Policy Management (Admin)
 */
// Get all policies
router.get('/admin/policies', insuranceController.adminGetAllPolicies);

// Get policy by ID (admin view with more details)
router.get('/admin/policies/:policyId', insuranceController.adminGetPolicy);

// Update policy status
router.put('/admin/policies/:policyId/status', insuranceController.adminUpdatePolicyStatus);

// Force cancel policy (admin override)
router.post('/admin/policies/:policyId/force-cancel', insuranceController.adminForceCancelPolicy);

/**
 * Claims Management (Admin)
 */
// Get all claims
router.get('/admin/claims', insuranceController.adminGetAllClaims);

// Get claim details
router.get('/admin/claims/:claimId', insuranceController.adminGetClaim);

// Update claim status
router.put('/admin/claims/:claimId/status', insuranceController.adminUpdateClaimStatus);

// Process claim
router.post('/admin/claims/:claimId/process', insuranceController.adminProcessClaim);

/**
 * Platform Statistics (Admin)
 */
// Get platform-wide statistics
router.get('/admin/statistics', insuranceController.adminGetPlatformStatistics);

// Get supplier performance report
router.get('/admin/reports/suppliers', insuranceController.adminGetSupplierReport);

// Get agent performance report
router.get('/admin/reports/agents', insuranceController.adminGetAgentReport);

// Get daily/weekly/monthly report
router.get('/admin/reports/period', insuranceController.adminGetPeriodReport);

/**
 * Configuration (Admin)
 */
// Get insurance configuration
router.get('/admin/config', insuranceController.adminGetConfig);

// Update insurance configuration
router.put('/admin/config', insuranceController.adminUpdateConfig);

// Get commission settings
router.get('/admin/commission-settings', insuranceController.adminGetCommissionSettings);

// Update commission settings
router.put('/admin/commission-settings', insuranceController.adminUpdateCommissionSettings);

/**
 * Agent Group Insurance Settings (Admin)
 */
// Get agent group insurance settings
router.get('/admin/agent-groups/:groupId/insurance', insuranceController.adminGetAgentGroupInsurance);

// Update agent group insurance settings
router.put('/admin/agent-groups/:groupId/insurance', insuranceController.adminUpdateAgentGroupInsurance);

// Set allowed suppliers for agent group
router.put('/admin/agent-groups/:groupId/allowed-suppliers', insuranceController.adminSetGroupAllowedSuppliers);

/**
 * API Integration Testing (Admin)
 */
// Test supplier connection
router.post('/admin/suppliers/:supplierId/test', insuranceController.adminTestSupplierConnection);

// Run diagnostic on all suppliers
router.post('/admin/diagnostics', insuranceController.adminRunDiagnostics);

module.exports = router;
