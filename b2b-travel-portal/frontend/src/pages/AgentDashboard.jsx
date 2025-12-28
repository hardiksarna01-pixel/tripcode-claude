import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  Plane,
  Search,
  FileText,
  Wallet,
  LogOut,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  Calendar,
  Users
} from 'lucide-react';

const AgentDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = [
    { label: 'Wallet Balance', value: '₹45,280', icon: Wallet, color: 'bg-green-500' },
    { label: 'Today\'s Bookings', value: '8', icon: FileText, color: 'bg-blue-500' },
    { label: 'Pending', value: '2', icon: Clock, color: 'bg-orange-500' },
    { label: 'This Month', value: '124', icon: Calendar, color: 'bg-purple-500' },
  ];

  const recentBookings = [
    { id: 'FLY123456', route: 'DEL → BOM', date: '28 Dec 2024', pax: 2, amount: '₹11,680', status: 'confirmed' },
    { id: 'FLY123455', route: 'BLR → DEL', date: '27 Dec 2024', pax: 1, amount: '₹5,840', status: 'confirmed' },
    { id: 'FLY123454', route: 'MUM → GOI', date: '27 Dec 2024', pax: 3, amount: '₹8,520', status: 'pending' },
    { id: 'FLY123453', route: 'DEL → CCU', date: '26 Dec 2024', pax: 1, amount: '₹4,290', status: 'cancelled' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3" /> Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
            <Clock className="h-3 w-3" /> Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <XCircle className="h-3 w-3" /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-500 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Plane className="h-8 w-8" />
              <div>
                <h1 className="text-xl font-bold">Flyshop</h1>
                <p className="text-sm text-primary-100">Agent Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user?.companyName || 'Agent'}</p>
                <p className="text-xs text-primary-200">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="pb-6">
            <Link
              to="/flights/search"
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl p-4 transition-all"
            >
              <Search className="h-5 w-5" />
              <span>Search Flights</span>
              <ChevronRight className="h-5 w-5 ml-auto" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 -mt-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link
            to="/flights/search"
            className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all flex flex-col items-center text-center"
          >
            <div className="bg-primary-100 p-3 rounded-full mb-3">
              <Search className="h-6 w-6 text-primary-500" />
            </div>
            <span className="font-medium text-gray-800">Search Flights</span>
          </Link>

          <Link
            to="/bookings"
            className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all flex flex-col items-center text-center"
          >
            <div className="bg-green-100 p-3 rounded-full mb-3">
              <FileText className="h-6 w-6 text-green-500" />
            </div>
            <span className="font-medium text-gray-800">My Bookings</span>
          </Link>

          <Link
            to="/wallet"
            className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all flex flex-col items-center text-center"
          >
            <div className="bg-purple-100 p-3 rounded-full mb-3">
              <Wallet className="h-6 w-6 text-purple-500" />
            </div>
            <span className="font-medium text-gray-800">Wallet</span>
          </Link>

          <Link
            to="/profile"
            className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all flex flex-col items-center text-center"
          >
            <div className="bg-orange-100 p-3 rounded-full mb-3">
              <Users className="h-6 w-6 text-orange-500" />
            </div>
            <span className="font-medium text-gray-800">Profile</span>
          </Link>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Recent Bookings</h3>
            <Link to="/bookings" className="text-primary-500 text-sm hover:text-primary-600">
              View all
            </Link>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pax</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-primary-600">{booking.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{booking.route}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{booking.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{booking.pax}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{booking.amount}</td>
                    <td className="px-6 py-4">{getStatusBadge(booking.status)}</td>
                    <td className="px-6 py-4">
                      <button className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-primary-600">{booking.id}</span>
                  {getStatusBadge(booking.status)}
                </div>
                <div className="flex items-center gap-2 text-gray-800 mb-1">
                  <Plane className="h-4 w-4" />
                  <span>{booking.route}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{booking.date} • {booking.pax} Pax</span>
                  <span className="font-medium text-gray-800">{booking.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgentDashboard;
