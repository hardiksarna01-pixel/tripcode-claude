import React, { useState } from 'react';
import {
    CodeBracketIcon,
    PlusIcon,
    KeyIcon,
    ChartBarIcon,
    ClockIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const SuperAdminAPIManagement = () => {
    const [activeTab, setActiveTab] = useState('keys');

    const stats = {
        totalKeys: 125,
        activeKeys: 118,
        totalCalls: 45680000,
        avgLatency: 145
    };

    const apiKeys = [
        { id: 'KEY001', company: 'TravelMax India', key: 'tk_live_xxxxxxxxxx1234', calls: 15680000, status: 'active', created: '2023-01-15' },
        { id: 'KEY002', company: 'Global Trips', key: 'tk_live_xxxxxxxxxx5678', calls: 9800000, status: 'active', created: '2023-03-22' },
        { id: 'KEY003', company: 'JetSet Tours', key: 'tk_live_xxxxxxxxxx9012', calls: 7800000, status: 'active', created: '2023-05-10' },
        { id: 'KEY004', company: 'Voyage Travels', key: 'tk_test_xxxxxxxxxx3456', calls: 12500, status: 'test', created: '2024-06-13' }
    ];

    const rateLimits = [
        { endpoint: '/api/flights/search', limit: '100/min', usage: 85 },
        { endpoint: '/api/hotels/search', limit: '50/min', usage: 62 },
        { endpoint: '/api/bookings/create', limit: '20/min', usage: 45 },
        { endpoint: '/api/payments/process', limit: '10/min', usage: 30 }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">API Management</h1>
                            <p className="text-indigo-200">Manage API keys and rate limits</p>
                        </div>
                        <button className="px-4 py-2 bg-white text-indigo-900 rounded-lg flex items-center gap-2 hover:bg-indigo-50">
                            <PlusIcon className="w-5 h-5" />
                            Generate Key
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <KeyIcon className="w-5 h-5" />
                            <span className="text-sm">API Keys</span>
                        </div>
                        <div className="text-2xl font-bold">{stats.totalKeys}</div>
                        <div className="text-xs text-green-600">{stats.activeKeys} active</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <ChartBarIcon className="w-5 h-5" />
                            <span className="text-sm">Total API Calls</span>
                        </div>
                        <div className="text-2xl font-bold">{(stats.totalCalls / 1000000).toFixed(1)}M</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <ClockIcon className="w-5 h-5" />
                            <span className="text-sm">Avg Latency</span>
                        </div>
                        <div className="text-2xl font-bold">{stats.avgLatency}ms</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <ExclamationTriangleIcon className="w-5 h-5" />
                            <span className="text-sm">Rate Limit Hits</span>
                        </div>
                        <div className="text-2xl font-bold text-orange-600">23</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm mb-6">
                    <div className="flex border-b">
                        {['keys', 'rate-limits', 'logs'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-4 text-sm font-medium capitalize ${
                                    activeTab === tab
                                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab.replace('-', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* API Keys */}
                {activeTab === 'keys' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Company</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">API Key</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Total Calls</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Created</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {apiKeys.map((key) => (
                                    <tr key={key.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">{key.company}</td>
                                        <td className="px-4 py-3">
                                            <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">{key.key}</code>
                                        </td>
                                        <td className="px-4 py-3">{(key.calls / 1000000).toFixed(1)}M</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                key.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {key.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{key.created}</td>
                                        <td className="px-4 py-3">
                                            <button className="text-indigo-600 text-sm hover:underline">Manage</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Rate Limits */}
                {activeTab === 'rate-limits' && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="font-semibold mb-4">Endpoint Rate Limits</h2>
                        <div className="space-y-4">
                            {rateLimits.map((endpoint, index) => (
                                <div key={index} className="p-4 border rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <code className="text-sm font-mono text-indigo-600">{endpoint.endpoint}</code>
                                        <span className="text-sm text-gray-500">{endpoint.limit}</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full">
                                        <div
                                            className={`h-2 rounded-full ${
                                                endpoint.usage > 80 ? 'bg-red-500' :
                                                endpoint.usage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                            }`}
                                            style={{ width: `${endpoint.usage}%` }}
                                        />
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">{endpoint.usage}% utilized</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Logs */}
                {activeTab === 'logs' && (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <CodeBracketIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">API Request Logs</h3>
                        <p className="text-gray-500">View detailed API request and response logs</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuperAdminAPIManagement;
