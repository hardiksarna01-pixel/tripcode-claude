/**
 * Issue Ticket Page
 * For agents to issue new tickets from PNRs
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    TicketIcon,
    ArrowLeftIcon,
    MagnifyingGlassIcon,
    UserIcon,
    CreditCardIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const IssueTicket = () => {
    const [pnr, setPnr] = useState('');
    const [pnrDetails, setPnrDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [issuing, setIssuing] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPnrDetails({
            pnr: pnr || 'ABC123',
            status: 'Confirmed',
            airline: 'Air India',
            flightNo: 'AI-101',
            route: 'DEL → BOM',
            date: '2024-03-15',
            time: '06:00 - 08:15',
            class: 'Economy',
            passengers: [
                { name: 'John Smith', type: 'Adult', seat: '12A', fare: 4500 },
                { name: 'Jane Smith', type: 'Adult', seat: '12B', fare: 4500 }
            ],
            baseFare: 9000,
            taxes: 1800,
            total: 10800,
            timeLimit: '2024-03-10 18:00',
            isTimeWarning: true
        });
        setLoading(false);
    };

    const handleIssue = async () => {
        setIssuing(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIssuing(false);
        alert('Ticket issued successfully! Confirmation email sent.');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/agent/pnr" className="p-2 hover:bg-gray-100 rounded-lg">
                    <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Issue Ticket</h1>
                    <p className="text-gray-500 mt-1">Issue tickets from confirmed PNRs</p>
                </div>
            </div>

            {/* PNR Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MagnifyingGlassIcon className="w-5 h-5 text-blue-600" />
                    Search PNR
                </h2>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={pnr}
                        onChange={(e) => setPnr(e.target.value.toUpperCase())}
                        placeholder="Enter PNR (e.g., ABC123)"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-lg"
                        maxLength={6}
                    />
                    <button
                        onClick={handleSearch}
                        disabled={loading || pnr.length < 6}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? 'Searching...' : 'Retrieve PNR'}
                    </button>
                </div>
            </div>

            {/* PNR Details */}
            {pnrDetails && (
                <>
                    {/* Time Limit Warning */}
                    {pnrDetails.isTimeWarning && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-yellow-800">Time Limit Warning</p>
                                <p className="text-sm text-yellow-700 mt-1">
                                    This PNR must be ticketed by <strong>{pnrDetails.timeLimit}</strong> or it will be automatically cancelled.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Flight Details */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Flight Details</h2>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                {pnrDetails.status}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">PNR</p>
                                <p className="font-mono font-bold text-lg">{pnrDetails.pnr}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Flight</p>
                                <p className="font-semibold">{pnrDetails.airline} {pnrDetails.flightNo}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Route</p>
                                <p className="font-semibold">{pnrDetails.route}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Date & Time</p>
                                <p className="font-semibold">{pnrDetails.date} | {pnrDetails.time}</p>
                            </div>
                        </div>
                    </div>

                    {/* Passengers */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <UserIcon className="w-5 h-5 text-blue-600" />
                            Passengers
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">Passenger</th>
                                        <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">Type</th>
                                        <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">Seat</th>
                                        <th className="text-right px-4 py-2 text-xs font-medium text-gray-500 uppercase">Fare</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {pnrDetails.passengers.map((pax, idx) => (
                                        <tr key={idx}>
                                            <td className="px-4 py-3 font-medium text-gray-900">{pax.name}</td>
                                            <td className="px-4 py-3 text-gray-600">{pax.type}</td>
                                            <td className="px-4 py-3 text-gray-600">{pax.seat}</td>
                                            <td className="px-4 py-3 text-right font-medium">₹{pax.fare.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Fare Breakdown */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <CreditCardIcon className="w-5 h-5 text-blue-600" />
                            Fare Summary
                        </h2>
                        <div className="space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Base Fare ({pnrDetails.passengers.length} pax)</span>
                                <span>₹{pnrDetails.baseFare.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Taxes & Fees</span>
                                <span>₹{pnrDetails.taxes.toLocaleString()}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-2 mt-2">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total Amount</span>
                                    <span className="text-blue-600">₹{pnrDetails.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                            Cancel
                        </button>
                        <button
                            onClick={handleIssue}
                            disabled={issuing}
                            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {issuing ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    <TicketIcon className="w-5 h-5" />
                                    Issue Ticket
                                </>
                            )}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default IssueTicket;
