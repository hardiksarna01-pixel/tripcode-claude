/**
 * Rate Limiting Middleware (Mock)
 * In production, use express-rate-limit with Redis store
 */

// Simple in-memory rate limiting for demo
const requestCounts = new Map();

const createRateLimiter = (windowMs = 60000, maxRequests = 100) => {
    return (req, res, next) => {
        const key = req.ip;
        const now = Date.now();

        let record = requestCounts.get(key);

        if (!record || now - record.startTime > windowMs) {
            record = { count: 1, startTime: now };
            requestCounts.set(key, record);
        } else {
            record.count++;
        }

        if (record.count > maxRequests) {
            return res.status(429).json({
                success: false,
                error: 'Too many requests, please try again later'
            });
        }

        next();
    };
};

// General API rate limiter: 100 requests per minute
const apiLimiter = createRateLimiter(60000, 100);

// Auth rate limiter: 10 requests per minute (stricter for login/register)
const authLimiter = createRateLimiter(60000, 10);

// Search rate limiter: 30 requests per minute
const searchLimiter = createRateLimiter(60000, 30);

module.exports = {
    apiLimiter,
    authLimiter,
    searchLimiter,
    createRateLimiter
};
