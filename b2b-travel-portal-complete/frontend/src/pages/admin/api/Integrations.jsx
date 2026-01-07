/**
 * Integrations Page
 * Manage third-party integrations
 */

import React, { useState } from 'react';
import {
    ServerIcon,
    CheckCircleIcon,
    XCircleIcon,
    Cog6ToothIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

const integrations = [
    {
        id: 1,
        name: 'Amadeus GDS',
        category: 'Flights',
        description: 'Global distribution system for flight bookings',
        status: 'connected',
        lastSync: '2024-02-28 15:00',
        logo: '✈️'
    },
    {
        id: 2,
        name: 'Sabre',
        category: 'Flights',
        description: 'Alternative flight booking system',
        status: 'disconnected',
        lastSync: null,
        logo: '🛫'
    },
    {
        id: 3,
        name: 'Booking.com',
        category: 'Hotels',
        description: 'Hotel inventory and rates',
        status: 'connected',
        lastSync: '2024-02-28 14:30',
        logo: '🏨'
    },
    {
        id: 4,
        name: 'Expedia Partner',
        category: 'Hotels',
        description: 'Alternative hotel inventory',
        status: 'pending',
        lastSync: null,
        logo: '🏢'
    },
    {
        id: 5,
        name: 'Razorpay',
        category: 'Payments',
        description: 'Payment gateway for INR transactions',
        status: 'connected',
        lastSync: '2024-02-28 15:30',
        logo: '💳'
    },
    {
        id: 6,
        name: 'PayU',
        category: 'Payments',
        description: 'Alternative payment gateway',
        status: 'connected',
        lastSync: '2024-02-28 12:00',
        logo: '💰'
    },
    {
        id: 7,
        name: 'Twilio',
        category: 'Communication',
        description: 'SMS and WhatsApp notifications',
        status: 'connected',
        lastSync: '2024-02-28 10:00',
        logo: '📱'
    },
    {
        id: 8,
        name: 'SendGrid',
        category: 'Communication',
        description: 'Email delivery service',
        status: 'connected',
        lastSync: '2024-02-28 09:00',
        logo: '📧'
    }
];

const Integrations = () => {
    const [filter, setFilter] = useState('all');

    const categories = ['all', ...new Set(integrations.map(i => i.category))];

    const filteredIntegrations = filter === 'all'
        ? integrations
        : integrations.filter(i => i.category === filter);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'connected':
                return (
                    <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-sm">
                        <CheckCircleIcon className="w-4 h-4" />
                        Connected
                    </span>
                );
            case 'disconnected':
                return (
                    <span className="flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-1 rounded-full text-sm">
                        <XCircleIcon className="w-4 h-4" />
                        Disconnected
                    </span>
                );
            case 'pending':
                return (
                    <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-sm">
                        <ArrowPathIcon className="w-4 h-4" />
                        Pending
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
                    <p className="text-gray-500 mt-1">Manage third-party service connections</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Total Integrations</p>
                    <p className="text-2xl font-bold text-gray-900">{integrations.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Connected</p>
                    <p className="text-2xl font-bold text-green-600">
                        {integrations.filter(i => i.status === 'connected').length}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">
                        {integrations.filter(i => i.status === 'pending').length}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Disconnected</p>
                    <p className="text-2xl font-bold text-gray-500">
                        {integrations.filter(i => i.status === 'disconnected').length}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setFilter(category)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filter === category
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {category === 'all' ? 'All' : category}
                    </button>
                ))}
            </div>

            {/* Integrations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredIntegrations.map((integration) => (
                    <div
                        key={integration.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                                    {integration.logo}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                                    <p className="text-sm text-gray-500">{integration.category}</p>
                                </div>
                            </div>
                            {getStatusBadge(integration.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
                        {integration.lastSync && (
                            <p className="text-xs text-gray-400 mb-3">Last sync: {integration.lastSync}</p>
                        )}
                        <div className="flex gap-2">
                            {integration.status === 'connected' ? (
                                <>
                                    <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                                        <Cog6ToothIcon className="w-4 h-4" />
                                        Configure
                                    </button>
                                    <button className="flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                                        <ArrowPathIcon className="w-4 h-4" />
                                        Sync
                                    </button>
                                </>
                            ) : (
                                <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                                    Connect
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Available Integrations */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Explore More Integrations</h2>
                <p className="text-gray-600 mb-4">
                    Connect additional services to enhance your portal's capabilities.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4 text-center hover:border-blue-500 cursor-pointer transition-colors">
                        <div className="text-3xl mb-2">🚌</div>
                        <h3 className="font-medium text-gray-900 text-sm">RedBus</h3>
                        <p className="text-xs text-gray-500">Bus Bookings</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 text-center hover:border-blue-500 cursor-pointer transition-colors">
                        <div className="text-3xl mb-2">🛡️</div>
                        <h3 className="font-medium text-gray-900 text-sm">ICICI Lombard</h3>
                        <p className="text-xs text-gray-500">Insurance</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 text-center hover:border-blue-500 cursor-pointer transition-colors">
                        <div className="text-3xl mb-2">📊</div>
                        <h3 className="font-medium text-gray-900 text-sm">Google Analytics</h3>
                        <p className="text-xs text-gray-500">Analytics</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 text-center hover:border-blue-500 cursor-pointer transition-colors">
                        <div className="text-3xl mb-2">💬</div>
                        <h3 className="font-medium text-gray-900 text-sm">Intercom</h3>
                        <p className="text-xs text-gray-500">Support</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Integrations;
