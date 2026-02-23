const { Booking, Agent, Commission } = require('../models');
const { Op } = require('sequelize');

class ReportController {
    // Sales report
    async getSalesReport(req, res) {
        try {
            const { startDate, endDate, groupBy = 'day' } = req.query;

            const where = { status: 'confirmed' };
            if (startDate && endDate) {
                where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
            }

            let dateFormat;
            switch (groupBy) {
                case 'month': dateFormat = '%Y-%m'; break;
                case 'week': dateFormat = '%Y-%W'; break;
                default: dateFormat = '%Y-%m-%d';
            }

            const report = await Booking.findAll({
                where,
                attributes: [
                    [Booking.sequelize.fn('DATE_FORMAT', Booking.sequelize.col('createdAt'), dateFormat), 'period'],
                    [Booking.sequelize.fn('SUM', Booking.sequelize.col('amount')), 'revenue'],
                    [Booking.sequelize.fn('COUNT', '*'), 'bookings']
                ],
                group: ['period'],
                order: [[Booking.sequelize.literal('period'), 'ASC']]
            });

            res.json({ success: true, data: report });
        } catch (error) {
            console.error('Sales report error:', error);
            res.status(500).json({ success: false, message: 'Failed to generate sales report' });
        }
    }

    // Agent performance report
    async getAgentReport(req, res) {
        try {
            const { startDate, endDate } = req.query;

            const where = { status: 'confirmed' };
            if (startDate && endDate) {
                where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
            }

            const report = await Booking.findAll({
                where,
                include: [{ model: Agent, as: 'agent', attributes: ['id', 'businessName'] }],
                attributes: [
                    'agentId',
                    [Booking.sequelize.fn('SUM', Booking.sequelize.col('amount')), 'totalRevenue'],
                    [Booking.sequelize.fn('SUM', Booking.sequelize.col('commission')), 'totalCommission'],
                    [Booking.sequelize.fn('COUNT', '*'), 'totalBookings']
                ],
                group: ['agentId'],
                order: [[Booking.sequelize.literal('totalRevenue'), 'DESC']]
            });

            res.json({ success: true, data: report });
        } catch (error) {
            console.error('Agent report error:', error);
            res.status(500).json({ success: false, message: 'Failed to generate agent report' });
        }
    }

    // Product-wise report
    async getProductReport(req, res) {
        try {
            const { startDate, endDate } = req.query;

            const where = { status: 'confirmed' };
            if (startDate && endDate) {
                where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
            }

            const report = await Booking.findAll({
                where,
                attributes: [
                    'productType',
                    [Booking.sequelize.fn('SUM', Booking.sequelize.col('amount')), 'revenue'],
                    [Booking.sequelize.fn('COUNT', '*'), 'bookings']
                ],
                group: ['productType']
            });

            res.json({ success: true, data: report });
        } catch (error) {
            console.error('Product report error:', error);
            res.status(500).json({ success: false, message: 'Failed to generate product report' });
        }
    }

    // Commission report for agent
    async getAgentCommissionReport(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const agentId = req.user.agentId;

            const where = { agentId, status: 'confirmed' };
            if (startDate && endDate) {
                where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
            }

            const bookings = await Booking.findAll({
                where,
                attributes: ['id', 'productType', 'amount', 'commission', 'createdAt']
            });

            const summary = {
                totalBookings: bookings.length,
                totalRevenue: bookings.reduce((sum, b) => sum + b.amount, 0),
                totalCommission: bookings.reduce((sum, b) => sum + (b.commission || 0), 0)
            };

            res.json({ success: true, data: { bookings, summary } });
        } catch (error) {
            console.error('Commission report error:', error);
            res.status(500).json({ success: false, message: 'Failed to generate commission report' });
        }
    }

    // Export report
    async exportReport(req, res) {
        try {
            const { type, format, startDate, endDate } = req.query;

            // Generate report based on type
            let data;
            switch (type) {
                case 'sales':
                    data = await this._getSalesData(startDate, endDate);
                    break;
                case 'agents':
                    data = await this._getAgentData(startDate, endDate);
                    break;
                default:
                    return res.status(400).json({ success: false, message: 'Invalid report type' });
            }

            // Return as JSON (actual file export would require additional implementation)
            res.json({ success: true, data });
        } catch (error) {
            console.error('Export report error:', error);
            res.status(500).json({ success: false, message: 'Failed to export report' });
        }
    }

    async _getSalesData(startDate, endDate) {
        const where = { status: 'confirmed' };
        if (startDate && endDate) {
            where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
        }
        return Booking.findAll({ where });
    }

    async _getAgentData(startDate, endDate) {
        return Agent.findAll({ include: [{ model: Booking }] });
    }
}

module.exports = new ReportController();
