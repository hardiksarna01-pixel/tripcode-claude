import React, { useState, useEffect } from 'react';
import {
    PlusIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    EllipsisVerticalIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon,
    CurrencyRupeeIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const AgentManagement = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        group: '',
        creditLimit: ''
    });
    const [selectedAgents, setSelectedAgents] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10);

    const mockAgents = [
        { id: 1, name: 'ABC Travels', email: 'abc@travels.com', phone: '9876543210', status: 'Active', group: 'Gold', creditLimit: 500000, balance: 125000, bookings: 456, revenue: 4500000, createdAt: '2024-01-15' },
        { id: 2, name: 'XYZ Tours', email: 'xyz@tours.com', phone: '9876543211', status: 'Active', group: 'Silver', creditLimit: 250000, balance: 45000, bookings: 298, revenue: 2800000, createdAt: '2024-02-20' },
        { id: 3, name: 'Travel World', email: 'info@travelworld.com', phone: '9876543212', status: 'Inactive', group: 'Bronze', creditLimit: 100000, balance: 8000, bookings: 45, revenue: 450000, createdAt: '2024-03-10' },
        { id: 4, name: 'Fly High', email: 'contact@flyhigh.com', phone: '9876543213', status: 'Active', group: 'Gold', creditLimit: 750000, balance: 320000, bookings: 567, revenue: 6700000, createdAt: '2024-01-05' },
        { id: 5, name: 'Trip Masters', email: 'hello@tripmasters.com', phone: '9876543214', status: 'Pending', group: 'Silver', creditLimit: 200000, balance: 0, bookings: 0, revenue: 0, createdAt: '2024-06-01' }
    ];

    useEffect(() => {
        fetchAgents();
    }, [search, filters, currentPage]);

    const fetchAgents = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/agents', {
                params: { search, ...filters, page: currentPage }
            });
            setAgents(response.data.agents || mockAgents);
            setTotalPages(response.data.totalPages || 10);
        } catch (error) {
            console.error('Error fetching agents:', error);
            setAgents(mockAgents);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800';
            case 'Inactive': return 'bg-red-100 text-red-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getGroupBadge = (group) => {
        switch (group) {
            case 'Gold': return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
            case 'Silver': return 'bg-gray-100 text-gray-800 border border-gray-300';
            case 'Bronze': return 'bg-orange-100 text-orange-800 border border-orange-300';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const toggleSelectAll = () => {
        if (selectedAgents.length === agents.length) {
            setSelectedAgents([]);
        } else {
            setSelectedAgents(agents.map(a => a.id));
        }
    };

    const toggleSelectAgent = (id) => {
        setSelectedAgents(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleBulkAction = (action) => {
        console.log(`Performing ${action} on agents:`, selectedAgents);
        // Implement bulk actions
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Agent Management</h1>
                            <p className="text-sm text-gray-600">Manage your agent network</p>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Add Agent
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Search & Filters */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search agents by name, email, or phone..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="border rounded-lg px-4 py-2"
                        >
                            <option value="">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Pending">Pending</option>
                        </select>
                        <select
                            value={filters.group}
                            onChange={(e) => setFilters({ ...filters, group: e.target.value })}
                            className="border rounded-lg px-4 py-2"
                        >
                            <option value="">All Groups</option>
                            <option value="Gold">Gold</option>
                            <option value="Silver">Silver</option>
                            <option value="Bronze">Bronze</option>
                        </select>
                        <button className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50">
                            <FunnelIcon className="w-5 h-5" />
                            More Filters
                        </button>
                        <button className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50">
                            <ArrowDownTrayIcon className="w-5 h-5" />
                            Export
                        </button>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedAgents.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 flex items-center justify-between">
                        <span className="text-blue-800">{selectedAgents.length} agent(s) selected</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleBulkAction('activate')}
                                className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm"
                            >
                                Activate
                            </button>
                            <button
                                onClick={() => handleBulkAction('deactivate')}
                                className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm"
                            >
                                Deactivate
                            </button>
                            <button
                                onClick={() => handleBulkAction('export')}
                                className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm"
                            >
                                Export Selected
                            </button>
                        </div>
                    </div>
                )}

                {/* Agents Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedAgents.length === agents.length}
                                        onChange={toggleSelectAll}
                                        className="rounded"
                                    />
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Group</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Credit Limit</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Balance</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Bookings</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading ? (
                                <tr>
                                    <td colSpan="9" className="px-4 py-8 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
                                    </td>
                                </tr>
                            ) : (
                                agents.map(agent => (
                                    <tr key={agent.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedAgents.includes(agent.id)}
                                                onChange={() => toggleSelectAgent(agent.id)}
                                                className="rounded"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                                    {agent.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{agent.name}</div>
                                                    <div className="text-sm text-gray-500">{agent.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(agent.status)}`}>
                                                {agent.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 text-xs rounded-full ${getGroupBadge(agent.group)}`}>
                                                {agent.group}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-medium">
                                            ₹{agent.creditLimit.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={agent.balance < agent.creditLimit * 0.1 ? 'text-red-600' : 'text-green-600'}>
                                                ₹{agent.balance.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">{agent.bookings}</td>
                                        <td className="px-4 py-3 text-right font-medium">
                                            ₹{(agent.revenue / 100000).toFixed(1)}L
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="p-1 hover:bg-gray-100 rounded" title="View">
                                                    <EyeIcon className="w-5 h-5 text-gray-500" />
                                                </button>
                                                <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                                                    <PencilIcon className="w-5 h-5 text-blue-500" />
                                                </button>
                                                <button className="p-1 hover:bg-gray-100 rounded" title="Add Credit">
                                                    <CurrencyRupeeIcon className="w-5 h-5 text-green-500" />
                                                </button>
                                                <button className="p-1 hover:bg-gray-100 rounded" title="Delete">
                                                    <TrashIcon className="w-5 h-5 text-red-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="px-4 py-3 border-t flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Showing 1-{agents.length} of {totalPages * agents.length} agents
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >
                                Previous
                            </button>
                            {[1, 2, 3, 4, 5].map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-8 h-8 rounded ${
                                        currentPage === page
                                            ? 'bg-blue-600 text-white'
                                            : 'border hover:bg-gray-50'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentManagement;
