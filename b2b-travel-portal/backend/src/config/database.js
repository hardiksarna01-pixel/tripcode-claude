/**
 * In-Memory Database Mock
 * Replaces PostgreSQL with in-memory storage for development without database
 */

const bcrypt = require('bcryptjs');

class InMemoryDatabase {
    constructor() {
        this.tables = new Map();
        this.connected = false;
    }

    /**
     * Initialize database connection (mock)
     */
    async connect() {
        if (this.connected) {
            return this;
        }

        // Initialize default tables
        this.tables.set('admins', new Map());
        this.tables.set('agents', new Map());
        this.tables.set('bookings', new Map());
        this.tables.set('transactions', new Map());
        this.tables.set('airlines', new Map());
        this.tables.set('airports', new Map());
        this.tables.set('schemes', new Map());

        // Seed default users
        await this.seedDefaultUsers();

        this.connected = true;
        console.log('✅ In-memory database initialized successfully');
        return this;
    }

    /**
     * Seed default admin and agent users for demo
     */
    async seedDefaultUsers() {
        // Hash passwords
        const adminPasswordHash = await bcrypt.hash('admin123', 10);
        const agentPasswordHash = await bcrypt.hash('agent123', 10);

        // Seed admin user
        const admins = this.getTable('admins');
        admins.set('admin@flyshop.com', {
            id: '1',
            email: 'admin@flyshop.com',
            password: adminPasswordHash,
            username: 'superadmin',
            fullName: 'Admin User',
            role: 'SUPER_ADMIN',
            permissions: ['*'],
            isActive: true,
            createdAt: new Date()
        });

        // Seed demo agent user
        const agents = this.getTable('agents');
        agents.set('agent@flyshop.com', {
            id: '1001',
            email: 'agent@flyshop.com',
            password: agentPasswordHash,
            companyName: 'Demo Travel Agency',
            contactPerson: 'Demo Agent',
            mobile: '9876543210',
            role: 'AGENT',
            status: 'APPROVED',
            apiUserId: 'DEMO_API_USER',
            apiPasswordHash: 'DEMO_API_HASH',
            walletBalance: 50000,
            creditLimit: 100000,
            isActive: true,
            createdAt: new Date()
        });

        console.log('✅ Seeded default users:');
        console.log('   Admin: admin@flyshop.com / admin123');
        console.log('   Agent: agent@flyshop.com / agent123');
    }

    /**
     * Execute a query (mock implementation)
     * Returns empty results for SELECT, affected count for INSERT/UPDATE/DELETE
     */
    async query(text, params = []) {
        const start = Date.now();
        const duration = Date.now() - start;

        if (process.env.LOG_LEVEL === 'debug') {
            console.log('Query executed (mock):', { text: text.substring(0, 100), duration, rows: 0 });
        }

        // Return mock result structure
        return {
            rows: [],
            rowCount: 0,
            command: text.split(' ')[0].toUpperCase(),
            fields: []
        };
    }

    /**
     * Get a client from the pool for transactions (mock)
     */
    async getClient() {
        const self = this;
        return {
            query: async (text, params) => self.query(text, params),
            release: () => {},
        };
    }

    /**
     * Execute a transaction (mock)
     */
    async transaction(callback) {
        const client = await this.getClient();
        try {
            // No actual BEGIN needed for in-memory
            const result = await callback(client);
            // No actual COMMIT needed
            return result;
        } catch (error) {
            // No actual ROLLBACK needed
            throw error;
        }
    }

    /**
     * Close the pool (mock)
     */
    async close() {
        this.tables.clear();
        this.connected = false;
        console.log('In-memory database closed');
    }

    /**
     * Helper: Get a table
     */
    getTable(tableName) {
        if (!this.tables.has(tableName)) {
            this.tables.set(tableName, new Map());
        }
        return this.tables.get(tableName);
    }

    /**
     * Helper: Insert into table
     */
    insert(tableName, id, data) {
        const table = this.getTable(tableName);
        table.set(id, { ...data, id });
        return { id, ...data };
    }

    /**
     * Helper: Find by ID
     */
    findById(tableName, id) {
        const table = this.getTable(tableName);
        return table.get(id) || null;
    }

    /**
     * Helper: Find all
     */
    findAll(tableName) {
        const table = this.getTable(tableName);
        return Array.from(table.values());
    }

    /**
     * Helper: Update
     */
    update(tableName, id, data) {
        const table = this.getTable(tableName);
        const existing = table.get(id);
        if (existing) {
            const updated = { ...existing, ...data };
            table.set(id, updated);
            return updated;
        }
        return null;
    }

    /**
     * Helper: Delete
     */
    delete(tableName, id) {
        const table = this.getTable(tableName);
        return table.delete(id);
    }
}

module.exports = new InMemoryDatabase();
