/**
 * Reports & Analytics Routes
 */

const express = require('express');
const router = express.Router();
const reportController = require('../../controllers/admin/report.controller');
const { authenticateAdmin } = require('../../middleware/auth.middleware');
const { requirePermission, requireTenantAccess } = require('../../middleware/permissions.middleware');

router.use(authenticateAdmin);
router.use(requireTenantAccess);

// Booking reports
router.get('/bookings', requirePermission('reports', 'read'), reportController.getBookingReport);
router.get('/bookings/summary', requirePermission('reports', 'read'), reportController.getBookingSummary);
router.get('/bookings/by-product', requirePermission('reports', 'read'), reportController.getBookingsByProduct);
router.get('/bookings/by-agent', requirePermission('reports', 'read'), reportController.getBookingsByAgent);
router.get('/bookings/by-supplier', requirePermission('reports', 'read'), reportController.getBookingsBySupplier);

// Revenue reports
router.get('/revenue', requirePermission('reports', 'read'), reportController.getRevenueReport);
router.get('/revenue/trends', requirePermission('reports', 'read'), reportController.getRevenueTrends);
router.get('/revenue/by-product', requirePermission('reports', 'read'), reportController.getRevenueByProduct);

// Agent reports
router.get('/agents', requirePermission('reports', 'read'), reportController.getAgentReport);
router.get('/agents/performance', requirePermission('reports', 'read'), reportController.getAgentPerformance);
router.get('/agents/top', requirePermission('reports', 'read'), reportController.getTopAgents);

// Commission reports
router.get('/commissions', requirePermission('reports', 'read'), reportController.getCommissionReport);
router.get('/commissions/by-agent', requirePermission('reports', 'read'), reportController.getCommissionByAgent);

// Cancellation reports
router.get('/cancellations', requirePermission('reports', 'read'), reportController.getCancellationReport);

// Search analytics
router.get('/search-analytics', requirePermission('reports', 'read'), reportController.getSearchAnalytics);
router.get('/conversion-rate', requirePermission('reports', 'read'), reportController.getConversionRate);

// Custom reports
router.get('/custom', requirePermission('reports', 'read'), reportController.listCustomReports);
router.post('/custom', requirePermission('reports', 'create'), reportController.createCustomReport);
router.get('/custom/:reportId', requirePermission('reports', 'read'), reportController.runCustomReport);
router.put('/custom/:reportId', requirePermission('reports', 'update'), reportController.updateCustomReport);
router.delete('/custom/:reportId', requirePermission('reports', 'delete'), reportController.deleteCustomReport);

// Scheduled reports
router.get('/scheduled', requirePermission('reports', 'read'), reportController.listScheduledReports);
router.post('/scheduled', requirePermission('reports', 'create'), reportController.createScheduledReport);
router.put('/scheduled/:scheduleId', requirePermission('reports', 'update'), reportController.updateScheduledReport);
router.delete('/scheduled/:scheduleId', requirePermission('reports', 'delete'), reportController.deleteScheduledReport);

// Export
router.post('/export', requirePermission('reports', 'export'), reportController.exportReport);

module.exports = router;
