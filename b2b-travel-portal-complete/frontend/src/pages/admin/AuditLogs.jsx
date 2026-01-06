import React, { useState } from 'react';
import {
    ClipboardDocumentListIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowDownTrayIcon,
    UserCircleIcon,
    ComputerDesktopIcon
} from '@heroicons/react/24/outline';

const AdminAuditLogs = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [actionFilter, setActionFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('today');

    const logs = [
        { id: 1, user: 'admin@company.com', action: 'login', description: 'Admin logged in', ip: '192.168.1.100', device: 'Chrome/Windows', timestamp: '2024-06-15 10:30:45' },
        { id: 2, user: 'rahul@company.com', action: 'update', description: 'Updated agent ABC Travels credit limit', ip: '192.168.1.101', device: 'Firefox/Mac', timestamp: '2024-06-15 10:28:12' },
        { id: 3, user: 'admin@company.com', action: 'create', description: 'Created new user priya@company.com', ip: '192.168.1.100', device: 'Chrome/Windows', timestamp: '2024-06-15 10:15:33' },
        { id: 4, user: 'support@company.com', action: 'view', description: 'Viewed booking BK001234', ip: '192.168.1.102', device: 'Safari/iOS', timestamp: '2024-06-15 10:10:20' },
        { id: 5, user: 'admin@company.com', action: 'delete', description: 'Deleted expired promo code SUMMER2024', ip: '192.168.1.100', device: 'Chrome/Windows', timestamp: '2024-06-15 09:55:00' },
        { id: 6, user: 'rahul@company.com', action: 'approve', description: 'Approved agent registration for New Agent Corp', ip: '192.168.1.101', device: 'Firefox/Mac', timestamp: '2024-06-15 09:45:18' }
    ];

    const getActionBadge = (action) => {
        const styles = {
            login: 'bg-blue-100 text-blue-800',
            logout: 'bg-gray-100 text-gray-800',
            create: 'bg-green-100 text-green-800',
            update: 'bg-yellow-100 text-yellow-800',
            delete: 'bg-red-100 text-red-800',
            view: 'bg-purple-100 text-purple-800',
            approve: 'bg-emerald-100 text-emerald-800',
            reject: 'bg-orange-100 text-orange-800'
        };
        return `px-2 py-1 rounded text-xs font-medium ${styles[action] || 'bg-gray-100 text-gray-800'}`;
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
                            <p className="text-gray-600">Track all system activities and user actions</p>
                        </div>
                        <button className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50">
                            <ArrowDownTrayIcon className="w-5 h-5" />
                            Export Logs
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex-1 min-w-[200px] relative">
                            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by user or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                            />
                        </div>
                        <select
                            value={actionFilter}
                            onChange={(e) => setActionFilter(e.target.value)}
                            className="border rounded-lg px-4 py-2"
                        >
                            <option value="all">All Actions</option>
                            <option value="login">Login</option>
                            <option value="create">Create</option>
                            <option value="update">Update</option>
                            <option value="delete">Delete</option>
                            <option value="approve">Approve</option>
                        </select>
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="border rounded-lg px-4 py-2"
                        >
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="custom">Custom Range</option>
                        </select>
                        <button className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50">
                            <FunnelIcon className="w-5 h-5" />
                            More Filters
                        </button>
                    </div>
                </div>

                {/* Logs Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Timestamp</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">User</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Action</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Description</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">IP Address</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Device</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{log.timestamp}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <UserCircleIcon className="w-5 h-5 text-gray-400" />
                                            <span className="text-sm">{log.user}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={getActionBadge(log.action)}>
                                            {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm">{log.description}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500 font-mono">{log.ip}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <ComputerDesktopIcon className="w-4 h-4" />
                                            {log.device}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="px-4 py-3 border-t flex items-center justify-between">
                        <div className="text-sm text-gray-500">Showing 1-6 of 1,234 logs</div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 border rounded hover:bg-gray-50">Previous</button>
                            <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
                            <button className="px-3 py-1 border rounded hover:bg-gray-50">2</button>
                            <button className="px-3 py-1 border rounded hover:bg-gray-50">3</button>
                            <button className="px-3 py-1 border rounded hover:bg-gray-50">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAuditLogs;
