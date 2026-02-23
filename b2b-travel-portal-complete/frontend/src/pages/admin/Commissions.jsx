import React, { useState, useEffect } from 'react';
import {
    CurrencyRupeeIcon,
    ChartBarIcon,
    PlusIcon,
    PencilIcon,
    ArrowDownTrayIcon,
    AdjustmentsHorizontalIcon,
    CalculatorIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    CheckCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const AdminCommissions = () => {
    const [activeTab, setActiveTab] = useState('airlines');
    const [selectedAirline, setSelectedAirline] = useState(null);
    const [showClassRules, setShowClassRules] = useState(false);
    const [showCalculator, setShowCalculator] = useState(false);
    const [calculatorResult, setCalculatorResult] = useState(null);

    // Airline Commission Data
    const airlineCommissions = [
        { code: '6E', name: 'IndiGo', supplier: 'Amadeus', defaultRate: 5.0, plbEnabled: true, plbRate: 1.0, hasClassRules: true, hasRouteRules: false, status: 'active' },
        { code: 'AI', name: 'Air India', supplier: 'Amadeus', defaultRate: 5.0, plbEnabled: true, plbRate: 1.5, hasClassRules: true, hasRouteRules: true, status: 'active' },
        { code: 'UK', name: 'Vistara', supplier: 'Amadeus', defaultRate: 4.0, plbEnabled: true, plbRate: 1.0, hasClassRules: true, hasRouteRules: false, status: 'active' },
        { code: 'SG', name: 'SpiceJet', supplier: 'Direct', defaultRate: 5.5, plbEnabled: false, plbRate: 0, hasClassRules: true, hasRouteRules: false, status: 'active' },
        { code: 'G8', name: 'Go First', supplier: 'TBO', defaultRate: 4.5, plbEnabled: false, plbRate: 0, hasClassRules: false, hasRouteRules: false, status: 'inactive' },
        { code: 'QP', name: 'Akasa Air', supplier: 'Direct', defaultRate: 5.0, plbEnabled: false, plbRate: 0, hasClassRules: true, hasRouteRules: false, status: 'active' },
        { code: 'I5', name: 'AirAsia India', supplier: 'TBO', defaultRate: 4.0, plbEnabled: false, plbRate: 0, hasClassRules: true, hasRouteRules: false, status: 'active' }
    ];

    // Class Rules by Airline
    const classRules = {
        '6E': [
            { id: 1, cabin: 'ECONOMY', classes: 'Y, B, M, H, K', rate: 7.0, yqRate: 0, travelType: 'Domestic' },
            { id: 2, cabin: 'ECONOMY', classes: 'L, Q, T, N, R, X, G, V', rate: 5.0, yqRate: 0, travelType: 'Domestic' },
            { id: 3, cabin: 'ECONOMY', classes: 'S, W (Saver)', rate: 3.0, yqRate: 0, travelType: 'Domestic' },
            { id: 4, cabin: 'ECONOMY', classes: 'All Classes', rate: 4.0, yqRate: 0, travelType: 'International' }
        ],
        'AI': [
            { id: 5, cabin: 'FIRST', classes: 'F, A, P', rate: 9.0, yqRate: 2.0, travelType: 'All' },
            { id: 6, cabin: 'BUSINESS', classes: 'J, C, D, I, Z', rate: 7.0, yqRate: 1.5, travelType: 'All' },
            { id: 7, cabin: 'PREMIUM_ECONOMY', classes: 'W, E', rate: 6.0, yqRate: 1.0, travelType: 'All' },
            { id: 8, cabin: 'ECONOMY', classes: 'Y, B, M, H, K', rate: 5.0, yqRate: 0.5, travelType: 'Domestic' },
            { id: 9, cabin: 'ECONOMY', classes: 'Y, B, M, H, K', rate: 4.0, yqRate: 0.5, travelType: 'International' },
            { id: 10, cabin: 'ECONOMY', classes: 'L, Q, T, N, R, X, G, V', rate: 3.0, yqRate: 0, travelType: 'All' }
        ],
        'UK': [
            { id: 11, cabin: 'BUSINESS', classes: 'J, C, D, I, Z', rate: 7.5, yqRate: 1.5, travelType: 'All' },
            { id: 12, cabin: 'PREMIUM_ECONOMY', classes: 'W, P, E', rate: 5.5, yqRate: 1.0, travelType: 'All' },
            { id: 13, cabin: 'ECONOMY', classes: 'Y, B, M, H, K', rate: 5.0, yqRate: 0.5, travelType: 'All' },
            { id: 14, cabin: 'ECONOMY', classes: 'L, Q, T, N, R, V, S', rate: 3.5, yqRate: 0, travelType: 'All' }
        ]
    };

    // Route-specific rules
    const routeRules = [
        { id: 1, airline: 'AI', origin: 'DEL', destination: 'BOM', cabin: 'All', rate: 6.0, yqRate: 1.0, type: 'Domestic' },
        { id: 2, airline: 'AI', origin: 'DEL', destination: 'LHR', cabin: 'Business', rate: 8.0, yqRate: 2.0, type: 'International' },
        { id: 3, airline: 'AI', origin: 'BOM', destination: 'JFK', cabin: 'All', rate: 5.0, yqRate: 1.5, type: 'International' }
    ];

    // Summary stats
    const stats = {
        totalCommission: 850000,
        avgRate: 5.2,
        topAirline: '6E',
        activeAirlines: 6
    };

    const getCabinColor = (cabin) => {
        switch (cabin) {
            case 'FIRST': return 'bg-purple-100 text-purple-800';
            case 'BUSINESS': return 'bg-blue-100 text-blue-800';
            case 'PREMIUM_ECONOMY': return 'bg-indigo-100 text-indigo-800';
            case 'ECONOMY': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleCalculate = () => {
        // Mock calculation result
        setCalculatorResult({
            ruleApplied: 'CLASS_SPECIFIC',
            baseFareCommission: 350,
            yqCommission: 50,
            totalCommission: 400,
            plbAmount: 50,
            agentShare: 280,
            platformShare: 170,
            breakdown: [
                { component: 'Base Fare (5%)', amount: 350 },
                { component: 'YQ Commission (1%)', amount: 50 },
                { component: 'PLB Bonus (1%)', amount: 50 }
            ]
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Commission Management</h1>
                            <p className="text-gray-600">Configure airline & class-level commission rules</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCalculator(true)}
                                className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50"
                            >
                                <CalculatorIcon className="w-5 h-5" />
                                Calculator
                            </button>
                            <button className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50">
                                <ArrowDownTrayIcon className="w-5 h-5" />
                                Export
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700">
                                <PlusIcon className="w-5 h-5" />
                                Add Airline
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Total Commission (MTD)</div>
                        <div className="text-2xl font-bold mt-1">₹{(stats.totalCommission/100000).toFixed(1)}L</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Avg. Commission Rate</div>
                        <div className="text-2xl font-bold mt-1">{stats.avgRate}%</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Top Performing Airline</div>
                        <div className="text-2xl font-bold mt-1">{stats.topAirline}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Active Airlines</div>
                        <div className="text-2xl font-bold mt-1">{stats.activeAirlines}</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm mb-6">
                    <div className="flex border-b">
                        {[
                            { key: 'airlines', label: 'Airline Commissions' },
                            { key: 'routes', label: 'Route Rules' },
                            { key: 'deals', label: 'Special Deals' },
                            { key: 'agents', label: 'Agent Overrides' }
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-6 py-4 text-sm font-medium ${
                                    activeTab === tab.key
                                        ? 'border-b-2 border-blue-600 text-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Airline Commissions Tab */}
                {activeTab === 'airlines' && (
                    <div className="space-y-4">
                        {airlineCommissions.map((airline) => (
                            <div key={airline.code} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div
                                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                                    onClick={() => {
                                        setSelectedAirline(selectedAirline === airline.code ? null : airline.code);
                                        setShowClassRules(true);
                                    }}
                                >
                                    <div className="flex items-center gap-4">
                                        {selectedAirline === airline.code ?
                                            <ChevronDownIcon className="w-5 h-5 text-gray-400" /> :
                                            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                                        }
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                            {airline.code}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{airline.name}</div>
                                            <div className="text-sm text-gray-500">Supplier: {airline.supplier}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">{airline.defaultRate}%</div>
                                            <div className="text-xs text-gray-500">Default Rate</div>
                                        </div>

                                        {airline.plbEnabled && (
                                            <div className="text-center">
                                                <div className="text-lg font-semibold text-green-600">+{airline.plbRate}%</div>
                                                <div className="text-xs text-gray-500">PLB Bonus</div>
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            {airline.hasClassRules && (
                                                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                                    Class Rules
                                                </span>
                                            )}
                                            {airline.hasRouteRules && (
                                                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                                                    Route Rules
                                                </span>
                                            )}
                                        </div>

                                        <span className={`px-3 py-1 rounded-full text-sm ${
                                            airline.status === 'active'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {airline.status === 'active' ? 'Active' : 'Inactive'}
                                        </span>

                                        <button
                                            onClick={(e) => { e.stopPropagation(); }}
                                            className="p-2 hover:bg-gray-100 rounded-lg"
                                        >
                                            <PencilIcon className="w-4 h-4 text-gray-500" />
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded Class Rules */}
                                {selectedAirline === airline.code && classRules[airline.code] && (
                                    <div className="border-t bg-gray-50 p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-medium text-gray-700">Class of Service Commission Rules</h4>
                                            <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                                <PlusIcon className="w-4 h-4" />
                                                Add Rule
                                            </button>
                                        </div>
                                        <table className="w-full bg-white rounded-lg overflow-hidden">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Cabin Class</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Fare Classes (RBD)</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Travel Type</th>
                                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Base Comm.</th>
                                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">YQ Comm.</th>
                                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {classRules[airline.code].map((rule) => (
                                                    <tr key={rule.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getCabinColor(rule.cabin)}`}>
                                                                {rule.cabin.replace('_', ' ')}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm font-mono text-gray-700">{rule.classes}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-600">{rule.travelType}</td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span className="font-bold text-blue-600">{rule.rate}%</span>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            {rule.yqRate > 0 ? (
                                                                <span className="font-medium text-green-600">+{rule.yqRate}%</span>
                                                            ) : (
                                                                <span className="text-gray-400">-</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <button className="p-1 hover:bg-gray-100 rounded">
                                                                <PencilIcon className="w-4 h-4 text-gray-400" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Route Rules Tab */}
                {activeTab === 'routes' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h3 className="font-semibold">Route-Specific Commission Rules</h3>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2">
                                <PlusIcon className="w-4 h-4" />
                                Add Route Rule
                            </button>
                        </div>
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Airline</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Route</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Cabin</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Type</th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Base Comm.</th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">YQ Comm.</th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {routeRules.map((rule) => (
                                    <tr key={rule.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <span className="font-medium">{rule.airline}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                                                {rule.origin} → {rule.destination}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{rule.cabin}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                rule.type === 'Domestic' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                            }`}>
                                                {rule.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center font-bold text-blue-600">{rule.rate}%</td>
                                        <td className="px-4 py-3 text-center text-green-600">+{rule.yqRate}%</td>
                                        <td className="px-4 py-3 text-center">
                                            <button className="p-1 hover:bg-gray-100 rounded">
                                                <PencilIcon className="w-4 h-4 text-gray-500" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Special Deals Tab */}
                {activeTab === 'deals' && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-lg">Special Commission Deals</h3>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2">
                                <PlusIcon className="w-4 h-4" />
                                Create Deal
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="border rounded-lg p-4 bg-gradient-to-br from-orange-50 to-yellow-50">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Active</span>
                                        <h4 className="font-semibold mt-2">Diwali Bonus</h4>
                                        <p className="text-sm text-gray-500">Oct 15 - Nov 15, 2024</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-orange-600">+1%</div>
                                        <div className="text-xs text-gray-500">Additional</div>
                                    </div>
                                </div>
                                <div className="mt-3 text-sm text-gray-600">
                                    Airlines: 6E, AI, UK • Economy Class
                                </div>
                            </div>
                            <div className="border rounded-lg p-4 bg-gray-50 opacity-60">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">Expired</span>
                                        <h4 className="font-semibold mt-2">Summer Special</h4>
                                        <p className="text-sm text-gray-500">Apr 1 - Jun 30, 2024</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-gray-500">+₹100</div>
                                        <div className="text-xs text-gray-500">Flat</div>
                                    </div>
                                </div>
                                <div className="mt-3 text-sm text-gray-600">
                                    All Airlines • All Classes
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Agent Overrides Tab */}
                {activeTab === 'agents' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h3 className="font-semibold">Agent Commission Overrides</h3>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2">
                                <PlusIcon className="w-4 h-4" />
                                Add Override
                            </button>
                        </div>
                        <div className="p-8 text-center text-gray-500">
                            <AdjustmentsHorizontalIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No agent-specific overrides configured</p>
                            <p className="text-sm">Create custom commission rates for specific agents</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Commission Calculator Modal */}
            {showCalculator && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h3 className="font-semibold text-lg">Commission Calculator</h3>
                            <button
                                onClick={() => { setShowCalculator(false); setCalculatorResult(null); }}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Airline</label>
                                    <select className="w-full border rounded-lg px-3 py-2">
                                        <option>6E - IndiGo</option>
                                        <option>AI - Air India</option>
                                        <option>UK - Vistara</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cabin Class</label>
                                    <select className="w-full border rounded-lg px-3 py-2">
                                        <option>Economy</option>
                                        <option>Premium Economy</option>
                                        <option>Business</option>
                                        <option>First</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fare Class (RBD)</label>
                                    <input type="text" placeholder="e.g., Y, B, M" className="w-full border rounded-lg px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Travel Type</label>
                                    <select className="w-full border rounded-lg px-3 py-2">
                                        <option>Domestic</option>
                                        <option>International</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="Origin" className="w-1/2 border rounded-lg px-3 py-2" />
                                        <input type="text" placeholder="Destination" className="w-1/2 border rounded-lg px-3 py-2" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Base Fare (₹)</label>
                                    <input type="number" placeholder="7000" defaultValue={7000} className="w-full border rounded-lg px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">YQ Amount (₹)</label>
                                    <input type="number" placeholder="500" defaultValue={500} className="w-full border rounded-lg px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Fare (₹)</label>
                                    <input type="number" placeholder="8500" defaultValue={8500} className="w-full border rounded-lg px-3 py-2" />
                                </div>
                            </div>

                            <button
                                onClick={handleCalculate}
                                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                            >
                                Calculate Commission
                            </button>

                            {calculatorResult && (
                                <div className="mt-6 border-t pt-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                        <span className="font-medium text-green-700">Rule Applied: {calculatorResult.ruleApplied}</span>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                        {calculatorResult.breakdown.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-sm">
                                                <span className="text-gray-600">{item.component}</span>
                                                <span className="font-medium">₹{item.amount}</span>
                                            </div>
                                        ))}
                                        <div className="border-t pt-3 flex justify-between font-semibold">
                                            <span>Total Supplier Commission</span>
                                            <span className="text-blue-600">₹{calculatorResult.totalCommission + calculatorResult.plbAmount}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div className="bg-green-50 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-bold text-green-600">₹{calculatorResult.agentShare}</div>
                                            <div className="text-sm text-green-700">Agent Share (60%)</div>
                                        </div>
                                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-bold text-blue-600">₹{calculatorResult.platformShare}</div>
                                            <div className="text-sm text-blue-700">Platform Share (40%)</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCommissions;
