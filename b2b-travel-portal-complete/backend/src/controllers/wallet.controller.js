const { Wallet, WalletTransaction, Agent } = require('../models');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

class WalletController {
    // Get wallet balance
    async getBalance(req, res) {
        try {
            const wallet = await Wallet.findOne({
                where: { agentId: req.user.agentId }
            });

            res.json({
                success: true,
                data: {
                    balance: wallet?.balance || 0,
                    creditLimit: wallet?.creditLimit || 0,
                    creditUsed: wallet?.creditUsed || 0,
                    availableCredit: (wallet?.creditLimit || 0) - (wallet?.creditUsed || 0)
                }
            });
        } catch (error) {
            console.error('Get balance error:', error);
            res.status(500).json({ success: false, message: 'Failed to get balance' });
        }
    }

    // Get transaction history
    async getTransactions(req, res) {
        try {
            const { page = 1, limit = 20, type, startDate, endDate } = req.query;
            const offset = (page - 1) * limit;

            const where = { agentId: req.user.agentId };
            if (type) where.type = type;
            if (startDate && endDate) {
                where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
            }

            const { count, rows } = await WalletTransaction.findAndCountAll({
                where,
                order: [['createdAt', 'DESC']],
                limit: parseInt(limit),
                offset
            });

            res.json({
                success: true,
                data: {
                    transactions: rows,
                    pagination: {
                        total: count,
                        page: parseInt(page),
                        totalPages: Math.ceil(count / limit)
                    }
                }
            });
        } catch (error) {
            console.error('Get transactions error:', error);
            res.status(500).json({ success: false, message: 'Failed to get transactions' });
        }
    }

    // Request recharge
    async requestRecharge(req, res) {
        try {
            const { amount, paymentMethod, reference } = req.body;

            const transaction = await WalletTransaction.create({
                id: uuidv4(),
                agentId: req.user.agentId,
                type: 'credit',
                amount,
                description: 'Wallet Recharge Request',
                paymentMethod,
                reference,
                status: 'pending'
            });

            res.status(201).json({
                success: true,
                message: 'Recharge request submitted',
                data: { transactionId: transaction.id }
            });
        } catch (error) {
            console.error('Request recharge error:', error);
            res.status(500).json({ success: false, message: 'Failed to request recharge' });
        }
    }

    // Approve recharge (admin)
    async approveRecharge(req, res) {
        try {
            const { transactionId } = req.params;

            const transaction = await WalletTransaction.findByPk(transactionId);
            if (!transaction) {
                return res.status(404).json({ success: false, message: 'Transaction not found' });
            }

            if (transaction.status !== 'pending') {
                return res.status(400).json({ success: false, message: 'Transaction already processed' });
            }

            // Update wallet balance
            await Wallet.increment('balance', {
                by: transaction.amount,
                where: { agentId: transaction.agentId }
            });

            // Update transaction status
            await transaction.update({ status: 'completed', processedAt: new Date() });

            res.json({ success: true, message: 'Recharge approved' });
        } catch (error) {
            console.error('Approve recharge error:', error);
            res.status(500).json({ success: false, message: 'Failed to approve recharge' });
        }
    }

    // Update credit limit (admin)
    async updateCreditLimit(req, res) {
        try {
            const { agentId } = req.params;
            const { creditLimit } = req.body;

            await Wallet.update({ creditLimit }, { where: { agentId } });

            res.json({ success: true, message: 'Credit limit updated' });
        } catch (error) {
            console.error('Update credit limit error:', error);
            res.status(500).json({ success: false, message: 'Failed to update credit limit' });
        }
    }

    // Get all wallets (admin)
    async getAllWallets(req, res) {
        try {
            const wallets = await Wallet.findAll({
                include: [{ model: Agent, as: 'agent', attributes: ['id', 'businessName'] }]
            });

            res.json({ success: true, data: wallets });
        } catch (error) {
            console.error('Get all wallets error:', error);
            res.status(500).json({ success: false, message: 'Failed to get wallets' });
        }
    }
}

module.exports = new WalletController();
