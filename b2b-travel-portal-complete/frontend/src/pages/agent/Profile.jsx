import React, { useState } from 'react';
import {
    UserCircleIcon,
    BuildingOfficeIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    IdentificationIcon,
    DocumentTextIcon,
    CameraIcon,
    PencilIcon,
    CheckCircleIcon,
    ShieldCheckIcon,
    KeyIcon,
    BellIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const AgentProfile = () => {
    const [activeTab, setActiveTab] = useState('business');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [profile, setProfile] = useState({
        // Personal Info
        firstName: 'Rajesh',
        lastName: 'Kumar',
        email: 'rajesh@abctravels.com',
        phone: '+91 9876543210',

        // Business Info
        companyName: 'ABC Travels',
        businessType: 'Travel Agency',
        gstNumber: '22AAAAA0000A1Z5',
        panNumber: 'ABCDE1234F',
        iataCode: 'IA1234',

        // Address
        address: '123 Travel Street, Suite 100',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India',

        // Bank Details
        bankName: 'HDFC Bank',
        accountNumber: 'XXXXXXXXXXXX1234',
        ifscCode: 'HDFC0001234',
        accountHolder: 'ABC Travels Pvt Ltd',

        // Documents
        panDocument: 'pan_card.pdf',
        gstDocument: 'gst_certificate.pdf',
        addressProof: 'address_proof.pdf'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const saveProfile = async () => {
        setLoading(true);
        try {
            await api.put('/agent/profile', profile);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update:', error);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'business', name: 'Business Info', icon: BuildingOfficeIcon },
        { id: 'personal', name: 'Personal Info', icon: UserCircleIcon },
        { id: 'bank', name: 'Bank Details', icon: IdentificationIcon },
        { id: 'documents', name: 'Documents', icon: DocumentTextIcon },
        { id: 'security', name: 'Security', icon: ShieldCheckIcon }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                                <BuildingOfficeIcon className="w-16 h-16 text-white" />
                            </div>
                            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                                <CameraIcon className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                        <div className="text-white">
                            <h1 className="text-2xl font-bold">{profile.companyName}</h1>
                            <p className="text-blue-100">{profile.businessType}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-blue-200">
                                <span>Agent ID: AG12345</span>
                                <span className="px-2 py-1 bg-green-500 text-white rounded-full text-xs">Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex gap-6">
                    {/* Sidebar */}
                    <div className="w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm p-4">
                            <nav className="space-y-1">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                                            activeTab === tab.id
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <tab.icon className="w-5 h-5" />
                                        <span className="font-medium">{tab.name}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {tabs.find(t => t.id === activeTab)?.name}
                                </h2>
                                {activeTab !== 'security' && activeTab !== 'documents' && (
                                    <button
                                        onClick={() => isEditing ? saveProfile() : setIsEditing(true)}
                                        disabled={loading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
                                    >
                                        {loading ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : isEditing ? (
                                            <>
                                                <CheckCircleIcon className="w-4 h-4" />
                                                Save
                                            </>
                                        ) : (
                                            <>
                                                <PencilIcon className="w-4 h-4" />
                                                Edit
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            {activeTab === 'business' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                        <input
                                            type="text"
                                            name="companyName"
                                            value={profile.companyName}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                                        <select
                                            name="businessType"
                                            value={profile.businessType}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-50"
                                        >
                                            <option>Travel Agency</option>
                                            <option>Tour Operator</option>
                                            <option>Corporate Travel</option>
                                            <option>Freelance Agent</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                                        <input
                                            type="text"
                                            name="gstNumber"
                                            value={profile.gstNumber}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                                        <input
                                            type="text"
                                            name="panNumber"
                                            value={profile.panNumber}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-50"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                        <textarea
                                            name="address"
                                            value={profile.address}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            rows={2}
                                            className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={profile.city}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={profile.state}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-50"
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'personal' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={profile.firstName}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={profile.lastName}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profile.email}
                                            disabled
                                            className="w-full px-4 py-3 border rounded-lg bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profile.phone}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-50"
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'bank' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                                        <input
                                            type="text"
                                            name="bankName"
                                            value={profile.bankName}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                                        <input
                                            type="text"
                                            name="accountNumber"
                                            value={profile.accountNumber}
                                            disabled
                                            className="w-full px-4 py-3 border rounded-lg bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                                        <input
                                            type="text"
                                            name="ifscCode"
                                            value={profile.ifscCode}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder</label>
                                        <input
                                            type="text"
                                            name="accountHolder"
                                            value={profile.accountHolder}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-50"
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'documents' && (
                                <div className="space-y-4">
                                    {[
                                        { name: 'PAN Card', file: profile.panDocument },
                                        { name: 'GST Certificate', file: profile.gstDocument },
                                        { name: 'Address Proof', file: profile.addressProof }
                                    ].map((doc, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <DocumentTextIcon className="w-8 h-8 text-gray-400" />
                                                <div>
                                                    <div className="font-medium text-gray-900">{doc.name}</div>
                                                    <div className="text-sm text-gray-500">{doc.file}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Verified</span>
                                                <button className="text-blue-600 text-sm hover:underline">View</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="space-y-6">
                                    <div className="p-4 border rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <KeyIcon className="w-6 h-6 text-gray-400" />
                                                <div>
                                                    <h3 className="font-medium text-gray-900">Password</h3>
                                                    <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                                                </div>
                                            </div>
                                            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                                                Change Password
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4 border rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <ShieldCheckIcon className="w-6 h-6 text-green-600" />
                                                <div>
                                                    <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                                                    <p className="text-sm text-gray-500">Enabled via Authenticator App</p>
                                                </div>
                                            </div>
                                            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                                                Manage
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentProfile;
