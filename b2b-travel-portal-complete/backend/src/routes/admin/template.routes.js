/**
 * Template Management Routes
 * Email, SMS, WhatsApp templates
 */

const express = require('express');
const router = express.Router();
const templateController = require('../../controllers/admin/template.controller');
const { authenticateAdmin } = require('../../middleware/auth.middleware');
const { requirePermission, requireTenantAccess } = require('../../middleware/permissions.middleware');

router.use(authenticateAdmin);
router.use(requireTenantAccess);

// Email templates
router.get('/email', requirePermission('templates', 'read'), templateController.listEmailTemplates);
router.post('/email', requirePermission('templates', 'create'), templateController.createEmailTemplate);
router.get('/email/:templateId', requirePermission('templates', 'read'), templateController.getEmailTemplate);
router.put('/email/:templateId', requirePermission('templates', 'update'), templateController.updateEmailTemplate);
router.delete('/email/:templateId', requirePermission('templates', 'delete'), templateController.deleteEmailTemplate);
router.post('/email/:templateId/preview', requirePermission('templates', 'read'), templateController.previewEmailTemplate);
router.post('/email/:templateId/test', requirePermission('templates', 'update'), templateController.testEmailTemplate);

// SMS templates
router.get('/sms', requirePermission('templates', 'read'), templateController.listSmsTemplates);
router.post('/sms', requirePermission('templates', 'create'), templateController.createSmsTemplate);
router.get('/sms/:templateId', requirePermission('templates', 'read'), templateController.getSmsTemplate);
router.put('/sms/:templateId', requirePermission('templates', 'update'), templateController.updateSmsTemplate);
router.delete('/sms/:templateId', requirePermission('templates', 'delete'), templateController.deleteSmsTemplate);
router.post('/sms/:templateId/test', requirePermission('templates', 'update'), templateController.testSmsTemplate);

// WhatsApp templates
router.get('/whatsapp', requirePermission('templates', 'read'), templateController.listWhatsappTemplates);
router.post('/whatsapp', requirePermission('templates', 'create'), templateController.createWhatsappTemplate);
router.get('/whatsapp/:templateId', requirePermission('templates', 'read'), templateController.getWhatsappTemplate);
router.put('/whatsapp/:templateId', requirePermission('templates', 'update'), templateController.updateWhatsappTemplate);
router.delete('/whatsapp/:templateId', requirePermission('templates', 'delete'), templateController.deleteWhatsappTemplate);
router.post('/whatsapp/:templateId/submit', requirePermission('templates', 'update'), templateController.submitWhatsappTemplate);
router.get('/whatsapp/:templateId/status', requirePermission('templates', 'read'), templateController.getWhatsappTemplateStatus);

// PDF templates (Invoice, Voucher, Ticket)
router.get('/pdf', requirePermission('templates', 'read'), templateController.listPdfTemplates);
router.get('/pdf/:templateId', requirePermission('templates', 'read'), templateController.getPdfTemplate);
router.put('/pdf/:templateId', requirePermission('templates', 'update'), templateController.updatePdfTemplate);
router.post('/pdf/:templateId/preview', requirePermission('templates', 'read'), templateController.previewPdfTemplate);

// Template variables
router.get('/variables', templateController.getTemplateVariables);
router.get('/variables/:templateType', templateController.getTemplateVariablesByType);

// Default templates
router.post('/reset/:templateId', requirePermission('templates', 'update'), templateController.resetToDefault);

module.exports = router;
