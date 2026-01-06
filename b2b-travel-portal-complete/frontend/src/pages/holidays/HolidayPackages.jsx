import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MagnifyingGlassIcon,
    CalendarIcon,
    UserGroupIcon,
    MapPinIcon,
    StarIcon,
    HeartIcon,
    ClockIcon,
    CheckCircleIcon,
    AdjustmentsHorizontalIcon,
    SparklesIcon,
    SunIcon,
    HomeModernIcon,
    TruckIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import api from '../../services/api';

const HolidayPackages = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        destination: '',
        duration: '',
        budget: '',
        category: '',
        month: ''
    });
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    const categories = [
        { id: 'beach', name: 'Beach', icon: '🏖️' },
        { id: 'mountain', name: 'Mountain', icon: '🏔️' },
        { id: 'adventure', name: 'Adventure', icon: '🏄' },
        { id: 'honeymoon', name: 'Honeymoon', icon: '💑' },
        { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦' },
        { id: 'pilgrimage', name: 'Pilgrimage', icon: '🙏' },
        { id: 'luxury', name: 'Luxury', icon: '✨' },
        { id: 'wildlife', name: 'Wildlife', icon: '🦁' }
    ];

    const popularDestinations = [
        { name: 'Goa', country: 'India', image: 'goa', packages: 45 },
        { name: 'Maldives', country: 'Maldives', image: 'maldives', packages: 28 },
        { name: 'Bali', country: 'Indonesia', image: 'bali', packages: 35 },
        { name: 'Dubai', country: 'UAE', image: 'dubai', packages: 52 },
        { name: 'Thailand', country: 'Thailand', image: 'thailand', packages: 68 },
        { name: 'Switzerland', country: 'Europe', image: 'switzerland', packages: 24 }
    ];

    const mockPackages = [
        {
            id: 1,
            name: 'Magical Goa Beach Getaway',
            destination: 'Goa, India',
            duration: '4 Nights / 5 Days',
            nights: 4,
            price: 15999,
            originalPrice: 22000,
            discount: 27,
            rating: 4.8,
            reviewCount: 2345,
            image: 'goa',
            category: 'beach',
            highlights: ['North & South Goa Tour', 'Water Sports', 'Cruise Dinner', 'Airport Transfers'],
            inclusions: ['3-Star Hotel', 'Breakfast', 'Sightseeing', 'Transfers'],
            isHotDeal: true,
            departureCities: ['Mumbai', 'Delhi', 'Bangalore']
        },
        {
            id: 2,
            name: 'Romantic Maldives Honeymoon',
            destination: 'Maldives',
            duration: '5 Nights / 6 Days',
            nights: 5,
            price: 89999,
            originalPrice: 120000,
            discount: 25,
            rating: 4.9,
            reviewCount: 1823,
            image: 'maldives',
            category: 'honeymoon',
            highlights: ['Water Villa Stay', 'Sunset Cruise', 'Underwater Dining', 'Spa Treatment'],
            inclusions: ['5-Star Resort', 'All Meals', 'Transfers', 'Activities'],
            isHotDeal: true,
            departureCities: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai']
        },
        {
            id: 3,
            name: 'Thailand Explorer',
            destination: 'Bangkok, Pattaya',
            duration: '5 Nights / 6 Days',
            nights: 5,
            price: 24999,
            originalPrice: 32000,
            discount: 22,
            rating: 4.6,
            reviewCount: 3456,
            image: 'thailand',
            category: 'adventure',
            highlights: ['Coral Island Tour', 'Safari World', 'Floating Market', 'Thai Massage'],
            inclusions: ['4-Star Hotels', 'Breakfast', 'Sightseeing', 'Visa'],
            isHotDeal: false,
            departureCities: ['Delhi', 'Mumbai', 'Kolkata']
        },
        {
            id: 4,
            name: 'Swiss Alps Adventure',
            destination: 'Switzerland',
            duration: '6 Nights / 7 Days',
            nights: 6,
            price: 149999,
            originalPrice: 180000,
            discount: 17,
            rating: 4.9,
            reviewCount: 892,
            image: 'switzerland',
            category: 'luxury',
            highlights: ['Jungfrau Excursion', 'Lake Lucerne', 'Interlaken', 'Glacier Express'],
            inclusions: ['4-Star Hotels', 'Breakfast & Dinner', 'Swiss Pass', 'Visa'],
            isHotDeal: false,
            departureCities: ['Delhi', 'Mumbai']
        },
        {
            id: 5,
            name: 'Kerala Backwaters Bliss',
            destination: 'Kerala, India',
            duration: '5 Nights / 6 Days',
            nights: 5,
            price: 19999,
            originalPrice: 28000,
            discount: 29,
            rating: 4.7,
            reviewCount: 1567,
            image: 'kerala',
            category: 'family',
            highlights: ['Houseboat Stay', 'Munnar Tea Gardens', 'Alleppey Backwaters', 'Kathakali Show'],
            inclusions: ['3-Star Hotels', 'All Meals', 'Houseboat', 'Transfers'],
            isHotDeal: true,
            departureCities: ['Bangalore', 'Chennai', 'Mumbai']
        },
        {
            id: 6,
            name: 'Dubai Dazzle Package',
            destination: 'Dubai, UAE',
            duration: '4 Nights / 5 Days',
            nights: 4,
            price: 45999,
            originalPrice: 58000,
            discount: 21,
            rating: 4.8,
            reviewCount: 2890,
            image: 'dubai',
            category: 'luxury',
            highlights: ['Burj Khalifa', 'Desert Safari', 'Dubai Mall', 'Dhow Cruise'],
            inclusions: ['4-Star Hotel', 'Breakfast', 'Sightseeing', 'Visa'],
            isHotDeal: true,
            departureCities: ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad']
        }
    ];

    useEffect(() => {
        fetchPackages();
    }, [filters]);

    const fetchPackages = async () => {
        setLoading(true);
        try {
            const response = await api.get('/holidays/packages', { params: filters });
            setPackages(response.data.packages || mockPackages);
        } catch (error) {
            setPackages(mockPackages);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = (id) => {
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    const handlePackageClick = (pkg) => {
        navigate(`/holidays/${pkg.id}`, { state: { package: pkg } });
    };

    const renderStars = (rating) => (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
                <StarSolidIcon
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                />
            ))}
            <span className="text-sm font-medium ml-1">{rating}</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Your Dream Vacation</h1>
                    <p className="text-xl text-pink-100 mb-8">Handpicked holiday packages at unbeatable prices</p>

                    {/* Search Bar */}
                    <div className="bg-white rounded-xl shadow-xl p-4 max-w-4xl">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative md:col-span-2">
                                <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Where do you want to go?"
                                    className="w-full pl-10 pr-4 py-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-pink-500"
                                />
                            </div>
                            <select
                                value={filters.duration}
                                onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                                className="border rounded-lg px-4 py-3 text-gray-800"
                            >
                                <option value="">Any Duration</option>
                                <option value="2-3">2-3 Nights</option>
                                <option value="4-5">4-5 Nights</option>
                                <option value="6-7">6-7 Nights</option>
                                <option value="8+">8+ Nights</option>
                            </select>
                            <button
                                onClick={fetchPackages}
                                className="bg-pink-600 hover:bg-pink-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2"
                            >
                                <MagnifyingGlassIcon className="w-5 h-5" />
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setFilters({ ...filters, category: cat.id })}
                            className={`flex-shrink-0 flex flex-col items-center gap-2 px-6 py-4 rounded-xl transition ${
                                filters.category === cat.id
                                    ? 'bg-pink-100 text-pink-700 ring-2 ring-pink-500'
                                    : 'bg-white shadow-md hover:shadow-lg'
                            }`}
                        >
                            <span className="text-3xl">{cat.icon}</span>
                            <span className="text-sm font-medium">{cat.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Popular Destinations */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-6">Popular Destinations</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {popularDestinations.map((dest, index) => (
                        <div
                            key={index}
                            onClick={() => setFilters({ ...filters, destination: dest.name })}
                            className="relative group cursor-pointer rounded-xl overflow-hidden aspect-square"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                                <span className="text-white text-4xl font-bold">{dest.name.charAt(0)}</span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                                <h3 className="text-white font-semibold">{dest.name}</h3>
                                <p className="text-white/80 text-xs">{dest.packages} packages</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hot Deals */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 py-8 mb-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <SparklesIcon className="w-6 h-6" />
                            Hot Deals
                        </h2>
                        <span className="text-white/80 text-sm">Limited time offers!</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {packages.filter(p => p.isHotDeal).slice(0, 3).map(pkg => (
                            <div
                                key={pkg.id}
                                onClick={() => handlePackageClick(pkg)}
                                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition group"
                            >
                                <div className="relative h-40">
                                    <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                                        <MapPinIcon className="w-16 h-16 text-white/50" />
                                    </div>
                                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">
                                        {pkg.discount}% OFF
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite(pkg.id);
                                        }}
                                        className="absolute top-3 right-3"
                                    >
                                        {favorites.includes(pkg.id) ? (
                                            <HeartSolidIcon className="w-6 h-6 text-red-500" />
                                        ) : (
                                            <HeartIcon className="w-6 h-6 text-white" />
                                        )}
                                    </button>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold group-hover:text-pink-600">{pkg.name}</h3>
                                    <p className="text-sm text-gray-600">{pkg.destination}</p>
                                    <div className="flex items-center justify-between mt-3">
                                        <div>
                                            <span className="text-gray-400 line-through text-sm">₹{pkg.originalPrice.toLocaleString()}</span>
                                            <div className="text-xl font-bold text-pink-600">₹{pkg.price.toLocaleString()}</div>
                                        </div>
                                        <div className="text-sm text-gray-600">{pkg.duration}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* All Packages */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">All Holiday Packages</h2>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                    >
                        <AdjustmentsHorizontalIcon className="w-5 h-5" />
                        Filters
                    </button>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <select
                                value={filters.budget}
                                onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
                                className="border rounded-lg px-3 py-2"
                            >
                                <option value="">Any Budget</option>
                                <option value="0-15000">Under ₹15,000</option>
                                <option value="15000-30000">₹15,000 - ₹30,000</option>
                                <option value="30000-50000">₹30,000 - ₹50,000</option>
                                <option value="50000-100000">₹50,000 - ₹1,00,000</option>
                                <option value="100000+">₹1,00,000+</option>
                            </select>
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                className="border rounded-lg px-3 py-2"
                            >
                                <option value="">All Categories</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            <select
                                value={filters.month}
                                onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                                className="border rounded-lg px-3 py-2"
                            >
                                <option value="">Any Month</option>
                                {['January', 'February', 'March', 'April', 'May', 'June',
                                  'July', 'August', 'September', 'October', 'November', 'December'
                                ].map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                            <button
                                onClick={() => setFilters({ destination: '', duration: '', budget: '', category: '', month: '' })}
                                className="text-pink-600 hover:underline text-sm"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                )}

                {/* Package Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                                <div className="h-48 bg-gray-200" />
                                <div className="p-4 space-y-3">
                                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                                    <div className="h-6 bg-gray-200 rounded w-1/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {packages.map(pkg => (
                            <div
                                key={pkg.id}
                                onClick={() => handlePackageClick(pkg)}
                                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition group"
                            >
                                {/* Image */}
                                <div className="relative h-52">
                                    <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center group-hover:scale-105 transition">
                                        <MapPinIcon className="w-20 h-20 text-white/30" />
                                    </div>
                                    {pkg.discount > 0 && (
                                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">
                                            {pkg.discount}% OFF
                                        </div>
                                    )}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite(pkg.id);
                                        }}
                                        className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-md hover:scale-110 transition"
                                    >
                                        {favorites.includes(pkg.id) ? (
                                            <HeartSolidIcon className="w-5 h-5 text-red-500" />
                                        ) : (
                                            <HeartIcon className="w-5 h-5 text-gray-600" />
                                        )}
                                    </button>
                                    <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                                        <span className="bg-white/90 text-gray-700 text-xs px-2 py-1 rounded flex items-center gap-1">
                                            <ClockIcon className="w-3 h-3" />
                                            {pkg.duration}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="font-semibold text-lg group-hover:text-pink-600 transition">
                                                {pkg.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                                <MapPinIcon className="w-4 h-4" />
                                                {pkg.destination}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-2 mb-3">
                                        {renderStars(pkg.rating)}
                                        <span className="text-xs text-gray-500">({pkg.reviewCount} reviews)</span>
                                    </div>

                                    {/* Inclusions */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {pkg.inclusions.slice(0, 3).map((inc, i) => (
                                            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                {inc}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-end justify-between pt-3 border-t">
                                        <div>
                                            <span className="text-xs text-gray-500">Starting from</span>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-bold text-pink-600">
                                                    ₹{pkg.price.toLocaleString()}
                                                </span>
                                                {pkg.originalPrice > pkg.price && (
                                                    <span className="text-sm text-gray-400 line-through">
                                                        ₹{pkg.originalPrice.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-500">per person</span>
                                        </div>
                                        <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Why Choose Us */}
            <div className="bg-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center mb-8">Why Book With Us?</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: CheckCircleIcon, title: 'Best Price Guarantee', desc: 'We match any lower price' },
                            { icon: HomeModernIcon, title: 'Handpicked Hotels', desc: 'Quality accommodations only' },
                            { icon: TruckIcon, title: 'Hassle-free Transfers', desc: 'Airport & local transfers included' },
                            { icon: UserGroupIcon, title: '24/7 Support', desc: 'Assistance throughout your trip' }
                        ].map((item, index) => (
                            <div key={index} className="text-center">
                                <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <item.icon className="w-7 h-7 text-pink-600" />
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

export default HolidayPackages;
