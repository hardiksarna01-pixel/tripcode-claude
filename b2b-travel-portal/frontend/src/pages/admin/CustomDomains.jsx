import React, { useState } from 'react';
import { Plus, Globe, CheckCircle, XCircle, RefreshCw, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CustomDomains = () => {
  const [domains, setDomains] = useState([
    { id: 1, domain: 'flights.travelmax.in', type: 'B2C', status: 'VERIFIED', ssl: true },
    { id: 2, domain: 'agents.travelmax.in', type: 'B2B', status: 'VERIFIED', ssl: true },
    { id: 3, domain: 'booking.flightdeals.com', type: 'B2C', status: 'PENDING', ssl: false },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    domain: '',
    type: 'B2C',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toast.success('Domain added successfully');
      setShowModal(false);
    } catch (error) {
      toast.error('Failed to add domain');
    }
  };

  const handleVerify = (domainId) => {
    toast.success('Verification initiated');
  };

  const handleDelete = (domainId) => {
    if (window.confirm('Are you sure you want to delete this domain?')) {
      setDomains(domains.filter(d => d.id !== domainId));
      toast.success('Domain deleted');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Custom Domains</h1>
          <p className="text-gray-500">Manage custom domains for your portals</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Domain
        </button>
      </div>

      {/* DNS Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">DNS Configuration</h3>
        <p className="text-sm text-blue-700 mb-2">
          Point your domain to our servers by adding these DNS records:
        </p>
        <div className="bg-white rounded p-3 text-sm font-mono">
          <p>Type: CNAME</p>
          <p>Name: your-subdomain</p>
          <p>Value: portal.tripcode.com</p>
        </div>
      </div>

      {/* Domains Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Domain</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">SSL</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {domains.map((domain) => (
              <tr key={domain.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{domain.domain}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    domain.type === 'B2C' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {domain.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1 text-sm ${
                    domain.status === 'VERIFIED' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {domain.status === 'VERIFIED' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    {domain.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {domain.ssl ? (
                    <span className="text-green-600 flex items-center gap-1 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Enabled
                    </span>
                  ) : (
                    <span className="text-gray-400 flex items-center gap-1 text-sm">
                      <XCircle className="w-4 h-4" />
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {domain.status !== 'VERIFIED' && (
                      <button
                        onClick={() => handleVerify(domain.id)}
                        className="p-1 hover:bg-gray-100 rounded text-blue-600"
                        title="Verify"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(domain.id)}
                      className="p-1 hover:bg-red-100 rounded text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {domains.length === 0 && (
          <div className="text-center py-12 text-gray-500">No custom domains configured</div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add Custom Domain</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                <input
                  type="text"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="booking.yourdomain.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Portal Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="B2C">B2C Portal</option>
                  <option value="B2B">B2B Portal</option>
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
                  Add Domain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDomains;
