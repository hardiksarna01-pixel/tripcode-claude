/**
 * Activity & Experiences Controller
 */

class ActivityController {
    async getDestinations(req, res) {
        try {
            const destinations = [
                { id: 1, name: 'Goa', country: 'India', activityCount: 45 },
                { id: 2, name: 'Jaipur', country: 'India', activityCount: 32 },
                { id: 3, name: 'Dubai', country: 'UAE', activityCount: 78 },
                { id: 4, name: 'Bangkok', country: 'Thailand', activityCount: 65 }
            ];
            res.json({ success: true, data: destinations });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get destinations' });
        }
    }

    async search(req, res) {
        try {
            const { destination, date, category } = req.body;

            const activities = this.generateMockActivities(destination);

            res.json({
                success: true,
                data: { activities, totalResults: activities.length }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Search failed' });
        }
    }

    async getCategories(req, res) {
        try {
            const categories = [
                { id: 'tours', name: 'Tours & Sightseeing', icon: 'tour' },
                { id: 'adventure', name: 'Adventure Activities', icon: 'adventure' },
                { id: 'water', name: 'Water Sports', icon: 'water' },
                { id: 'cultural', name: 'Cultural Experiences', icon: 'culture' },
                { id: 'food', name: 'Food & Dining', icon: 'food' },
                { id: 'nightlife', name: 'Nightlife', icon: 'night' }
            ];
            res.json({ success: true, data: categories });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get categories' });
        }
    }

    async getActivityDetails(req, res) {
        try {
            const { activityId } = req.params;
            res.json({
                success: true,
                data: {
                    id: activityId,
                    name: 'Scuba Diving Experience',
                    destination: 'Goa',
                    duration: '3 hours',
                    price: { adult: 3500, child: 2500 },
                    description: 'Experience the underwater world with certified instructors',
                    inclusions: ['Equipment', 'Instructor', 'Photos', 'Certificate'],
                    timing: ['09:00 AM', '02:00 PM'],
                    images: ['/activities/scuba1.jpg', '/activities/scuba2.jpg'],
                    rating: 4.6,
                    reviewCount: 234
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get activity details' });
        }
    }

    async checkAvailability(req, res) {
        try {
            const { activityId, date, participants } = req.body;
            res.json({
                success: true,
                data: {
                    available: true,
                    slots: ['09:00 AM', '02:00 PM'],
                    price: { adult: 3500, child: 2500 }
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to check availability' });
        }
    }

    async createBooking(req, res) {
        try {
            const { activityId, date, slot, participants, contactDetails, paymentMethod } = req.body;
            res.status(201).json({
                success: true,
                message: 'Activity booked successfully',
                data: {
                    bookingId: `ACT${Date.now()}`,
                    confirmationCode: `ACTV${Date.now().toString().slice(-6)}`,
                    status: 'confirmed'
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Booking failed' });
        }
    }

    async cancelBooking(req, res) {
        try {
            const { bookingId } = req.params;
            res.json({
                success: true,
                message: 'Booking cancelled',
                data: { bookingId, refundAmount: 3000, status: 'cancelled' }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Cancellation failed' });
        }
    }

    async confirmBooking(req, res) {
        try {
            const { bookingId } = req.params;
            res.json({
                success: true,
                message: 'Booking confirmed',
                data: { bookingId, status: 'confirmed', confirmationCode: `ACTV${Date.now().toString().slice(-6)}` }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to confirm booking' });
        }
    }

    async getBookingDetails(req, res) {
        try {
            const { bookingId } = req.params;
            res.json({
                success: true,
                data: {
                    id: bookingId,
                    activity: 'Scuba Diving Experience',
                    date: '2024-03-15',
                    slot: '09:00 AM',
                    participants: 2,
                    totalAmount: 7000,
                    status: 'confirmed'
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get booking details' });
        }
    }

    async getVoucher(req, res) {
        try {
            const { bookingId } = req.params;
            res.json({
                success: true,
                data: {
                    bookingId,
                    confirmationCode: 'ACTV123456',
                    activity: 'Scuba Diving Experience',
                    date: '2024-03-15',
                    slot: '09:00 AM',
                    venue: 'Grande Island, South Goa',
                    instructions: ['Arrive 30 minutes early', 'Bring valid ID', 'Wear comfortable clothes']
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get voucher' });
        }
    }

    generateMockActivities(destination) {
        return [
            { id: '1', name: 'Scuba Diving', category: 'water', duration: '3 hours', price: 3500, rating: 4.6 },
            { id: '2', name: 'Parasailing', category: 'water', duration: '30 mins', price: 1500, rating: 4.4 },
            { id: '3', name: 'City Walking Tour', category: 'tours', duration: '4 hours', price: 1200, rating: 4.5 },
            { id: '4', name: 'Food Trail', category: 'food', duration: '3 hours', price: 2000, rating: 4.7 }
        ].map((act, idx) => ({ ...act, id: `ACT${Date.now()}${idx}`, destination }));
    }
}

module.exports = new ActivityController();
