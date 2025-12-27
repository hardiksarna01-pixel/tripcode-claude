import React, { useState, useEffect } from 'react';

/**
 * B2C Website Template
 * Customer-facing flight booking website for agents
 * Fully whitelabel with customizable branding
 */
const B2CWebsite = ({ siteConfig }) => {
    // Default config if not provided
    const config = siteConfig || {
        site_name: 'TravelMax Flights',
        site_tagline: 'Your Trusted Travel Partner',
        primary_color: '#2563eb',
        secondary_color: '#1e40af',
        accent_color: '#f59e0b',
        logo_url: null,
        display_phone: '+91 98765 43210',
        display_email: 'support@travelmax.com',
        display_whatsapp: '+91 98765 43210',
        enable_customer_login: true,
    };

    const [activeTab, setActiveTab] = useState('flights');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchForm, setSearchForm] = useState({
        tripType: 'oneway',
        from: '',
        to: '',
        departDate: '',
        returnDate: '',
        adults: 1,
        children: 0,
        infants: 0,
        cabinClass: 'ECONOMY',
    });

    // Popular routes data
    const popularRoutes = [
        { from: 'DEL', fromCity: 'New Delhi', to: 'BOM', toCity: 'Mumbai', price: 3499, image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400' },
        { from: 'DEL', fromCity: 'New Delhi', to: 'BLR', toCity: 'Bangalore', price: 3899, image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400' },
        { from: 'BOM', fromCity: 'Mumbai', to: 'GOI', toCity: 'Goa', price: 2499, image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400' },
        { from: 'DEL', fromCity: 'New Delhi', to: 'DXB', toCity: 'Dubai', price: 12999, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400' },
    ];

    // Swap cities
    const handleSwapCities = () => {
        setSearchForm({
            ...searchForm,
            from: searchForm.to,
            to: searchForm.from,
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching flights:', searchForm);
        // Navigate to search results
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            {config.logo_url ? (
                                <img src={config.logo_url} alt={config.site_name} className="h-10" />
                            ) : (
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                                    style={{ backgroundColor: config.primary_color }}
                                >
                                    {config.site_name.charAt(0)}
                                </div>
                            )}
                            <div>
                                <h1 className="font-bold text-lg" style={{ color: config.primary_color }}>
                                    {config.site_name}
                                </h1>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Flights</a>
                            <a href="#" className="text-gray-500 hover:text-gray-700">Hotels</a>
                            <a href="#" className="text-gray-500 hover:text-gray-700">Holidays</a>
                            <a href="#" className="text-gray-500 hover:text-gray-700">Offers</a>
                        </nav>

                        {/* Right Side */}
                        <div className="flex items-center gap-4">
                            <a
                                href={`tel:${config.display_phone}`}
                                className="hidden md:flex items-center gap-2 text-sm text-gray-600"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {config.display_phone}
                            </a>

                            {config.enable_customer_login && (
                                isLoggedIn ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">Hi, John</span>
                                        <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setShowLoginModal(true)}
                                        className="px-4 py-2 rounded-lg font-medium text-white"
                                        style={{ backgroundColor: config.primary_color }}
                                    >
                                        Login / Sign Up
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section with Search */}
            <section
                className="relative py-20 px-4"
                style={{
                    background: `linear-gradient(135deg, ${config.primary_color} 0%, ${config.secondary_color} 100%)`
                }}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                            <circle cx="1" cy="1" r="1" fill="white" />
                        </pattern>
                        <rect width="100" height="100" fill="url(#grid)" />
                    </svg>
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            {config.site_tagline || 'Find Your Perfect Flight'}
                        </h2>
                        <p className="text-white/80 text-lg">
                            Search, compare and book flights at the best prices
                        </p>
                    </div>

                    {/* Search Box */}
                    <div className="bg-white rounded-2xl shadow-2xl p-6">
                        {/* Trip Type Tabs */}
                        <div className="flex gap-6 mb-6">
                            {['oneway', 'roundtrip'].map(type => (
                                <label key={type} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="tripType"
                                        checked={searchForm.tripType === type}
                                        onChange={() => setSearchForm({ ...searchForm, tripType: type })}
                                        className="w-4 h-4"
                                        style={{ accentColor: config.primary_color }}
                                    />
                                    <span className="font-medium capitalize">{type === 'oneway' ? 'One Way' : 'Round Trip'}</span>
                                </label>
                            ))}
                        </div>

                        <form onSubmit={handleSearch}>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                {/* From */}
                                <div className="md:col-span-3">
                                    <label className="block text-xs text-gray-500 mb-1">FROM</label>
                                    <input
                                        type="text"
                                        placeholder="City or Airport"
                                        value={searchForm.from}
                                        onChange={(e) => setSearchForm({ ...searchForm, from: e.target.value })}
                                        className="w-full px-4 py-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                                    />
                                </div>

                                {/* Swap Button */}
                                <div className="md:col-span-1 flex items-end justify-center pb-3">
                                    <button
                                        type="button"
                                        onClick={handleSwapCities}
                                        className="w-10 h-10 rounded-full border-2 flex items-center justify-center hover:bg-gray-50"
                                    >
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                        </svg>
                                    </button>
                                </div>

                                {/* To */}
                                <div className="md:col-span-3">
                                    <label className="block text-xs text-gray-500 mb-1">TO</label>
                                    <input
                                        type="text"
                                        placeholder="City or Airport"
                                        value={searchForm.to}
                                        onChange={(e) => setSearchForm({ ...searchForm, to: e.target.value })}
                                        className="w-full px-4 py-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                                    />
                                </div>

                                {/* Departure Date */}
                                <div className="md:col-span-2">
                                    <label className="block text-xs text-gray-500 mb-1">DEPARTURE</label>
                                    <input
                                        type="date"
                                        value={searchForm.departDate}
                                        onChange={(e) => setSearchForm({ ...searchForm, departDate: e.target.value })}
                                        className="w-full px-4 py-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none"
                                    />
                                </div>

                                {/* Return Date */}
                                {searchForm.tripType === 'roundtrip' && (
                                    <div className="md:col-span-2">
                                        <label className="block text-xs text-gray-500 mb-1">RETURN</label>
                                        <input
                                            type="date"
                                            value={searchForm.returnDate}
                                            onChange={(e) => setSearchForm({ ...searchForm, returnDate: e.target.value })}
                                            className="w-full px-4 py-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                )}

                                {/* Travelers & Class */}
                                <div className={`${searchForm.tripType === 'roundtrip' ? 'md:col-span-1' : 'md:col-span-3'}`}>
                                    <label className="block text-xs text-gray-500 mb-1">TRAVELERS</label>
                                    <select
                                        value={`${searchForm.adults}A`}
                                        className="w-full px-4 py-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none"
                                    >
                                        <option value="1A">1 Adult</option>
                                        <option value="2A">2 Adults</option>
                                        <option value="3A">3 Adults</option>
                                        <option value="4A">4 Adults</option>
                                    </select>
                                </div>
                            </div>

                            {/* Search Button */}
                            <div className="mt-6 flex justify-center">
                                <button
                                    type="submit"
                                    className="px-12 py-4 rounded-xl font-semibold text-white text-lg flex items-center gap-3 shadow-lg hover:shadow-xl transition-shadow"
                                    style={{ backgroundColor: config.primary_color }}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Search Flights
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* Popular Routes */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Popular Routes</h3>
                    <p className="text-gray-500 mb-8">Discover our most booked destinations</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {popularRoutes.map((route, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
                            >
                                <div className="relative h-40 overflow-hidden">
                                    <img
                                        src={route.image}
                                        alt={route.toCity}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <p className="text-sm opacity-80">{route.fromCity}</p>
                                        <p className="font-bold text-lg">{route.toCity}</p>
                                    </div>
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span>{route.from}</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                        <span>{route.to}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">Starting from</p>
                                        <p className="font-bold" style={{ color: config.primary_color }}>
                                            ₹{route.price.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Why Book With Us?</h3>
                        <p className="text-gray-500">Experience the best in travel booking</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ),
                                title: 'Best Prices',
                                desc: 'We compare prices from multiple airlines to get you the best deals'
                            },
                            {
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                ),
                                title: 'Secure Booking',
                                desc: 'Your payment and personal information is always safe with us'
                            },
                            {
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                ),
                                title: '24/7 Support',
                                desc: 'Our customer support team is always here to help you'
                            },
                        ].map((feature, idx) => (
                            <div key={idx} className="text-center p-6">
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white"
                                    style={{ backgroundColor: config.primary_color }}
                                >
                                    {feature.icon}
                                </div>
                                <h4 className="font-bold text-lg mb-2">{feature.title}</h4>
                                <p className="text-gray-500">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Offers Banner */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div
                        className="rounded-2xl p-8 md:p-12 text-white relative overflow-hidden"
                        style={{
                            background: `linear-gradient(135deg, ${config.accent_color} 0%, ${config.primary_color} 100%)`
                        }}
                    >
                        <div className="relative z-10 max-w-lg">
                            <h3 className="text-3xl font-bold mb-4">Get Exclusive Deals!</h3>
                            <p className="text-white/80 mb-6">
                                Subscribe to our newsletter and receive special offers, flight deals, and travel tips directly in your inbox.
                            </p>
                            <div className="flex gap-3">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none"
                                />
                                <button className="px-6 py-3 bg-white rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                                    style={{ color: config.primary_color }}
                                >
                                    Subscribe
                                </button>
                            </div>
                        </div>

                        {/* Decorative Plane */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20">
                            <svg className="w-64 h-64" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ backgroundColor: config.footer_bg_color || '#1f2937' }} className="text-white py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        {/* Company Info */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                {config.logo_url ? (
                                    <img src={config.logo_url} alt={config.site_name} className="h-10" />
                                ) : (
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                                        style={{ backgroundColor: config.primary_color }}
                                    >
                                        {config.site_name.charAt(0)}
                                    </div>
                                )}
                                <span className="font-bold text-lg">{config.site_name}</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Your trusted partner for flight bookings. We help you find the best deals on domestic and international flights.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li><a href="#" className="hover:text-white">Search Flights</a></li>
                                <li><a href="#" className="hover:text-white">My Bookings</a></li>
                                <li><a href="#" className="hover:text-white">Web Check-in</a></li>
                                <li><a href="#" className="hover:text-white">Flight Status</a></li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h4 className="font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                                <li><a href="#" className="hover:text-white">FAQs</a></li>
                                <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
                                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="font-semibold mb-4">Contact Us</h4>
                            <ul className="space-y-3 text-gray-400 text-sm">
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {config.display_phone}
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {config.display_email}
                                </li>
                                {config.display_whatsapp && (
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                        </svg>
                                        WhatsApp
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm">
                            &copy; {new Date().getFullYear()} {config.site_name}. All rights reserved.
                        </p>
                        <div className="flex gap-4">
                            {/* Payment Methods */}
                            <div className="flex items-center gap-2 text-gray-400 text-xs">
                                <span>We accept:</span>
                                <span className="px-2 py-1 bg-gray-700 rounded">Visa</span>
                                <span className="px-2 py-1 bg-gray-700 rounded">Mastercard</span>
                                <span className="px-2 py-1 bg-gray-700 rounded">UPI</span>
                            </div>
                        </div>
                    </div>

                    {/* Powered By - Minimal */}
                    <div className="text-center mt-6 pt-4">
                        <p style={{ fontSize: '5px', color: '#4b5563', letterSpacing: '0.5px' }}>
                            www.tripcode.in
                        </p>
                    </div>
                </div>
            </footer>

            {/* Login Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Login to Your Account</h2>
                            <button
                                onClick={() => setShowLoginModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded" />
                                    <span>Remember me</span>
                                </label>
                                <a href="#" style={{ color: config.primary_color }}>Forgot password?</a>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 rounded-lg text-white font-semibold"
                                style={{ backgroundColor: config.primary_color }}
                            >
                                Login
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-500">
                                Don't have an account?{' '}
                                <a href="#" style={{ color: config.primary_color }} className="font-medium">
                                    Sign up
                                </a>
                            </p>
                        </div>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="bg-white px-4 text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <button className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Google
                                </button>
                                <button className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    Facebook
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default B2CWebsite;
