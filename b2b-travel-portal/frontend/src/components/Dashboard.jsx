import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { walletApi, bookingApi, agentApi } from '../services/api';

/**
 * Dashboard Component
 * Main landing page after login
 */
const Dashboard = () => {
    const navigate = useNavigate();
    const { agent, logout } = useAuthStore();

    const [walletBalance, setWalletBalance] = useState(null);
    const [recentBookings, setRecentBookings] = useState([]);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setIsLoading(true);
        try {
            const [walletRes, bookingsRes, statsRes] = await Promise.all([
                walletApi.getBalance(),
                bookingApi.getHistory({ limit: 5 }),
                agentApi.getStats('month')
            ]);

            setWalletBalance(walletRes.data);
            setRecentBookings(bookingsRes.data?.bookings || []);
            setStats(statsRes.data);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const StatCard = ({ title, value, subtitle, color, icon }) => (
        <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${color}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">{title}</p>
                    <p className="text-2xl font-bold mt-1">{value}</p>
                    {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
                </div>
                <div className="text-3xl opacity-50">{icon}</div>
            </div>
        </div>
    );

    const QuickAction = ({ title, description, href, icon, color }) => (
        <Link
            to={href}
            className={`block bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition border-t-4 ${color}`}
        >
            <div className="text-3xl mb-3">{icon}</div>
            <h3 className="font-semibold text-gray-800">{title}</h3>
            <p className="text-gray-500 text-sm mt-1">{description}</p>
        </Link>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <h1 className="text-xl font-bold">TripCode</h1>
                        <nav className="hidden md:flex space-x-4">
                            <Link to="/flights" className="flex items-center space-x-1 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition">
                                <span>FLIGHT</span>
                            </Link>
                            <Link to="/bookings" className="flex items-center space-x-1 hover:bg-green-500 px-4 py-2 rounded transition">
                                <span>BOOKINGS</span>
                            </Link>
                            <Link to="/wallet" className="flex items-center space-x-1 hover:bg-green-500 px-4 py-2 rounded transition">
                                <span>WALLET</span>
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold">
                            {walletBalance ? `₹ ${walletBalance.effectiveBalance?.toLocaleString()}` : '...'}
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                {agent?.companyName?.charAt(0) || 'A'}
                            </div>
                            <div className="hidden md:block">
                                <p className="font-medium">{agent?.companyName}</p>
                                <p className="text-xs text-green-200">{agent?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-white hover:bg-green-500 px-3 py-2 rounded transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Welcome back, {agent?.companyName}!
                    </h2>
                    <p className="text-gray-500">Here's what's happening with your bookings today.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Wallet Balance"
                        value={walletBalance ? `₹${walletBalance.walletBalance?.toLocaleString()}` : '...'}
                        subtitle={walletBalance?.creditLimit > 0 ? `Credit: ₹${walletBalance.creditLimit}` : null}
                        color="border-green-500"
                        icon="💰"
                    />
                    <StatCard
                        title="Total Bookings"
                        value={stats?.total_bookings || 0}
                        subtitle="This month"
                        color="border-blue-500"
                        icon="📋"
                    />
                    <StatCard
                        title="Ticketed"
                        value={stats?.ticketed_bookings || 0}
                        subtitle="Successfully issued"
                        color="border-purple-500"
                        icon="🎫"
                    />
                    <StatCard
                        title="Commission Earned"
                        value={stats?.total_commission ? `₹${parseFloat(stats.total_commission).toLocaleString()}` : '₹0'}
                        subtitle="This month"
                        color="border-orange-500"
                        icon="💵"
                    />
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <QuickAction
                            title="Search Flights"
                            description="Find and book flights for your customers"
                            href="/flights"
                            icon="✈️"
                            color="border-blue-500"
                        />
                        <QuickAction
                            title="View Bookings"
                            description="Manage your booking history"
                            href="/bookings"
                            icon="📒"
                            color="border-green-500"
                        />
                        <QuickAction
                            title="Add Funds"
                            description="Top up your wallet balance"
                            href="/wallet"
                            icon="💳"
                            color="border-yellow-500"
                        />
                        <QuickAction
                            title="Profile"
                            description="Update your account settings"
                            href="/profile"
                            icon="⚙️"
                            color="border-gray-500"
                        />
                    </div>
                </div>

                {/* Recent Bookings */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Recent Bookings</h3>
                        <Link to="/bookings" className="text-blue-600 hover:underline text-sm">
                            View All
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                            <p className="text-gray-500 mt-2">Loading...</p>
                        </div>
                    ) : recentBookings.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-gray-500 text-sm border-b">
                                        <th className="pb-3">Ref No</th>
                                        <th className="pb-3">Route</th>
                                        <th className="pb-3">Date</th>
                                        <th className="pb-3">Amount</th>
                                        <th className="pb-3">Status</th>
                                        <th className="pb-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentBookings.map((booking) => (
                                        <tr key={booking.booking_ref_no} className="border-b last:border-0">
                                            <td className="py-3 font-medium">{booking.booking_ref_no}</td>
                                            <td className="py-3">{booking.tripDetails || 'N/A'}</td>
                                            <td className="py-3 text-gray-500">
                                                {new Date(booking.booking_date).toLocaleDateString()}
                                            </td>
                                            <td className="py-3">₹{parseFloat(booking.gross_amount).toLocaleString()}</td>
                                            <td className="py-3">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    booking.status === 'TICKETED' ? 'bg-green-100 text-green-800' :
                                                    booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                    booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <Link
                                                    to={`/bookings/${booking.booking_ref_no}`}
                                                    className="text-blue-600 hover:underline text-sm"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No bookings yet</p>
                            <Link to="/flights" className="text-blue-600 hover:underline mt-2 inline-block">
                                Book your first flight
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
