/**
 * Subscription & Billing Controller
 * Manages subscription lifecycle, billing, and payments
 */

const { SUBSCRIPTION_PLANS } = require('../config/tenant');

// In-memory storage
const subscriptions = new Map();
const invoices = new Map();
const payments = new Map();

/**
 * Get current subscription
 */
const getSubscription = async (req, res) => {
    try {
        const { tenantId } = req.params;

        const subscription = subscriptions.get(tenantId) || {
            tenantId,
            plan: 'STARTER',
            status: 'trial',
            startDate: new Date().toISOString(),
            trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            nextBillingDate: null,
            amount: SUBSCRIPTION_PLANS.STARTER.price
        };

        const planDetails = SUBSCRIPTION_PLANS[subscription.plan];

        res.json({
            subscription,
            planDetails,
            daysRemaining: subscription.status === 'trial'
                ? Math.ceil((new Date(subscription.trialEndsAt) - Date.now()) / (24 * 60 * 60 * 1000))
                : null
        });
    } catch (error) {
        console.error('Error fetching subscription:', error);
        res.status(500).json({ error: 'Failed to fetch subscription' });
    }
};

/**
 * Start subscription (after trial or for new plan)
 */
const startSubscription = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const { plan, paymentMethodId } = req.body;

        const planConfig = SUBSCRIPTION_PLANS[plan.toUpperCase()];
        if (!planConfig) {
            return res.status(400).json({ error: 'Invalid plan' });
        }

        const startDate = new Date();
        const nextBillingDate = new Date(startDate);
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

        const subscription = {
            id: `sub_${Date.now()}`,
            tenantId,
            plan: plan.toUpperCase(),
            status: 'active',
            startDate: startDate.toISOString(),
            nextBillingDate: nextBillingDate.toISOString(),
            amount: planConfig.price,
            paymentMethodId,
            createdAt: new Date().toISOString()
        };

        subscriptions.set(tenantId, subscription);

        // Create first invoice
        const invoice = createInvoice(tenantId, subscription);

        res.status(201).json({
            message: 'Subscription started successfully',
            subscription,
            invoice
        });
    } catch (error) {
        console.error('Error starting subscription:', error);
        res.status(500).json({ error: 'Failed to start subscription' });
    }
};

/**
 * Cancel subscription
 */
const cancelSubscription = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const { reason, cancelImmediately = false } = req.body;

        const subscription = subscriptions.get(tenantId);
        if (!subscription) {
            return res.status(404).json({ error: 'Subscription not found' });
        }

        subscription.status = cancelImmediately ? 'cancelled' : 'pending_cancellation';
        subscription.cancelReason = reason;
        subscription.cancelledAt = new Date().toISOString();
        subscription.effectiveCancelDate = cancelImmediately
            ? new Date().toISOString()
            : subscription.nextBillingDate;

        subscriptions.set(tenantId, subscription);

        res.json({
            message: cancelImmediately
                ? 'Subscription cancelled immediately'
                : `Subscription will be cancelled on ${subscription.effectiveCancelDate}`,
            subscription
        });
    } catch (error) {
        console.error('Error cancelling subscription:', error);
        res.status(500).json({ error: 'Failed to cancel subscription' });
    }
};

/**
 * Upgrade/Downgrade subscription
 */
const changePlan = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const { newPlan, applyImmediately = true } = req.body;

        const subscription = subscriptions.get(tenantId);
        if (!subscription) {
            return res.status(404).json({ error: 'Subscription not found' });
        }

        const newPlanConfig = SUBSCRIPTION_PLANS[newPlan.toUpperCase()];
        if (!newPlanConfig) {
            return res.status(400).json({ error: 'Invalid plan' });
        }

        const oldPlan = subscription.plan;
        const isUpgrade = newPlanConfig.price > SUBSCRIPTION_PLANS[oldPlan].price;

        if (applyImmediately) {
            subscription.plan = newPlan.toUpperCase();
            subscription.amount = newPlanConfig.price;
            subscription.planChangedAt = new Date().toISOString();

            if (isUpgrade) {
                // Calculate prorated amount for upgrade
                const daysRemaining = Math.ceil(
                    (new Date(subscription.nextBillingDate) - Date.now()) / (24 * 60 * 60 * 1000)
                );
                const proratedAmount = Math.round(
                    ((newPlanConfig.price - SUBSCRIPTION_PLANS[oldPlan].price) / 30) * daysRemaining
                );
                subscription.proratedCharge = proratedAmount;
            }
        } else {
            subscription.pendingPlanChange = {
                newPlan: newPlan.toUpperCase(),
                effectiveDate: subscription.nextBillingDate
            };
        }

        subscriptions.set(tenantId, subscription);

        res.json({
            message: `Plan ${isUpgrade ? 'upgraded' : 'downgraded'} successfully`,
            subscription,
            isUpgrade,
            proratedCharge: subscription.proratedCharge || 0
        });
    } catch (error) {
        console.error('Error changing plan:', error);
        res.status(500).json({ error: 'Failed to change plan' });
    }
};

/**
 * Get billing history
 */
const getBillingHistory = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const tenantInvoices = Array.from(invoices.values())
            .filter(inv => inv.tenantId === tenantId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const start = (page - 1) * limit;
        const paginatedInvoices = tenantInvoices.slice(start, start + parseInt(limit));

        res.json({
            invoices: paginatedInvoices,
            total: tenantInvoices.length,
            page: parseInt(page),
            totalPages: Math.ceil(tenantInvoices.length / limit)
        });
    } catch (error) {
        console.error('Error fetching billing history:', error);
        res.status(500).json({ error: 'Failed to fetch billing history' });
    }
};

/**
 * Get invoice details
 */
const getInvoice = async (req, res) => {
    try {
        const { invoiceId } = req.params;

        const invoice = invoices.get(invoiceId);
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        res.json(invoice);
    } catch (error) {
        console.error('Error fetching invoice:', error);
        res.status(500).json({ error: 'Failed to fetch invoice' });
    }
};

/**
 * Process payment
 */
const processPayment = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const { invoiceId, paymentMethodId, amount } = req.body;

        // Simulate payment processing
        const payment = {
            id: `pay_${Date.now()}`,
            tenantId,
            invoiceId,
            amount,
            status: 'completed', // In production, this would be 'pending' until confirmed
            paymentMethodId,
            processedAt: new Date().toISOString()
        };

        payments.set(payment.id, payment);

        // Update invoice status
        if (invoiceId) {
            const invoice = invoices.get(invoiceId);
            if (invoice) {
                invoice.status = 'paid';
                invoice.paidAt = new Date().toISOString();
                invoice.paymentId = payment.id;
                invoices.set(invoiceId, invoice);
            }
        }

        res.json({
            message: 'Payment processed successfully',
            payment
        });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ error: 'Failed to process payment' });
    }
};

/**
 * Add payment method
 */
const addPaymentMethod = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const { type, details } = req.body;

        // In production, this would integrate with a payment gateway
        const paymentMethod = {
            id: `pm_${Date.now()}`,
            tenantId,
            type, // 'card', 'bank_transfer', 'upi'
            last4: details.last4 || '****',
            isDefault: true,
            createdAt: new Date().toISOString()
        };

        res.status(201).json({
            message: 'Payment method added successfully',
            paymentMethod
        });
    } catch (error) {
        console.error('Error adding payment method:', error);
        res.status(500).json({ error: 'Failed to add payment method' });
    }
};

/**
 * Create invoice (helper function)
 */
const createInvoice = (tenantId, subscription) => {
    const invoiceNumber = `INV-${Date.now()}`;
    const invoice = {
        id: invoiceNumber,
        tenantId,
        subscriptionId: subscription.id,
        plan: subscription.plan,
        amount: subscription.amount,
        tax: Math.round(subscription.amount * 0.18), // 18% GST
        total: Math.round(subscription.amount * 1.18),
        status: 'pending',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString()
    };

    invoices.set(invoice.id, invoice);
    return invoice;
};

/**
 * Get revenue summary (Super Admin)
 */
const getRevenueSummary = async (req, res) => {
    try {
        const { period = 'month' } = req.query;

        const allPayments = Array.from(payments.values());
        const allSubscriptions = Array.from(subscriptions.values());

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
        const activeSubscriptions = allSubscriptions.filter(s => s.status === 'active').length;
        const trialSubscriptions = allSubscriptions.filter(s => s.status === 'trial').length;

        const mrr = allSubscriptions
            .filter(s => s.status === 'active')
            .reduce((sum, s) => sum + s.amount, 0);

        res.json({
            period,
            totalRevenue,
            mrr,
            activeSubscriptions,
            trialSubscriptions,
            averageRevenuePerUser: activeSubscriptions > 0 ? Math.round(mrr / activeSubscriptions) : 0,
            byPlan: {
                starter: allSubscriptions.filter(s => s.plan === 'STARTER' && s.status === 'active').length,
                professional: allSubscriptions.filter(s => s.plan === 'PROFESSIONAL' && s.status === 'active').length,
                enterprise: allSubscriptions.filter(s => s.plan === 'ENTERPRISE' && s.status === 'active').length,
                api_only: allSubscriptions.filter(s => s.plan === 'API_ONLY' && s.status === 'active').length
            }
        });
    } catch (error) {
        console.error('Error fetching revenue summary:', error);
        res.status(500).json({ error: 'Failed to fetch revenue summary' });
    }
};

module.exports = {
    getSubscription,
    startSubscription,
    cancelSubscription,
    changePlan,
    getBillingHistory,
    getInvoice,
    processPayment,
    addPaymentMethod,
    getRevenueSummary
};
