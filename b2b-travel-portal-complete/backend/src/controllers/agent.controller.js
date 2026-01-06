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

    // ==================== ADMIN METHODS ====================

    // List all agents (admin)
    async listAgents(req, res) {
        try {
            const { page = 1, limit = 10, status, search } = req.query;
            const offset = (page - 1) * limit;

            const where = {};
            if (status) where.status = status;
            if (search) {
                where[Op.or] = [
                    { businessName: { [Op.iLike]: `%${search}%` } },
                    { contactPerson: { [Op.iLike]: `%${search}%` } },
                    { email: { [Op.iLike]: `%${search}%` } }
                ];
            }

            const { count, rows } = await Agent.findAndCountAll({
                where,
                include: [{ model: User, as: 'user', attributes: ['email', 'status'] }],
                order: [['createdAt', 'DESC']],
                limit: parseInt(limit),
                offset
            });

            res.json({
                success: true,
                data: {
                    agents: rows,
                    pagination: { total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) }
                }
            });
        } catch (error) {
            console.error('List agents error:', error);
            res.status(500).json({ success: false, message: 'Failed to list agents' });
        }
    }

    // Create agent (admin)
    async createAgent(req, res) {
        try {
            const { email, password, businessName, contactPerson, phone, address, gstNumber, creditLimit } = req.body;

            const user = await User.create({ email, password, type: 'agent', status: 'active' });
            const agent = await Agent.create({
                userId: user.id,
                businessName,
                contactPerson,
                phone,
                address,
                gstNumber,
                status: 'approved'
            });

            await Wallet.create({ agentId: agent.id, balance: 0, creditLimit: creditLimit || 0 });

            res.status(201).json({ success: true, data: agent });
        } catch (error) {
            console.error('Create agent error:', error);
            res.status(500).json({ success: false, message: 'Failed to create agent' });
        }
    }

    // Get agent details (admin)
    async getAgentDetails(req, res) {
        try {
            const agent = await Agent.findByPk(req.params.agentId, {
                include: [
                    { model: User, as: 'user' },
                    { model: Wallet, as: 'wallet' }
                ]
            });

            if (!agent) {
                return res.status(404).json({ success: false, message: 'Agent not found' });
            }

            res.json({ success: true, data: agent });
        } catch (error) {
            console.error('Get agent details error:', error);
            res.status(500).json({ success: false, message: 'Failed to get agent details' });
        }
    }

    // Update agent (admin)
    async updateAgent(req, res) {
        try {
            const { businessName, contactPerson, phone, address, gstNumber, status } = req.body;

            await Agent.update(
                { businessName, contactPerson, phone, address, gstNumber, status },
                { where: { id: req.params.agentId } }
            );

            res.json({ success: true, message: 'Agent updated successfully' });
        } catch (error) {
            console.error('Update agent error:', error);
            res.status(500).json({ success: false, message: 'Failed to update agent' });
        }
    }

    // Approve agent (admin)
    async approveAgent(req, res) {
        try {
            await Agent.update({ status: 'approved' }, { where: { id: req.params.agentId } });
            res.json({ success: true, message: 'Agent approved successfully' });
        } catch (error) {
            console.error('Approve agent error:', error);
            res.status(500).json({ success: false, message: 'Failed to approve agent' });
        }
    }

    // Suspend agent (admin)
    async suspendAgent(req, res) {
        try {
            await Agent.update({ status: 'suspended' }, { where: { id: req.params.agentId } });
            res.json({ success: true, message: 'Agent suspended successfully' });
        } catch (error) {
            console.error('Suspend agent error:', error);
            res.status(500).json({ success: false, message: 'Failed to suspend agent' });
        }
    }

    // Activate agent (admin)
    async activateAgent(req, res) {
        try {
            await Agent.update({ status: 'active' }, { where: { id: req.params.agentId } });
            res.json({ success: true, message: 'Agent activated successfully' });
        } catch (error) {
            console.error('Activate agent error:', error);
            res.status(500).json({ success: false, message: 'Failed to activate agent' });
        }
    }

    // Get agent wallet (admin)
    async getAgentWallet(req, res) {
        try {
            const wallet = await Wallet.findOne({ where: { agentId: req.params.agentId } });
            res.json({ success: true, data: wallet });
        } catch (error) {
            console.error('Get agent wallet error:', error);
            res.status(500).json({ success: false, message: 'Failed to get agent wallet' });
        }
    }

    // Credit agent wallet (admin)
    async creditAgentWallet(req, res) {
        try {
            const { amount, reason } = req.body;
            const wallet = await Wallet.findOne({ where: { agentId: req.params.agentId } });

            await wallet.update({ balance: wallet.balance + parseFloat(amount) });
            res.json({ success: true, message: 'Wallet credited successfully' });
        } catch (error) {
            console.error('Credit wallet error:', error);
            res.status(500).json({ success: false, message: 'Failed to credit wallet' });
        }
    }

    // Debit agent wallet (admin)
    async debitAgentWallet(req, res) {
        try {
            const { amount, reason } = req.body;
            const wallet = await Wallet.findOne({ where: { agentId: req.params.agentId } });

            await wallet.update({ balance: wallet.balance - parseFloat(amount) });
            res.json({ success: true, message: 'Wallet debited successfully' });
        } catch (error) {
            console.error('Debit wallet error:', error);
            res.status(500).json({ success: false, message: 'Failed to debit wallet' });
        }
    }

    // Get agent bookings (admin)
    async getAgentBookings(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const { count, rows } = await Booking.findAndCountAll({
                where: { agentId: req.params.agentId },
                order: [['createdAt', 'DESC']],
                limit: parseInt(limit),
                offset
            });

            res.json({
                success: true,
                data: {
                    bookings: rows,
                    pagination: { total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) }
                }
            });
        } catch (error) {
            console.error('Get agent bookings error:', error);
            res.status(500).json({ success: false, message: 'Failed to get agent bookings' });
        }
    }

    // Get agent performance (admin)
    async getAgentPerformance(req, res) {
        try {
            const agentId = req.params.agentId;

            const [totalBookings, totalRevenue, monthlyBookings] = await Promise.all([
                Booking.count({ where: { agentId } }),
                Booking.sum('amount', { where: { agentId, status: 'confirmed' } }),
                Booking.count({
                    where: {
                        agentId,
                        createdAt: { [Op.gte]: new Date(new Date().setDate(1)) }
                    }
                })
            ]);

            res.json({
                success: true,
                data: {
                    totalBookings,
                    totalRevenue: totalRevenue || 0,
                    monthlyBookings
                }
            });
        } catch (error) {
            console.error('Get agent performance error:', error);
            res.status(500).json({ success: false, message: 'Failed to get agent performance' });
        }
    }
}

module.exports = new AgentController();
