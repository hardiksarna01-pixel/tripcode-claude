/**
 * Security Module - Main Entry Point
 * Enterprise-grade security for B2B Travel Portal
 */

// Advanced Security Middleware
const {
    xssProtection,
    sqlInjectionProtection,
    noSqlInjectionProtection,
    pathTraversalProtection,
    commandInjectionProtection,
    requestSizeLimiter,
    prototypePollutionProtection,
    generateCSRFToken,
    validateCSRFToken,
    requestFingerprinting,
    advancedSecurityMiddleware,
    SecurityLogger,
    deepSanitize
} = require('./advancedSecurity.middleware');

// Input Validation
const {
    ValidationError,
    SchemaValidator,
    validators,
    schemas,
    validate,
    validateSchema
} = require('./inputValidator');

// DDoS Protection
const {
    TokenBucket,
    SlidingWindowRateLimiter,
    RequestPatternAnalyzer,
    AdaptiveRateLimiter,
    ConnectionTracker,
    DDoSProtectionManager,
    ddosProtection,
    ddosProtectionMiddleware
} = require('./ddosProtection');

// Fault Tolerance
const {
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
} = require('./faultTolerance');

// Health Monitoring
const {
    HealthStatus,
    SystemResourceMonitor,
    DependencyHealthChecker,
    AutoRecoveryManager,
    HealthMonitor,
    healthCheckMiddleware,
    livenessMiddleware,
    readinessMiddleware,
    healthMonitor
} = require('./healthMonitor');

// Audit Logging
const {
    LogLevel,
    LogLevelNames,
    AuditEventType,
    SensitiveDataMasker,
    AuditLogEntry,
    InMemoryLogStorage,
    FileLogStorage,
    AuditLogger,
    auditMiddleware,
    auditLogger
} = require('./auditLogger');

// Encryption
const {
    KeyDerivation,
    SymmetricEncryption,
    Hashing,
    TokenGenerator,
    DataMasking,
    SecureDataStore,
    SignatureVerification,
    EncryptionKeyManager,
    EnvelopeEncryption,
    defaultEncryption,
    defaultSecureStore
} = require('./encryption');

// Security Headers
const {
    defaultSecurityHeaders,
    generateCSP,
    generatePermissionsPolicy,
    CORSConfig,
    securityHeadersMiddleware,
    corsMiddleware,
    apiVersionMiddleware,
    requestTimeoutMiddleware,
    secureCookieSettings,
    secureCookieMiddleware,
    ipValidationMiddleware,
    httpsEnforcementMiddleware,
    combinedSecurityMiddleware
} = require('./securityHeaders');

/**
 * Initialize Security Module
 * Sets up all security components with default configuration
 */
function initializeSecurity(options = {}) {
    console.log('[Security] Initializing security module...');

    // Start health monitoring
    if (options.healthMonitoring !== false) {
        healthMonitor.start();
        console.log('[Security] Health monitoring started');
    }

    // Register common dependencies for health checks
    if (options.dependencies) {
        for (const [name, config] of Object.entries(options.dependencies)) {
            healthMonitor.registerDependency(name, config);
        }
    }

    // Setup audit logging
    if (options.auditLogging !== false) {
        // Setup security event listeners
        auditLogger.on(AuditEventType.SEC_ATTACK_DETECTED, (entry) => {
            console.error('[SECURITY ALERT]', entry.message, entry.context);
        });

        auditLogger.on(AuditEventType.AUTH_LOGIN_FAILURE, (entry) => {
            if (entry.context?.consecutiveFailures > 5) {
                console.warn('[SECURITY] Multiple login failures detected', entry.actor);
            }
        });
    }

    console.log('[Security] Security module initialized');

    return {
        healthMonitor,
        auditLogger,
        ddosProtection,
        circuitBreakerRegistry
    };
}

/**
 * Create comprehensive security middleware stack
 */
function createSecurityMiddlewareStack(options = {}) {
    const middlewares = [];

    // 1. HTTPS Enforcement (production only)
    if (options.enforceHttps !== false && process.env.NODE_ENV === 'production') {
        middlewares.push(httpsEnforcementMiddleware());
    }

    // 2. Security Headers
    middlewares.push(securityHeadersMiddleware(options.headers || {}));

    // 3. CORS
    middlewares.push(corsMiddleware(options.cors || {
        origins: process.env.CORS_ORIGINS?.split(',') || ['*'],
        credentials: true
    }));

    // 4. DDoS Protection
    middlewares.push(ddosProtectionMiddleware(options.ddos || {}));

    // 5. Request Size Limiter
    middlewares.push(requestSizeLimiter(options.maxRequestSize || 10485760)); // 10MB

    // 6. Advanced Security (XSS, SQL Injection, etc.)
    middlewares.push(...advancedSecurityMiddleware);

    // 7. Secure Cookies
    middlewares.push(secureCookieMiddleware);

    // 8. Request Timeout
    middlewares.push(requestTimeoutMiddleware(options.timeout || 30000));

    // 9. Audit Logging
    if (options.audit !== false) {
        middlewares.push(auditMiddleware(auditLogger, options.auditOptions || {}));
    }

    return middlewares;
}

/**
 * Express error handler for security errors
 */
function securityErrorHandler(err, req, res, next) {
    // Log security-related errors
    if (err.status === 403 || err.status === 401 || err.code?.startsWith('SEC_')) {
        auditLogger.security(
            AuditEventType.SEC_SUSPICIOUS_ACTIVITY,
            err.message,
            {
                ipAddress: req.ip,
                path: req.path,
                method: req.method,
                error: err.code || err.name,
                userId: req.user?.id
            }
        );
    }

    // Handle specific error types
    if (err instanceof CircuitBreakerError) {
        return res.status(503).json({
            success: false,
            error: 'Service temporarily unavailable',
            code: 'SERVICE_UNAVAILABLE',
            retryAfter: 60
        });
    }

    if (err instanceof ValidationError) {
        return res.status(400).json({
            success: false,
            error: err.message,
            code: err.code,
            field: err.field
        });
    }

    if (err instanceof BulkheadError) {
        return res.status(503).json({
            success: false,
            error: 'Service overloaded',
            code: 'SERVICE_OVERLOADED',
            retryAfter: 30
        });
    }

    // Pass to next error handler
    next(err);
}

/**
 * Secure API wrapper
 * Wraps API handlers with circuit breaker and retry logic
 */
function secureApiWrapper(name, handler, options = {}) {
    const circuitBreaker = circuitBreakerRegistry.getOrCreate(name, {
        failureThreshold: options.failureThreshold || 5,
        resetTimeout: options.resetTimeout || 60000,
        timeout: options.timeout || 30000
    });

    const retryPolicy = options.retry !== false
        ? new RetryPolicy(options.retryOptions || {})
        : null;

    return async (req, res, next) => {
        try {
            const execute = async () => {
                if (retryPolicy) {
                    return await retryPolicy.execute(() => handler(req, res, next));
                }
                return await handler(req, res, next);
            };

            await circuitBreaker.execute(execute, options.fallback);

        } catch (error) {
            next(error);
        }
    };
}

module.exports = {
    // Initialization
    initializeSecurity,
    createSecurityMiddlewareStack,
    securityErrorHandler,
    secureApiWrapper,

    // Advanced Security
    xssProtection,
    sqlInjectionProtection,
    noSqlInjectionProtection,
    pathTraversalProtection,
    commandInjectionProtection,
    requestSizeLimiter,
    prototypePollutionProtection,
    generateCSRFToken,
    validateCSRFToken,
    requestFingerprinting,
    advancedSecurityMiddleware,
    SecurityLogger,
    deepSanitize,

    // Input Validation
    ValidationError,
    SchemaValidator,
    validators,
    schemas,
    validate,
    validateSchema,

    // DDoS Protection
    TokenBucket,
    SlidingWindowRateLimiter,
    RequestPatternAnalyzer,
    AdaptiveRateLimiter,
    ConnectionTracker,
    DDoSProtectionManager,
    ddosProtection,
    ddosProtectionMiddleware,

    // Fault Tolerance
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
    healthAggregator,

    // Health Monitoring
    HealthStatus,
    SystemResourceMonitor,
    DependencyHealthChecker,
    AutoRecoveryManager,
    HealthMonitor,
    healthCheckMiddleware,
    livenessMiddleware,
    readinessMiddleware,
    healthMonitor,

    // Audit Logging
    LogLevel,
    LogLevelNames,
    AuditEventType,
    SensitiveDataMasker,
    AuditLogEntry,
    InMemoryLogStorage,
    FileLogStorage,
    AuditLogger,
    auditMiddleware,
    auditLogger,

    // Encryption
    KeyDerivation,
    SymmetricEncryption,
    Hashing,
    TokenGenerator,
    DataMasking,
    SecureDataStore,
    SignatureVerification,
    EncryptionKeyManager,
    EnvelopeEncryption,
    defaultEncryption,
    defaultSecureStore,

    // Security Headers
    defaultSecurityHeaders,
    generateCSP,
    generatePermissionsPolicy,
    CORSConfig,
    securityHeadersMiddleware,
    corsMiddleware,
    apiVersionMiddleware,
    requestTimeoutMiddleware,
    secureCookieSettings,
    secureCookieMiddleware,
    ipValidationMiddleware,
    httpsEnforcementMiddleware,
    combinedSecurityMiddleware
};
