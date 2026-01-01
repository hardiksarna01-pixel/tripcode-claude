/**
 * Bus Controller
 * Handles bus search, seat selection, and booking
 */

class BusController {
    async search(req, res) {
        try {
            const { from, to, date, returnDate } = req.body;

            const buses = this.generateMockBuses(from, to, date);

            res.json({
                success: true,
                data: {
                    buses,
                    searchId: `BSRCH${Date.now()}`,
                    totalResults: buses.length
                }
            });
        } catch (error) {
            console.error('Bus search error:', error);
            res.status(500).json({ success: false, message: 'Bus search failed' });
        }
    }

    async getCities(req, res) {
        try {
            const cities = [
                { id: 1, name: 'Mumbai', state: 'Maharashtra' },
                { id: 2, name: 'Delhi', state: 'Delhi' },
                { id: 3, name: 'Bangalore', state: 'Karnataka' },
                { id: 4, name: 'Pune', state: 'Maharashtra' },
                { id: 5, name: 'Hyderabad', state: 'Telangana' },
                { id: 6, name: 'Chennai', state: 'Tamil Nadu' },
                { id: 7, name: 'Goa', state: 'Goa' },
                { id: 8, name: 'Jaipur', state: 'Rajasthan' }
            ];
            res.json({ success: true, data: cities });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get cities' });
        }
    }

    async getOperators(req, res) {
        try {
            const operators = [
                { id: 1, name: 'VRL Travels', rating: 4.2 },
                { id: 2, name: 'SRS Travels', rating: 4.0 },
                { id: 3, name: 'Paulo Travels', rating: 3.8 },
                { id: 4, name: 'Neeta Travels', rating: 4.1 },
                { id: 5, name: 'IntrCity SmartBus', rating: 4.5 }
            ];
            res.json({ success: true, data: operators });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get operators' });
        }
    }

    async getBusDetails(req, res) {
        try {
            const { busId } = req.params;
            res.json({
                success: true,
                data: {
                    id: busId,
                    operator: 'VRL Travels',
                    busType: 'Volvo Multi-Axle A/C Sleeper',
                    departure: { city: 'Mumbai', time: '21:00' },
                    arrival: { city: 'Pune', time: '01:30' },
                    duration: '4h 30m',
                    amenities: ['WiFi', 'Charging Point', 'Blanket', 'Water Bottle'],
                    rating: 4.2,
                    totalSeats: 36,
                    availableSeats: 24
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get bus details' });
        }
    }

    async getSeatLayout(req, res) {
        try {
            const { busId } = req.body || req.params;

            const seats = [];
            for (let row = 1; row <= 12; row++) {
                ['L', 'R'].forEach(side => {
                    ['U', 'L'].forEach(deck => {
                        seats.push({
                            number: `${row}${side}${deck}`,
                            available: Math.random() > 0.3,
                            price: deck === 'U' ? 1200 : 1000,
                            type: deck === 'U' ? 'upper' : 'lower',
                            gender: Math.random() > 0.5 ? 'any' : (Math.random() > 0.5 ? 'male' : 'female')
                        });
                    });
                });
            }

            res.json({
                success: true,
                data: {
                    busId,
                    layout: 'sleeper',
                    seats
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get seat layout' });
        }
    }

    async blockSeats(req, res) {
        try {
            const { busId, seats, searchId } = req.body;
            res.json({
                success: true,
                data: {
                    blockId: `BLK${Date.now()}`,
                    busId,
                    seats,
                    expiresIn: 600,
                    totalAmount: seats.length * 1100
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to block seats' });
        }
    }

    async createBooking(req, res) {
        try {
            const { blockId, passengers, contactDetails, paymentMethod } = req.body;
            res.status(201).json({
                success: true,
                message: 'Bus booked successfully',
                data: {
                    bookingId: `BBK${Date.now()}`,
                    pnr: `BUS${Date.now().toString().slice(-6)}`,
                    status: 'confirmed'
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Bus booking failed' });
        }
    }

    async getBooking(req, res) {
        try {
            const { bookingId } = req.params;
            res.json({
                success: true,
                data: {
                    id: bookingId,
                    status: 'confirmed',
                    operator: 'VRL Travels',
                    route: 'Mumbai - Pune',
                    departureTime: '21:00',
                    seats: ['5LU', '5LL']
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get booking' });
        }
    }

    async cancelBooking(req, res) {
        try {
            const { bookingId } = req.params;
            res.json({
                success: true,
                message: 'Booking cancelled',
                data: {
                    bookingId,
                    refundAmount: 1800,
                    cancellationFee: 400
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to cancel booking' });
        }
    }

    async getBoardingPoints(req, res) {
        try {
            const { busId } = req.body;
            const boardingPoints = [
                { id: 1, name: 'Andheri Station', time: '20:00', address: 'Near Andheri West Station' },
                { id: 2, name: 'Thane Station', time: '20:30', address: 'Near Thane Railway Station' },
                { id: 3, name: 'Borivali', time: '21:00', address: 'Borivali West Bus Stand' }
            ];
            const droppingPoints = [
                { id: 1, name: 'Swargate', time: '01:00', address: 'Swargate Bus Stand' },
                { id: 2, name: 'Shivaji Nagar', time: '01:15', address: 'Near Shivaji Nagar Station' },
                { id: 3, name: 'Hinjewadi', time: '01:45', address: 'Hinjewadi Phase 1' }
            ];
            res.json({ success: true, data: { boardingPoints, droppingPoints } });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get boarding points' });
        }
    }

    async confirmBooking(req, res) {
        try {
            const { bookingId } = req.params;
            const { paymentId } = req.body;
            res.json({
                success: true,
                message: 'Booking confirmed',
                data: {
                    bookingId,
                    pnr: `BUS${Date.now().toString().slice(-6)}`,
                    status: 'confirmed',
                    paymentId
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to confirm booking' });
        }
    }

    async getTicket(req, res) {
        try {
            const { bookingId } = req.params;
            res.json({
                success: true,
                data: {
                    bookingId,
                    pnr: 'BUS123456',
                    operator: 'VRL Travels',
                    busType: 'Volvo Multi-Axle A/C Sleeper',
                    departure: { city: 'Mumbai', time: '21:00', date: '2024-03-15', point: 'Andheri Station' },
                    arrival: { city: 'Pune', time: '01:30', date: '2024-03-16', point: 'Swargate' },
                    seats: ['5LU', '5LL'],
                    passengers: [{ name: 'John Doe', age: 30, seat: '5LU' }],
                    totalAmount: 2200,
                    status: 'confirmed'
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get ticket' });
        }
    }

    async getCancellationPolicy(req, res) {
        try {
            const { bookingId } = req.params;
            res.json({
                success: true,
                data: {
                    bookingId,
                    totalAmount: 2200,
                    policies: [
                        { period: 'More than 12 hours before departure', fee: 200, refund: '91%' },
                        { period: '6-12 hours before departure', fee: 500, refund: '77%' },
                        { period: '0-6 hours before departure', fee: 1100, refund: '50%' },
                        { period: 'After departure', fee: 2200, refund: '0%' }
                    ]
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get cancellation policy' });
        }
    }

    generateMockBuses(from, to, date) {
        const operators = ['VRL Travels', 'SRS Travels', 'Paulo Travels', 'Neeta Travels'];
        const busTypes = ['Volvo Multi-Axle A/C Sleeper', 'Volvo A/C Seater', 'Mercedes Benz Multi-Axle', 'Non A/C Sleeper'];

        return operators.map((operator, idx) => ({
            id: `BUS${Date.now()}${idx}`,
            operator,
            busType: busTypes[idx % busTypes.length],
            departure: { city: from, time: `${18 + idx}:00` },
            arrival: { city: to, time: `${(22 + idx) % 24}:30` },
            duration: '4h 30m',
            price: 800 + (idx * 200),
            seatsAvailable: 10 + idx,
            rating: 3.8 + (idx * 0.2),
            amenities: ['WiFi', 'Charging Point']
        }));
    }
}

module.exports = new BusController();
