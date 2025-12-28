/**
 * Admin Dashboard Routes
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/admin/dashboard.controller');
const { authenticateAdmin } = require('../../middleware/auth.middleware');
const { requirePermission } = require('../../middleware/permissions.middleware');

router.use(authenticateAdmin);
router.use(requirePermission('dashboard', 'read'));

// Overview stats
router.get('/stats', dashboardController.getStats);
router.get('/stats/realtime', dashboardController.getRealtimeStats);

// Charts data
router.get('/charts/bookings', dashboardController.getBookingsChart);
router.get('/charts/revenue', dashboardController.getRevenueChart);
router.get('/charts/products', dashboardController.getProductsChart);

// Recent activity
router.get('/recent-bookings', dashboardController.getRecentBookings);
router.get('/recent-agents', dashboardController.getRecentAgents);
router.get('/recent-transactions', dashboardController.getRecentTransactions);

// Alerts
router.get('/alerts', dashboardController.getAlerts);
router.get('/pending-actions', dashboardController.getPendingActions);

// Quick metrics
router.get('/metrics/today', dashboardController.getTodayMetrics);
router.get('/metrics/week', dashboardController.getWeekMetrics);
router.get('/metrics/month', dashboardController.getMonthMetrics);

module.exports = router;
