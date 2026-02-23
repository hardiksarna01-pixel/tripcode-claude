/**
 * Finance Management Routes
 */

const express = require('express');
const router = express.Router();
const financeController = require('../../controllers/admin/finance.controller');

// Dashboard
router.get('/dashboard', financeController.getDashboard);
router.get('/ledger', financeController.getLedger);
router.get('/invoices', financeController.getInvoices);
router.get('/transactions', financeController.getTransactions);
router.post('/wallet/credit', financeController.creditWallet);
router.post('/wallet/debit', financeController.debitWallet);

module.exports = router;
