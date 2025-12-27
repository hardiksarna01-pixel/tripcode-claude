/**
 * API Authentication Middleware
 * Validates API keys and enforces rate limits for API-as-a-Service
 */

const { validateKey, checkRateLimit } = require('../controllers/apiKey.controller');

// In-memory tenant store (shared with tenant controller in production via database)
const tenantPlans = new Map();

/**
 * API Key Authentication Middleware
 */
const apiKeyAuth = (req, res, next) => {
    // Check for API key in header
    const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');

    if (!apiKey) {
        return res.status(401).json({
            error: 'API key required',
            message: 'Please provide your API key in the X-API-Key header'
        });
    }

    // Validate the key
    const validation = validateKey(apiKey);

    if (!validation.valid) {
        return res.status(401).json({
            error: 'Invalid API key',
            message: validation.error
        });
    }

    // Attach tenant info to request
    req.tenantId = validation.tenantId;
    req.apiKeyType = validation.type;

    // Check if using test key in production-only endpoint
    if (req.apiKeyType === 'test' && req.path.includes('/bookings/create')) {
        // Allow test bookings but mark them
        req.isTestMode = true;
    }

    next();
};

/**
 * Rate Limiting Middleware
 */
const apiRateLimit = (req, res, next) => {
    const tenantId = req.tenantId;
    const plan = tenantPlans.get(tenantId) || 'professional';

    const rateCheck = checkRateLimit(tenantId, plan);

    if (!rateCheck.allowed) {
        res.set('Retry-After', rateCheck.retryAfter);
        res.set('X-RateLimit-Reset', rateCheck.retryAfter);
        return res.status(429).json({
            error: 'Rate limit exceeded',
            message: rateCheck.error,
            retryAfter: rateCheck.retryAfter
        });
    }

    // Set rate limit headers
    if (rateCheck.remaining) {
        res.set('X-RateLimit-Remaining-Minute', rateCheck.remaining.minute);
        res.set('X-RateLimit-Remaining-Hour', rateCheck.remaining.hour);
        res.set('X-RateLimit-Remaining-Day', rateCheck.remaining.day);
    }

    next();
};

/**
 * Tenant Feature Check Middleware
 */
const requireFeature = (feature) => {
    return (req, res, next) => {
        const tenantId = req.tenantId;
        // In production, fetch tenant features from database
        // For now, allow all features
        next();
    };
};

/**
 * Test Mode Middleware - Adds sandbox behavior
 */
const testModeHandler = (req, res, next) => {
    if (req.isTestMode) {
        // In test mode, don't actually charge or create real bookings
        req.sandboxMode = true;
    }
    next();
};

/**
 * Set tenant plan (used by tenant controller)
 */
const setTenantPlan = (tenantId, plan) => {
    tenantPlans.set(tenantId, plan);
};

module.exports = {
    apiKeyAuth,
    apiRateLimit,
    requireFeature,
    testModeHandler,
    setTenantPlan
};
