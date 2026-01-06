/**
 * Commission Scheme Routes
 */

const express = require('express');
const router = express.Router();
const schemeController = require('../../controllers/admin/scheme.controller');

// List schemes
router.get('/', schemeController.list);
router.post('/', schemeController.create);
router.get('/:schemeId', schemeController.get);
router.put('/:schemeId', schemeController.update);
router.delete('/:schemeId', schemeController.delete);
router.post('/:schemeId/clone', schemeController.clone);

module.exports = router;
