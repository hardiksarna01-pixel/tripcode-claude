/**
 * Hotel API Aggregator
 * Aggregates hotel inventory from 50+ suppliers in parallel
 * Returns best rates with deduplication and ranking
 */

const SupplierRegistry = require('./supplierRegistry');
const { createAdapter } = require('./adapters');
const RateAggregator = require('./rateAggregator');
const CacheManager = require('../apiAggregator/cacheManager');
const RateLimiter = require('../apiAggregator/rateLimiter');
const CircuitBreaker = require('../apiAggregator/circuitBreaker');
const ResponseNormalizer = require('./responseNormalizer');

class HotelAggregator {
    constructor(options = {}) {
        this.supplierRegistry = new SupplierRegistry();
        this.rateAggregator = new RateAggregator();
        this.cacheManager = new CacheManager({
            maxSize: options.cacheSize || 5000,
            defaultTTL: options.cacheTTL || 600 // 10 minutes for hotels
        });
        this.rateLimiter = new RateLimiter({
            defaultRequests: 50,
            defaultWindow: 60
        });

        // Configuration
        this.config = {
            timeout: options.timeout || 8000,         // 8 second max
            minSuppliers: options.minSuppliers || 10,
            minHotels: options.minHotels || 20,
            earlyReturnThreshold: options.earlyReturnThreshold || 0.5
        };

        // Statistics
        this.stats = {
            totalSearches: 0,
            cacheHits: 0,
            avgResponseTime: 0,
            suppliersQueried: 0
        };

        console.log('[HotelAggregator] Initialized with', this.supplierRegistry.getActive().length, 'active suppliers');
    }

    /**
     * Search hotels across all suppliers
     */
    async searchHotels(searchParams) {
        const startTime = Date.now();
        this.stats.totalSearches++;

        // Generate cache key
        const cacheKey = this.generateCacheKey(searchParams);

        // Check cache
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            this.stats.cacheHits++;
            return {
                ...cached,
                fromCache: true,
                responseTime: Date.now() - startTime
            };
        }

        // Get active suppliers for this search
        const suppliers = this.supplierRegistry.getForSearch(searchParams);
        this.stats.suppliersQueried += suppliers.length;

        // Execute parallel search
        const results = await this.executeParallelSearch(suppliers, searchParams);

        // Aggregate and rank results
        const aggregated = this.rateAggregator.aggregateHotels(results, searchParams);

        // Cache results
        await this.cacheManager.set(cacheKey, aggregated, 600);

        const responseTime = Date.now() - startTime;
        this.updateStats(responseTime);

        return {
            ...aggregated,
            fromCache: false,
            responseTime,
            suppliersQueried: suppliers.length,
            suppliersResponded: results.filter(r => r.success).length
        };
    }

    /**
     * Execute parallel search across suppliers
     */
    async executeParallelSearch(suppliers, searchParams) {
        const results = [];
        let resolved = 0;

        return new Promise((resolve) => {
            const checkEarlyReturn = () => {
                const successCount = results.filter(r => r.success).length;
                const totalHotels = results.reduce((sum, r) => sum + (r.hotels?.length || 0), 0);

                return (
                    successCount >= this.config.minSuppliers &&
                    totalHotels >= this.config.minHotels
                ) || (resolved / suppliers.length >= this.config.earlyReturnThreshold);
            };

            const maxTimeout = setTimeout(() => {
                resolve(results);
            }, this.config.timeout);

            const finalize = () => {
                clearTimeout(maxTimeout);
                resolve(results);
            };

            suppliers.forEach(async (supplier) => {
                try {
                    // Check rate limit
                    if (!this.rateLimiter.canMakeRequest(supplier.id)) {
                        results.push({
                            supplierId: supplier.id,
                            success: false,
                            error: 'Rate limited'
                        });
                        resolved++;
                        return;
                    }

                    // Check circuit breaker
                    const breaker = CircuitBreaker.getBreaker(supplier.id);
                    if (breaker.isOpen()) {
                        results.push({
                            supplierId: supplier.id,
                            success: false,
                            error: 'Circuit open'
                        });
                        resolved++;
                        return;
                    }

                    this.rateLimiter.recordRequest(supplier.id);

                    // Create adapter and search
                    const adapter = createAdapter(supplier);
                    const response = await adapter.search(searchParams);

                    // Normalize response
                    const normalized = ResponseNormalizer.normalizeHotels(
                        response,
                        supplier.id,
                        supplier.responseFormat
                    );

                    breaker.recordSuccess();

                    results.push({
                        supplierId: supplier.id,
                        supplierName: supplier.name,
                        success: true,
                        hotels: normalized,
                        responseTime: Date.now()
                    });
                } catch (error) {
                    const breaker = CircuitBreaker.getBreaker(supplier.id);
                    breaker.recordFailure();

                    results.push({
                        supplierId: supplier.id,
                        success: false,
                        error: error.message
                    });
                } finally {
                    resolved++;
                    if (checkEarlyReturn()) {
                        finalize();
                    }
                }
            });
        });
    }

    /**
     * Get hotel details from specific supplier
     */
    async getHotelDetails(hotelId, supplierId) {
        const supplier = this.supplierRegistry.get(supplierId);
        if (!supplier) {
            throw new Error(`Supplier ${supplierId} not found`);
        }

        const adapter = createAdapter(supplier);
        return adapter.getDetails(hotelId);
    }

    /**
     * Check room availability and get live rates
     */
    async checkAvailability(hotelId, supplierId, roomParams) {
        const supplier = this.supplierRegistry.get(supplierId);
        if (!supplier) {
            throw new Error(`Supplier ${supplierId} not found`);
        }

        const adapter = createAdapter(supplier);
        return adapter.checkAvailability(hotelId, roomParams);
    }

    /**
     * Generate cache key
     */
    generateCacheKey(params) {
        return `hotel:${params.destination}:${params.checkIn}:${params.checkOut}:${params.rooms}:${params.guests}`;
    }

    /**
     * Update statistics
     */
    updateStats(responseTime) {
        const total = this.stats.totalSearches;
        this.stats.avgResponseTime = Math.round(
            ((this.stats.avgResponseTime * (total - 1)) + responseTime) / total
        );
    }

    /**
     * Get aggregator statistics
     */
    getStats() {
        return {
            ...this.stats,
            cacheStats: this.cacheManager.getStats(),
            rateLimitStats: this.rateLimiter.getStats(),
            activeSuppliers: this.supplierRegistry.getActive().length
        };
    }

    /**
     * Get all suppliers
     */
    getSuppliers() {
        return this.supplierRegistry.getAll();
    }

    /**
     * Register new supplier
     */
    registerSupplier(config) {
        return this.supplierRegistry.register(config);
    }

    /**
     * Health check
     */
    async healthCheck() {
        const suppliers = this.supplierRegistry.getAll();
        const health = {
            status: 'healthy',
            suppliers: {
                total: suppliers.length,
                active: suppliers.filter(s => s.active).length,
                details: {}
            }
        };

        suppliers.forEach(s => {
            const breaker = CircuitBreaker.getBreaker(s.id);
            health.suppliers.details[s.id] = {
                name: s.name,
                active: s.active,
                circuitState: breaker.state
            };
        });

        return health;
    }
}

module.exports = new HotelAggregator();
