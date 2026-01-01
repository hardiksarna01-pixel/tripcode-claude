/**
 * Reports & Analytics Routes
 */

const express = require('express');
const router = express.Router();
const reportController = require('../../controllers/admin/report.controller');

// Booking reports
router.get('/bookings', reportController.getBookings);
router.get('/revenue', reportController.getRevenue);
router.get('/agents', reportController.getAgents);
router.get('/commissions', reportController.getCommissions);
router.post('/export', reportController.export);

module.exports = router;
