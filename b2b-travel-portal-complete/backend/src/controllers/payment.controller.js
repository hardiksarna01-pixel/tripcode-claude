/**
 * Payment Controller
 */

class PaymentController {
    async initiatePayment(req, res) {
        try {
            const { bookingId, amount, currency, paymentMethod, returnUrl } = req.body;
            res.json({
                success: true,
                data: {
                    paymentId: `PAY${Date.now()}`,
                    orderId: `ORD${Date.now()}`,
                    amount,
                    currency: currency || 'INR',
                    gatewayUrl: 'https://razorpay.com/checkout',
                    gatewayData: {
                        key: 'rzp_test_xxxxx',
                        orderId: `ORD${Date.now()}`,
                        amount: amount * 100
                    }
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Payment initiation failed' });
        }
    }

    async verifyPayment(req, res) {
        try {
            const { paymentId, razorpay_payment_id, razorpay_signature } = req.body;
            res.json({
                success: true,
                message: 'Payment verified successfully',
                data: {
                    paymentId,
                    status: 'captured',
                    transactionId: razorpay_payment_id || `TXN${Date.now()}`
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Payment verification failed' });
        }
    }

    async getPaymentStatus(req, res) {
        try {
            const { paymentId } = req.params;
            res.json({
                success: true,
                data: {
                    id: paymentId,
                    status: 'captured',
                    amount: 15000,
                    currency: 'INR',
                    method: 'card',
                    createdAt: new Date().toISOString()
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get payment status' });
        }
    }

    async initiateRefund(req, res) {
        try {
            const { paymentId, amount, reason } = req.body;
            res.json({
                success: true,
                message: 'Refund initiated',
                data: {
                    refundId: `REF${Date.now()}`,
                    paymentId,
                    amount,
                    status: 'processing',
                    estimatedCompletion: '5-7 business days'
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Refund initiation failed' });
        }
    }

    async getRefundStatus(req, res) {
        try {
            const { refundId } = req.params;
            res.json({
                success: true,
                data: {
                    id: refundId,
                    status: 'processed',
                    amount: 12000,
                    processedAt: new Date().toISOString()
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get refund status' });
        }
    }

    async getPaymentMethods(req, res) {
        try {
            const methods = [
                { id: 'card', name: 'Credit/Debit Card', icon: 'card' },
                { id: 'upi', name: 'UPI', icon: 'upi' },
                { id: 'netbanking', name: 'Net Banking', icon: 'bank' },
                { id: 'wallet', name: 'Agent Wallet', icon: 'wallet' },
                { id: 'credit', name: 'Credit Line', icon: 'credit' }
            ];
            res.json({ success: true, data: methods });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get payment methods' });
        }
    }

    async createPaymentLink(req, res) {
        try {
            const { amount, description, customerEmail, expiryDays } = req.body;
            res.json({
                success: true,
                data: {
                    linkId: `LNK${Date.now()}`,
                    shortUrl: `https://pay.travel.com/${Date.now().toString(36)}`,
                    amount,
                    expiresAt: new Date(Date.now() + (expiryDays || 7) * 24 * 60 * 60 * 1000).toISOString()
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to create payment link' });
        }
    }
}

module.exports = new PaymentController();
