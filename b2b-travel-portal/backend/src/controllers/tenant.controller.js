/**
 * Tenant Controller
 * Manages multi-tenancy operations for white-label deployments
 */

const {
    SUBSCRIPTION_PLANS,
    DEFAULT_BRANDING,
    generateApiKey,
    generateTestApiKey,
    validateDomain,
    getPlanLimits
} = require('../config/tenant');

// In-memory storage (replace with database in production)
const tenants = new Map();
const apiKeys = new Map();

/**
 * Create a new tenant
 */
const createTenant = async (req, res) => {
    try {
        const {
            companyName,
            email,
            phone,
            plan = 'STARTER',
            billingAddress,
            gstNumber
        } = req.body;

        if (!companyName || !email) {
            return res.status(400).json({ error: 'Company name and email are required' });
        }

        const planConfig = SUBSCRIPTION_PLANS[plan.toUpperCase()];
        if (!planConfig) {
            return res.status(400).json({ error: 'Invalid subscription plan' });
        }

        const tenantId = `tenant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const tenant = {
            id: tenantId,
            companyName,
            email,
            phone,
            plan: plan.toUpperCase(),
            status: 'active',
            branding: { ...DEFAULT_BRANDING, companyName },
            customDomain: null,
            billingAddress,
            gstNumber,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            subscription: {
                planId: planConfig.id,
                startDate: new Date().toISOString(),
                nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                amount: planConfig.price,
                status: 'trial',
                trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
            },
            usage: {
                agentsCount: 0,
                bookingsThisMonth: 0,
                apiCallsThisMonth: 0,
                lastResetDate: new Date().toISOString()
            },
            settings: {
                defaultCurrency: 'INR',
                timezone: 'Asia/Kolkata',
                dateFormat: 'DD/MM/YYYY',
                emailNotifications: true,
                smsNotifications: false
            }
        };

        tenants.set(tenantId, tenant);

        // Generate API keys if plan supports it
        let keys = null;
        if (planConfig.features.apiAccess) {
            keys = {
                liveKey: generateApiKey(),
                testKey: generateTestApiKey(),
                tenantId,
                createdAt: new Date().toISOString()
            };
            apiKeys.set(keys.liveKey, { ...keys, type: 'live' });
            apiKeys.set(keys.testKey, { ...keys, type: 'test' });
        }

        res.status(201).json({
            message: 'Tenant created successfully',
            tenant: {
                ...tenant,
                apiKeys: keys ? { liveKey: keys.liveKey, testKey: keys.testKey } : null
            }
        });
    } catch (error) {
        console.error('Error creating tenant:', error);
        res.status(500).json({ error: 'Failed to create tenant' });
    }
};

/**
 * Get tenant details
 */
const getTenant = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const tenant = tenants.get(tenantId);

        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        res.json(tenant);
    } catch (error) {
        console.error('Error fetching tenant:', error);
        res.status(500).json({ error: 'Failed to fetch tenant' });
    }
};

/**
 * Update tenant details
 */
const updateTenant = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const tenant = tenants.get(tenantId);

        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        const allowedUpdates = ['companyName', 'email', 'phone', 'billingAddress', 'gstNumber', 'settings'];

        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                if (field === 'settings') {
                    tenant.settings = { ...tenant.settings, ...req.body.settings };
                } else {
                    tenant[field] = req.body[field];
                }
            }
        });

        tenant.updatedAt = new Date().toISOString();
        tenants.set(tenantId, tenant);

        res.json({ message: 'Tenant updated successfully', tenant });
    } catch (error) {
        console.error('Error updating tenant:', error);
        res.status(500).json({ error: 'Failed to update tenant' });
    }
};

/**
 * Update tenant branding
 */
const updateBranding = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const tenant = tenants.get(tenantId);

        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        const planConfig = SUBSCRIPTION_PLANS[tenant.plan];
        if (!planConfig.features.whiteLabel) {
            return res.status(403).json({ error: 'White-label branding not available on your plan. Please upgrade.' });
        }

        tenant.branding = {
            ...tenant.branding,
            ...req.body
        };
        tenant.updatedAt = new Date().toISOString();
        tenants.set(tenantId, tenant);

        res.json({ message: 'Branding updated successfully', branding: tenant.branding });
    } catch (error) {
        console.error('Error updating branding:', error);
        res.status(500).json({ error: 'Failed to update branding' });
    }
};

/**
 * Set custom domain
 */
const setCustomDomain = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const { domain } = req.body;
        const tenant = tenants.get(tenantId);

        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        const planConfig = SUBSCRIPTION_PLANS[tenant.plan];
        if (!planConfig.features.customDomain) {
            return res.status(403).json({ error: 'Custom domain not available on your plan. Please upgrade to Enterprise.' });
        }

        if (!validateDomain(domain)) {
            return res.status(400).json({ error: 'Invalid domain format' });
        }

        tenant.customDomain = {
            domain,
            status: 'pending_verification',
            verificationToken: `tc_verify_${Math.random().toString(36).substr(2, 16)}`,
            createdAt: new Date().toISOString()
        };
        tenant.updatedAt = new Date().toISOString();
        tenants.set(tenantId, tenant);

        res.json({
            message: 'Custom domain added. Please add the verification TXT record to your DNS.',
            domain: tenant.customDomain
        });
    } catch (error) {
        console.error('Error setting custom domain:', error);
        res.status(500).json({ error: 'Failed to set custom domain' });
    }
};

/**
 * Get subscription plans
 */
const getPlans = async (req, res) => {
    try {
        const plans = Object.values(SUBSCRIPTION_PLANS).map(plan => ({
            ...plan,
            priceFormatted: `₹${plan.price.toLocaleString()}/month`
        }));

        res.json(plans);
    } catch (error) {
        console.error('Error fetching plans:', error);
        res.status(500).json({ error: 'Failed to fetch plans' });
    }
};

/**
 * Change subscription plan
 */
const changePlan = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const { newPlan } = req.body;
        const tenant = tenants.get(tenantId);

        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        const planConfig = SUBSCRIPTION_PLANS[newPlan.toUpperCase()];
        if (!planConfig) {
            return res.status(400).json({ error: 'Invalid subscription plan' });
        }

        const oldPlan = tenant.plan;
        tenant.plan = newPlan.toUpperCase();
        tenant.subscription = {
            ...tenant.subscription,
            planId: planConfig.id,
            amount: planConfig.price,
            changedAt: new Date().toISOString()
        };
        tenant.updatedAt = new Date().toISOString();

        // Generate API keys if upgrading to a plan with API access
        let newKeys = null;
        if (planConfig.features.apiAccess && !SUBSCRIPTION_PLANS[oldPlan].features.apiAccess) {
            newKeys = {
                liveKey: generateApiKey(),
                testKey: generateTestApiKey(),
                tenantId,
                createdAt: new Date().toISOString()
            };
            apiKeys.set(newKeys.liveKey, { ...newKeys, type: 'live' });
            apiKeys.set(newKeys.testKey, { ...newKeys, type: 'test' });
        }

        tenants.set(tenantId, tenant);

        res.json({
            message: `Plan changed from ${oldPlan} to ${newPlan.toUpperCase()}`,
            tenant,
            newApiKeys: newKeys ? { liveKey: newKeys.liveKey, testKey: newKeys.testKey } : null
        });
    } catch (error) {
        console.error('Error changing plan:', error);
        res.status(500).json({ error: 'Failed to change plan' });
    }
};

/**
 * Get tenant usage statistics
 */
const getUsage = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const tenant = tenants.get(tenantId);

        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        const limits = getPlanLimits(tenant.plan);

        res.json({
            usage: tenant.usage,
            limits: {
                maxAgents: limits.maxAgents,
                maxBookingsPerMonth: limits.maxBookingsPerMonth,
                apiCallsPerMonth: limits.apiCallsPerMonth || 0
            },
            utilization: {
                agents: limits.maxAgents === -1 ? 0 : (tenant.usage.agentsCount / limits.maxAgents * 100).toFixed(1),
                bookings: limits.maxBookingsPerMonth === -1 ? 0 : (tenant.usage.bookingsThisMonth / limits.maxBookingsPerMonth * 100).toFixed(1),
                apiCalls: !limits.apiCallsPerMonth || limits.apiCallsPerMonth === -1 ? 0 : (tenant.usage.apiCallsThisMonth / limits.apiCallsPerMonth * 100).toFixed(1)
            }
        });
    } catch (error) {
        console.error('Error fetching usage:', error);
        res.status(500).json({ error: 'Failed to fetch usage' });
    }
};

/**
 * List all tenants (Super Admin only)
 */
const listTenants = async (req, res) => {
    try {
        const { status, plan, search } = req.query;
        let results = Array.from(tenants.values());

        if (status) {
            results = results.filter(t => t.status === status);
        }

        if (plan) {
            results = results.filter(t => t.plan === plan.toUpperCase());
        }

        if (search) {
            const searchLower = search.toLowerCase();
            results = results.filter(t =>
                t.companyName.toLowerCase().includes(searchLower) ||
                t.email.toLowerCase().includes(searchLower)
            );
        }

        res.json({
            total: results.length,
            tenants: results.map(t => ({
                id: t.id,
                companyName: t.companyName,
                email: t.email,
                plan: t.plan,
                status: t.status,
                createdAt: t.createdAt,
                usage: t.usage
            }))
        });
    } catch (error) {
        console.error('Error listing tenants:', error);
        res.status(500).json({ error: 'Failed to list tenants' });
    }
};

/**
 * Suspend tenant
 */
const suspendTenant = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const { reason } = req.body;
        const tenant = tenants.get(tenantId);

        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        tenant.status = 'suspended';
        tenant.suspendedAt = new Date().toISOString();
        tenant.suspendReason = reason;
        tenant.updatedAt = new Date().toISOString();
        tenants.set(tenantId, tenant);

        res.json({ message: 'Tenant suspended successfully', tenant });
    } catch (error) {
        console.error('Error suspending tenant:', error);
        res.status(500).json({ error: 'Failed to suspend tenant' });
    }
};

/**
 * Reactivate tenant
 */
const reactivateTenant = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const tenant = tenants.get(tenantId);

        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        tenant.status = 'active';
        tenant.reactivatedAt = new Date().toISOString();
        tenant.updatedAt = new Date().toISOString();
        tenants.set(tenantId, tenant);

        res.json({ message: 'Tenant reactivated successfully', tenant });
    } catch (error) {
        console.error('Error reactivating tenant:', error);
        res.status(500).json({ error: 'Failed to reactivate tenant' });
    }
};

module.exports = {
    createTenant,
    getTenant,
    updateTenant,
    updateBranding,
    setCustomDomain,
    getPlans,
    changePlan,
    getUsage,
    listTenants,
    suspendTenant,
    reactivateTenant
};
