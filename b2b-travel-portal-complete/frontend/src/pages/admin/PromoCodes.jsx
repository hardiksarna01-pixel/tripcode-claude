import React, { useState } from 'react';
import {
    TicketIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    ClipboardDocumentIcon
} from '@heroicons/react/24/outline';

const AdminPromoCodes = () => {
    const [showAddModal, setShowAddModal] = useState(false);

    const promoCodes = [
        { id: 1, code: 'SUMMER2024', type: 'percentage', value: 10, minOrder: 5000, maxDiscount: 2000, usageLimit: 1000, used: 456, validFrom: '2024-06-01', validTo: '2024-08-31', status: 'active' },
        { id: 2, code: 'FLAT500', type: 'fixed', value: 500, minOrder: 3000, maxDiscount: 500, usageLimit: 500, used: 289, validFrom: '2024-06-15', validTo: '2024-07-15', status: 'active' },
        { id: 3, code: 'NEWUSER', type: 'percentage', value: 15, minOrder: 2000, maxDiscount: 1500, usageLimit: null, used: 1250, validFrom: '2024-01-01', validTo: '2024-12-31', status: 'active' },
        { id: 4, code: 'DIWALI2023', type: 'percentage', value: 20, minOrder: 10000, maxDiscount: 5000, usageLimit: 2000, used: 2000, validFrom: '2023-10-01', validTo: '2023-11-30', status: 'expired' }
    ];

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Promo Codes</h1>
                            <p className="text-gray-600">Manage discount codes and offers</p>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Create Promo Code
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Active Codes</div>
                        <div className="text-2xl font-bold mt-1">12</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Total Redemptions</div>
                        <div className="text-2xl font-bold mt-1">3,995</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Total Discount Given</div>
                        <div className="text-2xl font-bold mt-1">₹8.5L</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Revenue Generated</div>
                        <div className="text-2xl font-bold mt-1">₹45L</div>
                    </div>
                </div>

                {/* Promo Codes Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Code</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Discount</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Conditions</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Usage</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Validity</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {promoCodes.map((promo) => (
                                <tr key={promo.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <code className="px-2 py-1 bg-gray-100 rounded font-mono text-sm">{promo.code}</code>
                                            <button
                                                onClick={() => copyToClipboard(promo.code)}
                                                className="p-1 hover:bg-gray-100 rounded"
                                                title="Copy"
                                            >
                                                <ClipboardDocumentIcon className="w-4 h-4 text-gray-400" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium">
                                            {promo.type === 'percentage' ? `${promo.value}%` : `₹${promo.value}`}
                                        </div>
                                        {promo.type === 'percentage' && (
                                            <div className="text-xs text-gray-500">Max: ₹{promo.maxDiscount}</div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        Min order: ₹{promo.minOrder}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm">{promo.used} used</div>
                                        {promo.usageLimit && (
                                            <div className="text-xs text-gray-500">of {promo.usageLimit}</div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <div>{promo.validFrom}</div>
                                        <div className="text-gray-500">to {promo.validTo}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            promo.status === 'active' ? 'bg-green-100 text-green-800' :
                                            promo.status === 'expired' ? 'bg-gray-100 text-gray-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {promo.status.charAt(0).toUpperCase() + promo.status.slice(1)}
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
            </div>
        </div>
    );
};

export default AdminPromoCodes;
