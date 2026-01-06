/**
 * Security Module - COMPLETE
 * DDoS Protection, Rate Limiting, Input Validation, Encryption, etc.
 */

const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// ============================================
// ENCRYPTION SERVICE
// ============================================
class EncryptionService {
    constructor(secretKey) {
        this.algorithm = 'aes-256-gcm';
        this.secretKey = crypto.scryptSync(secretKey, 'salt', 32);
    }

    encrypt(text) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag();
        return {
            iv: iv.toString('hex'),
            encryptedData: encrypted,
            authTag: authTag.toString('hex')
        };
    }

    decrypt(encryptedObj) {
        const decipher = crypto.createDecipheriv(
            this.algorithm,
            this.secretKey,
            Buffer.from(encryptedObj.iv, 'hex')
        );
        decipher.setAuthTag(Buffer.from(encryptedObj.authTag, 'hex'));
        let decrypted = decipher.update(encryptedObj.encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    hashPassword(password) {
        return crypto.pbkdf2Sync(password, 'salt', 100000, 64, 'sha512').toString('hex');
    }

    generateToken(length = 32) {
        return crypto.randomBytes(length).toString('hex');
    }

    generateOTP(length = 6) {
        const digits = '0123456789';
        let otp = '';
        for (let i = 0; i < length; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
        }
        return otp;
    }

    maskPAN(pan) {
        if (!pan || pan.length < 10) return pan;
        return pan.substring(0, 4) + 'XXXX' + pan.substring(8);
    }

    maskCard(cardNumber) {
        if (!cardNumber || cardNumber.length < 16) return cardNumber;
        return 'XXXX-XXXX-XXXX-' + cardNumber.slice(-4);
    }

    maskEmail(email) {
        const [name, domain] = email.split('@');
        return name[0] + '***' + name.slice(-1) + '@' + domain;
    }

    maskPhone(phone) {
        if (!phone || phone.length < 10) return phone;
        return phone.substring(0, 2) + '******' + phone.slice(-2);
    }
}

// ============================================
// RATE LIMITER CONFIGURATIONS
// ============================================
const rateLimiters = {
    // General API rate limit
    general: rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 1000, // 1000 requests per 15 minutes
        message: {
            success: false,
            error: { code: 'RATE_LIMITED', message: 'Too many requests, please try again later' }
        },
        standardHeaders: true,
        legacyHeaders: false
    }),

    // Auth endpoints (stricter)
    auth: rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 20, // 20 login attempts per 15 minutes
        message: {
            success: false,
            error: { code: 'AUTH_RATE_LIMITED', message: 'Too many login attempts, please try again later' }
        }
    }),

    // Search endpoints
    search: rateLimit({
        windowMs: 60 * 1000, // 1 minute
        max: 30, // 30 searches per minute
        message: {
            success: false,
            error: { code: 'SEARCH_RATE_LIMITED', message: 'Too many search requests' }
        }
    }),

    // Booking endpoints
    booking: rateLimit({
        windowMs: 60 * 1000,
        max: 10, // 10 booking attempts per minute
        message: {
            success: false,
            error: { code: 'BOOKING_RATE_LIMITED', message: 'Too many booking attempts' }
        }
    }),

    // OTP endpoints
    otp: rateLimit({
        windowMs: 60 * 1000,
        max: 3, // 3 OTP requests per minute
        message: {
            success: false,
            error: { code: 'OTP_RATE_LIMITED', message: 'Too many OTP requests' }
        }
    }),

    // AI endpoints
    ai: rateLimit({
        windowMs: 60 * 1000,
        max: 10, // 10 AI requests per minute
        message: {
            success: false,
            error: { code: 'AI_RATE_LIMITED', message: 'AI request limit exceeded' }
        }
    }),

    // API key based (external integrations)
    apiKey: rateLimit({
        windowMs: 60 * 1000,
        max: 100, // 100 requests per minute for API keys
        keyGenerator: (req) => req.headers['x-api-key'] || req.ip,
        message: {
            success: false,
            error: { code: 'API_RATE_LIMITED', message: 'API rate limit exceeded' }
        }
    })
};

// ============================================
// SECURITY HEADERS (Helmet)
// ============================================
const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://checkout.razorpay.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            frameSrc: ["'self'", "https://api.razorpay.com"],
            connectSrc: ["'self'", "https://api.razorpay.com", "wss:"]
        }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
});

// ============================================
// INPUT SANITIZATION
// ============================================
const sanitizeInput = (req, res, next) => {
    const sanitize = (obj) => {
        if (typeof obj === 'string') {
            // Remove potential XSS
            return obj
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+\s*=/gi, '')
                .trim();
        }
        if (Array.isArray(obj)) {
            return obj.map(sanitize);
        }
        if (obj && typeof obj === 'object') {
            const sanitized = {};
            for (const [key, value] of Object.entries(obj)) {
                sanitized[key] = sanitize(value);
            }
            return sanitized;
        }
        return obj;
    };

    if (req.body) req.body = sanitize(req.body);
    if (req.query) req.query = sanitize(req.query);
    if (req.params) req.params = sanitize(req.params);

    next();
};

// ============================================
// SQL INJECTION PREVENTION
// ============================================
const preventSQLInjection = (req, res, next) => {
    const sqlPatterns = [
        /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
        /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
        /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
        /((\%27)|(\'))union/i,
        /exec(\s|\+)+(s|x)p\w+/i,
        /UNION(\s+)SELECT/i,
        /INSERT(\s+)INTO/i,
        /DELETE(\s+)FROM/i,
        /DROP(\s+)TABLE/i
    ];

    const checkValue = (value) => {
        if (typeof value === 'string') {
            return sqlPatterns.some(pattern => pattern.test(value));
        }
        return false;
    };

    const checkObject = (obj) => {
        if (!obj) return false;
        return Object.values(obj).some(value => {
            if (typeof value === 'object') return checkObject(value);
            return checkValue(value);
        });
    };

    if (checkObject(req.body) || checkObject(req.query) || checkObject(req.params)) {
        return res.status(400).json({
            success: false,
            error: { code: 'INVALID_INPUT', message: 'Invalid characters detected' }
        });
    }

    next();
};

// ============================================
// DDoS PROTECTION
// ============================================
class DDoSProtection {
    constructor() {
        this.requests = new Map();
        this.blacklist = new Set();
        this.threshold = 100; // requests per second
        this.banDuration = 3600000; // 1 hour
    }

    middleware() {
        return (req, res, next) => {
            const ip = req.ip || req.connection.remoteAddress;

            // Check if IP is blacklisted
            if (this.blacklist.has(ip)) {
                return res.status(429).json({
                    success: false,
                    error: { code: 'IP_BLOCKED', message: 'Your IP has been temporarily blocked' }
                });
            }

            const now = Date.now();
            const windowStart = now - 1000; // 1 second window

            // Get or create request log for this IP
            if (!this.requests.has(ip)) {
                this.requests.set(ip, []);
            }

            const requestLog = this.requests.get(ip);
            const recentRequests = requestLog.filter(time => time > windowStart);
            recentRequests.push(now);
            this.requests.set(ip, recentRequests);

            // Check if threshold exceeded
            if (recentRequests.length > this.threshold) {
                this.blacklist.add(ip);
                setTimeout(() => this.blacklist.delete(ip), this.banDuration);

                return res.status(429).json({
                    success: false,
                    error: { code: 'DDOS_DETECTED', message: 'Suspicious activity detected' }
                });
            }

            next();
        };
    }

    cleanup() {
        // Clean up old request logs every minute
        setInterval(() => {
            const now = Date.now();
            for (const [ip, requests] of this.requests.entries()) {
                const recent = requests.filter(time => time > now - 60000);
                if (recent.length === 0) {
                    this.requests.delete(ip);
                } else {
                    this.requests.set(ip, recent);
                }
            }
        }, 60000);
    }
}

// ============================================
// AUDIT LOGGING
// ============================================
class AuditLogger {
    constructor() {
        this.logs = [];
    }

    log(action, userId, userType, details, ip, userAgent) {
        const logEntry = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            action,
            userId,
            userType,
            details,
            ip,
            userAgent,
            status: 'success'
        };

        this.logs.push(logEntry);
        // In production, save to database
        console.log('[AUDIT]', JSON.stringify(logEntry));

        return logEntry;
    }

    logFailure(action, userId, userType, error, ip, userAgent) {
        const logEntry = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            action,
            userId,
            userType,
            error: error.message,
            ip,
            userAgent,
            status: 'failure'
        };

        this.logs.push(logEntry);
        console.error('[AUDIT-FAILURE]', JSON.stringify(logEntry));

        return logEntry;
    }

    getAuditMiddleware() {
        return (req, res, next) => {
            const startTime = Date.now();

            res.on('finish', () => {
                const duration = Date.now() - startTime;
                const action = `${req.method} ${req.originalUrl}`;
                const userId = req.userId || req.adminId || 'anonymous';
                const userType = req.adminRole ? 'admin' : (req.userType || 'guest');

                if (res.statusCode >= 400) {
                    this.logFailure(action, userId, userType,
                        { message: `HTTP ${res.statusCode}` },
                        req.ip, req.headers['user-agent']
                    );
                } else {
                    this.log(action, userId, userType,
                        { duration, statusCode: res.statusCode },
                        req.ip, req.headers['user-agent']
                    );
                }
            });

            next();
        };
    }
}

// ============================================
// HEALTH MONITORING
// ============================================
class HealthMonitor {
    constructor() {
        this.metrics = {
            requests: 0,
            errors: 0,
            avgResponseTime: 0,
            lastCheck: new Date().toISOString()
        };
        this.responseTimes = [];
    }

    recordRequest(duration, isError = false) {
        this.metrics.requests++;
        if (isError) this.metrics.errors++;

        this.responseTimes.push(duration);
        if (this.responseTimes.length > 1000) {
            this.responseTimes.shift();
        }

        this.metrics.avgResponseTime =
            this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
    }

    getHealth() {
        return {
            status: 'healthy',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            metrics: {
                ...this.metrics,
                errorRate: this.metrics.requests > 0
                    ? (this.metrics.errors / this.metrics.requests * 100).toFixed(2) + '%'
                    : '0%',
                memory: {
                    used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
                    total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB'
                }
            }
        };
    }

    getMiddleware() {
        return (req, res, next) => {
            const startTime = Date.now();

            res.on('finish', () => {
                const duration = Date.now() - startTime;
                this.recordRequest(duration, res.statusCode >= 400);
            });

            next();
        };
    }
}

// ============================================
// FAULT TOLERANCE
// ============================================
class CircuitBreaker {
    constructor(options = {}) {
        this.failureThreshold = options.failureThreshold || 5;
        this.resetTimeout = options.resetTimeout || 30000;
        this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
        this.failures = 0;
        this.lastFailure = null;
    }

    async execute(fn) {
        if (this.state === 'OPEN') {
            if (Date.now() - this.lastFailure > this.resetTimeout) {
                this.state = 'HALF_OPEN';
            } else {
                throw new Error('Circuit breaker is OPEN');
            }
        }

        try {
            const result = await fn();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }

    onSuccess() {
        this.failures = 0;
        this.state = 'CLOSED';
    }

    onFailure() {
        this.failures++;
        this.lastFailure = Date.now();

        if (this.failures >= this.failureThreshold) {
            this.state = 'OPEN';
        }
    }

    getState() {
        return {
            state: this.state,
            failures: this.failures,
            lastFailure: this.lastFailure
        };
    }
}

// ============================================
// EXPORTS
// ============================================
const ddosProtection = new DDoSProtection();
ddosProtection.cleanup();

const auditLogger = new AuditLogger();
const healthMonitor = new HealthMonitor();

module.exports = {
    EncryptionService,
    rateLimiters,
    securityHeaders,
    sanitizeInput,
    preventSQLInjection,
    DDoSProtection: ddosProtection,
    AuditLogger: auditLogger,
    HealthMonitor: healthMonitor,
    CircuitBreaker
};
