import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingApi } from '../services/api';

const BookingHistory = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        startDate: '',
        endDate: '',
        search: ''
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0
    });
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, [pagination.page, filters]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            // Mock data for demo
            const mockBookings = [
                {
                    id: 1,
                    bookingRef: 'TRP001',
                    pnr: 'ABC123',
                    status: 'confirmed',
                    route: 'DEL → BOM',
                    airline: 'Air India',
                    airlineCode: 'AI',
                    flightNumber: 'AI-505',
                    departureDate: '2025-12-28',
                    departureTime: '06:30',
                    arrivalTime: '08:45',
                    passengers: [
                        { name: 'Mr. Rahul Sharma', type: 'Adult' },
                        { name: 'Mrs. Priya Sharma', type: 'Adult' }
                    ],
                    totalFare: 12450,
                    commission: 450,
                    createdAt: '2025-12-26T10:00:00Z'
                },
                {
                    id: 2,
                    bookingRef: 'TRP002',
                    pnr: 'XYZ789',
                    status: 'on_hold',
                    route: 'BLR → DEL',
                    airline: 'IndiGo',
                    airlineCode: '6E',
                    flightNumber: '6E-2341',
                    departureDate: '2025-12-30',
                    departureTime: '14:15',
                    arrivalTime: '17:00',
                    passengers: [
                        { name: 'Mr. Amit Kumar', type: 'Adult' }
                    ],
                    totalFare: 8900,
                    commission: 320,
                    holdExpiry: '2025-12-26T18:00:00Z',
                    createdAt: '2025-12-25T15:30:00Z'
                },
                {
                    id: 3,
                    bookingRef: 'TRP003',
                    pnr: 'PQR456',
                    status: 'cancelled',
                    route: 'CCU → MAA',
                    airline: 'Vistara',
                    airlineCode: 'UK',
                    flightNumber: 'UK-823',
                    departureDate: '2025-12-29',
                    departureTime: '09:00',
                    arrivalTime: '11:30',
                    passengers: [
                        { name: 'Ms. Sneha Das', type: 'Adult' }
                    ],
                    totalFare: 6200,
                    commission: 220,
                    refundAmount: 4500,
                    createdAt: '2025-12-24T09:00:00Z'
                }
            ];
            setBookings(mockBookings);
            setPagination(prev => ({ ...prev, total: mockBookings.length }));
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            confirmed: 'bg-green-100 text-green-800',
            on_hold: 'bg-yellow-100 text-yellow-800',
            cancelled: 'bg-red-100 text-red-800',
            pending: 'bg-blue-100 text-blue-800',
            ticketed: 'bg-purple-100 text-purple-800'
        };
        const labels = {
            confirmed: 'Confirmed',
            on_hold: 'On Hold',
            cancelled: 'Cancelled',
            pending: 'Pending',
            ticketed: 'Ticketed'
        };
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100'}`}>
                {labels[status] || status}
            </span>
        );
    };

    const handleCancelBooking = async (booking) => {
        setSelectedBooking(booking);
        setShowCancelModal(true);
    };

    const confirmCancellation = async () => {
        try {
            // await bookingApi.cancel(selectedBooking.bookingRef, 'full');
            alert('Booking cancelled successfully');
            setShowCancelModal(false);
            fetchBookings();
        } catch (error) {
            console.error('Error cancelling booking:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Booking History</h1>
                    <p className="text-gray-500">Manage your bookings and PNRs</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search PNR</label>
                            <input
                                type="text"
                                placeholder="Enter PNR or Booking Ref"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            >
                                <option value="">All Status</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="on_hold">On Hold</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="ticketed">Ticketed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={filters.startDate}
                                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={filters.endDate}
                                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Bookings List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-gray-500">Loading bookings...</p>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <p className="text-gray-500">No bookings found</p>
                        </div>
                    ) : (
                        bookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="p-4">
                                    {/* Booking Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg font-semibold">PNR: {booking.pnr}</span>
                                                {getStatusBadge(booking.status)}
                                            </div>
                                            <p className="text-sm text-gray-500">Booking Ref: {booking.bookingRef}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-gray-900">₹{booking.totalFare.toLocaleString()}</p>
                                            <p className="text-sm text-green-600">Commission: ₹{booking.commission}</p>
                                        </div>
                                    </div>

                                    {/* Flight Details */}
                                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <span className="text-blue-600 font-bold">{booking.airlineCode}</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{booking.airline}</span>
                                                    <span className="text-gray-500">{booking.flightNumber}</span>
                                                </div>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <span className="text-lg font-semibold">{booking.departureTime}</span>
                                                    <div className="flex-1 border-t-2 border-dashed border-gray-300 relative">
                                                        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-50 px-2 text-xs text-gray-500">
                                                            {booking.route}
                                                        </span>
                                                    </div>
                                                    <span className="text-lg font-semibold">{booking.arrivalTime}</span>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {new Date(booking.departureDate).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Passengers */}
                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Passengers</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {booking.passengers.map((pax, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                                                    {pax.name} ({pax.type})
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Hold Expiry Warning */}
                                    {booking.status === 'on_hold' && booking.holdExpiry && (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                                            <p className="text-yellow-800 text-sm">
                                                <strong>Hold expires:</strong> {new Date(booking.holdExpiry).toLocaleString()}
                                            </p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-4 border-t">
                                        <button
                                            onClick={() => navigate(`/ticket/${booking.bookingRef}`)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                        >
                                            View Details
                                        </button>
                                        {(booking.status === 'confirmed' || booking.status === 'ticketed') && (
                                            <>
                                                <button
                                                    onClick={() => navigate(`/ticket/${booking.bookingRef}`)}
                                                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                                                >
                                                    Download Ticket
                                                </button>
                                                <button
                                                    onClick={() => handleCancelBooking(booking)}
                                                    className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                        {booking.status === 'on_hold' && (
                                            <>
                                                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                                                    Confirm & Pay
                                                </button>
                                                <button className="px-4 py-2 border border-gray-400 text-gray-600 rounded-lg hover:bg-gray-50 transition">
                                                    Release Hold
                                                </button>
                                            </>
                                        )}
                                        <button className="px-4 py-2 border border-gray-400 text-gray-600 rounded-lg hover:bg-gray-50 transition">
                                            Resend Email
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {!loading && bookings.length > 0 && (
                    <div className="flex justify-between items-center mt-6">
                        <p className="text-sm text-gray-500">
                            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} bookings
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                disabled={pagination.page === 1}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                disabled={pagination.page * pagination.limit >= pagination.total}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Cancel Modal */}
            {showCancelModal && selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                        <h3 className="text-lg font-semibold mb-4">Cancel Booking</h3>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to cancel booking <strong>{selectedBooking.pnr}</strong>?
                        </p>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                            <h4 className="font-medium text-yellow-800 mb-2">Cancellation Charges</h4>
                            <div className="text-sm text-yellow-700">
                                <p>Fare: ₹{selectedBooking.totalFare.toLocaleString()}</p>
                                <p>Cancellation Fee: ₹1,500</p>
                                <p className="font-semibold mt-2">
                                    Refund Amount: ₹{(selectedBooking.totalFare - 1500).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Keep Booking
                            </button>
                            <button
                                onClick={confirmCancellation}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Confirm Cancellation
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingHistory;
