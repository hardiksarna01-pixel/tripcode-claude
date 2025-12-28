/**
 * Finance Management Routes
 */

const express = require('express');
const router = express.Router();
const financeController = require('../../controllers/admin/finance.controller');
const { authenticateAdmin } = require('../../middleware/auth.middleware');
const { requirePermission, requireTenantAccess } = require('../../middleware/permissions.middleware');

router.use(authenticateAdmin);
router.use(requireTenantAccess);

// Dashboard
router.get('/dashboard', requirePermission('finance', 'read'), financeController.getDashboard);

// Invoices
router.get('/invoices', requirePermission('finance', 'read'), financeController.listInvoices);
router.post('/invoices', requirePermission('finance', 'create'), financeController.createInvoice);
router.get('/invoices/:invoiceId', requirePermission('finance', 'read'), financeController.getInvoiceDetails);
router.put('/invoices/:invoiceId', requirePermission('finance', 'update'), financeController.updateInvoice);
router.post('/invoices/:invoiceId/send', requirePermission('finance', 'create'), financeController.sendInvoice);
router.get('/invoices/:invoiceId/pdf', requirePermission('finance', 'read'), financeController.downloadInvoice);

// Ledger
router.get('/ledger', requirePermission('finance', 'read'), financeController.getLedger);
router.get('/ledger/:agentId', requirePermission('finance', 'read'), financeController.getAgentLedger);
router.post('/ledger/entry', requirePermission('finance', 'create'), financeController.createLedgerEntry);

// Wallet management
router.get('/wallet/transactions', requirePermission('wallet', 'read'), financeController.getWalletTransactions);
router.post('/wallet/credit', requirePermission('wallet', 'credit'), financeController.creditWallet);
router.post('/wallet/debit', requirePermission('wallet', 'debit'), financeController.debitWallet);
router.post('/wallet/adjust', requirePermission('wallet', 'adjust'), financeController.adjustWallet);

// Payments
router.get('/payments', requirePermission('finance', 'read'), financeController.getPayments);
router.get('/payments/pending', requirePermission('finance', 'read'), financeController.getPendingPayments);
router.post('/payments/:paymentId/approve', requirePermission('finance', 'approve'), financeController.approvePayment);
router.post('/payments/:paymentId/reject', requirePermission('finance', 'approve'), financeController.rejectPayment);

// Refunds
router.get('/refunds', requirePermission('finance', 'read'), financeController.getRefunds);
router.get('/refunds/pending', requirePermission('finance', 'read'), financeController.getPendingRefunds);
router.post('/refunds/:refundId/process', requirePermission('finance', 'approve'), financeController.processRefund);

// Commissions
router.get('/commissions', requirePermission('finance', 'read'), financeController.getCommissions);
router.get('/commissions/pending', requirePermission('finance', 'read'), financeController.getPendingCommissions);
router.post('/commissions/payout', requirePermission('finance', 'approve'), financeController.processCommissionPayout);

// GST/TDS
router.get('/gst', requirePermission('finance', 'read'), financeController.getGSTReport);
router.get('/tds', requirePermission('finance', 'read'), financeController.getTDSReport);

// Reconciliation
router.get('/reconciliation', requirePermission('finance', 'read'), financeController.getReconciliation);
router.post('/reconciliation/process', requirePermission('finance', 'approve'), financeController.processReconciliation);

// Export
router.get('/export/ledger', requirePermission('finance', 'export'), financeController.exportLedger);
router.get('/export/transactions', requirePermission('finance', 'export'), financeController.exportTransactions);

module.exports = router;
