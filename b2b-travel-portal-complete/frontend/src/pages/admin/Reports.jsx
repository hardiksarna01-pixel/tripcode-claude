import React, { useState } from 'react';
import {
    ChartBarIcon,
    ArrowDownTrayIcon,
    CalendarIcon,
    DocumentChartBarIcon,
    CurrencyRupeeIcon,
    TicketIcon,
    UserGroupIcon,
    BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const AdminReports = () => {
    const [reportType, setReportType] = useState('sales');
    const [dateRange, setDateRange] = useState('month');
    const [format, setFormat] = useState('pdf');

    const reportTypes = [
        { id: 'sales', name: 'Sales Report', icon: CurrencyRupeeIcon, description: 'Revenue, bookings, and commission analysis' },
        { id: 'bookings', name: 'Booking Report', icon: TicketIcon, description: 'Detailed booking statistics by product' },
        { id: 'agents', name: 'Agent Report', icon: UserGroupIcon, description: 'Agent performance and activity' },
        { id: 'suppliers', name: 'Supplier Report', icon: BuildingOfficeIcon, description: 'Supplier-wise booking breakdown' },
        { id: 'commission', name: 'Commission Report', icon: ChartBarIcon, description: 'Commission earned and payouts' },
        { id: 'gst', name: 'GST Report', icon: DocumentChartBarIcon, description: 'GST collection and filing data' }
    ];

    const recentReports = [
        { name: 'Sales Report - June 2024', type: 'sales', generated: '2024-06-15 10:30 AM', size: '2.4 MB', format: 'PDF' },
        { name: 'Agent Performance Q2', type: 'agents', generated: '2024-06-01 09:15 AM', size: '1.8 MB', format: 'Excel' },
        { name: 'GST Report - May 2024', type: 'gst', generated: '2024-05-31 11:00 PM', size: '3.2 MB', format: 'PDF' },
        { name: 'Commission Payout Report', type: 'commission', generated: '2024-05-25 02:45 PM', size: '890 KB', format: 'Excel' }
    ];

    const handleGenerate = () => {
        console.log('Generating report:', { reportType, dateRange, format });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
                    <p className="text-gray-600">Generate and download business reports</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Report Generator */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">Generate Report</h2>

                            {/* Report Type Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Select Report Type</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {reportTypes.map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => setReportType(type.id)}
                                            className={`p-4 border rounded-lg text-left transition ${
                                                reportType === type.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'hover:border-gray-300'
                                            }`}
                                        >
                                            <type.icon className={`w-6 h-6 mb-2 ${
                                                reportType === type.id ? 'text-blue-600' : 'text-gray-400'
                                            }`} />
                                            <div className="font-medium text-sm">{type.name}</div>
                                            <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Date Range */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Date Range</label>
                                <div className="flex gap-3">
                                    {['today', 'week', 'month', 'quarter', 'year', 'custom'].map((range) => (
                                        <button
                                            key={range}
                                            onClick={() => setDateRange(range)}
                                            className={`px-4 py-2 rounded-lg text-sm ${
                                                dateRange === range
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {range.charAt(0).toUpperCase() + range.slice(1)}
                                        </button>
                                    ))}
                                </div>
                                {dateRange === 'custom' && (
                                    <div className="flex gap-4 mt-4">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">From</label>
                                            <input type="date" className="border rounded-lg px-3 py-2" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">To</label>
                                            <input type="date" className="border rounded-lg px-3 py-2" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Format Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Export Format</label>
                                <div className="flex gap-3">
                                    {[
                                        { id: 'pdf', name: 'PDF' },
                                        { id: 'excel', name: 'Excel' },
                                        { id: 'csv', name: 'CSV' }
                                    ].map((f) => (
                                        <button
                                            key={f.id}
                                            onClick={() => setFormat(f.id)}
                                            className={`px-6 py-2 rounded-lg text-sm border ${
                                                format === f.id
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                    : 'hover:border-gray-300'
                                            }`}
                                        >
                                            {f.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Generate Button */}
                            <button
                                onClick={handleGenerate}
                                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                            >
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
                                                <div className="text-xs text-gray-500 mt-1">{report.generated}</div>
                                                <div className="text-xs text-gray-400 mt-1">{report.size} • {report.format}</div>
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
                                        <div className="font-medium text-sm">Daily Sales Summary</div>
                                        <div className="text-xs text-gray-500">Every day at 11:00 PM</div>
                                    </div>
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                                </div>
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <div className="font-medium text-sm">Weekly Agent Report</div>
                                        <div className="text-xs text-gray-500">Every Monday at 9:00 AM</div>
                                    </div>
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                                </div>
                            </div>
                            <button className="w-full mt-4 py-2 border border-dashed rounded-lg text-sm text-gray-500 hover:bg-gray-50">
                                + Schedule New Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
