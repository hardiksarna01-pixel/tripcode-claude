/**
 * Tenant Controller
 */

class TenantController {
    async list(req, res) { res.json({ success: true, data: [] }); }
    async create(req, res) { res.status(201).json({ success: true, data: { id: Date.now() } }); }
    async get(req, res) { res.json({ success: true, data: { id: req.params.tenantId } }); }
    async update(req, res) { res.json({ success: true, message: 'Updated' }); }
    async delete(req, res) { res.json({ success: true, message: 'Deleted' }); }
    async getConfig(req, res) { res.json({ success: true, data: {} }); }
    async updateConfig(req, res) { res.json({ success: true, message: 'Config updated' }); }
}

module.exports = new TenantController();
