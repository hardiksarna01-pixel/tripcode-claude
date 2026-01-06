/**
 * API Documentation Controller
 */

class DocsController {
    async getApiDocs(req, res) {
        try {
            res.json({
                success: true,
                data: {
                    openapi: '3.0.0',
                    info: {
                        title: 'B2B/B2C Travel Portal API',
                        version: '1.0.0',
                        description: 'Complete API documentation for the travel booking platform'
                    },
                    servers: [
                        { url: '/api/v1', description: 'Production server' }
                    ],
                    tags: [
                        { name: 'Authentication', description: 'User authentication endpoints' },
                        { name: 'Flights', description: 'Flight search and booking' },
                        { name: 'Hotels', description: 'Hotel search and booking' },
                        { name: 'Buses', description: 'Bus search and booking' },
                        { name: 'Holidays', description: 'Holiday packages' },
                        { name: 'Wallet', description: 'Agent wallet operations' },
                        { name: 'Bookings', description: 'Booking management' }
                    ]
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get API docs' });
        }
    }

    async getEndpoints(req, res) {
        try {
            res.json({
                success: true,
                data: {
                    authentication: [
                        { method: 'POST', path: '/auth/login', description: 'User login' },
                        { method: 'POST', path: '/auth/register', description: 'User registration' },
                        { method: 'POST', path: '/auth/refresh', description: 'Refresh access token' }
                    ],
                    flights: [
                        { method: 'POST', path: '/flights/search', description: 'Search flights' },
                        { method: 'POST', path: '/flights/book', description: 'Book flight' },
                        { method: 'GET', path: '/flights/booking/:id', description: 'Get booking details' }
                    ],
                    hotels: [
                        { method: 'POST', path: '/hotels/search', description: 'Search hotels' },
                        { method: 'POST', path: '/hotels/book', description: 'Book hotel' }
                    ]
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get endpoints' });
        }
    }

    async getPostmanCollection(req, res) {
        try {
            res.json({
                info: {
                    name: 'Travel Portal API',
                    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
                },
                item: [
                    {
                        name: 'Authentication',
                        item: [
                            { name: 'Login', request: { method: 'POST', url: '{{baseUrl}}/auth/login' } },
                            { name: 'Register', request: { method: 'POST', url: '{{baseUrl}}/auth/register' } }
                        ]
                    }
                ],
                variable: [
                    { key: 'baseUrl', value: 'http://localhost:3001/api/v1' }
                ]
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get Postman collection' });
        }
    }

    async getChangelog(req, res) {
        try {
            const changelog = [
                { version: '1.0.0', date: '2024-01-15', changes: ['Initial release', 'Flight booking', 'Hotel booking'] },
                { version: '1.1.0', date: '2024-02-01', changes: ['Added bus booking', 'Wallet system', 'Agent dashboard'] },
                { version: '1.2.0', date: '2024-03-01', changes: ['Holiday packages', 'Visa services', 'Insurance'] }
            ];
            res.json({ success: true, data: changelog });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get changelog' });
        }
    }
}

module.exports = new DocsController();
