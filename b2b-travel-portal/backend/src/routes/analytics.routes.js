/**
 * Analytics Routes
 */

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');

// Dashboard
router.get('/dashboard', analyticsController.getDashboardStats);

// Booking analytics
router.get('/bookings', analyticsController.getBookingAnalytics);

// Revenue analytics
router.get('/revenue', analyticsController.getRevenueAnalytics);

// Top routes and airlines
router.get('/top-routes', analyticsController.getTopRoutes);
router.get('/top-airlines', analyticsController.getTopAirlines);

// Performance metrics
router.get('/performance', analyticsController.getPerformanceMetrics);

// Monthly summary
router.get('/monthly', analyticsController.getMonthlySummary);

// Commission report
router.get('/commission', analyticsController.getCommissionReport);

// Export report
router.get('/export', analyticsController.exportReport);

module.exports = router;
