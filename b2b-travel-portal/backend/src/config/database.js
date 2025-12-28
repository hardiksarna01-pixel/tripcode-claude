const { Pool } = require('pg');

/**
 * PostgreSQL Database Configuration
 * Handles connection pooling and query execution
 */
class Database {
    constructor() {
        this.pool = null;
    }

    /**
     * Initialize database connection pool
     */
    async connect() {
        if (this.pool) {
            return this.pool;
        }

        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });

        // Test connection
        try {
            const client = await this.pool.connect();
            console.log('✅ Database connected successfully');
            client.release();
        } catch (error) {
            console.error('❌ Database connection failed:', error.message);
            throw error;
        }

        // Handle pool errors
        this.pool.on('error', (err) => {
            console.error('Unexpected database error:', err);
        });

        return this.pool;
    }

    /**
     * Execute a query
     */
    async query(text, params) {
        const start = Date.now();
        try {
            const result = await this.pool.query(text, params);
            const duration = Date.now() - start;

            if (process.env.LOG_LEVEL === 'debug') {
                console.log('Query executed:', { text: text.substring(0, 100), duration, rows: result.rowCount });
            }

            return result;
        } catch (error) {
            console.error('Query error:', { text, error: error.message });
            throw error;
        }
    }

    /**
     * Get a client from the pool for transactions
     */
    async getClient() {
        const client = await this.pool.connect();
        const query = client.query;
        const release = client.release;

        // Set a timeout of 5 seconds for idle transactions
        const timeout = setTimeout(() => {
            console.error('A client has been checked out for more than 5 seconds!');
        }, 5000);

        client.release = () => {
            clearTimeout(timeout);
            client.query = query;
            client.release = release;
            return release.apply(client);
        };

        return client;
    }

    /**
     * Execute a transaction
     */
    async transaction(callback) {
        const client = await this.getClient();
        try {
            await client.query('BEGIN');
            const result = await callback(client);
            await client.query('COMMIT');
            return result;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Close the pool
     */
    async close() {
        if (this.pool) {
            await this.pool.end();
            this.pool = null;
            console.log('Database pool closed');
        }
    }
}

module.exports = new Database();
