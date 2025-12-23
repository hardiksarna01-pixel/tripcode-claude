/**
 * Monitoring Utilities
 * Metrics collection and health monitoring
 */

const logger = require('./logger');

/**
 * Simple in-memory metrics store
 * In production, use Prometheus, DataDog, or similar
 */
class Metrics {
    constructor() {
        this.counters = {};
        this.gauges = {};
        this.histograms = {};
        this.startTime = Date.now();
    }

    /**
     * Increment a counter
     */
    incrementCounter(name, value = 1, labels = {}) {
        const key = this.generateKey(name, labels);
        this.counters[key] = (this.counters[key] || 0) + value;
    }

    /**
     * Set a gauge value
     */
    setGauge(name, value, labels = {}) {
        const key = this.generateKey(name, labels);
        this.gauges[key] = value;
    }

    /**
     * Record a histogram value
     */
    recordHistogram(name, value, labels = {}) {
        const key = this.generateKey(name, labels);
        if (!this.histograms[key]) {
            this.histograms[key] = {
                count: 0,
                sum: 0,
                min: Infinity,
                max: -Infinity,
                values: []
            };
        }

        const hist = this.histograms[key];
        hist.count++;
        hist.sum += value;
        hist.min = Math.min(hist.min, value);
        hist.max = Math.max(hist.max, value);

        // Keep last 1000 values for percentile calculation
        hist.values.push(value);
        if (hist.values.length > 1000) {
            hist.values.shift();
        }
    }

    /**
     * Generate a unique key for metrics with labels
     */
    generateKey(name, labels) {
        const labelStr = Object.entries(labels)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([k, v]) => `${k}="${v}"`)
            .join(',');

        return labelStr ? `${name}{${labelStr}}` : name;
    }

    /**
     * Get all metrics
     */
    getMetrics() {
        return {
            uptime: Date.now() - this.startTime,
            counters: { ...this.counters },
            gauges: { ...this.gauges },
            histograms: Object.fromEntries(
                Object.entries(this.histograms).map(([key, hist]) => {
                    const sorted = [...hist.values].sort((a, b) => a - b);
                    return [key, {
                        count: hist.count,
                        sum: hist.sum,
                        min: hist.min,
                        max: hist.max,
                        avg: hist.count > 0 ? hist.sum / hist.count : 0,
                        p50: this.percentile(sorted, 50),
                        p95: this.percentile(sorted, 95),
                        p99: this.percentile(sorted, 99)
                    }];
                })
            )
        };
    }

    /**
     * Calculate percentile
     */
    percentile(sorted, p) {
        if (sorted.length === 0) return 0;
        const index = Math.ceil((p / 100) * sorted.length) - 1;
        return sorted[Math.max(0, index)];
    }

    /**
     * Reset all metrics
     */
    reset() {
        this.counters = {};
        this.gauges = {};
        this.histograms = {};
    }
}

const metrics = new Metrics();

/**
 * Metrics collection middleware
 */
const metricsMiddleware = (req, res, next) => {
    const start = Date.now();

    // Count requests
    metrics.incrementCounter('http_requests_total', 1, {
        method: req.method,
        path: req.route?.path || req.path
    });

    res.on('finish', () => {
        const duration = Date.now() - start;

        // Record response time
        metrics.recordHistogram('http_request_duration_ms', duration, {
            method: req.method,
            status: res.statusCode
        });

        // Count by status code
        metrics.incrementCounter('http_responses_total', 1, {
            method: req.method,
            status: res.statusCode
        });
    });

    next();
};

/**
 * Error tracking
 */
class ErrorTracker {
    constructor() {
        this.errors = [];
        this.maxErrors = 100;
    }

    /**
     * Track an error
     */
    track(error, context = {}) {
        const errorEntry = {
            timestamp: new Date().toISOString(),
            message: error.message,
            stack: error.stack,
            code: error.code || 'UNKNOWN',
            context
        };

        this.errors.unshift(errorEntry);

        // Keep only last N errors
        if (this.errors.length > this.maxErrors) {
            this.errors.pop();
        }

        // Log the error
        logger.logError(error, context.req);

        // In production, send to external service like Sentry
        if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
            this.sendToSentry(errorEntry);
        }
    }

    /**
     * Get recent errors
     */
    getRecentErrors(limit = 10) {
        return this.errors.slice(0, limit);
    }

    /**
     * Send to Sentry (placeholder)
     */
    sendToSentry(errorEntry) {
        // In production, integrate with Sentry SDK
        // Sentry.captureException(new Error(errorEntry.message), {
        //     extra: errorEntry.context
        // });
        console.log('Would send to Sentry:', errorEntry.message);
    }
}

const errorTracker = new ErrorTracker();

/**
 * Health check utilities
 */
const healthCheck = {
    /**
     * Check database health
     */
    async checkDatabase(db) {
        try {
            const start = Date.now();
            await db.query('SELECT 1');
            const duration = Date.now() - start;

            return {
                status: 'healthy',
                responseTime: duration
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                error: error.message
            };
        }
    },

    /**
     * Check Redis health
     */
    async checkRedis(redis) {
        try {
            if (!redis.isAvailable()) {
                return {
                    status: 'disconnected'
                };
            }

            const start = Date.now();
            await redis.client.ping();
            const duration = Date.now() - start;

            return {
                status: 'healthy',
                responseTime: duration
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                error: error.message
            };
        }
    },

    /**
     * Check external API health
     */
    async checkExternalApi(apiService, testEndpoint) {
        try {
            const start = Date.now();
            // Make a lightweight test request
            await apiService.getSectorAvailability({ userId: 'test' });
            const duration = Date.now() - start;

            return {
                status: 'healthy',
                responseTime: duration
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                error: error.message
            };
        }
    },

    /**
     * Get system health
     */
    getSystemHealth() {
        const used = process.memoryUsage();
        return {
            memory: {
                heapUsed: Math.round(used.heapUsed / 1024 / 1024) + 'MB',
                heapTotal: Math.round(used.heapTotal / 1024 / 1024) + 'MB',
                external: Math.round(used.external / 1024 / 1024) + 'MB'
            },
            uptime: Math.round(process.uptime()) + 's',
            cpu: process.cpuUsage()
        };
    }
};

/**
 * Performance monitoring
 */
const performance = {
    /**
     * Measure async function execution time
     */
    async measure(name, fn) {
        const start = Date.now();
        try {
            const result = await fn();
            const duration = Date.now() - start;
            metrics.recordHistogram(`${name}_duration_ms`, duration);
            return result;
        } catch (error) {
            const duration = Date.now() - start;
            metrics.recordHistogram(`${name}_duration_ms`, duration, { error: 'true' });
            throw error;
        }
    },

    /**
     * Create a timer
     */
    timer(name) {
        const start = Date.now();
        return {
            end: (labels = {}) => {
                const duration = Date.now() - start;
                metrics.recordHistogram(`${name}_duration_ms`, duration, labels);
                return duration;
            }
        };
    }
};

module.exports = {
    metrics,
    metricsMiddleware,
    errorTracker,
    healthCheck,
    performance
};
