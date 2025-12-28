import React, { useState } from 'react';
import {
    TicketIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ChatBubbleLeftRightIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    UserCircleIcon
} from '@heroicons/react/24/outline';

const AdminSupport = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [selectedTicket, setSelectedTicket] = useState(null);

    const stats = {
        open: 45,
        pending: 23,
        resolved: 156,
        avgResponse: '2.5 hrs'
    };

    const tickets = [
        { id: 'TKT001', subject: 'Booking cancellation issue', agent: 'ABC Travels', priority: 'high', status: 'open', created: '2024-06-15 10:30 AM', lastUpdate: '5 mins ago', category: 'Booking' },
        { id: 'TKT002', subject: 'Wallet recharge failed', agent: 'XYZ Tours', priority: 'medium', status: 'pending', created: '2024-06-15 09:15 AM', lastUpdate: '1 hour ago', category: 'Payment' },
        { id: 'TKT003', subject: 'Unable to generate invoice', agent: 'Travel World', priority: 'low', status: 'open', created: '2024-06-14 06:00 PM', lastUpdate: '3 hours ago', category: 'Invoice' },
        { id: 'TKT004', subject: 'Flight search not working', agent: 'Fly High', priority: 'high', status: 'resolved', created: '2024-06-14 02:30 PM', lastUpdate: 'Yesterday', category: 'Technical' },
        { id: 'TKT005', subject: 'Commission discrepancy', agent: 'Trip Masters', priority: 'medium', status: 'pending', created: '2024-06-13 11:00 AM', lastUpdate: '2 days ago', category: 'Finance' }
    ];

    const getPriorityColor = (priority) => {
        const colors = {
            high: 'bg-red-100 text-red-800',
            medium: 'bg-yellow-100 text-yellow-800',
            low: 'bg-green-100 text-green-800'
        };
        return colors[priority] || 'bg-gray-100 text-gray-800';
    };

    const getStatusColor = (status) => {
        const colors = {
            open: 'bg-blue-100 text-blue-800',
            pending: 'bg-yellow-100 text-yellow-800',
            resolved: 'bg-green-100 text-green-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
                    <p className="text-gray-600">Manage agent support requests</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <ExclamationCircleIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.open}</div>
                                <div className="text-gray-500 text-sm">Open</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <ClockIcon className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.pending}</div>
                                <div className="text-gray-500 text-sm">Pending</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircleIcon className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.resolved}</div>
                                <div className="text-gray-500 text-sm">Resolved</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <ChatBubbleLeftRightIcon className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.avgResponse}</div>
                                <div className="text-gray-500 text-sm">Avg Response</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            {['all', 'open', 'pending', 'resolved'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 rounded-lg text-sm ${
                                        activeTab === tab
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search tickets..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                            />
                        </div>
                        <button className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50">
                            <FunnelIcon className="w-5 h-5" />
                            Filter
                        </button>
                    </div>
                </div>

                {/* Tickets Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Ticket</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Agent</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Category</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Priority</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Last Update</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {tickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedTicket(ticket)}>
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-blue-600">{ticket.id}</div>
                                        <div className="text-sm text-gray-900">{ticket.subject}</div>
                                    </td>
                                    <td className="px-4 py-3 text-sm">{ticket.agent}</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">{ticket.category}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{ticket.lastUpdate}</td>
                                    <td className="px-4 py-3">
                                        <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded">
                                            View
                                        </button>
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

export default AdminSupport;
