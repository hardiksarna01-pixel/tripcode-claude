/**
 * Flight API Service
 * Multi-supplier flight search and booking integration
 */

const axios = require('axios');
const config = require('../../config');
const { ExternalApiError } = require('../../middleware/error.middleware');

class FlightApiService {
    constructor() {
        this.suppliers = {
            amadeus: new AmadeusAdapter(config.flightSuppliers.amadeus),
            tbo: new TBOAdapter(config.flightSuppliers.tbo),
            tripjack: new TripjackAdapter(config.flightSuppliers.tripjack)
        };
        this.cache = new Map();
    }

    /**
     * Search flights across all enabled suppliers
     */
    async search(params) {
        const cacheKey = this.getCacheKey('search', params);
        const cached = this.cache.get(cacheKey);
        if (cached && cached.expiry > Date.now()) {
            return cached.data;
        }

        const enabledSuppliers = this.getEnabledSuppliers();
        const searchPromises = enabledSuppliers.map(supplier =>
            this.suppliers[supplier].search(params).catch(err => {
                console.error(`${supplier} search error:`, err.message);
                return { flights: [], error: err.message };
            })
        );

        const results = await Promise.all(searchPromises);
        const allFlights = this.mergeAndDedupe(results);
        const sortedFlights = this.sortFlights(allFlights, params.sortBy);

        const response = {
            searchKey: this.generateSearchKey(),
            flights: sortedFlights,
            filters: this.generateFilters(sortedFlights),
            meta: {
                totalResults: sortedFlights.length,
                searchParams: params,
                timestamp: new Date().toISOString()
            }
        };

        // Cache for 5 minutes
        this.cache.set(cacheKey, {
            data: response,
            expiry: Date.now() + 5 * 60 * 1000
        });

        return response;
    }

    /**
     * Reprice/validate flight fare
     */
    async reprice(searchKey, flightKey) {
        const flight = this.getFlightFromCache(searchKey, flightKey);
        if (!flight) {
            throw new ExternalApiError('Flight', 'Flight not found or session expired');
        }

        const supplier = this.suppliers[flight.supplier];
        const repriceResult = await supplier.reprice(flight);

        return {
            valid: repriceResult.valid,
            priceChanged: repriceResult.priceChanged,
            originalPrice: flight.price,
            currentPrice: repriceResult.price,
            flightKey: repriceResult.flightKey,
            fareRules: repriceResult.fareRules,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
        };
    }

    /**
     * Get SSR (meals, baggage, seats)
     */
    async getSSR(searchKey, flightKey) {
        const flight = this.getFlightFromCache(searchKey, flightKey);
        const supplier = this.suppliers[flight.supplier];
        return supplier.getSSR(flight);
    }

    /**
     * Get seat map
     */
    async getSeatMap(searchKey, flightKey) {
        const flight = this.getFlightFromCache(searchKey, flightKey);
        const supplier = this.suppliers[flight.supplier];
        return supplier.getSeatMap(flight);
    }

    /**
     * Get fare rules
     */
    async getFareRules(searchKey, flightKey) {
        const flight = this.getFlightFromCache(searchKey, flightKey);
        const supplier = this.suppliers[flight.supplier];
        return supplier.getFareRules(flight);
    }

    /**
     * Create booking (temp/hold PNR)
     */
    async createBooking(bookingData) {
        const flight = this.getFlightFromCache(bookingData.searchKey, bookingData.flightKey);
        const supplier = this.suppliers[flight.supplier];

        const booking = await supplier.createBooking({
            flight,
            passengers: bookingData.passengers,
            contact: bookingData.contact,
            addons: bookingData.addons
        });

        return {
            bookingId: booking.bookingId,
            pnr: booking.pnr,
            status: 'pending',
            expiresAt: booking.expiresAt,
            totalAmount: booking.totalAmount,
            supplier: flight.supplier
        };
    }

    /**
     * Confirm booking (issue ticket)
     */
    async confirmBooking(bookingId, paymentDetails) {
        const booking = await this.getBookingById(bookingId);
        const supplier = this.suppliers[booking.supplier];

        const result = await supplier.confirmBooking(booking, paymentDetails);

        return {
            bookingId,
            pnr: result.pnr,
            ticketNumbers: result.ticketNumbers,
            status: 'confirmed',
            confirmedAt: new Date().toISOString()
        };
    }

    /**
     * Cancel ticket
     */
    async cancelTicket(pnr, reason) {
        const booking = await this.getBookingByPnr(pnr);
        const supplier = this.suppliers[booking.supplier];

        return supplier.cancelTicket(booking, reason);
    }

    /**
     * Get cancellation charges
     */
    async getCancellationCharges(pnr) {
        const booking = await this.getBookingByPnr(pnr);
        const supplier = this.suppliers[booking.supplier];

        return supplier.getCancellationCharges(booking);
    }

    // Helper methods
    getEnabledSuppliers() {
        return Object.keys(this.suppliers).filter(s =>
            this.suppliers[s].isEnabled()
        );
    }

    mergeAndDedupe(results) {
        const allFlights = results.flatMap(r => r.flights || []);
        // Dedupe by flight number + departure time
        const seen = new Set();
        return allFlights.filter(flight => {
            const key = `${flight.flightNumber}-${flight.departureTime}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    sortFlights(flights, sortBy = 'price') {
        const sortFns = {
            price: (a, b) => a.price.total - b.price.total,
            duration: (a, b) => a.duration - b.duration,
            departure: (a, b) => new Date(a.departureTime) - new Date(b.departureTime),
            arrival: (a, b) => new Date(a.arrivalTime) - new Date(b.arrivalTime)
        };
        return flights.sort(sortFns[sortBy] || sortFns.price);
    }

    generateFilters(flights) {
        const airlines = [...new Set(flights.map(f => f.airline.code))];
        const stops = [...new Set(flights.map(f => f.stops))];
        const prices = flights.map(f => f.price.total);

        return {
            airlines: airlines.map(code => ({
                code,
                name: this.getAirlineName(code),
                minPrice: Math.min(...flights.filter(f => f.airline.code === code).map(f => f.price.total))
            })),
            stops: stops.sort(),
            priceRange: {
                min: Math.min(...prices),
                max: Math.max(...prices)
            },
            departureTimes: ['morning', 'afternoon', 'evening', 'night']
        };
    }

    generateSearchKey() {
        return `SK${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    }

    getCacheKey(type, params) {
        return `${type}:${JSON.stringify(params)}`;
    }

    getFlightFromCache(searchKey, flightKey) {
        // In production, retrieve from Redis
        return null;
    }

    getBookingById(bookingId) {
        // In production, retrieve from database
        return null;
    }

    getBookingByPnr(pnr) {
        // In production, retrieve from database
        return null;
    }

    getAirlineName(code) {
        const airlines = {
            '6E': 'IndiGo',
            'AI': 'Air India',
            'UK': 'Vistara',
            'SG': 'SpiceJet',
            'G8': 'GoFirst',
            'I5': 'AirAsia India'
        };
        return airlines[code] || code;
    }
}

/**
 * Amadeus Adapter
 */
class AmadeusAdapter {
    constructor(config) {
        this.config = config;
        this.token = null;
        this.tokenExpiry = null;
    }

    isEnabled() {
        return !!this.config.apiKey;
    }

    async getToken() {
        if (this.token && this.tokenExpiry > Date.now()) {
            return this.token;
        }

        const response = await axios.post(
            `${this.config.apiUrl}/v1/security/oauth2/token`,
            new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: this.config.apiKey,
                client_secret: this.config.apiSecret
            })
        );

        this.token = response.data.access_token;
        this.tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;
        return this.token;
    }

    async search(params) {
        const token = await this.getToken();
        // Implement Amadeus search API call
        return { flights: [] };
    }

    async reprice(flight) {
        return { valid: true, priceChanged: false, price: flight.price };
    }

    async getSSR(flight) {
        return { meals: [], baggage: [], seats: [] };
    }

    async getSeatMap(flight) {
        return { cabin: [], seatMap: [] };
    }

    async getFareRules(flight) {
        return { rules: [] };
    }

    async createBooking(data) {
        return { bookingId: '', pnr: '', expiresAt: '', totalAmount: 0 };
    }

    async confirmBooking(booking, payment) {
        return { pnr: '', ticketNumbers: [] };
    }

    async cancelTicket(booking, reason) {
        return { status: 'cancelled' };
    }

    async getCancellationCharges(booking) {
        return { charges: 0 };
    }
}

/**
 * TBO Adapter
 */
class TBOAdapter {
    constructor(config) {
        this.config = config;
    }

    isEnabled() {
        return !!this.config.userId;
    }

    async search(params) {
        // Implement TBO search API call
        return { flights: [] };
    }

    async reprice(flight) {
        return { valid: true, priceChanged: false, price: flight.price };
    }

    async getSSR(flight) {
        return { meals: [], baggage: [], seats: [] };
    }

    async getSeatMap(flight) {
        return { cabin: [], seatMap: [] };
    }

    async getFareRules(flight) {
        return { rules: [] };
    }

    async createBooking(data) {
        return { bookingId: '', pnr: '', expiresAt: '', totalAmount: 0 };
    }

    async confirmBooking(booking, payment) {
        return { pnr: '', ticketNumbers: [] };
    }

    async cancelTicket(booking, reason) {
        return { status: 'cancelled' };
    }

    async getCancellationCharges(booking) {
        return { charges: 0 };
    }
}

/**
 * Tripjack Adapter
 */
class TripjackAdapter {
    constructor(config) {
        this.config = config;
    }

    isEnabled() {
        return !!this.config.apiKey;
    }

    async search(params) {
        // Implement Tripjack search API call
        return { flights: [] };
    }

    async reprice(flight) {
        return { valid: true, priceChanged: false, price: flight.price };
    }

    async getSSR(flight) {
        return { meals: [], baggage: [], seats: [] };
    }

    async getSeatMap(flight) {
        return { cabin: [], seatMap: [] };
    }

    async getFareRules(flight) {
        return { rules: [] };
    }

    async createBooking(data) {
        return { bookingId: '', pnr: '', expiresAt: '', totalAmount: 0 };
    }

    async confirmBooking(booking, payment) {
        return { pnr: '', ticketNumbers: [] };
    }

    async cancelTicket(booking, reason) {
        return { status: 'cancelled' };
    }

    async getCancellationCharges(booking) {
        return { charges: 0 };
    }
}

module.exports = new FlightApiService();
