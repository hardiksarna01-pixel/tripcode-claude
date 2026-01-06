import React, { useState } from 'react';
import {
    BuildingOfficeIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    CheckCircleIcon,
    XCircleIcon,
    CogIcon,
    ChartBarIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

const AdminSuppliers = () => {
    const [activeCategory, setActiveCategory] = useState('flights');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        { id: 'flights', name: 'Flight APIs' },
        { id: 'hotels', name: 'Hotel APIs' },
        { id: 'buses', name: 'Bus APIs' },
        { id: 'insurance', name: 'Insurance APIs' },
        { id: 'visa', name: 'Visa APIs' },
        { id: 'payments', name: 'Payment Gateways' }
    ];

    const suppliers = {
        flights: [
            { id: 1, name: 'Amadeus', logo: '✈️', status: 'active', uptime: 99.8, requests: '125K', lastSync: '2 mins ago', credentials: true },
            { id: 2, name: 'TBO', logo: '🎫', status: 'active', uptime: 99.5, requests: '89K', lastSync: '5 mins ago', credentials: true },
            { id: 3, name: 'Galileo', logo: '🌐', status: 'active', uptime: 99.2, requests: '45K', lastSync: '3 mins ago', credentials: true },
            { id: 4, name: 'Mystifly', logo: '✨', status: 'inactive', uptime: 0, requests: '0', lastSync: 'N/A', credentials: false },
            { id: 5, name: 'Verteil', logo: '🔷', status: 'active', uptime: 98.9, requests: '32K', lastSync: '8 mins ago', credentials: true }
        ],
        hotels: [
            { id: 1, name: 'TBO Hotels', logo: '🏨', status: 'active', uptime: 99.6, requests: '78K', lastSync: '4 mins ago', credentials: true },
            { id: 2, name: 'Hotelbeds', logo: '🛏️', status: 'active', uptime: 99.3, requests: '56K', lastSync: '6 mins ago', credentials: true },
            { id: 3, name: 'Expedia', logo: '🌟', status: 'active', uptime: 99.1, requests: '42K', lastSync: '5 mins ago', credentials: true }
        ],
        buses: [
            { id: 1, name: 'RedBus', logo: '🚌', status: 'active', uptime: 99.4, requests: '65K', lastSync: '3 mins ago', credentials: true },
            { id: 2, name: 'AbhiBus', logo: '🚍', status: 'active', uptime: 98.8, requests: '28K', lastSync: '7 mins ago', credentials: true }
        ],
        insurance: [
            { id: 1, name: 'ICICI Lombard', logo: '🛡️', status: 'active', uptime: 99.7, requests: '12K', lastSync: '10 mins ago', credentials: true },
            { id: 2, name: 'Bajaj Allianz', logo: '🔒', status: 'active', uptime: 99.5, requests: '8K', lastSync: '15 mins ago', credentials: true }
        ],
        visa: [
            { id: 1, name: 'Atlys', logo: '📋', status: 'active', uptime: 99.2, requests: '5K', lastSync: '20 mins ago', credentials: true }
        ],
        payments: [
            { id: 1, name: 'Razorpay', logo: '💳', status: 'active', uptime: 99.9, requests: '150K', lastSync: '1 min ago', credentials: true },
            { id: 2, name: 'PayU', logo: '💰', status: 'active', uptime: 99.7, requests: '45K', lastSync: '2 mins ago', credentials: true },
            { id: 3, name: 'CCAvenue', logo: '🏧', status: 'inactive', uptime: 0, requests: '0', lastSync: 'N/A', credentials: false }
        ]
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Supplier Configuration</h1>
                            <p className="text-gray-600">Manage API integrations and supplier settings</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700">
                            <PlusIcon className="w-5 h-5" />
                            Add Supplier
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Category Tabs */}
                <div className="bg-white rounded-xl shadow-sm mb-6">
                    <div className="flex border-b overflow-x-auto">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                                    activeCategory === cat.id
                                        ? 'border-b-2 border-blue-600 text-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search suppliers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg"
                        />
                    </div>
                </div>

                {/* Suppliers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suppliers[activeCategory]?.map((supplier) => (
                        <div key={supplier.id} className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                                        {supplier.logo}
                                    </div>
                                    <div>
                                        <div className="font-semibold">{supplier.name}</div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            supplier.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {supplier.status === 'active' ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                    <CogIcon className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            {supplier.status === 'active' ? (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Uptime</span>
                                        <span className="font-medium text-green-600">{supplier.uptime}%</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Requests (Today)</span>
                                        <span className="font-medium">{supplier.requests}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Last Sync</span>
                                        <span className="text-gray-600">{supplier.lastSync}</span>
                                    </div>
                                    <div className="pt-3 border-t flex gap-2">
                                        <button className="flex-1 py-2 text-sm border rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1">
                                            <ArrowPathIcon className="w-4 h-4" />
                                            Sync
                                        </button>
                                        <button className="flex-1 py-2 text-sm border rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1">
                                            <ChartBarIcon className="w-4 h-4" />
                                            Stats
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-gray-500 text-sm mb-3">Supplier not configured</p>
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                                        Configure Now
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Add New Supplier Card */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-dashed flex items-center justify-center">
                        <button className="text-center">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <PlusIcon className="w-6 h-6 text-gray-400" />
                            </div>
                            <div className="text-gray-600 font-medium">Add New Supplier</div>
                            <div className="text-gray-400 text-sm">Configure API integration</div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSuppliers;
