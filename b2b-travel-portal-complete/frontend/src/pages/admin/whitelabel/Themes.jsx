/**
 * Theme Management Page
 * Manage and customize portal themes
 */

import React, { useState } from 'react';
import { SwatchIcon, CheckCircleIcon, PlusIcon } from '@heroicons/react/24/outline';

const themes = [
    {
        id: 1,
        name: 'Default Blue',
        primary: '#3B82F6',
        secondary: '#1E40AF',
        accent: '#10B981',
        isActive: true
    },
    {
        id: 2,
        name: 'Corporate Green',
        primary: '#059669',
        secondary: '#047857',
        accent: '#F59E0B',
        isActive: false
    },
    {
        id: 3,
        name: 'Modern Purple',
        primary: '#7C3AED',
        secondary: '#5B21B6',
        accent: '#EC4899',
        isActive: false
    },
    {
        id: 4,
        name: 'Warm Orange',
        primary: '#EA580C',
        secondary: '#C2410C',
        accent: '#0EA5E9',
        isActive: false
    }
];

const Themes = () => {
    const [selectedTheme, setSelectedTheme] = useState(1);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Themes</h1>
                    <p className="text-gray-500 mt-1">Choose and customize your portal theme</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    <PlusIcon className="w-5 h-5" />
                    Create Custom Theme
                </button>
            </div>

            {/* Theme Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {themes.map((theme) => (
                    <div
                        key={theme.id}
                        onClick={() => setSelectedTheme(theme.id)}
                        className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden cursor-pointer transition-all ${
                            selectedTheme === theme.id
                                ? 'border-blue-500 ring-2 ring-blue-200'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        {/* Theme Preview */}
                        <div className="relative">
                            <div
                                className="h-20"
                                style={{ backgroundColor: theme.primary }}
                            />
                            <div className="absolute bottom-2 left-2 right-2 flex gap-1">
                                <div
                                    className="w-6 h-6 rounded-full border-2 border-white shadow"
                                    style={{ backgroundColor: theme.primary }}
                                />
                                <div
                                    className="w-6 h-6 rounded-full border-2 border-white shadow"
                                    style={{ backgroundColor: theme.secondary }}
                                />
                                <div
                                    className="w-6 h-6 rounded-full border-2 border-white shadow"
                                    style={{ backgroundColor: theme.accent }}
                                />
                            </div>
                            {theme.isActive && (
                                <div className="absolute top-2 right-2">
                                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                        Active
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Theme Info */}
                        <div className="p-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">{theme.name}</h3>
                                {selectedTheme === theme.id && (
                                    <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Theme Customization */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <SwatchIcon className="w-5 h-5 text-blue-600" />
                    Theme Customization
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Font Family
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option>Inter</option>
                            <option>Roboto</option>
                            <option>Open Sans</option>
                            <option>Poppins</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Border Radius
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option>Rounded (8px)</option>
                            <option>Sharp (0px)</option>
                            <option>Pill (9999px)</option>
                            <option>Subtle (4px)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Shadow Style
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option>Soft</option>
                            <option>Medium</option>
                            <option>Strong</option>
                            <option>None</option>
                        </select>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Reset to Default
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Apply Theme
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Themes;
