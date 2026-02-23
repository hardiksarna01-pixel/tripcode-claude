/**
 * Visa Services Controller
 */

class VisaController {
    async getCountries(req, res) {
        try {
            const countries = [
                { code: 'USA', name: 'United States', processingTime: '5-7 business days', fee: 16000 },
                { code: 'UK', name: 'United Kingdom', processingTime: '15 business days', fee: 12000 },
                { code: 'UAE', name: 'United Arab Emirates', processingTime: '3-4 business days', fee: 7500 },
                { code: 'SG', name: 'Singapore', processingTime: '3 business days', fee: 3500 },
                { code: 'TH', name: 'Thailand', processingTime: 'On arrival', fee: 2000 },
                { code: 'MY', name: 'Malaysia', processingTime: '5 business days', fee: 3000 },
                { code: 'AU', name: 'Australia', processingTime: '15-20 business days', fee: 14500 },
                { code: 'EU', name: 'Schengen', processingTime: '15 business days', fee: 8500 }
            ];
            res.json({ success: true, data: countries });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get countries' });
        }
    }

    async getVisaTypes(req, res) {
        try {
            const { country } = req.params;
            const types = [
                { id: 'tourist', name: 'Tourist Visa', validity: '90 days', entries: 'single' },
                { id: 'business', name: 'Business Visa', validity: '1 year', entries: 'multiple' },
                { id: 'transit', name: 'Transit Visa', validity: '72 hours', entries: 'single' }
            ];
            res.json({ success: true, data: types });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get visa types' });
        }
    }

    async getRequirements(req, res) {
        try {
            const { country, visaType } = req.params;
            res.json({
                success: true,
                data: {
                    documents: [
                        { id: 'passport', name: 'Valid Passport', description: 'At least 6 months validity' },
                        { id: 'photo', name: 'Passport Size Photos', description: '2 photos, white background' },
                        { id: 'itinerary', name: 'Travel Itinerary', description: 'Flight and hotel bookings' },
                        { id: 'bank', name: 'Bank Statements', description: 'Last 6 months' },
                        { id: 'cover', name: 'Cover Letter', description: 'Purpose of visit' }
                    ],
                    fee: 12000,
                    processingTime: '15 business days',
                    validity: '90 days'
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get requirements' });
        }
    }

    async createApplication(req, res) {
        try {
            const { country, visaType, applicants, travelDates, documents } = req.body;
            res.status(201).json({
                success: true,
                message: 'Application submitted successfully',
                data: {
                    applicationId: `VISA${Date.now()}`,
                    referenceNumber: `VIS${Date.now().toString().slice(-8)}`,
                    status: 'submitted',
                    estimatedCompletion: '15 business days'
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Application submission failed' });
        }
    }

    async getApplicationStatus(req, res) {
        try {
            const { applicationId } = req.params;
            res.json({
                success: true,
                data: {
                    id: applicationId,
                    status: 'processing',
                    country: 'United Kingdom',
                    visaType: 'Tourist',
                    submittedAt: '2024-03-01',
                    estimatedCompletion: '2024-03-16',
                    timeline: [
                        { date: '2024-03-01', status: 'submitted', description: 'Application received' },
                        { date: '2024-03-02', status: 'documents_verified', description: 'Documents verified' },
                        { date: '2024-03-05', status: 'processing', description: 'Under embassy review' }
                    ]
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get status' });
        }
    }

    async uploadDocument(req, res) {
        try {
            const { applicationId, documentType } = req.body;
            res.json({
                success: true,
                message: 'Document uploaded successfully',
                data: { documentId: `DOC${Date.now()}` }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Upload failed' });
        }
    }

    async scheduleAppointment(req, res) {
        try {
            const { applicationId, date, time, location } = req.body;
            res.json({
                success: true,
                message: 'Appointment scheduled',
                data: {
                    appointmentId: `APT${Date.now()}`,
                    date,
                    time,
                    location,
                    status: 'confirmed'
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Scheduling failed' });
        }
    }
}

module.exports = new VisaController();
