import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  ClipboardList,
  Ticket,
  IndianRupee,
  Plane,
  FolderOpen,
  PlusCircle,
  User
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { agentAPI, bookingAPI, walletAPI } from '../../services/api';

const AgentDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    walletBalance: 0,
    totalBookings: 0,
    ticketed: 0,
    commissionEarned: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardRes, bookingsRes] = await Promise.all([
          agentAPI.getDashboard(),
          bookingAPI.getBookings({ limit: 5 }),
        ]);
        setStats(dashboardRes.data.stats || dashboardRes.data);
        setRecentBookings(bookingsRes.data.bookings || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ icon: Icon, label, value, subtitle, color }) => (
    <div className={`bg-white rounded-xl p-6 shadow-sm border-l-4 ${color}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <Icon className="w-6 h-6 text-gray-400" />
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ icon: Icon, title, description, to, color }) => (
    <Link
      to={to}
      className={`bg-white rounded-xl p-6 shadow-sm border-t-4 ${color} hover:shadow-md transition-shadow`}
    >
      <div className="text-3xl mb-3">{Icon}</div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-500 text-sm mt-1">{description}</p>
    </Link>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name || user?.contactName || 'Agent'}!
        </h1>
        <p className="text-gray-500">Here's what's happening with your bookings today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Wallet}
          label="Wallet Balance"
          value={stats.walletBalance ? `₹${stats.walletBalance.toLocaleString()}` : '...'}
          color="border-green-500"
        />
        <StatCard
          icon={ClipboardList}
          label="Total Bookings"
          value={stats.totalBookings}
          subtitle="This month"
          color="border-blue-500"
        />
        <StatCard
          icon={Ticket}
          label="Ticketed"
          value={stats.ticketed}
          subtitle="Successfully issued"
          color="border-yellow-500"
        />
        <StatCard
          icon={IndianRupee}
          label="Commission Earned"
          value={`₹${stats.commissionEarned?.toLocaleString() || 0}`}
          subtitle="This month"
          color="border-purple-500"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            icon="✈️"
            title="Search Flights"
            description="Find and book flights for your customers"
            to="/flights"
            color="border-blue-500"
          />
          <QuickActionCard
            icon="📁"
            title="View Bookings"
            description="Manage your booking history"
            to="/bookings"
            color="border-green-500"
          />
          <QuickActionCard
            icon="💳"
            title="Add Funds"
            description="Top up your wallet balance"
            to="/wallet"
            color="border-orange-500"
          />
          <QuickActionCard
            icon="⚙️"
            title="Profile"
            description="Update your account settings"
            to="/profile"
            color="border-purple-500"
          />
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
          <Link to="/bookings" className="text-blue-600 hover:underline text-sm">
            View All
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No bookings yet</p>
            <Link to="/flights" className="text-blue-600 hover:underline mt-2 inline-block">
              Book your first flight
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 text-sm border-b">
                  <th className="pb-3">PNR</th>
                  <th className="pb-3">Route</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{booking.pnr}</td>
                    <td className="py-3">
                      {booking.origin} → {booking.destination}
                    </td>
                    <td className="py-3 text-gray-500">{booking.travelDate}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          booking.status === 'CONFIRMED'
                            ? 'bg-green-100 text-green-700'
                            : booking.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3 font-medium">₹{booking.amount?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;
