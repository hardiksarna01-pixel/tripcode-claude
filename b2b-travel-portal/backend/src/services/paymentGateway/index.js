/**
 * Payment Gateway Service
 * Unified payment processing across 5 gateways
 * Agents can choose their preferred gateway
 */

const gatewayRegistry = require('./gatewayRegistry');
const { createAdapter } = require('./adapters');
const crypto = require('crypto');

class PaymentService {
    constructor() {
        this.transactions = new Map(); // In-memory transaction store (use DB in production)
        this.stats = {
            totalTransactions: 0,
            successfulPayments: 0,
            failedPayments: 0,
            totalRefunds: 0,
            totalAmountProcessed: 0
        };

        console.log('[PaymentService] Initialized with', gatewayRegistry.getActive().length, 'active gateways');
    }

    /**
     * Get available gateways for display
     */
    getAvailableGateways() {
        return gatewayRegistry.getForDisplay();
    }

    /**
     * Get gateway by ID
     */
    getGateway(gatewayId) {
        return gatewayRegistry.get(gatewayId);
    }

    /**
     * Set agent's preferred gateway
     */
    setAgentPreference(agentId, gatewayId) {
        return gatewayRegistry.setAgentPreference(agentId, gatewayId);
    }

    /**
     * Get agent's preferred gateway
     */
    getAgentPreference(agentId) {
        return gatewayRegistry.getAgentPreference(agentId);
    }

    /**
     * Initiate payment
     */
    async initiatePayment(paymentData) {
        const {
            gatewayId,
            agentId,
            amount,
            currency,
            bookingId,
            bookingType, // flight, hotel, bus
            customer,
            metadata,
            successUrl,
            failureUrl
        } = paymentData;

        // Get gateway (use agent preference if gatewayId not specified)
        let gateway;
        if (gatewayId) {
            gateway = gatewayRegistry.get(gatewayId);
        } else if (agentId) {
            gateway = gatewayRegistry.getAgentPreference(agentId);
        } else {
            gateway = gatewayRegistry.getBestGateway({ currency, amount });
        }

        if (!gateway) {
            throw new Error('No suitable payment gateway found');
        }

        if (!gateway.active) {
            throw new Error(`Gateway ${gateway.name} is not active`);
        }

        // Validate amount limits
        if (amount < gateway.minAmount) {
            throw new Error(`Minimum amount is ${gateway.minAmount}`);
        }
        if (amount > gateway.maxAmount) {
            throw new Error(`Maximum amount is ${gateway.maxAmount}`);
        }

        // Check currency support
        if (currency && !gateway.supportedCurrencies.includes(currency)) {
            throw new Error(`Currency ${currency} not supported by ${gateway.name}`);
        }

        // Create transaction record
        const transactionId = this.generateTransactionId();
        const transaction = {
            id: transactionId,
            gatewayId: gateway.id,
            gatewayName: gateway.name,
            agentId,
            bookingId,
            bookingType,
            amount,
            currency: currency || 'INR',
            customer,
            status: 'initiated',
            createdAt: new Date().toISOString(),
            metadata
        };

        // Create order with gateway
        const adapter = createAdapter(gateway);
        const startTime = Date.now();

        try {
            const order = await adapter.createOrder({
                amount,
                currency: transaction.currency,
                bookingId,
                customer,
                receipt: transactionId,
                notes: metadata,
                successUrl,
                failureUrl,
                productInfo: `${bookingType} Booking - ${bookingId}`
            });

            transaction.gatewayOrderId = order.orderId || order.gatewayOrderId;
            transaction.gatewayResponse = order;
            transaction.responseTime = Date.now() - startTime;

            // Store transaction
            this.transactions.set(transactionId, transaction);
            this.stats.totalTransactions++;

            // Calculate fees
            const fees = gatewayRegistry.calculateFees(gateway.id, amount);

            return {
                success: true,
                transactionId,
                gatewayId: gateway.id,
                gatewayName: gateway.name,
                order,
                fees,
                checkoutData: this.getCheckoutData(gateway, order, customer)
            };
        } catch (error) {
            transaction.status = 'failed';
            transaction.error = error.message;
            transaction.responseTime = Date.now() - startTime;
            this.transactions.set(transactionId, transaction);
            this.stats.failedPayments++;

            throw error;
        }
    }

    /**
     * Verify payment after callback
     */
    async verifyPayment(verificationData) {
        const { transactionId, gatewayId, ...paymentData } = verificationData;

        // Get transaction
        const transaction = this.transactions.get(transactionId);
        if (!transaction) {
            throw new Error('Transaction not found');
        }

        // Get gateway
        const gateway = gatewayRegistry.get(transaction.gatewayId);
        if (!gateway) {
            throw new Error('Gateway not found');
        }

        // Verify with gateway
        const adapter = createAdapter(gateway);
        const startTime = Date.now();

        try {
            const result = await adapter.verifyPayment(paymentData);

            transaction.status = result.success ? 'completed' : 'failed';
            transaction.paymentId = result.paymentId;
            transaction.verifiedAt = new Date().toISOString();
            transaction.verificationResponse = result;
            transaction.responseTime = Date.now() - startTime;

            if (result.success) {
                this.stats.successfulPayments++;
                this.stats.totalAmountProcessed += transaction.amount;
            } else {
                this.stats.failedPayments++;
            }

            // Update gateway stats
            gatewayRegistry.updateStats(gateway.id, {
                success: result.success,
                amount: transaction.amount,
                responseTime: transaction.responseTime
            });

            return {
                success: result.success,
                transactionId,
                paymentId: result.paymentId,
                orderId: result.orderId,
                status: transaction.status,
                message: result.message,
                transaction: this.sanitizeTransaction(transaction)
            };
        } catch (error) {
            transaction.status = 'verification_failed';
            transaction.error = error.message;
            this.stats.failedPayments++;

            throw error;
        }
    }

    /**
     * Process refund
     */
    async processRefund(refundData) {
        const { transactionId, amount, reason } = refundData;

        // Get transaction
        const transaction = this.transactions.get(transactionId);
        if (!transaction) {
            throw new Error('Transaction not found');
        }

        if (transaction.status !== 'completed') {
            throw new Error('Can only refund completed transactions');
        }

        // Validate refund amount
        const refundedAmount = transaction.refunds?.reduce((sum, r) => sum + r.amount, 0) || 0;
        const maxRefundable = transaction.amount - refundedAmount;

        if (amount > maxRefundable) {
            throw new Error(`Maximum refundable amount is ${maxRefundable}`);
        }

        // Get gateway
        const gateway = gatewayRegistry.get(transaction.gatewayId);
        const adapter = createAdapter(gateway);

        try {
            const result = await adapter.refund({
                paymentId: transaction.paymentId,
                amount,
                txnid: transaction.gatewayOrderId
            });

            // Record refund
            if (!transaction.refunds) {
                transaction.refunds = [];
            }

            transaction.refunds.push({
                refundId: result.refundId,
                amount,
                reason,
                status: result.status,
                createdAt: new Date().toISOString()
            });

            // Update status if fully refunded
            if (refundedAmount + amount >= transaction.amount) {
                transaction.status = 'refunded';
            } else {
                transaction.status = 'partially_refunded';
            }

            this.stats.totalRefunds++;

            return {
                success: true,
                refundId: result.refundId,
                transactionId,
                amount,
                status: result.status,
                transaction: this.sanitizeTransaction(transaction)
            };
        } catch (error) {
            throw new Error(`Refund failed: ${error.message}`);
        }
    }

    /**
     * Get transaction details
     */
    getTransaction(transactionId) {
        const transaction = this.transactions.get(transactionId);
        if (!transaction) {
            return null;
        }
        return this.sanitizeTransaction(transaction);
    }

    /**
     * Get transactions by booking
     */
    getTransactionsByBooking(bookingId) {
        const transactions = [];
        for (const [, transaction] of this.transactions) {
            if (transaction.bookingId === bookingId) {
                transactions.push(this.sanitizeTransaction(transaction));
            }
        }
        return transactions;
    }

    /**
     * Get transactions by agent
     */
    getTransactionsByAgent(agentId, options = {}) {
        const { status, from, to, limit = 50 } = options;
        let transactions = [];

        for (const [, transaction] of this.transactions) {
            if (transaction.agentId === agentId) {
                // Filter by status
                if (status && transaction.status !== status) continue;

                // Filter by date range
                if (from && new Date(transaction.createdAt) < new Date(from)) continue;
                if (to && new Date(transaction.createdAt) > new Date(to)) continue;

                transactions.push(this.sanitizeTransaction(transaction));
            }
        }

        // Sort by date descending
        transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return transactions.slice(0, limit);
    }

    /**
     * Get checkout data for frontend
     */
    getCheckoutData(gateway, order, customer) {
        const adapter = createAdapter(gateway);

        switch (gateway.id) {
            case 'razorpay':
                return {
                    type: 'razorpay',
                    options: adapter.generateCheckoutOptions(order, customer)
                };

            case 'stripe':
                return {
                    type: 'stripe',
                    config: adapter.generateCheckoutConfig(order)
                };

            case 'paypal':
                return {
                    type: 'paypal',
                    config: adapter.generateCheckoutConfig(order)
                };

            case 'payu':
            case 'ccavenue':
                return {
                    type: 'redirect',
                    url: order.paymentUrl,
                    formData: order.formData
                };

            default:
                return null;
        }
    }

    /**
     * Generate unique transaction ID
     */
    generateTransactionId() {
        const timestamp = Date.now().toString(36);
        const random = crypto.randomBytes(4).toString('hex');
        return `TXN${timestamp}${random}`.toUpperCase();
    }

    /**
     * Sanitize transaction for response (remove sensitive data)
     */
    sanitizeTransaction(transaction) {
        const { gatewayResponse, verificationResponse, ...safe } = transaction;
        return safe;
    }

    /**
     * Get service statistics
     */
    getStats() {
        const gatewayStats = {};
        gatewayRegistry.getAll().forEach(g => {
            gatewayStats[g.id] = gatewayRegistry.getStats(g.id);
        });

        return {
            ...this.stats,
            successRate: this.stats.totalTransactions > 0
                ? ((this.stats.successfulPayments / this.stats.totalTransactions) * 100).toFixed(2) + '%'
                : 'N/A',
            gateways: gatewayStats
        };
    }

    /**
     * Calculate fees for amount
     */
    calculateFees(gatewayId, amount, type = 'domestic') {
        return gatewayRegistry.calculateFees(gatewayId, amount, type);
    }

    /**
     * Get best gateway recommendation
     */
    recommendGateway(options) {
        return gatewayRegistry.getBestGateway(options);
    }

    /**
     * Handle webhook from gateway
     */
    async handleWebhook(gatewayId, payload, signature) {
        const gateway = gatewayRegistry.get(gatewayId);
        if (!gateway) {
            throw new Error('Unknown gateway');
        }

        // Verify webhook signature based on gateway
        let isValid = false;
        switch (gatewayId) {
            case 'razorpay':
                const expectedSignature = crypto
                    .createHmac('sha256', gateway.config.webhookSecret)
                    .update(JSON.stringify(payload))
                    .digest('hex');
                isValid = expectedSignature === signature;
                break;

            case 'stripe':
                // Stripe webhook verification
                isValid = true; // Simplified
                break;

            case 'paypal':
                // PayPal webhook verification
                isValid = true; // Simplified
                break;

            default:
                isValid = true;
        }

        if (!isValid) {
            throw new Error('Invalid webhook signature');
        }

        // Process webhook event
        const event = payload.event || payload.type;
        console.log(`[PaymentService] Webhook received: ${gatewayId} - ${event}`);

        return { received: true, event };
    }
}

module.exports = new PaymentService();
module.exports.PaymentService = PaymentService;
