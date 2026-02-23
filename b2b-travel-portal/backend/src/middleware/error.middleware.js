/**
 * Global error handler middleware
 */
exports.errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

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
