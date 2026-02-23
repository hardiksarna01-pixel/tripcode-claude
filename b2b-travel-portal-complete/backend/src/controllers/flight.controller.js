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

    // Get airports
    async getAirports(req, res) {
        try {
            const { query } = req.query;

            // Mock airport data
            const airports = [
                { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'New Delhi', country: 'India' },
                { code: 'BOM', name: 'Chhatrapati Shivaji International Airport', city: 'Mumbai', country: 'India' },
                { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bangalore', country: 'India' },
                { code: 'MAA', name: 'Chennai International Airport', city: 'Chennai', country: 'India' },
                { code: 'CCU', name: 'Netaji Subhas Chandra Bose International Airport', city: 'Kolkata', country: 'India' },
                { code: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', country: 'India' },
                { code: 'GOI', name: 'Goa International Airport', city: 'Goa', country: 'India' },
                { code: 'COK', name: 'Cochin International Airport', city: 'Kochi', country: 'India' }
            ].filter(a => !query || a.city.toLowerCase().includes(query.toLowerCase()) || a.code.toLowerCase().includes(query.toLowerCase()));

            res.json({ success: true, data: airports });
        } catch (error) {
            console.error('Get airports error:', error);
            res.status(500).json({ success: false, message: 'Failed to get airports' });
        }
    }

    // Get airlines
    async getAirlines(req, res) {
        try {
            const airlines = [
                { code: '6E', name: 'IndiGo', logo: '/airlines/indigo.png' },
                { code: 'AI', name: 'Air India', logo: '/airlines/airindia.png' },
                { code: 'SG', name: 'SpiceJet', logo: '/airlines/spicejet.png' },
                { code: 'UK', name: 'Vistara', logo: '/airlines/vistara.png' },
                { code: 'G8', name: 'GoAir', logo: '/airlines/goair.png' },
                { code: 'I5', name: 'AirAsia India', logo: '/airlines/airasia.png' }
            ];

            res.json({ success: true, data: airlines });
        } catch (error) {
            console.error('Get airlines error:', error);
            res.status(500).json({ success: false, message: 'Failed to get airlines' });
        }
    }

    // Get popular sectors
    async getSectors(req, res) {
        try {
            const sectors = [
                { from: 'DEL', to: 'BOM', name: 'Delhi - Mumbai' },
                { from: 'DEL', to: 'BLR', name: 'Delhi - Bangalore' },
                { from: 'BOM', to: 'DEL', name: 'Mumbai - Delhi' },
                { from: 'BLR', to: 'DEL', name: 'Bangalore - Delhi' },
                { from: 'DEL', to: 'GOI', name: 'Delhi - Goa' },
                { from: 'BOM', to: 'GOI', name: 'Mumbai - Goa' },
                { from: 'DEL', to: 'CCU', name: 'Delhi - Kolkata' },
                { from: 'BOM', to: 'BLR', name: 'Mumbai - Bangalore' }
            ];

            res.json({ success: true, data: sectors });
        } catch (error) {
            console.error('Get sectors error:', error);
            res.status(500).json({ success: false, message: 'Failed to get sectors' });
        }
    }

    // Reprice flight
    async reprice(req, res) {
        try {
            const { searchId, flightId } = req.body;

            // Mock reprice response
            const repriceResult = {
                success: true,
                priceChanged: false,
                originalPrice: 5350,
                currentPrice: 5350,
                flightId,
                searchId,
                available: true
            };

            res.json({ success: true, data: repriceResult });
        } catch (error) {
            console.error('Reprice error:', error);
            res.status(500).json({ success: false, message: 'Failed to reprice flight' });
        }
    }

    // Get SSR (Special Service Requests)
    async getSSR(req, res) {
        try {
            const ssr = {
                meals: [
                    { code: 'VGML', name: 'Vegetarian Meal', price: 350 },
                    { code: 'NVML', name: 'Non-Vegetarian Meal', price: 400 },
                    { code: 'AVML', name: 'Asian Vegetarian Meal', price: 350 }
                ],
                baggage: [
                    { code: 'BAG15', name: '15 kg Check-in', price: 800 },
                    { code: 'BAG20', name: '20 kg Check-in', price: 1200 },
                    { code: 'BAG25', name: '25 kg Check-in', price: 1500 },
                    { code: 'BAG30', name: '30 kg Check-in', price: 1800 }
                ],
                wheelchair: [
                    { code: 'WCHR', name: 'Wheelchair - R', price: 0 }
                ]
            };

            res.json({ success: true, data: ssr });
        } catch (error) {
            console.error('Get SSR error:', error);
            res.status(500).json({ success: false, message: 'Failed to get SSR' });
        }
    }

    // Get seat map
    async getSeatMap(req, res) {
        try {
            const { flightId } = req.body;

            // Generate mock seat map
            const rows = [];
            for (let row = 1; row <= 30; row++) {
                const seats = ['A', 'B', 'C', 'D', 'E', 'F'].map(col => ({
                    number: `${row}${col}`,
                    available: Math.random() > 0.3,
                    type: row <= 5 ? 'premium' : 'standard',
                    price: row <= 5 ? 500 : (col === 'A' || col === 'F' ? 200 : 0),
                    isWindow: col === 'A' || col === 'F',
                    isAisle: col === 'C' || col === 'D',
                    isExitRow: row === 12 || row === 13
                }));
                rows.push({ rowNumber: row, seats });
            }

            res.json({ success: true, data: { rows } });
        } catch (error) {
            console.error('Get seat map error:', error);
            res.status(500).json({ success: false, message: 'Failed to get seat map' });
        }
    }

    // Get fare rules
    async getFareRules(req, res) {
        try {
            const fareRules = {
                cancellation: {
                    allowed: true,
                    fee: 3000,
                    beforeDeparture: '4 hours',
                    policy: 'Cancellation fee of Rs. 3000 applies for cancellations made before 4 hours of departure'
                },
                dateChange: {
                    allowed: true,
                    fee: 2500,
                    policy: 'Date change fee of Rs. 2500 applies plus fare difference if any'
                },
                noShow: {
                    policy: 'No refund on no-show. Full ticket amount will be forfeited.'
                },
                baggage: {
                    cabin: '7 kg',
                    checkin: '15 kg',
                    excess: 'Rs. 350 per kg for excess baggage'
                }
            };

            res.json({ success: true, data: fareRules });
        } catch (error) {
            console.error('Get fare rules error:', error);
            res.status(500).json({ success: false, message: 'Failed to get fare rules' });
        }
    }

    // Create booking
    async createBooking(req, res) {
        try {
            const { searchId, flightId, passengers, contactDetails, paymentMethod } = req.body;
            const agentId = req.user?.agentId;

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
                data: booking.booking
            });
        } catch (error) {
            console.error('Flight booking error:', error);
            res.status(500).json({ success: false, message: 'Flight booking failed' });
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
                    pnr: `PNR${Date.now().toString().slice(-6)}`,
                    paymentId
                }
            });
        } catch (error) {
            console.error('Confirm booking error:', error);
            res.status(500).json({ success: false, message: 'Failed to confirm booking' });
        }
    }

    // Get ticket
    async getTicket(req, res) {
        try {
            const { pnr } = req.params;

            const ticket = {
                pnr,
                bookingId: `BK${Date.now()}`,
                status: 'confirmed',
                passengers: [
                    { name: 'John Doe', ticketNumber: `TKT${Date.now()}1`, seat: '12A' }
                ],
                flight: {
                    airline: 'IndiGo',
                    flightNumber: '6E-123',
                    departure: { airport: 'DEL', time: '10:00', date: '2024-03-15' },
                    arrival: { airport: 'BOM', time: '12:15', date: '2024-03-15' }
                }
            };

            res.json({ success: true, data: ticket });
        } catch (error) {
            console.error('Get ticket error:', error);
            res.status(500).json({ success: false, message: 'Failed to get ticket' });
        }
    }

    // Cancel ticket
    async cancelTicket(req, res) {
        try {
            const { pnr } = req.params;
            const { reason } = req.body;

            const result = await flightService.cancel(pnr);

            res.json({
                success: true,
                message: 'Ticket cancelled successfully',
                data: {
                    pnr,
                    status: 'cancelled',
                    refundAmount: result.refundAmount,
                    cancellationFee: result.cancellationFee
                }
            });
        } catch (error) {
            console.error('Cancel ticket error:', error);
            res.status(500).json({ success: false, message: 'Failed to cancel ticket' });
        }
    }

    // Get cancellation charges
    async getCancellationCharges(req, res) {
        try {
            const { pnr } = req.params;

            res.json({
                success: true,
                data: {
                    pnr,
                    totalFare: 5350,
                    cancellationFee: 3000,
                    refundAmount: 2350,
                    breakdown: {
                        airlineFee: 2000,
                        serviceFee: 500,
                        gst: 500
                    }
                }
            });
        } catch (error) {
            console.error('Get cancellation charges error:', error);
            res.status(500).json({ success: false, message: 'Failed to get cancellation charges' });
        }
    }
}

module.exports = new FlightController();
