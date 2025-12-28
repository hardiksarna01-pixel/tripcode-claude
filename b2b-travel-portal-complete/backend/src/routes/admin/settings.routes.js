/**
 * System Settings Routes
 */

const express = require('express');
const router = express.Router();
const settingsController = require('../../controllers/admin/settings.controller');
const { authenticateAdmin, authenticateSuperAdmin } = require('../../middleware/auth.middleware');
const { requirePermission, requireTenantAccess } = require('../../middleware/permissions.middleware');

router.use(authenticateAdmin);
router.use(requireTenantAccess);

// General settings
router.get('/general', requirePermission('settings', 'read'), settingsController.getGeneralSettings);
router.put('/general', requirePermission('settings', 'update'), settingsController.updateGeneralSettings);

// Business settings
router.get('/business', requirePermission('settings', 'read'), settingsController.getBusinessSettings);
router.put('/business', requirePermission('settings', 'update'), settingsController.updateBusinessSettings);

// Booking settings
router.get('/booking', requirePermission('settings', 'read'), settingsController.getBookingSettings);
router.put('/booking', requirePermission('settings', 'update'), settingsController.updateBookingSettings);

// Payment settings
router.get('/payment', requirePermission('settings', 'read'), settingsController.getPaymentSettings);
router.put('/payment', requirePermission('settings', 'update'), settingsController.updatePaymentSettings);

// Payment gateways
router.get('/payment-gateways', requirePermission('settings', 'read'), settingsController.getPaymentGateways);
router.put('/payment-gateways/:gatewayId', requirePermission('settings', 'update'), settingsController.updatePaymentGateway);
router.post('/payment-gateways/:gatewayId/test', requirePermission('settings', 'update'), settingsController.testPaymentGateway);

// Notification settings
router.get('/notifications', requirePermission('settings', 'read'), settingsController.getNotificationSettings);
router.put('/notifications', requirePermission('settings', 'update'), settingsController.updateNotificationSettings);

// Email settings
router.get('/email', requirePermission('settings', 'read'), settingsController.getEmailSettings);
router.put('/email', requirePermission('settings', 'update'), settingsController.updateEmailSettings);
router.post('/email/test', requirePermission('settings', 'update'), settingsController.testEmailSettings);

// SMS settings
router.get('/sms', requirePermission('settings', 'read'), settingsController.getSmsSettings);
router.put('/sms', requirePermission('settings', 'update'), settingsController.updateSmsSettings);
router.post('/sms/test', requirePermission('settings', 'update'), settingsController.testSmsSettings);

// WhatsApp settings
router.get('/whatsapp', requirePermission('settings', 'read'), settingsController.getWhatsappSettings);
router.put('/whatsapp', requirePermission('settings', 'update'), settingsController.updateWhatsappSettings);

// Tax settings (GST/TDS)
router.get('/tax', requirePermission('settings', 'read'), settingsController.getTaxSettings);
router.put('/tax', requirePermission('settings', 'update'), settingsController.updateTaxSettings);

// Currency settings
router.get('/currency', requirePermission('settings', 'read'), settingsController.getCurrencySettings);
router.put('/currency', requirePermission('settings', 'update'), settingsController.updateCurrencySettings);

// System settings (Super Admin only)
router.get('/system', authenticateSuperAdmin, settingsController.getSystemSettings);
router.put('/system', authenticateSuperAdmin, settingsController.updateSystemSettings);

// Cache management
router.post('/cache/clear', requirePermission('settings', 'update'), settingsController.clearCache);

module.exports = router;
