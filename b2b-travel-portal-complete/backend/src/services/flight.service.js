/**
 * Flight Service
 * Handles flight search, booking, and management
 */

const config = require('../config');

class FlightService {
    constructor() {
        this.suppliers = config.flightSuppliers || {};
    }

    /**
     * Search flights across all suppliers
     */
    async search(params) {
        const { origin, destination, departDate, returnDate, passengers, cabinClass } = params;

        // Mock response for development
        const mockFlights = this.generateMockFlights(origin, destination, departDate, passengers);

        return {
            success: true,
            searchId: `SRCH${Date.now()}`,
            flights: mockFlights,
            filters: {
                airlines: ['Air India', 'IndiGo', 'SpiceJet', 'Vistara', 'GoAir'],
                stops: ['Direct', '1 Stop', '2+ Stops'],
                priceRange: { min: 3500, max: 25000 }
            }
        };
    }

    /**
     * Get flight fare rules
     */
    async getFareRules(flightId) {
        return {
            success: true,
            rules: {
                cancellation: {
                    allowed: true,
                    fee: 3000,
                    beforeDeparture: '4 hours'
                },
                dateChange: {
                    allowed: true,
                    fee: 2500
                },
                refund: {
                    allowed: true,
                    policy: 'Partial refund available'
                },
                baggage: {
                    cabin: '7 kg',
                    checkin: '15 kg'
                }
            }
        };
    }

    /**
     * Book a flight
     */
    async book(bookingData) {
        const { flightId, passengers, contactDetails, paymentInfo } = bookingData;

        // Generate booking reference
        const pnr = this.generatePNR();
        const bookingRef = `BK${Date.now()}`;

        return {
            success: true,
            booking: {
                id: bookingRef,
                pnr: pnr,
                status: 'confirmed',
                flightId,
                passengers,
                ticketNumbers: passengers.map((_, i) => `TKT${Date.now()}${i}`),
                totalAmount: bookingData.amount || 15000,
                createdAt: new Date().toISOString()
            }
        };
    }

    /**
     * Cancel a booking
     */
    async cancel(bookingId) {
        return {
            success: true,
            refundAmount: 12000,
            cancellationFee: 3000,
            status: 'cancelled'
        };
    }

    /**
     * Get booking details
     */
    async getBooking(bookingId) {
        return {
            success: true,
            booking: {
                id: bookingId,
                status: 'confirmed',
                pnr: 'ABC123',
                flightDetails: {
                    airline: 'IndiGo',
                    flightNumber: '6E-123',
                    departure: { city: 'DEL', time: '10:00' },
                    arrival: { city: 'BOM', time: '12:15' }
                }
            }
        };
    }

    /**
     * Generate mock flights for testing
     */
    generateMockFlights(origin, destination, date, passengers) {
        const airlines = [
            { code: '6E', name: 'IndiGo', logo: '/airlines/indigo.png' },
            { code: 'AI', name: 'Air India', logo: '/airlines/airindia.png' },
            { code: 'SG', name: 'SpiceJet', logo: '/airlines/spicejet.png' },
            { code: 'UK', name: 'Vistara', logo: '/airlines/vistara.png' }
        ];

        return airlines.map((airline, idx) => ({
            id: `FL${Date.now()}${idx}`,
            airline: airline,
            flightNumber: `${airline.code}-${100 + idx}`,
            departure: {
                airport: origin,
                time: `${8 + idx * 2}:00`,
                terminal: 'T3'
            },
            arrival: {
                airport: destination,
                time: `${10 + idx * 2}:30`,
                terminal: 'T2'
            },
            duration: '2h 30m',
            stops: idx % 2 === 0 ? 0 : 1,
            price: {
                base: 4500 + (idx * 500),
                taxes: 850,
                total: 5350 + (idx * 500)
            },
            seatsAvailable: 15 - idx,
            cabinClass: 'Economy',
            refundable: idx % 2 === 0,
            baggage: {
                cabin: '7 kg',
                checkin: '15 kg'
            }
        }));
    }

    /**
     * Generate PNR
     */
    generatePNR() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let pnr = '';
        for (let i = 0; i < 6; i++) {
            pnr += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return pnr;
    }

    /**
     * Fare calendar
     */
    async getFareCalendar(params) {
        const { origin, destination, month, year } = params;
        const days = new Date(year, month, 0).getDate();
        const fares = [];

        for (let day = 1; day <= days; day++) {
            fares.push({
                date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
                price: 3500 + Math.floor(Math.random() * 5000),
                available: Math.random() > 0.1
            });
        }

        return {
            success: true,
            origin,
            destination,
            fares
        };
    }
}

module.exports = new FlightService();
