import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  Plane,
  Users,
  FileText,
  Settings,
  LogOut,
  TrendingUp,
  DollarSign,
  UserCheck,
  AlertCircle,
  ChevronRight,
  BarChart3,
  Globe,
  Layers
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = [
    { label: 'Total Agents', value: '524', change: '+12%', icon: Users, color: 'bg-blue-500' },
    { label: 'Today\'s Bookings', value: '156', change: '+8%', icon: FileText, color: 'bg-green-500' },
    { label: 'Revenue (Today)', value: '₹4.2L', change: '+15%', icon: DollarSign, color: 'bg-purple-500' },
    { label: 'Pending Approvals', value: '8', change: '', icon: AlertCircle, color: 'bg-orange-500' },
  ];

  const quickLinks = [
    { label: 'Agent Approvals', href: '/admin/agents/approvals', icon: UserCheck, description: 'Review pending agent signups' },
    { label: 'Scheme Management', href: '/admin/schemes', icon: Layers, description: 'Manage commission schemes' },
    { label: 'API Providers', href: '/admin/api-providers', icon: Globe, description: 'Configure flight APIs' },
    { label: 'Reports', href: '/admin/reports', icon: BarChart3, description: 'View booking & revenue reports' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Plane className="h-8 w-8 text-primary-500" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">Flyshop Admin</h1>
                <p className="text-sm text-gray-500">Management Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">{user?.fullName || 'Admin'}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user?.fullName || 'Admin'}!</h2>
          <p className="text-gray-500 mt-1">Here's what's happening with your travel portal today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                  {stat.change && (
                    <p className="text-sm text-green-500 flex items-center gap-1 mt-1">
                      <TrendingUp className="h-4 w-4" />
                      {stat.change} from yesterday
                    </p>
                  )}
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="bg-primary-50 p-3 rounded-lg group-hover:bg-primary-100 transition-colors">
                    <link.icon className="h-6 w-6 text-primary-500" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-primary-500 transition-colors" />
                </div>
                <h4 className="font-semibold text-gray-800 mt-4">{link.label}</h4>
                <p className="text-sm text-gray-500 mt-1">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Recent Bookings</h3>
              <Link to="/admin/bookings" className="text-primary-500 text-sm hover:text-primary-600">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Plane className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">DEL → BOM</p>
                      <p className="text-sm text-gray-500">Agent: Travel Plus</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">₹5,840</p>
                    <p className="text-xs text-green-500">Confirmed</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Pending Agent Approvals</h3>
              <Link to="/admin/agents/approvals" className="text-primary-500 text-sm hover:text-primary-600">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Sky Travels</p>
                      <p className="text-sm text-gray-500">Delhi, India</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600">
                      Approve
                    </button>
                    <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
