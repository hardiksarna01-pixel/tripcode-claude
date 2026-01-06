import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Calculator, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';

const SchemeManagement = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'PERCENTAGE',
    value: 0,
    minBookingAmount: 0,
    maxCommission: 0,
    isActive: true,
    applicableRoutes: 'ALL',
  });

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const response = await adminAPI.getSchemes();
      setSchemes(response.data.schemes || []);
    } catch (error) {
      toast.error('Failed to load schemes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingScheme) {
        await adminAPI.updateScheme(editingScheme.id, formData);
        toast.success('Scheme updated');
      } else {
        await adminAPI.createScheme(formData);
        toast.success('Scheme created');
      }
      setShowModal(false);
      setEditingScheme(null);
      resetForm();
      fetchSchemes();
    } catch (error) {
      toast.error('Failed to save scheme');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'PERCENTAGE',
      value: 0,
      minBookingAmount: 0,
      maxCommission: 0,
      isActive: true,
      applicableRoutes: 'ALL',
    });
  };

  const openEditModal = (scheme) => {
    setEditingScheme(scheme);
    setFormData({
      name: scheme.name,
      type: scheme.type || 'PERCENTAGE',
      value: scheme.value || 0,
      minBookingAmount: scheme.minBookingAmount || 0,
      maxCommission: scheme.maxCommission || 0,
      isActive: scheme.isActive !== false,
      applicableRoutes: scheme.applicableRoutes || 'ALL',
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
          <h1 className="text-2xl font-bold text-gray-900">Commission Schemes</h1>
          <p className="text-gray-500">Manage commission schemes for agents</p>
        </div>
        <button
          onClick={() => {
            setEditingScheme(null);
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Scheme
        </button>
      </div>

      {/* Schemes Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Scheme Name</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Value</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Min Booking</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Max Commission</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {schemes.map((scheme) => (
                <tr key={scheme.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{scheme.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      scheme.type === 'PERCENTAGE' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {scheme.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {scheme.type === 'PERCENTAGE' ? `${scheme.value}%` : `₹${scheme.value}`}
                  </td>
                  <td className="px-6 py-4">₹{scheme.minBookingAmount?.toLocaleString() || 0}</td>
                  <td className="px-6 py-4">₹{scheme.maxCommission?.toLocaleString() || 'No limit'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      scheme.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {scheme.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openEditModal(scheme)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Edit className="w-4 h-4 text-gray-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {schemes.length === 0 && (
          <div className="text-center py-12 text-gray-500">No schemes created yet</div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">
              {editingScheme ? 'Edit Scheme' : 'Create Scheme'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scheme Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="PERCENTAGE">Percentage</option>
                    <option value="FLAT">Flat Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Value {formData.type === 'PERCENTAGE' ? '(%)' : '(₹)'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Booking Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.minBookingAmount}
                    onChange={(e) => setFormData({ ...formData, minBookingAmount: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Commission (₹)</label>
                  <input
                    type="number"
                    value={formData.maxCommission}
                    onChange={(e) => setFormData({ ...formData, maxCommission: parseInt(e.target.value) })}
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
                  {editingScheme ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemeManagement;
