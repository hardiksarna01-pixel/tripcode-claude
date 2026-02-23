/**
 * Admin Authentication Controller
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const config = require('../config');
const { catchAsync } = require('../middleware/error.middleware');
const { AuthError, ValidationError, NotFoundError } = require('../middleware/error.middleware');

// Mock stores (replace with database in production)
const adminUsers = new Map();
const refreshTokens = new Map();

// Initialize with default super admin
adminUsers.set(1, {
    id: 1,
    email: 'admin@flyshop.com',
    password: bcrypt.hashSync('admin123', 10),
    firstName: 'Super',
    lastName: 'Admin',
    role: 'super_admin',
    tenantId: null, // Super admin has access to all tenants
    status: 'active',
    createdAt: new Date().toISOString()
});

// Regular admin
adminUsers.set(2, {
    id: 2,
    email: 'manager@flyshop.com',
    password: bcrypt.hashSync('manager123', 10),
    firstName: 'Company',
    lastName: 'Manager',
    role: 'admin',
    tenantId: 1,
    status: 'active',
    createdAt: new Date().toISOString()
});

/**
 * Generate JWT tokens for admin
 */
const generateTokens = (admin) => {
    const accessToken = jwt.sign(
        {
            id: admin.id,
            email: admin.email,
            role: admin.role,
            tenantId: admin.tenantId
        },
        config.jwt.adminSecret,
        { expiresIn: config.jwt.expiresIn }
    );

    const refreshToken = jwt.sign(
        { id: admin.id },
        config.jwt.adminSecret,
        { expiresIn: config.jwt.refreshExpiresIn }
    );

    refreshTokens.set(refreshToken, admin.id);

    return { accessToken, refreshToken };
};

/**
 * Admin Login
 */
exports.login = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    // Find admin
    const admin = Array.from(adminUsers.values()).find(a => a.email === email);
    if (!admin) {
        throw new AuthError('Invalid email or password');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        throw new AuthError('Invalid email or password');
    }

    // Check status
    if (admin.status !== 'active') {
        throw new AuthError('Account is not active');
    }

    // Generate tokens
    const tokens = generateTokens(admin);

    // Log login activity
    admin.lastLogin = new Date().toISOString();
    adminUsers.set(admin.id, admin);

    res.json({
        success: true,
        data: {
            user: {
                id: admin.id,
                email: admin.email,
                firstName: admin.firstName,
                lastName: admin.lastName,
                role: admin.role,
                tenantId: admin.tenantId
            },
            ...tokens
        }
    });
});

/**
 * Forgot Password
 */
exports.forgotPassword = catchAsync(async (req, res) => {
    const { email } = req.body;

    const admin = Array.from(adminUsers.values()).find(a => a.email === email);
    if (!admin) {
        return res.json({
            success: true,
            message: 'If your email exists, you will receive a password reset link'
        });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    admin.resetToken = resetToken;
    admin.resetTokenExpiry = Date.now() + 60 * 60 * 1000;
    adminUsers.set(admin.id, admin);

    // TODO: Send reset email

    res.json({
        success: true,
        message: 'If your email exists, you will receive a password reset link'
    });
});

/**
 * Reset Password
 */
exports.resetPassword = catchAsync(async (req, res) => {
    const { token, password } = req.body;

    const admin = Array.from(adminUsers.values()).find(
        a => a.resetToken === token && a.resetTokenExpiry > Date.now()
    );

    if (!admin) {
        throw new ValidationError('Invalid or expired reset token');
    }

    admin.password = await bcrypt.hash(password, 12);
    admin.resetToken = null;
    admin.resetTokenExpiry = null;
    adminUsers.set(admin.id, admin);

    res.json({
        success: true,
        message: 'Password reset successful'
    });
});

/**
 * Get Admin Profile
 */
exports.getProfile = catchAsync(async (req, res) => {
    const admin = adminUsers.get(req.adminId);
    if (!admin) {
        throw new NotFoundError('Admin');
    }

    res.json({
        success: true,
        data: {
            id: admin.id,
            email: admin.email,
            firstName: admin.firstName,
            lastName: admin.lastName,
            role: admin.role,
            tenantId: admin.tenantId,
            lastLogin: admin.lastLogin,
            createdAt: admin.createdAt
        }
    });
});

/**
 * Update Admin Profile
 */
exports.updateProfile = catchAsync(async (req, res) => {
    const admin = adminUsers.get(req.adminId);
    if (!admin) {
        throw new NotFoundError('Admin');
    }

    const allowedUpdates = ['firstName', 'lastName'];
    allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
            admin[field] = req.body[field];
        }
    });

    admin.updatedAt = new Date().toISOString();
    adminUsers.set(admin.id, admin);

    res.json({
        success: true,
        message: 'Profile updated successfully'
    });
});

/**
 * Change Password
 */
exports.changePassword = catchAsync(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const admin = adminUsers.get(req.adminId);
    if (!admin) {
        throw new NotFoundError('Admin');
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
        throw new AuthError('Current password is incorrect');
    }

    admin.password = await bcrypt.hash(newPassword, 12);
    admin.updatedAt = new Date().toISOString();
    adminUsers.set(admin.id, admin);

    res.json({
        success: true,
        message: 'Password changed successfully'
    });
});

/**
 * Logout
 */
exports.logout = catchAsync(async (req, res) => {
    const { refreshToken } = req.body;
    if (refreshToken) {
        refreshTokens.delete(refreshToken);
    }

    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

/**
 * Refresh Token
 */
exports.refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken || !refreshTokens.has(refreshToken)) {
        throw new AuthError('Invalid refresh token');
    }

    const adminId = refreshTokens.get(refreshToken);
    const admin = adminUsers.get(adminId);

    if (!admin) {
        throw new AuthError('Admin not found');
    }

    refreshTokens.delete(refreshToken);
    const tokens = generateTokens(admin);

    res.json({
        success: true,
        data: tokens
    });
});
