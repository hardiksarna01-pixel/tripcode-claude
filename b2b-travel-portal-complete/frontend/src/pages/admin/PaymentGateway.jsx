import React, { useState } from 'react';
import {
    CreditCardIcon,
    CogIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

const AdminPaymentGateway = () => {
    const [activeGateway, setActiveGateway] = useState('razorpay');

    const gateways = [
        { id: 'razorpay', name: 'Razorpay', logo: '💳', status: 'active', transactions: 15000, volume: 45000000, successRate: 98.5 },
        { id: 'payu', name: 'PayU', logo: '💰', status: 'active', transactions: 4500, volume: 12000000, successRate: 97.2 },
        { id: 'ccavenue', name: 'CCAvenue', logo: '🏧', status: 'inactive', transactions: 0, volume: 0, successRate: 0 },
        { id: 'paytm', name: 'Paytm', logo: '📱', status: 'inactive', transactions: 0, volume: 0, successRate: 0 }
    ];

    const recentFailures = [
        { id: 'TXN001', amount: 15600, error: 'Card declined', time: '5 mins ago' },
        { id: 'TXN002', amount: 8500, error: 'Insufficient funds', time: '15 mins ago' },
        { id: 'TXN003', amount: 32000, error: 'Gateway timeout', time: '1 hour ago' }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">Payment Gateway</h1>
                    <p className="text-gray-600">Manage payment gateway configurations</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Today's Transactions</div>
                        <div className="text-2xl font-bold mt-1">1,250</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Today's Volume</div>
                        <div className="text-2xl font-bold mt-1">₹45.6L</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Success Rate</div>
                        <div className="text-2xl font-bold mt-1 text-green-600">98.2%</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Failed Today</div>
                        <div className="text-2xl font-bold mt-1 text-red-600">23</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Gateways */}
                    <div className="lg:col-span-2">
                        <div className="grid grid-cols-2 gap-4">
                            {gateways.map((gateway) => (
                                <div
                                    key={gateway.id}
                                    className={`bg-white rounded-xl shadow-sm p-6 cursor-pointer border-2 transition ${
                                        activeGateway === gateway.id ? 'border-blue-500' : 'border-transparent hover:border-gray-200'
                                    }`}
                                    onClick={() => setActiveGateway(gateway.id)}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                                                {gateway.logo}
                                            </div>
                                            <div>
                                                <div className="font-semibold">{gateway.name}</div>
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    gateway.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {gateway.status === 'active' ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </div>
                                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                                            <CogIcon className="w-5 h-5 text-gray-500" />
                                        </button>
                                    </div>

                                    {gateway.status === 'active' ? (
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Transactions</span>
                                                <span className="font-medium">{gateway.transactions.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Volume</span>
                                                <span className="font-medium">₹{(gateway.volume / 10000000).toFixed(1)}Cr</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Success Rate</span>
                                                <span className="font-medium text-green-600">{gateway.successRate}%</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-gray-500 text-sm mb-3">Gateway not configured</p>
                                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                                                Configure
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Gateway Configuration */}
                        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                            <h2 className="font-semibold mb-4">Gateway Configuration - {gateways.find(g => g.id === activeGateway)?.name}</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                                    <input type="password" value="••••••••••••••••" className="w-full border rounded-lg px-3 py-2" readOnly />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">API Secret</label>
                                    <input type="password" value="••••••••••••••••" className="w-full border rounded-lg px-3 py-2" readOnly />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
                                    <input type="text" value="https://api.tripcode.com/webhooks/razorpay" className="w-full border rounded-lg px-3 py-2" readOnly />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                                    <select className="w-full border rounded-lg px-3 py-2">
                                        <option>Live</option>
                                        <option>Test</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    Update Configuration
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Recent Failures */}
                        <div className="bg-white rounded-xl shadow-sm">
                            <div className="p-4 border-b flex items-center justify-between">
                                <h2 className="font-semibold">Recent Failures</h2>
                                <button className="text-sm text-blue-600 hover:underline">View All</button>
                            </div>
                            <div className="divide-y">
                                {recentFailures.map((failure) => (
                                    <div key={failure.id} className="p-4">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-sm">{failure.id}</span>
                                            <span className="font-medium">₹{failure.amount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-red-600">{failure.error}</span>
                                            <span className="text-gray-500">{failure.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="bg-white rounded-xl shadow-sm p-4">
                            <h2 className="font-semibold mb-4">Enabled Payment Methods</h2>
                            <div className="space-y-3">
                                {[
                                    { method: 'Credit/Debit Cards', enabled: true },
                                    { method: 'UPI', enabled: true },
                                    { method: 'Net Banking', enabled: true },
                                    { method: 'Wallets', enabled: true },
                                    { method: 'EMI', enabled: false }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-sm">{item.method}</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked={item.enabled} />
                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPaymentGateway;
