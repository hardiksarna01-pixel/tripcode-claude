const express = require('express');
const router = express.Router();
const { catchAsync } = require('../utils/catchAsync');

/**
 * @route   GET /api/v1/agents/profile
 * @desc    Get agent profile
 * @access  Private
 */
router.get('/profile', catchAsync(async (req, res) => {
    res.json({
        success: true,
        data: {
            id: req.agent.id,
            email: req.agent.email,
            companyName: req.agent.companyName,
            mobile: req.agent.mobile,
            createdAt: req.agent.createdAt
        }
    });
}));

/**
 * @route   PUT /api/v1/agents/profile
 * @desc    Update agent profile
 * @access  Private
 */
router.put('/profile', catchAsync(async (req, res) => {
    const { companyName, mobile } = req.body;
    
    // Update in mock store
    const { mockAgents } = require('./auth.routes');
    const agent = mockAgents.get(req.agent.email);
    
    if (companyName) agent.companyName = companyName;
    if (mobile) agent.mobile = mobile;
    
    mockAgents.set(req.agent.email, agent);
    
    res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
            id: agent.id,
            email: agent.email,
            companyName: agent.companyName,
            mobile: agent.mobile
        }
    });
}));

/**
 * @route   GET /api/v1/agents/dashboard
 * @desc    Get agent dashboard stats
 * @access  Private
 */
router.get('/dashboard', catchAsync(async (req, res) => {
    // In production, this would aggregate from database
    res.json({
        success: true,
        data: {
            todayBookings: 0,
            monthBookings: 0,
            totalRevenue: 0,
            pendingBookings: 0,
            recentBookings: []
        }
    });
}));

module.exports = router;
