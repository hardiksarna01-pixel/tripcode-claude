/**
 * Wallet Routes
 */

const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet.controller');

// Balance and summary
router.get('/balance', walletController.getBalance);
router.get('/summary', walletController.getSummary);

// Transactions
router.get('/transactions', walletController.getTransactions);

// Fund operations
router.post('/add-funds', walletController.addFunds);
router.post('/deduct', walletController.deductFunds);
router.post('/commission', walletController.addCommission);
router.post('/refund', walletController.processRefund);

// Hold operations
router.post('/hold', walletController.holdFunds);
router.post('/release-hold', walletController.releaseHold);

// Credit management
router.post('/request-credit', walletController.requestCreditIncrease);

module.exports = router;
