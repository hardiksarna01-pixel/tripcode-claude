import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    BanknotesIcon,
    CreditCardIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    ArrowsRightLeftIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    ArrowPathIcon,
    DocumentTextIcon,
    ArrowDownTrayIcon,
    PlusIcon,
    BuildingLibraryIcon,
    DevicePhoneMobileIcon,
    QrCodeIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    ChevronRightIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const AgentWallet = () => {
    const [walletData, setWalletData] = useState({
        balance: 45600,
        creditLimit: 100000,
        usedCredit: 45600,
        availableCredit: 54400,
        pendingAmount: 15600,
        totalDeposits: 250000,
        totalWithdrawals: 75000
    });
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [dateRange, setDateRange] = useState('month');
    const [showRechargeModal, setShowRechargeModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [rechargeAmount, setRechargeAmount] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');

    useEffect(() => {
        fetchWalletData();
    }, [filter, dateRange]);

    const fetchWalletData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/agent/wallet', {
                params: { filter, range: dateRange }
            });
            if (response.data) {
                setWalletData(response.data.wallet);
                setTransactions(response.data.transactions);
            }
        } catch (error) {
            console.error('Error fetching wallet:', error);
            setTransactions(mockTransactions);
        } finally {
            setLoading(false);
        }
    };

    const mockTransactions = [
        { id: 'TXN001', type: 'credit', description: 'Wallet Recharge via UPI', amount: 25000, status: 'completed', date: '2024-06-15 10:30 AM', reference: 'PAY123456789' },
        { id: 'TXN002', type: 'debit', description: 'Flight Booking - BK45612', amount: 8500, status: 'completed', date: '2024-06-15 11:45 AM', reference: 'BK45612' },
        { id: 'TXN003', type: 'credit', description: 'Commission - BK45612', amount: 425, status: 'completed', date: '2024-06-15 11:46 AM', reference: 'COM45612' },
        { id: 'TXN004', type: 'debit', description: 'Hotel Booking - BK45613', amount: 15600, status: 'completed', date: '2024-06-14 02:30 PM', reference: 'BK45613' },
        { id: 'TXN005', type: 'credit', description: 'Refund - Cancelled Booking', amount: 12300, status: 'completed', date: '2024-06-14 04:15 PM', reference: 'REF45614' },
        { id: 'TXN006', type: 'debit', description: 'Bus Booking - BK45615', amount: 1200, status: 'pending', date: '2024-06-13 09:00 AM', reference: 'BK45615' },
        { id: 'TXN007', type: 'credit', description: 'Wallet Recharge via Net Banking', amount: 50000, status: 'completed', date: '2024-06-12 03:20 PM', reference: 'PAY987654321' },
        { id: 'TXN008', type: 'debit', description: 'Holiday Package - BK45616', amount: 45000, status: 'completed', date: '2024-06-10 11:00 AM', reference: 'BK45616' }
    ];

    const quickAmounts = [5000, 10000, 25000, 50000];

    const paymentMethods = [
        { id: 'upi', name: 'UPI', icon: DevicePhoneMobileIcon, description: 'GPay, PhonePe, Paytm' },
        { id: 'netbanking', name: 'Net Banking', icon: BuildingLibraryIcon, description: 'All major banks' },
        { id: 'card', name: 'Credit/Debit Card', icon: CreditCardIcon, description: 'Visa, Mastercard, RuPay' },
        { id: 'qr', name: 'QR Code', icon: QrCodeIcon, description: 'Scan & Pay' }
    ];

    const handleRecharge = async () => {
        if (!rechargeAmount || parseInt(rechargeAmount) < 100) {
            alert('Minimum recharge amount is ₹100');
            return;
        }

        try {
            const response = await api.post('/agent/wallet/recharge', {
                amount: parseInt(rechargeAmount),
                method: selectedPaymentMethod
            });

            if (response.data.paymentUrl) {
                window.location.href = response.data.paymentUrl;
            }
        } catch (error) {
            console.error('Recharge failed:', error);
        }
    };

    const getTransactionIcon = (type) => {
        if (type === 'credit') {
            return <ArrowDownIcon className="w-5 h-5 text-green-500" />;
        }
        return <ArrowUpIcon className="w-5 h-5 text-red-500" />;
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1"><CheckCircleIcon className="w-3 h-3" /> Completed</span>;
            case 'pending':
                return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center gap-1"><ClockIcon className="w-3 h-3" /> Pending</span>;
            case 'failed':
                return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1"><XCircleIcon className="w-3 h-3" /> Failed</span>;
            default:
                return null;
        }
    };

    const filteredTransactions = filter === 'all'
        ? transactions.length > 0 ? transactions : mockTransactions
        : (transactions.length > 0 ? transactions : mockTransactions).filter(t => t.type === filter);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="text-white">
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <BanknotesIcon className="w-8 h-8" />
                                Wallet & Transactions
                            </h1>
                            <p className="text-blue-100 mt-1">Manage your wallet balance and view transaction history</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowRechargeModal(true)}
                                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center gap-2"
                            >
                                <PlusIcon className="w-5 h-5" />
                                Add Money
                            </button>
                            <button
                                onClick={() => setShowTransferModal(true)}
                                className="bg-white/20 text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/30 transition flex items-center gap-2"
                            >
                                <ArrowsRightLeftIcon className="w-5 h-5" />
                                Transfer
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-6 pb-8">
                {/* Wallet Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Main Balance Card */}
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-blue-200">Wallet Balance</span>
                            <BanknotesIcon className="w-8 h-8 text-blue-300" />
                        </div>
                        <div className="text-4xl font-bold mb-4">₹{walletData.balance.toLocaleString()}</div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowRechargeModal(true)}
                                className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-medium transition"
                            >
                                + Add Money
                            </button>
                            <button className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-medium transition">
                                Statement
                            </button>
                        </div>
                    </div>

                    {/* Credit Limit Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-500">Credit Limit</span>
                            <CreditCardIcon className="w-8 h-8 text-gray-300" />
                        </div>
                        <div className="mb-4">
                            <div className="text-3xl font-bold text-gray-900">₹{walletData.creditLimit.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">Total credit available</div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Used</span>
                                <span className="text-red-600">₹{walletData.usedCredit.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-red-500 h-2 rounded-full"
                                    style={{ width: `${(walletData.usedCredit / walletData.creditLimit) * 100}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Available</span>
                                <span className="text-green-600">₹{walletData.availableCredit.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-500">Quick Stats</span>
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="text-sm border rounded-lg px-2 py-1"
                            >
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="year">This Year</option>
                            </select>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <ArrowDownIcon className="w-5 h-5 text-green-500" />
                                    <span className="text-gray-600">Total Credits</span>
                                </div>
                                <span className="font-bold text-green-600">₹{walletData.totalDeposits.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <ArrowUpIcon className="w-5 h-5 text-red-500" />
                                    <span className="text-gray-600">Total Debits</span>
                                </div>
                                <span className="font-bold text-red-600">₹{walletData.totalWithdrawals.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <ClockIcon className="w-5 h-5 text-yellow-500" />
                                    <span className="text-gray-600">Pending</span>
                                </div>
                                <span className="font-bold text-yellow-600">₹{walletData.pendingAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transactions */}
                <div className="bg-white rounded-2xl shadow-sm">
                    <div className="p-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="font-semibold text-lg">Transaction History</h2>
                        <div className="flex items-center gap-4">
                            <div className="flex gap-2">
                                {['all', 'credit', 'debit'].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                                            filter === f
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                            <button className="p-2 border rounded-lg hover:bg-gray-50">
                                <ArrowDownTrayIcon className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                    </div>

                    <div className="divide-y">
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                            </div>
                        ) : filteredTransactions.length > 0 ? (
                            filteredTransactions.map((txn, index) => (
                                <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                            txn.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                                        }`}>
                                            {getTransactionIcon(txn.type)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{txn.description}</div>
                                            <div className="text-sm text-gray-500">{txn.date} • Ref: {txn.reference}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`font-bold ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                            {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                                        </div>
                                        {getStatusBadge(txn.status)}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                No transactions found
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t text-center">
                        <button className="text-blue-600 text-sm font-medium hover:underline">
                            Load More Transactions
                        </button>
                    </div>
                </div>
            </div>

            {/* Recharge Modal */}
            {showRechargeModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Add Money to Wallet</h2>
                            <button
                                onClick={() => setShowRechargeModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Enter Amount</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">₹</span>
                                <input
                                    type="number"
                                    value={rechargeAmount}
                                    onChange={(e) => setRechargeAmount(e.target.value)}
                                    placeholder="0"
                                    className="w-full pl-8 pr-4 py-4 text-2xl font-bold border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="flex gap-2 mt-3">
                                {quickAmounts.map(amount => (
                                    <button
                                        key={amount}
                                        onClick={() => setRechargeAmount(amount.toString())}
                                        className="flex-1 py-2 border rounded-lg text-sm font-medium hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 transition"
                                    >
                                        ₹{amount.toLocaleString()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Payment Method</label>
                            <div className="space-y-2">
                                {paymentMethods.map(method => (
                                    <label
                                        key={method.id}
                                        className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition ${
                                            selectedPaymentMethod === method.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                checked={selectedPaymentMethod === method.id}
                                                onChange={() => setSelectedPaymentMethod(method.id)}
                                                className="text-blue-600"
                                            />
                                            <method.icon className="w-6 h-6 text-gray-600" />
                                            <div>
                                                <div className="font-medium">{method.name}</div>
                                                <div className="text-xs text-gray-500">{method.description}</div>
                                            </div>
                                        </div>
                                        <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleRecharge}
                            disabled={!rechargeAmount || parseInt(rechargeAmount) < 100}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <ShieldCheckIcon className="w-5 h-5" />
                            Pay ₹{rechargeAmount ? parseInt(rechargeAmount).toLocaleString() : '0'} Securely
                        </button>

                        <p className="text-xs text-gray-500 text-center mt-4">
                            🔒 100% Secure | Instant credit to wallet
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgentWallet;
