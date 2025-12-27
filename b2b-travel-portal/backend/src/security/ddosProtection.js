/**
 * DDoS Protection & Advanced Rate Limiting
 * Multi-layer defense against denial of service attacks
 */

const crypto = require('crypto');

/**
 * Token Bucket Rate Limiter
 * More flexible than fixed window rate limiting
 */
class TokenBucket {
    constructor(capacity, refillRate, refillInterval = 1000) {
        this.capacity = capacity;
        this.tokens = capacity;
        this.refillRate = refillRate;
        this.refillInterval = refillInterval;
        this.lastRefill = Date.now();
    }

    consume(tokens = 1) {
        this.refill();

        if (this.tokens >= tokens) {
            this.tokens -= tokens;
            return true;
        }
        return false;
    }

    refill() {
        const now = Date.now();
        const elapsed = now - this.lastRefill;
        const tokensToAdd = Math.floor(elapsed / this.refillInterval) * this.refillRate;

        if (tokensToAdd > 0) {
            this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
            this.lastRefill = now;
        }
    }

    getTokens() {
        this.refill();
        return this.tokens;
    }
}

/**
 * Sliding Window Rate Limiter
 * More accurate than fixed window for edge cases
 */
class SlidingWindowRateLimiter {
    constructor(windowMs, maxRequests) {
        this.windowMs = windowMs;
        this.maxRequests = maxRequests;
        this.requests = new Map(); // IP -> timestamp array
    }

    isAllowed(ip) {
        const now = Date.now();
        const windowStart = now - this.windowMs;

        // Get existing requests for this IP
        let timestamps = this.requests.get(ip) || [];

        // Remove old timestamps
        timestamps = timestamps.filter(ts => ts > windowStart);

        // Check if allowed
        if (timestamps.length >= this.maxRequests) {
            this.requests.set(ip, timestamps);
            return { allowed: false, remaining: 0, resetIn: Math.ceil((timestamps[0] + this.windowMs - now) / 1000) };
        }

        // Add new request
        timestamps.push(now);
        this.requests.set(ip, timestamps);

        return { allowed: true, remaining: this.maxRequests - timestamps.length, resetIn: Math.ceil(this.windowMs / 1000) };
    }

    cleanup() {
        const now = Date.now();
        const windowStart = now - this.windowMs;

        for (const [ip, timestamps] of this.requests.entries()) {
            const valid = timestamps.filter(ts => ts > windowStart);
            if (valid.length === 0) {
                this.requests.delete(ip);
            } else {
                this.requests.set(ip, valid);
            }
        }
    }
}

/**
 * Request Pattern Analyzer
 * Detects suspicious request patterns
 */
class RequestPatternAnalyzer {
    constructor() {
        this.patterns = new Map(); // IP -> pattern data
        this.suspiciousIPs = new Set();
        this.ANALYSIS_WINDOW = 60000; // 1 minute
        this.SUSPICIOUS_THRESHOLD = 0.8; // 80% similar requests
    }

    analyze(ip, request) {
        const now = Date.now();
        const pattern = this.getRequestPattern(request);

        if (!this.patterns.has(ip)) {
            this.patterns.set(ip, {
                requests: [],
                patternCounts: {},
                startTime: now
            });
        }

        const data = this.patterns.get(ip);

        // Clean old data
        if (now - data.startTime > this.ANALYSIS_WINDOW) {
            data.requests = [];
            data.patternCounts = {};
            data.startTime = now;
        }

        // Add request
        data.requests.push({ pattern, timestamp: now });
        data.patternCounts[pattern] = (data.patternCounts[pattern] || 0) + 1;

        // Analyze pattern
        const analysis = this.analyzePatterns(data);

        if (analysis.suspicious) {
            this.suspiciousIPs.add(ip);
        }

        return analysis;
    }

    getRequestPattern(req) {
        // Create a hash of the request pattern
        const pattern = `${req.method}:${req.path}:${Object.keys(req.query || {}).sort().join(',')}`;
        return crypto.createHash('md5').update(pattern).digest('hex').substring(0, 8);
    }

    analyzePatterns(data) {
        if (data.requests.length < 10) {
            return { suspicious: false, reason: null };
        }

        const totalRequests = data.requests.length;
        const maxPatternCount = Math.max(...Object.values(data.patternCounts));
        const similarity = maxPatternCount / totalRequests;

        // High similarity indicates potential bot/automation
        if (similarity > this.SUSPICIOUS_THRESHOLD) {
            return {
                suspicious: true,
                reason: 'HIGH_PATTERN_SIMILARITY',
                similarity: Math.round(similarity * 100)
            };
        }

        // Check request interval consistency (bots often have very consistent intervals)
        const intervals = [];
        for (let i = 1; i < data.requests.length; i++) {
            intervals.push(data.requests[i].timestamp - data.requests[i - 1].timestamp);
        }

        if (intervals.length > 5) {
            const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
            const variance = intervals.reduce((sum, i) => sum + Math.pow(i - avgInterval, 2), 0) / intervals.length;
            const stdDev = Math.sqrt(variance);

            // Very low variance indicates bot behavior
            if (stdDev < 50 && avgInterval < 500) { // Less than 50ms std dev, < 500ms interval
                return {
                    suspicious: true,
                    reason: 'CONSISTENT_REQUEST_TIMING',
                    avgInterval: Math.round(avgInterval)
                };
            }
        }

        return { suspicious: false, reason: null };
    }

    isSuspicious(ip) {
        return this.suspiciousIPs.has(ip);
    }

    clearSuspicion(ip) {
        this.suspiciousIPs.delete(ip);
        this.patterns.delete(ip);
    }

    cleanup() {
        const now = Date.now();
        for (const [ip, data] of this.patterns.entries()) {
            if (now - data.startTime > this.ANALYSIS_WINDOW * 2) {
                this.patterns.delete(ip);
                this.suspiciousIPs.delete(ip);
            }
        }
    }
}

/**
 * Adaptive Rate Limiter
 * Adjusts limits based on current load and threat level
 */
class AdaptiveRateLimiter {
    constructor(options = {}) {
        this.baseLimit = options.baseLimit || 100;
        this.windowMs = options.windowMs || 60000;
        this.burstLimit = options.burstLimit || 20;
        this.burstWindowMs = options.burstWindowMs || 1000;

        this.ipBuckets = new Map();
        this.globalRequestCount = 0;
        this.globalWindowStart = Date.now();

        this.threatLevel = 0; // 0-10 scale
        this.loadLevel = 0; // 0-10 scale

        // Monitor global metrics
        setInterval(() => this.updateMetrics(), 5000);
    }

    getLimit(ip, isAuthenticated = false, tier = 'standard') {
        // Base limit adjusted for authentication and tier
        let limit = this.baseLimit;

        if (isAuthenticated) {
            limit *= 2; // Double for authenticated users
        }

        const tierMultipliers = {
            standard: 1,
            premium: 2,
            enterprise: 5
        };
        limit *= tierMultipliers[tier] || 1;

        // Reduce limit under high load or threat
        const loadFactor = Math.max(0.3, 1 - (this.loadLevel * 0.07));
        const threatFactor = Math.max(0.2, 1 - (this.threatLevel * 0.08));

        return Math.floor(limit * loadFactor * threatFactor);
    }

    check(ip, options = {}) {
        const now = Date.now();
        const limit = this.getLimit(ip, options.isAuthenticated, options.tier);

        // Initialize bucket for IP if not exists
        if (!this.ipBuckets.has(ip)) {
            this.ipBuckets.set(ip, {
                tokens: new TokenBucket(limit, Math.ceil(limit / 60), 1000),
                burstTokens: new TokenBucket(this.burstLimit, this.burstLimit, this.burstWindowMs),
                blocked: false,
                blockedUntil: 0
            });
        }

        const bucket = this.ipBuckets.get(ip);

        // Check if IP is temporarily blocked
        if (bucket.blocked && now < bucket.blockedUntil) {
            return {
                allowed: false,
                reason: 'TEMPORARILY_BLOCKED',
                retryAfter: Math.ceil((bucket.blockedUntil - now) / 1000)
            };
        }
        bucket.blocked = false;

        // Check burst limit first
        if (!bucket.burstTokens.consume(1)) {
            return {
                allowed: false,
                reason: 'BURST_LIMIT_EXCEEDED',
                retryAfter: 1
            };
        }

        // Check main rate limit
        if (!bucket.tokens.consume(1)) {
            return {
                allowed: false,
                reason: 'RATE_LIMIT_EXCEEDED',
                remaining: 0,
                retryAfter: 60
            };
        }

        this.globalRequestCount++;

        return {
            allowed: true,
            remaining: bucket.tokens.getTokens(),
            limit
        };
    }

    blockIP(ip, durationMs = 3600000) {
        if (!this.ipBuckets.has(ip)) {
            this.ipBuckets.set(ip, {
                tokens: new TokenBucket(1, 1, 1000),
                burstTokens: new TokenBucket(1, 1, 1000),
                blocked: true,
                blockedUntil: Date.now() + durationMs
            });
        } else {
            const bucket = this.ipBuckets.get(ip);
            bucket.blocked = true;
            bucket.blockedUntil = Date.now() + durationMs;
        }
    }

    updateMetrics() {
        const now = Date.now();
        const elapsed = now - this.globalWindowStart;

        if (elapsed >= 60000) {
            const requestsPerSecond = this.globalRequestCount / (elapsed / 1000);

            // Update load level (0-10 based on requests per second)
            this.loadLevel = Math.min(10, Math.floor(requestsPerSecond / 100));

            // Reset counter
            this.globalRequestCount = 0;
            this.globalWindowStart = now;
        }
    }

    setThreatLevel(level) {
        this.threatLevel = Math.min(10, Math.max(0, level));
    }

    cleanup() {
        const now = Date.now();
        for (const [ip, bucket] of this.ipBuckets.entries()) {
            if (bucket.blockedUntil > 0 && now > bucket.blockedUntil + 3600000) {
                this.ipBuckets.delete(ip);
            }
        }
    }
}

/**
 * Connection Tracker
 * Tracks concurrent connections per IP
 */
class ConnectionTracker {
    constructor(maxConnections = 50) {
        this.maxConnections = maxConnections;
        this.connections = new Map();
    }

    addConnection(ip) {
        const count = (this.connections.get(ip) || 0) + 1;
        this.connections.set(ip, count);
        return count <= this.maxConnections;
    }

    removeConnection(ip) {
        const count = this.connections.get(ip) || 0;
        if (count <= 1) {
            this.connections.delete(ip);
        } else {
            this.connections.set(ip, count - 1);
        }
    }

    getConnectionCount(ip) {
        return this.connections.get(ip) || 0;
    }

    isOverLimit(ip) {
        return this.getConnectionCount(ip) > this.maxConnections;
    }
}

/**
 * Global DDoS Protection Manager
 */
class DDoSProtectionManager {
    constructor(options = {}) {
        this.slidingLimiter = new SlidingWindowRateLimiter(
            options.windowMs || 60000,
            options.maxRequests || 100
        );
        this.patternAnalyzer = new RequestPatternAnalyzer();
        this.adaptiveLimiter = new AdaptiveRateLimiter(options);
        this.connectionTracker = new ConnectionTracker(options.maxConnections || 50);

        this.blockedIPs = new Map(); // IP -> { until, reason }
        this.whitelistedIPs = new Set(options.whitelist || []);
        this.blacklistedIPs = new Set(options.blacklist || []);

        // Cleanup interval
        setInterval(() => this.cleanup(), 60000);
    }

    check(req) {
        const ip = this.getClientIP(req);

        // Check whitelist
        if (this.whitelistedIPs.has(ip)) {
            return { allowed: true, reason: 'WHITELISTED' };
        }

        // Check blacklist
        if (this.blacklistedIPs.has(ip)) {
            return { allowed: false, reason: 'BLACKLISTED' };
        }

        // Check if blocked
        const blocked = this.blockedIPs.get(ip);
        if (blocked && Date.now() < blocked.until) {
            return {
                allowed: false,
                reason: blocked.reason,
                retryAfter: Math.ceil((blocked.until - Date.now()) / 1000)
            };
        }

        // Check connection limit
        if (this.connectionTracker.isOverLimit(ip)) {
            return { allowed: false, reason: 'TOO_MANY_CONNECTIONS' };
        }

        // Check adaptive rate limit
        const adaptiveResult = this.adaptiveLimiter.check(ip, {
            isAuthenticated: !!req.user,
            tier: req.user?.tier || 'standard'
        });
        if (!adaptiveResult.allowed) {
            return adaptiveResult;
        }

        // Analyze request pattern
        const patternResult = this.patternAnalyzer.analyze(ip, req);
        if (patternResult.suspicious) {
            // Increase threat level and potentially block
            this.adaptiveLimiter.setThreatLevel(
                Math.min(10, this.adaptiveLimiter.threatLevel + 1)
            );

            if (patternResult.similarity > 95 || patternResult.avgInterval < 100) {
                this.blockIP(ip, 600000, patternResult.reason); // 10 minutes
                return { allowed: false, reason: patternResult.reason };
            }
        }

        return {
            allowed: true,
            remaining: adaptiveResult.remaining,
            limit: adaptiveResult.limit
        };
    }

    blockIP(ip, durationMs, reason) {
        this.blockedIPs.set(ip, {
            until: Date.now() + durationMs,
            reason
        });
        this.adaptiveLimiter.blockIP(ip, durationMs);
        console.warn(`[DDoS Protection] Blocked IP ${ip} for ${durationMs / 1000}s: ${reason}`);
    }

    unblockIP(ip) {
        this.blockedIPs.delete(ip);
        this.patternAnalyzer.clearSuspicion(ip);
    }

    addToWhitelist(ip) {
        this.whitelistedIPs.add(ip);
        this.unblockIP(ip);
    }

    removeFromWhitelist(ip) {
        this.whitelistedIPs.delete(ip);
    }

    addToBlacklist(ip) {
        this.blacklistedIPs.add(ip);
    }

    removeFromBlacklist(ip) {
        this.blacklistedIPs.delete(ip);
    }

    getClientIP(req) {
        // Handle proxies and load balancers
        const forwarded = req.headers['x-forwarded-for'];
        if (forwarded) {
            return forwarded.split(',')[0].trim();
        }
        return req.ip || req.connection?.remoteAddress || 'unknown';
    }

    trackConnection(ip) {
        return this.connectionTracker.addConnection(ip);
    }

    releaseConnection(ip) {
        this.connectionTracker.removeConnection(ip);
    }

    getStats() {
        return {
            threatLevel: this.adaptiveLimiter.threatLevel,
            loadLevel: this.adaptiveLimiter.loadLevel,
            blockedIPs: this.blockedIPs.size,
            suspiciousIPs: this.patternAnalyzer.suspiciousIPs.size,
            whitelistedIPs: this.whitelistedIPs.size,
            blacklistedIPs: this.blacklistedIPs.size
        };
    }

    cleanup() {
        const now = Date.now();

        // Clean expired blocks
        for (const [ip, data] of this.blockedIPs.entries()) {
            if (now > data.until) {
                this.blockedIPs.delete(ip);
            }
        }

        // Clean other data structures
        this.slidingLimiter.cleanup();
        this.patternAnalyzer.cleanup();
        this.adaptiveLimiter.cleanup();
    }
}

// Create singleton instance
const ddosProtection = new DDoSProtectionManager();

/**
 * DDoS Protection Middleware
 */
const ddosProtectionMiddleware = (options = {}) => {
    const manager = options.manager || ddosProtection;

    return (req, res, next) => {
        const result = manager.check(req);

        // Set rate limit headers
        res.setHeader('X-RateLimit-Limit', result.limit || 100);
        res.setHeader('X-RateLimit-Remaining', result.remaining || 0);

        if (!result.allowed) {
            res.setHeader('Retry-After', result.retryAfter || 60);

            return res.status(429).json({
                success: false,
                error: 'Too many requests',
                code: result.reason,
                retryAfter: result.retryAfter
            });
        }

        // Track connection
        const ip = manager.getClientIP(req);
        if (!manager.trackConnection(ip)) {
            return res.status(429).json({
                success: false,
                error: 'Too many concurrent connections',
                code: 'CONNECTION_LIMIT_EXCEEDED'
            });
        }

        // Release connection when response ends
        res.on('finish', () => manager.releaseConnection(ip));
        res.on('close', () => manager.releaseConnection(ip));

        next();
    };
};

module.exports = {
    TokenBucket,
    SlidingWindowRateLimiter,
    RequestPatternAnalyzer,
    AdaptiveRateLimiter,
    ConnectionTracker,
    DDoSProtectionManager,
    ddosProtection,
    ddosProtectionMiddleware
};
