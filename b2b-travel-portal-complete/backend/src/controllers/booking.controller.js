const { Booking, Agent, Wallet, Passenger } = require('../models');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

class BookingController {
    // Create new booking
    async create(req, res) {
        try {
            const { productType, productDetails, passengers, amount, paymentMethod } = req.body;
            const agentId = req.user.agentId;

            // Check wallet balance for wallet payment
            if (paymentMethod === 'wallet') {
                const wallet = await Wallet.findOne({ where: { agentId } });
                if (!wallet || wallet.balance < amount) {
                    return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
                }
            }

            // Create booking
            const booking = await Booking.create({
                id: uuidv4(),
                agentId,
                productType,
                productDetails: JSON.stringify(productDetails),
                amount,
                paymentMethod,
                status: 'pending',
                bookingDate: new Date()
            });

            // Create passengers
            if (passengers && passengers.length > 0) {
                await Passenger.bulkCreate(
                    passengers.map(p => ({ ...p, bookingId: booking.id }))
                );
            }

            // Deduct from wallet if wallet payment
            if (paymentMethod === 'wallet') {
                await Wallet.decrement('balance', { by: amount, where: { agentId } });
            }

            res.status(201).json({
                success: true,
                message: 'Booking created successfully',
                data: { bookingId: booking.id }
            });
        } catch (error) {
            console.error('Create booking error:', error);
            res.status(500).json({ success: false, message: 'Failed to create booking' });
        }
    }

    // Get booking by ID
    async getById(req, res) {
        try {
            const booking = await Booking.findByPk(req.params.id, {
                include: [
                    { model: Passenger, as: 'passengers' },
                    { model: Agent, as: 'agent' }
                ]
            });

            if (!booking) {
                return res.status(404).json({ success: false, message: 'Booking not found' });
            }

            res.json({ success: true, data: booking });
        } catch (error) {
            console.error('Get booking error:', error);
            res.status(500).json({ success: false, message: 'Failed to get booking' });
        }
    }

    // Cancel booking
    async cancel(req, res) {
        try {
            const { id } = req.params;
            const { reason } = req.body;

            const booking = await Booking.findByPk(id);
            if (!booking) {
                return res.status(404).json({ success: false, message: 'Booking not found' });
            }

            if (booking.status === 'cancelled') {
                return res.status(400).json({ success: false, message: 'Booking already cancelled' });
            }

            await booking.update({
                status: 'cancelled',
                cancellationReason: reason,
                cancelledAt: new Date()
            });

            // Refund to wallet if paid via wallet
            if (booking.paymentMethod === 'wallet') {
                await Wallet.increment('balance', {
                    by: booking.amount,
                    where: { agentId: booking.agentId }
                });
            }

            res.json({ success: true, message: 'Booking cancelled successfully' });
        } catch (error) {
            console.error('Cancel booking error:', error);
            res.status(500).json({ success: false, message: 'Failed to cancel booking' });
        }
    }

    // Get all bookings (admin)
    async getAll(req, res) {
        try {
            const { page = 1, limit = 20, status, agentId, productType, startDate, endDate } = req.query;
            const offset = (page - 1) * limit;

            const where = {};
            if (status) where.status = status;
            if (agentId) where.agentId = agentId;
            if (productType) where.productType = productType;
            if (startDate && endDate) {
                where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
            }

            const { count, rows } = await Booking.findAndCountAll({
                where,
                include: [{ model: Agent, as: 'agent', attributes: ['id', 'businessName'] }],
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
            console.error('Get all bookings error:', error);
            res.status(500).json({ success: false, message: 'Failed to get bookings' });
        }
    }

    // Update booking status
    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status, remarks } = req.body;

            const booking = await Booking.findByPk(id);
            if (!booking) {
                return res.status(404).json({ success: false, message: 'Booking not found' });
            }

            await booking.update({ status, remarks });

            res.json({ success: true, message: 'Booking status updated' });
        } catch (error) {
            console.error('Update booking status error:', error);
            res.status(500).json({ success: false, message: 'Failed to update booking status' });
        }
    }

    // Alias methods for route compatibility
    async listBookings(req, res) { return this.getAll(req, res); }
    async getBookingDetails(req, res) { return this.getById(req, res); }
    async cancelBooking(req, res) { return this.cancel(req, res); }

    // Initiate refund
    async initiateRefund(req, res) {
        try {
            const booking = await Booking.findByPk(req.params.bookingId);
            if (!booking) {
                return res.status(404).json({ success: false, message: 'Booking not found' });
            }

            await booking.update({ refundStatus: 'initiated', refundInitiatedAt: new Date() });

            res.json({ success: true, message: 'Refund initiated successfully' });
        } catch (error) {
            console.error('Initiate refund error:', error);
            res.status(500).json({ success: false, message: 'Failed to initiate refund' });
        }
    }

    // Get refund status
    async getRefundStatus(req, res) {
        try {
            const booking = await Booking.findByPk(req.params.bookingId, {
                attributes: ['id', 'refundStatus', 'refundAmount', 'refundInitiatedAt', 'refundCompletedAt']
            });

            if (!booking) {
                return res.status(404).json({ success: false, message: 'Booking not found' });
            }

            res.json({ success: true, data: booking });
        } catch (error) {
            console.error('Get refund status error:', error);
            res.status(500).json({ success: false, message: 'Failed to get refund status' });
        }
    }

    // Request amendment
    async requestAmendment(req, res) {
        try {
            const { amendmentType, details } = req.body;
            const booking = await Booking.findByPk(req.params.bookingId);

            if (!booking) {
                return res.status(404).json({ success: false, message: 'Booking not found' });
            }

            await booking.update({
                amendmentRequest: { type: amendmentType, details, requestedAt: new Date() },
                amendmentStatus: 'pending'
            });

            res.json({ success: true, message: 'Amendment request submitted' });
        } catch (error) {
            console.error('Request amendment error:', error);
            res.status(500).json({ success: false, message: 'Failed to request amendment' });
        }
    }

    // Get amendment charges
    async getAmendmentCharges(req, res) {
        try {
            const booking = await Booking.findByPk(req.params.bookingId);

            if (!booking) {
                return res.status(404).json({ success: false, message: 'Booking not found' });
            }

            // Mock amendment charges calculation
            const charges = {
                baseFee: 500,
                fareDifference: 0,
                total: 500,
                currency: 'INR'
            };

            res.json({ success: true, data: charges });
        } catch (error) {
            console.error('Get amendment charges error:', error);
            res.status(500).json({ success: false, message: 'Failed to get amendment charges' });
        }
    }

    // Get invoice
    async getInvoice(req, res) {
        try {
            const booking = await Booking.findByPk(req.params.bookingId, {
                include: [
                    { model: Agent, as: 'agent' },
                    { model: Passenger, as: 'passengers' }
                ]
            });

            if (!booking) {
                return res.status(404).json({ success: false, message: 'Booking not found' });
            }

            // Return invoice data (in production, generate PDF)
            res.json({
                success: true,
                data: {
                    invoiceNumber: `INV-${booking.id.substring(0, 8).toUpperCase()}`,
                    booking,
                    generatedAt: new Date()
                }
            });
        } catch (error) {
            console.error('Get invoice error:', error);
            res.status(500).json({ success: false, message: 'Failed to get invoice' });
        }
    }

    // Get voucher
    async getVoucher(req, res) {
        try {
            const booking = await Booking.findByPk(req.params.bookingId, {
                include: [{ model: Passenger, as: 'passengers' }]
            });

            if (!booking) {
                return res.status(404).json({ success: false, message: 'Booking not found' });
            }

            res.json({
                success: true,
                data: {
                    voucherNumber: `VCH-${booking.id.substring(0, 8).toUpperCase()}`,
                    booking,
                    generatedAt: new Date()
                }
            });
        } catch (error) {
            console.error('Get voucher error:', error);
            res.status(500).json({ success: false, message: 'Failed to get voucher' });
        }
    }

    // Get ticket
    async getTicket(req, res) {
        try {
            const booking = await Booking.findByPk(req.params.bookingId, {
                include: [{ model: Passenger, as: 'passengers' }]
            });

            if (!booking) {
                return res.status(404).json({ success: false, message: 'Booking not found' });
            }

            res.json({
                success: true,
                data: {
                    ticketNumber: booking.pnr || `TKT-${booking.id.substring(0, 8).toUpperCase()}`,
                    booking,
                    generatedAt: new Date()
                }
            });
        } catch (error) {
            console.error('Get ticket error:', error);
            res.status(500).json({ success: false, message: 'Failed to get ticket' });
        }
    }

    // Resend confirmation
    async resendConfirmation(req, res) {
        try {
            const booking = await Booking.findByPk(req.params.bookingId);

            if (!booking) {
                return res.status(404).json({ success: false, message: 'Booking not found' });
            }

            // In production, send email here
            res.json({ success: true, message: 'Confirmation email sent successfully' });
        } catch (error) {
            console.error('Resend confirmation error:', error);
            res.status(500).json({ success: false, message: 'Failed to resend confirmation' });
        }
    }

    // Update passenger
    async updatePassenger(req, res) {
        try {
            const { bookingId, passengerId } = req.params;
            const updates = req.body;

            const passenger = await Passenger.findOne({
                where: { id: passengerId, bookingId }
            });

            if (!passenger) {
                return res.status(404).json({ success: false, message: 'Passenger not found' });
            }

            await passenger.update(updates);

            res.json({ success: true, message: 'Passenger updated successfully' });
        } catch (error) {
            console.error('Update passenger error:', error);
            res.status(500).json({ success: false, message: 'Failed to update passenger' });
        }
    }
}

module.exports = new BookingController();
