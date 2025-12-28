import React, { useState } from 'react';
import {
    TruckIcon,
    MagnifyingGlassIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';

const AdminBuses = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const stats = {
        totalBookings: 850,
        revenue: 2500000,
        avgTicketValue: 2940,
        topRoute: 'Mumbai-Pune'
    };

    const bookings = [
        { id: 'BUS001', operator: 'VRL Travels', passenger: 'Rajesh Kumar', agent: 'ABC Travels', route: 'Mumbai → Pune', date: '2024-06-20', seats: 2, amount: 1800, status: 'confirmed' },
        { id: 'BUS002', operator: 'Orange Travels', passenger: 'Priya Sharma', agent: 'XYZ Tours', route: 'Bangalore → Chennai', date: '2024-06-22', seats: 1, amount: 950, status: 'confirmed' },
        { id: 'BUS003', operator: 'Neeta Travels', passenger: 'Amit Patel', agent: 'Travel World', route: 'Delhi → Jaipur', date: '2024-06-25', seats: 4, amount: 3200, status: 'pending' }
    ];

    const topOperators = [
        { name: 'VRL Travels', bookings: 245, revenue: 650000 },
        { name: 'Orange Travels', bookings: 198, revenue: 520000 },
        { name: 'Neeta Travels', bookings: 156, revenue: 410000 },
        { name: 'SRS Travels', bookings: 134, revenue: 380000 }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">Bus Bookings</h1>
                    <p className="text-gray-600">Manage bus reservations</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Total Bookings</div>
                        <div className="text-2xl font-bold mt-1">{stats.totalBookings}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Revenue</div>
                        <div className="text-2xl font-bold mt-1">₹{(stats.revenue / 100000).toFixed(1)}L</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Avg Ticket Value</div>
                        <div className="text-2xl font-bold mt-1">₹{stats.avgTicketValue}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Top Route</div>
                        <div className="text-2xl font-bold mt-1">{stats.topRoute}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Bookings Table */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                            <div className="relative">
                                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search bookings..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Booking</th>
                                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Route</th>
                                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Date</th>
                                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Amount</th>
                                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {bookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-blue-600">{booking.id}</div>
                                                <div className="text-sm text-gray-500">{booking.passenger}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium">{booking.route}</div>
                                                <div className="text-sm text-gray-500">{booking.operator}</div>
                                            </td>
                                            <td className="px-4 py-3 text-sm">{booking.date}</td>
                                            <td className="px-4 py-3 font-medium">₹{booking.amount}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                    'bg-yellow-100 text-yellow-800'
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
                        <div className="bg-white rounded-xl shadow-sm">
                            <div className="p-4 border-b">
                                <h2 className="font-semibold">Top Operators</h2>
                            </div>
                            <div className="divide-y">
                                {topOperators.map((operator, index) => (
                                    <div key={index} className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                                                <TruckIcon className="w-4 h-4 text-orange-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm">{operator.name}</div>
                                                <div className="text-xs text-gray-500">{operator.bookings} bookings</div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium">₹{(operator.revenue / 100000).toFixed(1)}L</div>
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

export default AdminBuses;
