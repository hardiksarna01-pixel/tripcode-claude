import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    EnvelopeIcon,
    LockClosedIcon,
    EyeIcon,
    EyeSlashIcon,
    ArrowRightIcon,
    ArrowLeftIcon,
    PhoneIcon,
    BuildingOfficeIcon,
    UserIcon,
    GlobeAltIcon,
    MapPinIcon,
    IdentificationIcon,
    CheckCircleIcon,
    DocumentTextIcon,
    CameraIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const Register = () => {
    const navigate = useNavigate();
    const [registerType, setRegisterType] = useState('agent'); // agent, customer
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        // Step 1 - Basic Info
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',

        // Step 2 - Business Details (Agent)
        companyName: '',
        businessType: 'travel_agency',
        gstNumber: '',
        panNumber: '',

        // Step 3 - Address
        address: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',

        // Step 4 - Documents
        panDocument: null,
        gstDocument: null,
        businessDocument: null,

        // Terms
        agreeTerms: false,
        agreeMarketing: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
        }));
        setError('');
    };

    const validateStep = () => {
        switch (currentStep) {
            case 1:
                if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
                    setError('Please fill all required fields');
                    return false;
                }
                if (formData.password !== formData.confirmPassword) {
                    setError('Passwords do not match');
                    return false;
                }
                if (formData.password.length < 8) {
                    setError('Password must be at least 8 characters');
                    return false;
                }
                break;
            case 2:
                if (registerType === 'agent' && !formData.companyName) {
                    setError('Company name is required');
                    return false;
                }
                break;
            case 3:
                if (!formData.address || !formData.city || !formData.state || !formData.pincode) {
                    setError('Please fill all address fields');
                    return false;
                }
                break;
            case 4:
                if (!formData.agreeTerms) {
                    setError('Please agree to terms and conditions');
                    return false;
                }
                break;
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep()) {
            setCurrentStep(prev => Math.min(prev + 1, registerType === 'agent' ? 4 : 3));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep()) return;

        setLoading(true);
        setError('');

        try {
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null) {
                    submitData.append(key, formData[key]);
                }
            });
            submitData.append('userType', registerType);

            const response = await api.post('/auth/register', submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                navigate('/login', {
                    state: {
                        message: registerType === 'agent'
                            ? 'Registration successful! Your account is pending approval.'
                            : 'Registration successful! Please login to continue.'
                    }
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const agentSteps = ['Basic Info', 'Business Details', 'Address', 'Documents'];
    const customerSteps = ['Basic Info', 'Address', 'Confirm'];

    const steps = registerType === 'agent' ? agentSteps : customerSteps;
    const totalSteps = steps.length;

    const indianStates = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
        'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
        'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
        'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
        'Delhi', 'Jammu and Kashmir', 'Ladakh'
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-2xl">
                {/* Logo */}
                <div className="text-center mb-6">
                    <Link to="/" className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                        <GlobeAltIcon className="w-8 h-8 text-white" />
                        <span className="text-2xl font-bold text-white">TripCode</span>
                    </Link>
                </div>

                {/* Registration Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
                        <p className="text-gray-600 mt-1">Join our travel partner network</p>
                    </div>

                    {/* Registration Type Tabs */}
                    <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => {
                                setRegisterType('agent');
                                setCurrentStep(1);
                            }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${
                                registerType === 'agent'
                                    ? 'bg-white text-blue-600 shadow'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <BuildingOfficeIcon className="w-4 h-4" />
                            Agent Registration
                        </button>
                        <button
                            onClick={() => {
                                setRegisterType('customer');
                                setCurrentStep(1);
                            }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${
                                registerType === 'customer'
                                    ? 'bg-white text-blue-600 shadow'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <UserIcon className="w-4 h-4" />
                            Customer Registration
                        </button>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-between mb-8">
                        {steps.map((step, index) => (
                            <React.Fragment key={index}>
                                <div className="flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                                        currentStep > index + 1
                                            ? 'bg-green-500 text-white'
                                            : currentStep === index + 1
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 text-gray-500'
                                    }`}>
                                        {currentStep > index + 1 ? (
                                            <CheckCircleIcon className="w-6 h-6" />
                                        ) : (
                                            index + 1
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-500 mt-1">{step}</span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`flex-1 h-1 mx-2 rounded ${
                                        currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                                    }`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Step 1 - Basic Info */}
                        {currentStep === 1 && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                                    <div className="relative">
                                        <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                    <div className="relative">
                                        <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                                    <div className="relative">
                                        <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        >
                                            {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                                    <div className="relative">
                                        <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        >
                                            {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2 - Business Details (Agent only) */}
                        {currentStep === 2 && registerType === 'agent' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                                    <div className="relative">
                                        <BuildingOfficeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Type *</label>
                                    <select
                                        name="businessType"
                                        value={formData.businessType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="travel_agency">Travel Agency</option>
                                        <option value="tour_operator">Tour Operator</option>
                                        <option value="corporate">Corporate Travel</option>
                                        <option value="freelancer">Freelance Agent</option>
                                        <option value="online_portal">Online Travel Portal</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                                    <div className="relative">
                                        <IdentificationIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="gstNumber"
                                            value={formData.gstNumber}
                                            onChange={handleChange}
                                            placeholder="22AAAAA0000A1Z5"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number *</label>
                                    <div className="relative">
                                        <IdentificationIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="panNumber"
                                            value={formData.panNumber}
                                            onChange={handleChange}
                                            placeholder="ABCDE1234F"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2/3 - Address */}
                        {((currentStep === 2 && registerType === 'customer') || (currentStep === 3 && registerType === 'agent')) && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                                    <div className="relative">
                                        <MapPinIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows={2}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                                        <select
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">Select State</option>
                                            {indianStates.map(state => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code *</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            maxLength={6}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            disabled
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4 - Documents (Agent only) */}
                        {currentStep === 4 && registerType === 'agent' && (
                            <div className="space-y-4">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                    <p className="text-sm text-blue-800">
                                        Upload clear copies of your documents for verification. Supported formats: PDF, JPG, PNG (Max 5MB each)
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">PAN Card *</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer">
                                        <input
                                            type="file"
                                            name="panDocument"
                                            onChange={handleChange}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            className="hidden"
                                            id="panDocument"
                                        />
                                        <label htmlFor="panDocument" className="cursor-pointer">
                                            <DocumentTextIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                            {formData.panDocument ? (
                                                <span className="text-green-600 font-medium">{formData.panDocument.name}</span>
                                            ) : (
                                                <span className="text-gray-500">Click to upload PAN Card</span>
                                            )}
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">GST Certificate (if applicable)</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer">
                                        <input
                                            type="file"
                                            name="gstDocument"
                                            onChange={handleChange}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            className="hidden"
                                            id="gstDocument"
                                        />
                                        <label htmlFor="gstDocument" className="cursor-pointer">
                                            <DocumentTextIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                            {formData.gstDocument ? (
                                                <span className="text-green-600 font-medium">{formData.gstDocument.name}</span>
                                            ) : (
                                                <span className="text-gray-500">Click to upload GST Certificate</span>
                                            )}
                                        </label>
                                    </div>
                                </div>
                                <div className="space-y-3 mt-6">
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="agreeTerms"
                                            checked={formData.agreeTerms}
                                            onChange={handleChange}
                                            className="rounded text-blue-600 mt-1"
                                        />
                                        <span className="text-sm text-gray-600">
                                            I agree to the <Link to="/terms" className="text-blue-600">Terms of Service</Link> and <Link to="/privacy" className="text-blue-600">Privacy Policy</Link> *
                                        </span>
                                    </label>
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="agreeMarketing"
                                            checked={formData.agreeMarketing}
                                            onChange={handleChange}
                                            className="rounded text-blue-600 mt-1"
                                        />
                                        <span className="text-sm text-gray-600">
                                            I would like to receive promotional emails and updates
                                        </span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Step 3 - Confirm (Customer only) */}
                        {currentStep === 3 && registerType === 'customer' && (
                            <div className="space-y-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-medium text-gray-900 mb-3">Review Your Information</h3>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <span className="text-gray-500">Name:</span>
                                            <span className="ml-2 font-medium">{formData.firstName} {formData.lastName}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Email:</span>
                                            <span className="ml-2 font-medium">{formData.email}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Phone:</span>
                                            <span className="ml-2 font-medium">{formData.phone}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">City:</span>
                                            <span className="ml-2 font-medium">{formData.city}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="agreeTerms"
                                            checked={formData.agreeTerms}
                                            onChange={handleChange}
                                            className="rounded text-blue-600 mt-1"
                                        />
                                        <span className="text-sm text-gray-600">
                                            I agree to the <Link to="/terms" className="text-blue-600">Terms of Service</Link> and <Link to="/privacy" className="text-blue-600">Privacy Policy</Link> *
                                        </span>
                                    </label>
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="agreeMarketing"
                                            checked={formData.agreeMarketing}
                                            onChange={handleChange}
                                            className="rounded text-blue-600 mt-1"
                                        />
                                        <span className="text-sm text-gray-600">
                                            I would like to receive promotional emails and updates
                                        </span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex gap-4 mt-8">
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                    <ArrowLeftIcon className="w-5 h-5" />
                                    Previous
                                </button>
                            )}
                            {currentStep < totalSteps ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    Next
                                    <ArrowRightIcon className="w-5 h-5" />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <CheckCircleIcon className="w-5 h-5" />
                                            Complete Registration
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center text-white/60 text-sm">
                    © 2024 TripCode. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default Register;
