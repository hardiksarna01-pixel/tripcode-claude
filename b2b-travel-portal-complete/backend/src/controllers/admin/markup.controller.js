/**
 * Markup Controller
 */

class MarkupController {
    async list(req, res) { res.json({ success: true, data: [] }); }
    async create(req, res) { res.status(201).json({ success: true, data: { id: Date.now() } }); }
    async get(req, res) { res.json({ success: true, data: { id: req.params.markupId } }); }
    async update(req, res) { res.json({ success: true, message: 'Updated' }); }
    async delete(req, res) { res.json({ success: true, message: 'Deleted' }); }
    async calculate(req, res) { res.json({ success: true, data: { amount: 1000, markup: 100, total: 1100 } }); }
}

module.exports = new MarkupController();
