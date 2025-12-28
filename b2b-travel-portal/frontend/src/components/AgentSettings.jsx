import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { agentApi } from '../services/api';

/**
 * Agent Settings Component
 * Allows agents to configure their search and display preferences
 */
const AgentSettings = () => {
    const navigate = useNavigate();
    const { agent, updateAgentPreferences } = useAuthStore();

    const [settings, setSettings] = useState({
        // Trip Type Settings
        defaultTripType: 'ONE_WAY',
        autoSelectTripType: true,

        // Fare Display Settings
        fareDisplayMode: 'TOTAL',
        showFareBreakdown: true,

        // Search Defaults
        defaultClassOfTravel: 0,
        defaultAdults: 1,
        defaultChildren: 0,
        defaultInfants: 0,

        // UI Preferences
        showCommission: true,
        showNetFare: false,
        autoExpandFirstResult: false,
        resultsPerPage: 20,

        // Booking Preferences
        autoHoldBooking: false,
        defaultGstEnabled: false,

        // Notifications
        emailNotifications: true,
        smsNotifications: true,
        whatsappNotifications: false
    });

    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState(null);

    useEffect(() => {
        // Load existing preferences
        if (agent?.preferences) {
            setSettings(prev => ({ ...prev, ...agent.preferences }));
        }
    }, [agent]);

    const handleChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage(null);

        try {
            await agentApi.updateProfile({ preferences: settings });
            if (updateAgentPreferences) {
                updateAgentPreferences(settings);
            }
            setSaveMessage({ type: 'success', text: 'Settings saved successfully!' });
        } catch (error) {
            setSaveMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
        } finally {
            setIsSaving(false);
        }
    };

    const SettingSection = ({ title, description, children }) => (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
            {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
            {children}
        </div>
    );

    const RadioOption = ({ name, value, currentValue, onChange, label, description }) => (
        <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${
            currentValue === value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
        }`}>
            <input
                type="radio"
                name={name}
                value={value}
                checked={currentValue === value}
                onChange={() => onChange(value)}
                className="mt-1 mr-3"
            />
            <div>
                <div className="font-medium">{label}</div>
                {description && <div className="text-sm text-gray-500">{description}</div>}
            </div>
        </label>
    );

    const ToggleSwitch = ({ label, description, checked, onChange }) => (
        <div className="flex items-center justify-between py-3 border-b last:border-0">
            <div>
                <div className="font-medium text-gray-700">{label}</div>
                {description && <div className="text-sm text-gray-500">{description}</div>}
            </div>
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    checked ? 'bg-blue-600' : 'bg-gray-300'
                }`}
            >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    checked ? 'translate-x-6' : 'translate-x-1'
                }`} />
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-800">
                            ← Back
                        </button>
                        <h1 className="text-xl font-bold text-gray-800">Agent Settings</h1>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Save Message */}
                {saveMessage && (
                    <div className={`mb-6 p-4 rounded-lg ${
                        saveMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                        {saveMessage.text}
                    </div>
                )}

                {/* Trip Type Settings */}
                <SettingSection
                    title="Default Trip Type"
                    description="Choose the default trip type when searching for flights. If not selected during search, this will be auto-applied."
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <RadioOption
                            name="defaultTripType"
                            value="ONE_WAY"
                            currentValue={settings.defaultTripType}
                            onChange={(v) => handleChange('defaultTripType', v)}
                            label="One Way"
                            description="Single direction flight"
                        />
                        <RadioOption
                            name="defaultTripType"
                            value="ROUND_TRIP"
                            currentValue={settings.defaultTripType}
                            onChange={(v) => handleChange('defaultTripType', v)}
                            label="Round Trip"
                            description="Return flight included"
                        />
                        <RadioOption
                            name="defaultTripType"
                            value="MULTI_CITY"
                            currentValue={settings.defaultTripType}
                            onChange={(v) => handleChange('defaultTripType', v)}
                            label="Multi City"
                            description="Multiple destinations"
                        />
                    </div>

                    <ToggleSwitch
                        label="Auto-select One Way for incomplete Round Trip"
                        description="If round trip is selected but return date is not provided, automatically search as one way"
                        checked={settings.autoSelectTripType}
                        onChange={(v) => handleChange('autoSelectTripType', v)}
                    />
                </SettingSection>

                {/* Fare Display Settings */}
                <SettingSection
                    title="Fare Display Preference"
                    description="Choose how flight fares are displayed in search results"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <RadioOption
                            name="fareDisplayMode"
                            value="TOTAL"
                            currentValue={settings.fareDisplayMode}
                            onChange={(v) => handleChange('fareDisplayMode', v)}
                            label="Total Fare"
                            description="Show combined fare for all passengers"
                        />
                        <RadioOption
                            name="fareDisplayMode"
                            value="PER_PERSON"
                            currentValue={settings.fareDisplayMode}
                            onChange={(v) => handleChange('fareDisplayMode', v)}
                            label="Per Person Fare"
                            description="Show fare per individual passenger"
                        />
                    </div>

                    <ToggleSwitch
                        label="Show Fare Breakdown"
                        description="Display detailed breakdown of base fare, taxes, and fees"
                        checked={settings.showFareBreakdown}
                        onChange={(v) => handleChange('showFareBreakdown', v)}
                    />
                </SettingSection>

                {/* Search Defaults */}
                <SettingSection
                    title="Search Defaults"
                    description="Default values for flight search"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Class of Travel</label>
                            <select
                                value={settings.defaultClassOfTravel}
                                onChange={(e) => handleChange('defaultClassOfTravel', parseInt(e.target.value))}
                                className="w-full border rounded-lg px-3 py-2"
                            >
                                <option value={0}>Economy</option>
                                <option value={1}>Business</option>
                                <option value={2}>First Class</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
                            <select
                                value={settings.defaultAdults}
                                onChange={(e) => handleChange('defaultAdults', parseInt(e.target.value))}
                                className="w-full border rounded-lg px-3 py-2"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
                            <select
                                value={settings.defaultChildren}
                                onChange={(e) => handleChange('defaultChildren', parseInt(e.target.value))}
                                className="w-full border rounded-lg px-3 py-2"
                            >
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Infants</label>
                            <select
                                value={settings.defaultInfants}
                                onChange={(e) => handleChange('defaultInfants', parseInt(e.target.value))}
                                className="w-full border rounded-lg px-3 py-2"
                            >
                                {[0, 1, 2, 3, 4].map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Results Per Page</label>
                        <select
                            value={settings.resultsPerPage}
                            onChange={(e) => handleChange('resultsPerPage', parseInt(e.target.value))}
                            className="w-48 border rounded-lg px-3 py-2"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </SettingSection>

                {/* Display Preferences */}
                <SettingSection
                    title="Display Preferences"
                    description="Customize how information is shown"
                >
                    <ToggleSwitch
                        label="Show Commission"
                        description="Display commission amount in search results"
                        checked={settings.showCommission}
                        onChange={(v) => handleChange('showCommission', v)}
                    />
                    <ToggleSwitch
                        label="Show Net Fare"
                        description="Display net fare (after commission) in results"
                        checked={settings.showNetFare}
                        onChange={(v) => handleChange('showNetFare', v)}
                    />
                    <ToggleSwitch
                        label="Auto-expand First Result"
                        description="Automatically expand the first flight in search results"
                        checked={settings.autoExpandFirstResult}
                        onChange={(v) => handleChange('autoExpandFirstResult', v)}
                    />
                </SettingSection>

                {/* Booking Preferences */}
                <SettingSection
                    title="Booking Preferences"
                    description="Default booking behavior"
                >
                    <ToggleSwitch
                        label="Auto Hold Booking"
                        description="Hold tickets instead of instant ticketing (where available)"
                        checked={settings.autoHoldBooking}
                        onChange={(v) => handleChange('autoHoldBooking', v)}
                    />
                    <ToggleSwitch
                        label="Enable GST by Default"
                        description="Pre-select GST details entry in booking form"
                        checked={settings.defaultGstEnabled}
                        onChange={(v) => handleChange('defaultGstEnabled', v)}
                    />
                </SettingSection>

                {/* Notification Preferences */}
                <SettingSection
                    title="Notification Preferences"
                    description="How you want to receive updates"
                >
                    <ToggleSwitch
                        label="Email Notifications"
                        description="Receive booking confirmations and updates via email"
                        checked={settings.emailNotifications}
                        onChange={(v) => handleChange('emailNotifications', v)}
                    />
                    <ToggleSwitch
                        label="SMS Notifications"
                        description="Receive booking alerts via SMS"
                        checked={settings.smsNotifications}
                        onChange={(v) => handleChange('smsNotifications', v)}
                    />
                    <ToggleSwitch
                        label="WhatsApp Notifications"
                        description="Receive updates on WhatsApp"
                        checked={settings.whatsappNotifications}
                        onChange={(v) => handleChange('whatsappNotifications', v)}
                    />
                </SettingSection>

                {/* Save Button (Mobile) */}
                <div className="md:hidden">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default AgentSettings;
