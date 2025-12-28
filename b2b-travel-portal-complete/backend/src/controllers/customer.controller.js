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

    // Get saved travelers
    async getSavedTravelers(req, res) {
        try {
            const customer = await Customer.findByPk(req.user.customerId, {
                attributes: ['savedTravelers']
            });
            res.json({ success: true, data: customer?.savedTravelers || [] });
        } catch (error) {
            console.error('Get travelers error:', error);
            res.status(500).json({ success: false, message: 'Failed to get travelers' });
        }
    }

    // Save traveler
    async saveTraveler(req, res) {
        try {
            const customer = await Customer.findByPk(req.user.customerId);
            const travelers = customer.savedTravelers || [];
            travelers.push({ ...req.body, id: Date.now().toString() });
            await customer.update({ savedTravelers: travelers });
            res.status(201).json({ success: true, message: 'Traveler saved' });
        } catch (error) {
            console.error('Save traveler error:', error);
            res.status(500).json({ success: false, message: 'Failed to save traveler' });
        }
    }

    // Update traveler
    async updateTraveler(req, res) {
        try {
            const customer = await Customer.findByPk(req.user.customerId);
            const travelers = (customer.savedTravelers || []).map(t =>
                t.id === req.params.travelerId ? { ...t, ...req.body } : t
            );
            await customer.update({ savedTravelers: travelers });
            res.json({ success: true, message: 'Traveler updated' });
        } catch (error) {
            console.error('Update traveler error:', error);
            res.status(500).json({ success: false, message: 'Failed to update traveler' });
        }
    }

    // Delete traveler
    async deleteTraveler(req, res) {
        try {
            const customer = await Customer.findByPk(req.user.customerId);
            const travelers = (customer.savedTravelers || []).filter(t => t.id !== req.params.travelerId);
            await customer.update({ savedTravelers: travelers });
            res.json({ success: true, message: 'Traveler deleted' });
        } catch (error) {
            console.error('Delete traveler error:', error);
            res.status(500).json({ success: false, message: 'Failed to delete traveler' });
        }
    }

    // Get wishlist
    async getWishlist(req, res) {
        try {
            const customer = await Customer.findByPk(req.user.customerId, { attributes: ['wishlist'] });
            res.json({ success: true, data: customer?.wishlist || [] });
        } catch (error) {
            console.error('Get wishlist error:', error);
            res.status(500).json({ success: false, message: 'Failed to get wishlist' });
        }
    }

    // Add to wishlist
    async addToWishlist(req, res) {
        try {
            const customer = await Customer.findByPk(req.user.customerId);
            const wishlist = customer.wishlist || [];
            wishlist.push({ ...req.body, id: Date.now().toString(), addedAt: new Date() });
            await customer.update({ wishlist });
            res.status(201).json({ success: true, message: 'Added to wishlist' });
        } catch (error) {
            console.error('Add to wishlist error:', error);
            res.status(500).json({ success: false, message: 'Failed to add to wishlist' });
        }
    }

    // Remove from wishlist
    async removeFromWishlist(req, res) {
        try {
            const customer = await Customer.findByPk(req.user.customerId);
            const wishlist = (customer.wishlist || []).filter(i => i.id !== req.params.itemId);
            await customer.update({ wishlist });
            res.json({ success: true, message: 'Removed from wishlist' });
        } catch (error) {
            console.error('Remove from wishlist error:', error);
            res.status(500).json({ success: false, message: 'Failed to remove from wishlist' });
        }
    }

    // Get saved searches
    async getSavedSearches(req, res) {
        try {
            const customer = await Customer.findByPk(req.user.customerId, { attributes: ['savedSearches'] });
            res.json({ success: true, data: customer?.savedSearches || [] });
        } catch (error) {
            console.error('Get saved searches error:', error);
            res.status(500).json({ success: false, message: 'Failed to get saved searches' });
        }
    }

    // Save search
    async saveSearch(req, res) {
        try {
            const customer = await Customer.findByPk(req.user.customerId);
            const searches = customer.savedSearches || [];
            searches.push({ ...req.body, id: Date.now().toString(), savedAt: new Date() });
            await customer.update({ savedSearches: searches });
            res.status(201).json({ success: true, message: 'Search saved' });
        } catch (error) {
            console.error('Save search error:', error);
            res.status(500).json({ success: false, message: 'Failed to save search' });
        }
    }

    // Delete saved search
    async deleteSavedSearch(req, res) {
        try {
            const customer = await Customer.findByPk(req.user.customerId);
            const searches = (customer.savedSearches || []).filter(s => s.id !== req.params.searchId);
            await customer.update({ savedSearches: searches });
            res.json({ success: true, message: 'Search deleted' });
        } catch (error) {
            console.error('Delete search error:', error);
            res.status(500).json({ success: false, message: 'Failed to delete search' });
        }
    }

    // Get price alerts
    async getPriceAlerts(req, res) {
        try {
            const customer = await Customer.findByPk(req.user.customerId, { attributes: ['priceAlerts'] });
            res.json({ success: true, data: customer?.priceAlerts || [] });
        } catch (error) {
            console.error('Get price alerts error:', error);
            res.status(500).json({ success: false, message: 'Failed to get price alerts' });
        }
    }

    // Create price alert
    async createPriceAlert(req, res) {
        try {
            const customer = await Customer.findByPk(req.user.customerId);
            const alerts = customer.priceAlerts || [];
            alerts.push({ ...req.body, id: Date.now().toString(), createdAt: new Date(), active: true });
            await customer.update({ priceAlerts: alerts });
            res.status(201).json({ success: true, message: 'Price alert created' });
        } catch (error) {
            console.error('Create price alert error:', error);
            res.status(500).json({ success: false, message: 'Failed to create price alert' });
        }
    }

    // Delete price alert
    async deletePriceAlert(req, res) {
        try {
            const customer = await Customer.findByPk(req.user.customerId);
            const alerts = (customer.priceAlerts || []).filter(a => a.id !== req.params.alertId);
            await customer.update({ priceAlerts: alerts });
            res.json({ success: true, message: 'Price alert deleted' });
        } catch (error) {
            console.error('Delete price alert error:', error);
            res.status(500).json({ success: false, message: 'Failed to delete price alert' });
        }
    }

    // Get my reviews
    async getMyReviews(req, res) {
        try {
            const customer = await Customer.findByPk(req.user.customerId, { attributes: ['reviews'] });
            res.json({ success: true, data: customer?.reviews || [] });
        } catch (error) {
            console.error('Get reviews error:', error);
            res.status(500).json({ success: false, message: 'Failed to get reviews' });
        }
    }

    // Create review
    async createReview(req, res) {
        try {
            const customer = await Customer.findByPk(req.user.customerId);
            const reviews = customer.reviews || [];
            reviews.push({ ...req.body, id: Date.now().toString(), createdAt: new Date() });
            await customer.update({ reviews });
            res.status(201).json({ success: true, message: 'Review submitted' });
        } catch (error) {
            console.error('Create review error:', error);
            res.status(500).json({ success: false, message: 'Failed to submit review' });
        }
    }

    // Get rewards balance
    async getRewardsBalance(req, res) {
        try {
            const customer = await Customer.findByPk(req.user.customerId, {
                attributes: ['rewardsPoints', 'rewardsTier']
            });
            res.json({
                success: true,
                data: {
                    points: customer?.rewardsPoints || 0,
                    tier: customer?.rewardsTier || 'bronze',
                    value: (customer?.rewardsPoints || 0) * 0.25 // 1 point = ₹0.25
                }
            });
        } catch (error) {
            console.error('Get rewards balance error:', error);
            res.status(500).json({ success: false, message: 'Failed to get rewards balance' });
        }
    }

    // Get rewards history
    async getRewardsHistory(req, res) {
        try {
            const customer = await Customer.findByPk(req.user.customerId, { attributes: ['rewardsHistory'] });
            res.json({ success: true, data: customer?.rewardsHistory || [] });
        } catch (error) {
            console.error('Get rewards history error:', error);
            res.status(500).json({ success: false, message: 'Failed to get rewards history' });
        }
    }
}

module.exports = new CustomerController();
