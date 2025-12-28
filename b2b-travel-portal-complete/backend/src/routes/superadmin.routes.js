/**
 * Super Admin Routes
 * Platform-wide administration
 */

const express = require('express');
const router = express.Router();
const superadminController = require('../controllers/superadmin.controller');
const { authenticateSuperAdmin } = require('../middleware/auth.middleware');

router.use(authenticateSuperAdmin);

// Platform dashboard
router.get('/dashboard', superadminController.getDashboard);
router.get('/stats', superadminController.getPlatformStats);

// Tenant management
router.get('/tenants', superadminController.listTenants);
router.post('/tenants', superadminController.createTenant);
router.get('/tenants/:tenantId', superadminController.getTenantDetails);
router.put('/tenants/:tenantId', superadminController.updateTenant);
router.delete('/tenants/:tenantId', superadminController.deleteTenant);
router.post('/tenants/:tenantId/activate', superadminController.activateTenant);
router.post('/tenants/:tenantId/suspend', superadminController.suspendTenant);

// Admin user management
router.get('/admins', superadminController.listAdmins);
router.post('/admins', superadminController.createAdmin);
router.get('/admins/:adminId', superadminController.getAdminDetails);
router.put('/admins/:adminId', superadminController.updateAdmin);
router.delete('/admins/:adminId', superadminController.deleteAdmin);
router.post('/admins/:adminId/reset-password', superadminController.resetAdminPassword);

// Role management
router.get('/roles', superadminController.listRoles);
router.post('/roles', superadminController.createRole);
router.put('/roles/:roleId', superadminController.updateRole);
router.delete('/roles/:roleId', superadminController.deleteRole);

// Supplier configuration
router.get('/suppliers', superadminController.listSuppliers);
router.post('/suppliers', superadminController.createSupplier);
router.put('/suppliers/:supplierId', superadminController.updateSupplier);
router.delete('/suppliers/:supplierId', superadminController.deleteSupplier);
router.put('/suppliers/:supplierId/credentials', superadminController.updateSupplierCredentials);
router.post('/suppliers/:supplierId/test', superadminController.testSupplierConnection);

// Payment gateway configuration
router.get('/payment-gateways', superadminController.listPaymentGateways);
router.put('/payment-gateways/:gatewayId', superadminController.updatePaymentGateway);
router.post('/payment-gateways/:gatewayId/test', superadminController.testPaymentGateway);

// Platform settings
router.get('/settings', superadminController.getPlatformSettings);
router.put('/settings', superadminController.updatePlatformSettings);

// System health
router.get('/health', superadminController.getSystemHealth);
router.get('/health/services', superadminController.getServicesHealth);
router.get('/health/database', superadminController.getDatabaseHealth);
router.get('/health/cache', superadminController.getCacheHealth);

// Logs
router.get('/logs', superadminController.getSystemLogs);
router.get('/logs/errors', superadminController.getErrorLogs);
router.get('/logs/api', superadminController.getApiLogs);
router.get('/logs/audit', superadminController.getAuditLogs);

// Maintenance
router.post('/maintenance/enable', superadminController.enableMaintenance);
router.post('/maintenance/disable', superadminController.disableMaintenance);
router.post('/cache/clear', superadminController.clearCache);
router.post('/cache/warm', superadminController.warmCache);

// Backup & Restore
router.post('/backup', superadminController.createBackup);
router.get('/backups', superadminController.listBackups);
router.post('/restore/:backupId', superadminController.restoreBackup);

// Feature flags
router.get('/features', superadminController.listFeatures);
router.put('/features/:featureId', superadminController.updateFeature);

// Announcements
router.get('/announcements', superadminController.listAnnouncements);
router.post('/announcements', superadminController.createAnnouncement);
router.put('/announcements/:announcementId', superadminController.updateAnnouncement);
router.delete('/announcements/:announcementId', superadminController.deleteAnnouncement);

// Platform reports
router.get('/reports/revenue', superadminController.getRevenueReport);
router.get('/reports/tenants', superadminController.getTenantReport);
router.get('/reports/usage', superadminController.getUsageReport);

module.exports = router;
