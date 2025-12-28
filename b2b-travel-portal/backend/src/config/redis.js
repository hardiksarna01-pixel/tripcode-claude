/**
 * In-Memory Cache Mock
 * Replaces Redis with in-memory storage for development without Redis
 */
class InMemoryCache {
    constructor() {
        this.cache = new Map();
        this.isConnected = true;
    }

    /**
     * Initialize connection (mock - always succeeds)
     */
    async connect() {
        this.isConnected = true;
        console.log('✅ In-memory cache initialized successfully');
        return this;
    }

    /**
     * Check if cache is available
     */
    isAvailable() {
        return this.isConnected;
    }

    /**
     * Get value from cache
     */
    async get(key) {
        const item = this.cache.get(key);
        if (!item) return null;

        // Check if expired
        if (item.expiry && Date.now() > item.expiry) {
            this.cache.delete(key);
            return null;
        }

        return item.value;
    }

    /**
     * Set value in cache with optional TTL (in seconds)
     */
    async set(key, value, ttlSeconds = 300) {
        const expiry = ttlSeconds ? Date.now() + (ttlSeconds * 1000) : null;
        this.cache.set(key, { value, expiry });
        return true;
    }

    /**
     * Delete a key from cache
     */
    async del(key) {
        this.cache.delete(key);
        return true;
    }

    /**
     * Delete keys matching a pattern (simple wildcard support)
     */
    async delPattern(pattern) {
        const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
        for (const key of this.cache.keys()) {
            if (regex.test(key)) {
                this.cache.delete(key);
            }
        }
        return true;
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
     * Close connection (mock)
     */
    async close() {
        this.cache.clear();
        this.isConnected = false;
        console.log('In-memory cache closed');
    }

    /**
     * Clean up expired entries (optional maintenance)
     */
    cleanup() {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (item.expiry && now > item.expiry) {
                this.cache.delete(key);
            }
        }
    }
}

module.exports = new InMemoryCache();
