/**
 * Visa Services Routes
 */

const express = require('express');
const router = express.Router();
const visaController = require('../controllers/visa.controller');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');

// Public routes
router.get('/countries', visaController.getCountries);
router.get('/requirements/:countryCode', visaController.getVisaRequirements);
router.get('/types/:countryCode', visaController.getVisaTypes);
router.post('/check-eligibility', visaController.checkEligibility);

// Protected routes
router.use(authenticate);

// Application
router.post('/apply', visaController.createApplication);
router.get('/application/:applicationId', visaController.getApplicationStatus);
router.put('/application/:applicationId', visaController.updateApplication);
router.post('/application/:applicationId/documents', visaController.uploadDocuments);
router.post('/application/:applicationId/submit', visaController.submitApplication);
router.post('/application/:applicationId/pay', visaController.processPayment);

// Track
router.get('/track/:trackingId', visaController.trackApplication);

module.exports = router;
