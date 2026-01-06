import React, { useState, useEffect } from 'react';

/**
 * Scheme Management Component
 * Create and manage commission/markup schemes
 */
const SchemeManagement = () => {
  const [schemes, setSchemes] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [apiProviders, setApiProviders] = useState([]);
  const [airlines, setAirlines] = useState([]);

  const [formData, setFormData] = useState({
    schemeName: '',
    schemeCode: '',
    description: '',
    
    // Domestic Settings
    domesticServiceFeeType: 'FLAT',
    domesticServiceFeeValue: 0,
    domesticMarkupOnBase: 0,
    domesticCommissionShare: 0,
    
    // International Settings
    intlServiceFeeType: 'FLAT',
    intlServiceFeeValue: 0,
    intlMarkupOnBase: 0,
    intlCommissionShare: 0,
    
    // Tax Settings
    applyGst: true,
    gstRate: 18,
    applyTds: true,
    tdsRate: 2,
    
    // General Settings
    allowCredit: false,
    maxCreditLimit: 0,
    autoTicket: false,
    blockTicketAllowed: true,
    blockTicketDurationHours: 24,
    
    isActive: true,
    
    // API Configurations
    apiConfigs: [],
    
    // Airline Rules
    airlineRules: []
  });

  useEffect(() => {
    fetchSchemes();
    fetchApiProviders();
    fetchAirlines();
  }, []);

  const fetchSchemes = async () => {
    // API call to get schemes
    // const response = await adminApi.getSchemes();
    // setSchemes(response.data);
    
    // Mock data
    setSchemes([
      { id: 1, schemeName: 'Standard', schemeCode: 'STD', domesticServiceFeeValue: 100, isActive: true },
      { id: 2, schemeName: 'Premium', schemeCode: 'PRM', domesticServiceFeeValue: 50, isActive: true },
      { id: 3, schemeName: 'Enterprise', schemeCode: 'ENT', domesticServiceFeeValue: 0, isActive: true }
    ]);
  };

  const fetchApiProviders = async () => {
    setApiProviders([
      { id: 1, providerName: 'Amadeus', providerCode: 'AMADEUS' },
      { id: 2, providerName: 'TBO', providerCode: 'TBO' },
      { id: 3, providerName: 'Tripjack', providerCode: 'TRIPJACK' }
    ]);
  };

  const fetchAirlines = async () => {
    setAirlines([
      { code: '6E', name: 'IndiGo' },
      { code: 'SG', name: 'SpiceJet' },
      { code: 'AI', name: 'Air India' },
      { code: 'UK', name: 'Vistara' },
      { code: 'G8', name: 'Go First' }
    ]);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleApiConfigChange = (apiId, field, value) => {
    setFormData(prev => {
      const existingConfig = prev.apiConfigs.find(c => c.apiProviderId === apiId);
      if (existingConfig) {
        return {
          ...prev,
          apiConfigs: prev.apiConfigs.map(c => 
            c.apiProviderId === apiId ? { ...c, [field]: value } : c
          )
        };
      } else {
        return {
          ...prev,
          apiConfigs: [...prev.apiConfigs, { apiProviderId: apiId, [field]: value }]
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        // await adminApi.updateScheme(selectedScheme.id, formData);
        alert('Scheme updated successfully!');
      } else {
        // await adminApi.createScheme(formData);
        alert('Scheme created successfully!');
      }
      
      fetchSchemes();
      resetForm();
    } catch (error) {
      alert('Error saving scheme: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      schemeName: '',
      schemeCode: '',
      description: '',
      domesticServiceFeeType: 'FLAT',
      domesticServiceFeeValue: 0,
      domesticMarkupOnBase: 0,
      domesticCommissionShare: 0,
      intlServiceFeeType: 'FLAT',
      intlServiceFeeValue: 0,
      intlMarkupOnBase: 0,
      intlCommissionShare: 0,
      applyGst: true,
      gstRate: 18,
      applyTds: true,
      tdsRate: 2,
      allowCredit: false,
      maxCreditLimit: 0,
      autoTicket: false,
      blockTicketAllowed: true,
      blockTicketDurationHours: 24,
      isActive: true,
      apiConfigs: [],
      airlineRules: []
    });
    setSelectedScheme(null);
    setIsEditing(false);
  };

  const editScheme = (scheme) => {
    setSelectedScheme(scheme);
    setFormData({ ...scheme });
    setIsEditing(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Scheme Management</h1>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Scheme List */}
        <div className="col-span-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Schemes</h2>
            <div className="space-y-2">
              {schemes.map(scheme => (
                <div
                  key={scheme.id}
                  onClick={() => editScheme(scheme)}
                  className={`p-3 rounded cursor-pointer border ${
                    selectedScheme?.id === scheme.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{scheme.schemeName}</div>
                      <div className="text-sm text-gray-500">{scheme.schemeCode}</div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${
                      scheme.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {scheme.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={resetForm}
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              + Create New Scheme
            </button>
          </div>
        </div>

        {/* Scheme Form */}
        <div className="col-span-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">
              {isEditing ? 'Edit Scheme' : 'Create New Scheme'}
            </h2>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Scheme Name *</label>
                <input
                  type="text"
                  name="schemeName"
                  value={formData.schemeName}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Scheme Code *</label>
                <input
                  type="text"
                  name="schemeCode"
                  value={formData.schemeCode}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  rows={2}
                />
              </div>
            </div>

            {/* Domestic Settings */}
            <div className="border rounded p-4 mb-6">
              <h3 className="font-medium mb-3 text-blue-600">Domestic Flight Settings</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm mb-1">Service Fee Type</label>
                  <select
                    name="domesticServiceFeeType"
                    value={formData.domesticServiceFeeType}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="FLAT">Flat (₹)</option>
                    <option value="PERCENTAGE">Percentage (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Service Fee Value</label>
                  <input
                    type="number"
                    name="domesticServiceFeeValue"
                    value={formData.domesticServiceFeeValue}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Markup on Base (%)</label>
                  <input
                    type="number"
                    name="domesticMarkupOnBase"
                    value={formData.domesticMarkupOnBase}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Commission Share (%)</label>
                  <input
                    type="number"
                    name="domesticCommissionShare"
                    value={formData.domesticCommissionShare}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* International Settings */}
            <div className="border rounded p-4 mb-6">
              <h3 className="font-medium mb-3 text-green-600">International Flight Settings</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm mb-1">Service Fee Type</label>
                  <select
                    name="intlServiceFeeType"
                    value={formData.intlServiceFeeType}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="FLAT">Flat (₹)</option>
                    <option value="PERCENTAGE">Percentage (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Service Fee Value</label>
                  <input
                    type="number"
                    name="intlServiceFeeValue"
                    value={formData.intlServiceFeeValue}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Markup on Base (%)</label>
                  <input
                    type="number"
                    name="intlMarkupOnBase"
                    value={formData.intlMarkupOnBase}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Commission Share (%)</label>
                  <input
                    type="number"
                    name="intlCommissionShare"
                    value={formData.intlCommissionShare}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Tax Settings */}
            <div className="border rounded p-4 mb-6">
              <h3 className="font-medium mb-3 text-orange-600">Tax Settings</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="applyGst"
                    checked={formData.applyGst}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-sm">Apply GST</label>
                </div>
                <div>
                  <label className="block text-sm mb-1">GST Rate (%)</label>
                  <input
                    type="number"
                    name="gstRate"
                    value={formData.gstRate}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    disabled={!formData.applyGst}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="applyTds"
                    checked={formData.applyTds}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-sm">Apply TDS</label>
                </div>
                <div>
                  <label className="block text-sm mb-1">TDS Rate (%)</label>
                  <input
                    type="number"
                    name="tdsRate"
                    value={formData.tdsRate}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    disabled={!formData.applyTds}
                  />
                </div>
              </div>
            </div>

            {/* API Configuration */}
            <div className="border rounded p-4 mb-6">
              <h3 className="font-medium mb-3 text-purple-600">API Configuration</h3>
              <p className="text-sm text-gray-500 mb-3">Enable/disable APIs and set custom fees per API</p>
              
              <div className="space-y-3">
                {apiProviders.map(api => (
                  <div key={api.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      checked={formData.apiConfigs.find(c => c.apiProviderId === api.id)?.isEnabled || false}
                      onChange={(e) => handleApiConfigChange(api.id, 'isEnabled', e.target.checked)}
                    />
                    <span className="font-medium w-32">{api.providerName}</span>
                    <div className="flex items-center gap-2">
                      <label className="text-sm">Custom Fee:</label>
                      <input
                        type="number"
                        placeholder="₹"
                        className="w-24 border rounded px-2 py-1 text-sm"
                        value={formData.apiConfigs.find(c => c.apiProviderId === api.id)?.customServiceFeeValue || ''}
                        onChange={(e) => handleApiConfigChange(api.id, 'customServiceFeeValue', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* General Settings */}
            <div className="border rounded p-4 mb-6">
              <h3 className="font-medium mb-3">General Settings</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="allowCredit"
                    checked={formData.allowCredit}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-sm">Allow Credit</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="autoTicket"
                    checked={formData.autoTicket}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-sm">Auto Ticket</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="blockTicketAllowed"
                    checked={formData.blockTicketAllowed}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-sm">Block Ticket Allowed</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-sm">Active</label>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                {isEditing ? 'Update Scheme' : 'Create Scheme'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SchemeManagement;
