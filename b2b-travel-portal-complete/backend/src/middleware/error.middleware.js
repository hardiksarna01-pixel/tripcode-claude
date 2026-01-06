/**
 * Error Handling Middleware
 * Centralized error handling and formatting
 */

const config = require('../config');

/**
 * Custom Application Error
 */
class AppError extends Error {
    constructor(message, statusCode, code = 'ERROR') {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Validation Error
 */
class ValidationError extends AppError {
    constructor(message, details = []) {
        super(message, 400, 'VALIDATION_ERROR');
        this.details = details;
    }
}

/**
 * Authentication Error
 */
class AuthError extends AppError {
    constructor(message = 'Authentication failed') {
        super(message, 401, 'AUTH_ERROR');
    }
}

/**
 * Authorization Error
 */
class ForbiddenError extends AppError {
    constructor(message = 'Access denied') {
        super(message, 403, 'FORBIDDEN');
    }
}

/**
 * Not Found Error
 */
class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404, 'NOT_FOUND');
    }
}

/**
 * Conflict Error
 */
class ConflictError extends AppError {
    constructor(message = 'Resource already exists') {
        super(message, 409, 'CONFLICT');
    }
}

/**
 * Rate Limit Error
 */
class RateLimitError extends AppError {
    constructor(message = 'Too many requests') {
        super(message, 429, 'RATE_LIMITED');
    }
}

/**
 * External API Error
 */
class ExternalApiError extends AppError {
    constructor(supplier, message) {
        super(`${supplier} API Error: ${message}`, 502, 'EXTERNAL_API_ERROR');
        this.supplier = supplier;
    }
}

/**
 * Insufficient Balance Error
 */
class InsufficientBalanceError extends AppError {
    constructor(required, available) {
        super('Insufficient wallet balance', 402, 'INSUFFICIENT_BALANCE');
        this.required = required;
        this.available = available;
    }
}

/**
 * Booking Error
 */
class BookingError extends AppError {
    constructor(message, bookingRef = null) {
        super(message, 400, 'BOOKING_ERROR');
        this.bookingRef = bookingRef;
    }
}

/**
 * Async error handler wrapper
 */
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

/**
 * 404 Not Found Handler
 */
const notFoundHandler = (req, res, next) => {
    const error = new NotFoundError(`Route ${req.method} ${req.path}`);
    next(error);
};

/**
 * Global Error Handler
 */
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error
    if (config.server.env !== 'test') {
        console.error('Error:', {
            message: err.message,
            code: err.code,
            stack: err.stack,
            path: req.path,
            method: req.method
        });
    }

    // Mongoose CastError
    if (err.name === 'CastError') {
        error = new AppError('Invalid ID format', 400, 'INVALID_ID');
    }

    // Mongoose Duplicate Key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        error = new ConflictError(`${field} already exists`);
    }

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        const details = Object.values(err.errors).map(e => ({
            field: e.path,
            message: e.message
        }));
        error = new ValidationError('Validation failed', details);
    }

    // JWT Errors
    if (err.name === 'JsonWebTokenError') {
        error = new AuthError('Invalid token');
    }

    if (err.name === 'TokenExpiredError') {
        error = new AuthError('Token expired');
    }

    // PostgreSQL Errors
    if (err.code && err.code.startsWith('23')) {
        switch (err.code) {
            case '23505': // unique_violation
                error = new ConflictError('Duplicate entry');
                break;
            case '23503': // foreign_key_violation
                error = new AppError('Referenced resource not found', 400, 'REFERENCE_ERROR');
                break;
            case '23502': // not_null_violation
                error = new ValidationError('Required field missing');
                break;
            default:
                error = new AppError('Database constraint error', 400, 'DATABASE_ERROR');
        }
    }

    // Default to 500 Internal Server Error
    const statusCode = error.statusCode || 500;
    const code = error.code || 'INTERNAL_ERROR';

    const response = {
        success: false,
        error: {
            code,
            message: config.server.env === 'production' && statusCode === 500
                ? 'An unexpected error occurred'
                : error.message
        }
    };

    // Add details for validation errors
    if (error.details) {
        response.error.details = error.details;
    }

    // Add booking reference if available
    if (error.bookingRef) {
        response.error.bookingRef = error.bookingRef;
    }

    // Add balance info for insufficient balance errors
    if (error.required !== undefined) {
        response.error.required = error.required;
        response.error.available = error.available;
    }

    // Add stack trace in development
    if (config.server.env === 'development') {
        response.error.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

module.exports = {
    AppError,
    ValidationError,
    AuthError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    RateLimitError,
    ExternalApiError,
    InsufficientBalanceError,
    BookingError,
    catchAsync,
    notFoundHandler,
    errorHandler
};
