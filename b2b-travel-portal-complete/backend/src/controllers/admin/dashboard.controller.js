/**
 * Admin Dashboard Controller
 */

class DashboardController {
    async getOverview(req, res) {
        res.json({ success: true, data: { totalBookings: 1250, revenue: 5000000, activeAgents: 150 } });
    }
    async getStats(req, res) {
        res.json({ success: true, data: { daily: 50, weekly: 350, monthly: 1200 } });
    }
    async getCharts(req, res) {
        res.json({ success: true, data: { labels: ['Jan', 'Feb', 'Mar'], values: [100, 150, 200] } });
    }
    async getRecentActivity(req, res) {
        res.json({ success: true, data: [] });
    }
    async getAlerts(req, res) {
        res.json({ success: true, data: [] });
    }
}

module.exports = new DashboardController();
