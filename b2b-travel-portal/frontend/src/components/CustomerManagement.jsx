import React, { useState, useEffect } from 'react';
import { customerApi } from '../services/api';

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        title: 'Mr',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: 'M',
        nationality: 'IN',
        passportNumber: '',
        passportExpiry: '',
        preferredSeat: 'window',
        mealPreference: 'regular',
        gstNumber: '',
        gstCompanyName: '',
        notes: ''
    });

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            // Mock data for demo
            setCustomers([
                {
                    id: 1, title: 'Mr', firstName: 'Rahul', lastName: 'Sharma',
                    email: 'rahul@email.com', phone: '+91 98765 43210',
                    dateOfBirth: '1985-03-15', passportNumber: 'J1234567',
                    bookingCount: 12, totalSpent: 145000, isFrequent: true,
                    lastBookingDate: '2025-12-26'
                },
                {
                    id: 2, title: 'Mrs', firstName: 'Priya', lastName: 'Sharma',
                    email: 'priya@email.com', phone: '+91 98765 43211',
                    dateOfBirth: '1988-07-22', passportNumber: 'K2345678',
                    bookingCount: 8, totalSpent: 95000, isFrequent: false,
                    lastBookingDate: '2025-12-25'
                },
                {
                    id: 3, title: 'Mr', firstName: 'Amit', lastName: 'Kumar',
                    email: 'amit@email.com', phone: '+91 87654 32109',
                    dateOfBirth: '1990-11-08', passportNumber: 'L3456789',
                    bookingCount: 5, totalSpent: 62000, isFrequent: false,
                    lastBookingDate: '2025-12-20'
                }
            ]);
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            if (editingCustomer) {
                setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...c, ...formData } : c));
            } else {
                setCustomers([...customers, { id: Date.now(), ...formData, bookingCount: 0, totalSpent: 0 }]);
            }
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error('Error saving customer:', error);
        }
    };

    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        setFormData(customer);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this customer?')) return;
        setCustomers(customers.filter(c => c.id !== id));
    };

    const resetForm = () => {
        setEditingCustomer(null);
        setFormData({
            title: 'Mr', firstName: '', lastName: '', email: '', phone: '',
            dateOfBirth: '', gender: 'M', nationality: 'IN', passportNumber: '',
            passportExpiry: '', preferredSeat: 'window', mealPreference: 'regular',
            gstNumber: '', gstCompanyName: '', notes: ''
        });
    };

    const filteredCustomers = customers.filter(c =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery)
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
                        <p className="text-gray-500">Manage your travelers and their preferences</p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setShowModal(true); }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Customer
                    </button>
                </div>

                {/* Search */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search by name, email, or phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                            Import CSV
                        </button>
                    </div>
                </div>

                {/* Customer Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loading ? (
                        <div className="col-span-full text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        </div>
                    ) : filteredCustomers.length === 0 ? (
                        <div className="col-span-full text-center py-8 text-gray-500">
                            No customers found
                        </div>
                    ) : (
                        filteredCustomers.map((customer) => (
                            <div key={customer.id} className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-600 font-semibold text-lg">
                                                {customer.firstName[0]}{customer.lastName[0]}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {customer.title} {customer.firstName} {customer.lastName}
                                            </h3>
                                            {customer.isFrequent && (
                                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                                                    Frequent Traveler
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleEdit(customer)}
                                            className="p-1 text-gray-400 hover:text-blue-600"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(customer.id)}
                                            className="p-1 text-gray-400 hover:text-red-600"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600 mb-4">
                                    <p className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        {customer.email}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        {customer.phone}
                                    </p>
                                    {customer.passportNumber && (
                                        <p className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                            </svg>
                                            Passport: {customer.passportNumber}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-between pt-4 border-t text-sm">
                                    <div>
                                        <p className="text-gray-500">Bookings</p>
                                        <p className="font-semibold text-gray-900">{customer.bookingCount}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-500">Total Spent</p>
                                        <p className="font-semibold text-gray-900">₹{customer.totalSpent.toLocaleString()}</p>
                                    </div>
                                </div>

                                <button className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm">
                                    Quick Book
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8 p-6">
                        <h3 className="text-lg font-semibold mb-4">
                            {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Personal Details */}
                            <div className="md:col-span-2">
                                <h4 className="font-medium text-gray-700 mb-2">Personal Details</h4>
                            </div>

                            <div className="grid grid-cols-3 gap-2 md:col-span-2">
                                <select
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Mr">Mr</option>
                                    <option value="Mrs">Mrs</option>
                                    <option value="Ms">Ms</option>
                                    <option value="Dr">Dr</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                <input
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                </select>
                            </div>

                            {/* Passport Details */}
                            <div className="md:col-span-2 mt-4">
                                <h4 className="font-medium text-gray-700 mb-2">Passport Details</h4>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                                <input
                                    type="text"
                                    value={formData.passportNumber}
                                    onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value.toUpperCase() })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Passport Expiry</label>
                                <input
                                    type="date"
                                    value={formData.passportExpiry}
                                    onChange={(e) => setFormData({ ...formData, passportExpiry: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Preferences */}
                            <div className="md:col-span-2 mt-4">
                                <h4 className="font-medium text-gray-700 mb-2">Preferences</h4>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Seat</label>
                                <select
                                    value={formData.preferredSeat}
                                    onChange={(e) => setFormData({ ...formData, preferredSeat: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="window">Window</option>
                                    <option value="aisle">Aisle</option>
                                    <option value="middle">No Preference</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Meal Preference</label>
                                <select
                                    value={formData.mealPreference}
                                    onChange={(e) => setFormData({ ...formData, mealPreference: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="regular">Regular</option>
                                    <option value="vegetarian">Vegetarian</option>
                                    <option value="vegan">Vegan</option>
                                    <option value="jain">Jain</option>
                                    <option value="halal">Halal</option>
                                </select>
                            </div>

                            {/* Notes */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    rows={2}
                                    placeholder="Any special requirements or notes..."
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
                                {editingCustomer ? 'Update' : 'Add'} Customer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerManagement;
