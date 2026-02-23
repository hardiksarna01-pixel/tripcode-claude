import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    CurrencyRupeeIcon,
    TicketIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    CalendarIcon,
    ChartBarIcon,
    UserGroupIcon,
    PaperAirplaneIcon,
    BuildingOfficeIcon,
    TruckIcon,
    GlobeAltIcon,
    ShieldCheckIcon,
    ClockIcon,
    BellIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowRightIcon,
    BanknotesIcon,
    CreditCardIcon,
    SparklesIcon,
    IdentificationIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const AgentDashboard = () => {
    const [stats, setStats] = useState({
        walletBalance: 45600,
        creditLimit: 100000,
        availableCredit: 54400,
        todayBookings: 12,
        monthBookings: 156,
        todayRevenue: 125000,
        monthRevenue: 2850000,
        pendingPayments: 15600,
        totalCommission: 45200,
        monthCommission: 8500
    });
    const [recentBookings, setRecentBookings] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('today');

    useEffect(() => {
        fetchDashboardData();
    }, [dateRange]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/agent/dashboard?range=${dateRange}`);
            if (response.data) {
                setStats(response.data.stats);
                setRecentBookings(response.data.recentBookings);
                setNotifications(response.data.notifications);
            }
        } catch (error) {
            console.error('Error fetching dashboard:', error);
            setRecentBookings(mockRecentBookings);
            setNotifications(mockNotifications);
        } finally {
            setLoading(false);
        }
    };

    const mockRecentBookings = [
        { id: 'BK001', type: 'flight', customer: 'Rahul Sharma', route: 'DEL → BOM', amount: 8500, status: 'confirmed', commission: 425, time: '10 mins ago' },
        { id: 'BK002', type: 'hotel', customer: 'Priya Patel', route: 'Goa - Taj Hotel', amount: 15600, status: 'confirmed', commission: 936, time: '25 mins ago' },
        { id: 'BK003', type: 'flight', customer: 'Amit Kumar', route: 'BLR → CCU', amount: 12300, status: 'pending', commission: 615, time: '1 hour ago' },
        { id: 'BK004', type: 'bus', customer: 'Sneha Gupta', route: 'Mumbai → Pune', amount: 1200, status: 'confirmed', commission: 60, time: '2 hours ago' },
        { id: 'BK005', type: 'holiday', customer: 'Vikram Singh', route: 'Kerala Package', amount: 45000, status: 'processing', commission: 4500, time: '3 hours ago' }
    ];

    const mockNotifications = [
        { id: 1, type: 'warning', message: 'Your wallet balance is low. Recharge to continue booking.', time: '5 mins ago' },
        { id: 2, type: 'success', message: 'Commission of ₹1,250 credited to your account.', time: '1 hour ago' },
        { id: 3, type: 'info', message: 'New promotional offer on international flights - Extra 2% commission!', time: '3 hours ago' },
        { id: 4, type: 'alert', message: 'Flight 6E-2154 schedule changed. Please inform customer.', time: '5 hours ago' }
    ];

    const quickActions = [
        { name: 'Book Flight', icon: PaperAirplaneIcon, path: '/flights', color: 'blue' },
        { name: 'Book Hotel', icon: BuildingOfficeIcon, path: '/hotels', color: 'green' },
        { name: 'Book Bus', icon: TruckIcon, path: '/bus', color: 'orange' },
        { name: 'Holiday Package', icon: GlobeAltIcon, path: '/holidays', color: 'purple' },
        { name: 'Visa Service', icon: IdentificationIcon, path: '/visa', color: 'red' },
        { name: 'Travel Insurance', icon: ShieldCheckIcon, path: '/insurance', color: 'teal' }
    ];

    const getBookingTypeIcon = (type) => {
        switch (type) {
            case 'flight': return PaperAirplaneIcon;
            case 'hotel': return BuildingOfficeIcon;
            case 'bus': return TruckIcon;
            case 'holiday': return GlobeAltIcon;
            default: return TicketIcon;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
            case 'warning': return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
            case 'alert': return <BellIcon className="w-5 h-5 text-red-500" />;
            default: return <BellIcon className="w-5 h-5 text-blue-500" />;
        }
    };

    const getColorClasses = (color) => {
        const colors = {
            blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
            green: 'bg-green-100 text-green-600 hover:bg-green-200',
            orange: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
            purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
            red: 'bg-red-100 text-red-600 hover:bg-red-200',
            teal: 'bg-teal-100 text-teal-600 hover:bg-teal-200'
        };
        return colors[color] || colors.blue;
    };

    const walletPercentage = ((stats.walletBalance + stats.availableCredit) / (stats.creditLimit + stats.walletBalance)) * 100;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="text-white">
                            <h1 className="text-2xl font-bold">Welcome back, Agent!</h1>
                            <p className="text-blue-100 mt-1">Here's your business overview</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="bg-white/20 text-white border-white/30 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-white/50"
                            >
                                <option value="today" className="text-gray-900">Today</option>
                                <option value="week" className="text-gray-900">This Week</option>
                                <option value="month" className="text-gray-900">This Month</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-6 pb-8">
                {/* Wallet & Credit Card */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <BanknotesIcon className="w-6 h-6" />
                                Wallet & Credit
                            </h2>
                            <Link to="/agent/wallet" className="text-sm text-blue-200 hover:text-white flex items-center gap-1">
                                Manage <ArrowRightIcon className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                            <div>
                                <p className="text-blue-200 text-sm">Wallet Balance</p>
                                <p className="text-3xl font-bold mt-1">₹{stats.walletBalance.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-blue-200 text-sm">Available Credit</p>
                                <p className="text-3xl font-bold mt-1">₹{stats.availableCredit.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-blue-200 text-sm">Credit Limit</p>
                                <p className="text-3xl font-bold mt-1">₹{stats.creditLimit.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="mt-6">
                            <div className="flex justify-between text-sm mb-2">
                                <span>Total Available: ₹{(stats.walletBalance + stats.availableCredit).toLocaleString()}</span>
                                <span>{walletPercentage.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-3">
                                <div
                                    className="bg-green-400 h-3 rounded-full transition-all"
                                    style={{ width: `${walletPercentage}%` }}
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <Link
                                to="/agent/wallet/recharge"
                                className="flex-1 bg-white text-blue-600 py-3 rounded-xl font-semibold text-center hover:bg-blue-50 transition"
                            >
                                + Add Money
                            </Link>
                            <Link
                                to="/agent/wallet/transfer"
                                className="flex-1 bg-white/20 text-white py-3 rounded-xl font-semibold text-center hover:bg-white/30 transition"
                            >
                                Transfer
                            </Link>
                        </div>
                    </div>

                    {/* Commission Card */}
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <SparklesIcon className="w-6 h-6" />
                                Commissions
                            </h2>
                        </div>
                        <div className="mb-4">
                            <p className="text-green-100 text-sm">Total Earned</p>
                            <p className="text-3xl font-bold mt-1">₹{stats.totalCommission.toLocaleString()}</p>
                        </div>
                        <div className="bg-white/20 rounded-xl p-4">
                            <p className="text-green-100 text-sm">This Month</p>
                            <p className="text-2xl font-bold">₹{stats.monthCommission.toLocaleString()}</p>
                            <div className="flex items-center gap-1 mt-1 text-green-200">
                                <ArrowTrendingUpIcon className="w-4 h-4" />
                                <span className="text-sm">+15% from last month</span>
                            </div>
                        </div>
                        <Link
                            to="/agent/commissions"
                            className="block w-full mt-4 bg-white/20 text-white py-2 rounded-lg text-center text-sm font-medium hover:bg-white/30 transition"
                        >
                            View Commission History →
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
                        <div className="text-2xl font-bold text-gray-900">{stats.todayBookings}</div>
                        <div className="text-xs text-gray-500">Today's Bookings</div>
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
                        <div className="text-2xl font-bold text-gray-900">₹{(stats.todayRevenue / 1000).toFixed(0)}K</div>
                        <div className="text-xs text-gray-500">Today's Revenue</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <ChartBarIcon className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{stats.monthBookings}</div>
                        <div className="text-xs text-gray-500">Month Bookings</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <ClockIcon className="w-5 h-5 text-orange-600" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">₹{(stats.pendingPayments / 1000).toFixed(1)}K</div>
                        <div className="text-xs text-gray-500">Pending Payments</div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <h2 className="font-semibold text-lg text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                        {quickActions.map((action, index) => (
                            <Link
                                key={index}
                                to={action.path}
                                className={`flex flex-col items-center p-4 rounded-xl transition ${getColorClasses(action.color)}`}
                            >
                                <action.icon className="w-8 h-8 mb-2" />
                                <span className="text-sm font-medium text-center">{action.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Bookings */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h2 className="font-semibold text-lg">Recent Bookings</h2>
                            <Link to="/agent/bookings" className="text-blue-600 text-sm hover:underline">View All</Link>
                        </div>
                        <div className="divide-y">
                            {(recentBookings.length > 0 ? recentBookings : mockRecentBookings).map((booking, index) => {
                                const Icon = getBookingTypeIcon(booking.type);
                                return (
                                    <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <Icon className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{booking.id}</div>
                                                <div className="text-sm text-gray-500">{booking.customer} • {booking.route}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium text-gray-900">₹{booking.amount.toLocaleString()}</div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-green-600">+₹{booking.commission}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h2 className="font-semibold text-lg flex items-center gap-2">
                                <BellIcon className="w-5 h-5 text-gray-400" />
                                Notifications
                            </h2>
                            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                                {notifications.length || mockNotifications.length}
                            </span>
                        </div>
                        <div className="divide-y max-h-96 overflow-y-auto">
                            {(notifications.length > 0 ? notifications : mockNotifications).map((notification, index) => (
                                <div key={index} className="p-4 hover:bg-gray-50 transition">
                                    <div className="flex items-start gap-3">
                                        {getNotificationIcon(notification.type)}
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-700">{notification.message}</p>
                                            <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t">
                            <Link to="/agent/notifications" className="text-blue-600 text-sm hover:underline block text-center">
                                View All Notifications
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Performance Analytics */}
                <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-semibold text-lg">Monthly Performance</h2>
                        <Link to="/agent/reports" className="text-blue-600 text-sm hover:underline">Detailed Reports →</Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                            { label: 'Flights', value: 89, percentage: 45 },
                            { label: 'Hotels', value: 34, percentage: 25 },
                            { label: 'Buses', value: 23, percentage: 15 },
                            { label: 'Holidays', value: 8, percentage: 10 },
                            { label: 'Others', value: 2, percentage: 5 }
                        ].map((item, index) => (
                            <div key={index} className="text-center">
                                <div className="relative w-20 h-20 mx-auto mb-2">
                                    <svg className="w-20 h-20 transform -rotate-90">
                                        <circle
                                            cx="40"
                                            cy="40"
                                            r="35"
                                            stroke="#e5e7eb"
                                            strokeWidth="6"
                                            fill="none"
                                        />
                                        <circle
                                            cx="40"
                                            cy="40"
                                            r="35"
                                            stroke="#3b82f6"
                                            strokeWidth="6"
                                            fill="none"
                                            strokeDasharray={`${item.percentage * 2.2} 220`}
                                        />
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                                        {item.value}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600">{item.label}</div>
                                <div className="text-xs text-gray-400">{item.percentage}%</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentDashboard;
