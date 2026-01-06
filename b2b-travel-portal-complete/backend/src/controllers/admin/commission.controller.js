/**
 * Commission Controller
 */

class CommissionController {
    async list(req, res) { res.json({ success: true, data: [] }); }
    async create(req, res) { res.status(201).json({ success: true, data: { id: Date.now() } }); }
    async get(req, res) { res.json({ success: true, data: { id: req.params.id } }); }
    async update(req, res) { res.json({ success: true, message: 'Updated' }); }
    async delete(req, res) { res.json({ success: true, message: 'Deleted' }); }
    async getPending(req, res) { res.json({ success: true, data: [] }); }
    async approve(req, res) { res.json({ success: true, message: 'Approved' }); }
    async payout(req, res) { res.json({ success: true, message: 'Payout processed' }); }
}

module.exports = new CommissionController();
