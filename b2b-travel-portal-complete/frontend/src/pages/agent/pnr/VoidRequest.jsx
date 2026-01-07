/**
 * VOID Request Page
 * For agents to request PNR/Ticket VOID within time limit
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    NoSymbolIcon,
    ArrowLeftIcon,
    MagnifyingGlassIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

const VoidRequest = () => {
    const [searchValue, setSearchValue] = useState('');
    const [ticketDetails, setTicketDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        reason: '',
        acknowledgement: false
    });

    const handleSearch = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate void eligibility check
        const issuedTime = new Date();
        issuedTime.setHours(issuedTime.getHours() - 2); // Issued 2 hours ago

        const voidDeadline = new Date(issuedTime);
        voidDeadline.setHours(voidDeadline.getHours() + 24); // 24 hour void window

        const hoursRemaining = Math.floor((voidDeadline - new Date()) / (1000 * 60 * 60));

        setTicketDetails({
            ticketNo: '098-1234567890',
            pnr: 'ABC123',
            passenger: 'John Smith',
            airline: 'Air India',
            flightNo: 'AI-101',
            route: 'DEL → BOM',
            travelDate: '2024-03-15',
            class: 'Economy',
            fare: 5400,
            issuedAt: issuedTime.toLocaleString(),
            voidDeadline: voidDeadline.toLocaleString(),
            hoursRemaining: hoursRemaining,
            isVoidEligible: hoursRemaining > 0,
            voidCharges: 0 // VOID is usually free
        });
        setLoading(false);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSubmitting(false);
        alert('VOID request submitted successfully! Request ID: VOD-2024-001. This will be processed within 30 minutes.');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/agent/pnr" className="p-2 hover:bg-gray-100 rounded-lg">
                    <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">VOID Request</h1>
                    <p className="text-gray-500 mt-1">Request ticket VOID within airline time limit</p>
                </div>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-800">What is VOID?</h3>
                <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                    <li>VOID cancels a ticket as if it was never issued</li>
                    <li>Full refund with no cancellation charges</li>
                    <li>Must be requested within airline's void window (usually 24 hours)</li>
                    <li>Travel date must not have passed</li>
                </ul>
            </div>

            {/* Search Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MagnifyingGlassIcon className="w-5 h-5 text-blue-600" />
                    Find Ticket
                </h2>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Enter Ticket Number (e.g., 098-1234567890)"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Checking...' : 'Check Eligibility'}
                    </button>
                </div>
            </div>

            {ticketDetails && (
                <>
                    {/* Eligibility Status */}
                    {ticketDetails.isVoidEligible ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <CheckCircleIcon className="w-8 h-8 text-green-600" />
                                <div>
                                    <h3 className="font-bold text-green-800 text-lg">Eligible for VOID</h3>
                                    <p className="text-green-700">
                                        <ClockIcon className="w-4 h-4 inline mr-1" />
                                        Time remaining: <strong>{ticketDetails.hoursRemaining} hours</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
                                <div>
                                    <h3 className="font-bold text-red-800 text-lg">Not Eligible for VOID</h3>
                                    <p className="text-red-700">
                                        The void window has expired. Please use the Cancellation option instead.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Ticket Details */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ticket Details</h2>
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
                                <p className="text-sm text-gray-500">Flight</p>
                                <p className="font-semibold">{ticketDetails.airline} {ticketDetails.flightNo}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Route</p>
                                <p className="font-semibold">{ticketDetails.route}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Travel Date</p>
                                <p className="font-semibold">{ticketDetails.travelDate}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Ticket Issued</p>
                                <p className="font-semibold text-sm">{ticketDetails.issuedAt}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">VOID Deadline</p>
                                <p className="font-semibold text-red-600 text-sm">{ticketDetails.voidDeadline}</p>
                            </div>
                        </div>
                    </div>

                    {ticketDetails.isVoidEligible && (
                        <>
                            {/* VOID Form */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <NoSymbolIcon className="w-5 h-5 text-gray-600" />
                                    VOID Request Details
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Reason for VOID <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={formData.reason}
                                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select a reason</option>
                                            <option value="booking_error">Booking error / Wrong details</option>
                                            <option value="duplicate">Duplicate booking</option>
                                            <option value="customer_request">Customer changed mind</option>
                                            <option value="price_issue">Pricing issue</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    {/* Refund Info */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-medium text-gray-900 mb-2">Refund Information</h3>
                                        <div className="space-y-1 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Ticket Fare</span>
                                                <span>₹{ticketDetails.fare.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">VOID Charges</span>
                                                <span className="text-green-600">₹{ticketDetails.voidCharges}</span>
                                            </div>
                                            <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
                                                <span>Full Refund</span>
                                                <span className="text-green-600">₹{ticketDetails.fare.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Acknowledgement */}
                                    <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                                        <label className="flex items-start gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.acknowledgement}
                                                onChange={(e) => setFormData({ ...formData, acknowledgement: e.target.checked })}
                                                className="mt-1 rounded text-blue-600"
                                            />
                                            <span className="text-sm text-gray-700">
                                                I understand that VOIDing this ticket will completely cancel it.
                                                The PNR and all associated bookings will be nullified.
                                                This action requires admin approval and cannot be reversed once processed.
                                            </span>
                                        </label>
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
                                    disabled={submitting || !formData.reason || !formData.acknowledgement}
                                    className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {submitting ? 'Submitting...' : 'Submit VOID Request'}
                                </button>
                            </div>
                        </>
                    )}

                    {!ticketDetails.isVoidEligible && (
                        <div className="flex justify-center">
                            <Link
                                to="/agent/pnr/cancellation"
                                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Proceed to Cancellation Request
                            </Link>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default VoidRequest;
