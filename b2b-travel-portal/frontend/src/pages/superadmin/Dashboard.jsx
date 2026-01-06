import React from 'react';
import { Building2, Users, DollarSign, Activity, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const SuperAdminDashboard = () => {
  // Mock data for dashboard
  const stats = [
    { label: 'Total Companies', value: '24', icon: Building2, color: 'bg-purple-500', change: '+3 this month' },
    { label: 'Active Users', value: '1,847', icon: Users, color: 'bg-blue-500', change: '+127 this week' },
    { label: 'Monthly Revenue', value: '$284,500', icon: DollarSign, color: 'bg-green-500', change: '+12.5%' },
    { label: 'System Uptime', value: '99.9%', icon: Activity, color: 'bg-indigo-500', change: 'Last 30 days' },
  ];

  const recentCompanies = [
    { name: 'TravelMax Inc.', plan: 'Enterprise', users: 45, status: 'Active', revenue: '$12,500' },
    { name: 'FlyHigh Tours', plan: 'Professional', users: 23, status: 'Active', revenue: '$5,200' },
    { name: 'Global Travels', plan: 'Enterprise', users: 67, status: 'Active', revenue: '$18,900' },
    { name: 'QuickTrip Agency', plan: 'Starter', users: 8, status: 'Trial', revenue: '$0' },
    { name: 'Premium Voyages', plan: 'Professional', users: 31, status: 'Active', revenue: '$7,800' },
  ];

  const systemAlerts = [
    { type: 'warning', message: 'High API usage detected for TravelMax Inc.', time: '5 min ago' },
    { type: 'success', message: 'Database backup completed successfully', time: '1 hour ago' },
    { type: 'info', message: 'New company registration: QuickTrip Agency', time: '3 hours ago' },
    { type: 'warning', message: 'SSL certificate expiring in 15 days', time: '1 day ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Platform overview and system management</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock size={16} />
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="text-green-600 text-xs mt-1">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Companies Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Companies</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Users</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentCompanies.map((company, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="font-medium text-gray-900">{company.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{company.plan}</td>
                    <td className="px-6 py-4 text-gray-600">{company.users}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        company.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {company.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{company.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">System Alerts</h2>
          </div>
          <div className="p-4 space-y-3">
            {systemAlerts.map((alert, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />}
                {alert.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />}
                {alert.type === 'info' && <Activity className="w-5 h-5 text-blue-500 mt-0.5" />}
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{alert.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Building2 className="w-6 h-6 text-purple-500 mb-2" />
            <p className="font-medium text-gray-900">Add Company</p>
            <p className="text-xs text-gray-500">Register new tenant</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Users className="w-6 h-6 text-blue-500 mb-2" />
            <p className="font-medium text-gray-900">Manage Users</p>
            <p className="text-xs text-gray-500">User administration</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Activity className="w-6 h-6 text-green-500 mb-2" />
            <p className="font-medium text-gray-900">System Health</p>
            <p className="text-xs text-gray-500">Monitor services</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <DollarSign className="w-6 h-6 text-indigo-500 mb-2" />
            <p className="font-medium text-gray-900">Billing</p>
            <p className="text-xs text-gray-500">View invoices</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
