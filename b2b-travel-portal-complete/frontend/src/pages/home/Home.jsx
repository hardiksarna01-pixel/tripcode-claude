import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    PaperAirplaneIcon,
    BuildingOfficeIcon,
    TruckIcon,
    GlobeAltIcon,
    ShieldCheckIcon,
    CurrencyRupeeIcon,
    StarIcon,
    UserGroupIcon,
    PhoneIcon,
    ChatBubbleLeftRightIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    SparklesIcon,
    CalendarIcon,
    MapPinIcon,
    ChevronRightIcon,
    PlayIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const Home = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('flights');

    const services = [
        { id: 'flights', name: 'Flights', icon: PaperAirplaneIcon, color: 'blue', path: '/flights' },
        { id: 'hotels', name: 'Hotels', icon: BuildingOfficeIcon, color: 'green', path: '/hotels' },
        { id: 'bus', name: 'Bus', icon: TruckIcon, color: 'orange', path: '/bus' },
        { id: 'holidays', name: 'Holidays', icon: GlobeAltIcon, color: 'purple', path: '/holidays' },
        { id: 'visa', name: 'Visa', icon: ShieldCheckIcon, color: 'red', path: '/visa' },
        { id: 'forex', name: 'Forex', icon: CurrencyRupeeIcon, color: 'teal', path: '/forex' }
    ];

    const stats = [
        { value: '10K+', label: 'Active Agents' },
        { value: '1M+', label: 'Bookings' },
        { value: '50+', label: 'Airlines' },
        { value: '10K+', label: 'Hotels' }
    ];

    const features = [
        { title: 'Best Commission Rates', desc: 'Earn up to 10% commission on every booking', icon: CurrencyRupeeIcon },
        { title: 'Instant Booking', desc: 'Real-time confirmation from 100+ suppliers', icon: CheckCircleIcon },
        { title: 'AI Travel Assistant', desc: 'Smart recommendations powered by AI', icon: SparklesIcon },
        { title: '24/7 Support', desc: 'Round-the-clock dedicated support team', icon: ChatBubbleLeftRightIcon }
    ];

    const popularDestinations = [
        { name: 'Goa', image: '/destinations/goa.jpg', price: 4999, rating: 4.8 },
        { name: 'Dubai', image: '/destinations/dubai.jpg', price: 25999, rating: 4.9 },
        { name: 'Manali', image: '/destinations/manali.jpg', price: 8999, rating: 4.7 },
        { name: 'Bali', image: '/destinations/bali.jpg', price: 35999, rating: 4.8 },
        { name: 'Singapore', image: '/destinations/singapore.jpg', price: 45999, rating: 4.9 },
        { name: 'Kerala', image: '/destinations/kerala.jpg', price: 12999, rating: 4.7 }
    ];

    const testimonials = [
        { name: 'Rajesh Kumar', company: 'Travel Express', text: 'TripCode has transformed our business. The commission rates are unbeatable!', rating: 5 },
        { name: 'Priya Sharma', company: 'Holiday Makers', text: 'Best B2B platform for travel agents. Instant bookings and great support.', rating: 5 },
        { name: 'Amit Patel', company: 'Fly High Tours', text: 'The AI assistant helps us serve customers better. Highly recommended!', rating: 5 }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-400/10 rounded-full blur-3xl" />
                </div>

                {/* Navigation */}
                <nav className="relative z-10 max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <GlobeAltIcon className="w-10 h-10 text-white" />
                            <span className="text-2xl font-bold text-white">TripCode</span>
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#services" className="text-white/80 hover:text-white transition">Services</a>
                            <a href="#features" className="text-white/80 hover:text-white transition">Features</a>
                            <a href="#destinations" className="text-white/80 hover:text-white transition">Destinations</a>
                            <a href="#contact" className="text-white/80 hover:text-white transition">Contact</a>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-white hover:text-white/80 transition font-medium">
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Hero Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                        <SparklesIcon className="w-5 h-5 text-yellow-300" />
                        <span className="text-white text-sm">India's #1 B2B Travel Portal</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        Your Gateway to<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                            Unlimited Travel Business
                        </span>
                    </h1>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join 10,000+ travel agents earning highest commissions. Book flights, hotels, buses, holidays and more from one platform.
                    </p>

                    {/* Service Tabs */}
                    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto">
                        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                            {services.map(service => (
                                <button
                                    key={service.id}
                                    onClick={() => setActiveTab(service.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition ${
                                        activeTab === service.id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <service.icon className={`w-5 h-5 ${service.id === 'flights' ? 'rotate-45' : ''}`} />
                                    {service.name}
                                </button>
                            ))}
                        </div>

                        {/* Quick Search Form */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative">
                                <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="From"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="relative">
                                <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="To"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="date"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                onClick={() => navigate(services.find(s => s.id === activeTab)?.path)}
                                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                            >
                                Search
                                <ArrowRightIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-center gap-12 mt-12">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl font-bold text-white">{stat.value}</div>
                                <div className="text-blue-200 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section id="features" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose TripCode?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Everything you need to grow your travel business, all in one powerful platform.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600 text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Complete travel solutions for your customers - all from one dashboard.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {services.map((service) => (
                            <Link
                                key={service.id}
                                to={service.path}
                                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition text-center group"
                            >
                                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 transition group-hover:scale-110 ${
                                    service.color === 'blue' ? 'bg-blue-100' :
                                    service.color === 'green' ? 'bg-green-100' :
                                    service.color === 'orange' ? 'bg-orange-100' :
                                    service.color === 'purple' ? 'bg-purple-100' :
                                    service.color === 'red' ? 'bg-red-100' :
                                    'bg-teal-100'
                                }`}>
                                    <service.icon className={`w-8 h-8 ${
                                        service.id === 'flights' ? 'rotate-45' : ''
                                    } ${
                                        service.color === 'blue' ? 'text-blue-600' :
                                        service.color === 'green' ? 'text-green-600' :
                                        service.color === 'orange' ? 'text-orange-600' :
                                        service.color === 'purple' ? 'text-purple-600' :
                                        service.color === 'red' ? 'text-red-600' :
                                        'text-teal-600'
                                    }`} />
                                </div>
                                <h3 className="font-semibold text-gray-900">{service.name}</h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Destinations */}
            <section id="destinations" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Popular Destinations</h2>
                            <p className="text-gray-600">Trending holiday packages for your customers</p>
                        </div>
                        <Link to="/holidays" className="text-blue-600 font-medium flex items-center gap-1 hover:underline">
                            View All <ChevronRightIcon className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {popularDestinations.map((dest, index) => (
                            <div key={index} className="group cursor-pointer">
                                <div className="relative rounded-2xl overflow-hidden mb-3">
                                    <div className="aspect-[4/5] bg-gradient-to-br from-blue-400 to-purple-500 group-hover:scale-105 transition duration-300" />
                                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                        <div className="flex items-center gap-1 text-white text-sm">
                                            <StarSolidIcon className="w-4 h-4 text-yellow-400" />
                                            {dest.rating}
                                        </div>
                                    </div>
                                </div>
                                <h3 className="font-semibold text-gray-900">{dest.name}</h3>
                                <p className="text-sm text-gray-500">Starting ₹{dest.price.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Partners Say</h2>
                        <p className="text-gray-600">Trusted by 10,000+ travel agents across India</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <StarSolidIcon key={i} className="w-5 h-5 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                                <div>
                                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                    <div className="text-sm text-gray-500">{testimonial.company}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Grow Your Travel Business?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Join 10,000+ travel agents already earning with TripCode
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition inline-flex items-center justify-center gap-2"
                        >
                            Register Now - It's Free
                            <ArrowRightIcon className="w-5 h-5" />
                        </Link>
                        <Link
                            to="/login"
                            className="bg-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/30 transition"
                        >
                            Login to Dashboard
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer id="contact" className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <GlobeAltIcon className="w-8 h-8" />
                                <span className="text-xl font-bold">TripCode</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                India's leading B2B travel portal for agents and tour operators.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Products</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li><Link to="/flights" className="hover:text-white">Flights</Link></li>
                                <li><Link to="/hotels" className="hover:text-white">Hotels</Link></li>
                                <li><Link to="/holidays" className="hover:text-white">Holidays</Link></li>
                                <li><Link to="/visa" className="hover:text-white">Visa</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li><a href="#" className="hover:text-white">About Us</a></li>
                                <li><a href="#" className="hover:text-white">Careers</a></li>
                                <li><a href="#" className="hover:text-white">Blog</a></li>
                                <li><a href="#" className="hover:text-white">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li className="flex items-center gap-2">
                                    <PhoneIcon className="w-4 h-4" />
                                    1800-123-4567
                                </li>
                                <li className="flex items-center gap-2">
                                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                                    support@tripcode.com
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
                        © 2024 TripCode. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
