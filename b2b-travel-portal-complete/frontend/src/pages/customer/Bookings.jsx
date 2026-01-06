import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    TicketIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    CalendarIcon,
    EyeIcon,
    ArrowDownTrayIcon,
    PrinterIcon,
    XCircleIcon,
    CheckCircleIcon,
    ClockIcon,
    PaperAirplaneIcon,
    BuildingOfficeIcon,
    TruckIcon,
    GlobeAltIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ArrowLongRightIcon,
    StarIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const CustomerBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [expandedBooking, setExpandedBooking] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, [filter]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await api.get('/customer/bookings', { params: { status: filter } });
            setBookings(response.data.bookings || mockBookings);
        } catch (error) {
            setBookings(mockBookings);
        } finally {
            setLoading(false);
        }
    };

    const mockBookings = [
        {
            id: 'BK001',
            type: 'flight',
            status: 'upcoming',
            from: 'Delhi (DEL)',
            to: 'Mumbai (BOM)',
            date: '2024-06-25',
            time: '06:00 AM',
            airline: 'IndiGo',
            flightNo: '6E-2154',
            pnr: 'ABC123',
            passengers: ['John Doe', 'Jane Doe'],
            amount: 8500,
            paymentStatus: 'paid'
        },
        {
            id: 'BK002',
            type: 'hotel',
            status: 'upcoming',
            hotelName: 'Taj Exotica Resort & Spa',
            location: 'Goa',
            checkIn: '2024-07-01',
            checkOut: '2024-07-04',
            roomType: 'Deluxe Sea View',
            guests: 2,
            confirmationNo: 'TAJ789012',
            amount: 45600,
            paymentStatus: 'paid'
        },
        {
            id: 'BK003',
            type: 'flight',
            status: 'completed',
            from: 'Bangalore (BLR)',
            to: 'Hyderabad (HYD)',
            date: '2024-05-15',
            time: '10:30 AM',
            airline: 'Air India',
            flightNo: 'AI-501',
            pnr: 'XYZ456',
            passengers: ['John Doe'],
            amount: 4500,
            paymentStatus: 'paid'
        },
        {
            id: 'BK004',
            type: 'bus',
            status: 'completed',
            from: 'Mumbai',
            to: 'Pune',
            date: '2024-04-20',
            time: '10:00 PM',
            operator: 'VRL Travels',
            busType: 'AC Sleeper',
            seats: ['L1', 'L2'],
            ticketNo: 'VRL456789',
            amount: 1600,
            paymentStatus: 'paid'
        },
        {
            id: 'BK005',
            type: 'flight',
            status: 'cancelled',
            from: 'Chennai (MAA)',
            to: 'Kolkata (CCU)',
            date: '2024-04-10',
            time: '08:00 AM',
            airline: 'SpiceJet',
            flightNo: 'SG-205',
            pnr: 'Cancelled',
            passengers: ['John Doe'],
            amount: 5500,
            refundAmount: 4800,
            paymentStatus: 'refunded'
        }
    ];

    const getTypeIcon = (type) => {
        switch (type) {
            case 'flight': return PaperAirplaneIcon;
            case 'hotel': return BuildingOfficeIcon;
            case 'bus': return TruckIcon;
            case 'holiday': return GlobeAltIcon;
            default: return TicketIcon;
        }
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'upcoming':
                return { bg: 'bg-blue-100', text: 'text-blue-800', icon: CalendarIcon };
            case 'completed':
                return { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircleIcon };
            case 'cancelled':
                return { bg: 'bg-red-100', text: 'text-red-800', icon: XCircleIcon };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-800', icon: ClockIcon };
        }
    };

    const filteredBookings = bookings.filter(booking => {
        if (filter !== 'all' && booking.status !== filter) return false;
        if (search) {
            const searchLower = search.toLowerCase();
            return (
                booking.id.toLowerCase().includes(searchLower) ||
                (booking.from && booking.from.toLowerCase().includes(searchLower)) ||
                (booking.to && booking.to.toLowerCase().includes(searchLower)) ||
                (booking.hotelName && booking.hotelName.toLowerCase().includes(searchLower))
            );
        }
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <TicketIcon className="w-8 h-8 text-blue-600" />
                        My Bookings
                    </h1>
                    <p className="text-gray-600 mt-1">View and manage your travel bookings</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex gap-2">
                            {['all', 'upcoming', 'completed', 'cancelled'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                                        filter === f
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-64">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search bookings..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
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
                                    <div className="p-4">
                                        <div className="flex items-center gap-4">
                                            {/* Type Icon */}
                                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                                                booking.type === 'flight' ? 'bg-blue-100' :
                                                booking.type === 'hotel' ? 'bg-green-100' :
                                                booking.type === 'bus' ? 'bg-orange-100' :
                                                'bg-purple-100'
                                            }`}>
                                                <TypeIcon className={`w-7 h-7 ${
                                                    booking.type === 'flight' ? 'text-blue-600 rotate-45' :
                                                    booking.type === 'hotel' ? 'text-green-600' :
                                                    booking.type === 'bus' ? 'text-orange-600' :
                                                    'text-purple-600'
                                                }`} />
                                            </div>

                                            {/* Booking Info */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="font-bold text-gray-900">{booking.id}</span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusConfig.bg} ${statusConfig.text}`}>
                                                        <StatusIcon className="w-3 h-3" />
                                                        {booking.status}
                                                    </span>
                                                </div>
                                                {booking.type === 'flight' && (
                                                    <>
                                                        <div className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                                            {booking.from}
                                                            <ArrowLongRightIcon className="w-5 h-5 text-gray-400" />
                                                            {booking.to}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {booking.airline} {booking.flightNo} • {booking.date} at {booking.time}
                                                        </div>
                                                    </>
                                                )}
                                                {booking.type === 'hotel' && (
                                                    <>
                                                        <div className="text-lg font-medium text-gray-900">{booking.hotelName}</div>
                                                        <div className="text-sm text-gray-500">
                                                            {booking.location} • {booking.checkIn} to {booking.checkOut}
                                                        </div>
                                                    </>
                                                )}
                                                {booking.type === 'bus' && (
                                                    <>
                                                        <div className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                                            {booking.from}
                                                            <ArrowLongRightIcon className="w-5 h-5 text-gray-400" />
                                                            {booking.to}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {booking.operator} • {booking.busType} • {booking.date}
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {/* Amount */}
                                            <div className="text-right">
                                                <div className="text-xl font-bold text-gray-900">₹{booking.amount.toLocaleString()}</div>
                                                {booking.refundAmount && (
                                                    <div className="text-sm text-green-600">Refund: ₹{booking.refundAmount}</div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setExpandedBooking(expandedBooking === booking.id ? null : booking.id)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                                >
                                                    {expandedBooking === booking.id ? (
                                                        <ChevronUpIcon className="w-5 h-5 text-gray-600" />
                                                    ) : (
                                                        <ChevronDownIcon className="w-5 h-5 text-gray-600" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {expandedBooking === booking.id && (
                                        <div className="border-t bg-gray-50 p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-2">Booking Details</h4>
                                                    <div className="space-y-1 text-sm">
                                                        {booking.pnr && (
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-500">PNR:</span>
                                                                <span className="font-mono font-medium">{booking.pnr}</span>
                                                            </div>
                                                        )}
                                                        {booking.confirmationNo && (
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-500">Confirmation:</span>
                                                                <span className="font-mono font-medium">{booking.confirmationNo}</span>
                                                            </div>
                                                        )}
                                                        {booking.ticketNo && (
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-500">Ticket No:</span>
                                                                <span className="font-mono font-medium">{booking.ticketNo}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-2">
                                                        {booking.type === 'hotel' ? 'Guests' : 'Passengers'}
                                                    </h4>
                                                    <div className="space-y-1 text-sm">
                                                        {booking.passengers?.map((p, i) => (
                                                            <div key={i}>{p}</div>
                                                        ))}
                                                        {booking.guests && (
                                                            <div>{booking.guests} Guest(s)</div>
                                                        )}
                                                        {booking.seats && (
                                                            <div>Seats: {booking.seats.join(', ')}</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-2">Payment</h4>
                                                    <div className="space-y-1 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">Amount:</span>
                                                            <span className="font-medium">₹{booking.amount.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">Status:</span>
                                                            <span className="text-green-600 capitalize">{booking.paymentStatus}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-3 mt-4 pt-4 border-t">
                                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                                                    <ArrowDownTrayIcon className="w-4 h-4" />
                                                    Download E-Ticket
                                                </button>
                                                <button className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                                                    <PrinterIcon className="w-4 h-4" />
                                                    Print
                                                </button>
                                                {booking.status === 'completed' && (
                                                    <button className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                                                        <StarIcon className="w-4 h-4" />
                                                        Rate & Review
                                                    </button>
                                                )}
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
                            <p className="text-gray-600 mb-4">Start your travel journey today!</p>
                            <Link
                                to="/flights"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                            >
                                <PaperAirplaneIcon className="w-5 h-5 rotate-45" />
                                Book Now
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerBookings;
