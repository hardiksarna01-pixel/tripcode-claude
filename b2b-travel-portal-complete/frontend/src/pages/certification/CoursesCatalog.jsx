import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    AcademicCapIcon,
    ClockIcon,
    StarIcon,
    UserGroupIcon,
    PlayIcon,
    BookOpenIcon,
    CheckBadgeIcon,
    XMarkIcon,
    ChevronDownIcon,
    SparklesIcon,
    FireIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

const CoursesCatalog = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [selectedBody, setSelectedBody] = useState('all');
    const [priceRange, setPriceRange] = useState('all');
    const [sortBy, setSortBy] = useState('popular');
    const [showFilters, setShowFilters] = useState(false);

    const categories = [
        { id: 'all', name: 'All Courses', count: 52 },
        { id: 'iata', name: 'IATA Certifications', count: 9 },
        { id: 'gds', name: 'GDS Training', count: 12 },
        { id: 'destination', name: 'Destination Specialist', count: 15 },
        { id: 'association', name: 'Association Prep', count: 6 },
        { id: 'business', name: 'Business & Startup', count: 5 },
        { id: 'cruise', name: 'Cruise & Specialty', count: 5 },
    ];

    const levels = [
        { id: 'all', name: 'All Levels' },
        { id: 'foundation', name: 'Foundation' },
        { id: 'intermediate', name: 'Intermediate' },
        { id: 'advanced', name: 'Advanced' },
        { id: 'expert', name: 'Expert' },
    ];

    const bodies = [
        { id: 'all', name: 'All Providers' },
        { id: 'iata', name: 'IATA' },
        { id: 'amadeus', name: 'Amadeus' },
        { id: 'sabre', name: 'Sabre' },
        { id: 'travelport', name: 'Travelport' },
        { id: 'tripcode', name: 'TripCode Academy' },
        { id: 'clia', name: 'CLIA' },
    ];

    const courses = [
        // IATA Courses
        { id: 1, title: 'IATA Foundation in Travel & Tourism', body: 'IATA', category: 'iata', level: 'foundation', price: 32999, originalPrice: 38999, duration: 60, rating: 4.8, reviews: 1250, enrolled: 5420, isBestseller: true, isNew: false, thumbnail: 'iata-foundation', features: ['Certificate', 'Exam', 'Lifetime Access'] },
        { id: 2, title: 'IATA Travel & Tourism Consultant', body: 'IATA', category: 'iata', level: 'intermediate', price: 59999, originalPrice: 68999, duration: 120, rating: 4.7, reviews: 680, enrolled: 2150, isBestseller: false, isNew: false, thumbnail: 'iata-consultant', features: ['Certificate', 'Exam', 'Lifetime Access'] },
        { id: 3, title: 'IATA Fares & Ticketing Level 1', body: 'IATA', category: 'iata', level: 'intermediate', price: 45999, originalPrice: 52999, duration: 80, rating: 4.9, reviews: 890, enrolled: 3200, isBestseller: true, isNew: false, thumbnail: 'iata-fares', features: ['Certificate', 'Exam', 'Practical'] },
        { id: 4, title: 'IATA Fares & Ticketing Level 2', body: 'IATA', category: 'iata', level: 'advanced', price: 79999, originalPrice: 89999, duration: 100, rating: 4.8, reviews: 420, enrolled: 1100, isBestseller: false, isNew: false, thumbnail: 'iata-fares-adv', features: ['Certificate', 'Exam', 'Practical'] },
        { id: 5, title: 'IATA Dangerous Goods Regulations', body: 'IATA', category: 'iata', level: 'intermediate', price: 24999, originalPrice: 29999, duration: 24, rating: 4.6, reviews: 320, enrolled: 890, isBestseller: false, isNew: false, thumbnail: 'iata-dgr', features: ['Certificate', 'Exam'] },

        // GDS Courses
        { id: 6, title: 'Amadeus Basic Certification', body: 'Amadeus', category: 'gds', level: 'foundation', price: 12999, originalPrice: 17999, duration: 40, rating: 4.7, reviews: 2100, enrolled: 8500, isBestseller: true, isNew: false, thumbnail: 'amadeus-basic', features: ['Certificate', 'Hands-on Lab', '2 Year Valid'] },
        { id: 7, title: 'Amadeus Advanced Certification', body: 'Amadeus', category: 'gds', level: 'advanced', price: 29999, originalPrice: 37999, duration: 80, rating: 4.8, reviews: 650, enrolled: 1800, isBestseller: false, isNew: false, thumbnail: 'amadeus-adv', features: ['Certificate', 'Hands-on Lab', 'Automation'] },
        { id: 8, title: 'Amadeus Selling Platform Connect', body: 'Amadeus', category: 'gds', level: 'intermediate', price: 19999, originalPrice: 24999, duration: 40, rating: 4.6, reviews: 480, enrolled: 1200, isBestseller: false, isNew: true, thumbnail: 'amadeus-spc', features: ['Certificate', 'Modern Interface'] },
        { id: 9, title: 'Sabre Red 360 Basic', body: 'Sabre', category: 'gds', level: 'foundation', price: 12999, originalPrice: 17999, duration: 40, rating: 4.6, reviews: 1650, enrolled: 6200, isBestseller: true, isNew: false, thumbnail: 'sabre-basic', features: ['Certificate', 'Hands-on Lab'] },
        { id: 10, title: 'Sabre Red 360 Advanced', body: 'Sabre', category: 'gds', level: 'advanced', price: 24999, originalPrice: 32999, duration: 60, rating: 4.7, reviews: 420, enrolled: 1100, isBestseller: false, isNew: false, thumbnail: 'sabre-adv', features: ['Certificate', 'Scripting'] },
        { id: 11, title: 'Galileo/Travelport Basic', body: 'Travelport', category: 'gds', level: 'foundation', price: 12999, originalPrice: 17999, duration: 40, rating: 4.5, reviews: 890, enrolled: 3200, isBestseller: false, isNew: false, thumbnail: 'galileo-basic', features: ['Certificate', 'Hands-on Lab'] },
        { id: 12, title: 'Multi-GDS Mastery Bundle', body: 'TripCode Academy', category: 'gds', level: 'advanced', price: 49999, originalPrice: 74999, duration: 150, rating: 4.9, reviews: 280, enrolled: 650, isBestseller: false, isNew: true, thumbnail: 'multi-gds', features: ['3 Certifications', 'All GDS'] },

        // Destination Specialists
        { id: 13, title: 'Dubai Destination Specialist', body: 'TripCode Academy', category: 'destination', level: 'intermediate', price: 4999, originalPrice: 7999, duration: 15, rating: 4.8, reviews: 1850, enrolled: 7500, isBestseller: true, isNew: false, thumbnail: 'dubai', features: ['Certificate', 'DMC Contacts'] },
        { id: 14, title: 'Thailand Travel Expert', body: 'TripCode Academy', category: 'destination', level: 'intermediate', price: 3999, originalPrice: 5999, duration: 12, rating: 4.7, reviews: 1420, enrolled: 5800, isBestseller: true, isNew: false, thumbnail: 'thailand', features: ['Certificate', 'Itineraries'] },
        { id: 15, title: 'Europe Travel Specialist', body: 'TripCode Academy', category: 'destination', level: 'intermediate', price: 6999, originalPrice: 9999, duration: 25, rating: 4.8, reviews: 980, enrolled: 3200, isBestseller: false, isNew: false, thumbnail: 'europe', features: ['Certificate', 'Schengen Guide'] },
        { id: 16, title: 'Maldives Expert Certification', body: 'TripCode Academy', category: 'destination', level: 'intermediate', price: 4499, originalPrice: 6999, duration: 10, rating: 4.9, reviews: 720, enrolled: 2800, isBestseller: false, isNew: false, thumbnail: 'maldives', features: ['Certificate', 'Resort Knowledge'] },
        { id: 17, title: 'Singapore Specialist', body: 'TripCode Academy', category: 'destination', level: 'intermediate', price: 3999, originalPrice: 5999, duration: 12, rating: 4.7, reviews: 650, enrolled: 2400, isBestseller: false, isNew: false, thumbnail: 'singapore', features: ['Certificate', 'Attractions'] },
        { id: 18, title: 'Bali & Indonesia Expert', body: 'TripCode Academy', category: 'destination', level: 'intermediate', price: 3499, originalPrice: 5499, duration: 10, rating: 4.6, reviews: 580, enrolled: 2100, isBestseller: false, isNew: true, thumbnail: 'bali', features: ['Certificate', 'Cultural Guide'] },
        { id: 19, title: 'Australia Travel Specialist', body: 'TripCode Academy', category: 'destination', level: 'intermediate', price: 5999, originalPrice: 8999, duration: 20, rating: 4.7, reviews: 420, enrolled: 1500, isBestseller: false, isNew: false, thumbnail: 'australia', features: ['Certificate', 'Visa Guide'] },
        { id: 20, title: 'USA Travel Expert', body: 'TripCode Academy', category: 'destination', level: 'advanced', price: 7999, originalPrice: 11999, duration: 30, rating: 4.8, reviews: 380, enrolled: 1200, isBestseller: false, isNew: false, thumbnail: 'usa', features: ['Certificate', 'B1/B2 Guide'] },

        // Business & Startup
        { id: 21, title: 'Travel Business Startup Masterclass', body: 'TripCode Academy', category: 'business', level: 'foundation', price: 12999, originalPrice: 19999, duration: 50, rating: 4.9, reviews: 890, enrolled: 3500, isBestseller: true, isNew: false, thumbnail: 'startup', features: ['Business Plan', 'Templates', 'Mentorship'] },
        { id: 22, title: 'IATA Accreditation Preparation', body: 'TripCode Academy', category: 'business', level: 'intermediate', price: 22999, originalPrice: 29999, duration: 30, rating: 4.8, reviews: 420, enrolled: 1200, isBestseller: false, isNew: false, thumbnail: 'iata-prep', features: ['Documentation', 'Process Guide'] },
        { id: 23, title: 'Travel Agency Marketing Mastery', body: 'TripCode Academy', category: 'business', level: 'intermediate', price: 9999, originalPrice: 14999, duration: 25, rating: 4.7, reviews: 560, enrolled: 1800, isBestseller: false, isNew: true, thumbnail: 'marketing', features: ['Digital Marketing', 'Social Media'] },
        { id: 24, title: 'Corporate Travel Management', body: 'TripCode Academy', category: 'business', level: 'advanced', price: 19999, originalPrice: 27999, duration: 30, rating: 4.8, reviews: 280, enrolled: 650, isBestseller: false, isNew: false, thumbnail: 'corporate', features: ['TMC Operations', 'RFP Writing'] },

        // Cruise & Specialty
        { id: 25, title: 'CLIA Cruise Counsellor Certification', body: 'CLIA', category: 'cruise', level: 'foundation', price: 7499, originalPrice: 9999, duration: 20, rating: 4.7, reviews: 650, enrolled: 2400, isBestseller: false, isNew: false, thumbnail: 'clia-basic', features: ['CLIA Certificate', 'FAM Access'] },
        { id: 26, title: 'Master Cruise Counsellor', body: 'CLIA', category: 'cruise', level: 'advanced', price: 22999, originalPrice: 29999, duration: 40, rating: 4.8, reviews: 180, enrolled: 450, isBestseller: false, isNew: false, thumbnail: 'clia-master', features: ['Master Status', 'Elite FAMs'] },
        { id: 27, title: 'Luxury Travel Advisor', body: 'TripCode Academy', category: 'cruise', level: 'advanced', price: 14999, originalPrice: 21999, duration: 25, rating: 4.9, reviews: 220, enrolled: 580, isBestseller: false, isNew: true, thumbnail: 'luxury', features: ['Luxury Brands', 'HNI Clients'] },

        // Association Prep
        { id: 28, title: 'TAFI Membership Preparation', body: 'TripCode Academy', category: 'association', level: 'foundation', price: 5999, originalPrice: 8999, duration: 8, rating: 4.6, reviews: 380, enrolled: 1200, isBestseller: false, isNew: false, thumbnail: 'tafi', features: ['Application Help', 'Documents'] },
        { id: 29, title: 'IATO Membership Guide', body: 'TripCode Academy', category: 'association', level: 'foundation', price: 6999, originalPrice: 9999, duration: 10, rating: 4.7, reviews: 280, enrolled: 850, isBestseller: false, isNew: false, thumbnail: 'iato', features: ['Inbound Focus', 'Application'] },
        { id: 30, title: 'Complete Association Bundle', body: 'TripCode Academy', category: 'association', level: 'foundation', price: 14999, originalPrice: 24999, duration: 30, rating: 4.8, reviews: 150, enrolled: 420, isBestseller: false, isNew: true, thumbnail: 'associations', features: ['TAFI+IATO+TAAI', 'All Docs'] },
    ];

    const filteredCourses = courses.filter(course => {
        if (selectedCategory !== 'all' && course.category !== selectedCategory) return false;
        if (selectedLevel !== 'all' && course.level !== selectedLevel) return false;
        if (selectedBody !== 'all' && course.body.toLowerCase().includes(selectedBody)) return false;
        if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (priceRange === 'free' && course.price > 0) return false;
        if (priceRange === 'under5k' && course.price >= 5000) return false;
        if (priceRange === '5k-15k' && (course.price < 5000 || course.price > 15000)) return false;
        if (priceRange === '15k-50k' && (course.price < 15000 || course.price > 50000)) return false;
        if (priceRange === 'above50k' && course.price <= 50000) return false;
        return true;
    });

    const sortedCourses = [...filteredCourses].sort((a, b) => {
        if (sortBy === 'popular') return b.enrolled - a.enrolled;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return b.isNew ? 1 : -1;
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return 0;
    });

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            i < Math.floor(rating)
                ? <StarSolid key={i} className="w-4 h-4 text-amber-400" />
                : <StarIcon key={i} className="w-4 h-4 text-gray-300" />
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
                <div className="max-w-7xl mx-auto px-4 py-10">
                    <div className="flex items-center gap-2 text-indigo-200 mb-3">
                        <Link to="/certification" className="hover:text-white">Certification Hub</Link>
                        <span>/</span>
                        <span>All Courses</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-4">Browse All Courses & Certifications</h1>
                    <p className="text-indigo-100 mb-6 max-w-2xl">
                        Choose from 50+ industry-recognized certifications to boost your travel career
                    </p>

                    {/* Search Bar */}
                    <div className="flex gap-3 max-w-2xl">
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search courses, certifications..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-4 py-3 bg-white/20 rounded-lg flex items-center gap-2 hover:bg-white/30"
                        >
                            <FunnelIcon className="w-5 h-5" />
                            Filters
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex gap-6">
                    {/* Sidebar Filters */}
                    <div className={`w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white rounded-xl shadow-sm p-5 sticky top-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900">Filters</h3>
                                <button
                                    onClick={() => {
                                        setSelectedCategory('all');
                                        setSelectedLevel('all');
                                        setSelectedBody('all');
                                        setPriceRange('all');
                                    }}
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Clear all
                                </button>
                            </div>

                            {/* Category Filter */}
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Category</h4>
                                <div className="space-y-2">
                                    {categories.map((cat) => (
                                        <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="category"
                                                checked={selectedCategory === cat.id}
                                                onChange={() => setSelectedCategory(cat.id)}
                                                className="text-blue-600"
                                            />
                                            <span className="text-sm text-gray-600">{cat.name}</span>
                                            <span className="text-xs text-gray-400">({cat.count})</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Level Filter */}
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Level</h4>
                                <div className="space-y-2">
                                    {levels.map((level) => (
                                        <label key={level.id} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="level"
                                                checked={selectedLevel === level.id}
                                                onChange={() => setSelectedLevel(level.id)}
                                                className="text-blue-600"
                                            />
                                            <span className="text-sm text-gray-600">{level.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Price</h4>
                                <div className="space-y-2">
                                    {[
                                        { id: 'all', name: 'All Prices' },
                                        { id: 'under5k', name: 'Under ₹5,000' },
                                        { id: '5k-15k', name: '₹5,000 - ₹15,000' },
                                        { id: '15k-50k', name: '₹15,000 - ₹50,000' },
                                        { id: 'above50k', name: 'Above ₹50,000' },
                                    ].map((price) => (
                                        <label key={price.id} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="price"
                                                checked={priceRange === price.id}
                                                onChange={() => setPriceRange(price.id)}
                                                className="text-blue-600"
                                            />
                                            <span className="text-sm text-gray-600">{price.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Provider Filter */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Provider</h4>
                                <div className="space-y-2">
                                    {bodies.map((body) => (
                                        <label key={body.id} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="body"
                                                checked={selectedBody === body.id}
                                                onChange={() => setSelectedBody(body.id)}
                                                className="text-blue-600"
                                            />
                                            <span className="text-sm text-gray-600">{body.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Course Grid */}
                    <div className="flex-1">
                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-600">
                                Showing <span className="font-medium">{sortedCourses.length}</span> courses
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Sort by:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="border rounded-lg px-3 py-2 text-sm"
                                >
                                    <option value="popular">Most Popular</option>
                                    <option value="rating">Highest Rated</option>
                                    <option value="newest">Newest</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        {/* Course Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {sortedCourses.map((course) => (
                                <Link
                                    key={course.id}
                                    to={`/certification/courses/${course.id}`}
                                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative h-40 bg-gradient-to-br from-blue-500 to-indigo-600">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <AcademicCapIcon className="w-16 h-16 text-white/30" />
                                        </div>
                                        {course.isBestseller && (
                                            <span className="absolute top-3 left-3 px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded flex items-center gap-1">
                                                <FireIcon className="w-3 h-3" /> Bestseller
                                            </span>
                                        )}
                                        {course.isNew && (
                                            <span className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded flex items-center gap-1">
                                                <SparklesIcon className="w-3 h-3" /> New
                                            </span>
                                        )}
                                        <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 text-white text-xs rounded">
                                            {course.duration} hours
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                                {course.body}
                                            </span>
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded capitalize">
                                                {course.level}
                                            </span>
                                        </div>

                                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600">
                                            {course.title}
                                        </h3>

                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="flex items-center">
                                                {renderStars(course.rating)}
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">{course.rating}</span>
                                            <span className="text-sm text-gray-500">({course.reviews.toLocaleString()})</span>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                                            <span className="flex items-center gap-1">
                                                <UserGroupIcon className="w-4 h-4" />
                                                {course.enrolled.toLocaleString()} enrolled
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-xl font-bold text-gray-900">
                                                    ₹{course.price.toLocaleString()}
                                                </span>
                                                {course.originalPrice > course.price && (
                                                    <span className="text-sm text-gray-400 line-through ml-2">
                                                        ₹{course.originalPrice.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                            {course.originalPrice > course.price && (
                                                <span className="text-sm text-green-600 font-medium">
                                                    {Math.round((1 - course.price / course.originalPrice) * 100)}% off
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {sortedCourses.length === 0 && (
                            <div className="bg-white rounded-xl p-12 text-center">
                                <BookOpenIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
                                <p className="text-gray-500">Try adjusting your filters or search query</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursesCatalog;
