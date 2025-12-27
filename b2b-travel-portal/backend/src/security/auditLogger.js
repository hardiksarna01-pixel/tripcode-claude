/**
 * Comprehensive Audit & Logging System
 * Enterprise-grade audit trails and security logging
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * Log Levels
 */
const LogLevel = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    CRITICAL: 4,
    SECURITY: 5
};

const LogLevelNames = {
    0: 'DEBUG',
    1: 'INFO',
    2: 'WARN',
    3: 'ERROR',
    4: 'CRITICAL',
    5: 'SECURITY'
};

/**
 * Audit Event Types
 */
const AuditEventType = {
    // Authentication events
    AUTH_LOGIN_SUCCESS: 'AUTH_LOGIN_SUCCESS',
    AUTH_LOGIN_FAILURE: 'AUTH_LOGIN_FAILURE',
    AUTH_LOGOUT: 'AUTH_LOGOUT',
    AUTH_PASSWORD_CHANGE: 'AUTH_PASSWORD_CHANGE',
    AUTH_PASSWORD_RESET: 'AUTH_PASSWORD_RESET',
    AUTH_MFA_ENABLED: 'AUTH_MFA_ENABLED',
    AUTH_MFA_DISABLED: 'AUTH_MFA_DISABLED',
    AUTH_TOKEN_REFRESH: 'AUTH_TOKEN_REFRESH',
    AUTH_SESSION_EXPIRED: 'AUTH_SESSION_EXPIRED',

    // Authorization events
    AUTHZ_ACCESS_GRANTED: 'AUTHZ_ACCESS_GRANTED',
    AUTHZ_ACCESS_DENIED: 'AUTHZ_ACCESS_DENIED',
    AUTHZ_PERMISSION_CHANGE: 'AUTHZ_PERMISSION_CHANGE',
    AUTHZ_ROLE_CHANGE: 'AUTHZ_ROLE_CHANGE',

    // Data events
    DATA_CREATE: 'DATA_CREATE',
    DATA_READ: 'DATA_READ',
    DATA_UPDATE: 'DATA_UPDATE',
    DATA_DELETE: 'DATA_DELETE',
    DATA_EXPORT: 'DATA_EXPORT',
    DATA_IMPORT: 'DATA_IMPORT',

    // Transaction events
    TXN_BOOKING_CREATED: 'TXN_BOOKING_CREATED',
    TXN_BOOKING_MODIFIED: 'TXN_BOOKING_MODIFIED',
    TXN_BOOKING_CANCELLED: 'TXN_BOOKING_CANCELLED',
    TXN_PAYMENT_INITIATED: 'TXN_PAYMENT_INITIATED',
    TXN_PAYMENT_SUCCESS: 'TXN_PAYMENT_SUCCESS',
    TXN_PAYMENT_FAILURE: 'TXN_PAYMENT_FAILURE',
    TXN_REFUND_INITIATED: 'TXN_REFUND_INITIATED',
    TXN_REFUND_COMPLETED: 'TXN_REFUND_COMPLETED',

    // Security events
    SEC_ATTACK_DETECTED: 'SEC_ATTACK_DETECTED',
    SEC_RATE_LIMIT_EXCEEDED: 'SEC_RATE_LIMIT_EXCEEDED',
    SEC_SUSPICIOUS_ACTIVITY: 'SEC_SUSPICIOUS_ACTIVITY',
    SEC_IP_BLOCKED: 'SEC_IP_BLOCKED',
    SEC_API_KEY_COMPROMISED: 'SEC_API_KEY_COMPROMISED',
    SEC_BRUTE_FORCE_DETECTED: 'SEC_BRUTE_FORCE_DETECTED',

    // System events
    SYS_STARTUP: 'SYS_STARTUP',
    SYS_SHUTDOWN: 'SYS_SHUTDOWN',
    SYS_CONFIG_CHANGE: 'SYS_CONFIG_CHANGE',
    SYS_HEALTH_CHECK: 'SYS_HEALTH_CHECK',
    SYS_ERROR: 'SYS_ERROR',

    // Admin events
    ADMIN_USER_CREATE: 'ADMIN_USER_CREATE',
    ADMIN_USER_UPDATE: 'ADMIN_USER_UPDATE',
    ADMIN_USER_DELETE: 'ADMIN_USER_DELETE',
    ADMIN_SETTINGS_CHANGE: 'ADMIN_SETTINGS_CHANGE'
};

/**
 * Sensitive Data Masker
 */
class SensitiveDataMasker {
    static sensitiveFields = [
        'password', 'passwd', 'pwd', 'secret',
        'token', 'accessToken', 'refreshToken', 'apiKey',
        'authorization', 'auth', 'bearer',
        'creditCard', 'cardNumber', 'cvv', 'cvc',
        'ssn', 'socialSecurity',
        'bankAccount', 'accountNumber', 'routingNumber',
        'pin', 'otp', 'mfa'
    ];

    static patterns = [
        { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, replace: '***@***.***' },
        { pattern: /\b\d{13,16}\b/g, replace: '****-****-****-****' },
        { pattern: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, replace: '***-***-****' },
        { pattern: /\b\d{9,10}\b/g, replace: '**********' }
    ];

    static mask(data, depth = 0) {
        if (depth > 10) return '[MAX_DEPTH]';
        if (data === null || data === undefined) return data;

        if (typeof data === 'string') {
            let masked = data;
            for (const { pattern, replace } of this.patterns) {
                masked = masked.replace(pattern, replace);
            }
            return masked;
        }

        if (Array.isArray(data)) {
            return data.map(item => this.mask(item, depth + 1));
        }

        if (typeof data === 'object') {
            const masked = {};
            for (const [key, value] of Object.entries(data)) {
                if (this.isSensitiveField(key)) {
                    masked[key] = this.maskValue(value);
                } else {
                    masked[key] = this.mask(value, depth + 1);
                }
            }
            return masked;
        }

        return data;
    }

    static isSensitiveField(field) {
        const lowerField = field.toLowerCase();
        return this.sensitiveFields.some(sensitive =>
            lowerField.includes(sensitive.toLowerCase())
        );
    }

    static maskValue(value) {
        if (typeof value !== 'string') return '***';
        if (value.length <= 4) return '***';
        return value.substring(0, 2) + '*'.repeat(value.length - 4) + value.substring(value.length - 2);
    }
}

/**
 * Audit Log Entry
 */
class AuditLogEntry {
    constructor(data) {
        this.id = crypto.randomUUID();
        this.timestamp = new Date().toISOString();
        this.eventType = data.eventType;
        this.level = data.level || LogLevel.INFO;
        this.message = data.message;

        // Actor information
        this.actor = {
            userId: data.userId || null,
            username: data.username || null,
            email: data.email || null,
            role: data.role || null,
            agentId: data.agentId || null,
            ipAddress: data.ipAddress || null,
            userAgent: data.userAgent || null,
            sessionId: data.sessionId || null
        };

        // Request information
        this.request = {
            method: data.method || null,
            path: data.path || null,
            query: SensitiveDataMasker.mask(data.query) || null,
            body: SensitiveDataMasker.mask(data.body) || null,
            headers: this.maskHeaders(data.headers) || null
        };

        // Response information
        this.response = {
            statusCode: data.statusCode || null,
            duration: data.duration || null
        };

        // Additional context
        this.context = SensitiveDataMasker.mask(data.context) || {};

        // Resource affected
        this.resource = {
            type: data.resourceType || null,
            id: data.resourceId || null,
            name: data.resourceName || null
        };

        // Integrity hash
        this.hash = this.generateHash();
    }

    maskHeaders(headers) {
        if (!headers) return null;
        const masked = { ...headers };
        const sensitiveHeaders = ['authorization', 'x-api-key', 'cookie', 'x-auth-token'];
        for (const header of sensitiveHeaders) {
            if (masked[header]) {
                masked[header] = '***';
            }
        }
        return masked;
    }

    generateHash() {
        const content = JSON.stringify({
            id: this.id,
            timestamp: this.timestamp,
            eventType: this.eventType,
            actor: this.actor,
            message: this.message
        });
        return crypto.createHash('sha256').update(content).digest('hex');
    }

    toJSON() {
        return {
            id: this.id,
            timestamp: this.timestamp,
            eventType: this.eventType,
            level: LogLevelNames[this.level],
            message: this.message,
            actor: this.actor,
            request: this.request,
            response: this.response,
            context: this.context,
            resource: this.resource,
            hash: this.hash
        };
    }
}

/**
 * Log Storage Interface
 */
class LogStorage {
    async store(entry) {
        throw new Error('Must implement store method');
    }
    async query(filters) {
        throw new Error('Must implement query method');
    }
}

/**
 * In-Memory Log Storage (for development/testing)
 */
class InMemoryLogStorage extends LogStorage {
    constructor(maxSize = 10000) {
        super();
        this.logs = [];
        this.maxSize = maxSize;
    }

    async store(entry) {
        this.logs.push(entry.toJSON());
        if (this.logs.length > this.maxSize) {
            this.logs.shift();
        }
    }

    async query(filters = {}) {
        let results = [...this.logs];

        if (filters.eventType) {
            results = results.filter(log => log.eventType === filters.eventType);
        }
        if (filters.userId) {
            results = results.filter(log => log.actor.userId === filters.userId);
        }
        if (filters.level) {
            const levelNum = typeof filters.level === 'string'
                ? Object.entries(LogLevelNames).find(([_, name]) => name === filters.level)?.[0]
                : filters.level;
            results = results.filter(log =>
                Object.entries(LogLevelNames).find(([_, name]) => name === log.level)?.[0] >= levelNum
            );
        }
        if (filters.startDate) {
            results = results.filter(log => new Date(log.timestamp) >= new Date(filters.startDate));
        }
        if (filters.endDate) {
            results = results.filter(log => new Date(log.timestamp) <= new Date(filters.endDate));
        }
        if (filters.ipAddress) {
            results = results.filter(log => log.actor.ipAddress === filters.ipAddress);
        }

        // Pagination
        const page = filters.page || 1;
        const limit = filters.limit || 50;
        const start = (page - 1) * limit;

        return {
            total: results.length,
            page,
            limit,
            data: results.slice(start, start + limit)
        };
    }

    async getRecent(count = 100) {
        return this.logs.slice(-count);
    }

    async getByEventType(eventType) {
        return this.logs.filter(log => log.eventType === eventType);
    }

    async getSecurityEvents(hours = 24) {
        const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
        return this.logs.filter(log =>
            log.level === 'SECURITY' &&
            new Date(log.timestamp) >= cutoff
        );
    }
}

/**
 * File Log Storage (for production)
 */
class FileLogStorage extends LogStorage {
    constructor(options = {}) {
        super();
        this.basePath = options.basePath || './logs';
        this.maxFileSize = options.maxFileSize || 10 * 1024 * 1024; // 10MB
        this.maxFiles = options.maxFiles || 30;

        // Ensure log directory exists
        if (!fs.existsSync(this.basePath)) {
            fs.mkdirSync(this.basePath, { recursive: true });
        }
    }

    getFilename(date = new Date()) {
        const dateStr = date.toISOString().split('T')[0];
        return path.join(this.basePath, `audit-${dateStr}.log`);
    }

    async store(entry) {
        const filename = this.getFilename();
        const line = JSON.stringify(entry.toJSON()) + '\n';

        try {
            fs.appendFileSync(filename, line);
            await this.rotate();
        } catch (error) {
            console.error('[AuditLogger] Failed to write to log file:', error);
        }
    }

    async rotate() {
        const files = fs.readdirSync(this.basePath)
            .filter(f => f.startsWith('audit-') && f.endsWith('.log'))
            .map(f => path.join(this.basePath, f))
            .sort();

        // Remove old files
        while (files.length > this.maxFiles) {
            const oldFile = files.shift();
            try {
                fs.unlinkSync(oldFile);
            } catch {
                // Ignore
            }
        }
    }

    async query(filters = {}) {
        // For file-based storage, this would read and parse log files
        // In production, you'd want to use a proper log management system
        return { total: 0, page: 1, limit: 50, data: [] };
    }
}

/**
 * Main Audit Logger
 */
class AuditLogger {
    constructor(options = {}) {
        this.storage = options.storage || new InMemoryLogStorage();
        this.minLevel = options.minLevel || LogLevel.INFO;
        this.enabled = options.enabled !== false;
        this.console = options.console !== false;

        // Event listeners
        this.listeners = new Map();
    }

    async log(data) {
        if (!this.enabled) return;
        if (data.level !== undefined && data.level < this.minLevel) return;

        const entry = new AuditLogEntry(data);

        // Store the log
        await this.storage.store(entry);

        // Console output
        if (this.console) {
            this.consoleLog(entry);
        }

        // Notify listeners
        this.notifyListeners(entry);

        return entry;
    }

    consoleLog(entry) {
        const levelColors = {
            DEBUG: '\x1b[90m',
            INFO: '\x1b[36m',
            WARN: '\x1b[33m',
            ERROR: '\x1b[31m',
            CRITICAL: '\x1b[35m',
            SECURITY: '\x1b[41m'
        };

        const reset = '\x1b[0m';
        const levelName = LogLevelNames[entry.level];
        const color = levelColors[levelName] || '';

        console.log(
            `${color}[${entry.timestamp}] [${levelName}] [${entry.eventType}]${reset}`,
            entry.message,
            entry.actor.userId ? `(User: ${entry.actor.userId})` : '',
            entry.actor.ipAddress ? `(IP: ${entry.actor.ipAddress})` : ''
        );
    }

    // Convenience methods for different log levels
    debug(eventType, message, data = {}) {
        return this.log({ eventType, message, level: LogLevel.DEBUG, ...data });
    }

    info(eventType, message, data = {}) {
        return this.log({ eventType, message, level: LogLevel.INFO, ...data });
    }

    warn(eventType, message, data = {}) {
        return this.log({ eventType, message, level: LogLevel.WARN, ...data });
    }

    error(eventType, message, data = {}) {
        return this.log({ eventType, message, level: LogLevel.ERROR, ...data });
    }

    critical(eventType, message, data = {}) {
        return this.log({ eventType, message, level: LogLevel.CRITICAL, ...data });
    }

    security(eventType, message, data = {}) {
        return this.log({ eventType, message, level: LogLevel.SECURITY, ...data });
    }

    // Event-specific logging methods
    async logAuth(eventType, userId, success, data = {}) {
        const level = success ? LogLevel.INFO : LogLevel.WARN;
        return this.log({
            eventType,
            level,
            message: success ? 'Authentication successful' : 'Authentication failed',
            userId,
            ...data
        });
    }

    async logDataAccess(action, resourceType, resourceId, userId, data = {}) {
        const eventType = `DATA_${action.toUpperCase()}`;
        return this.log({
            eventType,
            level: LogLevel.INFO,
            message: `${action} operation on ${resourceType}`,
            userId,
            resourceType,
            resourceId,
            ...data
        });
    }

    async logTransaction(eventType, transactionId, amount, userId, data = {}) {
        return this.log({
            eventType,
            level: LogLevel.INFO,
            message: `Transaction ${eventType}: ${transactionId}`,
            userId,
            context: { transactionId, amount, ...data.context },
            ...data
        });
    }

    async logSecurityEvent(eventType, message, ipAddress, data = {}) {
        return this.security(eventType, message, { ipAddress, ...data });
    }

    // Query methods
    async query(filters) {
        return this.storage.query(filters);
    }

    async getRecent(count) {
        if (this.storage.getRecent) {
            return this.storage.getRecent(count);
        }
        return [];
    }

    async getSecurityEvents(hours = 24) {
        if (this.storage.getSecurityEvents) {
            return this.storage.getSecurityEvents(hours);
        }
        return [];
    }

    // Event listeners
    on(eventType, callback) {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, []);
        }
        this.listeners.get(eventType).push(callback);
    }

    off(eventType, callback) {
        if (this.listeners.has(eventType)) {
            const callbacks = this.listeners.get(eventType);
            const index = callbacks.indexOf(callback);
            if (index !== -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    notifyListeners(entry) {
        // Notify specific event type listeners
        if (this.listeners.has(entry.eventType)) {
            for (const callback of this.listeners.get(entry.eventType)) {
                try {
                    callback(entry);
                } catch (error) {
                    console.error('[AuditLogger] Listener error:', error);
                }
            }
        }

        // Notify 'all' listeners
        if (this.listeners.has('all')) {
            for (const callback of this.listeners.get('all')) {
                try {
                    callback(entry);
                } catch (error) {
                    console.error('[AuditLogger] Listener error:', error);
                }
            }
        }
    }
}

/**
 * Audit Middleware Factory
 */
const auditMiddleware = (auditLogger, options = {}) => {
    const excludePaths = options.excludePaths || ['/health', '/metrics', '/favicon.ico'];
    const excludeMethods = options.excludeMethods || [];

    return async (req, res, next) => {
        // Skip excluded paths
        if (excludePaths.some(p => req.path.startsWith(p))) {
            return next();
        }

        // Skip excluded methods
        if (excludeMethods.includes(req.method)) {
            return next();
        }

        const startTime = Date.now();

        // Capture original end function
        const originalEnd = res.end;

        res.end = function (...args) {
            const duration = Date.now() - startTime;

            // Determine event type based on path and method
            let eventType = AuditEventType.DATA_READ;
            if (req.method === 'POST') eventType = AuditEventType.DATA_CREATE;
            if (req.method === 'PUT' || req.method === 'PATCH') eventType = AuditEventType.DATA_UPDATE;
            if (req.method === 'DELETE') eventType = AuditEventType.DATA_DELETE;

            // Log the request
            auditLogger.log({
                eventType,
                level: res.statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO,
                message: `${req.method} ${req.path}`,
                userId: req.user?.id,
                username: req.user?.username,
                email: req.user?.email,
                role: req.user?.role,
                ipAddress: req.ip || req.connection?.remoteAddress,
                userAgent: req.headers['user-agent'],
                sessionId: req.sessionID,
                method: req.method,
                path: req.path,
                query: req.query,
                body: req.body,
                headers: req.headers,
                statusCode: res.statusCode,
                duration
            });

            originalEnd.apply(res, args);
        };

        next();
    };
};

// Create singleton instance
const auditLogger = new AuditLogger();

module.exports = {
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
};
