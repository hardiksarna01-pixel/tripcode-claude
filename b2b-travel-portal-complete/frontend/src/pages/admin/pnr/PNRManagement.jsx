/**
 * Admin PNR Management Dashboard
 * Overview and approval of all PNR operations
 */

import React, { useState } from 'react';
import {
    TicketIcon,
    ArrowPathIcon,
    CalendarDaysIcon,
    XCircleIcon,
    NoSymbolIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    EyeIcon,
    CheckIcon,
    XMarkIcon,
    BellIcon
} from '@heroicons/react/24/outline';

const stats = [
    { name: 'Pending Approval', value: '28', icon: ClockIcon, color: 'yellow', urgent: 5 },
    { name: 'Approved Today', value: '45', icon: CheckCircleIcon, color: 'green', change: '+12%' },
    { name: 'Rejected Today', value: '8', icon: XCircleIcon, color: 'red', change: '-3%' },
    { name: 'Total This Month', value: '892', icon: TicketIcon, color: 'blue', change: '+18%' }
];

const pendingRequests = [
    {
        id: 'REQ001',
        type: 'Date Change',
        agent: 'John Agency',
        agentCode: 'AGT001',
        pnr: 'ABC123',
        passenger: 'Michael Johnson',
        flight: 'AI-101 DEL-BOM',
        originalDate: '2024-03-15',
        requestedDate: '2024-03-20',
        urgency: 'high',
        submittedAt: '2024-02-28 10:30',
        estimatedCharges: 2500,
        reason: 'Business meeting rescheduled'
    },
    {
        id: 'REQ002',
        type: 'Cancellation',
        agent: 'Travel Masters',
        agentCode: 'AGT002',
        pnr: 'XYZ789',
        passenger: 'Sarah Wilson',
        flight: '6E-205 BLR-DEL',
        originalDate: '2024-03-18',
        urgency: 'medium',
        submittedAt: '2024-02-28 09:15',
        estimatedRefund: 8500,
        reason: 'Visa rejected'
    },
    {
        id: 'REQ003',
        type: 'Reissue',
        agent: 'Quick Travels',
        agentCode: 'AGT003',
        pnr: 'PQR456',
        passenger: 'David Brown',
        flight: 'SG-301 MUM-CCU',
        originalDate: '2024-03-12',
        requestedDate: '2024-03-14',
        urgency: 'critical',
        submittedAt: '2024-02-28 08:00',
        estimatedCharges: 3500,
        reason: 'Name correction needed'
    },
    {
        id: 'REQ004',
        type: 'VOID',
        agent: 'Sky Tours',
        agentCode: 'AGT004',
        pnr: 'LMN321',
        passenger: 'Emily Davis',
        flight: 'AI-505 DEL-GOI',
        originalDate: '2024-03-25',
        urgency: 'high',
        submittedAt: '2024-02-28 07:45',
        estimatedRefund: 12000,
        reason: 'Duplicate booking',
        voidDeadline: '2024-02-28 18:00'
    },
    {
        id: 'REQ005',
        type: 'Issue',
        agent: 'Global Flights',
        agentCode: 'AGT005',
        pnr: 'DEF654',
        passenger: 'Robert Miller',
        flight: 'UK-833 BOM-HYD',
        originalDate: '2024-03-10',
        urgency: 'normal',
        submittedAt: '2024-02-27 16:30',
        estimatedAmount: 8900,
        reason: 'New booking ticketing'
    }
];

const PNRManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterUrgency, setFilterUrgency] = useState('all');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [approvalAction, setApprovalAction] = useState(null);
    const [approvalNotes, setApprovalNotes] = useState('');

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

    const getUrgencyBadge = (urgency) => {
        const styles = {
            critical: 'bg-red-600 text-white animate-pulse',
            high: 'bg-red-100 text-red-700',
            medium: 'bg-yellow-100 text-yellow-700',
            normal: 'bg-green-100 text-green-700'
        };
        return (
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[urgency]}`}>
                {urgency.toUpperCase()}
            </span>
        );
    };

    const handleApprove = (request) => {
        setSelectedRequest(request);
        setApprovalAction('approve');
        setShowApprovalModal(true);
    };

    const handleReject = (request) => {
        setSelectedRequest(request);
        setApprovalAction('reject');
        setShowApprovalModal(true);
    };

    const processApproval = () => {
        alert(`Request ${selectedRequest.id} has been ${approvalAction === 'approve' ? 'approved' : 'rejected'}! Agent will be notified.`);
        setShowApprovalModal(false);
        setSelectedRequest(null);
        setApprovalNotes('');
    };

    const filteredRequests = pendingRequests.filter(req => {
        if (filterType !== 'all' && req.type !== filterType) return false;
        if (filterUrgency !== 'all' && req.urgency !== filterUrgency) return false;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return req.pnr.toLowerCase().includes(query) ||
                   req.passenger.toLowerCase().includes(query) ||
                   req.agent.toLowerCase().includes(query) ||
                   req.id.toLowerCase().includes(query);
        }
        return true;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">PNR Management</h1>
                    <p className="text-gray-500 mt-1">Review and approve agent PNR requests</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    <BellIcon className="w-5 h-5" />
                    Notifications ({stats[0].urgent})
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">{stat.name}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                {stat.urgent && (
                                    <p className="text-xs text-red-600 mt-1">{stat.urgent} urgent</p>
                                )}
                                {stat.change && (
                                    <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
                                )}
                            </div>
                            <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search by PNR, passenger, agent..."
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
                        value={filterUrgency}
                        onChange={(e) => setFilterUrgency(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Urgency</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="normal">Normal</option>
                    </select>
                </div>
            </div>

            {/* Pending Requests */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-yellow-50">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <ClockIcon className="w-5 h-5 text-yellow-600" />
                        Pending Approvals ({filteredRequests.length})
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Request</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Agent</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">PNR / Passenger</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Flight</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Urgency</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Submitted</th>
                                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredRequests.map((request) => {
                                const TypeIcon = getTypeIcon(request.type);
                                return (
                                    <tr key={request.id} className={`hover:bg-gray-50 ${request.urgency === 'critical' ? 'bg-red-50' : ''}`}>
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-blue-600">{request.id}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(request.type)}`}>
                                                <TypeIcon className="w-3 h-3" />
                                                {request.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm font-medium text-gray-900">{request.agent}</p>
                                            <p className="text-xs text-gray-500">{request.agentCode}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-mono text-sm">{request.pnr}</p>
                                            <p className="text-xs text-gray-500">{request.passenger}</p>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{request.flight}</td>
                                        <td className="px-4 py-3">{getUrgencyBadge(request.urgency)}</td>
                                        <td className="px-4 py-3 text-sm">
                                            {request.estimatedCharges && (
                                                <span className="text-orange-600">+₹{request.estimatedCharges.toLocaleString()}</span>
                                            )}
                                            {request.estimatedRefund && (
                                                <span className="text-green-600">₹{request.estimatedRefund.toLocaleString()}</span>
                                            )}
                                            {request.estimatedAmount && (
                                                <span className="text-blue-600">₹{request.estimatedAmount.toLocaleString()}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-500">{request.submittedAt}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleApprove(request)}
                                                    className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200"
                                                    title="Approve"
                                                >
                                                    <CheckIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleReject(request)}
                                                    className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                                    title="Reject"
                                                >
                                                    <XMarkIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                                                    title="View Details"
                                                >
                                                    <EyeIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Approval Modal */}
            {showApprovalModal && selectedRequest && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6">
                        <h3 className={`text-lg font-bold ${approvalAction === 'approve' ? 'text-green-600' : 'text-red-600'}`}>
                            {approvalAction === 'approve' ? 'Approve' : 'Reject'} Request
                        </h3>
                        <div className="mt-4 space-y-3">
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-sm"><strong>Request ID:</strong> {selectedRequest.id}</p>
                                <p className="text-sm"><strong>Type:</strong> {selectedRequest.type}</p>
                                <p className="text-sm"><strong>Agent:</strong> {selectedRequest.agent}</p>
                                <p className="text-sm"><strong>PNR:</strong> {selectedRequest.pnr}</p>
                                <p className="text-sm"><strong>Reason:</strong> {selectedRequest.reason}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {approvalAction === 'approve' ? 'Approval' : 'Rejection'} Notes
                                </label>
                                <textarea
                                    value={approvalNotes}
                                    onChange={(e) => setApprovalNotes(e.target.value)}
                                    placeholder={approvalAction === 'approve' ? 'Add any processing notes...' : 'Reason for rejection...'}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setShowApprovalModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={processApproval}
                                className={`px-4 py-2 text-white rounded-lg ${
                                    approvalAction === 'approve'
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-red-600 hover:bg-red-700'
                                }`}
                            >
                                {approvalAction === 'approve' ? 'Approve & Process' : 'Reject Request'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PNRManagement;
