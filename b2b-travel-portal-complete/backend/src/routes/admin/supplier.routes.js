/**
 * Supplier/API Provider Management Routes
 */

const express = require('express');
const router = express.Router();
const supplierController = require('../../controllers/admin/supplier.controller');

// List suppliers
router.get('/', supplierController.list);
router.get('/status', supplierController.getStatus);
router.get('/:supplierId', supplierController.get);
router.put('/:supplierId/config', supplierController.configure);
router.post('/:supplierId/enable', supplierController.enable);
router.post('/:supplierId/disable', supplierController.disable);
router.post('/:supplierId/test', supplierController.test);

module.exports = router;
