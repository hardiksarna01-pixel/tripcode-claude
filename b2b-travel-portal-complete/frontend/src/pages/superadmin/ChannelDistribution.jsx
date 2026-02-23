/**
 * Channel Distribution Management
 * Control which suppliers, products, and fare types are available to B2B vs B2C
 */

import React, { useState } from 'react';
import {
    BuildingOfficeIcon,
    UserGroupIcon,
    ServerIcon,
    AdjustmentsHorizontalIcon,
    CheckCircleIcon,
    XCircleIcon,
    BoltIcon,
    ChartBarIcon,
    CogIcon,
    ShieldCheckIcon,
    ClockIcon,
    ArrowsRightLeftIcon,
    FunnelIcon,
    ExclamationTriangleIcon,
    CheckIcon,
    XMarkIcon,
    PaperAirplaneIcon,
    BuildingOffice2Icon,
    TruckIcon,
    GlobeAltIcon,
    DocumentCheckIcon,
    ShieldExclamationIcon,
    CurrencyDollarIcon,
    SignalIcon,
    RocketLaunchIcon
} from '@heroicons/react/24/outline';

const ChannelDistribution = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    // Mock supplier data
    const [suppliers, setSuppliers] = useState([
        {
            id: 'amadeus',
            name: 'Amadeus GDS',
            type: 'flights',
            status: 'active',
            fareTypes: ['published', 'net', 'corporate', 'special', 'consolidator'],
            b2bEnabled: true,
            b2cEnabled: true,
            b2cRestrictedFareTypes: ['net', 'consolidator', 'special'],
            priority: 1,
            avgResponseTime: 450,
            successRate: 99.2
        },
        {
            id: 'sabre',
            name: 'Sabre GDS',
            type: 'flights',
            status: 'active',
            fareTypes: ['published', 'net', 'private', 'web', 'corporate'],
            b2bEnabled: true,
            b2cEnabled: true,
            b2cRestrictedFareTypes: ['net', 'private'],
            priority: 2,
            avgResponseTime: 380,
            successRate: 98.8
        },
        {
            id: 'galileo',
            name: 'Galileo/Travelport',
            type: 'flights',
            status: 'active',
            fareTypes: ['published', 'net', 'negotiated', 'corporate'],
            b2bEnabled: true,
            b2cEnabled: false,
            b2cRestrictedFareTypes: ['net', 'negotiated'],
            priority: 3,
            avgResponseTime: 520,
            successRate: 97.5
        },
        {
            id: 'mystifly',
            name: 'Mystifly LCC',
            type: 'flights',
            status: 'active',
            fareTypes: ['instant', 'revalidation', 'special'],
            b2bEnabled: true,
            b2cEnabled: true,
            b2cRestrictedFareTypes: ['special'],
            priority: 4,
            avgResponseTime: 280,
            successRate: 96.5
        },
        {
            id: 'tripjack',
            name: 'TripJack',
            type: 'flights',
            status: 'active',
            fareTypes: ['sme', 'retail', 'corporate', 'deal'],
            b2bEnabled: true,
            b2cEnabled: true,
            b2cRestrictedFareTypes: ['sme', 'deal'],
            priority: 5,
            avgResponseTime: 320,
            successRate: 98.2
        },
        {
            id: 'hotelbeds',
            name: 'Hotelbeds',
            type: 'hotels',
            status: 'active',
            fareTypes: ['net', 'package', 'freenight', 'earlybird'],
            b2bEnabled: true,
            b2cEnabled: true,
            b2cRestrictedFareTypes: ['net'],
            priority: 1,
            avgResponseTime: 650,
            successRate: 97.8
        },
        {
            id: 'booking_com',
            name: 'Booking.com',
            type: 'hotels',
            status: 'active',
            fareTypes: ['standard', 'genius', 'mobile', 'member'],
            b2bEnabled: false,
            b2cEnabled: true,
            b2cRestrictedFareTypes: [],
            priority: 2,
            avgResponseTime: 420,
            successRate: 99.5
        },
        {
            id: 'redbus',
            name: 'RedBus API',
            type: 'buses',
            status: 'active',
            fareTypes: ['standard', 'primo', 'business'],
            b2bEnabled: true,
            b2cEnabled: true,
            b2cRestrictedFareTypes: [],
            priority: 1,
            avgResponseTime: 180,
            successRate: 99.1
        }
    ]);

    const [b2cSettings, setB2cSettings] = useState({
        caching: { enabled: true, ttl: 300 },
        rateLimit: { enabled: true, requestsPerMinute: 60 },
        markup: { type: 'percentage', value: 2.5 }
    });

    const productIcons = {
        flights: PaperAirplaneIcon,
        hotels: BuildingOffice2Icon,
        buses: TruckIcon,
        holidays: GlobeAltIcon,
        visa: DocumentCheckIcon,
        insurance: ShieldExclamationIcon
    };

    const toggleSupplierChannel = (supplierId, channel) => {
        setSuppliers(prev => prev.map(s => {
            if (s.id === supplierId) {
                return {
                    ...s,
                    [channel === 'b2b' ? 'b2bEnabled' : 'b2cEnabled']: !s[channel === 'b2b' ? 'b2bEnabled' : 'b2cEnabled']
                };
            }
            return s;
        }));
    };

    const toggleFareTypeRestriction = (supplierId, fareType) => {
        setSuppliers(prev => prev.map(s => {
            if (s.id === supplierId) {
                const restricted = s.b2cRestrictedFareTypes.includes(fareType);
                return {
                    ...s,
                    b2cRestrictedFareTypes: restricted
                        ? s.b2cRestrictedFareTypes.filter(ft => ft !== fareType)
                        : [...s.b2cRestrictedFareTypes, fareType]
                };
            }
            return s;
        }));
    };

    const renderOverview = () => {
        const flightSuppliers = suppliers.filter(s => s.type === 'flights');
        const hotelSuppliers = suppliers.filter(s => s.type === 'hotels');
        const busSuppliers = suppliers.filter(s => s.type === 'buses');

        return (
            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm">Total Suppliers</p>
                                <p className="text-3xl font-bold mt-1">{suppliers.length}</p>
                            </div>
                            <ServerIcon className="w-12 h-12 text-blue-200" />
                        </div>
                        <div className="mt-4 pt-4 border-t border-blue-400/30">
                            <span className="text-blue-100 text-sm">Connected to TripCode API</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-indigo-100 text-sm">B2B Active</p>
                                <p className="text-3xl font-bold mt-1">{suppliers.filter(s => s.b2bEnabled).length}</p>
                            </div>
                            <BuildingOfficeIcon className="w-12 h-12 text-indigo-200" />
                        </div>
                        <div className="mt-4 pt-4 border-t border-indigo-400/30">
                            <span className="text-indigo-100 text-sm">All fare types available</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm">B2C Active</p>
                                <p className="text-3xl font-bold mt-1">{suppliers.filter(s => s.b2cEnabled).length}</p>
                            </div>
                            <UserGroupIcon className="w-12 h-12 text-purple-200" />
                        </div>
                        <div className="mt-4 pt-4 border-t border-purple-400/30">
                            <span className="text-purple-100 text-sm">
                                {suppliers.reduce((sum, s) => sum + s.b2cRestrictedFareTypes.length, 0)} fare types restricted
                            </span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm">Avg Response</p>
                                <p className="text-3xl font-bold mt-1">
                                    {Math.round(suppliers.reduce((sum, s) => sum + s.avgResponseTime, 0) / suppliers.length)}ms
                                </p>
                            </div>
                            <BoltIcon className="w-12 h-12 text-green-200" />
                        </div>
                        <div className="mt-4 pt-4 border-t border-green-400/30">
                            <span className="text-green-100 text-sm">
                                {(suppliers.reduce((sum, s) => sum + s.successRate, 0) / suppliers.length).toFixed(1)}% success rate
                            </span>
                        </div>
                    </div>
                </div>

                {/* Distribution Matrix */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900">Channel Distribution Matrix</h2>
                        <p className="text-gray-500 text-sm mt-1">Overview of suppliers across B2B and B2C channels</p>
                    </div>

                    <div className="p-6">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">Product</th>
                                    <th className="text-center py-3 px-4 font-medium text-gray-600">Suppliers</th>
                                    <th className="text-center py-3 px-4 font-medium text-gray-600">
                                        <div className="flex items-center justify-center gap-2">
                                            <BuildingOfficeIcon className="w-4 h-4" />
                                            B2B
                                        </div>
                                    </th>
                                    <th className="text-center py-3 px-4 font-medium text-gray-600">
                                        <div className="flex items-center justify-center gap-2">
                                            <UserGroupIcon className="w-4 h-4" />
                                            B2C
                                        </div>
                                    </th>
                                    <th className="text-center py-3 px-4 font-medium text-gray-600">B2C Restricted Fares</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { type: 'flights', name: 'Flights', suppliers: flightSuppliers },
                                    { type: 'hotels', name: 'Hotels', suppliers: hotelSuppliers },
                                    { type: 'buses', name: 'Buses', suppliers: busSuppliers }
                                ].map(product => {
                                    const ProductIcon = productIcons[product.type];
                                    const b2bCount = product.suppliers.filter(s => s.b2bEnabled).length;
                                    const b2cCount = product.suppliers.filter(s => s.b2cEnabled).length;
                                    const restrictedFares = product.suppliers.reduce((sum, s) => sum + s.b2cRestrictedFareTypes.length, 0);

                                    return (
                                        <tr key={product.type} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <ProductIcon className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <span className="font-medium text-gray-900">{product.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className="text-gray-900 font-medium">{product.suppliers.length}</span>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                                                    <CheckCircleIcon className="w-4 h-4" />
                                                    {b2bCount} active
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                                                    <CheckCircleIcon className="w-4 h-4" />
                                                    {b2cCount} active
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                                                    <ShieldCheckIcon className="w-4 h-4" />
                                                    {restrictedFares} hidden
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-6">
                    <button
                        onClick={() => setActiveTab('suppliers')}
                        className="bg-white rounded-xl border border-gray-200 p-6 text-left hover:shadow-lg hover:border-blue-300 transition group"
                    >
                        <ServerIcon className="w-10 h-10 text-blue-500 mb-4" />
                        <h3 className="font-bold text-gray-900 group-hover:text-blue-600">Manage Suppliers</h3>
                        <p className="text-gray-500 text-sm mt-1">Enable/disable suppliers for each channel</p>
                    </button>

                    <button
                        onClick={() => setActiveTab('fareTypes')}
                        className="bg-white rounded-xl border border-gray-200 p-6 text-left hover:shadow-lg hover:border-purple-300 transition group"
                    >
                        <FunnelIcon className="w-10 h-10 text-purple-500 mb-4" />
                        <h3 className="font-bold text-gray-900 group-hover:text-purple-600">Fare Type Restrictions</h3>
                        <p className="text-gray-500 text-sm mt-1">Control which fare types appear in B2C</p>
                    </button>

                    <button
                        onClick={() => setActiveTab('optimization')}
                        className="bg-white rounded-xl border border-gray-200 p-6 text-left hover:shadow-lg hover:border-green-300 transition group"
                    >
                        <RocketLaunchIcon className="w-10 h-10 text-green-500 mb-4" />
                        <h3 className="font-bold text-gray-900 group-hover:text-green-600">B2C Optimization</h3>
                        <p className="text-gray-500 text-sm mt-1">Cache, rate limits, and performance tuning</p>
                    </button>
                </div>
            </div>
        );
    };

    const renderSuppliers = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Supplier Management</h2>
                    <p className="text-gray-500 text-sm">Control which suppliers serve B2B and B2C channels</p>
                </div>
                <div className="flex gap-2">
                    <select className="px-4 py-2 border border-gray-300 rounded-lg">
                        <option value="">All Products</option>
                        <option value="flights">Flights</option>
                        <option value="hotels">Hotels</option>
                        <option value="buses">Buses</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left py-4 px-6 font-medium text-gray-600">Supplier</th>
                            <th className="text-center py-4 px-6 font-medium text-gray-600">Type</th>
                            <th className="text-center py-4 px-6 font-medium text-gray-600">Fare Types</th>
                            <th className="text-center py-4 px-6 font-medium text-gray-600">
                                <div className="flex items-center justify-center gap-2">
                                    <BuildingOfficeIcon className="w-4 h-4 text-indigo-600" />
                                    B2B
                                </div>
                            </th>
                            <th className="text-center py-4 px-6 font-medium text-gray-600">
                                <div className="flex items-center justify-center gap-2">
                                    <UserGroupIcon className="w-4 h-4 text-purple-600" />
                                    B2C
                                </div>
                            </th>
                            <th className="text-center py-4 px-6 font-medium text-gray-600">Performance</th>
                            <th className="text-center py-4 px-6 font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.map(supplier => {
                            const ProductIcon = productIcons[supplier.type] || ServerIcon;
                            return (
                                <tr key={supplier.id} className="border-t border-gray-100 hover:bg-gray-50">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <ProductIcon className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{supplier.name}</p>
                                                <p className="text-xs text-gray-500">ID: {supplier.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full capitalize">
                                            {supplier.type}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <span className="text-gray-600">{supplier.fareTypes.length} types</span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <button
                                            onClick={() => toggleSupplierChannel(supplier.id, 'b2b')}
                                            className={`w-16 h-8 rounded-full relative transition ${
                                                supplier.b2bEnabled ? 'bg-indigo-600' : 'bg-gray-300'
                                            }`}
                                        >
                                            <span
                                                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${
                                                    supplier.b2bEnabled ? 'right-1' : 'left-1'
                                                }`}
                                            />
                                        </button>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <button
                                            onClick={() => toggleSupplierChannel(supplier.id, 'b2c')}
                                            className={`w-16 h-8 rounded-full relative transition ${
                                                supplier.b2cEnabled ? 'bg-purple-600' : 'bg-gray-300'
                                            }`}
                                        >
                                            <span
                                                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${
                                                    supplier.b2cEnabled ? 'right-1' : 'left-1'
                                                }`}
                                            />
                                        </button>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <div className="flex items-center justify-center gap-4 text-sm">
                                            <span className="text-gray-500">{supplier.avgResponseTime}ms</span>
                                            <span className="text-green-600">{supplier.successRate}%</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <button
                                            onClick={() => setSelectedSupplier(supplier)}
                                            className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-sm"
                                        >
                                            Configure
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderFareTypes = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Fare Type Restrictions</h2>
                    <p className="text-gray-500 text-sm">Control which fare types are visible to B2C customers</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                        <span className="text-gray-600">Available in B2C</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                        <span className="text-gray-600">Hidden from B2C</span>
                    </div>
                </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                        <p className="font-medium text-yellow-800">Fare Type Restriction Guidelines</p>
                        <p className="text-yellow-700 text-sm mt-1">
                            Net fares, consolidator fares, and special agent fares should be hidden from B2C to protect agent margins.
                            Published and retail fares can be shown to B2C customers.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {suppliers.map(supplier => (
                    <div key={supplier.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border">
                                    {React.createElement(productIcons[supplier.type] || ServerIcon, {
                                        className: 'w-5 h-5 text-gray-600'
                                    })}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{supplier.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{supplier.type}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                    supplier.b2cEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                }`}>
                                    {supplier.b2cEnabled ? 'B2C Enabled' : 'B2C Disabled'}
                                </span>
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="flex flex-wrap gap-3">
                                {supplier.fareTypes.map(fareType => {
                                    const isRestricted = supplier.b2cRestrictedFareTypes.includes(fareType);
                                    return (
                                        <button
                                            key={fareType}
                                            onClick={() => toggleFareTypeRestriction(supplier.id, fareType)}
                                            disabled={!supplier.b2cEnabled}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition ${
                                                !supplier.b2cEnabled
                                                    ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                                                    : isRestricted
                                                    ? 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100'
                                                    : 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100'
                                            }`}
                                        >
                                            {isRestricted ? (
                                                <XCircleIcon className="w-4 h-4" />
                                            ) : (
                                                <CheckCircleIcon className="w-4 h-4" />
                                            )}
                                            <span className="capitalize font-medium">{fareType}</span>
                                            <span className="text-xs opacity-75">
                                                {isRestricted ? 'B2B Only' : 'All'}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderOptimization = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-bold text-gray-900">B2C Optimization Settings</h2>
                <p className="text-gray-500 text-sm">Configure caching, rate limiting, and performance settings for B2C</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Caching Settings */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <ClockIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Response Caching</h3>
                                <p className="text-sm text-gray-500">Cache search results for faster responses</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setB2cSettings(prev => ({
                                ...prev,
                                caching: { ...prev.caching, enabled: !prev.caching.enabled }
                            }))}
                            className={`w-14 h-7 rounded-full relative transition ${
                                b2cSettings.caching.enabled ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                        >
                            <span
                                className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${
                                    b2cSettings.caching.enabled ? 'right-1' : 'left-1'
                                }`}
                            />
                        </button>
                    </div>

                    {b2cSettings.caching.enabled && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cache TTL (seconds)
                                </label>
                                <input
                                    type="number"
                                    value={b2cSettings.caching.ttl}
                                    onChange={(e) => setB2cSettings(prev => ({
                                        ...prev,
                                        caching: { ...prev.caching, ttl: parseInt(e.target.value) }
                                    }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-700">
                                    Search results will be cached for {b2cSettings.caching.ttl} seconds.
                                    Recommended: 300-600 seconds for optimal balance.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Rate Limiting */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <ShieldCheckIcon className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Rate Limiting</h3>
                                <p className="text-sm text-gray-500">Protect APIs from excessive requests</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setB2cSettings(prev => ({
                                ...prev,
                                rateLimit: { ...prev.rateLimit, enabled: !prev.rateLimit.enabled }
                            }))}
                            className={`w-14 h-7 rounded-full relative transition ${
                                b2cSettings.rateLimit.enabled ? 'bg-orange-600' : 'bg-gray-300'
                            }`}
                        >
                            <span
                                className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${
                                    b2cSettings.rateLimit.enabled ? 'right-1' : 'left-1'
                                }`}
                            />
                        </button>
                    </div>

                    {b2cSettings.rateLimit.enabled && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Requests per minute (per user)
                                </label>
                                <input
                                    type="number"
                                    value={b2cSettings.rateLimit.requestsPerMinute}
                                    onChange={(e) => setB2cSettings(prev => ({
                                        ...prev,
                                        rateLimit: { ...prev.rateLimit, requestsPerMinute: parseInt(e.target.value) }
                                    }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* B2C Markup */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">B2C Markup</h3>
                            <p className="text-sm text-gray-500">Add markup to all B2C fares</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setB2cSettings(prev => ({
                                    ...prev,
                                    markup: { ...prev.markup, type: 'percentage' }
                                }))}
                                className={`flex-1 py-2 rounded-lg border-2 transition ${
                                    b2cSettings.markup.type === 'percentage'
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-gray-200 text-gray-600'
                                }`}
                            >
                                Percentage (%)
                            </button>
                            <button
                                onClick={() => setB2cSettings(prev => ({
                                    ...prev,
                                    markup: { ...prev.markup, type: 'fixed' }
                                }))}
                                className={`flex-1 py-2 rounded-lg border-2 transition ${
                                    b2cSettings.markup.type === 'fixed'
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-gray-200 text-gray-600'
                                }`}
                            >
                                Fixed Amount
                            </button>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Markup Value {b2cSettings.markup.type === 'percentage' ? '(%)' : '(₹)'}
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={b2cSettings.markup.value}
                                onChange={(e) => setB2cSettings(prev => ({
                                    ...prev,
                                    markup: { ...prev.markup, value: parseFloat(e.target.value) }
                                }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Supplier Priority */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <SignalIcon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Supplier Priority</h3>
                            <p className="text-sm text-gray-500">Order suppliers by response time</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {suppliers
                            .filter(s => s.b2cEnabled)
                            .sort((a, b) => a.priority - b.priority)
                            .map((supplier, idx) => (
                                <div
                                    key={supplier.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                                            {idx + 1}
                                        </span>
                                        <span className="font-medium text-gray-900">{supplier.name}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="text-gray-500">{supplier.avgResponseTime}ms</span>
                                        <span className="text-green-600">{supplier.successRate}%</span>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                    Save Optimization Settings
                </button>
            </div>
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Channel Distribution</h1>
                <p className="text-gray-600 mt-1">
                    Manage how TripCode API suppliers and fare types are distributed between B2B and B2C channels
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl w-fit">
                {[
                    { key: 'overview', label: 'Overview', icon: ChartBarIcon },
                    { key: 'suppliers', label: 'Suppliers', icon: ServerIcon },
                    { key: 'fareTypes', label: 'Fare Types', icon: FunnelIcon },
                    { key: 'optimization', label: 'B2C Optimization', icon: RocketLaunchIcon }
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                            activeTab === tab.key
                                ? 'bg-white text-blue-600 shadow'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'suppliers' && renderSuppliers()}
            {activeTab === 'fareTypes' && renderFareTypes()}
            {activeTab === 'optimization' && renderOptimization()}

            {/* Supplier Config Modal */}
            {selectedSupplier && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                        <div className="p-6 border-b flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{selectedSupplier.name}</h2>
                                <p className="text-gray-500 text-sm">Configure supplier settings</p>
                            </div>
                            <button
                                onClick={() => setSelectedSupplier(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Fare Types for this supplier */}
                            <div>
                                <h3 className="font-medium text-gray-900 mb-3">B2C Fare Type Visibility</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedSupplier.fareTypes.map(fareType => {
                                        const isRestricted = selectedSupplier.b2cRestrictedFareTypes.includes(fareType);
                                        return (
                                            <button
                                                key={fareType}
                                                onClick={() => toggleFareTypeRestriction(selectedSupplier.id, fareType)}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition ${
                                                    isRestricted
                                                        ? 'bg-red-50 border-red-200 text-red-700'
                                                        : 'bg-green-50 border-green-200 text-green-700'
                                                }`}
                                            >
                                                {isRestricted ? <XMarkIcon className="w-4 h-4" /> : <CheckIcon className="w-4 h-4" />}
                                                <span className="capitalize">{fareType}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedSupplier(null)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => setSelectedSupplier(null)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChannelDistribution;
