/**
 * Admin PNR History
 * View all processed PNR requests
 */

import React, { useState } from 'react';
import {
    TicketIcon,
    ArrowPathIcon,
    CalendarDaysIcon,
    XCircleIcon,
    NoSymbolIcon,
    CheckCircleIcon,
    XMarkIcon,
    MagnifyingGlassIcon,
    ArrowDownTrayIcon,
    FunnelIcon
} from '@heroicons/react/24/outline';

const historyData = [
    {
        id: 'REQ001',
        type: 'Date Change',
        agent: 'John Agency',
        agentCode: 'AGT001',
        pnr: 'ABC123',
        passenger: 'Michael Johnson',
        flight: 'AI-101 DEL-BOM',
        status: 'approved',
        processedBy: 'Admin User',
        processedAt: '2024-02-28 11:30',
        charges: 2500,
        notes: 'Date changed to 20th March as requested'
    },
    {
        id: 'REQ002',
        type: 'Cancellation',
        agent: 'Travel Masters',
        agentCode: 'AGT002',
        pnr: 'XYZ789',
        passenger: 'Sarah Wilson',
        flight: '6E-205 BLR-DEL',
        status: 'approved',
        processedBy: 'Admin User',
        processedAt: '2024-02-28 10:15',
        refund: 8500,
        notes: 'Full cancellation processed'
    },
    {
        id: 'REQ003',
        type: 'VOID',
        agent: 'Sky Tours',
        agentCode: 'AGT004',
        pnr: 'LMN321',
        passenger: 'Emily Davis',
        flight: 'AI-505 DEL-GOI',
        status: 'rejected',
        processedBy: 'Admin User',
        processedAt: '2024-02-28 09:00',
        notes: 'VOID window expired - advised to use cancellation'
    },
    {
        id: 'REQ004',
        type: 'Reissue',
        agent: 'Quick Travels',
        agentCode: 'AGT003',
        pnr: 'PQR456',
        passenger: 'David Brown',
        flight: 'SG-301 MUM-CCU',
        status: 'approved',
        processedBy: 'Super Admin',
        processedAt: '2024-02-27 16:45',
        charges: 3500,
        notes: 'Name corrected and ticket reissued'
    },
    {
        id: 'REQ005',
        type: 'Issue',
        agent: 'Global Flights',
        agentCode: 'AGT005',
        pnr: 'DEF654',
        passenger: 'Robert Miller',
        flight: 'UK-833 BOM-HYD',
        status: 'approved',
        processedBy: 'Admin User',
        processedAt: '2024-02-27 14:00',
        amount: 8900,
        notes: 'Ticket issued successfully'
    }
];

const PNRHistory = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [dateRange, setDateRange] = useState({ from: '', to: '' });

    const getTypeIcon = (type) => {
        const icons = {
            'Issue': TicketIcon,
            'Reissue': ArrowPathIcon,
            'Date Change': CalendarDaysIcon,
            'Cancellation': XCircleIcon,
            'VOID': NoSymbolIcon
        };
        return icons[type] || TicketIcon;
    };

    const getTypeColor = (type) => {
        const colors = {
            'Issue': 'bg-blue-100 text-blue-700',
            'Reissue': 'bg-purple-100 text-purple-700',
            'Date Change': 'bg-orange-100 text-orange-700',
            'Cancellation': 'bg-red-100 text-red-700',
            'VOID': 'bg-gray-100 text-gray-700'
        };
        return colors[type] || 'bg-gray-100 text-gray-700';
    };

    const getStatusBadge = (status) => {
        if (status === 'approved') {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <CheckCircleIcon className="w-3 h-3" />
                    Approved
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                <XMarkIcon className="w-3 h-3" />
                Rejected
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">PNR History</h1>
                    <p className="text-gray-500 mt-1">View all processed PNR requests</p>
                </div>
                <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    Export Report
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search by PNR, passenger, agent, request ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Types</option>
                        <option value="Issue">Issue</option>
                        <option value="Reissue">Reissue</option>
                        <option value="Date Change">Date Change</option>
                        <option value="Cancellation">Cancellation</option>
                        <option value="VOID">VOID</option>
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Status</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <input
                        type="date"
                        value={dateRange.from}
                        onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="From"
                    />
                    <input
                        type="date"
                        value={dateRange.to}
                        onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="To"
                    />
                </div>
            </div>

            {/* History Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Request ID</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Agent</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">PNR / Passenger</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Flight</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Processed By</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {historyData.map((item) => {
                                const TypeIcon = getTypeIcon(item.type);
                                return (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-blue-600">{item.id}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                                                <TypeIcon className="w-3 h-3" />
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm font-medium text-gray-900">{item.agent}</p>
                                            <p className="text-xs text-gray-500">{item.agentCode}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-mono text-sm">{item.pnr}</p>
                                            <p className="text-xs text-gray-500">{item.passenger}</p>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{item.flight}</td>
                                        <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                                        <td className="px-4 py-3 text-sm">
                                            {item.charges && (
                                                <span className="text-orange-600">+₹{item.charges.toLocaleString()}</span>
                                            )}
                                            {item.refund && (
                                                <span className="text-green-600">₹{item.refund.toLocaleString()}</span>
                                            )}
                                            {item.amount && (
                                                <span className="text-blue-600">₹{item.amount.toLocaleString()}</span>
                                            )}
                                            {!item.charges && !item.refund && !item.amount && '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{item.processedBy}</td>
                                        <td className="px-4 py-3 text-xs text-gray-500">{item.processedAt}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                    <p className="text-sm text-gray-500">Showing 1-5 of 892 results</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">
                            Previous
                        </button>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
                        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">2</button>
                        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">3</button>
                        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PNRHistory;
