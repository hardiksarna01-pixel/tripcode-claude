import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../services/api';

const ReportsPage = () => {
    const [period, setPeriod] = useState('month');
    const [stats, setStats] = useState(null);
    const [topRoutes, setTopRoutes] = useState([]);
    const [topAirlines, setTopAirlines] = useState([]);
    const [commissions, setCommissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [period]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Mock data
            setStats({
                totalBookings: 156,
                totalRevenue: 2450000,
                totalCommission: 98000,
                pendingBookings: 12,
                cancelledBookings: 8,
                bookingsChange: 15,
                revenueChange: 12,
                commissionChange: 18
            });

            setTopRoutes([
                { origin: 'DEL', destination: 'BOM', bookings: 45, revenue: 450000 },
                { origin: 'BLR', destination: 'DEL', bookings: 38, revenue: 380000 },
                { origin: 'CCU', destination: 'BLR', bookings: 32, revenue: 320000 },
                { origin: 'MAA', destination: 'DEL', bookings: 28, revenue: 280000 },
                { origin: 'HYD', destination: 'BOM', bookings: 25, revenue: 250000 }
            ]);

            setTopAirlines([
                { code: '6E', name: 'IndiGo', bookings: 52, share: 33 },
                { code: 'AI', name: 'Air India', bookings: 45, share: 29 },
                { code: 'UK', name: 'Vistara', bookings: 28, share: 18 },
                { code: 'SG', name: 'SpiceJet', bookings: 22, share: 14 },
                { code: 'G8', name: 'Go First', bookings: 9, share: 6 }
            ]);

            setCommissions([
                { date: '2025-12-26', bookingRef: 'TRP001', airline: 'Air India', route: 'DEL-BOM', fare: 12450, commission: 450, status: 'credited' },
                { date: '2025-12-25', bookingRef: 'TRP002', airline: 'IndiGo', route: 'BLR-DEL', fare: 8900, commission: 320, status: 'credited' },
                { date: '2025-12-24', bookingRef: 'TRP003', airline: 'Vistara', route: 'CCU-MAA', fare: 15200, commission: 580, status: 'pending' },
                { date: '2025-12-23', bookingRef: 'TRP004', airline: 'SpiceJet', route: 'HYD-GOI', fare: 6800, commission: 245, status: 'credited' },
                { date: '2025-12-22', bookingRef: 'TRP005', airline: 'Air India', route: 'DEL-CCU', fare: 9500, commission: 380, status: 'credited' }
            ]);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = (type) => {
        alert(`Exporting ${type} report as PDF...`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                        <p className="text-gray-500">Track your business performance</p>
                    </div>
                    <div className="flex gap-4">
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="week">Last 7 Days</option>
                            <option value="month">Last 30 Days</option>
                            <option value="quarter">Last 90 Days</option>
                            <option value="year">Last Year</option>
                        </select>
                        <button
                            onClick={() => handleExport('full')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export Report
                        </button>
                    </div>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500">Total Bookings</p>
                                <p className="text-3xl font-bold mt-1">{stats.totalBookings}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${stats.bookingsChange >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {stats.bookingsChange >= 0 ? '+' : ''}{stats.bookingsChange}%
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">vs previous period</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500">Total Revenue</p>
                                <p className="text-3xl font-bold mt-1">₹{(stats.totalRevenue / 100000).toFixed(1)}L</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${stats.revenueChange >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {stats.revenueChange >= 0 ? '+' : ''}{stats.revenueChange}%
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">vs previous period</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500">Commission Earned</p>
                                <p className="text-3xl font-bold mt-1 text-green-600">₹{(stats.totalCommission / 1000).toFixed(1)}K</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${stats.commissionChange >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {stats.commissionChange >= 0 ? '+' : ''}{stats.commissionChange}%
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">vs previous period</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div>
                            <p className="text-sm text-gray-500">Pending Bookings</p>
                            <p className="text-3xl font-bold mt-1 text-yellow-600">{stats.pendingBookings}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{stats.cancelledBookings} cancelled</p>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Top Routes */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="font-semibold mb-4">Top Routes</h3>
                        <div className="space-y-4">
                            {topRoutes.map((route, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                                            {idx + 1}
                                        </span>
                                        <span className="font-medium">{route.origin} → {route.destination}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">{route.bookings} bookings</p>
                                        <p className="text-sm text-gray-500">₹{(route.revenue / 1000).toFixed(0)}K</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Airlines */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="font-semibold mb-4">Top Airlines</h3>
                        <div className="space-y-4">
                            {topAirlines.map((airline, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between mb-1">
                                        <span className="font-medium">{airline.name}</span>
                                        <span className="text-sm text-gray-500">{airline.bookings} bookings ({airline.share}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${airline.share}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Commission Report */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="font-semibold">Commission Report</h3>
                        <button
                            onClick={() => handleExport('commission')}
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking Ref</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Airline</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Fare</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Commission</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {commissions.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(item.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                            {item.bookingRef}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.airline}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.route}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                            ₹{item.fare.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 text-right">
                                            ₹{item.commission.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                item.status === 'credited' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50">
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-sm font-medium text-gray-900">Total</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                                        ₹{commissions.reduce((sum, c) => sum + c.fare, 0).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-green-600 text-right">
                                        ₹{commissions.reduce((sum, c) => sum + c.commission, 0).toLocaleString()}
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
