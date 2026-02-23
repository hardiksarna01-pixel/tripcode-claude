import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    MapPinIcon,
    ClockIcon,
    StarIcon,
    WifiIcon,
    AdjustmentsHorizontalIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    TvIcon,
    BoltIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import api from '../../services/api';

const BusResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBus, setSelectedBus] = useState(null);
    const [filters, setFilters] = useState({
        busType: [],
        departureTime: [],
        priceRange: [0, 5000],
        rating: 0,
        amenities: []
    });
    const [sortBy, setSortBy] = useState('departure');

    const searchParams = location.state?.searchParams || JSON.parse(sessionStorage.getItem('busSearchParams') || '{}');

    useEffect(() => {
        fetchBuses();
    }, [filters, sortBy]);

    const fetchBuses = async () => {
        setLoading(true);
        try {
            const response = await api.post('/bus/search', {
                ...searchParams,
                filters,
                sortBy
            });
            setBuses(response.data.buses || mockBuses);
        } catch (error) {
            console.error('Error fetching buses:', error);
            setBuses(mockBuses);
        } finally {
            setLoading(false);
        }
    };

    const mockBuses = [
        {
            id: 1,
            operator: 'VRL Travels',
            busType: 'Volvo Multi-Axle Sleeper A/C',
            departureTime: '21:00',
            arrivalTime: '05:30',
            duration: '8h 30m',
            from: searchParams.from || 'Delhi',
            to: searchParams.to || 'Jaipur',
            rating: 4.5,
            reviewCount: 2345,
            price: 1299,
            seatsAvailable: 12,
            amenities: ['WiFi', 'Charging Point', 'Blanket', 'Water Bottle', 'Reading Light'],
            boardingPoints: [
                { name: 'ISBT Kashmere Gate', time: '21:00' },
                { name: 'Majnu Ka Tilla', time: '21:30' }
            ],
            droppingPoints: [
                { name: 'Sindhi Camp', time: '05:00' },
                { name: 'Railway Station', time: '05:30' }
            ],
            cancellationPolicy: 'Free cancellation before 12 hours',
            liveTracking: true
        },
        {
            id: 2,
            operator: 'Neeta Travels',
            busType: 'AC Seater/Sleeper (2+1)',
            departureTime: '22:30',
            arrivalTime: '06:00',
            duration: '7h 30m',
            from: searchParams.from || 'Delhi',
            to: searchParams.to || 'Jaipur',
            rating: 4.2,
            reviewCount: 1823,
            price: 899,
            seatsAvailable: 5,
            amenities: ['Charging Point', 'Blanket', 'Water Bottle'],
            boardingPoints: [
                { name: 'Dhaula Kuan', time: '22:30' },
                { name: 'Karol Bagh', time: '23:00' }
            ],
            droppingPoints: [
                { name: 'MI Road', time: '05:30' },
                { name: 'Bus Stand', time: '06:00' }
            ],
            cancellationPolicy: 'Partial refund available',
            liveTracking: true
        },
        {
            id: 3,
            operator: 'RSRTC',
            busType: 'Non-AC Seater',
            departureTime: '06:00',
            arrivalTime: '11:30',
            duration: '5h 30m',
            from: searchParams.from || 'Delhi',
            to: searchParams.to || 'Jaipur',
            rating: 3.8,
            reviewCount: 567,
            price: 399,
            seatsAvailable: 28,
            amenities: [],
            boardingPoints: [
                { name: 'ISBT Kashmere Gate', time: '06:00' }
            ],
            droppingPoints: [
                { name: 'Sindhi Camp', time: '11:30' }
            ],
            cancellationPolicy: 'No refund',
            liveTracking: false
        },
        {
            id: 4,
            operator: 'Orange Travels',
            busType: 'Volvo AC Sleeper',
            departureTime: '20:00',
            arrivalTime: '04:00',
            duration: '8h 00m',
            from: searchParams.from || 'Delhi',
            to: searchParams.to || 'Jaipur',
            rating: 4.7,
            reviewCount: 3456,
            price: 1499,
            seatsAvailable: 3,
            amenities: ['WiFi', 'TV', 'Charging Point', 'Blanket', 'Snacks', 'Water Bottle'],
            boardingPoints: [
                { name: 'Connaught Place', time: '20:00' },
                { name: 'Rajiv Chowk', time: '20:30' }
            ],
            droppingPoints: [
                { name: 'Jhotwara', time: '03:30' },
                { name: 'Pink City Mall', time: '04:00' }
            ],
            cancellationPolicy: 'Free cancellation before 24 hours',
            liveTracking: true
        }
    ];

    const busTypeOptions = ['AC Sleeper', 'Non-AC Sleeper', 'AC Seater', 'Volvo', 'Multi-Axle'];
    const timeSlots = [
        { label: 'Before 6 AM', value: 'early_morning' },
        { label: '6 AM - 12 PM', value: 'morning' },
        { label: '12 PM - 6 PM', value: 'afternoon' },
        { label: 'After 6 PM', value: 'evening' }
    ];
    const amenityOptions = ['WiFi', 'Charging Point', 'Blanket', 'TV', 'Water Bottle', 'Live Tracking'];

    const handleBooking = (bus) => {
        navigate(`/bus/seats/${bus.id}`, {
            state: { bus, searchParams }
        });
    };

    const renderRating = (rating) => (
        <div className="flex items-center gap-1">
            <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                    <StarSolidIcon
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                ))}
            </div>
            <span className="text-sm font-medium">{rating}</span>
        </div>
    );

    const sortOptions = [
        { value: 'departure', label: 'Departure Time' },
        { value: 'duration', label: 'Duration' },
        { value: 'price_low', label: 'Price: Low to High' },
        { value: 'price_high', label: 'Price: High to Low' },
        { value: 'rating', label: 'Rating' }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold">
                                {searchParams.from} → {searchParams.to}
                            </h1>
                            <p className="text-sm text-gray-600">
                                {searchParams.departDate} • {searchParams.passengers || 1} Passenger(s) • {buses.length} buses found
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/bus')}
                            className="text-orange-600 hover:text-orange-700 font-medium"
                        >
                            Modify Search
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex gap-6">
                    {/* Filters */}
                    <div className="w-72 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-semibold flex items-center gap-2">
                                    <AdjustmentsHorizontalIcon className="w-5 h-5" />
                                    Filters
                                </h2>
                                <button
                                    onClick={() => setFilters({
                                        busType: [],
                                        departureTime: [],
                                        priceRange: [0, 5000],
                                        rating: 0,
                                        amenities: []
                                    })}
                                    className="text-sm text-orange-600"
                                >
                                    Clear All
                                </button>
                            </div>

                            {/* Bus Type */}
                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-medium mb-3">Bus Type</h3>
                                <div className="space-y-2">
                                    {busTypeOptions.map(type => (
                                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filters.busType.includes(type)}
                                                onChange={() => {
                                                    const newTypes = filters.busType.includes(type)
                                                        ? filters.busType.filter(t => t !== type)
                                                        : [...filters.busType, type];
                                                    setFilters({ ...filters, busType: newTypes });
                                                }}
                                                className="rounded text-orange-600"
                                            />
                                            <span className="text-sm">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Departure Time */}
                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-medium mb-3">Departure Time</h3>
                                <div className="space-y-2">
                                    {timeSlots.map(slot => (
                                        <label key={slot.value} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filters.departureTime.includes(slot.value)}
                                                onChange={() => {
                                                    const newTimes = filters.departureTime.includes(slot.value)
                                                        ? filters.departureTime.filter(t => t !== slot.value)
                                                        : [...filters.departureTime, slot.value];
                                                    setFilters({ ...filters, departureTime: newTimes });
                                                }}
                                                className="rounded text-orange-600"
                                            />
                                            <span className="text-sm">{slot.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-medium mb-3">Price Range</h3>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={filters.priceRange[0]}
                                        onChange={(e) => setFilters({
                                            ...filters,
                                            priceRange: [parseInt(e.target.value), filters.priceRange[1]]
                                        })}
                                        className="w-20 border rounded px-2 py-1 text-sm"
                                        placeholder="Min"
                                    />
                                    <span>-</span>
                                    <input
                                        type="number"
                                        value={filters.priceRange[1]}
                                        onChange={(e) => setFilters({
                                            ...filters,
                                            priceRange: [filters.priceRange[0], parseInt(e.target.value)]
                                        })}
                                        className="w-20 border rounded px-2 py-1 text-sm"
                                        placeholder="Max"
                                    />
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
                                                className="rounded text-orange-600"
                                            />
                                            <span className="text-sm">{amenity}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Rating */}
                            <div>
                                <h3 className="font-medium mb-3">Minimum Rating</h3>
                                <div className="flex gap-2">
                                    {[4, 3, 2].map(rating => (
                                        <button
                                            key={rating}
                                            onClick={() => setFilters({ ...filters, rating })}
                                            className={`px-3 py-1 rounded-full border text-sm flex items-center gap-1 ${
                                                filters.rating === rating
                                                    ? 'bg-orange-100 border-orange-400 text-orange-700'
                                                    : 'border-gray-300'
                                            }`}
                                        >
                                            <StarSolidIcon className="w-4 h-4 text-yellow-400" />
                                            {rating}+
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="flex-1">
                        {/* Sort */}
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Sort by:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="border rounded-lg px-3 py-2 text-sm"
                                >
                                    {sortOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Bus Cards */}
                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                                        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
                                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {buses.map(bus => (
                                    <div key={bus.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
                                        <div className="p-6">
                                            <div className="flex justify-between items-start">
                                                {/* Bus Info */}
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="font-semibold text-lg">{bus.operator}</h3>
                                                        {renderRating(bus.rating)}
                                                        <span className="text-xs text-gray-500">({bus.reviewCount} reviews)</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-3">{bus.busType}</p>

                                                    {/* Time & Duration */}
                                                    <div className="flex items-center gap-8 mb-3">
                                                        <div className="text-center">
                                                            <div className="text-2xl font-bold">{bus.departureTime}</div>
                                                            <div className="text-xs text-gray-500">{bus.from}</div>
                                                        </div>
                                                        <div className="flex-1 flex items-center gap-2">
                                                            <div className="flex-1 border-t-2 border-dashed border-gray-300" />
                                                            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                                {bus.duration}
                                                            </div>
                                                            <div className="flex-1 border-t-2 border-dashed border-gray-300" />
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="text-2xl font-bold">{bus.arrivalTime}</div>
                                                            <div className="text-xs text-gray-500">{bus.to}</div>
                                                        </div>
                                                    </div>

                                                    {/* Amenities */}
                                                    <div className="flex flex-wrap gap-2">
                                                        {bus.amenities.slice(0, 4).map((amenity, i) => (
                                                            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded flex items-center gap-1">
                                                                {amenity === 'WiFi' && <WifiIcon className="w-3 h-3" />}
                                                                {amenity === 'TV' && <TvIcon className="w-3 h-3" />}
                                                                {amenity === 'Charging Point' && <BoltIcon className="w-3 h-3" />}
                                                                {amenity}
                                                            </span>
                                                        ))}
                                                        {bus.amenities.length > 4 && (
                                                            <span className="text-xs text-orange-600">
                                                                +{bus.amenities.length - 4} more
                                                            </span>
                                                        )}
                                                        {bus.liveTracking && (
                                                            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                                                                Live Tracking
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Price & Book */}
                                                <div className="text-right ml-6">
                                                    <div className="text-2xl font-bold text-gray-900">
                                                        ₹{bus.price.toLocaleString()}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mb-2">per seat</div>
                                                    <div className={`text-sm mb-3 ${bus.seatsAvailable <= 5 ? 'text-red-600' : 'text-green-600'}`}>
                                                        {bus.seatsAvailable} seats available
                                                    </div>
                                                    <button
                                                        onClick={() => handleBooking(bus)}
                                                        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition"
                                                    >
                                                        Select Seats
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Expandable Details */}
                                            <button
                                                onClick={() => setSelectedBus(selectedBus === bus.id ? null : bus.id)}
                                                className="flex items-center gap-1 text-sm text-orange-600 mt-4 hover:underline"
                                            >
                                                {selectedBus === bus.id ? 'Hide Details' : 'View Details'}
                                                <ChevronDownIcon className={`w-4 h-4 transition ${selectedBus === bus.id ? 'rotate-180' : ''}`} />
                                            </button>

                                            {selectedBus === bus.id && (
                                                <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-6">
                                                    {/* Boarding Points */}
                                                    <div>
                                                        <h4 className="font-medium mb-2 text-sm">Boarding Points</h4>
                                                        <div className="space-y-2">
                                                            {bus.boardingPoints.map((point, i) => (
                                                                <div key={i} className="flex items-center gap-2 text-sm">
                                                                    <span className="text-gray-500">{point.time}</span>
                                                                    <span>{point.name}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Dropping Points */}
                                                    <div>
                                                        <h4 className="font-medium mb-2 text-sm">Dropping Points</h4>
                                                        <div className="space-y-2">
                                                            {bus.droppingPoints.map((point, i) => (
                                                                <div key={i} className="flex items-center gap-2 text-sm">
                                                                    <span className="text-gray-500">{point.time}</span>
                                                                    <span>{point.name}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Cancellation Policy */}
                                                    <div className="col-span-2">
                                                        <h4 className="font-medium mb-1 text-sm">Cancellation Policy</h4>
                                                        <p className="text-sm text-gray-600">{bus.cancellationPolicy}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusResults;
