import React, { useState } from 'react';
import {
    ShieldCheckIcon,
    MagnifyingGlassIcon,
    PlusIcon
} from '@heroicons/react/24/outline';

const AdminInsurance = () => {
    const [activeTab, setActiveTab] = useState('policies');

    const stats = {
        totalPolicies: 2450,
        activePolicies: 1850,
        revenue: 4500000,
        claimsProcessed: 45
    };

    const policies = [
        { id: 'INS001', customer: 'Rajesh Kumar', plan: 'Travel Guard Gold', coverage: 500000, premium: 1500, startDate: '2024-06-15', endDate: '2024-06-30', status: 'active' },
        { id: 'INS002', customer: 'Priya Sharma', plan: 'International Explorer', coverage: 1000000, premium: 2500, startDate: '2024-07-01', endDate: '2024-07-15', status: 'active' },
        { id: 'INS003', customer: 'Amit Patel', plan: 'Basic Travel', coverage: 250000, premium: 800, startDate: '2024-06-20', endDate: '2024-06-25', status: 'pending' }
    ];

    const plans = [
        { id: 1, name: 'Basic Travel', coverage: 250000, premium: 800, features: ['Medical Emergency', 'Trip Cancellation'], bookings: 450, status: 'active' },
        { id: 2, name: 'Travel Guard Gold', coverage: 500000, premium: 1500, features: ['Medical Emergency', 'Trip Cancellation', 'Baggage Loss', 'Flight Delay'], bookings: 680, status: 'active' },
        { id: 3, name: 'International Explorer', coverage: 1000000, premium: 2500, features: ['All Gold Features', 'Adventure Sports', 'Extended Coverage'], bookings: 320, status: 'active' },
        { id: 4, name: 'Premium Plus', coverage: 2000000, premium: 4500, features: ['All Explorer Features', 'Pre-existing Conditions', 'Family Cover'], bookings: 180, status: 'active' }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Travel Insurance</h1>
                            <p className="text-gray-600">Manage insurance policies and plans</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700">
                            <PlusIcon className="w-5 h-5" />
                            Add Plan
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Total Policies</div>
                        <div className="text-2xl font-bold mt-1">{stats.totalPolicies.toLocaleString()}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Active Policies</div>
                        <div className="text-2xl font-bold mt-1 text-green-600">{stats.activePolicies.toLocaleString()}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Revenue</div>
                        <div className="text-2xl font-bold mt-1">₹{(stats.revenue / 100000).toFixed(1)}L</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Claims Processed</div>
                        <div className="text-2xl font-bold mt-1">{stats.claimsProcessed}</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm mb-6">
                    <div className="flex border-b">
                        {['policies', 'plans', 'claims'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-4 text-sm font-medium capitalize ${
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

                {/* Content */}
                {activeTab === 'policies' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Policy</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Plan</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Coverage</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Premium</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Duration</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {policies.map((policy) => (
                                    <tr key={policy.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-blue-600">{policy.id}</div>
                                            <div className="text-sm text-gray-500">{policy.customer}</div>
                                        </td>
                                        <td className="px-4 py-3 font-medium">{policy.plan}</td>
                                        <td className="px-4 py-3">₹{policy.coverage.toLocaleString()}</td>
                                        <td className="px-4 py-3 font-medium">₹{policy.premium}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <div>{policy.startDate}</div>
                                            <div className="text-gray-500">to {policy.endDate}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                policy.status === 'active' ? 'bg-green-100 text-green-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'plans' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {plans.map((plan) => (
                            <div key={plan.id} className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="font-semibold">{plan.name}</div>
                                        <div className="text-sm text-gray-500">{plan.bookings} bookings</div>
                                    </div>
                                </div>
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Coverage</span>
                                        <span className="font-medium">₹{(plan.coverage / 100000).toFixed(0)}L</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Premium</span>
                                        <span className="font-medium">₹{plan.premium}</span>
                                    </div>
                                </div>
                                <div className="space-y-1 mb-4">
                                    {plan.features.slice(0, 3).map((feature, index) => (
                                        <div key={index} className="text-xs text-gray-600 flex items-center gap-1">
                                            <span className="w-1 h-1 bg-green-500 rounded-full" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full py-2 border rounded-lg text-sm hover:bg-gray-50">
                                    Edit Plan
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'claims' && (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <ShieldCheckIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Claims Management</h3>
                        <p className="text-gray-500">No pending claims to process</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminInsurance;
