import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    DocumentTextIcon,
    GlobeAltIcon,
    CalendarIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ArrowRightIcon,
    DocumentArrowUpIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const VisaApplication = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        country: '',
        visaType: '',
        travelDate: '',
        travelers: 1,
        nationality: 'IN',
        purpose: 'tourism'
    });
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [loading, setLoading] = useState(false);

    const countries = [
        {
            code: 'US',
            name: 'United States',
            flag: '🇺🇸',
            processingTime: '3-5 weeks',
            visaTypes: [
                { type: 'B1/B2', name: 'Tourist/Business Visa', price: 12500, duration: '10 years' },
                { type: 'F1', name: 'Student Visa', price: 14000, duration: 'Course duration' }
            ],
            requirements: [
                'Valid passport (6 months validity)',
                'DS-160 confirmation page',
                'Passport size photographs',
                'Proof of financial support',
                'Travel itinerary',
                'Employment proof'
            ],
            difficulty: 'Medium'
        },
        {
            code: 'GB',
            name: 'United Kingdom',
            flag: '🇬🇧',
            processingTime: '15-20 days',
            visaTypes: [
                { type: 'Standard', name: 'Standard Visitor Visa', price: 8500, duration: '6 months' },
                { type: 'Long', name: 'Long-term Visit Visa', price: 28000, duration: '2 years' }
            ],
            requirements: [
                'Valid passport',
                'Completed online application',
                'Biometric appointment',
                'Financial documents',
                'Travel insurance',
                'Accommodation proof'
            ],
            difficulty: 'Medium'
        },
        {
            code: 'EU',
            name: 'Schengen (Europe)',
            flag: '🇪🇺',
            processingTime: '10-15 days',
            visaTypes: [
                { type: 'C', name: 'Short-stay Visa', price: 6500, duration: '90 days' },
                { type: 'D', name: 'Long-stay Visa', price: 9000, duration: '1 year' }
            ],
            requirements: [
                'Valid passport',
                'Visa application form',
                'Passport photographs',
                'Travel insurance (30,000 EUR)',
                'Flight reservation',
                'Hotel bookings',
                'Bank statements (3 months)'
            ],
            difficulty: 'Easy'
        },
        {
            code: 'AE',
            name: 'United Arab Emirates',
            flag: '🇦🇪',
            processingTime: '3-5 days',
            visaTypes: [
                { type: '14D', name: '14 Days Tourist Visa', price: 2999, duration: '14 days' },
                { type: '30D', name: '30 Days Tourist Visa', price: 4999, duration: '30 days' },
                { type: '90D', name: '90 Days Tourist Visa', price: 9999, duration: '90 days' }
            ],
            requirements: [
                'Valid passport (6 months validity)',
                'Passport size photograph',
                'Confirmed return ticket',
                'Passport front & back scan'
            ],
            difficulty: 'Easy'
        },
        {
            code: 'SG',
            name: 'Singapore',
            flag: '🇸🇬',
            processingTime: '3-5 days',
            visaTypes: [
                { type: 'Tourist', name: 'Tourist Visa', price: 3500, duration: '30 days' },
                { type: 'Multi', name: 'Multiple Entry Visa', price: 7000, duration: '2 years' }
            ],
            requirements: [
                'Valid passport',
                'Completed application form',
                'Recent photographs',
                'Travel itinerary',
                'Hotel reservation',
                'Bank statements'
            ],
            difficulty: 'Easy'
        },
        {
            code: 'AU',
            name: 'Australia',
            flag: '🇦🇺',
            processingTime: '15-25 days',
            visaTypes: [
                { type: '600', name: 'Visitor Visa', price: 11000, duration: '3-12 months' },
                { type: 'ETA', name: 'Electronic Travel Authority', price: 1500, duration: '1 year' }
            ],
            requirements: [
                'Valid passport',
                'Online application (ImmiAccount)',
                'Health examination (if required)',
                'Character documents',
                'Financial evidence',
                'Travel insurance'
            ],
            difficulty: 'Medium'
        }
    ];

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        setFormData({ ...formData, country: country.code });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await api.post('/visa/application', {
                ...formData,
                selectedCountry
            });
            navigate('/visa/checkout', {
                state: {
                    application: response.data?.application || formData,
                    country: selectedCountry
                }
            });
        } catch (error) {
            console.error('Error:', error);
            navigate('/visa/checkout', {
                state: {
                    application: formData,
                    country: selectedCountry
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return 'text-green-600 bg-green-100';
            case 'Medium': return 'text-yellow-600 bg-yellow-100';
            case 'Hard': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-2">Visa Services</h1>
                    <p className="text-indigo-100">Hassle-free visa processing for 100+ countries</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center gap-4">
                        {[
                            { num: 1, label: 'Select Country' },
                            { num: 2, label: 'Choose Visa Type' },
                            { num: 3, label: 'Travel Details' },
                            { num: 4, label: 'Documents' }
                        ].map((s, index) => (
                            <React.Fragment key={s.num}>
                                <div className="flex items-center gap-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                                        step >= s.num
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-200 text-gray-500'
                                    }`}>
                                        {step > s.num ? <CheckCircleIcon className="w-6 h-6" /> : s.num}
                                    </div>
                                    <span className={`text-sm hidden md:block ${
                                        step >= s.num ? 'text-indigo-600 font-medium' : 'text-gray-500'
                                    }`}>
                                        {s.label}
                                    </span>
                                </div>
                                {index < 3 && (
                                    <div className={`w-16 h-0.5 ${step > s.num ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Step 1: Select Country */}
                {step === 1 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Select Your Destination</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {countries.map(country => (
                                <div
                                    key={country.code}
                                    onClick={() => handleCountrySelect(country)}
                                    className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transition hover:shadow-lg ${
                                        selectedCountry?.code === country.code
                                            ? 'ring-2 ring-indigo-500'
                                            : ''
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-4xl">{country.flag}</span>
                                            <div>
                                                <h3 className="font-semibold text-lg">{country.name}</h3>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(country.difficulty)}`}>
                                                    {country.difficulty}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                        <ClockIcon className="w-4 h-4" />
                                        Processing: {country.processingTime}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Starting from ₹{Math.min(...country.visaTypes.map(v => v.price)).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={() => setStep(2)}
                                disabled={!selectedCountry}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue
                                <ArrowRightIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Choose Visa Type */}
                {step === 2 && selectedCountry && (
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-4xl">{selectedCountry.flag}</span>
                            <div>
                                <h2 className="text-2xl font-bold">{selectedCountry.name}</h2>
                                <p className="text-gray-600">Select your visa type</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {selectedCountry.visaTypes.map((visa, index) => (
                                <div
                                    key={index}
                                    onClick={() => setFormData({ ...formData, visaType: visa.type })}
                                    className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transition hover:shadow-lg ${
                                        formData.visaType === visa.type
                                            ? 'ring-2 ring-indigo-500'
                                            : ''
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-semibold text-lg">{visa.name}</h3>
                                            <p className="text-sm text-gray-600">Type: {visa.type}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-indigo-600">
                                                ₹{visa.price.toLocaleString()}
                                            </div>
                                            <div className="text-xs text-gray-500">per person</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <CalendarIcon className="w-4 h-4" />
                                        Validity: {visa.duration}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Requirements */}
                        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <DocumentTextIcon className="w-5 h-5 text-indigo-600" />
                                Required Documents
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {selectedCountry.requirements.map((req, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm">
                                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                        {req}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={() => setStep(1)}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                disabled={!formData.visaType}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50"
                            >
                                Continue
                                <ArrowRightIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Travel Details */}
                {step === 3 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Travel Details</h2>

                        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Planned Travel Date
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.travelDate}
                                        onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                                        min={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Visa processing takes {selectedCountry?.processingTime}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Number of Travelers
                                    </label>
                                    <select
                                        value={formData.travelers}
                                        onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) })}
                                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500"
                                    >
                                        {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                            <option key={n} value={n}>{n} Traveler{n > 1 ? 's' : ''}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Purpose of Visit
                                    </label>
                                    <select
                                        value={formData.purpose}
                                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="tourism">Tourism</option>
                                        <option value="business">Business</option>
                                        <option value="medical">Medical</option>
                                        <option value="education">Education</option>
                                        <option value="conference">Conference/Event</option>
                                        <option value="transit">Transit</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nationality
                                    </label>
                                    <select
                                        value={formData.nationality}
                                        onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="IN">India</option>
                                        <option value="PK">Pakistan</option>
                                        <option value="BD">Bangladesh</option>
                                        <option value="NP">Nepal</option>
                                        <option value="LK">Sri Lanka</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Warning */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
                            <div className="flex items-start gap-3">
                                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium text-yellow-800">Important Note</h4>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        Visa approval is at the sole discretion of the embassy/consulate. We assist with the application process but cannot guarantee approval.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={() => setStep(2)}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => setStep(4)}
                                disabled={!formData.travelDate}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50"
                            >
                                Continue
                                <ArrowRightIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Documents & Submit */}
                {step === 4 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Upload Documents</h2>

                        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {selectedCountry?.requirements.slice(0, 6).map((req, index) => (
                                    <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-400 transition cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <DocumentArrowUpIcon className="w-8 h-8 text-gray-400" />
                                            <div>
                                                <h4 className="font-medium text-sm">{req}</h4>
                                                <p className="text-xs text-gray-500">PDF, JPG, PNG (max 5MB)</p>
                                            </div>
                                        </div>
                                        <input type="file" className="hidden" />
                                    </div>
                                ))}
                            </div>

                            <p className="text-sm text-gray-500 mt-4">
                                * You can also upload documents later from your dashboard
                            </p>
                        </div>

                        {/* Summary */}
                        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                            <h3 className="font-semibold text-lg mb-4">Application Summary</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <div className="text-sm text-gray-500">Country</div>
                                    <div className="font-medium">{selectedCountry?.name}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Visa Type</div>
                                    <div className="font-medium">{formData.visaType}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Travelers</div>
                                    <div className="font-medium">{formData.travelers}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Travel Date</div>
                                    <div className="font-medium">{formData.travelDate}</div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-gray-500">Total Amount</div>
                                    <div className="text-2xl font-bold text-indigo-600">
                                        ₹{((selectedCountry?.visaTypes.find(v => v.type === formData.visaType)?.price || 0) * formData.travelers).toLocaleString()}
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500">
                                    Includes processing fee + service charge
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={() => setStep(3)}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Submit Application
                                        <ArrowRightIcon className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VisaApplication;
