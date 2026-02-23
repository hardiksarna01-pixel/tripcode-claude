/**
 * Agent Portal Routes
 * Routes for agent self-service portal
 */

const express = require('express');
const router = express.Router();
const agentPortalController = require('../controllers/agent-portal.controller');
const { authenticate, requireAgent } = require('../middleware/auth.middleware');

router.use(authenticate);
router.use(requireAgent);

// Dashboard
router.get('/dashboard', agentPortalController.getDashboard);

// Profile
router.get('/profile', agentPortalController.getProfile);
router.put('/profile', agentPortalController.updateProfile);
router.post('/profile/kyc', agentPortalController.submitKYC);
router.get('/profile/kyc/status', agentPortalController.getKYCStatus);

// Sub-agents (if allowed)
router.get('/sub-agents', agentPortalController.getSubAgents);
router.post('/sub-agents', agentPortalController.createSubAgent);
router.put('/sub-agents/:subAgentId', agentPortalController.updateSubAgent);

// Saved travelers
router.get('/travelers', agentPortalController.getSavedTravelers);
router.post('/travelers', agentPortalController.saveTraveler);
router.put('/travelers/:travelerId', agentPortalController.updateTraveler);
router.delete('/travelers/:travelerId', agentPortalController.deleteTraveler);

// Commission
router.get('/commission', agentPortalController.getCommissionDetails);
router.get('/commission/history', agentPortalController.getCommissionHistory);

// Markup settings
router.get('/markup', agentPortalController.getMarkupSettings);
router.put('/markup', agentPortalController.updateMarkupSettings);

// Reports
router.get('/reports/bookings', agentPortalController.getBookingReport);
router.get('/reports/sales', agentPortalController.getSalesReport);
router.get('/reports/commission', agentPortalController.getCommissionReport);

// Notifications
router.get('/notifications', agentPortalController.getNotifications);
router.put('/notifications/:notificationId/read', agentPortalController.markNotificationRead);
router.put('/notifications/read-all', agentPortalController.markAllNotificationsRead);

// Support
router.get('/support/tickets', agentPortalController.getSupportTickets);
router.post('/support/tickets', agentPortalController.createSupportTicket);
router.get('/support/tickets/:ticketId', agentPortalController.getTicketDetails);
router.post('/support/tickets/:ticketId/reply', agentPortalController.replyToTicket);

module.exports = router;
