import React, { useState } from 'react';
import {
    BuildingOffice2Icon,
    UsersIcon,
    CurrencyRupeeIcon,
    ServerIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

const SuperAdminDashboard = () => {
    const [timeRange, setTimeRange] = useState('today');

    const platformStats = {
        totalCompanies: 125,
        activeCompanies: 118,
        totalUsers: 45680,
        totalRevenue: 1250000000,
        monthlyGrowth: 15.2,
        systemHealth: 99.8
    };

    const recentCompanies = [
        { name: 'TravelMax India', plan: 'Enterprise', users: 450, status: 'active', joinedAt: '2024-06-15' },
        { name: 'GoTrip Solutions', plan: 'Professional', users: 85, status: 'active', joinedAt: '2024-06-14' },
        { name: 'Voyage Travels', plan: 'Starter', users: 12, status: 'trial', joinedAt: '2024-06-13' },
        { name: 'JetSet Tours', plan: 'Professional', users: 156, status: 'active', joinedAt: '2024-06-10' }
    ];

    const systemAlerts = [
        { type: 'warning', message: 'High API usage detected for TravelMax India', time: '5 mins ago' },
        { type: 'success', message: 'Database backup completed successfully', time: '1 hour ago' },
        { type: 'info', message: 'New version 2.4.1 ready for deployment', time: '3 hours ago' },
        { type: 'error', message: 'Payment gateway timeout (resolved)', time: '5 hours ago' }
    ];

    const topCompanies = [
        { name: 'TravelMax India', revenue: 125000000, bookings: 15680 },
        { name: 'Global Trips', revenue: 98000000, bookings: 12450 },
        { name: 'JetSet Tours', revenue: 78000000, bookings: 9870 },
        { name: 'Voyage Plus', revenue: 65000000, bookings: 8560 },
        { name: 'TripMaster Pro', revenue: 52000000, bookings: 6780 }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
                            <p className="text-indigo-200">Platform overview and system management</p>
                        </div>
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                        >
                            <option value="today" className="text-gray-900">Today</option>
                            <option value="week" className="text-gray-900">This Week</option>
                            <option value="month" className="text-gray-900">This Month</option>
                            <option value="year" className="text-gray-900">This Year</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Platform Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <BuildingOffice2Icon className="w-5 h-5" />
                            <span className="text-sm">Companies</span>
                        </div>
                        <div className="text-2xl font-bold">{platformStats.totalCompanies}</div>
                        <div className="text-xs text-green-600">{platformStats.activeCompanies} active</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <UsersIcon className="w-5 h-5" />
                            <span className="text-sm">Total Users</span>
                        </div>
                        <div className="text-2xl font-bold">{(platformStats.totalUsers / 1000).toFixed(1)}K</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <CurrencyRupeeIcon className="w-5 h-5" />
                            <span className="text-sm">Platform Revenue</span>
                        </div>
                        <div className="text-2xl font-bold">₹{(platformStats.totalRevenue / 10000000).toFixed(0)}Cr</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <ArrowTrendingUpIcon className="w-5 h-5" />
                            <span className="text-sm">Monthly Growth</span>
                        </div>
                        <div className="text-2xl font-bold text-green-600">+{platformStats.monthlyGrowth}%</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <ServerIcon className="w-5 h-5" />
                            <span className="text-sm">System Health</span>
                        </div>
                        <div className="text-2xl font-bold text-green-600">{platformStats.systemHealth}%</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <ExclamationTriangleIcon className="w-5 h-5" />
                            <span className="text-sm">Open Issues</span>
                        </div>
                        <div className="text-2xl font-bold text-orange-600">3</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Companies */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h2 className="font-semibold text-lg">Recent Companies</h2>
                            <a href="/superadmin/companies" className="text-blue-600 text-sm hover:underline">View All</a>
                        </div>
                        <div className="divide-y">
                            {recentCompanies.map((company, index) => (
                                <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                            <BuildingOffice2Icon className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <div className="font-medium">{company.name}</div>
                                            <div className="text-sm text-gray-500">{company.plan} • {company.users} users</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            company.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {company.status}
                                        </span>
                                        <div className="text-xs text-gray-500 mt-1">{company.joinedAt}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* System Alerts */}
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="p-4 border-b">
                            <h2 className="font-semibold">System Alerts</h2>
                        </div>
                        <div className="p-4 space-y-3">
                            {systemAlerts.map((alert, index) => (
                                <div key={index} className={`p-3 rounded-lg text-sm ${
                                    alert.type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
                                    alert.type === 'success' ? 'bg-green-50 text-green-800' :
                                    alert.type === 'error' ? 'bg-red-50 text-red-800' :
                                    'bg-blue-50 text-blue-800'
                                }`}>
                                    <div>{alert.message}</div>
                                    <div className="text-xs opacity-75 mt-1">{alert.time}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Companies */}
                <div className="bg-white rounded-xl shadow-sm mt-6">
                    <div className="p-4 border-b">
                        <h2 className="font-semibold text-lg">Top Performing Companies</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Rank</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Company</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Revenue</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Bookings</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {topCompanies.map((company, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-medium">
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-medium">{company.name}</td>
                                        <td className="px-4 py-3 font-medium">₹{(company.revenue / 10000000).toFixed(1)}Cr</td>
                                        <td className="px-4 py-3">{company.bookings.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
