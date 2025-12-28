import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';

/**
 * Admin Agent Default Settings Component
 * Allows admin to set default preferences for all agents
 */
const AgentDefaultSettings = () => {
    const [settings, setSettings] = useState({
        // Default Trip Type
        defaultTripType: 'ONE_WAY',
        enforceDefaultTripType: false,
        autoSelectTripType: true,

        // Fare Display
        fareDisplayMode: 'TOTAL',
        enforceFareDisplayMode: false,
        showFareBreakdown: true,

        // Search Defaults
        defaultClassOfTravel: 0,
        enforceClassOfTravel: false,
        defaultAdults: 1,
        defaultChildren: 0,
        defaultInfants: 0,

        // Agent Permissions
        allowCommissionView: true,
        allowNetFareView: false,
        allowBlockTicket: true,
        maxBlockTicketHours: 24,

        // Results
        defaultResultsPerPage: 20,
        maxResultsPerPage: 100
    });

    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('all');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchGroups();
        loadSettings();
    }, [selectedGroup]);

    const fetchGroups = async () => {
        try {
            const response = await adminApi.getGroups();
            setGroups(response.data || []);
        } catch (error) {
            // Use mock data
            setGroups([
                { id: 1, name: 'Standard Agents' },
                { id: 2, name: 'Premium Agents' },
                { id: 3, name: 'Enterprise Agents' }
            ]);
        }
    };

    const loadSettings = async () => {
        // Load settings for selected group
        // In real app: const response = await adminApi.getAgentDefaultSettings(selectedGroup);
    };

    const handleChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);

        try {
            // await adminApi.updateAgentDefaultSettings(selectedGroup, settings);
            setMessage({ type: 'success', text: 'Default settings saved successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save settings.' });
        } finally {
            setIsSaving(false);
        }
    };

    const SettingRow = ({ label, description, children, enforceField, enforceLabel }) => (
        <div className="py-4 border-b last:border-0">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="font-medium text-gray-800">{label}</div>
                    {description && <div className="text-sm text-gray-500 mt-1">{description}</div>}
                </div>
                <div className="flex items-center gap-4">
                    {children}
                    {enforceField && (
                        <label className="flex items-center text-sm text-orange-600 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings[enforceField]}
                                onChange={(e) => handleChange(enforceField, e.target.checked)}
                                className="mr-2"
                            />
                            {enforceLabel || 'Enforce'}
                        </label>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Agent Default Settings</h1>
                    <p className="text-gray-500">Configure default preferences for agents</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Message */}
            {message && (
                <div className={`mb-6 p-4 rounded-lg ${
                    message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {message.text}
                </div>
            )}

            {/* Group Selector */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Apply Settings To</label>
                <select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="w-64 border rounded-lg px-3 py-2"
                >
                    <option value="all">All Agents (Global Default)</option>
                    {groups.map(group => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                </select>
            </div>

            {/* Trip Type Settings */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <span className="text-2xl mr-2">✈️</span>
                    Trip Type Settings
                </h2>

                <SettingRow
                    label="Default Trip Type"
                    description="The trip type selected by default when agent opens flight search"
                    enforceField="enforceDefaultTripType"
                    enforceLabel="Force for all"
                >
                    <select
                        value={settings.defaultTripType}
                        onChange={(e) => handleChange('defaultTripType', e.target.value)}
                        className="border rounded-lg px-3 py-2 w-40"
                    >
                        <option value="ONE_WAY">One Way</option>
                        <option value="ROUND_TRIP">Round Trip</option>
                        <option value="MULTI_CITY">Multi City</option>
                    </select>
                </SettingRow>

                <SettingRow
                    label="Auto-select One Way"
                    description="If round trip is selected but no return date, automatically search as one way"
                >
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.autoSelectTripType}
                            onChange={(e) => handleChange('autoSelectTripType', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </SettingRow>
            </div>

            {/* Fare Display Settings */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <span className="text-2xl mr-2">💰</span>
                    Fare Display Settings
                </h2>

                <SettingRow
                    label="Default Fare Display"
                    description="How fares are shown in search results"
                    enforceField="enforceFareDisplayMode"
                    enforceLabel="Force for all"
                >
                    <select
                        value={settings.fareDisplayMode}
                        onChange={(e) => handleChange('fareDisplayMode', e.target.value)}
                        className="border rounded-lg px-3 py-2 w-40"
                    >
                        <option value="TOTAL">Total Fare</option>
                        <option value="PER_PERSON">Per Person</option>
                    </select>
                </SettingRow>

                <SettingRow
                    label="Show Fare Breakdown"
                    description="Display detailed breakdown of base fare, taxes, and fees"
                >
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.showFareBreakdown}
                            onChange={(e) => handleChange('showFareBreakdown', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </SettingRow>
            </div>

            {/* Search Defaults */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <span className="text-2xl mr-2">🔍</span>
                    Search Defaults
                </h2>

                <SettingRow
                    label="Default Class of Travel"
                    description="Pre-selected class when opening flight search"
                    enforceField="enforceClassOfTravel"
                    enforceLabel="Force for all"
                >
                    <select
                        value={settings.defaultClassOfTravel}
                        onChange={(e) => handleChange('defaultClassOfTravel', parseInt(e.target.value))}
                        className="border rounded-lg px-3 py-2 w-40"
                    >
                        <option value={0}>Economy</option>
                        <option value={1}>Business</option>
                        <option value={2}>First Class</option>
                    </select>
                </SettingRow>

                <div className="py-4 border-b">
                    <div className="font-medium text-gray-800 mb-3">Default Passenger Count</div>
                    <div className="flex gap-4">
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Adults</label>
                            <select
                                value={settings.defaultAdults}
                                onChange={(e) => handleChange('defaultAdults', parseInt(e.target.value))}
                                className="border rounded-lg px-3 py-2 w-20"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Children</label>
                            <select
                                value={settings.defaultChildren}
                                onChange={(e) => handleChange('defaultChildren', parseInt(e.target.value))}
                                className="border rounded-lg px-3 py-2 w-20"
                            >
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Infants</label>
                            <select
                                value={settings.defaultInfants}
                                onChange={(e) => handleChange('defaultInfants', parseInt(e.target.value))}
                                className="border rounded-lg px-3 py-2 w-20"
                            >
                                {[0, 1, 2, 3, 4].map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <SettingRow
                    label="Results Per Page"
                    description="Default number of flight results to show"
                >
                    <select
                        value={settings.defaultResultsPerPage}
                        onChange={(e) => handleChange('defaultResultsPerPage', parseInt(e.target.value))}
                        className="border rounded-lg px-3 py-2 w-24"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </SettingRow>
            </div>

            {/* Agent Permissions */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <span className="text-2xl mr-2">🔒</span>
                    Agent Permissions
                </h2>

                <SettingRow
                    label="Allow Commission View"
                    description="Agents can see their commission amount in search results"
                >
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.allowCommissionView}
                            onChange={(e) => handleChange('allowCommissionView', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </SettingRow>

                <SettingRow
                    label="Allow Net Fare View"
                    description="Agents can see net fare (after deducting commission)"
                >
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.allowNetFareView}
                            onChange={(e) => handleChange('allowNetFareView', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </SettingRow>

                <SettingRow
                    label="Allow Block Ticket"
                    description="Agents can hold tickets without immediate payment"
                >
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.allowBlockTicket}
                            onChange={(e) => handleChange('allowBlockTicket', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </SettingRow>

                {settings.allowBlockTicket && (
                    <SettingRow
                        label="Max Block Ticket Duration"
                        description="Maximum hours a ticket can be held"
                    >
                        <select
                            value={settings.maxBlockTicketHours}
                            onChange={(e) => handleChange('maxBlockTicketHours', parseInt(e.target.value))}
                            className="border rounded-lg px-3 py-2 w-32"
                        >
                            <option value={6}>6 hours</option>
                            <option value={12}>12 hours</option>
                            <option value={24}>24 hours</option>
                            <option value={48}>48 hours</option>
                            <option value={72}>72 hours</option>
                        </select>
                    </SettingRow>
                )}
            </div>

            {/* Preview */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Preview</h2>
                <p className="text-gray-600 mb-4">This is how the agent will see the flight search by default:</p>

                <div className="bg-white rounded-lg p-4 border">
                    <div className="flex gap-4 mb-4">
                        <span className={`px-4 py-2 rounded-full ${settings.defaultTripType === 'ONE_WAY' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                            One Way
                        </span>
                        <span className={`px-4 py-2 rounded-full ${settings.defaultTripType === 'ROUND_TRIP' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                            Round Trip
                        </span>
                        <span className={`px-4 py-2 rounded-full ${settings.defaultTripType === 'MULTI_CITY' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                            Multi City
                        </span>
                    </div>

                    <div className="text-sm text-gray-500">
                        Passengers: {settings.defaultAdults} Adult{settings.defaultAdults > 1 ? 's' : ''}
                        {settings.defaultChildren > 0 && `, ${settings.defaultChildren} Child${settings.defaultChildren > 1 ? 'ren' : ''}`}
                        {settings.defaultInfants > 0 && `, ${settings.defaultInfants} Infant${settings.defaultInfants > 1 ? 's' : ''}`}
                        {' | '}
                        {['Economy', 'Business', 'First Class'][settings.defaultClassOfTravel]}
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 rounded">
                        <div className="text-lg font-bold text-blue-600">
                            {settings.fareDisplayMode === 'TOTAL' ? '₹12,500' : '₹4,167'}
                        </div>
                        <div className="text-xs text-gray-500">
                            {settings.fareDisplayMode === 'TOTAL' ? 'Total for all passengers' : 'Per person'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentDefaultSettings;
