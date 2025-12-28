/**
 * Insurance API Adapters
 * Unified interface for all insurance provider APIs
 */

/**
 * Base adapter class for insurance providers
 */
class BaseInsuranceAdapter {
    constructor(supplier) {
        this.supplier = supplier;
        this.baseUrl = supplier.baseUrl;
        this.timeout = supplier.timeout || 5000;
    }

    async getQuote(searchParams) {
        throw new Error('getQuote must be implemented');
    }

    async createPolicy(quoteId, travelerDetails, paymentInfo) {
        throw new Error('createPolicy must be implemented');
    }

    async getPolicyStatus(policyNumber) {
        throw new Error('getPolicyStatus must be implemented');
    }

    async cancelPolicy(policyNumber, reason) {
        throw new Error('cancelPolicy must be implemented');
    }

    async submitClaim(policyNumber, claimDetails) {
        throw new Error('submitClaim must be implemented');
    }

    normalizeQuote(rawQuote) {
        throw new Error('normalizeQuote must be implemented');
    }
}

/**
 * ICICI Lombard Adapter
 */
class ICICILombardAdapter extends BaseInsuranceAdapter {
    async getQuote(searchParams) {
        // Simulated API call
        const startTime = Date.now();
        await this.simulateApiCall();

        const plans = this.generatePlans(searchParams);
        return {
            supplier: this.supplier.id,
            responseTime: Date.now() - startTime,
            plans: plans.map(p => this.normalizeQuote(p, searchParams))
        };
    }

    generatePlans(params) {
        const basePremium = this.calculateBasePremium(params);
        return [
            {
                planId: 'ICICI_BASIC',
                planName: 'Travel Protect Basic',
                premium: basePremium,
                coverAmount: 250000,
                features: ['medical_emergency', 'accident_cover', 'baggage_loss']
            },
            {
                planId: 'ICICI_STANDARD',
                planName: 'Travel Protect Standard',
                premium: basePremium * 1.5,
                coverAmount: 500000,
                features: ['medical_emergency', 'accident_cover', 'baggage_loss', 'trip_cancellation', 'trip_delay']
            },
            {
                planId: 'ICICI_PREMIUM',
                planName: 'Travel Protect Premium',
                premium: basePremium * 2.2,
                coverAmount: 1000000,
                features: ['medical_emergency', 'accident_cover', 'baggage_loss', 'trip_cancellation', 'trip_delay', 'covid_cover', 'adventure_sports']
            }
        ];
    }

    calculateBasePremium(params) {
        let base = params.tripType === 'international' ? 800 : 200;
        base *= params.duration || 7;
        base *= (params.travelers?.length || 1);
        if (params.coverageType === 'senior') base *= 1.5;
        if (params.coverageType === 'student') base *= 0.8;
        return Math.round(base);
    }

    normalizeQuote(plan, params) {
        return {
            quoteId: `ICICI_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            supplierId: this.supplier.id,
            supplierName: this.supplier.name,
            planId: plan.planId,
            planName: plan.planName,
            planType: params.tripType,
            premium: {
                base: plan.premium,
                gst: Math.round(plan.premium * 0.18),
                total: Math.round(plan.premium * 1.18)
            },
            coverage: {
                sumInsured: plan.coverAmount,
                currency: 'INR',
                medicalExpenses: plan.coverAmount,
                tripCancellation: plan.features.includes('trip_cancellation') ? plan.coverAmount * 0.5 : 0,
                baggageLoss: plan.features.includes('baggage_loss') ? 25000 : 0,
                tripDelay: plan.features.includes('trip_delay') ? 5000 : 0,
                personalAccident: plan.coverAmount * 2
            },
            features: plan.features,
            inclusions: this.getInclusions(plan.features),
            exclusions: this.getExclusions(),
            termsUrl: 'https://www.icicilombard.com/travel-insurance/terms',
            validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };
    }

    getInclusions(features) {
        const allInclusions = {
            medical_emergency: 'Emergency medical treatment and hospitalization',
            accident_cover: 'Personal accident coverage',
            baggage_loss: 'Loss of checked baggage compensation',
            trip_cancellation: 'Trip cancellation due to unforeseen events',
            trip_delay: 'Compensation for trip delays over 6 hours',
            covid_cover: 'COVID-19 treatment coverage',
            adventure_sports: 'Adventure sports activities coverage'
        };
        return features.map(f => allInclusions[f]).filter(Boolean);
    }

    getExclusions() {
        return [
            'Pre-existing medical conditions (unless declared)',
            'Self-inflicted injuries',
            'War and terrorism',
            'Participation in professional sports',
            'Nuclear risks'
        ];
    }

    async simulateApiCall() {
        return new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
    }

    async createPolicy(quoteId, travelerDetails, paymentInfo) {
        await this.simulateApiCall();
        return {
            success: true,
            policyNumber: `ICICI${Date.now()}`,
            status: 'ACTIVE',
            startDate: travelerDetails.tripStartDate,
            endDate: travelerDetails.tripEndDate,
            downloadUrl: `https://www.icicilombard.com/policy/download/${quoteId}`
        };
    }

    async getPolicyStatus(policyNumber) {
        await this.simulateApiCall();
        return {
            policyNumber,
            status: 'ACTIVE',
            supplier: this.supplier.id
        };
    }

    async cancelPolicy(policyNumber, reason) {
        await this.simulateApiCall();
        return {
            success: true,
            refundAmount: 0,
            cancellationId: `CAN_${policyNumber}`
        };
    }

    async submitClaim(policyNumber, claimDetails) {
        await this.simulateApiCall();
        return {
            success: true,
            claimNumber: `CLM_${Date.now()}`,
            status: 'SUBMITTED',
            estimatedProcessingDays: 7
        };
    }
}

/**
 * HDFC ERGO Adapter
 */
class HDFCErgoAdapter extends BaseInsuranceAdapter {
    async getQuote(searchParams) {
        const startTime = Date.now();
        await this.simulateApiCall();

        const plans = this.generatePlans(searchParams);
        return {
            supplier: this.supplier.id,
            responseTime: Date.now() - startTime,
            plans: plans.map(p => this.normalizeQuote(p, searchParams))
        };
    }

    generatePlans(params) {
        const basePremium = this.calculateBasePremium(params);
        return [
            {
                planId: 'HDFC_SILVER',
                planName: 'Optima Secure Silver',
                premium: basePremium,
                coverAmount: 300000,
                features: ['medical_emergency', 'personal_liability', 'baggage_loss']
            },
            {
                planId: 'HDFC_GOLD',
                planName: 'Optima Secure Gold',
                premium: basePremium * 1.6,
                coverAmount: 750000,
                features: ['medical_emergency', 'personal_liability', 'baggage_loss', 'trip_cancellation', 'passport_loss', 'trip_delay']
            },
            {
                planId: 'HDFC_PLATINUM',
                planName: 'Optima Secure Platinum',
                premium: basePremium * 2.5,
                coverAmount: 1500000,
                features: ['medical_emergency', 'personal_liability', 'baggage_loss', 'trip_cancellation', 'passport_loss', 'trip_delay', 'medical_evacuation', 'home_burglary']
            }
        ];
    }

    calculateBasePremium(params) {
        let base = params.tripType === 'international' ? 750 : 180;
        base *= params.duration || 7;
        base *= (params.travelers?.length || 1);
        if (params.destination === 'USA' || params.destination === 'CANADA') base *= 1.3;
        return Math.round(base);
    }

    normalizeQuote(plan, params) {
        return {
            quoteId: `HDFC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            supplierId: this.supplier.id,
            supplierName: this.supplier.name,
            planId: plan.planId,
            planName: plan.planName,
            planType: params.tripType,
            premium: {
                base: plan.premium,
                gst: Math.round(plan.premium * 0.18),
                total: Math.round(plan.premium * 1.18)
            },
            coverage: {
                sumInsured: plan.coverAmount,
                currency: 'INR',
                medicalExpenses: plan.coverAmount,
                tripCancellation: plan.features.includes('trip_cancellation') ? plan.coverAmount * 0.5 : 0,
                baggageLoss: plan.features.includes('baggage_loss') ? 30000 : 0,
                tripDelay: plan.features.includes('trip_delay') ? 7500 : 0,
                personalAccident: plan.coverAmount * 2,
                personalLiability: plan.features.includes('personal_liability') ? 100000 : 0
            },
            features: plan.features,
            inclusions: plan.features.map(f => this.getFeatureDescription(f)),
            exclusions: this.getExclusions(),
            termsUrl: 'https://www.hdfcergo.com/travel-insurance/terms',
            validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };
    }

    getFeatureDescription(feature) {
        const descriptions = {
            medical_emergency: '24x7 medical emergency assistance',
            personal_liability: 'Third party liability coverage',
            baggage_loss: 'Baggage loss/delay compensation',
            trip_cancellation: 'Trip cancellation reimbursement',
            passport_loss: 'Passport loss assistance',
            trip_delay: 'Trip delay compensation',
            medical_evacuation: 'Emergency medical evacuation',
            home_burglary: 'Home burglary coverage during travel'
        };
        return descriptions[feature] || feature;
    }

    getExclusions() {
        return [
            'Pre-existing conditions',
            'Alcohol/drug related incidents',
            'Adventurous activities (unless opted)',
            'Mental disorders',
            'Pregnancy related claims'
        ];
    }

    async simulateApiCall() {
        return new Promise(resolve => setTimeout(resolve, 250 + Math.random() * 350));
    }

    async createPolicy(quoteId, travelerDetails, paymentInfo) {
        await this.simulateApiCall();
        return {
            success: true,
            policyNumber: `HDFC${Date.now()}`,
            status: 'ACTIVE',
            startDate: travelerDetails.tripStartDate,
            endDate: travelerDetails.tripEndDate,
            downloadUrl: `https://www.hdfcergo.com/policy/${quoteId}`
        };
    }

    async getPolicyStatus(policyNumber) {
        await this.simulateApiCall();
        return { policyNumber, status: 'ACTIVE', supplier: this.supplier.id };
    }

    async cancelPolicy(policyNumber, reason) {
        await this.simulateApiCall();
        return { success: true, refundAmount: 0, cancellationId: `CAN_${policyNumber}` };
    }

    async submitClaim(policyNumber, claimDetails) {
        await this.simulateApiCall();
        return { success: true, claimNumber: `CLM_${Date.now()}`, status: 'SUBMITTED' };
    }
}

/**
 * Bajaj Allianz Adapter
 */
class BajajAllianzAdapter extends BaseInsuranceAdapter {
    async getQuote(searchParams) {
        const startTime = Date.now();
        await this.simulateApiCall();

        const plans = this.generatePlans(searchParams);
        return {
            supplier: this.supplier.id,
            responseTime: Date.now() - startTime,
            plans: plans.map(p => this.normalizeQuote(p, searchParams))
        };
    }

    generatePlans(params) {
        const basePremium = this.calculateBasePremium(params);
        return [
            {
                planId: 'BAJAJ_ESSENTIAL',
                planName: 'Travel Guard Essential',
                premium: basePremium,
                coverAmount: 200000,
                features: ['medical_emergency', 'accident_cover']
            },
            {
                planId: 'BAJAJ_ELITE',
                planName: 'Travel Guard Elite',
                premium: basePremium * 1.8,
                coverAmount: 1000000,
                features: ['medical_emergency', 'accident_cover', 'medical_evacuation', 'repatriation', 'trip_cancellation']
            },
            {
                planId: 'BAJAJ_ADVENTURE',
                planName: 'Travel Guard Adventure',
                premium: basePremium * 2.8,
                coverAmount: 2000000,
                features: ['medical_emergency', 'accident_cover', 'medical_evacuation', 'repatriation', 'trip_cancellation', 'adventure_cover', 'pre_existing']
            }
        ];
    }

    calculateBasePremium(params) {
        let base = params.tripType === 'international' ? 700 : 150;
        base *= params.duration || 7;
        base *= (params.travelers?.length || 1);
        return Math.round(base);
    }

    normalizeQuote(plan, params) {
        return {
            quoteId: `BAJAJ_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            supplierId: this.supplier.id,
            supplierName: this.supplier.name,
            planId: plan.planId,
            planName: plan.planName,
            planType: params.tripType,
            premium: {
                base: plan.premium,
                gst: Math.round(plan.premium * 0.18),
                total: Math.round(plan.premium * 1.18)
            },
            coverage: {
                sumInsured: plan.coverAmount,
                currency: 'INR',
                medicalExpenses: plan.coverAmount,
                medicalEvacuation: plan.features.includes('medical_evacuation') ? 500000 : 0,
                repatriation: plan.features.includes('repatriation') ? 500000 : 0,
                tripCancellation: plan.features.includes('trip_cancellation') ? plan.coverAmount * 0.3 : 0,
                personalAccident: plan.coverAmount
            },
            features: plan.features,
            inclusions: plan.features.map(f => f.replace(/_/g, ' ')),
            exclusions: ['Pre-existing conditions (except premium plan)', 'War risks', 'Suicide'],
            termsUrl: 'https://www.bajajallianz.com/travel-insurance/terms',
            validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };
    }

    async simulateApiCall() {
        return new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 400));
    }

    async createPolicy(quoteId, travelerDetails, paymentInfo) {
        await this.simulateApiCall();
        return {
            success: true,
            policyNumber: `BAJAJ${Date.now()}`,
            status: 'ACTIVE',
            startDate: travelerDetails.tripStartDate,
            endDate: travelerDetails.tripEndDate
        };
    }

    async getPolicyStatus(policyNumber) {
        await this.simulateApiCall();
        return { policyNumber, status: 'ACTIVE', supplier: this.supplier.id };
    }

    async cancelPolicy(policyNumber, reason) {
        await this.simulateApiCall();
        return { success: true, refundAmount: 0 };
    }

    async submitClaim(policyNumber, claimDetails) {
        await this.simulateApiCall();
        return { success: true, claimNumber: `CLM_${Date.now()}`, status: 'SUBMITTED' };
    }
}

/**
 * Allianz Global Adapter (International)
 */
class AllianzGlobalAdapter extends BaseInsuranceAdapter {
    async getQuote(searchParams) {
        const startTime = Date.now();
        await this.simulateApiCall();

        const plans = this.generatePlans(searchParams);
        return {
            supplier: this.supplier.id,
            responseTime: Date.now() - startTime,
            plans: plans.map(p => this.normalizeQuote(p, searchParams))
        };
    }

    generatePlans(params) {
        const basePremium = this.calculateBasePremium(params);
        return [
            {
                planId: 'ALLIANZ_ESSENTIAL',
                planName: 'Allianz Essential',
                premium: basePremium,
                coverAmount: 50000, // USD
                features: ['worldwide_cover', 'medical_emergency', '24x7_assistance']
            },
            {
                planId: 'ALLIANZ_CLASSIC',
                planName: 'Allianz Classic',
                premium: basePremium * 1.7,
                coverAmount: 100000,
                features: ['worldwide_cover', 'medical_emergency', '24x7_assistance', 'trip_cancellation', 'baggage_cover', 'covid_cover']
            },
            {
                planId: 'ALLIANZ_PREMIER',
                planName: 'Allianz Premier',
                premium: basePremium * 3,
                coverAmount: 500000,
                features: ['worldwide_cover', 'medical_emergency', '24x7_assistance', 'trip_cancellation', 'baggage_cover', 'covid_cover', 'cancel_for_any_reason', 'adventure_sports']
            }
        ];
    }

    calculateBasePremium(params) {
        let base = 2500; // Higher base for international coverage
        base *= (params.duration || 7) * 0.15;
        base *= (params.travelers?.length || 1);
        if (params.destination === 'USA') base *= 1.5;
        return Math.round(base);
    }

    normalizeQuote(plan, params) {
        const usdToInr = 83;
        return {
            quoteId: `ALLIANZ_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            supplierId: this.supplier.id,
            supplierName: this.supplier.name,
            planId: plan.planId,
            planName: plan.planName,
            planType: 'international',
            premium: {
                base: plan.premium,
                gst: Math.round(plan.premium * 0.18),
                total: Math.round(plan.premium * 1.18)
            },
            coverage: {
                sumInsured: plan.coverAmount * usdToInr,
                sumInsuredUSD: plan.coverAmount,
                currency: 'INR',
                currencyUSD: 'USD',
                medicalExpenses: plan.coverAmount * usdToInr,
                tripCancellation: plan.features.includes('trip_cancellation') ? plan.coverAmount * 0.5 * usdToInr : 0,
                baggageLoss: plan.features.includes('baggage_cover') ? 2500 * usdToInr : 0,
                personalAccident: plan.coverAmount * 2 * usdToInr
            },
            features: plan.features,
            inclusions: [
                'Worldwide emergency assistance',
                '24/7 multilingual helpline',
                'Cashless hospitalization network',
                'Direct billing with hospitals'
            ],
            exclusions: ['Pre-existing conditions', 'High-risk activities (unless covered)'],
            termsUrl: 'https://www.allianz.com/travel/terms',
            validUntil: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
        };
    }

    async simulateApiCall() {
        return new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));
    }

    async createPolicy(quoteId, travelerDetails, paymentInfo) {
        await this.simulateApiCall();
        return {
            success: true,
            policyNumber: `ALZ${Date.now()}`,
            status: 'ACTIVE',
            startDate: travelerDetails.tripStartDate,
            endDate: travelerDetails.tripEndDate
        };
    }

    async getPolicyStatus(policyNumber) {
        await this.simulateApiCall();
        return { policyNumber, status: 'ACTIVE', supplier: this.supplier.id };
    }

    async cancelPolicy(policyNumber, reason) {
        await this.simulateApiCall();
        return { success: true, refundAmount: 0 };
    }

    async submitClaim(policyNumber, claimDetails) {
        await this.simulateApiCall();
        return { success: true, claimNumber: `CLM_${Date.now()}`, status: 'SUBMITTED' };
    }
}

/**
 * World Nomads Adapter (Adventure Travel)
 */
class WorldNomadsAdapter extends BaseInsuranceAdapter {
    async getQuote(searchParams) {
        const startTime = Date.now();
        await this.simulateApiCall();

        const plans = this.generatePlans(searchParams);
        return {
            supplier: this.supplier.id,
            responseTime: Date.now() - startTime,
            plans: plans.map(p => this.normalizeQuote(p, searchParams))
        };
    }

    generatePlans(params) {
        const basePremium = this.calculateBasePremium(params);
        return [
            {
                planId: 'WN_STANDARD',
                planName: 'Standard Plan',
                premium: basePremium,
                coverAmount: 100000,
                features: ['adventure_sports', 'medical_emergency', 'trip_cancellation']
            },
            {
                planId: 'WN_EXPLORER',
                planName: 'Explorer Plan',
                premium: basePremium * 1.8,
                coverAmount: 250000,
                features: ['adventure_sports', 'extreme_sports', 'medical_emergency', 'trip_cancellation', 'flexible_dates', 'extend_online']
            }
        ];
    }

    calculateBasePremium(params) {
        let base = 3000;
        base *= (params.duration || 7) * 0.12;
        base *= (params.travelers?.length || 1);
        return Math.round(base);
    }

    normalizeQuote(plan, params) {
        const usdToInr = 83;
        return {
            quoteId: `WN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            supplierId: this.supplier.id,
            supplierName: this.supplier.name,
            planId: plan.planId,
            planName: plan.planName,
            planType: 'adventure',
            premium: {
                base: plan.premium,
                gst: Math.round(plan.premium * 0.18),
                total: Math.round(plan.premium * 1.18)
            },
            coverage: {
                sumInsured: plan.coverAmount * usdToInr,
                sumInsuredUSD: plan.coverAmount,
                currency: 'INR',
                medicalExpenses: plan.coverAmount * usdToInr,
                adventureSports: plan.features.includes('adventure_sports'),
                extremeSports: plan.features.includes('extreme_sports'),
                tripCancellation: plan.coverAmount * 0.5 * usdToInr
            },
            features: plan.features,
            adventureActivities: [
                'Trekking', 'Scuba Diving', 'Bungee Jumping', 'Paragliding',
                'White Water Rafting', 'Skiing', 'Snowboarding', 'Rock Climbing'
            ],
            inclusions: ['150+ adventure activities covered', 'Extend policy while traveling'],
            exclusions: ['Professional sports', 'Base jumping', 'Mountaineering above 6000m'],
            termsUrl: 'https://www.worldnomads.com/terms',
            validUntil: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString()
        };
    }

    async simulateApiCall() {
        return new Promise(resolve => setTimeout(resolve, 350 + Math.random() * 400));
    }

    async createPolicy(quoteId, travelerDetails, paymentInfo) {
        await this.simulateApiCall();
        return { success: true, policyNumber: `WN${Date.now()}`, status: 'ACTIVE' };
    }

    async getPolicyStatus(policyNumber) {
        await this.simulateApiCall();
        return { policyNumber, status: 'ACTIVE', supplier: this.supplier.id };
    }

    async cancelPolicy(policyNumber, reason) {
        await this.simulateApiCall();
        return { success: true, refundAmount: 0 };
    }

    async submitClaim(policyNumber, claimDetails) {
        await this.simulateApiCall();
        return { success: true, claimNumber: `CLM_${Date.now()}`, status: 'SUBMITTED' };
    }
}

/**
 * Generic Adapter for other providers
 */
class GenericInsuranceAdapter extends BaseInsuranceAdapter {
    async getQuote(searchParams) {
        const startTime = Date.now();
        await this.simulateApiCall();

        const plans = this.generatePlans(searchParams);
        return {
            supplier: this.supplier.id,
            responseTime: Date.now() - startTime,
            plans: plans.map(p => this.normalizeQuote(p, searchParams))
        };
    }

    generatePlans(params) {
        const basePremium = this.calculateBasePremium(params);
        const multiplier = this.supplier.type === 'international' ? 1.5 : 1;

        return [
            {
                planId: `${this.supplier.id}_BASIC`,
                planName: `${this.supplier.name} Basic`,
                premium: basePremium * multiplier,
                coverAmount: 250000 * multiplier,
                features: this.supplier.features.slice(0, 3)
            },
            {
                planId: `${this.supplier.id}_STANDARD`,
                planName: `${this.supplier.name} Standard`,
                premium: basePremium * 1.5 * multiplier,
                coverAmount: 500000 * multiplier,
                features: this.supplier.features.slice(0, 5)
            },
            {
                planId: `${this.supplier.id}_PREMIUM`,
                planName: `${this.supplier.name} Premium`,
                premium: basePremium * 2.5 * multiplier,
                coverAmount: 1000000 * multiplier,
                features: this.supplier.features
            }
        ];
    }

    calculateBasePremium(params) {
        let base = params.tripType === 'international' ? 600 : 150;
        base *= (params.duration || 7);
        base *= (params.travelers?.length || 1);
        return Math.round(base);
    }

    normalizeQuote(plan, params) {
        return {
            quoteId: `${this.supplier.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            supplierId: this.supplier.id,
            supplierName: this.supplier.name,
            planId: plan.planId,
            planName: plan.planName,
            planType: params.tripType,
            premium: {
                base: plan.premium,
                gst: Math.round(plan.premium * 0.18),
                total: Math.round(plan.premium * 1.18)
            },
            coverage: {
                sumInsured: plan.coverAmount,
                currency: 'INR',
                medicalExpenses: plan.coverAmount,
                personalAccident: plan.coverAmount
            },
            features: plan.features,
            inclusions: plan.features.map(f => f.replace(/_/g, ' ')),
            exclusions: ['Pre-existing conditions', 'War and terrorism'],
            termsUrl: this.supplier.baseUrl + '/terms',
            validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };
    }

    async simulateApiCall() {
        const delay = this.supplier.timeout ? this.supplier.timeout * 0.3 : 300;
        return new Promise(resolve => setTimeout(resolve, delay + Math.random() * 300));
    }

    async createPolicy(quoteId, travelerDetails, paymentInfo) {
        await this.simulateApiCall();
        return { success: true, policyNumber: `${this.supplier.id}${Date.now()}`, status: 'ACTIVE' };
    }

    async getPolicyStatus(policyNumber) {
        await this.simulateApiCall();
        return { policyNumber, status: 'ACTIVE', supplier: this.supplier.id };
    }

    async cancelPolicy(policyNumber, reason) {
        await this.simulateApiCall();
        return { success: true, refundAmount: 0 };
    }

    async submitClaim(policyNumber, claimDetails) {
        await this.simulateApiCall();
        return { success: true, claimNumber: `CLM_${Date.now()}`, status: 'SUBMITTED' };
    }
}

/**
 * Adapter Factory
 */
class InsuranceAdapterFactory {
    static createAdapter(supplier) {
        switch (supplier.id) {
            case 'ICICI_LOMBARD':
                return new ICICILombardAdapter(supplier);
            case 'HDFC_ERGO':
                return new HDFCErgoAdapter(supplier);
            case 'BAJAJ_ALLIANZ':
                return new BajajAllianzAdapter(supplier);
            case 'ALLIANZ_GLOBAL':
                return new AllianzGlobalAdapter(supplier);
            case 'WORLD_NOMADS':
                return new WorldNomadsAdapter(supplier);
            default:
                return new GenericInsuranceAdapter(supplier);
        }
    }
}

module.exports = {
    InsuranceAdapterFactory,
    BaseInsuranceAdapter,
    ICICILombardAdapter,
    HDFCErgoAdapter,
    BajajAllianzAdapter,
    AllianzGlobalAdapter,
    WorldNomadsAdapter,
    GenericInsuranceAdapter
};
