/**
 * Health Monitoring & Auto-Recovery System
 * Comprehensive system health monitoring with automatic recovery
 */

const EventEmitter = require('events');
const os = require('os');

/**
 * Health Check Status
 */
const HealthStatus = {
    HEALTHY: 'healthy',
    DEGRADED: 'degraded',
    UNHEALTHY: 'unhealthy',
    UNKNOWN: 'unknown'
};

/**
 * System Resource Monitor
 */
class SystemResourceMonitor {
    constructor() {
        this.metrics = {
            cpu: [],
            memory: [],
            eventLoop: []
        };
        this.maxSamples = 60; // Keep last 60 samples
    }

    getCPUUsage() {
        const cpus = os.cpus();
        let totalIdle = 0;
        let totalTick = 0;

        for (const cpu of cpus) {
            for (const type in cpu.times) {
                totalTick += cpu.times[type];
            }
            totalIdle += cpu.times.idle;
        }

        return {
            usage: Math.round((1 - totalIdle / totalTick) * 100),
            cores: cpus.length
        };
    }

    getMemoryUsage() {
        const total = os.totalmem();
        const free = os.freemem();
        const used = total - free;

        return {
            total: total,
            used: used,
            free: free,
            usagePercent: Math.round((used / total) * 100),
            heapUsed: process.memoryUsage().heapUsed,
            heapTotal: process.memoryUsage().heapTotal,
            external: process.memoryUsage().external,
            rss: process.memoryUsage().rss
        };
    }

    async getEventLoopLag() {
        return new Promise((resolve) => {
            const start = process.hrtime();
            setImmediate(() => {
                const diff = process.hrtime(start);
                const lagMs = (diff[0] * 1e9 + diff[1]) / 1e6;
                resolve(lagMs);
            });
        });
    }

    async collect() {
        const cpu = this.getCPUUsage();
        const memory = this.getMemoryUsage();
        const eventLoopLag = await this.getEventLoopLag();

        // Store samples
        this.metrics.cpu.push({ timestamp: Date.now(), ...cpu });
        this.metrics.memory.push({ timestamp: Date.now(), ...memory });
        this.metrics.eventLoop.push({ timestamp: Date.now(), lag: eventLoopLag });

        // Trim old samples
        if (this.metrics.cpu.length > this.maxSamples) {
            this.metrics.cpu.shift();
            this.metrics.memory.shift();
            this.metrics.eventLoop.shift();
        }

        return {
            cpu,
            memory,
            eventLoopLag,
            uptime: process.uptime(),
            loadAverage: os.loadavg()
        };
    }

    getAverages(minutes = 5) {
        const cutoff = Date.now() - (minutes * 60 * 1000);

        const recentCPU = this.metrics.cpu.filter(m => m.timestamp > cutoff);
        const recentMemory = this.metrics.memory.filter(m => m.timestamp > cutoff);
        const recentEventLoop = this.metrics.eventLoop.filter(m => m.timestamp > cutoff);

        return {
            avgCPU: recentCPU.length > 0
                ? Math.round(recentCPU.reduce((sum, m) => sum + m.usage, 0) / recentCPU.length)
                : 0,
            avgMemory: recentMemory.length > 0
                ? Math.round(recentMemory.reduce((sum, m) => sum + m.usagePercent, 0) / recentMemory.length)
                : 0,
            avgEventLoopLag: recentEventLoop.length > 0
                ? recentEventLoop.reduce((sum, m) => sum + m.lag, 0) / recentEventLoop.length
                : 0
        };
    }
}

/**
 * Dependency Health Checker
 */
class DependencyHealthChecker {
    constructor() {
        this.dependencies = new Map();
        this.lastCheck = new Map();
    }

    register(name, options) {
        this.dependencies.set(name, {
            name,
            checkFn: options.checkFn,
            critical: options.critical !== false,
            timeout: options.timeout || 5000,
            retries: options.retries || 1,
            lastStatus: HealthStatus.UNKNOWN,
            consecutiveFailures: 0
        });
    }

    async check(name) {
        const dep = this.dependencies.get(name);
        if (!dep) return null;

        const startTime = Date.now();

        for (let attempt = 0; attempt <= dep.retries; attempt++) {
            try {
                await Promise.race([
                    dep.checkFn(),
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('Health check timeout')), dep.timeout)
                    )
                ]);

                dep.lastStatus = HealthStatus.HEALTHY;
                dep.consecutiveFailures = 0;
                this.lastCheck.set(name, {
                    status: HealthStatus.HEALTHY,
                    latency: Date.now() - startTime,
                    timestamp: Date.now()
                });

                return { healthy: true, latency: Date.now() - startTime };

            } catch (error) {
                if (attempt === dep.retries) {
                    dep.consecutiveFailures++;
                    dep.lastStatus = HealthStatus.UNHEALTHY;
                    this.lastCheck.set(name, {
                        status: HealthStatus.UNHEALTHY,
                        error: error.message,
                        timestamp: Date.now()
                    });

                    return { healthy: false, error: error.message };
                }
                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    async checkAll() {
        const results = {};
        const promises = [];

        for (const [name] of this.dependencies) {
            promises.push(
                this.check(name).then(result => {
                    results[name] = result;
                })
            );
        }

        await Promise.all(promises);
        return results;
    }

    getCriticalStatus() {
        for (const [name, dep] of this.dependencies) {
            if (dep.critical && dep.lastStatus === HealthStatus.UNHEALTHY) {
                return { healthy: false, failedDependency: name };
            }
        }
        return { healthy: true };
    }

    getStatus() {
        const status = {};
        for (const [name, dep] of this.dependencies) {
            status[name] = {
                status: dep.lastStatus,
                critical: dep.critical,
                consecutiveFailures: dep.consecutiveFailures,
                lastCheck: this.lastCheck.get(name)
            };
        }
        return status;
    }
}

/**
 * Auto Recovery Manager
 */
class AutoRecoveryManager extends EventEmitter {
    constructor() {
        super();
        this.recoveryActions = new Map();
        this.recoveryHistory = [];
        this.maxHistorySize = 100;
    }

    registerRecoveryAction(name, options) {
        this.recoveryActions.set(name, {
            name,
            action: options.action,
            condition: options.condition,
            cooldown: options.cooldown || 60000, // 1 minute default
            maxAttempts: options.maxAttempts || 3,
            attempts: 0,
            lastAttempt: 0
        });
    }

    async attemptRecovery(name, context = {}) {
        const recovery = this.recoveryActions.get(name);
        if (!recovery) return { success: false, error: 'Unknown recovery action' };

        const now = Date.now();

        // Check cooldown
        if (now - recovery.lastAttempt < recovery.cooldown) {
            return {
                success: false,
                error: 'Recovery on cooldown',
                remainingCooldown: recovery.cooldown - (now - recovery.lastAttempt)
            };
        }

        // Check max attempts
        if (recovery.attempts >= recovery.maxAttempts) {
            return {
                success: false,
                error: 'Max recovery attempts exceeded',
                attempts: recovery.attempts
            };
        }

        // Check condition if provided
        if (recovery.condition && !await recovery.condition(context)) {
            return { success: false, error: 'Recovery condition not met' };
        }

        recovery.attempts++;
        recovery.lastAttempt = now;

        try {
            console.log(`[Recovery] Attempting recovery action: ${name}`);
            await recovery.action(context);

            this.recordHistory(name, true);
            this.emit('recoverySuccess', { name, context });

            // Reset attempts on success
            recovery.attempts = 0;

            return { success: true };

        } catch (error) {
            this.recordHistory(name, false, error.message);
            this.emit('recoveryFailure', { name, error: error.message, context });

            return { success: false, error: error.message };
        }
    }

    recordHistory(name, success, error = null) {
        this.recoveryHistory.push({
            name,
            success,
            error,
            timestamp: Date.now()
        });

        if (this.recoveryHistory.length > this.maxHistorySize) {
            this.recoveryHistory.shift();
        }
    }

    resetAttempts(name) {
        const recovery = this.recoveryActions.get(name);
        if (recovery) {
            recovery.attempts = 0;
        }
    }

    getHistory(limit = 20) {
        return this.recoveryHistory.slice(-limit);
    }

    getStatus() {
        const status = {};
        for (const [name, recovery] of this.recoveryActions) {
            status[name] = {
                attempts: recovery.attempts,
                maxAttempts: recovery.maxAttempts,
                lastAttempt: recovery.lastAttempt,
                onCooldown: Date.now() - recovery.lastAttempt < recovery.cooldown
            };
        }
        return status;
    }
}

/**
 * Main Health Monitor
 */
class HealthMonitor extends EventEmitter {
    constructor(options = {}) {
        super();

        this.resourceMonitor = new SystemResourceMonitor();
        this.dependencyChecker = new DependencyHealthChecker();
        this.recoveryManager = new AutoRecoveryManager();

        this.checkInterval = options.checkInterval || 30000; // 30 seconds
        this.thresholds = {
            cpu: options.cpuThreshold || 80,
            memory: options.memoryThreshold || 85,
            eventLoopLag: options.eventLoopLagThreshold || 100 // ms
        };

        this.intervalId = null;
        this.lastHealthStatus = HealthStatus.UNKNOWN;
        this.statusHistory = [];
        this.maxHistorySize = 100;

        // Setup recovery manager event handlers
        this.recoveryManager.on('recoverySuccess', (data) => {
            this.emit('recovery', data);
        });

        this.recoveryManager.on('recoveryFailure', (data) => {
            this.emit('recoveryFailed', data);
        });
    }

    start() {
        if (this.intervalId) return;

        console.log('[HealthMonitor] Starting health monitoring...');

        // Initial check
        this.performCheck();

        // Schedule periodic checks
        this.intervalId = setInterval(() => {
            this.performCheck();
        }, this.checkInterval);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            console.log('[HealthMonitor] Health monitoring stopped');
        }
    }

    async performCheck() {
        try {
            const health = await this.getHealth();

            // Record status
            this.statusHistory.push({
                status: health.status,
                timestamp: Date.now(),
                summary: health.summary
            });

            if (this.statusHistory.length > this.maxHistorySize) {
                this.statusHistory.shift();
            }

            // Check for status change
            if (health.status !== this.lastHealthStatus) {
                this.emit('statusChange', {
                    from: this.lastHealthStatus,
                    to: health.status,
                    health
                });

                // Trigger recovery if unhealthy
                if (health.status === HealthStatus.UNHEALTHY) {
                    await this.triggerRecovery(health);
                }

                this.lastHealthStatus = health.status;
            }

            // Emit current health
            this.emit('health', health);

            return health;

        } catch (error) {
            console.error('[HealthMonitor] Error performing health check:', error);
            this.emit('error', error);
            return { status: HealthStatus.UNKNOWN, error: error.message };
        }
    }

    async getHealth() {
        const startTime = Date.now();

        // Collect all health data in parallel
        const [resources, dependencies] = await Promise.all([
            this.resourceMonitor.collect(),
            this.dependencyChecker.checkAll()
        ]);

        // Determine overall status
        const status = this.determineStatus(resources, dependencies);

        // Get averages
        const averages = this.resourceMonitor.getAverages(5);

        return {
            status,
            timestamp: Date.now(),
            checkDuration: Date.now() - startTime,
            summary: this.generateSummary(status, resources, dependencies),
            resources: {
                current: resources,
                averages
            },
            dependencies,
            thresholds: this.thresholds
        };
    }

    determineStatus(resources, dependencies) {
        // Check critical dependencies
        const criticalStatus = this.dependencyChecker.getCriticalStatus();
        if (!criticalStatus.healthy) {
            return HealthStatus.UNHEALTHY;
        }

        // Check resource thresholds
        if (resources.cpu.usage > this.thresholds.cpu ||
            resources.memory.usagePercent > this.thresholds.memory ||
            resources.eventLoopLag > this.thresholds.eventLoopLag) {
            return HealthStatus.DEGRADED;
        }

        // Check for any unhealthy non-critical dependencies
        const unhealthyDeps = Object.entries(dependencies)
            .filter(([_, result]) => !result.healthy);
        if (unhealthyDeps.length > 0) {
            return HealthStatus.DEGRADED;
        }

        return HealthStatus.HEALTHY;
    }

    generateSummary(status, resources, dependencies) {
        const issues = [];

        if (resources.cpu.usage > this.thresholds.cpu) {
            issues.push(`High CPU usage: ${resources.cpu.usage}%`);
        }
        if (resources.memory.usagePercent > this.thresholds.memory) {
            issues.push(`High memory usage: ${resources.memory.usagePercent}%`);
        }
        if (resources.eventLoopLag > this.thresholds.eventLoopLag) {
            issues.push(`High event loop lag: ${resources.eventLoopLag.toFixed(2)}ms`);
        }

        for (const [name, result] of Object.entries(dependencies)) {
            if (!result.healthy) {
                issues.push(`Dependency '${name}' unhealthy: ${result.error}`);
            }
        }

        return {
            status,
            issues,
            healthy: status === HealthStatus.HEALTHY
        };
    }

    async triggerRecovery(health) {
        // Identify what needs recovery
        for (const [name, result] of Object.entries(health.dependencies)) {
            if (!result.healthy) {
                await this.recoveryManager.attemptRecovery(`dependency_${name}`, { dependency: name });
            }
        }

        // Resource-based recovery
        if (health.resources.current.memory.usagePercent > 90) {
            await this.recoveryManager.attemptRecovery('memory_pressure', health.resources);
        }
    }

    // Convenience methods for registering dependencies
    registerDependency(name, options) {
        this.dependencyChecker.register(name, options);
    }

    registerRecoveryAction(name, options) {
        this.recoveryManager.registerRecoveryAction(name, options);
    }

    // Get comprehensive status
    getStatus() {
        return {
            currentStatus: this.lastHealthStatus,
            dependencies: this.dependencyChecker.getStatus(),
            recovery: this.recoveryManager.getStatus(),
            recentHistory: this.statusHistory.slice(-10)
        };
    }

    // Liveness probe (is the service running?)
    async livenessProbe() {
        return {
            alive: true,
            uptime: process.uptime(),
            timestamp: Date.now()
        };
    }

    // Readiness probe (is the service ready to accept traffic?)
    async readinessProbe() {
        const criticalStatus = this.dependencyChecker.getCriticalStatus();
        return {
            ready: criticalStatus.healthy,
            ...criticalStatus,
            timestamp: Date.now()
        };
    }
}

/**
 * Health Check Middleware
 */
const healthCheckMiddleware = (healthMonitor) => {
    return async (req, res) => {
        const health = await healthMonitor.getHealth();

        const statusCode = health.status === HealthStatus.HEALTHY ? 200 :
            health.status === HealthStatus.DEGRADED ? 200 : 503;

        res.status(statusCode).json(health);
    };
};

const livenessMiddleware = (healthMonitor) => {
    return async (req, res) => {
        const result = await healthMonitor.livenessProbe();
        res.status(result.alive ? 200 : 503).json(result);
    };
};

const readinessMiddleware = (healthMonitor) => {
    return async (req, res) => {
        const result = await healthMonitor.readinessProbe();
        res.status(result.ready ? 200 : 503).json(result);
    };
};

// Create singleton instance
const healthMonitor = new HealthMonitor();

// Register common recovery actions
healthMonitor.registerRecoveryAction('memory_pressure', {
    action: async () => {
        // Force garbage collection if available
        if (global.gc) {
            global.gc();
            console.log('[Recovery] Forced garbage collection');
        }
    },
    cooldown: 300000 // 5 minutes
});

module.exports = {
    HealthStatus,
    SystemResourceMonitor,
    DependencyHealthChecker,
    AutoRecoveryManager,
    HealthMonitor,
    healthCheckMiddleware,
    livenessMiddleware,
    readinessMiddleware,
    healthMonitor
};
