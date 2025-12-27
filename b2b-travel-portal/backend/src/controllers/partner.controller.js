/**
 * Partner/Reseller Controller
 * Manages partner program and reseller relationships
 */

// In-memory storage
const partners = new Map();
const partnerReferrals = new Map();
const commissionPayouts = new Map();

// Partner tiers with commission rates
const PARTNER_TIERS = {
    BRONZE: {
        name: 'Bronze',
        minReferrals: 0,
        commissionRate: 10, // 10% of subscription revenue
        benefits: ['Basic dashboard', 'Monthly payouts']
    },
    SILVER: {
        name: 'Silver',
        minReferrals: 5,
        commissionRate: 15,
        benefits: ['Priority support', 'Bi-weekly payouts', 'Co-branding options']
    },
    GOLD: {
        name: 'Gold',
        minReferrals: 20,
        commissionRate: 20,
        benefits: ['Dedicated account manager', 'Weekly payouts', 'Custom integrations', 'White-label discounts']
    },
    PLATINUM: {
        name: 'Platinum',
        minReferrals: 50,
        commissionRate: 25,
        benefits: ['Revenue share on API usage', 'Custom pricing', 'SLA guarantees', 'Direct support line']
    }
};

/**
 * Register as partner
 */
const registerPartner = async (req, res) => {
    try {
        const {
            companyName,
            contactName,
            email,
            phone,
            website,
            businessType,
            expectedReferrals,
            marketingChannels
        } = req.body;

        if (!companyName || !email || !contactName) {
            return res.status(400).json({ error: 'Company name, contact name, and email are required' });
        }

        const partnerId = `partner_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const referralCode = `REF_${companyName.substring(0, 3).toUpperCase()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

        const partner = {
            id: partnerId,
            companyName,
            contactName,
            email,
            phone,
            website,
            businessType,
            expectedReferrals,
            marketingChannels,
            referralCode,
            tier: 'BRONZE',
            status: 'pending_approval',
            stats: {
                totalReferrals: 0,
                activeReferrals: 0,
                totalCommission: 0,
                pendingCommission: 0,
                paidCommission: 0
            },
            payoutDetails: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        partners.set(partnerId, partner);

        res.status(201).json({
            message: 'Partner application submitted successfully',
            partner: {
                id: partnerId,
                referralCode,
                status: partner.status
            }
        });
    } catch (error) {
        console.error('Error registering partner:', error);
        res.status(500).json({ error: 'Failed to register partner' });
    }
};

/**
 * Get partner details
 */
const getPartner = async (req, res) => {
    try {
        const { partnerId } = req.params;
        const partner = partners.get(partnerId);

        if (!partner) {
            return res.status(404).json({ error: 'Partner not found' });
        }

        const tierInfo = PARTNER_TIERS[partner.tier];

        res.json({
            partner,
            tierInfo,
            nextTier: getNextTier(partner.tier, partner.stats.activeReferrals)
        });
    } catch (error) {
        console.error('Error fetching partner:', error);
        res.status(500).json({ error: 'Failed to fetch partner' });
    }
};

/**
 * Update partner details
 */
const updatePartner = async (req, res) => {
    try {
        const { partnerId } = req.params;
        const partner = partners.get(partnerId);

        if (!partner) {
            return res.status(404).json({ error: 'Partner not found' });
        }

        const allowedUpdates = ['contactName', 'phone', 'website', 'payoutDetails'];

        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                partner[field] = req.body[field];
            }
        });

        partner.updatedAt = new Date().toISOString();
        partners.set(partnerId, partner);

        res.json({ message: 'Partner updated successfully', partner });
    } catch (error) {
        console.error('Error updating partner:', error);
        res.status(500).json({ error: 'Failed to update partner' });
    }
};

/**
 * Get partner referrals
 */
const getReferrals = async (req, res) => {
    try {
        const { partnerId } = req.params;
        const { status } = req.query;

        const partner = partners.get(partnerId);
        if (!partner) {
            return res.status(404).json({ error: 'Partner not found' });
        }

        let referrals = Array.from(partnerReferrals.values())
            .filter(r => r.partnerId === partnerId);

        if (status) {
            referrals = referrals.filter(r => r.status === status);
        }

        res.json({
            referrals,
            summary: {
                total: referrals.length,
                active: referrals.filter(r => r.status === 'active').length,
                churned: referrals.filter(r => r.status === 'churned').length,
                pending: referrals.filter(r => r.status === 'pending').length
            }
        });
    } catch (error) {
        console.error('Error fetching referrals:', error);
        res.status(500).json({ error: 'Failed to fetch referrals' });
    }
};

/**
 * Track referral signup
 */
const trackReferral = async (req, res) => {
    try {
        const { referralCode, tenantId, plan, subscriptionAmount } = req.body;

        // Find partner by referral code
        let partner = null;
        partners.forEach(p => {
            if (p.referralCode === referralCode) {
                partner = p;
            }
        });

        if (!partner) {
            return res.status(404).json({ error: 'Invalid referral code' });
        }

        if (partner.status !== 'active') {
            return res.status(400).json({ error: 'Partner account is not active' });
        }

        const referralId = `ref_${Date.now()}`;
        const tierInfo = PARTNER_TIERS[partner.tier];
        const commission = Math.round(subscriptionAmount * (tierInfo.commissionRate / 100));

        const referral = {
            id: referralId,
            partnerId: partner.id,
            tenantId,
            plan,
            subscriptionAmount,
            commissionRate: tierInfo.commissionRate,
            commissionAmount: commission,
            status: 'pending', // Will become 'active' after first payment
            createdAt: new Date().toISOString()
        };

        partnerReferrals.set(referralId, referral);

        // Update partner stats
        partner.stats.totalReferrals++;
        partner.stats.pendingCommission += commission;
        partners.set(partner.id, partner);

        // Check for tier upgrade
        checkTierUpgrade(partner);

        res.status(201).json({
            message: 'Referral tracked successfully',
            referral
        });
    } catch (error) {
        console.error('Error tracking referral:', error);
        res.status(500).json({ error: 'Failed to track referral' });
    }
};

/**
 * Get commission summary
 */
const getCommissions = async (req, res) => {
    try {
        const { partnerId } = req.params;
        const { period = 'month' } = req.query;

        const partner = partners.get(partnerId);
        if (!partner) {
            return res.status(404).json({ error: 'Partner not found' });
        }

        const payouts = Array.from(commissionPayouts.values())
            .filter(p => p.partnerId === partnerId);

        const pendingReferrals = Array.from(partnerReferrals.values())
            .filter(r => r.partnerId === partnerId && r.status === 'active');

        const monthlyCommission = pendingReferrals.reduce((sum, r) => sum + r.commissionAmount, 0);

        res.json({
            summary: {
                currentTier: partner.tier,
                commissionRate: PARTNER_TIERS[partner.tier].commissionRate,
                totalEarned: partner.stats.totalCommission,
                pendingPayout: partner.stats.pendingCommission,
                paidOut: partner.stats.paidCommission,
                estimatedMonthly: monthlyCommission
            },
            recentPayouts: payouts.slice(-10),
            pendingCommissions: pendingReferrals.map(r => ({
                referralId: r.id,
                amount: r.commissionAmount,
                month: new Date(r.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })
            }))
        });
    } catch (error) {
        console.error('Error fetching commissions:', error);
        res.status(500).json({ error: 'Failed to fetch commissions' });
    }
};

/**
 * Request payout
 */
const requestPayout = async (req, res) => {
    try {
        const { partnerId } = req.params;

        const partner = partners.get(partnerId);
        if (!partner) {
            return res.status(404).json({ error: 'Partner not found' });
        }

        if (!partner.payoutDetails) {
            return res.status(400).json({ error: 'Please add payout details first' });
        }

        if (partner.stats.pendingCommission < 1000) {
            return res.status(400).json({ error: 'Minimum payout amount is ₹1,000' });
        }

        const payoutId = `payout_${Date.now()}`;
        const payout = {
            id: payoutId,
            partnerId,
            amount: partner.stats.pendingCommission,
            status: 'processing',
            payoutDetails: partner.payoutDetails,
            requestedAt: new Date().toISOString(),
            expectedBy: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        };

        commissionPayouts.set(payoutId, payout);

        // Update partner stats
        partner.stats.paidCommission += partner.stats.pendingCommission;
        partner.stats.pendingCommission = 0;
        partners.set(partnerId, partner);

        res.json({
            message: 'Payout request submitted',
            payout
        });
    } catch (error) {
        console.error('Error requesting payout:', error);
        res.status(500).json({ error: 'Failed to request payout' });
    }
};

/**
 * Get partner tiers info
 */
const getTiers = async (req, res) => {
    try {
        res.json({
            tiers: Object.entries(PARTNER_TIERS).map(([key, value]) => ({
                id: key,
                ...value
            }))
        });
    } catch (error) {
        console.error('Error fetching tiers:', error);
        res.status(500).json({ error: 'Failed to fetch tiers' });
    }
};

/**
 * List all partners (Admin)
 */
const listPartners = async (req, res) => {
    try {
        const { status, tier, search } = req.query;

        let results = Array.from(partners.values());

        if (status) {
            results = results.filter(p => p.status === status);
        }

        if (tier) {
            results = results.filter(p => p.tier === tier.toUpperCase());
        }

        if (search) {
            const searchLower = search.toLowerCase();
            results = results.filter(p =>
                p.companyName.toLowerCase().includes(searchLower) ||
                p.email.toLowerCase().includes(searchLower) ||
                p.referralCode.toLowerCase().includes(searchLower)
            );
        }

        res.json({
            total: results.length,
            partners: results.map(p => ({
                id: p.id,
                companyName: p.companyName,
                email: p.email,
                referralCode: p.referralCode,
                tier: p.tier,
                status: p.status,
                stats: p.stats,
                createdAt: p.createdAt
            }))
        });
    } catch (error) {
        console.error('Error listing partners:', error);
        res.status(500).json({ error: 'Failed to list partners' });
    }
};

/**
 * Approve partner (Admin)
 */
const approvePartner = async (req, res) => {
    try {
        const { partnerId } = req.params;

        const partner = partners.get(partnerId);
        if (!partner) {
            return res.status(404).json({ error: 'Partner not found' });
        }

        partner.status = 'active';
        partner.approvedAt = new Date().toISOString();
        partner.updatedAt = new Date().toISOString();
        partners.set(partnerId, partner);

        res.json({
            message: 'Partner approved successfully',
            partner
        });
    } catch (error) {
        console.error('Error approving partner:', error);
        res.status(500).json({ error: 'Failed to approve partner' });
    }
};

/**
 * Reject partner (Admin)
 */
const rejectPartner = async (req, res) => {
    try {
        const { partnerId } = req.params;
        const { reason } = req.body;

        const partner = partners.get(partnerId);
        if (!partner) {
            return res.status(404).json({ error: 'Partner not found' });
        }

        partner.status = 'rejected';
        partner.rejectedAt = new Date().toISOString();
        partner.rejectionReason = reason;
        partner.updatedAt = new Date().toISOString();
        partners.set(partnerId, partner);

        res.json({
            message: 'Partner rejected',
            partner
        });
    } catch (error) {
        console.error('Error rejecting partner:', error);
        res.status(500).json({ error: 'Failed to reject partner' });
    }
};

// Helper functions
const getNextTier = (currentTier, activeReferrals) => {
    const tiers = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];
    const currentIndex = tiers.indexOf(currentTier);

    if (currentIndex === tiers.length - 1) {
        return null; // Already at highest tier
    }

    const nextTier = tiers[currentIndex + 1];
    const nextTierInfo = PARTNER_TIERS[nextTier];

    return {
        tier: nextTier,
        name: nextTierInfo.name,
        referralsNeeded: nextTierInfo.minReferrals - activeReferrals,
        commissionRate: nextTierInfo.commissionRate,
        benefits: nextTierInfo.benefits
    };
};

const checkTierUpgrade = (partner) => {
    const activeReferrals = partner.stats.activeReferrals;
    const tiers = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];

    for (let i = tiers.length - 1; i >= 0; i--) {
        if (activeReferrals >= PARTNER_TIERS[tiers[i]].minReferrals) {
            if (partner.tier !== tiers[i]) {
                partner.tier = tiers[i];
                partner.tierUpgradedAt = new Date().toISOString();
            }
            break;
        }
    }

    partners.set(partner.id, partner);
};

module.exports = {
    registerPartner,
    getPartner,
    updatePartner,
    getReferrals,
    trackReferral,
    getCommissions,
    requestPayout,
    getTiers,
    listPartners,
    approvePartner,
    rejectPartner
};
