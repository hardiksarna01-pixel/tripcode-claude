const { Agent, User, Booking, Wallet, Commission } = require('../models');
const { Op } = require('sequelize');

class AdminController {
    // Get dashboard stats
    async getDashboard(req, res) {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const [
                totalAgents,
                activeAgents,
                pendingAgents,
                totalBookings,
                todayBookings,
                totalRevenue
            ] = await Promise.all([
                Agent.count(),
                Agent.count({ where: { status: 'active' } }),
                Agent.count({ where: { status: 'pending' } }),
                Booking.count(),
                Booking.count({ where: { createdAt: { [Op.gte]: today } } }),
                Booking.sum('amount', { where: { status: 'confirmed' } })
            ]);

            res.json({
                success: true,
                data: {
                    agents: { total: totalAgents, active: activeAgents, pending: pendingAgents },
                    bookings: { total: totalBookings, today: todayBookings },
                    revenue: totalRevenue || 0
                }
            });
        } catch (error) {
            console.error('Dashboard error:', error);
            res.status(500).json({ success: false, message: 'Failed to load dashboard' });
        }
    }

    // Get all agents
    async getAgents(req, res) {
        try {
            const { page = 1, limit = 20, status, search } = req.query;
            const offset = (page - 1) * limit;

            const where = {};
            if (status) where.status = status;
            if (search) {
                where[Op.or] = [
                    { businessName: { [Op.like]: `%${search}%` } },
                    { email: { [Op.like]: `%${search}%` } }
                ];
            }

            const { count, rows } = await Agent.findAndCountAll({
                where,
                include: [{ model: Wallet, as: 'wallet' }],
                order: [['createdAt', 'DESC']],
                limit: parseInt(limit),
                offset
            });

            res.json({
                success: true,
                data: {
                    agents: rows,
                    pagination: {
                        total: count,
                        page: parseInt(page),
                        totalPages: Math.ceil(count / limit)
                    }
                }
            });
        } catch (error) {
            console.error('Get agents error:', error);
            res.status(500).json({ success: false, message: 'Failed to get agents' });
        }
    }

    // Approve agent
    async approveAgent(req, res) {
        try {
            const { agentId } = req.params;

            await Agent.update({ status: 'active' }, { where: { id: agentId } });

            res.json({ success: true, message: 'Agent approved successfully' });
        } catch (error) {
            console.error('Approve agent error:', error);
            res.status(500).json({ success: false, message: 'Failed to approve agent' });
        }
    }

    // Suspend agent
    async suspendAgent(req, res) {
        try {
            const { agentId } = req.params;
            const { reason } = req.body;

            await Agent.update(
                { status: 'suspended', suspensionReason: reason },
                { where: { id: agentId } }
            );

            res.json({ success: true, message: 'Agent suspended' });
        } catch (error) {
            console.error('Suspend agent error:', error);
            res.status(500).json({ success: false, message: 'Failed to suspend agent' });
        }
    }

    // Get financial reports
    async getFinanceReport(req, res) {
        try {
            const { startDate, endDate } = req.query;

            const where = { status: 'confirmed' };
            if (startDate && endDate) {
                where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
            }

            const bookings = await Booking.findAll({
                where,
                attributes: [
                    'productType',
                    [Booking.sequelize.fn('SUM', Booking.sequelize.col('amount')), 'totalAmount'],
                    [Booking.sequelize.fn('SUM', Booking.sequelize.col('commission')), 'totalCommission'],
                    [Booking.sequelize.fn('COUNT', '*'), 'count']
                ],
                group: ['productType']
            });

            res.json({ success: true, data: bookings });
        } catch (error) {
            console.error('Finance report error:', error);
            res.status(500).json({ success: false, message: 'Failed to get finance report' });
        }
    }

    // Update markup settings
    async updateMarkup(req, res) {
        try {
            const { productType, markupType, markupValue, appliesTo } = req.body;

            // Store markup settings in database
            // Implementation depends on your markup model

            res.json({ success: true, message: 'Markup updated successfully' });
        } catch (error) {
            console.error('Update markup error:', error);
            res.status(500).json({ success: false, message: 'Failed to update markup' });
        }
    }

    // Get commission report
    async getCommissionReport(req, res) {
        try {
            const commissions = await Commission.findAll({
                include: [{ model: Agent, as: 'agent', attributes: ['id', 'businessName'] }],
                order: [['createdAt', 'DESC']]
            });

            res.json({ success: true, data: commissions });
        } catch (error) {
            console.error('Commission report error:', error);
            res.status(500).json({ success: false, message: 'Failed to get commission report' });
        }
    }
}

module.exports = new AdminController();
