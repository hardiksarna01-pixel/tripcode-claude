import React, { useState, useEffect } from 'react';
import {
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowPathIcon,
    PencilIcon,
    ArrowsRightLeftIcon,
    WalletIcon,
    ClockIcon,
    PaperAirplaneIcon,
    BuildingOfficeIcon,
    TruckIcon,
    UserIcon,
    CurrencyRupeeIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    XMarkIcon,
    PlusIcon,
    MinusIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const PendingBookings = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [overview, setOverview] = useState(null);
    const [pendingBookings, setPendingBookings] = useState([]);
    const [supplierBalances, setSupplierBalances] = useState([]);
    const [processedBookings, setProcessedBookings] = useState([]);
    const [expandedBooking, setExpandedBooking] = useState(null);

    // Modal states
    const [pnrModal, setPnrModal] = useState({ open: false, booking: null });
    const [rebookModal, setRebookModal] = useState({ open: false, booking: null });
    const [cancelModal, setCancelModal] = useState({ open: false, booking: null });
    const [topUpModal, setTopUpModal] = useState({ open: false, supplier: null });

    // Form states
    const [pnrForm, setPnrForm] = useState({ pnr: '', remarks: '' });
    const [rebookForm, setRebookForm] = useState({ supplierId: '', notes: '' });
    const [cancelForm, setCancelForm] = useState({ reason: '', refundToWallet: true });
    const [topUpForm, setTopUpForm] = useState({ amount: '', type: 'credit', reference: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Mock data - in production, fetch from API
            setOverview({
                totalPending: 5,
                byStatus: { pending_supplier: 4, manual_update_required: 1 },
                byType: { flight: 3, hotel: 1, bus: 1 },
                criticalSuppliers: [
                    { id: 'mystifly', balance: 8500, threshold: 25000, status: 'critical' },
                    { id: 'sabre', balance: 15000, threshold: 50000, status: 'low' }
                ],
                totalShortfall: 34000,
                currency: 'INR'
            });

            setPendingBookings([
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
                        from: 'DEL', to: 'BOM', date: '2024-01-20',
                        airline: 'Air India', flightNo: 'AI-101', passengers: 2, class: 'Economy'
                    },
                    amount: 12500,
                    agentId: 'AGT-001',
                    agentName: 'Sunrise Travels',
                    createdAt: '2024-01-15T10:30:00Z',
                    alternativeSuppliers: [
                        { id: 'amadeus', name: 'Amadeus', price: 12800, available: true },
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
                        from: 'BLR', to: 'DXB', date: '2024-01-22',
                        airline: 'Emirates', flightNo: 'EK-501', passengers: 3, class: 'Business'
                    },
                    amount: 45000,
                    agentId: 'AGT-002',
                    agentName: 'Global Tours',
                    createdAt: '2024-01-15T11:45:00Z',
                    alternativeSuppliers: [
                        { id: 'amadeus', name: 'Amadeus', price: 46200, available: true },
                        { id: 'galileo', name: 'Galileo', price: 45800, available: true }
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
                        hotel: 'Taj Mahal Palace', city: 'Mumbai',
                        checkIn: '2024-01-25', checkOut: '2024-01-28', rooms: 2, guests: 4
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
                        from: 'Hyderabad', to: 'Chennai', date: '2024-01-18',
                        operator: 'APSRTC', busType: 'AC Sleeper', seats: 2
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
                        from: 'CCU', to: 'DEL', date: '2024-01-21',
                        airline: 'IndiGo', flightNo: '6E-215', passengers: 1, class: 'Economy'
                    },
                    amount: 18500,
                    agentId: 'AGT-004',
                    agentName: 'Quick Travel',
                    createdAt: '2024-01-15T09:15:00Z',
                    alternativeSuppliers: []
                }
            ]);

            setSupplierBalances([
                { id: 'amadeus', name: 'Amadeus', balance: 250000, threshold: 50000, status: 'healthy', pendingBookings: 0 },
                { id: 'sabre', name: 'Sabre', balance: 15000, threshold: 50000, status: 'low', pendingBookings: 1 },
                { id: 'galileo', name: 'Galileo', balance: 180000, threshold: 50000, status: 'healthy', pendingBookings: 0 },
                { id: 'mystifly', name: 'Mystifly', balance: 8500, threshold: 25000, status: 'critical', pendingBookings: 1 },
                { id: 'tripjack', name: 'TripJack', balance: 320000, threshold: 50000, status: 'healthy', pendingBookings: 0 },
                { id: 'hotelbeds', name: 'Hotelbeds', balance: 45000, threshold: 30000, status: 'warning', pendingBookings: 1 },
                { id: 'booking_com', name: 'Booking.com', balance: 125000, threshold: 40000, status: 'healthy', pendingBookings: 0 },
                { id: 'redbus', name: 'RedBus', balance: 75000, threshold: 20000, status: 'healthy', pendingBookings: 0 },
                { id: 'abhibus', name: 'AbhiBus', balance: 12000, threshold: 15000, status: 'low', pendingBookings: 1 }
            ]);

            setProcessedBookings([
                {
                    id: 'PB000',
                    bookingRef: 'BK-2024-78540',
                    pnr: 'XYZ789',
                    type: 'flight',
                    status: 'rebooked',
                    originalSupplier: 'mystifly',
                    newSupplier: 'tripjack',
                    processedBy: 'admin@flyshop.com',
                    processedAt: '2024-01-14T15:30:00Z',
                    notes: 'Rebooked due to low Mystifly balance'
                }
            ]);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'flight': return <PaperAirplaneIcon className="h-5 w-5" />;
            case 'hotel': return <BuildingOfficeIcon className="h-5 w-5" />;
            case 'bus': return <TruckIcon className="h-5 w-5" />;
            default: return <PaperAirplaneIcon className="h-5 w-5" />;
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            healthy: 'bg-green-100 text-green-800',
            warning: 'bg-yellow-100 text-yellow-800',
            low: 'bg-orange-100 text-orange-800',
            critical: 'bg-red-100 text-red-800',
            pending_supplier: 'bg-yellow-100 text-yellow-800',
            manual_update_required: 'bg-blue-100 text-blue-800',
            rebooked: 'bg-green-100 text-green-800',
            confirmed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
    };

    const handleUpdatePNR = () => {
        console.log('Updating PNR:', pnrForm);
        setPnrModal({ open: false, booking: null });
        setPnrForm({ pnr: '', remarks: '' });
        fetchData();
    };

    const handleRebook = () => {
        console.log('Rebooking:', rebookForm);
        setRebookModal({ open: false, booking: null });
        setRebookForm({ supplierId: '', notes: '' });
        fetchData();
    };

    const handleCancel = () => {
        console.log('Cancelling:', cancelForm);
        setCancelModal({ open: false, booking: null });
        setCancelForm({ reason: '', refundToWallet: true });
        fetchData();
    };

    const handleTopUp = () => {
        console.log('Top up:', topUpForm);
        setTopUpModal({ open: false, supplier: null });
        setTopUpForm({ amount: '', type: 'credit', reference: '' });
        fetchData();
    };

    const handleRetry = (booking) => {
        console.log('Retrying booking:', booking.id);
        alert('Retry initiated for booking: ' + booking.bookingRef);
        fetchData();
    };

    // Tab Content Components
    const OverviewTab = () => (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-3xl font-bold text-orange-700">{overview?.totalPending || 0}</p>
                            <p className="text-sm text-gray-600">Pending Bookings</p>
                        </div>
                        <ExclamationTriangleIcon className="h-12 w-12 text-orange-400" />
                    </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-3xl font-bold text-red-700">{formatCurrency(overview?.totalShortfall || 0)}</p>
                            <p className="text-sm text-gray-600">Total Shortfall</p>
                        </div>
                        <CurrencyRupeeIcon className="h-12 w-12 text-red-400" />
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-3xl font-bold text-blue-700">{overview?.byStatus?.manual_update_required || 0}</p>
                            <p className="text-sm text-gray-600">Manual PNR Updates</p>
                        </div>
                        <PencilIcon className="h-12 w-12 text-blue-400" />
                    </div>
                </div>

                <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-3xl font-bold text-pink-700">{overview?.criticalSuppliers?.length || 0}</p>
                            <p className="text-sm text-gray-600">Critical Suppliers</p>
                        </div>
                        <XCircleIcon className="h-12 w-12 text-pink-400" />
                    </div>
                </div>
            </div>

            {/* Critical Suppliers Alert */}
            {overview?.criticalSuppliers?.length > 0 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                    <div className="flex items-center">
                        <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3" />
                        <div>
                            <h4 className="font-semibold text-red-800">Critical Supplier Balance Alert</h4>
                            <p className="text-sm text-red-700">
                                {overview.criticalSuppliers.map(s =>
                                    `${s.id.charAt(0).toUpperCase() + s.id.slice(1)}: ${formatCurrency(s.balance)} (Threshold: ${formatCurrency(s.threshold)})`
                                ).join(' | ')}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Stats & Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Pending by Product Type</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <PaperAirplaneIcon className="h-5 w-5 text-blue-600" />
                                <span>Flights</span>
                            </div>
                            <span className="font-semibold">{overview?.byType?.flight || 0} pending</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <BuildingOfficeIcon className="h-5 w-5 text-purple-600" />
                                <span>Hotels</span>
                            </div>
                            <span className="font-semibold">{overview?.byType?.hotel || 0} pending</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <TruckIcon className="h-5 w-5 text-green-600" />
                                <span>Bus</span>
                            </div>
                            <span className="font-semibold">{overview?.byType?.bus || 0} pending</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button
                            onClick={() => alert('Bulk retry initiated for eligible bookings')}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition"
                        >
                            <ArrowPathIcon className="h-5 w-5" />
                            Bulk Retry Eligible Bookings
                        </button>
                        <button
                            onClick={() => setActiveTab('balances')}
                            className="w-full flex items-center justify-center gap-2 border border-orange-500 text-orange-600 px-4 py-3 rounded-lg hover:bg-orange-50 transition"
                        >
                            <WalletIcon className="h-5 w-5" />
                            Top-Up Supplier Balances
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition"
                        >
                            <ClockIcon className="h-5 w-5" />
                            View Processed History
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const PendingBookingsTab = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Pending Bookings ({pendingBookings.length})</h3>
                <button onClick={fetchData} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                    <ArrowPathIcon className="h-5 w-5" />
                    Refresh
                </button>
            </div>

            {pendingBookings.map((booking) => (
                <div
                    key={booking.id}
                    className={`bg-white border rounded-lg p-4 ${booking.shortfall > 0 ? 'border-red-300 border-2' : ''}`}
                >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${booking.type === 'flight' ? 'bg-blue-100' : booking.type === 'hotel' ? 'bg-purple-100' : 'bg-green-100'}`}>
                                {getTypeIcon(booking.type)}
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg">{booking.bookingRef}</h4>
                                <p className="text-sm text-gray-600">{booking.customer.name} | {booking.agentName}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}>
                                {booking.status.replace(/_/g, ' ').toUpperCase()}
                            </span>
                            <p className="text-xl font-bold mt-2">{formatCurrency(booking.amount)}</p>
                        </div>
                    </div>

                    {/* Trip Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-medium mb-1">Trip Details</p>
                            {booking.type === 'flight' && (
                                <div className="text-sm">
                                    <p className="font-medium">{booking.tripDetails.from} → {booking.tripDetails.to}</p>
                                    <p>{booking.tripDetails.airline} {booking.tripDetails.flightNo}</p>
                                    <p>{booking.tripDetails.date} | {booking.tripDetails.passengers} Pax | {booking.tripDetails.class}</p>
                                </div>
                            )}
                            {booking.type === 'hotel' && (
                                <div className="text-sm">
                                    <p className="font-medium">{booking.tripDetails.hotel}</p>
                                    <p>{booking.tripDetails.city}</p>
                                    <p>{booking.tripDetails.checkIn} to {booking.tripDetails.checkOut}</p>
                                    <p>{booking.tripDetails.rooms} Rooms | {booking.tripDetails.guests} Guests</p>
                                </div>
                            )}
                            {booking.type === 'bus' && (
                                <div className="text-sm">
                                    <p className="font-medium">{booking.tripDetails.from} → {booking.tripDetails.to}</p>
                                    <p>{booking.tripDetails.operator}</p>
                                    <p>{booking.tripDetails.date} | {booking.tripDetails.busType}</p>
                                    <p>{booking.tripDetails.seats} Seats</p>
                                </div>
                            )}
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 uppercase font-medium mb-1">Supplier Status</p>
                            <div className="flex items-center gap-2">
                                <span className="font-medium capitalize">{booking.originalSupplier}</span>
                                <span className={`px-2 py-0.5 rounded text-xs ${getStatusBadge(booking.supplierStatus)}`}>
                                    {booking.supplierStatus}
                                </span>
                            </div>
                            {booking.shortfall > 0 && (
                                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
                                    <p>Required: {formatCurrency(booking.requiredAmount)}</p>
                                    <p>Available: {formatCurrency(booking.availableBalance)}</p>
                                    <p className="font-semibold text-red-700">Shortfall: {formatCurrency(booking.shortfall)}</p>
                                </div>
                            )}
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 uppercase font-medium mb-1">PNR</p>
                            {booking.pnr ? (
                                <p className="text-2xl font-bold text-blue-600">{booking.pnr}</p>
                            ) : (
                                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                                    Not Generated
                                </span>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                                Created: {new Date(booking.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Alternative Suppliers */}
                    {booking.alternativeSuppliers?.length > 0 && (
                        <div className="mb-4">
                            <button
                                onClick={() => setExpandedBooking(expandedBooking === booking.id ? null : booking.id)}
                                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                            >
                                {expandedBooking === booking.id ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                                Alternative Suppliers ({booking.alternativeSuppliers.length})
                            </button>

                            {expandedBooking === booking.id && (
                                <div className="mt-2 overflow-x-auto">
                                    <table className="min-w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="px-4 py-2 text-left">Supplier</th>
                                                <th className="px-4 py-2 text-left">Price</th>
                                                <th className="px-4 py-2 text-left">Availability</th>
                                                <th className="px-4 py-2 text-left">Price Diff</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {booking.alternativeSuppliers.map((alt) => (
                                                <tr key={alt.id} className="border-b">
                                                    <td className="px-4 py-2">{alt.name}</td>
                                                    <td className="px-4 py-2">{formatCurrency(alt.price)}</td>
                                                    <td className="px-4 py-2">
                                                        <span className={`px-2 py-0.5 rounded text-xs ${alt.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                            {alt.available ? 'Available' : 'Unavailable'}
                                                        </span>
                                                    </td>
                                                    <td className={`px-4 py-2 ${alt.price > booking.amount ? 'text-red-600' : 'text-green-600'}`}>
                                                        {alt.price > booking.amount ? '+' : ''}{formatCurrency(alt.price - booking.amount)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t">
                        <button
                            onClick={() => {
                                setPnrForm({ pnr: booking.pnr || '', remarks: '' });
                                setPnrModal({ open: true, booking });
                            }}
                            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700"
                        >
                            <PencilIcon className="h-4 w-4" />
                            Update PNR
                        </button>

                        {booking.alternativeSuppliers?.length > 0 && (
                            <button
                                onClick={() => {
                                    setRebookForm({ supplierId: '', notes: '' });
                                    setRebookModal({ open: true, booking });
                                }}
                                className="flex items-center gap-1 bg-purple-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-purple-700"
                            >
                                <ArrowsRightLeftIcon className="h-4 w-4" />
                                Rebook with Other Supplier
                            </button>
                        )}

                        {booking.shortfall === 0 && (
                            <button
                                onClick={() => handleRetry(booking)}
                                className="flex items-center gap-1 border border-green-500 text-green-600 px-3 py-2 rounded-lg text-sm hover:bg-green-50"
                            >
                                <ArrowPathIcon className="h-4 w-4" />
                                Retry Booking
                            </button>
                        )}

                        <button
                            onClick={() => {
                                setCancelForm({ reason: '', refundToWallet: true });
                                setCancelModal({ open: true, booking });
                            }}
                            className="flex items-center gap-1 border border-red-500 text-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-50"
                        >
                            <XCircleIcon className="h-4 w-4" />
                            Cancel Booking
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    const SupplierBalancesTab = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Supplier Balances</h3>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">
                    Monitor supplier credit balances. Top-up suppliers with low balance to process pending bookings.
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-lg">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-3 text-left text-sm font-semibold">Supplier</th>
                            <th className="px-4 py-3 text-right text-sm font-semibold">Current Balance</th>
                            <th className="px-4 py-3 text-right text-sm font-semibold">Threshold</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold">Status</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold">Pending</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {supplierBalances.map((supplier) => (
                            <tr
                                key={supplier.id}
                                className={`border-b ${supplier.status === 'critical' ? 'bg-red-50' : supplier.status === 'low' ? 'bg-yellow-50' : ''}`}
                            >
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-700">
                                            {supplier.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <span className="font-medium">{supplier.name}</span>
                                    </div>
                                </td>
                                <td className={`px-4 py-3 text-right font-bold ${supplier.status === 'critical' || supplier.status === 'low' ? 'text-red-600' : ''}`}>
                                    {formatCurrency(supplier.balance)}
                                </td>
                                <td className="px-4 py-3 text-right text-gray-600">
                                    {formatCurrency(supplier.threshold)}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(supplier.status)}`}>
                                        {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {supplier.pendingBookings > 0 ? (
                                        <span className="inline-flex items-center justify-center w-6 h-6 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                                            {supplier.pendingBookings}
                                        </span>
                                    ) : '-'}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        onClick={() => {
                                            setTopUpForm({ amount: '', type: 'credit', reference: '' });
                                            setTopUpModal({ open: true, supplier });
                                        }}
                                        className="flex items-center gap-1 mx-auto border border-blue-500 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-50"
                                    >
                                        <PlusIcon className="h-4 w-4" />
                                        Top-Up
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Balance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-green-700">
                        {formatCurrency(supplierBalances.reduce((sum, s) => sum + s.balance, 0))}
                    </p>
                    <p className="text-sm text-gray-600">Total Balance Across All Suppliers</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-yellow-700">
                        {supplierBalances.filter(s => s.status === 'low' || s.status === 'warning').length}
                    </p>
                    <p className="text-sm text-gray-600">Suppliers with Low Balance</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-red-700">
                        {supplierBalances.filter(s => s.status === 'critical').length}
                    </p>
                    <p className="text-sm text-gray-600">Critical Suppliers</p>
                </div>
            </div>
        </div>
    );

    const ProcessedHistoryTab = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Processed Bookings History</h3>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-lg">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-3 text-left text-sm font-semibold">Booking Ref</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">PNR</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Original</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">New</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Processed By</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {processedBookings.length > 0 ? (
                            processedBookings.map((booking) => (
                                <tr key={booking.id} className="border-b">
                                    <td className="px-4 py-3 font-medium">{booking.bookingRef}</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                            {booking.pnr}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {getTypeIcon(booking.type)}
                                            <span className="capitalize">{booking.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 capitalize">{booking.originalSupplier}</td>
                                    <td className="px-4 py-3 capitalize">{booking.newSupplier || '-'}</td>
                                    <td className="px-4 py-3 text-sm">{booking.processedBy}</td>
                                    <td className="px-4 py-3 text-sm">{new Date(booking.processedAt).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                                    No processed bookings yet
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // Modal Component
    const Modal = ({ open, onClose, title, children }) => {
        if (!open) return null;

        return (
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4">
                    <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
                    <div className="relative bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">{title}</h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-24 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Pending Bookings & Manual PNR Management</h1>
                <p className="text-gray-600">Manage bookings pending due to low supplier balance. Update PNR manually or rebook with alternative suppliers.</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow">
                <div className="border-b">
                    <nav className="flex -mb-px">
                        {[
                            { id: 'overview', label: 'Overview', badge: overview?.totalPending },
                            { id: 'pending', label: 'Pending Bookings', badge: pendingBookings.length },
                            { id: 'balances', label: 'Supplier Balances' },
                            { id: 'history', label: 'Processed History' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
                                    activeTab === tab.id
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab.label}
                                {tab.badge > 0 && (
                                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                        activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {tab.badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'overview' && <OverviewTab />}
                    {activeTab === 'pending' && <PendingBookingsTab />}
                    {activeTab === 'balances' && <SupplierBalancesTab />}
                    {activeTab === 'history' && <ProcessedHistoryTab />}
                </div>
            </div>

            {/* Update PNR Modal */}
            <Modal
                open={pnrModal.open}
                onClose={() => setPnrModal({ open: false, booking: null })}
                title="Update PNR"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">Booking: {pnrModal.booking?.bookingRef}</p>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">PNR</label>
                        <input
                            type="text"
                            value={pnrForm.pnr}
                            onChange={(e) => setPnrForm({ ...pnrForm, pnr: e.target.value.toUpperCase() })}
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter 6-character PNR"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                        <textarea
                            value={pnrForm.remarks}
                            onChange={(e) => setPnrForm({ ...pnrForm, remarks: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={2}
                            placeholder="Add any notes or remarks"
                        />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={() => setPnrModal({ open: false, booking: null })}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdatePNR}
                            disabled={!pnrForm.pnr}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            Update PNR
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Rebook Modal */}
            <Modal
                open={rebookModal.open}
                onClose={() => setRebookModal({ open: false, booking: null })}
                title="Rebook with Alternative Supplier"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">Booking: {rebookModal.booking?.bookingRef}</p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                        Original Supplier: <span className="font-medium capitalize">{rebookModal.booking?.originalSupplier}</span>
                        <span className={`ml-2 px-2 py-0.5 rounded text-xs ${getStatusBadge(rebookModal.booking?.supplierStatus)}`}>
                            {rebookModal.booking?.supplierStatus}
                        </span>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Alternative Supplier</label>
                        <select
                            value={rebookForm.supplierId}
                            onChange={(e) => setRebookForm({ ...rebookForm, supplierId: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select supplier...</option>
                            {rebookModal.booking?.alternativeSuppliers?.filter(s => s.available).map((supplier) => (
                                <option key={supplier.id} value={supplier.id}>
                                    {supplier.name} - {formatCurrency(supplier.price)}
                                    {supplier.price > rebookModal.booking?.amount && ` (+${formatCurrency(supplier.price - rebookModal.booking.amount)})`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                            value={rebookForm.notes}
                            onChange={(e) => setRebookForm({ ...rebookForm, notes: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2"
                            rows={2}
                        />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={() => setRebookModal({ open: false, booking: null })}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleRebook}
                            disabled={!rebookForm.supplierId}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                        >
                            Rebook Now
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Cancel Modal */}
            <Modal
                open={cancelModal.open}
                onClose={() => setCancelModal({ open: false, booking: null })}
                title="Cancel Pending Booking"
            >
                <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                        This will cancel the pending booking: {cancelModal.booking?.bookingRef}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cancellation Reason</label>
                        <textarea
                            value={cancelForm.reason}
                            onChange={(e) => setCancelForm({ ...cancelForm, reason: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2"
                            rows={2}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Refund to Wallet</label>
                        <select
                            value={cancelForm.refundToWallet}
                            onChange={(e) => setCancelForm({ ...cancelForm, refundToWallet: e.target.value === 'true' })}
                            className="w-full border rounded-lg px-3 py-2"
                        >
                            <option value="true">Yes - Refund {formatCurrency(cancelModal.booking?.amount || 0)}</option>
                            <option value="false">No Refund</option>
                        </select>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={() => setCancelModal({ open: false, booking: null })}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={!cancelForm.reason}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                            Confirm Cancellation
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Top-Up Modal */}
            <Modal
                open={topUpModal.open}
                onClose={() => setTopUpModal({ open: false, supplier: null })}
                title="Top-Up Supplier Balance"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">Supplier: {topUpModal.supplier?.name}</p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                        Current Balance: <span className="font-bold">{formatCurrency(topUpModal.supplier?.balance || 0)}</span>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
                        <select
                            value={topUpForm.type}
                            onChange={(e) => setTopUpForm({ ...topUpForm, type: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2"
                        >
                            <option value="credit">Credit (Add Balance)</option>
                            <option value="debit">Debit (Deduct Balance)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-500">₹</span>
                            <input
                                type="number"
                                value={topUpForm.amount}
                                onChange={(e) => setTopUpForm({ ...topUpForm, amount: e.target.value })}
                                className="w-full border rounded-lg pl-8 pr-3 py-2"
                                placeholder="Enter amount"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
                        <input
                            type="text"
                            value={topUpForm.reference}
                            onChange={(e) => setTopUpForm({ ...topUpForm, reference: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="Transaction reference or UTR"
                        />
                    </div>
                    {parseFloat(topUpForm.amount) > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                            New Balance: {formatCurrency(
                                (topUpModal.supplier?.balance || 0) +
                                (topUpForm.type === 'credit' ? parseFloat(topUpForm.amount) : -parseFloat(topUpForm.amount))
                            )}
                        </div>
                    )}
                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={() => setTopUpModal({ open: false, supplier: null })}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleTopUp}
                            disabled={!topUpForm.amount || parseFloat(topUpForm.amount) <= 0}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {topUpForm.type === 'credit' ? 'Add Balance' : 'Deduct Balance'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PendingBookings;
