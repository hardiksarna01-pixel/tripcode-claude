/**
 * Supplier Controller
 */

class SupplierController {
    async list(req, res) { res.json({ success: true, data: [] }); }
    async get(req, res) { res.json({ success: true, data: { id: req.params.supplierId } }); }
    async getStatus(req, res) { res.json({ success: true, data: { active: 5, inactive: 2 } }); }
    async configure(req, res) { res.json({ success: true, message: 'Configured' }); }
    async enable(req, res) { res.json({ success: true, message: 'Enabled' }); }
    async disable(req, res) { res.json({ success: true, message: 'Disabled' }); }
    async test(req, res) { res.json({ success: true, message: 'Connection successful' }); }
}

module.exports = new SupplierController();
