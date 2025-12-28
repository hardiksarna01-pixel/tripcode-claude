/**
 * Security Headers & CORS Hardening
 * Comprehensive HTTP security headers for API protection
 */

/**
 * Security Headers Configuration
 */
const defaultSecurityHeaders = {
    // Prevent XSS attacks
    'X-XSS-Protection': '1; mode=block',

    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',

    // Prevent clickjacking
    'X-Frame-Options': 'DENY',

    // Control referrer information
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // Disable DNS prefetching
    'X-DNS-Prefetch-Control': 'off',

    // Prevent IE from executing downloads in site's context
    'X-Download-Options': 'noopen',

    // Enable cross-domain policies
    'X-Permitted-Cross-Domain-Policies': 'none',

    // Disable caching for sensitive responses
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store'
};

/**
 * Content Security Policy Configuration
 */
const generateCSP = (options = {}) => {
    const directives = {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'", ...(options.scriptSrc || [])],
        'style-src': ["'self'", "'unsafe-inline'", ...(options.styleSrc || [])],
        'img-src': ["'self'", 'data:', 'https:', ...(options.imgSrc || [])],
        'font-src': ["'self'", 'https:', 'data:', ...(options.fontSrc || [])],
        'connect-src': ["'self'", ...(options.connectSrc || [])],
        'media-src': ["'self'", ...(options.mediaSrc || [])],
        'object-src': ["'none'"],
        'frame-src': ["'none'", ...(options.frameSrc || [])],
        'frame-ancestors': ["'none'"],
        'form-action': ["'self'"],
        'base-uri': ["'self'"],
        'upgrade-insecure-requests': [],
        ...(options.reportUri ? { 'report-uri': [options.reportUri] } : {})
    };

    return Object.entries(directives)
        .map(([key, values]) => {
            if (values.length === 0) return key;
            return `${key} ${values.join(' ')}`;
        })
        .join('; ');
};

/**
 * Permissions Policy (formerly Feature Policy)
 */
const generatePermissionsPolicy = (options = {}) => {
    const policies = {
        'accelerometer': '()',
        'camera': '()',
        'geolocation': options.allowGeolocation ? '(self)' : '()',
        'gyroscope': '()',
        'magnetometer': '()',
        'microphone': '()',
        'payment': options.allowPayment ? '(self)' : '()',
        'usb': '()',
        'interest-cohort': '()', // Disable FLoC
        'autoplay': '()',
        'fullscreen': '(self)',
        'picture-in-picture': '()',
        ...options.custom
    };

    return Object.entries(policies)
        .map(([key, value]) => `${key}=${value}`)
        .join(', ');
};

/**
 * CORS Configuration
 */
class CORSConfig {
    constructor(options = {}) {
        this.allowedOrigins = options.origins || ['*'];
        this.allowedMethods = options.methods || ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];
        this.allowedHeaders = options.headers || [
            'Content-Type',
            'Authorization',
            'X-Requested-With',
            'X-API-Key',
            'X-Session-Id',
            'X-CSRF-Token'
        ];
        this.exposedHeaders = options.exposedHeaders || [
            'X-RateLimit-Limit',
            'X-RateLimit-Remaining',
            'X-RateLimit-Reset',
            'X-Request-Id'
        ];
        this.credentials = options.credentials !== false;
        this.maxAge = options.maxAge || 86400; // 24 hours
        this.preflightContinue = options.preflightContinue || false;
    }

    isOriginAllowed(origin) {
        if (this.allowedOrigins.includes('*')) return true;
        if (!origin) return false;

        return this.allowedOrigins.some(allowed => {
            if (allowed === origin) return true;
            // Support wildcard subdomains
            if (allowed.startsWith('*.')) {
                const domain = allowed.slice(2);
                return origin.endsWith(domain);
            }
            return false;
        });
    }

    getHeaders(origin) {
        const headers = {};

        // Origin
        if (this.isOriginAllowed(origin)) {
            headers['Access-Control-Allow-Origin'] = this.allowedOrigins.includes('*') ? '*' : origin;
        }

        // Credentials
        if (this.credentials && !this.allowedOrigins.includes('*')) {
            headers['Access-Control-Allow-Credentials'] = 'true';
        }

        // Exposed headers
        if (this.exposedHeaders.length > 0) {
            headers['Access-Control-Expose-Headers'] = this.exposedHeaders.join(', ');
        }

        return headers;
    }

    getPreflightHeaders(origin) {
        const headers = this.getHeaders(origin);

        // Methods
        headers['Access-Control-Allow-Methods'] = this.allowedMethods.join(', ');

        // Headers
        headers['Access-Control-Allow-Headers'] = this.allowedHeaders.join(', ');

        // Max age
        headers['Access-Control-Max-Age'] = String(this.maxAge);

        return headers;
    }
}

/**
 * Security Headers Middleware
 */
const securityHeadersMiddleware = (options = {}) => {
    const headers = { ...defaultSecurityHeaders, ...options.customHeaders };
    const csp = options.csp !== false ? generateCSP(options.cspOptions || {}) : null;
    const permissionsPolicy = generatePermissionsPolicy(options.permissionsOptions || {});

    return (req, res, next) => {
        // Apply security headers
        for (const [header, value] of Object.entries(headers)) {
            res.setHeader(header, value);
        }

        // Content Security Policy
        if (csp) {
            res.setHeader('Content-Security-Policy', csp);
        }

        // Permissions Policy
        res.setHeader('Permissions-Policy', permissionsPolicy);

        // HSTS (HTTP Strict Transport Security) - only in production
        if (process.env.NODE_ENV === 'production') {
            res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        }

        // Add request ID for tracking
        const requestId = req.headers['x-request-id'] || require('crypto').randomUUID();
        res.setHeader('X-Request-Id', requestId);
        req.requestId = requestId;

        next();
    };
};

/**
 * CORS Middleware
 */
const corsMiddleware = (options = {}) => {
    const corsConfig = new CORSConfig(options);

    return (req, res, next) => {
        const origin = req.headers.origin;

        // Handle preflight requests
        if (req.method === 'OPTIONS') {
            if (!corsConfig.isOriginAllowed(origin)) {
                return res.status(403).json({
                    success: false,
                    error: 'Origin not allowed',
                    code: 'CORS_ORIGIN_DENIED'
                });
            }

            const preflightHeaders = corsConfig.getPreflightHeaders(origin);
            for (const [header, value] of Object.entries(preflightHeaders)) {
                res.setHeader(header, value);
            }

            if (corsConfig.preflightContinue) {
                return next();
            }

            return res.status(204).end();
        }

        // Handle actual requests
        if (origin && !corsConfig.isOriginAllowed(origin)) {
            return res.status(403).json({
                success: false,
                error: 'Origin not allowed',
                code: 'CORS_ORIGIN_DENIED'
            });
        }

        const corsHeaders = corsConfig.getHeaders(origin);
        for (const [header, value] of Object.entries(corsHeaders)) {
            res.setHeader(header, value);
        }

        next();
    };
};

/**
 * API Version Header Middleware
 */
const apiVersionMiddleware = (version = '1.0.0') => {
    return (req, res, next) => {
        res.setHeader('X-API-Version', version);
        next();
    };
};

/**
 * Request Timeout Middleware
 */
const requestTimeoutMiddleware = (timeoutMs = 30000) => {
    return (req, res, next) => {
        res.setTimeout(timeoutMs, () => {
            if (!res.headersSent) {
                res.status(408).json({
                    success: false,
                    error: 'Request timeout',
                    code: 'REQUEST_TIMEOUT'
                });
            }
        });
        next();
    };
};

/**
 * Secure Cookie Settings
 */
const secureCookieSettings = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
};

/**
 * Cookie Security Middleware
 */
const secureCookieMiddleware = (req, res, next) => {
    // Override res.cookie to enforce security settings
    const originalCookie = res.cookie.bind(res);

    res.cookie = (name, value, options = {}) => {
        const secureOptions = {
            ...secureCookieSettings,
            ...options,
            httpOnly: options.httpOnly !== false,
            secure: process.env.NODE_ENV === 'production' || options.secure,
            sameSite: options.sameSite || 'strict'
        };

        return originalCookie(name, value, secureOptions);
    };

    next();
};

/**
 * IP Validation Middleware
 */
const ipValidationMiddleware = (options = {}) => {
    const allowedIPs = new Set(options.allowedIPs || []);
    const blockedIPs = new Set(options.blockedIPs || []);
    const allowPrivate = options.allowPrivate !== false;

    const isPrivateIP = (ip) => {
        const parts = ip.split('.');
        if (parts.length !== 4) return false;

        const first = parseInt(parts[0]);
        const second = parseInt(parts[1]);

        // 10.x.x.x, 172.16-31.x.x, 192.168.x.x, 127.x.x.x
        return first === 10 ||
            (first === 172 && second >= 16 && second <= 31) ||
            (first === 192 && second === 168) ||
            first === 127;
    };

    return (req, res, next) => {
        const ip = req.ip || req.connection?.remoteAddress;

        // Check blocked list
        if (blockedIPs.has(ip)) {
            return res.status(403).json({
                success: false,
                error: 'Access denied',
                code: 'IP_BLOCKED'
            });
        }

        // Check allowed list (if not empty, only allowed IPs can access)
        if (allowedIPs.size > 0 && !allowedIPs.has(ip)) {
            // Allow private IPs if configured
            if (allowPrivate && isPrivateIP(ip)) {
                return next();
            }

            return res.status(403).json({
                success: false,
                error: 'Access denied',
                code: 'IP_NOT_ALLOWED'
            });
        }

        next();
    };
};

/**
 * HTTPS Enforcement Middleware
 */
const httpsEnforcementMiddleware = (options = {}) => {
    const enabled = options.enabled !== false && process.env.NODE_ENV === 'production';

    return (req, res, next) => {
        if (!enabled) return next();

        // Check if request is already HTTPS
        const isHttps = req.secure ||
            req.headers['x-forwarded-proto'] === 'https' ||
            req.headers['x-forwarded-ssl'] === 'on';

        if (!isHttps) {
            if (options.redirect !== false) {
                const httpsUrl = `https://${req.headers.host}${req.url}`;
                return res.redirect(301, httpsUrl);
            }

            return res.status(403).json({
                success: false,
                error: 'HTTPS required',
                code: 'HTTPS_REQUIRED'
            });
        }

        next();
    };
};

/**
 * Combined Security Middleware
 */
const combinedSecurityMiddleware = (options = {}) => {
    const middlewares = [
        securityHeadersMiddleware(options.headers || {}),
        corsMiddleware(options.cors || {}),
        secureCookieMiddleware,
        requestTimeoutMiddleware(options.timeout || 30000)
    ];

    if (options.httpsEnforce) {
        middlewares.unshift(httpsEnforcementMiddleware(options.https || {}));
    }

    if (options.ipValidation) {
        middlewares.push(ipValidationMiddleware(options.ip || {}));
    }

    return (req, res, next) => {
        let index = 0;

        const runNext = (err) => {
            if (err) return next(err);
            if (index >= middlewares.length) return next();

            const middleware = middlewares[index++];
            try {
                middleware(req, res, runNext);
            } catch (error) {
                next(error);
            }
        };

        runNext();
    };
};

module.exports = {
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
