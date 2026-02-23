import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, Eye, Ban, CheckCircle, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';

const AgentManagement = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await adminAPI.getAgents();
      setAgents(response.data.agents || []);
    } catch (error) {
      toast.error('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (agentId) => {
    if (!window.confirm('Are you sure you want to block this agent?')) return;
    try {
      await adminAPI.blockAgent(agentId, 'Blocked by admin');
      toast.success('Agent blocked');
      fetchAgents();
    } catch (error) {
      toast.error('Failed to block agent');
    }
  };

  const handleUnblock = async (agentId) => {
    try {
      await adminAPI.unblockAgent(agentId);
      toast.success('Agent unblocked');
      fetchAgents();
    } catch (error) {
      toast.error('Failed to unblock agent');
    }
  };

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      ACTIVE: 'bg-green-100 text-green-700',
      PENDING: 'bg-yellow-100 text-yellow-700',
      BLOCKED: 'bg-red-100 text-red-700',
      APPROVED: 'bg-blue-100 text-blue-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agent Management</h1>
          <p className="text-gray-500">Manage all registered travel agents</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Add Agent
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by company name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="BLOCKED">Blocked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Agents Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Company</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Group</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Balance</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{agent.companyName}</td>
                  <td className="px-6 py-4">{agent.contactName}</td>
                  <td className="px-6 py-4 text-gray-500">{agent.email}</td>
                  <td className="px-6 py-4">{agent.groupName || 'Default'}</td>
                  <td className="px-6 py-4 font-medium">₹{agent.walletBalance?.toLocaleString() || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(agent.status)}`}>
                      {agent.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded" title="View">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      {agent.status === 'BLOCKED' ? (
                        <button
                          onClick={() => handleUnblock(agent.id)}
                          className="p-1 hover:bg-green-100 rounded"
                          title="Unblock"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBlock(agent.id)}
                          className="p-1 hover:bg-red-100 rounded"
                          title="Block"
                        >
                          <Ban className="w-4 h-4 text-red-500" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredAgents.length === 0 && (
          <div className="text-center py-12 text-gray-500">No agents found</div>
        )}
      </div>
    </div>
  );
};

export default AgentManagement;
