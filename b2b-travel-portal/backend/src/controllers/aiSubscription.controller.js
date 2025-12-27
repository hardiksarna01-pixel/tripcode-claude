/**
 * AI Subscription Controller
 * IMPORTANT: AI Feature subscriptions are billed DIRECTLY to the platform
 * White-label partners do NOT receive any revenue from AI subscriptions
 * This is a direct relationship between the agent and the main platform
 */

const { AI_FEATURE_PLANS } = require('../config/aiFeatures');

// In-memory storage (replace with database in production)
const aiSubscriptions = new Map();
const aiPayments = new Map();
const aiInvoices = new Map();

// Platform revenue tracking (separate from white-label revenue)
const platformAIRevenue = {
    total: 0,
    byMonth: new Map(),
    byAgent: new Map()
};

/**
 * Get AI subscription for an agent
 * Note: This is independent of white-label tenant subscriptions
 */
const getAISubscription = async (req, res) => {
    try {
        const agentId = req.user?.id || req.params.agentId;

        const subscription = aiSubscriptions.get(agentId) || {
            agentId,
            plan: 'FREE',
            status: 'active',
            billingType: 'PLATFORM_DIRECT', // Always direct to platform
            whitelabelPartnerShare: 0, // Partners get NOTHING from AI subscriptions
            startDate: new Date().toISOString(),
            features: AI_FEATURE_PLANS.FREE
        };

        res.json({
            subscription,
            planDetails: AI_FEATURE_PLANS[subscription.plan],
            availablePlans: Object.values(AI_FEATURE_PLANS),
            billingNote: 'AI feature subscriptions are billed directly by the platform'
        });
    } catch (error) {
        console.error('Error fetching AI subscription:', error);
        res.status(500).json({ error: 'Failed to fetch AI subscription' });
    }
};

/**
 * Subscribe to AI Pro plan
 * Payment goes DIRECTLY to platform - white-label partners get no share
 */
const subscribeToAIPro = async (req, res) => {
    try {
        const agentId = req.user?.id || 'demo';
        const { paymentMethodId, couponCode } = req.body;

        // Get tenant info (if agent belongs to a white-label partner)
        const tenantId = req.user?.tenantId || null;

        let finalPrice = AI_FEATURE_PLANS.PRO.price;
        let discount = 0;

        // Apply coupon if valid
        if (couponCode) {
            // Platform coupons only - white-label partners cannot create AI discounts
            const couponDiscount = validatePlatformCoupon(couponCode);
            if (couponDiscount) {
                discount = couponDiscount;
                finalPrice = Math.round(AI_FEATURE_PLANS.PRO.price * (1 - couponDiscount / 100));
            }
        }

        const startDate = new Date();
        const nextBillingDate = new Date(startDate);
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

        const subscription = {
            id: `ai_sub_${Date.now()}`,
            agentId,
            tenantId, // Track which tenant the agent belongs to (for analytics only)
            plan: 'PRO',
            status: 'active',

            // CRITICAL: Billing configuration
            billingType: 'PLATFORM_DIRECT',
            revenueRecipient: 'PLATFORM', // NOT the white-label partner
            whitelabelPartnerShare: 0, // 0% to partner for AI features
            platformShare: 100, // 100% to platform

            price: finalPrice,
            originalPrice: AI_FEATURE_PLANS.PRO.price,
            discount,
            currency: 'INR',

            startDate: startDate.toISOString(),
            nextBillingDate: nextBillingDate.toISOString(),
            paymentMethodId,

            features: AI_FEATURE_PLANS.PRO.limits,
            createdAt: new Date().toISOString()
        };

        aiSubscriptions.set(agentId, subscription);

        // Create invoice - platform is the seller, NOT the white-label partner
        const invoice = createAIInvoice(agentId, subscription);

        // Track platform revenue
        trackPlatformRevenue(agentId, finalPrice);

        // Simulate payment processing
        const payment = {
            id: `ai_pay_${Date.now()}`,
            agentId,
            subscriptionId: subscription.id,
            amount: invoice.total,
            status: 'completed',
            recipient: 'PLATFORM', // Platform receives payment
            partnerShare: 0, // Partner gets nothing
            paymentMethodId,
            processedAt: new Date().toISOString()
        };

        aiPayments.set(payment.id, payment);

        res.status(201).json({
            message: 'Successfully subscribed to AI Pro plan',
            subscription,
            invoice,
            payment,
            newLimits: AI_FEATURE_PLANS.PRO.limits,
            billingInfo: {
                billedBy: 'Platform',
                note: 'This subscription is managed directly by the platform'
            }
        });
    } catch (error) {
        console.error('Error subscribing to AI Pro:', error);
        res.status(500).json({ error: 'Failed to process subscription' });
    }
};

/**
 * Cancel AI subscription
 */
const cancelAISubscription = async (req, res) => {
    try {
        const agentId = req.user?.id || 'demo';
        const { reason, cancelImmediately = false } = req.body;

        const subscription = aiSubscriptions.get(agentId);
        if (!subscription || subscription.plan === 'FREE') {
            return res.status(400).json({ error: 'No active Pro subscription found' });
        }

        subscription.status = cancelImmediately ? 'cancelled' : 'pending_cancellation';
        subscription.cancelReason = reason;
        subscription.cancelledAt = new Date().toISOString();
        subscription.effectiveCancelDate = cancelImmediately
            ? new Date().toISOString()
            : subscription.nextBillingDate;

        if (cancelImmediately) {
            subscription.plan = 'FREE';
            subscription.features = AI_FEATURE_PLANS.FREE.limits;
        }

        aiSubscriptions.set(agentId, subscription);

        res.json({
            message: cancelImmediately
                ? 'AI Pro subscription cancelled. Downgraded to Free plan.'
                : `AI Pro subscription will end on ${subscription.effectiveCancelDate}`,
            subscription,
            newLimits: cancelImmediately ? AI_FEATURE_PLANS.FREE.limits : subscription.features
        });
    } catch (error) {
        console.error('Error cancelling AI subscription:', error);
        res.status(500).json({ error: 'Failed to cancel subscription' });
    }
};

/**
 * Get AI billing history for an agent
 */
const getAIBillingHistory = async (req, res) => {
    try {
        const agentId = req.user?.id || 'demo';
        const { page = 1, limit = 10 } = req.query;

        const agentInvoices = Array.from(aiInvoices.values())
            .filter(inv => inv.agentId === agentId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const start = (page - 1) * limit;
        const paginatedInvoices = agentInvoices.slice(start, start + parseInt(limit));

        res.json({
            invoices: paginatedInvoices,
            total: agentInvoices.length,
            page: parseInt(page),
            totalPages: Math.ceil(agentInvoices.length / limit),
            billingEntity: 'Platform' // Always platform for AI features
        });
    } catch (error) {
        console.error('Error fetching AI billing history:', error);
        res.status(500).json({ error: 'Failed to fetch billing history' });
    }
};

/**
 * Get platform AI revenue summary (Super Admin only)
 * This shows direct platform revenue from AI features
 */
const getPlatformAIRevenue = async (req, res) => {
    try {
        const { period = 'month' } = req.query;

        const allPayments = Array.from(aiPayments.values());
        const allSubscriptions = Array.from(aiSubscriptions.values());

        const now = new Date();
        let startDate;

        switch (period) {
            case 'week':
                startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        const periodPayments = allPayments.filter(p =>
            new Date(p.processedAt) >= startDate
        );

        const totalRevenue = periodPayments.reduce((sum, p) => sum + p.amount, 0);
        const activeProSubscriptions = allSubscriptions.filter(s =>
            s.plan === 'PRO' && s.status === 'active'
        ).length;

        // Group by tenant to see which white-label partners' agents are subscribing
        const byTenant = {};
        allSubscriptions
            .filter(s => s.plan === 'PRO' && s.status === 'active')
            .forEach(s => {
                const tenant = s.tenantId || 'direct';
                byTenant[tenant] = (byTenant[tenant] || 0) + 1;
            });

        const mrr = activeProSubscriptions * AI_FEATURE_PLANS.PRO.price;

        res.json({
            period,
            revenueType: 'AI_FEATURES_DIRECT',
            note: 'This revenue goes 100% to platform - white-label partners receive nothing',

            totalRevenue,
            mrr,
            activeProSubscriptions,
            freeUsers: allSubscriptions.filter(s => s.plan === 'FREE').length,

            conversionRate: allSubscriptions.length > 0
                ? Math.round((activeProSubscriptions / allSubscriptions.length) * 100)
                : 0,

            subscriptionsByTenant: byTenant,
            averageRevenuePerUser: activeProSubscriptions > 0
                ? Math.round(mrr / activeProSubscriptions)
                : 0,

            platformSharePercentage: 100,
            partnerSharePercentage: 0
        });
    } catch (error) {
        console.error('Error fetching platform AI revenue:', error);
        res.status(500).json({ error: 'Failed to fetch revenue summary' });
    }
};

/**
 * Check if agent has Pro subscription
 */
const hasProSubscription = (agentId) => {
    const subscription = aiSubscriptions.get(agentId);
    return subscription?.plan === 'PRO' && subscription?.status === 'active';
};

/**
 * Get agent's current plan
 */
const getAgentPlan = (agentId) => {
    const subscription = aiSubscriptions.get(agentId);
    if (!subscription) return 'FREE';
    if (subscription.status !== 'active') return 'FREE';
    return subscription.plan;
};

// Helper: Create AI invoice (platform is always the seller)
const createAIInvoice = (agentId, subscription) => {
    const invoiceNumber = `AI-INV-${Date.now()}`;
    const invoice = {
        id: invoiceNumber,
        agentId,
        tenantId: subscription.tenantId,
        subscriptionId: subscription.id,

        // Seller is always the platform
        seller: {
            name: 'Tripcode Platform',
            type: 'PLATFORM',
            note: 'AI Features are provided directly by the platform'
        },

        plan: subscription.plan,
        description: 'AI Pro Plan - Monthly Subscription',

        amount: subscription.price,
        discount: subscription.discount > 0 ? {
            percentage: subscription.discount,
            amount: subscription.originalPrice - subscription.price
        } : null,
        tax: Math.round(subscription.price * 0.18), // 18% GST
        total: Math.round(subscription.price * 1.18),
        currency: 'INR',

        status: 'paid',
        paidAt: new Date().toISOString(),
        dueDate: new Date().toISOString(),

        billingType: 'PLATFORM_DIRECT',
        partnerCommission: 0, // No commission to partners

        createdAt: new Date().toISOString()
    };

    aiInvoices.set(invoice.id, invoice);
    return invoice;
};

// Helper: Track platform revenue
const trackPlatformRevenue = (agentId, amount) => {
    const monthKey = new Date().toISOString().slice(0, 7); // YYYY-MM

    platformAIRevenue.total += amount;
    platformAIRevenue.byMonth.set(
        monthKey,
        (platformAIRevenue.byMonth.get(monthKey) || 0) + amount
    );
    platformAIRevenue.byAgent.set(
        agentId,
        (platformAIRevenue.byAgent.get(agentId) || 0) + amount
    );
};

// Helper: Validate platform coupons (only platform can create AI discounts)
const validatePlatformCoupon = (code) => {
    const platformCoupons = {
        'AILAUNCH20': 20,    // 20% off
        'TRIPCODE10': 10,    // 10% off
        'EARLYBIRD25': 25    // 25% off
    };
    return platformCoupons[code.toUpperCase()] || null;
};

module.exports = {
    getAISubscription,
    subscribeToAIPro,
    cancelAISubscription,
    getAIBillingHistory,
    getPlatformAIRevenue,
    hasProSubscription,
    getAgentPlan
};
