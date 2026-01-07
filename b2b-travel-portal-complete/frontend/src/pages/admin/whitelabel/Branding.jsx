/**
 * Branding Management Page
 * Manage company branding, logos, and colors
 */

import React, { useState } from 'react';
import {
    PaintBrushIcon,
    PhotoIcon,
    SwatchIcon,
    DocumentArrowUpIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

const Branding = () => {
    const [branding, setBranding] = useState({
        companyName: 'Travel Portal',
        tagline: 'Your Gateway to Amazing Travel',
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        accentColor: '#10B981',
        logo: null,
        favicon: null,
        loginBackground: null
    });

    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSaving(false);
        alert('Branding settings saved successfully!');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Branding</h1>
                    <p className="text-gray-500 mt-1">Customize your portal's look and feel</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Company Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <PaintBrushIcon className="w-5 h-5 text-blue-600" />
                        Company Information
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company Name
                            </label>
                            <input
                                type="text"
                                value={branding.companyName}
                                onChange={(e) => setBranding({ ...branding, companyName: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tagline
                            </label>
                            <input
                                type="text"
                                value={branding.tagline}
                                onChange={(e) => setBranding({ ...branding, tagline: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Color Scheme */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <SwatchIcon className="w-5 h-5 text-blue-600" />
                        Color Scheme
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Primary Color
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={branding.primaryColor}
                                    onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                                    className="w-12 h-10 rounded cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={branding.primaryColor}
                                    onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Secondary Color
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={branding.secondaryColor}
                                    onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                                    className="w-12 h-10 rounded cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={branding.secondaryColor}
                                    onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Accent Color
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={branding.accentColor}
                                    onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                                    className="w-12 h-10 rounded cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={branding.accentColor}
                                    onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logo Upload */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <PhotoIcon className="w-5 h-5 text-blue-600" />
                        Logo & Images
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company Logo
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                                <DocumentArrowUpIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Favicon
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer">
                                <DocumentArrowUpIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-xs text-gray-500">ICO, PNG 32x32 or 64x64</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                        Live Preview
                    </h2>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div
                            className="h-12 flex items-center px-4"
                            style={{ backgroundColor: branding.primaryColor }}
                        >
                            <span className="text-white font-bold">{branding.companyName}</span>
                        </div>
                        <div className="p-4 bg-gray-50">
                            <p className="text-gray-600 text-sm">{branding.tagline}</p>
                            <div className="mt-3 flex gap-2">
                                <button
                                    style={{ backgroundColor: branding.primaryColor }}
                                    className="text-white px-4 py-2 rounded text-sm"
                                >
                                    Primary Button
                                </button>
                                <button
                                    style={{ backgroundColor: branding.secondaryColor }}
                                    className="text-white px-4 py-2 rounded text-sm"
                                >
                                    Secondary
                                </button>
                                <button
                                    style={{ backgroundColor: branding.accentColor }}
                                    className="text-white px-4 py-2 rounded text-sm"
                                >
                                    Accent
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Branding;
