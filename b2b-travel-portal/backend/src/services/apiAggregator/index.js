/**
 * API Aggregator - Multi-Supplier Flight Search Engine
 *
 * Handles 100+ supplier APIs with different formats and specifications
 * Features:
 * - Parallel API calls for fastest response
 * - Unified response format
 * - Best fare ranking
 * - Circuit breaker for fault tolerance
 * - Intelligent caching
 * - Rate limiting per supplier
 */

const SupplierRegistry = require('./supplierRegistry');
const FareAggregator = require('./fareAggregator');
const CircuitBreaker = require('./circuitBreaker');
const ResponseNormalizer = require('./responseNormalizer');
const CacheManager = require('./cacheManager');
const RateLimiter = require('./rateLimiter');

class APIAggregator {
    constructor(options = {}) {
        this.supplierRegistry = new SupplierRegistry();
        this.fareAggregator = new FareAggregator();
        this.cacheManager = new CacheManager(options.cache || {});
        this.rateLimiter = new RateLimiter();

        // Configuration
        this.config = {
            timeout: options.timeout || 30000,           // 30 seconds max
            minSuppliers: options.minSuppliers || 1,     // Minimum suppliers to wait for
            maxWaitTime: options.maxWaitTime || 15000,   // Max wait for slow suppliers
            cacheEnabled: options.cacheEnabled !== false,
            cacheTTL: options.cacheTTL || 300,           // 5 minutes cache
            retryCount: options.retryCount || 2,
            enableFallback: options.enableFallback !== false
        };

        // Statistics
        this.stats = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            cacheHits: 0,
            averageResponseTime: 0,
            supplierStats: new Map()
        };
    }

    /**
     * Search flights across all registered suppliers
     */
    async searchFlights(searchParams) {
        const startTime = Date.now();
        this.stats.totalRequests++;

        try {
            // Generate cache key
            const cacheKey = this.generateCacheKey('flight', searchParams);

            // Check cache first
            if (this.config.cacheEnabled) {
                const cachedResult = await this.cacheManager.get(cacheKey);
                if (cachedResult) {
                    this.stats.cacheHits++;
                    console.log(`[Aggregator] Cache hit for search: ${cacheKey}`);
                    return {
                        ...cachedResult,
                        fromCache: true,
                        responseTime: Date.now() - startTime
                    };
                }
            }

            // Get active suppliers for this search
            const activeSuppliers = this.supplierRegistry.getActiveSuppliers('flight', searchParams);
            console.log(`[Aggregator] Searching ${activeSuppliers.length} suppliers...`);

            if (activeSuppliers.length === 0) {
                throw new Error('No active suppliers available for this search');
            }

            // Execute parallel search with smart timeout
            const results = await this.executeParallelSearch(activeSuppliers, searchParams);

            // Aggregate and rank results
            const aggregatedResults = this.fareAggregator.aggregateFlights(results, searchParams);

            // Cache the results
            if (this.config.cacheEnabled && aggregatedResults.flights.length > 0) {
                await this.cacheManager.set(cacheKey, aggregatedResults, this.config.cacheTTL);
            }

            const responseTime = Date.now() - startTime;
            this.updateStats(responseTime, true);

            return {
                ...aggregatedResults,
                fromCache: false,
                responseTime,
                suppliersQueried: activeSuppliers.length,
                suppliersResponded: results.filter(r => r.success).length
            };

        } catch (error) {
            this.stats.failedRequests++;
            console.error('[Aggregator] Search failed:', error.message);
            throw error;
        }
    }

    /**
     * Execute parallel search across all suppliers with smart timeout
     */
    async executeParallelSearch(suppliers, searchParams) {
        const results = [];
        const supplierPromises = [];

        for (const supplier of suppliers) {
            // Check rate limit
            if (!this.rateLimiter.canMakeRequest(supplier.id)) {
                console.log(`[Aggregator] Rate limited: ${supplier.id}`);
                results.push({
                    supplierId: supplier.id,
                    success: false,
                    error: 'Rate limited',
                    flights: []
                });
                continue;
            }

            // Create promise with circuit breaker
            const promise = this.searchSupplierWithBreaker(supplier, searchParams);
            supplierPromises.push({
                supplierId: supplier.id,
                promise
            });
        }

        // Wait for results with smart timeout strategy
        const searchResults = await this.waitForResults(supplierPromises);

        return [...results, ...searchResults];
    }

    /**
     * Search a single supplier with circuit breaker protection
     */
    async searchSupplierWithBreaker(supplier, searchParams) {
        const circuitBreaker = CircuitBreaker.getBreaker(supplier.id);

        if (circuitBreaker.isOpen()) {
            console.log(`[Aggregator] Circuit open for: ${supplier.id}`);
            return {
                supplierId: supplier.id,
                success: false,
                error: 'Circuit breaker open',
                flights: []
            };
        }

        const startTime = Date.now();

        try {
            // Apply rate limiting
            this.rateLimiter.recordRequest(supplier.id);

            // Execute search with timeout
            const result = await Promise.race([
                supplier.adapter.searchFlights(searchParams),
                this.createTimeout(supplier.timeout || this.config.timeout)
            ]);

            // Normalize response
            const normalizedFlights = ResponseNormalizer.normalizeFlights(
                result,
                supplier.id,
                supplier.responseFormat
            );

            const responseTime = Date.now() - startTime;
            circuitBreaker.recordSuccess();
            this.updateSupplierStats(supplier.id, responseTime, true);

            return {
                supplierId: supplier.id,
                supplierName: supplier.name,
                success: true,
                flights: normalizedFlights,
                responseTime,
                originalCount: result?.flights?.length || normalizedFlights.length
            };

        } catch (error) {
            const responseTime = Date.now() - startTime;
            circuitBreaker.recordFailure();
            this.updateSupplierStats(supplier.id, responseTime, false);

            console.error(`[Aggregator] Supplier ${supplier.id} failed:`, error.message);

            return {
                supplierId: supplier.id,
                supplierName: supplier.name,
                success: false,
                error: error.message,
                flights: [],
                responseTime
            };
        }
    }

    /**
     * Smart wait strategy - return early if enough results
     */
    async waitForResults(supplierPromises) {
        const results = [];
        const pending = new Map();

        // Track all promises
        supplierPromises.forEach(({ supplierId, promise }) => {
            pending.set(supplierId, promise);
        });

        // Wait for minimum suppliers or timeout
        const minResults = Math.min(this.config.minSuppliers, supplierPromises.length);
        const maxWait = this.config.maxWaitTime;

        return new Promise((resolve) => {
            let resolved = false;
            let completedCount = 0;

            const checkComplete = () => {
                if (resolved) return;

                // Resolve if all completed or minimum reached with timeout
                if (completedCount >= supplierPromises.length) {
                    resolved = true;
                    resolve(results);
                }
            };

            // Process each promise
            supplierPromises.forEach(({ supplierId, promise }) => {
                promise.then(result => {
                    results.push(result);
                    completedCount++;
                    checkComplete();
                }).catch(error => {
                    results.push({
                        supplierId,
                        success: false,
                        error: error.message,
                        flights: []
                    });
                    completedCount++;
                    checkComplete();
                });
            });

            // Max wait timeout
            setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    console.log(`[Aggregator] Max wait reached. Got ${results.length}/${supplierPromises.length} results`);
                    resolve(results);
                }
            }, maxWait);

            // Early resolve if we have enough good results
            const earlyResolveCheck = setInterval(() => {
                const successCount = results.filter(r => r.success && r.flights.length > 0).length;
                if (successCount >= minResults && results.length >= Math.ceil(supplierPromises.length * 0.5)) {
                    if (!resolved) {
                        resolved = true;
                        clearInterval(earlyResolveCheck);
                        console.log(`[Aggregator] Early resolve with ${results.length} results`);
                        resolve(results);
                    }
                }
            }, 500);

            // Cleanup interval on resolve
            setTimeout(() => clearInterval(earlyResolveCheck), maxWait + 100);
        });
    }

    /**
     * Create timeout promise
     */
    createTimeout(ms) {
        return new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timeout')), ms);
        });
    }

    /**
     * Generate cache key from search parameters
     */
    generateCacheKey(type, params) {
        const keyParts = [
            type,
            params.origin,
            params.destination,
            params.departureDate,
            params.returnDate || 'oneway',
            params.adults || 1,
            params.children || 0,
            params.infants || 0,
            params.cabinClass || 'economy',
            params.directOnly ? 'direct' : 'all'
        ];
        return keyParts.join(':');
    }

    /**
     * Update global statistics
     */
    updateStats(responseTime, success) {
        if (success) {
            this.stats.successfulRequests++;
        }

        // Calculate rolling average
        const totalSuccess = this.stats.successfulRequests;
        this.stats.averageResponseTime = (
            (this.stats.averageResponseTime * (totalSuccess - 1) + responseTime) / totalSuccess
        );
    }

    /**
     * Update per-supplier statistics
     */
    updateSupplierStats(supplierId, responseTime, success) {
        if (!this.stats.supplierStats.has(supplierId)) {
            this.stats.supplierStats.set(supplierId, {
                requests: 0,
                successes: 0,
                failures: 0,
                avgResponseTime: 0,
                lastResponseTime: 0
            });
        }

        const stats = this.stats.supplierStats.get(supplierId);
        stats.requests++;
        stats.lastResponseTime = responseTime;

        if (success) {
            stats.successes++;
            stats.avgResponseTime = (
                (stats.avgResponseTime * (stats.successes - 1) + responseTime) / stats.successes
            );
        } else {
            stats.failures++;
        }
    }

    /**
     * Get aggregator statistics
     */
    getStats() {
        const supplierStatsObj = {};
        this.stats.supplierStats.forEach((value, key) => {
            supplierStatsObj[key] = {
                ...value,
                successRate: value.requests > 0
                    ? ((value.successes / value.requests) * 100).toFixed(2) + '%'
                    : 'N/A'
            };
        });

        return {
            ...this.stats,
            supplierStats: supplierStatsObj,
            cacheHitRate: this.stats.totalRequests > 0
                ? ((this.stats.cacheHits / this.stats.totalRequests) * 100).toFixed(2) + '%'
                : 'N/A',
            successRate: this.stats.totalRequests > 0
                ? ((this.stats.successfulRequests / this.stats.totalRequests) * 100).toFixed(2) + '%'
                : 'N/A'
        };
    }

    /**
     * Register a new supplier
     */
    registerSupplier(supplierConfig) {
        return this.supplierRegistry.register(supplierConfig);
    }

    /**
     * Get registered suppliers
     */
    getSuppliers() {
        return this.supplierRegistry.getAll();
    }

    /**
     * Health check
     */
    async healthCheck() {
        const suppliers = this.supplierRegistry.getAll();
        const health = {
            status: 'healthy',
            totalSuppliers: suppliers.length,
            activeSuppliers: 0,
            supplierHealth: {}
        };

        for (const supplier of suppliers) {
            const breaker = CircuitBreaker.getBreaker(supplier.id);
            const stats = this.stats.supplierStats.get(supplier.id) || {};

            health.supplierHealth[supplier.id] = {
                name: supplier.name,
                active: supplier.active,
                circuitState: breaker.getState(),
                successRate: stats.requests > 0
                    ? ((stats.successes / stats.requests) * 100).toFixed(2) + '%'
                    : 'N/A',
                avgResponseTime: stats.avgResponseTime?.toFixed(0) + 'ms' || 'N/A'
            };

            if (supplier.active && !breaker.isOpen()) {
                health.activeSuppliers++;
            }
        }

        if (health.activeSuppliers === 0) {
            health.status = 'critical';
        } else if (health.activeSuppliers < suppliers.length * 0.5) {
            health.status = 'degraded';
        }

        return health;
    }
}

// Export singleton instance
module.exports = new APIAggregator();
module.exports.APIAggregator = APIAggregator;
