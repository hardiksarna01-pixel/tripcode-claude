import React, { useState } from 'react';
import {
    CreditCardIcon,
    MagnifyingGlassIcon,
    ArrowDownTrayIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

const SuperAdminBilling = () => {
    const [activeTab, setActiveTab] = useState('invoices');

    const stats = {
        totalBilled: 45000000,
        collected: 42500000,
        pending: 2500000,
        overdue: 850000
    };

    const invoices = [
        { id: 'INV001', company: 'TravelMax India', plan: 'Enterprise', amount: 99999, dueDate: '2024-06-30', status: 'paid', paidOn: '2024-06-25' },
        { id: 'INV002', company: 'Global Trips', plan: 'Professional', amount: 29999, dueDate: '2024-06-30', status: 'pending', paidOn: null },
        { id: 'INV003', company: 'JetSet Tours', plan: 'Professional', amount: 29999, dueDate: '2024-06-25', status: 'overdue', paidOn: null },
        { id: 'INV004', company: 'Voyage Plus', plan: 'Enterprise', amount: 99999, dueDate: '2024-06-30', status: 'paid', paidOn: '2024-06-20' },
        { id: 'INV005', company: 'TripMaster Pro', plan: 'Enterprise', amount: 99999, dueDate: '2024-07-01', status: 'pending', paidOn: null }
    ];

    const getStatusBadge = (status) => {
        const styles = {
            paid: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            overdue: 'bg-red-100 text-red-800'
        };
        return `px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`;
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Billing & Invoices</h1>
                            <p className="text-indigo-200">Manage platform billing and payments</p>
                        </div>
                        <button className="px-4 py-2 bg-white text-indigo-900 rounded-lg flex items-center gap-2 hover:bg-indigo-50">
                            <ArrowDownTrayIcon className="w-5 h-5" />
                            Export
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Total Billed (This Month)</div>
                        <div className="text-2xl font-bold mt-1">₹{(stats.totalBilled / 100000).toFixed(0)}L</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Collected</div>
                        <div className="text-2xl font-bold mt-1 text-green-600">₹{(stats.collected / 100000).toFixed(0)}L</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Pending</div>
                        <div className="text-2xl font-bold mt-1 text-yellow-600">₹{(stats.pending / 100000).toFixed(0)}L</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Overdue</div>
                        <div className="text-2xl font-bold mt-1 text-red-600">₹{(stats.overdue / 100000).toFixed(0)}L</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm mb-6">
                    <div className="flex border-b">
                        {['invoices', 'payments', 'subscriptions'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-4 text-sm font-medium capitalize ${
                                    activeTab === tab
                                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Invoices Table */}
                {activeTab === 'invoices' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b">
                            <div className="flex items-center gap-4">
                                <div className="flex-1 relative">
                                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search invoices..."
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                                    />
                                </div>
                                <select className="border rounded-lg px-4 py-2">
                                    <option value="all">All Status</option>
                                    <option value="paid">Paid</option>
                                    <option value="pending">Pending</option>
                                    <option value="overdue">Overdue</option>
                                </select>
                            </div>
                        </div>
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Invoice</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Company</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Plan</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Amount</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Due Date</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {invoices.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-indigo-600">{invoice.id}</td>
                                        <td className="px-4 py-3 font-medium">{invoice.company}</td>
                                        <td className="px-4 py-3 text-sm">{invoice.plan}</td>
                                        <td className="px-4 py-3 font-medium">₹{invoice.amount.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-sm">{invoice.dueDate}</td>
                                        <td className="px-4 py-3">
                                            <span className={getStatusBadge(invoice.status)}>
                                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button className="text-indigo-600 text-sm hover:underline">View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'payments' && (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <CreditCardIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Payment History</h3>
                        <p className="text-gray-500">View all payment transactions</p>
                    </div>
                )}

                {activeTab === 'subscriptions' && (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <CheckCircleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Active Subscriptions</h3>
                        <p className="text-gray-500">Manage company subscriptions</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuperAdminBilling;
