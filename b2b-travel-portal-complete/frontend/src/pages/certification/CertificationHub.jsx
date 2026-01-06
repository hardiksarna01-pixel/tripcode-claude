import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    AcademicCapIcon,
    BuildingOfficeIcon,
    GlobeAltIcon,
    StarIcon,
    ClockIcon,
    CurrencyRupeeIcon,
    CheckBadgeIcon,
    ArrowRightIcon,
    BookOpenIcon,
    DocumentCheckIcon,
    UserGroupIcon,
    TrophyIcon,
    SparklesIcon,
    PlayIcon
} from '@heroicons/react/24/outline';

const CertificationHub = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const certificationBodies = [
        // International
        { id: 1, code: 'IATA', name: 'IATA', fullName: 'International Air Transport Association', type: 'international', logo: '✈️', certCount: 5, color: 'blue' },
        { id: 2, code: 'CLIA', name: 'CLIA', fullName: 'Cruise Lines International Association', type: 'international', logo: '🚢', certCount: 3, color: 'cyan' },
        { id: 3, code: 'UFTAA', name: 'UFTAA', fullName: 'United Federation of Travel Agents', type: 'international', logo: '🌍', certCount: 2, color: 'purple' },
        { id: 4, code: 'PATA', name: 'PATA', fullName: 'Pacific Asia Travel Association', type: 'international', logo: '🌏', certCount: 2, color: 'green' },

        // Indian Associations
        { id: 5, code: 'TAFI', name: 'TAFI', fullName: 'Travel Agents Federation of India', type: 'national', logo: '🇮🇳', certCount: 1, color: 'orange', popular: true },
        { id: 6, code: 'IATO', name: 'IATO', fullName: 'Indian Association of Tour Operators', type: 'national', logo: '🏛️', certCount: 1, color: 'amber', popular: true },
        { id: 7, code: 'TAAI', name: 'TAAI', fullName: 'Travel Agents Association of India', type: 'national', logo: '🎯', certCount: 1, color: 'red' },
        { id: 8, code: 'ADTOI', name: 'ADTOI', fullName: 'Association of Domestic Tour Operators', type: 'national', logo: '🏔️', certCount: 1, color: 'teal' },
        { id: 9, code: 'OTOAI', name: 'OTOAI', fullName: 'Outbound Tour Operators Association', type: 'national', logo: '✈️', certCount: 1, color: 'indigo' },
        { id: 10, code: 'ATOAI', name: 'ATOAI', fullName: 'Adventure Tour Operators Association', type: 'national', logo: '🏕️', certCount: 1, color: 'emerald' },
        { id: 11, code: 'ETAA', name: 'ETAA', fullName: 'Enterprising Travel Agents Association', type: 'national', logo: '💼', certCount: 1, color: 'violet' },
        { id: 12, code: 'ICPB', name: 'ICPB', fullName: 'India Convention Promotion Bureau', type: 'national', logo: '🎪', certCount: 1, color: 'pink' },

        // Government
        { id: 13, code: 'IITTM', name: 'IITTM', fullName: 'Indian Institute of Tourism & Travel Management', type: 'government', logo: '🎓', certCount: 4, color: 'blue', popular: true },
        { id: 14, code: 'IGNOU', name: 'IGNOU', fullName: 'Indira Gandhi National Open University', type: 'government', logo: '📚', certCount: 3, color: 'green' },
        { id: 15, code: 'NCHMCT', name: 'NCHMCT', fullName: 'National Council for Hotel Management', type: 'government', logo: '🏨', certCount: 2, color: 'amber' },

        // GDS
        { id: 16, code: 'AMADEUS', name: 'Amadeus', fullName: 'Amadeus IT Group', type: 'gds', logo: '💻', certCount: 3, color: 'blue', popular: true },
        { id: 17, code: 'SABRE', name: 'Sabre', fullName: 'Sabre Corporation', type: 'gds', logo: '🖥️', certCount: 3, color: 'red', popular: true },
        { id: 18, code: 'GALILEO', name: 'Galileo', fullName: 'Travelport Galileo', type: 'gds', logo: '⌨️', certCount: 2, color: 'purple' },

        // Regional
        { id: 19, code: 'RATO', name: 'RATO', fullName: 'Rajasthan Association of Tour Operators', type: 'regional', logo: '🏰', certCount: 1, color: 'pink' },
        { id: 20, code: 'KATA', name: 'KATA', fullName: 'Kerala Association of Travel Agents', type: 'regional', logo: '🌴', certCount: 1, color: 'green' },
        { id: 21, code: 'GATO', name: 'GATO', fullName: 'Goa Association of Tour Operators', type: 'regional', logo: '🏖️', certCount: 1, color: 'yellow' },
    ];

    const popularCertifications = [
        { id: 1, name: 'IATA Foundation in Travel & Tourism', body: 'IATA', price: 32999, duration: '60 hours', level: 'Foundation', enrolled: 1250, rating: 4.8 },
        { id: 2, name: 'Amadeus Basic Certification', body: 'Amadeus', price: 12999, duration: '40 hours', level: 'Foundation', enrolled: 2100, rating: 4.7 },
        { id: 3, name: 'Travel Business Startup Certification', body: 'TripCode', price: 12999, duration: '50 hours', level: 'Foundation', enrolled: 890, rating: 4.9 },
        { id: 4, name: 'TAFI Active Membership', body: 'TAFI', price: 17999, duration: 'Lifetime', level: 'Membership', enrolled: 450, rating: 4.6 },
        { id: 5, name: 'IATA Fares & Ticketing', body: 'IATA', price: 79999, duration: '150 hours', level: 'Advanced', enrolled: 680, rating: 4.8 },
        { id: 6, name: 'Cruise Specialist Certification', body: 'CLIA', price: 7499, duration: '20 hours', level: 'Foundation', enrolled: 320, rating: 4.5 },
    ];

    const destinationCertifications = [
        { name: 'Dubai Specialist', flag: '🇦🇪', price: 4999 },
        { name: 'Thailand Expert', flag: '🇹🇭', price: 3999 },
        { name: 'Europe Travel Specialist', flag: '🇪🇺', price: 6999 },
        { name: 'Maldives Expert', flag: '🇲🇻', price: 4499 },
        { name: 'Singapore Specialist', flag: '🇸🇬', price: 3999 },
        { name: 'Australia Expert', flag: '🇦🇺', price: 5999 },
        { name: 'USA Travel Specialist', flag: '🇺🇸', price: 7999 },
        { name: 'Bali Expert', flag: '🇮🇩', price: 3499 },
    ];

    const tabs = [
        { id: 'all', name: 'All', icon: GlobeAltIcon },
        { id: 'international', name: 'International', icon: GlobeAltIcon },
        { id: 'national', name: 'Indian Associations', icon: BuildingOfficeIcon },
        { id: 'government', name: 'Government', icon: AcademicCapIcon },
        { id: 'gds', name: 'GDS Training', icon: BookOpenIcon },
        { id: 'regional', name: 'Regional', icon: UserGroupIcon },
    ];

    const filteredBodies = activeTab === 'all'
        ? certificationBodies
        : certificationBodies.filter(b => b.type === activeTab);

    const stats = [
        { label: 'Certification Bodies', value: '25+', icon: BuildingOfficeIcon, color: 'blue' },
        { label: 'Courses Available', value: '50+', icon: BookOpenIcon, color: 'green' },
        { label: 'Agents Certified', value: '5,000+', icon: CheckBadgeIcon, color: 'purple' },
        { label: 'Success Rate', value: '94%', icon: TrophyIcon, color: 'amber' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="flex items-center gap-2 text-blue-200 mb-4">
                        <AcademicCapIcon className="w-5 h-5" />
                        <span>TripCode Academy</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Travel Certifications & Memberships</h1>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl">
                        Get certified from IATA, join TAFI/IATO, master GDS systems, and grow your travel business with industry-recognized credentials.
                    </p>

                    {/* Search */}
                    <div className="flex gap-4 max-w-2xl">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Search certifications, courses, memberships..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
                            />
                        </div>
                        <button className="px-6 py-3 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600">
                            Search
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <stat.icon className="w-8 h-8 text-blue-200 mb-2" />
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className="text-blue-200 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Quick Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    <Link to="/certification/courses" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <BookOpenIcon className="w-10 h-10 text-blue-600 mb-3" />
                        <h3 className="font-semibold text-gray-900">Browse Courses</h3>
                        <p className="text-sm text-gray-500">50+ courses available</p>
                    </Link>
                    <Link to="/certification/my-courses" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <PlayIcon className="w-10 h-10 text-green-600 mb-3" />
                        <h3 className="font-semibold text-gray-900">My Learning</h3>
                        <p className="text-sm text-gray-500">Continue your courses</p>
                    </Link>
                    <Link to="/certification/certificates" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <DocumentCheckIcon className="w-10 h-10 text-purple-600 mb-3" />
                        <h3 className="font-semibold text-gray-900">My Certificates</h3>
                        <p className="text-sm text-gray-500">View & download</p>
                    </Link>
                    <Link to="/certification/memberships" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <UserGroupIcon className="w-10 h-10 text-amber-600 mb-3" />
                        <h3 className="font-semibold text-gray-900">Memberships</h3>
                        <p className="text-sm text-gray-500">Join associations</p>
                    </Link>
                </div>

                {/* Popular Certifications */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Popular Certifications</h2>
                            <p className="text-gray-600">Most sought-after credentials in the travel industry</p>
                        </div>
                        <Link to="/certification/courses" className="text-blue-600 hover:underline flex items-center gap-1">
                            View all <ArrowRightIcon className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {popularCertifications.map((cert) => (
                            <div key={cert.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                            {cert.body}
                                        </span>
                                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                            {cert.level}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">{cert.name}</h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                        <span className="flex items-center gap-1">
                                            <ClockIcon className="w-4 h-4" /> {cert.duration}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <StarIcon className="w-4 h-4 text-amber-500" /> {cert.rating}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="text-2xl font-bold text-gray-900">
                                            ₹{cert.price.toLocaleString()}
                                        </div>
                                        <span className="text-sm text-gray-500">{cert.enrolled.toLocaleString()} enrolled</span>
                                    </div>
                                </div>
                                <div className="px-6 py-4 bg-gray-50 border-t">
                                    <Link
                                        to={`/certification/courses/${cert.id}`}
                                        className="w-full block text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Certification Bodies */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Certification Bodies & Associations</h2>
                    <p className="text-gray-600 mb-6">Partner organizations for certifications and memberships</p>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.name}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredBodies.map((body) => (
                            <Link
                                key={body.id}
                                to={`/certification/body/${body.code}`}
                                className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-xl bg-${body.color}-100 flex items-center justify-center text-2xl`}>
                                        {body.logo}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-gray-900">{body.name}</h3>
                                            {body.popular && (
                                                <SparklesIcon className="w-4 h-4 text-amber-500" />
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 truncate">{body.fullName}</p>
                                        <p className="text-sm text-blue-600 mt-1">{body.certCount} certifications</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Destination Certifications */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Destination Specialist Certifications</h2>
                            <p className="text-gray-600">Become an expert for popular destinations</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {destinationCertifications.map((dest, index) => (
                            <Link
                                key={index}
                                to={`/certification/destination/${dest.name.toLowerCase().replace(/\s+/g, '-')}`}
                                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
                            >
                                <div className="text-3xl">{dest.flag}</div>
                                <div>
                                    <h3 className="font-medium text-gray-900">{dest.name}</h3>
                                    <p className="text-blue-600 font-semibold">₹{dest.price.toLocaleString()}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Start Your Travel Business */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 text-white mb-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Want to Start Your Own Travel Business?</h2>
                            <p className="text-emerald-100 mb-4">
                                Get our comprehensive startup certification covering legal requirements,
                                IATA accreditation process, GDS setup, and business strategies.
                            </p>
                            <ul className="flex flex-wrap gap-4 text-sm">
                                <li className="flex items-center gap-1"><CheckBadgeIcon className="w-5 h-5" /> Business Setup Guide</li>
                                <li className="flex items-center gap-1"><CheckBadgeIcon className="w-5 h-5" /> IATA Application Help</li>
                                <li className="flex items-center gap-1"><CheckBadgeIcon className="w-5 h-5" /> Marketing Strategies</li>
                                <li className="flex items-center gap-1"><CheckBadgeIcon className="w-5 h-5" /> GDS Training</li>
                            </ul>
                        </div>
                        <Link
                            to="/certification/courses/travel-business-startup"
                            className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 whitespace-nowrap"
                        >
                            Enroll Now - ₹12,999
                        </Link>
                    </div>
                </div>

                {/* Benefits */}
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Get Certified?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrophyIcon className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Industry Recognition</h3>
                            <p className="text-gray-600">Gain credibility with globally recognized certifications from IATA, TAFI, and more.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CurrencyRupeeIcon className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Higher Earnings</h3>
                            <p className="text-gray-600">Certified agents earn 30-50% more commissions and access better supplier rates.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <UserGroupIcon className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Network & Support</h3>
                            <p className="text-gray-600">Join associations for networking, trade fairs, and business support.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificationHub;
