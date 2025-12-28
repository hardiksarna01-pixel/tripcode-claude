const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const CryptoJS = require('crypto-js');
const { catchAsync } = require('../utils/catchAsync');
const db = require('../config/database');
const { adminLogin } = require('../middleware/admin-auth.middleware');

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new agent
 * @access  Public
 */
router.post('/register', catchAsync(async (req, res) => {
    const {
        email,
        password,
        companyName,
        mobile,
        apiUserId,  // Flight API credentials
        apiPassword
    } = req.body;

    // Validate
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: 'Please provide email and password'
        });
    }

    // Check if already exists
    const agents = db.getTable('agents');
    if (agents.has(email)) {
        return res.status(400).json({
            success: false,
            error: 'Agent already registered'
        });
    }

    // Hash password for our system
    const hashedPassword = await bcrypt.hash(password, 10);

    // Hash API password (SHA1 for flight API) if provided
    const apiPasswordHash = apiPassword
        ? CryptoJS.SHA1(apiPassword).toString().toUpperCase()
        : null;

    const agent = {
        id: Date.now().toString(),
        email,
        password: hashedPassword,
        companyName: companyName || 'New Agency',
        mobile: mobile || '',
        apiUserId: apiUserId || null,
        apiPasswordHash,
        role: 'AGENT',
        status: 'APPROVED',
        walletBalance: 10000, // Demo starting balance
        creditLimit: 50000,
        isActive: true,
        createdAt: new Date()
    };

    agents.set(email, agent);

    // Generate JWT
    const token = jwt.sign(
        { id: agent.id, email: agent.email, type: 'agent' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
    );

    res.status(201).json({
        success: true,
        message: 'Agent registered successfully',
        data: {
            token,
            agent: {
                id: agent.id,
                email: agent.email,
                companyName: agent.companyName,
                role: agent.role
            }
        }
    });
}));

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login agent or admin
 * @access  Public
 */
router.post('/login', catchAsync(async (req, res) => {
    const { email, password, loginType } = req.body;

    // Validate
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: 'Please provide email and password'
        });
    }

    // Check if admin login
    if (loginType === 'admin') {
        try {
            const result = await adminLogin(email, password);
            return res.json({
                success: true,
                data: {
                    token: result.token,
                    user: result.admin,
                    userType: 'admin'
                }
            });
        } catch (error) {
            return res.status(401).json({
                success: false,
                error: error.message || 'Invalid credentials'
            });
        }
    }

    // Default: Agent login
    const agents = db.getTable('agents');
    const agent = agents.get(email);

    if (!agent) {
        // Also check admins for backward compatibility
        const admins = db.getTable('admins');
        const admin = admins.get(email);

        if (admin) {
            try {
                const result = await adminLogin(email, password);
                return res.json({
                    success: true,
                    data: {
                        token: result.token,
                        user: result.admin,
                        userType: 'admin'
                    }
                });
            } catch (error) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid credentials'
                });
            }
        }

        return res.status(401).json({
            success: false,
            error: 'Invalid credentials'
        });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, agent.password);
    if (!isMatch) {
        return res.status(401).json({
            success: false,
            error: 'Invalid credentials'
        });
    }

    if (!agent.isActive) {
        return res.status(401).json({
            success: false,
            error: 'Account is inactive'
        });
    }

    // Generate JWT
    const token = jwt.sign(
        { id: agent.id, email: agent.email, type: 'agent' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
    );

    res.json({
        success: true,
        data: {
            token,
            user: {
                id: agent.id,
                email: agent.email,
                companyName: agent.companyName,
                role: agent.role,
                walletBalance: agent.walletBalance
            },
            userType: 'agent'
        }
    });
}));

/**
 * @route   POST /api/v1/auth/admin/login
 * @desc    Admin login (explicit route)
 * @access  Public
 */
router.post('/admin/login', catchAsync(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: 'Please provide email and password'
        });
    }

    try {
        const result = await adminLogin(email, password);
        res.json({
            success: true,
            data: {
                token: result.token,
                user: result.admin,
                userType: 'admin'
            }
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            error: error.message || 'Invalid credentials'
        });
    }
}));

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', (req, res, next) => {
    const { authMiddleware } = require('../middleware/auth.middleware');
    authMiddleware(req, res, next);
}, catchAsync(async (req, res) => {
    res.json({
        success: true,
        data: {
            id: req.agent.id,
            email: req.agent.email,
            companyName: req.agent.companyName,
            role: req.agent.role,
            walletBalance: req.agent.walletBalance
        }
    });
}));

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout (client-side token removal)
 * @access  Public
 */
router.post('/logout', (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

module.exports = router;
