/**
 * Visa Services Routes
 */

const express = require('express');
const router = express.Router();
const visaController = require('../controllers/visa.controller');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');

// Public routes
router.get('/countries', visaController.getCountries);
router.get('/types/:country', visaController.getVisaTypes);
router.get('/requirements/:country/:visaType', visaController.getRequirements);

// Protected routes
router.use(authenticate);

// Application
router.post('/apply', visaController.createApplication);
router.get('/application/:applicationId', visaController.getApplicationStatus);
router.post('/upload', visaController.uploadDocument);
router.post('/appointment', visaController.scheduleAppointment);

module.exports = router;
