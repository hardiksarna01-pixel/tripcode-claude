import React, { useState } from 'react';
import {
    UserGroupIcon,
    MagnifyingGlassIcon,
    EyeIcon,
    PencilIcon,
    EnvelopeIcon,
    PhoneIcon
} from '@heroicons/react/24/outline';

const AdminCustomers = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const stats = {
        total: 15680,
        active: 12450,
        inactive: 3230,
        newThisMonth: 856
    };

    const customers = [
        { id: 'CUS001', name: 'Rajesh Kumar', email: 'rajesh@gmail.com', phone: '9876543210', bookings: 12, totalSpent: 185000, status: 'active', joinDate: '2023-05-15' },
        { id: 'CUS002', name: 'Priya Sharma', email: 'priya.s@gmail.com', phone: '9876543211', bookings: 8, totalSpent: 125000, status: 'active', joinDate: '2023-08-22' },
        { id: 'CUS003', name: 'Amit Patel', email: 'amit.p@gmail.com', phone: '9876543212', bookings: 3, totalSpent: 45000, status: 'active', joinDate: '2024-01-10' },
        { id: 'CUS004', name: 'Sneha Gupta', email: 'sneha.g@gmail.com', phone: '9876543213', bookings: 15, totalSpent: 320000, status: 'active', joinDate: '2022-12-05' },
        { id: 'CUS005', name: 'Vikram Singh', email: 'vikram.s@gmail.com', phone: '9876543214', bookings: 0, totalSpent: 0, status: 'inactive', joinDate: '2024-02-18' }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
                    <p className="text-gray-600">View and manage customer accounts</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Total Customers</div>
                        <div className="text-2xl font-bold mt-1">{stats.total.toLocaleString()}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Active</div>
                        <div className="text-2xl font-bold mt-1 text-green-600">{stats.active.toLocaleString()}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Inactive</div>
                        <div className="text-2xl font-bold mt-1 text-gray-600">{stats.inactive.toLocaleString()}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">New This Month</div>
                        <div className="text-2xl font-bold mt-1 text-blue-600">{stats.newThisMonth}</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or phone..."
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
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Customers Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Customer</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Contact</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Bookings</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Total Spent</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Joined</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {customers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 font-medium">
                                                    {customer.name.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="font-medium">{customer.name}</div>
                                                <div className="text-sm text-gray-500">{customer.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1 text-sm">
                                            <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                                            {customer.email}
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <PhoneIcon className="w-4 h-4 text-gray-400" />
                                            {customer.phone}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 font-medium">{customer.bookings}</td>
                                    <td className="px-4 py-3 font-medium">₹{customer.totalSpent.toLocaleString()}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{customer.joinDate}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button className="p-1 hover:bg-gray-100 rounded" title="View">
                                                <EyeIcon className="w-5 h-5 text-gray-500" />
                                            </button>
                                            <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                                                <PencilIcon className="w-5 h-5 text-gray-500" />
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

export default AdminCustomers;
