import React, { useState } from 'react';

const WhiteLabelSettings = () => {
    const [activeTab, setActiveTab] = useState('branding');
    const [branding, setBranding] = useState({
        companyName: 'My Travel Agency',
        logo: null,
        primaryColor: '#2563eb',
        secondaryColor: '#1e40af',
        accentColor: '#3b82f6',
        headerBgColor: '#ffffff',
        sidebarBgColor: '#ffffff',
        footerText: 'Powered by My Travel Agency',
        supportEmail: 'support@mytravelagency.com',
        supportPhone: '+91-9876543210'
    });
    const [domain, setDomain] = useState({
        customDomain: '',
        status: 'not_configured',
        verificationToken: null
    });
    const [saving, setSaving] = useState(false);

    const handleBrandingChange = (field, value) => {
        setBranding(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSaving(false);
        alert('Settings saved successfully!');
    };

    const handleDomainVerify = () => {
        if (!domain.customDomain) {
            alert('Please enter a domain');
            return;
        }
        setDomain(prev => ({
            ...prev,
            status: 'pending_verification',
            verificationToken: 'tc_verify_' + Math.random().toString(36).substr(2, 16)
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">White Label Settings</h1>
                    <p className="text-gray-500">Customize your portal's appearance and branding</p>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-t-xl border-b">
                    <nav className="flex">
                        {['branding', 'domain', 'emails', 'legal'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-4 font-medium capitalize ${
                                    activeTab === tab
                                        ? 'border-b-2 border-blue-600 text-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="bg-white rounded-b-xl shadow-sm p-6">
                    {activeTab === 'branding' && (
                        <div className="grid grid-cols-2 gap-8">
                            {/* Form Section */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                                    <input
                                        type="text"
                                        value={branding.companyName}
                                        onChange={(e) => handleBrandingChange('companyName', e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed">
                                            {branding.logo ? (
                                                <img src={branding.logo} alt="Logo" className="max-w-full max-h-full" />
                                            ) : (
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            )}
                                        </div>
                                        <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                                            Upload Logo
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={branding.primaryColor}
                                                onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                                                className="w-10 h-10 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={branding.primaryColor}
                                                onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                                                className="flex-1 px-3 py-2 border rounded-lg text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={branding.secondaryColor}
                                                onChange={(e) => handleBrandingChange('secondaryColor', e.target.value)}
                                                className="w-10 h-10 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={branding.secondaryColor}
                                                onChange={(e) => handleBrandingChange('secondaryColor', e.target.value)}
                                                className="flex-1 px-3 py-2 border rounded-lg text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={branding.accentColor}
                                                onChange={(e) => handleBrandingChange('accentColor', e.target.value)}
                                                className="w-10 h-10 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={branding.accentColor}
                                                onChange={(e) => handleBrandingChange('accentColor', e.target.value)}
                                                className="flex-1 px-3 py-2 border rounded-lg text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Footer Text</label>
                                    <input
                                        type="text"
                                        value={branding.footerText}
                                        onChange={(e) => handleBrandingChange('footerText', e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                                        <input
                                            type="email"
                                            value={branding.supportEmail}
                                            onChange={(e) => handleBrandingChange('supportEmail', e.target.value)}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Support Phone</label>
                                        <input
                                            type="tel"
                                            value={branding.supportPhone}
                                            onChange={(e) => handleBrandingChange('supportPhone', e.target.value)}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Preview Section */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-4">Preview</h3>
                                <div className="border rounded-lg overflow-hidden shadow-lg">
                                    {/* Mini Header */}
                                    <div className="p-4 flex items-center justify-between" style={{ backgroundColor: branding.headerBgColor }}>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: branding.primaryColor }}>
                                                <span className="text-white font-bold text-sm">{branding.companyName[0]}</span>
                                            </div>
                                            <span className="font-bold" style={{ color: branding.primaryColor }}>{branding.companyName}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="w-16 h-2 rounded" style={{ backgroundColor: branding.secondaryColor, opacity: 0.3 }}></div>
                                            <div className="w-16 h-2 rounded" style={{ backgroundColor: branding.secondaryColor, opacity: 0.3 }}></div>
                                        </div>
                                    </div>

                                    {/* Mini Content */}
                                    <div className="p-4 bg-gray-50">
                                        <div className="bg-white rounded-lg p-4 mb-4">
                                            <div className="flex gap-4 mb-4">
                                                <div className="flex-1 h-10 rounded" style={{ backgroundColor: branding.primaryColor, opacity: 0.1 }}></div>
                                                <div className="flex-1 h-10 rounded" style={{ backgroundColor: branding.primaryColor, opacity: 0.1 }}></div>
                                            </div>
                                            <button className="w-full py-2 rounded text-white text-sm" style={{ backgroundColor: branding.primaryColor }}>
                                                Search Flights
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="h-20 bg-white rounded-lg"></div>
                                            <div className="h-20 bg-white rounded-lg"></div>
                                        </div>
                                    </div>

                                    {/* Mini Footer */}
                                    <div className="p-3 text-center text-xs text-gray-500" style={{ backgroundColor: branding.headerBgColor }}>
                                        {branding.footerText}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'domain' && (
                        <div className="max-w-2xl">
                            <div className="mb-6">
                                <h3 className="font-semibold mb-2">Custom Domain</h3>
                                <p className="text-gray-600 text-sm">
                                    Use your own domain for the travel portal. Enterprise plan required.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6 mb-6">
                                <div className="flex gap-4 mb-4">
                                    <input
                                        type="text"
                                        placeholder="travel.yourdomain.com"
                                        value={domain.customDomain}
                                        onChange={(e) => setDomain(prev => ({ ...prev, customDomain: e.target.value }))}
                                        className="flex-1 px-4 py-2 border rounded-lg"
                                    />
                                    <button
                                        onClick={handleDomainVerify}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        {domain.status === 'not_configured' ? 'Add Domain' : 'Verify'}
                                    </button>
                                </div>

                                {domain.status === 'pending_verification' && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <h4 className="font-medium text-yellow-800 mb-2">DNS Verification Required</h4>
                                        <p className="text-sm text-yellow-700 mb-3">
                                            Add the following TXT record to your domain's DNS settings:
                                        </p>
                                        <div className="bg-white rounded p-3 font-mono text-sm">
                                            <p><strong>Type:</strong> TXT</p>
                                            <p><strong>Name:</strong> _tripcode-verify</p>
                                            <p><strong>Value:</strong> {domain.verificationToken}</p>
                                        </div>
                                    </div>
                                )}

                                {domain.status === 'verified' && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-green-800">Domain verified and active</span>
                                    </div>
                                )}
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-medium text-blue-800 mb-2">SSL Certificate</h4>
                                <p className="text-sm text-blue-700">
                                    SSL certificates are automatically provisioned for custom domains. This may take up to 24 hours after DNS verification.
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'emails' && (
                        <div className="max-w-2xl space-y-6">
                            <div>
                                <h3 className="font-semibold mb-4">Email Templates</h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    Customize the emails sent to your customers. Your branding colors and logo will be automatically applied.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { id: 'booking_confirmation', name: 'Booking Confirmation', description: 'Sent when a booking is confirmed' },
                                    { id: 'booking_cancellation', name: 'Booking Cancellation', description: 'Sent when a booking is cancelled' },
                                    { id: 'payment_receipt', name: 'Payment Receipt', description: 'Sent after successful payment' },
                                    { id: 'reminder', name: 'Travel Reminder', description: 'Sent 24 hours before departure' },
                                    { id: 'refund', name: 'Refund Notification', description: 'Sent when refund is processed' },
                                ].map(template => (
                                    <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div>
                                            <p className="font-medium">{template.name}</p>
                                            <p className="text-sm text-gray-500">{template.description}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">
                                                Preview
                                            </button>
                                            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-medium mb-2">Email Sender Settings</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">From Name</label>
                                        <input type="text" defaultValue={branding.companyName} className="w-full px-4 py-2 border rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Reply-To Email</label>
                                        <input type="email" defaultValue={branding.supportEmail} className="w-full px-4 py-2 border rounded-lg" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'legal' && (
                        <div className="max-w-2xl space-y-6">
                            <div>
                                <h3 className="font-semibold mb-4">Legal Pages</h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    Customize your terms of service, privacy policy, and other legal documents.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { id: 'terms', name: 'Terms of Service', url: '/terms' },
                                    { id: 'privacy', name: 'Privacy Policy', url: '/privacy' },
                                    { id: 'refund', name: 'Refund Policy', url: '/refund-policy' },
                                    { id: 'cancellation', name: 'Cancellation Policy', url: '/cancellation-policy' },
                                ].map(page => (
                                    <div key={page.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div>
                                            <p className="font-medium">{page.name}</p>
                                            <p className="text-sm text-gray-500">{page.url}</p>
                                        </div>
                                        <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">
                                            Edit
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <h4 className="font-medium text-yellow-800 mb-2">Legal Disclaimer</h4>
                                <p className="text-sm text-yellow-700">
                                    The default legal documents are templates. Please consult with a legal professional to ensure they comply with your jurisdiction's requirements.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Save Button */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WhiteLabelSettings;
