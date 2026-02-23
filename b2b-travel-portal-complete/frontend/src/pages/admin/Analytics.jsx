import React, { useState } from 'react';
import {
    ChartBarIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    CalendarIcon,
    ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const AdminAnalytics = () => {
    const [dateRange, setDateRange] = useState('month');

    const kpis = [
        { name: 'Total Revenue', value: '₹4.56Cr', change: '+15.2%', trend: 'up' },
        { name: 'Total Bookings', value: '12,456', change: '+8.7%', trend: 'up' },
        { name: 'Active Agents', value: '980', change: '+5.3%', trend: 'up' },
        { name: 'Avg Booking Value', value: '₹36,580', change: '-2.1%', trend: 'down' },
        { name: 'Commission Earned', value: '₹45.6L', change: '+12.4%', trend: 'up' },
        { name: 'Conversion Rate', value: '68.5%', change: '+3.2%', trend: 'up' }
    ];

    const productBreakdown = [
        { product: 'Flights', bookings: 8500, revenue: 28500000, share: 62.5 },
        { product: 'Hotels', bookings: 2800, revenue: 12000000, share: 26.3 },
        { product: 'Buses', bookings: 850, revenue: 2500000, share: 5.5 },
        { product: 'Holidays', bookings: 180, revenue: 1800000, share: 3.9 },
        { product: 'Visa', bookings: 126, revenue: 800000, share: 1.8 }
    ];

    const topRoutes = [
        { route: 'DEL → BOM', bookings: 2450, revenue: 8500000 },
        { route: 'BLR → DEL', bookings: 1890, revenue: 6200000 },
        { route: 'BOM → GOI', bookings: 1560, revenue: 4800000 },
        { route: 'DEL → BLR', bookings: 1420, revenue: 5100000 },
        { route: 'CCU → DEL', bookings: 1280, revenue: 4200000 }
    ];

    const monthlyData = [
        { month: 'Jan', bookings: 8500, revenue: 32000000 },
        { month: 'Feb', bookings: 9200, revenue: 35000000 },
        { month: 'Mar', bookings: 10500, revenue: 42000000 },
        { month: 'Apr', bookings: 9800, revenue: 38000000 },
        { month: 'May', bookings: 11200, revenue: 45000000 },
        { month: 'Jun', bookings: 12456, revenue: 45600000 }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                            <p className="text-gray-600">Business insights and performance metrics</p>
                        </div>
                        <div className="flex gap-3">
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="border rounded-lg px-4 py-2"
                            >
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="quarter">This Quarter</option>
                                <option value="year">This Year</option>
                            </select>
                            <button className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50">
                                <ArrowDownTrayIcon className="w-5 h-5" />
                                Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* KPI Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                    {kpis.map((kpi, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm p-4">
                            <div className="text-gray-500 text-sm">{kpi.name}</div>
                            <div className="text-xl font-bold mt-1">{kpi.value}</div>
                            <div className={`text-xs flex items-center gap-1 mt-1 ${
                                kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {kpi.trend === 'up' ? (
                                    <ArrowTrendingUpIcon className="w-3 h-3" />
                                ) : (
                                    <ArrowTrendingDownIcon className="w-3 h-3" />
                                )}
                                {kpi.change}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Monthly Trend */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="font-semibold mb-4">Monthly Trend</h2>
                        <div className="h-64 flex items-end justify-between gap-2">
                            {monthlyData.map((data, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center">
                                    <div
                                        className="w-full bg-blue-500 rounded-t"
                                        style={{ height: `${(data.bookings / 15000) * 200}px` }}
                                    />
                                    <div className="text-xs text-gray-500 mt-2">{data.month}</div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center gap-6 mt-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded" />
                                <span className="text-gray-600">Bookings</span>
                            </div>
                        </div>
                    </div>

                    {/* Product Breakdown */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="font-semibold mb-4">Product Breakdown</h2>
                        <div className="space-y-4">
                            {productBreakdown.map((product, index) => (
                                <div key={index}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium">{product.product}</span>
                                        <span className="text-sm text-gray-500">{product.share}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full">
                                        <div
                                            className="h-2 bg-blue-500 rounded-full"
                                            style={{ width: `${product.share}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>{product.bookings.toLocaleString()} bookings</span>
                                        <span>₹{(product.revenue / 100000).toFixed(1)}L</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Routes */}
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="p-4 border-b">
                            <h2 className="font-semibold">Top Flight Routes</h2>
                        </div>
                        <div className="divide-y">
                            {topRoutes.map((route, index) => (
                                <div key={index} className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <div className="font-medium">{route.route}</div>
                                            <div className="text-sm text-gray-500">{route.bookings.toLocaleString()} bookings</div>
                                        </div>
                                    </div>
                                    <div className="font-medium">₹{(route.revenue / 100000).toFixed(1)}L</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Performing Agents */}
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="p-4 border-b">
                            <h2 className="font-semibold">Top Performing Agents</h2>
                        </div>
                        <div className="divide-y">
                            {[
                                { name: 'ABC Travels', bookings: 456, revenue: 18500000 },
                                { name: 'XYZ Tours', bookings: 389, revenue: 15200000 },
                                { name: 'Travel World', bookings: 342, revenue: 13800000 },
                                { name: 'Fly High', bookings: 298, revenue: 11500000 },
                                { name: 'Trip Masters', bookings: 267, revenue: 10200000 }
                            ].map((agent, index) => (
                                <div key={index} className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium text-green-600">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <div className="font-medium">{agent.name}</div>
                                            <div className="text-sm text-gray-500">{agent.bookings} bookings</div>
                                        </div>
                                    </div>
                                    <div className="font-medium text-green-600">₹{(agent.revenue / 100000).toFixed(1)}L</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
