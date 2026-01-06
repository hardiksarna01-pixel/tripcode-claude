/**
 * API Documentation Routes
 */

const express = require('express');
const router = express.Router();

// Swagger UI
router.get('/', (req, res) => {
    res.json({
        name: 'B2B/B2C Travel Portal API',
        version: '1.0.0',
        documentation: '/api/v1/docs/swagger',
        endpoints: {
            auth: '/api/v1/auth',
            flights: '/api/v1/flights',
            hotels: '/api/v1/hotels',
            bus: '/api/v1/bus',
            holidays: '/api/v1/holidays',
            activities: '/api/v1/activities',
            insurance: '/api/v1/insurance',
            visa: '/api/v1/visa',
            transfers: '/api/v1/transfers',
            bookings: '/api/v1/bookings',
            wallet: '/api/v1/wallet',
            payments: '/api/v1/payments',
            ai: '/api/v1/ai',
            admin: '/api/v1/admin/*',
            superadmin: '/api/v1/superadmin'
        }
    });
});

// Swagger JSON
router.get('/swagger.json', (req, res) => {
    const swaggerSpec = require('../docs/swagger.json');
    res.json(swaggerSpec);
});

// Postman collection
router.get('/postman', (req, res) => {
    const postmanCollection = require('../docs/postman.json');
    res.json(postmanCollection);
});

module.exports = router;
