import React, { useState, useEffect } from 'react';
import {
    UserGroupIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    PlusIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    EyeIcon,
    PencilIcon,
    CurrencyRupeeIcon,
    DocumentTextIcon,
    ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const AdminAgents = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedAgent, setSelectedAgent] = useState(null);

    const stats = {
        total: 1250,
        active: 980,
        pending: 145,
        suspended: 125
    };

    useEffect(() => {
        fetchAgents();
    }, [statusFilter]);

    const fetchAgents = async () => {
        try {
            const response = await api.get('/admin/agents', { params: { status: statusFilter } });
            setAgents(response.data);
        } catch (error) {
            // Mock data
            setAgents([
                { id: 'AGT001', name: 'ABC Travels', email: 'abc@travels.com', phone: '9876543210', city: 'Mumbai', status: 'active', walletBalance: 125000, creditLimit: 500000, totalBookings: 450, joinDate: '2023-01-15' },
                { id: 'AGT002', name: 'XYZ Tours', email: 'xyz@tours.com', phone: '9876543211', city: 'Delhi', status: 'active', walletBalance: 89000, creditLimit: 300000, totalBookings: 320, joinDate: '2023-02-20' },
                { id: 'AGT003', name: 'Travel World', email: 'info@travelworld.com', phone: '9876543212', city: 'Bangalore', status: 'pending', walletBalance: 0, creditLimit: 0, totalBookings: 0, joinDate: '2024-06-10' },
                { id: 'AGT004', name: 'Fly High', email: 'contact@flyhigh.com', phone: '9876543213', city: 'Chennai', status: 'active', walletBalance: 156000, creditLimit: 400000, totalBookings: 580, joinDate: '2022-11-05' },
                { id: 'AGT005', name: 'Trip Masters', email: 'hello@tripmasters.com', phone: '9876543214', city: 'Hyderabad', status: 'suspended', walletBalance: 25000, creditLimit: 200000, totalBookings: 180, joinDate: '2023-05-18' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (agentId) => {
        try {
            await api.post(`/admin/agents/${agentId}/approve`);
            fetchAgents();
        } catch (error) {
            console.error('Failed to approve agent');
        }
    };

    const handleSuspend = async (agentId) => {
        try {
            await api.post(`/admin/agents/${agentId}/suspend`);
            fetchAgents();
        } catch (error) {
            console.error('Failed to suspend agent');
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            active: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            suspended: 'bg-red-100 text-red-800'
        };
        return `px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`;
    };

    const filteredAgents = agents.filter(agent =>
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Agent Management</h1>
                            <p className="text-gray-600">Manage travel agents and their accounts</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50">
                                <ArrowDownTrayIcon className="w-5 h-5" />
                                Export
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700">
                                <PlusIcon className="w-5 h-5" />
                                Add Agent
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <UserGroupIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.total}</div>
                                <div className="text-gray-500 text-sm">Total Agents</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircleIcon className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.active}</div>
                                <div className="text-gray-500 text-sm">Active</div>
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
                                <div className="text-gray-500 text-sm">Pending Approval</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <XCircleIcon className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.suspended}</div>
                                <div className="text-gray-500 text-sm">Suspended</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or ID..."
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
                            <option value="pending">Pending</option>
                            <option value="suspended">Suspended</option>
                        </select>
                        <button className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50">
                            <FunnelIcon className="w-5 h-5" />
                            More Filters
                        </button>
                    </div>
                </div>

                {/* Agents Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Agent</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Contact</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">City</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Wallet</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Credit Limit</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Bookings</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredAgents.map((agent) => (
                                <tr key={agent.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="font-medium">{agent.name}</div>
                                        <div className="text-sm text-gray-500">{agent.id}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm">{agent.email}</div>
                                        <div className="text-sm text-gray-500">{agent.phone}</div>
                                    </td>
                                    <td className="px-4 py-3 text-sm">{agent.city}</td>
                                    <td className="px-4 py-3">
                                        <span className="font-medium">₹{agent.walletBalance.toLocaleString()}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-gray-600">₹{agent.creditLimit.toLocaleString()}</span>
                                    </td>
                                    <td className="px-4 py-3 text-sm">{agent.totalBookings}</td>
                                    <td className="px-4 py-3">
                                        <span className={getStatusBadge(agent.status)}>
                                            {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button className="p-1 hover:bg-gray-100 rounded" title="View">
                                                <EyeIcon className="w-5 h-5 text-gray-500" />
                                            </button>
                                            <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                                                <PencilIcon className="w-5 h-5 text-gray-500" />
                                            </button>
                                            <button className="p-1 hover:bg-gray-100 rounded" title="Wallet">
                                                <CurrencyRupeeIcon className="w-5 h-5 text-gray-500" />
                                            </button>
                                            <button className="p-1 hover:bg-gray-100 rounded" title="Documents">
                                                <DocumentTextIcon className="w-5 h-5 text-gray-500" />
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

export default AdminAgents;
