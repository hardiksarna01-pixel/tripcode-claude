import React, { useState, useEffect } from 'react';
import { invoiceApi } from '../services/api';

const InvoiceManagement = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [gstSummary, setGstSummary] = useState(null);
    const [formData, setFormData] = useState({
        bookingRef: '',
        customerName: '',
        customerEmail: '',
        customerAddress: '',
        hasGst: false,
        gstNumber: '',
        gstCompanyName: '',
        gstAddress: ''
    });

    useEffect(() => {
        fetchInvoices();
        fetchGstSummary();
    }, []);

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            // Mock data
            setInvoices([
                {
                    id: 1, invoiceNumber: 'INV12345678', bookingRef: 'TRP001',
                    customerName: 'Rahul Sharma', hasGst: true, gstNumber: '27AABCU9603R1ZM',
                    grandTotal: 13500, createdAt: '2025-12-26T10:00:00Z'
                },
                {
                    id: 2, invoiceNumber: 'INV12345679', bookingRef: 'TRP002',
                    customerName: 'Amit Kumar', hasGst: false, gstNumber: '',
                    grandTotal: 8900, createdAt: '2025-12-25T14:00:00Z'
                },
                {
                    id: 3, invoiceNumber: 'INV12345680', bookingRef: 'TRP003',
                    customerName: 'Priya Enterprises', hasGst: true, gstNumber: '29AABCT1234R1Z2',
                    grandTotal: 25400, createdAt: '2025-12-24T09:00:00Z'
                }
            ]);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchGstSummary = async () => {
        try {
            setGstSummary({
                invoiceCount: 12,
                taxableValue: 245000,
                cgst: 11025,
                sgst: 11025,
                igst: 4410,
                totalGst: 26460,
                totalValue: 271460
            });
        } catch (error) {
            console.error('Error fetching GST summary:', error);
        }
    };

    const handleGenerateInvoice = async () => {
        if (!formData.bookingRef || !formData.customerName) {
            alert('Please fill in required fields');
            return;
        }
        try {
            const newInvoice = {
                id: Date.now(),
                invoiceNumber: `INV${Date.now().toString().slice(-8)}`,
                ...formData,
                grandTotal: 13500,
                createdAt: new Date().toISOString()
            };
            setInvoices([newInvoice, ...invoices]);
            setShowGenerateModal(false);
            resetForm();
            alert('Invoice generated successfully!');
        } catch (error) {
            console.error('Error generating invoice:', error);
        }
    };

    const handleDownload = (invoice) => {
        alert(`Downloading invoice ${invoice.invoiceNumber}...`);
    };

    const handleEmail = (invoice) => {
        const email = prompt('Enter email address:', invoice.customerEmail || '');
        if (email) {
            alert(`Invoice sent to ${email}`);
        }
    };

    const resetForm = () => {
        setFormData({
            bookingRef: '', customerName: '', customerEmail: '', customerAddress: '',
            hasGst: false, gstNumber: '', gstCompanyName: '', gstAddress: ''
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Invoice & GST Management</h1>
                        <p className="text-gray-500">Generate and manage invoices</p>
                    </div>
                    <button
                        onClick={() => setShowGenerateModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Generate Invoice
                    </button>
                </div>

                {/* GST Summary */}
                {gstSummary && (
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow p-6 mb-6 text-white">
                        <h3 className="font-semibold mb-4">GST Summary - Current Month</h3>
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                            <div>
                                <p className="text-blue-200 text-sm">Invoices</p>
                                <p className="text-2xl font-bold">{gstSummary.invoiceCount}</p>
                            </div>
                            <div>
                                <p className="text-blue-200 text-sm">Taxable Value</p>
                                <p className="text-2xl font-bold">₹{(gstSummary.taxableValue / 1000).toFixed(0)}K</p>
                            </div>
                            <div>
                                <p className="text-blue-200 text-sm">CGST</p>
                                <p className="text-2xl font-bold">₹{(gstSummary.cgst / 1000).toFixed(1)}K</p>
                            </div>
                            <div>
                                <p className="text-blue-200 text-sm">SGST</p>
                                <p className="text-2xl font-bold">₹{(gstSummary.sgst / 1000).toFixed(1)}K</p>
                            </div>
                            <div>
                                <p className="text-blue-200 text-sm">IGST</p>
                                <p className="text-2xl font-bold">₹{(gstSummary.igst / 1000).toFixed(1)}K</p>
                            </div>
                            <div>
                                <p className="text-blue-200 text-sm">Total GST</p>
                                <p className="text-2xl font-bold">₹{(gstSummary.totalGst / 1000).toFixed(1)}K</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Invoices Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-4 border-b flex justify-between items-center">
                        <h3 className="font-semibold">Recent Invoices</h3>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Search invoices..."
                                className="px-3 py-1 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            />
                            <select className="px-3 py-1 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                                <option value="">All Invoices</option>
                                <option value="gst">With GST</option>
                                <option value="nogst">Without GST</option>
                            </select>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice No.</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking Ref</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">GST</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                            Loading invoices...
                                        </td>
                                    </tr>
                                ) : invoices.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                            No invoices found
                                        </td>
                                    </tr>
                                ) : (
                                    invoices.map((invoice) => (
                                        <tr key={invoice.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="font-medium text-blue-600">{invoice.invoiceNumber}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {invoice.bookingRef}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {invoice.customerName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {invoice.hasGst ? (
                                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                        {invoice.gstNumber}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-400">No GST</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                                ₹{invoice.grandTotal.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(invoice.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                <button
                                                    onClick={() => setSelectedInvoice(invoice)}
                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleDownload(invoice)}
                                                    className="text-green-600 hover:text-green-900 mr-3"
                                                >
                                                    Download
                                                </button>
                                                <button
                                                    onClick={() => handleEmail(invoice)}
                                                    className="text-purple-600 hover:text-purple-900"
                                                >
                                                    Email
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Generate Invoice Modal */}
            {showGenerateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 my-8 p-6">
                        <h3 className="text-lg font-semibold mb-4">Generate Invoice</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Booking Reference *</label>
                                <input
                                    type="text"
                                    value={formData.bookingRef}
                                    onChange={(e) => setFormData({ ...formData, bookingRef: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., TRP001"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                                <input
                                    type="text"
                                    value={formData.customerName}
                                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email</label>
                                <input
                                    type="email"
                                    value={formData.customerEmail}
                                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="border-t pt-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.hasGst}
                                        onChange={(e) => setFormData({ ...formData, hasGst: e.target.checked })}
                                        className="w-4 h-4 text-blue-600 rounded"
                                    />
                                    <span className="font-medium">Add GST Details</span>
                                </label>
                            </div>

                            {formData.hasGst && (
                                <div className="space-y-4 pl-6 border-l-2 border-blue-200">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">GST Number *</label>
                                        <input
                                            type="text"
                                            value={formData.gstNumber}
                                            onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g., 27AABCU9603R1ZM"
                                            maxLength={15}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                        <input
                                            type="text"
                                            value={formData.gstCompanyName}
                                            onChange={(e) => setFormData({ ...formData, gstCompanyName: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Registered Address</label>
                                        <textarea
                                            value={formData.gstAddress}
                                            onChange={(e) => setFormData({ ...formData, gstAddress: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => { setShowGenerateModal(false); resetForm(); }}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGenerateInvoice}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Generate Invoice
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Invoice Modal */}
            {selectedInvoice && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8 p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold">Invoice #{selectedInvoice.invoiceNumber}</h3>
                                <p className="text-gray-500">Booking: {selectedInvoice.bookingRef}</p>
                            </div>
                            <button
                                onClick={() => setSelectedInvoice(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="border rounded-lg p-4 mb-4">
                            <h4 className="font-medium mb-2">Bill To:</h4>
                            <p className="text-gray-800">{selectedInvoice.customerName}</p>
                            {selectedInvoice.hasGst && (
                                <p className="text-sm text-gray-600 mt-1">GSTIN: {selectedInvoice.gstNumber}</p>
                            )}
                        </div>

                        <div className="border rounded-lg overflow-hidden mb-4">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    <tr>
                                        <td className="px-4 py-2 text-sm">Base Fare</td>
                                        <td className="px-4 py-2 text-sm text-right">₹10,000</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 text-sm">Taxes & Fees</td>
                                        <td className="px-4 py-2 text-sm text-right">₹1,800</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 text-sm">Service Fee</td>
                                        <td className="px-4 py-2 text-sm text-right">₹250</td>
                                    </tr>
                                    {selectedInvoice.hasGst && (
                                        <>
                                            <tr>
                                                <td className="px-4 py-2 text-sm">CGST (9%)</td>
                                                <td className="px-4 py-2 text-sm text-right">₹450</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 text-sm">SGST (9%)</td>
                                                <td className="px-4 py-2 text-sm text-right">₹450</td>
                                            </tr>
                                        </>
                                    )}
                                </tbody>
                                <tfoot className="bg-gray-50">
                                    <tr>
                                        <td className="px-4 py-3 text-sm font-bold">Grand Total</td>
                                        <td className="px-4 py-3 text-lg font-bold text-right">₹{selectedInvoice.grandTotal.toLocaleString()}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => handleDownload(selectedInvoice)}
                                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Download PDF
                            </button>
                            <button
                                onClick={() => handleEmail(selectedInvoice)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Send Email
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvoiceManagement;
