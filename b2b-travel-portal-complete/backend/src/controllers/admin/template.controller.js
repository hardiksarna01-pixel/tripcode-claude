/**
 * Template Controller
 */

class TemplateController {
    async list(req, res) { res.json({ success: true, data: [] }); }
    async get(req, res) { res.json({ success: true, data: { id: req.params.id } }); }
    async update(req, res) { res.json({ success: true, message: 'Updated' }); }
    async preview(req, res) { res.json({ success: true, data: { html: '<html>Preview</html>' } }); }
    async test(req, res) { res.json({ success: true, message: 'Test sent' }); }
}

module.exports = new TemplateController();
