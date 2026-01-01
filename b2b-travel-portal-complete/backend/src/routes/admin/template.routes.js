/**
 * Template Management Routes
 * Email, SMS, WhatsApp templates
 */

const express = require('express');
const router = express.Router();
const templateController = require('../../controllers/admin/template.controller');

// Template CRUD
router.get('/', templateController.list);
router.get('/:templateId', templateController.get);
router.put('/:templateId', templateController.update);
router.post('/:templateId/preview', templateController.preview);
router.post('/:templateId/test', templateController.test);

module.exports = router;
