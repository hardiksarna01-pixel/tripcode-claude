/**
 * Wallet Routes
 */

const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

// Balance
router.get('/balance', walletController.getBalance);

// Transaction history
router.get('/transactions', walletController.getTransactions);

// Recharge
router.post('/recharge', walletController.requestRecharge);

module.exports = router;
