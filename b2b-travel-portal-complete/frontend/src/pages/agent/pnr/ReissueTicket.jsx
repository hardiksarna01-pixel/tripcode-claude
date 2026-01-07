/**
 * Reissue Ticket Page
 * For agents to reissue tickets with changes
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowPathIcon,
    ArrowLeftIcon,
    MagnifyingGlassIcon,
    ExclamationTriangleIcon,
    CalendarIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

const ReissueTicket = () => {
    const [ticketNumber, setTicketNumber] = useState('');
    const [ticketDetails, setTicketDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [reissueReason, setReissueReason] = useState('');
    const [newFlightDetails, setNewFlightDetails] = useState({
        date: '',
        flightNo: '',
        class: ''
    });

    const handleSearch = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTicketDetails({
            ticketNo: ticketNumber || '098-1234567890',
            pnr: 'ABC123',
            passenger: 'John Smith',
            airline: 'Air India',
            flightNo: 'AI-101',
            route: 'DEL → BOM',
            date: '2024-03-15',
            class: 'Economy',
            status: 'Issued',
            originalFare: 5400,
            isRefundable: true
        });
        setLoading(false);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSubmitting(false);
        alert('Reissue request submitted successfully! You will be notified once processed.');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/agent/pnr" className="p-2 hover:bg-gray-100 rounded-lg">
                    <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Reissue Ticket</h1>
                    <p className="text-gray-500 mt-1">Request ticket reissuance with modified details</p>
                </div>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-800">Reissue Guidelines</h3>
                <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                    <li>Reissue requests require admin approval</li>
                    <li>Fare differences and penalties may apply</li>
                    <li>Processing time: 2-4 hours during business hours</li>
                </ul>
            </div>

            {/* Ticket Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MagnifyingGlassIcon className="w-5 h-5 text-blue-600" />
                    Search Ticket
                </h2>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={ticketNumber}
                        onChange={(e) => setTicketNumber(e.target.value)}
                        placeholder="Enter Ticket Number (e.g., 098-1234567890)"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Searching...' : 'Retrieve Ticket'}
                    </button>
                </div>
            </div>

            {ticketDetails && (
                <>
                    {/* Current Ticket Details */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Ticket Details</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Ticket Number</p>
                                <p className="font-mono font-semibold">{ticketDetails.ticketNo}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">PNR</p>
                                <p className="font-mono font-semibold">{ticketDetails.pnr}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Passenger</p>
                                <p className="font-semibold">{ticketDetails.passenger}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                    {ticketDetails.status}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Flight</p>
                                <p className="font-semibold">{ticketDetails.airline} {ticketDetails.flightNo}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Route</p>
                                <p className="font-semibold">{ticketDetails.route}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Travel Date</p>
                                <p className="font-semibold">{ticketDetails.date}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Class</p>
                                <p className="font-semibold">{ticketDetails.class}</p>
                            </div>
                        </div>
                    </div>

                    {/* Reissue Form */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <ArrowPathIcon className="w-5 h-5 text-purple-600" />
                            New Flight Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    New Travel Date
                                </label>
                                <input
                                    type="date"
                                    value={newFlightDetails.date}
                                    onChange={(e) => setNewFlightDetails({ ...newFlightDetails, date: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Preferred Flight (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={newFlightDetails.flightNo}
                                    onChange={(e) => setNewFlightDetails({ ...newFlightDetails, flightNo: e.target.value })}
                                    placeholder="e.g., AI-102"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Class
                                </label>
                                <select
                                    value={newFlightDetails.class}
                                    onChange={(e) => setNewFlightDetails({ ...newFlightDetails, class: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Same as original</option>
                                    <option value="economy">Economy</option>
                                    <option value="premium">Premium Economy</option>
                                    <option value="business">Business</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Reason for Reissue <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={reissueReason}
                                onChange={(e) => setReissueReason(e.target.value)}
                                placeholder="Please provide a reason for the reissue request..."
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Estimated Charges */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                            <div>
                                <h3 className="font-medium text-yellow-800">Estimated Charges</h3>
                                <div className="mt-2 text-sm text-yellow-700 space-y-1">
                                    <p>Reissue Fee: ₹500 - ₹2,000 (depending on airline policy)</p>
                                    <p>Fare Difference: To be calculated after admin review</p>
                                    <p className="font-medium mt-2">Final charges will be confirmed by admin before processing.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <Link to="/agent/pnr" className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                            Cancel
                        </Link>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting || !reissueReason || !newFlightDetails.date}
                            className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {submitting ? 'Submitting...' : 'Submit Reissue Request'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ReissueTicket;
