const { Customer, User, Booking } = require('../models');
const { Op } = require('sequelize');

class CustomerController {
    // Get customer dashboard
    async getDashboard(req, res) {
        try {
            const customerId = req.user.customerId;

            const [upcomingBookings, recentBookings, totalBookings] = await Promise.all([
                Booking.findAll({
                    where: {
                        customerId,
                        status: 'confirmed',
                        travelDate: { [Op.gte]: new Date() }
                    },
                    order: [['travelDate', 'ASC']],
                    limit: 3
                }),
                Booking.findAll({
                    where: { customerId },
                    order: [['createdAt', 'DESC']],
                    limit: 5
                }),
                Booking.count({ where: { customerId } })
            ]);

            res.json({
                success: true,
                data: {
                    upcomingBookings,
                    recentBookings,
                    stats: { totalBookings }
                }
            });
        } catch (error) {
            console.error('Dashboard error:', error);
            res.status(500).json({ success: false, message: 'Failed to load dashboard' });
        }
    }

    // Get customer profile
    async getProfile(req, res) {
        try {
            const customer = await Customer.findByPk(req.user.customerId, {
                include: [{ model: User, as: 'user', attributes: ['email', 'phone'] }]
            });

            if (!customer) {
                return res.status(404).json({ success: false, message: 'Customer not found' });
            }

            res.json({ success: true, data: customer });
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({ success: false, message: 'Failed to get profile' });
        }
    }

    // Update customer profile
    async updateProfile(req, res) {
        try {
            const { firstName, lastName, phone, address, dateOfBirth, gender } = req.body;

            await Customer.update(
                { firstName, lastName, phone, address, dateOfBirth, gender },
                { where: { id: req.user.customerId } }
            );

            res.json({ success: true, message: 'Profile updated successfully' });
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({ success: false, message: 'Failed to update profile' });
        }
    }

    // Get customer bookings
    async getBookings(req, res) {
        try {
            const { page = 1, limit = 10, status } = req.query;
            const offset = (page - 1) * limit;

            const where = { customerId: req.user.customerId };
            if (status) where.status = status;

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

    // Get booking details
    async getBookingDetails(req, res) {
        try {
            const booking = await Booking.findOne({
                where: {
                    id: req.params.id,
                    customerId: req.user.customerId
                }
            });

            if (!booking) {
                return res.status(404).json({ success: false, message: 'Booking not found' });
            }

            res.json({ success: true, data: booking });
        } catch (error) {
            console.error('Get booking details error:', error);
            res.status(500).json({ success: false, message: 'Failed to get booking details' });
        }
    }

    // Update notification preferences
    async updateNotifications(req, res) {
        try {
            const { emailNotifications, smsNotifications, pushNotifications } = req.body;

            await Customer.update(
                { emailNotifications, smsNotifications, pushNotifications },
                { where: { id: req.user.customerId } }
            );

            res.json({ success: true, message: 'Notification preferences updated' });
        } catch (error) {
            console.error('Update notifications error:', error);
            res.status(500).json({ success: false, message: 'Failed to update notifications' });
        }
    }
}

module.exports = new CustomerController();
