/**
 * Authentication Middleware
 * JWT verification and role-based access control
 */

const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Verify JWT token for agent/customer authentication
 */
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'AUTH_REQUIRED',
                    message: 'Authentication required'
                }
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, config.jwt.secret);

        req.user = decoded;
        req.userId = decoded.id;
        req.userType = decoded.type; // 'agent' or 'customer'
        req.tenantId = decoded.tenantId;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'TOKEN_EXPIRED',
                    message: 'Token has expired'
                }
            });
        }

        return res.status(401).json({
            success: false,
            error: {
                code: 'INVALID_TOKEN',
                message: 'Invalid authentication token'
            }
        });
    }
};

/**
 * Verify JWT token for admin authentication
 */
const authenticateAdmin = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'AUTH_REQUIRED',
                    message: 'Admin authentication required'
                }
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, config.jwt.adminSecret);

        req.admin = decoded;
        req.adminId = decoded.id;
        req.adminRole = decoded.role;
        req.tenantId = decoded.tenantId;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'TOKEN_EXPIRED',
                    message: 'Admin token has expired'
                }
            });
        }

        return res.status(401).json({
            success: false,
            error: {
                code: 'INVALID_TOKEN',
                message: 'Invalid admin authentication token'
            }
        });
    }
};

/**
 * Verify super admin access
 */
const authenticateSuperAdmin = (req, res, next) => {
    authenticateAdmin(req, res, () => {
        if (req.adminRole !== 'super_admin') {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'FORBIDDEN',
                    message: 'Super admin access required'
                }
            });
        }
        next();
    });
};

/**
 * Check if user is an agent
 */
const requireAgent = (req, res, next) => {
    if (req.userType !== 'agent') {
        return res.status(403).json({
            success: false,
            error: {
                code: 'AGENT_REQUIRED',
                message: 'Agent access required'
            }
        });
    }
    next();
};

/**
 * Check if user is a customer
 */
const requireCustomer = (req, res, next) => {
    if (req.userType !== 'customer') {
        return res.status(403).json({
            success: false,
            error: {
                code: 'CUSTOMER_REQUIRED',
                message: 'Customer access required'
            }
        });
    }
    next();
};

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, config.jwt.secret);
            req.user = decoded;
            req.userId = decoded.id;
            req.userType = decoded.type;
            req.tenantId = decoded.tenantId;
        }
    } catch (error) {
        // Ignore token errors for optional auth
    }
    next();
};

/**
 * API Key authentication for external integrations
 */
const authenticateApiKey = async (req, res, next) => {
    try {
        const apiKey = req.headers['x-api-key'];

        if (!apiKey) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'API_KEY_REQUIRED',
                    message: 'API key is required'
                }
            });
        }

        // In production, validate against database
        // const keyData = await ApiKey.findByKey(apiKey);
        // if (!keyData || keyData.status !== 'active') { throw error }

        req.apiKeyId = apiKey;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: {
                code: 'INVALID_API_KEY',
                message: 'Invalid API key'
            }
        });
    }
};

module.exports = {
    authenticate,
    authenticateAdmin,
    authenticateSuperAdmin,
    requireAgent,
    requireCustomer,
    optionalAuth,
    authenticateApiKey,
    // Aliases for backward compatibility
    authMiddleware: authenticate,
    adminAuthMiddleware: authenticateAdmin
};
