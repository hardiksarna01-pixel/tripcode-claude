const express = require('express');
const router = express.Router();
const { catchAsync } = require('../utils/catchAsync');
const { adminAuth, checkPermission } = require('../middleware/admin-auth.middleware');

// Apply admin auth to all routes
router.use(adminAuth);

// =====================================================
// GROUPS MANAGEMENT
// =====================================================

/**
 * @route   GET /api/v1/admin/groups
 * @desc    Get all groups
 */
router.get('/groups', checkPermission('groups.view'), catchAsync(async (req, res) => {
    const { search, status, page = 1, limit = 20 } = req.query;
    
    // In production, query database
    const groups = await groupService.findAll({ search, status, page, limit });
    
    res.json({
        success: true,
        data: groups
    });
}));

/**
 * @route   POST /api/v1/admin/groups
 * @desc    Create a new group
 */
router.post('/groups', checkPermission('groups.create'), catchAsync(async (req, res) => {
    const {
        groupName,
        groupCode,
        description,
        parentGroupId,
        defaultSchemeId,
        creditLimit,
        isActive
    } = req.body;
    
    const group = await groupService.create({
        groupName,
        groupCode,
        description,
        parentGroupId,
        defaultSchemeId,
        creditLimit,
        isActive,
        createdBy: req.admin.id
    });
    
    // Audit log
    await auditService.log({
        userType: 'ADMIN',
        userId: req.admin.id,
        action: 'CREATE',
        entityType: 'GROUP',
        entityId: group.id,
        newValues: group
    });
    
    res.status(201).json({
        success: true,
        message: 'Group created successfully',
        data: group
    });
}));

/**
 * @route   PUT /api/v1/admin/groups/:id
 * @desc    Update a group
 */
router.put('/groups/:id', checkPermission('groups.edit'), catchAsync(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    const group = await groupService.update(id, updates);
    
    res.json({
        success: true,
        message: 'Group updated successfully',
        data: group
    });
}));

/**
 * @route   GET /api/v1/admin/groups/:id/agents
 * @desc    Get all agents in a group
 */
router.get('/groups/:id/agents', checkPermission('groups.view'), catchAsync(async (req, res) => {
    const { id } = req.params;
    const agents = await agentService.findByGroup(id);
    
    res.json({
        success: true,
        data: agents
    });
}));

// =====================================================
// SCHEMES MANAGEMENT
// =====================================================

/**
 * @route   GET /api/v1/admin/schemes
 * @desc    Get all schemes
 */
router.get('/schemes', checkPermission('schemes.view'), catchAsync(async (req, res) => {
    const schemes = await schemeService.findAll();
    
    res.json({
        success: true,
        data: schemes
    });
}));

/**
 * @route   POST /api/v1/admin/schemes
 * @desc    Create a new scheme
 */
router.post('/schemes', checkPermission('schemes.create'), catchAsync(async (req, res) => {
    const {
        schemeName,
        schemeCode,
        description,
        
        // Domestic settings
        domesticServiceFeeType,
        domesticServiceFeeValue,
        domesticMarkupOnBase,
        domesticCommissionShare,
        
        // International settings
        intlServiceFeeType,
        intlServiceFeeValue,
        intlMarkupOnBase,
        intlCommissionShare,
        
        // Tax settings
        applyGst,
        gstRate,
        applyTds,
        tdsRate,
        
        // General settings
        allowCredit,
        maxCreditLimit,
        autoTicket,
        blockTicketAllowed,
        blockTicketDurationHours,
        
        // API configurations
        apiConfigs,
        
        // Airline-specific rules
        airlineRules
    } = req.body;
    
    const scheme = await schemeService.create({
        schemeName,
        schemeCode,
        description,
        domesticServiceFeeType,
        domesticServiceFeeValue,
        domesticMarkupOnBase,
        domesticCommissionShare,
        intlServiceFeeType,
        intlServiceFeeValue,
        intlMarkupOnBase,
        intlCommissionShare,
        applyGst,
        gstRate,
        applyTds,
        tdsRate,
        allowCredit,
        maxCreditLimit,
        autoTicket,
        blockTicketAllowed,
        blockTicketDurationHours,
        createdBy: req.admin.id
    });
    
    // Add API configurations
    if (apiConfigs && apiConfigs.length > 0) {
        await schemeService.setApiConfigs(scheme.id, apiConfigs);
    }
    
    // Add airline rules
    if (airlineRules && airlineRules.length > 0) {
        await schemeService.setAirlineRules(scheme.id, airlineRules);
    }
    
    res.status(201).json({
        success: true,
        message: 'Scheme created successfully',
        data: scheme
    });
}));

/**
 * @route   PUT /api/v1/admin/schemes/:id
 * @desc    Update a scheme
 */
router.put('/schemes/:id', checkPermission('schemes.edit'), catchAsync(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    const scheme = await schemeService.update(id, updates);
    
    res.json({
        success: true,
        message: 'Scheme updated successfully',
        data: scheme
    });
}));

/**
 * @route   GET /api/v1/admin/schemes/:id/api-config
 * @desc    Get API configurations for a scheme
 */
router.get('/schemes/:id/api-config', checkPermission('schemes.view'), catchAsync(async (req, res) => {
    const { id } = req.params;
    const configs = await schemeService.getApiConfigs(id);
    
    res.json({
        success: true,
        data: configs
    });
}));

/**
 * @route   PUT /api/v1/admin/schemes/:id/api-config
 * @desc    Update API configurations for a scheme
 */
router.put('/schemes/:id/api-config', checkPermission('schemes.edit'), catchAsync(async (req, res) => {
    const { id } = req.params;
    const { configs } = req.body;
    
    await schemeService.setApiConfigs(id, configs);
    
    res.json({
        success: true,
        message: 'API configurations updated'
    });
}));

/**
 * @route   GET /api/v1/admin/schemes/:id/airline-rules
 * @desc    Get airline-specific rules for a scheme
 */
router.get('/schemes/:id/airline-rules', checkPermission('schemes.view'), catchAsync(async (req, res) => {
    const { id } = req.params;
    const rules = await schemeService.getAirlineRules(id);
    
    res.json({
        success: true,
        data: rules
    });
}));

// =====================================================
// API PROVIDERS MANAGEMENT
// =====================================================

/**
 * @route   GET /api/v1/admin/api-providers
 * @desc    Get all API providers
 */
router.get('/api-providers', checkPermission('apis.view'), catchAsync(async (req, res) => {
    const providers = await apiProviderService.findAll();
    
    res.json({
        success: true,
        data: providers
    });
}));

/**
 * @route   POST /api/v1/admin/api-providers
 * @desc    Create a new API provider
 */
router.post('/api-providers', checkPermission('apis.create'), catchAsync(async (req, res) => {
    const {
        providerName,
        providerCode,
        providerType,
        
        // Credentials
        apiBaseUrl,
        apiUserId,
        apiPassword,
        apiKey,
        
        // Contact (actual)
        contactName,
        contactEmail,
        contactPhone,
        supportEmail,
        supportPhone,
        
        // Masking
        maskContactDetails,
        maskedContactName,
        maskedContactEmail,
        maskedContactPhone,
        
        // Commission
        baseCommissionDomestic,
        baseCommissionIntl,
        
        // Settings
        isActive,
        isTestMode,
        searchTimeoutSeconds,
        bookingTimeoutSeconds
    } = req.body;
    
    const provider = await apiProviderService.create({
        providerName,
        providerCode,
        providerType,
        apiBaseUrl,
        apiUserId,
        apiPassword: encryptPassword(apiPassword), // Encrypt credentials
        apiKey: apiKey ? encryptPassword(apiKey) : null,
        contactName,
        contactEmail,
        contactPhone,
        supportEmail,
        supportPhone,
        maskContactDetails,
        maskedContactName,
        maskedContactEmail,
        maskedContactPhone,
        baseCommissionDomestic,
        baseCommissionIntl,
        isActive,
        isTestMode,
        searchTimeoutSeconds,
        bookingTimeoutSeconds
    });
    
    res.status(201).json({
        success: true,
        message: 'API Provider created successfully',
        data: provider
    });
}));

/**
 * @route   PUT /api/v1/admin/api-providers/:id
 * @desc    Update API provider
 */
router.put('/api-providers/:id', checkPermission('apis.edit'), catchAsync(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    // Encrypt password if provided
    if (updates.apiPassword) {
        updates.apiPassword = encryptPassword(updates.apiPassword);
    }
    
    const provider = await apiProviderService.update(id, updates);
    
    res.json({
        success: true,
        message: 'API Provider updated successfully',
        data: provider
    });
}));

/**
 * @route   GET /api/v1/admin/api-providers/:id/airlines
 * @desc    Get airlines configured for an API provider
 */
router.get('/api-providers/:id/airlines', checkPermission('apis.view'), catchAsync(async (req, res) => {
    const { id } = req.params;
    const airlines = await apiProviderService.getAirlines(id);
    
    res.json({
        success: true,
        data: airlines
    });
}));

/**
 * @route   PUT /api/v1/admin/api-providers/:id/airlines
 * @desc    Update airlines for an API provider
 */
router.put('/api-providers/:id/airlines', checkPermission('apis.edit'), catchAsync(async (req, res) => {
    const { id } = req.params;
    const { airlines } = req.body;
    
    await apiProviderService.setAirlines(id, airlines);
    
    res.json({
        success: true,
        message: 'Airlines updated successfully'
    });
}));

/**
 * @route   GET /api/v1/admin/api-providers/:id/fare-commissions
 * @desc    Get fare type commissions for an API provider
 */
router.get('/api-providers/:id/fare-commissions', checkPermission('apis.view'), catchAsync(async (req, res) => {
    const { id } = req.params;
    const commissions = await apiProviderService.getFareCommissions(id);
    
    res.json({
        success: true,
        data: commissions
    });
}));

// =====================================================
// AGENTS MANAGEMENT
// =====================================================

/**
 * @route   GET /api/v1/admin/agents
 * @desc    Get all agents with filters
 */
router.get('/agents', checkPermission('agents.view'), catchAsync(async (req, res) => {
    const { 
        search, 
        status, 
        groupId, 
        schemeId,
        page = 1, 
        limit = 20 
    } = req.query;
    
    const agents = await agentService.findAll({ 
        search, 
        status, 
        groupId, 
        schemeId, 
        page, 
        limit 
    });
    
    res.json({
        success: true,
        data: agents
    });
}));

/**
 * @route   GET /api/v1/admin/agents/:id
 * @desc    Get agent details
 */
router.get('/agents/:id', checkPermission('agents.view'), catchAsync(async (req, res) => {
    const { id } = req.params;
    const agent = await agentService.findById(id);
    
    if (!agent) {
        return res.status(404).json({
            success: false,
            error: 'Agent not found'
        });
    }
    
    res.json({
        success: true,
        data: agent
    });
}));

/**
 * @route   POST /api/v1/admin/agents
 * @desc    Create a new agent (admin-initiated)
 */
router.post('/agents', checkPermission('agents.create'), catchAsync(async (req, res) => {
    const agentData = req.body;
    
    // Generate agent code
    agentData.agentCode = await agentService.generateAgentCode();
    
    // Generate temporary password
    const tempPassword = generateTemporaryPassword();
    agentData.passwordHash = await hashPassword(tempPassword);
    
    // Set status as approved since admin is creating
    agentData.status = 'APPROVED';
    agentData.approvedBy = req.admin.id;
    agentData.approvedAt = new Date();
    
    const agent = await agentService.create(agentData);
    
    // Send credentials via email/WhatsApp
    await notificationService.sendAgentCredentials(agent, tempPassword);
    
    res.status(201).json({
        success: true,
        message: 'Agent created successfully. Credentials sent via email/WhatsApp.',
        data: agent
    });
}));

/**
 * @route   PUT /api/v1/admin/agents/:id
 * @desc    Update agent details
 */
router.put('/agents/:id', checkPermission('agents.edit'), catchAsync(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    const oldAgent = await agentService.findById(id);
    const agent = await agentService.update(id, updates);
    
    // Log group/scheme changes
    if (updates.groupId !== oldAgent.groupId || updates.schemeId !== oldAgent.schemeId) {
        await agentService.logGroupChange({
            agentId: id,
            oldGroupId: oldAgent.groupId,
            newGroupId: updates.groupId,
            oldSchemeId: oldAgent.schemeId,
            newSchemeId: updates.schemeId,
            changedBy: req.admin.id
        });
    }
    
    res.json({
        success: true,
        message: 'Agent updated successfully',
        data: agent
    });
}));

/**
 * @route   PUT /api/v1/admin/agents/:id/status
 * @desc    Update agent status (approve, suspend, block)
 */
router.put('/agents/:id/status', checkPermission('agents.block'), catchAsync(async (req, res) => {
    const { id } = req.params;
    const { status, reason } = req.body;
    
    const agent = await agentService.updateStatus(id, {
        status,
        statusReason: reason,
        updatedBy: req.admin.id
    });
    
    // Send notification about status change
    await notificationService.sendStatusChangeNotification(agent, status, reason);
    
    res.json({
        success: true,
        message: `Agent ${status.toLowerCase()} successfully`,
        data: agent
    });
}));

/**
 * @route   PUT /api/v1/admin/agents/:id/assign-group
 * @desc    Assign agent to a group
 */
router.put('/agents/:id/assign-group', checkPermission('agents.edit'), catchAsync(async (req, res) => {
    const { id } = req.params;
    const { groupId, schemeId } = req.body;
    
    const agent = await agentService.assignToGroup(id, groupId, schemeId);
    
    res.json({
        success: true,
        message: 'Agent assigned to group successfully',
        data: agent
    });
}));

/**
 * @route   POST /api/v1/admin/agents/:id/reset-password
 * @desc    Reset agent password
 */
router.post('/agents/:id/reset-password', checkPermission('agents.edit'), catchAsync(async (req, res) => {
    const { id } = req.params;
    const { sendVia } = req.body; // email, whatsapp, both
    
    const tempPassword = generateTemporaryPassword();
    await agentService.resetPassword(id, tempPassword);
    
    const agent = await agentService.findById(id);
    
    // Send new password
    if (sendVia === 'email' || sendVia === 'both') {
        await notificationService.sendPasswordResetEmail(agent, tempPassword);
    }
    if (sendVia === 'whatsapp' || sendVia === 'both') {
        await notificationService.sendPasswordResetWhatsApp(agent, tempPassword);
    }
    
    res.json({
        success: true,
        message: `Password reset successfully. New credentials sent via ${sendVia}.`
    });
}));

// =====================================================
// AGENT SIGNUP REQUESTS
// =====================================================

/**
 * @route   GET /api/v1/admin/signup-requests
 * @desc    Get pending signup requests
 */
router.get('/signup-requests', checkPermission('agents.approve'), catchAsync(async (req, res) => {
    const { status = 'PENDING', page = 1, limit = 20 } = req.query;
    
    const requests = await signupRequestService.findAll({ status, page, limit });
    
    res.json({
        success: true,
        data: requests
    });
}));

/**
 * @route   GET /api/v1/admin/signup-requests/:id
 * @desc    Get signup request details
 */
router.get('/signup-requests/:id', checkPermission('agents.approve'), catchAsync(async (req, res) => {
    const { id } = req.params;
    const request = await signupRequestService.findById(id);
    
    res.json({
        success: true,
        data: request
    });
}));

/**
 * @route   PUT /api/v1/admin/signup-requests/:id/review
 * @desc    Mark request as under review
 */
router.put('/signup-requests/:id/review', checkPermission('agents.approve'), catchAsync(async (req, res) => {
    const { id } = req.params;
    
    const request = await signupRequestService.update(id, {
        status: 'UNDER_REVIEW',
        reviewedBy: req.admin.id,
        reviewedAt: new Date()
    });
    
    res.json({
        success: true,
        data: request
    });
}));

/**
 * @route   POST /api/v1/admin/signup-requests/:id/approve
 * @desc    Approve signup request and create agent
 */
router.post('/signup-requests/:id/approve', checkPermission('agents.approve'), catchAsync(async (req, res) => {
    const { id } = req.params;
    const { groupId, schemeId, creditLimit } = req.body;
    
    const request = await signupRequestService.findById(id);
    
    if (request.status !== 'PENDING' && request.status !== 'UNDER_REVIEW') {
        return res.status(400).json({
            success: false,
            error: 'Request already processed'
        });
    }
    
    // Generate agent code and password
    const agentCode = await agentService.generateAgentCode();
    const tempPassword = generateTemporaryPassword();
    
    // Create agent from signup request
    const agent = await agentService.create({
        agentCode,
        email: request.email,
        passwordHash: await hashPassword(tempPassword),
        companyName: request.companyName,
        contactPerson: request.contactPerson,
        mobile: request.mobile,
        whatsappNumber: request.whatsappNumber || request.mobile,
        address: request.address,
        city: request.city,
        state: request.state,
        pincode: request.pincode,
        panNumber: request.panNumber,
        panDocumentUrl: request.panDocumentUrl,
        gstNumber: request.gstNumber,
        gstDocumentUrl: request.gstDocumentUrl,
        aadhaarNumber: request.aadhaarNumber,
        aadhaarDocumentUrl: request.aadhaarDocumentUrl,
        groupId,
        schemeId,
        creditLimit: creditLimit || 0,
        status: 'APPROVED',
        kycVerified: true,
        kycVerifiedBy: req.admin.id,
        kycVerifiedAt: new Date(),
        approvedBy: req.admin.id,
        approvedAt: new Date()
    });
    
    // Update signup request
    await signupRequestService.update(id, {
        status: 'APPROVED',
        approvedBy: req.admin.id,
        approvedAt: new Date(),
        createdAgentId: agent.id
    });
    
    // Send welcome email/WhatsApp with credentials
    await notificationService.sendWelcomeMessage(agent, tempPassword);
    
    res.json({
        success: true,
        message: 'Signup approved. Agent created and credentials sent.',
        data: {
            agent,
            tempPassword // Remove in production, only for testing
        }
    });
}));

/**
 * @route   POST /api/v1/admin/signup-requests/:id/reject
 * @desc    Reject signup request
 */
router.post('/signup-requests/:id/reject', checkPermission('agents.approve'), catchAsync(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    
    const request = await signupRequestService.update(id, {
        status: 'REJECTED',
        statusReason: reason,
        reviewedBy: req.admin.id,
        reviewedAt: new Date()
    });
    
    // Send rejection notification
    await notificationService.sendRejectionNotification(request, reason);
    
    res.json({
        success: true,
        message: 'Signup request rejected',
        data: request
    });
}));

// =====================================================
// TAX CONFIGURATION
// =====================================================

/**
 * @route   GET /api/v1/admin/tax-config
 * @desc    Get tax configurations
 */
router.get('/tax-config', checkPermission('settings.view'), catchAsync(async (req, res) => {
    const configs = await taxConfigService.findAll();
    
    res.json({
        success: true,
        data: configs
    });
}));

/**
 * @route   POST /api/v1/admin/tax-config
 * @desc    Create tax configuration
 */
router.post('/tax-config', checkPermission('settings.edit'), catchAsync(async (req, res) => {
    const config = await taxConfigService.create(req.body);
    
    res.status(201).json({
        success: true,
        data: config
    });
}));

// =====================================================
// WALLET MANAGEMENT
// =====================================================

/**
 * @route   GET /api/v1/admin/agents/:id/wallet
 * @desc    Get agent wallet details
 */
router.get('/agents/:id/wallet', checkPermission('wallet.view'), catchAsync(async (req, res) => {
    const { id } = req.params;
    const wallet = await walletService.getAgentWallet(id);
    
    res.json({
        success: true,
        data: wallet
    });
}));

/**
 * @route   POST /api/v1/admin/agents/:id/wallet/credit
 * @desc    Credit agent wallet
 */
router.post('/agents/:id/wallet/credit', checkPermission('wallet.credit'), catchAsync(async (req, res) => {
    const { id } = req.params;
    const { amount, description, referenceType, referenceId } = req.body;
    
    const transaction = await walletService.credit({
        agentId: id,
        amount,
        description,
        referenceType,
        referenceId,
        createdBy: req.admin.id
    });
    
    res.json({
        success: true,
        message: 'Wallet credited successfully',
        data: transaction
    });
}));

/**
 * @route   POST /api/v1/admin/agents/:id/wallet/debit
 * @desc    Debit agent wallet (manual adjustment)
 */
router.post('/agents/:id/wallet/debit', checkPermission('wallet.debit'), catchAsync(async (req, res) => {
    const { id } = req.params;
    const { amount, description, referenceType, referenceId } = req.body;
    
    const transaction = await walletService.debit({
        agentId: id,
        amount,
        description,
        referenceType,
        referenceId,
        createdBy: req.admin.id
    });
    
    res.json({
        success: true,
        message: 'Wallet debited successfully',
        data: transaction
    });
}));

// =====================================================
// BOOKINGS
// =====================================================

/**
 * @route   GET /api/v1/admin/bookings
 * @desc    Get all bookings with filters
 */
router.get('/bookings', checkPermission('bookings.view'), catchAsync(async (req, res) => {
    const {
        agentId,
        groupId,
        status,
        fromDate,
        toDate,
        search, // PNR or booking ref
        page = 1,
        limit = 20
    } = req.query;
    
    const bookings = await bookingService.findAll({
        agentId,
        groupId,
        status,
        fromDate,
        toDate,
        search,
        page,
        limit
    });
    
    res.json({
        success: true,
        data: bookings
    });
}));

/**
 * @route   GET /api/v1/admin/bookings/:id
 * @desc    Get booking details
 */
router.get('/bookings/:id', checkPermission('bookings.view'), catchAsync(async (req, res) => {
    const { id } = req.params;
    const booking = await bookingService.findById(id);
    
    res.json({
        success: true,
        data: booking
    });
}));

// =====================================================
// DASHBOARD & REPORTS
// =====================================================

/**
 * @route   GET /api/v1/admin/dashboard
 * @desc    Get admin dashboard stats
 */
router.get('/dashboard', catchAsync(async (req, res) => {
    const stats = await reportService.getDashboardStats();
    
    res.json({
        success: true,
        data: stats
    });
}));

/**
 * @route   GET /api/v1/admin/reports/bookings
 * @desc    Get booking reports
 */
router.get('/reports/bookings', checkPermission('reports.view'), catchAsync(async (req, res) => {
    const { fromDate, toDate, groupBy } = req.query;
    const report = await reportService.getBookingReport({ fromDate, toDate, groupBy });
    
    res.json({
        success: true,
        data: report
    });
}));

/**
 * @route   GET /api/v1/admin/reports/revenue
 * @desc    Get revenue reports
 */
router.get('/reports/revenue', checkPermission('reports.view'), catchAsync(async (req, res) => {
    const { fromDate, toDate, groupBy } = req.query;
    const report = await reportService.getRevenueReport({ fromDate, toDate, groupBy });
    
    res.json({
        success: true,
        data: report
    });
}));

// Helper functions (implement these)
function encryptPassword(password) {
    // Use proper encryption in production
    return password;
}

function generateTemporaryPassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 10; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

async function hashPassword(password) {
    const bcrypt = require('bcryptjs');
    return await bcrypt.hash(password, 10);
}

// Mock services (implement with actual database queries)
const groupService = { findAll: async () => [], create: async (d) => d, update: async (i, d) => d };
const schemeService = { findAll: async () => [], create: async (d) => d, update: async (i, d) => d, getApiConfigs: async () => [], setApiConfigs: async () => {}, getAirlineRules: async () => [], setAirlineRules: async () => {} };
const apiProviderService = { findAll: async () => [], create: async (d) => d, update: async (i, d) => d, getAirlines: async () => [], setAirlines: async () => {}, getFareCommissions: async () => [] };
const agentService = { findAll: async () => [], findById: async () => null, findByGroup: async () => [], create: async (d) => d, update: async (i, d) => d, updateStatus: async () => {}, assignToGroup: async () => {}, generateAgentCode: async () => 'AGT' + Date.now(), resetPassword: async () => {}, logGroupChange: async () => {} };
const signupRequestService = { findAll: async () => [], findById: async () => null, update: async (i, d) => d };
const taxConfigService = { findAll: async () => [], create: async (d) => d };
const walletService = { getAgentWallet: async () => ({}), credit: async (d) => d, debit: async (d) => d };
const bookingService = { findAll: async () => [], findById: async () => null };
const reportService = { getDashboardStats: async () => ({}), getBookingReport: async () => ({}), getRevenueReport: async () => ({}) };
const notificationService = { sendAgentCredentials: async () => {}, sendStatusChangeNotification: async () => {}, sendPasswordResetEmail: async () => {}, sendPasswordResetWhatsApp: async () => {}, sendWelcomeMessage: async () => {}, sendRejectionNotification: async () => {} };
const auditService = { log: async () => {} };

module.exports = router;
