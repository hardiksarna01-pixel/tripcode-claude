/**
 * Advanced Security Middleware
 * Enterprise-grade protection against common attack vectors
 */

const crypto = require('crypto');

/**
 * XSS (Cross-Site Scripting) Protection
 */
const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /<link/gi,
    /expression\s*\(/gi,
    /url\s*\(/gi,
    /vbscript:/gi,
    /data:/gi,
    /<svg/gi,
    /<math/gi
];

const sqlInjectionPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE|EXEC|UNION|FETCH|DECLARE|CAST)\b)/gi,
    /(--)|(\/\*)/g,
    /(;|\|)/g,
    /(\bOR\b|\bAND\b)\s*(\d+\s*=\s*\d+|'[^']*'\s*=\s*'[^']*'|"[^"]*"\s*=\s*"[^"]*")/gi,
    /'\s*(OR|AND)\s*'?\d/gi,
    /WAITFOR\s+DELAY/gi,
    /BENCHMARK\s*\(/gi,
    /SLEEP\s*\(/gi
];

const noSqlInjectionPatterns = [
    /\$where/gi,
    /\$regex/gi,
    /\$ne/gi,
    /\$gt/gi,
    /\$lt/gi,
    /\$or/gi,
    /\$and/gi,
    /\$exists/gi,
    /\$type/gi,
    /\$expr/gi
];

const pathTraversalPatterns = [
    /\.\.\//g,
    /\.\.%2[fF]/g,
    /\.\.%5[cC]/g,
    /%2e%2e%2f/gi,
    /%252e%252e%252f/gi,
    /\.\./g
];

const commandInjectionPatterns = [
    /[;&|`$(){}[\]<>]/g,
    /\$\(/g,
    /`.*`/g,
    /\|\|/g,
    /&&/g
];

/**
 * Deep sanitize object values
 */
function deepSanitize(obj, path = '') {
    if (obj === null || obj === undefined) return obj;

    if (typeof obj === 'string') {
        return sanitizeString(obj, path);
    }

    if (Array.isArray(obj)) {
        return obj.map((item, index) => deepSanitize(item, `${path}[${index}]`));
    }

    if (typeof obj === 'object') {
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
            // Sanitize keys too (prevent prototype pollution)
            const sanitizedKey = sanitizeKey(key);
            if (sanitizedKey) {
                sanitized[sanitizedKey] = deepSanitize(value, `${path}.${key}`);
            }
        }
        return sanitized;
    }

    return obj;
}

/**
 * Sanitize object keys (prevent prototype pollution)
 */
function sanitizeKey(key) {
    const dangerousKeys = ['__proto__', 'constructor', 'prototype', '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__'];
    if (dangerousKeys.includes(key.toLowerCase())) {
        return null;
    }
    return key;
}

/**
 * Sanitize string values
 */
function sanitizeString(str, path = '') {
    if (typeof str !== 'string') return str;

    let sanitized = str;

    // HTML entity encoding for XSS prevention
    sanitized = sanitized
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');

    return sanitized;
}

/**
 * Detect malicious patterns
 */
function detectMaliciousPatterns(value, patterns) {
    if (typeof value !== 'string') return false;
    return patterns.some(pattern => pattern.test(value));
}

/**
 * Deep check for attacks
 */
function deepCheck(obj, patterns, attackType) {
    if (obj === null || obj === undefined) return { detected: false };

    if (typeof obj === 'string') {
        if (detectMaliciousPatterns(obj, patterns)) {
            return { detected: true, type: attackType, value: obj.substring(0, 100) };
        }
    }

    if (Array.isArray(obj)) {
        for (const item of obj) {
            const result = deepCheck(item, patterns, attackType);
            if (result.detected) return result;
        }
    }

    if (typeof obj === 'object') {
        for (const [key, value] of Object.entries(obj)) {
            // Check key
            if (detectMaliciousPatterns(key, patterns)) {
                return { detected: true, type: attackType, value: key };
            }
            // Check value
            const result = deepCheck(value, patterns, attackType);
            if (result.detected) return result;
        }
    }

    return { detected: false };
}

/**
 * Security Attack Logger
 */
class SecurityLogger {
    static attacks = new Map();
    static BLOCK_THRESHOLD = 5;
    static BLOCK_DURATION = 3600000; // 1 hour

    static log(ip, attackType, details) {
        const key = `${ip}:${attackType}`;
        const now = Date.now();

        if (!this.attacks.has(key)) {
            this.attacks.set(key, { count: 0, firstSeen: now, lastSeen: now });
        }

        const record = this.attacks.get(key);
        record.count++;
        record.lastSeen = now;
        record.details = details;

        console.error(`[SECURITY ALERT] ${attackType} attempt from ${ip}:`, {
            count: record.count,
            details: details.substring(0, 200)
        });

        return record.count >= this.BLOCK_THRESHOLD;
    }

    static isBlocked(ip) {
        const now = Date.now();
        for (const [key, record] of this.attacks.entries()) {
            if (key.startsWith(ip) && record.count >= this.BLOCK_THRESHOLD) {
                if (now - record.lastSeen < this.BLOCK_DURATION) {
                    return true;
                } else {
                    this.attacks.delete(key);
                }
            }
        }
        return false;
    }

    static cleanup() {
        const now = Date.now();
        for (const [key, record] of this.attacks.entries()) {
            if (now - record.lastSeen > this.BLOCK_DURATION) {
                this.attacks.delete(key);
            }
        }
    }
}

// Cleanup old records every 10 minutes
setInterval(() => SecurityLogger.cleanup(), 600000);

/**
 * XSS Protection Middleware
 */
const xssProtection = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;

    // Check if IP is blocked
    if (SecurityLogger.isBlocked(ip)) {
        return res.status(403).json({
            success: false,
            error: 'Access denied due to security policy violation'
        });
    }

    // Check body
    const bodyCheck = deepCheck(req.body, xssPatterns, 'XSS');
    if (bodyCheck.detected) {
        const shouldBlock = SecurityLogger.log(ip, 'XSS', bodyCheck.value);
        return res.status(400).json({
            success: false,
            error: 'Invalid input detected',
            code: 'XSS_DETECTED'
        });
    }

    // Check query params
    const queryCheck = deepCheck(req.query, xssPatterns, 'XSS');
    if (queryCheck.detected) {
        SecurityLogger.log(ip, 'XSS', queryCheck.value);
        return res.status(400).json({
            success: false,
            error: 'Invalid input detected',
            code: 'XSS_DETECTED'
        });
    }

    // Sanitize inputs
    req.body = deepSanitize(req.body);
    req.query = deepSanitize(req.query);

    next();
};

/**
 * SQL Injection Protection Middleware
 */
const sqlInjectionProtection = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;

    // Check body
    const bodyCheck = deepCheck(req.body, sqlInjectionPatterns, 'SQL_INJECTION');
    if (bodyCheck.detected) {
        SecurityLogger.log(ip, 'SQL_INJECTION', bodyCheck.value);
        return res.status(400).json({
            success: false,
            error: 'Invalid input detected',
            code: 'SQL_INJECTION_DETECTED'
        });
    }

    // Check query params
    const queryCheck = deepCheck(req.query, sqlInjectionPatterns, 'SQL_INJECTION');
    if (queryCheck.detected) {
        SecurityLogger.log(ip, 'SQL_INJECTION', queryCheck.value);
        return res.status(400).json({
            success: false,
            error: 'Invalid input detected',
            code: 'SQL_INJECTION_DETECTED'
        });
    }

    // Check URL params
    const paramsCheck = deepCheck(req.params, sqlInjectionPatterns, 'SQL_INJECTION');
    if (paramsCheck.detected) {
        SecurityLogger.log(ip, 'SQL_INJECTION', paramsCheck.value);
        return res.status(400).json({
            success: false,
            error: 'Invalid input detected',
            code: 'SQL_INJECTION_DETECTED'
        });
    }

    next();
};

/**
 * NoSQL Injection Protection Middleware
 */
const noSqlInjectionProtection = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;

    const bodyCheck = deepCheck(req.body, noSqlInjectionPatterns, 'NOSQL_INJECTION');
    if (bodyCheck.detected) {
        SecurityLogger.log(ip, 'NOSQL_INJECTION', bodyCheck.value);
        return res.status(400).json({
            success: false,
            error: 'Invalid input detected',
            code: 'NOSQL_INJECTION_DETECTED'
        });
    }

    next();
};

/**
 * Path Traversal Protection Middleware
 */
const pathTraversalProtection = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;

    // Check URL path
    if (detectMaliciousPatterns(req.path, pathTraversalPatterns)) {
        SecurityLogger.log(ip, 'PATH_TRAVERSAL', req.path);
        return res.status(400).json({
            success: false,
            error: 'Invalid path detected',
            code: 'PATH_TRAVERSAL_DETECTED'
        });
    }

    // Check params and query
    const paramsCheck = deepCheck({ ...req.params, ...req.query }, pathTraversalPatterns, 'PATH_TRAVERSAL');
    if (paramsCheck.detected) {
        SecurityLogger.log(ip, 'PATH_TRAVERSAL', paramsCheck.value);
        return res.status(400).json({
            success: false,
            error: 'Invalid path detected',
            code: 'PATH_TRAVERSAL_DETECTED'
        });
    }

    next();
};

/**
 * Command Injection Protection Middleware
 */
const commandInjectionProtection = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;

    // Only check specific fields that might be used in shell commands
    const dangerousFields = ['filename', 'file', 'path', 'cmd', 'command', 'exec', 'shell'];

    for (const field of dangerousFields) {
        if (req.body[field] && detectMaliciousPatterns(req.body[field], commandInjectionPatterns)) {
            SecurityLogger.log(ip, 'COMMAND_INJECTION', req.body[field]);
            return res.status(400).json({
                success: false,
                error: 'Invalid input detected',
                code: 'COMMAND_INJECTION_DETECTED'
            });
        }
    }

    next();
};

/**
 * Request Size Limiter (Prevent DoS via large payloads)
 */
const requestSizeLimiter = (maxSize = 1048576) => (req, res, next) => {
    const contentLength = parseInt(req.headers['content-length'] || 0);

    if (contentLength > maxSize) {
        return res.status(413).json({
            success: false,
            error: 'Request payload too large',
            code: 'PAYLOAD_TOO_LARGE',
            maxSize: `${maxSize / 1024}KB`
        });
    }

    next();
};

/**
 * Prototype Pollution Protection
 */
const prototypePollutionProtection = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;

    const checkPrototypePollution = (obj, path = '') => {
        if (obj === null || typeof obj !== 'object') return false;

        const dangerousKeys = ['__proto__', 'constructor', 'prototype'];

        for (const key of Object.keys(obj)) {
            if (dangerousKeys.includes(key)) {
                return { detected: true, key, path: `${path}.${key}` };
            }
            if (typeof obj[key] === 'object') {
                const result = checkPrototypePollution(obj[key], `${path}.${key}`);
                if (result.detected) return result;
            }
        }
        return { detected: false };
    };

    const result = checkPrototypePollution(req.body);
    if (result.detected) {
        SecurityLogger.log(ip, 'PROTOTYPE_POLLUTION', result.path);
        return res.status(400).json({
            success: false,
            error: 'Invalid input detected',
            code: 'PROTOTYPE_POLLUTION_DETECTED'
        });
    }

    next();
};

/**
 * CSRF Token Validation Middleware
 */
const csrfTokens = new Map();

const generateCSRFToken = (sessionId) => {
    const token = crypto.randomBytes(32).toString('hex');
    csrfTokens.set(sessionId, {
        token,
        createdAt: Date.now(),
        used: false
    });

    // Cleanup old tokens
    setTimeout(() => csrfTokens.delete(sessionId), 3600000); // 1 hour

    return token;
};

const validateCSRFToken = (req, res, next) => {
    // Skip for GET, HEAD, OPTIONS
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }

    const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    const csrfToken = req.headers['x-csrf-token'] || req.body?._csrf;

    if (!sessionId || !csrfToken) {
        return res.status(403).json({
            success: false,
            error: 'CSRF validation failed',
            code: 'CSRF_TOKEN_MISSING'
        });
    }

    const storedData = csrfTokens.get(sessionId);
    if (!storedData || storedData.token !== csrfToken) {
        return res.status(403).json({
            success: false,
            error: 'CSRF validation failed',
            code: 'CSRF_TOKEN_INVALID'
        });
    }

    // Mark token as used for single-use tokens
    storedData.used = true;

    next();
};

/**
 * Request Fingerprinting (for anomaly detection)
 */
const requestFingerprints = new Map();

const requestFingerprinting = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';
    const acceptLanguage = req.headers['accept-language'] || '';

    const fingerprint = crypto
        .createHash('sha256')
        .update(`${ip}:${userAgent}:${acceptLanguage}`)
        .digest('hex')
        .substring(0, 16);

    req.fingerprint = fingerprint;

    // Track fingerprints for anomaly detection
    if (!requestFingerprints.has(ip)) {
        requestFingerprints.set(ip, new Set());
    }

    const fingerprints = requestFingerprints.get(ip);
    fingerprints.add(fingerprint);

    // Anomaly: Too many different fingerprints from same IP (possible spoofing)
    if (fingerprints.size > 10) {
        console.warn(`[SECURITY] Anomaly detected: Multiple fingerprints from ${ip}`);
    }

    next();
};

/**
 * Combined Advanced Security Middleware
 */
const advancedSecurityMiddleware = [
    requestSizeLimiter(10485760), // 10MB max
    prototypePollutionProtection,
    xssProtection,
    sqlInjectionProtection,
    noSqlInjectionProtection,
    pathTraversalProtection,
    commandInjectionProtection,
    requestFingerprinting
];

module.exports = {
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
};
