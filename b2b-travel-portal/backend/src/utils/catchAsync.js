/**
 * Async handler wrapper
 * Eliminates need for try-catch in every controller
 */
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// Support both import styles
exports.catchAsync = catchAsync;
module.exports.catchAsync = catchAsync;
module.exports.default = catchAsync;

/**
 * Generate unique request ID
 */
exports.generateRequestId = () => {
    return Date.now().toString() + Math.random().toString(36).substring(2, 9);
};

/**
 * Format currency
 */
exports.formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency
    }).format(amount);
};

/**
 * Calculate duration between two datetime strings
 */
exports.calculateDuration = (departure, arrival) => {
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const diffMs = arr - dep;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
};

/**
 * Parse date from various formats
 */
exports.parseDate = (dateStr) => {
    // Handle MM/DD/YYYY format
    if (dateStr.includes('/')) {
        const [month, day, year] = dateStr.split('/');
        return new Date(year, month - 1, day);
    }
    return new Date(dateStr);
};
