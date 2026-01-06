import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MagnifyingGlassIcon,
    CalendarIcon,
    UserGroupIcon,
    BuildingOfficeIcon,
    MapPinIcon,
    StarIcon,
    AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const HotelSearch = () => {
    const navigate = useNavigate();
    const [searchType, setSearchType] = useState('city'); // city, area, property
    const [formData, setFormData] = useState({
        destination: '',
        checkIn: '',
        checkOut: '',
        rooms: 1,
        adults: 2,
        children: 0,
        nationality: 'IN',
        starRating: [],
        priceRange: { min: 0, max: 50000 },
        amenities: [],
        propertyType: []
    });
    const [roomDetails, setRoomDetails] = useState([
        { adults: 2, children: 0, childAges: [] }
    ]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const popularDestinations = [
        { city: 'Delhi', country: 'India', code: 'DEL', properties: 2450 },
        { city: 'Mumbai', country: 'India', code: 'BOM', properties: 3200 },
        { city: 'Goa', country: 'India', code: 'GOI', properties: 1850 },
        { city: 'Jaipur', country: 'India', code: 'JAI', properties: 980 },
        { city: 'Dubai', country: 'UAE', code: 'DXB', properties: 1520 },
        { city: 'Singapore', country: 'Singapore', code: 'SIN', properties: 890 },
        { city: 'Bangkok', country: 'Thailand', code: 'BKK', properties: 2100 },
        { city: 'Maldives', country: 'Maldives', code: 'MLE', properties: 320 }
    ];

    const amenitiesList = [
        'Free WiFi', 'Swimming Pool', 'Spa', 'Gym', 'Restaurant',
        'Bar', 'Room Service', 'Parking', 'Airport Transfer', 'Pet Friendly'
    ];

    const propertyTypes = [
        'Hotel', 'Resort', 'Villa', 'Apartment', 'Hostel',
        'Homestay', 'Guest House', 'Boutique Hotel'
    ];

    const handleDestinationSearch = async (query) => {
        setFormData({ ...formData, destination: query });
        if (query.length >= 2) {
            try {
                const response = await api.get(`/hotels/destinations?query=${query}`);
                setSuggestions(response.data.destinations || []);
            } catch (error) {
                // Fallback suggestions
                setSuggestions(popularDestinations.filter(d =>
                    d.city.toLowerCase().includes(query.toLowerCase())
                ));
            }
        } else {
            setSuggestions([]);
        }
    };

    const addRoom = () => {
        if (roomDetails.length < 6) {
            setRoomDetails([...roomDetails, { adults: 2, children: 0, childAges: [] }]);
            setFormData({ ...formData, rooms: formData.rooms + 1 });
        }
    };

    const removeRoom = (index) => {
        if (roomDetails.length > 1) {
            const newRooms = roomDetails.filter((_, i) => i !== index);
            setRoomDetails(newRooms);
            setFormData({ ...formData, rooms: formData.rooms - 1 });
        }
    };

    const updateRoom = (index, field, value) => {
        const newRooms = [...roomDetails];
        newRooms[index][field] = value;
        if (field === 'children') {
            newRooms[index].childAges = Array(value).fill(5);
        }
        setRoomDetails(newRooms);
    };

    const updateChildAge = (roomIndex, childIndex, age) => {
        const newRooms = [...roomDetails];
        newRooms[roomIndex].childAges[childIndex] = parseInt(age);
        setRoomDetails(newRooms);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const searchParams = {
                ...formData,
                roomDetails,
                searchType
            };

            // Store search params and navigate
            sessionStorage.setItem('hotelSearchParams', JSON.stringify(searchParams));
            navigate('/hotels/results', { state: { searchParams } });
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStarRating = (star) => {
        const ratings = formData.starRating.includes(star)
            ? formData.starRating.filter(r => r !== star)
            : [...formData.starRating, star];
        setFormData({ ...formData, starRating: ratings });
    };

    const toggleAmenity = (amenity) => {
        const amenities = formData.amenities.includes(amenity)
            ? formData.amenities.filter(a => a !== amenity)
            : [...formData.amenities, amenity];
        setFormData({ ...formData, amenities });
    };

    const togglePropertyType = (type) => {
        const types = formData.propertyType.includes(type)
            ? formData.propertyType.filter(t => t !== type)
            : [...formData.propertyType, type];
        setFormData({ ...formData, propertyType: types });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-2">Find Your Perfect Stay</h1>
                    <p className="text-blue-100">Search from 1M+ hotels worldwide at best prices</p>
                </div>
            </div>

            {/* Search Form */}
            <div className="max-w-7xl mx-auto px-4 -mt-8">
                <div className="bg-white rounded-xl shadow-xl p-6">
                    {/* Search Type Tabs */}
                    <div className="flex gap-4 mb-6">
                        {[
                            { id: 'city', label: 'City Search', icon: BuildingOfficeIcon },
                            { id: 'area', label: 'Area Search', icon: MapPinIcon },
                            { id: 'property', label: 'Property Name', icon: BuildingOfficeIcon }
                        ].map(type => (
                            <button
                                key={type.id}
                                onClick={() => setSearchType(type.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                                    searchType === type.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <type.icon className="w-5 h-5" />
                                {type.label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSearch}>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Destination */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {searchType === 'property' ? 'Property Name' : 'Destination'}
                                </label>
                                <div className="relative">
                                    <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={formData.destination}
                                        onChange={(e) => handleDestinationSearch(e.target.value)}
                                        placeholder={searchType === 'property' ? 'Enter hotel name' : 'Enter city or area'}
                                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                {suggestions.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {suggestions.map((item, index) => (
                                            <div
                                                key={index}
                                                onClick={() => {
                                                    setFormData({ ...formData, destination: item.city });
                                                    setSuggestions([]);
                                                }}
                                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-0"
                                            >
                                                <div className="font-medium">{item.city}</div>
                                                <div className="text-sm text-gray-500">
                                                    {item.country} • {item.properties} properties
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Check-in */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Check-in
                                </label>
                                <div className="relative">
                                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="date"
                                        value={formData.checkIn}
                                        onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Check-out */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Check-out
                                </label>
                                <div className="relative">
                                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="date"
                                        value={formData.checkOut}
                                        onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                                        min={formData.checkIn || new Date().toISOString().split('T')[0]}
                                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Search Button */}
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <MagnifyingGlassIcon className="w-5 h-5" />
                                            Search Hotels
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Room Details */}
                        <div className="mt-6 border-t pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <UserGroupIcon className="w-5 h-5" />
                                    Rooms & Guests
                                </h3>
                                <button
                                    type="button"
                                    onClick={addRoom}
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    + Add Room
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {roomDetails.map((room, index) => (
                                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-medium">Room {index + 1}</span>
                                            {roomDetails.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeRoom(index)}
                                                    className="text-red-500 text-sm"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs text-gray-600">Adults</label>
                                                <select
                                                    value={room.adults}
                                                    onChange={(e) => updateRoom(index, 'adults', parseInt(e.target.value))}
                                                    className="w-full border rounded px-2 py-1 mt-1"
                                                >
                                                    {[1,2,3,4].map(n => (
                                                        <option key={n} value={n}>{n}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-600">Children</label>
                                                <select
                                                    value={room.children}
                                                    onChange={(e) => updateRoom(index, 'children', parseInt(e.target.value))}
                                                    className="w-full border rounded px-2 py-1 mt-1"
                                                >
                                                    {[0,1,2,3].map(n => (
                                                        <option key={n} value={n}>{n}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        {room.children > 0 && (
                                            <div className="mt-3">
                                                <label className="text-xs text-gray-600">Child Ages</label>
                                                <div className="flex gap-2 mt-1">
                                                    {room.childAges.map((age, childIndex) => (
                                                        <select
                                                            key={childIndex}
                                                            value={age}
                                                            onChange={(e) => updateChildAge(index, childIndex, e.target.value)}
                                                            className="border rounded px-2 py-1 text-sm"
                                                        >
                                                            {Array.from({ length: 18 }, (_, i) => (
                                                                <option key={i} value={i}>{i} yrs</option>
                                                            ))}
                                                        </select>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Advanced Filters Toggle */}
                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                            >
                                <AdjustmentsHorizontalIcon className="w-5 h-5" />
                                {showFilters ? 'Hide' : 'Show'} Advanced Filters
                            </button>
                        </div>

                        {/* Advanced Filters */}
                        {showFilters && (
                            <div className="mt-4 border-t pt-4 space-y-4">
                                {/* Star Rating */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Star Rating
                                    </label>
                                    <div className="flex gap-2">
                                        {[5, 4, 3, 2, 1].map(star => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => toggleStarRating(star)}
                                                className={`flex items-center gap-1 px-3 py-1 rounded-full border transition ${
                                                    formData.starRating.includes(star)
                                                        ? 'bg-yellow-100 border-yellow-400 text-yellow-700'
                                                        : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                            >
                                                <StarIcon className="w-4 h-4 fill-current" />
                                                {star}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Property Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Property Type
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {propertyTypes.map(type => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => togglePropertyType(type)}
                                                className={`px-3 py-1 rounded-full border transition text-sm ${
                                                    formData.propertyType.includes(type)
                                                        ? 'bg-blue-100 border-blue-400 text-blue-700'
                                                        : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Amenities */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Amenities
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {amenitiesList.map(amenity => (
                                            <button
                                                key={amenity}
                                                type="button"
                                                onClick={() => toggleAmenity(amenity)}
                                                className={`px-3 py-1 rounded-full border transition text-sm ${
                                                    formData.amenities.includes(amenity)
                                                        ? 'bg-green-100 border-green-400 text-green-700'
                                                        : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                            >
                                                {amenity}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price Range (per night)
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="number"
                                            value={formData.priceRange.min}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                priceRange: { ...formData.priceRange, min: parseInt(e.target.value) }
                                            })}
                                            placeholder="Min"
                                            className="w-32 border rounded px-3 py-2"
                                        />
                                        <span className="text-gray-500">to</span>
                                        <input
                                            type="number"
                                            value={formData.priceRange.max}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                priceRange: { ...formData.priceRange, max: parseInt(e.target.value) }
                                            })}
                                            placeholder="Max"
                                            className="w-32 border rounded px-3 py-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* Popular Destinations */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold mb-6">Popular Destinations</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {popularDestinations.map((dest, index) => (
                        <div
                            key={index}
                            onClick={() => setFormData({ ...formData, destination: dest.city })}
                            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition group"
                        >
                            <div className="h-32 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                <BuildingOfficeIcon className="w-16 h-16 text-white/50 group-hover:scale-110 transition" />
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold">{dest.city}</h3>
                                <p className="text-sm text-gray-500">{dest.country}</p>
                                <p className="text-xs text-blue-600 mt-1">{dest.properties} properties</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HotelSearch;
