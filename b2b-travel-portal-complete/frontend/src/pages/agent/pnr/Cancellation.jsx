/**
 * Cancellation Request Page
 * For agents to request ticket/booking cancellations
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    XCircleIcon,
    ArrowLeftIcon,
    MagnifyingGlassIcon,
    ExclamationTriangleIcon,
    CurrencyRupeeIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

const Cancellation = () => {
    const [searchValue, setSearchValue] = useState('');
    const [bookingDetails, setBookingDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        reason: '',
        cancellationType: 'full',
        selectedPassengers: [],
        refundMode: 'wallet',
        additionalNotes: ''
    });

    const handleSearch = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBookingDetails({
            pnr: 'ABC123',
            ticketNo: '098-1234567890',
            airline: 'Air India',
            flightNo: 'AI-101',
            route: 'DEL → BOM',
            date: '2024-03-15',
            time: '06:00 - 08:15',
            status: 'Confirmed',
            passengers: [
                { id: 1, name: 'John Smith', type: 'Adult', fare: 5400 },
                { id: 2, name: 'Jane Smith', type: 'Adult', fare: 5400 }
            ],
            totalFare: 10800,
            cancellationCharges: 1500,
            estimatedRefund: 9300,
            isRefundable: true,
            cancellationDeadline: '2024-03-14 23:59'
        });
        setLoading(false);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSubmitting(false);
        alert('Cancellation request submitted! Request ID: CAN-2024-001. You will be notified once processed.');
    };

    const togglePassenger = (passengerId) => {
        setFormData(prev => ({
            ...prev,
            selectedPassengers: prev.selectedPassengers.includes(passengerId)
                ? prev.selectedPassengers.filter(id => id !== passengerId)
                : [...prev.selectedPassengers, passengerId]
        }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/agent/pnr" className="p-2 hover:bg-gray-100 rounded-lg">
                    <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Cancellation Request</h1>
                    <p className="text-gray-500 mt-1">Request booking or ticket cancellation</p>
                </div>
            </div>

            {/* Warning Banner */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <div>
                        <h3 className="font-medium text-red-800">Important Notice</h3>
                        <ul className="text-sm text-red-700 mt-2 space-y-1 list-disc list-inside">
                            <li>Cancellation charges apply as per airline policy</li>
                            <li>Some tickets may be non-refundable</li>
                            <li>Refund processing takes 7-14 business days</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Search Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MagnifyingGlassIcon className="w-5 h-5 text-blue-600" />
                    Find Booking
                </h2>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value.toUpperCase())}
                        placeholder="Enter PNR or Ticket Number"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </div>

            {bookingDetails && (
                <>
                    {/* Booking Details */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Booking Details</h2>
                            <div className="flex items-center gap-2">
                                {bookingDetails.isRefundable ? (
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
                                        <CheckCircleIcon className="w-4 h-4" />
                                        Refundable
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                                        Non-Refundable
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">PNR</p>
                                <p className="font-mono font-semibold">{bookingDetails.pnr}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Flight</p>
                                <p className="font-semibold">{bookingDetails.airline} {bookingDetails.flightNo}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Route</p>
                                <p className="font-semibold">{bookingDetails.route}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Travel Date</p>
                                <p className="font-semibold">{bookingDetails.date}</p>
                            </div>
                        </div>
                        <div className="text-sm text-gray-600">
                            <span className="font-medium">Cancellation Deadline:</span>{' '}
                            <span className="text-red-600">{bookingDetails.cancellationDeadline}</span>
                        </div>
                    </div>

                    {/* Cancellation Type */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Cancellation Type</h2>
                        <div className="flex gap-4 mb-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="full"
                                    checked={formData.cancellationType === 'full'}
                                    onChange={(e) => setFormData({ ...formData, cancellationType: e.target.value })}
                                    className="text-red-600"
                                />
                                <span className="text-sm font-medium">Full Cancellation</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="partial"
                                    checked={formData.cancellationType === 'partial'}
                                    onChange={(e) => setFormData({ ...formData, cancellationType: e.target.value })}
                                    className="text-red-600"
                                />
                                <span className="text-sm font-medium">Partial Cancellation</span>
                            </label>
                        </div>

                        {formData.cancellationType === 'partial' && (
                            <div className="border-t border-gray-200 pt-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">Select Passengers to Cancel:</p>
                                <div className="space-y-2">
                                    {bookingDetails.passengers.map((pax) => (
                                        <label
                                            key={pax.id}
                                            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.selectedPassengers.includes(pax.id)}
                                                onChange={() => togglePassenger(pax.id)}
                                                className="text-red-600 rounded"
                                            />
                                            <div className="flex-1">
                                                <span className="font-medium">{pax.name}</span>
                                                <span className="text-sm text-gray-500 ml-2">({pax.type})</span>
                                            </div>
                                            <span className="font-medium">₹{pax.fare.toLocaleString()}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Reason & Refund */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <XCircleIcon className="w-5 h-5 text-red-600" />
                            Cancellation Details
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Reason for Cancellation <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select a reason</option>
                                    <option value="change_plans">Change of travel plans</option>
                                    <option value="medical">Medical emergency</option>
                                    <option value="visa_rejected">Visa rejected</option>
                                    <option value="schedule_change">Airline schedule change</option>
                                    <option value="duplicate">Duplicate booking</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Additional Notes
                                </label>
                                <textarea
                                    value={formData.additionalNotes}
                                    onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                                    placeholder="Any additional information..."
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Refund Mode
                                </label>
                                <select
                                    value={formData.refundMode}
                                    onChange={(e) => setFormData({ ...formData, refundMode: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="wallet">Agent Wallet (Instant)</option>
                                    <option value="bank">Bank Account (7-14 days)</option>
                                    <option value="original">Original Payment Method</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Refund Summary */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <CurrencyRupeeIcon className="w-5 h-5 text-green-600" />
                            Estimated Refund Summary
                        </h2>
                        <div className="space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Total Fare Paid</span>
                                <span>₹{bookingDetails.totalFare.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-red-600">
                                <span>Cancellation Charges</span>
                                <span>- ₹{bookingDetails.cancellationCharges.toLocaleString()}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-2 mt-2">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Estimated Refund</span>
                                    <span className="text-green-600">₹{bookingDetails.estimatedRefund.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">
                            * Final refund amount will be confirmed by admin after review
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <Link to="/agent/pnr" className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                            Cancel
                        </Link>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting || !formData.reason}
                            className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {submitting ? 'Submitting...' : 'Submit Cancellation Request'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cancellation;
