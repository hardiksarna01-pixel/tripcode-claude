/**
 * Settings Controller
 */

class SettingsController {
    async get(req, res) { res.json({ success: true, data: {} }); }
    async update(req, res) { res.json({ success: true, message: 'Settings updated' }); }
    async getEmailSettings(req, res) { res.json({ success: true, data: {} }); }
    async updateEmailSettings(req, res) { res.json({ success: true, message: 'Updated' }); }
    async getPaymentSettings(req, res) { res.json({ success: true, data: {} }); }
    async updatePaymentSettings(req, res) { res.json({ success: true, message: 'Updated' }); }
}

module.exports = new SettingsController();
