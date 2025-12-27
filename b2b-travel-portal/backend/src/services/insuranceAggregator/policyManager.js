/**
 * Insurance Policy Manager
 * Handles policy creation, management, and claims
 */

const supplierRegistry = require('./supplierRegistry');
const { InsuranceAdapterFactory } = require('./adapters');

class InsurancePolicyManager {
    constructor() {
        // In-memory storage for demo (use database in production)
        this.policies = new Map();
        this.claims = new Map();
        this.bookingCounter = 1000;
    }

    /**
     * Create a new insurance policy
     */
    async createPolicy(policyRequest) {
        const { quoteId, supplierId, travelerDetails, paymentInfo, agentId, bookingRef } = policyRequest;

        // Get supplier
        const supplier = supplierRegistry.getSupplier(supplierId);
        if (!supplier) {
            return {
                success: false,
                error: 'Insurance provider not found'
            };
        }

        // Create adapter and call API
        const adapter = InsuranceAdapterFactory.createAdapter(supplier);

        try {
            const result = await adapter.createPolicy(quoteId, travelerDetails, paymentInfo);

            if (result.success) {
                // Store policy
                const policy = {
                    id: `POL${++this.bookingCounter}`,
                    policyNumber: result.policyNumber,
                    quoteId,
                    supplierId,
                    supplierName: supplier.name,
                    travelerDetails,
                    agentId,
                    bookingRef,
                    status: result.status || 'ACTIVE',
                    startDate: travelerDetails.tripStartDate,
                    endDate: travelerDetails.tripEndDate,
                    premium: policyRequest.premium,
                    coverage: policyRequest.coverage,
                    downloadUrl: result.downloadUrl,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                this.policies.set(policy.id, policy);

                return {
                    success: true,
                    policy,
                    message: 'Policy created successfully'
                };
            }

            return {
                success: false,
                error: result.error || 'Failed to create policy'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get policy by ID
     */
    async getPolicy(policyId) {
        const policy = this.policies.get(policyId);
        if (!policy) {
            return { success: false, error: 'Policy not found' };
        }

        // Optionally refresh status from supplier
        const supplier = supplierRegistry.getSupplier(policy.supplierId);
        if (supplier) {
            const adapter = InsuranceAdapterFactory.createAdapter(supplier);
            try {
                const status = await adapter.getPolicyStatus(policy.policyNumber);
                policy.status = status.status;
                policy.updatedAt = new Date().toISOString();
            } catch (error) {
                // Continue with cached status
            }
        }

        return { success: true, policy };
    }

    /**
     * Get policies by agent ID
     */
    async getPoliciesByAgent(agentId, filters = {}) {
        let policies = Array.from(this.policies.values())
            .filter(p => p.agentId === agentId);

        // Apply filters
        if (filters.status) {
            policies = policies.filter(p => p.status === filters.status);
        }
        if (filters.supplierId) {
            policies = policies.filter(p => p.supplierId === filters.supplierId);
        }
        if (filters.fromDate) {
            policies = policies.filter(p => new Date(p.createdAt) >= new Date(filters.fromDate));
        }
        if (filters.toDate) {
            policies = policies.filter(p => new Date(p.createdAt) <= new Date(filters.toDate));
        }

        // Sort by created date (newest first)
        policies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Pagination
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const start = (page - 1) * limit;
        const paginatedPolicies = policies.slice(start, start + limit);

        return {
            success: true,
            policies: paginatedPolicies,
            pagination: {
                total: policies.length,
                page,
                limit,
                totalPages: Math.ceil(policies.length / limit)
            }
        };
    }

    /**
     * Cancel a policy
     */
    async cancelPolicy(policyId, reason, requestedBy) {
        const policy = this.policies.get(policyId);
        if (!policy) {
            return { success: false, error: 'Policy not found' };
        }

        if (policy.status === 'CANCELLED') {
            return { success: false, error: 'Policy is already cancelled' };
        }

        const supplier = supplierRegistry.getSupplier(policy.supplierId);
        if (!supplier) {
            return { success: false, error: 'Insurance provider not found' };
        }

        const adapter = InsuranceAdapterFactory.createAdapter(supplier);

        try {
            const result = await adapter.cancelPolicy(policy.policyNumber, reason);

            if (result.success) {
                policy.status = 'CANCELLED';
                policy.cancellation = {
                    reason,
                    requestedBy,
                    cancellationId: result.cancellationId,
                    refundAmount: result.refundAmount || 0,
                    cancelledAt: new Date().toISOString()
                };
                policy.updatedAt = new Date().toISOString();

                return {
                    success: true,
                    policy,
                    refundAmount: result.refundAmount || 0,
                    message: 'Policy cancelled successfully'
                };
            }

            return {
                success: false,
                error: result.error || 'Failed to cancel policy'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Submit a claim
     */
    async submitClaim(policyId, claimDetails) {
        const policy = this.policies.get(policyId);
        if (!policy) {
            return { success: false, error: 'Policy not found' };
        }

        if (policy.status !== 'ACTIVE') {
            return { success: false, error: 'Can only submit claims for active policies' };
        }

        const supplier = supplierRegistry.getSupplier(policy.supplierId);
        if (!supplier) {
            return { success: false, error: 'Insurance provider not found' };
        }

        const adapter = InsuranceAdapterFactory.createAdapter(supplier);

        try {
            const result = await adapter.submitClaim(policy.policyNumber, claimDetails);

            if (result.success) {
                const claim = {
                    id: `CLM${Date.now()}`,
                    claimNumber: result.claimNumber,
                    policyId,
                    policyNumber: policy.policyNumber,
                    supplierId: policy.supplierId,
                    claimType: claimDetails.claimType,
                    claimAmount: claimDetails.claimAmount,
                    description: claimDetails.description,
                    documents: claimDetails.documents || [],
                    status: result.status || 'SUBMITTED',
                    estimatedProcessingDays: result.estimatedProcessingDays,
                    submittedAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                this.claims.set(claim.id, claim);

                // Add claim reference to policy
                if (!policy.claims) policy.claims = [];
                policy.claims.push(claim.id);

                return {
                    success: true,
                    claim,
                    message: 'Claim submitted successfully'
                };
            }

            return {
                success: false,
                error: result.error || 'Failed to submit claim'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get claim status
     */
    async getClaim(claimId) {
        const claim = this.claims.get(claimId);
        if (!claim) {
            return { success: false, error: 'Claim not found' };
        }
        return { success: true, claim };
    }

    /**
     * Get claims by policy
     */
    async getClaimsByPolicy(policyId) {
        const claims = Array.from(this.claims.values())
            .filter(c => c.policyId === policyId);
        return { success: true, claims };
    }

    /**
     * Download policy document
     */
    async downloadPolicy(policyId) {
        const policy = this.policies.get(policyId);
        if (!policy) {
            return { success: false, error: 'Policy not found' };
        }

        return {
            success: true,
            downloadUrl: policy.downloadUrl || `https://portal.example.com/policies/${policyId}/download`,
            policyNumber: policy.policyNumber
        };
    }

    /**
     * Get policy statistics for agent
     */
    async getAgentStatistics(agentId, dateRange = {}) {
        let policies = Array.from(this.policies.values())
            .filter(p => p.agentId === agentId);

        if (dateRange.from) {
            policies = policies.filter(p => new Date(p.createdAt) >= new Date(dateRange.from));
        }
        if (dateRange.to) {
            policies = policies.filter(p => new Date(p.createdAt) <= new Date(dateRange.to));
        }

        const totalPolicies = policies.length;
        const activePolicies = policies.filter(p => p.status === 'ACTIVE').length;
        const cancelledPolicies = policies.filter(p => p.status === 'CANCELLED').length;
        const totalPremium = policies.reduce((sum, p) => sum + (p.premium?.total || 0), 0);

        // Supplier breakdown
        const supplierBreakdown = {};
        policies.forEach(p => {
            if (!supplierBreakdown[p.supplierId]) {
                supplierBreakdown[p.supplierId] = {
                    name: p.supplierName,
                    count: 0,
                    premium: 0
                };
            }
            supplierBreakdown[p.supplierId].count++;
            supplierBreakdown[p.supplierId].premium += p.premium?.total || 0;
        });

        return {
            success: true,
            statistics: {
                totalPolicies,
                activePolicies,
                cancelledPolicies,
                totalPremium,
                averagePremium: totalPolicies > 0 ? Math.round(totalPremium / totalPolicies) : 0,
                supplierBreakdown
            }
        };
    }

    /**
     * Get all policies (admin only)
     */
    async getAllPolicies(filters = {}) {
        let policies = Array.from(this.policies.values());

        // Apply filters
        if (filters.status) {
            policies = policies.filter(p => p.status === filters.status);
        }
        if (filters.supplierId) {
            policies = policies.filter(p => p.supplierId === filters.supplierId);
        }
        if (filters.agentId) {
            policies = policies.filter(p => p.agentId === filters.agentId);
        }
        if (filters.fromDate) {
            policies = policies.filter(p => new Date(p.createdAt) >= new Date(filters.fromDate));
        }
        if (filters.toDate) {
            policies = policies.filter(p => new Date(p.createdAt) <= new Date(filters.toDate));
        }

        // Sort
        policies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Pagination
        const page = filters.page || 1;
        const limit = filters.limit || 50;
        const start = (page - 1) * limit;

        return {
            success: true,
            policies: policies.slice(start, start + limit),
            pagination: {
                total: policies.length,
                page,
                limit,
                totalPages: Math.ceil(policies.length / limit)
            }
        };
    }

    /**
     * Get platform-wide statistics (admin only)
     */
    async getPlatformStatistics(dateRange = {}) {
        let policies = Array.from(this.policies.values());
        let claims = Array.from(this.claims.values());

        if (dateRange.from) {
            policies = policies.filter(p => new Date(p.createdAt) >= new Date(dateRange.from));
            claims = claims.filter(c => new Date(c.submittedAt) >= new Date(dateRange.from));
        }
        if (dateRange.to) {
            policies = policies.filter(p => new Date(p.createdAt) <= new Date(dateRange.to));
            claims = claims.filter(c => new Date(c.submittedAt) <= new Date(dateRange.to));
        }

        return {
            success: true,
            statistics: {
                policies: {
                    total: policies.length,
                    active: policies.filter(p => p.status === 'ACTIVE').length,
                    cancelled: policies.filter(p => p.status === 'CANCELLED').length,
                    totalPremium: policies.reduce((sum, p) => sum + (p.premium?.total || 0), 0)
                },
                claims: {
                    total: claims.length,
                    submitted: claims.filter(c => c.status === 'SUBMITTED').length,
                    processing: claims.filter(c => c.status === 'PROCESSING').length,
                    approved: claims.filter(c => c.status === 'APPROVED').length,
                    rejected: claims.filter(c => c.status === 'REJECTED').length,
                    totalClaimAmount: claims.reduce((sum, c) => sum + (c.claimAmount || 0), 0)
                },
                supplierPerformance: this.getSupplierPerformance(policies),
                agentPerformance: this.getAgentPerformance(policies)
            }
        };
    }

    getSupplierPerformance(policies) {
        const performance = {};
        policies.forEach(p => {
            if (!performance[p.supplierId]) {
                performance[p.supplierId] = {
                    name: p.supplierName,
                    policyCount: 0,
                    totalPremium: 0,
                    cancellationRate: 0,
                    cancelled: 0
                };
            }
            performance[p.supplierId].policyCount++;
            performance[p.supplierId].totalPremium += p.premium?.total || 0;
            if (p.status === 'CANCELLED') {
                performance[p.supplierId].cancelled++;
            }
        });

        Object.keys(performance).forEach(id => {
            const perf = performance[id];
            perf.cancellationRate = perf.policyCount > 0
                ? Math.round((perf.cancelled / perf.policyCount) * 100)
                : 0;
        });

        return performance;
    }

    getAgentPerformance(policies) {
        const performance = {};
        policies.forEach(p => {
            if (!performance[p.agentId]) {
                performance[p.agentId] = {
                    policyCount: 0,
                    totalPremium: 0
                };
            }
            performance[p.agentId].policyCount++;
            performance[p.agentId].totalPremium += p.premium?.total || 0;
        });
        return performance;
    }
}

module.exports = new InsurancePolicyManager();
