import React, { useState, useEffect } from 'react';
import { groupBookingApi } from '../services/api';

const GroupBooking = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        departureDate: '',
        returnDate: '',
        passengers: 10,
        cabinClass: 0,
        purpose: 'corporate',
        preferredAirlines: [],
        isFlexibleDate: false,
        flexibleDays: 2,
        specialRequirements: '',
        contactName: '',
        contactEmail: '',
        contactPhone: ''
    });

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            // Mock data
            setRequests([
                {
                    id: 1,
                    requestNumber: 'GRP001',
                    origin: 'DEL',
                    destination: 'GOA',
                    departureDate: '2025-12-28',
                    passengers: 25,
                    purpose: 'wedding',
                    status: 'quoted',
                    quotes: [
                        { id: 'Q1', airline: 'Air India', farePerPax: 4500, totalFare: 112500 },
                        { id: 'Q2', airline: 'IndiGo', farePerPax: 4200, totalFare: 105000 }
                    ],
                    createdAt: '2025-12-24T10:00:00Z'
                },
                {
                    id: 2,
                    requestNumber: 'GRP002',
                    origin: 'BOM',
                    destination: 'BLR',
                    departureDate: '2025-12-30',
                    passengers: 15,
                    purpose: 'corporate',
                    status: 'pending',
                    quotes: [],
                    createdAt: '2025-12-25T14:00:00Z'
                }
            ]);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.origin || !formData.destination || !formData.departureDate) {
            alert('Please fill in all required fields');
            return;
        }
        try {
            const newRequest = {
                id: Date.now(),
                requestNumber: `GRP${Date.now().toString().slice(-6)}`,
                ...formData,
                status: 'pending',
                quotes: [],
                createdAt: new Date().toISOString()
            };
            setRequests([newRequest, ...requests]);
            setShowModal(false);
            resetForm();
            alert('Group booking request submitted successfully!');
        } catch (error) {
            console.error('Error creating request:', error);
        }
    };

    const handleAcceptQuote = async (requestId, quoteId) => {
        if (!window.confirm('Are you sure you want to accept this quote?')) return;
        setRequests(requests.map(r => {
            if (r.id === requestId) {
                return { ...r, status: 'accepted', selectedQuote: r.quotes.find(q => q.id === quoteId) };
            }
            return r;
        }));
        alert('Quote accepted! Payment details will be sent to your email.');
    };

    const resetForm = () => {
        setFormData({
            origin: '', destination: '', departureDate: '', returnDate: '',
            passengers: 10, cabinClass: 0, purpose: 'corporate',
            preferredAirlines: [], isFlexibleDate: false, flexibleDays: 2,
            specialRequirements: '', contactName: '', contactEmail: '', contactPhone: ''
        });
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            quoted: 'bg-purple-100 text-purple-800',
            accepted: 'bg-green-100 text-green-800',
            confirmed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Group Booking</h1>
                        <p className="text-gray-500">Request quotes for groups of 10+ passengers</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        New Group Request
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow p-4">
                        <p className="text-sm text-gray-500">Total Requests</p>
                        <p className="text-2xl font-bold">{requests.length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <p className="text-sm text-gray-500">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">{requests.filter(r => r.status === 'pending').length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <p className="text-sm text-gray-500">Quoted</p>
                        <p className="text-2xl font-bold text-purple-600">{requests.filter(r => r.status === 'quoted').length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <p className="text-sm text-gray-500">Confirmed</p>
                        <p className="text-2xl font-bold text-green-600">{requests.filter(r => r.status === 'confirmed').length}</p>
                    </div>
                </div>

                {/* Requests List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                            No group booking requests yet
                        </div>
                    ) : (
                        requests.map((request) => (
                            <div key={request.id} className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-semibold text-lg">{request.requestNumber}</span>
                                                {getStatusBadge(request.status)}
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                Created {new Date(request.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-lg">{request.passengers} Passengers</p>
                                            <p className="text-sm text-gray-500">{request.purpose}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-2xl font-bold">{request.origin}</p>
                                                <p className="text-sm text-gray-500">Origin</p>
                                            </div>
                                            <div className="flex-1 px-4">
                                                <div className="border-t-2 border-dashed border-gray-300"></div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold">{request.destination}</p>
                                                <p className="text-sm text-gray-500">Destination</p>
                                            </div>
                                        </div>
                                        <div className="mt-3 text-center">
                                            <p className="text-sm text-gray-600">
                                                {new Date(request.departureDate).toLocaleDateString('en-US', {
                                                    weekday: 'long', day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Quotes Section */}
                                    {request.quotes.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="font-medium mb-2">Available Quotes</h4>
                                            <div className="space-y-2">
                                                {request.quotes.map((quote) => (
                                                    <div key={quote.id} className="border rounded-lg p-3 flex justify-between items-center">
                                                        <div>
                                                            <p className="font-medium">{quote.airline}</p>
                                                            <p className="text-sm text-gray-500">
                                                                ₹{quote.farePerPax.toLocaleString()} per person
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold text-lg">₹{quote.totalFare.toLocaleString()}</p>
                                                            {request.status === 'quoted' && (
                                                                <button
                                                                    onClick={() => handleAcceptQuote(request.id, quote.id)}
                                                                    className="mt-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                                                >
                                                                    Accept Quote
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {request.status === 'pending' && (
                                        <p className="text-sm text-gray-500 italic">
                                            Quotes are being processed. You will receive options within 24-48 hours.
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* New Request Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8 p-6">
                        <h3 className="text-lg font-semibold mb-4">New Group Booking Request</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">From *</label>
                                <select
                                    value={formData.origin}
                                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Origin</option>
                                    <option value="DEL">New Delhi (DEL)</option>
                                    <option value="BOM">Mumbai (BOM)</option>
                                    <option value="BLR">Bangalore (BLR)</option>
                                    <option value="MAA">Chennai (MAA)</option>
                                    <option value="CCU">Kolkata (CCU)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">To *</label>
                                <select
                                    value={formData.destination}
                                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Destination</option>
                                    <option value="GOA">Goa (GOI)</option>
                                    <option value="DEL">New Delhi (DEL)</option>
                                    <option value="BOM">Mumbai (BOM)</option>
                                    <option value="BLR">Bangalore (BLR)</option>
                                    <option value="JAI">Jaipur (JAI)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date *</label>
                                <input
                                    type="date"
                                    value={formData.departureDate}
                                    onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                                <input
                                    type="date"
                                    value={formData.returnDate}
                                    onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Passengers *</label>
                                <input
                                    type="number"
                                    min="10"
                                    value={formData.passengers}
                                    onChange={(e) => setFormData({ ...formData, passengers: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                                <select
                                    value={formData.purpose}
                                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="corporate">Corporate</option>
                                    <option value="wedding">Wedding</option>
                                    <option value="tour">Tour</option>
                                    <option value="sports">Sports</option>
                                    <option value="educational">Educational</option>
                                    <option value="religious">Religious</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.isFlexibleDate}
                                        onChange={(e) => setFormData({ ...formData, isFlexibleDate: e.target.checked })}
                                        className="w-4 h-4 text-blue-600 rounded"
                                    />
                                    <span className="text-sm text-gray-700">Flexible with dates (±{formData.flexibleDays} days)</span>
                                </label>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Special Requirements</label>
                                <textarea
                                    value={formData.specialRequirements}
                                    onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    placeholder="e.g., Need seats together, vegetarian meals, wheelchair assistance..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                                <input
                                    type="text"
                                    value={formData.contactName}
                                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                                <input
                                    type="email"
                                    value={formData.contactEmail}
                                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => { setShowModal(false); resetForm(); }}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Submit Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupBooking;
