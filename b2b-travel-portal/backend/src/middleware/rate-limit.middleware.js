const redis = require('../config/redis');

/**
 * Rate Limiting Middleware
 * Protects API endpoints from abuse
 */

/**
 * Create a rate limiter with configurable options
 */
const createRateLimiter = (options = {}) => {
    const {
        windowMs = 60 * 1000,      // 1 minute window
        maxRequests = 100,          // max requests per window
        keyPrefix = 'ratelimit',
        message = 'Too many requests, please try again later.',
        skipSuccessfulRequests = false,
        skipFailedRequests = false,
        keyGenerator = (req) => req.ip || req.connection.remoteAddress
    } = options;

    return async (req, res, next) => {
        // If Redis is not available, skip rate limiting
        if (!redis.isAvailable()) {
            return next();
        }

        const key = `${keyPrefix}:${keyGenerator(req)}`;
        const windowSeconds = Math.ceil(windowMs / 1000);

        try {
            const current = await redis.get(key);
            const count = current ? parseInt(current, 10) : 0;

            // Set rate limit headers
            res.set('X-RateLimit-Limit', maxRequests);
            res.set('X-RateLimit-Remaining', Math.max(0, maxRequests - count - 1));

            if (count >= maxRequests) {
                res.set('Retry-After', windowSeconds);
                return res.status(429).json({
                    success: false,
                    error: message,
                    retryAfter: windowSeconds
                });
            }

            // Increment counter
            if (current) {
                await redis.client.incr(key);
            } else {
                await redis.set(key, 1, windowSeconds);
            }

            // Handle skip options
            if (skipSuccessfulRequests || skipFailedRequests) {
                res.on('finish', async () => {
                    const shouldSkip =
                        (skipSuccessfulRequests && res.statusCode < 400) ||
                        (skipFailedRequests && res.statusCode >= 400);

                    if (shouldSkip) {
                        await redis.client.decr(key);
                    }
                });
            }

            next();
        } catch (error) {
            console.error('Rate limit error:', error);
            // On error, allow the request to proceed
            next();
        }
    };
};

/**
 * Standard API rate limiter - 100 requests per minute
 */
const apiLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 100,
    keyPrefix: 'api'
});

/**
 * Strict rate limiter for auth endpoints - 10 requests per minute
 */
const authLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 10,
    keyPrefix: 'auth',
    message: 'Too many authentication attempts, please try again later.'
});

/**
 * Search rate limiter - 30 searches per minute
 */
const searchLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 30,
    keyPrefix: 'search',
    message: 'Too many search requests, please slow down.'
});

/**
 * Booking rate limiter - 10 bookings per minute
 */
const bookingLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 10,
    keyPrefix: 'booking',
    message: 'Too many booking requests, please slow down.'
});

/**
 * Agent-based rate limiter - uses agent ID instead of IP
 */
const agentLimiter = (maxRequests = 100) => createRateLimiter({
    windowMs: 60 * 1000,
    maxRequests,
    keyPrefix: 'agent',
    keyGenerator: (req) => req.agent?.id || req.ip
});

module.exports = {
    createRateLimiter,
    apiLimiter,
    authLimiter,
    searchLimiter,
    bookingLimiter,
    agentLimiter
};
