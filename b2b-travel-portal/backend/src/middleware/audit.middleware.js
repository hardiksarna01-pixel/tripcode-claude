/**
 * Audit Middleware (Mock)
 * Logs API requests for audit trail
 */

const auditMiddleware = (req, res, next) => {
    // Simple audit logging - just pass through for demo
    if (process.env.LOG_LEVEL === 'debug') {
        console.log(`[AUDIT] ${req.method} ${req.path} - ${req.ip}`);
    }
    next();
};

module.exports = { auditMiddleware };
