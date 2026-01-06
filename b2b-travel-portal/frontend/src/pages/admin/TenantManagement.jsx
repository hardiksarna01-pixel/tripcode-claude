import React, { useState } from 'react';
import { Plus, Edit, Building, Users, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const TenantManagement = () => {
  const [tenants, setTenants] = useState([
    { id: 1, name: 'TravelMax India', domain: 'travelmax.in', agents: 45, status: 'ACTIVE' },
    { id: 2, name: 'FlightDeals', domain: 'flightdeals.com', agents: 23, status: 'ACTIVE' },
    { id: 3, name: 'BookMyTrip', domain: 'bookmytrip.co', agents: 12, status: 'PENDING' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    adminEmail: '',
    plan: 'BASIC',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toast.success('Tenant created successfully');
      setShowModal(false);
    } catch (error) {
      toast.error('Failed to create tenant');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tenant Management</h1>
          <p className="text-gray-500">Manage white-label tenants and their settings</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Tenant
        </button>
      </div>

      {/* Tenants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tenants.map((tenant) => (
          <div key={tenant.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Building className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{tenant.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    {tenant.domain}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                tenant.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {tenant.status}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Agents
                </span>
                <span className="font-medium">{tenant.agents}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <button className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                <Edit className="w-4 h-4 inline mr-1" />
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Create New Tenant</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tenant Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                <input
                  type="text"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
                <input
                  type="email"
                  value={formData.adminEmail}
                  onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                <select
                  value={formData.plan}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="BASIC">Basic</option>
                  <option value="PROFESSIONAL">Professional</option>
                  <option value="ENTERPRISE">Enterprise</option>
                </select>
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
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantManagement;
