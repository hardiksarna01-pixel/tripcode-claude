import React, { useState } from 'react';
import {
    BuildingOffice2Icon,
    MagnifyingGlassIcon,
    FunnelIcon,
    EyeIcon,
    StarIcon
} from '@heroicons/react/24/outline';

const AdminHotels = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const stats = {
        totalBookings: 2850,
        revenue: 12500000,
        avgRating: 4.2,
        topCity: 'Goa'
    };

    const bookings = [
        { id: 'HTL001', hotel: 'Taj Palace Delhi', guest: 'Rajesh Kumar', agent: 'ABC Travels', checkIn: '2024-06-20', checkOut: '2024-06-23', rooms: 2, amount: 45000, status: 'confirmed' },
        { id: 'HTL002', hotel: 'Leela Mumbai', guest: 'Priya Sharma', agent: 'XYZ Tours', checkIn: '2024-06-22', checkOut: '2024-06-25', rooms: 1, amount: 38000, status: 'confirmed' },
        { id: 'HTL003', hotel: 'ITC Grand Goa', guest: 'Amit Patel', agent: 'Travel World', checkIn: '2024-06-25', checkOut: '2024-06-28', rooms: 3, amount: 72000, status: 'pending' },
        { id: 'HTL004', hotel: 'Oberoi Bangalore', guest: 'Sneha Gupta', agent: 'Fly High', checkIn: '2024-06-18', checkOut: '2024-06-20', rooms: 1, amount: 28000, status: 'completed' }
    ];

    const topHotels = [
        { name: 'Taj Hotels', bookings: 456, revenue: 2500000 },
        { name: 'ITC Hotels', bookings: 389, revenue: 2100000 },
        { name: 'Oberoi Hotels', bookings: 312, revenue: 1850000 },
        { name: 'Leela Hotels', bookings: 278, revenue: 1650000 }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">Hotel Bookings</h1>
                    <p className="text-gray-600">Manage hotel reservations and inventory</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Total Bookings</div>
                        <div className="text-2xl font-bold mt-1">{stats.totalBookings.toLocaleString()}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Revenue</div>
                        <div className="text-2xl font-bold mt-1">₹{(stats.revenue / 10000000).toFixed(1)}Cr</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Avg Rating</div>
                        <div className="text-2xl font-bold mt-1 flex items-center gap-1">
                            {stats.avgRating}
                            <StarIcon className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Top Destination</div>
                        <div className="text-2xl font-bold mt-1">{stats.topCity}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Bookings Table */}
                    <div className="lg:col-span-2">
                        {/* Filters */}
                        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                            <div className="flex items-center gap-4">
                                <div className="flex-1 relative">
                                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search bookings..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                                    />
                                </div>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="border rounded-lg px-4 py-2"
                                >
                                    <option value="all">All Status</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Booking</th>
                                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Hotel</th>
                                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Dates</th>
                                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Amount</th>
                                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {bookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-blue-600">{booking.id}</div>
                                                <div className="text-sm text-gray-500">{booking.guest}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium">{booking.hotel}</div>
                                                <div className="text-sm text-gray-500">{booking.rooms} rooms</div>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <div>{booking.checkIn}</div>
                                                <div className="text-gray-500">to {booking.checkOut}</div>
                                            </td>
                                            <td className="px-4 py-3 font-medium">₹{booking.amount.toLocaleString()}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Top Hotels */}
                        <div className="bg-white rounded-xl shadow-sm">
                            <div className="p-4 border-b">
                                <h2 className="font-semibold">Top Hotel Chains</h2>
                            </div>
                            <div className="divide-y">
                                {topHotels.map((hotel, index) => (
                                    <div key={index} className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                                                <BuildingOffice2Icon className="w-4 h-4 text-purple-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm">{hotel.name}</div>
                                                <div className="text-xs text-gray-500">{hotel.bookings} bookings</div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium">₹{(hotel.revenue / 100000).toFixed(1)}L</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Cities */}
                        <div className="bg-white rounded-xl shadow-sm p-4">
                            <h2 className="font-semibold mb-4">Top Destinations</h2>
                            <div className="space-y-3">
                                {[
                                    { city: 'Goa', bookings: 580 },
                                    { city: 'Mumbai', bookings: 456 },
                                    { city: 'Delhi', bookings: 423 },
                                    { city: 'Jaipur', bookings: 312 },
                                    { city: 'Udaipur', bookings: 289 }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-sm">{item.city}</span>
                                        <span className="text-sm font-medium">{item.bookings}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHotels;
