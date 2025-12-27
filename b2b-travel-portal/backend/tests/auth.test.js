/**
 * Authentication Tests
 */

const request = require('supertest');

// Mock the database and redis before requiring the app
jest.mock('../src/config/database', () => ({
    connect: jest.fn().mockResolvedValue(true),
    query: jest.fn(),
    close: jest.fn()
}));

jest.mock('../src/config/redis', () => ({
    connect: jest.fn().mockResolvedValue(true),
    isAvailable: jest.fn().mockReturnValue(false),
    close: jest.fn()
}));

const app = require('../src/index');
const db = require('../src/config/database');
const bcrypt = require('bcryptjs');

describe('Authentication API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/v1/auth/register', () => {
        it('should register a new agent successfully', async () => {
            db.query.mockResolvedValueOnce({ rows: [] }); // Check existing
            db.query.mockResolvedValueOnce({ rows: [{ agent_code: 'AGT10000' }] }); // Generate code
            db.query.mockResolvedValueOnce({
                rows: [{
                    id: 1,
                    agent_code: 'AGT10001',
                    email: 'test@example.com',
                    company_name: 'Test Company'
                }]
            }); // Insert

            const res = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    companyName: 'Test Company',
                    contactPerson: 'John Doe',
                    mobile: '9876543210',
                    apiUserId: 'API123',
                    apiPassword: 'apipass123'
                });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('token');
            expect(res.body.data.agent).toHaveProperty('email', 'test@example.com');
        });

        it('should fail registration with missing required fields', async () => {
            const res = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    email: 'test@example.com'
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should fail registration if email already exists', async () => {
            db.query.mockResolvedValueOnce({
                rows: [{ id: 1, email: 'existing@example.com' }]
            });

            const res = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    email: 'existing@example.com',
                    password: 'password123',
                    apiUserId: 'API123',
                    apiPassword: 'apipass123'
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toContain('already');
        });
    });

    describe('POST /api/v1/auth/login', () => {
        it('should login successfully with valid credentials', async () => {
            const hashedPassword = await bcrypt.hash('password123', 10);

            db.query.mockResolvedValueOnce({
                rows: [{
                    id: 1,
                    email: 'test@example.com',
                    password_hash: hashedPassword,
                    company_name: 'Test Company',
                    status: 'APPROVED',
                    api_user_id: 'API123',
                    api_password_hash: 'HASH123'
                }]
            });

            db.query.mockResolvedValueOnce({ rows: [] }); // Update last login

            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('token');
        });

        it('should fail login with invalid password', async () => {
            const hashedPassword = await bcrypt.hash('password123', 10);

            db.query.mockResolvedValueOnce({
                rows: [{
                    id: 1,
                    email: 'test@example.com',
                    password_hash: hashedPassword,
                    status: 'APPROVED'
                }]
            });

            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                });

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('should fail login with non-existent user', async () => {
            db.query.mockResolvedValueOnce({ rows: [] });

            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123'
                });

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /api/v1/auth/me', () => {
        it('should return current user with valid token', async () => {
            // First login to get token
            const hashedPassword = await bcrypt.hash('password123', 10);

            db.query.mockResolvedValueOnce({
                rows: [{
                    id: 1,
                    email: 'test@example.com',
                    password_hash: hashedPassword,
                    company_name: 'Test Company',
                    status: 'APPROVED',
                    api_user_id: 'API123',
                    api_password_hash: 'HASH123'
                }]
            });
            db.query.mockResolvedValueOnce({ rows: [] });

            const loginRes = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            const token = loginRes.body.data.token;

            // Mock for /me endpoint
            db.query.mockResolvedValueOnce({
                rows: [{
                    id: 1,
                    email: 'test@example.com',
                    company_name: 'Test Company'
                }]
            });

            const res = await request(app)
                .get('/api/v1/auth/me')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should fail without authorization header', async () => {
            const res = await request(app)
                .get('/api/v1/auth/me');

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('should fail with invalid token', async () => {
            const res = await request(app)
                .get('/api/v1/auth/me')
                .set('Authorization', 'Bearer invalid-token');

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });
});

describe('Health Check', () => {
    it('should return healthy status', async () => {
        db.query.mockResolvedValueOnce({ rows: [{ 1: 1 }] });

        const res = await request(app).get('/health');

        expect(res.status).toBe(200);
        expect(res.body.status).toBeDefined();
        expect(res.body.version).toBe('1.0.0');
    });
});
