const { Agent, User, Booking, Wallet } = require('../models');
const { Op } = require('sequelize');

class AgentController {
    // Get agent dashboard data
    async getDashboard(req, res) {
        try {
            const agentId = req.user.agentId;

            const [wallet, bookingsCount, todayBookings, recentBookings] = await Promise.all([
                Wallet.findOne({ where: { agentId } }),
                Booking.count({ where: { agentId } }),
                Booking.count({
                    where: {
                        agentId,
                        createdAt: { [Op.gte]: new Date().setHours(0, 0, 0, 0) }
                    }
                }),
                Booking.findAll({
                    where: { agentId },
                    order: [['createdAt', 'DESC']],
                    limit: 5
                })
            ]);

            res.json({
                success: true,
                data: {
                    wallet: {
                        balance: wallet?.balance || 0,
                        creditLimit: wallet?.creditLimit || 0,
                        creditUsed: wallet?.creditUsed || 0
                    },
                    stats: {
                        totalBookings: bookingsCount,
                        todayBookings
                    },
                    recentBookings
                }
            });
        } catch (error) {
            console.error('Dashboard error:', error);
            res.status(500).json({ success: false, message: 'Failed to load dashboard' });
        }
    }

    // Get agent profile
    async getProfile(req, res) {
        try {
            const agent = await Agent.findByPk(req.user.agentId, {
                include: [{ model: User, as: 'user' }]
            });

            if (!agent) {
                return res.status(404).json({ success: false, message: 'Agent not found' });
            }

            res.json({ success: true, data: agent });
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({ success: false, message: 'Failed to get profile' });
        }
    }

    // Update agent profile
    async updateProfile(req, res) {
        try {
            const { businessName, contactPerson, phone, address, gstNumber } = req.body;

            await Agent.update(
                { businessName, contactPerson, phone, address, gstNumber },
                { where: { id: req.user.agentId } }
            );

            res.json({ success: true, message: 'Profile updated successfully' });
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({ success: false, message: 'Failed to update profile' });
        }
    }

    // Get agent bookings
    async getBookings(req, res) {
        try {
            const { page = 1, limit = 10, status, product, startDate, endDate } = req.query;
            const offset = (page - 1) * limit;

            const where = { agentId: req.user.agentId };
            if (status) where.status = status;
            if (product) where.productType = product;
            if (startDate && endDate) {
                where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
            }

            const { count, rows } = await Booking.findAndCountAll({
                where,
                order: [['createdAt', 'DESC']],
                limit: parseInt(limit),
                offset
            });

            res.json({
                success: true,
                data: {
                    bookings: rows,
                    pagination: {
                        total: count,
                        page: parseInt(page),
                        totalPages: Math.ceil(count / limit)
                    }
                }
            });
        } catch (error) {
            console.error('Get bookings error:', error);
            res.status(500).json({ success: false, message: 'Failed to get bookings' });
        }
    }

    // Get wallet details
    async getWallet(req, res) {
        try {
            const wallet = await Wallet.findOne({
                where: { agentId: req.user.agentId }
            });

            res.json({ success: true, data: wallet });
        } catch (error) {
            console.error('Get wallet error:', error);
            res.status(500).json({ success: false, message: 'Failed to get wallet' });
        }
    }

    // Get commission report
    async getCommissions(req, res) {
        try {
            const { startDate, endDate } = req.query;

            const bookings = await Booking.findAll({
                where: {
                    agentId: req.user.agentId,
                    status: 'confirmed',
                    ...(startDate && endDate && {
                        createdAt: { [Op.between]: [new Date(startDate), new Date(endDate)] }
                    })
                },
                attributes: ['id', 'productType', 'amount', 'commission', 'createdAt']
            });

            const totalCommission = bookings.reduce((sum, b) => sum + (b.commission || 0), 0);

            res.json({
                success: true,
                data: {
                    bookings,
                    totalCommission
                }
            });
        } catch (error) {
            console.error('Get commissions error:', error);
            res.status(500).json({ success: false, message: 'Failed to get commissions' });
        }
    }
}

module.exports = new AgentController();
