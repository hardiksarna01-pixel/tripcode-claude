/**
 * Agent Portal Controller
 * Self-service operations for agents
 */

const { Agent, User, Booking, Wallet, WalletTransaction, Notification, SupportTicket } = require('../models');
const { Op } = require('sequelize');

class AgentPortalController {
    // Get dashboard data
    async getDashboard(req, res) {
        try {
            const agentId = req.user.agentId;

            const [wallet, stats, recentBookings] = await Promise.all([
                Wallet.findOne({ where: { agentId } }),
                this._getAgentStats(agentId),
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
                    stats,
                    recentBookings
                }
            });
        } catch (error) {
            console.error('Dashboard error:', error);
            res.status(500).json({ success: false, message: 'Failed to load dashboard' });
        }
    }

    async _getAgentStats(agentId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

        const [totalBookings, todayBookings, monthlyBookings, pendingBookings] = await Promise.all([
            Booking.count({ where: { agentId } }),
            Booking.count({ where: { agentId, createdAt: { [Op.gte]: today } } }),
            Booking.count({ where: { agentId, createdAt: { [Op.gte]: monthStart } } }),
            Booking.count({ where: { agentId, status: 'pending' } })
        ]);

        return { totalBookings, todayBookings, monthlyBookings, pendingBookings };
    }

    // Get profile
    async getProfile(req, res) {
        try {
            const agent = await Agent.findByPk(req.user.agentId, {
                include: [{ model: User, as: 'user', attributes: ['email', 'status', 'createdAt'] }]
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

    // Update profile
    async updateProfile(req, res) {
        try {
            const { businessName, contactPerson, phone, address, gstNumber, panNumber, logo } = req.body;

            await Agent.update(
                { businessName, contactPerson, phone, address, gstNumber, panNumber, logo },
                { where: { id: req.user.agentId } }
            );

            res.json({ success: true, message: 'Profile updated successfully' });
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({ success: false, message: 'Failed to update profile' });
        }
    }

    // Submit KYC documents
    async submitKYC(req, res) {
        try {
            const { documents } = req.body;

            await Agent.update(
                { kycDocuments: documents, kycStatus: 'pending' },
                { where: { id: req.user.agentId } }
            );

            res.json({ success: true, message: 'KYC documents submitted successfully' });
        } catch (error) {
            console.error('Submit KYC error:', error);
            res.status(500).json({ success: false, message: 'Failed to submit KYC' });
        }
    }

    // Get KYC status
    async getKYCStatus(req, res) {
        try {
            const agent = await Agent.findByPk(req.user.agentId, {
                attributes: ['kycStatus', 'kycDocuments', 'kycRemarks']
            });

            res.json({ success: true, data: agent });
        } catch (error) {
            console.error('Get KYC status error:', error);
            res.status(500).json({ success: false, message: 'Failed to get KYC status' });
        }
    }

    // Get sub-agents
    async getSubAgents(req, res) {
        try {
            const subAgents = await Agent.findAll({
                where: { parentAgentId: req.user.agentId },
                include: [{ model: User, as: 'user', attributes: ['email', 'status'] }]
            });

            res.json({ success: true, data: subAgents });
        } catch (error) {
            console.error('Get sub-agents error:', error);
            res.status(500).json({ success: false, message: 'Failed to get sub-agents' });
        }
    }

    // Create sub-agent
    async createSubAgent(req, res) {
        try {
            const { email, password, businessName, contactPerson, phone } = req.body;

            const user = await User.create({ email, password, type: 'agent', status: 'active' });
            const subAgent = await Agent.create({
                userId: user.id,
                parentAgentId: req.user.agentId,
                businessName,
                contactPerson,
                phone,
                status: 'active'
            });

            await Wallet.create({ agentId: subAgent.id, balance: 0 });

            res.status(201).json({ success: true, data: subAgent });
        } catch (error) {
            console.error('Create sub-agent error:', error);
            res.status(500).json({ success: false, message: 'Failed to create sub-agent' });
        }
    }

    // Update sub-agent
    async updateSubAgent(req, res) {
        try {
            const { businessName, contactPerson, phone, status } = req.body;

            await Agent.update(
                { businessName, contactPerson, phone, status },
                { where: { id: req.params.subAgentId, parentAgentId: req.user.agentId } }
            );

            res.json({ success: true, message: 'Sub-agent updated successfully' });
        } catch (error) {
            console.error('Update sub-agent error:', error);
            res.status(500).json({ success: false, message: 'Failed to update sub-agent' });
        }
    }

    // Get saved travelers
    async getSavedTravelers(req, res) {
        try {
            const agent = await Agent.findByPk(req.user.agentId, {
                attributes: ['savedTravelers']
            });

            res.json({ success: true, data: agent?.savedTravelers || [] });
        } catch (error) {
            console.error('Get travelers error:', error);
            res.status(500).json({ success: false, message: 'Failed to get travelers' });
        }
    }

    // Save traveler
    async saveTraveler(req, res) {
        try {
            const traveler = req.body;
            const agent = await Agent.findByPk(req.user.agentId);

            const travelers = agent.savedTravelers || [];
            travelers.push({ ...traveler, id: Date.now().toString() });

            await agent.update({ savedTravelers: travelers });

            res.status(201).json({ success: true, message: 'Traveler saved successfully' });
        } catch (error) {
            console.error('Save traveler error:', error);
            res.status(500).json({ success: false, message: 'Failed to save traveler' });
        }
    }

    // Update traveler
    async updateTraveler(req, res) {
        try {
            const { travelerId } = req.params;
            const updates = req.body;
            const agent = await Agent.findByPk(req.user.agentId);

            const travelers = (agent.savedTravelers || []).map(t =>
                t.id === travelerId ? { ...t, ...updates } : t
            );

            await agent.update({ savedTravelers: travelers });

            res.json({ success: true, message: 'Traveler updated successfully' });
        } catch (error) {
            console.error('Update traveler error:', error);
            res.status(500).json({ success: false, message: 'Failed to update traveler' });
        }
    }

    // Delete traveler
    async deleteTraveler(req, res) {
        try {
            const { travelerId } = req.params;
            const agent = await Agent.findByPk(req.user.agentId);

            const travelers = (agent.savedTravelers || []).filter(t => t.id !== travelerId);

            await agent.update({ savedTravelers: travelers });

            res.json({ success: true, message: 'Traveler deleted successfully' });
        } catch (error) {
            console.error('Delete traveler error:', error);
            res.status(500).json({ success: false, message: 'Failed to delete traveler' });
        }
    }

    // Get commission details
    async getCommissionDetails(req, res) {
        try {
            const agent = await Agent.findByPk(req.user.agentId, {
                attributes: ['commissionRate', 'commissionType', 'specialRates']
            });

            res.json({ success: true, data: agent });
        } catch (error) {
            console.error('Get commission details error:', error);
            res.status(500).json({ success: false, message: 'Failed to get commission details' });
        }
    }

    // Get commission history
    async getCommissionHistory(req, res) {
        try {
            const { startDate, endDate, page = 1, limit = 20 } = req.query;
            const offset = (page - 1) * limit;

            const where = { agentId: req.user.agentId, status: 'confirmed' };
            if (startDate && endDate) {
                where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
            }

            const { count, rows } = await Booking.findAndCountAll({
                where,
                attributes: ['id', 'bookingRef', 'productType', 'amount', 'commission', 'createdAt'],
                order: [['createdAt', 'DESC']],
                limit: parseInt(limit),
                offset
            });

            const totalCommission = rows.reduce((sum, b) => sum + (b.commission || 0), 0);

            res.json({
                success: true,
                data: {
                    bookings: rows,
                    totalCommission,
                    pagination: { total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) }
                }
            });
        } catch (error) {
            console.error('Get commission history error:', error);
            res.status(500).json({ success: false, message: 'Failed to get commission history' });
        }
    }

    // Get markup settings
    async getMarkupSettings(req, res) {
        try {
            const agent = await Agent.findByPk(req.user.agentId, {
                attributes: ['markupSettings']
            });

            res.json({ success: true, data: agent?.markupSettings || {} });
        } catch (error) {
            console.error('Get markup settings error:', error);
            res.status(500).json({ success: false, message: 'Failed to get markup settings' });
        }
    }

    // Update markup settings
    async updateMarkupSettings(req, res) {
        try {
            await Agent.update(
                { markupSettings: req.body },
                { where: { id: req.user.agentId } }
            );

            res.json({ success: true, message: 'Markup settings updated successfully' });
        } catch (error) {
            console.error('Update markup settings error:', error);
            res.status(500).json({ success: false, message: 'Failed to update markup settings' });
        }
    }

    // Get booking report
    async getBookingReport(req, res) {
        try {
            const { startDate, endDate, productType } = req.query;

            const where = { agentId: req.user.agentId };
            if (startDate && endDate) {
                where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
            }
            if (productType) where.productType = productType;

            const bookings = await Booking.findAll({
                where,
                attributes: ['id', 'bookingRef', 'productType', 'status', 'amount', 'createdAt']
            });

            res.json({ success: true, data: bookings });
        } catch (error) {
            console.error('Get booking report error:', error);
            res.status(500).json({ success: false, message: 'Failed to get booking report' });
        }
    }

    // Get sales report
    async getSalesReport(req, res) {
        try {
            const { startDate, endDate } = req.query;

            const where = { agentId: req.user.agentId, status: 'confirmed' };
            if (startDate && endDate) {
                where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
            }

            const bookings = await Booking.findAll({
                where,
                attributes: ['productType', 'amount', 'commission', 'createdAt']
            });

            const summary = bookings.reduce((acc, b) => {
                const type = b.productType;
                if (!acc[type]) acc[type] = { count: 0, revenue: 0, commission: 0 };
                acc[type].count++;
                acc[type].revenue += b.amount || 0;
                acc[type].commission += b.commission || 0;
                return acc;
            }, {});

            res.json({ success: true, data: summary });
        } catch (error) {
            console.error('Get sales report error:', error);
            res.status(500).json({ success: false, message: 'Failed to get sales report' });
        }
    }

    // Get commission report
    async getCommissionReport(req, res) {
        try {
            const { startDate, endDate, groupBy = 'month' } = req.query;

            const where = { agentId: req.user.agentId, status: 'confirmed' };
            if (startDate && endDate) {
                where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
            }

            const bookings = await Booking.findAll({
                where,
                attributes: ['productType', 'commission', 'createdAt'],
                order: [['createdAt', 'ASC']]
            });

            res.json({ success: true, data: bookings });
        } catch (error) {
            console.error('Get commission report error:', error);
            res.status(500).json({ success: false, message: 'Failed to get commission report' });
        }
    }

    // Get notifications
    async getNotifications(req, res) {
        try {
            const { page = 1, limit = 20, unreadOnly } = req.query;
            const offset = (page - 1) * limit;

            const where = { agentId: req.user.agentId };
            if (unreadOnly === 'true') where.read = false;

            const { count, rows } = await Notification.findAndCountAll({
                where,
                order: [['createdAt', 'DESC']],
                limit: parseInt(limit),
                offset
            });

            res.json({
                success: true,
                data: {
                    notifications: rows,
                    pagination: { total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) }
                }
            });
        } catch (error) {
            console.error('Get notifications error:', error);
            res.status(500).json({ success: false, message: 'Failed to get notifications' });
        }
    }

    // Mark notification as read
    async markNotificationRead(req, res) {
        try {
            await Notification.update(
                { read: true },
                { where: { id: req.params.notificationId, agentId: req.user.agentId } }
            );

            res.json({ success: true, message: 'Notification marked as read' });
        } catch (error) {
            console.error('Mark notification read error:', error);
            res.status(500).json({ success: false, message: 'Failed to mark notification as read' });
        }
    }

    // Mark all notifications as read
    async markAllNotificationsRead(req, res) {
        try {
            await Notification.update(
                { read: true },
                { where: { agentId: req.user.agentId, read: false } }
            );

            res.json({ success: true, message: 'All notifications marked as read' });
        } catch (error) {
            console.error('Mark all notifications read error:', error);
            res.status(500).json({ success: false, message: 'Failed to mark all notifications as read' });
        }
    }

    // Get support tickets
    async getSupportTickets(req, res) {
        try {
            const { page = 1, limit = 10, status } = req.query;
            const offset = (page - 1) * limit;

            const where = { agentId: req.user.agentId };
            if (status) where.status = status;

            const { count, rows } = await SupportTicket.findAndCountAll({
                where,
                order: [['createdAt', 'DESC']],
                limit: parseInt(limit),
                offset
            });

            res.json({
                success: true,
                data: {
                    tickets: rows,
                    pagination: { total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) }
                }
            });
        } catch (error) {
            console.error('Get support tickets error:', error);
            res.status(500).json({ success: false, message: 'Failed to get support tickets' });
        }
    }

    // Create support ticket
    async createSupportTicket(req, res) {
        try {
            const { subject, category, priority, message, bookingRef } = req.body;

            const ticket = await SupportTicket.create({
                agentId: req.user.agentId,
                subject,
                category,
                priority: priority || 'medium',
                status: 'open',
                messages: [{ sender: 'agent', message, timestamp: new Date() }],
                bookingRef
            });

            res.status(201).json({ success: true, data: ticket });
        } catch (error) {
            console.error('Create support ticket error:', error);
            res.status(500).json({ success: false, message: 'Failed to create support ticket' });
        }
    }

    // Get ticket details
    async getTicketDetails(req, res) {
        try {
            const ticket = await SupportTicket.findOne({
                where: { id: req.params.ticketId, agentId: req.user.agentId }
            });

            if (!ticket) {
                return res.status(404).json({ success: false, message: 'Ticket not found' });
            }

            res.json({ success: true, data: ticket });
        } catch (error) {
            console.error('Get ticket details error:', error);
            res.status(500).json({ success: false, message: 'Failed to get ticket details' });
        }
    }

    // Reply to ticket
    async replyToTicket(req, res) {
        try {
            const { message } = req.body;
            const ticket = await SupportTicket.findOne({
                where: { id: req.params.ticketId, agentId: req.user.agentId }
            });

            if (!ticket) {
                return res.status(404).json({ success: false, message: 'Ticket not found' });
            }

            const messages = ticket.messages || [];
            messages.push({ sender: 'agent', message, timestamp: new Date() });

            await ticket.update({ messages, status: 'waiting_response' });

            res.json({ success: true, message: 'Reply sent successfully' });
        } catch (error) {
            console.error('Reply to ticket error:', error);
            res.status(500).json({ success: false, message: 'Failed to send reply' });
        }
    }
}

module.exports = new AgentPortalController();
