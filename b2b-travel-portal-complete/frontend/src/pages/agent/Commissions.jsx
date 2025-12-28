import React, { useState, useEffect } from 'react';
import {
    SparklesIcon,
    CurrencyRupeeIcon,
    ArrowDownTrayIcon,
    CalendarIcon,
    BanknotesIcon,
    ArrowTrendingUpIcon,
    CheckCircleIcon,
    ClockIcon,
    ChartBarIcon,
    FunnelIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const AgentCommissions = () => {
    const [filter, setFilter] = useState('all');
    const [dateRange, setDateRange] = useState('month');
    const [search, setSearch] = useState('');

    const [stats, setStats] = useState({
        totalEarned: 245000,
        thisMonth: 42500,
        pending: 8600,
        withdrawn: 195000,
        growth: 15
    });

    const [commissions, setCommissions] = useState([]);

    const [slabs, setSlabs] = useState([
        { product: 'Domestic Flights', rate: '5%', min: '₹200', max: 'No limit' },
        { product: 'International Flights', rate: '4%', min: '₹500', max: 'No limit' },
        { product: 'Hotels', rate: '6%', min: '₹300', max: 'No limit' },
        { product: 'Bus', rate: '5%', min: '₹50', max: '₹500' },
        { product: 'Holidays', rate: '10%', min: '₹1000', max: 'No limit' },
        { product: 'Insurance', rate: '15%', min: '₹100', max: 'No limit' }
    ]);

    useEffect(() => {
        fetchCommissions();
    }, [filter, dateRange]);

    const fetchCommissions = async () => {
        try {
            const response = await api.get('/agent/commissions', {
                params: { filter, range: dateRange }
            });
            setCommissions(response.data.commissions || mockCommissions);
        } catch (error) {
            setCommissions(mockCommissions);
        }
    };

    const mockCommissions = [
        { id: 'COM001', bookingId: 'BK45612', type: 'flight', customer: 'Rahul Sharma', amount: 8500, commission: 425, status: 'credited', date: '2024-06-15' },
        { id: 'COM002', bookingId: 'BK45613', type: 'hotel', customer: 'Priya Patel', amount: 45600, commission: 2736, status: 'credited', date: '2024-06-14' },
        { id: 'COM003', bookingId: 'BK45614', type: 'flight', customer: 'Amit Kumar', amount: 18500, commission: 925, status: 'pending', date: '2024-06-14' },
        { id: 'COM004', bookingId: 'BK45615', type: 'bus', customer: 'Sneha Gupta', amount: 1200, commission: 60, status: 'credited', date: '2024-06-13' },
        { id: 'COM005', bookingId: 'BK45616', type: 'holiday', customer: 'Vikram Singh', amount: 125000, commission: 12500, status: 'pending', date: '2024-06-10' }
    ];

    const getStatusBadge = (status) => {
        if (status === 'credited') {
            return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1"><CheckCircleIcon className="w-3 h-3" /> Credited</span>;
        }
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center gap-1"><ClockIcon className="w-3 h-3" /> Pending</span>;
    };

    const filteredCommissions = commissions.filter(comm => {
        if (filter !== 'all' && comm.status !== filter) return false;
        if (search && !comm.customer.toLowerCase().includes(search.toLowerCase()) && !comm.bookingId.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-700">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center justify-between">
                        <div className="text-white">
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <SparklesIcon className="w-8 h-8" />
                                My Commissions
                            </h1>
                            <p className="text-green-100 mt-1">Track and manage your earnings</p>
                        </div>
                        <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 flex items-center gap-2">
                            <BanknotesIcon className="w-5 h-5" />
                            Withdraw Funds
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
                            <div className="text-3xl font-bold">₹{(stats.totalEarned / 1000).toFixed(0)}K</div>
                            <div className="text-green-100 text-sm">Total Earned</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
                            <div className="text-3xl font-bold flex items-center gap-2">
                                ₹{(stats.thisMonth / 1000).toFixed(1)}K
                                <span className="text-sm text-green-200 flex items-center">
                                    <ArrowTrendingUpIcon className="w-4 h-4" />
                                    +{stats.growth}%
                                </span>
                            </div>
                            <div className="text-green-100 text-sm">This Month</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
                            <div className="text-3xl font-bold">₹{(stats.pending / 1000).toFixed(1)}K</div>
                            <div className="text-green-100 text-sm">Pending</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
                            <div className="text-3xl font-bold">₹{(stats.withdrawn / 1000).toFixed(0)}K</div>
                            <div className="text-green-100 text-sm">Withdrawn</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Commission Slabs */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                        <ChartBarIcon className="w-5 h-5 text-green-600" />
                        Your Commission Rates
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {slabs.map((slab, index) => (
                            <div key={index} className="p-4 bg-gray-50 rounded-xl text-center">
                                <div className="text-2xl font-bold text-green-600">{slab.rate}</div>
                                <div className="text-sm font-medium text-gray-900 mt-1">{slab.product}</div>
                                <div className="text-xs text-gray-500 mt-1">Min: {slab.min}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex gap-2">
                            {['all', 'credited', 'pending'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                                        filter === f
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 border rounded-lg w-64"
                                />
                            </div>
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="border rounded-lg px-4 py-2"
                            >
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="quarter">This Quarter</option>
                                <option value="year">This Year</option>
                            </select>
                            <button className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50">
                                <ArrowDownTrayIcon className="w-5 h-5" />
                                Export
                            </button>
                        </div>
                    </div>
                </div>

                {/* Commission List */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Booking Amount</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Commission</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredCommissions.map((comm) => (
                                <tr key={comm.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{comm.id}</td>
                                    <td className="px-4 py-3 text-blue-600">{comm.bookingId}</td>
                                    <td className="px-4 py-3 text-gray-600">{comm.customer}</td>
                                    <td className="px-4 py-3 capitalize text-gray-600">{comm.type}</td>
                                    <td className="px-4 py-3 text-right text-gray-900">₹{comm.amount.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-right font-bold text-green-600">+₹{comm.commission.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-center">{getStatusBadge(comm.status)}</td>
                                    <td className="px-4 py-3 text-gray-500">{comm.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredCommissions.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No commissions found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AgentCommissions;
