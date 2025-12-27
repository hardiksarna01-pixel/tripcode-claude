/**
 * Payment Controller
 * Handles payment gateway operations
 * Agents can choose from 5 available gateways
 */

const paymentService = require('../services/paymentGateway');
const { catchAsync } = require('../utils/catchAsync');

/**
 * Get available payment gateways
 */
exports.getAvailableGateways = catchAsync(async (req, res) => {
    const gateways = paymentService.getAvailableGateways();

    res.json({
        success: true,
        data: {
            count: gateways.length,
            gateways
        }
    });
});

/**
 * Get gateway details
 */
exports.getGatewayDetails = catchAsync(async (req, res) => {
    const { gatewayId } = req.params;

    const gateway = paymentService.getGateway(gatewayId);

    if (!gateway) {
        return res.status(404).json({
            success: false,
            error: 'Gateway not found'
        });
    }

    // Return safe details (no secrets)
    res.json({
        success: true,
        data: {
            id: gateway.id,
            name: gateway.name,
            displayName: gateway.displayName,
            logo: gateway.logo,
            type: gateway.type,
            active: gateway.active,
            features: gateway.features,
            supportedCurrencies: gateway.supportedCurrencies,
            fees: gateway.fees,
            minAmount: gateway.minAmount,
            maxAmount: gateway.maxAmount,
            settlementDays: gateway.settlementDays
        }
    });
});

/**
 * Set agent's preferred gateway
 */
exports.setPreference = catchAsync(async (req, res) => {
    const agentId = req.user?.id || req.agentCredentials?.userId;
    const { gatewayId } = req.body;

    if (!gatewayId) {
        return res.status(400).json({
            success: false,
            error: 'Gateway ID is required'
        });
    }

    try {
        paymentService.setAgentPreference(agentId, gatewayId);

        res.json({
            success: true,
            message: `Preferred gateway set to ${gatewayId}`,
            data: {
                agentId,
                gatewayId
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Get agent's preferred gateway
 */
exports.getPreference = catchAsync(async (req, res) => {
    const agentId = req.user?.id || req.agentCredentials?.userId;

    const gateway = paymentService.getAgentPreference(agentId);

    res.json({
        success: true,
        data: gateway ? {
            id: gateway.id,
            name: gateway.name,
            displayName: gateway.displayName,
            logo: gateway.logo
        } : null
    });
});

/**
 * Initiate a payment
 */
exports.initiatePayment = catchAsync(async (req, res) => {
    const agentId = req.user?.id || req.agentCredentials?.userId;

    const {
        gatewayId,
        amount,
        currency,
        bookingId,
        bookingType,
        customer,
        metadata,
        successUrl,
        failureUrl
    } = req.body;

    // Validate required fields
    if (!amount || amount <= 0) {
        return res.status(400).json({
            success: false,
            error: 'Valid amount is required'
        });
    }

    if (!bookingId) {
        return res.status(400).json({
            success: false,
            error: 'Booking ID is required'
        });
    }

    if (!customer || !customer.email) {
        return res.status(400).json({
            success: false,
            error: 'Customer details with email are required'
        });
    }

    try {
        const result = await paymentService.initiatePayment({
            gatewayId,
            agentId,
            amount,
            currency,
            bookingId,
            bookingType,
            customer,
            metadata,
            successUrl,
            failureUrl
        });

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Verify payment after gateway callback
 */
exports.verifyPayment = catchAsync(async (req, res) => {
    const { transactionId, ...paymentData } = req.body;

    if (!transactionId) {
        return res.status(400).json({
            success: false,
            error: 'Transaction ID is required'
        });
    }

    try {
        const result = await paymentService.verifyPayment({
            transactionId,
            ...paymentData
        });

        res.json({
            success: result.success,
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Process refund
 */
exports.processRefund = catchAsync(async (req, res) => {
    const { transactionId, amount, reason } = req.body;

    if (!transactionId) {
        return res.status(400).json({
            success: false,
            error: 'Transaction ID is required'
        });
    }

    if (!amount || amount <= 0) {
        return res.status(400).json({
            success: false,
            error: 'Valid refund amount is required'
        });
    }

    try {
        const result = await paymentService.processRefund({
            transactionId,
            amount,
            reason
        });

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Get transaction details
 */
exports.getTransaction = catchAsync(async (req, res) => {
    const { transactionId } = req.params;

    const transaction = paymentService.getTransaction(transactionId);

    if (!transaction) {
        return res.status(404).json({
            success: false,
            error: 'Transaction not found'
        });
    }

    res.json({
        success: true,
        data: transaction
    });
});

/**
 * Get agent's transactions
 */
exports.getTransactions = catchAsync(async (req, res) => {
    const agentId = req.user?.id || req.agentCredentials?.userId;
    const { status, from, to, limit } = req.query;

    const transactions = paymentService.getTransactionsByAgent(agentId, {
        status,
        from,
        to,
        limit: limit ? parseInt(limit) : 50
    });

    res.json({
        success: true,
        data: {
            count: transactions.length,
            transactions
        }
    });
});

/**
 * Get transactions for a booking
 */
exports.getBookingTransactions = catchAsync(async (req, res) => {
    const { bookingId } = req.params;

    const transactions = paymentService.getTransactionsByBooking(bookingId);

    res.json({
        success: true,
        data: {
            bookingId,
            count: transactions.length,
            transactions
        }
    });
});

/**
 * Calculate gateway fees
 */
exports.calculateFees = catchAsync(async (req, res) => {
    const { gatewayId, amount, type } = req.body;

    if (!gatewayId || !amount) {
        return res.status(400).json({
            success: false,
            error: 'Gateway ID and amount are required'
        });
    }

    const fees = paymentService.calculateFees(gatewayId, amount, type || 'domestic');

    if (!fees) {
        return res.status(404).json({
            success: false,
            error: 'Gateway not found'
        });
    }

    res.json({
        success: true,
        data: {
            gatewayId,
            amount,
            type: type || 'domestic',
            ...fees
        }
    });
});

/**
 * Get recommended gateway
 */
exports.recommendGateway = catchAsync(async (req, res) => {
    const { currency, amount, method, preferInternational } = req.body;

    const gateway = paymentService.recommendGateway({
        currency,
        amount,
        method,
        preferInternational
    });

    if (!gateway) {
        return res.status(404).json({
            success: false,
            error: 'No suitable gateway found'
        });
    }

    res.json({
        success: true,
        data: {
            id: gateway.id,
            name: gateway.name,
            displayName: gateway.displayName,
            type: gateway.type,
            features: gateway.features,
            fees: gateway.fees
        }
    });
});

/**
 * Get payment statistics
 */
exports.getStats = catchAsync(async (req, res) => {
    const stats = paymentService.getStats();

    res.json({
        success: true,
        data: stats
    });
});

/**
 * Handle gateway webhooks
 */
exports.handleWebhook = catchAsync(async (req, res) => {
    const { gatewayId } = req.params;
    const signature = req.headers['x-razorpay-signature'] ||
                     req.headers['stripe-signature'] ||
                     req.headers['paypal-transmission-sig'] ||
                     '';

    try {
        const result = await paymentService.handleWebhook(gatewayId, req.body, signature);

        res.json({
            success: true,
            received: true
        });
    } catch (error) {
        console.error(`[PaymentWebhook] Error from ${gatewayId}:`, error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});
