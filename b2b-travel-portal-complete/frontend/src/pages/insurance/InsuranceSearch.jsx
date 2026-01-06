import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShieldCheckIcon,
    GlobeAltIcon,
    UserGroupIcon,
    CalendarIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const InsuranceSearch = () => {
    const navigate = useNavigate();
    const [insuranceType, setInsuranceType] = useState('travel');
    const [formData, setFormData] = useState({
        destination: '',
        departDate: '',
        returnDate: '',
        travelers: [{ age: '', preExisting: false }],
        tripType: 'single', // single, multi, annual
        coverage: 'standard' // basic, standard, premium
    });
    const [loading, setLoading] = useState(false);

    const insuranceTypes = [
        { id: 'travel', name: 'Travel Insurance', icon: GlobeAltIcon, description: 'Coverage for international & domestic trips' },
        { id: 'health', name: 'Health Insurance', icon: ShieldCheckIcon, description: 'Medical coverage for travelers' },
        { id: 'trip', name: 'Trip Cancellation', icon: XCircleIcon, description: 'Protection against trip cancellation' }
    ];

    const coverageOptions = [
        {
            id: 'basic',
            name: 'Basic Cover',
            price: 499,
            sumInsured: '₹5,00,000',
            features: [
                'Medical Expenses Coverage',
                'Trip Cancellation',
                'Baggage Loss',
                '24/7 Assistance'
            ],
            notIncluded: ['Adventure Sports', 'Pre-existing Conditions', 'Flight Delay']
        },
        {
            id: 'standard',
            name: 'Standard Cover',
            price: 999,
            sumInsured: '₹10,00,000',
            features: [
                'Medical Expenses Coverage',
                'Trip Cancellation',
                'Baggage Loss',
                '24/7 Assistance',
                'Flight Delay Cover',
                'Passport Loss',
                'Personal Accident'
            ],
            notIncluded: ['Adventure Sports', 'Pre-existing Conditions'],
            popular: true
        },
        {
            id: 'premium',
            name: 'Premium Cover',
            price: 1999,
            sumInsured: '₹25,00,000',
            features: [
                'Medical Expenses Coverage',
                'Trip Cancellation',
                'Baggage Loss',
                '24/7 Assistance',
                'Flight Delay Cover',
                'Passport Loss',
                'Personal Accident',
                'Adventure Sports Cover',
                'Pre-existing Conditions',
                'Home Burglary Cover'
            ],
            notIncluded: []
        }
    ];

    const popularDestinations = [
        { name: 'USA', code: 'US', zone: 'Worldwide' },
        { name: 'UK', code: 'GB', zone: 'Europe' },
        { name: 'UAE', code: 'AE', zone: 'Asia' },
        { name: 'Singapore', code: 'SG', zone: 'Asia' },
        { name: 'Thailand', code: 'TH', zone: 'Asia' },
        { name: 'Australia', code: 'AU', zone: 'Worldwide' }
    ];

    const addTraveler = () => {
        if (formData.travelers.length < 10) {
            setFormData({
                ...formData,
                travelers: [...formData.travelers, { age: '', preExisting: false }]
            });
        }
    };

    const removeTraveler = (index) => {
        if (formData.travelers.length > 1) {
            setFormData({
                ...formData,
                travelers: formData.travelers.filter((_, i) => i !== index)
            });
        }
    };

    const updateTraveler = (index, field, value) => {
        const newTravelers = [...formData.travelers];
        newTravelers[index][field] = value;
        setFormData({ ...formData, travelers: newTravelers });
    };

    const calculateTripDays = () => {
        if (!formData.departDate || !formData.returnDate) return 0;
        const start = new Date(formData.departDate);
        const end = new Date(formData.returnDate);
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    };

    const calculatePrice = (basePrice) => {
        const days = calculateTripDays();
        const travelers = formData.travelers.length;
        return basePrice * travelers * Math.max(1, Math.ceil(days / 7));
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            sessionStorage.setItem('insuranceParams', JSON.stringify({ ...formData, insuranceType }));
            navigate('/insurance/plans', { state: { searchParams: { ...formData, insuranceType } } });
        } finally {
            setLoading(false);
        }
    };

    const handleQuickBuy = (coverage) => {
        navigate('/insurance/checkout', {
            state: {
                searchParams: formData,
                selectedPlan: coverageOptions.find(c => c.id === coverage)
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-2">Travel Insurance</h1>
                    <p className="text-green-100">Protect your journey with comprehensive coverage</p>
                </div>
            </div>

            {/* Search Form */}
            <div className="max-w-7xl mx-auto px-4 -mt-8">
                <div className="bg-white rounded-xl shadow-xl p-6">
                    {/* Insurance Type Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {insuranceTypes.map(type => (
                            <button
                                key={type.id}
                                onClick={() => setInsuranceType(type.id)}
                                className={`p-4 rounded-lg border-2 text-left transition ${
                                    insuranceType === type.id
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <type.icon className={`w-8 h-8 mb-2 ${
                                    insuranceType === type.id ? 'text-green-600' : 'text-gray-400'
                                }`} />
                                <div className="font-semibold">{type.name}</div>
                                <div className="text-sm text-gray-600">{type.description}</div>
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSearch}>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Destination */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Destination
                                </label>
                                <select
                                    value={formData.destination}
                                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500"
                                    required
                                >
                                    <option value="">Select destination</option>
                                    <optgroup label="Asia">
                                        <option value="SG">Singapore</option>
                                        <option value="TH">Thailand</option>
                                        <option value="AE">UAE</option>
                                        <option value="MY">Malaysia</option>
                                    </optgroup>
                                    <optgroup label="Europe">
                                        <option value="GB">United Kingdom</option>
                                        <option value="FR">France</option>
                                        <option value="DE">Germany</option>
                                        <option value="EU">Schengen Countries</option>
                                    </optgroup>
                                    <optgroup label="Americas">
                                        <option value="US">USA</option>
                                        <option value="CA">Canada</option>
                                    </optgroup>
                                    <optgroup label="Others">
                                        <option value="AU">Australia</option>
                                        <option value="WW">Worldwide</option>
                                    </optgroup>
                                </select>
                            </div>

                            {/* Trip Start Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Trip Start Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.departDate}
                                    onChange={(e) => setFormData({ ...formData, departDate: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            {/* Trip End Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Trip End Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.returnDate}
                                    onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                                    min={formData.departDate || new Date().toISOString().split('T')[0]}
                                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            {/* Trip Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Trip Type
                                </label>
                                <select
                                    value={formData.tripType}
                                    onChange={(e) => setFormData({ ...formData, tripType: e.target.value })}
                                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="single">Single Trip</option>
                                    <option value="multi">Multi-Trip</option>
                                    <option value="annual">Annual Cover</option>
                                </select>
                            </div>
                        </div>

                        {/* Travelers */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-4">
                                <label className="text-sm font-medium text-gray-700">
                                    Travelers ({formData.travelers.length})
                                </label>
                                <button
                                    type="button"
                                    onClick={addTraveler}
                                    className="text-green-600 text-sm font-medium hover:underline"
                                >
                                    + Add Traveler
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {formData.travelers.map((traveler, index) => (
                                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-medium text-sm">Traveler {index + 1}</span>
                                            {index > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeTraveler(index)}
                                                    className="text-red-500 text-sm"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-xs text-gray-600">Age</label>
                                                <input
                                                    type="number"
                                                    value={traveler.age}
                                                    onChange={(e) => updateTraveler(index, 'age', e.target.value)}
                                                    placeholder="Enter age"
                                                    min="1"
                                                    max="99"
                                                    className="w-full border rounded px-3 py-2 mt-1"
                                                    required
                                                />
                                            </div>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={traveler.preExisting}
                                                    onChange={(e) => updateTraveler(index, 'preExisting', e.target.checked)}
                                                    className="rounded text-green-600"
                                                />
                                                <span className="text-sm text-gray-600">Pre-existing medical condition</span>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className="mt-6 flex justify-center">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        View Insurance Plans
                                        <ArrowRightIcon className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Coverage Options */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Coverage</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {coverageOptions.map(option => (
                        <div
                            key={option.id}
                            className={`bg-white rounded-xl shadow-md overflow-hidden relative ${
                                option.popular ? 'ring-2 ring-green-500' : ''
                            }`}
                        >
                            {option.popular && (
                                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
                                    Most Popular
                                </div>
                            )}
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-1">{option.name}</h3>
                                <div className="text-3xl font-bold text-green-600 mb-1">
                                    ₹{option.price}
                                    <span className="text-sm font-normal text-gray-500">/person/week</span>
                                </div>
                                <div className="text-sm text-gray-600 mb-4">
                                    Sum Insured: {option.sumInsured}
                                </div>

                                <div className="space-y-2 mb-6">
                                    {option.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm">
                                            <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                    {option.notIncluded.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                                            <XCircleIcon className="w-5 h-5" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handleQuickBuy(option.id)}
                                    className={`w-full py-3 rounded-lg font-semibold transition ${
                                        option.popular
                                            ? 'bg-green-600 hover:bg-green-700 text-white'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                                    }`}
                                >
                                    Select Plan
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-8 text-center">Why Choose Our Insurance?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { title: 'Instant Policy', desc: 'Get your policy document within minutes' },
                            { title: 'Cashless Claims', desc: 'Hassle-free cashless treatment worldwide' },
                            { title: '24/7 Assistance', desc: 'Round the clock support during your trip' },
                            { title: 'Easy Claims', desc: 'Simple online claims process' }
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ShieldCheckIcon className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="font-semibold mb-1">{item.title}</h3>
                                <p className="text-sm text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InsuranceSearch;
