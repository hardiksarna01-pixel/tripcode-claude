import React, { useState } from 'react';
import {
    ChartBarIcon,
    ArrowDownTrayIcon,
    CalendarIcon,
    BuildingOffice2Icon,
    CurrencyRupeeIcon,
    UsersIcon
} from '@heroicons/react/24/outline';

const SuperAdminReports = () => {
    const [reportType, setReportType] = useState('revenue');
    const [dateRange, setDateRange] = useState('month');

    const reportTypes = [
        { id: 'revenue', name: 'Revenue Report', icon: CurrencyRupeeIcon },
        { id: 'companies', name: 'Company Report', icon: BuildingOffice2Icon },
        { id: 'users', name: 'User Report', icon: UsersIcon },
        { id: 'usage', name: 'Platform Usage', icon: ChartBarIcon }
    ];

    const recentReports = [
        { name: 'Monthly Revenue Report - June 2024', type: 'revenue', generated: '2024-06-15', size: '4.2 MB' },
        { name: 'Company Growth Q2 2024', type: 'companies', generated: '2024-06-01', size: '2.8 MB' },
        { name: 'User Activity Report', type: 'users', generated: '2024-05-31', size: '3.5 MB' },
        { name: 'Platform Usage Analytics', type: 'usage', generated: '2024-05-25', size: '5.1 MB' }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-2xl font-bold">Platform Reports</h1>
                    <p className="text-indigo-200">Generate and download platform-wide reports</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Report Generator */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-6">Generate Report</h2>

                            {/* Report Type */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Report Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {reportTypes.map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => setReportType(type.id)}
                                            className={`p-4 border rounded-lg text-left transition ${
                                                reportType === type.id
                                                    ? 'border-indigo-500 bg-indigo-50'
                                                    : 'hover:border-gray-300'
                                            }`}
                                        >
                                            <type.icon className={`w-6 h-6 mb-2 ${
                                                reportType === type.id ? 'text-indigo-600' : 'text-gray-400'
                                            }`} />
                                            <div className="font-medium">{type.name}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Date Range */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Date Range</label>
                                <div className="flex gap-3">
                                    {['week', 'month', 'quarter', 'year', 'custom'].map((range) => (
                                        <button
                                            key={range}
                                            onClick={() => setDateRange(range)}
                                            className={`px-4 py-2 rounded-lg text-sm ${
                                                dateRange === range
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {range.charAt(0).toUpperCase() + range.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Filters</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <select className="border rounded-lg px-3 py-2">
                                        <option>All Companies</option>
                                        <option>Enterprise Only</option>
                                        <option>Professional Only</option>
                                        <option>Starter Only</option>
                                    </select>
                                    <select className="border rounded-lg px-3 py-2">
                                        <option>All Regions</option>
                                        <option>India</option>
                                        <option>International</option>
                                    </select>
                                </div>
                            </div>

                            {/* Generate */}
                            <button className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center justify-center gap-2">
                                <ArrowDownTrayIcon className="w-5 h-5" />
                                Generate Report
                            </button>
                        </div>
                    </div>

                    {/* Recent Reports */}
                    <div>
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">Recent Reports</h2>
                            <div className="space-y-4">
                                {recentReports.map((report, index) => (
                                    <div key={index} className="p-3 border rounded-lg hover:bg-gray-50">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="font-medium text-sm">{report.name}</div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {report.generated} • {report.size}
                                                </div>
                                            </div>
                                            <button className="p-2 hover:bg-gray-100 rounded">
                                                <ArrowDownTrayIcon className="w-4 h-4 text-gray-500" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Scheduled Reports */}
                        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                            <h2 className="text-lg font-semibold mb-4">Scheduled Reports</h2>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <div className="font-medium text-sm">Monthly Revenue</div>
                                        <div className="text-xs text-gray-500">1st of every month</div>
                                    </div>
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                                </div>
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <div className="font-medium text-sm">Weekly Usage</div>
                                        <div className="text-xs text-gray-500">Every Monday</div>
                                    </div>
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminReports;
