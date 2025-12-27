import React, { useState, useEffect } from 'react';

const SuperAdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [tenants, setTenants] = useState([]);
    const [partners, setPartners] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        // Mock data - replace with API calls
        setStats({
            totalTenants: 156,
            activeTenants: 142,
            trialTenants: 14,
            mrr: 2850000,
            arr: 34200000,
            apiCalls: 1250000,
            totalPartners: 28,
            pendingApprovals: 5,
            growth: {
                tenants: 12,
                revenue: 18,
                apiCalls: 25
            }
        });

        setTenants([
            { id: 'T001', name: 'TravelMax India', plan: 'ENTERPRISE', status: 'active', agents: 45, mrr: 74999, createdAt: '2025-01-15' },
            { id: 'T002', name: 'FlyEasy Tours', plan: 'PROFESSIONAL', status: 'active', agents: 18, mrr: 24999, createdAt: '2025-02-20' },
            { id: 'T003', name: 'QuickTrips', plan: 'STARTER', status: 'trial', agents: 3, mrr: 0, createdAt: '2025-12-20' },
            { id: 'T004', name: 'Global Wings', plan: 'API_ONLY', status: 'active', agents: 0, mrr: 14999, createdAt: '2025-03-10' },
            { id: 'T005', name: 'BookMyFlight', plan: 'PROFESSIONAL', status: 'active', agents: 22, mrr: 24999, createdAt: '2025-04-05' },
        ]);

        setPartners([
            { id: 'P001', name: 'Tech Solutions Ltd', tier: 'GOLD', referrals: 25, commission: 45000, status: 'active' },
            { id: 'P002', name: 'Digital Travel Co', tier: 'SILVER', referrals: 12, commission: 18000, status: 'active' },
            { id: 'P003', name: 'WebAgency Pro', tier: 'BRONZE', referrals: 3, commission: 4500, status: 'pending_approval' },
        ]);

        setLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-8">
                <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
                <p className="text-indigo-100 mt-1">Manage your SaaS platform</p>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white border-b px-6">
                <nav className="flex gap-8">
                    {['overview', 'tenants', 'partners', 'subscriptions', 'api-usage'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-4 border-b-2 font-medium capitalize ${
                                activeTab === tab
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab.replace('-', ' ')}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="p-6 max-w-7xl mx-auto">
                {activeTab === 'overview' && (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-gray-500">Total Tenants</p>
                                        <p className="text-3xl font-bold mt-1">{stats.totalTenants}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {stats.activeTenants} active, {stats.trialTenants} trial
                                        </p>
                                    </div>
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                        +{stats.growth.tenants}%
                                    </span>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-gray-500">Monthly Revenue</p>
                                        <p className="text-3xl font-bold mt-1">₹{(stats.mrr / 100000).toFixed(1)}L</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            ARR: ₹{(stats.arr / 10000000).toFixed(1)}Cr
                                        </p>
                                    </div>
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                        +{stats.growth.revenue}%
                                    </span>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-gray-500">API Calls (This Month)</p>
                                        <p className="text-3xl font-bold mt-1">{(stats.apiCalls / 1000000).toFixed(2)}M</p>
                                    </div>
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                        +{stats.growth.apiCalls}%
                                    </span>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div>
                                    <p className="text-sm text-gray-500">Partners</p>
                                    <p className="text-3xl font-bold mt-1">{stats.totalPartners}</p>
                                    <p className="text-sm text-yellow-600 mt-1">
                                        {stats.pendingApprovals} pending approval
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Recent Tenants */}
                            <div className="bg-white rounded-xl shadow-sm">
                                <div className="p-6 border-b flex justify-between items-center">
                                    <h3 className="font-semibold">Recent Tenants</h3>
                                    <button className="text-indigo-600 text-sm hover:underline">View All</button>
                                </div>
                                <div className="divide-y">
                                    {tenants.slice(0, 5).map(tenant => (
                                        <div key={tenant.id} className="p-4 flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{tenant.name}</p>
                                                <p className="text-sm text-gray-500">{tenant.plan} • {tenant.agents} agents</p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                tenant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {tenant.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Plan Distribution */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="font-semibold mb-4">Plan Distribution</h3>
                                <div className="space-y-4">
                                    {[
                                        { plan: 'Enterprise', count: 12, color: 'bg-purple-600', percent: 8 },
                                        { plan: 'Professional', count: 68, color: 'bg-blue-600', percent: 44 },
                                        { plan: 'Starter', count: 52, color: 'bg-green-600', percent: 33 },
                                        { plan: 'API Only', count: 24, color: 'bg-orange-600', percent: 15 },
                                    ].map(item => (
                                        <div key={item.plan}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>{item.plan}</span>
                                                <span className="text-gray-500">{item.count} ({item.percent}%)</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.percent}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'tenants' && (
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h3 className="font-semibold">All Tenants</h3>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    placeholder="Search tenants..."
                                    className="px-4 py-2 border rounded-lg text-sm"
                                />
                                <select className="px-4 py-2 border rounded-lg text-sm">
                                    <option value="">All Plans</option>
                                    <option value="enterprise">Enterprise</option>
                                    <option value="professional">Professional</option>
                                    <option value="starter">Starter</option>
                                    <option value="api_only">API Only</option>
                                </select>
                                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
                                    Add Tenant
                                </button>
                            </div>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agents</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">MRR</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {tenants.map(tenant => (
                                    <tr key={tenant.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium">{tenant.name}</p>
                                                <p className="text-sm text-gray-500">{tenant.id}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                tenant.plan === 'ENTERPRISE' ? 'bg-purple-100 text-purple-800' :
                                                tenant.plan === 'PROFESSIONAL' ? 'bg-blue-100 text-blue-800' :
                                                tenant.plan === 'API_ONLY' ? 'bg-orange-100 text-orange-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                                {tenant.plan}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">{tenant.agents}</td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            ₹{tenant.mrr.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                tenant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {tenant.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button className="text-indigo-600 hover:text-indigo-800 text-sm">View</button>
                                                <button className="text-gray-600 hover:text-gray-800 text-sm">Edit</button>
                                                {tenant.status === 'active' ? (
                                                    <button className="text-red-600 hover:text-red-800 text-sm">Suspend</button>
                                                ) : (
                                                    <button className="text-green-600 hover:text-green-800 text-sm">Activate</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'partners' && (
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h3 className="font-semibold">Partner Program</h3>
                            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
                                Invite Partner
                            </button>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Partner</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referrals</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {partners.map(partner => (
                                    <tr key={partner.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <p className="font-medium">{partner.name}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                partner.tier === 'PLATINUM' ? 'bg-gray-800 text-white' :
                                                partner.tier === 'GOLD' ? 'bg-yellow-100 text-yellow-800' :
                                                partner.tier === 'SILVER' ? 'bg-gray-200 text-gray-800' :
                                                'bg-orange-100 text-orange-800'
                                            }`}>
                                                {partner.tier}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">{partner.referrals}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-green-600">
                                            ₹{partner.commission.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                partner.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {partner.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                {partner.status === 'pending_approval' ? (
                                                    <>
                                                        <button className="text-green-600 hover:text-green-800 text-sm">Approve</button>
                                                        <button className="text-red-600 hover:text-red-800 text-sm">Reject</button>
                                                    </>
                                                ) : (
                                                    <button className="text-indigo-600 hover:text-indigo-800 text-sm">View Details</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'subscriptions' && (
                    <div className="space-y-6">
                        {/* Revenue Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <p className="text-sm text-gray-500">Total MRR</p>
                                <p className="text-3xl font-bold text-green-600 mt-1">₹{(stats.mrr / 100000).toFixed(2)}L</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <p className="text-sm text-gray-500">ARR</p>
                                <p className="text-3xl font-bold mt-1">₹{(stats.arr / 10000000).toFixed(2)}Cr</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <p className="text-sm text-gray-500">Avg Revenue Per Tenant</p>
                                <p className="text-3xl font-bold mt-1">₹{Math.round(stats.mrr / stats.activeTenants).toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Subscription Breakdown */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="font-semibold mb-4">Revenue by Plan</h3>
                            <div className="grid grid-cols-4 gap-4">
                                {[
                                    { plan: 'Enterprise', revenue: 899988, count: 12, price: 74999 },
                                    { plan: 'Professional', revenue: 1699932, count: 68, price: 24999 },
                                    { plan: 'Starter', revenue: 519948, count: 52, price: 9999 },
                                    { plan: 'API Only', revenue: 359976, count: 24, price: 14999 },
                                ].map(item => (
                                    <div key={item.plan} className="p-4 bg-gray-50 rounded-lg">
                                        <p className="font-medium">{item.plan}</p>
                                        <p className="text-2xl font-bold mt-2">₹{(item.revenue / 100000).toFixed(1)}L</p>
                                        <p className="text-sm text-gray-500 mt-1">{item.count} tenants @ ₹{item.price.toLocaleString()}/mo</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'api-usage' && (
                    <div className="space-y-6">
                        {/* API Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <p className="text-sm text-gray-500">Total API Calls (Month)</p>
                                <p className="text-3xl font-bold mt-1">{(stats.apiCalls / 1000000).toFixed(2)}M</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <p className="text-sm text-gray-500">Avg Daily Calls</p>
                                <p className="text-3xl font-bold mt-1">{Math.round(stats.apiCalls / 30).toLocaleString()}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <p className="text-sm text-gray-500">Active API Keys</p>
                                <p className="text-3xl font-bold mt-1">89</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <p className="text-sm text-gray-500">Avg Response Time</p>
                                <p className="text-3xl font-bold mt-1">142ms</p>
                            </div>
                        </div>

                        {/* Top API Consumers */}
                        <div className="bg-white rounded-xl shadow-sm">
                            <div className="p-6 border-b">
                                <h3 className="font-semibold">Top API Consumers</h3>
                            </div>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">API Calls</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Limit</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {[
                                        { name: 'Global Wings', plan: 'API_ONLY', calls: 125000, limit: 50000, warning: true },
                                        { name: 'TravelMax India', plan: 'ENTERPRISE', calls: 98000, limit: -1 },
                                        { name: 'BookMyFlight', plan: 'PROFESSIONAL', calls: 8500, limit: 10000 },
                                    ].map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium">{item.name}</td>
                                            <td className="px-6 py-4 text-sm">{item.plan}</td>
                                            <td className="px-6 py-4 text-sm">{item.calls.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-sm">{item.limit === -1 ? 'Unlimited' : item.limit.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                {item.limit === -1 ? (
                                                    <span className="text-green-600">N/A</span>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className={`h-2 rounded-full ${item.warning ? 'bg-red-600' : 'bg-green-600'}`}
                                                                style={{ width: `${Math.min((item.calls / item.limit) * 100, 100)}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className={`text-sm ${item.warning ? 'text-red-600' : ''}`}>
                                                            {Math.round((item.calls / item.limit) * 100)}%
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
