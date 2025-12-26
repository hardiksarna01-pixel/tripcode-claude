require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import configuration
const db = require('./config/database');
const redis = require('./config/redis');

// Import routes
const authRoutes = require('./routes/auth.routes');
const flightRoutes = require('./routes/flight.routes');
const bookingRoutes = require('./routes/booking.routes');
const walletRoutes = require('./routes/wallet.routes');
const agentRoutes = require('./routes/agent.routes');
const adminRoutes = require('./routes/admin.routes');
const markupRoutes = require('./routes/markup.routes');
const customerRoutes = require('./routes/customer.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const invoiceRoutes = require('./routes/invoice.routes');
const groupBookingRoutes = require('./routes/groupBooking.routes');
const fareCalendarRoutes = require('./routes/fareCalendar.routes');

// SaaS/White-label routes
const tenantRoutes = require('./routes/tenant.routes');
const apiKeyRoutes = require('./routes/apiKey.routes');
const subscriptionRoutes = require('./routes/subscription.routes');
const partnerRoutes = require('./routes/partner.routes');

// Import middleware
const { errorHandler } = require('./middleware/error.middleware');
const { authMiddleware } = require('./middleware/auth.middleware');
const { auditMiddleware } = require('./middleware/audit.middleware');
const { apiLimiter, authLimiter } = require('./middleware/rate-limit.middleware');
const { apiKeyAuth, apiRateLimit } = require('./middleware/apiAuth.middleware');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

// Audit middleware for all routes
app.use(auditMiddleware);

// Health check
app.get('/health', async (req, res) => {
    const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        services: {
            database: 'unknown',
            redis: 'unknown'
        }
    };

    // Check database
    try {
        await db.query('SELECT 1');
        health.services.database = 'connected';
    } catch (error) {
        health.services.database = 'disconnected';
        health.status = 'degraded';
    }

    // Check Redis
    health.services.redis = redis.isAvailable() ? 'connected' : 'disconnected';

    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
});

// API Routes
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/flights', authMiddleware, flightRoutes);
app.use('/api/v1/bookings', authMiddleware, bookingRoutes);
app.use('/api/v1/wallet', authMiddleware, walletRoutes);
app.use('/api/v1/agents', authMiddleware, agentRoutes);
app.use('/api/v1/admin', adminRoutes); // Admin routes have their own auth
app.use('/api/v1/markups', authMiddleware, markupRoutes);
app.use('/api/v1/customers', authMiddleware, customerRoutes);
app.use('/api/v1/analytics', authMiddleware, analyticsRoutes);
app.use('/api/v1/invoices', authMiddleware, invoiceRoutes);
app.use('/api/v1/group-bookings', authMiddleware, groupBookingRoutes);
app.use('/api/v1/fare-calendar', authMiddleware, fareCalendarRoutes);

// SaaS/White-label Routes (Super Admin)
app.use('/api/v1/tenants', tenantRoutes);
app.use('/api/v1/api-keys', apiKeyRoutes);
app.use('/api/v1/subscriptions', subscriptionRoutes);
app.use('/api/v1/partners', partnerRoutes);

// Public API (for API-as-a-Service customers)
app.use('/api/public/v1/flights', apiKeyAuth, apiRateLimit, flightRoutes);
app.use('/api/public/v1/bookings', apiKeyAuth, apiRateLimit, bookingRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

const PORT = process.env.PORT || 3001;

/**
 * Initialize application
 */
async function startServer() {
    try {
        // Connect to database
        console.log('Connecting to database...');
        await db.connect();

        // Connect to Redis (optional - continues without it)
        console.log('Connecting to Redis...');
        await redis.connect();

        // Start server
        app.listen(PORT, () => {
            console.log(`\n🚀 B2B Travel API running on port ${PORT}`);
            console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health\n`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    await db.close();
    await redis.close();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received. Shutting down gracefully...');
    await db.close();
    await redis.close();
    process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

startServer();

module.exports = app;
