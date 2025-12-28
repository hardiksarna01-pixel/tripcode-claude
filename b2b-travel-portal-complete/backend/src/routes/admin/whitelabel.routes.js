/**
 * Whitelabel Settings Routes
 */

const express = require('express');
const router = express.Router();
const whitelabelController = require('../../controllers/admin/whitelabel.controller');
const { authenticateAdmin } = require('../../middleware/auth.middleware');
const { requirePermission, requireTenantAccess } = require('../../middleware/permissions.middleware');
const { validate, adminSchemas } = require('../../middleware/validation.middleware');

router.use(authenticateAdmin);
router.use(requireTenantAccess);

// Get whitelabel settings
router.get('/', requirePermission('whitelabel', 'read'), whitelabelController.getWhitelabelSettings);

// Update whitelabel settings
router.put('/', requirePermission('whitelabel', 'update'), validate(adminSchemas.whitelabelSettings), whitelabelController.updateWhitelabelSettings);

// Branding
router.get('/branding', requirePermission('whitelabel', 'read'), whitelabelController.getBranding);
router.put('/branding', requirePermission('whitelabel', 'update'), whitelabelController.updateBranding);

// Logo & Favicon
router.post('/logo', requirePermission('whitelabel', 'update'), whitelabelController.uploadLogo);
router.post('/favicon', requirePermission('whitelabel', 'update'), whitelabelController.uploadFavicon);

// Theme
router.get('/theme', requirePermission('whitelabel', 'read'), whitelabelController.getTheme);
router.put('/theme', requirePermission('whitelabel', 'update'), whitelabelController.updateTheme);
router.get('/theme/presets', whitelabelController.getThemePresets);

// Custom domain
router.get('/domain', requirePermission('whitelabel', 'read'), whitelabelController.getDomainSettings);
router.put('/domain', requirePermission('whitelabel', 'update'), whitelabelController.updateDomainSettings);
router.post('/domain/verify', requirePermission('whitelabel', 'update'), whitelabelController.verifyDomain);
router.post('/domain/ssl', requirePermission('whitelabel', 'update'), whitelabelController.requestSSL);

// SEO settings
router.get('/seo', requirePermission('whitelabel', 'read'), whitelabelController.getSeoSettings);
router.put('/seo', requirePermission('whitelabel', 'update'), whitelabelController.updateSeoSettings);

// Social media
router.get('/social', requirePermission('whitelabel', 'read'), whitelabelController.getSocialSettings);
router.put('/social', requirePermission('whitelabel', 'update'), whitelabelController.updateSocialSettings);

// Contact info
router.get('/contact', requirePermission('whitelabel', 'read'), whitelabelController.getContactInfo);
router.put('/contact', requirePermission('whitelabel', 'update'), whitelabelController.updateContactInfo);

// Footer
router.get('/footer', requirePermission('whitelabel', 'read'), whitelabelController.getFooterSettings);
router.put('/footer', requirePermission('whitelabel', 'update'), whitelabelController.updateFooterSettings);

// Custom pages
router.get('/pages', requirePermission('whitelabel', 'read'), whitelabelController.getCustomPages);
router.post('/pages', requirePermission('whitelabel', 'update'), whitelabelController.createCustomPage);
router.put('/pages/:pageId', requirePermission('whitelabel', 'update'), whitelabelController.updateCustomPage);
router.delete('/pages/:pageId', requirePermission('whitelabel', 'update'), whitelabelController.deleteCustomPage);

// B2B/B2C/Whitelabel mode
router.get('/mode', requirePermission('whitelabel', 'read'), whitelabelController.getPortalMode);
router.put('/mode', requirePermission('whitelabel', 'update'), whitelabelController.updatePortalMode);

module.exports = router;
