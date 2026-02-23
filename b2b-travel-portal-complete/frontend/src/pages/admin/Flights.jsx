import React, { useState } from 'react';
import {
    PaperAirplaneIcon,
    MagnifyingGlassIcon,
    ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const AdminFlights = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const stats = {
        totalBookings: 8500,
        revenue: 28500000,
        avgTicketValue: 3353,
        topRoute: 'DEL-BOM'
    };

    const bookings = [
        { id: 'FLT001', pnr: 'ABC123', passenger: 'Rajesh Kumar', agent: 'ABC Travels', route: 'DEL → BOM', airline: 'Air India', date: '2024-06-20', amount: 5600, status: 'confirmed' },
        { id: 'FLT002', pnr: 'XYZ456', passenger: 'Priya Sharma', agent: 'XYZ Tours', route: 'BLR → DEL', airline: 'IndiGo', date: '2024-06-22', amount: 4200, status: 'confirmed' },
        { id: 'FLT003', pnr: 'PQR789', passenger: 'Amit Patel', agent: 'Travel World', route: 'BOM → GOI', airline: 'SpiceJet', date: '2024-06-25', amount: 3100, status: 'pending' },
        { id: 'FLT004', pnr: 'LMN012', passenger: 'Sneha Gupta', agent: 'Fly High', route: 'DEL → CCU', airline: 'Vistara', date: '2024-06-18', amount: 6800, status: 'confirmed' }
    ];

    const topAirlines = [
        { name: 'Air India', bookings: 2450, revenue: 9500000 },
        { name: 'IndiGo', bookings: 2180, revenue: 7200000 },
        { name: 'SpiceJet', bookings: 1560, revenue: 4800000 },
        { name: 'Vistara', bookings: 1420, revenue: 5100000 },
        { name: 'GoFirst', bookings: 890, revenue: 1900000 }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">Flight Bookings</h1>
                    <p className="text-gray-600">Manage flight reservations and airline performance</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Total Bookings</div>
                        <div className="text-2xl font-bold mt-1">{stats.totalBookings.toLocaleString()}</div>
                        <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                            <ArrowTrendingUpIcon className="w-3 h-3" />
                            +12% this month
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Revenue</div>
                        <div className="text-2xl font-bold mt-1">₹{(stats.revenue / 10000000).toFixed(1)}Cr</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Avg Ticket Value</div>
                        <div className="text-2xl font-bold mt-1">₹{stats.avgTicketValue.toLocaleString()}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Top Route</div>
                        <div className="text-2xl font-bold mt-1">{stats.topRoute}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Bookings */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                            <div className="relative">
                                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by PNR, passenger, or agent..."
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
                                                <div className="font-medium text-blue-600">{booking.pnr}</div>
                                                <div className="text-sm text-gray-500">{booking.passenger}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium">{booking.route}</div>
                                                <div className="text-sm text-gray-500">{booking.airline}</div>
                                            </td>
                                            <td className="px-4 py-3 text-sm">{booking.date}</td>
                                            <td className="px-4 py-3 font-medium">₹{booking.amount.toLocaleString()}</td>
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
                                <h2 className="font-semibold">Top Airlines</h2>
                            </div>
                            <div className="divide-y">
                                {topAirlines.map((airline, index) => (
                                    <div key={index} className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                                <PaperAirplaneIcon className="w-4 h-4 text-blue-600 rotate-45" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm">{airline.name}</div>
                                                <div className="text-xs text-gray-500">{airline.bookings.toLocaleString()} bookings</div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium">₹{(airline.revenue / 100000).toFixed(1)}L</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-4">
                            <h2 className="font-semibold mb-4">Top Routes</h2>
                            <div className="space-y-3">
                                {[
                                    { route: 'DEL → BOM', bookings: 2450 },
                                    { route: 'BLR → DEL', bookings: 1890 },
                                    { route: 'BOM → GOI', bookings: 1560 },
                                    { route: 'DEL → BLR', bookings: 1420 },
                                    { route: 'CCU → DEL', bookings: 1280 }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-sm">{item.route}</span>
                                        <span className="text-sm font-medium">{item.bookings.toLocaleString()}</span>
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

export default AdminFlights;
