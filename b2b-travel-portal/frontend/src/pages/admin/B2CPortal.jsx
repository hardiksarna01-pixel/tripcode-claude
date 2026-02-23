import React, { useState } from 'react';
import { Globe, Save, Eye, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

const B2CPortal = () => {
  const [settings, setSettings] = useState({
    enabled: true,
    domain: '',
    showPrices: true,
    allowBookings: true,
    paymentGateway: 'razorpay',
    markupType: 'PERCENTAGE',
    markupValue: 5,
    showContactForm: true,
    googleAnalyticsId: '',
    metaTitle: 'Book Flights Online',
    metaDescription: 'Book domestic and international flights at best prices',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('B2C portal settings saved');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">B2C Consumer Portal</h1>
          <p className="text-gray-500">Configure your consumer-facing website</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Eye className="w-4 h-4" />
          Preview
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            General Settings
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Enable B2C Portal</p>
                <p className="text-sm text-gray-500">Allow direct consumer bookings</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Custom Domain</label>
              <input
                type="text"
                value={settings.domain}
                onChange={(e) => setSettings({ ...settings, domain: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="www.yourdomain.com"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Payments */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Pricing & Payments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Markup Type</label>
              <select
                value={settings.markupType}
                onChange={(e) => setSettings({ ...settings, markupType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="PERCENTAGE">Percentage</option>
                <option value="FLAT">Flat Amount</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Markup Value {settings.markupType === 'PERCENTAGE' ? '(%)' : '(₹)'}
              </label>
              <input
                type="number"
                value={settings.markupValue}
                onChange={(e) => setSettings({ ...settings, markupValue: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Gateway</label>
              <select
                value={settings.paymentGateway}
                onChange={(e) => setSettings({ ...settings, paymentGateway: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="razorpay">Razorpay</option>
                <option value="paytm">Paytm</option>
                <option value="stripe">Stripe</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">SEO Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
              <input
                type="text"
                value={settings.metaTitle}
                onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
              <textarea
                value={settings.metaDescription}
                onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Analytics ID</label>
              <input
                type="text"
                value={settings.googleAnalyticsId}
                onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX"
              />
            </div>
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

export default B2CPortal;
