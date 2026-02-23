/**
 * Travel Insurance Controller
 */

class InsuranceController {
    async search(req, res) {
        try {
            const { destination, startDate, endDate, travelers, tripType } = req.body;

            const plans = this.generateMockPlans(destination, travelers);

            res.json({
                success: true,
                data: { plans, totalResults: plans.length }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Search failed' });
        }
    }

    async getProviders(req, res) {
        try {
            const providers = [
                { id: 1, name: 'ICICI Lombard', logo: '/insurance/icici.png' },
                { id: 2, name: 'HDFC Ergo', logo: '/insurance/hdfc.png' },
                { id: 3, name: 'Bajaj Allianz', logo: '/insurance/bajaj.png' },
                { id: 4, name: 'Tata AIG', logo: '/insurance/tata.png' },
                { id: 5, name: 'Reliance General', logo: '/insurance/reliance.png' }
            ];
            res.json({ success: true, data: providers });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get providers' });
        }
    }

    async getPlanDetails(req, res) {
        try {
            const { planId } = req.params;
            res.json({
                success: true,
                data: {
                    id: planId,
                    name: 'Comprehensive Travel Shield',
                    provider: 'ICICI Lombard',
                    price: 1500,
                    coverage: {
                        medical: 500000,
                        baggage: 25000,
                        tripCancellation: 50000,
                        flightDelay: 5000,
                        personalAccident: 1000000
                    },
                    features: [
                        'Cashless hospitalization worldwide',
                        '24/7 emergency assistance',
                        'COVID-19 coverage included',
                        'Lost passport assistance'
                    ],
                    exclusions: [
                        'Pre-existing conditions',
                        'Adventure sports (without addon)',
                        'War and terrorism'
                    ]
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get plan details' });
        }
    }

    async calculatePremium(req, res) {
        try {
            const { planId, travelers, startDate, endDate, addons } = req.body;
            const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));

            res.json({
                success: true,
                data: {
                    basePremium: 1500 * travelers.length,
                    gst: 270 * travelers.length,
                    totalPremium: 1770 * travelers.length,
                    days,
                    travelers: travelers.length
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to calculate premium' });
        }
    }

    async createPolicy(req, res) {
        try {
            const { planId, travelers, startDate, endDate, nomineeDetails, paymentMethod } = req.body;
            res.status(201).json({
                success: true,
                message: 'Policy issued successfully',
                data: {
                    policyId: `POL${Date.now()}`,
                    policyNumber: `INS${Date.now().toString().slice(-8)}`,
                    status: 'active'
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Policy creation failed' });
        }
    }

    async getPolicy(req, res) {
        try {
            const { policyId } = req.params;
            res.json({
                success: true,
                data: {
                    id: policyId,
                    policyNumber: 'INS12345678',
                    status: 'active',
                    provider: 'ICICI Lombard',
                    plan: 'Comprehensive Travel Shield',
                    startDate: '2024-03-15',
                    endDate: '2024-03-22',
                    coverage: 500000
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get policy' });
        }
    }

    async fileClaim(req, res) {
        try {
            const { policyId, claimType, amount, description, documents } = req.body;
            res.status(201).json({
                success: true,
                message: 'Claim submitted successfully',
                data: {
                    claimId: `CLM${Date.now()}`,
                    status: 'submitted',
                    message: 'Your claim will be reviewed within 48 hours'
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Claim submission failed' });
        }
    }

    generateMockPlans(destination, travelers) {
        return [
            { name: 'Basic Cover', provider: 'ICICI Lombard', price: 800, coverage: 200000 },
            { name: 'Comprehensive Travel Shield', provider: 'ICICI Lombard', price: 1500, coverage: 500000 },
            { name: 'Premium Protection', provider: 'HDFC Ergo', price: 2200, coverage: 1000000 },
            { name: 'Family Shield', provider: 'Bajaj Allianz', price: 3000, coverage: 1500000 }
        ].map((plan, idx) => ({
            id: `PLN${Date.now()}${idx}`,
            ...plan,
            features: ['Medical', 'Baggage', 'Trip Cancellation', 'Flight Delay']
        }));
    }
}

module.exports = new InsuranceController();
