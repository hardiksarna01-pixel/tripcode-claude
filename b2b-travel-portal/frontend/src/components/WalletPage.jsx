import React, { useState, useEffect } from 'react';
import { walletApi } from '../services/api';

const WalletPage = () => {
    const [wallet, setWallet] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddFundsModal, setShowAddFundsModal] = useState(false);
    const [showCreditRequestModal, setShowCreditRequestModal] = useState(false);
    const [addFundsAmount, setAddFundsAmount] = useState('');
    const [creditRequest, setCreditRequest] = useState({ amount: '', reason: '' });

    useEffect(() => {
        fetchWalletData();
    }, []);

    const fetchWalletData = async () => {
        setLoading(true);
        try {
            // Mock data for demo
            setWallet({
                balance: 245000,
                creditLimit: 500000,
                usedCredit: 125000,
                availableCredit: 375000,
                holdAmount: 15000,
                bookingPower: 605000
            });

            setTransactions([
                { id: 1, type: 'debit', category: 'booking', amount: -12450, balanceAfter: 245000, description: 'Booking TRP001 - DEL to BOM', reference: 'TRP001', createdAt: '2025-12-26T10:30:00Z' },
                { id: 2, type: 'credit', category: 'commission', amount: 890, balanceAfter: 257450, description: 'Commission for TRP001', reference: 'COM001', createdAt: '2025-12-26T10:30:00Z' },
                { id: 3, type: 'debit', category: 'booking', amount: -8200, balanceAfter: 256560, description: 'Booking TRP002 - BLR to DEL', reference: 'TRP002', createdAt: '2025-12-25T14:20:00Z' },
                { id: 4, type: 'credit', category: 'recharge', amount: 50000, balanceAfter: 264760, description: 'Wallet recharge via NEFT', reference: 'RCH001', createdAt: '2025-12-24T09:00:00Z' },
                { id: 5, type: 'credit', category: 'refund', amount: 4500, balanceAfter: 214760, description: 'Refund for cancelled booking', reference: 'RFD001', createdAt: '2025-12-23T16:45:00Z' }
            ]);
        } catch (error) {
            console.error('Error fetching wallet data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddFunds = async () => {
        if (!addFundsAmount || parseFloat(addFundsAmount) <= 0) return;
        try {
            // await walletApi.addFunds(parseFloat(addFundsAmount), 'Online', '');
            alert(`Request to add ₹${addFundsAmount} submitted successfully`);
            setShowAddFundsModal(false);
            setAddFundsAmount('');
            fetchWalletData();
        } catch (error) {
            console.error('Error adding funds:', error);
        }
    };

    const handleCreditRequest = async () => {
        if (!creditRequest.amount) return;
        try {
            // await walletApi.requestCreditIncrease(parseFloat(creditRequest.amount), creditRequest.reason);
            alert('Credit increase request submitted successfully');
            setShowCreditRequestModal(false);
            setCreditRequest({ amount: '', reason: '' });
        } catch (error) {
            console.error('Error requesting credit:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Wallet & Credit</h1>
                    <p className="text-gray-500">Manage your funds and credit limit</p>
                </div>

                {/* Balance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-500">Available Balance</h3>
                        <p className="text-3xl font-bold text-green-600 mt-2">₹{wallet.balance.toLocaleString()}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-500">Credit Limit</h3>
                        <p className="text-3xl font-bold text-blue-600 mt-2">₹{wallet.creditLimit.toLocaleString()}</p>
                        <p className="text-sm text-gray-500 mt-1">Used: ₹{wallet.usedCredit.toLocaleString()}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-500">Available Credit</h3>
                        <p className="text-3xl font-bold text-purple-600 mt-2">₹{wallet.availableCredit.toLocaleString()}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                        <h3 className="text-sm font-medium opacity-90">Booking Power</h3>
                        <p className="text-3xl font-bold mt-2">₹{wallet.bookingPower.toLocaleString()}</p>
                        <p className="text-sm opacity-80 mt-1">Balance + Available Credit</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setShowAddFundsModal(true)}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Funds
                    </button>
                    <button
                        onClick={() => setShowCreditRequestModal(true)}
                        className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        Request Credit Increase
                    </button>
                </div>

                {/* Credit Usage Bar */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h3 className="font-medium mb-4">Credit Usage</h3>
                    <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                            <div>
                                <span className="text-xs font-semibold inline-block text-blue-600">
                                    {Math.round((wallet.usedCredit / wallet.creditLimit) * 100)}% Used
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-gray-600">
                                    ₹{wallet.usedCredit.toLocaleString()} / ₹{wallet.creditLimit.toLocaleString()}
                                </span>
                            </div>
                        </div>
                        <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-200">
                            <div
                                style={{ width: `${(wallet.usedCredit / wallet.creditLimit) * 100}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b">
                        <h3 className="text-lg font-medium">Recent Transactions</h3>
                    </div>
                    <div className="divide-y">
                        {transactions.map((tx) => (
                            <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                        tx.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                                    }`}>
                                        {tx.type === 'credit' ? (
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                            </svg>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{tx.description}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(tx.createdAt).toLocaleDateString('en-US', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                            <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded text-xs">{tx.reference}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-semibold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                        {tx.type === 'credit' ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-500">Bal: ₹{tx.balanceAfter.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t text-center">
                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                            View All Transactions
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Funds Modal */}
            {showAddFundsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                        <h3 className="text-lg font-semibold mb-4">Add Funds</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                            <input
                                type="number"
                                value={addFundsAmount}
                                onChange={(e) => setAddFundsAmount(e.target.value)}
                                className="w-full px-4 py-3 border rounded-lg text-lg focus:ring-2 focus:ring-green-500"
                                placeholder="Enter amount"
                            />
                        </div>
                        <div className="flex gap-2 mb-4">
                            {[10000, 25000, 50000, 100000].map((amt) => (
                                <button
                                    key={amt}
                                    onClick={() => setAddFundsAmount(amt.toString())}
                                    className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-50"
                                >
                                    ₹{(amt / 1000)}K
                                </button>
                            ))}
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                            <p className="text-sm text-blue-800">
                                <strong>Bank Details:</strong><br />
                                Account Name: Tripcode Travel Pvt Ltd<br />
                                Account No: 1234567890<br />
                                IFSC: HDFC0001234
                            </p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowAddFundsModal(false)}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddFunds}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Submit Request
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Credit Request Modal */}
            {showCreditRequestModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                        <h3 className="text-lg font-semibold mb-4">Request Credit Increase</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Limit: ₹{wallet.creditLimit.toLocaleString()}
                            </label>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Requested New Limit (₹)</label>
                            <input
                                type="number"
                                value={creditRequest.amount}
                                onChange={(e) => setCreditRequest({ ...creditRequest, amount: e.target.value })}
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter new limit amount"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Increase</label>
                            <textarea
                                value={creditRequest.reason}
                                onChange={(e) => setCreditRequest({ ...creditRequest, reason: e.target.value })}
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                rows={3}
                                placeholder="Please provide a reason..."
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowCreditRequestModal(false)}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreditRequest}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Submit Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletPage;
