/**
 * Integration Hub - Comprehensive API Integration Management
 * Supports REST, SOAP, GraphQL, gRPC, WebSocket, and Custom APIs
 */

import React, { useState } from 'react';
import {
    ServerIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    CodeBracketIcon,
    DocumentTextIcon,
    CloudArrowUpIcon,
    LinkIcon,
    BoltIcon,
    Cog6ToothIcon,
    ChartBarIcon,
    TrashIcon,
    PencilIcon,
    PlayIcon,
    StopIcon,
    ClipboardDocumentIcon,
    ArrowDownTrayIcon,
    GlobeAltIcon,
    ShieldCheckIcon,
    ClockIcon,
    BeakerIcon
} from '@heroicons/react/24/outline';

const IntegrationHub = () => {
    const [activeTab, setActiveTab] = useState('integrations');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedIntegration, setSelectedIntegration] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    // Mock data for integrations
    const [integrations] = useState([
        {
            id: 'int_1',
            name: 'Amadeus GDS',
            description: 'Global Distribution System for flights',
            apiType: 'REST',
            baseUrl: 'https://api.amadeus.com/v2',
            authMethod: 'oauth2',
            status: 'active',
            health: 'healthy',
            category: 'flights',
            stats: { totalRequests: 15420, successRate: 99.2, avgResponseTime: 234 }
        },
        {
            id: 'int_2',
            name: 'Sabre API',
            description: 'Travel booking and management',
            apiType: 'SOAP',
            baseUrl: 'https://webservices.sabre.com',
            authMethod: 'basic_auth',
            status: 'active',
            health: 'healthy',
            category: 'flights',
            stats: { totalRequests: 8320, successRate: 98.8, avgResponseTime: 312 }
        },
        {
            id: 'int_3',
            name: 'Booking.com',
            description: 'Hotel inventory and booking',
            apiType: 'GraphQL',
            baseUrl: 'https://api.booking.com/graphql',
            authMethod: 'api_key',
            status: 'active',
            health: 'warning',
            category: 'hotels',
            stats: { totalRequests: 5640, successRate: 97.5, avgResponseTime: 456 }
        },
        {
            id: 'int_4',
            name: 'Payment Gateway',
            description: 'Razorpay payment processing',
            apiType: 'REST',
            baseUrl: 'https://api.razorpay.com/v1',
            authMethod: 'basic_auth',
            status: 'active',
            health: 'healthy',
            category: 'payments',
            stats: { totalRequests: 3210, successRate: 99.9, avgResponseTime: 145 }
        },
        {
            id: 'int_5',
            name: 'SMS Gateway',
            description: 'Twilio SMS service',
            apiType: 'REST',
            baseUrl: 'https://api.twilio.com/2010-04-01',
            authMethod: 'basic_auth',
            status: 'inactive',
            health: 'unknown',
            category: 'notifications',
            stats: { totalRequests: 0, successRate: 0, avgResponseTime: 0 }
        },
        {
            id: 'int_6',
            name: 'Real-time Updates',
            description: 'WebSocket for live updates',
            apiType: 'WebSocket',
            baseUrl: 'wss://realtime.travelportal.com',
            authMethod: 'jwt',
            status: 'active',
            health: 'healthy',
            category: 'realtime',
            stats: { totalRequests: 45000, successRate: 99.8, avgResponseTime: 12 }
        }
    ]);

    const apiTypes = [
        { value: 'REST', label: 'REST API', icon: '🔗', color: 'blue' },
        { value: 'SOAP', label: 'SOAP/XML', icon: '📄', color: 'purple' },
        { value: 'GraphQL', label: 'GraphQL', icon: '◈', color: 'pink' },
        { value: 'gRPC', label: 'gRPC', icon: '⚡', color: 'orange' },
        { value: 'WebSocket', label: 'WebSocket', icon: '🔌', color: 'green' },
        { value: 'Custom', label: 'Custom', icon: '⚙️', color: 'gray' }
    ];

    const authMethods = [
        { value: 'none', label: 'No Authentication' },
        { value: 'api_key', label: 'API Key' },
        { value: 'bearer_token', label: 'Bearer Token' },
        { value: 'basic_auth', label: 'Basic Auth' },
        { value: 'oauth2', label: 'OAuth 2.0' },
        { value: 'jwt', label: 'JWT' },
        { value: 'custom_header', label: 'Custom Header' },
        { value: 'signature', label: 'Request Signature' }
    ];

    const categories = [
        { value: 'flights', label: 'Flights', count: 2 },
        { value: 'hotels', label: 'Hotels', count: 1 },
        { value: 'payments', label: 'Payments', count: 1 },
        { value: 'notifications', label: 'Notifications', count: 1 },
        { value: 'realtime', label: 'Real-time', count: 1 }
    ];

    const filteredIntegrations = integrations.filter(int => {
        const matchesSearch = int.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            int.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || int.apiType === filterType;
        const matchesStatus = filterStatus === 'all' || int.status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

    const getHealthBadge = (health) => {
        switch (health) {
            case 'healthy':
                return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"><CheckCircleIcon className="w-3 h-3" /> Healthy</span>;
            case 'warning':
                return <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full"><ExclamationTriangleIcon className="w-3 h-3" /> Warning</span>;
            case 'unhealthy':
                return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full"><XCircleIcon className="w-3 h-3" /> Unhealthy</span>;
            default:
                return <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Unknown</span>;
        }
    };

    const getTypeBadge = (type) => {
        const typeConfig = apiTypes.find(t => t.value === type) || apiTypes[5];
        const colors = {
            blue: 'bg-blue-100 text-blue-700',
            purple: 'bg-purple-100 text-purple-700',
            pink: 'bg-pink-100 text-pink-700',
            orange: 'bg-orange-100 text-orange-700',
            green: 'bg-green-100 text-green-700',
            gray: 'bg-gray-100 text-gray-700'
        };
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${colors[typeConfig.color]}`}>
                {typeConfig.icon} {type}
            </span>
        );
    };

    const renderIntegrationCard = (integration) => (
        <div key={integration.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        integration.status === 'active' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                        <ServerIcon className={`w-6 h-6 ${
                            integration.status === 'active' ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                        <p className="text-sm text-gray-500">{integration.description}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {integration.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Active
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            Inactive
                        </span>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {getTypeBadge(integration.apiType)}
                {getHealthBadge(integration.health)}
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                    {integration.category}
                </span>
            </div>

            <div className="text-xs text-gray-500 mb-4 font-mono bg-gray-50 px-3 py-2 rounded-lg truncate">
                {integration.baseUrl}
            </div>

            {integration.status === 'active' && (
                <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">{integration.stats.totalRequests.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Total Requests</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold text-green-600">{integration.stats.successRate}%</p>
                        <p className="text-xs text-gray-500">Success Rate</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold text-blue-600">{integration.stats.avgResponseTime}ms</p>
                        <p className="text-xs text-gray-500">Avg Response</p>
                    </div>
                </div>
            )}

            <div className="flex items-center gap-2 pt-4 border-t">
                <button
                    onClick={() => setSelectedIntegration(integration)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                    <Cog6ToothIcon className="w-4 h-4" /> Configure
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">
                    <BeakerIcon className="w-4 h-4" /> Test
                </button>
                <button className="flex items-center justify-center p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                    <ChartBarIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );

    const renderCreateModal = () => (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">Create New Integration</h2>
                        <button
                            onClick={() => setShowCreateModal(false)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <XCircleIcon className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[70vh]">
                    {/* Quick Start Options */}
                    <div className="mb-8">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">Quick Start - Choose API Type</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {apiTypes.map(type => (
                                <button
                                    key={type.value}
                                    className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition text-center"
                                >
                                    <span className="text-3xl mb-2 block">{type.icon}</span>
                                    <span className="font-medium text-gray-900">{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Import Options */}
                    <div className="mb-8">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">Or Import from Specification</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                                <CloudArrowUpIcon className="w-8 h-8 text-blue-600" />
                                <div className="text-left">
                                    <p className="font-medium text-gray-900">OpenAPI/Swagger</p>
                                    <p className="text-sm text-gray-500">Import from .json or .yaml</p>
                                </div>
                            </button>
                            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                                <DocumentTextIcon className="w-8 h-8 text-purple-600" />
                                <div className="text-left">
                                    <p className="font-medium text-gray-900">WSDL</p>
                                    <p className="text-sm text-gray-500">Import SOAP service definition</p>
                                </div>
                            </button>
                            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                                <CodeBracketIcon className="w-8 h-8 text-pink-600" />
                                <div className="text-left">
                                    <p className="font-medium text-gray-900">GraphQL Schema</p>
                                    <p className="text-sm text-gray-500">Import .graphql schema</p>
                                </div>
                            </button>
                            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                                <LinkIcon className="w-8 h-8 text-green-600" />
                                <div className="text-left">
                                    <p className="font-medium text-gray-900">From URL</p>
                                    <p className="text-sm text-gray-500">Auto-detect from endpoint</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Manual Configuration Form */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-medium text-gray-700">Manual Configuration</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Integration Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Amadeus Flight API"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">Select category</option>
                                    {categories.map(cat => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Base URL</label>
                            <input
                                type="url"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                                placeholder="https://api.example.com/v1"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Authentication Method</label>
                                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    {authMethods.map(auth => (
                                        <option key={auth.value} value={auth.value}>{auth.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data Format</label>
                                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="JSON">JSON</option>
                                    <option value="XML">XML</option>
                                    <option value="Form-Data">Form Data</option>
                                    <option value="Protocol-Buffers">Protocol Buffers</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Describe what this integration does..."
                            />
                        </div>

                        {/* Advanced Settings */}
                        <details className="border border-gray-200 rounded-lg">
                            <summary className="px-4 py-3 cursor-pointer font-medium text-gray-700 hover:bg-gray-50">
                                Advanced Settings
                            </summary>
                            <div className="p-4 border-t space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Timeout (ms)</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                            defaultValue={30000}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Retries</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                            defaultValue={3}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Rate Limit (req/min)</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                            defaultValue={60}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Custom Headers (JSON)</label>
                                    <textarea
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                                        placeholder='{"X-Custom-Header": "value"}'
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" className="rounded text-blue-600" />
                                        <span className="text-sm text-gray-700">Enable sandbox mode</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" className="rounded text-blue-600" />
                                        <span className="text-sm text-gray-700">Enable request logging</span>
                                    </label>
                                </div>
                            </div>
                        </details>
                    </div>
                </div>

                <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={() => setShowCreateModal(false)}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition"
                    >
                        Cancel
                    </button>
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Create Integration
                    </button>
                </div>
            </div>
        </div>
    );

    const renderConfigurationPanel = () => (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
                <div className="p-6 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <ServerIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{selectedIntegration?.name}</h2>
                            <p className="text-sm text-gray-500">{selectedIntegration?.baseUrl}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSelectedIntegration(null)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <XCircleIcon className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="flex h-[70vh]">
                    {/* Sidebar */}
                    <div className="w-48 border-r bg-gray-50 p-4">
                        <nav className="space-y-1">
                            {['Overview', 'Endpoints', 'Authentication', 'Mappings', 'Logs', 'Settings'].map(tab => (
                                <button
                                    key={tab}
                                    className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-white transition"
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        <div className="space-y-6">
                            {/* Endpoints Section */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-900">API Endpoints</h3>
                                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
                                        <PlusIcon className="w-4 h-4" /> Add Endpoint
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {[
                                        { method: 'POST', path: '/search', name: 'Search Flights' },
                                        { method: 'POST', path: '/book', name: 'Create Booking' },
                                        { method: 'GET', path: '/booking/{id}', name: 'Get Booking' },
                                        { method: 'POST', path: '/cancel', name: 'Cancel Booking' },
                                        { method: 'GET', path: '/pnr/{pnr}', name: 'Retrieve PNR' }
                                    ].map((endpoint, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                            <span className={`px-2 py-1 text-xs font-bold rounded ${
                                                endpoint.method === 'GET' ? 'bg-green-100 text-green-700' :
                                                endpoint.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                                                endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {endpoint.method}
                                            </span>
                                            <code className="text-sm text-gray-600 flex-1">{endpoint.path}</code>
                                            <span className="text-sm text-gray-500">{endpoint.name}</span>
                                            <div className="flex gap-2">
                                                <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                                                    <PlayIcon className="w-4 h-4" />
                                                </button>
                                                <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Data Mapping */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4">Data Mapping</h3>
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Request Mapping</h4>
                                            <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono text-green-400 overflow-x-auto">
                                                <pre>{`{
  "from": "{{origin}}",
  "to": "{{destination}}",
  "date": "{{departDate}}",
  "pax": {
    "adult": "{{adults}}",
    "child": "{{children}}"
  }
}`}</pre>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Response Mapping</h4>
                                            <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono text-green-400 overflow-x-auto">
                                                <pre>{`{
  "flights": "{{data.offers}}",
  "price": "{{data.price.total}}",
  "currency": "{{data.price.currency}}",
  "segments": "{{data.itineraries}}"
}`}</pre>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Generate Code */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4">Generate Client Code</h3>
                                <div className="flex gap-2 mb-4">
                                    {['JavaScript', 'Python', 'PHP', 'Java', 'C#', 'Go'].map(lang => (
                                        <button
                                            key={lang}
                                            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                                        >
                                            {lang}
                                        </button>
                                    ))}
                                </div>
                                <div className="bg-gray-900 rounded-lg p-4 relative">
                                    <button className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded">
                                        <ClipboardDocumentIcon className="w-4 h-4" />
                                    </button>
                                    <pre className="text-sm font-mono text-green-400 overflow-x-auto">{`// Amadeus GDS API Client
const axios = require('axios');

const client = axios.create({
    baseURL: 'https://api.amadeus.com/v2',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
});

module.exports = client;`}</pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t bg-gray-50 flex justify-between">
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <TrashIcon className="w-4 h-4" /> Delete
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">
                            <ArrowDownTrayIcon className="w-4 h-4" /> Export Config
                        </button>
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Integration Hub</h1>
                <p className="text-gray-600 mt-1">Connect and manage APIs from any technology stack</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <ServerIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{integrations.length}</p>
                            <p className="text-sm text-gray-500">Total Integrations</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircleIcon className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{integrations.filter(i => i.status === 'active').length}</p>
                            <p className="text-sm text-gray-500">Active</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <BoltIcon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">77.5K</p>
                            <p className="text-sm text-gray-500">API Calls Today</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <ClockIcon className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">198ms</p>
                            <p className="text-sm text-gray-500">Avg Response Time</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-4 mb-6 border-b">
                {[
                    { key: 'integrations', label: 'Integrations', icon: ServerIcon },
                    { key: 'webhooks', label: 'Webhooks', icon: LinkIcon },
                    { key: 'logs', label: 'API Logs', icon: DocumentTextIcon },
                    { key: 'analytics', label: 'Analytics', icon: ChartBarIcon }
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition ${
                            activeTab === tab.key
                                ? 'text-blue-600 border-blue-600'
                                : 'text-gray-500 border-transparent hover:text-gray-700'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search integrations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Types</option>
                        {apiTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <PlusIcon className="w-5 h-5" /> Add Integration
                </button>
            </div>

            {/* Integration Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIntegrations.map(renderIntegrationCard)}
            </div>

            {/* Modals */}
            {showCreateModal && renderCreateModal()}
            {selectedIntegration && renderConfigurationPanel()}
        </div>
    );
};

export default IntegrationHub;
