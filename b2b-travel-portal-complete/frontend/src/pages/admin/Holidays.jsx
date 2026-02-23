import React, { useState } from 'react';
import {
    GlobeAltIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    PencilIcon,
    EyeIcon
} from '@heroicons/react/24/outline';

const AdminHolidays = () => {
    const [activeTab, setActiveTab] = useState('bookings');

    const stats = {
        totalBookings: 180,
        revenue: 18500000,
        avgPackageValue: 102778,
        topDestination: 'Maldives'
    };

    const bookings = [
        { id: 'HLD001', package: 'Maldives 5N/6D', travelers: 'Rajesh Kumar +3', agent: 'ABC Travels', travelDate: '2024-07-15', amount: 245000, status: 'confirmed' },
        { id: 'HLD002', package: 'Bali Adventure 6N/7D', travelers: 'Priya Sharma +1', agent: 'XYZ Tours', travelDate: '2024-08-10', amount: 185000, status: 'pending' },
        { id: 'HLD003', package: 'Dubai Shopping 4N/5D', travelers: 'Amit Patel +5', agent: 'Travel World', travelDate: '2024-07-25', amount: 320000, status: 'confirmed' }
    ];

    const packages = [
        { id: 1, name: 'Maldives 5N/6D', destination: 'Maldives', price: 65000, duration: '5N/6D', bookings: 45, status: 'active' },
        { id: 2, name: 'Bali Adventure 6N/7D', destination: 'Bali', price: 85000, duration: '6N/7D', bookings: 38, status: 'active' },
        { id: 3, name: 'Dubai Shopping 4N/5D', destination: 'Dubai', price: 55000, duration: '4N/5D', bookings: 52, status: 'active' },
        { id: 4, name: 'Thailand Explorer 5N/6D', destination: 'Thailand', price: 45000, duration: '5N/6D', bookings: 28, status: 'active' }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Holiday Packages</h1>
                            <p className="text-gray-600">Manage holiday packages and bookings</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700">
                            <PlusIcon className="w-5 h-5" />
                            Add Package
                        </button>
                    </div>
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
                        <div className="text-2xl font-bold mt-1">₹{(stats.revenue / 10000000).toFixed(1)}Cr</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Avg Package Value</div>
                        <div className="text-2xl font-bold mt-1">₹{(stats.avgPackageValue / 1000).toFixed(0)}K</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Top Destination</div>
                        <div className="text-2xl font-bold mt-1">{stats.topDestination}</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm mb-6">
                    <div className="flex border-b">
                        {['bookings', 'packages'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-4 text-sm font-medium capitalize ${
                                    activeTab === tab
                                        ? 'border-b-2 border-blue-600 text-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                {activeTab === 'bookings' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Booking</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Package</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Travelers</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Travel Date</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Amount</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {bookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-blue-600">{booking.id}</div>
                                            <div className="text-sm text-gray-500">{booking.agent}</div>
                                        </td>
                                        <td className="px-4 py-3 font-medium">{booking.package}</td>
                                        <td className="px-4 py-3 text-sm">{booking.travelers}</td>
                                        <td className="px-4 py-3 text-sm">{booking.travelDate}</td>
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
                )}

                {activeTab === 'packages' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {packages.map((pkg) => (
                            <div key={pkg.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                    <GlobeAltIcon className="w-16 h-16 text-white/50" />
                                </div>
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <div className="font-semibold">{pkg.name}</div>
                                            <div className="text-sm text-gray-500">{pkg.destination}</div>
                                        </div>
                                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                            {pkg.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                                        <span>{pkg.duration}</span>
                                        <span>{pkg.bookings} bookings</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="text-lg font-bold">₹{pkg.price.toLocaleString()}</div>
                                        <div className="flex gap-2">
                                            <button className="p-2 hover:bg-gray-100 rounded">
                                                <EyeIcon className="w-4 h-4 text-gray-500" />
                                            </button>
                                            <button className="p-2 hover:bg-gray-100 rounded">
                                                <PencilIcon className="w-4 h-4 text-gray-500" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-dashed flex items-center justify-center min-h-[300px]">
                            <button className="text-center text-gray-500">
                                <PlusIcon className="w-12 h-12 mx-auto mb-2" />
                                <span>Add New Package</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminHolidays;
