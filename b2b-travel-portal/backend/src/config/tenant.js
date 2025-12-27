/**
 * Multi-Tenancy Configuration
 * Supports white-label deployments and API-as-a-Service
 */

// Subscription Plans
const SUBSCRIPTION_PLANS = {
    STARTER: {
        id: 'starter',
        name: 'Starter',
        price: 9999, // INR per month
        features: {
            maxAgents: 5,
            maxBookingsPerMonth: 100,
            apiAccess: false,
            whiteLabel: false,
            customDomain: false,
            prioritySupport: false,
            analytics: 'basic',
            markupManagement: true,
            groupBooking: false,
            fareCalendar: true,
            invoiceGeneration: true
        }
    },
    PROFESSIONAL: {
        id: 'professional',
        name: 'Professional',
        price: 24999,
        features: {
            maxAgents: 25,
            maxBookingsPerMonth: 500,
            apiAccess: true,
            apiCallsPerMonth: 10000,
            whiteLabel: true,
            customDomain: false,
            prioritySupport: true,
            analytics: 'advanced',
            markupManagement: true,
            groupBooking: true,
            fareCalendar: true,
            invoiceGeneration: true
        }
    },
    ENTERPRISE: {
        id: 'enterprise',
        name: 'Enterprise',
        price: 74999,
        features: {
            maxAgents: -1, // Unlimited
            maxBookingsPerMonth: -1,
            apiAccess: true,
            apiCallsPerMonth: -1,
            whiteLabel: true,
            customDomain: true,
            prioritySupport: true,
            analytics: 'enterprise',
            markupManagement: true,
            groupBooking: true,
            fareCalendar: true,
            invoiceGeneration: true,
            dedicatedSupport: true,
            slaGuarantee: true
        }
    },
    API_ONLY: {
        id: 'api_only',
        name: 'API Only',
        price: 14999,
        features: {
            maxAgents: 0,
            maxBookingsPerMonth: -1,
            apiAccess: true,
            apiCallsPerMonth: 50000,
            whiteLabel: false,
            customDomain: false,
            prioritySupport: false,
            analytics: 'api',
            portalAccess: false
        }
    }
};

// Default Branding Configuration
const DEFAULT_BRANDING = {
    companyName: 'Tripcode',
    logo: '/assets/logo.png',
    logoSmall: '/assets/logo-small.png',
    favicon: '/assets/favicon.ico',
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
    accentColor: '#3b82f6',
    headerBgColor: '#ffffff',
    sidebarBgColor: '#ffffff',
    footerText: 'Powered by Tripcode',
    supportEmail: 'support@tripcode.com',
    supportPhone: '+91-1800-123-4567',
    termsUrl: '/terms',
    privacyUrl: '/privacy'
};

// API Rate Limits by Plan
const API_RATE_LIMITS = {
    starter: {
        requestsPerMinute: 0,
        requestsPerHour: 0,
        requestsPerDay: 0
    },
    professional: {
        requestsPerMinute: 60,
        requestsPerHour: 1000,
        requestsPerDay: 10000
    },
    enterprise: {
        requestsPerMinute: 300,
        requestsPerHour: 10000,
        requestsPerDay: -1
    },
    api_only: {
        requestsPerMinute: 120,
        requestsPerHour: 5000,
        requestsPerDay: 50000
    }
};

/**
 * Generate API Key
 */
const generateApiKey = () => {
    const prefix = 'tc_live_';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = prefix;
    for (let i = 0; i < 32; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
};

/**
 * Generate Test API Key
 */
const generateTestApiKey = () => {
    const prefix = 'tc_test_';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = prefix;
    for (let i = 0; i < 32; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
};

/**
 * Validate custom domain
 */
const validateDomain = (domain) => {
    const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/;
    return domainRegex.test(domain);
};

/**
 * Check if feature is available for plan
 */
const isFeatureAvailable = (plan, feature) => {
    const planConfig = SUBSCRIPTION_PLANS[plan.toUpperCase()];
    if (!planConfig) return false;
    return !!planConfig.features[feature];
};

/**
 * Get plan limits
 */
const getPlanLimits = (plan) => {
    const planConfig = SUBSCRIPTION_PLANS[plan.toUpperCase()];
    if (!planConfig) return null;
    return planConfig.features;
};

module.exports = {
    SUBSCRIPTION_PLANS,
    DEFAULT_BRANDING,
    API_RATE_LIMITS,
    generateApiKey,
    generateTestApiKey,
    validateDomain,
    isFeatureAvailable,
    getPlanLimits
};
