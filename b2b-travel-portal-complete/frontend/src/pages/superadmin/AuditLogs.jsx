import React, { useState } from 'react';
import {
    ClipboardDocumentListIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const SuperAdminAuditLogs = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const logs = [
        { id: 1, user: 'superadmin@tripcode.com', action: 'company.create', target: 'Voyage Travels', ip: '192.168.1.100', timestamp: '2024-06-15 10:30:45' },
        { id: 2, user: 'admin@travelmax.in', action: 'user.update', target: 'agent@travelmax.in', ip: '192.168.1.101', timestamp: '2024-06-15 10:28:12' },
        { id: 3, user: 'superadmin@tripcode.com', action: 'plan.update', target: 'Enterprise Plan', ip: '192.168.1.100', timestamp: '2024-06-15 10:15:33' },
        { id: 4, user: 'superadmin@tripcode.com', action: 'supplier.config', target: 'Amadeus API', ip: '192.168.1.100', timestamp: '2024-06-15 10:10:20' },
        { id: 5, user: 'admin@globaltrips.com', action: 'login', target: '-', ip: '192.168.1.102', timestamp: '2024-06-15 09:55:00' }
    ];

    const getActionBadge = (action) => {
        const type = action.split('.')[0];
        const styles = {
            company: 'bg-purple-100 text-purple-800',
            user: 'bg-blue-100 text-blue-800',
            plan: 'bg-green-100 text-green-800',
            supplier: 'bg-orange-100 text-orange-800',
            login: 'bg-gray-100 text-gray-800'
        };
        return `px-2 py-1 rounded text-xs font-medium ${styles[type] || 'bg-gray-100 text-gray-800'}`;
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Audit Logs</h1>
                            <p className="text-indigo-200">Track all platform activities</p>
                        </div>
                        <button className="px-4 py-2 bg-white text-indigo-900 rounded-lg flex items-center gap-2 hover:bg-indigo-50">
                            <ArrowDownTrayIcon className="w-5 h-5" />
                            Export Logs
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search logs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                            />
                        </div>
                        <select className="border rounded-lg px-4 py-2">
                            <option>All Actions</option>
                            <option>Company</option>
                            <option>User</option>
                            <option>Plan</option>
                            <option>Supplier</option>
                        </select>
                        <select className="border rounded-lg px-4 py-2">
                            <option>Today</option>
                            <option>This Week</option>
                            <option>This Month</option>
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
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Target</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">IP Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-500">{log.timestamp}</td>
                                    <td className="px-4 py-3 text-sm">{log.user}</td>
                                    <td className="px-4 py-3">
                                        <span className={getActionBadge(log.action)}>{log.action}</span>
                                    </td>
                                    <td className="px-4 py-3 text-sm">{log.target}</td>
                                    <td className="px-4 py-3 text-sm font-mono text-gray-500">{log.ip}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminAuditLogs;
