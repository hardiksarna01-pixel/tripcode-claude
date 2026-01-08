const logger = require('../utils/logger');

/**
 * Global error handler middleware
 */
exports.errorHandler = (err, req, res, next) => {
    // Log error with structured context
    logger.error('Request error', {
        error: err.message,
        stack: err.stack,
        code: err.code,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        agentId: req.agent?.id
    });

    // API errors from flight service
    if (err.code && err.message) {
        return res.status(400).json({
            success: false,
            error: err.message,
            code: err.code,
            details: err.details
        });
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: err.details
        });
    }

    // JWT errors handled in auth middleware

    // Default server error
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message
    });
};
