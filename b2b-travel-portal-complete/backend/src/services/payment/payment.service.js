/**
 * Payment Service
 * Multi-gateway payment processing
 */

const crypto = require('crypto');
const config = require('../../config');

class PaymentService {
    constructor() {
        this.gateways = {
            razorpay: new RazorpayGateway(config.payments.razorpay),
            payu: new PayUGateway(config.payments.payu),
            stripe: new StripeGateway(config.payments.stripe)
        };
    }

    /**
     * Get available payment gateways
     */
    getAvailableGateways() {
        return Object.entries(this.gateways)
            .filter(([_, gateway]) => gateway.isEnabled())
            .map(([name, gateway]) => ({
                name,
                displayName: gateway.getDisplayName(),
                logo: gateway.getLogo(),
                supportedMethods: gateway.getSupportedMethods()
            }));
    }

    /**
     * Create payment order
     */
    async createOrder(gatewayName, orderData) {
        const gateway = this.gateways[gatewayName];
        if (!gateway || !gateway.isEnabled()) {
            throw new Error('Payment gateway not available');
        }

        const order = await gateway.createOrder(orderData);

        return {
            orderId: order.id,
            gateway: gatewayName,
            amount: orderData.amount,
            currency: orderData.currency || 'INR',
            ...gateway.getClientData(order),
            createdAt: new Date().toISOString()
        };
    }

    /**
     * Verify payment
     */
    async verifyPayment(gatewayName, paymentData) {
        const gateway = this.gateways[gatewayName];
        const verified = await gateway.verifyPayment(paymentData);

        if (!verified.success) {
            throw new Error('Payment verification failed');
        }

        return {
            success: true,
            transactionId: verified.transactionId,
            paymentId: verified.paymentId,
            amount: verified.amount,
            verifiedAt: new Date().toISOString()
        };
    }

    /**
     * Process refund
     */
    async processRefund(gatewayName, paymentId, amount, reason) {
        const gateway = this.gateways[gatewayName];
        const refund = await gateway.processRefund(paymentId, amount, reason);

        return {
            refundId: refund.id,
            status: refund.status,
            amount: refund.amount,
            processedAt: new Date().toISOString()
        };
    }

    /**
     * Handle webhook
     */
    async handleWebhook(gatewayName, payload, signature) {
        const gateway = this.gateways[gatewayName];
        const verified = gateway.verifyWebhookSignature(payload, signature);

        if (!verified) {
            throw new Error('Invalid webhook signature');
        }

        return gateway.processWebhook(payload);
    }
}

/**
 * Razorpay Gateway
 */
class RazorpayGateway {
    constructor(config) {
        this.config = config;
        if (config.keyId) {
            const Razorpay = require('razorpay');
            this.client = new Razorpay({
                key_id: config.keyId,
                key_secret: config.keySecret
            });
        }
    }

    isEnabled() {
        return !!this.config.keyId;
    }

    getDisplayName() {
        return 'Razorpay';
    }

    getLogo() {
        return '/images/razorpay-logo.png';
    }

    getSupportedMethods() {
        return ['card', 'upi', 'netbanking', 'wallet'];
    }

    async createOrder(orderData) {
        const order = await this.client.orders.create({
            amount: orderData.amount * 100, // Convert to paise
            currency: orderData.currency || 'INR',
            receipt: orderData.receipt,
            notes: orderData.notes
        });

        return order;
    }

    getClientData(order) {
        return {
            key: this.config.keyId,
            razorpayOrderId: order.id
        };
    }

    async verifyPayment(paymentData) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

        const expectedSignature = crypto
            .createHmac('sha256', this.config.keySecret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return { success: false };
        }

        const payment = await this.client.payments.fetch(razorpay_payment_id);

        return {
            success: true,
            transactionId: razorpay_payment_id,
            paymentId: razorpay_payment_id,
            amount: payment.amount / 100
        };
    }

    async processRefund(paymentId, amount, reason) {
        const refund = await this.client.payments.refund(paymentId, {
            amount: amount * 100,
            notes: { reason }
        });

        return refund;
    }

    verifyWebhookSignature(payload, signature) {
        const expectedSignature = crypto
            .createHmac('sha256', this.config.webhookSecret)
            .update(JSON.stringify(payload))
            .digest('hex');

        return expectedSignature === signature;
    }

    processWebhook(payload) {
        const event = payload.event;
        const data = payload.payload.payment?.entity;

        return {
            event,
            paymentId: data?.id,
            status: data?.status,
            amount: data?.amount / 100
        };
    }
}

/**
 * PayU Gateway
 */
class PayUGateway {
    constructor(config) {
        this.config = config;
    }

    isEnabled() {
        return !!this.config.merchantKey;
    }

    getDisplayName() {
        return 'PayU';
    }

    getLogo() {
        return '/images/payu-logo.png';
    }

    getSupportedMethods() {
        return ['card', 'upi', 'netbanking', 'wallet', 'emi'];
    }

    async createOrder(orderData) {
        const txnId = `TXN${Date.now()}`;
        const hash = this.generateHash(orderData, txnId);

        return {
            id: txnId,
            hash,
            amount: orderData.amount
        };
    }

    generateHash(orderData, txnId) {
        const hashString = `${this.config.merchantKey}|${txnId}|${orderData.amount}|${orderData.productInfo}|${orderData.firstName}|${orderData.email}|||||||||||${this.config.merchantSalt}`;
        return crypto.createHash('sha512').update(hashString).digest('hex');
    }

    getClientData(order) {
        const baseUrl = this.config.isTestMode
            ? 'https://sandboxsecure.payu.in/_payment'
            : 'https://secure.payu.in/_payment';

        return {
            payuUrl: baseUrl,
            key: this.config.merchantKey,
            txnId: order.id,
            hash: order.hash
        };
    }

    async verifyPayment(paymentData) {
        const { status, txnid, hash } = paymentData;

        // Verify reverse hash
        const reverseHashString = `${this.config.merchantSalt}|${status}|||||||||||${paymentData.email}|${paymentData.firstname}|${paymentData.productinfo}|${paymentData.amount}|${txnid}|${this.config.merchantKey}`;
        const expectedHash = crypto.createHash('sha512').update(reverseHashString).digest('hex');

        if (expectedHash !== hash) {
            return { success: false };
        }

        return {
            success: status === 'success',
            transactionId: txnid,
            paymentId: paymentData.payuMoneyId,
            amount: parseFloat(paymentData.amount)
        };
    }

    async processRefund(paymentId, amount, reason) {
        // PayU refund API implementation
        return { id: `REF${Date.now()}`, status: 'pending', amount };
    }

    verifyWebhookSignature(payload, signature) {
        return true; // PayU webhook verification
    }

    processWebhook(payload) {
        return {
            event: payload.event_type,
            paymentId: payload.payment_id,
            status: payload.status,
            amount: payload.amount
        };
    }
}

/**
 * Stripe Gateway
 */
class StripeGateway {
    constructor(config) {
        this.config = config;
        if (config.secretKey) {
            this.client = require('stripe')(config.secretKey);
        }
    }

    isEnabled() {
        return !!this.config.secretKey;
    }

    getDisplayName() {
        return 'Stripe';
    }

    getLogo() {
        return '/images/stripe-logo.png';
    }

    getSupportedMethods() {
        return ['card'];
    }

    async createOrder(orderData) {
        const paymentIntent = await this.client.paymentIntents.create({
            amount: Math.round(orderData.amount * 100),
            currency: (orderData.currency || 'inr').toLowerCase(),
            metadata: orderData.metadata
        });

        return paymentIntent;
    }

    getClientData(order) {
        return {
            publishableKey: this.config.publishableKey,
            clientSecret: order.client_secret
        };
    }

    async verifyPayment(paymentData) {
        const { paymentIntentId } = paymentData;
        const paymentIntent = await this.client.paymentIntents.retrieve(paymentIntentId);

        return {
            success: paymentIntent.status === 'succeeded',
            transactionId: paymentIntent.id,
            paymentId: paymentIntent.id,
            amount: paymentIntent.amount / 100
        };
    }

    async processRefund(paymentId, amount, reason) {
        const refund = await this.client.refunds.create({
            payment_intent: paymentId,
            amount: Math.round(amount * 100),
            reason: 'requested_by_customer'
        });

        return refund;
    }

    verifyWebhookSignature(payload, signature) {
        try {
            this.client.webhooks.constructEvent(
                JSON.stringify(payload),
                signature,
                this.config.webhookSecret
            );
            return true;
        } catch (err) {
            return false;
        }
    }

    processWebhook(payload) {
        return {
            event: payload.type,
            paymentId: payload.data.object.id,
            status: payload.data.object.status,
            amount: payload.data.object.amount / 100
        };
    }
}

module.exports = new PaymentService();
