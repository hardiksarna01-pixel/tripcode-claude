/**
 * Authentication Routes (Agent/Customer)
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate, authSchemas } = require('../middleware/validation.middleware');

// Public routes
router.post('/register', validate(authSchemas.register), authController.register);
router.post('/login', validate(authSchemas.login), authController.login);
router.post('/forgot-password', validate(authSchemas.forgotPassword), authController.forgotPassword);
router.post('/reset-password', validate(authSchemas.resetPassword), authController.resetPassword);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);
router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.use(authenticate);
router.get('/me', authController.getProfile);
router.put('/profile', authController.updateProfile);
router.put('/change-password', validate(authSchemas.changePassword), authController.changePassword);
router.post('/logout', authController.logout);

module.exports = router;
