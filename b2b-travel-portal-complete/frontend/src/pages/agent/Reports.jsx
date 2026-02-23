import React, { useState, useEffect } from 'react';
import {
    ChartBarIcon,
    ArrowDownTrayIcon,
    CalendarIcon,
    FunnelIcon,
    DocumentTextIcon,
    CurrencyRupeeIcon,
    TicketIcon,
    UserGroupIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    PaperAirplaneIcon,
    BuildingOfficeIcon,
    TruckIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const AgentReports = () => {
    const [reportType, setReportType] = useState('booking');
    const [dateRange, setDateRange] = useState('month');
    const [customDateFrom, setCustomDateFrom] = useState('');
    const [customDateTo, setCustomDateTo] = useState('');
    const [loading, setLoading] = useState(false);

    const [bookingStats, setBookingStats] = useState({
        total: 156,
        confirmed: 142,
        cancelled: 8,
        pending: 6,
        totalRevenue: 2850000,
        totalCommission: 142500,
        avgBookingValue: 18269
    });

    const [productWise, setProductWise] = useState([
        { name: 'Flights', bookings: 89, revenue: 1250000, commission: 62500, growth: 12 },
        { name: 'Hotels', bookings: 34, revenue: 890000, commission: 53400, growth: 8 },
        { name: 'Bus', bookings: 23, revenue: 115000, commission: 5750, growth: -3 },
        { name: 'Holidays', bookings: 8, revenue: 560000, commission: 56000, growth: 25 },
        { name: 'Others', bookings: 2, revenue: 35000, commission: 1750, growth: 0 }
    ]);

    const [monthlyData, setMonthlyData] = useState([
        { month: 'Jan', bookings: 120, revenue: 2100000 },
        { month: 'Feb', bookings: 135, revenue: 2400000 },
        { month: 'Mar', bookings: 145, revenue: 2650000 },
        { month: 'Apr', bookings: 128, revenue: 2300000 },
        { month: 'May', bookings: 142, revenue: 2550000 },
        { month: 'Jun', bookings: 156, revenue: 2850000 }
    ]);

    const [topCustomers, setTopCustomers] = useState([
        { name: 'Rahul Sharma', bookings: 15, revenue: 285000 },
        { name: 'Priya Patel', bookings: 12, revenue: 245000 },
        { name: 'Amit Kumar', bookings: 10, revenue: 198000 },
        { name: 'Sneha Gupta', bookings: 8, revenue: 156000 },
        { name: 'Vikram Singh', bookings: 7, revenue: 142000 }
    ]);

    const reportTypes = [
        { id: 'booking', name: 'Booking Report', icon: TicketIcon },
        { id: 'revenue', name: 'Revenue Report', icon: CurrencyRupeeIcon },
        { id: 'commission', name: 'Commission Report', icon: ChartBarIcon },
        { id: 'customer', name: 'Customer Report', icon: UserGroupIcon }
    ];

    const exportReport = (format) => {
        // Handle export
        console.log(`Exporting as ${format}`);
    };

    const getProductIcon = (name) => {
        switch (name) {
            case 'Flights': return PaperAirplaneIcon;
            case 'Hotels': return BuildingOfficeIcon;
            case 'Bus': return TruckIcon;
            case 'Holidays': return GlobeAltIcon;
            default: return TicketIcon;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <ChartBarIcon className="w-8 h-8 text-blue-600" />
                                Reports & Analytics
                            </h1>
                            <p className="text-gray-600 mt-1">Analyze your business performance</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => exportReport('pdf')}
                                className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50"
                            >
                                <DocumentTextIcon className="w-5 h-5" />
                                Export PDF
                            </button>
                            <button
                                onClick={() => exportReport('excel')}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700"
                            >
                                <ArrowDownTrayIcon className="w-5 h-5" />
                                Export Excel
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex gap-2">
                            {reportTypes.map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => setReportType(type.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                                        reportType === type.id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <type.icon className="w-4 h-4" />
                                    {type.name}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="border rounded-lg px-4 py-2"
                            >
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="quarter">This Quarter</option>
                                <option value="year">This Year</option>
                                <option value="custom">Custom Range</option>
                            </select>
                            {dateRange === 'custom' && (
                                <div className="flex gap-2">
                                    <input
                                        type="date"
                                        value={customDateFrom}
                                        onChange={(e) => setCustomDateFrom(e.target.value)}
                                        className="border rounded-lg px-3 py-2"
                                    />
                                    <input
                                        type="date"
                                        value={customDateTo}
                                        onChange={(e) => setCustomDateTo(e.target.value)}
                                        className="border rounded-lg px-3 py-2"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <TicketIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="text-xs text-green-600 flex items-center gap-1">
                                <ArrowTrendingUpIcon className="w-3 h-3" />
                                +12%
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{bookingStats.total}</div>
                        <div className="text-sm text-gray-500">Total Bookings</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CurrencyRupeeIcon className="w-5 h-5 text-green-600" />
                            </div>
                            <span className="text-xs text-green-600 flex items-center gap-1">
                                <ArrowTrendingUpIcon className="w-3 h-3" />
                                +8%
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">₹{(bookingStats.totalRevenue / 100000).toFixed(1)}L</div>
                        <div className="text-sm text-gray-500">Total Revenue</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <ChartBarIcon className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">₹{(bookingStats.totalCommission / 1000).toFixed(0)}K</div>
                        <div className="text-sm text-gray-500">Total Commission</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <CurrencyRupeeIcon className="w-5 h-5 text-orange-600" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">₹{bookingStats.avgBookingValue.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">Avg. Booking Value</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Product-wise Breakdown */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="font-semibold text-lg text-gray-900 mb-4">Product-wise Performance</h3>
                        <div className="space-y-4">
                            {productWise.map((product, index) => {
                                const Icon = getProductIcon(product.name);
                                return (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                            product.name === 'Flights' ? 'bg-blue-100' :
                                            product.name === 'Hotels' ? 'bg-green-100' :
                                            product.name === 'Bus' ? 'bg-orange-100' :
                                            product.name === 'Holidays' ? 'bg-purple-100' :
                                            'bg-gray-100'
                                        }`}>
                                            <Icon className={`w-5 h-5 ${
                                                product.name === 'Flights' ? 'text-blue-600 rotate-45' :
                                                product.name === 'Hotels' ? 'text-green-600' :
                                                product.name === 'Bus' ? 'text-orange-600' :
                                                product.name === 'Holidays' ? 'text-purple-600' :
                                                'text-gray-600'
                                            }`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-medium text-gray-900">{product.name}</span>
                                                <span className="text-sm text-gray-500">{product.bookings} bookings</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{ width: `${(product.bookings / bookingStats.total) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">₹{(product.revenue / 1000).toFixed(0)}K</div>
                                            <span className={`text-xs ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {product.growth >= 0 ? '+' : ''}{product.growth}%
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Monthly Trend */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="font-semibold text-lg text-gray-900 mb-4">Monthly Trend</h3>
                        <div className="h-64 flex items-end gap-4">
                            {monthlyData.map((month, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center">
                                    <div
                                        className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600"
                                        style={{ height: `${(month.bookings / 160) * 100}%` }}
                                    />
                                    <div className="mt-2 text-sm text-gray-600">{month.month}</div>
                                    <div className="text-xs text-gray-400">{month.bookings}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Booking Status */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="font-semibold text-lg text-gray-900 mb-4">Booking Status Distribution</h3>
                        <div className="flex items-center justify-center mb-6">
                            <div className="relative w-48 h-48">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="96" cy="96" r="80" stroke="#e5e7eb" strokeWidth="20" fill="none" />
                                    <circle
                                        cx="96" cy="96" r="80"
                                        stroke="#10b981" strokeWidth="20" fill="none"
                                        strokeDasharray={`${(bookingStats.confirmed / bookingStats.total) * 502} 502`}
                                    />
                                    <circle
                                        cx="96" cy="96" r="80"
                                        stroke="#f59e0b" strokeWidth="20" fill="none"
                                        strokeDasharray={`${(bookingStats.pending / bookingStats.total) * 502} 502`}
                                        strokeDashoffset={`-${(bookingStats.confirmed / bookingStats.total) * 502}`}
                                    />
                                    <circle
                                        cx="96" cy="96" r="80"
                                        stroke="#ef4444" strokeWidth="20" fill="none"
                                        strokeDasharray={`${(bookingStats.cancelled / bookingStats.total) * 502} 502`}
                                        strokeDashoffset={`-${((bookingStats.confirmed + bookingStats.pending) / bookingStats.total) * 502}`}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-bold">{bookingStats.total}</span>
                                    <span className="text-sm text-gray-500">Total</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1" />
                                <div className="font-medium text-gray-900">{bookingStats.confirmed}</div>
                                <div className="text-xs text-gray-500">Confirmed</div>
                            </div>
                            <div className="text-center">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-1" />
                                <div className="font-medium text-gray-900">{bookingStats.pending}</div>
                                <div className="text-xs text-gray-500">Pending</div>
                            </div>
                            <div className="text-center">
                                <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1" />
                                <div className="font-medium text-gray-900">{bookingStats.cancelled}</div>
                                <div className="text-xs text-gray-500">Cancelled</div>
                            </div>
                        </div>
                    </div>

                    {/* Top Customers */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="font-semibold text-lg text-gray-900 mb-4">Top Customers</h3>
                        <div className="space-y-4">
                            {topCustomers.map((customer, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">{customer.name}</div>
                                        <div className="text-sm text-gray-500">{customer.bookings} bookings</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium text-gray-900">₹{(customer.revenue / 1000).toFixed(0)}K</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentReports;
