/**
 * Amendment Routes
 */

const express = require('express');
const router = express.Router();
const amendmentController = require('../controllers/amendment.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

// Request amendment
router.post('/', amendmentController.requestAmendment);

// Get all amendments
router.get('/', amendmentController.listAmendments);

// Get amendment status
router.get('/:amendmentId', amendmentController.getAmendmentStatus);

// Cancel amendment
router.delete('/:amendmentId', amendmentController.cancelAmendment);

module.exports = router;
