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

    // Get hotel details
    async getDetails(req, res) {
        try {
            const { hotelId, searchId } = req.params;

            const details = await hotelService.getHotelDetails(searchId, hotelId);

            res.json({ success: true, data: details });
        } catch (error) {
            console.error('Get hotel details error:', error);
            res.status(500).json({ success: false, message: 'Failed to get hotel details' });
        }
    }

    // Get room availability
    async getRooms(req, res) {
        try {
            const { hotelId, searchId } = req.params;

            const rooms = await hotelService.getRoomAvailability(searchId, hotelId);

            res.json({ success: true, data: rooms });
        } catch (error) {
            console.error('Get rooms error:', error);
            res.status(500).json({ success: false, message: 'Failed to get rooms' });
        }
    }

    // Book hotel
    async book(req, res) {
        try {
            const { searchId, hotelId, roomId, guests, contactDetails, specialRequests, paymentMethod } = req.body;
            const agentId = req.user.agentId;

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
                data: {
                    bookingId: booking.id,
                    confirmationNumber: booking.confirmationNumber,
                    status: booking.status
                }
            });
        } catch (error) {
            console.error('Hotel booking error:', error);
            res.status(500).json({ success: false, message: 'Hotel booking failed' });
        }
    }

    // Cancel hotel booking
    async cancelBooking(req, res) {
        try {
            const { bookingId } = req.params;
            const { reason } = req.body;

            const result = await hotelService.cancel(bookingId, reason);

            res.json({
                success: true,
                message: 'Booking cancelled successfully',
                data: result
            });
        } catch (error) {
            console.error('Cancel booking error:', error);
            res.status(500).json({ success: false, message: 'Failed to cancel booking' });
        }
    }

    // Search destinations
    async searchDestinations(req, res) {
        try {
            const { query } = req.query;

            const destinations = await hotelService.searchDestinations(query);

            res.json({ success: true, data: destinations });
        } catch (error) {
            console.error('Search destinations error:', error);
            res.status(500).json({ success: false, message: 'Failed to search destinations' });
        }
    }
}

module.exports = new HotelController();
