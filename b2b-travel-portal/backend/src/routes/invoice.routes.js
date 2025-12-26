/**
 * Invoice Routes
 */

const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');

// GST related
router.get('/gst-summary', invoiceController.getGstSummary);
router.get('/gst-profiles', invoiceController.getGstProfiles);

// Get invoices
router.get('/', invoiceController.getInvoices);

// Generate invoice
router.post('/generate', invoiceController.generateInvoice);

// Get invoice by booking
router.get('/booking/:bookingRef', invoiceController.getInvoiceByBooking);

// Single invoice operations
router.get('/:id', invoiceController.getInvoice);
router.get('/:id/download', invoiceController.downloadInvoice);
router.post('/:id/email', invoiceController.emailInvoice);
router.put('/:id/gst', invoiceController.addGstDetails);

module.exports = router;
