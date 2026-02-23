import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MagnifyingGlassIcon,
    CalendarIcon,
    MapPinIcon,
    ArrowsRightLeftIcon,
    UserGroupIcon,
    SunIcon,
    MoonIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const BusSearch = () => {
    const navigate = useNavigate();
    const [tripType, setTripType] = useState('one_way');
    const [formData, setFormData] = useState({
        from: '',
        to: '',
        departDate: '',
        returnDate: '',
        passengers: 1
    });
    const [suggestions, setSuggestions] = useState({ from: [], to: [] });
    const [activeField, setActiveField] = useState(null);
    const [loading, setLoading] = useState(false);

    const popularRoutes = [
        { from: 'Delhi', to: 'Jaipur', price: 599, duration: '5h 30m' },
        { from: 'Mumbai', to: 'Pune', price: 399, duration: '3h 45m' },
        { from: 'Bangalore', to: 'Chennai', price: 799, duration: '6h 00m' },
        { from: 'Hyderabad', to: 'Bangalore', price: 899, duration: '8h 00m' },
        { from: 'Delhi', to: 'Agra', price: 499, duration: '4h 00m' },
        { from: 'Mumbai', to: 'Goa', price: 1299, duration: '10h 00m' }
    ];

    const popularCities = [
        'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
        'Pune', 'Jaipur', 'Ahmedabad', 'Lucknow', 'Goa', 'Chandigarh'
    ];

    const handleCitySearch = async (field, query) => {
        setFormData({ ...formData, [field]: query });
        setActiveField(field);

        if (query.length >= 2) {
            try {
                const response = await api.get(`/bus/cities?query=${query}`);
                setSuggestions({ ...suggestions, [field]: response.data.cities || [] });
            } catch (error) {
                // Fallback to local search
                const filtered = popularCities.filter(city =>
                    city.toLowerCase().includes(query.toLowerCase())
                );
                setSuggestions({ ...suggestions, [field]: filtered });
            }
        } else {
            setSuggestions({ ...suggestions, [field]: [] });
        }
    };

    const selectCity = (field, city) => {
        setFormData({ ...formData, [field]: city });
        setSuggestions({ ...suggestions, [field]: [] });
        setActiveField(null);
    };

    const swapCities = () => {
        setFormData({
            ...formData,
            from: formData.to,
            to: formData.from
        });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            sessionStorage.setItem('busSearchParams', JSON.stringify({ ...formData, tripType }));
            navigate('/bus/results', { state: { searchParams: { ...formData, tripType } } });
        } finally {
            setLoading(false);
        }
    };

    const busTypes = [
        { type: 'AC Sleeper', icon: MoonIcon, description: 'Premium comfort for overnight journeys' },
        { type: 'AC Seater', icon: SunIcon, description: 'Air-conditioned seater buses' },
        { type: 'Non-AC Sleeper', icon: MoonIcon, description: 'Budget-friendly sleeper option' },
        { type: 'Volvo Multi-Axle', icon: SunIcon, description: 'Luxury travel experience' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-2">Book Bus Tickets Online</h1>
                    <p className="text-orange-100">Search and book bus tickets at lowest prices</p>
                </div>
            </div>

            {/* Search Form */}
            <div className="max-w-7xl mx-auto px-4 -mt-8">
                <div className="bg-white rounded-xl shadow-xl p-6">
                    {/* Trip Type */}
                    <div className="flex gap-4 mb-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="tripType"
                                value="one_way"
                                checked={tripType === 'one_way'}
                                onChange={() => setTripType('one_way')}
                                className="text-orange-600"
                            />
                            <span className="font-medium">One Way</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="tripType"
                                value="round_trip"
                                checked={tripType === 'round_trip'}
                                onChange={() => setTripType('round_trip')}
                                className="text-orange-600"
                            />
                            <span className="font-medium">Round Trip</span>
                        </label>
                    </div>

                    <form onSubmit={handleSearch}>
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                            {/* From */}
                            <div className="md:col-span-2 relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                                <div className="relative">
                                    <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={formData.from}
                                        onChange={(e) => handleCitySearch('from', e.target.value)}
                                        onFocus={() => setActiveField('from')}
                                        placeholder="Enter origin city"
                                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        required
                                    />
                                </div>
                                {activeField === 'from' && suggestions.from.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                        {suggestions.from.map((city, index) => (
                                            <div
                                                key={index}
                                                onClick={() => selectCity('from', city)}
                                                className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                            >
                                                {city}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Swap Button */}
                            <div className="flex justify-center md:mt-6">
                                <button
                                    type="button"
                                    onClick={swapCities}
                                    className="p-2 rounded-full border hover:bg-gray-50 transition"
                                >
                                    <ArrowsRightLeftIcon className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>

                            {/* To */}
                            <div className="md:col-span-2 relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                                <div className="relative">
                                    <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={formData.to}
                                        onChange={(e) => handleCitySearch('to', e.target.value)}
                                        onFocus={() => setActiveField('to')}
                                        placeholder="Enter destination city"
                                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        required
                                    />
                                </div>
                                {activeField === 'to' && suggestions.to.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                        {suggestions.to.map((city, index) => (
                                            <div
                                                key={index}
                                                onClick={() => selectCity('to', city)}
                                                className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                            >
                                                {city}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Search Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <MagnifyingGlassIcon className="w-5 h-5" />
                                        Search Buses
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Date Selection */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
                                <div className="relative">
                                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="date"
                                        value={formData.departDate}
                                        onChange={(e) => setFormData({ ...formData, departDate: e.target.value })}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                                        required
                                    />
                                </div>
                            </div>

                            {tripType === 'round_trip' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="date"
                                            value={formData.returnDate}
                                            onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                                            min={formData.departDate || new Date().toISOString().split('T')[0]}
                                            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                                            required={tripType === 'round_trip'}
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
                                <div className="relative">
                                    <UserGroupIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <select
                                        value={formData.passengers}
                                        onChange={(e) => setFormData({ ...formData, passengers: parseInt(e.target.value) })}
                                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 appearance-none"
                                    >
                                        {[1,2,3,4,5,6].map(n => (
                                            <option key={n} value={n}>{n} Passenger{n > 1 ? 's' : ''}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Bus Types */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold mb-6">Bus Categories</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {busTypes.map((bus, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer">
                            <bus.icon className="w-10 h-10 text-orange-600 mb-4" />
                            <h3 className="font-semibold text-lg mb-1">{bus.type}</h3>
                            <p className="text-sm text-gray-600">{bus.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Popular Routes */}
            <div className="max-w-7xl mx-auto px-4 py-12 bg-white rounded-xl shadow-sm mb-8">
                <h2 className="text-2xl font-bold mb-6">Popular Bus Routes</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {popularRoutes.map((route, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                setFormData({ ...formData, from: route.from, to: route.to });
                            }}
                            className="border rounded-lg p-4 hover:border-orange-500 hover:bg-orange-50 cursor-pointer transition"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">{route.from}</span>
                                    <ArrowsRightLeftIcon className="w-4 h-4 text-gray-400" />
                                    <span className="font-semibold">{route.to}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">{route.duration}</span>
                                <span className="text-orange-600 font-semibold">Starting ₹{route.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Features */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { title: 'Live Tracking', desc: 'Track your bus in real-time' },
                        { title: 'Instant Refund', desc: 'Get refunds within 24 hours' },
                        { title: '24/7 Support', desc: 'Round the clock assistance' },
                        { title: 'Safe Travels', desc: 'Verified operators only' }
                    ].map((feature, index) => (
                        <div key={index} className="text-center">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-orange-600 text-xl font-bold">{index + 1}</span>
                            </div>
                            <h3 className="font-semibold">{feature.title}</h3>
                            <p className="text-sm text-gray-600">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BusSearch;
