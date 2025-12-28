/**
 * Booking History Routes
 * Complete booking history with filters and exports
 */

const express = require('express');
const router = express.Router();
const bookingHistoryController = require('../controllers/booking-history.controller');
const { authenticate, authenticateAdmin } = require('../middleware/auth.middleware');

// ============================================
// CUSTOMER/AGENT BOOKING HISTORY
// ============================================
router.use(authenticate);

// Get all booking history with filters
router.get('/', bookingHistoryController.getBookingHistory);

// Get booking summary/stats
router.get('/summary', bookingHistoryController.getBookingSummary);

// Get bookings by product type
router.get('/flights', bookingHistoryController.getFlightBookings);
router.get('/hotels', bookingHistoryController.getHotelBookings);
router.get('/bus', bookingHistoryController.getBusBookings);
router.get('/holidays', bookingHistoryController.getHolidayBookings);
router.get('/activities', bookingHistoryController.getActivityBookings);
router.get('/insurance', bookingHistoryController.getInsuranceBookings);
router.get('/visa', bookingHistoryController.getVisaBookings);
router.get('/transfers', bookingHistoryController.getTransferBookings);

// Get bookings by status
router.get('/status/confirmed', bookingHistoryController.getConfirmedBookings);
router.get('/status/pending', bookingHistoryController.getPendingBookings);
router.get('/status/cancelled', bookingHistoryController.getCancelledBookings);
router.get('/status/completed', bookingHistoryController.getCompletedBookings);
router.get('/status/failed', bookingHistoryController.getFailedBookings);

// Get bookings by date range
router.get('/date-range', bookingHistoryController.getBookingsByDateRange);

// Get upcoming bookings
router.get('/upcoming', bookingHistoryController.getUpcomingBookings);

// Get past bookings
router.get('/past', bookingHistoryController.getPastBookings);

// Get today's bookings
router.get('/today', bookingHistoryController.getTodaysBookings);

// Search bookings
router.get('/search', bookingHistoryController.searchBookings);

// Export bookings
router.get('/export/pdf', bookingHistoryController.exportBookingsPDF);
router.get('/export/excel', bookingHistoryController.exportBookingsExcel);
router.get('/export/csv', bookingHistoryController.exportBookingsCSV);

// Get booking by reference
router.get('/reference/:reference', bookingHistoryController.getBookingByReference);

// Get booking timeline/activity
router.get('/:bookingId/timeline', bookingHistoryController.getBookingTimeline);

// Get related bookings (same trip)
router.get('/:bookingId/related', bookingHistoryController.getRelatedBookings);

// ============================================
// ADMIN BOOKING HISTORY
// ============================================
router.use('/admin', authenticateAdmin);

// Get all bookings (admin view)
router.get('/admin/all', bookingHistoryController.getAllBookingsAdmin);

// Get bookings by agent
router.get('/admin/agent/:agentId', bookingHistoryController.getAgentBookings);

// Get bookings by customer
router.get('/admin/customer/:customerId', bookingHistoryController.getCustomerBookings);

// Get bookings by supplier
router.get('/admin/supplier/:supplierId', bookingHistoryController.getSupplierBookings);

// Get booking trends
router.get('/admin/trends', bookingHistoryController.getBookingTrends);

// Get booking analytics
router.get('/admin/analytics', bookingHistoryController.getBookingAnalytics);

module.exports = router;
