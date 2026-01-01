/**
 * System Settings Routes
 */

const express = require('express');
const router = express.Router();
const settingsController = require('../../controllers/admin/settings.controller');

// General settings
router.get('/', settingsController.get);
router.put('/', settingsController.update);
router.get('/email', settingsController.getEmailSettings);
router.put('/email', settingsController.updateEmailSettings);
router.get('/payment', settingsController.getPaymentSettings);
router.put('/payment', settingsController.updatePaymentSettings);

module.exports = router;
