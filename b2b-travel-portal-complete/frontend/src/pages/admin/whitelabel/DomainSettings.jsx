/**
 * Domain Settings Page
 * Manage custom domains and DNS configuration
 */

import React, { useState } from 'react';
import {
    GlobeAltIcon,
    PlusIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    ClockIcon,
    TrashIcon
} from '@heroicons/react/24/outline';

const domains = [
    {
        id: 1,
        domain: 'travel.mycompany.com',
        type: 'Primary',
        status: 'verified',
        ssl: true,
        addedAt: '2024-01-15'
    },
    {
        id: 2,
        domain: 'booking.mycompany.com',
        type: 'Secondary',
        status: 'pending',
        ssl: false,
        addedAt: '2024-02-20'
    }
];

const DomainSettings = () => {
    const [showAddDomain, setShowAddDomain] = useState(false);
    const [newDomain, setNewDomain] = useState('');

    const getStatusBadge = (status) => {
        switch (status) {
            case 'verified':
                return (
                    <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-sm">
                        <CheckCircleIcon className="w-4 h-4" />
                        Verified
                    </span>
                );
            case 'pending':
                return (
                    <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-sm">
                        <ClockIcon className="w-4 h-4" />
                        Pending
                    </span>
                );
            case 'failed':
                return (
                    <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full text-sm">
                        <ExclamationCircleIcon className="w-4 h-4" />
                        Failed
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
                    <h1 className="text-2xl font-bold text-gray-900">Domain Settings</h1>
                    <p className="text-gray-500 mt-1">Configure custom domains for your portal</p>
                </div>
                <button
                    onClick={() => setShowAddDomain(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add Domain
                </button>
            </div>

            {/* Add Domain Modal */}
            {showAddDomain && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Domain</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Domain Name
                            </label>
                            <input
                                type="text"
                                value={newDomain}
                                onChange={(e) => setNewDomain(e.target.value)}
                                placeholder="travel.yourcompany.com"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowAddDomain(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Add Domain
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Domains List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <GlobeAltIcon className="w-5 h-5 text-blue-600" />
                        Connected Domains
                    </h2>
                </div>
                <div className="divide-y divide-gray-200">
                    {domains.map((domain) => (
                        <div key={domain.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <GlobeAltIcon className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{domain.domain}</p>
                                    <p className="text-sm text-gray-500">
                                        {domain.type} • Added {domain.addedAt}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {getStatusBadge(domain.status)}
                                {domain.ssl && (
                                    <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-sm">
                                        SSL
                                    </span>
                                )}
                                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* DNS Configuration */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">DNS Configuration</h2>
                <p className="text-gray-600 mb-4">
                    Add the following DNS records to your domain provider to connect your custom domain:
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="text-left px-4 py-2 font-medium text-gray-700">Type</th>
                                <th className="text-left px-4 py-2 font-medium text-gray-700">Name</th>
                                <th className="text-left px-4 py-2 font-medium text-gray-700">Value</th>
                                <th className="text-left px-4 py-2 font-medium text-gray-700">TTL</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr>
                                <td className="px-4 py-3">CNAME</td>
                                <td className="px-4 py-3 font-mono text-sm">travel</td>
                                <td className="px-4 py-3 font-mono text-sm">portal.travelportal.com</td>
                                <td className="px-4 py-3">3600</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3">TXT</td>
                                <td className="px-4 py-3 font-mono text-sm">_verify</td>
                                <td className="px-4 py-3 font-mono text-sm">tp-verify=abc123xyz</td>
                                <td className="px-4 py-3">3600</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DomainSettings;
