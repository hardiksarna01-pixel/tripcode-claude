/**
 * Flight API Tests
 */

const request = require('supertest');
const jwt = require('jsonwebtoken');

// Mock the database and redis before requiring the app
jest.mock('../src/config/database', () => ({
    connect: jest.fn().mockResolvedValue(true),
    query: jest.fn(),
    close: jest.fn()
}));

jest.mock('../src/config/redis', () => ({
    connect: jest.fn().mockResolvedValue(true),
    isAvailable: jest.fn().mockReturnValue(true),
    get: jest.fn(),
    set: jest.fn(),
    getCachedSectors: jest.fn(),
    cacheSectors: jest.fn(),
    getCachedSearchResults: jest.fn(),
    cacheSearchResults: jest.fn(),
    close: jest.fn()
}));

jest.mock('../src/services/flight-api.service', () => ({
    getSectorAvailability: jest.fn(),
    searchFlights: jest.fn(),
    repriceFlights: jest.fn(),
    getSSR: jest.fn(),
    getSeatMap: jest.fn()
}));

const app = require('../src/index');
const db = require('../src/config/database');
const redis = require('../src/config/redis');
const flightApiService = require('../src/services/flight-api.service');

describe('Flight API', () => {
    let authToken;

    beforeAll(() => {
        // Generate a valid JWT token for testing
        authToken = jwt.sign(
            { id: 1, email: 'test@example.com' },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock agent lookup for auth middleware
        db.query.mockImplementation((query) => {
            if (query.includes('SELECT * FROM agents')) {
                return Promise.resolve({
                    rows: [{
                        id: 1,
                        email: 'test@example.com',
                        company_name: 'Test Company',
                        api_user_id: 'API123',
                        api_password_hash: 'HASH123',
                        status: 'APPROVED'
                    }]
                });
            }
            return Promise.resolve({ rows: [] });
        });
    });

    describe('GET /api/v1/flights/sectors', () => {
        it('should return sector availability', async () => {
            redis.getCachedSectors.mockResolvedValue(null);
            flightApiService.getSectorAvailability.mockResolvedValue({
                sectors: [
                    { origin: 'DEL', destination: 'BOM', availableDates: ['2024-01-15'] },
                    { origin: 'BOM', destination: 'BLR', availableDates: ['2024-01-16'] }
                ]
            });
            redis.cacheSectors.mockResolvedValue(true);

            const res = await request(app)
                .get('/api/v1/flights/sectors')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.sectors).toBeDefined();
        });

        it('should return cached sectors if available', async () => {
            const cachedData = {
                sectors: [{ origin: 'DEL', destination: 'BOM' }]
            };
            redis.getCachedSectors.mockResolvedValue(cachedData);

            const res = await request(app)
                .get('/api/v1/flights/sectors')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);
            expect(flightApiService.getSectorAvailability).not.toHaveBeenCalled();
        });

        it('should fail without authentication', async () => {
            const res = await request(app)
                .get('/api/v1/flights/sectors');

            expect(res.status).toBe(401);
        });
    });

    describe('POST /api/v1/flights/search', () => {
        it('should search flights successfully', async () => {
            flightApiService.searchFlights.mockResolvedValue({
                searchKey: 'SEARCH123',
                trips: [{
                    tripId: 0,
                    flights: [{
                        flightId: 'FL001',
                        origin: 'DEL',
                        destination: 'BOM',
                        segments: [],
                        fares: [{
                            fareId: 'FARE001',
                            fareDetails: [{ totalAmount: 5000 }]
                        }]
                    }]
                }]
            });

            const res = await request(app)
                .post('/api/v1/flights/search')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    origin: 'DEL',
                    destination: 'BOM',
                    travelDate: '2024-01-15',
                    adults: 1
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.searchKey).toBe('SEARCH123');
            expect(res.body.data.trips).toBeDefined();
        });

        it('should validate required search parameters', async () => {
            const res = await request(app)
                .post('/api/v1/flights/search')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    origin: 'DEL'
                    // Missing destination and travelDate
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should handle search API errors', async () => {
            flightApiService.searchFlights.mockRejectedValue({
                code: 'API_ERROR',
                message: 'No flights available'
            });

            const res = await request(app)
                .post('/api/v1/flights/search')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    origin: 'DEL',
                    destination: 'BOM',
                    travelDate: '2024-01-15',
                    adults: 1
                });

            expect(res.status).toBe(500);
        });
    });

    describe('POST /api/v1/flights/reprice', () => {
        it('should reprice selected flights', async () => {
            flightApiService.repriceFlights.mockResolvedValue({
                flights: [{
                    flight: {
                        flightId: 'FL001',
                        fares: [{ fareId: 'FARE001', fareDetails: [{ totalAmount: 5000 }] }]
                    },
                    isFareChanged: false
                }]
            });

            const res = await request(app)
                .post('/api/v1/flights/reprice')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    searchKey: 'SEARCH123',
                    selectedFlights: [
                        { flightId: 'FL001', fareId: 'FARE001' }
                    ]
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.flights).toBeDefined();
        });

        it('should indicate when fare has changed', async () => {
            flightApiService.repriceFlights.mockResolvedValue({
                flights: [{
                    flight: {
                        flightId: 'FL001',
                        fares: [{ fareId: 'FARE001', fareDetails: [{ totalAmount: 5500 }] }]
                    },
                    isFareChanged: true
                }]
            });

            const res = await request(app)
                .post('/api/v1/flights/reprice')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    searchKey: 'SEARCH123',
                    selectedFlights: [
                        { flightId: 'FL001', fareId: 'FARE001' }
                    ]
                });

            expect(res.status).toBe(200);
            expect(res.body.data.flights[0].isFareChanged).toBe(true);
        });
    });

    describe('POST /api/v1/flights/ssr', () => {
        it('should return SSR options for a flight', async () => {
            flightApiService.getSSR.mockResolvedValue({
                ssrFlights: [{
                    ssrOptions: [
                        { ssrType: 1, ssrTypeName: 'MEAL', totalAmount: 350 },
                        { ssrType: 2, ssrTypeName: 'BAGGAGE', totalAmount: 500 }
                    ]
                }]
            });

            const res = await request(app)
                .post('/api/v1/flights/ssr')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    searchKey: 'SEARCH123',
                    flightKey: 'FLIGHT_KEY_001'
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.grouped).toBeDefined();
        });
    });

    describe('GET /api/v1/flights/airlines', () => {
        it('should return list of airlines', async () => {
            const res = await request(app)
                .get('/api/v1/flights/airlines')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe('GET /api/v1/flights/airports', () => {
        it('should return list of airports', async () => {
            const res = await request(app)
                .get('/api/v1/flights/airports')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        it('should filter airports by query', async () => {
            const res = await request(app)
                .get('/api/v1/flights/airports?query=del')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });
});
