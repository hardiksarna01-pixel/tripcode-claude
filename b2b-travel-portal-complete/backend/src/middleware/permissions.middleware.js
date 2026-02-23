/**
 * Permissions Middleware
 * Role-based access control for admin operations
 */

const { ForbiddenError } = require('./error.middleware');

/**
 * Permission definitions for each role
 */
const rolePermissions = {
    super_admin: {
        // Full access to everything
        tenants: ['create', 'read', 'update', 'delete'],
        agents: ['create', 'read', 'update', 'delete', 'approve', 'suspend'],
        customers: ['read', 'update', 'delete'],
        groups: ['create', 'read', 'update', 'delete'],
        schemes: ['create', 'read', 'update', 'delete'],
        suppliers: ['create', 'read', 'update', 'delete', 'configure'],
        markup: ['create', 'read', 'update', 'delete'],
        bookings: ['read', 'update', 'cancel', 'refund'],
        wallet: ['read', 'credit', 'debit', 'adjust'],
        finance: ['read', 'create', 'update', 'approve', 'export'],
        reports: ['read', 'create', 'export', 'schedule'],
        settings: ['read', 'update'],
        whitelabel: ['read', 'update'],
        templates: ['create', 'read', 'update', 'delete'],
        apiKeys: ['create', 'read', 'update', 'delete'],
        audit: ['read', 'export'],
        dashboard: ['read']
    },

    admin: {
        // Tenant-level admin access
        agents: ['create', 'read', 'update', 'approve', 'suspend'],
        customers: ['read', 'update'],
        groups: ['create', 'read', 'update', 'delete'],
        schemes: ['create', 'read', 'update', 'delete'],
        suppliers: ['read', 'configure'],
        markup: ['create', 'read', 'update', 'delete'],
        bookings: ['read', 'update', 'cancel'],
        wallet: ['read', 'credit', 'adjust'],
        finance: ['read', 'create', 'export'],
        reports: ['read', 'create', 'export'],
        settings: ['read', 'update'],
        whitelabel: ['read', 'update'],
        templates: ['create', 'read', 'update', 'delete'],
        apiKeys: ['create', 'read', 'delete'],
        dashboard: ['read']
    },

    finance_manager: {
        agents: ['read'],
        bookings: ['read'],
        wallet: ['read', 'credit', 'adjust'],
        finance: ['read', 'create', 'update', 'approve', 'export'],
        reports: ['read', 'export'],
        dashboard: ['read']
    },

    operations_manager: {
        agents: ['read', 'update'],
        customers: ['read'],
        bookings: ['read', 'update', 'cancel', 'refund'],
        reports: ['read'],
        dashboard: ['read']
    },

    support: {
        agents: ['read'],
        customers: ['read'],
        bookings: ['read', 'update'],
        wallet: ['read'],
        dashboard: ['read']
    },

    viewer: {
        agents: ['read'],
        customers: ['read'],
        bookings: ['read'],
        reports: ['read'],
        dashboard: ['read']
    }
};

/**
 * Check if a role has a specific permission
 */
const hasPermission = (role, resource, action) => {
    const permissions = rolePermissions[role];
    if (!permissions) return false;

    const resourcePermissions = permissions[resource];
    if (!resourcePermissions) return false;

    return resourcePermissions.includes(action);
};

/**
 * Middleware to check resource permissions
 */
const requirePermission = (resource, action) => {
    return (req, res, next) => {
        const role = req.adminRole;

        if (!role) {
            throw new ForbiddenError('No role assigned');
        }

        if (!hasPermission(role, resource, action)) {
            throw new ForbiddenError(
                `Permission denied: ${action} on ${resource} requires higher privileges`
            );
        }

        next();
    };
};

/**
 * Middleware to check multiple permissions (any)
 */
const requireAnyPermission = (permissions) => {
    return (req, res, next) => {
        const role = req.adminRole;

        if (!role) {
            throw new ForbiddenError('No role assigned');
        }

        const hasAny = permissions.some(({ resource, action }) =>
            hasPermission(role, resource, action)
        );

        if (!hasAny) {
            throw new ForbiddenError('Permission denied');
        }

        next();
    };
};

/**
 * Middleware to check all permissions
 */
const requireAllPermissions = (permissions) => {
    return (req, res, next) => {
        const role = req.adminRole;

        if (!role) {
            throw new ForbiddenError('No role assigned');
        }

        const hasAll = permissions.every(({ resource, action }) =>
            hasPermission(role, resource, action)
        );

        if (!hasAll) {
            throw new ForbiddenError('Permission denied: Insufficient permissions');
        }

        next();
    };
};

/**
 * Middleware to check tenant access
 * Ensures admin can only access resources within their tenant
 */
const requireTenantAccess = (req, res, next) => {
    // Super admins can access any tenant
    if (req.adminRole === 'super_admin') {
        return next();
    }

    const resourceTenantId = req.params.tenantId || req.body.tenantId || req.query.tenantId;

    if (resourceTenantId && resourceTenantId !== req.tenantId) {
        throw new ForbiddenError('Access denied: Cross-tenant access not allowed');
    }

    next();
};

/**
 * Middleware to check self-access or admin access
 * Allows users to access their own resources or admins to access any
 */
const requireSelfOrAdmin = (userIdField = 'id') => {
    return (req, res, next) => {
        const targetUserId = req.params[userIdField];

        // If admin, allow access
        if (req.adminRole) {
            return next();
        }

        // If user accessing own resource
        if (req.userId && req.userId.toString() === targetUserId) {
            return next();
        }

        throw new ForbiddenError('Access denied');
    };
};

/**
 * Get all permissions for a role
 */
const getPermissionsForRole = (role) => {
    return rolePermissions[role] || {};
};

/**
 * Get all available roles
 */
const getAvailableRoles = () => {
    return Object.keys(rolePermissions);
};

module.exports = {
    rolePermissions,
    hasPermission,
    requirePermission,
    requireAnyPermission,
    requireAllPermissions,
    requireTenantAccess,
    requireSelfOrAdmin,
    getPermissionsForRole,
    getAvailableRoles
};
