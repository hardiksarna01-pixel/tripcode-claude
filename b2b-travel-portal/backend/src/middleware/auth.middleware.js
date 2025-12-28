const jwt = require('jsonwebtoken');
const db = require('../config/database');

/**
 * Authentication middleware
 * Verifies JWT token and attaches agent credentials to request
 */
exports.authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Access denied. No token provided.'
            });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'your-secret-key'
        );

        // Get agent from database
        const agents = db.getTable('agents');
        const agent = agents.get(decoded.email);

        if (!agent) {
            return res.status(401).json({
                success: false,
                error: 'Agent not found'
            });
        }

        if (!agent.isActive) {
            return res.status(401).json({
                success: false,
                error: 'Account is inactive'
            });
        }

        // Attach agent and API credentials to request
        req.agent = agent;
        req.agentCredentials = {
            userId: agent.apiUserId,
            passwordHash: agent.apiPasswordHash,
            ipAddress: req.ip || req.connection.remoteAddress || '0.0.0.0'
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                error: 'Invalid token'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'Token expired'
            });
        }
        next(error);
    }
};

/**
 * Role-based access control middleware
 */
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.agent || !roles.includes(req.agent.role)) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to access this resource'
            });
        }
        next();
    };
};
