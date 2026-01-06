import React, { useState } from 'react';
import {
    EnvelopeIcon,
    PlusIcon,
    PencilIcon,
    EyeIcon,
    DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

const AdminEmailTemplates = () => {
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const templates = [
        { id: 1, name: 'Booking Confirmation', category: 'Transactional', subject: 'Your Booking {bookingId} is Confirmed!', lastModified: '2024-06-10', status: 'active' },
        { id: 2, name: 'Welcome Email', category: 'Onboarding', subject: 'Welcome to TripCode Travels!', lastModified: '2024-05-25', status: 'active' },
        { id: 3, name: 'Password Reset', category: 'Security', subject: 'Reset Your Password', lastModified: '2024-06-01', status: 'active' },
        { id: 4, name: 'Invoice', category: 'Transactional', subject: 'Invoice #{invoiceNo} for Booking {bookingId}', lastModified: '2024-06-05', status: 'active' },
        { id: 5, name: 'Cancellation Confirmation', category: 'Transactional', subject: 'Booking {bookingId} Cancelled', lastModified: '2024-05-28', status: 'active' },
        { id: 6, name: 'Payment Receipt', category: 'Transactional', subject: 'Payment Received - ₹{amount}', lastModified: '2024-06-08', status: 'active' },
        { id: 7, name: 'Agent Approval', category: 'Onboarding', subject: 'Your Agent Account is Approved!', lastModified: '2024-05-20', status: 'active' },
        { id: 8, name: 'Commission Payout', category: 'Finance', subject: 'Commission Payout of ₹{amount} Processed', lastModified: '2024-06-12', status: 'active' }
    ];

    const categories = ['All', 'Transactional', 'Onboarding', 'Security', 'Finance', 'Marketing'];
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredTemplates = activeCategory === 'All'
        ? templates
        : templates.filter(t => t.category === activeCategory);

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
                            <p className="text-gray-600">Manage email templates for notifications</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700">
                            <PlusIcon className="w-5 h-5" />
                            Create Template
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Category Tabs */}
                <div className="bg-white rounded-xl shadow-sm mb-6">
                    <div className="flex border-b overflow-x-auto">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                                    activeCategory === cat
                                        ? 'border-b-2 border-blue-600 text-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTemplates.map((template) => (
                        <div key={template.id} className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <EnvelopeIcon className="w-6 h-6 text-blue-600" />
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                    template.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {template.status}
                                </span>
                            </div>
                            <div className="mb-4">
                                <div className="font-semibold mb-1">{template.name}</div>
                                <div className="text-sm text-gray-500 mb-2">{template.category}</div>
                                <div className="text-sm text-gray-600 truncate">{template.subject}</div>
                            </div>
                            <div className="text-xs text-gray-400 mb-4">
                                Last modified: {template.lastModified}
                            </div>
                            <div className="flex gap-2">
                                <button className="flex-1 py-2 border rounded-lg text-sm hover:bg-gray-50 flex items-center justify-center gap-1">
                                    <EyeIcon className="w-4 h-4" />
                                    Preview
                                </button>
                                <button className="flex-1 py-2 border rounded-lg text-sm hover:bg-gray-50 flex items-center justify-center gap-1">
                                    <PencilIcon className="w-4 h-4" />
                                    Edit
                                </button>
                                <button className="p-2 border rounded-lg hover:bg-gray-50" title="Duplicate">
                                    <DocumentDuplicateIcon className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Add New Template Card */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-dashed flex items-center justify-center min-h-[280px]">
                        <button className="text-center text-gray-500">
                            <PlusIcon className="w-12 h-12 mx-auto mb-2" />
                            <span className="font-medium">Create New Template</span>
                        </button>
                    </div>
                </div>

                {/* Variables Reference */}
                <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                    <h2 className="font-semibold mb-4">Available Variables</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { var: '{customerName}', desc: 'Customer full name' },
                            { var: '{bookingId}', desc: 'Booking reference' },
                            { var: '{amount}', desc: 'Transaction amount' },
                            { var: '{agentName}', desc: 'Agent business name' },
                            { var: '{invoiceNo}', desc: 'Invoice number' },
                            { var: '{travelDate}', desc: 'Travel date' },
                            { var: '{pnr}', desc: 'PNR/Ticket number' },
                            { var: '{companyName}', desc: 'Company name' }
                        ].map((item, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                <code className="text-sm text-blue-600">{item.var}</code>
                                <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminEmailTemplates;
