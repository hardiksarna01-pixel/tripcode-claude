require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import configuration (in-memory mocks)
const db = require('./config/database');
const redis = require('./config/redis');

// Helper to safely require modules
function safeRequire(modulePath, moduleName) {
    try {
        return require(modulePath);
    } catch (error) {
        console.warn(`⚠️ Could not load ${moduleName}: ${error.message}`);
        return null;
    }
}

// Import middleware
const { errorHandler } = require('./middleware/error.middleware');
const { authMiddleware } = require('./middleware/auth.middleware');
const { auditMiddleware } = require('./middleware/audit.middleware');
const { apiLimiter, authLimiter } = require('./middleware/rate-limit.middleware');

// Safely import apiAuth middleware
let apiKeyAuth, apiRateLimit;
try {
    const apiAuthModule = require('./middleware/apiAuth.middleware');
    apiKeyAuth = apiAuthModule.apiKeyAuth;
    apiRateLimit = apiAuthModule.apiRateLimit;
} catch (error) {
    console.warn('⚠️ API auth middleware not available:', error.message);
    apiKeyAuth = (req, res, next) => next();
    apiRateLimit = (req, res, next) => next();
}

// Import routes safely
const authRoutes = safeRequire('./routes/auth.routes', 'auth routes');
const flightRoutes = safeRequire('./routes/flight.routes', 'flight routes');
const bookingRoutes = safeRequire('./routes/booking.routes', 'booking routes');
const walletRoutes = safeRequire('./routes/wallet.routes', 'wallet routes');
const agentRoutes = safeRequire('./routes/agent.routes', 'agent routes');
const adminRoutes = safeRequire('./routes/admin.routes', 'admin routes');
const markupRoutes = safeRequire('./routes/markup.routes', 'markup routes');
const customerRoutes = safeRequire('./routes/customer.routes', 'customer routes');
const analyticsRoutes = safeRequire('./routes/analytics.routes', 'analytics routes');
const invoiceRoutes = safeRequire('./routes/invoice.routes', 'invoice routes');
const groupBookingRoutes = safeRequire('./routes/groupBooking.routes', 'group booking routes');
const fareCalendarRoutes = safeRequire('./routes/fareCalendar.routes', 'fare calendar routes');

// SaaS/White-label routes
const tenantRoutes = safeRequire('./routes/tenant.routes', 'tenant routes');
const apiKeyRoutes = safeRequire('./routes/apiKey.routes', 'API key routes');
const subscriptionRoutes = safeRequire('./routes/subscription.routes', 'subscription routes');
const partnerRoutes = safeRequire('./routes/partner.routes', 'partner routes');

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
        mode: 'demo (in-memory storage)',
        services: {
            database: 'in-memory',
            redis: 'in-memory'
        }
    };

    res.json(health);
});

// Helper to mount route if available
function mountRoute(path, middleware, router, name) {
    if (router) {
        if (middleware) {
            app.use(path, middleware, router);
        } else {
            app.use(path, router);
        }
        console.log(`✓ Mounted ${name} at ${path}`);
    } else {
        console.log(`✗ Skipped ${name} (not available)`);
    }
}

// API Routes
mountRoute('/api/v1/auth', authLimiter, authRoutes, 'auth');
mountRoute('/api/v1/flights', authMiddleware, flightRoutes, 'flights');
mountRoute('/api/v1/bookings', authMiddleware, bookingRoutes, 'bookings');
mountRoute('/api/v1/wallet', authMiddleware, walletRoutes, 'wallet');
mountRoute('/api/v1/agents', authMiddleware, agentRoutes, 'agents');
mountRoute('/api/v1/admin', null, adminRoutes, 'admin'); // Admin routes have their own auth
mountRoute('/api/v1/markups', authMiddleware, markupRoutes, 'markups');
mountRoute('/api/v1/customers', authMiddleware, customerRoutes, 'customers');
mountRoute('/api/v1/analytics', authMiddleware, analyticsRoutes, 'analytics');
mountRoute('/api/v1/invoices', authMiddleware, invoiceRoutes, 'invoices');
mountRoute('/api/v1/group-bookings', authMiddleware, groupBookingRoutes, 'group-bookings');
mountRoute('/api/v1/fare-calendar', authMiddleware, fareCalendarRoutes, 'fare-calendar');

// SaaS/White-label Routes (Super Admin)
mountRoute('/api/v1/tenants', null, tenantRoutes, 'tenants');
mountRoute('/api/v1/api-keys', null, apiKeyRoutes, 'api-keys');
mountRoute('/api/v1/subscriptions', null, subscriptionRoutes, 'subscriptions');
mountRoute('/api/v1/partners', null, partnerRoutes, 'partners');

// Public API (for API-as-a-Service customers)
if (flightRoutes) {
    app.use('/api/public/v1/flights', apiKeyAuth, apiRateLimit, flightRoutes);
}
if (bookingRoutes) {
    app.use('/api/public/v1/bookings', apiKeyAuth, apiRateLimit, bookingRoutes);
}

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
        console.log('\n========================================');
        console.log('  B2B Travel Portal - Demo Mode');
        console.log('========================================\n');

        // Connect to in-memory database
        console.log('Initializing in-memory database...');
        await db.connect();

        // Connect to in-memory cache
        console.log('Initializing in-memory cache...');
        await redis.connect();

        // Start server
        app.listen(PORT, () => {
            console.log(`\n🚀 B2B Travel API running on port ${PORT}`);
            console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
            console.log(`\n⚠️  Running in DEMO mode with in-memory storage`);
            console.log(`   Data will be lost when server restarts\n`);
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
    console.log('\nSIGINT received. Shutting down gracefully...');
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
