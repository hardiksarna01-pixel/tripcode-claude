/**
 * Global Markup Rules Routes
 */

const express = require('express');
const router = express.Router();
const markupController = require('../../controllers/admin/markup.controller');

// List markup rules
router.get('/', markupController.list);
router.post('/', markupController.create);
router.get('/:markupId', markupController.get);
router.put('/:markupId', markupController.update);
router.delete('/:markupId', markupController.delete);
router.post('/calculate', markupController.calculate);

module.exports = router;
