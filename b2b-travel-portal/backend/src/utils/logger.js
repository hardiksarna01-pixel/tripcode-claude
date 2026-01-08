const winston = require('winston');
const path = require('path');

// Define log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
};

// Define colors for each level
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'cyan'
};

winston.addColors(colors);

// Determine log level based on environment
const level = () => {
    const env = process.env.NODE_ENV || 'development';
    return env === 'development' ? 'debug' : 'info';
};

// Custom format for console output
const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
        return `${timestamp} [${level}]: ${message} ${metaStr}`;
    })
);

// JSON format for file output (better for log aggregation)
const fileFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

// Define transports
const transports = [
    // Console transport - always active
    new winston.transports.Console({
        format: consoleFormat
    })
];

// Add file transports in production
if (process.env.NODE_ENV === 'production') {
    const logDir = process.env.LOG_DIR || 'logs';

    transports.push(
        // Error log file
        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error',
            format: fileFormat,
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
        // Combined log file
        new winston.transports.File({
            filename: path.join(logDir, 'combined.log'),
            format: fileFormat,
            maxsize: 5242880, // 5MB
            maxFiles: 5
        })
    );
}

// Create logger instance
const logger = winston.createLogger({
    level: level(),
    levels,
    transports
});

// Stream for Morgan HTTP logging integration
logger.stream = {
    write: (message) => {
        logger.http(message.trim());
    }
};

module.exports = logger;
