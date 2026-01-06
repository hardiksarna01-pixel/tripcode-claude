import React, { useEffect, useState } from 'react';
import { Plus, Edit, Server, ToggleLeft, ToggleRight, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';

const ApiProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    apiUrl: '',
    apiKey: '',
    apiSecret: '',
    priority: 1,
    isActive: true,
    markup: 0,
  });

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await adminAPI.getApiProviders();
      setProviders(response.data.providers || []);
    } catch (error) {
      toast.error('Failed to load API providers');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (providerId) => {
    try {
      await adminAPI.toggleApiProvider(providerId);
      toast.success('Provider status updated');
      fetchProviders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProvider) {
        await adminAPI.updateApiProvider(editingProvider.id, formData);
        toast.success('Provider updated');
      } else {
        await adminAPI.createApiProvider(formData);
        toast.success('Provider created');
      }
      setShowModal(false);
      setEditingProvider(null);
      resetForm();
      fetchProviders();
    } catch (error) {
      toast.error('Failed to save provider');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      apiUrl: '',
      apiKey: '',
      apiSecret: '',
      priority: 1,
      isActive: true,
      markup: 0,
    });
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
          <h1 className="text-2xl font-bold text-gray-900">API Providers</h1>
          <p className="text-gray-500">Manage flight API suppliers and integrations</p>
        </div>
        <button
          onClick={() => {
            setEditingProvider(null);
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Provider
        </button>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map((provider) => (
          <div key={provider.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Server className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{provider.name}</h3>
                  <p className="text-sm text-gray-500">{provider.code}</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle(provider.id)}
                className={`p-1 rounded ${provider.isActive ? 'text-green-600' : 'text-gray-400'}`}
              >
                {provider.isActive ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Priority</span>
                <span className="font-medium">{provider.priority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Markup</span>
                <span className="font-medium">{provider.markup || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`font-medium ${provider.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {provider.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t flex gap-2">
              <button
                onClick={() => {
                  setEditingProvider(provider);
                  setFormData({
                    name: provider.name,
                    code: provider.code,
                    apiUrl: provider.apiUrl || '',
                    apiKey: provider.apiKey || '',
                    apiSecret: '',
                    priority: provider.priority || 1,
                    isActive: provider.isActive,
                    markup: provider.markup || 0,
                  });
                  setShowModal(true);
                }}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Edit className="w-4 h-4 inline mr-1" />
                Edit
              </button>
              <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {providers.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
          No API providers configured
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">
              {editingProvider ? 'Edit Provider' : 'Add Provider'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Provider Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API URL</label>
                <input
                  type="url"
                  value={formData.apiUrl}
                  onChange={(e) => setFormData({ ...formData, apiUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://api.provider.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                <input
                  type="text"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Secret</label>
                <input
                  type="password"
                  value={formData.apiSecret}
                  onChange={(e) => setFormData({ ...formData, apiSecret: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder={editingProvider ? '(unchanged)' : ''}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Markup (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.markup}
                    onChange={(e) => setFormData({ ...formData, markup: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
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
                  {editingProvider ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiProviders;
