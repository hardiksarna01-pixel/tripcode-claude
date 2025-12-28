/**
 * Wallet Routes
 * Agent wallet management
 */

const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet.controller');
const { authenticate, requireAgent } = require('../middleware/auth.middleware');
const { validate, walletSchemas, paginationSchema } = require('../middleware/validation.middleware');

router.use(authenticate);
router.use(requireAgent);

// Balance
router.get('/balance', walletController.getBalance);

// Transaction history
router.get('/transactions', validate(paginationSchema, 'query'), walletController.getTransactions);
router.get('/transactions/:transactionId', walletController.getTransactionDetails);

// Top-up
router.post('/topup', validate(walletSchemas.topup), walletController.initiateTopup);
router.post('/topup/:orderId/verify', walletController.verifyTopup);

// Transfer (B2B)
router.post('/transfer', validate(walletSchemas.transfer), walletController.transferFunds);

// Statement
router.get('/statement', walletController.getStatement);
router.get('/statement/download', walletController.downloadStatement);

// Credit
router.get('/credit-balance', walletController.getCreditBalance);
router.get('/credit-usage', walletController.getCreditUsage);

module.exports = router;
