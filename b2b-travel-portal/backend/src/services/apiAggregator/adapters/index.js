/**
 * API Adapters - Transform different API formats to unified format
 *
 * Each adapter handles a specific API format and normalizes it
 * to a common structure that the aggregator can work with
 */

const axios = require('axios');

/**
 * Base Adapter class
 */
class BaseAdapter {
    constructor(config) {
        this.config = config;
        this.client = axios.create({
            baseURL: config.baseUrl,
            timeout: config.timeout || 30000,
            headers: this.getDefaultHeaders()
        });
    }

    getDefaultHeaders() {
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    async searchFlights(params) {
        throw new Error('searchFlights must be implemented');
    }

    async priceFlights(params) {
        throw new Error('priceFlights must be implemented');
    }

    async bookFlight(params) {
        throw new Error('bookFlight must be implemented');
    }

    // Common utility methods
    formatDate(date) {
        if (typeof date === 'string') return date;
        return date.toISOString().split('T')[0];
    }

    parsePrice(price) {
        if (typeof price === 'number') return price;
        return parseFloat(String(price).replace(/[^0-9.]/g, '')) || 0;
    }
}

/**
 * Amadeus GDS Adapter
 */
class AmadeusAdapter extends BaseAdapter {
    constructor(config) {
        super(config);
        this.accessToken = null;
        this.tokenExpiry = null;
    }

    async getAccessToken() {
        if (this.accessToken && this.tokenExpiry > Date.now()) {
            return this.accessToken;
        }

        // In production, implement OAuth token refresh
        this.accessToken = process.env.AMADEUS_ACCESS_TOKEN || 'demo_token';
        this.tokenExpiry = Date.now() + 1800000; // 30 minutes
        return this.accessToken;
    }

    async searchFlights(params) {
        const token = await this.getAccessToken();

        const requestBody = {
            currencyCode: params.currency || 'INR',
            originDestinations: [{
                id: '1',
                originLocationCode: params.origin,
                destinationLocationCode: params.destination,
                departureDateTimeRange: {
                    date: this.formatDate(params.departureDate)
                }
            }],
            travelers: this.buildTravelers(params),
            sources: ['GDS'],
            searchCriteria: {
                maxFlightOffers: params.maxResults || 50,
                flightFilters: {
                    cabinRestrictions: [{
                        cabin: this.mapCabinClass(params.cabinClass),
                        coverage: 'MOST_SEGMENTS',
                        originDestinationIds: ['1']
                    }]
                }
            }
        };

        if (params.returnDate) {
            requestBody.originDestinations.push({
                id: '2',
                originLocationCode: params.destination,
                destinationLocationCode: params.origin,
                departureDateTimeRange: {
                    date: this.formatDate(params.returnDate)
                }
            });
        }

        // Simulate API call (in production, make actual request)
        return this.simulateResponse(params);
    }

    buildTravelers(params) {
        const travelers = [];
        let id = 1;

        for (let i = 0; i < (params.adults || 1); i++) {
            travelers.push({ id: String(id++), travelerType: 'ADULT' });
        }
        for (let i = 0; i < (params.children || 0); i++) {
            travelers.push({ id: String(id++), travelerType: 'CHILD' });
        }
        for (let i = 0; i < (params.infants || 0); i++) {
            travelers.push({ id: String(id++), travelerType: 'HELD_INFANT' });
        }

        return travelers;
    }

    mapCabinClass(cabin) {
        const mapping = {
            'economy': 'ECONOMY',
            'premium_economy': 'PREMIUM_ECONOMY',
            'business': 'BUSINESS',
            'first': 'FIRST'
        };
        return mapping[cabin] || 'ECONOMY';
    }

    simulateResponse(params) {
        // Generate realistic mock data
        return {
            flights: this.generateMockFlights(params, 5)
        };
    }

    generateMockFlights(params, count) {
        const flights = [];
        const airlines = ['AI', '6E', 'UK', 'SG', 'G8'];
        const basePrice = params.cabinClass === 'business' ? 15000 : 4500;

        for (let i = 0; i < count; i++) {
            const airline = airlines[Math.floor(Math.random() * airlines.length)];
            const price = basePrice + Math.floor(Math.random() * 3000);

            flights.push({
                id: `amadeus_${Date.now()}_${i}`,
                price: {
                    total: price,
                    currency: 'INR',
                    base: price * 0.85,
                    fees: price * 0.15
                },
                itineraries: [{
                    segments: [{
                        departure: {
                            iataCode: params.origin,
                            at: `${params.departureDate}T${6 + i}:00:00`
                        },
                        arrival: {
                            iataCode: params.destination,
                            at: `${params.departureDate}T${8 + i}:30:00`
                        },
                        carrierCode: airline,
                        number: `${100 + i}`,
                        duration: 'PT2H30M'
                    }]
                }],
                source: 'GDS'
            });
        }

        return flights;
    }
}

/**
 * TripJack Consolidator Adapter
 */
class TripJackAdapter extends BaseAdapter {
    async searchFlights(params) {
        const requestBody = {
            searchQuery: {
                cabinClass: this.mapCabinClass(params.cabinClass),
                paxInfo: {
                    ADULT: params.adults || 1,
                    CHILD: params.children || 0,
                    INFANT: params.infants || 0
                },
                routeInfos: [{
                    fromCityOrAirport: { code: params.origin },
                    toCityOrAirport: { code: params.destination },
                    travelDate: this.formatDate(params.departureDate)
                }],
                searchModifiers: {
                    isDirectFlight: params.directOnly || false,
                    isConnectingFlight: !params.directOnly
                }
            }
        };

        if (params.returnDate) {
            requestBody.searchQuery.routeInfos.push({
                fromCityOrAirport: { code: params.destination },
                toCityOrAirport: { code: params.origin },
                travelDate: this.formatDate(params.returnDate)
            });
        }

        return this.simulateResponse(params);
    }

    mapCabinClass(cabin) {
        return (cabin || 'economy').toUpperCase();
    }

    simulateResponse(params) {
        return {
            searchResult: {
                tripInfos: this.generateMockFlights(params, 8)
            }
        };
    }

    generateMockFlights(params, count) {
        const flights = [];
        const airlines = ['6E', 'SG', 'AI', 'UK', 'I5', 'G8'];

        for (let i = 0; i < count; i++) {
            const airline = airlines[Math.floor(Math.random() * airlines.length)];
            const basePrice = 3500 + Math.floor(Math.random() * 4000);

            flights.push({
                tripId: `tj_${Date.now()}_${i}`,
                totalPriceInfo: {
                    totalFareDetail: {
                        fC: { TF: basePrice }
                    }
                },
                sI: [{
                    fD: {
                        aI: { code: airline, name: this.getAirlineName(airline) },
                        fN: `${200 + i}`
                    },
                    da: {
                        code: params.origin,
                        dateTime: `${params.departureDate}T${7 + i}:15:00`
                    },
                    aa: {
                        code: params.destination,
                        dateTime: `${params.departureDate}T${9 + i}:45:00`
                    },
                    duration: 150
                }]
            });
        }

        return flights;
    }

    getAirlineName(code) {
        const names = {
            '6E': 'IndiGo', 'SG': 'SpiceJet', 'AI': 'Air India',
            'UK': 'Vistara', 'I5': 'AirAsia India', 'G8': 'Go First'
        };
        return names[code] || code;
    }
}

/**
 * Generic REST Adapter for simple APIs
 */
class GenericRestAdapter extends BaseAdapter {
    async searchFlights(params) {
        const endpoint = this.config.endpoints?.search || '/search';

        const requestBody = {
            origin: params.origin,
            destination: params.destination,
            departureDate: this.formatDate(params.departureDate),
            returnDate: params.returnDate ? this.formatDate(params.returnDate) : null,
            passengers: {
                adults: params.adults || 1,
                children: params.children || 0,
                infants: params.infants || 0
            },
            cabinClass: params.cabinClass || 'economy',
            directOnly: params.directOnly || false
        };

        return this.simulateResponse(params);
    }

    simulateResponse(params) {
        return {
            flights: this.generateMockFlights(params, 4)
        };
    }

    generateMockFlights(params, count) {
        const flights = [];
        const basePrice = 4000 + Math.floor(Math.random() * 2000);

        for (let i = 0; i < count; i++) {
            flights.push({
                flightId: `gen_${Date.now()}_${i}`,
                fare: basePrice + (i * 500),
                currency: 'INR',
                segments: [{
                    origin: params.origin,
                    destination: params.destination,
                    departureTime: `${params.departureDate}T${8 + i}:00:00`,
                    arrivalTime: `${params.departureDate}T${10 + i}:30:00`,
                    airline: 'XX',
                    flightNumber: `${300 + i}`
                }]
            });
        }

        return flights;
    }
}

/**
 * Skyscanner Meta Adapter
 */
class SkyscannerAdapter extends BaseAdapter {
    async searchFlights(params) {
        return this.simulateResponse(params);
    }

    simulateResponse(params) {
        return {
            Quotes: this.generateQuotes(params, 6),
            Carriers: this.getCarriers(),
            Places: this.getPlaces(params)
        };
    }

    generateQuotes(params, count) {
        const quotes = [];

        for (let i = 0; i < count; i++) {
            quotes.push({
                QuoteId: i + 1,
                MinPrice: 3200 + (i * 400),
                Direct: i % 2 === 0,
                OutboundLeg: {
                    CarrierIds: [1000 + (i % 3)],
                    OriginId: 1,
                    DestinationId: 2,
                    DepartureDate: params.departureDate
                }
            });
        }

        return quotes;
    }

    getCarriers() {
        return [
            { CarrierId: 1000, Name: 'IndiGo', Code: '6E' },
            { CarrierId: 1001, Name: 'Air India', Code: 'AI' },
            { CarrierId: 1002, Name: 'Vistara', Code: 'UK' }
        ];
    }

    getPlaces(params) {
        return [
            { PlaceId: 1, IataCode: params.origin, Name: params.origin },
            { PlaceId: 2, IataCode: params.destination, Name: params.destination }
        ];
    }
}

/**
 * LCC (Low Cost Carrier) Direct Adapter
 */
class LCCAdapter extends BaseAdapter {
    async searchFlights(params) {
        return this.simulateResponse(params);
    }

    simulateResponse(params) {
        const carrierCode = this.config.carrierCode || '6E';

        return {
            data: {
                flights: this.generateFlights(params, carrierCode, 3)
            }
        };
    }

    generateFlights(params, carrierCode, count) {
        const flights = [];
        const basePrice = 2800;

        for (let i = 0; i < count; i++) {
            flights.push({
                flightKey: `${carrierCode}_${Date.now()}_${i}`,
                carrier: carrierCode,
                flightNumber: `${carrierCode}${400 + i}`,
                departure: {
                    airport: params.origin,
                    time: `${params.departureDate}T${6 + (i * 2)}:00:00`
                },
                arrival: {
                    airport: params.destination,
                    time: `${params.departureDate}T${8 + (i * 2)}:15:00`
                },
                fare: {
                    base: basePrice + (i * 300),
                    taxes: 500,
                    total: basePrice + (i * 300) + 500
                },
                availability: 9 - i
            });
        }

        return flights;
    }
}

/**
 * Adapter Factory
 */
function createAdapter(config) {
    const format = config.responseFormat || 'generic';

    switch (format.toLowerCase()) {
        case 'amadeus':
            return new AmadeusAdapter(config);
        case 'tripjack':
            return new TripJackAdapter(config);
        case 'skyscanner':
            return new SkyscannerAdapter(config);
        case 'indigo':
        case 'spicejet':
        case 'airasia':
        case 'goair':
            return new LCCAdapter(config);
        case 'sabre':
        case 'travelport':
        case 'tbo':
        case 'riya':
        case 'kiwi':
        case 'google-qpx':
        case 'emirates':
        case 'qatar':
        case 'singapore-airlines':
        case 'etihad':
        case 'airindia':
        case 'vistara':
        default:
            return new GenericRestAdapter(config);
    }
}

module.exports = {
    BaseAdapter,
    AmadeusAdapter,
    TripJackAdapter,
    SkyscannerAdapter,
    LCCAdapter,
    GenericRestAdapter,
    createAdapter
};
