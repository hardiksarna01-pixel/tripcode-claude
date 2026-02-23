import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    StarIcon,
    MapPinIcon,
    AdjustmentsHorizontalIcon,
    HeartIcon,
    ArrowsUpDownIcon,
    WifiIcon,
    SparklesIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import api from '../../services/api';

const HotelResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        priceRange: [0, 50000],
        starRating: [],
        amenities: [],
        propertyType: [],
        userRating: 0,
        freeCancellation: false,
        breakfastIncluded: false
    });
    const [sortBy, setSortBy] = useState('recommended');
    const [showFilters, setShowFilters] = useState(true);
    const [favorites, setFavorites] = useState([]);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    const searchParams = location.state?.searchParams || JSON.parse(sessionStorage.getItem('hotelSearchParams') || '{}');

    useEffect(() => {
        fetchHotels();
    }, [filters, sortBy, page]);

    const fetchHotels = async () => {
        setLoading(true);
        try {
            const response = await api.post('/hotels/search', {
                ...searchParams,
                filters,
                sortBy,
                page,
                limit: 20
            });
            setHotels(response.data.hotels || mockHotels);
            setTotalResults(response.data.total || mockHotels.length);
        } catch (error) {
            console.error('Error fetching hotels:', error);
            setHotels(mockHotels);
            setTotalResults(mockHotels.length);
        } finally {
            setLoading(false);
        }
    };

    const mockHotels = [
        {
            id: 1,
            name: 'The Grand Palace Hotel',
            starRating: 5,
            location: 'Near City Center, Delhi',
            distance: '2.5 km from center',
            image: '/api/placeholder/400/250',
            userRating: 4.8,
            reviewCount: 2345,
            amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Gym', 'Restaurant', 'Bar'],
            price: 8500,
            originalPrice: 12000,
            discount: 29,
            freeCancellation: true,
            breakfastIncluded: true,
            roomsLeft: 3,
            propertyType: 'Hotel'
        },
        {
            id: 2,
            name: 'Comfort Inn & Suites',
            starRating: 4,
            location: 'Connaught Place, Delhi',
            distance: '0.5 km from center',
            image: '/api/placeholder/400/250',
            userRating: 4.5,
            reviewCount: 1823,
            amenities: ['Free WiFi', 'Restaurant', 'Room Service', 'Parking'],
            price: 4500,
            originalPrice: 5500,
            discount: 18,
            freeCancellation: true,
            breakfastIncluded: false,
            roomsLeft: 7,
            propertyType: 'Hotel'
        },
        {
            id: 3,
            name: 'Paradise Beach Resort',
            starRating: 5,
            location: 'Beachfront, Goa',
            distance: 'On the beach',
            image: '/api/placeholder/400/250',
            userRating: 4.9,
            reviewCount: 3456,
            amenities: ['Private Beach', 'Multiple Pools', 'Spa', 'Water Sports', 'Kids Club'],
            price: 15000,
            originalPrice: 22000,
            discount: 32,
            freeCancellation: true,
            breakfastIncluded: true,
            roomsLeft: 2,
            propertyType: 'Resort'
        },
        {
            id: 4,
            name: 'Budget Stay Express',
            starRating: 3,
            location: 'Paharganj, Delhi',
            distance: '3.2 km from center',
            image: '/api/placeholder/400/250',
            userRating: 4.0,
            reviewCount: 567,
            amenities: ['Free WiFi', 'AC Rooms', '24h Reception'],
            price: 1800,
            originalPrice: 2200,
            discount: 18,
            freeCancellation: false,
            breakfastIncluded: false,
            roomsLeft: 12,
            propertyType: 'Hotel'
        },
        {
            id: 5,
            name: 'Heritage Haveli',
            starRating: 4,
            location: 'Old City, Jaipur',
            distance: '1.8 km from center',
            image: '/api/placeholder/400/250',
            userRating: 4.7,
            reviewCount: 892,
            amenities: ['Rooftop Restaurant', 'Heritage Architecture', 'Cultural Shows', 'Pool'],
            price: 6500,
            originalPrice: 8000,
            discount: 19,
            freeCancellation: true,
            breakfastIncluded: true,
            roomsLeft: 5,
            propertyType: 'Boutique Hotel'
        }
    ];

    const toggleFavorite = (hotelId) => {
        setFavorites(prev =>
            prev.includes(hotelId)
                ? prev.filter(id => id !== hotelId)
                : [...prev, hotelId]
        );
    };

    const handleHotelSelect = (hotel) => {
        navigate(`/hotels/${hotel.id}`, {
            state: { hotel, searchParams }
        });
    };

    const sortOptions = [
        { value: 'recommended', label: 'Recommended' },
        { value: 'price_low', label: 'Price: Low to High' },
        { value: 'price_high', label: 'Price: High to Low' },
        { value: 'rating', label: 'Guest Rating' },
        { value: 'star_rating', label: 'Star Rating' },
        { value: 'distance', label: 'Distance from Center' }
    ];

    const amenityOptions = [
        'Free WiFi', 'Swimming Pool', 'Spa', 'Gym', 'Restaurant',
        'Bar', 'Parking', 'Airport Transfer', 'Pet Friendly', 'Room Service'
    ];

    const propertyTypeOptions = [
        'Hotel', 'Resort', 'Villa', 'Apartment', 'Hostel', 'Boutique Hotel'
    ];

    const renderStars = (count) => (
        <div className="flex">
            {Array.from({ length: 5 }, (_, i) => (
                <StarSolidIcon
                    key={i}
                    className={`w-4 h-4 ${i < count ? 'text-yellow-400' : 'text-gray-300'}`}
                />
            ))}
        </div>
    );

    const getRatingLabel = (rating) => {
        if (rating >= 4.5) return 'Excellent';
        if (rating >= 4.0) return 'Very Good';
        if (rating >= 3.5) return 'Good';
        return 'Average';
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Search Summary Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold">
                                Hotels in {searchParams.destination || 'Delhi'}
                            </h1>
                            <p className="text-sm text-gray-600">
                                {searchParams.checkIn} - {searchParams.checkOut} • {searchParams.rooms || 1} Room(s) • {totalResults} properties found
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/hotels')}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Modify Search
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex gap-6">
                    {/* Filters Sidebar */}
                    <div className={`w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} lg:block`}>
                        <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-semibold flex items-center gap-2">
                                    <AdjustmentsHorizontalIcon className="w-5 h-5" />
                                    Filters
                                </h2>
                                <button
                                    onClick={() => setFilters({
                                        priceRange: [0, 50000],
                                        starRating: [],
                                        amenities: [],
                                        propertyType: [],
                                        userRating: 0,
                                        freeCancellation: false,
                                        breakfastIncluded: false
                                    })}
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Clear All
                                </button>
                            </div>

                            {/* Price Range */}
                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-medium mb-3">Price per night</h3>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={filters.priceRange[0]}
                                        onChange={(e) => setFilters({
                                            ...filters,
                                            priceRange: [parseInt(e.target.value), filters.priceRange[1]]
                                        })}
                                        className="w-24 border rounded px-2 py-1 text-sm"
                                        placeholder="Min"
                                    />
                                    <span className="text-gray-500">-</span>
                                    <input
                                        type="number"
                                        value={filters.priceRange[1]}
                                        onChange={(e) => setFilters({
                                            ...filters,
                                            priceRange: [filters.priceRange[0], parseInt(e.target.value)]
                                        })}
                                        className="w-24 border rounded px-2 py-1 text-sm"
                                        placeholder="Max"
                                    />
                                </div>
                            </div>

                            {/* Star Rating */}
                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-medium mb-3">Star Rating</h3>
                                <div className="space-y-2">
                                    {[5, 4, 3, 2, 1].map(star => (
                                        <label key={star} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filters.starRating.includes(star)}
                                                onChange={() => {
                                                    const newRatings = filters.starRating.includes(star)
                                                        ? filters.starRating.filter(s => s !== star)
                                                        : [...filters.starRating, star];
                                                    setFilters({ ...filters, starRating: newRatings });
                                                }}
                                                className="rounded text-blue-600"
                                            />
                                            {renderStars(star)}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* User Rating */}
                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-medium mb-3">Guest Rating</h3>
                                <div className="space-y-2">
                                    {[
                                        { min: 4.5, label: 'Excellent (4.5+)' },
                                        { min: 4.0, label: 'Very Good (4.0+)' },
                                        { min: 3.5, label: 'Good (3.5+)' }
                                    ].map(rating => (
                                        <label key={rating.min} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="userRating"
                                                checked={filters.userRating === rating.min}
                                                onChange={() => setFilters({ ...filters, userRating: rating.min })}
                                                className="text-blue-600"
                                            />
                                            <span className="text-sm">{rating.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Property Type */}
                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-medium mb-3">Property Type</h3>
                                <div className="space-y-2">
                                    {propertyTypeOptions.map(type => (
                                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filters.propertyType.includes(type)}
                                                onChange={() => {
                                                    const newTypes = filters.propertyType.includes(type)
                                                        ? filters.propertyType.filter(t => t !== type)
                                                        : [...filters.propertyType, type];
                                                    setFilters({ ...filters, propertyType: newTypes });
                                                }}
                                                className="rounded text-blue-600"
                                            />
                                            <span className="text-sm">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Amenities */}
                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-medium mb-3">Amenities</h3>
                                <div className="space-y-2">
                                    {amenityOptions.map(amenity => (
                                        <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filters.amenities.includes(amenity)}
                                                onChange={() => {
                                                    const newAmenities = filters.amenities.includes(amenity)
                                                        ? filters.amenities.filter(a => a !== amenity)
                                                        : [...filters.amenities, amenity];
                                                    setFilters({ ...filters, amenities: newAmenities });
                                                }}
                                                className="rounded text-blue-600"
                                            />
                                            <span className="text-sm">{amenity}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Filters */}
                            <div>
                                <h3 className="font-medium mb-3">Quick Filters</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={filters.freeCancellation}
                                            onChange={(e) => setFilters({ ...filters, freeCancellation: e.target.checked })}
                                            className="rounded text-blue-600"
                                        />
                                        <span className="text-sm">Free Cancellation</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={filters.breakfastIncluded}
                                            onChange={(e) => setFilters({ ...filters, breakfastIncluded: e.target.checked })}
                                            className="rounded text-blue-600"
                                        />
                                        <span className="text-sm">Breakfast Included</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="flex-1">
                        {/* Sort Bar */}
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="lg:hidden flex items-center gap-2 text-gray-600"
                                >
                                    <AdjustmentsHorizontalIcon className="w-5 h-5" />
                                    Filters
                                </button>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-600">Sort by:</span>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                    >
                                        {sortOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Hotel Cards */}
                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                                        <div className="flex gap-4">
                                            <div className="w-64 h-48 bg-gray-200 rounded-lg" />
                                            <div className="flex-1 space-y-3">
                                                <div className="h-6 bg-gray-200 rounded w-3/4" />
                                                <div className="h-4 bg-gray-200 rounded w-1/2" />
                                                <div className="h-4 bg-gray-200 rounded w-1/4" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {hotels.map(hotel => (
                                    <div
                                        key={hotel.id}
                                        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
                                        onClick={() => handleHotelSelect(hotel)}
                                    >
                                        <div className="flex">
                                            {/* Image */}
                                            <div className="relative w-64 h-52 flex-shrink-0">
                                                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                                    <span className="text-white text-4xl font-bold">
                                                        {hotel.name.charAt(0)}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleFavorite(hotel.id);
                                                    }}
                                                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition"
                                                >
                                                    {favorites.includes(hotel.id) ? (
                                                        <HeartSolidIcon className="w-5 h-5 text-red-500" />
                                                    ) : (
                                                        <HeartIcon className="w-5 h-5 text-gray-400" />
                                                    )}
                                                </button>
                                                {hotel.discount > 0 && (
                                                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                                                        {hotel.discount}% OFF
                                                    </div>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 p-4">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            {renderStars(hotel.starRating)}
                                                            <span className="text-xs text-gray-500">{hotel.propertyType}</span>
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                                                            {hotel.name}
                                                        </h3>
                                                        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                                                            <MapPinIcon className="w-4 h-4" />
                                                            {hotel.location}
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-1">{hotel.distance}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="flex items-center gap-2">
                                                            <div>
                                                                <div className="text-sm font-medium text-green-600">
                                                                    {getRatingLabel(hotel.userRating)}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {hotel.reviewCount} reviews
                                                                </div>
                                                            </div>
                                                            <div className="bg-blue-600 text-white px-2 py-1 rounded font-bold">
                                                                {hotel.userRating}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Amenities */}
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {hotel.amenities.slice(0, 4).map((amenity, i) => (
                                                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                            {amenity}
                                                        </span>
                                                    ))}
                                                    {hotel.amenities.length > 4 && (
                                                        <span className="text-xs text-blue-600">
                                                            +{hotel.amenities.length - 4} more
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Tags */}
                                                <div className="flex items-center gap-3 mt-3">
                                                    {hotel.freeCancellation && (
                                                        <span className="flex items-center gap-1 text-xs text-green-600">
                                                            <CheckCircleIcon className="w-4 h-4" />
                                                            Free Cancellation
                                                        </span>
                                                    )}
                                                    {hotel.breakfastIncluded && (
                                                        <span className="flex items-center gap-1 text-xs text-orange-600">
                                                            <SparklesIcon className="w-4 h-4" />
                                                            Breakfast Included
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="w-48 bg-gray-50 p-4 flex flex-col justify-between border-l">
                                                <div>
                                                    {hotel.originalPrice > hotel.price && (
                                                        <div className="text-sm text-gray-500 line-through">
                                                            ₹{hotel.originalPrice.toLocaleString()}
                                                        </div>
                                                    )}
                                                    <div className="text-2xl font-bold text-gray-900">
                                                        ₹{hotel.price.toLocaleString()}
                                                    </div>
                                                    <div className="text-xs text-gray-500">per night</div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        + ₹{Math.round(hotel.price * 0.18).toLocaleString()} taxes
                                                    </div>
                                                </div>
                                                <div>
                                                    {hotel.roomsLeft <= 5 && (
                                                        <div className="text-xs text-red-600 mb-2">
                                                            Only {hotel.roomsLeft} rooms left!
                                                        </div>
                                                    )}
                                                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition">
                                                        View Deal
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && hotels.length > 0 && (
                            <div className="flex justify-center mt-8">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setPage(Math.max(1, page - 1))}
                                        disabled={page === 1}
                                        className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Previous
                                    </button>
                                    {[1, 2, 3, 4, 5].map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`w-10 h-10 rounded-lg ${
                                                page === p
                                                    ? 'bg-blue-600 text-white'
                                                    : 'border hover:bg-gray-50'
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setPage(page + 1)}
                                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelResults;
