const db = require('../config/database');

/**
 * Wallet Repository
 * Handles all wallet and transaction operations
 */
class WalletRepository {
    /**
     * Get wallet balance for agent
     */
    async getBalance(agentId) {
        const result = await db.query(
            `SELECT wallet_balance, credit_limit, outstanding_amount
             FROM agents WHERE id = $1`,
            [agentId]
        );

        if (!result.rows[0]) {
            return null;
        }

        const { wallet_balance, credit_limit, outstanding_amount } = result.rows[0];
        return {
            walletBalance: parseFloat(wallet_balance) || 0,
            creditLimit: parseFloat(credit_limit) || 0,
            outstandingAmount: parseFloat(outstanding_amount) || 0,
            effectiveBalance: (parseFloat(wallet_balance) || 0) + (parseFloat(credit_limit) || 0) - (parseFloat(outstanding_amount) || 0)
        };
    }

    /**
     * Credit wallet (add funds)
     */
    async credit(agentId, amount, details = {}) {
        return await db.transaction(async (client) => {
            // Get current balance
            const balanceResult = await client.query(
                'SELECT wallet_balance FROM agents WHERE id = $1 FOR UPDATE',
                [agentId]
            );

            if (!balanceResult.rows[0]) {
                throw new Error('Agent not found');
            }

            const currentBalance = parseFloat(balanceResult.rows[0].wallet_balance) || 0;
            const newBalance = currentBalance + amount;

            // Update balance
            await client.query(
                'UPDATE agents SET wallet_balance = $1, updated_at = NOW() WHERE id = $2',
                [newBalance, agentId]
            );

            // Record transaction
            const txnResult = await client.query(
                `INSERT INTO wallet_transactions (
                    agent_id, transaction_type, transaction_category,
                    amount, balance_before, balance_after,
                    reference_type, reference_id, booking_id,
                    description, remarks, created_by
                ) VALUES ($1, 'CREDIT', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING *`,
                [
                    agentId,
                    details.category || 'TOPUP',
                    amount,
                    currentBalance,
                    newBalance,
                    details.referenceType || null,
                    details.referenceId || null,
                    details.bookingId || null,
                    details.description || null,
                    details.remarks || null,
                    details.createdBy || null
                ]
            );

            return {
                transaction: txnResult.rows[0],
                newBalance
            };
        });
    }

    /**
     * Debit wallet (deduct funds)
     */
    async debit(agentId, amount, details = {}) {
        return await db.transaction(async (client) => {
            // Get current balance and credit limit
            const balanceResult = await client.query(
                'SELECT wallet_balance, credit_limit, outstanding_amount FROM agents WHERE id = $1 FOR UPDATE',
                [agentId]
            );

            if (!balanceResult.rows[0]) {
                throw new Error('Agent not found');
            }

            const { wallet_balance, credit_limit, outstanding_amount } = balanceResult.rows[0];
            const currentBalance = parseFloat(wallet_balance) || 0;
            const creditLimit = parseFloat(credit_limit) || 0;
            const outstanding = parseFloat(outstanding_amount) || 0;
            const effectiveBalance = currentBalance + creditLimit - outstanding;

            if (effectiveBalance < amount) {
                throw new Error('Insufficient balance');
            }

            let newBalance = currentBalance;
            let newOutstanding = outstanding;

            // Deduct from wallet first, then use credit
            if (currentBalance >= amount) {
                newBalance = currentBalance - amount;
            } else {
                newBalance = 0;
                newOutstanding = outstanding + (amount - currentBalance);
            }

            // Update balance
            await client.query(
                'UPDATE agents SET wallet_balance = $1, outstanding_amount = $2, updated_at = NOW() WHERE id = $3',
                [newBalance, newOutstanding, agentId]
            );

            // Record transaction
            const txnResult = await client.query(
                `INSERT INTO wallet_transactions (
                    agent_id, transaction_type, transaction_category,
                    amount, balance_before, balance_after,
                    reference_type, reference_id, booking_id,
                    description, remarks, created_by
                ) VALUES ($1, 'DEBIT', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING *`,
                [
                    agentId,
                    details.category || 'BOOKING',
                    amount,
                    currentBalance,
                    newBalance,
                    details.referenceType || null,
                    details.referenceId || null,
                    details.bookingId || null,
                    details.description || null,
                    details.remarks || null,
                    details.createdBy || null
                ]
            );

            return {
                transaction: txnResult.rows[0],
                newBalance,
                newOutstanding
            };
        });
    }

    /**
     * Refund to wallet
     */
    async refund(agentId, amount, details = {}) {
        return this.credit(agentId, amount, {
            ...details,
            category: 'CANCELLATION_REFUND'
        });
    }

    /**
     * Get transaction history
     */
    async getTransactions(agentId, filters = {}) {
        const {
            transactionType,
            category,
            fromDate,
            toDate,
            limit = 50,
            offset = 0
        } = filters;

        let query = 'SELECT * FROM wallet_transactions WHERE agent_id = $1';
        const params = [agentId];
        let paramIndex = 2;

        if (transactionType) {
            query += ` AND transaction_type = $${paramIndex++}`;
            params.push(transactionType);
        }

        if (category) {
            query += ` AND transaction_category = $${paramIndex++}`;
            params.push(category);
        }

        if (fromDate) {
            query += ` AND created_at >= $${paramIndex++}`;
            params.push(fromDate);
        }

        if (toDate) {
            query += ` AND created_at <= $${paramIndex++}`;
            params.push(toDate);
        }

        query += ` ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
        params.push(limit, offset);

        const result = await db.query(query, params);
        return result.rows;
    }

    /**
     * Get transaction by ID
     */
    async getTransaction(transactionId) {
        const result = await db.query(
            'SELECT * FROM wallet_transactions WHERE id = $1',
            [transactionId]
        );
        return result.rows[0] || null;
    }

    /**
     * Get wallet summary for a period
     */
    async getSummary(agentId, period = 'month') {
        let dateFilter = '';
        switch (period) {
            case 'today':
                dateFilter = "AND created_at >= CURRENT_DATE";
                break;
            case 'week':
                dateFilter = "AND created_at >= CURRENT_DATE - INTERVAL '7 days'";
                break;
            case 'month':
                dateFilter = "AND created_at >= CURRENT_DATE - INTERVAL '30 days'";
                break;
            case 'year':
                dateFilter = "AND created_at >= CURRENT_DATE - INTERVAL '1 year'";
                break;
        }

        const result = await db.query(
            `SELECT
                SUM(CASE WHEN transaction_type = 'CREDIT' THEN amount ELSE 0 END) as total_credits,
                SUM(CASE WHEN transaction_type = 'DEBIT' THEN amount ELSE 0 END) as total_debits,
                COUNT(*) FILTER (WHERE transaction_type = 'CREDIT') as credit_count,
                COUNT(*) FILTER (WHERE transaction_type = 'DEBIT') as debit_count
             FROM wallet_transactions
             WHERE agent_id = $1 ${dateFilter}`,
            [agentId]
        );

        return result.rows[0];
    }

    /**
     * Check if agent has sufficient balance
     */
    async hasSufficientBalance(agentId, amount) {
        const balance = await this.getBalance(agentId);
        return balance && balance.effectiveBalance >= amount;
    }
}

module.exports = new WalletRepository();
