/**
 * Rate Limiter
 * Per-supplier rate limiting with sliding window algorithm
 * Prevents API abuse and respects supplier quotas
 */

class RateLimiter {
    constructor(options = {}) {
        // Store request timestamps per supplier
        this.requests = new Map();

        // Default limits
        this.defaultLimits = {
            requests: options.defaultRequests || 100,
            window: options.defaultWindow || 60 // 60 seconds
        };

        // Per-supplier custom limits
        this.supplierLimits = new Map();

        // Statistics
        this.stats = {
            totalRequests: 0,
            throttledRequests: 0,
            supplierStats: new Map()
        };

        // Cleanup interval (every 5 minutes)
        this.cleanupInterval = setInterval(() => this.cleanup(), 300000);

        console.log('[RateLimiter] Initialized');
    }

    /**
     * Set custom limits for a supplier
     */
    setSupplierLimit(supplierId, limits) {
        this.supplierLimits.set(supplierId, {
            requests: limits.requests || this.defaultLimits.requests,
            window: limits.window || this.defaultLimits.window
        });
    }

    /**
     * Get limits for a supplier
     */
    getLimit(supplierId) {
        return this.supplierLimits.get(supplierId) || this.defaultLimits;
    }

    /**
     * Check if request is allowed
     */
    canMakeRequest(supplierId) {
        const limit = this.getLimit(supplierId);
        const now = Date.now();
        const windowStart = now - (limit.window * 1000);

        // Get request timestamps for this supplier
        let timestamps = this.requests.get(supplierId) || [];

        // Filter to only recent requests within window
        timestamps = timestamps.filter(ts => ts > windowStart);
        this.requests.set(supplierId, timestamps);

        // Check if under limit
        return timestamps.length < limit.requests;
    }

    /**
     * Record a request
     */
    recordRequest(supplierId) {
        const now = Date.now();
        let timestamps = this.requests.get(supplierId) || [];
        timestamps.push(now);
        this.requests.set(supplierId, timestamps);

        // Update stats
        this.stats.totalRequests++;
        this.updateSupplierStats(supplierId);
    }

    /**
     * Get remaining quota for supplier
     */
    getRemainingQuota(supplierId) {
        const limit = this.getLimit(supplierId);
        const now = Date.now();
        const windowStart = now - (limit.window * 1000);

        let timestamps = this.requests.get(supplierId) || [];
        timestamps = timestamps.filter(ts => ts > windowStart);

        return {
            remaining: Math.max(0, limit.requests - timestamps.length),
            limit: limit.requests,
            window: limit.window,
            resetsIn: this.getResetTime(supplierId)
        };
    }

    /**
     * Get time until rate limit resets
     */
    getResetTime(supplierId) {
        const timestamps = this.requests.get(supplierId) || [];
        if (timestamps.length === 0) return 0;

        const limit = this.getLimit(supplierId);
        const oldestTimestamp = timestamps[0];
        const resetTime = oldestTimestamp + (limit.window * 1000) - Date.now();

        return Math.max(0, Math.ceil(resetTime / 1000));
    }

    /**
     * Throttle request (wait if needed)
     */
    async throttle(supplierId) {
        if (this.canMakeRequest(supplierId)) {
            this.recordRequest(supplierId);
            return true;
        }

        const resetTime = this.getResetTime(supplierId);
        this.stats.throttledRequests++;

        console.log(`[RateLimiter] Throttling ${supplierId} for ${resetTime}s`);

        // Wait for reset
        await new Promise(resolve => setTimeout(resolve, resetTime * 1000));

        this.recordRequest(supplierId);
        return true;
    }

    /**
     * Update per-supplier statistics
     */
    updateSupplierStats(supplierId) {
        if (!this.stats.supplierStats.has(supplierId)) {
            this.stats.supplierStats.set(supplierId, {
                requests: 0,
                throttled: 0
            });
        }

        const stats = this.stats.supplierStats.get(supplierId);
        stats.requests++;
    }

    /**
     * Cleanup old timestamps
     */
    cleanup() {
        const now = Date.now();
        const maxWindow = 3600000; // 1 hour max lookback

        for (const [supplierId, timestamps] of this.requests) {
            const filtered = timestamps.filter(ts => now - ts < maxWindow);
            if (filtered.length === 0) {
                this.requests.delete(supplierId);
            } else {
                this.requests.set(supplierId, filtered);
            }
        }
    }

    /**
     * Get rate limiter statistics
     */
    getStats() {
        const supplierStatsObj = {};
        this.stats.supplierStats.forEach((value, key) => {
            const quota = this.getRemainingQuota(key);
            supplierStatsObj[key] = {
                ...value,
                ...quota
            };
        });

        return {
            totalRequests: this.stats.totalRequests,
            throttledRequests: this.stats.throttledRequests,
            throttleRate: this.stats.totalRequests > 0
                ? ((this.stats.throttledRequests / this.stats.totalRequests) * 100).toFixed(2) + '%'
                : 'N/A',
            activeSuppliers: this.requests.size,
            suppliers: supplierStatsObj
        };
    }

    /**
     * Reset limits for a supplier
     */
    reset(supplierId) {
        this.requests.delete(supplierId);
        console.log(`[RateLimiter] Reset limits for ${supplierId}`);
    }

    /**
     * Reset all limits
     */
    resetAll() {
        this.requests.clear();
        console.log('[RateLimiter] All limits reset');
    }

    /**
     * Destroy rate limiter
     */
    destroy() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        this.requests.clear();
        console.log('[RateLimiter] Destroyed');
    }
}

/**
 * Distributed Rate Limiter using Redis
 * For multi-instance deployments
 */
class RedisRateLimiter {
    constructor(redisClient, options = {}) {
        this.redis = redisClient;
        this.prefix = options.prefix || 'travel:ratelimit:';
        this.defaultLimits = {
            requests: options.defaultRequests || 100,
            window: options.defaultWindow || 60
        };
        this.supplierLimits = new Map();
    }

    setSupplierLimit(supplierId, limits) {
        this.supplierLimits.set(supplierId, limits);
    }

    getLimit(supplierId) {
        return this.supplierLimits.get(supplierId) || this.defaultLimits;
    }

    async canMakeRequest(supplierId) {
        const limit = this.getLimit(supplierId);
        const key = this.prefix + supplierId;
        const count = await this.redis.get(key);

        return !count || parseInt(count) < limit.requests;
    }

    async recordRequest(supplierId) {
        const limit = this.getLimit(supplierId);
        const key = this.prefix + supplierId;

        const count = await this.redis.incr(key);
        if (count === 1) {
            await this.redis.expire(key, limit.window);
        }
    }

    async getRemainingQuota(supplierId) {
        const limit = this.getLimit(supplierId);
        const key = this.prefix + supplierId;

        const count = await this.redis.get(key) || 0;
        const ttl = await this.redis.ttl(key);

        return {
            remaining: Math.max(0, limit.requests - parseInt(count)),
            limit: limit.requests,
            resetsIn: ttl > 0 ? ttl : 0
        };
    }

    async throttle(supplierId) {
        if (await this.canMakeRequest(supplierId)) {
            await this.recordRequest(supplierId);
            return true;
        }

        const { resetsIn } = await this.getRemainingQuota(supplierId);
        await new Promise(resolve => setTimeout(resolve, resetsIn * 1000));
        await this.recordRequest(supplierId);
        return true;
    }
}

/**
 * Token Bucket Rate Limiter
 * Allows burst traffic while maintaining average rate
 */
class TokenBucketLimiter {
    constructor(options = {}) {
        this.buckets = new Map();
        this.defaultConfig = {
            capacity: options.capacity || 100,      // Max tokens
            refillRate: options.refillRate || 10,   // Tokens per second
            refillInterval: options.refillInterval || 1000 // Refill check interval
        };
        this.supplierConfigs = new Map();

        // Start refill interval
        this.refillTimer = setInterval(() => this.refillAll(), this.defaultConfig.refillInterval);
    }

    setSupplierConfig(supplierId, config) {
        this.supplierConfigs.set(supplierId, {
            capacity: config.capacity || this.defaultConfig.capacity,
            refillRate: config.refillRate || this.defaultConfig.refillRate
        });
    }

    getConfig(supplierId) {
        return this.supplierConfigs.get(supplierId) || this.defaultConfig;
    }

    getBucket(supplierId) {
        if (!this.buckets.has(supplierId)) {
            const config = this.getConfig(supplierId);
            this.buckets.set(supplierId, {
                tokens: config.capacity,
                lastRefill: Date.now()
            });
        }
        return this.buckets.get(supplierId);
    }

    canMakeRequest(supplierId) {
        const bucket = this.getBucket(supplierId);
        return bucket.tokens >= 1;
    }

    recordRequest(supplierId) {
        const bucket = this.getBucket(supplierId);
        if (bucket.tokens >= 1) {
            bucket.tokens--;
            return true;
        }
        return false;
    }

    refillAll() {
        const now = Date.now();

        for (const [supplierId, bucket] of this.buckets) {
            const config = this.getConfig(supplierId);
            const elapsed = (now - bucket.lastRefill) / 1000;
            const tokensToAdd = elapsed * config.refillRate;

            bucket.tokens = Math.min(config.capacity, bucket.tokens + tokensToAdd);
            bucket.lastRefill = now;
        }
    }

    getRemainingQuota(supplierId) {
        const bucket = this.getBucket(supplierId);
        const config = this.getConfig(supplierId);

        return {
            remaining: Math.floor(bucket.tokens),
            capacity: config.capacity,
            refillRate: config.refillRate
        };
    }

    destroy() {
        if (this.refillTimer) {
            clearInterval(this.refillTimer);
        }
        this.buckets.clear();
    }
}

module.exports = RateLimiter;
module.exports.RedisRateLimiter = RedisRateLimiter;
module.exports.TokenBucketLimiter = TokenBucketLimiter;
