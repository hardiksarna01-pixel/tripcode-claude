/**
 * Fault Tolerance & Circuit Breaker System
 * Ensures system reliability and prevents cascading failures
 */

const EventEmitter = require('events');

/**
 * Circuit Breaker States
 */
const CircuitState = {
    CLOSED: 'CLOSED',       // Normal operation
    OPEN: 'OPEN',           // Failing, rejecting requests
    HALF_OPEN: 'HALF_OPEN'  // Testing if service recovered
};

/**
 * Enhanced Circuit Breaker
 */
class CircuitBreaker extends EventEmitter {
    constructor(options = {}) {
        super();
        this.name = options.name || 'default';
        this.failureThreshold = options.failureThreshold || 5;
        this.successThreshold = options.successThreshold || 3;
        this.timeout = options.timeout || 30000;
        this.resetTimeout = options.resetTimeout || 60000;

        this.state = CircuitState.CLOSED;
        this.failures = 0;
        this.successes = 0;
        this.lastFailureTime = null;
        this.lastStateChange = Date.now();

        // Metrics
        this.metrics = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            rejectedRequests: 0,
            timeouts: 0,
            avgResponseTime: 0
        };

        // Health check interval
        this.healthCheckInterval = null;
    }

    async execute(fn, fallback = null) {
        this.metrics.totalRequests++;

        // Check if circuit is open
        if (this.state === CircuitState.OPEN) {
            // Check if enough time has passed to try again
            if (Date.now() - this.lastStateChange >= this.resetTimeout) {
                this.transitionTo(CircuitState.HALF_OPEN);
            } else {
                this.metrics.rejectedRequests++;
                this.emit('rejected', { name: this.name });

                if (fallback) {
                    return await this.executeFallback(fallback);
                }
                throw new CircuitBreakerError('Circuit breaker is OPEN', this.name);
            }
        }

        const startTime = Date.now();

        try {
            // Execute with timeout
            const result = await this.executeWithTimeout(fn);
            this.onSuccess(Date.now() - startTime);
            return result;
        } catch (error) {
            this.onFailure(error);

            if (fallback) {
                return await this.executeFallback(fallback);
            }
            throw error;
        }
    }

    async executeWithTimeout(fn) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                this.metrics.timeouts++;
                reject(new TimeoutError('Operation timed out', this.timeout));
            }, this.timeout);

            Promise.resolve(fn())
                .then(result => {
                    clearTimeout(timer);
                    resolve(result);
                })
                .catch(error => {
                    clearTimeout(timer);
                    reject(error);
                });
        });
    }

    async executeFallback(fallback) {
        try {
            return await fallback();
        } catch (fallbackError) {
            throw new FallbackError('Fallback execution failed', fallbackError);
        }
    }

    onSuccess(responseTime) {
        this.metrics.successfulRequests++;
        this.updateAvgResponseTime(responseTime);

        if (this.state === CircuitState.HALF_OPEN) {
            this.successes++;
            if (this.successes >= this.successThreshold) {
                this.transitionTo(CircuitState.CLOSED);
            }
        } else {
            // Reset failure count on success in CLOSED state
            this.failures = Math.max(0, this.failures - 1);
        }

        this.emit('success', { name: this.name, responseTime });
    }

    onFailure(error) {
        this.metrics.failedRequests++;
        this.failures++;
        this.lastFailureTime = Date.now();

        if (this.state === CircuitState.HALF_OPEN) {
            // Immediate transition back to OPEN
            this.transitionTo(CircuitState.OPEN);
        } else if (this.failures >= this.failureThreshold) {
            this.transitionTo(CircuitState.OPEN);
        }

        this.emit('failure', { name: this.name, error: error.message });
    }

    transitionTo(newState) {
        const oldState = this.state;
        this.state = newState;
        this.lastStateChange = Date.now();

        if (newState === CircuitState.CLOSED) {
            this.failures = 0;
            this.successes = 0;
        } else if (newState === CircuitState.HALF_OPEN) {
            this.successes = 0;
        }

        this.emit('stateChange', {
            name: this.name,
            from: oldState,
            to: newState
        });

        console.log(`[CircuitBreaker:${this.name}] State changed: ${oldState} -> ${newState}`);
    }

    updateAvgResponseTime(responseTime) {
        const n = this.metrics.successfulRequests;
        this.metrics.avgResponseTime = ((n - 1) * this.metrics.avgResponseTime + responseTime) / n;
    }

    getState() {
        return this.state;
    }

    getMetrics() {
        return {
            ...this.metrics,
            state: this.state,
            failures: this.failures,
            successes: this.successes
        };
    }

    reset() {
        this.state = CircuitState.CLOSED;
        this.failures = 0;
        this.successes = 0;
        this.lastStateChange = Date.now();
        this.emit('reset', { name: this.name });
    }

    forceOpen() {
        this.transitionTo(CircuitState.OPEN);
    }

    forceClose() {
        this.transitionTo(CircuitState.CLOSED);
    }

    // Health check with periodic ping
    startHealthCheck(healthFn, interval = 30000) {
        this.stopHealthCheck();
        this.healthCheckInterval = setInterval(async () => {
            if (this.state === CircuitState.OPEN) {
                try {
                    await healthFn();
                    this.transitionTo(CircuitState.HALF_OPEN);
                } catch {
                    // Still unhealthy, keep circuit open
                }
            }
        }, interval);
    }

    stopHealthCheck() {
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
            this.healthCheckInterval = null;
        }
    }
}

/**
 * Circuit Breaker Error Types
 */
class CircuitBreakerError extends Error {
    constructor(message, circuitName) {
        super(message);
        this.name = 'CircuitBreakerError';
        this.circuitName = circuitName;
        this.status = 503;
    }
}

class TimeoutError extends Error {
    constructor(message, timeout) {
        super(message);
        this.name = 'TimeoutError';
        this.timeout = timeout;
        this.status = 504;
    }
}

class FallbackError extends Error {
    constructor(message, originalError) {
        super(message);
        this.name = 'FallbackError';
        this.originalError = originalError;
        this.status = 503;
    }
}

/**
 * Circuit Breaker Registry
 * Manages multiple circuit breakers
 */
class CircuitBreakerRegistry {
    constructor() {
        this.breakers = new Map();
    }

    create(name, options = {}) {
        if (this.breakers.has(name)) {
            return this.breakers.get(name);
        }

        const breaker = new CircuitBreaker({ name, ...options });
        this.breakers.set(name, breaker);
        return breaker;
    }

    get(name) {
        return this.breakers.get(name);
    }

    getOrCreate(name, options = {}) {
        return this.get(name) || this.create(name, options);
    }

    remove(name) {
        const breaker = this.breakers.get(name);
        if (breaker) {
            breaker.stopHealthCheck();
            this.breakers.delete(name);
        }
    }

    resetAll() {
        for (const breaker of this.breakers.values()) {
            breaker.reset();
        }
    }

    getStats() {
        const stats = {};
        for (const [name, breaker] of this.breakers) {
            stats[name] = breaker.getMetrics();
        }
        return stats;
    }

    getHealthStatus() {
        const status = {
            healthy: 0,
            degraded: 0,
            unhealthy: 0,
            details: {}
        };

        for (const [name, breaker] of this.breakers) {
            const state = breaker.getState();
            status.details[name] = state;

            if (state === CircuitState.CLOSED) {
                status.healthy++;
            } else if (state === CircuitState.HALF_OPEN) {
                status.degraded++;
            } else {
                status.unhealthy++;
            }
        }

        return status;
    }
}

/**
 * Retry Policy
 */
class RetryPolicy {
    constructor(options = {}) {
        this.maxRetries = options.maxRetries || 3;
        this.initialDelay = options.initialDelay || 100;
        this.maxDelay = options.maxDelay || 10000;
        this.backoffMultiplier = options.backoffMultiplier || 2;
        this.retryableErrors = options.retryableErrors || ['ETIMEDOUT', 'ECONNRESET', 'ECONNREFUSED', 'ENOTFOUND'];
    }

    async execute(fn) {
        let lastError;
        let delay = this.initialDelay;

        for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;

                if (attempt === this.maxRetries || !this.isRetryable(error)) {
                    throw error;
                }

                console.log(`[Retry] Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
                await this.sleep(delay);
                delay = Math.min(delay * this.backoffMultiplier, this.maxDelay);
            }
        }

        throw lastError;
    }

    isRetryable(error) {
        // Check error code
        if (error.code && this.retryableErrors.includes(error.code)) {
            return true;
        }

        // Check status code (5xx errors are retryable)
        if (error.status && error.status >= 500 && error.status < 600) {
            return true;
        }

        // Timeout errors are retryable
        if (error.name === 'TimeoutError') {
            return true;
        }

        return false;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/**
 * Bulkhead Pattern
 * Isolates failures and limits concurrent executions
 */
class Bulkhead {
    constructor(options = {}) {
        this.name = options.name || 'default';
        this.maxConcurrent = options.maxConcurrent || 10;
        this.maxQueue = options.maxQueue || 100;
        this.timeout = options.timeout || 30000;

        this.running = 0;
        this.queue = [];

        this.metrics = {
            totalRequests: 0,
            completed: 0,
            rejected: 0,
            timedOut: 0
        };
    }

    async execute(fn) {
        this.metrics.totalRequests++;

        if (this.running >= this.maxConcurrent) {
            if (this.queue.length >= this.maxQueue) {
                this.metrics.rejected++;
                throw new BulkheadError('Bulkhead queue full', this.name);
            }

            // Add to queue
            return new Promise((resolve, reject) => {
                const queueItem = { fn, resolve, reject, addedAt: Date.now() };
                this.queue.push(queueItem);

                // Timeout handler
                setTimeout(() => {
                    const index = this.queue.indexOf(queueItem);
                    if (index !== -1) {
                        this.queue.splice(index, 1);
                        this.metrics.timedOut++;
                        reject(new BulkheadError('Bulkhead queue timeout', this.name));
                    }
                }, this.timeout);
            });
        }

        return this.run(fn);
    }

    async run(fn) {
        this.running++;

        try {
            const result = await fn();
            this.metrics.completed++;
            return result;
        } finally {
            this.running--;
            this.processQueue();
        }
    }

    processQueue() {
        if (this.queue.length > 0 && this.running < this.maxConcurrent) {
            const { fn, resolve, reject } = this.queue.shift();
            this.run(fn).then(resolve).catch(reject);
        }
    }

    getMetrics() {
        return {
            ...this.metrics,
            running: this.running,
            queued: this.queue.length
        };
    }
}

class BulkheadError extends Error {
    constructor(message, bulkheadName) {
        super(message);
        this.name = 'BulkheadError';
        this.bulkheadName = bulkheadName;
        this.status = 503;
    }
}

/**
 * Graceful Degradation Manager
 */
class GracefulDegradationManager {
    constructor() {
        this.degradedFeatures = new Map();
        this.fallbacks = new Map();
    }

    registerFallback(feature, fallbackFn) {
        this.fallbacks.set(feature, fallbackFn);
    }

    degrade(feature, duration = 300000) { // 5 minutes default
        this.degradedFeatures.set(feature, {
            degradedAt: Date.now(),
            expiresAt: Date.now() + duration
        });
        console.log(`[Degradation] Feature '${feature}' degraded for ${duration / 1000}s`);
    }

    recover(feature) {
        this.degradedFeatures.delete(feature);
        console.log(`[Degradation] Feature '${feature}' recovered`);
    }

    isDegraded(feature) {
        const info = this.degradedFeatures.get(feature);
        if (!info) return false;

        if (Date.now() > info.expiresAt) {
            this.degradedFeatures.delete(feature);
            return false;
        }

        return true;
    }

    async execute(feature, primaryFn, fallbackFn = null) {
        if (this.isDegraded(feature)) {
            const fallback = fallbackFn || this.fallbacks.get(feature);
            if (fallback) {
                return await fallback();
            }
            throw new Error(`Feature '${feature}' is degraded and no fallback available`);
        }

        return await primaryFn();
    }

    getStatus() {
        const status = {};
        const now = Date.now();

        for (const [feature, info] of this.degradedFeatures) {
            if (now < info.expiresAt) {
                status[feature] = {
                    degraded: true,
                    remainingMs: info.expiresAt - now
                };
            }
        }

        return status;
    }
}

/**
 * Service Health Aggregator
 */
class ServiceHealthAggregator {
    constructor() {
        this.services = new Map();
        this.circuitRegistry = new CircuitBreakerRegistry();
        this.degradationManager = new GracefulDegradationManager();
    }

    registerService(name, options = {}) {
        const service = {
            name,
            healthCheckFn: options.healthCheckFn,
            circuitBreaker: this.circuitRegistry.create(name, options.circuitBreaker),
            bulkhead: options.bulkhead ? new Bulkhead({ name, ...options.bulkhead }) : null,
            retryPolicy: options.retryPolicy ? new RetryPolicy(options.retryPolicy) : null,
            lastHealthCheck: null,
            healthy: true
        };

        this.services.set(name, service);
        return service;
    }

    async checkHealth(name) {
        const service = this.services.get(name);
        if (!service || !service.healthCheckFn) return null;

        try {
            const startTime = Date.now();
            await service.healthCheckFn();
            service.lastHealthCheck = Date.now();
            service.healthy = true;
            return {
                healthy: true,
                latency: Date.now() - startTime
            };
        } catch (error) {
            service.healthy = false;
            return {
                healthy: false,
                error: error.message
            };
        }
    }

    async checkAllHealth() {
        const results = {};
        for (const [name] of this.services) {
            results[name] = await this.checkHealth(name);
        }
        return results;
    }

    getOverallHealth() {
        const circuitHealth = this.circuitRegistry.getHealthStatus();
        const degradedFeatures = this.degradationManager.getStatus();

        let overallStatus = 'healthy';
        if (circuitHealth.unhealthy > 0) {
            overallStatus = 'unhealthy';
        } else if (circuitHealth.degraded > 0 || Object.keys(degradedFeatures).length > 0) {
            overallStatus = 'degraded';
        }

        return {
            status: overallStatus,
            circuits: circuitHealth,
            degradedFeatures,
            services: Object.fromEntries(
                Array.from(this.services.entries()).map(([name, svc]) => [
                    name,
                    { healthy: svc.healthy, lastCheck: svc.lastHealthCheck }
                ])
            )
        };
    }
}

// Singleton instances
const circuitBreakerRegistry = new CircuitBreakerRegistry();
const degradationManager = new GracefulDegradationManager();
const healthAggregator = new ServiceHealthAggregator();

module.exports = {
    CircuitBreaker,
    CircuitState,
    CircuitBreakerError,
    TimeoutError,
    FallbackError,
    CircuitBreakerRegistry,
    RetryPolicy,
    Bulkhead,
    BulkheadError,
    GracefulDegradationManager,
    ServiceHealthAggregator,
    circuitBreakerRegistry,
    degradationManager,
    healthAggregator
};
