const logger = require('../utils/logger');

/**
 * Request logging middleware
 * Logs incoming requests and response details
 */
const requestLogger = (req, res, next) => {
    const startTime = Date.now();

    // Log request
    const requestLog = {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent')
    };

    // Add agent info if authenticated
    if (req.agent) {
        requestLog.agentId = req.agent.id;
        requestLog.agentCode = req.agent.agentCode;
    }

    logger.http(`Incoming request: ${req.method} ${req.originalUrl}`, requestLog);

    // Capture response details
    const originalSend = res.send;
    res.send = function (body) {
        const duration = Date.now() - startTime;

        const responseLog = {
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            duration: `${duration}ms`
        };

        // Log based on status code
        if (res.statusCode >= 500) {
            logger.error(`Response: ${req.method} ${req.originalUrl} ${res.statusCode}`, responseLog);
        } else if (res.statusCode >= 400) {
            logger.warn(`Response: ${req.method} ${req.originalUrl} ${res.statusCode}`, responseLog);
        } else {
            logger.http(`Response: ${req.method} ${req.originalUrl} ${res.statusCode}`, responseLog);
        }

        return originalSend.call(this, body);
    };

    next();
};

module.exports = { requestLogger };
