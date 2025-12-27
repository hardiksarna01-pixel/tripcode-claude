/**
 * Payment Gateway Registry
 * Manages up to 5 payment gateway integrations
 * Agents can choose their preferred gateway
 */

const defaultGateways = [
    // Gateway 1: Razorpay (India's most popular)
    {
        id: 'razorpay',
        name: 'Razorpay',
        displayName: 'Razorpay',
        logo: '/images/gateways/razorpay.png',
        type: 'indian',
        priority: 1,
        active: true,
        testMode: process.env.RAZORPAY_TEST_MODE === 'true',
        config: {
            keyId: process.env.RAZORPAY_KEY_ID || '',
            keySecret: process.env.RAZORPAY_KEY_SECRET || '',
            webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || ''
        },
        features: {
            cards: true,
            netBanking: true,
            upi: true,
            wallets: true,
            emi: true,
            payLater: true,
            internationalCards: true,
            recurring: true,
            refunds: true,
            partialRefunds: true
        },
        supportedCurrencies: ['INR', 'USD', 'EUR', 'GBP', 'SGD', 'AED'],
        fees: {
            domestic: { percentage: 2.0, fixed: 0 },
            international: { percentage: 3.0, fixed: 0 },
            upi: { percentage: 0, fixed: 0 }, // UPI is free
            netBanking: { percentage: 1.9, fixed: 0 }
        },
        settlementDays: 2,
        minAmount: 100, // INR 1
        maxAmount: 50000000, // INR 5 Lakh
        endpoints: {
            base: 'https://api.razorpay.com/v1',
            orders: '/orders',
            payments: '/payments',
            refunds: '/refunds'
        }
    },

    // Gateway 2: PayU (India)
    {
        id: 'payu',
        name: 'PayU',
        displayName: 'PayU Money',
        logo: '/images/gateways/payu.png',
        type: 'indian',
        priority: 2,
        active: true,
        testMode: process.env.PAYU_TEST_MODE === 'true',
        config: {
            merchantKey: process.env.PAYU_MERCHANT_KEY || '',
            merchantSalt: process.env.PAYU_MERCHANT_SALT || '',
            authHeader: process.env.PAYU_AUTH_HEADER || ''
        },
        features: {
            cards: true,
            netBanking: true,
            upi: true,
            wallets: true,
            emi: true,
            payLater: true,
            internationalCards: true,
            recurring: true,
            refunds: true,
            partialRefunds: true
        },
        supportedCurrencies: ['INR'],
        fees: {
            domestic: { percentage: 2.0, fixed: 0 },
            netBanking: { percentage: 1.75, fixed: 0 },
            upi: { percentage: 0, fixed: 0 }
        },
        settlementDays: 2,
        minAmount: 100,
        maxAmount: 100000000,
        endpoints: {
            base: 'https://secure.payu.in',
            testBase: 'https://sandboxsecure.payu.in',
            payment: '/_payment',
            verify: '/merchant/postservice'
        }
    },

    // Gateway 3: CCAvenue (India)
    {
        id: 'ccavenue',
        name: 'CCAvenue',
        displayName: 'CCAvenue',
        logo: '/images/gateways/ccavenue.png',
        type: 'indian',
        priority: 3,
        active: true,
        testMode: process.env.CCAVENUE_TEST_MODE === 'true',
        config: {
            merchantId: process.env.CCAVENUE_MERCHANT_ID || '',
            accessCode: process.env.CCAVENUE_ACCESS_CODE || '',
            workingKey: process.env.CCAVENUE_WORKING_KEY || ''
        },
        features: {
            cards: true,
            netBanking: true,
            upi: false,
            wallets: true,
            emi: true,
            payLater: false,
            internationalCards: true,
            recurring: false,
            refunds: true,
            partialRefunds: true
        },
        supportedCurrencies: ['INR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD'],
        fees: {
            domestic: { percentage: 2.0, fixed: 0 },
            international: { percentage: 3.5, fixed: 0 }
        },
        settlementDays: 3,
        minAmount: 100,
        maxAmount: 100000000,
        endpoints: {
            base: 'https://secure.ccavenue.com',
            testBase: 'https://test.ccavenue.com',
            transaction: '/transaction/transaction.do'
        }
    },

    // Gateway 4: Stripe (International)
    {
        id: 'stripe',
        name: 'Stripe',
        displayName: 'Stripe',
        logo: '/images/gateways/stripe.png',
        type: 'international',
        priority: 4,
        active: true,
        testMode: process.env.STRIPE_TEST_MODE === 'true',
        config: {
            publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
            secretKey: process.env.STRIPE_SECRET_KEY || '',
            webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || ''
        },
        features: {
            cards: true,
            netBanking: false,
            upi: false,
            wallets: true, // Apple Pay, Google Pay
            emi: false,
            payLater: true, // Klarna, Afterpay
            internationalCards: true,
            recurring: true,
            refunds: true,
            partialRefunds: true,
            applePay: true,
            googlePay: true
        },
        supportedCurrencies: ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'SGD', 'AED', 'JPY'],
        fees: {
            domestic: { percentage: 2.9, fixed: 30 }, // 30 cents
            international: { percentage: 3.9, fixed: 30 }
        },
        settlementDays: 2,
        minAmount: 50, // 50 cents
        maxAmount: 99999999,
        endpoints: {
            base: 'https://api.stripe.com/v1',
            paymentIntents: '/payment_intents',
            refunds: '/refunds',
            customers: '/customers'
        }
    },

    // Gateway 5: PayPal (International)
    {
        id: 'paypal',
        name: 'PayPal',
        displayName: 'PayPal',
        logo: '/images/gateways/paypal.png',
        type: 'international',
        priority: 5,
        active: true,
        testMode: process.env.PAYPAL_TEST_MODE === 'true',
        config: {
            clientId: process.env.PAYPAL_CLIENT_ID || '',
            clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
            webhookId: process.env.PAYPAL_WEBHOOK_ID || ''
        },
        features: {
            cards: true,
            netBanking: false,
            upi: false,
            wallets: true, // PayPal wallet
            emi: false,
            payLater: true, // Pay in 4
            internationalCards: true,
            recurring: true,
            refunds: true,
            partialRefunds: true,
            paypalWallet: true
        },
        supportedCurrencies: ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'INR', 'JPY', 'SGD'],
        fees: {
            domestic: { percentage: 2.9, fixed: 30 },
            international: { percentage: 4.4, fixed: 30 }
        },
        settlementDays: 1,
        minAmount: 100, // $1
        maxAmount: 1000000000,
        endpoints: {
            base: 'https://api-m.paypal.com',
            sandboxBase: 'https://api-m.sandbox.paypal.com',
            orders: '/v2/checkout/orders',
            captures: '/v2/payments/captures'
        }
    }
];

class GatewayRegistry {
    constructor() {
        this.gateways = new Map();
        this.agentPreferences = new Map(); // Agent-specific gateway preferences
        this.loadDefaults();
    }

    /**
     * Load default gateways
     */
    loadDefaults() {
        defaultGateways.forEach(gateway => {
            this.gateways.set(gateway.id, {
                ...gateway,
                stats: {
                    totalTransactions: 0,
                    successfulTransactions: 0,
                    failedTransactions: 0,
                    totalAmount: 0,
                    avgResponseTime: 0
                }
            });
        });
        console.log(`[GatewayRegistry] Loaded ${this.gateways.size} payment gateways`);
    }

    /**
     * Get all gateways
     */
    getAll() {
        return Array.from(this.gateways.values());
    }

    /**
     * Get active gateways
     */
    getActive() {
        return this.getAll().filter(g => g.active);
    }

    /**
     * Get gateway by ID
     */
    get(id) {
        return this.gateways.get(id);
    }

    /**
     * Get gateways for display (without sensitive config)
     */
    getForDisplay() {
        return this.getActive().map(g => ({
            id: g.id,
            name: g.name,
            displayName: g.displayName,
            logo: g.logo,
            type: g.type,
            features: g.features,
            supportedCurrencies: g.supportedCurrencies,
            fees: g.fees,
            minAmount: g.minAmount,
            maxAmount: g.maxAmount
        }));
    }

    /**
     * Get gateway by type (indian/international)
     */
    getByType(type) {
        return this.getActive().filter(g => g.type === type);
    }

    /**
     * Set agent's preferred gateway
     */
    setAgentPreference(agentId, gatewayId) {
        if (!this.gateways.has(gatewayId)) {
            throw new Error(`Gateway ${gatewayId} not found`);
        }
        this.agentPreferences.set(agentId, gatewayId);
        return true;
    }

    /**
     * Get agent's preferred gateway
     */
    getAgentPreference(agentId) {
        const preferredId = this.agentPreferences.get(agentId);
        if (preferredId && this.gateways.has(preferredId)) {
            return this.gateways.get(preferredId);
        }
        // Return first active gateway as default
        return this.getActive()[0];
    }

    /**
     * Check if gateway supports currency
     */
    supportsCurrency(gatewayId, currency) {
        const gateway = this.gateways.get(gatewayId);
        if (!gateway) return false;
        return gateway.supportedCurrencies.includes(currency);
    }

    /**
     * Check if gateway supports payment method
     */
    supportsMethod(gatewayId, method) {
        const gateway = this.gateways.get(gatewayId);
        if (!gateway) return false;
        return gateway.features[method] === true;
    }

    /**
     * Calculate transaction fees
     */
    calculateFees(gatewayId, amount, type = 'domestic') {
        const gateway = this.gateways.get(gatewayId);
        if (!gateway) return null;

        const feeStructure = gateway.fees[type] || gateway.fees.domestic;
        const percentageFee = (amount * feeStructure.percentage) / 100;
        const totalFee = percentageFee + feeStructure.fixed;

        return {
            percentage: feeStructure.percentage,
            fixed: feeStructure.fixed,
            calculatedFee: Math.round(totalFee * 100) / 100,
            netAmount: amount - totalFee
        };
    }

    /**
     * Update gateway configuration
     */
    updateConfig(gatewayId, config) {
        const gateway = this.gateways.get(gatewayId);
        if (!gateway) return null;

        gateway.config = { ...gateway.config, ...config };
        return gateway;
    }

    /**
     * Enable/disable gateway
     */
    setActive(gatewayId, active) {
        const gateway = this.gateways.get(gatewayId);
        if (!gateway) return null;

        gateway.active = active;
        return gateway;
    }

    /**
     * Update gateway stats
     */
    updateStats(gatewayId, transaction) {
        const gateway = this.gateways.get(gatewayId);
        if (!gateway) return;

        gateway.stats.totalTransactions++;
        if (transaction.success) {
            gateway.stats.successfulTransactions++;
            gateway.stats.totalAmount += transaction.amount;
        } else {
            gateway.stats.failedTransactions++;
        }

        // Update average response time
        const total = gateway.stats.totalTransactions;
        gateway.stats.avgResponseTime = Math.round(
            ((gateway.stats.avgResponseTime * (total - 1)) + transaction.responseTime) / total
        );
    }

    /**
     * Get gateway statistics
     */
    getStats(gatewayId) {
        const gateway = this.gateways.get(gatewayId);
        if (!gateway) return null;

        return {
            ...gateway.stats,
            successRate: gateway.stats.totalTransactions > 0
                ? ((gateway.stats.successfulTransactions / gateway.stats.totalTransactions) * 100).toFixed(2) + '%'
                : 'N/A'
        };
    }

    /**
     * Get best gateway for transaction
     */
    getBestGateway(options = {}) {
        const { currency, amount, method, preferInternational } = options;

        let candidates = this.getActive();

        // Filter by currency support
        if (currency) {
            candidates = candidates.filter(g => g.supportedCurrencies.includes(currency));
        }

        // Filter by payment method
        if (method) {
            candidates = candidates.filter(g => g.features[method]);
        }

        // Filter by amount limits
        if (amount) {
            candidates = candidates.filter(g =>
                amount >= g.minAmount && amount <= g.maxAmount
            );
        }

        // Sort by type preference
        if (preferInternational) {
            candidates.sort((a, b) => {
                if (a.type === 'international' && b.type !== 'international') return -1;
                if (b.type === 'international' && a.type !== 'international') return 1;
                return a.priority - b.priority;
            });
        } else {
            candidates.sort((a, b) => a.priority - b.priority);
        }

        return candidates[0] || null;
    }
}

module.exports = new GatewayRegistry();
module.exports.GatewayRegistry = GatewayRegistry;
