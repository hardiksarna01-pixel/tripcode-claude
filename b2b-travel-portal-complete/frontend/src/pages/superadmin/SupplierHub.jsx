import React, { useState } from 'react';
import {
    BuildingOfficeIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    CogIcon,
    ChartBarIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

const SuperAdminSupplierHub = () => {
    const [activeCategory, setActiveCategory] = useState('flights');

    const categories = [
        { id: 'flights', name: 'Flight APIs' },
        { id: 'hotels', name: 'Hotel APIs' },
        { id: 'buses', name: 'Bus APIs' },
        { id: 'payments', name: 'Payment Gateways' },
        { id: 'sms', name: 'SMS Providers' },
        { id: 'email', name: 'Email Providers' }
    ];

    const suppliers = {
        flights: [
            { id: 1, name: 'Amadeus', status: 'active', companies: 85, requests: '45M', uptime: 99.8 },
            { id: 2, name: 'TBO', status: 'active', companies: 120, requests: '32M', uptime: 99.5 },
            { id: 3, name: 'Galileo', status: 'active', companies: 45, requests: '18M', uptime: 99.2 },
            { id: 4, name: 'Mystifly', status: 'active', companies: 38, requests: '12M', uptime: 98.9 }
        ],
        hotels: [
            { id: 1, name: 'TBO Hotels', status: 'active', companies: 95, requests: '28M', uptime: 99.6 },
            { id: 2, name: 'Hotelbeds', status: 'active', companies: 72, requests: '22M', uptime: 99.3 }
        ],
        buses: [
            { id: 1, name: 'RedBus API', status: 'active', companies: 65, requests: '8M', uptime: 99.4 }
        ],
        payments: [
            { id: 1, name: 'Razorpay', status: 'active', companies: 125, requests: '15M', uptime: 99.9 },
            { id: 2, name: 'PayU', status: 'active', companies: 45, requests: '4M', uptime: 99.7 }
        ],
        sms: [
            { id: 1, name: 'MSG91', status: 'active', companies: 125, requests: '2M', uptime: 99.5 }
        ],
        email: [
            { id: 1, name: 'SendGrid', status: 'active', companies: 125, requests: '5M', uptime: 99.8 }
        ]
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Supplier Hub</h1>
                            <p className="text-indigo-200">Manage global supplier integrations</p>
                        </div>
                        <button className="px-4 py-2 bg-white text-indigo-900 rounded-lg flex items-center gap-2 hover:bg-indigo-50">
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
                                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Suppliers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suppliers[activeCategory]?.map((supplier) => (
                        <div key={supplier.id} className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <BuildingOfficeIcon className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <div className="font-semibold">{supplier.name}</div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            supplier.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {supplier.status}
                                        </span>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                    <CogIcon className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Companies Using</span>
                                    <span className="font-medium">{supplier.companies}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Total Requests</span>
                                    <span className="font-medium">{supplier.requests}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Uptime</span>
                                    <span className="font-medium text-green-600">{supplier.uptime}%</span>
                                </div>
                            </div>
                            <div className="pt-4 mt-4 border-t flex gap-2">
                                <button className="flex-1 py-2 text-sm border rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1">
                                    <ChartBarIcon className="w-4 h-4" />
                                    Stats
                                </button>
                                <button className="flex-1 py-2 text-sm border rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1">
                                    <ArrowPathIcon className="w-4 h-4" />
                                    Sync
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Add New */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-dashed flex items-center justify-center min-h-[240px]">
                        <button className="text-center text-gray-500">
                            <PlusIcon className="w-12 h-12 mx-auto mb-2" />
                            <span className="font-medium">Add New Supplier</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminSupplierHub;
