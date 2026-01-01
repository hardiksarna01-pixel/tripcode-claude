/**
 * Hotel Service
 * Handles hotel search, booking, and management
 */

const config = require('../config');

class HotelService {
    constructor() {
        this.suppliers = config.hotelSuppliers || {};
    }

    /**
     * Search hotels
     */
    async search(params) {
        const { city, checkIn, checkOut, rooms, guests } = params;

        const mockHotels = this.generateMockHotels(city);

        return {
            success: true,
            searchId: `HSRCH${Date.now()}`,
            hotels: mockHotels,
            filters: {
                starRating: [3, 4, 5],
                priceRange: { min: 2000, max: 50000 },
                amenities: ['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Parking']
            }
        };
    }

    /**
     * Get hotel details
     */
    async getHotelDetails(hotelId) {
        return {
            success: true,
            hotel: {
                id: hotelId,
                name: 'Grand Hyatt',
                rating: 5,
                address: '123 Main Street, Mumbai, Maharashtra 400001',
                description: 'Luxurious 5-star hotel with world-class amenities',
                images: ['/hotels/hotel1.jpg', '/hotels/hotel2.jpg'],
                amenities: ['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Parking', 'Business Center'],
                rooms: this.generateMockRooms(),
                reviews: {
                    average: 4.5,
                    count: 245
                },
                policies: {
                    checkIn: '14:00',
                    checkOut: '12:00',
                    cancellation: 'Free cancellation up to 24 hours before check-in'
                }
            }
        };
    }

    /**
     * Get room availability
     */
    async getRoomAvailability(hotelId, checkIn, checkOut, rooms) {
        return {
            success: true,
            rooms: this.generateMockRooms(),
            available: true
        };
    }

    /**
     * Book a hotel room
     */
    async book(bookingData) {
        const { hotelId, roomId, checkIn, checkOut, guests, paymentInfo } = bookingData;

        const bookingRef = `HBK${Date.now()}`;
        const confirmationNumber = this.generateConfirmationNumber();

        return {
            success: true,
            booking: {
                id: bookingRef,
                confirmationNumber,
                status: 'confirmed',
                hotelId,
                roomId,
                checkIn,
                checkOut,
                guests,
                totalAmount: bookingData.amount || 12000,
                createdAt: new Date().toISOString()
            }
        };
    }

    /**
     * Cancel booking
     */
    async cancel(bookingId) {
        return {
            success: true,
            refundAmount: 10000,
            cancellationFee: 2000,
            status: 'cancelled'
        };
    }

    /**
     * Get booking details
     */
    async getBooking(bookingId) {
        return {
            success: true,
            booking: {
                id: bookingId,
                status: 'confirmed',
                confirmationNumber: 'HTL123456',
                hotelDetails: {
                    name: 'Grand Hyatt',
                    address: '123 Main Street, Mumbai'
                },
                checkIn: '2024-03-15',
                checkOut: '2024-03-18'
            }
        };
    }

    /**
     * Generate mock hotels
     */
    generateMockHotels(city) {
        const hotelNames = [
            'Grand Hyatt', 'Taj Palace', 'The Oberoi', 'ITC Maurya',
            'JW Marriott', 'The Leela', 'Radisson Blu', 'Holiday Inn'
        ];

        return hotelNames.map((name, idx) => ({
            id: `HTL${Date.now()}${idx}`,
            name: name,
            rating: 3 + (idx % 3),
            address: `${100 + idx} Main Road, ${city}`,
            image: `/hotels/hotel${(idx % 4) + 1}.jpg`,
            price: {
                base: 4000 + (idx * 1000),
                taxes: 720 + (idx * 100),
                total: 4720 + (idx * 1100)
            },
            amenities: ['WiFi', 'AC', 'TV', 'Room Service'],
            reviewScore: 4.0 + (idx * 0.1),
            reviewCount: 100 + (idx * 25),
            freeCancellation: idx % 2 === 0,
            breakfast: idx % 3 === 0
        }));
    }

    /**
     * Generate mock rooms
     */
    generateMockRooms() {
        const roomTypes = [
            { name: 'Deluxe Room', size: '30 sqm', maxGuests: 2 },
            { name: 'Premium Room', size: '40 sqm', maxGuests: 3 },
            { name: 'Suite', size: '60 sqm', maxGuests: 4 },
            { name: 'Presidential Suite', size: '100 sqm', maxGuests: 4 }
        ];

        return roomTypes.map((room, idx) => ({
            id: `RM${Date.now()}${idx}`,
            ...room,
            bedType: idx % 2 === 0 ? 'King' : 'Twin',
            amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Safe'],
            price: {
                base: 5000 + (idx * 3000),
                taxes: 900 + (idx * 500),
                total: 5900 + (idx * 3500)
            },
            available: 5 - idx,
            images: [`/rooms/room${idx + 1}.jpg`]
        }));
    }

    /**
     * Generate confirmation number
     */
    generateConfirmationNumber() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let num = 'HTL';
        for (let i = 0; i < 6; i++) {
            num += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return num;
    }
}

module.exports = new HotelService();
