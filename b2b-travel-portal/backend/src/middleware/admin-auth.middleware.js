const jwt = require('jsonwebtoken');

// Mock admin store (replace with database in production)
const adminUsers = new Map();

// Add default super admin - password: admin123
const bcrypt = require('bcryptjs');

adminUsers.set('admin@flyshop.com', {
    id: 1,
    username: 'superadmin',
    email: 'admin@flyshop.com',
    passwordHash: bcrypt.hashSync('admin123', 10),
    fullName: 'Super Admin',
    role: 'SUPER_ADMIN',
    permissions: ['*'], // All permissions
    isActive: true
});

/**
 * Admin authentication middleware
 */
exports.adminAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Admin access denied. No token provided.'
            });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(
            token,
            process.env.ADMIN_JWT_SECRET || 'admin-secret-key'
        );

        // Check if it's an admin token
        if (decoded.type !== 'admin') {
            return res.status(401).json({
                success: false,
                error: 'Invalid admin token'
            });
        }

        // Get admin from database (mock for now)
        const admin = adminUsers.get(decoded.email);

        if (!admin || !admin.isActive) {
            return res.status(401).json({
                success: false,
                error: 'Admin account not found or inactive'
            });
        }

        req.admin = admin;
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
 * Permission check middleware
 */
exports.checkPermission = (requiredPermission) => {
    return (req, res, next) => {
        const admin = req.admin;

        if (!admin) {
            return res.status(401).json({
                success: false,
                error: 'Not authenticated'
            });
        }

        // Super admin has all permissions
        if (admin.role === 'SUPER_ADMIN' || admin.permissions.includes('*')) {
            return next();
        }

        // Check specific permission
        if (!admin.permissions.includes(requiredPermission)) {
            return res.status(403).json({
                success: false,
                error: `Permission denied. Required: ${requiredPermission}`
            });
        }

        next();
    };
};

/**
 * Admin login
 */
exports.adminLogin = async (email, password) => {
    const bcrypt = require('bcryptjs');
    
    const admin = adminUsers.get(email);
    
    if (!admin) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    if (!admin.isActive) {
        throw new Error('Account is inactive');
    }

    // Generate admin JWT
    const token = jwt.sign(
        { 
            id: admin.id, 
            email: admin.email, 
            role: admin.role,
            type: 'admin'
        },
        process.env.ADMIN_JWT_SECRET || 'admin-secret-key',
        { expiresIn: '8h' }
    );

    return {
        token,
        admin: {
            id: admin.id,
            email: admin.email,
            fullName: admin.fullName,
            role: admin.role,
            permissions: admin.permissions
        }
    };
};

// Export admin store for registration
exports.adminUsers = adminUsers;
