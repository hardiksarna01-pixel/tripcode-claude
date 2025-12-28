/**
 * Admin Authentication Routes
 */

const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/admin-auth.controller');
const { authenticateAdmin } = require('../middleware/auth.middleware');
const { validate, authSchemas } = require('../middleware/validation.middleware');

// Public admin routes
router.post('/login', validate(authSchemas.login), adminAuthController.login);
router.post('/forgot-password', validate(authSchemas.forgotPassword), adminAuthController.forgotPassword);
router.post('/reset-password', validate(authSchemas.resetPassword), adminAuthController.resetPassword);

// Protected admin routes
router.use(authenticateAdmin);
router.get('/me', adminAuthController.getProfile);
router.put('/profile', adminAuthController.updateProfile);
router.put('/change-password', validate(authSchemas.changePassword), adminAuthController.changePassword);
router.post('/logout', adminAuthController.logout);
router.post('/refresh-token', adminAuthController.refreshToken);

module.exports = router;
