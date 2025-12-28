import React, { useState, useEffect } from 'react';

/**
 * API Provider Management Component
 * Manage flight API providers, commissions, airline mappings
 */
const ApiProviderManagement = () => {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    providerName: '',
    providerCode: '',
    providerType: 'GDS',
    apiBaseUrl: '',
    apiUserId: '',
    apiPassword: '',
    apiKey: '',
    
    // Contact Details
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    supportEmail: '',
    supportPhone: '',
    
    // Masking
    maskContactDetails: false,
    maskedContactName: '',
    maskedContactEmail: '',
    maskedContactPhone: '',
    
    // Commission
    baseCommissionDomestic: 0,
    baseCommissionIntl: 0,
    
    // Settings
    isActive: true,
    isTestMode: false,
    searchTimeoutSeconds: 30,
    bookingTimeoutSeconds: 60
  });

  const [airlines, setAirlines] = useState([]);
  const [fareCommissions, setFareCommissions] = useState([]);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    // Mock data
    setProviders([
      {
        id: 1,
        providerName: 'Amadeus',
        providerCode: 'AMADEUS',
        providerType: 'GDS',
        isActive: true,
        baseCommissionDomestic: 1.5,
        baseCommissionIntl: 2.0
      },
      {
        id: 2,
        providerName: 'TBO Air',
        providerCode: 'TBO',
        providerType: 'CONSOLIDATOR',
        isActive: true,
        baseCommissionDomestic: 2.0,
        baseCommissionIntl: 2.5
      },
      {
        id: 3,
        providerName: 'Tripjack',
        providerCode: 'TRIPJACK',
        providerType: 'CONSOLIDATOR',
        isActive: true,
        baseCommissionDomestic: 1.8,
        baseCommissionIntl: 2.2
      },
      {
        id: 4,
        providerName: 'IndiGo Direct',
        providerCode: '6E_DIRECT',
        providerType: 'LCC_DIRECT',
        isActive: true,
        baseCommissionDomestic: 0.5,
        baseCommissionIntl: 0
      }
    ]);
  };

  const fetchProviderDetails = async (providerId) => {
    // Fetch airlines for this provider
    setAirlines([
      { airlineCode: '6E', airlineName: 'IndiGo', commissionValue: 1.5, isEnabled: true },
      { airlineCode: 'SG', airlineName: 'SpiceJet', commissionValue: 2.0, isEnabled: true },
      { airlineCode: 'AI', airlineName: 'Air India', commissionValue: 1.2, isEnabled: true },
      { airlineCode: 'UK', airlineName: 'Vistara', commissionValue: 1.8, isEnabled: false }
    ]);

    // Fetch fare commissions
    setFareCommissions([
      { fareType: 'PUBLISHED', airlineCode: '6E', commissionValue: 1.5, travelType: 0 },
      { fareType: 'SERIES', airlineCode: '6E', commissionValue: 3.0, travelType: 0 },
      { fareType: 'SME', airlineCode: '6E', commissionValue: 2.0, travelType: 0 },
      { fareType: 'PUBLISHED', airlineCode: 'SG', commissionValue: 2.0, travelType: 0 },
      { fareType: 'SERIES', airlineCode: 'SG', commissionValue: 3.5, travelType: 0 }
    ]);
  };

  const handleSelectProvider = (provider) => {
    setSelectedProvider(provider);
    setFormData({ ...provider });
    fetchProviderDetails(provider.id);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        // await adminApi.updateApiProvider(selectedProvider.id, formData);
        alert('Provider updated successfully!');
      } else {
        // await adminApi.createApiProvider(formData);
        alert('Provider created successfully!');
      }
      fetchProviders();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleAirlineToggle = (airlineCode) => {
    setAirlines(prev => prev.map(a => 
      a.airlineCode === airlineCode ? { ...a, isEnabled: !a.isEnabled } : a
    ));
  };

  const handleAirlineCommissionChange = (airlineCode, value) => {
    setAirlines(prev => prev.map(a => 
      a.airlineCode === airlineCode ? { ...a, commissionValue: parseFloat(value) } : a
    ));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">API Provider Management</h1>

      <div className="grid grid-cols-12 gap-6">
        {/* Provider List */}
        <div className="col-span-3">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="font-semibold">API Providers</h2>
            </div>
            <div className="divide-y">
              {providers.map(provider => (
                <div
                  key={provider.id}
                  onClick={() => handleSelectProvider(provider)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedProvider?.id === provider.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{provider.providerName}</div>
                      <div className="text-xs text-gray-500">{provider.providerCode}</div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 text-xs rounded ${
                        provider.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {provider.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <div className="text-xs text-gray-400 mt-1">{provider.providerType}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4">
              <button
                onClick={() => {
                  setSelectedProvider(null);
                  setIsEditing(false);
                  setFormData({
                    providerName: '',
                    providerCode: '',
                    providerType: 'GDS',
                    isActive: true
                  });
                }}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                + Add Provider
              </button>
            </div>
          </div>
        </div>

        {/* Provider Details */}
        <div className="col-span-9">
          {selectedProvider ? (
            <div className="bg-white rounded-lg shadow">
              {/* Tabs */}
              <div className="border-b">
                <div className="flex">
                  {['details', 'airlines', 'commissions', 'contact'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-3 font-medium capitalize ${
                        activeTab === tab
                          ? 'border-b-2 border-blue-600 text-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {/* Details Tab */}
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Provider Name *</label>
                        <input
                          type="text"
                          name="providerName"
                          value={formData.providerName}
                          onChange={handleInputChange}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Provider Code *</label>
                        <input
                          type="text"
                          name="providerCode"
                          value={formData.providerCode}
                          onChange={handleInputChange}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Provider Type</label>
                        <select
                          name="providerType"
                          value={formData.providerType}
                          onChange={handleInputChange}
                          className="w-full border rounded px-3 py-2"
                        >
                          <option value="GDS">GDS</option>
                          <option value="LCC_DIRECT">LCC Direct</option>
                          <option value="CONSOLIDATOR">Consolidator</option>
                        </select>
                      </div>
                    </div>

                    <div className="border rounded p-4">
                      <h3 className="font-medium mb-3">API Credentials</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm mb-1">API Base URL</label>
                          <input
                            type="text"
                            name="apiBaseUrl"
                            value={formData.apiBaseUrl || ''}
                            onChange={handleInputChange}
                            className="w-full border rounded px-3 py-2"
                            placeholder="https://api.provider.com/v1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">API Key</label>
                          <input
                            type="password"
                            name="apiKey"
                            value={formData.apiKey || ''}
                            onChange={handleInputChange}
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">User ID</label>
                          <input
                            type="text"
                            name="apiUserId"
                            value={formData.apiUserId || ''}
                            onChange={handleInputChange}
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Password</label>
                          <input
                            type="password"
                            name="apiPassword"
                            value={formData.apiPassword || ''}
                            onChange={handleInputChange}
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <label>Active</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="isTestMode"
                          checked={formData.isTestMode || false}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <label>Test Mode</label>
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Search Timeout (sec)</label>
                        <input
                          type="number"
                          name="searchTimeoutSeconds"
                          value={formData.searchTimeoutSeconds || 30}
                          onChange={handleInputChange}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Booking Timeout (sec)</label>
                        <input
                          type="number"
                          name="bookingTimeoutSeconds"
                          value={formData.bookingTimeoutSeconds || 60}
                          onChange={handleInputChange}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Airlines Tab */}
                {activeTab === 'airlines' && (
                  <div>
                    <p className="text-gray-500 mb-4">
                      Enable/disable airlines and set commission rates for this API provider
                    </p>
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left p-3">Enabled</th>
                          <th className="text-left p-3">Code</th>
                          <th className="text-left p-3">Airline Name</th>
                          <th className="text-left p-3">Commission (%)</th>
                          <th className="text-left p-3">Classes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {airlines.map(airline => (
                          <tr key={airline.airlineCode} className="border-b">
                            <td className="p-3">
                              <input
                                type="checkbox"
                                checked={airline.isEnabled}
                                onChange={() => handleAirlineToggle(airline.airlineCode)}
                              />
                            </td>
                            <td className="p-3 font-mono">{airline.airlineCode}</td>
                            <td className="p-3">{airline.airlineName}</td>
                            <td className="p-3">
                              <input
                                type="number"
                                value={airline.commissionValue}
                                onChange={(e) => handleAirlineCommissionChange(airline.airlineCode, e.target.value)}
                                className="w-24 border rounded px-2 py-1"
                                step="0.1"
                              />
                            </td>
                            <td className="p-3">
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">All Classes</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Commissions Tab */}
                {activeTab === 'commissions' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-gray-500">
                        Configure fare-type specific commission rates
                      </p>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                        + Add Rule
                      </button>
                    </div>
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left p-3">Fare Type</th>
                          <th className="text-left p-3">Airline</th>
                          <th className="text-left p-3">Travel Type</th>
                          <th className="text-left p-3">Commission (%)</th>
                          <th className="text-left p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fareCommissions.map((commission, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded text-xs ${
                                commission.fareType === 'PUBLISHED' ? 'bg-blue-100 text-blue-800' :
                                commission.fareType === 'SERIES' ? 'bg-green-100 text-green-800' :
                                'bg-orange-100 text-orange-800'
                              }`}>
                                {commission.fareType}
                              </span>
                            </td>
                            <td className="p-3">{commission.airlineCode}</td>
                            <td className="p-3">
                              {commission.travelType === 0 ? 'Domestic' : 'International'}
                            </td>
                            <td className="p-3">{commission.commissionValue}%</td>
                            <td className="p-3">
                              <button className="text-blue-600 hover:underline text-sm mr-2">Edit</button>
                              <button className="text-red-600 hover:underline text-sm">Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Contact Tab */}
                {activeTab === 'contact' && (
                  <div className="space-y-6">
                    <div className="border rounded p-4">
                      <h3 className="font-medium mb-3">Actual Contact Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm mb-1">Contact Name</label>
                          <input
                            type="text"
                            name="contactName"
                            value={formData.contactName || ''}
                            onChange={handleInputChange}
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Contact Email</label>
                          <input
                            type="email"
                            name="contactEmail"
                            value={formData.contactEmail || ''}
                            onChange={handleInputChange}
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Contact Phone</label>
                          <input
                            type="text"
                            name="contactPhone"
                            value={formData.contactPhone || ''}
                            onChange={handleInputChange}
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Support Email</label>
                          <input
                            type="email"
                            name="supportEmail"
                            value={formData.supportEmail || ''}
                            onChange={handleInputChange}
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border rounded p-4">
                      <div className="flex items-center mb-3">
                        <input
                          type="checkbox"
                          name="maskContactDetails"
                          checked={formData.maskContactDetails || false}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <label className="font-medium">Mask Contact Details (show different info to agents)</label>
                      </div>
                      
                      {formData.maskContactDetails && (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm mb-1">Masked Contact Name</label>
                            <input
                              type="text"
                              name="maskedContactName"
                              value={formData.maskedContactName || ''}
                              onChange={handleInputChange}
                              className="w-full border rounded px-3 py-2"
                              placeholder="Name shown to agents"
                            />
                          </div>
                          <div>
                            <label className="block text-sm mb-1">Masked Email</label>
                            <input
                              type="email"
                              name="maskedContactEmail"
                              value={formData.maskedContactEmail || ''}
                              onChange={handleInputChange}
                              className="w-full border rounded px-3 py-2"
                              placeholder="Email shown to agents"
                            />
                          </div>
                          <div>
                            <label className="block text-sm mb-1">Masked Phone</label>
                            <input
                              type="text"
                              name="maskedContactPhone"
                              value={formData.maskedContactPhone || ''}
                              onChange={handleInputChange}
                              className="w-full border rounded px-3 py-2"
                              placeholder="Phone shown to agents"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="flex gap-4 mt-6 pt-6 border-t">
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setSelectedProvider(null)}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              Select a provider to view details or create a new one
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiProviderManagement;
