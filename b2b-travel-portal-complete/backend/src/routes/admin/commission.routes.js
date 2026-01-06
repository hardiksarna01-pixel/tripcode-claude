/**
 * Commission Routes
 * Airline and class-level commission management
 */

const express = require('express');
const router = express.Router();
const commissionController = require('../../controllers/admin/commission.controller');

// Commission CRUD
router.get('/', commissionController.list);
router.post('/', commissionController.create);
router.get('/:id', commissionController.get);
router.put('/:id', commissionController.update);
router.delete('/:id', commissionController.delete);
router.get('/pending', commissionController.getPending);
router.post('/:id/approve', commissionController.approve);
router.post('/:id/payout', commissionController.payout);

module.exports = router;
