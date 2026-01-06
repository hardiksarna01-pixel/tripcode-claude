import React, { useState } from 'react';
import {
    BuildingOffice2Icon,
    MagnifyingGlassIcon,
    PlusIcon,
    EyeIcon,
    PencilIcon,
    CogIcon,
    UsersIcon,
    CurrencyRupeeIcon
} from '@heroicons/react/24/outline';

const SuperAdminCompanies = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const stats = {
        total: 125,
        active: 118,
        trial: 5,
        suspended: 2
    };

    const companies = [
        { id: 'COM001', name: 'TravelMax India', domain: 'travelmax.in', plan: 'Enterprise', users: 450, agents: 320, revenue: 125000000, status: 'active', createdAt: '2023-01-15' },
        { id: 'COM002', name: 'Global Trips', domain: 'globaltrips.com', plan: 'Professional', users: 180, agents: 145, revenue: 98000000, status: 'active', createdAt: '2023-03-22' },
        { id: 'COM003', name: 'JetSet Tours', domain: 'jetsettours.in', plan: 'Professional', users: 156, agents: 120, revenue: 78000000, status: 'active', createdAt: '2023-05-10' },
        { id: 'COM004', name: 'Voyage Travels', domain: 'voyagetravels.com', plan: 'Starter', users: 12, agents: 8, revenue: 0, status: 'trial', createdAt: '2024-06-13' },
        { id: 'COM005', name: 'TripMaster Pro', domain: 'tripmaster.in', plan: 'Enterprise', users: 380, agents: 290, revenue: 52000000, status: 'active', createdAt: '2022-11-05' }
    ];

    const getStatusBadge = (status) => {
        const styles = {
            active: 'bg-green-100 text-green-800',
            trial: 'bg-yellow-100 text-yellow-800',
            suspended: 'bg-red-100 text-red-800'
        };
        return `px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`;
    };

    const getPlanBadge = (plan) => {
        const styles = {
            Enterprise: 'bg-purple-100 text-purple-800',
            Professional: 'bg-blue-100 text-blue-800',
            Starter: 'bg-gray-100 text-gray-800'
        };
        return `px-2 py-1 rounded text-xs font-medium ${styles[plan]}`;
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Company Management</h1>
                            <p className="text-indigo-200">Manage all platform companies</p>
                        </div>
                        <button className="px-4 py-2 bg-white text-indigo-900 rounded-lg flex items-center gap-2 hover:bg-indigo-50">
                            <PlusIcon className="w-5 h-5" />
                            Add Company
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Total Companies</div>
                        <div className="text-2xl font-bold mt-1">{stats.total}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Active</div>
                        <div className="text-2xl font-bold mt-1 text-green-600">{stats.active}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">On Trial</div>
                        <div className="text-2xl font-bold mt-1 text-yellow-600">{stats.trial}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Suspended</div>
                        <div className="text-2xl font-bold mt-1 text-red-600">{stats.suspended}</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search companies..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border rounded-lg px-4 py-2"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="trial">Trial</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>
                </div>

                {/* Companies Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Company</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Plan</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Users</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Agents</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Revenue</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {companies.map((company) => (
                                <tr key={company.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                <BuildingOffice2Icon className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium">{company.name}</div>
                                                <div className="text-sm text-gray-500">{company.domain}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={getPlanBadge(company.plan)}>{company.plan}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <UsersIcon className="w-4 h-4 text-gray-400" />
                                            {company.users}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">{company.agents}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1 font-medium">
                                            <CurrencyRupeeIcon className="w-4 h-4 text-gray-400" />
                                            {company.revenue > 0 ? `${(company.revenue / 10000000).toFixed(1)}Cr` : '-'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={getStatusBadge(company.status)}>
                                            {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button className="p-1 hover:bg-gray-100 rounded" title="View">
                                                <EyeIcon className="w-5 h-5 text-gray-500" />
                                            </button>
                                            <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                                                <PencilIcon className="w-5 h-5 text-gray-500" />
                                            </button>
                                            <button className="p-1 hover:bg-gray-100 rounded" title="Settings">
                                                <CogIcon className="w-5 h-5 text-gray-500" />
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

export default SuperAdminCompanies;
