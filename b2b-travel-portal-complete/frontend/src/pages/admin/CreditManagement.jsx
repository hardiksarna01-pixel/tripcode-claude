import React, { useState } from 'react';
import {
    CreditCardIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    PencilIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

const AdminCreditManagement = () => {
    const [activeTab, setActiveTab] = useState('limits');
    const [searchQuery, setSearchQuery] = useState('');

    const stats = {
        totalCreditIssued: 85000000,
        totalUtilized: 62000000,
        pendingRequests: 12,
        overdueCounts: 5
    };

    const creditLimits = [
        { agent: 'ABC Travels', limit: 500000, utilized: 325000, available: 175000, status: 'active', lastReview: '2024-05-15' },
        { agent: 'XYZ Tours', limit: 300000, utilized: 285000, available: 15000, status: 'near_limit', lastReview: '2024-04-20' },
        { agent: 'Travel World', limit: 400000, utilized: 180000, available: 220000, status: 'active', lastReview: '2024-06-01' },
        { agent: 'Fly High', limit: 250000, utilized: 250000, available: 0, status: 'blocked', lastReview: '2024-06-10' },
        { agent: 'Trip Masters', limit: 600000, utilized: 420000, available: 180000, status: 'active', lastReview: '2024-05-28' }
    ];

    const creditRequests = [
        { id: 'CR001', agent: 'ABC Travels', currentLimit: 500000, requestedLimit: 750000, reason: 'Business expansion', status: 'pending', date: '2024-06-14' },
        { id: 'CR002', agent: 'New Agent Corp', currentLimit: 0, requestedLimit: 200000, reason: 'New agent onboarding', status: 'pending', date: '2024-06-13' },
        { id: 'CR003', agent: 'XYZ Tours', currentLimit: 300000, requestedLimit: 500000, reason: 'Seasonal demand', status: 'under_review', date: '2024-06-12' }
    ];

    const getStatusBadge = (status) => {
        const styles = {
            active: 'bg-green-100 text-green-800',
            near_limit: 'bg-yellow-100 text-yellow-800',
            blocked: 'bg-red-100 text-red-800',
            pending: 'bg-blue-100 text-blue-800',
            under_review: 'bg-purple-100 text-purple-800'
        };
        return `px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`;
    };

    const getUtilizationColor = (utilized, limit) => {
        const percentage = (utilized / limit) * 100;
        if (percentage >= 95) return 'bg-red-500';
        if (percentage >= 80) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Credit Management</h1>
                            <p className="text-gray-600">Manage agent credit limits and requests</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700">
                            <PlusIcon className="w-5 h-5" />
                            Assign Credit
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Total Credit Issued</div>
                        <div className="text-2xl font-bold mt-1">₹{(stats.totalCreditIssued / 10000000).toFixed(1)}Cr</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Total Utilized</div>
                        <div className="text-2xl font-bold mt-1">₹{(stats.totalUtilized / 10000000).toFixed(1)}Cr</div>
                        <div className="text-xs text-gray-500 mt-1">{((stats.totalUtilized / stats.totalCreditIssued) * 100).toFixed(1)}% utilization</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Pending Requests</div>
                        <div className="text-2xl font-bold mt-1 text-orange-600">{stats.pendingRequests}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Overdue Accounts</div>
                        <div className="text-2xl font-bold mt-1 text-red-600">{stats.overdueCounts}</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm mb-6">
                    <div className="flex border-b">
                        {['limits', 'requests'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-4 text-sm font-medium capitalize ${
                                    activeTab === tab
                                        ? 'border-b-2 border-blue-600 text-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab === 'limits' ? 'Credit Limits' : 'Credit Requests'}
                                {tab === 'requests' && <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-800 rounded-full text-xs">{stats.pendingRequests}</span>}
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
                            placeholder="Search agents..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg"
                        />
                    </div>
                </div>

                {/* Content */}
                {activeTab === 'limits' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Agent</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Credit Limit</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Utilization</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Available</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Last Review</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {creditLimits.map((agent, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">{agent.agent}</td>
                                        <td className="px-4 py-3">₹{agent.limit.toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            <div className="w-32">
                                                <div className="flex items-center justify-between text-xs mb-1">
                                                    <span>₹{agent.utilized.toLocaleString()}</span>
                                                    <span>{((agent.utilized / agent.limit) * 100).toFixed(0)}%</span>
                                                </div>
                                                <div className="h-2 bg-gray-200 rounded-full">
                                                    <div
                                                        className={`h-2 rounded-full ${getUtilizationColor(agent.utilized, agent.limit)}`}
                                                        style={{ width: `${(agent.utilized / agent.limit) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-green-600">₹{agent.available.toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            <span className={getStatusBadge(agent.status)}>
                                                {agent.status.replace('_', ' ').charAt(0).toUpperCase() + agent.status.replace('_', ' ').slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{agent.lastReview}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                                                    <PencilIcon className="w-4 h-4 text-gray-500" />
                                                </button>
                                                <button className="p-1 hover:bg-gray-100 rounded" title="Review">
                                                    <ArrowPathIcon className="w-4 h-4 text-gray-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'requests' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Request ID</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Agent</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Current</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Requested</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Reason</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {creditRequests.map((request) => (
                                    <tr key={request.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-blue-600">{request.id}</td>
                                        <td className="px-4 py-3">{request.agent}</td>
                                        <td className="px-4 py-3">₹{request.currentLimit.toLocaleString()}</td>
                                        <td className="px-4 py-3 font-medium">₹{request.requestedLimit.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{request.reason}</td>
                                        <td className="px-4 py-3">
                                            <span className={getStatusBadge(request.status)}>
                                                {request.status.replace('_', ' ').charAt(0).toUpperCase() + request.status.replace('_', ' ').slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button className="p-1 hover:bg-green-100 rounded" title="Approve">
                                                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                                                </button>
                                                <button className="p-1 hover:bg-red-100 rounded" title="Reject">
                                                    <XCircleIcon className="w-5 h-5 text-red-600" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCreditManagement;
