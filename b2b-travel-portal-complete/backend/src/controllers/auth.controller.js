/**
 * Authentication Controller
 * Handles agent and customer authentication
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const config = require('../config');
const { catchAsync } = require('../middleware/error.middleware');
const { AuthError, ValidationError, NotFoundError, ConflictError } = require('../middleware/error.middleware');

// Mock stores (replace with database in production)
const users = new Map();
const otpStore = new Map();
const refreshTokens = new Map();

// Pre-seed test users
const seedTestUsers = () => {
    // Test Agent
    users.set(1, {
        id: 1,
        email: 'agent@flyshop.com',
        password: bcrypt.hashSync('agent123', 10),
        firstName: 'Demo',
        lastName: 'Agent',
        phone: '9876543210',
        companyName: 'Demo Travel Agency',
        panNumber: 'ABCDE1234F',
        gstNumber: '22ABCDE1234F1Z5',
        address: 'Mumbai, India',
        type: 'agent',
        status: 'active',
        tenantId: 1,
        walletBalance: 50000,
        creditLimit: 100000,
        createdAt: new Date().toISOString()
    });

    // Test Customer
    users.set(2, {
        id: 2,
        email: 'customer@test.com',
        password: bcrypt.hashSync('customer123', 10),
        firstName: 'Test',
        lastName: 'Customer',
        phone: '9876543211',
        companyName: null,
        type: 'customer',
        status: 'active',
        tenantId: 1,
        walletBalance: 5000,
        creditLimit: 0,
        createdAt: new Date().toISOString()
    });
};

// Initialize test users
seedTestUsers();

/**
 * Generate JWT tokens
 */
const generateTokens = (user) => {
    const accessToken = jwt.sign(
        {
            id: user.id,
            email: user.email,
            type: user.type,
            tenantId: user.tenantId
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
    );

    const refreshToken = jwt.sign(
        { id: user.id },
        config.jwt.secret,
        { expiresIn: config.jwt.refreshExpiresIn }
    );

    refreshTokens.set(refreshToken, user.id);

    return { accessToken, refreshToken };
};

/**
 * Register new agent/customer
 */
exports.register = catchAsync(async (req, res) => {
    const { email, password, firstName, lastName, phone, companyName, panNumber, gstNumber, address } = req.body;

    // Check if user exists
    const existingUser = Array.from(users.values()).find(u => u.email === email);
    if (existingUser) {
        throw new ConflictError('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = {
        id: Date.now(),
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        companyName,
        panNumber,
        gstNumber,
        address,
        type: companyName ? 'agent' : 'customer',
        status: 'pending', // pending, active, suspended
        tenantId: 1, // Default tenant
        walletBalance: 0,
        creditLimit: 0,
        createdAt: new Date().toISOString()
    };

    users.set(user.id, user);

    // Generate OTP for verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });

    // TODO: Send OTP via email/SMS

    res.status(201).json({
        success: true,
        message: 'Registration successful. Please verify your email.',
        data: {
            userId: user.id,
            email: user.email,
            requiresVerification: true
        }
    });
});

/**
 * Login
 */
exports.login = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    // Find user
    const user = Array.from(users.values()).find(u => u.email === email);
    if (!user) {
        throw new AuthError('Invalid email or password');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AuthError('Invalid email or password');
    }

    // Check status
    if (user.status === 'pending') {
        throw new AuthError('Account pending verification');
    }

    if (user.status === 'suspended') {
        throw new AuthError('Account suspended. Please contact support.');
    }

    // Generate tokens
    const tokens = generateTokens(user);

    res.json({
        success: true,
        data: {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                type: user.type,
                companyName: user.companyName,
                walletBalance: user.walletBalance,
                creditLimit: user.creditLimit
            },
            ...tokens
        }
    });
});

/**
 * Verify OTP
 */
exports.verifyOtp = catchAsync(async (req, res) => {
    const { email, otp } = req.body;

    const stored = otpStore.get(email);
    if (!stored || stored.otp !== otp || stored.expiresAt < Date.now()) {
        throw new ValidationError('Invalid or expired OTP');
    }

    // Find and activate user
    const user = Array.from(users.values()).find(u => u.email === email);
    if (user) {
        user.status = 'active';
        users.set(user.id, user);
    }

    otpStore.delete(email);

    res.json({
        success: true,
        message: 'Email verified successfully'
    });
});

/**
 * Resend OTP
 */
exports.resendOtp = catchAsync(async (req, res) => {
    const { email } = req.body;

    const user = Array.from(users.values()).find(u => u.email === email);
    if (!user) {
        throw new NotFoundError('User');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });

    // TODO: Send OTP via email/SMS

    res.json({
        success: true,
        message: 'OTP sent successfully'
    });
});

/**
 * Forgot Password
 */
exports.forgotPassword = catchAsync(async (req, res) => {
    const { email } = req.body;

    const user = Array.from(users.values()).find(u => u.email === email);
    if (!user) {
        // Don't reveal if user exists
        return res.json({
            success: true,
            message: 'If your email exists, you will receive a password reset link'
        });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
    users.set(user.id, user);

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

    const user = Array.from(users.values()).find(
        u => u.resetToken === token && u.resetTokenExpiry > Date.now()
    );

    if (!user) {
        throw new ValidationError('Invalid or expired reset token');
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    users.set(user.id, user);

    res.json({
        success: true,
        message: 'Password reset successful'
    });
});

/**
 * Get Profile
 */
exports.getProfile = catchAsync(async (req, res) => {
    const user = users.get(req.userId);
    if (!user) {
        throw new NotFoundError('User');
    }

    res.json({
        success: true,
        data: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            type: user.type,
            companyName: user.companyName,
            panNumber: user.panNumber,
            gstNumber: user.gstNumber,
            address: user.address,
            walletBalance: user.walletBalance,
            creditLimit: user.creditLimit,
            status: user.status,
            createdAt: user.createdAt
        }
    });
});

/**
 * Update Profile
 */
exports.updateProfile = catchAsync(async (req, res) => {
    const user = users.get(req.userId);
    if (!user) {
        throw new NotFoundError('User');
    }

    const allowedUpdates = ['firstName', 'lastName', 'phone', 'address'];
    allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
            user[field] = req.body[field];
        }
    });

    user.updatedAt = new Date().toISOString();
    users.set(user.id, user);

    res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            address: user.address
        }
    });
});

/**
 * Change Password
 */
exports.changePassword = catchAsync(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = users.get(req.userId);
    if (!user) {
        throw new NotFoundError('User');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        throw new AuthError('Current password is incorrect');
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.updatedAt = new Date().toISOString();
    users.set(user.id, user);

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

    const userId = refreshTokens.get(refreshToken);
    const user = users.get(userId);

    if (!user) {
        throw new AuthError('User not found');
    }

    // Delete old refresh token
    refreshTokens.delete(refreshToken);

    // Generate new tokens
    const tokens = generateTokens(user);

    res.json({
        success: true,
        data: tokens
    });
});
