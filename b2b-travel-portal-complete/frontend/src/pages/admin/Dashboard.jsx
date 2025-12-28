import React, { useState, useEffect } from 'react';
import {
    UsersIcon,
    CurrencyRupeeIcon,
    TicketIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    CalendarIcon,
    ChartBarIcon,
    BuildingOfficeIcon,
    GlobeAltIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalAgents: 1250,
        activeAgents: 890,
        totalBookings: 15678,
        todayBookings: 145,
        totalRevenue: 45600000,
        todayRevenue: 1250000,
        pendingApprovals: 23,
        lowBalanceAgents: 45
    });
    const [recentBookings, setRecentBookings] = useState([]);
    const [topAgents, setTopAgents] = useState([]);
    const [dateRange, setDateRange] = useState('today');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, [dateRange]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/admin/dashboard?range=${dateRange}`);
            if (response.data) {
                setStats(response.data.stats);
                setRecentBookings(response.data.recentBookings);
                setTopAgents(response.data.topAgents);
            }
        } catch (error) {
            console.error('Error fetching dashboard:', error);
            // Use mock data
            setRecentBookings(mockRecentBookings);
            setTopAgents(mockTopAgents);
        } finally {
            setLoading(false);
        }
    };

    const mockRecentBookings = [
        { id: 'BK001', agent: 'ABC Travels', product: 'Flight', amount: 45000, status: 'Confirmed', time: '10 mins ago' },
        { id: 'BK002', agent: 'XYZ Tours', product: 'Hotel', amount: 28000, status: 'Pending', time: '25 mins ago' },
        { id: 'BK003', agent: 'Travel World', product: 'Holiday', amount: 125000, status: 'Confirmed', time: '1 hour ago' },
        { id: 'BK004', agent: 'Fly High', product: 'Flight', amount: 18000, status: 'Confirmed', time: '2 hours ago' },
        { id: 'BK005', agent: 'Trip Masters', product: 'Bus', amount: 3500, status: 'Cancelled', time: '3 hours ago' }
    ];

    const mockTopAgents = [
        { name: 'ABC Travels', bookings: 456, revenue: 4500000, growth: 12.5 },
        { name: 'XYZ Tours', bookings: 398, revenue: 3800000, growth: 8.2 },
        { name: 'Travel World', bookings: 345, revenue: 3200000, growth: 15.8 },
        { name: 'Fly High', bookings: 289, revenue: 2800000, growth: -2.5 },
        { name: 'Trip Masters', bookings: 256, revenue: 2500000, growth: 5.3 }
    ];

    const statCards = [
        { title: 'Total Agents', value: stats.totalAgents.toLocaleString(), change: '+12', positive: true, icon: UsersIcon, color: 'blue' },
        { title: 'Active Agents', value: stats.activeAgents.toLocaleString(), change: '+5', positive: true, icon: BuildingOfficeIcon, color: 'green' },
        { title: 'Total Bookings', value: stats.totalBookings.toLocaleString(), change: '+145', positive: true, icon: TicketIcon, color: 'purple' },
        { title: 'Today Revenue', value: `₹${(stats.todayRevenue / 100000).toFixed(1)}L`, change: '+8.5%', positive: true, icon: CurrencyRupeeIcon, color: 'orange' },
        { title: 'Pending Approvals', value: stats.pendingApprovals, change: '0', positive: true, icon: ClockIcon, color: 'yellow' },
        { title: 'Low Balance Agents', value: stats.lowBalanceAgents, change: '-5', positive: true, icon: ArrowTrendingDownIcon, color: 'red' }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getColorClasses = (color) => {
        const colors = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600',
            orange: 'bg-orange-100 text-orange-600',
            yellow: 'bg-yellow-100 text-yellow-600',
            red: 'bg-red-100 text-red-600'
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-sm text-gray-600">Welcome back! Here's what's happening today.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="quarter">This Quarter</option>
                                <option value="year">This Year</option>
                            </select>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                                Download Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    {statCards.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className={`p-2 rounded-lg ${getColorClasses(stat.color)}`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <span className={`text-xs font-medium flex items-center gap-1 ${
                                    stat.positive ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {stat.positive ? <ArrowTrendingUpIcon className="w-3 h-3" /> : <ArrowTrendingDownIcon className="w-3 h-3" />}
                                    {stat.change}
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                            <div className="text-xs text-gray-500">{stat.title}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Bookings */}
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h2 className="font-semibold text-lg">Recent Bookings</h2>
                            <a href="/admin/bookings" className="text-blue-600 text-sm hover:underline">View All</a>
                        </div>
                        <div className="p-4">
                            <div className="space-y-3">
                                {(recentBookings.length > 0 ? recentBookings : mockRecentBookings).map((booking, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <TicketIcon className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm">{booking.id}</div>
                                                <div className="text-xs text-gray-500">{booking.agent} • {booking.product}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium text-sm">₹{booking.amount.toLocaleString()}</div>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Top Agents */}
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h2 className="font-semibold text-lg">Top Performing Agents</h2>
                            <a href="/admin/agents" className="text-blue-600 text-sm hover:underline">View All</a>
                        </div>
                        <div className="p-4">
                            <div className="space-y-3">
                                {(topAgents.length > 0 ? topAgents : mockTopAgents).map((agent, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm">{agent.name}</div>
                                                <div className="text-xs text-gray-500">{agent.bookings} bookings</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium text-sm">₹{(agent.revenue / 100000).toFixed(1)}L</div>
                                            <span className={`text-xs ${agent.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {agent.growth >= 0 ? '+' : ''}{agent.growth}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-6 bg-white rounded-xl shadow-sm p-4">
                    <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {[
                            { name: 'Add Agent', icon: UsersIcon, path: '/admin/agents/add', color: 'blue' },
                            { name: 'Add Credit', icon: CurrencyRupeeIcon, path: '/admin/wallet/credit', color: 'green' },
                            { name: 'Pending Approvals', icon: ClockIcon, path: '/admin/approvals', color: 'yellow' },
                            { name: 'Generate Report', icon: ChartBarIcon, path: '/admin/reports', color: 'purple' },
                            { name: 'Supplier Config', icon: GlobeAltIcon, path: '/admin/suppliers', color: 'orange' },
                            { name: 'View Bookings', icon: TicketIcon, path: '/admin/bookings', color: 'pink' }
                        ].map((action, index) => (
                            <a
                                key={index}
                                href={action.path}
                                className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                            >
                                <div className={`p-3 rounded-lg ${getColorClasses(action.color)} mb-2`}>
                                    <action.icon className="w-6 h-6" />
                                </div>
                                <span className="text-sm font-medium text-center">{action.name}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
