import React, { useState } from 'react';
import {
    Cog6ToothIcon,
    GlobeAltIcon,
    ShieldCheckIcon,
    EnvelopeIcon,
    BellIcon,
    CurrencyRupeeIcon
} from '@heroicons/react/24/outline';

const SuperAdminGlobalSettings = () => {
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', name: 'General', icon: Cog6ToothIcon },
        { id: 'security', name: 'Security', icon: ShieldCheckIcon },
        { id: 'email', name: 'Email', icon: EnvelopeIcon },
        { id: 'notifications', name: 'Notifications', icon: BellIcon },
        { id: 'billing', name: 'Billing', icon: CurrencyRupeeIcon }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-2xl font-bold">Global Settings</h1>
                    <p className="text-indigo-200">Platform-wide configuration settings</p>
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
                                                ? 'bg-indigo-50 text-indigo-700'
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
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
                                            <input type="text" defaultValue="TripCode Platform" className="w-full border rounded-lg px-3 py-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                                            <input type="email" defaultValue="support@tripcode.com" className="w-full border rounded-lg px-3 py-2" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Platform URL</label>
                                        <input type="text" defaultValue="https://platform.tripcode.com" className="w-full border rounded-lg px-3 py-2" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Default Timezone</label>
                                            <select className="w-full border rounded-lg px-3 py-2">
                                                <option>Asia/Kolkata (IST)</option>
                                                <option>UTC</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
                                            <select className="w-full border rounded-lg px-3 py-2">
                                                <option>INR - Indian Rupee</option>
                                                <option>USD - US Dollar</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div>
                                            <div className="font-medium">Maintenance Mode</div>
                                            <div className="text-sm text-gray-500">Put platform in maintenance mode</div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                        </label>
                                    </div>
                                    <div className="pt-4 border-t flex justify-end">
                                        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
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
                                            <div className="font-medium">Force 2FA for All Admins</div>
                                            <div className="text-sm text-gray-500">Require two-factor authentication</div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div>
                                            <div className="font-medium">Password Complexity</div>
                                            <div className="text-sm text-gray-500">Enforce strong password requirements</div>
                                        </div>
                                        <select className="border rounded-lg px-3 py-2">
                                            <option>High</option>
                                            <option>Medium</option>
                                            <option>Low</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div>
                                            <div className="font-medium">Session Timeout</div>
                                            <div className="text-sm text-gray-500">Auto logout after inactivity</div>
                                        </div>
                                        <select className="border rounded-lg px-3 py-2">
                                            <option>30 minutes</option>
                                            <option>1 hour</option>
                                            <option>4 hours</option>
                                            <option>8 hours</option>
                                        </select>
                                    </div>
                                    <div className="pt-4 border-t flex justify-end">
                                        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'email' && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-semibold mb-6">Email Configuration</h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
                                        <input type="text" defaultValue="smtp.sendgrid.net" className="w-full border rounded-lg px-3 py-2" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
                                            <input type="text" defaultValue="587" className="w-full border rounded-lg px-3 py-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Encryption</label>
                                            <select className="w-full border rounded-lg px-3 py-2">
                                                <option>TLS</option>
                                                <option>SSL</option>
                                                <option>None</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                            <input type="text" defaultValue="apikey" className="w-full border rounded-lg px-3 py-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                            <input type="password" defaultValue="••••••••••••" className="w-full border rounded-lg px-3 py-2" />
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t flex justify-end gap-3">
                                        <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">Test Connection</button>
                                        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
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

export default SuperAdminGlobalSettings;
