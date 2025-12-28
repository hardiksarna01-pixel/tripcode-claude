import React, { useState } from 'react';
import {
    CurrencyRupeeIcon,
    ChartBarIcon,
    PlusIcon,
    PencilIcon,
    ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const AdminCommissions = () => {
    const [activeTab, setActiveTab] = useState('slabs');

    const commissionSlabs = [
        { id: 1, name: 'Bronze', monthlyTarget: '0 - 5L', flightComm: 0.5, hotelComm: 5, busComm: 2, agentCount: 450 },
        { id: 2, name: 'Silver', monthlyTarget: '5L - 15L', flightComm: 0.75, hotelComm: 6, busComm: 2.5, agentCount: 320 },
        { id: 3, name: 'Gold', monthlyTarget: '15L - 30L', flightComm: 1.0, hotelComm: 7, busComm: 3, agentCount: 145 },
        { id: 4, name: 'Platinum', monthlyTarget: '30L+', flightComm: 1.25, hotelComm: 8, busComm: 3.5, agentCount: 65 }
    ];

    const pendingPayouts = [
        { agent: 'ABC Travels', period: 'June 2024', amount: 45000, bookings: 125, status: 'pending' },
        { agent: 'XYZ Tours', period: 'June 2024', amount: 32000, bookings: 89, status: 'pending' },
        { agent: 'Travel World', period: 'June 2024', amount: 58000, bookings: 156, status: 'processing' },
        { agent: 'Fly High', period: 'June 2024', amount: 28500, bookings: 72, status: 'pending' }
    ];

    const recentPayouts = [
        { agent: 'ABC Travels', period: 'May 2024', amount: 42000, paidOn: '2024-06-05', method: 'Bank Transfer' },
        { agent: 'XYZ Tours', period: 'May 2024', amount: 35500, paidOn: '2024-06-05', method: 'Bank Transfer' },
        { agent: 'Trip Masters', period: 'May 2024', amount: 28000, paidOn: '2024-06-04', method: 'Bank Transfer' }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Commission Management</h1>
                            <p className="text-gray-600">Configure commission slabs and manage payouts</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50">
                                <ArrowDownTrayIcon className="w-5 h-5" />
                                Export
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700">
                                <PlusIcon className="w-5 h-5" />
                                Add Slab
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Total Commission (This Month)</div>
                        <div className="text-2xl font-bold mt-1">₹8.5L</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Pending Payouts</div>
                        <div className="text-2xl font-bold mt-1 text-orange-600">₹1.63L</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Paid This Month</div>
                        <div className="text-2xl font-bold mt-1 text-green-600">₹6.87L</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Avg Commission/Booking</div>
                        <div className="text-2xl font-bold mt-1">₹185</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm mb-6">
                    <div className="flex border-b">
                        {['slabs', 'pending', 'history'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-4 text-sm font-medium capitalize ${
                                    activeTab === tab
                                        ? 'border-b-2 border-blue-600 text-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab === 'slabs' ? 'Commission Slabs' : tab === 'pending' ? 'Pending Payouts' : 'Payout History'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                {activeTab === 'slabs' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Slab</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Monthly Target</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Flight (%)</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Hotel (%)</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Bus (%)</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Agents</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {commissionSlabs.map((slab) => (
                                    <tr key={slab.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                slab.name === 'Bronze' ? 'bg-amber-100 text-amber-800' :
                                                slab.name === 'Silver' ? 'bg-gray-200 text-gray-800' :
                                                slab.name === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-purple-100 text-purple-800'
                                            }`}>
                                                {slab.name}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-medium">{slab.monthlyTarget}</td>
                                        <td className="px-4 py-3">{slab.flightComm}%</td>
                                        <td className="px-4 py-3">{slab.hotelComm}%</td>
                                        <td className="px-4 py-3">{slab.busComm}%</td>
                                        <td className="px-4 py-3 text-gray-600">{slab.agentCount} agents</td>
                                        <td className="px-4 py-3">
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

                {activeTab === 'pending' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b flex items-center justify-between">
                            <span className="text-gray-600">4 payouts pending</span>
                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                                Process All Payouts
                            </button>
                        </div>
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Agent</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Period</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Bookings</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Amount</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {pendingPayouts.map((payout, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">{payout.agent}</td>
                                        <td className="px-4 py-3">{payout.period}</td>
                                        <td className="px-4 py-3">{payout.bookings}</td>
                                        <td className="px-4 py-3 font-bold">₹{payout.amount.toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                payout.status === 'processing' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                                                Process
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Agent</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Period</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Amount</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Paid On</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Method</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {recentPayouts.map((payout, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">{payout.agent}</td>
                                        <td className="px-4 py-3">{payout.period}</td>
                                        <td className="px-4 py-3 font-bold text-green-600">₹{payout.amount.toLocaleString()}</td>
                                        <td className="px-4 py-3">{payout.paidOn}</td>
                                        <td className="px-4 py-3 text-gray-600">{payout.method}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCommissions;
