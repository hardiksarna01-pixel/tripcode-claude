import React, { useState } from 'react';
import {
    ChartBarIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    BuildingOffice2Icon,
    UsersIcon,
    CurrencyRupeeIcon
} from '@heroicons/react/24/outline';

const SuperAdminAnalytics = () => {
    const [dateRange, setDateRange] = useState('month');

    const metrics = [
        { name: 'Total Revenue', value: '₹125Cr', change: '+18.5%', trend: 'up' },
        { name: 'Active Companies', value: '118', change: '+12', trend: 'up' },
        { name: 'Total Users', value: '45.6K', change: '+2.8K', trend: 'up' },
        { name: 'Bookings', value: '1.25M', change: '+15.2%', trend: 'up' },
        { name: 'API Calls', value: '456M', change: '+22%', trend: 'up' },
        { name: 'Avg Response Time', value: '145ms', change: '-12ms', trend: 'up' }
    ];

    const companyGrowth = [
        { month: 'Jan', companies: 95 },
        { month: 'Feb', companies: 98 },
        { month: 'Mar', companies: 105 },
        { month: 'Apr', companies: 110 },
        { month: 'May', companies: 115 },
        { month: 'Jun', companies: 118 }
    ];

    const revenueByPlan = [
        { plan: 'Enterprise', revenue: 42000000, percentage: 56 },
        { plan: 'Professional', revenue: 24000000, percentage: 32 },
        { plan: 'Starter', revenue: 9000000, percentage: 12 }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Platform Analytics</h1>
                            <p className="text-indigo-200">Insights and performance metrics</p>
                        </div>
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                        >
                            <option value="week" className="text-gray-900">This Week</option>
                            <option value="month" className="text-gray-900">This Month</option>
                            <option value="quarter" className="text-gray-900">This Quarter</option>
                            <option value="year" className="text-gray-900">This Year</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                    {metrics.map((metric, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm p-4">
                            <div className="text-gray-500 text-sm">{metric.name}</div>
                            <div className="text-xl font-bold mt-1">{metric.value}</div>
                            <div className={`text-xs flex items-center gap-1 mt-1 ${
                                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {metric.trend === 'up' ? (
                                    <ArrowTrendingUpIcon className="w-3 h-3" />
                                ) : (
                                    <ArrowTrendingDownIcon className="w-3 h-3" />
                                )}
                                {metric.change}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Company Growth */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="font-semibold mb-4">Company Growth</h2>
                        <div className="h-64 flex items-end justify-between gap-2">
                            {companyGrowth.map((data, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center">
                                    <div
                                        className="w-full bg-indigo-500 rounded-t"
                                        style={{ height: `${((data.companies - 90) / 30) * 200}px` }}
                                    />
                                    <div className="text-xs text-gray-500 mt-2">{data.month}</div>
                                    <div className="text-xs font-medium">{data.companies}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Revenue by Plan */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="font-semibold mb-4">Revenue by Plan</h2>
                        <div className="space-y-4">
                            {revenueByPlan.map((plan, index) => (
                                <div key={index}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium">{plan.plan}</span>
                                        <span className="text-gray-500">₹{(plan.revenue / 10000000).toFixed(1)}Cr ({plan.percentage}%)</span>
                                    </div>
                                    <div className="h-3 bg-gray-100 rounded-full">
                                        <div
                                            className="h-3 bg-indigo-500 rounded-full"
                                            style={{ width: `${plan.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t">
                            <div className="flex justify-between">
                                <span className="font-medium">Total MRR</span>
                                <span className="font-bold text-indigo-600">₹75L</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Companies */}
                <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-4 border-b">
                        <h2 className="font-semibold">Top Performing Companies</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Rank</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Company</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Plan</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Revenue</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Bookings</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Growth</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {[
                                    { name: 'TravelMax India', plan: 'Enterprise', revenue: 125000000, bookings: 15680, growth: '+18%' },
                                    { name: 'Global Trips', plan: 'Professional', revenue: 98000000, bookings: 12450, growth: '+15%' },
                                    { name: 'JetSet Tours', plan: 'Professional', revenue: 78000000, bookings: 9870, growth: '+12%' },
                                    { name: 'Voyage Plus', plan: 'Enterprise', revenue: 65000000, bookings: 8560, growth: '+22%' },
                                    { name: 'TripMaster Pro', plan: 'Enterprise', revenue: 52000000, bookings: 6780, growth: '+8%' }
                                ].map((company, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-medium">
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-medium">{company.name}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                company.plan === 'Enterprise' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {company.plan}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-medium">₹{(company.revenue / 10000000).toFixed(1)}Cr</td>
                                        <td className="px-4 py-3">{company.bookings.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-green-600">{company.growth}</td>
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

export default SuperAdminAnalytics;
