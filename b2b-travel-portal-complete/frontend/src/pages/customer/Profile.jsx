import React, { useState } from 'react';
import {
    UserCircleIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    CalendarIcon,
    ShieldCheckIcon,
    CameraIcon,
    PencilIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    KeyIcon,
    BellIcon,
    CreditCardIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const CustomerProfile = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const [profile, setProfile] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phone: '+91 9876543210',
        dateOfBirth: '1990-05-15',
        gender: 'male',
        address: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India',
        passportNo: 'A1234567',
        passportExpiry: '2030-12-31',
        frequentFlyerNo: ''
    });

    const [notifications, setNotifications] = useState({
        email: true,
        sms: true,
        whatsapp: false,
        promotions: true,
        priceAlerts: true,
        bookingUpdates: true
    });

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleNotificationChange = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const saveProfile = async () => {
        setLoading(true);
        try {
            await api.put('/customer/profile', profile);
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Failed to update profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'profile', name: 'Personal Info', icon: UserCircleIcon },
        { id: 'security', name: 'Security', icon: ShieldCheckIcon },
        { id: 'notifications', name: 'Notifications', icon: BellIcon },
        { id: 'payment', name: 'Payment Methods', icon: CreditCardIcon },
        { id: 'preferences', name: 'Preferences', icon: GlobeAltIcon }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                                <UserCircleIcon className="w-20 h-20 text-white" />
                            </div>
                            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                                <CameraIcon className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                        <div className="text-white">
                            <h1 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h1>
                            <p className="text-blue-100">{profile.email}</p>
                            <p className="text-blue-200 text-sm mt-1">Member since January 2024</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {success && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700">
                        <CheckCircleIcon className="w-5 h-5" />
                        {success}
                    </div>
                )}

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
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
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
                                                Save Changes
                                            </>
                                        ) : (
                                            <>
                                                <PencilIcon className="w-4 h-4" />
                                                Edit Profile
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={profile.firstName}
                                            onChange={handleProfileChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={profile.lastName}
                                            onChange={handleProfileChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-50 focus:ring-2 focus:ring-blue-500"
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
                                        <p className="text-xs text-gray-500 mt-1">Contact support to change email</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profile.phone}
                                            onChange={handleProfileChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={profile.dateOfBirth}
                                            onChange={handleProfileChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                        <select
                                            name="gender"
                                            value={profile.gender}
                                            onChange={handleProfileChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Address</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={profile.address}
                                            onChange={handleProfileChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={profile.city}
                                            onChange={handleProfileChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={profile.state}
                                            onChange={handleProfileChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={profile.pincode}
                                            onChange={handleProfileChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={profile.country}
                                            disabled
                                            className="w-full px-4 py-3 border rounded-lg bg-gray-50"
                                        />
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Travel Documents</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                                        <input
                                            type="text"
                                            name="passportNo"
                                            value={profile.passportNo}
                                            onChange={handleProfileChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Passport Expiry</label>
                                        <input
                                            type="date"
                                            name="passportExpiry"
                                            value={profile.passportExpiry}
                                            onChange={handleProfileChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h2>

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
                                            <button className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50">
                                                Change Password
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-4 border rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <ShieldCheckIcon className="w-6 h-6 text-gray-400" />
                                                <div>
                                                    <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                                                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                                                </div>
                                            </div>
                                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                                                Enable
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-4 border rounded-lg">
                                        <h3 className="font-medium text-gray-900 mb-3">Active Sessions</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <div className="font-medium text-gray-900">Chrome on Windows</div>
                                                    <div className="text-sm text-gray-500">Mumbai, India • Current session</div>
                                                </div>
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-4">Notification Channels</h3>
                                        <div className="space-y-3">
                                            {[
                                                { key: 'email', label: 'Email Notifications' },
                                                { key: 'sms', label: 'SMS Notifications' },
                                                { key: 'whatsapp', label: 'WhatsApp Notifications' }
                                            ].map(item => (
                                                <label key={item.key} className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                                    <span className="font-medium text-gray-900">{item.label}</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={notifications[item.key]}
                                                        onChange={() => handleNotificationChange(item.key)}
                                                        className="w-5 h-5 rounded text-blue-600"
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-4">What to Notify</h3>
                                        <div className="space-y-3">
                                            {[
                                                { key: 'bookingUpdates', label: 'Booking Updates & Confirmations' },
                                                { key: 'priceAlerts', label: 'Price Drop Alerts' },
                                                { key: 'promotions', label: 'Offers & Promotions' }
                                            ].map(item => (
                                                <label key={item.key} className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                                    <span className="font-medium text-gray-900">{item.label}</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={notifications[item.key]}
                                                        onChange={() => handleNotificationChange(item.key)}
                                                        className="w-5 h-5 rounded text-blue-600"
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'payment' && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Methods</h2>

                                <div className="space-y-4">
                                    <div className="p-4 border rounded-lg flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
                                            <div>
                                                <div className="font-medium">•••• •••• •••• 4242</div>
                                                <div className="text-sm text-gray-500">Expires 12/25</div>
                                            </div>
                                        </div>
                                        <button className="text-red-600 text-sm hover:underline">Remove</button>
                                    </div>

                                    <button className="w-full p-4 border-2 border-dashed rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-600 transition">
                                        + Add New Payment Method
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'preferences' && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Travel Preferences</h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Seat</label>
                                        <select className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500">
                                            <option>Window</option>
                                            <option>Aisle</option>
                                            <option>Middle</option>
                                            <option>No Preference</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Meal Preference</label>
                                        <select className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500">
                                            <option>Vegetarian</option>
                                            <option>Non-Vegetarian</option>
                                            <option>Vegan</option>
                                            <option>No Preference</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Airlines</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., IndiGo, Air India"
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfile;
