import React, { useState } from 'react';
import {
    TagIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

const AdminSchemes = () => {
    const [schemes, setSchemes] = useState([
        { id: 1, name: 'Premium Commission Scheme', type: 'commission', description: 'Higher commission rates for premium agents', baseRate: 5, bonusRate: 2, applicableGroups: ['Premium Agents', 'Corporate Partners'], status: 'active', validFrom: '2024-01-01', validTo: '2024-12-31' },
        { id: 2, name: 'Standard Airline Scheme', type: 'airline', description: 'Standard commission for domestic flights', baseRate: 3, bonusRate: 0.5, applicableGroups: ['Standard Agents', 'New Agents'], status: 'active', validFrom: '2024-01-01', validTo: '2024-12-31' },
        { id: 3, name: 'International Flight Bonus', type: 'airline', description: 'Extra commission on international bookings', baseRate: 4, bonusRate: 1.5, applicableGroups: ['Premium Agents'], status: 'active', validFrom: '2024-01-01', validTo: '2024-06-30' },
        { id: 4, name: 'Hotel Partner Scheme', type: 'hotel', description: 'Commission scheme for hotel bookings', baseRate: 8, bonusRate: 2, applicableGroups: ['All Groups'], status: 'active', validFrom: '2024-01-01', validTo: '2024-12-31' },
        { id: 5, name: 'Holiday Package Commission', type: 'holiday', description: 'Commission for holiday package sales', baseRate: 10, bonusRate: 3, applicableGroups: ['Premium Agents', 'Franchise Network'], status: 'active', validFrom: '2024-01-01', validTo: '2024-12-31' },
        { id: 6, name: 'Festive Season Bonus', type: 'commission', description: 'Extra bonus during festive season', baseRate: 2, bonusRate: 5, applicableGroups: ['All Groups'], status: 'inactive', validFrom: '2024-10-01', validTo: '2024-11-30' },
    ]);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);

    const filteredSchemes = schemes.filter(scheme => {
        const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            scheme.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'all' || scheme.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const getTypeBadge = (type) => {
        const styles = {
            commission: 'bg-blue-100 text-blue-700',
            airline: 'bg-purple-100 text-purple-700',
            hotel: 'bg-orange-100 text-orange-700',
            holiday: 'bg-green-100 text-green-700'
        };
        return styles[type] || 'bg-gray-100 text-gray-700';
    };

    const stats = {
        total: schemes.length,
        active: schemes.filter(s => s.status === 'active').length,
        inactive: schemes.filter(s => s.status === 'inactive').length,
        commission: schemes.filter(s => s.type === 'commission').length,
        airline: schemes.filter(s => s.type === 'airline').length
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Commission Schemes</h1>
                    <p className="text-gray-500 mt-1">Manage commission schemes and airline rates</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <PlusIcon className="w-5 h-5" />
                    Create Scheme
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <TagIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            <p className="text-sm text-gray-500">Total Schemes</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircleIcon className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                            <p className="text-sm text-gray-500">Active</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <XCircleIcon className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
                            <p className="text-sm text-gray-500">Inactive</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <TagIcon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.airline}</p>
                            <p className="text-sm text-gray-500">Airline Schemes</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <TagIcon className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.commission}</p>
                            <p className="text-sm text-gray-500">Commission Schemes</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search schemes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Types</option>
                        <option value="commission">Commission</option>
                        <option value="airline">Airline</option>
                        <option value="hotel">Hotel</option>
                        <option value="holiday">Holiday</option>
                    </select>
                </div>
            </div>

            {/* Schemes Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scheme Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Base Rate</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bonus Rate</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicable Groups</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Validity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredSchemes.map((scheme) => (
                            <tr key={scheme.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <TagIcon className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-900">{scheme.name}</span>
                                            <p className="text-sm text-gray-500 truncate max-w-xs">{scheme.description}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeBadge(scheme.type)}`}>
                                        {scheme.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-medium text-gray-900">{scheme.baseRate}%</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-green-600 font-medium">+{scheme.bonusRate}%</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {scheme.applicableGroups.slice(0, 2).map((group, idx) => (
                                            <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                                {group}
                                            </span>
                                        ))}
                                        {scheme.applicableGroups.length > 2 && (
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                                +{scheme.applicableGroups.length - 2} more
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {scheme.validFrom} to {scheme.validTo}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        scheme.status === 'active'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-700'
                                    }`}>
                                        {scheme.status.charAt(0).toUpperCase() + scheme.status.slice(1)}
                                    </span>
                                </td>
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

export default AdminSchemes;
