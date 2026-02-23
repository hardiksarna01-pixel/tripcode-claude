import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    ArrowLongRightIcon,
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    IdentificationIcon,
    CalendarIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ShieldCheckIcon,
    PaperAirplaneIcon,
    ClockIcon,
    CreditCardIcon,
    BanknotesIcon,
    BuildingLibraryIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    InformationCircleIcon,
    TagIcon,
    TicketIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const FlightBooking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { flight, fareType, searchParams, passengers } = location.state || {};

    const [currentStep, setCurrentStep] = useState(1); // 1: Traveler Details, 2: Add-ons, 3: Review & Pay
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [promoCode, setPromoCode] = useState('');
    const [promoDiscount, setPromoDiscount] = useState(0);
    const [showFareBreakdown, setShowFareBreakdown] = useState(true);

    const [travelers, setTravelers] = useState([]);
    const [contactDetails, setContactDetails] = useState({
        email: '',
        phone: '',
        countryCode: '+91'
    });

    const [addOns, setAddOns] = useState({
        meals: [],
        seats: [],
        baggage: [],
        insurance: false,
        priorityBoarding: false,
        loungeAccess: false
    });

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('wallet');

    useEffect(() => {
        if (!flight) {
            navigate('/flights');
            return;
        }

        // Initialize travelers based on passenger count
        const travelersList = [];
        for (let i = 0; i < (passengers?.adults || 1); i++) {
            travelersList.push({ type: 'adult', title: '', firstName: '', lastName: '', dob: '', gender: '', nationality: 'Indian', passportNo: '', passportExpiry: '' });
        }
        for (let i = 0; i < (passengers?.children || 0); i++) {
            travelersList.push({ type: 'child', title: '', firstName: '', lastName: '', dob: '', gender: '', nationality: 'Indian', passportNo: '', passportExpiry: '' });
        }
        for (let i = 0; i < (passengers?.infants || 0); i++) {
            travelersList.push({ type: 'infant', title: '', firstName: '', lastName: '', dob: '', gender: '', nationality: 'Indian', passportNo: '', passportExpiry: '' });
        }
        setTravelers(travelersList);
    }, [flight, passengers, navigate]);

    const updateTraveler = (index, field, value) => {
        const updated = [...travelers];
        updated[index][field] = value;
        setTravelers(updated);
    };

    const calculateTotalPrice = () => {
        const basePrice = fareType?.price || flight?.price || 0;
        const adultPrice = basePrice * (passengers?.adults || 1);
        const childPrice = basePrice * 0.75 * (passengers?.children || 0);
        const infantPrice = basePrice * 0.1 * (passengers?.infants || 0);

        const addOnsTotal =
            (addOns.insurance ? 499 * travelers.length : 0) +
            (addOns.priorityBoarding ? 299 * travelers.length : 0) +
            (addOns.loungeAccess ? 1299 * travelers.length : 0);

        const subtotal = adultPrice + childPrice + infantPrice + addOnsTotal;
        const taxes = Math.round(subtotal * 0.12);
        const convenienceFee = 99;

        return {
            basePrice,
            adultPrice,
            childPrice,
            infantPrice,
            addOnsTotal,
            subtotal,
            taxes,
            convenienceFee,
            discount: promoDiscount,
            total: subtotal + taxes + convenienceFee - promoDiscount
        };
    };

    const applyPromoCode = () => {
        // Mock promo code validation
        if (promoCode.toUpperCase() === 'SAVE500') {
            setPromoDiscount(500);
        } else if (promoCode.toUpperCase() === 'FIRSTFLY') {
            setPromoDiscount(1000);
        } else {
            setError('Invalid promo code');
            setTimeout(() => setError(''), 3000);
        }
    };

    const validateStep = () => {
        if (currentStep === 1) {
            // Validate travelers
            for (const traveler of travelers) {
                if (!traveler.firstName || !traveler.lastName || !traveler.dob || !traveler.gender) {
                    setError('Please fill all traveler details');
                    return false;
                }
            }
            if (!contactDetails.email || !contactDetails.phone) {
                setError('Please provide contact details');
                return false;
            }
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep()) {
            setError('');
            setCurrentStep(prev => Math.min(prev + 1, 3));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleBooking = async () => {
        setLoading(true);
        setError('');

        try {
            const bookingData = {
                flight,
                fareType,
                travelers,
                contactDetails,
                addOns,
                paymentMethod: selectedPaymentMethod,
                pricing: calculateTotalPrice(),
                searchParams
            };

            const response = await api.post('/bookings/flights', bookingData);

            if (response.data.success) {
                navigate('/booking/confirmation', {
                    state: {
                        bookingId: response.data.bookingId,
                        pnr: response.data.pnr,
                        ...bookingData
                    }
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const pricing = calculateTotalPrice();

    const steps = [
        { num: 1, title: 'Traveler Details' },
        { num: 2, title: 'Add-ons' },
        { num: 3, title: 'Review & Pay' }
    ];

    const mealOptions = [
        { id: 'veg', name: 'Vegetarian', price: 350 },
        { id: 'nonveg', name: 'Non-Vegetarian', price: 400 },
        { id: 'jain', name: 'Jain Meal', price: 400 },
        { id: 'diabetic', name: 'Diabetic Meal', price: 450 }
    ];

    const paymentMethods = [
        { id: 'wallet', name: 'Wallet Balance', icon: BanknotesIcon, balance: 45600 },
        { id: 'card', name: 'Credit/Debit Card', icon: CreditCardIcon },
        { id: 'netbanking', name: 'Net Banking', icon: BuildingLibraryIcon },
        { id: 'upi', name: 'UPI', icon: PhoneIcon }
    ];

    if (!flight) return null;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <PaperAirplaneIcon className="w-6 h-6 rotate-45" />
                            <span className="font-semibold">{flight.flightNumber}</span>
                        </div>
                        <div className="flex items-center gap-3 text-lg">
                            <span>{flight.departure.city}</span>
                            <ArrowLongRightIcon className="w-6 h-6" />
                            <span>{flight.arrival.city}</span>
                        </div>
                        <div className="text-sm text-blue-100">
                            {searchParams?.departDate} | {flight.departure.time} - {flight.arrival.time}
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-center gap-4">
                        {steps.map((step, index) => (
                            <React.Fragment key={step.num}>
                                <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                        currentStep >= step.num
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-500'
                                    }`}>
                                        {currentStep > step.num ? (
                                            <CheckCircleIcon className="w-5 h-5" />
                                        ) : (
                                            step.num
                                        )}
                                    </div>
                                    <span className={`text-sm font-medium ${
                                        currentStep >= step.num ? 'text-blue-600' : 'text-gray-500'
                                    }`}>
                                        {step.title}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`w-16 h-1 rounded ${
                                        currentStep > step.num ? 'bg-blue-600' : 'bg-gray-200'
                                    }`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                        <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0" />
                        {error}
                    </div>
                )}

                <div className="flex gap-6">
                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Step 1: Traveler Details */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                {/* Travelers */}
                                {travelers.map((traveler, index) => (
                                    <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <UserIcon className="w-5 h-5 text-blue-600" />
                                            {traveler.type === 'adult' && `Adult ${index + 1}`}
                                            {traveler.type === 'child' && `Child ${index + 1 - (passengers?.adults || 1)}`}
                                            {traveler.type === 'infant' && `Infant ${index + 1 - (passengers?.adults || 1) - (passengers?.children || 0)}`}
                                            <span className="text-sm font-normal text-gray-500">
                                                ({traveler.type === 'adult' ? '12+ years' : traveler.type === 'child' ? '2-11 years' : 'Under 2 years'})
                                            </span>
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                                <select
                                                    value={traveler.title}
                                                    onChange={(e) => updateTraveler(index, 'title', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Select</option>
                                                    <option value="Mr">Mr</option>
                                                    <option value="Mrs">Mrs</option>
                                                    <option value="Ms">Ms</option>
                                                    <option value="Mstr">Master</option>
                                                    <option value="Miss">Miss</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                                <input
                                                    type="text"
                                                    value={traveler.firstName}
                                                    onChange={(e) => updateTraveler(index, 'firstName', e.target.value)}
                                                    placeholder="As per ID"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                                                <input
                                                    type="text"
                                                    value={traveler.lastName}
                                                    onChange={(e) => updateTraveler(index, 'lastName', e.target.value)}
                                                    placeholder="As per ID"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                                                <select
                                                    value={traveler.gender}
                                                    onChange={(e) => updateTraveler(index, 'gender', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Select</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                                                <input
                                                    type="date"
                                                    value={traveler.dob}
                                                    onChange={(e) => updateTraveler(index, 'dob', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                                                <select
                                                    value={traveler.nationality}
                                                    onChange={(e) => updateTraveler(index, 'nationality', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="Indian">Indian</option>
                                                    <option value="American">American</option>
                                                    <option value="British">British</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                                                <input
                                                    type="text"
                                                    value={traveler.passportNo}
                                                    onChange={(e) => updateTraveler(index, 'passportNo', e.target.value)}
                                                    placeholder="For international flights"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Contact Details */}
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <EnvelopeIcon className="w-5 h-5 text-blue-600" />
                                        Contact Details
                                        <span className="text-sm font-normal text-gray-500">(Booking confirmation will be sent here)</span>
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                                            <div className="relative">
                                                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="email"
                                                    value={contactDetails.email}
                                                    onChange={(e) => setContactDetails(prev => ({ ...prev, email: e.target.value }))}
                                                    placeholder="email@example.com"
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                            <div className="flex gap-2">
                                                <select
                                                    value={contactDetails.countryCode}
                                                    onChange={(e) => setContactDetails(prev => ({ ...prev, countryCode: e.target.value }))}
                                                    className="w-24 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="+91">+91</option>
                                                    <option value="+1">+1</option>
                                                    <option value="+44">+44</option>
                                                </select>
                                                <input
                                                    type="tel"
                                                    value={contactDetails.phone}
                                                    onChange={(e) => setContactDetails(prev => ({ ...prev, phone: e.target.value }))}
                                                    placeholder="Phone number"
                                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start gap-3">
                                        <InformationCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-blue-800">
                                            Your booking confirmation and e-ticket will be sent to this email address. Please ensure it's correct.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Add-ons */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                {/* Meals */}
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">Add Meals</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {mealOptions.map(meal => (
                                            <button
                                                key={meal.id}
                                                onClick={() => {
                                                    setAddOns(prev => ({
                                                        ...prev,
                                                        meals: prev.meals.includes(meal.id)
                                                            ? prev.meals.filter(m => m !== meal.id)
                                                            : [...prev.meals, meal.id]
                                                    }));
                                                }}
                                                className={`p-4 rounded-lg border-2 text-left transition ${
                                                    addOns.meals.includes(meal.id)
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <div className="text-2xl mb-2">🍽️</div>
                                                <div className="font-medium text-gray-900">{meal.name}</div>
                                                <div className="text-sm text-green-600">₹{meal.price}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Travel Insurance */}
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Travel Insurance</h3>
                                            <p className="text-gray-600 text-sm mb-3">
                                                Comprehensive coverage for trip cancellation, medical emergencies, and baggage loss.
                                            </p>
                                            <ul className="text-sm text-gray-600 space-y-1">
                                                <li className="flex items-center gap-2">
                                                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                                                    Trip Cancellation Cover up to ₹50,000
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                                                    Medical Emergency Cover up to ₹5,00,000
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                                                    Baggage Loss Cover up to ₹25,000
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-gray-900">₹499</div>
                                            <div className="text-sm text-gray-500">per person</div>
                                            <button
                                                onClick={() => setAddOns(prev => ({ ...prev, insurance: !prev.insurance }))}
                                                className={`mt-2 px-4 py-2 rounded-lg font-medium transition ${
                                                    addOns.insurance
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                                }`}
                                            >
                                                {addOns.insurance ? 'Added ✓' : 'Add'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Other Add-ons */}
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">More Add-ons</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                                            addOns.priorityBoarding ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                                        }`} onClick={() => setAddOns(prev => ({ ...prev, priorityBoarding: !prev.priorityBoarding }))}>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-medium text-gray-900">Priority Boarding</div>
                                                    <div className="text-sm text-gray-500">Be among the first to board</div>
                                                </div>
                                                <div className="text-lg font-bold text-green-600">₹299</div>
                                            </div>
                                        </div>
                                        <div className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                                            addOns.loungeAccess ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                                        }`} onClick={() => setAddOns(prev => ({ ...prev, loungeAccess: !prev.loungeAccess }))}>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-medium text-gray-900">Lounge Access</div>
                                                    <div className="text-sm text-gray-500">Relax before your flight</div>
                                                </div>
                                                <div className="text-lg font-bold text-green-600">₹1,299</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Review & Pay */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                {/* Trip Summary */}
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">Trip Summary</h3>
                                    <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
                                        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <PaperAirplaneIcon className="w-8 h-8 text-blue-600 rotate-45" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4">
                                                <span className="text-xl font-bold">{flight.departure.time}</span>
                                                <ArrowLongRightIcon className="w-6 h-6 text-gray-400" />
                                                <span className="text-xl font-bold">{flight.arrival.time}</span>
                                            </div>
                                            <div className="text-gray-600">
                                                {flight.departure.city} → {flight.arrival.city} | {flight.duration} | {flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop`}
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                {flight.airline} {flight.flightNumber} | {searchParams?.departDate}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Traveler Summary */}
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">Traveler Details</h3>
                                    <div className="space-y-3">
                                        {travelers.map((traveler, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <UserIcon className="w-5 h-5 text-gray-400" />
                                                    <div>
                                                        <div className="font-medium">{traveler.title} {traveler.firstName} {traveler.lastName}</div>
                                                        <div className="text-sm text-gray-500 capitalize">{traveler.type} | {traveler.gender}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Payment Methods */}
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
                                    <div className="space-y-3">
                                        {paymentMethods.map(method => (
                                            <label
                                                key={method.id}
                                                className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition ${
                                                    selectedPaymentMethod === method.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="radio"
                                                        name="paymentMethod"
                                                        value={method.id}
                                                        checked={selectedPaymentMethod === method.id}
                                                        onChange={() => setSelectedPaymentMethod(method.id)}
                                                        className="text-blue-600"
                                                    />
                                                    <method.icon className="w-6 h-6 text-gray-600" />
                                                    <span className="font-medium">{method.name}</span>
                                                </div>
                                                {method.balance && (
                                                    <span className="text-green-600 font-medium">₹{method.balance.toLocaleString()}</span>
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex gap-4 mt-6">
                            {currentStep > 1 && (
                                <button
                                    onClick={prevStep}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                                >
                                    ← Previous
                                </button>
                            )}
                            {currentStep < 3 ? (
                                <button
                                    onClick={nextStep}
                                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                                >
                                    Continue →
                                </button>
                            ) : (
                                <button
                                    onClick={handleBooking}
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <ShieldCheckIcon className="w-5 h-5" />
                                            Pay ₹{pricing.total.toLocaleString()} & Confirm
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Price Summary Sidebar */}
                    <div className="w-80 flex-shrink-0 hidden lg:block">
                        <div className="bg-white rounded-xl shadow-sm p-4 sticky top-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900">Fare Summary</h3>
                                <button
                                    onClick={() => setShowFareBreakdown(!showFareBreakdown)}
                                    className="text-blue-600"
                                >
                                    {showFareBreakdown ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
                                </button>
                            </div>

                            {showFareBreakdown && (
                                <div className="space-y-3 text-sm border-b pb-4 mb-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Base Fare ({passengers?.adults || 1} Adult{(passengers?.adults || 1) > 1 ? 's' : ''})</span>
                                        <span>₹{pricing.adultPrice.toLocaleString()}</span>
                                    </div>
                                    {passengers?.children > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Children ({passengers.children})</span>
                                            <span>₹{pricing.childPrice.toLocaleString()}</span>
                                        </div>
                                    )}
                                    {passengers?.infants > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Infants ({passengers.infants})</span>
                                            <span>₹{pricing.infantPrice.toLocaleString()}</span>
                                        </div>
                                    )}
                                    {pricing.addOnsTotal > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Add-ons</span>
                                            <span>₹{pricing.addOnsTotal.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Taxes & Fees</span>
                                        <span>₹{pricing.taxes.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Convenience Fee</span>
                                        <span>₹{pricing.convenienceFee}</span>
                                    </div>
                                    {pricing.discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Promo Discount</span>
                                            <span>-₹{pricing.discount}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-between text-lg font-bold mb-4">
                                <span>Total Amount</span>
                                <span className="text-blue-600">₹{pricing.total.toLocaleString()}</span>
                            </div>

                            {/* Promo Code */}
                            <div className="border-t pt-4">
                                <div className="flex items-center gap-2">
                                    <TagIcon className="w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        placeholder="Enter promo code"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={applyPromoCode}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {promoDiscount > 0 && (
                                    <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
                                        <CheckCircleIcon className="w-4 h-4" />
                                        Promo code applied! You saved ₹{promoDiscount}
                                    </div>
                                )}
                            </div>

                            {/* Security Badge */}
                            <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-center gap-2">
                                <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                                <span className="text-sm text-green-800">100% Secure Payment</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightBooking;
