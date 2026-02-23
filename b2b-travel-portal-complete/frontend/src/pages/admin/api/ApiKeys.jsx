/**
 * API Keys Management Page
 * Generate and manage API keys
 */

import React, { useState } from 'react';
import {
    KeyIcon,
    PlusIcon,
    TrashIcon,
    ClipboardDocumentIcon,
    EyeIcon,
    EyeSlashIcon,
    CheckCircleIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const apiKeys = [
    {
        id: 1,
        name: 'Production API Key',
        key: 'pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        created: '2024-01-15',
        lastUsed: '2024-02-28',
        status: 'active',
        permissions: ['read', 'write']
    },
    {
        id: 2,
        name: 'Development API Key',
        key: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        created: '2024-02-01',
        lastUsed: '2024-02-25',
        status: 'active',
        permissions: ['read']
    },
    {
        id: 3,
        name: 'Legacy Integration',
        key: 'pk_live_yyyyyyyyyyyyyyyyyyyyyyyyyyyyyy',
        created: '2023-06-10',
        lastUsed: '2024-01-05',
        status: 'revoked',
        permissions: ['read', 'write']
    }
];

const ApiKeys = () => {
    const [showKey, setShowKey] = useState({});
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');

    const toggleKeyVisibility = (id) => {
        setShowKey(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
                    <p className="text-gray-500 mt-1">Manage your API keys for integrations</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <PlusIcon className="w-5 h-5" />
                    Generate New Key
                </button>
            </div>

            {/* Warning Banner */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                <ExclamationCircleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-yellow-800 font-medium">Keep your API keys secure</p>
                    <p className="text-yellow-700 text-sm mt-1">
                        Never share your API keys in publicly accessible areas such as GitHub, client-side code, or public documentation.
                    </p>
                </div>
            </div>

            {/* Create Key Modal */}
            {showCreateModal && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate New API Key</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Key Name
                            </label>
                            <input
                                type="text"
                                value={newKeyName}
                                onChange={(e) => setNewKeyName(e.target.value)}
                                placeholder="e.g., Production API"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Permissions
                            </label>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                                    <span className="text-sm text-gray-700">Read - Access booking and flight data</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded text-blue-600" />
                                    <span className="text-sm text-gray-700">Write - Create bookings and modifications</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded text-blue-600" />
                                    <span className="text-sm text-gray-700">Delete - Cancel bookings</span>
                                </label>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Generate Key
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* API Keys List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <KeyIcon className="w-5 h-5 text-blue-600" />
                        Active API Keys
                    </h2>
                </div>
                <div className="divide-y divide-gray-200">
                    {apiKeys.map((apiKey) => (
                        <div key={apiKey.id} className="p-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                        apiKey.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                                    }`}>
                                        <KeyIcon className={`w-5 h-5 ${
                                            apiKey.status === 'active' ? 'text-green-600' : 'text-gray-400'
                                        }`} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{apiKey.name}</p>
                                        <p className="text-sm text-gray-500">
                                            Created {apiKey.created} • Last used {apiKey.lastUsed}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {apiKey.status === 'active' ? (
                                        <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-sm">
                                            <CheckCircleIcon className="w-4 h-4" />
                                            Active
                                        </span>
                                    ) : (
                                        <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded-full text-sm">
                                            Revoked
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-3 bg-gray-50 rounded-lg p-2">
                                <code className="flex-1 text-sm font-mono text-gray-700">
                                    {showKey[apiKey.id] ? apiKey.key : '•'.repeat(40)}
                                </code>
                                <button
                                    onClick={() => toggleKeyVisibility(apiKey.id)}
                                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded"
                                >
                                    {showKey[apiKey.id] ? (
                                        <EyeSlashIcon className="w-5 h-5" />
                                    ) : (
                                        <EyeIcon className="w-5 h-5" />
                                    )}
                                </button>
                                <button
                                    onClick={() => copyToClipboard(apiKey.key)}
                                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded"
                                >
                                    <ClipboardDocumentIcon className="w-5 h-5" />
                                </button>
                                {apiKey.status === 'active' && (
                                    <button className="p-1.5 text-gray-400 hover:text-red-600 rounded">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-2 mt-2">
                                {apiKey.permissions.map((perm) => (
                                    <span key={perm} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                        {perm}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ApiKeys;
