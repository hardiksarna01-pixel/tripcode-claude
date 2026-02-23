import React, { useState } from 'react';
import {
    DocumentTextIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

const AdminVisa = () => {
    const [activeTab, setActiveTab] = useState('applications');

    const stats = {
        totalApplications: 126,
        approved: 98,
        pending: 18,
        rejected: 10
    };

    const applications = [
        { id: 'VIS001', applicant: 'Rajesh Kumar', country: 'United States', type: 'Tourist', agent: 'ABC Travels', appliedOn: '2024-06-10', status: 'processing', amount: 15000 },
        { id: 'VIS002', applicant: 'Priya Sharma', country: 'United Kingdom', type: 'Business', agent: 'XYZ Tours', appliedOn: '2024-06-08', status: 'approved', amount: 12000 },
        { id: 'VIS003', applicant: 'Amit Patel', country: 'Schengen', type: 'Tourist', agent: 'Travel World', appliedOn: '2024-06-12', status: 'pending', amount: 8500 },
        { id: 'VIS004', applicant: 'Sneha Gupta', country: 'Australia', type: 'Tourist', agent: 'Fly High', appliedOn: '2024-06-05', status: 'rejected', amount: 18000 }
    ];

    const countries = [
        { name: 'United States', type: 'Tourist', processingTime: '15-20 days', fee: 15000, requirements: 8 },
        { name: 'United Kingdom', type: 'Tourist', processingTime: '10-15 days', fee: 12000, requirements: 6 },
        { name: 'Schengen', type: 'Tourist', processingTime: '10-12 days', fee: 8500, requirements: 7 },
        { name: 'Australia', type: 'Tourist', processingTime: '20-25 days', fee: 18000, requirements: 9 },
        { name: 'Singapore', type: 'Tourist', processingTime: '3-5 days', fee: 3500, requirements: 4 }
    ];

    const getStatusBadge = (status) => {
        const styles = {
            approved: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            rejected: 'bg-red-100 text-red-800'
        };
        return `px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`;
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Visa Services</h1>
                            <p className="text-gray-600">Manage visa applications and country configurations</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700">
                            <PlusIcon className="w-5 h-5" />
                            Add Country
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.totalApplications}</div>
                                <div className="text-gray-500 text-sm">Total Applications</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.approved}</div>
                                <div className="text-gray-500 text-sm">Approved</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                <ClockIcon className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.pending}</div>
                                <div className="text-gray-500 text-sm">Pending</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <XCircleIcon className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.rejected}</div>
                                <div className="text-gray-500 text-sm">Rejected</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm mb-6">
                    <div className="flex border-b">
                        {['applications', 'countries'].map((tab) => (
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
                {activeTab === 'applications' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Application</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Country</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Type</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Agent</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Applied On</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Amount</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {applications.map((app) => (
                                    <tr key={app.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-blue-600">{app.id}</div>
                                            <div className="text-sm text-gray-500">{app.applicant}</div>
                                        </td>
                                        <td className="px-4 py-3 font-medium">{app.country}</td>
                                        <td className="px-4 py-3 text-sm">{app.type}</td>
                                        <td className="px-4 py-3 text-sm">{app.agent}</td>
                                        <td className="px-4 py-3 text-sm">{app.appliedOn}</td>
                                        <td className="px-4 py-3 font-medium">₹{app.amount.toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            <span className={getStatusBadge(app.status)}>
                                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'countries' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Country</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Visa Type</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Processing Time</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Fee</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Requirements</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {countries.map((country, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">{country.name}</td>
                                        <td className="px-4 py-3 text-sm">{country.type}</td>
                                        <td className="px-4 py-3 text-sm">{country.processingTime}</td>
                                        <td className="px-4 py-3 font-medium">₹{country.fee.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-sm">{country.requirements} docs</td>
                                        <td className="px-4 py-3">
                                            <button className="text-blue-600 text-sm hover:underline">Edit</button>
                                        </td>
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

export default AdminVisa;
