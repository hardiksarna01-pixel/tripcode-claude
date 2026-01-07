/**
 * Date Change Request Page
 * For agents to request date changes on bookings
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    CalendarDaysIcon,
    ArrowLeftIcon,
    MagnifyingGlassIcon,
    ArrowRightIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const DateChange = () => {
    const [searchType, setSearchType] = useState('pnr');
    const [searchValue, setSearchValue] = useState('');
    const [bookingDetails, setBookingDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        newDate: '',
        flexibleDates: false,
        preferredTime: '',
        reason: '',
        urgency: 'normal'
    });

    const handleSearch = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBookingDetails({
            pnr: 'ABC123',
            ticketNo: '098-1234567890',
            passenger: 'John Smith',
            airline: 'Air India',
            flightNo: 'AI-101',
            route: 'Delhi (DEL) → Mumbai (BOM)',
            currentDate: '2024-03-15',
            currentTime: '06:00 - 08:15',
            class: 'Economy',
            status: 'Confirmed',
            isChangeable: true,
            changeFee: 2500
        });
        setLoading(false);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSubmitting(false);
        alert('Date change request submitted! Request ID: DCR-2024-001');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/agent/pnr" className="p-2 hover:bg-gray-100 rounded-lg">
                    <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Date Change Request</h1>
                    <p className="text-gray-500 mt-1">Request travel date modifications</p>
                </div>
            </div>

            {/* Search Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MagnifyingGlassIcon className="w-5 h-5 text-blue-600" />
                    Find Booking
                </h2>
                <div className="flex gap-4 mb-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            value="pnr"
                            checked={searchType === 'pnr'}
                            onChange={(e) => setSearchType(e.target.value)}
                            className="text-blue-600"
                        />
                        <span className="text-sm">Search by PNR</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            value="ticket"
                            checked={searchType === 'ticket'}
                            onChange={(e) => setSearchType(e.target.value)}
                            className="text-blue-600"
                        />
                        <span className="text-sm">Search by Ticket Number</span>
                    </label>
                </div>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value.toUpperCase())}
                        placeholder={searchType === 'pnr' ? 'Enter PNR' : 'Enter Ticket Number'}
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
                    {/* Current Booking */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Current Booking</h2>
                            {bookingDetails.isChangeable ? (
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                    Changeable
                                </span>
                            ) : (
                                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                                    Non-Changeable
                                </span>
                            )}
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">DEL</p>
                                    <p className="text-sm text-gray-500">Delhi</p>
                                </div>
                                <div className="flex-1 px-6">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="h-0.5 flex-1 bg-gray-300"></div>
                                        <ArrowRightIcon className="w-5 h-5 text-gray-400" />
                                        <div className="h-0.5 flex-1 bg-gray-300"></div>
                                    </div>
                                    <p className="text-center text-sm text-gray-500 mt-1">
                                        {bookingDetails.airline} {bookingDetails.flightNo}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">BOM</p>
                                    <p className="text-sm text-gray-500">Mumbai</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-4 gap-4 text-center">
                                <div>
                                    <p className="text-xs text-gray-500">Current Date</p>
                                    <p className="font-semibold text-orange-600">{bookingDetails.currentDate}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Time</p>
                                    <p className="font-semibold">{bookingDetails.currentTime}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Passenger</p>
                                    <p className="font-semibold">{bookingDetails.passenger}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">PNR</p>
                                    <p className="font-mono font-semibold">{bookingDetails.pnr}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Date Change Form */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <CalendarDaysIcon className="w-5 h-5 text-orange-600" />
                            New Date Request
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    New Travel Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={formData.newDate}
                                    onChange={(e) => setFormData({ ...formData, newDate: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Preferred Time
                                </label>
                                <select
                                    value={formData.preferredTime}
                                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Any time</option>
                                    <option value="morning">Morning (6AM - 12PM)</option>
                                    <option value="afternoon">Afternoon (12PM - 6PM)</option>
                                    <option value="evening">Evening (6PM - 12AM)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Urgency Level
                                </label>
                                <select
                                    value={formData.urgency}
                                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="normal">Normal (24-48 hours)</option>
                                    <option value="urgent">Urgent (4-6 hours)</option>
                                    <option value="critical">Critical (Within 2 hours)</option>
                                </select>
                            </div>
                            <div className="flex items-center">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.flexibleDates}
                                        onChange={(e) => setFormData({ ...formData, flexibleDates: e.target.checked })}
                                        className="rounded text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700">I'm flexible with dates (±3 days)</span>
                                </label>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Reason for Date Change <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                placeholder="Please provide reason for the date change request..."
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Charges Info */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <ExclamationTriangleIcon className="w-6 h-6 text-orange-600 flex-shrink-0" />
                            <div>
                                <h3 className="font-medium text-orange-800">Estimated Change Charges</h3>
                                <div className="mt-2 text-sm text-orange-700 space-y-1">
                                    <p>Date Change Fee: ₹{bookingDetails.changeFee.toLocaleString()}</p>
                                    <p>Fare Difference: Subject to availability</p>
                                    <p className="font-medium pt-2">Admin will confirm final charges before processing.</p>
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
                            disabled={submitting || !formData.newDate || !formData.reason}
                            className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {submitting ? 'Submitting...' : 'Submit Date Change Request'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default DateChange;
