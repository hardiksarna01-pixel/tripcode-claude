import React, { useState, useEffect } from 'react';

/**
 * B2C Site Management - Super Admin Interface
 * Allows super admin to create and manage B2C whitelabel sites for agents
 * Sites are deployed on agent's own custom domain
 */
const B2CSiteManagement = () => {
    const [activeTab, setActiveTab] = useState('sites');
    const [sites, setSites] = useState([]);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedSite, setSelectedSite] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // New site form data
    const [newSite, setNewSite] = useState({
        agent_id: '',
        site_name: '',
        site_tagline: '',
        custom_domain: '',
        primary_color: '#2563eb',
        secondary_color: '#1e40af',
        plan_type: 'STARTER',
        enable_flights: true,
        enable_hotels: false,
        enable_customer_login: true,
        b2c_markup_type: 'PERCENTAGE',
        b2c_markup_value: 5,
    });

    // CNAME target for DNS configuration
    const CNAME_TARGET = 'b2c.tripcode.in';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        // Mock data - replace with API calls
        setSites([
            {
                id: 1,
                site_code: 'travelmax',
                site_name: 'TravelMax Flights',
                agent_name: 'TravelMax India Pvt Ltd',
                agent_id: 1,
                custom_domain: 'www.travelmaxflights.com',
                domain_verified: true,
                ssl_enabled: true,
                dns_configured: true,
                status: 'ACTIVE',
                plan_type: 'PREMIUM',
                total_customers: 1250,
                total_bookings: 456,
                monthly_revenue: 125000,
                created_at: '2025-10-15',
                primary_color: '#2563eb',
            },
            {
                id: 2,
                site_code: 'flyeasy',
                site_name: 'FlyEasy Bookings',
                agent_name: 'FlyEasy Tours & Travels',
                agent_id: 2,
                custom_domain: 'flights.flyeasytours.in',
                domain_verified: true,
                ssl_enabled: true,
                dns_configured: true,
                status: 'ACTIVE',
                plan_type: 'STARTER',
                total_customers: 340,
                total_bookings: 89,
                monthly_revenue: 45000,
                created_at: '2025-11-20',
                primary_color: '#059669',
            },
            {
                id: 3,
                site_code: 'quicktrips',
                site_name: 'QuickTrips Online',
                agent_name: 'QuickTrips Agency',
                agent_id: 3,
                custom_domain: 'book.quicktrips.co.in',
                domain_verified: false,
                ssl_enabled: false,
                dns_configured: false,
                status: 'PENDING_DNS',
                plan_type: 'STARTER',
                total_customers: 0,
                total_bookings: 0,
                monthly_revenue: 0,
                created_at: '2025-12-20',
                primary_color: '#dc2626',
            },
            {
                id: 4,
                site_code: 'globalwings',
                site_name: 'Global Wings Travel',
                agent_name: 'Global Wings Pvt Ltd',
                agent_id: 4,
                custom_domain: 'fly.globalwings.in',
                domain_verified: true,
                ssl_enabled: true,
                dns_configured: true,
                status: 'SUSPENDED',
                plan_type: 'PREMIUM',
                total_customers: 890,
                total_bookings: 234,
                monthly_revenue: 0,
                created_at: '2025-08-10',
                primary_color: '#7c3aed',
            },
        ]);

        setAgents([
            { id: 5, company_name: 'Sky High Travels', email: 'info@skyhigh.com', has_b2c: false },
            { id: 6, company_name: 'Budget Airways', email: 'book@budgetair.in', has_b2c: false },
            { id: 7, company_name: 'Premium Flights Co', email: 'fly@premiumflights.com', has_b2c: false },
        ]);

        setLoading(false);
    };

    const handleCreateSite = async () => {
        // Validate
        if (!newSite.agent_id || !newSite.site_name || !newSite.custom_domain) {
            alert('Please fill all required fields');
            return;
        }

        // Validate domain format
        const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
        if (!domainRegex.test(newSite.custom_domain)) {
            alert('Please enter a valid domain (e.g., flights.yourdomain.com)');
            return;
        }

        // API call to create site
        console.log('Creating site:', newSite);

        // Add to list (mock)
        const agent = agents.find(a => a.id === parseInt(newSite.agent_id));
        setSites([...sites, {
            id: sites.length + 1,
            site_code: newSite.custom_domain.split('.')[0],
            site_name: newSite.site_name,
            agent_name: agent?.company_name || 'Unknown',
            agent_id: newSite.agent_id,
            custom_domain: newSite.custom_domain,
            domain_verified: false,
            ssl_enabled: false,
            dns_configured: false,
            status: 'PENDING_DNS',
            plan_type: newSite.plan_type,
            total_customers: 0,
            total_bookings: 0,
            monthly_revenue: 0,
            created_at: new Date().toISOString().split('T')[0],
            primary_color: newSite.primary_color,
        }]);

        setShowCreateModal(false);
        setNewSite({
            agent_id: '',
            site_name: '',
            site_tagline: '',
            custom_domain: '',
            primary_color: '#2563eb',
            secondary_color: '#1e40af',
            plan_type: 'STARTER',
            enable_flights: true,
            enable_hotels: false,
            enable_customer_login: true,
            b2c_markup_type: 'PERCENTAGE',
            b2c_markup_value: 5,
        });
    };

    const handleVerifyDomain = async (siteId) => {
        // Mock verification - in production, check DNS records
        setSites(sites.map(site =>
            site.id === siteId ? { ...site, dns_configured: true, domain_verified: true, ssl_enabled: true, status: 'ACTIVE' } : site
        ));
    };

    const handleStatusChange = (siteId, newStatus) => {
        setSites(sites.map(site =>
            site.id === siteId ? { ...site, status: newStatus } : site
        ));
    };

    const filteredSites = sites.filter(site => {
        const matchesSearch = site.site_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            site.agent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            site.custom_domain.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !statusFilter || site.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: sites.length,
        active: sites.filter(s => s.status === 'ACTIVE').length,
        pendingDns: sites.filter(s => s.status === 'PENDING_DNS').length,
        suspended: sites.filter(s => s.status === 'SUSPENDED').length,
        totalCustomers: sites.reduce((sum, s) => sum + s.total_customers, 0),
        totalBookings: sites.reduce((sum, s) => sum + s.total_bookings, 0),
        totalRevenue: sites.reduce((sum, s) => sum + s.monthly_revenue, 0),
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">B2C Whitelabel Sites</h1>
                            <p className="text-purple-100 mt-1">Deploy B2C websites on agent's own domain</p>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create New B2C Site
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total B2C Sites</p>
                                <p className="text-3xl font-bold mt-1">{stats.total}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-4 text-sm">
                            <span className="text-green-600">{stats.active} Active</span>
                            <span className="text-yellow-600">{stats.pendingDns} Pending DNS</span>
                            <span className="text-red-600">{stats.suspended} Suspended</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Customers</p>
                                <p className="text-3xl font-bold mt-1">{stats.totalCustomers.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-gray-500">Across all B2C sites</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total B2C Bookings</p>
                                <p className="text-3xl font-bold mt-1">{stats.totalBookings.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-gray-500">This month</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">B2C Revenue</p>
                                <p className="text-3xl font-bold mt-1 text-green-600">
                                    ₹{(stats.totalRevenue / 1000).toFixed(0)}K
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-gray-500">Agent commissions this month</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm mb-6">
                    <div className="border-b px-6">
                        <nav className="flex gap-8">
                            {[
                                { id: 'sites', label: 'All Sites', count: sites.length },
                                { id: 'pending', label: 'Pending DNS Setup', count: sites.filter(s => s.status === 'PENDING_DNS').length },
                                { id: 'analytics', label: 'Analytics' },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 border-b-2 font-medium flex items-center gap-2 ${
                                        activeTab === tab.id
                                            ? 'border-purple-600 text-purple-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {tab.label}
                                    {tab.count !== undefined && tab.count > 0 && (
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                                            activeTab === tab.id ? 'bg-purple-100 text-purple-600' : 'bg-gray-100'
                                        }`}>
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {activeTab === 'sites' && (
                        <div className="p-6">
                            {/* Filters */}
                            <div className="flex gap-4 mb-6">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Search by site name, agent, or domain..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-2 border rounded-lg"
                                >
                                    <option value="">All Status</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="PENDING_DNS">Pending DNS</option>
                                    <option value="SUSPENDED">Suspended</option>
                                </select>
                            </div>

                            {/* Sites Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Site</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Domain</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stats</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredSites.map(site => (
                                            <tr key={site.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                                                            style={{ backgroundColor: site.primary_color }}
                                                        >
                                                            {site.site_name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{site.site_name}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm">{site.agent_name}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-blue-600 font-medium">{site.custom_domain}</span>
                                                            {site.ssl_enabled && (
                                                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        {!site.dns_configured && (
                                                            <span className="text-xs text-yellow-600">DNS not configured</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                        site.plan_type === 'PREMIUM' ? 'bg-purple-100 text-purple-800' :
                                                        site.plan_type === 'STARTER' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {site.plan_type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm">
                                                        <p>{site.total_customers.toLocaleString()} customers</p>
                                                        <p className="text-gray-500">{site.total_bookings} bookings</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                        site.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                                        site.status === 'PENDING_DNS' ? 'bg-yellow-100 text-yellow-800' :
                                                        site.status === 'SUSPENDED' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {site.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        {site.status === 'ACTIVE' && (
                                                            <a
                                                                href={`https://${site.custom_domain}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:text-blue-800 text-sm"
                                                            >
                                                                Visit
                                                            </a>
                                                        )}
                                                        {site.status === 'PENDING_DNS' && (
                                                            <button
                                                                onClick={() => handleVerifyDomain(site.id)}
                                                                className="text-green-600 hover:text-green-800 text-sm"
                                                            >
                                                                Verify DNS
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => setSelectedSite(site)}
                                                            className="text-purple-600 hover:text-purple-800 text-sm"
                                                        >
                                                            Edit
                                                        </button>
                                                        {site.status === 'ACTIVE' && (
                                                            <button
                                                                onClick={() => handleStatusChange(site.id, 'SUSPENDED')}
                                                                className="text-red-600 hover:text-red-800 text-sm"
                                                            >
                                                                Suspend
                                                            </button>
                                                        )}
                                                        {site.status === 'SUSPENDED' && (
                                                            <button
                                                                onClick={() => handleStatusChange(site.id, 'ACTIVE')}
                                                                className="text-green-600 hover:text-green-800 text-sm"
                                                            >
                                                                Reactivate
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'pending' && (
                        <div className="p-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <h3 className="font-semibold text-blue-800 mb-2">DNS Configuration Instructions</h3>
                                <p className="text-sm text-blue-700 mb-3">
                                    Agents need to add a CNAME record pointing their domain to our servers:
                                </p>
                                <div className="bg-white rounded p-3 font-mono text-sm">
                                    <p><span className="text-gray-500">Type:</span> CNAME</p>
                                    <p><span className="text-gray-500">Host:</span> @ or subdomain (e.g., flights)</p>
                                    <p><span className="text-gray-500">Points to:</span> <span className="text-blue-600">{CNAME_TARGET}</span></p>
                                </div>
                            </div>

                            <h3 className="font-semibold mb-4">Sites Pending DNS Verification</h3>
                            {sites.filter(s => s.status === 'PENDING_DNS').length === 0 ? (
                                <p className="text-gray-500">No sites pending DNS setup</p>
                            ) : (
                                <div className="space-y-4">
                                    {sites.filter(s => s.status === 'PENDING_DNS').map(site => (
                                        <div key={site.id} className="border rounded-lg p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium">{site.site_name}</p>
                                                    <p className="text-sm text-gray-500">{site.agent_name}</p>
                                                    <p className="text-sm text-blue-600 mt-1">{site.custom_domain}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleVerifyDomain(site.id)}
                                                        className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                                    >
                                                        Verify DNS
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                                                <p className="text-gray-600">Required DNS Record:</p>
                                                <code className="text-xs">CNAME {site.custom_domain} → {CNAME_TARGET}</code>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <hr className="my-8" />

                            <h3 className="font-semibold mb-4">Agents Without B2C Sites</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                These agents don't have a B2C website yet. Create one on their own domain.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {agents.filter(a => !a.has_b2c).map(agent => (
                                    <div key={agent.id} className="border rounded-lg p-4 hover:border-purple-300 hover:bg-purple-50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium">{agent.company_name}</p>
                                                <p className="text-sm text-gray-500">{agent.email}</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setNewSite({
                                                        ...newSite,
                                                        agent_id: agent.id,
                                                        site_name: agent.company_name,
                                                        custom_domain: '',
                                                    });
                                                    setShowCreateModal(true);
                                                }}
                                                className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                                            >
                                                Create B2C
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Top Performing Sites */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="font-semibold mb-4">Top Performing B2C Sites</h3>
                                    <div className="space-y-4">
                                        {sites
                                            .filter(s => s.status === 'ACTIVE')
                                            .sort((a, b) => b.monthly_revenue - a.monthly_revenue)
                                            .slice(0, 5)
                                            .map((site, idx) => (
                                                <div key={site.id} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium">
                                                            {idx + 1}
                                                        </span>
                                                        <div>
                                                            <p className="font-medium">{site.site_name}</p>
                                                            <p className="text-xs text-gray-500">{site.custom_domain}</p>
                                                        </div>
                                                    </div>
                                                    <span className="font-semibold text-green-600">
                                                        ₹{site.monthly_revenue.toLocaleString()}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                {/* Plan Distribution */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="font-semibold mb-4">Plan Distribution</h3>
                                    <div className="space-y-4">
                                        {['PREMIUM', 'STARTER'].map(plan => {
                                            const count = sites.filter(s => s.plan_type === plan).length;
                                            const percent = sites.length > 0 ? (count / sites.length) * 100 : 0;
                                            return (
                                                <div key={plan}>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span>{plan}</span>
                                                        <span className="text-gray-500">{count} sites ({percent.toFixed(0)}%)</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full ${
                                                                plan === 'PREMIUM' ? 'bg-purple-600' : 'bg-blue-600'
                                                            }`}
                                                            style={{ width: `${percent}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Site Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b sticky top-0 bg-white">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold">Create B2C Site on Custom Domain</h2>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Agent Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Agent <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={newSite.agent_id}
                                    onChange={(e) => setNewSite({ ...newSite, agent_id: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                >
                                    <option value="">Choose an agent...</option>
                                    {agents.filter(a => !a.has_b2c).map(agent => (
                                        <option key={agent.id} value={agent.id}>
                                            {agent.company_name} ({agent.email})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Site Details */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Site Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newSite.site_name}
                                    onChange={(e) => setNewSite({ ...newSite, site_name: e.target.value })}
                                    placeholder="e.g., TravelMax Flights"
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>

                            {/* Custom Domain */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Agent's Domain <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newSite.custom_domain}
                                    onChange={(e) => setNewSite({
                                        ...newSite,
                                        custom_domain: e.target.value.toLowerCase().replace(/\s/g, '')
                                    })}
                                    placeholder="e.g., flights.agentsite.com or www.agentflights.com"
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    The agent's own domain where the B2C site will be accessible
                                </p>
                            </div>

                            {/* DNS Instructions */}
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <h4 className="font-medium text-yellow-800 mb-2">DNS Setup Required</h4>
                                <p className="text-sm text-yellow-700 mb-2">
                                    After creating the site, the agent must add this CNAME record:
                                </p>
                                <div className="bg-white rounded p-2 font-mono text-sm">
                                    <p>CNAME → <span className="text-blue-600">{CNAME_TARGET}</span></p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tagline
                                </label>
                                <input
                                    type="text"
                                    value={newSite.site_tagline}
                                    onChange={(e) => setNewSite({ ...newSite, site_tagline: e.target.value })}
                                    placeholder="e.g., Your trusted travel partner"
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>

                            {/* Branding */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Brand Colors</h3>
                                <div className="flex gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Primary</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={newSite.primary_color}
                                                onChange={(e) => setNewSite({ ...newSite, primary_color: e.target.value })}
                                                className="w-10 h-10 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={newSite.primary_color}
                                                onChange={(e) => setNewSite({ ...newSite, primary_color: e.target.value })}
                                                className="w-24 px-2 py-1 border rounded text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Secondary</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={newSite.secondary_color}
                                                onChange={(e) => setNewSite({ ...newSite, secondary_color: e.target.value })}
                                                className="w-10 h-10 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={newSite.secondary_color}
                                                onChange={(e) => setNewSite({ ...newSite, secondary_color: e.target.value })}
                                                className="w-24 px-2 py-1 border rounded text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Plan Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Plan Type</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { id: 'STARTER', name: 'Starter', desc: 'Core features, custom domain, SSL included' },
                                        { id: 'PREMIUM', name: 'Premium', desc: 'All features, priority support, advanced analytics' },
                                    ].map(plan => (
                                        <button
                                            key={plan.id}
                                            onClick={() => setNewSite({ ...newSite, plan_type: plan.id })}
                                            className={`p-4 border rounded-lg text-left ${
                                                newSite.plan_type === plan.id
                                                    ? 'border-purple-500 bg-purple-50'
                                                    : 'hover:border-gray-300'
                                            }`}
                                        >
                                            <p className="font-medium">{plan.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">{plan.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Features */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Enable Features</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { key: 'enable_flights', label: 'Flights' },
                                        { key: 'enable_hotels', label: 'Hotels' },
                                        { key: 'enable_customer_login', label: 'Customer Login' },
                                    ].map(feature => (
                                        <label key={feature.key} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={newSite[feature.key]}
                                                onChange={(e) => setNewSite({ ...newSite, [feature.key]: e.target.checked })}
                                                className="rounded"
                                            />
                                            <span className="text-sm">{feature.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Markup Settings */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">B2C Markup</label>
                                <div className="flex gap-4">
                                    <select
                                        value={newSite.b2c_markup_type}
                                        onChange={(e) => setNewSite({ ...newSite, b2c_markup_type: e.target.value })}
                                        className="px-4 py-2 border rounded-lg"
                                    >
                                        <option value="PERCENTAGE">Percentage (%)</option>
                                        <option value="FLAT">Flat Amount (₹)</option>
                                    </select>
                                    <input
                                        type="number"
                                        value={newSite.b2c_markup_value}
                                        onChange={(e) => setNewSite({ ...newSite, b2c_markup_value: parseFloat(e.target.value) || 0 })}
                                        className="w-32 px-4 py-2 border rounded-lg"
                                        min="0"
                                        step="0.5"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    This markup will be added to flight prices on the B2C site
                                </p>
                            </div>
                        </div>

                        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-6 py-2 border rounded-lg hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateSite}
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                                Create B2C Site
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default B2CSiteManagement;
