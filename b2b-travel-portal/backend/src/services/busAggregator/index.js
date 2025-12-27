/**
 * Bus API Aggregator
 * Aggregates bus inventory from 40+ operators and aggregators
 * Returns best fares with seat availability
 */

const SupplierRegistry = require('./supplierRegistry');
const { createAdapter } = require('./adapters');
const FareAggregator = require('./fareAggregator');
const CacheManager = require('../apiAggregator/cacheManager');
const RateLimiter = require('../apiAggregator/rateLimiter');
const CircuitBreaker = require('../apiAggregator/circuitBreaker');
const ResponseNormalizer = require('./responseNormalizer');

class BusAggregator {
    constructor(options = {}) {
        this.supplierRegistry = new SupplierRegistry();
        this.fareAggregator = new FareAggregator();
        this.cacheManager = new CacheManager({
            maxSize: options.cacheSize || 5000,
            defaultTTL: options.cacheTTL || 300 // 5 minutes for buses
        });
        this.rateLimiter = new RateLimiter({
            defaultRequests: 60,
            defaultWindow: 60
        });

        // Configuration
        this.config = {
            timeout: options.timeout || 6000,         // 6 second max
            minSuppliers: options.minSuppliers || 8,
            minBuses: options.minBuses || 15,
            earlyReturnThreshold: options.earlyReturnThreshold || 0.5
        };

        // Statistics
        this.stats = {
            totalSearches: 0,
            cacheHits: 0,
            avgResponseTime: 0,
            suppliersQueried: 0
        };

        console.log('[BusAggregator] Initialized with', this.supplierRegistry.getActive().length, 'active suppliers');
    }

    /**
     * Search buses across all suppliers
     */
    async searchBuses(searchParams) {
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

        // Get active suppliers for this route
        const suppliers = this.supplierRegistry.getForRoute(searchParams);
        this.stats.suppliersQueried += suppliers.length;

        // Execute parallel search
        const results = await this.executeParallelSearch(suppliers, searchParams);

        // Aggregate and rank results
        const aggregated = this.fareAggregator.aggregateBuses(results, searchParams);

        // Cache results
        await this.cacheManager.set(cacheKey, aggregated, 300);

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
                const totalBuses = results.reduce((sum, r) => sum + (r.buses?.length || 0), 0);

                return (
                    successCount >= this.config.minSuppliers &&
                    totalBuses >= this.config.minBuses
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
                    const breaker = CircuitBreaker.getBreaker(`bus_${supplier.id}`);
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
                    const normalized = ResponseNormalizer.normalizeBuses(
                        response,
                        supplier.id,
                        supplier.responseFormat
                    );

                    breaker.recordSuccess();

                    results.push({
                        supplierId: supplier.id,
                        supplierName: supplier.name,
                        success: true,
                        buses: normalized,
                        responseTime: Date.now()
                    });
                } catch (error) {
                    const breaker = CircuitBreaker.getBreaker(`bus_${supplier.id}`);
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
     * Get bus details including seat layout
     */
    async getBusDetails(busId, supplierId) {
        const supplier = this.supplierRegistry.get(supplierId);
        if (!supplier) {
            throw new Error(`Supplier ${supplierId} not found`);
        }

        const adapter = createAdapter(supplier);
        return adapter.getDetails(busId);
    }

    /**
     * Get seat layout for a bus
     */
    async getSeatLayout(busId, supplierId) {
        const supplier = this.supplierRegistry.get(supplierId);
        if (!supplier) {
            throw new Error(`Supplier ${supplierId} not found`);
        }

        const adapter = createAdapter(supplier);
        return adapter.getSeatLayout(busId);
    }

    /**
     * Block seats temporarily
     */
    async blockSeats(busId, supplierId, seats, passengerInfo) {
        const supplier = this.supplierRegistry.get(supplierId);
        if (!supplier) {
            throw new Error(`Supplier ${supplierId} not found`);
        }

        const adapter = createAdapter(supplier);
        return adapter.blockSeats(busId, seats, passengerInfo);
    }

    /**
     * Generate cache key
     */
    generateCacheKey(params) {
        return `bus:${params.source}:${params.destination}:${params.date}`;
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
            const breaker = CircuitBreaker.getBreaker(`bus_${s.id}`);
            health.suppliers.details[s.id] = {
                name: s.name,
                active: s.active,
                circuitState: breaker.state
            };
        });

        return health;
    }
}

module.exports = new BusAggregator();
