import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';

const GroupManagement = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    creditLimit: 0,
    markupPercentage: 0,
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await adminAPI.getGroups();
      setGroups(response.data.groups || []);
    } catch (error) {
      toast.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGroup) {
        await adminAPI.updateGroup(editingGroup.id, formData);
        toast.success('Group updated');
      } else {
        await adminAPI.createGroup(formData);
        toast.success('Group created');
      }
      setShowModal(false);
      setEditingGroup(null);
      setFormData({ name: '', description: '', creditLimit: 0, markupPercentage: 0 });
      fetchGroups();
    } catch (error) {
      toast.error('Failed to save group');
    }
  };

  const openEditModal = (group) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      description: group.description || '',
      creditLimit: group.creditLimit || 0,
      markupPercentage: group.markupPercentage || 0,
    });
    setShowModal(true);
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
          <h1 className="text-2xl font-bold text-gray-900">Agent Groups</h1>
          <p className="text-gray-500">Manage agent groups and their settings</p>
        </div>
        <button
          onClick={() => {
            setEditingGroup(null);
            setFormData({ name: '', description: '', creditLimit: 0, markupPercentage: 0 });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Group
        </button>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <div key={group.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{group.name}</h3>
                <p className="text-sm text-gray-500">{group.description}</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => openEditModal(group)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Edit className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Agents</span>
                <span className="font-medium flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {group.agentCount || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Credit Limit</span>
                <span className="font-medium">₹{group.creditLimit?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Markup</span>
                <span className="font-medium">{group.markupPercentage || 0}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {groups.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
          No groups created yet
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              {editingGroup ? 'Edit Group' : 'Create Group'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Credit Limit (₹)</label>
                <input
                  type="number"
                  value={formData.creditLimit}
                  onChange={(e) => setFormData({ ...formData, creditLimit: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Markup Percentage (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.markupPercentage}
                  onChange={(e) => setFormData({ ...formData, markupPercentage: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingGroup ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupManagement;
