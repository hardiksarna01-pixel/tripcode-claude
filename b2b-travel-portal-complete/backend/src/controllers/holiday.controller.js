/**
 * Holiday Package Controller
 */

class HolidayController {
    async search(req, res) {
        try {
            const { destination, duration, budget, travelMonth } = req.body;

            const packages = this.generateMockPackages(destination);

            res.json({
                success: true,
                data: {
                    packages,
                    totalResults: packages.length
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Search failed' });
        }
    }

    async getDestinations(req, res) {
        try {
            const destinations = [
                { id: 1, name: 'Goa', country: 'India', type: 'beach', image: '/dest/goa.jpg' },
                { id: 2, name: 'Kerala', country: 'India', type: 'backwaters', image: '/dest/kerala.jpg' },
                { id: 3, name: 'Rajasthan', country: 'India', type: 'heritage', image: '/dest/rajasthan.jpg' },
                { id: 4, name: 'Ladakh', country: 'India', type: 'adventure', image: '/dest/ladakh.jpg' },
                { id: 5, name: 'Andaman', country: 'India', type: 'island', image: '/dest/andaman.jpg' },
                { id: 6, name: 'Dubai', country: 'UAE', type: 'international', image: '/dest/dubai.jpg' },
                { id: 7, name: 'Thailand', country: 'Thailand', type: 'international', image: '/dest/thailand.jpg' },
                { id: 8, name: 'Maldives', country: 'Maldives', type: 'international', image: '/dest/maldives.jpg' }
            ];
            res.json({ success: true, data: destinations });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get destinations' });
        }
    }

    async getThemes(req, res) {
        try {
            const themes = [
                { id: 'beach', name: 'Beach Holidays', icon: 'beach' },
                { id: 'adventure', name: 'Adventure', icon: 'mountain' },
                { id: 'honeymoon', name: 'Honeymoon', icon: 'heart' },
                { id: 'family', name: 'Family Vacation', icon: 'family' },
                { id: 'heritage', name: 'Heritage & Culture', icon: 'temple' },
                { id: 'wildlife', name: 'Wildlife Safari', icon: 'tiger' }
            ];
            res.json({ success: true, data: themes });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get themes' });
        }
    }

    async getPackageDetails(req, res) {
        try {
            const { packageId } = req.params;
            res.json({
                success: true,
                data: {
                    id: packageId,
                    name: 'Goa Beach Getaway',
                    destination: 'Goa',
                    duration: '4N/5D',
                    price: { base: 15000, taxes: 2700, total: 17700 },
                    inclusions: ['Flights', '4-star Hotel', 'Breakfast', 'Sightseeing', 'Transfers'],
                    itinerary: [
                        { day: 1, title: 'Arrival & Beach Visit', description: 'Arrive in Goa, check-in, beach visit' },
                        { day: 2, title: 'North Goa Tour', description: 'Visit Calangute, Baga, Anjuna beaches' },
                        { day: 3, title: 'South Goa Tour', description: 'Visit Colva, Palolem beaches' },
                        { day: 4, title: 'Old Goa Heritage', description: 'Churches, spice plantation' },
                        { day: 5, title: 'Departure', description: 'Check-out and departure' }
                    ],
                    hotels: [{ name: 'Resort Rio', category: '4-star', location: 'Arpora' }],
                    images: ['/packages/goa1.jpg', '/packages/goa2.jpg']
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get package details' });
        }
    }

    async createInquiry(req, res) {
        try {
            const { packageId, travelers, travelDate, requirements, contactDetails } = req.body;
            res.status(201).json({
                success: true,
                message: 'Inquiry submitted successfully',
                data: {
                    inquiryId: `INQ${Date.now()}`,
                    status: 'pending',
                    message: 'Our travel expert will contact you shortly'
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to submit inquiry' });
        }
    }

    async createBooking(req, res) {
        try {
            const { packageId, travelers, travelDate, addons, paymentMethod } = req.body;
            res.status(201).json({
                success: true,
                message: 'Holiday package booked successfully',
                data: {
                    bookingId: `HBK${Date.now()}`,
                    status: 'confirmed'
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Booking failed' });
        }
    }

    async listPackages(req, res) {
        try {
            const packages = this.generateMockPackages('All');
            res.json({ success: true, data: { packages, totalResults: packages.length } });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to list packages' });
        }
    }

    async getItinerary(req, res) {
        try {
            const { packageId } = req.params;
            res.json({
                success: true,
                data: {
                    packageId,
                    days: [
                        { day: 1, title: 'Arrival', activities: ['Airport pickup', 'Hotel check-in', 'Welcome dinner'] },
                        { day: 2, title: 'Sightseeing', activities: ['Breakfast', 'City tour', 'Lunch', 'Beach visit'] },
                        { day: 3, title: 'Adventure', activities: ['Water sports', 'Island hopping'] },
                        { day: 4, title: 'Leisure', activities: ['Spa', 'Shopping', 'Sunset cruise'] },
                        { day: 5, title: 'Departure', activities: ['Breakfast', 'Airport drop'] }
                    ]
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get itinerary' });
        }
    }

    async getInquiryStatus(req, res) {
        try {
            const { inquiryId } = req.params;
            res.json({
                success: true,
                data: {
                    id: inquiryId,
                    status: 'processing',
                    assignedAgent: 'Travel Expert Team',
                    expectedResponse: '24 hours'
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get inquiry status' });
        }
    }

    async createCustomPackage(req, res) {
        try {
            const { destinations, duration, travelers, budget, preferences } = req.body;
            res.status(201).json({
                success: true,
                message: 'Custom package request submitted',
                data: {
                    packageId: `CPKG${Date.now()}`,
                    status: 'draft',
                    estimatedPrice: budget || 50000
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to create custom package' });
        }
    }

    async getCustomPackage(req, res) {
        try {
            const { packageId } = req.params;
            res.json({
                success: true,
                data: {
                    id: packageId,
                    status: 'ready',
                    destinations: ['Goa', 'Kerala'],
                    duration: '7N/8D',
                    price: 45000
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get custom package' });
        }
    }

    async confirmBooking(req, res) {
        try {
            const { bookingId } = req.params;
            res.json({
                success: true,
                message: 'Booking confirmed',
                data: { bookingId, status: 'confirmed', confirmationNumber: `HLD${Date.now().toString().slice(-8)}` }
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
                    status: 'confirmed',
                    package: 'Goa Beach Getaway',
                    travelDate: '2024-03-15',
                    travelers: 2,
                    totalAmount: 35400
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get booking details' });
        }
    }

    async cancelBooking(req, res) {
        try {
            const { bookingId } = req.params;
            res.json({
                success: true,
                message: 'Booking cancelled',
                data: { bookingId, refundAmount: 30000, status: 'cancelled' }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Cancellation failed' });
        }
    }

    generateMockPackages(destination) {
        const packages = [
            { name: 'Goa Beach Getaway', destination: 'Goa', duration: '4N/5D', price: 15000 },
            { name: 'Kerala Backwaters', destination: 'Kerala', duration: '5N/6D', price: 22000 },
            { name: 'Rajasthan Royal Tour', destination: 'Rajasthan', duration: '6N/7D', price: 28000 },
            { name: 'Ladakh Adventure', destination: 'Ladakh', duration: '7N/8D', price: 35000 }
        ];

        return packages.map((pkg, idx) => ({
            id: `PKG${Date.now()}${idx}`,
            ...pkg,
            image: `/packages/${pkg.destination.toLowerCase()}.jpg`,
            rating: 4.2 + (idx * 0.1),
            reviewCount: 50 + (idx * 25),
            inclusions: ['Flights', 'Hotel', 'Meals', 'Sightseeing', 'Transfers']
        }));
    }
}

module.exports = new HolidayController();
