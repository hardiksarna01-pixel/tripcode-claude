/**
 * Markup Routes
 */

const express = require('express');
const router = express.Router();
const markupController = require('../controllers/markup.controller');

// Get markup configuration options
router.get('/config', markupController.getMarkupConfig);

// CRUD operations
router.get('/', markupController.getMarkups);
router.post('/', markupController.createMarkup);
router.put('/:id', markupController.updateMarkup);
router.delete('/:id', markupController.deleteMarkup);
router.post('/:id/toggle', markupController.toggleMarkup);

module.exports = router;
