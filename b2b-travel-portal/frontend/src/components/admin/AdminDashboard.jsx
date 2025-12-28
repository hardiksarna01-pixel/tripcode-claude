import React from 'react';

const AdminDashboard = () => {
    const stats = [
        { label: 'Total Agents', value: '156', change: '+12', color: 'blue' },
        { label: 'Active Bookings', value: '2,341', change: '+89', color: 'green' },
        { label: 'Revenue (Today)', value: '₹4.5L', change: '+15%', color: 'purple' },
        { label: 'Pending Approvals', value: '8', change: '0', color: 'orange' },
    ];

    const recentActivities = [
        { action: 'New agent registration', agent: 'Travel World', time: '5 min ago' },
        { action: 'Booking confirmed', agent: 'Holiday Makers', time: '12 min ago' },
        { action: 'Payment received', agent: 'Trip Advisors', time: '25 min ago' },
        { action: 'Commission payout', agent: 'Sky Travels', time: '1 hour ago' },
    ];

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                        <div className="flex items-end justify-between">
                            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                            <span className={`text-sm font-medium text-${stat.color}-600 bg-${stat.color}-50 px-2 py-1 rounded`}>
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activities */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h2>
                    <div className="space-y-4">
                        {recentActivities.map((activity, index) => (
                            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                <div>
                                    <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                                    <p className="text-xs text-gray-500">{activity.agent}</p>
                                </div>
                                <span className="text-xs text-gray-400">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 bg-blue-50 rounded-lg text-blue-600 hover:bg-blue-100 transition">
                            <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span className="text-sm font-medium">Manage Agents</span>
                        </button>
                        <button className="p-4 bg-green-50 rounded-lg text-green-600 hover:bg-green-100 transition">
                            <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium">Approvals</span>
                        </button>
                        <button className="p-4 bg-purple-50 rounded-lg text-purple-600 hover:bg-purple-100 transition">
                            <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span className="text-sm font-medium">View Reports</span>
                        </button>
                        <button className="p-4 bg-orange-50 rounded-lg text-orange-600 hover:bg-orange-100 transition">
                            <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            </svg>
                            <span className="text-sm font-medium">Settings</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
