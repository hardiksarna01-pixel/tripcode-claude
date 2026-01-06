const hotelService = require('../services/hotel.service');

class HotelController {
    // Search hotels
    async search(req, res) {
        try {
            const { destination, checkIn, checkOut, rooms, guests } = req.body;

            const searchParams = {
                destination,
                checkIn,
                checkOut,
                rooms: rooms || 1,
                guests: guests || { adults: 2, children: 0 }
            };

            const results = await hotelService.search(searchParams);

            res.json({
                success: true,
                data: {
                    hotels: results.hotels,
                    searchId: results.searchId,
                    totalResults: results.hotels.length
                }
            });
        } catch (error) {
            console.error('Hotel search error:', error);
            res.status(500).json({ success: false, message: 'Hotel search failed' });
        }
    }

    // Get destinations
    async getDestinations(req, res) {
        try {
            const { query } = req.query;

            const destinations = [
                { id: 1, name: 'Mumbai', country: 'India', type: 'city' },
                { id: 2, name: 'Delhi', country: 'India', type: 'city' },
                { id: 3, name: 'Goa', country: 'India', type: 'region' },
                { id: 4, name: 'Bangalore', country: 'India', type: 'city' },
                { id: 5, name: 'Jaipur', country: 'India', type: 'city' },
                { id: 6, name: 'Kerala', country: 'India', type: 'region' },
                { id: 7, name: 'Udaipur', country: 'India', type: 'city' },
                { id: 8, name: 'Manali', country: 'India', type: 'city' }
            ].filter(d => !query || d.name.toLowerCase().includes(query.toLowerCase()));

            res.json({ success: true, data: destinations });
        } catch (error) {
            console.error('Get destinations error:', error);
            res.status(500).json({ success: false, message: 'Failed to get destinations' });
        }
    }

    // Get amenities
    async getAmenities(req, res) {
        try {
            const amenities = [
                { code: 'WIFI', name: 'Free WiFi', category: 'connectivity' },
                { code: 'POOL', name: 'Swimming Pool', category: 'leisure' },
                { code: 'GYM', name: 'Fitness Center', category: 'leisure' },
                { code: 'SPA', name: 'Spa & Wellness', category: 'leisure' },
                { code: 'REST', name: 'Restaurant', category: 'dining' },
                { code: 'BAR', name: 'Bar/Lounge', category: 'dining' },
                { code: 'PARK', name: 'Free Parking', category: 'transport' },
                { code: 'AC', name: 'Air Conditioning', category: 'room' },
                { code: 'TV', name: 'Flat-screen TV', category: 'room' },
                { code: 'SAFE', name: 'In-room Safe', category: 'room' }
            ];

            res.json({ success: true, data: amenities });
        } catch (error) {
            console.error('Get amenities error:', error);
            res.status(500).json({ success: false, message: 'Failed to get amenities' });
        }
    }

    // Get hotel details
    async getHotelDetails(req, res) {
        try {
            const { hotelId } = req.params;

            const details = await hotelService.getHotelDetails(hotelId);

            res.json({ success: true, data: details.hotel });
        } catch (error) {
            console.error('Get hotel details error:', error);
            res.status(500).json({ success: false, message: 'Failed to get hotel details' });
        }
    }

    // Get room details
    async getRoomDetails(req, res) {
        try {
            const { hotelId, searchId, checkIn, checkOut, rooms } = req.body;

            const roomDetails = await hotelService.getRoomAvailability(hotelId, checkIn, checkOut, rooms);

            res.json({ success: true, data: roomDetails });
        } catch (error) {
            console.error('Get room details error:', error);
            res.status(500).json({ success: false, message: 'Failed to get room details' });
        }
    }

    // Reprice room
    async repriceRoom(req, res) {
        try {
            const { hotelId, roomId, searchId } = req.body;

            res.json({
                success: true,
                data: {
                    priceChanged: false,
                    originalPrice: 5900,
                    currentPrice: 5900,
                    available: true,
                    hotelId,
                    roomId
                }
            });
        } catch (error) {
            console.error('Reprice room error:', error);
            res.status(500).json({ success: false, message: 'Failed to reprice room' });
        }
    }

    // Create booking
    async createBooking(req, res) {
        try {
            const { searchId, hotelId, roomId, guests, contactDetails, specialRequests, paymentMethod } = req.body;
            const agentId = req.user?.agentId;

            const booking = await hotelService.book({
                searchId,
                hotelId,
                roomId,
                guests,
                contactDetails,
                specialRequests,
                agentId,
                paymentMethod
            });

            res.status(201).json({
                success: true,
                message: 'Hotel booked successfully',
                data: booking.booking
            });
        } catch (error) {
            console.error('Hotel booking error:', error);
            res.status(500).json({ success: false, message: 'Hotel booking failed' });
        }
    }

    // Confirm booking
    async confirmBooking(req, res) {
        try {
            const { bookingId } = req.params;
            const { paymentId } = req.body;

            res.json({
                success: true,
                message: 'Booking confirmed successfully',
                data: {
                    bookingId,
                    status: 'confirmed',
                    confirmationNumber: `HTL${Date.now().toString().slice(-8)}`,
                    paymentId
                }
            });
        } catch (error) {
            console.error('Confirm booking error:', error);
            res.status(500).json({ success: false, message: 'Failed to confirm booking' });
        }
    }

    // Get voucher
    async getVoucher(req, res) {
        try {
            const { bookingId } = req.params;

            const voucher = {
                bookingId,
                confirmationNumber: 'HTL12345678',
                hotelName: 'Grand Hyatt Mumbai',
                address: '123 Main Street, Mumbai, Maharashtra 400001',
                checkIn: '2024-03-15',
                checkOut: '2024-03-18',
                checkInTime: '14:00',
                checkOutTime: '12:00',
                guestName: 'John Doe',
                roomType: 'Deluxe Room',
                mealPlan: 'Breakfast Included',
                totalAmount: 17700,
                specialRequests: 'High floor preferred',
                policies: {
                    cancellation: 'Free cancellation until 24 hours before check-in'
                }
            };

            res.json({ success: true, data: voucher });
        } catch (error) {
            console.error('Get voucher error:', error);
            res.status(500).json({ success: false, message: 'Failed to get voucher' });
        }
    }

    // Cancel booking
    async cancelBooking(req, res) {
        try {
            const { bookingId } = req.params;
            const { reason } = req.body;

            const result = await hotelService.cancel(bookingId);

            res.json({
                success: true,
                message: 'Booking cancelled successfully',
                data: {
                    bookingId,
                    status: 'cancelled',
                    refundAmount: result.refundAmount,
                    cancellationFee: result.cancellationFee
                }
            });
        } catch (error) {
            console.error('Cancel booking error:', error);
            res.status(500).json({ success: false, message: 'Failed to cancel booking' });
        }
    }

    // Get cancellation policy
    async getCancellationPolicy(req, res) {
        try {
            const { bookingId } = req.params;

            res.json({
                success: true,
                data: {
                    bookingId,
                    totalAmount: 17700,
                    cancellationFee: 2000,
                    refundAmount: 15700,
                    policies: [
                        { period: 'More than 48 hours before check-in', fee: 0, refund: '100%' },
                        { period: '24-48 hours before check-in', fee: 2000, refund: '~89%' },
                        { period: 'Less than 24 hours before check-in', fee: 8850, refund: '50%' },
                        { period: 'No show', fee: 17700, refund: '0%' }
                    ]
                }
            });
        } catch (error) {
            console.error('Get cancellation policy error:', error);
            res.status(500).json({ success: false, message: 'Failed to get cancellation policy' });
        }
    }
}

module.exports = new HotelController();
