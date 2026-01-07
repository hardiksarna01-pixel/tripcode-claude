/**
 * Agent PNR Dashboard
 * Overview of all PNR operations for agents
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    TicketIcon,
    ArrowPathIcon,
    CalendarDaysIcon,
    XCircleIcon,
    NoSymbolIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    PlusIcon,
    FunnelIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const stats = [
    { name: 'Pending Requests', value: '12', icon: ClockIcon, color: 'yellow', change: '+3 today' },
    { name: 'Approved', value: '45', icon: CheckCircleIcon, color: 'green', change: '+8 this week' },
    { name: 'Rejected', value: '3', icon: XCircleIcon, color: 'red', change: '0 today' },
    { name: 'Total Operations', value: '156', icon: TicketIcon, color: 'blue', change: 'This month' }
];

const recentRequests = [
    {
        id: 'REQ001',
        pnr: 'ABC123',
        type: 'Date Change',
        passenger: 'John Smith',
        flight: 'AI-101 DEL-BOM',
        status: 'pending',
        submittedAt: '2024-02-28 10:30',
        priority: 'high'
    },
    {
        id: 'REQ002',
        pnr: 'XYZ789',
        type: 'Cancellation',
        passenger: 'Jane Doe',
        flight: '6E-205 BLR-DEL',
        status: 'approved',
        submittedAt: '2024-02-28 09:15',
        priority: 'medium'
    },
    {
        id: 'REQ003',
        pnr: 'PQR456',
        type: 'Reissue',
        passenger: 'Mike Johnson',
        flight: 'SG-301 MUM-CCU',
        status: 'processing',
        submittedAt: '2024-02-27 16:45',
        priority: 'low'
    },
    {
        id: 'REQ004',
        pnr: 'LMN321',
        type: 'VOID',
        passenger: 'Sarah Wilson',
        flight: 'AI-505 DEL-GOI',
        status: 'rejected',
        submittedAt: '2024-02-27 14:20',
        priority: 'high'
    },
    {
        id: 'REQ005',
        pnr: 'DEF654',
        type: 'Issue',
        passenger: 'Robert Brown',
        flight: 'UK-833 BOM-HYD',
        status: 'approved',
        submittedAt: '2024-02-27 11:00',
        priority: 'medium'
    }
];

const quickActions = [
    { name: 'Issue Ticket', path: '/agent/pnr/issue', icon: TicketIcon, color: 'bg-blue-600' },
    { name: 'Reissue Ticket', path: '/agent/pnr/reissue', icon: ArrowPathIcon, color: 'bg-purple-600' },
    { name: 'Date Change', path: '/agent/pnr/date-change', icon: CalendarDaysIcon, color: 'bg-orange-600' },
    { name: 'Cancellation', path: '/agent/pnr/cancellation', icon: XCircleIcon, color: 'bg-red-600' },
    { name: 'VOID PNR', path: '/agent/pnr/void', icon: NoSymbolIcon, color: 'bg-gray-600' }
];

const PNRDashboard = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-700',
            approved: 'bg-green-100 text-green-700',
            rejected: 'bg-red-100 text-red-700',
            processing: 'bg-blue-100 text-blue-700'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const getPriorityBadge = (priority) => {
        const styles = {
            high: 'text-red-600',
            medium: 'text-yellow-600',
            low: 'text-green-600'
        };
        return <span className={`text-xs font-medium ${styles[priority]}`}>{priority.toUpperCase()}</span>;
    };

    const getTypeIcon = (type) => {
        const icons = {
            'Issue': TicketIcon,
            'Reissue': ArrowPathIcon,
            'Date Change': CalendarDaysIcon,
            'Cancellation': XCircleIcon,
            'VOID': NoSymbolIcon
        };
        const Icon = icons[type] || TicketIcon;
        return <Icon className="w-5 h-5" />;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">PNR Management</h1>
                    <p className="text-gray-500 mt-1">Issue, reissue, modify and manage your PNR operations</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {quickActions.map((action) => (
                    <Link
                        key={action.name}
                        to={action.path}
                        className={`${action.color} text-white p-4 rounded-xl hover:opacity-90 transition-opacity flex flex-col items-center justify-center gap-2`}
                    >
                        <action.icon className="w-8 h-8" />
                        <span className="text-sm font-medium text-center">{action.name}</span>
                    </Link>
                ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">{stat.name}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
                            </div>
                            <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Requests */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Requests</h2>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search PNR..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="processing">Processing</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Request ID</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">PNR</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Passenger</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Flight</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Priority</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Submitted</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {recentRequests.map((request) => (
                                <tr key={request.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{request.id}</td>
                                    <td className="px-4 py-3 text-sm font-mono text-gray-900">{request.pnr}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            {getTypeIcon(request.type)}
                                            {request.type}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{request.passenger}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{request.flight}</td>
                                    <td className="px-4 py-3">{getPriorityBadge(request.priority)}</td>
                                    <td className="px-4 py-3">{getStatusBadge(request.status)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{request.submittedAt}</td>
                                    <td className="px-4 py-3">
                                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Notifications Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ExclamationCircleIcon className="w-5 h-5 text-yellow-500" />
                    Recent Notifications
                </h2>
                <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-gray-900">Your date change request for PNR XYZ789 has been approved</p>
                            <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                        <XCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-gray-900">VOID request for PNR LMN321 was rejected - Exceeded time limit</p>
                            <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <ClockIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-gray-900">Cancellation request for PNR PQR456 is being processed</p>
                            <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PNRDashboard;
