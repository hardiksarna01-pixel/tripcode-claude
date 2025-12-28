import React, { useState } from 'react';
import {
    UsersIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    TrashIcon,
    ShieldCheckIcon,
    KeyIcon
} from '@heroicons/react/24/outline';

const AdminUsers = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const users = [
        { id: 1, name: 'Rahul Sharma', email: 'rahul@company.com', role: 'admin', department: 'Operations', status: 'active', lastLogin: '2024-06-15 10:30 AM' },
        { id: 2, name: 'Priya Patel', email: 'priya@company.com', role: 'manager', department: 'Finance', status: 'active', lastLogin: '2024-06-15 09:45 AM' },
        { id: 3, name: 'Amit Kumar', email: 'amit@company.com', role: 'support', department: 'Customer Support', status: 'active', lastLogin: '2024-06-14 06:00 PM' },
        { id: 4, name: 'Sneha Gupta', email: 'sneha@company.com', role: 'operator', department: 'Booking', status: 'inactive', lastLogin: '2024-06-10 02:30 PM' },
        { id: 5, name: 'Vikram Singh', email: 'vikram@company.com', role: 'admin', department: 'IT', status: 'active', lastLogin: '2024-06-15 11:00 AM' }
    ];

    const roles = [
        { id: 'admin', name: 'Admin', permissions: 'Full access', color: 'bg-red-100 text-red-800' },
        { id: 'manager', name: 'Manager', permissions: 'Manage agents, bookings, reports', color: 'bg-purple-100 text-purple-800' },
        { id: 'operator', name: 'Operator', permissions: 'Manage bookings only', color: 'bg-blue-100 text-blue-800' },
        { id: 'support', name: 'Support', permissions: 'View & respond to tickets', color: 'bg-green-100 text-green-800' }
    ];

    const getRoleBadge = (role) => {
        const roleConfig = roles.find(r => r.id === role);
        return roleConfig ? roleConfig.color : 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                            <p className="text-gray-600">Manage admin users and their permissions</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700">
                            <PlusIcon className="w-5 h-5" />
                            Add User
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Roles Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-4">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <ShieldCheckIcon className="w-5 h-5" />
                                Roles
                            </h3>
                            <div className="space-y-3">
                                {roles.map((role) => (
                                    <div key={role.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${role.color}`}>
                                                {role.name}
                                            </span>
                                            <button className="p-1 hover:bg-gray-100 rounded">
                                                <PencilIcon className="w-4 h-4 text-gray-400" />
                                            </button>
                                        </div>
                                        <div className="text-xs text-gray-500">{role.permissions}</div>
                                    </div>
                                ))}
                                <button className="w-full py-2 border border-dashed rounded-lg text-sm text-gray-500 hover:bg-gray-50">
                                    + Create Role
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Users List */}
                    <div className="lg:col-span-3">
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
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="border rounded-lg px-4 py-2"
                                >
                                    <option value="all">All Roles</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Users Table */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">User</th>
                                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Role</th>
                                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Department</th>
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
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <span className="text-blue-600 font-medium">
                                                            {user.name.split(' ').map(n => n[0]).join('')}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{user.name}</div>
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadge(user.role)}`}>
                                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{user.department}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {user.status === 'active' ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{user.lastLogin}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                                                        <PencilIcon className="w-4 h-4 text-gray-500" />
                                                    </button>
                                                    <button className="p-1 hover:bg-gray-100 rounded" title="Reset Password">
                                                        <KeyIcon className="w-4 h-4 text-gray-500" />
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
            </div>
        </div>
    );
};

export default AdminUsers;
