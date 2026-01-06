import React, { useState } from 'react';
import { Building, Save, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

const B2BPortal = () => {
  const [settings, setSettings] = useState({
    enabled: true,
    allowSelfRegistration: true,
    requireApproval: true,
    minWalletBalance: 0,
    creditEnabled: false,
    maxCreditLimit: 100000,
    showCommission: true,
    allowSubAgents: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('B2B portal settings saved');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div>
        <p className="font-medium">{label}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">B2B Agent Portal</h1>
        <p className="text-gray-500">Configure your agent portal settings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Portal Settings
          </h2>
          <div className="space-y-4">
            <ToggleSwitch
              checked={settings.enabled}
              onChange={(val) => setSettings({ ...settings, enabled: val })}
              label="Enable B2B Portal"
              description="Allow agent access to the portal"
            />
            <ToggleSwitch
              checked={settings.allowSelfRegistration}
              onChange={(val) => setSettings({ ...settings, allowSelfRegistration: val })}
              label="Allow Self Registration"
              description="Agents can register themselves"
            />
            <ToggleSwitch
              checked={settings.requireApproval}
              onChange={(val) => setSettings({ ...settings, requireApproval: val })}
              label="Require Admin Approval"
              description="New registrations need admin approval"
            />
          </div>
        </div>

        {/* Financial Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Building className="w-5 h-5" />
            Financial Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Wallet Balance for Booking (₹)
              </label>
              <input
                type="number"
                value={settings.minWalletBalance}
                onChange={(e) => setSettings({ ...settings, minWalletBalance: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <ToggleSwitch
              checked={settings.creditEnabled}
              onChange={(val) => setSettings({ ...settings, creditEnabled: val })}
              label="Enable Credit Facility"
              description="Allow agents to book on credit"
            />
            {settings.creditEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Credit Limit (₹)
                </label>
                <input
                  type="number"
                  value={settings.maxCreditLimit}
                  onChange={(e) => setSettings({ ...settings, maxCreditLimit: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Display Settings</h2>
          <div className="space-y-4">
            <ToggleSwitch
              checked={settings.showCommission}
              onChange={(val) => setSettings({ ...settings, showCommission: val })}
              label="Show Commission to Agents"
              description="Display commission earned on bookings"
            />
            <ToggleSwitch
              checked={settings.allowSubAgents}
              onChange={(val) => setSettings({ ...settings, allowSubAgents: val })}
              label="Allow Sub-Agents"
              description="Agents can create sub-agent accounts"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default B2BPortal;
