const db = require('../config/database');

/**
 * Audit Logging Middleware
 * Records all important actions for compliance and debugging
 */

/**
 * Log an audit event to the database
 */
const logAuditEvent = async (eventData) => {
    const {
        userType,
        userId,
        userEmail,
        action,
        entityType,
        entityId,
        oldValues,
        newValues,
        description,
        ipAddress,
        userAgent
    } = eventData;

    try {
        await db.query(
            `INSERT INTO audit_logs
            (user_type, user_id, user_email, action, entity_type, entity_id,
             old_values, new_values, description, ip_address, user_agent)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [
                userType,
                userId,
                userEmail,
                action,
                entityType,
                entityId,
                oldValues ? JSON.stringify(oldValues) : null,
                newValues ? JSON.stringify(newValues) : null,
                description,
                ipAddress,
                userAgent
            ]
        );
    } catch (error) {
        // Log to console but don't fail the request
        console.error('Audit log failed:', error.message);
    }
};

/**
 * Middleware to attach audit helper to request
 */
const auditMiddleware = (req, res, next) => {
    // Attach audit helper to request
    req.audit = async (action, entityType, entityId, options = {}) => {
        const eventData = {
            userType: req.agent ? 'AGENT' : (req.admin ? 'ADMIN' : 'ANONYMOUS'),
            userId: req.agent?.id || req.admin?.id || null,
            userEmail: req.agent?.email || req.admin?.email || null,
            action,
            entityType,
            entityId,
            oldValues: options.oldValues || null,
            newValues: options.newValues || null,
            description: options.description || null,
            ipAddress: req.ip || req.connection?.remoteAddress || 'unknown',
            userAgent: req.get('User-Agent') || 'unknown'
        };

        await logAuditEvent(eventData);
    };

    next();
};

/**
 * Audit specific actions
 */
const auditActions = {
    // Authentication actions
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    LOGIN_FAILED: 'LOGIN_FAILED',
    PASSWORD_CHANGE: 'PASSWORD_CHANGE',
    PASSWORD_RESET: 'PASSWORD_RESET',

    // CRUD actions
    CREATE: 'CREATE',
    READ: 'READ',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',

    // Booking actions
    SEARCH: 'SEARCH',
    REPRICE: 'REPRICE',
    BOOK: 'BOOK',
    TICKET: 'TICKET',
    CANCEL: 'CANCEL',

    // Wallet actions
    WALLET_CREDIT: 'WALLET_CREDIT',
    WALLET_DEBIT: 'WALLET_DEBIT',
    PAYMENT: 'PAYMENT',

    // Admin actions
    APPROVE: 'APPROVE',
    REJECT: 'REJECT',
    BLOCK: 'BLOCK',
    UNBLOCK: 'UNBLOCK',
    STATUS_CHANGE: 'STATUS_CHANGE'
};

/**
 * Entity types for audit logs
 */
const auditEntities = {
    AGENT: 'AGENT',
    ADMIN: 'ADMIN',
    BOOKING: 'BOOKING',
    SCHEME: 'SCHEME',
    GROUP: 'GROUP',
    API_PROVIDER: 'API_PROVIDER',
    WALLET: 'WALLET',
    SESSION: 'SESSION'
};

/**
 * Log authentication events
 */
const logAuthEvent = async (req, action, success, details = {}) => {
    await logAuditEvent({
        userType: 'AGENT',
        userId: details.userId || null,
        userEmail: details.email || null,
        action,
        entityType: auditEntities.SESSION,
        entityId: null,
        oldValues: null,
        newValues: success ? { success: true } : { success: false, reason: details.reason },
        description: details.description || null,
        ipAddress: req.ip || req.connection?.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent') || 'unknown'
    });
};

/**
 * Query audit logs
 */
const queryAuditLogs = async (filters = {}) => {
    const {
        userId,
        userType,
        action,
        entityType,
        entityId,
        fromDate,
        toDate,
        limit = 100,
        offset = 0
    } = filters;

    let query = 'SELECT * FROM audit_logs WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (userId) {
        query += ` AND user_id = $${paramIndex++}`;
        params.push(userId);
    }

    if (userType) {
        query += ` AND user_type = $${paramIndex++}`;
        params.push(userType);
    }

    if (action) {
        query += ` AND action = $${paramIndex++}`;
        params.push(action);
    }

    if (entityType) {
        query += ` AND entity_type = $${paramIndex++}`;
        params.push(entityType);
    }

    if (entityId) {
        query += ` AND entity_id = $${paramIndex++}`;
        params.push(entityId);
    }

    if (fromDate) {
        query += ` AND created_at >= $${paramIndex++}`;
        params.push(fromDate);
    }

    if (toDate) {
        query += ` AND created_at <= $${paramIndex++}`;
        params.push(toDate);
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);

    const result = await db.query(query, params);
    return result.rows;
};

module.exports = {
    auditMiddleware,
    logAuditEvent,
    logAuthEvent,
    queryAuditLogs,
    auditActions,
    auditEntities
};
