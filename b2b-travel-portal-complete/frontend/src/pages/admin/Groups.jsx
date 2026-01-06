import React, { useState } from 'react';
import {
    UserGroupIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const AdminGroups = () => {
    const [groups, setGroups] = useState([
        { id: 1, name: 'Premium Agents', description: 'High-volume agents with premium benefits', agentCount: 45, commissionBonus: 2, createdAt: '2024-01-15' },
        { id: 2, name: 'Standard Agents', description: 'Regular agents with standard commission rates', agentCount: 180, commissionBonus: 0, createdAt: '2024-01-10' },
        { id: 3, name: 'New Agents', description: 'Newly onboarded agents in probation period', agentCount: 32, commissionBonus: -1, createdAt: '2024-02-01' },
        { id: 4, name: 'Corporate Partners', description: 'B2B corporate travel partners', agentCount: 15, commissionBonus: 3, createdAt: '2024-01-20' },
        { id: 5, name: 'Franchise Network', description: 'Franchise partners across India', agentCount: 78, commissionBonus: 1.5, createdAt: '2024-01-25' },
    ]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);

    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Agent Groups</h1>
                    <p className="text-gray-500 mt-1">Manage agent groups and their commission structures</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <PlusIcon className="w-5 h-5" />
                    Create Group
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <UserGroupIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{groups.length}</p>
                            <p className="text-sm text-gray-500">Total Groups</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <UserGroupIcon className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{groups.reduce((a, b) => a + b.agentCount, 0)}</p>
                            <p className="text-sm text-gray-500">Total Agents</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search groups..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Groups Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Group Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agents</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission Bonus</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredGroups.map((group) => (
                            <tr key={group.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <UserGroupIcon className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <span className="font-medium text-gray-900">{group.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 text-sm max-w-xs truncate">{group.description}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-gray-100 rounded-full text-sm font-medium">
                                        {group.agentCount} agents
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                                        group.commissionBonus > 0 ? 'bg-green-100 text-green-700' :
                                        group.commissionBonus < 0 ? 'bg-red-100 text-red-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                        {group.commissionBonus > 0 ? '+' : ''}{group.commissionBonus}%
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-sm">{group.createdAt}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                                        <PencilIcon className="w-4 h-4 text-gray-500" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-100 rounded-lg ml-1">
                                        <TrashIcon className="w-4 h-4 text-red-500" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminGroups;
