import React, { useState, useRef, useEffect } from 'react';
import {
    SparklesIcon,
    PaperAirplaneIcon,
    MapPinIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    UserGroupIcon,
    HeartIcon,
    ClockIcon,
    ArrowPathIcon,
    DocumentDuplicateIcon,
    ShareIcon,
    BookmarkIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const AITripPlanner = () => {
    const [step, setStep] = useState('input'); // input, generating, result
    const [preferences, setPreferences] = useState({
        destinations: '',
        duration: '',
        budget: '',
        travelers: 1,
        travelStyle: [],
        interests: [],
        startDate: '',
        accommodation: 'mid-range'
    });
    const [itinerary, setItinerary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    const travelStyles = [
        { id: 'adventure', name: 'Adventure', emoji: '🏔️' },
        { id: 'relaxation', name: 'Relaxation', emoji: '🏖️' },
        { id: 'cultural', name: 'Cultural', emoji: '🏛️' },
        { id: 'romantic', name: 'Romantic', emoji: '💑' },
        { id: 'family', name: 'Family', emoji: '👨‍👩‍👧‍👦' },
        { id: 'luxury', name: 'Luxury', emoji: '✨' },
        { id: 'budget', name: 'Budget', emoji: '💰' },
        { id: 'foodie', name: 'Foodie', emoji: '🍽️' }
    ];

    const interests = [
        { id: 'history', name: 'History', emoji: '📜' },
        { id: 'nature', name: 'Nature', emoji: '🌿' },
        { id: 'shopping', name: 'Shopping', emoji: '🛍️' },
        { id: 'nightlife', name: 'Nightlife', emoji: '🌃' },
        { id: 'sports', name: 'Sports', emoji: '⚽' },
        { id: 'photography', name: 'Photography', emoji: '📸' },
        { id: 'wellness', name: 'Wellness', emoji: '🧘' },
        { id: 'wildlife', name: 'Wildlife', emoji: '🦁' }
    ];

    const toggleStyle = (styleId) => {
        setPreferences(prev => ({
            ...prev,
            travelStyle: prev.travelStyle.includes(styleId)
                ? prev.travelStyle.filter(s => s !== styleId)
                : [...prev.travelStyle, styleId]
        }));
    };

    const toggleInterest = (interestId) => {
        setPreferences(prev => ({
            ...prev,
            interests: prev.interests.includes(interestId)
                ? prev.interests.filter(i => i !== interestId)
                : [...prev.interests, interestId]
        }));
    };

    const generateItinerary = async () => {
        setLoading(true);
        setStep('generating');
        setMessages([
            { type: 'system', text: 'Analyzing your preferences...' }
        ]);

        // Simulate AI generation steps
        const steps = [
            'Finding the best destinations...',
            'Planning optimal routes...',
            'Selecting accommodations...',
            'Curating experiences...',
            'Optimizing your budget...',
            'Finalizing your itinerary...'
        ];

        for (let i = 0; i < steps.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 800));
            setMessages(prev => [...prev, { type: 'system', text: steps[i] }]);
        }

        try {
            const response = await api.post('/ai/itinerary', preferences);
            setItinerary(response.data.itinerary || mockItinerary);
        } catch (error) {
            console.error('Error:', error);
            setItinerary(mockItinerary);
        } finally {
            setLoading(false);
            setStep('result');
        }
    };

    const mockItinerary = {
        title: 'Magical Thailand Adventure',
        duration: '7 Days / 6 Nights',
        destinations: ['Bangkok', 'Phuket', 'Phi Phi Islands'],
        estimatedBudget: '₹75,000',
        summary: 'A perfect blend of cultural exploration in Bangkok and beach relaxation in Southern Thailand. This itinerary covers the best of Thai cuisine, temples, and stunning islands.',
        days: [
            {
                day: 1,
                title: 'Arrival in Bangkok',
                location: 'Bangkok',
                activities: [
                    { time: '14:00', title: 'Arrive at Suvarnabhumi Airport', type: 'transport' },
                    { time: '16:00', title: 'Check-in at Hotel', type: 'accommodation' },
                    { time: '18:00', title: 'Evening walk at Khao San Road', type: 'activity' },
                    { time: '20:00', title: 'Street food dinner', type: 'food' }
                ],
                accommodation: 'Ibis Styles Bangkok Sukhumvit',
                meals: ['Dinner'],
                tips: ['Exchange some money at the airport for immediate expenses', 'Get a local SIM card']
            },
            {
                day: 2,
                title: 'Bangkok Temple Tour',
                location: 'Bangkok',
                activities: [
                    { time: '08:00', title: 'Breakfast at hotel', type: 'food' },
                    { time: '09:00', title: 'Visit Grand Palace & Wat Phra Kaew', type: 'sightseeing' },
                    { time: '12:00', title: 'Lunch at local restaurant', type: 'food' },
                    { time: '14:00', title: 'Wat Arun (Temple of Dawn)', type: 'sightseeing' },
                    { time: '17:00', title: 'Chao Phraya River cruise', type: 'activity' },
                    { time: '19:00', title: 'Dinner at Asiatique', type: 'food' }
                ],
                accommodation: 'Ibis Styles Bangkok Sukhumvit',
                meals: ['Breakfast', 'Lunch', 'Dinner'],
                tips: ['Dress modestly for temples', 'Book cruise in advance']
            },
            {
                day: 3,
                title: 'Bangkok Markets & Shopping',
                location: 'Bangkok',
                activities: [
                    { time: '07:00', title: 'Early morning at Chatuchak Market', type: 'shopping' },
                    { time: '12:00', title: 'Lunch break', type: 'food' },
                    { time: '14:00', title: 'MBK Center & Siam Paragon', type: 'shopping' },
                    { time: '18:00', title: 'Thai massage', type: 'wellness' },
                    { time: '20:00', title: 'Rooftop bar experience', type: 'nightlife' }
                ],
                accommodation: 'Ibis Styles Bangkok Sukhumvit',
                meals: ['Breakfast', 'Lunch', 'Dinner'],
                tips: ['Bargain at Chatuchak!', 'Carry cash for street shopping']
            },
            {
                day: 4,
                title: 'Fly to Phuket',
                location: 'Phuket',
                activities: [
                    { time: '08:00', title: 'Morning flight to Phuket', type: 'transport' },
                    { time: '11:00', title: 'Check-in at beach resort', type: 'accommodation' },
                    { time: '14:00', title: 'Relax at Patong Beach', type: 'activity' },
                    { time: '18:00', title: 'Sunset at Promthep Cape', type: 'sightseeing' },
                    { time: '20:00', title: 'Seafood dinner on the beach', type: 'food' }
                ],
                accommodation: 'Holiday Inn Resort Phuket',
                meals: ['Breakfast', 'Dinner'],
                tips: ['Pre-book airport transfer', 'Apply sunscreen!']
            },
            {
                day: 5,
                title: 'Phi Phi Islands Day Trip',
                location: 'Phi Phi Islands',
                activities: [
                    { time: '07:00', title: 'Early breakfast', type: 'food' },
                    { time: '08:00', title: 'Speedboat to Phi Phi', type: 'transport' },
                    { time: '10:00', title: 'Snorkeling at Maya Bay', type: 'activity' },
                    { time: '12:30', title: 'Lunch on the island', type: 'food' },
                    { time: '14:00', title: 'Monkey Beach visit', type: 'activity' },
                    { time: '16:00', title: 'Viking Cave & Pileh Lagoon', type: 'sightseeing' },
                    { time: '18:00', title: 'Return to Phuket', type: 'transport' }
                ],
                accommodation: 'Holiday Inn Resort Phuket',
                meals: ['Breakfast', 'Lunch', 'Dinner'],
                tips: ['Bring waterproof phone case', 'Use reef-safe sunscreen']
            },
            {
                day: 6,
                title: 'Phuket Old Town & Relaxation',
                location: 'Phuket',
                activities: [
                    { time: '09:00', title: 'Leisurely breakfast', type: 'food' },
                    { time: '10:30', title: 'Explore Phuket Old Town', type: 'sightseeing' },
                    { time: '12:30', title: 'Lunch at local cafe', type: 'food' },
                    { time: '14:00', title: 'Big Buddha visit', type: 'sightseeing' },
                    { time: '16:00', title: 'Spa treatment', type: 'wellness' },
                    { time: '19:00', title: 'Farewell dinner at beachfront', type: 'food' }
                ],
                accommodation: 'Holiday Inn Resort Phuket',
                meals: ['Breakfast', 'Lunch', 'Dinner'],
                tips: ['Visit during Sunday Walking Street market']
            },
            {
                day: 7,
                title: 'Departure',
                location: 'Phuket',
                activities: [
                    { time: '08:00', title: 'Breakfast at hotel', type: 'food' },
                    { time: '10:00', title: 'Check-out & airport transfer', type: 'transport' },
                    { time: '13:00', title: 'Flight back home', type: 'transport' }
                ],
                accommodation: null,
                meals: ['Breakfast'],
                tips: ['Keep some Thai Baht for last-minute shopping']
            }
        ],
        budgetBreakdown: {
            flights: '₹25,000',
            accommodation: '₹20,000',
            activities: '₹12,000',
            food: '₹10,000',
            transport: '₹5,000',
            miscellaneous: '₹3,000'
        },
        packingList: [
            'Light cotton clothes',
            'Swimwear',
            'Sunscreen & sunglasses',
            'Comfortable walking shoes',
            'Rain jacket (if monsoon)',
            'Travel adapter',
            'Camera',
            'Medications'
        ]
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getActivityIcon = (type) => {
        const icons = {
            transport: '✈️',
            accommodation: '🏨',
            activity: '🎯',
            food: '🍽️',
            sightseeing: '📸',
            shopping: '🛍️',
            wellness: '🧘',
            nightlife: '🌃'
        };
        return icons[type] || '📍';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-3 mb-2">
                        <SparklesIcon className="w-8 h-8" />
                        <h1 className="text-4xl font-bold">AI Trip Planner</h1>
                    </div>
                    <p className="text-purple-200">Let AI create your perfect travel itinerary</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Input Form */}
                {step === 'input' && (
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold mb-6">Tell us about your dream trip</h2>

                        <div className="space-y-6">
                            {/* Destinations */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Where do you want to go?
                                </label>
                                <div className="relative">
                                    <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={preferences.destinations}
                                        onChange={(e) => setPreferences({ ...preferences, destinations: e.target.value })}
                                        placeholder="e.g., Thailand, Bali, or 'Somewhere tropical'"
                                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>

                            {/* Duration & Budget */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Duration
                                    </label>
                                    <select
                                        value={preferences.duration}
                                        onChange={(e) => setPreferences({ ...preferences, duration: e.target.value })}
                                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="">Select duration</option>
                                        <option value="3-4">3-4 Days</option>
                                        <option value="5-7">5-7 Days</option>
                                        <option value="8-10">8-10 Days</option>
                                        <option value="11-14">11-14 Days</option>
                                        <option value="15+">15+ Days</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Budget (per person)
                                    </label>
                                    <select
                                        value={preferences.budget}
                                        onChange={(e) => setPreferences({ ...preferences, budget: e.target.value })}
                                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="">Select budget</option>
                                        <option value="budget">Budget (₹20,000 - ₹40,000)</option>
                                        <option value="mid">Mid-range (₹40,000 - ₹80,000)</option>
                                        <option value="luxury">Luxury (₹80,000 - ₹1,50,000)</option>
                                        <option value="ultra">Ultra Luxury (₹1,50,000+)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Travelers & Date */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Number of Travelers
                                    </label>
                                    <select
                                        value={preferences.travelers}
                                        onChange={(e) => setPreferences({ ...preferences, travelers: parseInt(e.target.value) })}
                                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                            <option key={n} value={n}>{n} {n === 1 ? 'Traveler' : 'Travelers'}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Preferred Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={preferences.startDate}
                                        onChange={(e) => setPreferences({ ...preferences, startDate: e.target.value })}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>

                            {/* Travel Style */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Travel Style
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {travelStyles.map(style => (
                                        <button
                                            key={style.id}
                                            onClick={() => toggleStyle(style.id)}
                                            className={`px-4 py-2 rounded-full border-2 transition ${
                                                preferences.travelStyle.includes(style.id)
                                                    ? 'bg-purple-100 border-purple-500 text-purple-700'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            {style.emoji} {style.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Interests */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Interests
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {interests.map(interest => (
                                        <button
                                            key={interest.id}
                                            onClick={() => toggleInterest(interest.id)}
                                            className={`px-4 py-2 rounded-full border-2 transition ${
                                                preferences.interests.includes(interest.id)
                                                    ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            {interest.emoji} {interest.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Generate Button */}
                            <button
                                onClick={generateItinerary}
                                disabled={!preferences.destinations || !preferences.duration}
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <SparklesIcon className="w-5 h-5" />
                                Generate My Itinerary
                            </button>
                        </div>
                    </div>
                )}

                {/* Generating State */}
                {step === 'generating' && (
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 mx-auto mb-4 relative">
                                <div className="absolute inset-0 rounded-full bg-purple-100 animate-ping" />
                                <div className="relative w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                                    <SparklesIcon className="w-10 h-10 text-white animate-pulse" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold">Creating Your Perfect Itinerary</h2>
                            <p className="text-gray-600 mt-2">Our AI is working its magic...</p>
                        </div>

                        <div className="space-y-3">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg animate-fade-in"
                                >
                                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                                        <SparklesIcon className="w-4 h-4 text-white" />
                                    </div>
                                    <span>{msg.text}</span>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                )}

                {/* Result */}
                {step === 'result' && itinerary && (
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-3xl font-bold mb-2">{itinerary.title}</h2>
                                    <div className="flex flex-wrap gap-4 text-purple-100">
                                        <span className="flex items-center gap-1">
                                            <ClockIcon className="w-4 h-4" />
                                            {itinerary.duration}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPinIcon className="w-4 h-4" />
                                            {itinerary.destinations.join(' → ')}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <CurrencyDollarIcon className="w-4 h-4" />
                                            {itinerary.estimatedBudget}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30">
                                        <BookmarkIcon className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30">
                                        <ShareIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <p className="mt-4 text-purple-100">{itinerary.summary}</p>
                        </div>

                        {/* Day by Day */}
                        <div className="space-y-4">
                            {itinerary.days.map((day, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-4 text-white">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-sm text-purple-200">Day {day.day}</span>
                                                <h3 className="text-xl font-semibold">{day.title}</h3>
                                            </div>
                                            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                                                📍 {day.location}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        {/* Activities */}
                                        <div className="space-y-3 mb-6">
                                            {day.activities.map((activity, i) => (
                                                <div key={i} className="flex items-start gap-4">
                                                    <span className="text-sm text-gray-500 w-14">{activity.time}</span>
                                                    <span className="text-xl">{getActivityIcon(activity.type)}</span>
                                                    <span>{activity.title}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Day Details */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                                            {day.accommodation && (
                                                <div>
                                                    <div className="text-xs text-gray-500 mb-1">Accommodation</div>
                                                    <div className="text-sm font-medium">🏨 {day.accommodation}</div>
                                                </div>
                                            )}
                                            <div>
                                                <div className="text-xs text-gray-500 mb-1">Meals</div>
                                                <div className="text-sm">{day.meals.join(', ')}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 mb-1">Tips</div>
                                                <div className="text-sm text-gray-600">{day.tips[0]}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Budget Breakdown */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-xl font-bold mb-4">Budget Breakdown</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {Object.entries(itinerary.budgetBreakdown).map(([key, value]) => (
                                    <div key={key} className="bg-gray-50 rounded-lg p-4">
                                        <div className="text-sm text-gray-500 capitalize">{key}</div>
                                        <div className="text-lg font-semibold text-purple-600">{value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Packing List */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-xl font-bold mb-4">Packing Checklist</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {itinerary.packingList.map((item, index) => (
                                    <label key={index} className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="rounded text-purple-600" />
                                        <span className="text-sm">{item}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => setStep('input')}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
                            >
                                <ArrowPathIcon className="w-5 h-5" />
                                Regenerate
                            </button>
                            <button className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2">
                                <DocumentDuplicateIcon className="w-5 h-5" />
                                Book This Trip
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AITripPlanner;
