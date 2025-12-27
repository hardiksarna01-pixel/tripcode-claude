/**
 * Fare Calendar Routes
 */

const express = require('express');
const router = express.Router();
const fareCalendarController = require('../controllers/fareCalendar.controller');

// Fare calendar and trends
router.get('/calendar', fareCalendarController.getFareCalendar);
router.get('/trend', fareCalendarController.getFareTrend);
router.get('/flexible', fareCalendarController.getFlexibleFares);
router.post('/compare', fareCalendarController.comparePrices);

// Price alerts
router.get('/alerts', fareCalendarController.getAlerts);
router.post('/alerts', fareCalendarController.createAlert);
router.get('/alerts/:id', fareCalendarController.getAlert);
router.put('/alerts/:id', fareCalendarController.updateAlert);
router.delete('/alerts/:id', fareCalendarController.deleteAlert);
router.post('/alerts/:id/toggle', fareCalendarController.toggleAlert);

module.exports = router;
