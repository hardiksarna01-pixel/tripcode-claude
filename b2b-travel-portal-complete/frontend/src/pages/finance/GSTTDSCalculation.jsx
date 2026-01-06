import React, { useState, useEffect } from 'react';
import {
    CalculatorIcon,
    DocumentTextIcon,
    ArrowDownTrayIcon,
    CurrencyRupeeIcon,
    CalendarIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const GSTTDSCalculation = () => {
    const [activeTab, setActiveTab] = useState('gst');
    const [dateRange, setDateRange] = useState({
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0]
    });
    const [gstData, setGstData] = useState(null);
    const [tdsData, setTdsData] = useState(null);
    const [loading, setLoading] = useState(false);

    // GST Rates
    const gstRates = {
        flights: { cgst: 2.5, sgst: 2.5, igst: 5 }, // 5% on convenience fee
        hotels: { cgst: 6, sgst: 6, igst: 12 }, // 12% or 18% depending on tariff
        bus: { cgst: 2.5, sgst: 2.5, igst: 5 },
        insurance: { cgst: 9, sgst: 9, igst: 18 },
        holidays: { cgst: 2.5, sgst: 2.5, igst: 5 }, // On margin
        visa: { cgst: 9, sgst: 9, igst: 18 },
        forex: { cgst: 9, sgst: 9, igst: 18 }
    };

    // TDS Rates
    const tdsRates = {
        commission: 5, // Section 194H
        contractPayment: 1, // Section 194C (Individual/HUF) or 2% (Others)
        professionalFees: 10, // Section 194J
        rent: 10 // Section 194I
    };

    useEffect(() => {
        fetchTaxData();
    }, [dateRange]);

    const fetchTaxData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/finance/tax-report', {
                params: dateRange
            });
            setGstData(response.data.gst || mockGstData);
            setTdsData(response.data.tds || mockTdsData);
        } catch (error) {
            console.error('Error:', error);
            setGstData(mockGstData);
            setTdsData(mockTdsData);
        } finally {
            setLoading(false);
        }
    };

    const mockGstData = {
        summary: {
            totalTaxableValue: 12500000,
            totalCGST: 312500,
            totalSGST: 312500,
            totalIGST: 625000,
            totalCess: 0,
            totalGST: 1250000,
            inputCredit: 450000,
            netPayable: 800000
        },
        breakdown: [
            { category: 'Flights', taxableValue: 5000000, cgst: 125000, sgst: 125000, igst: 250000, total: 500000 },
            { category: 'Hotels', taxableValue: 4000000, cgst: 120000, sgst: 120000, igst: 240000, total: 480000 },
            { category: 'Holidays', taxableValue: 2000000, cgst: 50000, sgst: 50000, igst: 100000, total: 200000 },
            { category: 'Insurance', taxableValue: 1000000, cgst: 90000, sgst: 90000, igst: 180000, total: 360000 },
            { category: 'Bus', taxableValue: 500000, cgst: 12500, sgst: 12500, igst: 25000, total: 50000 }
        ],
        invoices: [
            { id: 'INV-2024-001', date: '2024-06-01', party: 'ABC Travels', taxableValue: 50000, gst: 6000, total: 56000, status: 'Filed' },
            { id: 'INV-2024-002', date: '2024-06-02', party: 'XYZ Tours', taxableValue: 75000, gst: 9000, total: 84000, status: 'Pending' },
            { id: 'INV-2024-003', date: '2024-06-03', party: 'Travel World', taxableValue: 35000, gst: 4200, total: 39200, status: 'Filed' }
        ]
    };

    const mockTdsData = {
        summary: {
            totalDeducted: 850000,
            totalDeposited: 750000,
            totalPending: 100000,
            section194H: 450000,
            section194C: 200000,
            section194J: 150000,
            section194I: 50000
        },
        deductions: [
            { section: '194H', description: 'Commission to Agents', amount: 9000000, rate: 5, tds: 450000, status: 'Deposited' },
            { section: '194C', description: 'Contractor Payments', amount: 10000000, rate: 2, tds: 200000, status: 'Deposited' },
            { section: '194J', description: 'Professional Fees', amount: 1500000, rate: 10, tds: 150000, status: 'Pending' },
            { section: '194I', description: 'Office Rent', amount: 500000, rate: 10, tds: 50000, status: 'Deposited' }
        ],
        filings: [
            { quarter: 'Q1 FY 2024-25', dueDate: '2024-07-31', status: 'Pending', amount: 450000 },
            { quarter: 'Q4 FY 2023-24', dueDate: '2024-05-31', status: 'Filed', amount: 380000 },
            { quarter: 'Q3 FY 2023-24', dueDate: '2024-01-31', status: 'Filed', amount: 420000 }
        ]
    };

    const calculateGST = (amount, category, isInterstate = false) => {
        const rates = gstRates[category] || gstRates.flights;
        if (isInterstate) {
            return {
                cgst: 0,
                sgst: 0,
                igst: amount * (rates.igst / 100),
                total: amount * (rates.igst / 100)
            };
        }
        return {
            cgst: amount * (rates.cgst / 100),
            sgst: amount * (rates.sgst / 100),
            igst: 0,
            total: amount * ((rates.cgst + rates.sgst) / 100)
        };
    };

    const calculateTDS = (amount, section) => {
        const rate = tdsRates[section] || 5;
        return amount * (rate / 100);
    };

    const downloadReport = (type) => {
        // Implement download functionality
        alert(`Downloading ${type} report...`);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">GST & TDS Management</h1>
                            <p className="text-sm text-gray-600">Tax calculation, filing, and compliance</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="date"
                                    value={dateRange.from}
                                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                                    className="border rounded-lg px-3 py-2 text-sm"
                                />
                                <span>to</span>
                                <input
                                    type="date"
                                    value={dateRange.to}
                                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                                    className="border rounded-lg px-3 py-2 text-sm"
                                />
                            </div>
                            <button
                                onClick={() => downloadReport(activeTab)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                            >
                                <ArrowDownTrayIcon className="w-5 h-5" />
                                Download Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('gst')}
                        className={`px-6 py-3 rounded-lg font-medium transition ${
                            activeTab === 'gst'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        GST Management
                    </button>
                    <button
                        onClick={() => setActiveTab('tds')}
                        className={`px-6 py-3 rounded-lg font-medium transition ${
                            activeTab === 'tds'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        TDS Management
                    </button>
                    <button
                        onClick={() => setActiveTab('calculator')}
                        className={`px-6 py-3 rounded-lg font-medium transition ${
                            activeTab === 'calculator'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        Tax Calculator
                    </button>
                </div>

                {/* GST Tab */}
                {activeTab === 'gst' && gstData && (
                    <div className="space-y-6">
                        {/* GST Summary Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl shadow-sm p-4">
                                <div className="text-sm text-gray-500">Total Taxable Value</div>
                                <div className="text-2xl font-bold text-gray-900">
                                    ₹{(gstData.summary.totalTaxableValue / 100000).toFixed(1)}L
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-4">
                                <div className="text-sm text-gray-500">Total GST Collected</div>
                                <div className="text-2xl font-bold text-blue-600">
                                    ₹{(gstData.summary.totalGST / 100000).toFixed(1)}L
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-4">
                                <div className="text-sm text-gray-500">Input Tax Credit</div>
                                <div className="text-2xl font-bold text-green-600">
                                    ₹{(gstData.summary.inputCredit / 100000).toFixed(1)}L
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-4">
                                <div className="text-sm text-gray-500">Net Payable</div>
                                <div className="text-2xl font-bold text-orange-600">
                                    ₹{(gstData.summary.netPayable / 100000).toFixed(1)}L
                                </div>
                            </div>
                        </div>

                        {/* Category-wise Breakdown */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="p-4 border-b">
                                <h2 className="font-semibold text-lg">Category-wise GST Breakdown</h2>
                            </div>
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Taxable Value</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">CGST</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">SGST</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">IGST</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total GST</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {gstData.breakdown.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium">{item.category}</td>
                                            <td className="px-4 py-3 text-right">₹{item.taxableValue.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-right">₹{item.cgst.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-right">₹{item.sgst.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-right">₹{item.igst.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-right font-medium text-blue-600">₹{item.total.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50 font-semibold">
                                    <tr>
                                        <td className="px-4 py-3">Total</td>
                                        <td className="px-4 py-3 text-right">₹{gstData.summary.totalTaxableValue.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right">₹{gstData.summary.totalCGST.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right">₹{gstData.summary.totalSGST.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right">₹{gstData.summary.totalIGST.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right text-blue-600">₹{gstData.summary.totalGST.toLocaleString()}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* Recent Invoices */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="p-4 border-b flex items-center justify-between">
                                <h2 className="font-semibold text-lg">Recent Invoices</h2>
                                <a href="/admin/finance/invoices" className="text-blue-600 text-sm hover:underline">View All</a>
                            </div>
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Party</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Taxable</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">GST</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {gstData.invoices.map((inv, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium">{inv.id}</td>
                                            <td className="px-4 py-3">{inv.date}</td>
                                            <td className="px-4 py-3">{inv.party}</td>
                                            <td className="px-4 py-3 text-right">₹{inv.taxableValue.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-right">₹{inv.gst.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-right font-medium">₹{inv.total.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    inv.status === 'Filed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {inv.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TDS Tab */}
                {activeTab === 'tds' && tdsData && (
                    <div className="space-y-6">
                        {/* TDS Summary Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl shadow-sm p-4">
                                <div className="text-sm text-gray-500">Total TDS Deducted</div>
                                <div className="text-2xl font-bold text-gray-900">
                                    ₹{(tdsData.summary.totalDeducted / 100000).toFixed(1)}L
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-4">
                                <div className="text-sm text-gray-500">Deposited</div>
                                <div className="text-2xl font-bold text-green-600">
                                    ₹{(tdsData.summary.totalDeposited / 100000).toFixed(1)}L
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-4">
                                <div className="text-sm text-gray-500">Pending Deposit</div>
                                <div className="text-2xl font-bold text-orange-600">
                                    ₹{(tdsData.summary.totalPending / 100000).toFixed(1)}L
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-4">
                                <div className="text-sm text-gray-500">Next Due Date</div>
                                <div className="text-2xl font-bold text-red-600">
                                    7th of Next Month
                                </div>
                            </div>
                        </div>

                        {/* Section-wise Breakdown */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="p-4 border-b">
                                <h2 className="font-semibold text-lg">Section-wise TDS Breakdown</h2>
                            </div>
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Section</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Rate</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">TDS</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {tdsData.deductions.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium">{item.section}</td>
                                            <td className="px-4 py-3">{item.description}</td>
                                            <td className="px-4 py-3 text-right">₹{item.amount.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-center">{item.rate}%</td>
                                            <td className="px-4 py-3 text-right font-medium">₹{item.tds.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    item.status === 'Deposited' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Quarterly Filing Status */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="p-4 border-b">
                                <h2 className="font-semibold text-lg">Quarterly Filing Status</h2>
                            </div>
                            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                {tdsData.filings.map((filing, index) => (
                                    <div key={index} className={`p-4 rounded-lg border ${
                                        filing.status === 'Filed' ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'
                                    }`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium">{filing.quarter}</span>
                                            {filing.status === 'Filed' ? (
                                                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <CalendarIcon className="w-5 h-5 text-yellow-600" />
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600">Due: {filing.dueDate}</div>
                                        <div className="text-lg font-bold mt-2">₹{filing.amount.toLocaleString()}</div>
                                        <div className={`text-xs mt-1 ${
                                            filing.status === 'Filed' ? 'text-green-600' : 'text-yellow-600'
                                        }`}>
                                            {filing.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Calculator Tab */}
                {activeTab === 'calculator' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* GST Calculator */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <CalculatorIcon className="w-5 h-5 text-blue-600" />
                                GST Calculator
                            </h2>
                            <GSTCalculator rates={gstRates} calculateGST={calculateGST} />
                        </div>

                        {/* TDS Calculator */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <CalculatorIcon className="w-5 h-5 text-green-600" />
                                TDS Calculator
                            </h2>
                            <TDSCalculator rates={tdsRates} calculateTDS={calculateTDS} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// GST Calculator Component
const GSTCalculator = ({ rates, calculateGST }) => {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('flights');
    const [isInterstate, setIsInterstate] = useState(false);
    const [result, setResult] = useState(null);

    const handleCalculate = () => {
        if (amount) {
            setResult(calculateGST(parseFloat(amount), category, isInterstate));
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full border rounded-lg px-4 py-2"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2"
                >
                    {Object.keys(rates).map(key => (
                        <option key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>
                    ))}
                </select>
            </div>
            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={isInterstate}
                    onChange={(e) => setIsInterstate(e.target.checked)}
                    className="rounded"
                />
                <span className="text-sm">Interstate Transaction (IGST)</span>
            </label>
            <button
                onClick={handleCalculate}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
            >
                Calculate GST
            </button>
            {result && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
                    {!isInterstate && (
                        <>
                            <div className="flex justify-between">
                                <span>CGST</span>
                                <span className="font-medium">₹{result.cgst.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>SGST</span>
                                <span className="font-medium">₹{result.sgst.toFixed(2)}</span>
                            </div>
                        </>
                    )}
                    {isInterstate && (
                        <div className="flex justify-between">
                            <span>IGST</span>
                            <span className="font-medium">₹{result.igst.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                        <span>Total GST</span>
                        <span className="text-blue-600">₹{result.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                        <span>Grand Total</span>
                        <span>₹{(parseFloat(amount) + result.total).toFixed(2)}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

// TDS Calculator Component
const TDSCalculator = ({ rates, calculateTDS }) => {
    const [amount, setAmount] = useState('');
    const [section, setSection] = useState('commission');
    const [result, setResult] = useState(null);

    const handleCalculate = () => {
        if (amount) {
            const tds = calculateTDS(parseFloat(amount), section);
            setResult({
                tds,
                netAmount: parseFloat(amount) - tds
            });
        }
    };

    const sectionDetails = {
        commission: { name: 'Commission (194H)', rate: 5 },
        contractPayment: { name: 'Contract Payment (194C)', rate: 2 },
        professionalFees: { name: 'Professional Fees (194J)', rate: 10 },
        rent: { name: 'Rent (194I)', rate: 10 }
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full border rounded-lg px-4 py-2"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2"
                >
                    {Object.entries(sectionDetails).map(([key, val]) => (
                        <option key={key} value={key}>{val.name} - {val.rate}%</option>
                    ))}
                </select>
            </div>
            <button
                onClick={handleCalculate}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium"
            >
                Calculate TDS
            </button>
            {result && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex justify-between">
                        <span>TDS @ {sectionDetails[section].rate}%</span>
                        <span className="font-medium text-red-600">₹{result.tds.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                        <span>Net Amount Payable</span>
                        <span className="text-green-600">₹{result.netAmount.toFixed(2)}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GSTTDSCalculation;
