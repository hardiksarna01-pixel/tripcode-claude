/**
 * Fare Calendar Routes
 * Fare calendar and price trends
 */

const express = require('express');
const router = express.Router();
const fareCalendarController = require('../controllers/fare-calendar.controller');
const { optionalAuth } = require('../middleware/auth.middleware');

// Fare calendar
router.get('/flights', optionalAuth, fareCalendarController.getFlightFareCalendar);
router.get('/hotels', optionalAuth, fareCalendarController.getHotelFareCalendar);

// Price trends
router.get('/trends/flights', fareCalendarController.getFlightPriceTrends);
router.get('/trends/hotels', fareCalendarController.getHotelPriceTrends);

// Best dates
router.get('/best-dates', fareCalendarController.getBestDates);

// Price alerts
router.post('/subscribe', optionalAuth, fareCalendarController.subscribePriceAlert);
router.delete('/unsubscribe/:alertId', fareCalendarController.unsubscribePriceAlert);

module.exports = router;
