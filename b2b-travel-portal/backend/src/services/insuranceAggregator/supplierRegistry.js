/**
 * Insurance Supplier Registry
 * Manages 20+ travel insurance API providers
 */

const insuranceSuppliers = {
    // Indian Insurance Providers
    'ICICI_LOMBARD': {
        id: 'ICICI_LOMBARD',
        name: 'ICICI Lombard',
        type: 'indian',
        baseUrl: 'https://api.icicilombard.com/travel',
        priority: 1,
        timeout: 5000,
        enabled: true,
        coverageTypes: ['domestic', 'international', 'student', 'senior'],
        features: ['covid_cover', 'adventure_sports', 'trip_cancellation', 'baggage_loss'],
        maxCoverAmount: 5000000,
        credentials: {
            apiKey: process.env.ICICI_LOMBARD_API_KEY,
            secretKey: process.env.ICICI_LOMBARD_SECRET
        }
    },
    'HDFC_ERGO': {
        id: 'HDFC_ERGO',
        name: 'HDFC ERGO',
        type: 'indian',
        baseUrl: 'https://api.hdfcergo.com/travel-insurance',
        priority: 1,
        timeout: 5000,
        enabled: true,
        coverageTypes: ['domestic', 'international', 'family', 'corporate'],
        features: ['medical_emergency', 'trip_delay', 'passport_loss', 'personal_liability'],
        maxCoverAmount: 10000000,
        credentials: {
            apiKey: process.env.HDFC_ERGO_API_KEY,
            partnerId: process.env.HDFC_ERGO_PARTNER_ID
        }
    },
    'BAJAJ_ALLIANZ': {
        id: 'BAJAJ_ALLIANZ',
        name: 'Bajaj Allianz',
        type: 'indian',
        baseUrl: 'https://api.bajajallianz.com/travel',
        priority: 2,
        timeout: 5000,
        enabled: true,
        coverageTypes: ['domestic', 'international', 'student', 'business'],
        features: ['medical_evacuation', 'repatriation', 'adventure_cover', 'pre_existing'],
        maxCoverAmount: 7500000,
        credentials: {
            apiKey: process.env.BAJAJ_ALLIANZ_API_KEY,
            agentCode: process.env.BAJAJ_ALLIANZ_AGENT_CODE
        }
    },
    'TATA_AIG': {
        id: 'TATA_AIG',
        name: 'Tata AIG',
        type: 'indian',
        baseUrl: 'https://api.tataaig.com/travel-protect',
        priority: 2,
        timeout: 5000,
        enabled: true,
        coverageTypes: ['domestic', 'international', 'senior', 'group'],
        features: ['cashless_hospitalization', 'home_burglary', 'sponsor_protection'],
        maxCoverAmount: 5000000,
        credentials: {
            apiKey: process.env.TATA_AIG_API_KEY,
            secretKey: process.env.TATA_AIG_SECRET
        }
    },
    'RELIANCE_GENERAL': {
        id: 'RELIANCE_GENERAL',
        name: 'Reliance General',
        type: 'indian',
        baseUrl: 'https://api.reliancegeneral.co.in/travel',
        priority: 3,
        timeout: 6000,
        enabled: true,
        coverageTypes: ['domestic', 'international', 'family'],
        features: ['medical_cover', 'trip_cancellation', 'baggage_delay'],
        maxCoverAmount: 3000000,
        credentials: {
            apiKey: process.env.RELIANCE_API_KEY
        }
    },
    'NEW_INDIA': {
        id: 'NEW_INDIA',
        name: 'New India Assurance',
        type: 'indian',
        baseUrl: 'https://api.newindia.co.in/overseas-travel',
        priority: 3,
        timeout: 6000,
        enabled: true,
        coverageTypes: ['international', 'student', 'employment'],
        features: ['overseas_medical', 'study_interruption', 'sponsor_protection'],
        maxCoverAmount: 10000000,
        credentials: {
            apiKey: process.env.NEW_INDIA_API_KEY
        }
    },
    'ORIENTAL': {
        id: 'ORIENTAL',
        name: 'Oriental Insurance',
        type: 'indian',
        baseUrl: 'https://api.orientalinsurance.org.in/travel',
        priority: 4,
        timeout: 6000,
        enabled: true,
        coverageTypes: ['domestic', 'international'],
        features: ['basic_medical', 'accident_cover', 'baggage_loss'],
        maxCoverAmount: 2500000,
        credentials: {
            apiKey: process.env.ORIENTAL_API_KEY
        }
    },
    'SBI_GENERAL': {
        id: 'SBI_GENERAL',
        name: 'SBI General Insurance',
        type: 'indian',
        baseUrl: 'https://api.sbigeneral.in/travel',
        priority: 3,
        timeout: 5000,
        enabled: true,
        coverageTypes: ['domestic', 'international', 'student'],
        features: ['medical_emergency', 'trip_delay', 'document_loss'],
        maxCoverAmount: 5000000,
        credentials: {
            apiKey: process.env.SBI_GENERAL_API_KEY
        }
    },
    'STAR_HEALTH': {
        id: 'STAR_HEALTH',
        name: 'Star Health',
        type: 'indian',
        baseUrl: 'https://api.starhealth.in/travel',
        priority: 2,
        timeout: 5000,
        enabled: true,
        coverageTypes: ['international', 'senior', 'family'],
        features: ['comprehensive_medical', 'pre_existing_cover', 'covid_cover'],
        maxCoverAmount: 10000000,
        credentials: {
            apiKey: process.env.STAR_HEALTH_API_KEY
        }
    },
    'CARE_HEALTH': {
        id: 'CARE_HEALTH',
        name: 'Care Health Insurance',
        type: 'indian',
        baseUrl: 'https://api.careinsurance.com/travel',
        priority: 3,
        timeout: 5000,
        enabled: true,
        coverageTypes: ['international', 'student', 'senior'],
        features: ['medical_cover', 'dental_emergency', 'maternity'],
        maxCoverAmount: 5000000,
        credentials: {
            apiKey: process.env.CARE_HEALTH_API_KEY
        }
    },

    // International Insurance Providers
    'ALLIANZ_GLOBAL': {
        id: 'ALLIANZ_GLOBAL',
        name: 'Allianz Global Assistance',
        type: 'international',
        baseUrl: 'https://api.allianzassistance.com/v2/travel',
        priority: 1,
        timeout: 6000,
        enabled: true,
        coverageTypes: ['international', 'annual_multi_trip', 'business', 'adventure'],
        features: ['worldwide_cover', '24x7_assistance', 'covid_cover', 'cancel_for_any_reason'],
        maxCoverAmount: 50000000,
        credentials: {
            apiKey: process.env.ALLIANZ_GLOBAL_API_KEY,
            partnerId: process.env.ALLIANZ_GLOBAL_PARTNER_ID
        }
    },
    'AXA_ASSISTANCE': {
        id: 'AXA_ASSISTANCE',
        name: 'AXA Assistance',
        type: 'international',
        baseUrl: 'https://api.axa-assistance.com/travel',
        priority: 1,
        timeout: 6000,
        enabled: true,
        coverageTypes: ['international', 'schengen', 'annual', 'corporate'],
        features: ['schengen_compliant', 'worldwide_network', 'cashless_treatment'],
        maxCoverAmount: 75000000,
        credentials: {
            apiKey: process.env.AXA_API_KEY
        }
    },
    'WORLD_NOMADS': {
        id: 'WORLD_NOMADS',
        name: 'World Nomads',
        type: 'international',
        baseUrl: 'https://api.worldnomads.com/v1/quotes',
        priority: 2,
        timeout: 7000,
        enabled: true,
        coverageTypes: ['adventure', 'backpacker', 'international'],
        features: ['adventure_sports', 'extreme_sports', 'flexible_dates', 'extend_online'],
        maxCoverAmount: 100000000,
        credentials: {
            apiKey: process.env.WORLD_NOMADS_API_KEY,
            affiliateId: process.env.WORLD_NOMADS_AFFILIATE_ID
        }
    },
    'TRAVEL_GUARD': {
        id: 'TRAVEL_GUARD',
        name: 'Travel Guard (AIG)',
        type: 'international',
        baseUrl: 'https://api.travelguard.com/v2',
        priority: 2,
        timeout: 6000,
        enabled: true,
        coverageTypes: ['international', 'cruise', 'business', 'luxury'],
        features: ['trip_cancellation', 'medical_evacuation', 'concierge_service'],
        maxCoverAmount: 150000000,
        credentials: {
            apiKey: process.env.TRAVEL_GUARD_API_KEY
        }
    },
    'IMG_GLOBAL': {
        id: 'IMG_GLOBAL',
        name: 'IMG Global',
        type: 'international',
        baseUrl: 'https://api.imglobal.com/travel',
        priority: 3,
        timeout: 6000,
        enabled: true,
        coverageTypes: ['international', 'student', 'missionary', 'expat'],
        features: ['long_term_cover', 'study_abroad', 'mission_trips'],
        maxCoverAmount: 80000000,
        credentials: {
            apiKey: process.env.IMG_GLOBAL_API_KEY
        }
    },
    'SEVEN_CORNERS': {
        id: 'SEVEN_CORNERS',
        name: 'Seven Corners',
        type: 'international',
        baseUrl: 'https://api.sevencorners.com/quotes',
        priority: 3,
        timeout: 6000,
        enabled: true,
        coverageTypes: ['international', 'student', 'group', 'missionary'],
        features: ['trip_protection', 'medical_only', 'evacuation_only'],
        maxCoverAmount: 50000000,
        credentials: {
            apiKey: process.env.SEVEN_CORNERS_API_KEY
        }
    },
    'GENERALI_GLOBAL': {
        id: 'GENERALI_GLOBAL',
        name: 'Generali Global Assistance',
        type: 'international',
        baseUrl: 'https://api.generaliglobalassistance.com/travel',
        priority: 2,
        timeout: 6000,
        enabled: true,
        coverageTypes: ['international', 'schengen', 'annual', 'family'],
        features: ['european_network', 'schengen_visa', 'family_plans'],
        maxCoverAmount: 60000000,
        credentials: {
            apiKey: process.env.GENERALI_API_KEY
        }
    },

    // Aggregator/Comparison APIs
    'POLICYBAZAAR': {
        id: 'POLICYBAZAAR',
        name: 'PolicyBazaar',
        type: 'aggregator',
        baseUrl: 'https://api.policybazaar.com/travel-insurance',
        priority: 1,
        timeout: 8000,
        enabled: true,
        coverageTypes: ['domestic', 'international', 'student', 'senior', 'family'],
        features: ['multi_quote', 'comparison', 'instant_policy'],
        maxCoverAmount: 10000000,
        credentials: {
            apiKey: process.env.POLICYBAZAAR_API_KEY,
            partnerId: process.env.POLICYBAZAAR_PARTNER_ID
        }
    },
    'COVERFOX': {
        id: 'COVERFOX',
        name: 'Coverfox',
        type: 'aggregator',
        baseUrl: 'https://api.coverfox.com/travel',
        priority: 2,
        timeout: 8000,
        enabled: true,
        coverageTypes: ['domestic', 'international', 'student'],
        features: ['multi_insurer', 'instant_quote', 'easy_claims'],
        maxCoverAmount: 7500000,
        credentials: {
            apiKey: process.env.COVERFOX_API_KEY
        }
    },
    'ACKO': {
        id: 'ACKO',
        name: 'Acko Insurance',
        type: 'digital',
        baseUrl: 'https://api.acko.com/travel',
        priority: 2,
        timeout: 5000,
        enabled: true,
        coverageTypes: ['domestic', 'international'],
        features: ['instant_policy', 'paperless', 'easy_claims', 'affordable'],
        maxCoverAmount: 2500000,
        credentials: {
            apiKey: process.env.ACKO_API_KEY
        }
    },
    'DIGIT': {
        id: 'DIGIT',
        name: 'Digit Insurance',
        type: 'digital',
        baseUrl: 'https://api.godigit.com/travel',
        priority: 2,
        timeout: 5000,
        enabled: true,
        coverageTypes: ['domestic', 'international', 'student'],
        features: ['simple_claims', 'transparent_pricing', 'instant_policy'],
        maxCoverAmount: 5000000,
        credentials: {
            apiKey: process.env.DIGIT_API_KEY
        }
    }
};

class InsuranceSupplierRegistry {
    constructor() {
        this.suppliers = { ...insuranceSuppliers };
        this.supplierStatus = new Map();

        // Initialize status for all suppliers
        Object.keys(this.suppliers).forEach(id => {
            this.supplierStatus.set(id, {
                healthy: true,
                lastCheck: Date.now(),
                failureCount: 0,
                avgResponseTime: 0,
                totalRequests: 0,
                successfulRequests: 0
            });
        });
    }

    /**
     * Get all enabled suppliers
     */
    getEnabledSuppliers() {
        return Object.values(this.suppliers)
            .filter(s => s.enabled && this.isHealthy(s.id))
            .sort((a, b) => a.priority - b.priority);
    }

    /**
     * Get suppliers by type
     */
    getSuppliersByType(type) {
        return Object.values(this.suppliers)
            .filter(s => s.enabled && s.type === type && this.isHealthy(s.id))
            .sort((a, b) => a.priority - b.priority);
    }

    /**
     * Get suppliers by coverage type
     */
    getSuppliersByCoverage(coverageType) {
        return Object.values(this.suppliers)
            .filter(s => s.enabled && s.coverageTypes.includes(coverageType) && this.isHealthy(s.id))
            .sort((a, b) => a.priority - b.priority);
    }

    /**
     * Get suppliers by feature
     */
    getSuppliersByFeature(feature) {
        return Object.values(this.suppliers)
            .filter(s => s.enabled && s.features.includes(feature) && this.isHealthy(s.id))
            .sort((a, b) => a.priority - b.priority);
    }

    /**
     * Get supplier by ID
     */
    getSupplier(supplierId) {
        return this.suppliers[supplierId];
    }

    /**
     * Check if supplier is healthy
     */
    isHealthy(supplierId) {
        const status = this.supplierStatus.get(supplierId);
        if (!status) return false;
        return status.healthy && status.failureCount < 5;
    }

    /**
     * Update supplier status after request
     */
    updateStatus(supplierId, success, responseTime) {
        const status = this.supplierStatus.get(supplierId);
        if (!status) return;

        status.totalRequests++;
        if (success) {
            status.successfulRequests++;
            status.failureCount = Math.max(0, status.failureCount - 1);
            status.avgResponseTime = (status.avgResponseTime * (status.successfulRequests - 1) + responseTime) / status.successfulRequests;
        } else {
            status.failureCount++;
            if (status.failureCount >= 5) {
                status.healthy = false;
                // Schedule recovery check
                setTimeout(() => this.checkRecovery(supplierId), 60000);
            }
        }
        status.lastCheck = Date.now();
    }

    /**
     * Check if supplier has recovered
     */
    checkRecovery(supplierId) {
        const status = this.supplierStatus.get(supplierId);
        if (status) {
            status.healthy = true;
            status.failureCount = 0;
        }
    }

    /**
     * Enable/disable supplier
     */
    setSupplierEnabled(supplierId, enabled) {
        if (this.suppliers[supplierId]) {
            this.suppliers[supplierId].enabled = enabled;
            return true;
        }
        return false;
    }

    /**
     * Get supplier statistics
     */
    getSupplierStats(supplierId) {
        const supplier = this.suppliers[supplierId];
        const status = this.supplierStatus.get(supplierId);
        if (!supplier || !status) return null;

        return {
            ...supplier,
            status: {
                healthy: status.healthy,
                failureCount: status.failureCount,
                avgResponseTime: Math.round(status.avgResponseTime),
                successRate: status.totalRequests > 0
                    ? Math.round((status.successfulRequests / status.totalRequests) * 100)
                    : 100,
                totalRequests: status.totalRequests
            }
        };
    }

    /**
     * Get all supplier statistics
     */
    getAllStats() {
        return Object.keys(this.suppliers).map(id => this.getSupplierStats(id));
    }

    /**
     * Add new supplier
     */
    addSupplier(supplier) {
        if (!supplier.id) throw new Error('Supplier ID required');
        this.suppliers[supplier.id] = supplier;
        this.supplierStatus.set(supplier.id, {
            healthy: true,
            lastCheck: Date.now(),
            failureCount: 0,
            avgResponseTime: 0,
            totalRequests: 0,
            successfulRequests: 0
        });
        return supplier;
    }

    /**
     * Update supplier configuration
     */
    updateSupplier(supplierId, updates) {
        if (!this.suppliers[supplierId]) return null;
        this.suppliers[supplierId] = { ...this.suppliers[supplierId], ...updates };
        return this.suppliers[supplierId];
    }

    /**
     * Remove supplier
     */
    removeSupplier(supplierId) {
        if (this.suppliers[supplierId]) {
            delete this.suppliers[supplierId];
            this.supplierStatus.delete(supplierId);
            return true;
        }
        return false;
    }

    /**
     * Get coverage types across all suppliers
     */
    getAllCoverageTypes() {
        const types = new Set();
        Object.values(this.suppliers).forEach(s => {
            s.coverageTypes.forEach(t => types.add(t));
        });
        return Array.from(types);
    }

    /**
     * Get all features across suppliers
     */
    getAllFeatures() {
        const features = new Set();
        Object.values(this.suppliers).forEach(s => {
            s.features.forEach(f => features.add(f));
        });
        return Array.from(features);
    }
}

module.exports = new InsuranceSupplierRegistry();
