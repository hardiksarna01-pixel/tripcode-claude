const winston = require('winston');
const path = require('path');

/**
 * Logger Configuration
 * Centralized logging with Winston
 */

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
        let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;

        if (Object.keys(meta).length > 0) {
            log += ` ${JSON.stringify(meta)}`;
        }

        if (stack) {
            log += `\n${stack}`;
        }

        return log;
    })
);

// Create the logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: { service: 'b2b-travel-api' },
    transports: [
        // Console transport for development
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                logFormat
            )
        })
    ]
});

// Add file transports in production
if (process.env.NODE_ENV === 'production') {
    // Error log file
    logger.add(new winston.transports.File({
        filename: path.join(__dirname, '../../logs/error.log'),
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5
    }));

    // Combined log file
    logger.add(new winston.transports.File({
        filename: path.join(__dirname, '../../logs/combined.log'),
        maxsize: 5242880, // 5MB
        maxFiles: 5
    }));

    // API requests log
    logger.add(new winston.transports.File({
        filename: path.join(__dirname, '../../logs/api.log'),
        level: 'http',
        maxsize: 5242880,
        maxFiles: 3
    }));
}

/**
 * Log API request
 */
logger.logRequest = (req, res, responseTime) => {
    const logData = {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        responseTime: `${responseTime}ms`,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        agentId: req.agent?.id || null
    };

    if (res.statusCode >= 400) {
        logger.warn('API Request', logData);
    } else {
        logger.http('API Request', logData);
    }
};

/**
 * Log API error
 */
logger.logError = (error, req = null) => {
    const errorData = {
        message: error.message,
        stack: error.stack,
        code: error.code || 'UNKNOWN'
    };

    if (req) {
        errorData.method = req.method;
        errorData.url = req.originalUrl;
        errorData.ip = req.ip;
        errorData.agentId = req.agent?.id || null;
    }

    logger.error('Error occurred', errorData);
};

/**
 * Log booking event
 */
logger.logBooking = (action, bookingData, agentId) => {
    logger.info(`Booking ${action}`, {
        action,
        bookingRefNo: bookingData.bookingRefNo,
        amount: bookingData.amount,
        status: bookingData.status,
        agentId
    });
};

/**
 * Log wallet transaction
 */
logger.logWallet = (type, amount, agentId, details = {}) => {
    logger.info(`Wallet ${type}`, {
        type,
        amount,
        agentId,
        ...details
    });
};

/**
 * Log external API call
 */
logger.logExternalApi = (apiName, endpoint, duration, success, error = null) => {
    const logData = {
        api: apiName,
        endpoint,
        duration: `${duration}ms`,
        success
    };

    if (error) {
        logData.error = error;
        logger.warn('External API Call Failed', logData);
    } else {
        logger.info('External API Call', logData);
    }
};

/**
 * Log security event
 */
logger.logSecurity = (event, details) => {
    logger.warn(`Security Event: ${event}`, details);
};

module.exports = logger;
