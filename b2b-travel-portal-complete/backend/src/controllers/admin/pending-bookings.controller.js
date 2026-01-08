/**
 * Pending Bookings Controller
 * Manages bookings pending due to low supplier balance
 * Provides manual PNR update and supplier rebooking functionality
 */

class PendingBookingsController {
    constructor() {
        // Mock supplier balance data
        this.supplierBalances = {
            'amadeus': { balance: 250000, currency: 'INR', threshold: 50000, status: 'healthy' },
            'sabre': { balance: 15000, currency: 'INR', threshold: 50000, status: 'low' },
            'galileo': { balance: 180000, currency: 'INR', threshold: 50000, status: 'healthy' },
            'mystifly': { balance: 8500, currency: 'INR', threshold: 25000, status: 'critical' },
            'tripjack': { balance: 320000, currency: 'INR', threshold: 50000, status: 'healthy' },
            'hotelbeds': { balance: 45000, currency: 'INR', threshold: 30000, status: 'warning' },
            'booking_com': { balance: 125000, currency: 'INR', threshold: 40000, status: 'healthy' },
            'redbus': { balance: 75000, currency: 'INR', threshold: 20000, status: 'healthy' },
            'abhibus': { balance: 12000, currency: 'INR', threshold: 15000, status: 'low' }
        };

        // Mock pending bookings due to low supplier balance
        this.pendingBookings = [
            {
                id: 'PB001',
                bookingRef: 'BK-2024-78542',
                pnr: null,
                type: 'flight',
                status: 'pending_supplier',
                reason: 'Low supplier balance',
                originalSupplier: 'mystifly',
                supplierStatus: 'critical',
                requiredAmount: 12500,
                availableBalance: 8500,
                shortfall: 4000,
                customer: { name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '+91-9876543210' },
                tripDetails: {
                    from: 'DEL',
                    to: 'BOM',
                    date: '2024-01-20',
                    airline: 'Air India',
                    flightNo: 'AI-101',
                    passengers: 2,
                    class: 'Economy'
                },
                amount: 12500,
                agentId: 'AGT-001',
                agentName: 'Sunrise Travels',
                createdAt: '2024-01-15T10:30:00Z',
                alternativeSuppliers: [
                    { id: 'amadeus', name: 'Amadeus', price: 12800, available: true },
                    { id: 'sabre', name: 'Sabre', price: 12650, available: false },
                    { id: 'tripjack', name: 'TripJack', price: 12400, available: true }
                ]
            },
            {
                id: 'PB002',
                bookingRef: 'BK-2024-78543',
                pnr: null,
                type: 'flight',
                status: 'pending_supplier',
                reason: 'Low supplier balance',
                originalSupplier: 'sabre',
                supplierStatus: 'low',
                requiredAmount: 45000,
                availableBalance: 15000,
                shortfall: 30000,
                customer: { name: 'Priya Sharma', email: 'priya@example.com', phone: '+91-8765432109' },
                tripDetails: {
                    from: 'BLR',
                    to: 'DXB',
                    date: '2024-01-22',
                    airline: 'Emirates',
                    flightNo: 'EK-501',
                    passengers: 3,
                    class: 'Business'
                },
                amount: 45000,
                agentId: 'AGT-002',
                agentName: 'Global Tours',
                createdAt: '2024-01-15T11:45:00Z',
                alternativeSuppliers: [
                    { id: 'amadeus', name: 'Amadeus', price: 46200, available: true },
                    { id: 'galileo', name: 'Galileo', price: 45800, available: true },
                    { id: 'tripjack', name: 'TripJack', price: 44500, available: true }
                ]
            },
            {
                id: 'PB003',
                bookingRef: 'BK-2024-78544',
                pnr: null,
                type: 'hotel',
                status: 'pending_supplier',
                reason: 'Low supplier balance',
                originalSupplier: 'hotelbeds',
                supplierStatus: 'warning',
                requiredAmount: 28000,
                availableBalance: 45000,
                shortfall: 0,
                customer: { name: 'Amit Patel', email: 'amit@example.com', phone: '+91-7654321098' },
                tripDetails: {
                    hotel: 'Taj Mahal Palace',
                    city: 'Mumbai',
                    checkIn: '2024-01-25',
                    checkOut: '2024-01-28',
                    rooms: 2,
                    guests: 4
                },
                amount: 28000,
                agentId: 'AGT-003',
                agentName: 'Elite Holidays',
                createdAt: '2024-01-15T14:20:00Z',
                alternativeSuppliers: [
                    { id: 'booking_com', name: 'Booking.com', price: 29500, available: true }
                ]
            },
            {
                id: 'PB004',
                bookingRef: 'BK-2024-78545',
                pnr: null,
                type: 'bus',
                status: 'pending_supplier',
                reason: 'Low supplier balance',
                originalSupplier: 'abhibus',
                supplierStatus: 'low',
                requiredAmount: 3500,
                availableBalance: 12000,
                shortfall: 0,
                customer: { name: 'Sunita Devi', email: 'sunita@example.com', phone: '+91-6543210987' },
                tripDetails: {
                    from: 'Hyderabad',
                    to: 'Chennai',
                    date: '2024-01-18',
                    operator: 'APSRTC',
                    busType: 'AC Sleeper',
                    seats: 2
                },
                amount: 3500,
                agentId: 'AGT-001',
                agentName: 'Sunrise Travels',
                createdAt: '2024-01-15T16:00:00Z',
                alternativeSuppliers: [
                    { id: 'redbus', name: 'RedBus', price: 3600, available: true }
                ]
            },
            {
                id: 'PB005',
                bookingRef: 'BK-2024-78546',
                pnr: 'ABC123',
                type: 'flight',
                status: 'manual_update_required',
                reason: 'PNR needs manual verification',
                originalSupplier: 'amadeus',
                supplierStatus: 'healthy',
                requiredAmount: 18500,
                availableBalance: 250000,
                shortfall: 0,
                customer: { name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91-5432109876' },
                tripDetails: {
                    from: 'CCU',
                    to: 'DEL',
                    date: '2024-01-21',
                    airline: 'IndiGo',
                    flightNo: '6E-215',
                    passengers: 1,
                    class: 'Economy'
                },
                amount: 18500,
                agentId: 'AGT-004',
                agentName: 'Quick Travel',
                createdAt: '2024-01-15T09:15:00Z',
                alternativeSuppliers: []
            }
        ];

        // Mock completed/processed bookings history
        this.processedBookings = [
            {
                id: 'PB000',
                bookingRef: 'BK-2024-78540',
                pnr: 'XYZ789',
                type: 'flight',
                status: 'rebooked',
                originalSupplier: 'mystifly',
                newSupplier: 'tripjack',
                processedBy: 'Admin User',
                processedAt: '2024-01-14T15:30:00Z',
                notes: 'Rebooked due to low Mystifly balance'
            }
        ];
    }

    // Get pending bookings overview
    getPendingOverview = async (req, res) => {
        try {
            const byStatus = {
                pending_supplier: this.pendingBookings.filter(b => b.status === 'pending_supplier').length,
                manual_update_required: this.pendingBookings.filter(b => b.status === 'manual_update_required').length,
                awaiting_confirmation: this.pendingBookings.filter(b => b.status === 'awaiting_confirmation').length
            };

            const byType = {
                flight: this.pendingBookings.filter(b => b.type === 'flight').length,
                hotel: this.pendingBookings.filter(b => b.type === 'hotel').length,
                bus: this.pendingBookings.filter(b => b.type === 'bus').length
            };

            const criticalSuppliers = Object.entries(this.supplierBalances)
                .filter(([_, data]) => data.status === 'critical' || data.status === 'low')
                .map(([id, data]) => ({ id, ...data }));

            const totalShortfall = this.pendingBookings.reduce((sum, b) => sum + (b.shortfall || 0), 0);

            res.json({
                success: true,
                data: {
                    totalPending: this.pendingBookings.length,
                    byStatus,
                    byType,
                    criticalSuppliers,
                    totalShortfall,
                    currency: 'INR',
                    recentlyProcessed: this.processedBookings.length,
                    lastUpdated: new Date().toISOString()
                }
            });
        } catch (error) {
            console.error('Get pending overview error:', error);
            res.status(500).json({ success: false, message: 'Failed to get pending overview' });
        }
    };

    // Get all pending bookings
    getPendingBookings = async (req, res) => {
        try {
            const { status, type, supplier, page = 1, limit = 20 } = req.query;

            let filtered = [...this.pendingBookings];

            if (status) {
                filtered = filtered.filter(b => b.status === status);
            }
            if (type) {
                filtered = filtered.filter(b => b.type === type);
            }
            if (supplier) {
                filtered = filtered.filter(b => b.originalSupplier === supplier);
            }

            const total = filtered.length;
            const offset = (page - 1) * limit;
            const paginated = filtered.slice(offset, offset + parseInt(limit));

            res.json({
                success: true,
                data: {
                    bookings: paginated,
                    pagination: {
                        total,
                        page: parseInt(page),
                        limit: parseInt(limit),
                        totalPages: Math.ceil(total / limit)
                    }
                }
            });
        } catch (error) {
            console.error('Get pending bookings error:', error);
            res.status(500).json({ success: false, message: 'Failed to get pending bookings' });
        }
    };

    // Get single pending booking details
    getPendingBookingDetails = async (req, res) => {
        try {
            const { id } = req.params;
            const booking = this.pendingBookings.find(b => b.id === id);

            if (!booking) {
                return res.status(404).json({ success: false, message: 'Pending booking not found' });
            }

            // Add detailed supplier info
            const supplierBalance = this.supplierBalances[booking.originalSupplier];

            res.json({
                success: true,
                data: {
                    ...booking,
                    supplierDetails: supplierBalance,
                    timeline: [
                        { event: 'Booking Created', timestamp: booking.createdAt, status: 'completed' },
                        { event: 'Supplier Check Failed', timestamp: booking.createdAt, status: 'failed', reason: booking.reason },
                        { event: 'Pending Admin Action', timestamp: new Date().toISOString(), status: 'current' }
                    ]
                }
            });
        } catch (error) {
            console.error('Get pending booking details error:', error);
            res.status(500).json({ success: false, message: 'Failed to get booking details' });
        }
    };

    // Get supplier balances
    getSupplierBalances = async (req, res) => {
        try {
            const suppliers = Object.entries(this.supplierBalances).map(([id, data]) => ({
                id,
                name: id.charAt(0).toUpperCase() + id.slice(1).replace('_', '.'),
                ...data,
                pendingBookings: this.pendingBookings.filter(b => b.originalSupplier === id).length
            }));

            res.json({
                success: true,
                data: {
                    suppliers,
                    totalBalance: suppliers.reduce((sum, s) => sum + s.balance, 0),
                    currency: 'INR'
                }
            });
        } catch (error) {
            console.error('Get supplier balances error:', error);
            res.status(500).json({ success: false, message: 'Failed to get supplier balances' });
        }
    };

    // Update supplier balance (manual top-up)
    updateSupplierBalance = async (req, res) => {
        try {
            const { supplierId } = req.params;
            const { amount, type, reference } = req.body;

            if (!this.supplierBalances[supplierId]) {
                return res.status(404).json({ success: false, message: 'Supplier not found' });
            }

            const oldBalance = this.supplierBalances[supplierId].balance;

            if (type === 'credit') {
                this.supplierBalances[supplierId].balance += amount;
            } else if (type === 'debit') {
                this.supplierBalances[supplierId].balance -= amount;
            }

            // Update status based on new balance
            const balance = this.supplierBalances[supplierId].balance;
            const threshold = this.supplierBalances[supplierId].threshold;

            if (balance < threshold * 0.5) {
                this.supplierBalances[supplierId].status = 'critical';
            } else if (balance < threshold) {
                this.supplierBalances[supplierId].status = 'low';
            } else if (balance < threshold * 1.5) {
                this.supplierBalances[supplierId].status = 'warning';
            } else {
                this.supplierBalances[supplierId].status = 'healthy';
            }

            res.json({
                success: true,
                message: 'Supplier balance updated',
                data: {
                    supplierId,
                    oldBalance,
                    newBalance: this.supplierBalances[supplierId].balance,
                    type,
                    amount,
                    reference,
                    newStatus: this.supplierBalances[supplierId].status
                }
            });
        } catch (error) {
            console.error('Update supplier balance error:', error);
            res.status(500).json({ success: false, message: 'Failed to update supplier balance' });
        }
    };

    // Update PNR manually
    updatePNR = async (req, res) => {
        try {
            const { id } = req.params;
            const { pnr, remarks, status } = req.body;

            const bookingIndex = this.pendingBookings.findIndex(b => b.id === id);

            if (bookingIndex === -1) {
                return res.status(404).json({ success: false, message: 'Pending booking not found' });
            }

            const oldPnr = this.pendingBookings[bookingIndex].pnr;
            this.pendingBookings[bookingIndex].pnr = pnr;

            if (status) {
                this.pendingBookings[bookingIndex].status = status;
            }

            if (remarks) {
                this.pendingBookings[bookingIndex].remarks = remarks;
            }

            this.pendingBookings[bookingIndex].pnrUpdatedAt = new Date().toISOString();
            this.pendingBookings[bookingIndex].pnrUpdatedBy = req.admin?.email || 'admin@system.com';

            res.json({
                success: true,
                message: 'PNR updated successfully',
                data: {
                    id,
                    oldPnr,
                    newPnr: pnr,
                    status: this.pendingBookings[bookingIndex].status,
                    updatedAt: this.pendingBookings[bookingIndex].pnrUpdatedAt
                }
            });
        } catch (error) {
            console.error('Update PNR error:', error);
            res.status(500).json({ success: false, message: 'Failed to update PNR' });
        }
    };

    // Rebook with alternative supplier
    rebookWithSupplier = async (req, res) => {
        try {
            const { id } = req.params;
            const { newSupplierId, price, notes } = req.body;

            const bookingIndex = this.pendingBookings.findIndex(b => b.id === id);

            if (bookingIndex === -1) {
                return res.status(404).json({ success: false, message: 'Pending booking not found' });
            }

            const booking = this.pendingBookings[bookingIndex];

            // Check if new supplier has sufficient balance
            if (!this.supplierBalances[newSupplierId]) {
                return res.status(400).json({ success: false, message: 'Invalid supplier' });
            }

            if (this.supplierBalances[newSupplierId].balance < price) {
                return res.status(400).json({
                    success: false,
                    message: 'New supplier also has insufficient balance',
                    data: {
                        required: price,
                        available: this.supplierBalances[newSupplierId].balance
                    }
                });
            }

            // Deduct from new supplier balance
            this.supplierBalances[newSupplierId].balance -= price;

            // Generate new PNR
            const newPnr = this.generatePNR();

            // Move to processed
            const processedBooking = {
                ...booking,
                pnr: newPnr,
                status: 'rebooked',
                originalSupplier: booking.originalSupplier,
                newSupplier: newSupplierId,
                newPrice: price,
                priceDifference: price - booking.amount,
                processedBy: req.admin?.email || 'admin@system.com',
                processedAt: new Date().toISOString(),
                notes: notes || 'Rebooked with alternative supplier'
            };

            this.processedBookings.push(processedBooking);
            this.pendingBookings.splice(bookingIndex, 1);

            res.json({
                success: true,
                message: 'Booking rebooked successfully',
                data: {
                    bookingRef: booking.bookingRef,
                    newPnr,
                    oldSupplier: booking.originalSupplier,
                    newSupplier: newSupplierId,
                    oldPrice: booking.amount,
                    newPrice: price,
                    priceDifference: price - booking.amount,
                    status: 'rebooked'
                }
            });
        } catch (error) {
            console.error('Rebook with supplier error:', error);
            res.status(500).json({ success: false, message: 'Failed to rebook' });
        }
    };

    // Cancel pending booking
    cancelPendingBooking = async (req, res) => {
        try {
            const { id } = req.params;
            const { reason, refundToWallet } = req.body;

            const bookingIndex = this.pendingBookings.findIndex(b => b.id === id);

            if (bookingIndex === -1) {
                return res.status(404).json({ success: false, message: 'Pending booking not found' });
            }

            const booking = this.pendingBookings[bookingIndex];

            // Move to processed as cancelled
            const cancelledBooking = {
                ...booking,
                status: 'cancelled',
                cancelReason: reason,
                refundToWallet,
                processedBy: req.admin?.email || 'admin@system.com',
                processedAt: new Date().toISOString()
            };

            this.processedBookings.push(cancelledBooking);
            this.pendingBookings.splice(bookingIndex, 1);

            res.json({
                success: true,
                message: 'Pending booking cancelled',
                data: {
                    bookingRef: booking.bookingRef,
                    refundAmount: refundToWallet ? booking.amount : 0,
                    status: 'cancelled'
                }
            });
        } catch (error) {
            console.error('Cancel pending booking error:', error);
            res.status(500).json({ success: false, message: 'Failed to cancel booking' });
        }
    };

    // Retry booking with original supplier (after balance top-up)
    retryBooking = async (req, res) => {
        try {
            const { id } = req.params;

            const bookingIndex = this.pendingBookings.findIndex(b => b.id === id);

            if (bookingIndex === -1) {
                return res.status(404).json({ success: false, message: 'Pending booking not found' });
            }

            const booking = this.pendingBookings[bookingIndex];
            const supplierBalance = this.supplierBalances[booking.originalSupplier];

            if (supplierBalance.balance < booking.requiredAmount) {
                return res.status(400).json({
                    success: false,
                    message: 'Supplier still has insufficient balance',
                    data: {
                        required: booking.requiredAmount,
                        available: supplierBalance.balance,
                        shortfall: booking.requiredAmount - supplierBalance.balance
                    }
                });
            }

            // Deduct from supplier
            this.supplierBalances[booking.originalSupplier].balance -= booking.requiredAmount;

            // Generate PNR
            const newPnr = this.generatePNR();

            // Move to processed
            const processedBooking = {
                ...booking,
                pnr: newPnr,
                status: 'confirmed',
                processedBy: req.admin?.email || 'admin@system.com',
                processedAt: new Date().toISOString(),
                notes: 'Retry successful after supplier balance top-up'
            };

            this.processedBookings.push(processedBooking);
            this.pendingBookings.splice(bookingIndex, 1);

            res.json({
                success: true,
                message: 'Booking confirmed successfully',
                data: {
                    bookingRef: booking.bookingRef,
                    pnr: newPnr,
                    supplier: booking.originalSupplier,
                    amount: booking.requiredAmount,
                    status: 'confirmed'
                }
            });
        } catch (error) {
            console.error('Retry booking error:', error);
            res.status(500).json({ success: false, message: 'Failed to retry booking' });
        }
    };

    // Get processed bookings history
    getProcessedBookings = async (req, res) => {
        try {
            const { page = 1, limit = 20 } = req.query;

            const total = this.processedBookings.length;
            const offset = (page - 1) * limit;
            const paginated = this.processedBookings.slice(offset, offset + parseInt(limit));

            res.json({
                success: true,
                data: {
                    bookings: paginated,
                    pagination: {
                        total,
                        page: parseInt(page),
                        limit: parseInt(limit),
                        totalPages: Math.ceil(total / limit)
                    }
                }
            });
        } catch (error) {
            console.error('Get processed bookings error:', error);
            res.status(500).json({ success: false, message: 'Failed to get processed bookings' });
        }
    };

    // Bulk action - retry all eligible bookings
    bulkRetry = async (req, res) => {
        try {
            const eligible = this.pendingBookings.filter(b => {
                const balance = this.supplierBalances[b.originalSupplier]?.balance || 0;
                return balance >= b.requiredAmount;
            });

            const results = [];
            for (const booking of eligible) {
                this.supplierBalances[booking.originalSupplier].balance -= booking.requiredAmount;

                const processedBooking = {
                    ...booking,
                    pnr: this.generatePNR(),
                    status: 'confirmed',
                    processedBy: req.admin?.email || 'admin@system.com',
                    processedAt: new Date().toISOString(),
                    notes: 'Bulk retry - auto processed'
                };

                this.processedBookings.push(processedBooking);
                results.push({ bookingRef: booking.bookingRef, pnr: processedBooking.pnr, status: 'confirmed' });
            }

            // Remove processed from pending
            this.pendingBookings = this.pendingBookings.filter(b => {
                const balance = this.supplierBalances[b.originalSupplier]?.balance || 0;
                return balance < b.requiredAmount;
            });

            res.json({
                success: true,
                message: `${results.length} bookings processed`,
                data: {
                    processed: results.length,
                    remaining: this.pendingBookings.length,
                    results
                }
            });
        } catch (error) {
            console.error('Bulk retry error:', error);
            res.status(500).json({ success: false, message: 'Failed to process bulk retry' });
        }
    };

    // Generate random PNR
    generatePNR() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let pnr = '';
        for (let i = 0; i < 6; i++) {
            pnr += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return pnr;
    }
}

module.exports = new PendingBookingsController();
