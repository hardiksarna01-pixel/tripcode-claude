/**
 * Commission Routes
 * Airline and class-level commission management
 */

const express = require('express');
const router = express.Router();
const commissionController = require('../../controllers/commission.controller');
const { authenticateAdmin } = require('../../middleware/auth.middleware');
const { requirePermission } = require('../../middleware/permissions.middleware');

router.use(authenticateAdmin);

// ==================== AIRLINE COMMISSION MASTER ====================

// List airline commissions
router.get('/airlines',
    requirePermission('commission', 'read'),
    commissionController.listAirlineCommissions
);

// Create airline commission
router.post('/airlines',
    requirePermission('commission', 'create'),
    commissionController.createAirlineCommission
);

// Update airline commission
router.put('/airlines/:id',
    requirePermission('commission', 'update'),
    commissionController.updateAirlineCommission
);

// ==================== CLASS COMMISSION RULES ====================

// List class rules for airline
router.get('/airlines/:airlineCode/classes',
    requirePermission('commission', 'read'),
    commissionController.listClassRules
);

// Create class rule
router.post('/class-rules',
    requirePermission('commission', 'create'),
    commissionController.createClassRule
);

// Update class rule
router.put('/class-rules/:id',
    requirePermission('commission', 'update'),
    commissionController.updateClassRule
);

// Delete class rule
router.delete('/class-rules/:id',
    requirePermission('commission', 'delete'),
    commissionController.deleteClassRule
);

// ==================== ROUTE COMMISSION RULES ====================

// List route rules for airline
router.get('/airlines/:airlineCode/routes',
    requirePermission('commission', 'read'),
    commissionController.listRouteRules
);

// Create route rule
router.post('/route-rules',
    requirePermission('commission', 'create'),
    commissionController.createRouteRule
);

// ==================== SPECIAL DEALS ====================

// List special deals
router.get('/special-deals',
    requirePermission('commission', 'read'),
    commissionController.listSpecialDeals
);

// Create special deal
router.post('/special-deals',
    requirePermission('commission', 'create'),
    commissionController.createSpecialDeal
);

// ==================== AGENT OVERRIDES ====================

// List agent overrides
router.get('/agent-overrides/:agentId',
    requirePermission('commission', 'read'),
    commissionController.listAgentOverrides
);

// Create agent override
router.post('/agent-overrides',
    requirePermission('commission', 'create'),
    commissionController.createAgentOverride
);

// ==================== CALCULATOR & REPORTS ====================

// Calculate commission (preview)
router.post('/calculate',
    requirePermission('commission', 'read'),
    commissionController.calculateCommission
);

// Commission log
router.get('/log',
    requirePermission('commission', 'read'),
    commissionController.getCommissionLog
);

// Airline summary
router.get('/summary/airlines',
    requirePermission('commission', 'read'),
    commissionController.getAirlineSummary
);

module.exports = router;
