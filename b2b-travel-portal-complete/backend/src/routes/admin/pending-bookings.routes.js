/**
 * Pending Bookings Routes
 * Manages pending bookings due to low supplier balance
 * Provides manual PNR update and supplier rebooking functionality
 */

const express = require('express');
const router = express.Router();
const pendingBookingsController = require('../../controllers/admin/pending-bookings.controller');
const { authenticateAdmin } = require('../../middleware/auth.middleware');

// Apply admin authentication to all routes
router.use(authenticateAdmin);

// Overview
router.get('/overview', pendingBookingsController.getPendingOverview);

// Pending bookings list
router.get('/', pendingBookingsController.getPendingBookings);
router.get('/:id', pendingBookingsController.getPendingBookingDetails);

// Supplier balances
router.get('/suppliers/balances', pendingBookingsController.getSupplierBalances);
router.put('/suppliers/:supplierId/balance', pendingBookingsController.updateSupplierBalance);

// PNR Management
router.put('/:id/pnr', pendingBookingsController.updatePNR);

// Rebooking
router.post('/:id/rebook', pendingBookingsController.rebookWithSupplier);
router.post('/:id/retry', pendingBookingsController.retryBooking);
router.post('/:id/cancel', pendingBookingsController.cancelPendingBooking);

// Bulk actions
router.post('/bulk/retry', pendingBookingsController.bulkRetry);

// Processed bookings history
router.get('/history/processed', pendingBookingsController.getProcessedBookings);

module.exports = router;
