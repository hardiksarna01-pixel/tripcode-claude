import React, { useState } from 'react';
import {
    Cog6ToothIcon,
    GlobeAltIcon,
    CurrencyRupeeIcon,
    BellIcon,
    EnvelopeIcon,
    DevicePhoneMobileIcon,
    ShieldCheckIcon,
    PaintBrushIcon
} from '@heroicons/react/24/outline';

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', name: 'General', icon: Cog6ToothIcon },
        { id: 'branding', name: 'Branding', icon: PaintBrushIcon },
        { id: 'currency', name: 'Currency', icon: CurrencyRupeeIcon },
        { id: 'notifications', name: 'Notifications', icon: BellIcon },
        { id: 'email', name: 'Email', icon: EnvelopeIcon },
        { id: 'sms', name: 'SMS', icon: DevicePhoneMobileIcon },
        { id: 'security', name: 'Security', icon: ShieldCheckIcon }
    ];

    const [settings, setSettings] = useState({
        companyName: 'TripCode Travels',
        companyEmail: 'info@tripcode.com',
        companyPhone: '+91 9876543210',
        website: 'www.tripcode.com',
        address: '123 Business Park, Mumbai, Maharashtra 400001',
        gstNumber: '27AABCT1234A1ZH',
        panNumber: 'AABCT1234A',
        timezone: 'Asia/Kolkata',
        dateFormat: 'DD/MM/YYYY',
        currency: 'INR',
        currencySymbol: '₹'
    });

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600">Configure system settings and preferences</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex gap-6">
                    {/* Sidebar */}
                    <div className="w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm p-4">
                            <nav className="space-y-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                                            activeTab === tab.id
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <tab.icon className="w-5 h-5" />
                                        {tab.name}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        {activeTab === 'general' && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-semibold mb-6">General Settings</h2>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                            <input
                                                type="text"
                                                value={settings.companyName}
                                                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                                                className="w-full border rounded-lg px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Company Email</label>
                                            <input
                                                type="email"
                                                value={settings.companyEmail}
                                                onChange={(e) => setSettings({ ...settings, companyEmail: e.target.value })}
                                                className="w-full border rounded-lg px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <input
                                                type="text"
                                                value={settings.companyPhone}
                                                onChange={(e) => setSettings({ ...settings, companyPhone: e.target.value })}
                                                className="w-full border rounded-lg px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                            <input
                                                type="text"
                                                value={settings.website}
                                                onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                                                className="w-full border rounded-lg px-3 py-2"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                        <textarea
                                            value={settings.address}
                                            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                            className="w-full border rounded-lg px-3 py-2"
                                            rows={2}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                                            <input
                                                type="text"
                                                value={settings.gstNumber}
                                                onChange={(e) => setSettings({ ...settings, gstNumber: e.target.value })}
                                                className="w-full border rounded-lg px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                                            <input
                                                type="text"
                                                value={settings.panNumber}
                                                onChange={(e) => setSettings({ ...settings, panNumber: e.target.value })}
                                                className="w-full border rounded-lg px-3 py-2"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                                            <select
                                                value={settings.timezone}
                                                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                                                className="w-full border rounded-lg px-3 py-2"
                                            >
                                                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                                                <option value="UTC">UTC</option>
                                                <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                                            <select
                                                value={settings.dateFormat}
                                                onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
                                                className="w-full border rounded-lg px-3 py-2"
                                            >
                                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t flex justify-end">
                                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'branding' && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-semibold mb-6">Branding Settings</h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                                        <div className="flex items-center gap-4">
                                            <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed">
                                                <span className="text-gray-400 text-sm">Upload Logo</span>
                                            </div>
                                            <div>
                                                <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
                                                    Choose File
                                                </button>
                                                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed">
                                                <span className="text-gray-400 text-xs">Icon</span>
                                            </div>
                                            <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
                                                Upload Favicon
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                                        <div className="flex items-center gap-3">
                                            <input type="color" value="#2563eb" className="w-12 h-10 rounded border" />
                                            <input type="text" value="#2563eb" className="border rounded-lg px-3 py-2 w-32" />
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t flex justify-end">
                                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'currency' && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-semibold mb-6">Currency Settings</h2>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
                                            <select className="w-full border rounded-lg px-3 py-2">
                                                <option value="INR">INR - Indian Rupee</option>
                                                <option value="USD">USD - US Dollar</option>
                                                <option value="EUR">EUR - Euro</option>
                                                <option value="GBP">GBP - British Pound</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Currency Symbol Position</label>
                                            <select className="w-full border rounded-lg px-3 py-2">
                                                <option value="before">Before Amount (₹100)</option>
                                                <option value="after">After Amount (100₹)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Exchange Rates</label>
                                        <div className="border rounded-lg overflow-hidden">
                                            <table className="w-full">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-4 py-2 text-left text-sm font-medium">Currency</th>
                                                        <th className="px-4 py-2 text-left text-sm font-medium">Rate (vs INR)</th>
                                                        <th className="px-4 py-2 text-left text-sm font-medium">Last Updated</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y">
                                                    <tr>
                                                        <td className="px-4 py-2">USD</td>
                                                        <td className="px-4 py-2">83.45</td>
                                                        <td className="px-4 py-2 text-sm text-gray-500">2 hours ago</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-2">EUR</td>
                                                        <td className="px-4 py-2">90.12</td>
                                                        <td className="px-4 py-2 text-sm text-gray-500">2 hours ago</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t flex justify-end">
                                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-semibold mb-6">Security Settings</h2>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div>
                                            <div className="font-medium">Two-Factor Authentication</div>
                                            <div className="text-sm text-gray-500">Require 2FA for all admin users</div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div>
                                            <div className="font-medium">Session Timeout</div>
                                            <div className="text-sm text-gray-500">Auto logout after inactivity</div>
                                        </div>
                                        <select className="border rounded-lg px-3 py-2">
                                            <option value="30">30 minutes</option>
                                            <option value="60">1 hour</option>
                                            <option value="120">2 hours</option>
                                            <option value="480">8 hours</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div>
                                            <div className="font-medium">IP Whitelisting</div>
                                            <div className="text-sm text-gray-500">Restrict admin access by IP</div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                    <div className="pt-4 border-t flex justify-end">
                                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
