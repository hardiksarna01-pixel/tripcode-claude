/**
 * API Key Controller
 * Manages API keys for API-as-a-Service functionality
 */

const { generateApiKey, generateTestApiKey, API_RATE_LIMITS } = require('../config/tenant');

// In-memory storage (replace with database in production)
const apiKeys = new Map();
const apiUsage = new Map();

/**
 * Generate new API keys for a tenant
 */
const generateKeys = async (req, res) => {
    try {
        const { tenantId } = req.body;

        if (!tenantId) {
            return res.status(400).json({ error: 'Tenant ID is required' });
        }

        const liveKey = generateApiKey();
        const testKey = generateTestApiKey();
        const createdAt = new Date().toISOString();

        const keyData = {
            tenantId,
            liveKey: {
                key: liveKey,
                status: 'active',
                createdAt,
                lastUsed: null
            },
            testKey: {
                key: testKey,
                status: 'active',
                createdAt,
                lastUsed: null
            }
        };

        apiKeys.set(liveKey, { tenantId, type: 'live', status: 'active', createdAt });
        apiKeys.set(testKey, { tenantId, type: 'test', status: 'active', createdAt });

        // Initialize usage tracking
        apiUsage.set(tenantId, {
            minute: { count: 0, resetAt: Date.now() + 60000 },
            hour: { count: 0, resetAt: Date.now() + 3600000 },
            day: { count: 0, resetAt: Date.now() + 86400000 },
            total: 0
        });

        res.status(201).json({
            message: 'API keys generated successfully',
            keys: {
                liveKey,
                testKey
            }
        });
    } catch (error) {
        console.error('Error generating API keys:', error);
        res.status(500).json({ error: 'Failed to generate API keys' });
    }
};

/**
 * Get API keys for a tenant
 */
const getKeys = async (req, res) => {
    try {
        const { tenantId } = req.params;

        const keys = [];
        apiKeys.forEach((value, key) => {
            if (value.tenantId === tenantId) {
                keys.push({
                    key: key.substring(0, 12) + '...' + key.substring(key.length - 4),
                    fullKey: key,
                    type: value.type,
                    status: value.status,
                    createdAt: value.createdAt,
                    lastUsed: value.lastUsed
                });
            }
        });

        res.json({ keys });
    } catch (error) {
        console.error('Error fetching API keys:', error);
        res.status(500).json({ error: 'Failed to fetch API keys' });
    }
};

/**
 * Rotate API key
 */
const rotateKey = async (req, res) => {
    try {
        const { tenantId, keyType } = req.body;

        if (!tenantId || !keyType) {
            return res.status(400).json({ error: 'Tenant ID and key type are required' });
        }

        // Find and deactivate old key
        let oldKey = null;
        apiKeys.forEach((value, key) => {
            if (value.tenantId === tenantId && value.type === keyType) {
                oldKey = key;
            }
        });

        if (oldKey) {
            const oldKeyData = apiKeys.get(oldKey);
            oldKeyData.status = 'rotated';
            oldKeyData.rotatedAt = new Date().toISOString();
            apiKeys.set(oldKey, oldKeyData);
        }

        // Generate new key
        const newKey = keyType === 'live' ? generateApiKey() : generateTestApiKey();
        apiKeys.set(newKey, {
            tenantId,
            type: keyType,
            status: 'active',
            createdAt: new Date().toISOString()
        });

        res.json({
            message: `${keyType} key rotated successfully`,
            newKey,
            oldKey: oldKey ? oldKey.substring(0, 12) + '...' : null
        });
    } catch (error) {
        console.error('Error rotating API key:', error);
        res.status(500).json({ error: 'Failed to rotate API key' });
    }
};

/**
 * Revoke API key
 */
const revokeKey = async (req, res) => {
    try {
        const { key } = req.body;

        if (!key) {
            return res.status(400).json({ error: 'API key is required' });
        }

        const keyData = apiKeys.get(key);
        if (!keyData) {
            return res.status(404).json({ error: 'API key not found' });
        }

        keyData.status = 'revoked';
        keyData.revokedAt = new Date().toISOString();
        apiKeys.set(key, keyData);

        res.json({ message: 'API key revoked successfully' });
    } catch (error) {
        console.error('Error revoking API key:', error);
        res.status(500).json({ error: 'Failed to revoke API key' });
    }
};

/**
 * Validate API key (used by middleware)
 */
const validateKey = (key) => {
    const keyData = apiKeys.get(key);
    if (!keyData) return { valid: false, error: 'Invalid API key' };
    if (keyData.status !== 'active') return { valid: false, error: 'API key is not active' };

    // Update last used
    keyData.lastUsed = new Date().toISOString();
    apiKeys.set(key, keyData);

    return { valid: true, tenantId: keyData.tenantId, type: keyData.type };
};

/**
 * Check rate limit
 */
const checkRateLimit = (tenantId, plan) => {
    const limits = API_RATE_LIMITS[plan.toLowerCase()] || API_RATE_LIMITS.professional;
    const usage = apiUsage.get(tenantId);

    if (!usage) {
        apiUsage.set(tenantId, {
            minute: { count: 1, resetAt: Date.now() + 60000 },
            hour: { count: 1, resetAt: Date.now() + 3600000 },
            day: { count: 1, resetAt: Date.now() + 86400000 },
            total: 1
        });
        return { allowed: true };
    }

    const now = Date.now();

    // Reset counters if needed
    if (now > usage.minute.resetAt) {
        usage.minute = { count: 0, resetAt: now + 60000 };
    }
    if (now > usage.hour.resetAt) {
        usage.hour = { count: 0, resetAt: now + 3600000 };
    }
    if (now > usage.day.resetAt) {
        usage.day = { count: 0, resetAt: now + 86400000 };
    }

    // Check limits
    if (limits.requestsPerMinute > 0 && usage.minute.count >= limits.requestsPerMinute) {
        return {
            allowed: false,
            error: 'Rate limit exceeded (per minute)',
            retryAfter: Math.ceil((usage.minute.resetAt - now) / 1000)
        };
    }
    if (limits.requestsPerHour > 0 && usage.hour.count >= limits.requestsPerHour) {
        return {
            allowed: false,
            error: 'Rate limit exceeded (per hour)',
            retryAfter: Math.ceil((usage.hour.resetAt - now) / 1000)
        };
    }
    if (limits.requestsPerDay > 0 && usage.day.count >= limits.requestsPerDay) {
        return {
            allowed: false,
            error: 'Rate limit exceeded (per day)',
            retryAfter: Math.ceil((usage.day.resetAt - now) / 1000)
        };
    }

    // Increment counters
    usage.minute.count++;
    usage.hour.count++;
    usage.day.count++;
    usage.total++;
    apiUsage.set(tenantId, usage);

    return {
        allowed: true,
        remaining: {
            minute: Math.max(0, limits.requestsPerMinute - usage.minute.count),
            hour: Math.max(0, limits.requestsPerHour - usage.hour.count),
            day: limits.requestsPerDay === -1 ? 'unlimited' : Math.max(0, limits.requestsPerDay - usage.day.count)
        }
    };
};

/**
 * Get API usage statistics
 */
const getUsageStats = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const { period = 'day' } = req.query;

        const usage = apiUsage.get(tenantId);
        if (!usage) {
            return res.json({
                total: 0,
                today: 0,
                thisHour: 0,
                thisMinute: 0,
                history: []
            });
        }

        res.json({
            total: usage.total,
            today: usage.day.count,
            thisHour: usage.hour.count,
            thisMinute: usage.minute.count,
            history: [] // Would be populated from time-series data in production
        });
    } catch (error) {
        console.error('Error fetching usage stats:', error);
        res.status(500).json({ error: 'Failed to fetch usage statistics' });
    }
};

/**
 * Get available API endpoints documentation
 */
const getEndpoints = async (req, res) => {
    try {
        const endpoints = [
            {
                category: 'Authentication',
                endpoints: [
                    { method: 'POST', path: '/api/v1/auth/token', description: 'Generate access token' }
                ]
            },
            {
                category: 'Flight Search',
                endpoints: [
                    { method: 'POST', path: '/api/v1/flights/search', description: 'Search for flights' },
                    { method: 'GET', path: '/api/v1/flights/fare-rules/:flightId', description: 'Get fare rules' },
                    { method: 'POST', path: '/api/v1/flights/fare-quote', description: 'Get real-time fare quote' }
                ]
            },
            {
                category: 'Booking',
                endpoints: [
                    { method: 'POST', path: '/api/v1/bookings/create', description: 'Create a booking' },
                    { method: 'GET', path: '/api/v1/bookings/:bookingId', description: 'Get booking details' },
                    { method: 'POST', path: '/api/v1/bookings/:bookingId/cancel', description: 'Cancel a booking' },
                    { method: 'GET', path: '/api/v1/bookings/:bookingId/ticket', description: 'Get e-ticket' }
                ]
            },
            {
                category: 'Ancillaries',
                endpoints: [
                    { method: 'GET', path: '/api/v1/ancillaries/seats/:flightId', description: 'Get seat map' },
                    { method: 'GET', path: '/api/v1/ancillaries/meals/:flightId', description: 'Get meal options' },
                    { method: 'GET', path: '/api/v1/ancillaries/baggage/:flightId', description: 'Get baggage options' }
                ]
            },
            {
                category: 'Utilities',
                endpoints: [
                    { method: 'GET', path: '/api/v1/airports', description: 'Search airports' },
                    { method: 'GET', path: '/api/v1/airlines', description: 'Get airline list' },
                    { method: 'GET', path: '/api/v1/currencies', description: 'Get currency rates' }
                ]
            }
        ];

        res.json({ endpoints });
    } catch (error) {
        console.error('Error fetching endpoints:', error);
        res.status(500).json({ error: 'Failed to fetch endpoints' });
    }
};

module.exports = {
    generateKeys,
    getKeys,
    rotateKey,
    revokeKey,
    validateKey,
    checkRateLimit,
    getUsageStats,
    getEndpoints
};
