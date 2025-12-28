const { createClient } = require('redis');

/**
 * Redis Cache Configuration
 * Handles caching for sectors, search results, and sessions
 */
class RedisCache {
    constructor() {
        this.client = null;
        this.isConnected = false;
    }

    /**
     * Initialize Redis connection
     */
    async connect() {
        if (this.client && this.isConnected) {
            return this.client;
        }

        this.client = createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379'
        });

        this.client.on('error', (err) => {
            console.error('Redis Client Error:', err);
            this.isConnected = false;
        });

        this.client.on('connect', () => {
            console.log('✅ Redis connected successfully');
            this.isConnected = true;
        });

        this.client.on('disconnect', () => {
            console.log('Redis disconnected');
            this.isConnected = false;
        });

        try {
            await this.client.connect();
        } catch (error) {
            console.warn('⚠️ Redis connection failed, continuing without cache:', error.message);
            this.isConnected = false;
        }

        return this.client;
    }

    /**
     * Check if Redis is available
     */
    isAvailable() {
        return this.isConnected && this.client;
    }

    /**
     * Get value from cache
     */
    async get(key) {
        if (!this.isAvailable()) return null;

        try {
            const value = await this.client.get(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('Redis get error:', error);
            return null;
        }
    }

    /**
     * Set value in cache with optional TTL (in seconds)
     */
    async set(key, value, ttlSeconds = 300) {
        if (!this.isAvailable()) return false;

        try {
            await this.client.setEx(key, ttlSeconds, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Redis set error:', error);
            return false;
        }
    }

    /**
     * Delete a key from cache
     */
    async del(key) {
        if (!this.isAvailable()) return false;

        try {
            await this.client.del(key);
            return true;
        } catch (error) {
            console.error('Redis del error:', error);
            return false;
        }
    }

    /**
     * Delete keys matching a pattern
     */
    async delPattern(pattern) {
        if (!this.isAvailable()) return false;

        try {
            const keys = await this.client.keys(pattern);
            if (keys.length > 0) {
                await this.client.del(keys);
            }
            return true;
        } catch (error) {
            console.error('Redis delPattern error:', error);
            return false;
        }
    }

    /**
     * Cache sector availability (refresh 3-4x daily)
     */
    async cacheSectors(agentId, sectors) {
        const key = `sectors:${agentId}`;
        const ttl = 6 * 60 * 60; // 6 hours
        return this.set(key, sectors, ttl);
    }

    /**
     * Get cached sectors
     */
    async getCachedSectors(agentId) {
        const key = `sectors:${agentId}`;
        return this.get(key);
    }

    /**
     * Cache search results (5-10 min TTL)
     */
    async cacheSearchResults(searchKey, results) {
        const key = `search:${searchKey}`;
        const ttl = 5 * 60; // 5 minutes
        return this.set(key, results, ttl);
    }

    /**
     * Get cached search results
     */
    async getCachedSearchResults(searchKey) {
        const key = `search:${searchKey}`;
        return this.get(key);
    }

    /**
     * Cache reprice results (2 min TTL)
     */
    async cacheRepriceResults(flightKey, results) {
        const key = `reprice:${flightKey}`;
        const ttl = 2 * 60; // 2 minutes
        return this.set(key, results, ttl);
    }

    /**
     * Store session data
     */
    async setSession(sessionId, data, ttlSeconds = 24 * 60 * 60) {
        const key = `session:${sessionId}`;
        return this.set(key, data, ttlSeconds);
    }

    /**
     * Get session data
     */
    async getSession(sessionId) {
        const key = `session:${sessionId}`;
        return this.get(key);
    }

    /**
     * Invalidate session
     */
    async deleteSession(sessionId) {
        const key = `session:${sessionId}`;
        return this.del(key);
    }

    /**
     * Close Redis connection
     */
    async close() {
        if (this.client) {
            await this.client.quit();
            this.client = null;
            this.isConnected = false;
            console.log('Redis connection closed');
        }
    }
}

module.exports = new RedisCache();
