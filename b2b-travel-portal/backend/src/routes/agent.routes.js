const express = require('express');
const router = express.Router();
const { catchAsync } = require('../utils/catchAsync');
const db = require('../config/database');

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
            contactPerson: req.agent.contactPerson,
            mobile: req.agent.mobile,
            walletBalance: req.agent.walletBalance,
            creditLimit: req.agent.creditLimit,
            status: req.agent.status,
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
    const { companyName, contactPerson, mobile, address, city, state, pincode } = req.body;

    // Update in database
    const agents = db.getTable('agents');
    const agent = agents.get(req.agent.email);

    if (!agent) {
        return res.status(404).json({
            success: false,
            error: 'Agent not found'
        });
    }

    // Update fields
    if (companyName) agent.companyName = companyName;
    if (contactPerson) agent.contactPerson = contactPerson;
    if (mobile) agent.mobile = mobile;
    if (address) agent.address = address;
    if (city) agent.city = city;
    if (state) agent.state = state;
    if (pincode) agent.pincode = pincode;
    agent.updatedAt = new Date();

    agents.set(req.agent.email, agent);

    res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
            id: agent.id,
            email: agent.email,
            companyName: agent.companyName,
            contactPerson: agent.contactPerson,
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
    // Get bookings for this agent
    const bookings = db.getTable('bookings');
    const agentBookings = Array.from(bookings.values())
        .filter(b => b.agentId === req.agent.id);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayBookings = agentBookings.filter(b => {
        const bookingDate = new Date(b.createdAt);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate.getTime() === today.getTime();
    });

    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthBookings = agentBookings.filter(b => new Date(b.createdAt) >= thisMonth);

    res.json({
        success: true,
        data: {
            walletBalance: req.agent.walletBalance || 0,
            creditLimit: req.agent.creditLimit || 0,
            todayBookings: todayBookings.length,
            monthBookings: monthBookings.length,
            totalBookings: agentBookings.length,
            totalRevenue: agentBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
            pendingBookings: agentBookings.filter(b => b.status === 'PENDING').length,
            recentBookings: agentBookings.slice(-5).reverse().map(b => ({
                id: b.id,
                pnr: b.pnr,
                passengerName: b.passengers?.[0]?.name || 'N/A',
                route: b.route || 'N/A',
                travelDate: b.travelDate,
                amount: b.totalAmount,
                status: b.status
            }))
        }
    });
}));

/**
 * @route   GET /api/v1/agents/stats
 * @desc    Get agent statistics
 * @access  Private
 */
router.get('/stats', catchAsync(async (req, res) => {
    const bookings = db.getTable('bookings');
    const transactions = db.getTable('transactions');

    const agentBookings = Array.from(bookings.values())
        .filter(b => b.agentId === req.agent.id);

    const agentTransactions = Array.from(transactions.values())
        .filter(t => t.agentId === req.agent.id);

    res.json({
        success: true,
        data: {
            totalBookings: agentBookings.length,
            confirmedBookings: agentBookings.filter(b => b.status === 'CONFIRMED').length,
            cancelledBookings: agentBookings.filter(b => b.status === 'CANCELLED').length,
            totalSpent: agentTransactions
                .filter(t => t.type === 'DEBIT')
                .reduce((sum, t) => sum + t.amount, 0),
            totalCommission: agentTransactions
                .filter(t => t.type === 'COMMISSION')
                .reduce((sum, t) => sum + t.amount, 0),
        }
    });
}));

/**
 * @route   POST /api/v1/agents/change-password
 * @desc    Change agent password
 * @access  Private
 */
router.post('/change-password', catchAsync(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const bcrypt = require('bcryptjs');

    if (!currentPassword || !newPassword) {
        return res.status(400).json({
            success: false,
            error: 'Current password and new password are required'
        });
    }

    const agents = db.getTable('agents');
    const agent = agents.get(req.agent.email);

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, agent.password);
    if (!isMatch) {
        return res.status(401).json({
            success: false,
            error: 'Current password is incorrect'
        });
    }

    // Update password
    agent.password = await bcrypt.hash(newPassword, 10);
    agent.updatedAt = new Date();
    agents.set(req.agent.email, agent);

    res.json({
        success: true,
        message: 'Password changed successfully'
    });
}));

module.exports = router;
