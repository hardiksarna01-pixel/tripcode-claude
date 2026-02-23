/**
 * Public Controller - Public facing APIs
 */

class PublicController {
    async getHomeData(req, res) {
        try {
            res.json({
                success: true,
                data: {
                    featuredDestinations: [
                        { id: 1, name: 'Goa', image: '/destinations/goa.jpg', tagline: 'Beach Paradise' },
                        { id: 2, name: 'Kerala', image: '/destinations/kerala.jpg', tagline: 'God\'s Own Country' },
                        { id: 3, name: 'Rajasthan', image: '/destinations/rajasthan.jpg', tagline: 'Royal Heritage' },
                        { id: 4, name: 'Dubai', image: '/destinations/dubai.jpg', tagline: 'City of Gold' }
                    ],
                    popularFlights: [
                        { from: 'DEL', to: 'BOM', price: 4500 },
                        { from: 'DEL', to: 'BLR', price: 5200 },
                        { from: 'BOM', to: 'GOI', price: 3500 }
                    ],
                    offers: [
                        { id: 1, title: 'Flat 20% off on Flights', code: 'FLY20', validTill: '2024-03-31' },
                        { id: 2, title: 'Free Cancellation on Hotels', code: 'FREECANCEL', validTill: '2024-04-15' }
                    ]
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get home data' });
        }
    }

    async getOffers(req, res) {
        try {
            const offers = [
                { id: 1, title: 'Flat 20% off on Flights', code: 'FLY20', discount: '20%', validTill: '2024-03-31', type: 'flight' },
                { id: 2, title: 'Free Cancellation on Hotels', code: 'FREECANCEL', discount: 'Free Cancel', validTill: '2024-04-15', type: 'hotel' },
                { id: 3, title: 'Rs 500 off on Bus Bookings', code: 'BUS500', discount: '₹500', validTill: '2024-03-25', type: 'bus' }
            ];
            res.json({ success: true, data: offers });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get offers' });
        }
    }

    async validateCoupon(req, res) {
        try {
            const { code, bookingType, amount } = req.body;
            const coupons = {
                'FLY20': { discount: 20, type: 'percentage', maxDiscount: 2000 },
                'BUS500': { discount: 500, type: 'flat' },
                'HOTEL15': { discount: 15, type: 'percentage', maxDiscount: 1500 }
            };

            const coupon = coupons[code.toUpperCase()];
            if (!coupon) {
                return res.status(400).json({ success: false, message: 'Invalid coupon code' });
            }

            const discountAmount = coupon.type === 'percentage'
                ? Math.min(amount * coupon.discount / 100, coupon.maxDiscount || Infinity)
                : coupon.discount;

            res.json({
                success: true,
                data: {
                    code,
                    valid: true,
                    discountAmount,
                    finalAmount: amount - discountAmount
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to validate coupon' });
        }
    }

    async getBlog(req, res) {
        try {
            const blogs = [
                { id: 1, title: 'Top 10 Beaches in Goa', slug: 'top-10-beaches-goa', excerpt: 'Discover the best beaches...' },
                { id: 2, title: 'Kerala Travel Guide', slug: 'kerala-travel-guide', excerpt: 'Everything you need to know...' }
            ];
            res.json({ success: true, data: blogs });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get blogs' });
        }
    }

    async getTestimonials(req, res) {
        try {
            const testimonials = [
                { id: 1, name: 'Rahul S.', rating: 5, text: 'Amazing service! Booked my Goa trip hassle-free.' },
                { id: 2, name: 'Priya M.', rating: 5, text: 'Best prices and excellent customer support.' },
                { id: 3, name: 'Amit K.', rating: 4, text: 'Smooth booking experience. Highly recommended!' }
            ];
            res.json({ success: true, data: testimonials });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get testimonials' });
        }
    }

    async getContactInfo(req, res) {
        try {
            res.json({
                success: true,
                data: {
                    phone: '+91-1800-123-4567',
                    email: 'support@travelportal.com',
                    address: '123 Travel Street, Mumbai, Maharashtra 400001',
                    socialMedia: {
                        facebook: 'https://facebook.com/travelportal',
                        twitter: 'https://twitter.com/travelportal',
                        instagram: 'https://instagram.com/travelportal'
                    },
                    workingHours: '24/7 Support Available'
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get contact info' });
        }
    }

    async submitContactForm(req, res) {
        try {
            const { name, email, phone, subject, message } = req.body;
            res.json({
                success: true,
                message: 'Your message has been received. We will get back to you within 24 hours.',
                data: { ticketId: `TKT${Date.now()}` }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to submit form' });
        }
    }

    async subscribeNewsletter(req, res) {
        try {
            const { email } = req.body;
            res.json({
                success: true,
                message: 'Successfully subscribed to our newsletter!'
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Subscription failed' });
        }
    }
}

module.exports = new PublicController();
