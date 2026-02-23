import React, { useEffect, useState } from 'react';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Download } from 'lucide-react';
import { walletAPI } from '../../services/api';

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const [balanceRes, transactionsRes] = await Promise.all([
          walletAPI.getBalance(),
          walletAPI.getTransactions(),
        ]);
        setBalance(balanceRes.data.balance || 0);
        setTransactions(transactionsRes.data.transactions || []);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
        <p className="text-gray-500">Manage your wallet balance and transactions</p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100">Available Balance</p>
            <p className="text-4xl font-bold mt-2">₹{balance.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-white/20 rounded-full">
            <WalletIcon className="w-8 h-8" />
          </div>
        </div>
        <div className="mt-6 flex gap-4">
          <button className="flex-1 bg-white text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50">
            Request Top-up
          </button>
          <button className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-400">
            View Statement
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">This Month Credits</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                ₹{transactions
                  .filter(t => t.type === 'CREDIT')
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString()}
              </p>
            </div>
            <ArrowDownLeft className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">This Month Debits</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                ₹{transactions
                  .filter(t => t.type === 'DEBIT')
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString()}
              </p>
            </div>
            <ArrowUpRight className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Transactions</p>
              <p className="text-2xl font-bold mt-1">{transactions.length}</p>
            </div>
            <Download className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
        </div>
        {transactions.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No transactions yet
          </div>
        ) : (
          <div className="divide-y">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'CREDIT' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'CREDIT' ? (
                      <ArrowDownLeft className={`w-5 h-5 text-green-600`} />
                    ) : (
                      <ArrowUpRight className={`w-5 h-5 text-red-600`} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <p className={`font-semibold ${
                  transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'CREDIT' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
