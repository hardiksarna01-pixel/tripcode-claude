import React, { useState } from 'react';
import {
    CurrencyRupeeIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    BanknotesIcon,
    ChartBarIcon,
    ArrowDownTrayIcon,
    CalendarIcon,
    CheckCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const AdminFinance = () => {
    const [dateRange, setDateRange] = useState('month');

    const stats = {
        totalRevenue: 45600000,
        todayRevenue: 1250000,
        totalCommission: 4560000,
        pendingPayouts: 856000,
        collectedAmount: 42500000,
        outstandingAmount: 3100000
    };

    const transactions = [
        { id: 'TXN001', type: 'credit', agent: 'ABC Travels', description: 'Wallet Recharge', amount: 50000, status: 'completed', date: '2024-06-15' },
        { id: 'TXN002', type: 'debit', agent: 'XYZ Tours', description: 'Commission Payout', amount: 25000, status: 'completed', date: '2024-06-15' },
        { id: 'TXN003', type: 'credit', agent: 'Travel World', description: 'Wallet Recharge', amount: 100000, status: 'pending', date: '2024-06-14' },
        { id: 'TXN004', type: 'debit', agent: 'Fly High', description: 'Refund Processing', amount: 8500, status: 'completed', date: '2024-06-14' },
        { id: 'TXN005', type: 'credit', agent: 'Trip Masters', description: 'Credit Limit Payment', amount: 75000, status: 'completed', date: '2024-06-13' }
    ];

    const pendingPayouts = [
        { agent: 'ABC Travels', amount: 125000, bookings: 45, dueDate: '2024-06-20' },
        { agent: 'XYZ Tours', amount: 89000, bookings: 32, dueDate: '2024-06-22' },
        { agent: 'Travel World', amount: 156000, bookings: 58, dueDate: '2024-06-25' }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Finance Management</h1>
                            <p className="text-gray-600">Manage payments, payouts, and financial reports</p>
                        </div>
                        <div className="flex gap-3">
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="border rounded-lg px-4 py-2"
                            >
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="year">This Year</option>
                            </select>
                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700">
                                <ArrowDownTrayIcon className="w-5 h-5" />
                                Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <CurrencyRupeeIcon className="w-5 h-5" />
                            <span className="text-sm">Total Revenue</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">₹{(stats.totalRevenue / 10000000).toFixed(1)}Cr</div>
                        <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                            <ArrowTrendingUpIcon className="w-3 h-3" />
                            +12% from last month
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <BanknotesIcon className="w-5 h-5" />
                            <span className="text-sm">Today's Revenue</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">₹{(stats.todayRevenue / 100000).toFixed(1)}L</div>
                        <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                            <ArrowTrendingUpIcon className="w-3 h-3" />
                            +8% vs yesterday
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <ChartBarIcon className="w-5 h-5" />
                            <span className="text-sm">Total Commission</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">₹{(stats.totalCommission / 100000).toFixed(1)}L</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <ClockIcon className="w-5 h-5" />
                            <span className="text-sm">Pending Payouts</span>
                        </div>
                        <div className="text-2xl font-bold text-orange-600">₹{(stats.pendingPayouts / 100000).toFixed(1)}L</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <CheckCircleIcon className="w-5 h-5" />
                            <span className="text-sm">Collected</span>
                        </div>
                        <div className="text-2xl font-bold text-green-600">₹{(stats.collectedAmount / 10000000).toFixed(1)}Cr</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <ExclamationTriangleIcon className="w-5 h-5" />
                            <span className="text-sm">Outstanding</span>
                        </div>
                        <div className="text-2xl font-bold text-red-600">₹{(stats.outstandingAmount / 100000).toFixed(1)}L</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Transactions */}
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h2 className="font-semibold text-lg">Recent Transactions</h2>
                            <a href="#" className="text-blue-600 text-sm hover:underline">View All</a>
                        </div>
                        <div className="divide-y">
                            {transactions.map((txn) => (
                                <div key={txn.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                            txn.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                                        }`}>
                                            {txn.type === 'credit' ? (
                                                <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <ArrowTrendingDownIcon className="w-5 h-5 text-red-600" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium">{txn.description}</div>
                                            <div className="text-sm text-gray-500">{txn.agent} • {txn.date}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`font-bold ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                            {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                                        </div>
                                        <span className={`text-xs ${
                                            txn.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                                        }`}>
                                            {txn.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pending Payouts */}
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h2 className="font-semibold text-lg">Pending Payouts</h2>
                            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                                Process All
                            </button>
                        </div>
                        <div className="divide-y">
                            {pendingPayouts.map((payout, index) => (
                                <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                    <div>
                                        <div className="font-medium">{payout.agent}</div>
                                        <div className="text-sm text-gray-500">{payout.bookings} bookings • Due: {payout.dueDate}</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <div className="font-bold text-gray-900">₹{payout.amount.toLocaleString()}</div>
                                        </div>
                                        <button className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-50">
                                            Process
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminFinance;
