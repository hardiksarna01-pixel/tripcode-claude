import React, { useState } from 'react';
import {
    FlagIcon,
    PlusIcon,
    PencilIcon
} from '@heroicons/react/24/outline';

const SuperAdminFeatureFlags = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const features = [
        { id: 1, name: 'new_booking_flow', description: 'Enable new booking flow UI', status: 'enabled', rollout: 100, companies: 'all' },
        { id: 2, name: 'ai_recommendations', description: 'AI-powered travel recommendations', status: 'partial', rollout: 30, companies: 'Enterprise' },
        { id: 3, name: 'multi_currency', description: 'Multi-currency support', status: 'enabled', rollout: 100, companies: 'all' },
        { id: 4, name: 'dark_mode', description: 'Dark mode theme', status: 'disabled', rollout: 0, companies: 'none' },
        { id: 5, name: 'visa_integration', description: 'Visa processing integration', status: 'partial', rollout: 50, companies: 'Enterprise, Professional' },
        { id: 6, name: 'whatsapp_notifications', description: 'WhatsApp booking notifications', status: 'enabled', rollout: 100, companies: 'all' }
    ];

    const getStatusBadge = (status) => {
        const styles = {
            enabled: 'bg-green-100 text-green-800',
            partial: 'bg-yellow-100 text-yellow-800',
            disabled: 'bg-gray-100 text-gray-800'
        };
        return `px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`;
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Feature Flags</h1>
                            <p className="text-indigo-200">Control feature rollouts across the platform</p>
                        </div>
                        <button className="px-4 py-2 bg-white text-indigo-900 rounded-lg flex items-center gap-2 hover:bg-indigo-50">
                            <PlusIcon className="w-5 h-5" />
                            Create Flag
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Total Flags</div>
                        <div className="text-2xl font-bold mt-1">{features.length}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Enabled</div>
                        <div className="text-2xl font-bold mt-1 text-green-600">
                            {features.filter(f => f.status === 'enabled').length}
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Partial Rollout</div>
                        <div className="text-2xl font-bold mt-1 text-yellow-600">
                            {features.filter(f => f.status === 'partial').length}
                        </div>
                    </div>
                </div>

                {/* Feature Flags Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Feature</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Description</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Rollout</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Companies</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {features.map((feature) => (
                                <tr key={feature.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <FlagIcon className="w-5 h-5 text-indigo-500" />
                                            <code className="font-mono text-sm">{feature.name}</code>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{feature.description}</td>
                                    <td className="px-4 py-3">
                                        <span className={getStatusBadge(feature.status)}>
                                            {feature.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="w-20">
                                            <div className="h-2 bg-gray-100 rounded-full">
                                                <div
                                                    className={`h-2 rounded-full ${
                                                        feature.rollout === 100 ? 'bg-green-500' :
                                                        feature.rollout > 0 ? 'bg-yellow-500' : 'bg-gray-300'
                                                    }`}
                                                    style={{ width: `${feature.rollout}%` }}
                                                />
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">{feature.rollout}%</div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{feature.companies}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button className="p-1 hover:bg-gray-100 rounded">
                                                <PencilIcon className="w-4 h-4 text-gray-500" />
                                            </button>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    defaultChecked={feature.status !== 'disabled'}
                                                />
                                                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </label>
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

export default SuperAdminFeatureFlags;
