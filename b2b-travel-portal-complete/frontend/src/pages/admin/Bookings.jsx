import React, { useState, useEffect } from 'react';
import {
    TicketIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    EyeIcon,
    ArrowDownTrayIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    PaperAirplaneIcon,
    BuildingOfficeIcon,
    TruckIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        type: '',
        status: '',
        agent: '',
        dateFrom: '',
        dateTo: ''
    });
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchBookings();
    }, [filters, currentPage]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/bookings', { params: { ...filters, page: currentPage } });
            setBookings(response.data.bookings || mockBookings);
        } catch (error) {
            setBookings(mockBookings);
        } finally {
            setLoading(false);
        }
    };

    const mockBookings = [
        { id: 'BK45612', type: 'flight', agent: 'ABC Travels', customer: 'Rahul Sharma', route: 'DEL → BOM', amount: 8500, commission: 425, status: 'confirmed', date: '2024-06-15' },
        { id: 'BK45613', type: 'hotel', agent: 'XYZ Tours', customer: 'Priya Patel', route: 'Taj Hotel, Goa', amount: 45600, commission: 2736, status: 'confirmed', date: '2024-06-14' },
        { id: 'BK45614', type: 'flight', agent: 'Travel World', customer: 'Amit Kumar', route: 'BLR → CCU', amount: 18500, commission: 925, status: 'pending', date: '2024-06-14' },
        { id: 'BK45615', type: 'bus', agent: 'Fly High', customer: 'Sneha Gupta', route: 'Mumbai → Pune', amount: 1200, commission: 60, status: 'confirmed', date: '2024-06-13' },
        { id: 'BK45616', type: 'holiday', agent: 'Trip Masters', customer: 'Vikram Singh', route: 'Kerala Package', amount: 125000, commission: 12500, status: 'processing', date: '2024-06-10' },
        { id: 'BK45617', type: 'flight', agent: 'ABC Travels', customer: 'Neha Reddy', route: 'MAA → HYD', amount: 4500, commission: 0, status: 'cancelled', date: '2024-06-09' }
    ];

    const getTypeIcon = (type) => {
        switch (type) {
            case 'flight': return PaperAirplaneIcon;
            case 'hotel': return BuildingOfficeIcon;
            case 'bus': return TruckIcon;
            default: return TicketIcon;
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'confirmed':
                return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Confirmed</span>;
            case 'pending':
                return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pending</span>;
            case 'processing':
                return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Processing</span>;
            case 'cancelled':
                return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Cancelled</span>;
            default:
                return null;
        }
    };

    const stats = [
        { label: 'Total Bookings', value: '15,678', change: '+145 today' },
        { label: 'Confirmed', value: '14,892', change: '95%' },
        { label: 'Pending', value: '456', change: '3%' },
        { label: 'Cancelled', value: '330', change: '2%' }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
                            <p className="text-gray-600">Manage all bookings across agents</p>
                        </div>
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700">
                            <ArrowDownTrayIcon className="w-5 h-5" />
                            Export Report
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm p-4">
                            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                            <div className="text-sm text-gray-500">{stat.label}</div>
                            <div className="text-xs text-green-600 mt-1">{stat.change}</div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="grid grid-cols-6 gap-4">
                        <div className="col-span-2 relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search bookings..."
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                            />
                        </div>
                        <select
                            value={filters.type}
                            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                            className="border rounded-lg px-4 py-2"
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
                            className="border rounded-lg px-4 py-2"
                        >
                            <option value="">All Status</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="pending">Pending</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <input
                            type="date"
                            value={filters.dateFrom}
                            onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                            className="border rounded-lg px-4 py-2"
                        />
                        <input
                            type="date"
                            value={filters.dateTo}
                            onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                            className="border rounded-lg px-4 py-2"
                        />
                    </div>
                </div>

                {/* Bookings Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route/Details</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Commission</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading ? (
                                <tr>
                                    <td colSpan="10" className="px-4 py-8 text-center">
                                        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : (
                                bookings.map((booking) => {
                                    const TypeIcon = getTypeIcon(booking.type);
                                    return (
                                        <tr key={booking.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-blue-600">{booking.id}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <TypeIcon className={`w-5 h-5 ${booking.type === 'flight' ? 'rotate-45' : ''} text-gray-400`} />
                                                    <span className="capitalize">{booking.type}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">{booking.agent}</td>
                                            <td className="px-4 py-3">{booking.customer}</td>
                                            <td className="px-4 py-3 text-gray-600">{booking.route}</td>
                                            <td className="px-4 py-3 text-right font-medium">₹{booking.amount.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-right text-green-600">₹{booking.commission.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-center">{getStatusBadge(booking.status)}</td>
                                            <td className="px-4 py-3 text-gray-500">{booking.date}</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="p-1 hover:bg-gray-100 rounded">
                                                    <EyeIcon className="w-5 h-5 text-gray-500" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminBookings;
