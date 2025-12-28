/**
 * Supplier/API Provider Management Routes
 */

const express = require('express');
const router = express.Router();
const supplierController = require('../../controllers/admin/supplier.controller');
const { authenticateAdmin, authenticateSuperAdmin } = require('../../middleware/auth.middleware');
const { requirePermission } = require('../../middleware/permissions.middleware');

router.use(authenticateAdmin);

// List suppliers
router.get('/', requirePermission('suppliers', 'read'), supplierController.listSuppliers);

// Supplier status
router.get('/status', requirePermission('suppliers', 'read'), supplierController.getSuppliersStatus);

// Get supplier details
router.get('/:supplierId', requirePermission('suppliers', 'read'), supplierController.getSupplierDetails);

// Configure supplier (Super Admin only)
router.put('/:supplierId/config', authenticateSuperAdmin, supplierController.configureSupplier);

// Enable/disable supplier
router.post('/:supplierId/enable', requirePermission('suppliers', 'configure'), supplierController.enableSupplier);
router.post('/:supplierId/disable', requirePermission('suppliers', 'configure'), supplierController.disableSupplier);

// Supplier credentials (Super Admin only)
router.get('/:supplierId/credentials', authenticateSuperAdmin, supplierController.getCredentials);
router.put('/:supplierId/credentials', authenticateSuperAdmin, supplierController.updateCredentials);

// Supplier priority
router.put('/:supplierId/priority', requirePermission('suppliers', 'configure'), supplierController.updatePriority);

// Supplier routes/mapping
router.get('/:supplierId/routes', requirePermission('suppliers', 'read'), supplierController.getSupplierRoutes);
router.put('/:supplierId/routes', requirePermission('suppliers', 'configure'), supplierController.updateSupplierRoutes);

// Test supplier connection
router.post('/:supplierId/test', requirePermission('suppliers', 'configure'), supplierController.testConnection);

// Supplier logs
router.get('/:supplierId/logs', requirePermission('suppliers', 'read'), supplierController.getSupplierLogs);

module.exports = router;
