const db = require('../config/database');
const bcrypt = require('bcryptjs');
const CryptoJS = require('crypto-js');

/**
 * Agent Repository
 * Handles all database operations for agents
 */
class AgentRepository {
    /**
     * Create a new agent
     */
    async create(agentData) {
        const {
            email,
            password,
            companyName,
            contactPerson,
            mobile,
            alternateMobile,
            address,
            city,
            state,
            pincode,
            panNumber,
            gstNumber,
            apiUserId,
            apiPassword,
            groupId,
            schemeId
        } = agentData;

        // Generate agent code
        const agentCode = await this.generateAgentCode();

        // Hash passwords
        const passwordHash = await bcrypt.hash(password, 10);
        const apiPasswordHash = apiPassword
            ? CryptoJS.SHA1(apiPassword).toString().toUpperCase()
            : null;

        const result = await db.query(
            `INSERT INTO agents (
                agent_code, email, password_hash, company_name, contact_person,
                mobile, alternate_mobile, address_line1, city, state, pincode,
                pan_number, gst_number, api_user_id, api_password_hash,
                group_id, scheme_id, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 'PENDING')
            RETURNING *`,
            [
                agentCode, email, passwordHash, companyName, contactPerson,
                mobile, alternateMobile, address, city, state, pincode,
                panNumber, gstNumber, apiUserId, apiPasswordHash,
                groupId, schemeId
            ]
        );

        return this.sanitizeAgent(result.rows[0]);
    }

    /**
     * Find agent by email
     */
    async findByEmail(email) {
        const result = await db.query(
            'SELECT * FROM agents WHERE email = $1',
            [email]
        );
        return result.rows[0] || null;
    }

    /**
     * Find agent by ID
     */
    async findById(id) {
        const result = await db.query(
            'SELECT * FROM agents WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    }

    /**
     * Find agent by agent code
     */
    async findByAgentCode(agentCode) {
        const result = await db.query(
            'SELECT * FROM agents WHERE agent_code = $1',
            [agentCode]
        );
        return result.rows[0] || null;
    }

    /**
     * Update agent
     */
    async update(id, updateData) {
        const allowedFields = [
            'company_name', 'contact_person', 'mobile', 'alternate_mobile',
            'address_line1', 'address_line2', 'city', 'state', 'pincode',
            'pan_number', 'gst_number', 'bank_name', 'bank_account_number',
            'bank_ifsc_code', 'group_id', 'scheme_id', 'credit_limit',
            'status', 'status_reason', 'kyc_verified', 'receive_whatsapp_notifications',
            'receive_email_notifications', 'receive_sms_notifications'
        ];

        const updates = [];
        const values = [];
        let paramIndex = 1;

        for (const [key, value] of Object.entries(updateData)) {
            const snakeKey = this.toSnakeCase(key);
            if (allowedFields.includes(snakeKey)) {
                updates.push(`${snakeKey} = $${paramIndex++}`);
                values.push(value);
            }
        }

        if (updates.length === 0) {
            return this.findById(id);
        }

        updates.push(`updated_at = NOW()`);
        values.push(id);

        const result = await db.query(
            `UPDATE agents SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
            values
        );

        return result.rows[0] || null;
    }

    /**
     * Update password
     */
    async updatePassword(id, newPassword) {
        const passwordHash = await bcrypt.hash(newPassword, 10);

        await db.query(
            'UPDATE agents SET password_hash = $1, updated_at = NOW() WHERE id = $2',
            [passwordHash, id]
        );
    }

    /**
     * Update wallet balance
     */
    async updateWalletBalance(id, amount, operation = 'add') {
        const operator = operation === 'add' ? '+' : '-';

        const result = await db.query(
            `UPDATE agents
             SET wallet_balance = wallet_balance ${operator} $1, updated_at = NOW()
             WHERE id = $2
             RETURNING wallet_balance`,
            [Math.abs(amount), id]
        );

        return result.rows[0]?.wallet_balance;
    }

    /**
     * Get wallet balance
     */
    async getWalletBalance(id) {
        const result = await db.query(
            'SELECT wallet_balance, credit_limit, outstanding_amount FROM agents WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    }

    /**
     * Update last login
     */
    async updateLastLogin(id, ipAddress) {
        await db.query(
            `UPDATE agents
             SET last_login_at = NOW(), last_login_ip = $1, failed_login_attempts = 0
             WHERE id = $2`,
            [ipAddress, id]
        );
    }

    /**
     * Increment failed login attempts
     */
    async incrementFailedAttempts(id) {
        const result = await db.query(
            `UPDATE agents
             SET failed_login_attempts = failed_login_attempts + 1
             WHERE id = $1
             RETURNING failed_login_attempts`,
            [id]
        );

        const attempts = result.rows[0]?.failed_login_attempts || 0;

        // Lock account after 5 failed attempts
        if (attempts >= 5) {
            await db.query(
                `UPDATE agents SET locked_until = NOW() + INTERVAL '30 minutes' WHERE id = $1`,
                [id]
            );
        }

        return attempts;
    }

    /**
     * Check if account is locked
     */
    async isAccountLocked(id) {
        const result = await db.query(
            'SELECT locked_until FROM agents WHERE id = $1',
            [id]
        );

        const lockedUntil = result.rows[0]?.locked_until;
        return lockedUntil && new Date(lockedUntil) > new Date();
    }

    /**
     * Verify password
     */
    async verifyPassword(agent, password) {
        return bcrypt.compare(password, agent.password_hash);
    }

    /**
     * List agents with pagination and filters
     */
    async list(filters = {}) {
        const {
            status,
            groupId,
            schemeId,
            search,
            limit = 20,
            offset = 0,
            sortBy = 'created_at',
            sortOrder = 'DESC'
        } = filters;

        let query = 'SELECT * FROM agents WHERE 1=1';
        const params = [];
        let paramIndex = 1;

        if (status) {
            query += ` AND status = $${paramIndex++}`;
            params.push(status);
        }

        if (groupId) {
            query += ` AND group_id = $${paramIndex++}`;
            params.push(groupId);
        }

        if (schemeId) {
            query += ` AND scheme_id = $${paramIndex++}`;
            params.push(schemeId);
        }

        if (search) {
            query += ` AND (email ILIKE $${paramIndex} OR company_name ILIKE $${paramIndex} OR agent_code ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        // Validate sort column to prevent SQL injection
        const validSortColumns = ['created_at', 'company_name', 'email', 'status', 'wallet_balance'];
        const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
        const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        query += ` ORDER BY ${sortColumn} ${order} LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
        params.push(limit, offset);

        const result = await db.query(query, params);
        return result.rows.map(agent => this.sanitizeAgent(agent));
    }

    /**
     * Count agents
     */
    async count(filters = {}) {
        const { status, groupId, schemeId, search } = filters;

        let query = 'SELECT COUNT(*) FROM agents WHERE 1=1';
        const params = [];
        let paramIndex = 1;

        if (status) {
            query += ` AND status = $${paramIndex++}`;
            params.push(status);
        }

        if (groupId) {
            query += ` AND group_id = $${paramIndex++}`;
            params.push(groupId);
        }

        if (schemeId) {
            query += ` AND scheme_id = $${paramIndex++}`;
            params.push(schemeId);
        }

        if (search) {
            query += ` AND (email ILIKE $${paramIndex} OR company_name ILIKE $${paramIndex} OR agent_code ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
        }

        const result = await db.query(query, params);
        return parseInt(result.rows[0].count, 10);
    }

    /**
     * Generate unique agent code
     */
    async generateAgentCode() {
        const prefix = 'AGT';
        const result = await db.query(
            "SELECT agent_code FROM agents WHERE agent_code LIKE $1 ORDER BY agent_code DESC LIMIT 1",
            [`${prefix}%`]
        );

        if (result.rows.length === 0) {
            return `${prefix}10001`;
        }

        const lastCode = result.rows[0].agent_code;
        const lastNumber = parseInt(lastCode.replace(prefix, ''), 10);
        return `${prefix}${lastNumber + 1}`;
    }

    /**
     * Remove sensitive fields from agent object
     */
    sanitizeAgent(agent) {
        if (!agent) return null;

        const { password_hash, api_password_hash, ...sanitized } = agent;
        return sanitized;
    }

    /**
     * Convert camelCase to snake_case
     */
    toSnakeCase(str) {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    }
}

module.exports = new AgentRepository();
