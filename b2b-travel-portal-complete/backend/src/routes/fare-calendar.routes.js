/**
 * Fare Calendar Routes
 */

const express = require('express');
const router = express.Router();
const fareCalendarController = require('../controllers/fare-calendar.controller');
const { optionalAuth, authenticate } = require('../middleware/auth.middleware');

// Fare calendar
router.get('/flights', optionalAuth, fareCalendarController.getFlightFares);
router.get('/hotels', optionalAuth, fareCalendarController.getHotelFares);
router.get('/lowest', fareCalendarController.getLowestFares);

// Price alerts
router.get('/alerts', optionalAuth, fareCalendarController.getPriceAlerts);
router.post('/alerts', optionalAuth, fareCalendarController.createPriceAlert);
router.delete('/alerts/:alertId', fareCalendarController.deletePriceAlert);

module.exports = router;
