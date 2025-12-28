/**
 * Payment Gateway Adapters
 * Individual adapters for each payment gateway
 */

const crypto = require('crypto');

/**
 * Base Payment Adapter
 */
class BasePaymentAdapter {
    constructor(gateway) {
        this.gateway = gateway;
        this.config = gateway.config;
        this.testMode = gateway.testMode;
    }

    async createOrder(orderData) {
        throw new Error('createOrder() must be implemented');
    }

    async verifyPayment(paymentData) {
        throw new Error('verifyPayment() must be implemented');
    }

    async refund(refundData) {
        throw new Error('refund() must be implemented');
    }

    async getPaymentStatus(paymentId) {
        throw new Error('getPaymentStatus() must be implemented');
    }

    generateSignature(data) {
        throw new Error('generateSignature() must be implemented');
    }
}

/**
 * Razorpay Adapter
 */
class RazorpayAdapter extends BasePaymentAdapter {
    constructor(gateway) {
        super(gateway);
        this.baseUrl = gateway.endpoints.base;
    }

    getAuth() {
        const auth = Buffer.from(`${this.config.keyId}:${this.config.keySecret}`).toString('base64');
        return `Basic ${auth}`;
    }

    async createOrder(orderData) {
        const { amount, currency, receipt, notes, bookingId } = orderData;

        const payload = {
            amount: Math.round(amount * 100), // Convert to paise
            currency: currency || 'INR',
            receipt: receipt || `booking_${bookingId}`,
            notes: notes || {}
        };

        // In production, this would make actual API call
        // const response = await axios.post(`${this.baseUrl}/orders`, payload, {
        //     headers: { Authorization: this.getAuth() }
        // });

        // Simulated response
        return {
            success: true,
            orderId: `order_${Date.now()}`,
            amount: payload.amount,
            currency: payload.currency,
            receipt: payload.receipt,
            status: 'created',
            gatewayOrderId: `order_${crypto.randomBytes(8).toString('hex')}`,
            keyId: this.config.keyId,
            gatewayName: 'razorpay'
        };
    }

    async verifyPayment(paymentData) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

        // Generate expected signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', this.config.keySecret)
            .update(body)
            .digest('hex');

        const isValid = expectedSignature === razorpay_signature;

        return {
            success: isValid,
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            message: isValid ? 'Payment verified successfully' : 'Invalid signature'
        };
    }

    async refund(refundData) {
        const { paymentId, amount, notes } = refundData;

        // Simulated refund response
        return {
            success: true,
            refundId: `rfnd_${crypto.randomBytes(8).toString('hex')}`,
            paymentId,
            amount: Math.round(amount * 100),
            status: 'processed',
            createdAt: new Date().toISOString()
        };
    }

    async getPaymentStatus(paymentId) {
        // Simulated status response
        return {
            id: paymentId,
            status: 'captured',
            amount: 100000,
            currency: 'INR',
            method: 'upi',
            captured: true
        };
    }

    generateCheckoutOptions(order, customer) {
        return {
            key: this.config.keyId,
            amount: order.amount,
            currency: order.currency,
            name: 'B2B Travel Portal',
            description: `Booking: ${order.receipt}`,
            order_id: order.gatewayOrderId,
            prefill: {
                name: customer.name,
                email: customer.email,
                contact: customer.phone
            },
            theme: {
                color: '#3399cc'
            }
        };
    }
}

/**
 * PayU Adapter
 */
class PayUAdapter extends BasePaymentAdapter {
    constructor(gateway) {
        super(gateway);
        this.baseUrl = gateway.testMode ? gateway.endpoints.testBase : gateway.endpoints.base;
    }

    generateHash(data) {
        const hashString = `${this.config.merchantKey}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${this.config.merchantSalt}`;
        return crypto.createHash('sha512').update(hashString).digest('hex');
    }

    async createOrder(orderData) {
        const { amount, bookingId, productInfo, customer } = orderData;

        const txnid = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

        const payuData = {
            key: this.config.merchantKey,
            txnid,
            amount: amount.toFixed(2),
            productinfo: productInfo || `Booking ${bookingId}`,
            firstname: customer.name,
            email: customer.email,
            phone: customer.phone,
            surl: orderData.successUrl || `${process.env.APP_URL}/payment/success`,
            furl: orderData.failureUrl || `${process.env.APP_URL}/payment/failure`
        };

        payuData.hash = this.generateHash(payuData);

        return {
            success: true,
            orderId: txnid,
            paymentUrl: `${this.baseUrl}${this.gateway.endpoints.payment}`,
            formData: payuData,
            gatewayName: 'payu'
        };
    }

    async verifyPayment(paymentData) {
        const { mihpayid, status, txnid, amount, productinfo, firstname, email, hash } = paymentData;

        // Verify reverse hash
        const reverseHashString = `${this.config.merchantSalt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${this.config.merchantKey}`;
        const expectedHash = crypto.createHash('sha512').update(reverseHashString).digest('hex');

        const isValid = expectedHash === hash && status === 'success';

        return {
            success: isValid,
            orderId: txnid,
            paymentId: mihpayid,
            status,
            message: isValid ? 'Payment verified successfully' : 'Verification failed'
        };
    }

    async refund(refundData) {
        const { paymentId, amount, txnid } = refundData;

        return {
            success: true,
            refundId: `REF${Date.now()}`,
            paymentId,
            txnid,
            amount,
            status: 'pending',
            message: 'Refund initiated'
        };
    }

    async getPaymentStatus(txnid) {
        return {
            txnid,
            status: 'success',
            amount: 0,
            mode: 'NB'
        };
    }
}

/**
 * CCAvenue Adapter
 */
class CCAvenueAdapter extends BasePaymentAdapter {
    constructor(gateway) {
        super(gateway);
        this.baseUrl = gateway.testMode ? gateway.endpoints.testBase : gateway.endpoints.base;
    }

    encrypt(plainText) {
        const key = crypto.createHash('md5').update(this.config.workingKey).digest();
        const iv = Buffer.alloc(16, 0);
        const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
        let encrypted = cipher.update(plainText, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    decrypt(encryptedText) {
        const key = crypto.createHash('md5').update(this.config.workingKey).digest();
        const iv = Buffer.alloc(16, 0);
        const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    async createOrder(orderData) {
        const { amount, bookingId, customer, currency } = orderData;

        const orderId = `ORD${Date.now()}`;

        const ccavenueData = {
            merchant_id: this.config.merchantId,
            order_id: orderId,
            currency: currency || 'INR',
            amount: amount.toFixed(2),
            redirect_url: orderData.successUrl || `${process.env.APP_URL}/payment/ccavenue/response`,
            cancel_url: orderData.failureUrl || `${process.env.APP_URL}/payment/ccavenue/cancel`,
            billing_name: customer.name,
            billing_email: customer.email,
            billing_tel: customer.phone,
            billing_address: customer.address || '',
            billing_city: customer.city || '',
            billing_state: customer.state || '',
            billing_zip: customer.zip || '',
            billing_country: customer.country || 'India'
        };

        const dataString = Object.entries(ccavenueData)
            .map(([key, value]) => `${key}=${value}`)
            .join('&');

        const encryptedData = this.encrypt(dataString);

        return {
            success: true,
            orderId,
            paymentUrl: `${this.baseUrl}${this.gateway.endpoints.transaction}`,
            formData: {
                encRequest: encryptedData,
                access_code: this.config.accessCode
            },
            gatewayName: 'ccavenue'
        };
    }

    async verifyPayment(paymentData) {
        const { encResp } = paymentData;

        const decryptedData = this.decrypt(encResp);
        const params = {};
        decryptedData.split('&').forEach(pair => {
            const [key, value] = pair.split('=');
            params[key] = value;
        });

        const isValid = params.order_status === 'Success';

        return {
            success: isValid,
            orderId: params.order_id,
            paymentId: params.tracking_id,
            status: params.order_status,
            bankRefNo: params.bank_ref_no,
            message: isValid ? 'Payment successful' : params.status_message
        };
    }

    async refund(refundData) {
        return {
            success: true,
            refundId: `CCREF${Date.now()}`,
            paymentId: refundData.paymentId,
            amount: refundData.amount,
            status: 'initiated'
        };
    }

    async getPaymentStatus(orderId) {
        return {
            orderId,
            status: 'Success',
            amount: 0
        };
    }
}

/**
 * Stripe Adapter
 */
class StripeAdapter extends BasePaymentAdapter {
    constructor(gateway) {
        super(gateway);
        this.baseUrl = gateway.endpoints.base;
    }

    getHeaders() {
        return {
            'Authorization': `Bearer ${this.config.secretKey}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        };
    }

    async createOrder(orderData) {
        const { amount, currency, customer, bookingId, metadata } = orderData;

        // In production, this would create a PaymentIntent
        // const paymentIntent = await stripe.paymentIntents.create({
        //     amount: Math.round(amount * 100),
        //     currency: currency.toLowerCase(),
        //     metadata: { bookingId, ...metadata }
        // });

        const clientSecret = `pi_${crypto.randomBytes(16).toString('hex')}_secret_${crypto.randomBytes(16).toString('hex')}`;

        return {
            success: true,
            orderId: `pi_${crypto.randomBytes(12).toString('hex')}`,
            clientSecret,
            amount: Math.round(amount * 100),
            currency: currency.toLowerCase(),
            publishableKey: this.config.publishableKey,
            gatewayName: 'stripe'
        };
    }

    async verifyPayment(paymentData) {
        const { paymentIntentId } = paymentData;

        // In production, retrieve and verify the payment intent
        // const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        return {
            success: true,
            orderId: paymentIntentId,
            paymentId: paymentIntentId,
            status: 'succeeded',
            message: 'Payment verified successfully'
        };
    }

    async refund(refundData) {
        const { paymentId, amount } = refundData;

        return {
            success: true,
            refundId: `re_${crypto.randomBytes(12).toString('hex')}`,
            paymentId,
            amount: Math.round(amount * 100),
            status: 'succeeded'
        };
    }

    async getPaymentStatus(paymentIntentId) {
        return {
            id: paymentIntentId,
            status: 'succeeded',
            amount: 0,
            currency: 'usd'
        };
    }

    generateCheckoutConfig(order) {
        return {
            clientSecret: order.clientSecret,
            appearance: {
                theme: 'stripe',
                variables: {
                    colorPrimary: '#3399cc'
                }
            }
        };
    }
}

/**
 * PayPal Adapter
 */
class PayPalAdapter extends BasePaymentAdapter {
    constructor(gateway) {
        super(gateway);
        this.baseUrl = gateway.testMode ? gateway.endpoints.sandboxBase : gateway.endpoints.base;
    }

    async getAccessToken() {
        const auth = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');

        // In production, this would get actual access token
        // const response = await axios.post(`${this.baseUrl}/v1/oauth2/token`,
        //     'grant_type=client_credentials',
        //     { headers: { Authorization: `Basic ${auth}` } }
        // );

        return `A21AAL${crypto.randomBytes(32).toString('hex')}`;
    }

    async createOrder(orderData) {
        const { amount, currency, bookingId, description } = orderData;

        const accessToken = await this.getAccessToken();

        // In production, this would create actual PayPal order
        const orderId = `${crypto.randomBytes(9).toString('hex').toUpperCase()}`;

        return {
            success: true,
            orderId,
            approvalUrl: `https://www.${this.gateway.testMode ? 'sandbox.' : ''}paypal.com/checkoutnow?token=${orderId}`,
            amount,
            currency: currency || 'USD',
            clientId: this.config.clientId,
            gatewayName: 'paypal'
        };
    }

    async verifyPayment(paymentData) {
        const { orderID, payerID } = paymentData;

        // In production, this would capture the payment
        // const captureResponse = await axios.post(
        //     `${this.baseUrl}/v2/checkout/orders/${orderID}/capture`,
        //     {},
        //     { headers: { Authorization: `Bearer ${accessToken}` } }
        // );

        return {
            success: true,
            orderId: orderID,
            payerId: payerID,
            paymentId: `PAY-${crypto.randomBytes(16).toString('hex').toUpperCase()}`,
            status: 'COMPLETED',
            message: 'Payment captured successfully'
        };
    }

    async refund(refundData) {
        const { captureId, amount, currency } = refundData;

        return {
            success: true,
            refundId: `REF-${crypto.randomBytes(16).toString('hex').toUpperCase()}`,
            captureId,
            amount,
            currency: currency || 'USD',
            status: 'COMPLETED'
        };
    }

    async getPaymentStatus(orderId) {
        return {
            id: orderId,
            status: 'COMPLETED',
            intent: 'CAPTURE'
        };
    }

    generateCheckoutConfig(order) {
        return {
            clientId: this.config.clientId,
            currency: order.currency,
            intent: 'capture'
        };
    }
}

/**
 * Factory function to create appropriate adapter
 */
function createAdapter(gateway) {
    const adapters = {
        'razorpay': RazorpayAdapter,
        'payu': PayUAdapter,
        'ccavenue': CCAvenueAdapter,
        'stripe': StripeAdapter,
        'paypal': PayPalAdapter
    };

    const AdapterClass = adapters[gateway.id];
    if (!AdapterClass) {
        throw new Error(`No adapter found for gateway: ${gateway.id}`);
    }

    return new AdapterClass(gateway);
}

module.exports = {
    createAdapter,
    BasePaymentAdapter,
    RazorpayAdapter,
    PayUAdapter,
    CCAvenueAdapter,
    StripeAdapter,
    PayPalAdapter
};
