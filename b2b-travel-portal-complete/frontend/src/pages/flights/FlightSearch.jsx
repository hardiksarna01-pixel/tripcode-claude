import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MagnifyingGlassIcon,
    CalendarIcon,
    UserGroupIcon,
    ArrowsRightLeftIcon,
    PlusIcon,
    MinusIcon,
    XMarkIcon,
    ChevronDownIcon,
    MapPinIcon,
    ClockIcon,
    PaperAirplaneIcon,
    ArrowLongRightIcon,
    SparklesIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const FlightSearch = () => {
    const navigate = useNavigate();
    const [tripType, setTripType] = useState('oneway'); // oneway, roundtrip, multicity
    const [cabinClass, setCabinClass] = useState('economy'); // economy, premium_economy, business, first
    const [searchData, setSearchData] = useState({
        from: '',
        to: '',
        departDate: '',
        returnDate: '',
        adults: 1,
        children: 0,
        infants: 0
    });
    const [multiCityFlights, setMultiCityFlights] = useState([
        { from: '', to: '', date: '' },
        { from: '', to: '', date: '' }
    ]);
    const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
    const [showFromSuggestions, setShowFromSuggestions] = useState(false);
    const [showToSuggestions, setShowToSuggestions] = useState(false);
    const [fromSuggestions, setFromSuggestions] = useState([]);
    const [toSuggestions, setToSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const [popularRoutes, setPopularRoutes] = useState([]);

    const fromInputRef = useRef(null);
    const toInputRef = useRef(null);

    useEffect(() => {
        // Load recent searches from localStorage
        const saved = localStorage.getItem('recentFlightSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved).slice(0, 5));
        }

        // Mock popular routes
        setPopularRoutes([
            { from: 'DEL', fromCity: 'Delhi', to: 'BOM', toCity: 'Mumbai', price: 4599 },
            { from: 'BLR', fromCity: 'Bangalore', to: 'DEL', toCity: 'Delhi', price: 5299 },
            { from: 'BOM', fromCity: 'Mumbai', to: 'GOI', toCity: 'Goa', price: 3799 },
            { from: 'DEL', fromCity: 'Delhi', to: 'CCU', toCity: 'Kolkata', price: 4199 },
            { from: 'MAA', fromCity: 'Chennai', to: 'HYD', toCity: 'Hyderabad', price: 3599 },
            { from: 'BLR', fromCity: 'Bangalore', to: 'CCU', toCity: 'Kolkata', price: 5999 }
        ]);
    }, []);

    const airports = [
        { code: 'DEL', city: 'Delhi', name: 'Indira Gandhi International Airport', country: 'India' },
        { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj International Airport', country: 'India' },
        { code: 'BLR', city: 'Bangalore', name: 'Kempegowda International Airport', country: 'India' },
        { code: 'MAA', city: 'Chennai', name: 'Chennai International Airport', country: 'India' },
        { code: 'CCU', city: 'Kolkata', name: 'Netaji Subhas Chandra Bose International Airport', country: 'India' },
        { code: 'HYD', city: 'Hyderabad', name: 'Rajiv Gandhi International Airport', country: 'India' },
        { code: 'GOI', city: 'Goa', name: 'Goa International Airport', country: 'India' },
        { code: 'PNQ', city: 'Pune', name: 'Pune Airport', country: 'India' },
        { code: 'COK', city: 'Kochi', name: 'Cochin International Airport', country: 'India' },
        { code: 'AMD', city: 'Ahmedabad', name: 'Sardar Vallabhbhai Patel International Airport', country: 'India' },
        { code: 'JAI', city: 'Jaipur', name: 'Jaipur International Airport', country: 'India' },
        { code: 'LKO', city: 'Lucknow', name: 'Chaudhary Charan Singh International Airport', country: 'India' },
        { code: 'DXB', city: 'Dubai', name: 'Dubai International Airport', country: 'UAE' },
        { code: 'SIN', city: 'Singapore', name: 'Singapore Changi Airport', country: 'Singapore' },
        { code: 'BKK', city: 'Bangkok', name: 'Suvarnabhumi Airport', country: 'Thailand' },
        { code: 'LHR', city: 'London', name: 'Heathrow Airport', country: 'UK' },
        { code: 'JFK', city: 'New York', name: 'John F. Kennedy International Airport', country: 'USA' }
    ];

    const searchAirports = (query) => {
        if (!query || query.length < 2) return [];
        const lowerQuery = query.toLowerCase();
        return airports.filter(airport =>
            airport.code.toLowerCase().includes(lowerQuery) ||
            airport.city.toLowerCase().includes(lowerQuery) ||
            airport.name.toLowerCase().includes(lowerQuery)
        ).slice(0, 8);
    };

    const handleFromChange = (e) => {
        const value = e.target.value;
        setSearchData(prev => ({ ...prev, from: value }));
        setFromSuggestions(searchAirports(value));
        setShowFromSuggestions(true);
    };

    const handleToChange = (e) => {
        const value = e.target.value;
        setSearchData(prev => ({ ...prev, to: value }));
        setToSuggestions(searchAirports(value));
        setShowToSuggestions(true);
    };

    const selectFromAirport = (airport) => {
        setSearchData(prev => ({ ...prev, from: `${airport.city} (${airport.code})` }));
        setShowFromSuggestions(false);
        toInputRef.current?.focus();
    };

    const selectToAirport = (airport) => {
        setSearchData(prev => ({ ...prev, to: `${airport.city} (${airport.code})` }));
        setShowToSuggestions(false);
    };

    const swapCities = () => {
        setSearchData(prev => ({
            ...prev,
            from: prev.to,
            to: prev.from
        }));
    };

    const handlePassengerChange = (type, operation) => {
        setSearchData(prev => {
            const newValue = operation === 'add' ? prev[type] + 1 : Math.max(0, prev[type] - 1);

            // Validation
            if (type === 'adults' && newValue < 1) return prev;
            if (type === 'infants' && newValue > prev.adults) return prev;
            if (prev.adults + prev.children + (type === 'infants' ? 0 : newValue) > 9) return prev;

            return { ...prev, [type]: newValue };
        });
    };

    const getTotalPassengers = () => {
        return searchData.adults + searchData.children + searchData.infants;
    };

    const addMultiCityFlight = () => {
        if (multiCityFlights.length < 6) {
            setMultiCityFlights([...multiCityFlights, { from: '', to: '', date: '' }]);
        }
    };

    const removeMultiCityFlight = (index) => {
        if (multiCityFlights.length > 2) {
            setMultiCityFlights(multiCityFlights.filter((_, i) => i !== index));
        }
    };

    const updateMultiCityFlight = (index, field, value) => {
        const updated = [...multiCityFlights];
        updated[index][field] = value;
        setMultiCityFlights(updated);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);

        const searchParams = {
            tripType,
            cabinClass,
            ...searchData,
            multiCityFlights: tripType === 'multicity' ? multiCityFlights : undefined
        };

        // Save to recent searches
        const newRecent = [searchParams, ...recentSearches.slice(0, 4)];
        localStorage.setItem('recentFlightSearches', JSON.stringify(newRecent));

        // Navigate to results
        navigate('/flights/results', { state: searchParams });
    };

    const handlePopularRouteClick = (route) => {
        setSearchData(prev => ({
            ...prev,
            from: `${route.fromCity} (${route.from})`,
            to: `${route.toCity} (${route.to})`
        }));
    };

    const getTodayDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    const cabinClasses = [
        { value: 'economy', label: 'Economy', icon: '🪑' },
        { value: 'premium_economy', label: 'Premium Economy', icon: '💺' },
        { value: 'business', label: 'Business', icon: '🛋️' },
        { value: 'first', label: 'First Class', icon: '👑' }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Hero Section with Search */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 py-12">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Search & Book Flights
                        </h1>
                        <p className="text-xl text-blue-100">
                            Best fares from 100+ airlines worldwide
                        </p>
                    </div>

                    {/* Search Card */}
                    <div className="bg-white rounded-2xl shadow-2xl p-6">
                        {/* Trip Type & Cabin Class */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <div className="flex gap-2">
                                {['oneway', 'roundtrip', 'multicity'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setTripType(type)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                                            tripType === type
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {type === 'oneway' && 'One Way'}
                                        {type === 'roundtrip' && 'Round Trip'}
                                        {type === 'multicity' && 'Multi City'}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                {cabinClasses.map(cc => (
                                    <button
                                        key={cc.value}
                                        onClick={() => setCabinClass(cc.value)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1 ${
                                            cabinClass === cc.value
                                                ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                                                : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <span>{cc.icon}</span>
                                        <span className="hidden md:inline">{cc.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <form onSubmit={handleSearch}>
                            {tripType !== 'multicity' ? (
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
                                    {/* From */}
                                    <div className="md:col-span-3 relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                                        <div className="relative">
                                            <PaperAirplaneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 rotate-45" />
                                            <input
                                                ref={fromInputRef}
                                                type="text"
                                                value={searchData.from}
                                                onChange={handleFromChange}
                                                onFocus={() => setShowFromSuggestions(true)}
                                                placeholder="City or Airport"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        {showFromSuggestions && fromSuggestions.length > 0 && (
                                            <div className="absolute z-20 w-full mt-1 bg-white rounded-lg shadow-lg border max-h-72 overflow-y-auto">
                                                {fromSuggestions.map(airport => (
                                                    <button
                                                        key={airport.code}
                                                        type="button"
                                                        onClick={() => selectFromAirport(airport)}
                                                        className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-start gap-3"
                                                    >
                                                        <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <div className="font-medium">{airport.city} ({airport.code})</div>
                                                            <div className="text-sm text-gray-500">{airport.name}</div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Swap Button */}
                                    <div className="md:col-span-1 flex items-end justify-center pb-1">
                                        <button
                                            type="button"
                                            onClick={swapCities}
                                            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition"
                                        >
                                            <ArrowsRightLeftIcon className="w-5 h-5 text-gray-600" />
                                        </button>
                                    </div>

                                    {/* To */}
                                    <div className="md:col-span-3 relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                                        <div className="relative">
                                            <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                ref={toInputRef}
                                                type="text"
                                                value={searchData.to}
                                                onChange={handleToChange}
                                                onFocus={() => setShowToSuggestions(true)}
                                                placeholder="City or Airport"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        {showToSuggestions && toSuggestions.length > 0 && (
                                            <div className="absolute z-20 w-full mt-1 bg-white rounded-lg shadow-lg border max-h-72 overflow-y-auto">
                                                {toSuggestions.map(airport => (
                                                    <button
                                                        key={airport.code}
                                                        type="button"
                                                        onClick={() => selectToAirport(airport)}
                                                        className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-start gap-3"
                                                    >
                                                        <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <div className="font-medium">{airport.city} ({airport.code})</div>
                                                            <div className="text-sm text-gray-500">{airport.name}</div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Depart Date */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Departure</label>
                                        <div className="relative">
                                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="date"
                                                value={searchData.departDate}
                                                onChange={(e) => setSearchData(prev => ({ ...prev, departDate: e.target.value }))}
                                                min={getTodayDate()}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Return Date */}
                                    {tripType === 'roundtrip' && (
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Return</label>
                                            <div className="relative">
                                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="date"
                                                    value={searchData.returnDate}
                                                    onChange={(e) => setSearchData(prev => ({ ...prev, returnDate: e.target.value }))}
                                                    min={searchData.departDate || getTodayDate()}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Passengers */}
                                    <div className={`${tripType === 'roundtrip' ? 'md:col-span-1' : 'md:col-span-3'} relative`}>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Travelers</label>
                                        <button
                                            type="button"
                                            onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left flex items-center justify-between focus:ring-2 focus:ring-blue-500"
                                        >
                                            <span className="flex items-center gap-2">
                                                <UserGroupIcon className="w-5 h-5 text-gray-400" />
                                                <span>{getTotalPassengers()} Traveler{getTotalPassengers() > 1 ? 's' : ''}</span>
                                            </span>
                                            <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                                        </button>

                                        {showPassengerDropdown && (
                                            <div className="absolute z-20 w-72 mt-1 bg-white rounded-lg shadow-lg border p-4">
                                                {/* Adults */}
                                                <div className="flex items-center justify-between py-3 border-b">
                                                    <div>
                                                        <div className="font-medium">Adults</div>
                                                        <div className="text-sm text-gray-500">12+ years</div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => handlePassengerChange('adults', 'subtract')}
                                                            disabled={searchData.adults <= 1}
                                                            className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-50"
                                                        >
                                                            <MinusIcon className="w-4 h-4" />
                                                        </button>
                                                        <span className="w-6 text-center font-medium">{searchData.adults}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handlePassengerChange('adults', 'add')}
                                                            className="w-8 h-8 rounded-full border flex items-center justify-center"
                                                        >
                                                            <PlusIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Children */}
                                                <div className="flex items-center justify-between py-3 border-b">
                                                    <div>
                                                        <div className="font-medium">Children</div>
                                                        <div className="text-sm text-gray-500">2-11 years</div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => handlePassengerChange('children', 'subtract')}
                                                            disabled={searchData.children <= 0}
                                                            className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-50"
                                                        >
                                                            <MinusIcon className="w-4 h-4" />
                                                        </button>
                                                        <span className="w-6 text-center font-medium">{searchData.children}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handlePassengerChange('children', 'add')}
                                                            className="w-8 h-8 rounded-full border flex items-center justify-center"
                                                        >
                                                            <PlusIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Infants */}
                                                <div className="flex items-center justify-between py-3">
                                                    <div>
                                                        <div className="font-medium">Infants</div>
                                                        <div className="text-sm text-gray-500">Under 2 years</div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => handlePassengerChange('infants', 'subtract')}
                                                            disabled={searchData.infants <= 0}
                                                            className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-50"
                                                        >
                                                            <MinusIcon className="w-4 h-4" />
                                                        </button>
                                                        <span className="w-6 text-center font-medium">{searchData.infants}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handlePassengerChange('infants', 'add')}
                                                            disabled={searchData.infants >= searchData.adults}
                                                            className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-50"
                                                        >
                                                            <PlusIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassengerDropdown(false)}
                                                    className="w-full mt-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                                                >
                                                    Done
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* Multi City */
                                <div className="space-y-4 mb-4">
                                    {multiCityFlights.map((flight, index) => (
                                        <div key={index} className="flex items-end gap-4">
                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Flight {index + 1} - From
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={flight.from}
                                                        onChange={(e) => updateMultiCityFlight(index, 'from', e.target.value)}
                                                        placeholder="City or Airport"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                                                    <input
                                                        type="text"
                                                        value={flight.to}
                                                        onChange={(e) => updateMultiCityFlight(index, 'to', e.target.value)}
                                                        placeholder="City or Airport"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                                    <input
                                                        type="date"
                                                        value={flight.date}
                                                        onChange={(e) => updateMultiCityFlight(index, 'date', e.target.value)}
                                                        min={index > 0 ? multiCityFlights[index - 1].date || getTodayDate() : getTodayDate()}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            {index > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeMultiCityFlight(index)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                                >
                                                    <XMarkIcon className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {multiCityFlights.length < 6 && (
                                        <button
                                            type="button"
                                            onClick={addMultiCityFlight}
                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                        >
                                            <PlusIcon className="w-4 h-4" />
                                            Add Another Flight
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Search Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto md:px-12 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-lg"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <MagnifyingGlassIcon className="w-5 h-5" />
                                        Search Flights
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Popular Routes */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex items-center gap-2 mb-6">
                    <SparklesIcon className="w-6 h-6 text-orange-500" />
                    <h2 className="text-2xl font-bold text-gray-900">Popular Routes</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {popularRoutes.map((route, index) => (
                        <button
                            key={index}
                            onClick={() => handlePopularRouteClick(route)}
                            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <PaperAirplaneIcon className="w-6 h-6 text-blue-600 rotate-45" />
                                </div>
                                <div className="text-left">
                                    <div className="flex items-center gap-2 font-medium text-gray-900">
                                        <span>{route.fromCity}</span>
                                        <ArrowLongRightIcon className="w-4 h-4 text-gray-400" />
                                        <span>{route.toCity}</span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {route.from} → {route.to}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-500">Starting from</div>
                                <div className="text-lg font-bold text-green-600">₹{route.price.toLocaleString()}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Features */}
            <div className="bg-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { icon: '✈️', title: '100+ Airlines', desc: 'Compare fares from all major airlines' },
                            { icon: '💰', title: 'Best Prices', desc: 'Guaranteed lowest fares with price match' },
                            { icon: '🔒', title: 'Secure Booking', desc: '256-bit SSL encrypted transactions' },
                            { icon: '📱', title: '24/7 Support', desc: 'Round-the-clock customer assistance' }
                        ].map((feature, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl mb-3">{feature.icon}</div>
                                <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                                <p className="text-gray-600 text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center gap-2 mb-4">
                        <ClockIcon className="w-5 h-5 text-gray-500" />
                        <h3 className="text-lg font-semibold text-gray-900">Recent Searches</h3>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {recentSearches.map((search, index) => (
                            <button
                                key={index}
                                onClick={() => setSearchData(search)}
                                className="flex-shrink-0 bg-white rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition text-left"
                            >
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                    <span>{search.from?.split('(')[0]}</span>
                                    <ArrowLongRightIcon className="w-4 h-4 text-gray-400" />
                                    <span>{search.to?.split('(')[0]}</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {search.departDate} • {search.adults + search.children} travelers
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlightSearch;
