/**
 * Airport/City Transfer Controller
 */

class TransferController {
    async search(req, res) {
        try {
            const { pickupLocation, dropLocation, date, time, passengers, vehicleType } = req.body;

            const transfers = this.generateMockTransfers();

            res.json({
                success: true,
                data: { transfers, totalResults: transfers.length }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Search failed' });
        }
    }

    async getVehicleTypes(req, res) {
        try {
            const vehicleTypes = [
                { id: 'sedan', name: 'Sedan', capacity: 4, luggage: 2 },
                { id: 'suv', name: 'SUV', capacity: 6, luggage: 4 },
                { id: 'van', name: 'Minivan', capacity: 8, luggage: 6 },
                { id: 'luxury', name: 'Luxury Sedan', capacity: 4, luggage: 2 },
                { id: 'bus', name: 'Mini Bus', capacity: 12, luggage: 12 }
            ];
            res.json({ success: true, data: vehicleTypes });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get vehicle types' });
        }
    }

    async getLocationSuggestions(req, res) {
        try {
            const { query, type } = req.query;
            const locations = [
                { id: 1, name: 'Mumbai Airport (BOM)', type: 'airport' },
                { id: 2, name: 'Delhi Airport (DEL)', type: 'airport' },
                { id: 3, name: 'Taj Mahal Palace, Mumbai', type: 'hotel' },
                { id: 4, name: 'The Oberoi, Delhi', type: 'hotel' },
                { id: 5, name: 'Gateway of India', type: 'landmark' }
            ];
            res.json({ success: true, data: locations });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get locations' });
        }
    }

    async getTransferDetails(req, res) {
        try {
            const { transferId } = req.params;
            res.json({
                success: true,
                data: {
                    id: transferId,
                    vehicleType: 'Sedan',
                    vehicleName: 'Toyota Etios',
                    capacity: 4,
                    luggage: 2,
                    price: 1500,
                    duration: '45 mins',
                    distance: '25 km',
                    inclusions: ['Meet & Greet', 'Flight Tracking', 'Toll Charges', 'AC Vehicle'],
                    cancellationPolicy: 'Free cancellation up to 4 hours before pickup'
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get transfer details' });
        }
    }

    async createBooking(req, res) {
        try {
            const { transferId, pickupDetails, passengerDetails, flightNumber, paymentMethod } = req.body;
            res.status(201).json({
                success: true,
                message: 'Transfer booked successfully',
                data: {
                    bookingId: `TRF${Date.now()}`,
                    confirmationCode: `TRNS${Date.now().toString().slice(-6)}`,
                    status: 'confirmed',
                    driverDetails: {
                        name: 'To be assigned',
                        phone: 'To be shared 2 hours before pickup'
                    }
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Booking failed' });
        }
    }

    async getBooking(req, res) {
        try {
            const { bookingId } = req.params;
            res.json({
                success: true,
                data: {
                    id: bookingId,
                    status: 'confirmed',
                    pickup: { location: 'Mumbai Airport', time: '10:00 AM' },
                    drop: { location: 'Taj Mahal Palace' },
                    vehicle: 'Toyota Etios',
                    driver: { name: 'Ramesh Kumar', phone: '+91-9876543210' }
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get booking' });
        }
    }

    async cancelBooking(req, res) {
        try {
            const { bookingId } = req.params;
            res.json({
                success: true,
                message: 'Booking cancelled',
                data: { bookingId, refundAmount: 1500, status: 'cancelled' }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Cancellation failed' });
        }
    }

    generateMockTransfers() {
        return [
            { id: '1', vehicleType: 'Sedan', vehicleName: 'Toyota Etios', capacity: 4, price: 1500, duration: '45 mins' },
            { id: '2', vehicleType: 'SUV', vehicleName: 'Toyota Innova', capacity: 6, price: 2200, duration: '45 mins' },
            { id: '3', vehicleType: 'Luxury', vehicleName: 'Mercedes E-Class', capacity: 4, price: 4500, duration: '45 mins' },
            { id: '4', vehicleType: 'Van', vehicleName: 'Tempo Traveller', capacity: 12, price: 3500, duration: '50 mins' }
        ].map((t, idx) => ({ ...t, id: `TRF${Date.now()}${idx}` }));
    }
}

module.exports = new TransferController();
