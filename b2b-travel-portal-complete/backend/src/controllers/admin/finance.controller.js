/**
 * Finance Controller
 */

class FinanceController {
    async getDashboard(req, res) { res.json({ success: true, data: { revenue: 5000000, expenses: 3500000 } }); }
    async getLedger(req, res) { res.json({ success: true, data: [] }); }
    async getInvoices(req, res) { res.json({ success: true, data: [] }); }
    async getTransactions(req, res) { res.json({ success: true, data: [] }); }
    async creditWallet(req, res) { res.json({ success: true, message: 'Wallet credited' }); }
    async debitWallet(req, res) { res.json({ success: true, message: 'Wallet debited' }); }
}

module.exports = new FinanceController();
