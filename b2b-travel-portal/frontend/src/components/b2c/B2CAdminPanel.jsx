import React, { useState, useEffect } from 'react';

/**
 * B2C Admin Panel for Agents
 * Allows agents to manage their B2C website settings, branding, and content
 */
const B2CAdminPanel = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [siteConfig, setSiteConfig] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchSiteData();
    }, []);

    const fetchSiteData = async () => {
        setLoading(true);
        // Mock data - replace with API
        setSiteConfig({
            id: 1,
            site_code: 'travelmax',
            site_name: 'TravelMax Flights',
            site_tagline: 'Your Trusted Travel Partner',
            subdomain: 'travelmax',
            custom_domain: '',
            status: 'ACTIVE',
            primary_color: '#2563eb',
            secondary_color: '#1e40af',
            accent_color: '#f59e0b',
            logo_url: '',
            favicon_url: '',
            display_email: 'support@travelmax.com',
            display_phone: '+91 98765 43210',
            display_whatsapp: '+91 98765 43210',
            display_address: '123, Travel Street, Mumbai',
            facebook_url: '',
            instagram_url: '',
            twitter_url: '',
            enable_flights: true,
            enable_hotels: false,
            enable_customer_login: true,
            enable_customer_registration: true,
            b2c_markup_type: 'PERCENTAGE',
            b2c_markup_value: 5,
            b2c_convenience_fee: 99,
            payment_gateway: 'RAZORPAY',
            payment_test_mode: true,
            meta_title: 'TravelMax - Book Cheap Flights Online',
            meta_description: 'Book domestic and international flights at best prices',
            google_analytics_id: '',
            terms_conditions: '',
            privacy_policy: '',
            about_us: '',
        });

        setStats({
            totalCustomers: 1250,
            newCustomersThisMonth: 89,
            totalBookings: 456,
            bookingsThisMonth: 42,
            revenue: 485000,
            revenueThisMonth: 125000,
            conversionRate: 3.2,
            avgBookingValue: 10640,
        });

        setCustomers([
            { id: 1, name: 'Rahul Sharma', email: 'rahul@email.com', phone: '+91 98765 43210', bookings: 5, spent: 52000, lastBooking: '2025-12-20' },
            { id: 2, name: 'Priya Singh', email: 'priya@email.com', phone: '+91 87654 32109', bookings: 3, spent: 28500, lastBooking: '2025-12-18' },
            { id: 3, name: 'Amit Patel', email: 'amit@email.com', phone: '+91 76543 21098', bookings: 8, spent: 95000, lastBooking: '2025-12-25' },
        ]);

        setBookings([
            { id: 'B001', customer: 'Rahul Sharma', route: 'DEL → BOM', date: '2025-12-30', amount: 8500, status: 'CONFIRMED', paymentStatus: 'PAID' },
            { id: 'B002', customer: 'Priya Singh', route: 'BOM → GOI', date: '2025-12-28', amount: 4200, status: 'CONFIRMED', paymentStatus: 'PAID' },
            { id: 'B003', customer: 'Guest User', route: 'DEL → BLR', date: '2025-12-29', amount: 6800, status: 'PENDING', paymentStatus: 'PENDING' },
        ]);

        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        // API call to save
        await new Promise(r => setTimeout(r, 1000));
        setSaving(false);
        alert('Settings saved successfully!');
    };

    const handleConfigChange = (field, value) => {
        setSiteConfig(prev => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                                style={{ backgroundColor: siteConfig.primary_color }}
                            >
                                {siteConfig.site_name.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">B2C Website Manager</h1>
                                <p className="text-sm text-gray-500">{siteConfig.site_name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <a
                                href={`https://${siteConfig.subdomain}.tripcode.in`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                View Site
                            </a>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                siteConfig.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {siteConfig.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex gap-6">
                    {/* Sidebar */}
                    <div className="w-64 flex-shrink-0">
                        <nav className="bg-white rounded-xl shadow-sm overflow-hidden">
                            {[
                                { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                                { id: 'branding', label: 'Branding', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
                                { id: 'pricing', label: 'Pricing & Markup', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                                { id: 'customers', label: 'Customers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                                { id: 'bookings', label: 'B2C Bookings', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
                                { id: 'content', label: 'Content & Pages', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
                                { id: 'seo', label: 'SEO & Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
                                { id: 'payment', label: 'Payment Settings', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
                            ].map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left ${
                                        activeTab === item.id
                                            ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                    </svg>
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Dashboard */}
                        {activeTab === 'dashboard' && (
                            <div className="space-y-6">
                                {/* Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <p className="text-sm text-gray-500">Total Customers</p>
                                        <p className="text-3xl font-bold mt-1">{stats.totalCustomers.toLocaleString()}</p>
                                        <p className="text-sm text-green-600 mt-1">+{stats.newCustomersThisMonth} this month</p>
                                    </div>
                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <p className="text-sm text-gray-500">Total Bookings</p>
                                        <p className="text-3xl font-bold mt-1">{stats.totalBookings}</p>
                                        <p className="text-sm text-green-600 mt-1">+{stats.bookingsThisMonth} this month</p>
                                    </div>
                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <p className="text-sm text-gray-500">Revenue (This Month)</p>
                                        <p className="text-3xl font-bold text-green-600 mt-1">₹{(stats.revenueThisMonth / 1000).toFixed(0)}K</p>
                                        <p className="text-sm text-gray-500 mt-1">Total: ₹{(stats.revenue / 100000).toFixed(1)}L</p>
                                    </div>
                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <p className="text-sm text-gray-500">Avg Booking Value</p>
                                        <p className="text-3xl font-bold mt-1">₹{stats.avgBookingValue.toLocaleString()}</p>
                                        <p className="text-sm text-gray-500 mt-1">{stats.conversionRate}% conversion</p>
                                    </div>
                                </div>

                                {/* Recent Bookings */}
                                <div className="bg-white rounded-xl shadow-sm">
                                    <div className="p-6 border-b flex justify-between items-center">
                                        <h3 className="font-semibold">Recent B2C Bookings</h3>
                                        <button onClick={() => setActiveTab('bookings')} className="text-blue-600 text-sm">View All</button>
                                    </div>
                                    <div className="divide-y">
                                        {bookings.slice(0, 5).map(booking => (
                                            <div key={booking.id} className="p-4 flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">{booking.route}</p>
                                                    <p className="text-sm text-gray-500">{booking.customer} • {booking.date}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">₹{booking.amount.toLocaleString()}</p>
                                                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                                                        booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Links */}
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h3 className="font-semibold mb-4">Quick Actions</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            { label: 'Update Branding', tab: 'branding', color: 'bg-blue-100 text-blue-600' },
                                            { label: 'Manage Markup', tab: 'pricing', color: 'bg-green-100 text-green-600' },
                                            { label: 'View Customers', tab: 'customers', color: 'bg-purple-100 text-purple-600' },
                                            { label: 'SEO Settings', tab: 'seo', color: 'bg-orange-100 text-orange-600' },
                                        ].map(action => (
                                            <button
                                                key={action.tab}
                                                onClick={() => setActiveTab(action.tab)}
                                                className={`p-4 rounded-lg ${action.color} text-center font-medium hover:opacity-80`}
                                            >
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Branding */}
                        {activeTab === 'branding' && (
                            <div className="bg-white rounded-xl shadow-sm">
                                <div className="p-6 border-b">
                                    <h2 className="text-xl font-bold">Branding & Appearance</h2>
                                    <p className="text-gray-500 text-sm mt-1">Customize how your B2C website looks</p>
                                </div>
                                <div className="p-6 space-y-6">
                                    {/* Site Info */}
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                                            <input
                                                type="text"
                                                value={siteConfig.site_name}
                                                onChange={(e) => handleConfigChange('site_name', e.target.value)}
                                                className="w-full px-4 py-2 border rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                                            <input
                                                type="text"
                                                value={siteConfig.site_tagline}
                                                onChange={(e) => handleConfigChange('site_tagline', e.target.value)}
                                                className="w-full px-4 py-2 border rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    {/* Colors */}
                                    <div>
                                        <h3 className="font-medium mb-4">Brand Colors</h3>
                                        <div className="flex gap-6">
                                            {['primary_color', 'secondary_color', 'accent_color'].map(colorField => (
                                                <div key={colorField}>
                                                    <label className="block text-xs text-gray-500 mb-1 capitalize">
                                                        {colorField.replace('_', ' ')}
                                                    </label>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="color"
                                                            value={siteConfig[colorField]}
                                                            onChange={(e) => handleConfigChange(colorField, e.target.value)}
                                                            className="w-12 h-12 rounded cursor-pointer"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={siteConfig[colorField]}
                                                            onChange={(e) => handleConfigChange(colorField, e.target.value)}
                                                            className="w-24 px-2 py-1 border rounded text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Logo Upload */}
                                    <div>
                                        <h3 className="font-medium mb-4">Logo</h3>
                                        <div className="flex items-center gap-4">
                                            <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center">
                                                {siteConfig.logo_url ? (
                                                    <img src={siteConfig.logo_url} alt="Logo" className="max-w-full max-h-full" />
                                                ) : (
                                                    <div
                                                        className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-2xl"
                                                        style={{ backgroundColor: siteConfig.primary_color }}
                                                    >
                                                        {siteConfig.site_name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                                                Upload Logo
                                            </button>
                                        </div>
                                    </div>

                                    {/* Contact Info */}
                                    <div>
                                        <h3 className="font-medium mb-4">Contact Information (Displayed on Site)</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    value={siteConfig.display_email}
                                                    onChange={(e) => handleConfigChange('display_email', e.target.value)}
                                                    className="w-full px-4 py-2 border rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">Phone</label>
                                                <input
                                                    type="text"
                                                    value={siteConfig.display_phone}
                                                    onChange={(e) => handleConfigChange('display_phone', e.target.value)}
                                                    className="w-full px-4 py-2 border rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">WhatsApp</label>
                                                <input
                                                    type="text"
                                                    value={siteConfig.display_whatsapp}
                                                    onChange={(e) => handleConfigChange('display_whatsapp', e.target.value)}
                                                    className="w-full px-4 py-2 border rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">Address</label>
                                                <input
                                                    type="text"
                                                    value={siteConfig.display_address}
                                                    onChange={(e) => handleConfigChange('display_address', e.target.value)}
                                                    className="w-full px-4 py-2 border rounded-lg"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Social Links */}
                                    <div>
                                        <h3 className="font-medium mb-4">Social Media Links</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {['facebook_url', 'instagram_url', 'twitter_url'].map(field => (
                                                <div key={field}>
                                                    <label className="block text-sm text-gray-600 mb-1 capitalize">
                                                        {field.replace('_url', '')}
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={siteConfig[field]}
                                                        onChange={(e) => handleConfigChange(field, e.target.value)}
                                                        placeholder={`https://${field.replace('_url', '')}.com/...`}
                                                        className="w-full px-4 py-2 border rounded-lg"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 border-t bg-gray-50 flex justify-end">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Pricing & Markup */}
                        {activeTab === 'pricing' && (
                            <div className="bg-white rounded-xl shadow-sm">
                                <div className="p-6 border-b">
                                    <h2 className="text-xl font-bold">Pricing & Markup</h2>
                                    <p className="text-gray-500 text-sm mt-1">Configure how prices are shown to customers</p>
                                </div>
                                <div className="p-6 space-y-6">
                                    {/* Markup Type */}
                                    <div>
                                        <h3 className="font-medium mb-4">B2C Markup</h3>
                                        <div className="flex gap-4 items-end">
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">Markup Type</label>
                                                <select
                                                    value={siteConfig.b2c_markup_type}
                                                    onChange={(e) => handleConfigChange('b2c_markup_type', e.target.value)}
                                                    className="px-4 py-2 border rounded-lg"
                                                >
                                                    <option value="PERCENTAGE">Percentage (%)</option>
                                                    <option value="FLAT">Flat Amount (₹)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">Value</label>
                                                <input
                                                    type="number"
                                                    value={siteConfig.b2c_markup_value}
                                                    onChange={(e) => handleConfigChange('b2c_markup_value', parseFloat(e.target.value))}
                                                    className="w-32 px-4 py-2 border rounded-lg"
                                                    min="0"
                                                    step="0.5"
                                                />
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2">
                                            This markup will be added to flight prices. Example: A ₹5,000 flight will show as ₹
                                            {siteConfig.b2c_markup_type === 'PERCENTAGE'
                                                ? (5000 * (1 + siteConfig.b2c_markup_value / 100)).toLocaleString()
                                                : (5000 + siteConfig.b2c_markup_value).toLocaleString()
                                            }
                                        </p>
                                    </div>

                                    {/* Convenience Fee */}
                                    <div>
                                        <h3 className="font-medium mb-4">Convenience Fee</h3>
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">Fee per booking (₹)</label>
                                            <input
                                                type="number"
                                                value={siteConfig.b2c_convenience_fee}
                                                onChange={(e) => handleConfigChange('b2c_convenience_fee', parseFloat(e.target.value))}
                                                className="w-32 px-4 py-2 border rounded-lg"
                                                min="0"
                                            />
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2">
                                            This fee is added to every booking as a service charge
                                        </p>
                                    </div>

                                    {/* Preview */}
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="font-medium mb-4">Price Display Preview</h3>
                                        <div className="max-w-sm bg-white rounded-lg p-4 shadow-sm">
                                            <p className="text-gray-600 mb-2">Sample Flight: DEL → BOM</p>
                                            <div className="space-y-1 text-sm">
                                                <div className="flex justify-between">
                                                    <span>Base Fare</span>
                                                    <span>₹4,500</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Taxes</span>
                                                    <span>₹500</span>
                                                </div>
                                                {siteConfig.b2c_markup_value > 0 && (
                                                    <div className="flex justify-between text-gray-500">
                                                        <span>Service Fee</span>
                                                        <span>₹{siteConfig.b2c_markup_type === 'PERCENTAGE'
                                                            ? Math.round(5000 * siteConfig.b2c_markup_value / 100)
                                                            : siteConfig.b2c_markup_value}</span>
                                                    </div>
                                                )}
                                                {siteConfig.b2c_convenience_fee > 0 && (
                                                    <div className="flex justify-between text-gray-500">
                                                        <span>Convenience Fee</span>
                                                        <span>₹{siteConfig.b2c_convenience_fee}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                                    <span>Total</span>
                                                    <span className="text-blue-600">₹{(
                                                        5000 +
                                                        (siteConfig.b2c_markup_type === 'PERCENTAGE'
                                                            ? Math.round(5000 * siteConfig.b2c_markup_value / 100)
                                                            : siteConfig.b2c_markup_value) +
                                                        siteConfig.b2c_convenience_fee
                                                    ).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 border-t bg-gray-50 flex justify-end">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Customers */}
                        {activeTab === 'customers' && (
                            <div className="bg-white rounded-xl shadow-sm">
                                <div className="p-6 border-b flex justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-bold">Customers</h2>
                                        <p className="text-gray-500 text-sm mt-1">{customers.length} registered customers</p>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search customers..."
                                        className="px-4 py-2 border rounded-lg"
                                    />
                                </div>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bookings</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Booking</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {customers.map(customer => (
                                            <tr key={customer.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <p className="font-medium">{customer.name}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm">{customer.email}</p>
                                                    <p className="text-sm text-gray-500">{customer.phone}</p>
                                                </td>
                                                <td className="px-6 py-4 text-sm">{customer.bookings}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-green-600">
                                                    ₹{customer.spent.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{customer.lastBooking}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Bookings */}
                        {activeTab === 'bookings' && (
                            <div className="bg-white rounded-xl shadow-sm">
                                <div className="p-6 border-b flex justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-bold">B2C Bookings</h2>
                                        <p className="text-gray-500 text-sm mt-1">All bookings from your B2C website</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <select className="px-4 py-2 border rounded-lg">
                                            <option value="">All Status</option>
                                            <option value="CONFIRMED">Confirmed</option>
                                            <option value="PENDING">Pending</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            className="px-4 py-2 border rounded-lg"
                                        />
                                    </div>
                                </div>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Travel Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {bookings.map(booking => (
                                            <tr key={booking.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium">{booking.id}</td>
                                                <td className="px-6 py-4 text-sm">{booking.customer}</td>
                                                <td className="px-6 py-4 text-sm">{booking.route}</td>
                                                <td className="px-6 py-4 text-sm">{booking.date}</td>
                                                <td className="px-6 py-4 text-sm font-medium">₹{booking.amount.toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                        booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                        booking.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {booking.paymentStatus}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* SEO */}
                        {activeTab === 'seo' && (
                            <div className="bg-white rounded-xl shadow-sm">
                                <div className="p-6 border-b">
                                    <h2 className="text-xl font-bold">SEO & Analytics</h2>
                                    <p className="text-gray-500 text-sm mt-1">Optimize your site for search engines</p>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                                        <input
                                            type="text"
                                            value={siteConfig.meta_title}
                                            onChange={(e) => handleConfigChange('meta_title', e.target.value)}
                                            className="w-full px-4 py-2 border rounded-lg"
                                            maxLength="60"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">{siteConfig.meta_title.length}/60 characters</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                                        <textarea
                                            value={siteConfig.meta_description}
                                            onChange={(e) => handleConfigChange('meta_description', e.target.value)}
                                            className="w-full px-4 py-2 border rounded-lg"
                                            rows={3}
                                            maxLength="160"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">{siteConfig.meta_description.length}/160 characters</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Google Analytics ID</label>
                                        <input
                                            type="text"
                                            value={siteConfig.google_analytics_id}
                                            onChange={(e) => handleConfigChange('google_analytics_id', e.target.value)}
                                            placeholder="G-XXXXXXXXXX"
                                            className="w-full px-4 py-2 border rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div className="p-6 border-t bg-gray-50 flex justify-end">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Payment Settings */}
                        {activeTab === 'payment' && (
                            <div className="bg-white rounded-xl shadow-sm">
                                <div className="p-6 border-b">
                                    <h2 className="text-xl font-bold">Payment Settings</h2>
                                    <p className="text-gray-500 text-sm mt-1">Configure payment gateway for customer payments</p>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Gateway</label>
                                        <select
                                            value={siteConfig.payment_gateway}
                                            onChange={(e) => handleConfigChange('payment_gateway', e.target.value)}
                                            className="px-4 py-2 border rounded-lg"
                                        >
                                            <option value="RAZORPAY">Razorpay</option>
                                            <option value="PAYU">PayU</option>
                                            <option value="CASHFREE">Cashfree</option>
                                        </select>
                                    </div>

                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <input
                                                type="checkbox"
                                                checked={siteConfig.payment_test_mode}
                                                onChange={(e) => handleConfigChange('payment_test_mode', e.target.checked)}
                                                className="rounded"
                                            />
                                            <span className="font-medium">Test Mode</span>
                                        </div>
                                        <p className="text-sm text-yellow-800">
                                            When test mode is enabled, no actual payments will be processed. Use this for testing.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">
                                            Contact support to configure your payment gateway credentials. Your API keys will be stored securely.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Content */}
                        {activeTab === 'content' && (
                            <div className="bg-white rounded-xl shadow-sm">
                                <div className="p-6 border-b">
                                    <h2 className="text-xl font-bold">Content & Pages</h2>
                                    <p className="text-gray-500 text-sm mt-1">Manage your website content</p>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">About Us</label>
                                        <textarea
                                            value={siteConfig.about_us}
                                            onChange={(e) => handleConfigChange('about_us', e.target.value)}
                                            placeholder="Tell your customers about your company..."
                                            className="w-full px-4 py-2 border rounded-lg"
                                            rows={4}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions</label>
                                        <textarea
                                            value={siteConfig.terms_conditions}
                                            onChange={(e) => handleConfigChange('terms_conditions', e.target.value)}
                                            placeholder="Enter your terms and conditions..."
                                            className="w-full px-4 py-2 border rounded-lg"
                                            rows={4}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Privacy Policy</label>
                                        <textarea
                                            value={siteConfig.privacy_policy}
                                            onChange={(e) => handleConfigChange('privacy_policy', e.target.value)}
                                            placeholder="Enter your privacy policy..."
                                            className="w-full px-4 py-2 border rounded-lg"
                                            rows={4}
                                        />
                                    </div>
                                </div>
                                <div className="p-6 border-t bg-gray-50 flex justify-end">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default B2CAdminPanel;
