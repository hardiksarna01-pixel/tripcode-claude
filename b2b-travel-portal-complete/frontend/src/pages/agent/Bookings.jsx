import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    TicketIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    CalendarIcon,
    EyeIcon,
    DocumentDuplicateIcon,
    ArrowDownTrayIcon,
    PrinterIcon,
    XCircleIcon,
    CheckCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    PaperAirplaneIcon,
    BuildingOfficeIcon,
    TruckIcon,
    GlobeAltIcon,
    ShieldCheckIcon,
    ArrowPathIcon,
    PhoneIcon,
    EnvelopeIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ArrowLongRightIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const AgentBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        type: '',
        status: '',
        dateFrom: '',
        dateTo: ''
    });
    const [showFilters, setShowFilters] = useState(false);
    const [expandedBooking, setExpandedBooking] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10);
    const [selectedBookings, setSelectedBookings] = useState([]);

    useEffect(() => {
        fetchBookings();
    }, [search, filters, currentPage]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await api.get('/agent/bookings', {
                params: { search, ...filters, page: currentPage }
            });
            setBookings(response.data.bookings || mockBookings);
            setTotalPages(response.data.totalPages || 10);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setBookings(mockBookings);
        } finally {
            setLoading(false);
        }
    };

    const mockBookings = [
        {
            id: 'BK45612',
            type: 'flight',
            status: 'confirmed',
            customerName: 'Rahul Sharma',
            customerEmail: 'rahul.sharma@email.com',
            customerPhone: '+91 9876543210',
            route: 'Delhi → Mumbai',
            details: {
                airline: 'IndiGo',
                flightNumber: '6E-2154',
                departure: '06:00',
                arrival: '08:15',
                class: 'Economy',
                passengers: 2
            },
            travelDate: '2024-06-20',
            bookingDate: '2024-06-15 10:30 AM',
            amount: 8500,
            commission: 425,
            pnr: 'ABC123',
            paymentStatus: 'paid'
        },
        {
            id: 'BK45613',
            type: 'hotel',
            status: 'confirmed',
            customerName: 'Priya Patel',
            customerEmail: 'priya.patel@email.com',
            customerPhone: '+91 9876543211',
            route: 'Taj Hotel, Goa',
            details: {
                hotelName: 'Taj Exotica Resort & Spa',
                roomType: 'Deluxe Sea View',
                checkIn: '2024-06-25',
                checkOut: '2024-06-28',
                nights: 3,
                guests: 2
            },
            travelDate: '2024-06-25',
            bookingDate: '2024-06-14 02:30 PM',
            amount: 45600,
            commission: 2736,
            confirmationNo: 'TAJ789012',
            paymentStatus: 'paid'
        },
        {
            id: 'BK45614',
            type: 'flight',
            status: 'pending',
            customerName: 'Amit Kumar',
            customerEmail: 'amit.kumar@email.com',
            customerPhone: '+91 9876543212',
            route: 'Bangalore → Kolkata',
            details: {
                airline: 'Air India',
                flightNumber: 'AI-501',
                departure: '14:30',
                arrival: '17:15',
                class: 'Business',
                passengers: 1
            },
            travelDate: '2024-06-22',
            bookingDate: '2024-06-15 11:45 AM',
            amount: 18500,
            commission: 1110,
            pnr: 'Pending',
            paymentStatus: 'pending'
        },
        {
            id: 'BK45615',
            type: 'bus',
            status: 'confirmed',
            customerName: 'Sneha Gupta',
            customerEmail: 'sneha.gupta@email.com',
            customerPhone: '+91 9876543213',
            route: 'Mumbai → Pune',
            details: {
                operator: 'VRL Travels',
                busType: 'AC Sleeper',
                departure: '22:00',
                arrival: '02:00',
                seats: ['L1', 'L2']
            },
            travelDate: '2024-06-18',
            bookingDate: '2024-06-13 09:00 AM',
            amount: 1200,
            commission: 60,
            ticketNo: 'VRL456789',
            paymentStatus: 'paid'
        },
        {
            id: 'BK45616',
            type: 'holiday',
            status: 'processing',
            customerName: 'Vikram Singh',
            customerEmail: 'vikram.singh@email.com',
            customerPhone: '+91 9876543214',
            route: 'Kerala Backwater Package',
            details: {
                packageName: 'Kerala Backwater Retreat',
                duration: '5 Nights / 6 Days',
                startDate: '2024-07-01',
                endDate: '2024-07-06',
                travelers: 4,
                inclusions: ['Hotels', 'Transfers', 'Breakfast', 'Sightseeing']
            },
            travelDate: '2024-07-01',
            bookingDate: '2024-06-10 11:00 AM',
            amount: 125000,
            commission: 12500,
            voucherNo: 'KER789456',
            paymentStatus: 'partial'
        },
        {
            id: 'BK45617',
            type: 'flight',
            status: 'cancelled',
            customerName: 'Neha Reddy',
            customerEmail: 'neha.reddy@email.com',
            customerPhone: '+91 9876543215',
            route: 'Chennai → Hyderabad',
            details: {
                airline: 'SpiceJet',
                flightNumber: 'SG-405',
                departure: '08:00',
                arrival: '09:15',
                class: 'Economy',
                passengers: 1
            },
            travelDate: '2024-06-19',
            bookingDate: '2024-06-12 04:15 PM',
            amount: 4500,
            commission: 0,
            pnr: 'Cancelled',
            paymentStatus: 'refunded',
            refundAmount: 3800
        }
    ];

    const getTypeIcon = (type) => {
        switch (type) {
            case 'flight': return PaperAirplaneIcon;
            case 'hotel': return BuildingOfficeIcon;
            case 'bus': return TruckIcon;
            case 'holiday': return GlobeAltIcon;
            case 'insurance': return ShieldCheckIcon;
            default: return TicketIcon;
        }
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'confirmed':
                return { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircleIcon };
            case 'pending':
                return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: ClockIcon };
            case 'processing':
                return { bg: 'bg-blue-100', text: 'text-blue-800', icon: ArrowPathIcon };
            case 'cancelled':
                return { bg: 'bg-red-100', text: 'text-red-800', icon: XCircleIcon };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-800', icon: TicketIcon };
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!confirm('Are you sure you want to cancel this booking?')) return;

        try {
            await api.post(`/bookings/${bookingId}/cancel`);
            fetchBookings();
        } catch (error) {
            console.error('Cancel failed:', error);
        }
    };

    const toggleSelectBooking = (id) => {
        setSelectedBookings(prev =>
            prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
        );
    };

    const filteredBookings = bookings.filter(booking => {
        if (search) {
            const searchLower = search.toLowerCase();
            return (
                booking.id.toLowerCase().includes(searchLower) ||
                booking.customerName.toLowerCase().includes(searchLower) ||
                booking.route.toLowerCase().includes(searchLower)
            );
        }
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <TicketIcon className="w-8 h-8 text-blue-600" />
                                My Bookings
                            </h1>
                            <p className="text-sm text-gray-600">View and manage all your bookings</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50">
                                <ArrowDownTrayIcon className="w-5 h-5" />
                                Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Search & Filters */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by Booking ID, Customer Name, or Route..."
                                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={filters.type}
                                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                                className="border rounded-lg px-4 py-3"
                            >
                                <option value="">All Types</option>
                                <option value="flight">Flights</option>
                                <option value="hotel">Hotels</option>
                                <option value="bus">Bus</option>
                                <option value="holiday">Holidays</option>
                            </select>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                className="border rounded-lg px-4 py-3"
                            >
                                <option value="">All Status</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="px-4 py-3 border rounded-lg flex items-center gap-2 hover:bg-gray-50"
                            >
                                <FunnelIcon className="w-5 h-5" />
                                More Filters
                            </button>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                                <input
                                    type="date"
                                    value={filters.dateFrom}
                                    onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                                <input
                                    type="date"
                                    value={filters.dateTo}
                                    onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    {[
                        { label: 'Total Bookings', value: filteredBookings.length, color: 'blue' },
                        { label: 'Confirmed', value: filteredBookings.filter(b => b.status === 'confirmed').length, color: 'green' },
                        { label: 'Pending', value: filteredBookings.filter(b => b.status === 'pending').length, color: 'yellow' },
                        { label: 'Processing', value: filteredBookings.filter(b => b.status === 'processing').length, color: 'blue' },
                        { label: 'Cancelled', value: filteredBookings.filter(b => b.status === 'cancelled').length, color: 'red' }
                    ].map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm p-4 text-center">
                            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                            <div className="text-sm text-gray-500">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Bookings List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                        </div>
                    ) : filteredBookings.length > 0 ? (
                        filteredBookings.map((booking) => {
                            const TypeIcon = getTypeIcon(booking.type);
                            const statusConfig = getStatusConfig(booking.status);
                            const StatusIcon = statusConfig.icon;

                            return (
                                <div key={booking.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                    {/* Main Row */}
                                    <div className="p-4">
                                        <div className="flex items-center gap-4">
                                            {/* Checkbox */}
                                            <input
                                                type="checkbox"
                                                checked={selectedBookings.includes(booking.id)}
                                                onChange={() => toggleSelectBooking(booking.id)}
                                                className="rounded text-blue-600"
                                            />

                                            {/* Type Icon */}
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                                booking.type === 'flight' ? 'bg-blue-100' :
                                                booking.type === 'hotel' ? 'bg-green-100' :
                                                booking.type === 'bus' ? 'bg-orange-100' :
                                                'bg-purple-100'
                                            }`}>
                                                <TypeIcon className={`w-6 h-6 ${
                                                    booking.type === 'flight' ? 'text-blue-600 rotate-45' :
                                                    booking.type === 'hotel' ? 'text-green-600' :
                                                    booking.type === 'bus' ? 'text-orange-600' :
                                                    'text-purple-600'
                                                }`} />
                                            </div>

                                            {/* Booking Info */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-gray-900">{booking.id}</span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusConfig.bg} ${statusConfig.text}`}>
                                                        <StatusIcon className="w-3 h-3" />
                                                        {booking.status}
                                                    </span>
                                                    {booking.pnr && booking.pnr !== 'Pending' && booking.pnr !== 'Cancelled' && (
                                                        <span className="text-sm text-gray-500">PNR: {booking.pnr}</span>
                                                    )}
                                                </div>
                                                <div className="text-gray-600 mt-1">{booking.customerName}</div>
                                                <div className="text-sm text-gray-500">{booking.route}</div>
                                            </div>

                                            {/* Travel Date */}
                                            <div className="text-center px-4 border-l">
                                                <div className="text-sm text-gray-500">Travel Date</div>
                                                <div className="font-medium text-gray-900">{booking.travelDate}</div>
                                            </div>

                                            {/* Amount */}
                                            <div className="text-right px-4 border-l">
                                                <div className="text-lg font-bold text-gray-900">₹{booking.amount.toLocaleString()}</div>
                                                {booking.commission > 0 && (
                                                    <div className="text-sm text-green-600">+₹{booking.commission} comm.</div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 pl-4 border-l">
                                                <button
                                                    onClick={() => setExpandedBooking(expandedBooking === booking.id ? null : booking.id)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                                                    title="View Details"
                                                >
                                                    {expandedBooking === booking.id ? (
                                                        <ChevronUpIcon className="w-5 h-5 text-gray-600" />
                                                    ) : (
                                                        <ChevronDownIcon className="w-5 h-5 text-gray-600" />
                                                    )}
                                                </button>
                                                <button className="p-2 hover:bg-gray-100 rounded-lg transition" title="Print">
                                                    <PrinterIcon className="w-5 h-5 text-gray-600" />
                                                </button>
                                                <button className="p-2 hover:bg-gray-100 rounded-lg transition" title="Download">
                                                    <ArrowDownTrayIcon className="w-5 h-5 text-gray-600" />
                                                </button>
                                                {booking.status !== 'cancelled' && (
                                                    <button
                                                        onClick={() => handleCancelBooking(booking.id)}
                                                        className="p-2 hover:bg-red-50 rounded-lg transition"
                                                        title="Cancel"
                                                    >
                                                        <XCircleIcon className="w-5 h-5 text-red-500" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {expandedBooking === booking.id && (
                                        <div className="border-t bg-gray-50 p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {/* Customer Details */}
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-3">Customer Details</h4>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-gray-500 w-20">Name:</span>
                                                            <span className="font-medium">{booking.customerName}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                                                            <span>{booking.customerEmail}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <PhoneIcon className="w-4 h-4 text-gray-400" />
                                                            <span>{booking.customerPhone}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Booking Details */}
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-3">Booking Details</h4>
                                                    <div className="space-y-2 text-sm">
                                                        {booking.type === 'flight' && (
                                                            <>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-500">Airline:</span>
                                                                    <span>{booking.details.airline} {booking.details.flightNumber}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-500">Time:</span>
                                                                    <span>{booking.details.departure} → {booking.details.arrival}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-500">Class:</span>
                                                                    <span>{booking.details.class}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-500">Passengers:</span>
                                                                    <span>{booking.details.passengers}</span>
                                                                </div>
                                                            </>
                                                        )}
                                                        {booking.type === 'hotel' && (
                                                            <>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-500">Hotel:</span>
                                                                    <span>{booking.details.hotelName}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-500">Room:</span>
                                                                    <span>{booking.details.roomType}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-500">Check-in:</span>
                                                                    <span>{booking.details.checkIn}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-500">Check-out:</span>
                                                                    <span>{booking.details.checkOut}</span>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Payment Details */}
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-3">Payment Details</h4>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">Amount:</span>
                                                            <span className="font-bold">₹{booking.amount.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">Commission:</span>
                                                            <span className="text-green-600">₹{booking.commission.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">Payment Status:</span>
                                                            <span className={`capitalize ${
                                                                booking.paymentStatus === 'paid' ? 'text-green-600' :
                                                                booking.paymentStatus === 'pending' ? 'text-yellow-600' :
                                                                booking.paymentStatus === 'refunded' ? 'text-blue-600' :
                                                                'text-gray-600'
                                                            }`}>{booking.paymentStatus}</span>
                                                        </div>
                                                        {booking.refundAmount && (
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-500">Refund Amount:</span>
                                                                <span className="text-blue-600">₹{booking.refundAmount.toLocaleString()}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">Booked On:</span>
                                                            <span>{booking.bookingDate}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Quick Actions */}
                                            <div className="flex gap-3 mt-6 pt-4 border-t">
                                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2">
                                                    <EyeIcon className="w-4 h-4" />
                                                    View Full Details
                                                </button>
                                                <button className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center gap-2">
                                                    <DocumentDuplicateIcon className="w-4 h-4" />
                                                    Copy Booking Link
                                                </button>
                                                <button className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center gap-2">
                                                    <EnvelopeIcon className="w-4 h-4" />
                                                    Email Customer
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                            <TicketIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
                            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
                            <Link
                                to="/flights"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                            >
                                <PaperAirplaneIcon className="w-5 h-5 rotate-45" />
                                Make a New Booking
                            </Link>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {filteredBookings.length > 0 && (
                    <div className="mt-6 flex items-center justify-between bg-white rounded-xl shadow-sm p-4">
                        <div className="text-sm text-gray-600">
                            Showing {(currentPage - 1) * 10 + 1} - {Math.min(currentPage * 10, filteredBookings.length)} of {filteredBookings.length} bookings
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            {[...Array(Math.min(5, totalPages))].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-10 h-10 rounded-lg ${
                                        currentPage === i + 1
                                            ? 'bg-blue-600 text-white'
                                            : 'border hover:bg-gray-50'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgentBookings;
