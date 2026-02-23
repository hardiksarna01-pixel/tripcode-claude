import React, { useState } from 'react';
import {
    UsersIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    ShieldCheckIcon,
    EyeIcon,
    PencilIcon
} from '@heroicons/react/24/outline';

const SuperAdminUsers = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const stats = {
        total: 45680,
        admins: 125,
        agents: 32450,
        customers: 13105
    };

    const users = [
        { id: 'USR001', name: 'Rahul Sharma', email: 'rahul@travelmax.in', company: 'TravelMax India', role: 'Company Admin', status: 'active', lastLogin: '2024-06-15 10:30 AM' },
        { id: 'USR002', name: 'Priya Patel', email: 'priya@globaltrips.com', company: 'Global Trips', role: 'Company Admin', status: 'active', lastLogin: '2024-06-15 09:45 AM' },
        { id: 'USR003', name: 'Amit Kumar', email: 'amit@jetsettours.in', company: 'JetSet Tours', role: 'Manager', status: 'active', lastLogin: '2024-06-14 06:00 PM' },
        { id: 'USR004', name: 'Sneha Gupta', email: 'sneha@voyagetravels.com', company: 'Voyage Travels', role: 'Agent', status: 'inactive', lastLogin: '2024-06-10 02:30 PM' },
        { id: 'USR005', name: 'Vikram Singh', email: 'vikram@tripmaster.in', company: 'TripMaster Pro', role: 'Company Admin', status: 'active', lastLogin: '2024-06-15 11:00 AM' }
    ];

    const getRoleBadge = (role) => {
        const styles = {
            'Company Admin': 'bg-purple-100 text-purple-800',
            'Manager': 'bg-blue-100 text-blue-800',
            'Agent': 'bg-green-100 text-green-800',
            'Support': 'bg-yellow-100 text-yellow-800'
        };
        return `px-2 py-1 rounded text-xs font-medium ${styles[role] || 'bg-gray-100 text-gray-800'}`;
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Platform Users</h1>
                            <p className="text-indigo-200">Manage all users across companies</p>
                        </div>
                        <button className="px-4 py-2 bg-white text-indigo-900 rounded-lg flex items-center gap-2 hover:bg-indigo-50">
                            <PlusIcon className="w-5 h-5" />
                            Add User
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Total Users</div>
                        <div className="text-2xl font-bold mt-1">{(stats.total / 1000).toFixed(1)}K</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Company Admins</div>
                        <div className="text-2xl font-bold mt-1">{stats.admins}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Agents</div>
                        <div className="text-2xl font-bold mt-1">{(stats.agents / 1000).toFixed(1)}K</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Customers</div>
                        <div className="text-2xl font-bold mt-1">{(stats.customers / 1000).toFixed(1)}K</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                            />
                        </div>
                        <select className="border rounded-lg px-4 py-2">
                            <option value="all">All Companies</option>
                            <option value="travelmax">TravelMax India</option>
                            <option value="globaltrips">Global Trips</option>
                        </select>
                        <select className="border rounded-lg px-4 py-2">
                            <option value="all">All Roles</option>
                            <option value="admin">Company Admin</option>
                            <option value="manager">Manager</option>
                            <option value="agent">Agent</option>
                        </select>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">User</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Company</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Role</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Last Login</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                <span className="text-indigo-600 font-medium">
                                                    {user.name.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="font-medium">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm">{user.company}</td>
                                    <td className="px-4 py-3">
                                        <span className={getRoleBadge(user.role)}>{user.role}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{user.lastLogin}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button className="p-1 hover:bg-gray-100 rounded" title="View">
                                                <EyeIcon className="w-5 h-5 text-gray-500" />
                                            </button>
                                            <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                                                <PencilIcon className="w-5 h-5 text-gray-500" />
                                            </button>
                                            <button className="p-1 hover:bg-gray-100 rounded" title="Permissions">
                                                <ShieldCheckIcon className="w-5 h-5 text-gray-500" />
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

export default SuperAdminUsers;
