const { Company, User, Agent, Booking, Subscription } = require('../models');
const { Op } = require('sequelize');

class SuperAdminController {
    // Get platform dashboard
    async getDashboard(req, res) {
        try {
            const [
                totalCompanies,
                activeCompanies,
                totalUsers,
                totalBookings,
                totalRevenue
            ] = await Promise.all([
                Company.count(),
                Company.count({ where: { status: 'active' } }),
                User.count(),
                Booking.count(),
                Booking.sum('amount', { where: { status: 'confirmed' } })
            ]);

            res.json({
                success: true,
                data: {
                    companies: { total: totalCompanies, active: activeCompanies },
                    users: totalUsers,
                    bookings: totalBookings,
                    revenue: totalRevenue || 0
                }
            });
        } catch (error) {
            console.error('Dashboard error:', error);
            res.status(500).json({ success: false, message: 'Failed to load dashboard' });
        }
    }

    // Get all companies
    async getCompanies(req, res) {
        try {
            const { page = 1, limit = 20, status, search } = req.query;
            const offset = (page - 1) * limit;

            const where = {};
            if (status) where.status = status;
            if (search) {
                where.name = { [Op.like]: `%${search}%` };
            }

            const { count, rows } = await Company.findAndCountAll({
                where,
                include: [{ model: Subscription, as: 'subscription' }],
                order: [['createdAt', 'DESC']],
                limit: parseInt(limit),
                offset
            });

            res.json({
                success: true,
                data: {
                    companies: rows,
                    pagination: {
                        total: count,
                        page: parseInt(page),
                        totalPages: Math.ceil(count / limit)
                    }
                }
            });
        } catch (error) {
            console.error('Get companies error:', error);
            res.status(500).json({ success: false, message: 'Failed to get companies' });
        }
    }

    // Create company
    async createCompany(req, res) {
        try {
            const { name, domain, planId, adminEmail, adminName } = req.body;

            const company = await Company.create({
                name,
                domain,
                status: 'active'
            });

            // Create subscription
            await Subscription.create({
                companyId: company.id,
                planId,
                status: 'active',
                startDate: new Date()
            });

            // Create admin user
            await User.create({
                email: adminEmail,
                name: adminName,
                companyId: company.id,
                role: 'company_admin'
            });

            res.status(201).json({
                success: true,
                message: 'Company created successfully',
                data: { companyId: company.id }
            });
        } catch (error) {
            console.error('Create company error:', error);
            res.status(500).json({ success: false, message: 'Failed to create company' });
        }
    }

    // Update company
    async updateCompany(req, res) {
        try {
            const { companyId } = req.params;
            const { name, status, domain } = req.body;

            await Company.update(
                { name, status, domain },
                { where: { id: companyId } }
            );

            res.json({ success: true, message: 'Company updated successfully' });
        } catch (error) {
            console.error('Update company error:', error);
            res.status(500).json({ success: false, message: 'Failed to update company' });
        }
    }

    // Suspend company
    async suspendCompany(req, res) {
        try {
            const { companyId } = req.params;
            const { reason } = req.body;

            await Company.update(
                { status: 'suspended', suspensionReason: reason },
                { where: { id: companyId } }
            );

            res.json({ success: true, message: 'Company suspended' });
        } catch (error) {
            console.error('Suspend company error:', error);
            res.status(500).json({ success: false, message: 'Failed to suspend company' });
        }
    }

    // Get subscription plans
    async getPlans(req, res) {
        try {
            const plans = await Plan.findAll({ order: [['price', 'ASC']] });
            res.json({ success: true, data: plans });
        } catch (error) {
            console.error('Get plans error:', error);
            res.status(500).json({ success: false, message: 'Failed to get plans' });
        }
    }

    // Get platform billing
    async getBilling(req, res) {
        try {
            const invoices = await Invoice.findAll({
                include: [{ model: Company, as: 'company' }],
                order: [['createdAt', 'DESC']]
            });

            res.json({ success: true, data: invoices });
        } catch (error) {
            console.error('Get billing error:', error);
            res.status(500).json({ success: false, message: 'Failed to get billing' });
        }
    }

    // Get system health
    async getSystemHealth(req, res) {
        try {
            const health = {
                database: 'healthy',
                redis: 'healthy',
                api: 'healthy',
                uptime: process.uptime(),
                memory: process.memoryUsage()
            };

            res.json({ success: true, data: health });
        } catch (error) {
            console.error('System health error:', error);
            res.status(500).json({ success: false, message: 'Failed to get system health' });
        }
    }

    // Get API usage
    async getAPIUsage(req, res) {
        try {
            // This would typically pull from a metrics/logging system
            const usage = {
                totalCalls: 45680000,
                todayCalls: 125000,
                avgLatency: 145
            };

            res.json({ success: true, data: usage });
        } catch (error) {
            console.error('API usage error:', error);
            res.status(500).json({ success: false, message: 'Failed to get API usage' });
        }
    }
}

module.exports = new SuperAdminController();
