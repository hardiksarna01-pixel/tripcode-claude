const express = require('express');
const router = express.Router();
const flightApiService = require('../services/flight-api.service');
const { catchAsync } = require('../utils/catchAsync');

/**
 * @route   GET /api/v1/wallet/balance
 * @desc    Get agent wallet balance
 * @access  Private
 */
router.get('/balance', catchAsync(async (req, res) => {
    const result = await flightApiService.getWalletBalance(req.agentCredentials);
    
    res.json({
        success: true,
        data: result
    });
}));

/**
 * @route   GET /api/v1/wallet/transactions
 * @desc    Get wallet transaction history
 * @access  Private
 */
router.get('/transactions', catchAsync(async (req, res) => {
    // This would need a separate API endpoint or database query
    // For now, return placeholder
    res.json({
        success: true,
        data: {
            transactions: [],
            message: 'Transaction history - implement with database'
        }
    });
}));

module.exports = router;
