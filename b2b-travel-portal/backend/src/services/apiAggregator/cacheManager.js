/**
 * Cache Manager
 * High-performance caching layer for flight search results
 * Supports multiple cache backends (in-memory, Redis)
 */

class CacheManager {
    constructor(options = {}) {
        this.cache = new Map();
        this.stats = {
            hits: 0,
            misses: 0,
            sets: 0,
            evictions: 0
        };

        // Configuration
        this.config = {
            maxSize: options.maxSize || 10000,          // Max cache entries
            defaultTTL: options.defaultTTL || 300,       // 5 minutes default
            cleanupInterval: options.cleanupInterval || 60000, // 1 minute cleanup
            compressionThreshold: options.compressionThreshold || 10000, // Compress large entries
            enableStats: options.enableStats !== false
        };

        // TTL tracking
        this.ttlMap = new Map();

        // Start cleanup interval
        this.cleanupTimer = setInterval(() => this.cleanup(), this.config.cleanupInterval);

        // LRU tracking
        this.accessOrder = [];

        console.log('[CacheManager] Initialized with max size:', this.config.maxSize);
    }

    /**
     * Get cached value
     */
    async get(key) {
        const entry = this.cache.get(key);

        if (!entry) {
            this.stats.misses++;
            return null;
        }

        // Check if expired
        if (this.isExpired(key)) {
            this.delete(key);
            this.stats.misses++;
            return null;
        }

        // Update LRU
        this.updateAccessOrder(key);
        this.stats.hits++;

        return entry.data;
    }

    /**
     * Set cache value
     */
    async set(key, value, ttl = this.config.defaultTTL) {
        // Evict if at capacity
        if (this.cache.size >= this.config.maxSize && !this.cache.has(key)) {
            this.evictLRU();
        }

        const entry = {
            data: value,
            createdAt: Date.now(),
            size: this.estimateSize(value)
        };

        this.cache.set(key, entry);
        this.ttlMap.set(key, Date.now() + (ttl * 1000));
        this.updateAccessOrder(key);

        this.stats.sets++;

        return true;
    }

    /**
     * Delete cache entry
     */
    delete(key) {
        this.cache.delete(key);
        this.ttlMap.delete(key);
        this.removeFromAccessOrder(key);
        return true;
    }

    /**
     * Clear all cache
     */
    clear() {
        this.cache.clear();
        this.ttlMap.clear();
        this.accessOrder = [];
        console.log('[CacheManager] Cache cleared');
    }

    /**
     * Check if key is expired
     */
    isExpired(key) {
        const expiry = this.ttlMap.get(key);
        return expiry && Date.now() > expiry;
    }

    /**
     * Update LRU access order
     */
    updateAccessOrder(key) {
        this.removeFromAccessOrder(key);
        this.accessOrder.push(key);
    }

    /**
     * Remove from access order
     */
    removeFromAccessOrder(key) {
        const index = this.accessOrder.indexOf(key);
        if (index > -1) {
            this.accessOrder.splice(index, 1);
        }
    }

    /**
     * Evict least recently used entry
     */
    evictLRU() {
        if (this.accessOrder.length === 0) return;

        // Find first non-expired entry to evict
        while (this.accessOrder.length > 0) {
            const keyToEvict = this.accessOrder.shift();
            if (this.cache.has(keyToEvict)) {
                this.cache.delete(keyToEvict);
                this.ttlMap.delete(keyToEvict);
                this.stats.evictions++;
                console.log(`[CacheManager] Evicted LRU: ${keyToEvict.substring(0, 50)}...`);
                return;
            }
        }
    }

    /**
     * Cleanup expired entries
     */
    cleanup() {
        const now = Date.now();
        let cleaned = 0;

        for (const [key, expiry] of this.ttlMap) {
            if (now > expiry) {
                this.delete(key);
                cleaned++;
            }
        }

        if (cleaned > 0) {
            console.log(`[CacheManager] Cleaned ${cleaned} expired entries`);
        }
    }

    /**
     * Estimate size of value in bytes
     */
    estimateSize(value) {
        try {
            return JSON.stringify(value).length * 2; // Approximate UTF-16 size
        } catch {
            return 0;
        }
    }

    /**
     * Get cache statistics
     */
    getStats() {
        const totalRequests = this.stats.hits + this.stats.misses;
        return {
            ...this.stats,
            size: this.cache.size,
            maxSize: this.config.maxSize,
            hitRate: totalRequests > 0
                ? ((this.stats.hits / totalRequests) * 100).toFixed(2) + '%'
                : 'N/A',
            memoryEstimate: this.getMemoryEstimate()
        };
    }

    /**
     * Get estimated memory usage
     */
    getMemoryEstimate() {
        let totalSize = 0;
        for (const entry of this.cache.values()) {
            totalSize += entry.size || 0;
        }
        return this.formatBytes(totalSize);
    }

    /**
     * Format bytes to human readable
     */
    formatBytes(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }

    /**
     * Get all keys matching pattern
     */
    keys(pattern = null) {
        if (!pattern) {
            return Array.from(this.cache.keys());
        }

        const regex = new RegExp(pattern.replace('*', '.*'));
        return Array.from(this.cache.keys()).filter(key => regex.test(key));
    }

    /**
     * Check if key exists
     */
    has(key) {
        if (!this.cache.has(key)) return false;
        if (this.isExpired(key)) {
            this.delete(key);
            return false;
        }
        return true;
    }

    /**
     * Get remaining TTL for key
     */
    ttl(key) {
        const expiry = this.ttlMap.get(key);
        if (!expiry) return -1;
        const remaining = Math.max(0, expiry - Date.now());
        return Math.ceil(remaining / 1000);
    }

    /**
     * Extend TTL for key
     */
    touch(key, additionalTTL) {
        const currentExpiry = this.ttlMap.get(key);
        if (currentExpiry) {
            this.ttlMap.set(key, currentExpiry + (additionalTTL * 1000));
            return true;
        }
        return false;
    }

    /**
     * Multi-get for batch operations
     */
    async mget(keys) {
        const results = {};
        for (const key of keys) {
            results[key] = await this.get(key);
        }
        return results;
    }

    /**
     * Multi-set for batch operations
     */
    async mset(entries, ttl) {
        for (const [key, value] of Object.entries(entries)) {
            await this.set(key, value, ttl);
        }
        return true;
    }

    /**
     * Warm cache with prefetched data
     */
    async warmCache(entries) {
        console.log(`[CacheManager] Warming cache with ${entries.length} entries...`);
        for (const { key, value, ttl } of entries) {
            await this.set(key, value, ttl);
        }
        console.log('[CacheManager] Cache warming complete');
    }

    /**
     * Invalidate cache by pattern
     */
    invalidateByPattern(pattern) {
        const matchingKeys = this.keys(pattern);
        matchingKeys.forEach(key => this.delete(key));
        console.log(`[CacheManager] Invalidated ${matchingKeys.length} entries matching: ${pattern}`);
        return matchingKeys.length;
    }

    /**
     * Destroy cache manager
     */
    destroy() {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
        }
        this.clear();
        console.log('[CacheManager] Destroyed');
    }
}

/**
 * Redis Cache Manager (for production)
 * Drop-in replacement with Redis backend
 */
class RedisCacheManager {
    constructor(redisClient, options = {}) {
        this.redis = redisClient;
        this.prefix = options.prefix || 'travel:cache:';
        this.defaultTTL = options.defaultTTL || 300;
        this.stats = { hits: 0, misses: 0, sets: 0 };
    }

    async get(key) {
        const data = await this.redis.get(this.prefix + key);
        if (data) {
            this.stats.hits++;
            return JSON.parse(data);
        }
        this.stats.misses++;
        return null;
    }

    async set(key, value, ttl = this.defaultTTL) {
        await this.redis.setex(
            this.prefix + key,
            ttl,
            JSON.stringify(value)
        );
        this.stats.sets++;
        return true;
    }

    async delete(key) {
        await this.redis.del(this.prefix + key);
        return true;
    }

    async clear() {
        const keys = await this.redis.keys(this.prefix + '*');
        if (keys.length > 0) {
            await this.redis.del(keys);
        }
    }

    getStats() {
        const total = this.stats.hits + this.stats.misses;
        return {
            ...this.stats,
            hitRate: total > 0
                ? ((this.stats.hits / total) * 100).toFixed(2) + '%'
                : 'N/A'
        };
    }
}

module.exports = CacheManager;
module.exports.RedisCacheManager = RedisCacheManager;
