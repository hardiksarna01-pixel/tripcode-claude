/**
 * Group Controller
 */

class GroupController {
    async list(req, res) { res.json({ success: true, data: [] }); }
    async create(req, res) { res.status(201).json({ success: true, data: { id: Date.now() } }); }
    async get(req, res) { res.json({ success: true, data: { id: req.params.groupId } }); }
    async update(req, res) { res.json({ success: true, message: 'Updated' }); }
    async delete(req, res) { res.json({ success: true, message: 'Deleted' }); }
    async getAgents(req, res) { res.json({ success: true, data: [] }); }
    async updateMarkup(req, res) { res.json({ success: true, message: 'Markup updated' }); }
}

module.exports = new GroupController();
