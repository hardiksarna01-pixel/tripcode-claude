/**
 * Report Controller
 */

class ReportController {
    async getBookings(req, res) { res.json({ success: true, data: [] }); }
    async getRevenue(req, res) { res.json({ success: true, data: [] }); }
    async getAgents(req, res) { res.json({ success: true, data: [] }); }
    async getCommissions(req, res) { res.json({ success: true, data: [] }); }
    async export(req, res) { res.json({ success: true, data: { downloadUrl: '/reports/export.xlsx' } }); }
}

module.exports = new ReportController();
