import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    FunnelIcon,
    ArrowsUpDownIcon,
    ArrowLongRightIcon,
    ClockIcon,
    PaperAirplaneIcon,
    XMarkIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    BriefcaseIcon,
    CheckIcon,
    InformationCircleIcon,
    AdjustmentsHorizontalIcon,
    HeartIcon,
    ShareIcon,
    BellAlertIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import api from '../../services/api';

const FlightResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = location.state;

    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('price'); // price, duration, departure, arrival
    const [showFilters, setShowFilters] = useState(false);
    const [expandedFlight, setExpandedFlight] = useState(null);
    const [favorites, setFavorites] = useState([]);

    const [filters, setFilters] = useState({
        stops: [],
        airlines: [],
        departureTime: [],
        arrivalTime: [],
        priceRange: { min: 0, max: 50000 },
        refundable: false
    });

    const [availableFilters, setAvailableFilters] = useState({
        airlines: [],
        minPrice: 0,
        maxPrice: 50000
    });

    useEffect(() => {
        fetchFlights();
    }, []);

    const fetchFlights = async () => {
        setLoading(true);
        try {
            const response = await api.post('/flights/search', searchParams);
            setFlights(response.data.flights || mockFlights);
            setAvailableFilters(response.data.filters || {
                airlines: ['IndiGo', 'Air India', 'SpiceJet', 'Vistara', 'GoAir', 'AirAsia'],
                minPrice: 3500,
                maxPrice: 25000
            });
        } catch (error) {
            console.error('Error fetching flights:', error);
            setFlights(mockFlights);
            setAvailableFilters({
                airlines: ['IndiGo', 'Air India', 'SpiceJet', 'Vistara', 'GoAir', 'AirAsia'],
                minPrice: 3500,
                maxPrice: 25000
            });
        } finally {
            setLoading(false);
        }
    };

    const mockFlights = [
        {
            id: 'FL001',
            airline: 'IndiGo',
            airlineCode: '6E',
            flightNumber: '6E-2154',
            logo: '/airlines/indigo.png',
            departure: { time: '06:00', airport: 'DEL', city: 'Delhi', terminal: 'T1' },
            arrival: { time: '08:15', airport: 'BOM', city: 'Mumbai', terminal: 'T2' },
            duration: '2h 15m',
            stops: 0,
            price: 4599,
            seatsLeft: 5,
            refundable: false,
            baggage: { cabin: '7kg', checkin: '15kg' },
            amenities: ['meal', 'entertainment'],
            fareTypes: [
                { type: 'Saver', price: 4599, features: ['No cancellation', 'No changes', '15kg baggage'] },
                { type: 'Flexi', price: 5299, features: ['Cancellation ₹3500', 'Changes ₹3000', '20kg baggage'] },
                { type: 'Super Saver', price: 4199, features: ['No cancellation', 'No changes', '10kg baggage'] }
            ]
        },
        {
            id: 'FL002',
            airline: 'Air India',
            airlineCode: 'AI',
            flightNumber: 'AI-865',
            logo: '/airlines/airindia.png',
            departure: { time: '07:30', airport: 'DEL', city: 'Delhi', terminal: 'T3' },
            arrival: { time: '09:50', airport: 'BOM', city: 'Mumbai', terminal: 'T2' },
            duration: '2h 20m',
            stops: 0,
            price: 5299,
            seatsLeft: 12,
            refundable: true,
            baggage: { cabin: '8kg', checkin: '25kg' },
            amenities: ['meal', 'entertainment', 'wifi'],
            fareTypes: [
                { type: 'Economy Saver', price: 5299, features: ['Partial refund', 'Changes ₹2500', '25kg baggage'] },
                { type: 'Economy Flex', price: 6499, features: ['Full refund', 'Free changes', '30kg baggage'] }
            ]
        },
        {
            id: 'FL003',
            airline: 'Vistara',
            airlineCode: 'UK',
            flightNumber: 'UK-945',
            logo: '/airlines/vistara.png',
            departure: { time: '08:45', airport: 'DEL', city: 'Delhi', terminal: 'T3' },
            arrival: { time: '11:00', airport: 'BOM', city: 'Mumbai', terminal: 'T2' },
            duration: '2h 15m',
            stops: 0,
            price: 6199,
            seatsLeft: 8,
            refundable: true,
            baggage: { cabin: '7kg', checkin: '20kg' },
            amenities: ['meal', 'entertainment', 'wifi', 'usb'],
            fareTypes: [
                { type: 'Economy Lite', price: 6199, features: ['No refund', 'Changes ₹3000', '20kg baggage'] },
                { type: 'Economy', price: 7299, features: ['Partial refund', 'Changes ₹2000', '25kg baggage'] },
                { type: 'Premium Economy', price: 9999, features: ['Full refund', 'Free changes', '35kg baggage', 'Priority boarding'] }
            ]
        },
        {
            id: 'FL004',
            airline: 'SpiceJet',
            airlineCode: 'SG',
            flightNumber: 'SG-8177',
            logo: '/airlines/spicejet.png',
            departure: { time: '10:30', airport: 'DEL', city: 'Delhi', terminal: 'T3' },
            arrival: { time: '14:20', airport: 'BOM', city: 'Mumbai', terminal: 'T1' },
            duration: '3h 50m',
            stops: 1,
            stopDetails: [{ city: 'Jaipur', duration: '45m' }],
            price: 3799,
            seatsLeft: 3,
            refundable: false,
            baggage: { cabin: '7kg', checkin: '15kg' },
            amenities: ['meal'],
            fareTypes: [
                { type: 'SpiceSaver', price: 3799, features: ['No cancellation', 'No changes', '15kg baggage'] },
                { type: 'SpiceFlex', price: 4599, features: ['Cancellation ₹3000', 'Changes ₹2500', '20kg baggage'] }
            ]
        },
        {
            id: 'FL005',
            airline: 'IndiGo',
            airlineCode: '6E',
            flightNumber: '6E-6012',
            logo: '/airlines/indigo.png',
            departure: { time: '14:00', airport: 'DEL', city: 'Delhi', terminal: 'T1' },
            arrival: { time: '16:10', airport: 'BOM', city: 'Mumbai', terminal: 'T2' },
            duration: '2h 10m',
            stops: 0,
            price: 4899,
            seatsLeft: 15,
            refundable: false,
            baggage: { cabin: '7kg', checkin: '15kg' },
            amenities: ['meal'],
            fareTypes: [
                { type: 'Saver', price: 4899, features: ['No cancellation', 'No changes', '15kg baggage'] },
                { type: 'Flexi', price: 5599, features: ['Cancellation ₹3500', 'Changes ₹3000', '20kg baggage'] }
            ]
        },
        {
            id: 'FL006',
            airline: 'GoAir',
            airlineCode: 'G8',
            flightNumber: 'G8-314',
            logo: '/airlines/goair.png',
            departure: { time: '18:30', airport: 'DEL', city: 'Delhi', terminal: 'T3' },
            arrival: { time: '20:45', airport: 'BOM', city: 'Mumbai', terminal: 'T1' },
            duration: '2h 15m',
            stops: 0,
            price: 4299,
            seatsLeft: 7,
            refundable: false,
            baggage: { cabin: '7kg', checkin: '15kg' },
            amenities: [],
            fareTypes: [
                { type: 'Go Lite', price: 4299, features: ['No cancellation', 'No changes', '15kg baggage'] },
                { type: 'Go Smart', price: 4999, features: ['Cancellation ₹3000', 'Changes ₹2500', '20kg baggage'] }
            ]
        }
    ];

    const filterFlights = () => {
        let filtered = [...flights];

        // Filter by stops
        if (filters.stops.length > 0) {
            filtered = filtered.filter(f => filters.stops.includes(f.stops.toString()));
        }

        // Filter by airlines
        if (filters.airlines.length > 0) {
            filtered = filtered.filter(f => filters.airlines.includes(f.airline));
        }

        // Filter by price range
        filtered = filtered.filter(f =>
            f.price >= filters.priceRange.min && f.price <= filters.priceRange.max
        );

        // Filter by refundable
        if (filters.refundable) {
            filtered = filtered.filter(f => f.refundable);
        }

        // Filter by departure time
        if (filters.departureTime.length > 0) {
            filtered = filtered.filter(f => {
                const hour = parseInt(f.departure.time.split(':')[0]);
                return filters.departureTime.some(slot => {
                    if (slot === 'early') return hour >= 0 && hour < 6;
                    if (slot === 'morning') return hour >= 6 && hour < 12;
                    if (slot === 'afternoon') return hour >= 12 && hour < 18;
                    if (slot === 'evening') return hour >= 18 && hour < 24;
                    return false;
                });
            });
        }

        // Sort
        if (sortBy === 'price') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'duration') {
            filtered.sort((a, b) => {
                const durationA = parseInt(a.duration);
                const durationB = parseInt(b.duration);
                return durationA - durationB;
            });
        } else if (sortBy === 'departure') {
            filtered.sort((a, b) => a.departure.time.localeCompare(b.departure.time));
        } else if (sortBy === 'arrival') {
            filtered.sort((a, b) => a.arrival.time.localeCompare(b.arrival.time));
        }

        return filtered;
    };

    const toggleFilter = (type, value) => {
        setFilters(prev => ({
            ...prev,
            [type]: prev[type].includes(value)
                ? prev[type].filter(v => v !== value)
                : [...prev[type], value]
        }));
    };

    const toggleFavorite = (flightId) => {
        setFavorites(prev =>
            prev.includes(flightId)
                ? prev.filter(id => id !== flightId)
                : [...prev, flightId]
        );
    };

    const handleBookNow = (flight, fareType) => {
        navigate('/flights/booking', {
            state: {
                flight,
                fareType,
                searchParams,
                passengers: {
                    adults: searchParams?.adults || 1,
                    children: searchParams?.children || 0,
                    infants: searchParams?.infants || 0
                }
            }
        });
    };

    const filteredFlights = filterFlights();

    const timeSlots = [
        { key: 'early', label: 'Early Morning', time: '12AM - 6AM', icon: '🌙' },
        { key: 'morning', label: 'Morning', time: '6AM - 12PM', icon: '🌅' },
        { key: 'afternoon', label: 'Afternoon', time: '12PM - 6PM', icon: '☀️' },
        { key: 'evening', label: 'Evening', time: '6PM - 12AM', icon: '🌆' }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Searching best flights for you...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Search Summary Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="text-lg font-semibold flex items-center gap-3">
                                <span>{searchParams?.from?.split('(')[0]}</span>
                                <ArrowLongRightIcon className="w-6 h-6" />
                                <span>{searchParams?.to?.split('(')[0]}</span>
                            </div>
                            <div className="text-sm text-blue-100">
                                {searchParams?.departDate} | {(searchParams?.adults || 1) + (searchParams?.children || 0)} Traveler(s) | {searchParams?.cabinClass || 'Economy'}
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/flights')}
                            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition"
                        >
                            Modify Search
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex gap-6">
                    {/* Filters Sidebar */}
                    <div className={`w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white rounded-xl shadow-sm p-4 sticky top-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900">Filters</h3>
                                <button
                                    onClick={() => setFilters({
                                        stops: [],
                                        airlines: [],
                                        departureTime: [],
                                        arrivalTime: [],
                                        priceRange: { min: 0, max: 50000 },
                                        refundable: false
                                    })}
                                    className="text-sm text-blue-600 hover:text-blue-700"
                                >
                                    Clear All
                                </button>
                            </div>

                            {/* Stops Filter */}
                            <div className="border-b pb-4 mb-4">
                                <h4 className="font-medium text-gray-700 mb-3">Stops</h4>
                                <div className="space-y-2">
                                    {['0', '1', '2+'].map(stop => (
                                        <label key={stop} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filters.stops.includes(stop)}
                                                onChange={() => toggleFilter('stops', stop)}
                                                className="rounded text-blue-600"
                                            />
                                            <span className="text-sm text-gray-600">
                                                {stop === '0' ? 'Non-stop' : stop === '1' ? '1 Stop' : '2+ Stops'}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Airlines Filter */}
                            <div className="border-b pb-4 mb-4">
                                <h4 className="font-medium text-gray-700 mb-3">Airlines</h4>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {availableFilters.airlines.map(airline => (
                                        <label key={airline} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filters.airlines.includes(airline)}
                                                onChange={() => toggleFilter('airlines', airline)}
                                                className="rounded text-blue-600"
                                            />
                                            <span className="text-sm text-gray-600">{airline}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Departure Time Filter */}
                            <div className="border-b pb-4 mb-4">
                                <h4 className="font-medium text-gray-700 mb-3">Departure Time</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {timeSlots.map(slot => (
                                        <button
                                            key={slot.key}
                                            onClick={() => toggleFilter('departureTime', slot.key)}
                                            className={`p-2 rounded-lg text-xs text-center transition ${
                                                filters.departureTime.includes(slot.key)
                                                    ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                                                    : 'bg-gray-50 border border-gray-200 text-gray-600 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="text-lg mb-1">{slot.icon}</div>
                                            <div className="font-medium">{slot.label}</div>
                                            <div className="text-gray-500">{slot.time}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="border-b pb-4 mb-4">
                                <h4 className="font-medium text-gray-700 mb-3">Price Range</h4>
                                <div className="px-2">
                                    <input
                                        type="range"
                                        min={availableFilters.minPrice}
                                        max={availableFilters.maxPrice}
                                        value={filters.priceRange.max}
                                        onChange={(e) => setFilters(prev => ({
                                            ...prev,
                                            priceRange: { ...prev.priceRange, max: parseInt(e.target.value) }
                                        }))}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                                        <span>₹{filters.priceRange.min.toLocaleString()}</span>
                                        <span>₹{filters.priceRange.max.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Refundable Only */}
                            <div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.refundable}
                                        onChange={() => setFilters(prev => ({ ...prev, refundable: !prev.refundable }))}
                                        className="rounded text-blue-600"
                                    />
                                    <span className="text-sm text-gray-600">Refundable only</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="flex-1">
                        {/* Sort & Results Count */}
                        <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="lg:hidden flex items-center gap-2 px-3 py-2 border rounded-lg"
                                >
                                    <FunnelIcon className="w-5 h-5" />
                                    Filters
                                </button>
                                <span className="text-gray-600">
                                    <span className="font-semibold text-gray-900">{filteredFlights.length}</span> flights found
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Sort by:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="price">Price (Low to High)</option>
                                    <option value="duration">Duration (Shortest)</option>
                                    <option value="departure">Departure (Earliest)</option>
                                    <option value="arrival">Arrival (Earliest)</option>
                                </select>
                            </div>
                        </div>

                        {/* Quick Sort Pills */}
                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                            {[
                                { label: 'Cheapest', value: 'price', price: Math.min(...filteredFlights.map(f => f.price)) },
                                { label: 'Fastest', value: 'duration' },
                                { label: 'Non-stop', value: 'nonstop' },
                                { label: 'Morning Flights', value: 'morning' }
                            ].map(pill => (
                                <button
                                    key={pill.value}
                                    onClick={() => {
                                        if (pill.value === 'nonstop') {
                                            setFilters(prev => ({ ...prev, stops: ['0'] }));
                                        } else if (pill.value === 'morning') {
                                            setFilters(prev => ({ ...prev, departureTime: ['morning'] }));
                                        } else {
                                            setSortBy(pill.value);
                                        }
                                    }}
                                    className="flex-shrink-0 px-4 py-2 bg-white rounded-full text-sm font-medium border hover:border-blue-500 hover:text-blue-600 transition"
                                >
                                    {pill.label}
                                    {pill.price && <span className="text-green-600 ml-1">₹{pill.price?.toLocaleString()}</span>}
                                </button>
                            ))}
                        </div>

                        {/* Flight Cards */}
                        <div className="space-y-4">
                            {filteredFlights.map(flight => (
                                <div key={flight.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                    {/* Main Flight Info */}
                                    <div className="p-4">
                                        <div className="flex items-center gap-6">
                                            {/* Airline Logo & Info */}
                                            <div className="w-24 text-center">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                                    <PaperAirplaneIcon className="w-6 h-6 text-gray-400 rotate-45" />
                                                </div>
                                                <div className="text-sm font-medium text-gray-900">{flight.airline}</div>
                                                <div className="text-xs text-gray-500">{flight.flightNumber}</div>
                                            </div>

                                            {/* Flight Times */}
                                            <div className="flex-1 flex items-center gap-4">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-gray-900">{flight.departure.time}</div>
                                                    <div className="text-sm text-gray-500">{flight.departure.airport}</div>
                                                </div>

                                                <div className="flex-1 flex flex-col items-center px-4">
                                                    <div className="text-xs text-gray-500 mb-1">{flight.duration}</div>
                                                    <div className="w-full flex items-center">
                                                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                                                        <div className="flex-1 h-px bg-gray-300 relative">
                                                            {flight.stops > 0 && (
                                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-orange-500" />
                                                            )}
                                                        </div>
                                                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
                                                        {flight.stopDetails && ` (${flight.stopDetails.map(s => s.city).join(', ')})`}
                                                    </div>
                                                </div>

                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-gray-900">{flight.arrival.time}</div>
                                                    <div className="text-sm text-gray-500">{flight.arrival.airport}</div>
                                                </div>
                                            </div>

                                            {/* Price & Book */}
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-gray-900">₹{flight.price.toLocaleString()}</div>
                                                <div className="text-xs text-gray-500 mb-2">per adult</div>
                                                {flight.seatsLeft <= 5 && (
                                                    <div className="text-xs text-red-600 font-medium mb-2">
                                                        Only {flight.seatsLeft} seats left!
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => handleBookNow(flight, flight.fareTypes[0])}
                                                    className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition"
                                                >
                                                    Book Now
                                                </button>
                                            </div>
                                        </div>

                                        {/* Quick Info Tags */}
                                        <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <BriefcaseIcon className="w-4 h-4" />
                                                <span>Cabin: {flight.baggage.cabin}</span>
                                                <span className="mx-2">|</span>
                                                <span>Check-in: {flight.baggage.checkin}</span>
                                            </div>
                                            {flight.refundable && (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                                    Refundable
                                                </span>
                                            )}
                                            <div className="ml-auto flex items-center gap-2">
                                                <button
                                                    onClick={() => toggleFavorite(flight.id)}
                                                    className="p-2 hover:bg-gray-100 rounded-full transition"
                                                >
                                                    {favorites.includes(flight.id) ? (
                                                        <HeartSolidIcon className="w-5 h-5 text-red-500" />
                                                    ) : (
                                                        <HeartIcon className="w-5 h-5 text-gray-400" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => setExpandedFlight(expandedFlight === flight.id ? null : flight.id)}
                                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                >
                                                    {expandedFlight === flight.id ? 'Hide Details' : 'View Details'}
                                                    {expandedFlight === flight.id ? (
                                                        <ChevronUpIcon className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronDownIcon className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {expandedFlight === flight.id && (
                                        <div className="border-t bg-gray-50 p-4">
                                            <h4 className="font-semibold text-gray-900 mb-3">Choose Fare Type</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {flight.fareTypes.map((fare, index) => (
                                                    <div
                                                        key={index}
                                                        className="bg-white rounded-lg border p-4 hover:border-blue-500 transition cursor-pointer"
                                                        onClick={() => handleBookNow(flight, fare)}
                                                    >
                                                        <div className="flex items-center justify-between mb-3">
                                                            <span className="font-medium text-gray-900">{fare.type}</span>
                                                            <span className="text-lg font-bold text-blue-600">₹{fare.price.toLocaleString()}</span>
                                                        </div>
                                                        <ul className="space-y-2">
                                                            {fare.features.map((feature, idx) => (
                                                                <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                                                    <CheckIcon className="w-4 h-4 text-green-500" />
                                                                    {feature}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        <button className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">
                                                            Select
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {filteredFlights.length === 0 && (
                            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                                <PaperAirplaneIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No flights found</h3>
                                <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
                                <button
                                    onClick={() => setFilters({
                                        stops: [],
                                        airlines: [],
                                        departureTime: [],
                                        arrivalTime: [],
                                        priceRange: { min: 0, max: 50000 },
                                        refundable: false
                                    })}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightResults;
