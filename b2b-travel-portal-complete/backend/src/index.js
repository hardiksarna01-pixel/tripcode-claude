/**
 * B2B/B2C Travel Portal - Main Application Entry
 * Complete Travel Booking System
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./config');

// Import Security Modules
const {
    rateLimiters,
    securityHeaders,
    sanitizeInput,
    preventSQLInjection,
    DDoSProtection,
    AuditLogger,
    HealthMonitor
} = require('./security');

// Import Auth Middleware
const { authenticateAdmin, authenticateSuperAdmin } = require('./middleware/auth.middleware');

// Validate critical security configuration
if (config.server.env === 'production') {
    if (config.jwt.secret === 'your-super-secret-jwt-key' ||
        config.jwt.adminSecret === 'your-admin-secret-key') {
        console.error('CRITICAL SECURITY ERROR: Default JWT secrets detected in production!');
        console.error('Please set JWT_SECRET and ADMIN_JWT_SECRET environment variables.');
        process.exit(1);
    }
    if (config.encryption.key === 'your-32-character-secret-key!!') {
        console.error('CRITICAL SECURITY ERROR: Default encryption key detected in production!');
        console.error('Please set ENCRYPTION_KEY environment variable.');
        process.exit(1);
    }
}

// Initialize Express App
const app = express();

// Trust proxy (for correct IP detection behind load balancers)
app.set('trust proxy', 1);

// Security Middleware - Enhanced
app.use(securityHeaders);
app.use(cors(config.cors));

// DDoS Protection
app.use(DDoSProtection.middleware());

// Health Monitoring
app.use(HealthMonitor.getMiddleware());

// Audit Logging (for non-health endpoints)
app.use((req, res, next) => {
    if (!req.path.includes('/health')) {
        AuditLogger.getAuditMiddleware()(req, res, next);
    } else {
        next();
    }
});

// Rate Limiting - Tiered
app.use('/api/v1/auth', rateLimiters.auth);
app.use('/api/v1/admin/auth', rateLimiters.auth);
app.use('/api/v1/flights/search', rateLimiters.search);
app.use('/api/v1/hotels/search', rateLimiters.search);
app.use('/api/v1/bookings', rateLimiters.booking);
app.use('/api/v1/ai', rateLimiters.ai);
app.use('/api/', rateLimiters.general);

// Request Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input Sanitization & SQL Injection Prevention
app.use(sanitizeInput);
app.use(preventSQLInjection);

// Compression
app.use(compression());

// Logging
if (config.server.env !== 'test') {
    app.use(morgan(config.logging.format));
}

// Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Security Health Check (admin only - provides security status)
app.get('/api/v1/admin/security/health', authenticateAdmin, (req, res) => {
    const securityStatus = {
        status: 'secure',
        timestamp: new Date().toISOString(),
        checks: {
            authentication: 'enabled',
            rateLimiting: 'enabled',
            ddosProtection: 'enabled',
            inputSanitization: 'enabled',
            sqlInjectionPrevention: 'enabled',
            xssProtection: 'enabled',
            securityHeaders: 'enabled',
            auditLogging: 'enabled',
            encryption: config.server.env === 'production' ? 'enforced' : 'development-mode'
        },
        healthMetrics: HealthMonitor.getHealth(),
        warnings: []
    };

    // Add warnings for development mode
    if (config.server.env !== 'production') {
        securityStatus.warnings.push('Running in development mode - security checks relaxed');
        if (config.jwt.secret === 'your-super-secret-jwt-key') {
            securityStatus.warnings.push('Using default JWT secret - change for production');
        }
    }

    res.json(securityStatus);
});

// =====================================================
// API ROUTES
// =====================================================

const apiPrefix = config.server.apiPrefix;

// Authentication Routes (Public - no auth required)
app.use(`${apiPrefix}/auth`, require('./routes/auth.routes'));
app.use(`${apiPrefix}/admin/auth`, require('./routes/admin-auth.routes'));

// Apply admin authentication middleware to ALL admin routes (except auth)
app.use(`${apiPrefix}/admin`, (req, res, next) => {
    // Skip auth routes
    if (req.path.startsWith('/auth')) {
        return next();
    }
    authenticateAdmin(req, res, next);
});

// Apply super admin authentication to super admin routes
app.use(`${apiPrefix}/superadmin`, authenticateSuperAdmin);

// Agent Routes
app.use(`${apiPrefix}/agents`, require('./routes/agent.routes'));
app.use(`${apiPrefix}/agent`, require('./routes/agent-portal.routes'));

// Customer Routes (B2C)
app.use(`${apiPrefix}/customers`, require('./routes/customer.routes'));

// Product Routes
app.use(`${apiPrefix}/flights`, require('./routes/flight.routes'));
app.use(`${apiPrefix}/hotels`, require('./routes/hotel.routes'));
app.use(`${apiPrefix}/bus`, require('./routes/bus.routes'));
app.use(`${apiPrefix}/holidays`, require('./routes/holiday.routes'));
app.use(`${apiPrefix}/activities`, require('./routes/activity.routes'));
app.use(`${apiPrefix}/insurance`, require('./routes/insurance.routes'));
app.use(`${apiPrefix}/visa`, require('./routes/visa.routes'));
app.use(`${apiPrefix}/transfers`, require('./routes/transfer.routes'));

// Booking Routes
app.use(`${apiPrefix}/bookings`, require('./routes/booking.routes'));
app.use(`${apiPrefix}/bookings/history`, require('./routes/booking-history.routes'));
app.use(`${apiPrefix}/bookings/amendments`, require('./routes/amendment.routes'));
app.use(`${apiPrefix}/bookings/group`, require('./routes/group-booking.routes'));

// Wallet & Payment Routes
app.use(`${apiPrefix}/wallet`, require('./routes/wallet.routes'));
app.use(`${apiPrefix}/payments`, require('./routes/payment.routes'));

// Admin Routes
app.use(`${apiPrefix}/admin/dashboard`, require('./routes/admin/dashboard.routes'));
app.use(`${apiPrefix}/admin/tenants`, require('./routes/admin/tenant.routes'));
app.use(`${apiPrefix}/admin/agents`, require('./routes/admin/agent-management.routes'));
app.use(`${apiPrefix}/admin/groups`, require('./routes/admin/group.routes'));
app.use(`${apiPrefix}/admin/schemes`, require('./routes/admin/scheme.routes'));
app.use(`${apiPrefix}/admin/suppliers`, require('./routes/admin/supplier.routes'));
app.use(`${apiPrefix}/admin/markup`, require('./routes/admin/markup.routes'));
app.use(`${apiPrefix}/admin/finance`, require('./routes/admin/finance.routes'));
app.use(`${apiPrefix}/admin/reports`, require('./routes/admin/report.routes'));
app.use(`${apiPrefix}/admin/settings`, require('./routes/admin/settings.routes'));
app.use(`${apiPrefix}/admin/whitelabel`, require('./routes/admin/whitelabel.routes'));
app.use(`${apiPrefix}/admin/templates`, require('./routes/admin/template.routes'));
app.use(`${apiPrefix}/admin/api-keys`, require('./routes/admin/api-key.routes'));
app.use(`${apiPrefix}/admin/commissions`, require('./routes/admin/commission.routes'));
app.use(`${apiPrefix}/admin/pending-bookings`, require('./routes/admin/pending-bookings.routes'));
app.use(`${apiPrefix}/admin/channel-distribution`, require('./routes/admin/channel-distribution.routes'));

// Super Admin Routes
app.use(`${apiPrefix}/superadmin`, require('./routes/superadmin.routes'));

// Certification & LMS Routes
app.use(`${apiPrefix}/certifications`, require('./routes/certification.routes'));

// AI Features
app.use(`${apiPrefix}/ai`, require('./routes/ai.routes'));

// Public Routes
app.use(`${apiPrefix}/public`, require('./routes/public.routes'));

// Fare Calendar
app.use(`${apiPrefix}/fare-calendar`, require('./routes/fare-calendar.routes'));

// Webhooks
app.use(`${apiPrefix}/webhooks`, require('./routes/webhook.routes'));

// API Documentation
app.use(`${apiPrefix}/docs`, require('./routes/docs.routes'));

// =====================================================
// ERROR HANDLING
// =====================================================

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: `Route ${req.method} ${req.path} not found`
        }
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err);

    // Validation Error
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: err.message,
                details: err.details
            }
        });
    }

    // JWT Error
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            error: {
                code: 'AUTH_ERROR',
                message: err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token'
            }
        });
    }

    // Database Error
    if (err.code && err.code.startsWith('23')) {
        return res.status(400).json({
            success: false,
            error: {
                code: 'DATABASE_ERROR',
                message: 'Database constraint violation'
            }
        });
    }

    // Default Error
    res.status(err.statusCode || 500).json({
        success: false,
        error: {
            code: err.code || 'INTERNAL_ERROR',
            message: config.server.env === 'production'
                ? 'An unexpected error occurred'
                : err.message
        }
    });
});

// =====================================================
// SERVER START
// =====================================================

const PORT = config.server.port;

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   B2B/B2C TRAVEL PORTAL API SERVER                        ║
║                                                            ║
║   Environment: ${config.server.env.padEnd(42)}║
║   Port: ${PORT.toString().padEnd(50)}║
║   API Prefix: ${apiPrefix.padEnd(44)}║
║                                                            ║
║   Ready to accept connections...                          ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);
});

module.exports = app;
