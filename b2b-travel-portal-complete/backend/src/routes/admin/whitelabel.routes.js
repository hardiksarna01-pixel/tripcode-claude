/**
 * Whitelabel Settings Routes
 */

const express = require('express');
const router = express.Router();
const whitelabelController = require('../../controllers/admin/whitelabel.controller');

// Get/update whitelabel settings
router.get('/', whitelabelController.getConfig);
router.put('/', whitelabelController.updateConfig);
router.post('/logo', whitelabelController.uploadLogo);
router.get('/themes', whitelabelController.getThemes);
router.post('/themes/:themeId', whitelabelController.applyTheme);

module.exports = router;
