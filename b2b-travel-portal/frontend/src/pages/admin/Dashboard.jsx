import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  ClipboardList,
  IndianRupee,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { adminAPI } from '../../services/api';

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalAgents: 0,
    activeAgents: 0,
    pendingApprovals: 0,
    totalBookings: 0,
    totalRevenue: 0,
    todayBookings: 0,
    monthlyGrowth: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await adminAPI.getDashboard();
        setStats(response.data.stats || response.data);
        setRecentActivities(response.data.recentActivities || []);
      } catch (error) {
        console.error('Error fetching admin dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ icon: Icon, label, value, change, changeType, color, link }) => (
    <div className={`bg-white rounded-xl p-6 shadow-sm border-l-4 ${color}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeType === 'positive' ? (
                <ArrowUpRight size={16} />
              ) : (
                <ArrowDownRight size={16} />
              )}
              <span>{change}% from last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color.replace('border-', 'bg-').replace('500', '100')}`}>
          <Icon className={`w-6 h-6 ${color.replace('border-', 'text-')}`} />
        </div>
      </div>
      {link && (
        <Link to={link} className="text-blue-600 text-sm hover:underline mt-3 inline-block">
          View details →
        </Link>
      )}
    </div>
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">
            Welcome back, {user?.name || 'Admin'}. Here's your business overview.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Today</p>
          <p className="text-lg font-semibold">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Pending Approvals Alert */}
      {stats.pendingApprovals > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-800">
                {stats.pendingApprovals} agent signup requests pending approval
              </p>
              <p className="text-sm text-yellow-600">Review and approve new agents</p>
            </div>
          </div>
          <Link
            to="/admin/agents/approvals"
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
          >
            Review Now
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Agents"
          value={stats.totalAgents}
          change={stats.monthlyGrowth}
          changeType="positive"
          color="border-blue-500"
          link="/admin/agents"
        />
        <StatCard
          icon={UserCheck}
          label="Active Agents"
          value={stats.activeAgents}
          color="border-green-500"
          link="/admin/agents"
        />
        <StatCard
          icon={ClipboardList}
          label="Total Bookings"
          value={stats.totalBookings}
          color="border-purple-500"
          link="/admin/reports/bookings"
        />
        <StatCard
          icon={IndianRupee}
          label="Total Revenue"
          value={`₹${(stats.totalRevenue / 100000).toFixed(1)}L`}
          change={12}
          changeType="positive"
          color="border-orange-500"
          link="/admin/reports/revenue"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Today's Summary</h3>
            <TrendingUp className="text-green-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">New Bookings</span>
              <span className="font-semibold">{stats.todayBookings}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">New Agents</span>
              <span className="font-semibold">{stats.todayAgents || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Revenue</span>
              <span className="font-semibold text-green-600">
                ₹{(stats.todayRevenue || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Link
              to="/admin/agents/approvals"
              className="block w-full text-left px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
            >
              Review Signup Requests
            </Link>
            <Link
              to="/admin/agents"
              className="block w-full text-left px-4 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"
            >
              Manage Agents
            </Link>
            <Link
              to="/admin/schemes"
              className="block w-full text-left px-4 py-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100"
            >
              Configure Schemes
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">API Status</span>
              <span className="flex items-center gap-1 text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Active Sessions</span>
              <span className="font-semibold">{stats.activeSessions || 24}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Server Load</span>
              <span className="text-green-600">Normal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
        </div>

        {recentActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No recent activities
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'booking'
                      ? 'bg-blue-100 text-blue-600'
                      : activity.type === 'agent'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {activity.type === 'booking' ? (
                    <ClipboardList size={20} />
                  ) : (
                    <Users size={20} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                </div>
                <span className="text-sm text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
