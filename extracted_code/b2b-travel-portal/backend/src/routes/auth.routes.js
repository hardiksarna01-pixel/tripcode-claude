const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const CryptoJS = require('crypto-js');
const { catchAsync } = require('../utils/catchAsync');

// In production, this would come from database
const mockAgents = new Map();

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
    if (!email || !password || !apiUserId || !apiPassword) {
        return res.status(400).json({
            success: false,
            error: 'Please provide all required fields'
        });
    }

    // Check if already exists
    if (mockAgents.has(email)) {
        return res.status(400).json({
            success: false,
            error: 'Agent already registered'
        });
    }

    // Hash password for our system
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Hash API password (SHA1 for flight API)
    const apiPasswordHash = CryptoJS.SHA1(apiPassword).toString().toUpperCase();

    const agent = {
        id: Date.now().toString(),
        email,
        password: hashedPassword,
        companyName,
        mobile,
        apiUserId,
        apiPasswordHash,
        createdAt: new Date()
    };

    mockAgents.set(email, agent);

    // Generate JWT
    const token = jwt.sign(
        { id: agent.id, email: agent.email },
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
                companyName: agent.companyName
            }
        }
    });
}));

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login agent
 * @access  Public
 */
router.post('/login', catchAsync(async (req, res) => {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: 'Please provide email and password'
        });
    }

    // Find agent
    const agent = mockAgents.get(email);
    if (!agent) {
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

    // Generate JWT
    const token = jwt.sign(
        { id: agent.id, email: agent.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
    );

    res.json({
        success: true,
        data: {
            token,
            agent: {
                id: agent.id,
                email: agent.email,
                companyName: agent.companyName
            }
        }
    });
}));

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current agent
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
            companyName: req.agent.companyName
        }
    });
}));

// Export mock agents for middleware
module.exports = router;
module.exports.mockAgents = mockAgents;
