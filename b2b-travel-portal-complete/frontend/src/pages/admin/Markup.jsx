import React, { useState } from 'react';
import {
    CurrencyRupeeIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    CheckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const AdminMarkup = () => {
    const [activeTab, setActiveTab] = useState('flights');
    const [editingId, setEditingId] = useState(null);

    const products = ['flights', 'hotels', 'buses', 'holidays', 'visa', 'insurance'];

    const markupRules = {
        flights: [
            { id: 1, name: 'Default Markup', type: 'percentage', value: 2.5, appliesTo: 'All', supplier: 'All', status: 'active' },
            { id: 2, name: 'Domestic Special', type: 'fixed', value: 150, appliesTo: 'Domestic', supplier: 'All', status: 'active' },
            { id: 3, name: 'International Premium', type: 'percentage', value: 3.5, appliesTo: 'International', supplier: 'All', status: 'active' },
            { id: 4, name: 'LCC Markup', type: 'fixed', value: 100, appliesTo: 'All', supplier: 'SpiceJet, IndiGo', status: 'active' }
        ],
        hotels: [
            { id: 1, name: 'Default Hotel Markup', type: 'percentage', value: 8, appliesTo: 'All', supplier: 'All', status: 'active' },
            { id: 2, name: 'Budget Hotels', type: 'percentage', value: 5, appliesTo: '1-2 Star', supplier: 'All', status: 'active' },
            { id: 3, name: 'Luxury Hotels', type: 'percentage', value: 12, appliesTo: '5 Star', supplier: 'All', status: 'active' }
        ],
        buses: [
            { id: 1, name: 'Default Bus Markup', type: 'fixed', value: 25, appliesTo: 'All', supplier: 'All', status: 'active' }
        ],
        holidays: [
            { id: 1, name: 'Package Markup', type: 'percentage', value: 15, appliesTo: 'All', supplier: 'All', status: 'active' }
        ],
        visa: [
            { id: 1, name: 'Visa Processing Fee', type: 'fixed', value: 500, appliesTo: 'All', supplier: 'All', status: 'active' }
        ],
        insurance: [
            { id: 1, name: 'Insurance Commission', type: 'percentage', value: 20, appliesTo: 'All', supplier: 'All', status: 'active' }
        ]
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Markup Management</h1>
                            <p className="text-gray-600">Configure pricing markups for all products</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700">
                            <PlusIcon className="w-5 h-5" />
                            Add Markup Rule
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Product Tabs */}
                <div className="bg-white rounded-xl shadow-sm mb-6">
                    <div className="flex border-b overflow-x-auto">
                        {products.map((product) => (
                            <button
                                key={product}
                                onClick={() => setActiveTab(product)}
                                className={`px-6 py-4 text-sm font-medium capitalize whitespace-nowrap ${
                                    activeTab === product
                                        ? 'border-b-2 border-blue-600 text-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {product}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Markup Rules Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Rule Name</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Type</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Value</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Applies To</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Supplier</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {markupRules[activeTab]?.map((rule) => (
                                <tr key={rule.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">{rule.name}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            rule.type === 'percentage' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {rule.type === 'percentage' ? 'Percentage' : 'Fixed'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {rule.type === 'percentage' ? `${rule.value}%` : `₹${rule.value}`}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{rule.appliesTo}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{rule.supplier}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            rule.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {rule.status === 'active' ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                                                <PencilIcon className="w-4 h-4 text-gray-500" />
                                            </button>
                                            <button className="p-1 hover:bg-gray-100 rounded" title="Delete">
                                                <TrashIcon className="w-4 h-4 text-red-500" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Agent-Specific Markup */}
                <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                    <h2 className="text-lg font-semibold mb-4">Agent-Specific Markup</h2>
                    <p className="text-gray-600 text-sm mb-4">Configure custom markup rates for specific agents</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">ABC Travels</span>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Gold</span>
                            </div>
                            <div className="text-sm text-gray-600">Flights: -0.5% | Hotels: -2%</div>
                        </div>
                        <div className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">XYZ Tours</span>
                                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Platinum</span>
                            </div>
                            <div className="text-sm text-gray-600">Flights: -1% | Hotels: -3%</div>
                        </div>
                        <div className="border rounded-lg p-4 border-dashed flex items-center justify-center">
                            <button className="text-blue-600 text-sm flex items-center gap-1">
                                <PlusIcon className="w-4 h-4" />
                                Add Agent Markup
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMarkup;
