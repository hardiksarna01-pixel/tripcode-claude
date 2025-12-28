/**
 * Partner Routes
 * Routes for partner/reseller management
 */

const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partner.controller');

// Get partner tiers info
router.get('/tiers', partnerController.getTiers);

// Register as partner
router.post('/register', partnerController.registerPartner);

// List all partners (Admin)
router.get('/', partnerController.listPartners);

// Track referral signup
router.post('/track-referral', partnerController.trackReferral);

// Get partner details
router.get('/:partnerId', partnerController.getPartner);

// Update partner
router.put('/:partnerId', partnerController.updatePartner);

// Get partner referrals
router.get('/:partnerId/referrals', partnerController.getReferrals);

// Get commissions
router.get('/:partnerId/commissions', partnerController.getCommissions);

// Request payout
router.post('/:partnerId/request-payout', partnerController.requestPayout);

// Approve partner (Admin)
router.post('/:partnerId/approve', partnerController.approvePartner);

// Reject partner (Admin)
router.post('/:partnerId/reject', partnerController.rejectPartner);

module.exports = router;
