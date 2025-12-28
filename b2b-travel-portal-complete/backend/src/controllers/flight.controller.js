const flightService = require('../services/flight.service');

class FlightController {
    // Search flights
    async search(req, res) {
        try {
            const { origin, destination, departDate, returnDate, tripType, adults, children, infants, cabinClass } = req.body;

            const searchParams = {
                origin,
                destination,
                departDate,
                returnDate,
                tripType: tripType || 'one-way',
                passengers: { adults: adults || 1, children: children || 0, infants: infants || 0 },
                cabinClass: cabinClass || 'economy'
            };

            const results = await flightService.search(searchParams);

            res.json({
                success: true,
                data: {
                    flights: results.flights,
                    searchId: results.searchId,
                    totalResults: results.flights.length
                }
            });
        } catch (error) {
            console.error('Flight search error:', error);
            res.status(500).json({ success: false, message: 'Flight search failed' });
        }
    }

    // Get flight details
    async getDetails(req, res) {
        try {
            const { flightId, searchId } = req.params;

            const details = await flightService.getFlightDetails(searchId, flightId);

            res.json({ success: true, data: details });
        } catch (error) {
            console.error('Get flight details error:', error);
            res.status(500).json({ success: false, message: 'Failed to get flight details' });
        }
    }

    // Get fare rules
    async getFareRules(req, res) {
        try {
            const { flightId, searchId } = req.params;

            const fareRules = await flightService.getFareRules(searchId, flightId);

            res.json({ success: true, data: fareRules });
        } catch (error) {
            console.error('Get fare rules error:', error);
            res.status(500).json({ success: false, message: 'Failed to get fare rules' });
        }
    }

    // Book flight
    async book(req, res) {
        try {
            const { searchId, flightId, passengers, contactDetails, paymentMethod } = req.body;
            const agentId = req.user.agentId;

            const booking = await flightService.book({
                searchId,
                flightId,
                passengers,
                contactDetails,
                agentId,
                paymentMethod
            });

            res.status(201).json({
                success: true,
                message: 'Flight booked successfully',
                data: {
                    bookingId: booking.id,
                    pnr: booking.pnr,
                    status: booking.status
                }
            });
        } catch (error) {
            console.error('Flight booking error:', error);
            res.status(500).json({ success: false, message: 'Flight booking failed' });
        }
    }

    // Get booking status
    async getBookingStatus(req, res) {
        try {
            const { bookingId } = req.params;

            const status = await flightService.getBookingStatus(bookingId);

            res.json({ success: true, data: status });
        } catch (error) {
            console.error('Get booking status error:', error);
            res.status(500).json({ success: false, message: 'Failed to get booking status' });
        }
    }

    // Cancel flight booking
    async cancelBooking(req, res) {
        try {
            const { bookingId } = req.params;
            const { reason } = req.body;

            const result = await flightService.cancel(bookingId, reason);

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

    // Get airports
    async getAirports(req, res) {
        try {
            const { query } = req.query;

            const airports = await flightService.searchAirports(query);

            res.json({ success: true, data: airports });
        } catch (error) {
            console.error('Get airports error:', error);
            res.status(500).json({ success: false, message: 'Failed to get airports' });
        }
    }
}

module.exports = new FlightController();
