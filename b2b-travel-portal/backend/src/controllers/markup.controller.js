/**
 * Markup Controller
 * Handles markup management operations
 */

const catchAsync = require('../utils/catchAsync');
const { validateMarkup, MARKUP_TYPES, MARKUP_APPLY_TO } = require('../config/markup');

// In-memory storage for demo (would be database in production)
let markups = new Map();
let markupIdCounter = 1;

/**
 * Get all markups for agent
 */
exports.getMarkups = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;
    const agentMarkups = Array.from(markups.values()).filter(m => m.agentId === agentId);

    res.json({
        success: true,
        data: agentMarkups
    });
});

/**
 * Create new markup
 */
exports.createMarkup = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;
    const markupData = req.body;

    const validation = validateMarkup(markupData);
    if (!validation.isValid) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: validation.errors
        });
    }

    const markup = {
        id: markupIdCounter++,
        agentId,
        name: markupData.name || 'Default Markup',
        type: markupData.type,
        amount: markupData.amount,
        applyTo: markupData.applyTo,
        airlineCode: markupData.airlineCode || null,
        origin: markupData.origin || null,
        destination: markupData.destination || null,
        cabinClass: markupData.cabinClass || null,
        perPassenger: markupData.perPassenger || false,
        isActive: markupData.isActive !== false,
        priority: markupData.priority || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    markups.set(markup.id, markup);

    res.status(201).json({
        success: true,
        data: markup
    });
});

/**
 * Update markup
 */
exports.updateMarkup = catchAsync(async (req, res) => {
    const { id } = req.params;
    const agentId = req.user.agentId;
    const updateData = req.body;

    const markup = markups.get(parseInt(id));

    if (!markup || markup.agentId !== agentId) {
        return res.status(404).json({
            success: false,
            error: 'Markup not found'
        });
    }

    const updatedMarkup = {
        ...markup,
        ...updateData,
        id: markup.id,
        agentId: markup.agentId,
        updatedAt: new Date().toISOString()
    };

    const validation = validateMarkup(updatedMarkup);
    if (!validation.isValid) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: validation.errors
        });
    }

    markups.set(markup.id, updatedMarkup);

    res.json({
        success: true,
        data: updatedMarkup
    });
});

/**
 * Delete markup
 */
exports.deleteMarkup = catchAsync(async (req, res) => {
    const { id } = req.params;
    const agentId = req.user.agentId;

    const markup = markups.get(parseInt(id));

    if (!markup || markup.agentId !== agentId) {
        return res.status(404).json({
            success: false,
            error: 'Markup not found'
        });
    }

    markups.delete(parseInt(id));

    res.json({
        success: true,
        message: 'Markup deleted successfully'
    });
});

/**
 * Toggle markup active status
 */
exports.toggleMarkup = catchAsync(async (req, res) => {
    const { id } = req.params;
    const agentId = req.user.agentId;

    const markup = markups.get(parseInt(id));

    if (!markup || markup.agentId !== agentId) {
        return res.status(404).json({
            success: false,
            error: 'Markup not found'
        });
    }

    markup.isActive = !markup.isActive;
    markup.updatedAt = new Date().toISOString();
    markups.set(markup.id, markup);

    res.json({
        success: true,
        data: markup
    });
});

/**
 * Get markup configuration options
 */
exports.getMarkupConfig = catchAsync(async (req, res) => {
    res.json({
        success: true,
        data: {
            types: Object.values(MARKUP_TYPES),
            applyToOptions: Object.values(MARKUP_APPLY_TO)
        }
    });
});
