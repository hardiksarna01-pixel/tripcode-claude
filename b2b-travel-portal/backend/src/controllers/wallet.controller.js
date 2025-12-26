/**
 * Wallet Controller
 * Handles wallet and credit management operations
 */

const catchAsync = require('../utils/catchAsync');

// In-memory storage for demo (would be database in production)
let wallets = new Map();
let transactions = [];
let transactionIdCounter = 1;
let creditRequests = [];

/**
 * Initialize wallet for agent
 */
function initializeWallet(agentId) {
    if (!wallets.has(agentId)) {
        wallets.set(agentId, {
            agentId,
            balance: 50000, // Default starting balance
            creditLimit: 100000,
            usedCredit: 0,
            holdAmount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
    }
    return wallets.get(agentId);
}

/**
 * Get wallet balance and details
 */
exports.getBalance = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;
    const wallet = initializeWallet(agentId);

    res.json({
        success: true,
        data: {
            balance: wallet.balance,
            creditLimit: wallet.creditLimit,
            usedCredit: wallet.usedCredit,
            availableCredit: wallet.creditLimit - wallet.usedCredit,
            holdAmount: wallet.holdAmount,
            bookingPower: wallet.balance + (wallet.creditLimit - wallet.usedCredit) - wallet.holdAmount
        }
    });
});

/**
 * Get transaction history
 */
exports.getTransactions = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;
    const { page = 1, limit = 20, type, startDate, endDate } = req.query;

    let agentTransactions = transactions.filter(t => t.agentId === agentId);

    // Apply filters
    if (type) {
        agentTransactions = agentTransactions.filter(t => t.type === type);
    }
    if (startDate) {
        agentTransactions = agentTransactions.filter(t => new Date(t.createdAt) >= new Date(startDate));
    }
    if (endDate) {
        agentTransactions = agentTransactions.filter(t => new Date(t.createdAt) <= new Date(endDate));
    }

    // Sort by date (newest first)
    agentTransactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Paginate
    const offset = (page - 1) * limit;
    const paginatedTransactions = agentTransactions.slice(offset, offset + parseInt(limit));

    res.json({
        success: true,
        data: {
            transactions: paginatedTransactions,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: agentTransactions.length,
                totalPages: Math.ceil(agentTransactions.length / limit)
            }
        }
    });
});

/**
 * Add funds to wallet
 */
exports.addFunds = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;
    const { amount, paymentMethod, reference } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({
            success: false,
            error: 'Invalid amount'
        });
    }

    const wallet = initializeWallet(agentId);
    wallet.balance += amount;
    wallet.updatedAt = new Date().toISOString();

    const transaction = {
        id: transactionIdCounter++,
        agentId,
        type: 'credit',
        category: 'recharge',
        amount,
        balanceAfter: wallet.balance,
        description: `Wallet recharge via ${paymentMethod || 'Direct'}`,
        reference: reference || `RCH${Date.now()}`,
        status: 'completed',
        createdAt: new Date().toISOString()
    };

    transactions.push(transaction);
    wallets.set(agentId, wallet);

    res.json({
        success: true,
        data: {
            transaction,
            newBalance: wallet.balance
        }
    });
});

/**
 * Deduct from wallet (for bookings)
 */
exports.deductFunds = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;
    const { amount, bookingRef, description } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({
            success: false,
            error: 'Invalid amount'
        });
    }

    const wallet = initializeWallet(agentId);
    const bookingPower = wallet.balance + (wallet.creditLimit - wallet.usedCredit);

    if (amount > bookingPower) {
        return res.status(400).json({
            success: false,
            error: 'Insufficient funds'
        });
    }

    // Deduct from balance first, then use credit
    if (amount <= wallet.balance) {
        wallet.balance -= amount;
    } else {
        const creditNeeded = amount - wallet.balance;
        wallet.balance = 0;
        wallet.usedCredit += creditNeeded;
    }

    wallet.updatedAt = new Date().toISOString();

    const transaction = {
        id: transactionIdCounter++,
        agentId,
        type: 'debit',
        category: 'booking',
        amount: -amount,
        balanceAfter: wallet.balance,
        description: description || `Booking payment`,
        reference: bookingRef || `BKG${Date.now()}`,
        status: 'completed',
        createdAt: new Date().toISOString()
    };

    transactions.push(transaction);
    wallets.set(agentId, wallet);

    res.json({
        success: true,
        data: {
            transaction,
            newBalance: wallet.balance
        }
    });
});

/**
 * Add commission to wallet
 */
exports.addCommission = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;
    const { amount, bookingRef, description } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({
            success: false,
            error: 'Invalid amount'
        });
    }

    const wallet = initializeWallet(agentId);
    wallet.balance += amount;
    wallet.updatedAt = new Date().toISOString();

    const transaction = {
        id: transactionIdCounter++,
        agentId,
        type: 'credit',
        category: 'commission',
        amount,
        balanceAfter: wallet.balance,
        description: description || `Commission earned`,
        reference: bookingRef || `COM${Date.now()}`,
        status: 'completed',
        createdAt: new Date().toISOString()
    };

    transactions.push(transaction);
    wallets.set(agentId, wallet);

    res.json({
        success: true,
        data: {
            transaction,
            newBalance: wallet.balance
        }
    });
});

/**
 * Request credit limit increase
 */
exports.requestCreditIncrease = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;
    const { requestedLimit, reason } = req.body;

    if (!requestedLimit || requestedLimit <= 0) {
        return res.status(400).json({
            success: false,
            error: 'Invalid credit limit requested'
        });
    }

    const wallet = initializeWallet(agentId);

    if (requestedLimit <= wallet.creditLimit) {
        return res.status(400).json({
            success: false,
            error: 'Requested limit must be higher than current limit'
        });
    }

    const request = {
        id: creditRequests.length + 1,
        agentId,
        currentLimit: wallet.creditLimit,
        requestedLimit,
        reason: reason || '',
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    creditRequests.push(request);

    res.json({
        success: true,
        data: request,
        message: 'Credit increase request submitted successfully'
    });
});

/**
 * Get wallet summary
 */
exports.getSummary = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;
    const { period = 'month' } = req.query;

    const wallet = initializeWallet(agentId);
    const agentTransactions = transactions.filter(t => t.agentId === agentId);

    // Calculate date range
    const now = new Date();
    let startDate;
    switch (period) {
        case 'week':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
        case 'month':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
        case 'year':
            startDate = new Date(now.setFullYear(now.getFullYear() - 1));
            break;
        default:
            startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    const periodTransactions = agentTransactions.filter(t => new Date(t.createdAt) >= startDate);

    const summary = {
        currentBalance: wallet.balance,
        creditLimit: wallet.creditLimit,
        usedCredit: wallet.usedCredit,
        availableCredit: wallet.creditLimit - wallet.usedCredit,
        bookingPower: wallet.balance + (wallet.creditLimit - wallet.usedCredit),
        period: {
            totalCredits: periodTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0),
            totalDebits: periodTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + Math.abs(t.amount), 0),
            totalCommission: periodTransactions.filter(t => t.category === 'commission').reduce((sum, t) => sum + t.amount, 0),
            totalBookings: periodTransactions.filter(t => t.category === 'booking').length,
            transactionCount: periodTransactions.length
        }
    };

    res.json({
        success: true,
        data: summary
    });
});

/**
 * Hold funds for pending booking
 */
exports.holdFunds = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;
    const { amount, bookingRef } = req.body;

    const wallet = initializeWallet(agentId);
    const availableAmount = wallet.balance + (wallet.creditLimit - wallet.usedCredit) - wallet.holdAmount;

    if (amount > availableAmount) {
        return res.status(400).json({
            success: false,
            error: 'Insufficient funds for hold'
        });
    }

    wallet.holdAmount += amount;
    wallet.updatedAt = new Date().toISOString();
    wallets.set(agentId, wallet);

    res.json({
        success: true,
        data: {
            holdAmount: wallet.holdAmount,
            reference: bookingRef
        }
    });
});

/**
 * Release held funds
 */
exports.releaseHold = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;
    const { amount, bookingRef } = req.body;

    const wallet = initializeWallet(agentId);

    if (amount > wallet.holdAmount) {
        wallet.holdAmount = 0;
    } else {
        wallet.holdAmount -= amount;
    }

    wallet.updatedAt = new Date().toISOString();
    wallets.set(agentId, wallet);

    res.json({
        success: true,
        data: {
            holdAmount: wallet.holdAmount,
            reference: bookingRef
        }
    });
});

/**
 * Process refund
 */
exports.processRefund = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;
    const { amount, bookingRef, description } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({
            success: false,
            error: 'Invalid refund amount'
        });
    }

    const wallet = initializeWallet(agentId);

    // First repay any used credit, then add to balance
    if (wallet.usedCredit > 0) {
        if (amount <= wallet.usedCredit) {
            wallet.usedCredit -= amount;
        } else {
            const remainingAfterCredit = amount - wallet.usedCredit;
            wallet.usedCredit = 0;
            wallet.balance += remainingAfterCredit;
        }
    } else {
        wallet.balance += amount;
    }

    wallet.updatedAt = new Date().toISOString();

    const transaction = {
        id: transactionIdCounter++,
        agentId,
        type: 'credit',
        category: 'refund',
        amount,
        balanceAfter: wallet.balance,
        description: description || `Refund for booking ${bookingRef}`,
        reference: bookingRef || `RFD${Date.now()}`,
        status: 'completed',
        createdAt: new Date().toISOString()
    };

    transactions.push(transaction);
    wallets.set(agentId, wallet);

    res.json({
        success: true,
        data: {
            transaction,
            newBalance: wallet.balance
        }
    });
});
