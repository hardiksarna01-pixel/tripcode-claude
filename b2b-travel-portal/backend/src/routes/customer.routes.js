/**
 * Customer Routes
 */

const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');

// Quick search
router.get('/search', customerController.searchCustomers);

// Frequent travelers
router.get('/frequent', customerController.getFrequentTravelers);

// Import customers
router.post('/import', customerController.importCustomers);

// CRUD operations
router.get('/', customerController.getCustomers);
router.get('/:id', customerController.getCustomer);
router.post('/', customerController.createCustomer);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

// Customer bookings
router.get('/:id/bookings', customerController.getCustomerBookings);

module.exports = router;
