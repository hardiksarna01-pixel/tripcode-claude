import React, { useState, useEffect } from 'react';

const ItineraryBuilder = () => {
    const [formData, setFormData] = useState({
        destination: '',
        startDate: '',
        endDate: '',
        travelers: { adults: 2, children: 0 },
        budget: 'moderate',
        interests: [],
        templateId: '',
        includeFlights: true,
        includeHotels: true,
        notes: ''
    });
    const [generating, setGenerating] = useState(false);
    const [config, setConfig] = useState(null);
    const [usage, setUsage] = useState(null);
    const [itineraries, setItineraries] = useState([]);
    const [selectedItinerary, setSelectedItinerary] = useState(null);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [activeDay, setActiveDay] = useState(1);

    const interestOptions = [
        'Culture & Heritage', 'Adventure', 'Beach & Relaxation', 'Food & Cuisine',
        'Shopping', 'Nature & Wildlife', 'Photography', 'Nightlife', 'Spiritual', 'Family Activities'
    ];

    useEffect(() => {
        fetchConfig();
        fetchUsage();
        fetchItineraries();
    }, []);

    const fetchConfig = async () => {
        setConfig({
            templates: [
                { id: 'honeymoon', name: 'Honeymoon', description: 'Romantic getaway' },
                { id: 'family', name: 'Family Vacation', description: 'Family-friendly' },
                { id: 'adventure', name: 'Adventure Trip', description: 'Thrill-seeking' },
                { id: 'cultural', name: 'Cultural Tour', description: 'Heritage focused' },
                { id: 'weekend', name: 'Weekend Getaway', description: 'Quick trip' },
                { id: 'luxury', name: 'Luxury Escape', description: 'Premium experiences' }
            ],
            popularDestinations: [
                { city: 'Goa', type: 'Beach' },
                { city: 'Jaipur', type: 'Cultural' },
                { city: 'Kerala', type: 'Nature' },
                { city: 'Manali', type: 'Adventure' },
                { city: 'Dubai', type: 'Luxury' },
                { city: 'Singapore', type: 'Urban' }
            ]
        });
    };

    const fetchUsage = async () => {
        setUsage({
            plan: 'FREE',
            itineraries: { used: 0, limit: 2, remaining: 2 },
            maxDays: 5,
            resetAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString()
        });
    };

    const fetchItineraries = async () => {
        setItineraries([
            {
                id: 'itin_001',
                destination: 'Goa',
                startDate: '2025-01-15',
                endDate: '2025-01-19',
                days: 5,
                template: 'Beach Getaway',
                createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
            }
        ]);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleInterest = (interest) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    const calculateDays = () => {
        if (!formData.startDate || !formData.endDate) return 0;
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    };

    const handleGenerate = async () => {
        if (!formData.destination || !formData.startDate || !formData.endDate) {
            alert('Please fill in destination and travel dates');
            return;
        }

        const days = calculateDays();
        if (days > usage.maxDays && usage.plan === 'FREE') {
            setShowUpgradeModal(true);
            return;
        }

        if (usage?.itineraries.remaining <= 0) {
            setShowUpgradeModal(true);
            return;
        }

        setGenerating(true);

        // Simulate generation
        await new Promise(resolve => setTimeout(resolve, 3000));

        const newItinerary = {
            id: `itin_${Date.now()}`,
            destination: formData.destination,
            startDate: formData.startDate,
            endDate: formData.endDate,
            days,
            template: config.templates.find(t => t.id === formData.templateId)?.name || 'Custom',
            travelers: formData.travelers,
            interests: formData.interests,
            dayPlan: generateMockDayPlan(formData.destination, days),
            summary: {
                totalDays: days,
                totalEstimatedCost: 25000 + Math.floor(Math.random() * 50000),
                highlights: ['City Tour', 'Beach Visit', 'Local Cuisine']
            },
            flights: formData.includeFlights ? generateMockFlights() : null,
            hotels: formData.includeHotels ? generateMockHotels() : null,
            createdAt: new Date().toISOString()
        };

        setItineraries([newItinerary, ...itineraries]);
        setSelectedItinerary(newItinerary);
        setUsage(prev => ({
            ...prev,
            itineraries: {
                ...prev.itineraries,
                used: prev.itineraries.used + 1,
                remaining: prev.itineraries.remaining - 1
            }
        }));
        setGenerating(false);
        setActiveDay(1);
    };

    const generateMockDayPlan = (destination, days) => {
        const plan = [];
        for (let i = 0; i < days; i++) {
            plan.push({
                day: i + 1,
                date: new Date(new Date(formData.startDate).getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                title: i === 0 ? `Arrival in ${destination}` : i === days - 1 ? 'Departure Day' : `Exploring ${destination} - Day ${i + 1}`,
                activities: [
                    { time: '08:00', activity: 'Breakfast at hotel', type: 'meal' },
                    { time: '09:30', activity: i === 0 ? 'Check-in and rest' : 'Morning sightseeing', type: 'activity' },
                    { time: '12:30', activity: 'Lunch at local restaurant', type: 'meal' },
                    { time: '14:00', activity: 'Afternoon activity', type: 'activity' },
                    { time: '17:00', activity: 'Evening leisure', type: 'leisure' },
                    { time: '19:30', activity: 'Dinner', type: 'meal' }
                ],
                estimatedCost: 5000 + Math.floor(Math.random() * 3000)
            });
        }
        return plan;
    };

    const generateMockFlights = () => ({
        outbound: { airline: 'IndiGo', flightNo: '6E-1234', departure: '06:00', arrival: '08:30', price: 5500 },
        return: { airline: 'IndiGo', flightNo: '6E-5678', departure: '18:00', arrival: '20:30', price: 5800 }
    });

    const generateMockHotels = () => ([
        { name: 'Grand Hotel', rating: 4, pricePerNight: 4500, amenities: ['WiFi', 'Pool', 'Gym'] }
    ]);

    const handleUpgrade = () => {
        setUsage({
            plan: 'PRO',
            itineraries: { used: 0, limit: 10, remaining: 10 },
            maxDays: 30,
            resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        });
        setShowUpgradeModal(false);
    };

    const formatTimeRemaining = (resetAt) => {
        const diff = new Date(resetAt) - Date.now();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">AI Itinerary Builder</h1>
                    <p className="text-gray-500">Create personalized travel itineraries in seconds</p>
                </div>

                {/* Usage Banner */}
                {usage && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center justify-between ${
                        usage.plan === 'PRO' ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white' : 'bg-white border'
                    }`}>
                        <div className="flex items-center gap-4">
                            <span className={`text-xs font-bold px-2 py-1 rounded ${
                                usage.plan === 'PRO' ? 'bg-white/20' : 'bg-green-100 text-green-800'
                            }`}>
                                {usage.plan} PLAN
                            </span>
                            <div>
                                <p className={`text-sm ${usage.plan === 'PRO' ? 'text-white/80' : 'text-gray-600'}`}>
                                    {usage.itineraries.remaining} of {usage.itineraries.limit} itineraries remaining today
                                    {usage.plan === 'FREE' && ` • Max ${usage.maxDays} days`}
                                </p>
                                <p className={`text-xs ${usage.plan === 'PRO' ? 'text-white/60' : 'text-gray-400'}`}>
                                    Resets in {formatTimeRemaining(usage.resetAt)}
                                </p>
                            </div>
                        </div>
                        {usage.plan === 'FREE' && (
                            <button
                                onClick={() => setShowUpgradeModal(true)}
                                className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg text-sm font-medium"
                            >
                                Upgrade to Pro - ₹299/mo
                            </button>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Builder Form */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="font-semibold mb-4">Create Itinerary</h2>

                        <div className="space-y-4">
                            {/* Destination */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                                <input
                                    type="text"
                                    value={formData.destination}
                                    onChange={(e) => handleInputChange('destination', e.target.value)}
                                    placeholder="e.g., Goa, Kerala, Dubai"
                                    className="w-full px-4 py-3 border rounded-lg"
                                />
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {config?.popularDestinations.slice(0, 4).map(d => (
                                        <button
                                            key={d.city}
                                            onClick={() => handleInputChange('destination', d.city)}
                                            className="px-3 py-1 bg-gray-100 rounded-full text-xs hover:bg-gray-200"
                                        >
                                            {d.city}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                                        className="w-full px-4 py-3 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                                        className="w-full px-4 py-3 border rounded-lg"
                                    />
                                </div>
                            </div>
                            {formData.startDate && formData.endDate && (
                                <p className="text-sm text-blue-600">{calculateDays()} days trip</p>
                            )}

                            {/* Travelers */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Adults</label>
                                    <select
                                        value={formData.travelers.adults}
                                        onChange={(e) => handleInputChange('travelers', { ...formData.travelers, adults: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 border rounded-lg"
                                    >
                                        {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Children</label>
                                    <select
                                        value={formData.travelers.children}
                                        onChange={(e) => handleInputChange('travelers', { ...formData.travelers, children: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 border rounded-lg"
                                    >
                                        {[0, 1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Template */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Trip Template</label>
                                <select
                                    value={formData.templateId}
                                    onChange={(e) => handleInputChange('templateId', e.target.value)}
                                    className="w-full px-4 py-3 border rounded-lg"
                                >
                                    <option value="">Custom Trip</option>
                                    {config?.templates.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Interests */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
                                <div className="flex flex-wrap gap-2">
                                    {interestOptions.map(interest => (
                                        <button
                                            key={interest}
                                            onClick={() => toggleInterest(interest)}
                                            className={`px-3 py-1 rounded-full text-xs ${
                                                formData.interests.includes(interest)
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 hover:bg-gray-200'
                                            }`}
                                        >
                                            {interest}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Options */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.includeFlights}
                                        onChange={(e) => handleInputChange('includeFlights', e.target.checked)}
                                        className="rounded"
                                    />
                                    <span className="text-sm">Include flight suggestions</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.includeHotels}
                                        onChange={(e) => handleInputChange('includeHotels', e.target.checked)}
                                        className="rounded"
                                    />
                                    <span className="text-sm">Include hotel suggestions</span>
                                </label>
                            </div>

                            {/* Generate Button */}
                            <button
                                onClick={handleGenerate}
                                disabled={generating || !formData.destination || !formData.startDate || !formData.endDate}
                                className="w-full py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {generating ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Creating Itinerary...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        Generate Itinerary
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Itinerary Display */}
                    <div className="lg:col-span-2">
                        {selectedItinerary ? (
                            <div className="bg-white rounded-xl shadow-sm">
                                {/* Itinerary Header */}
                                <div className="p-6 border-b">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-xl font-bold">{selectedItinerary.destination} Trip</h2>
                                            <p className="text-gray-500">
                                                {selectedItinerary.days} Days • {new Date(selectedItinerary.startDate).toLocaleDateString()} - {new Date(selectedItinerary.endDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
                                                Export PDF
                                            </button>
                                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                                                Share
                                            </button>
                                        </div>
                                    </div>

                                    {/* Summary Cards */}
                                    <div className="grid grid-cols-3 gap-4 mt-4">
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <p className="text-xs text-blue-600 mb-1">Total Days</p>
                                            <p className="text-lg font-bold text-blue-700">{selectedItinerary.days}</p>
                                        </div>
                                        <div className="p-3 bg-green-50 rounded-lg">
                                            <p className="text-xs text-green-600 mb-1">Estimated Cost</p>
                                            <p className="text-lg font-bold text-green-700">₹{selectedItinerary.summary.totalEstimatedCost.toLocaleString()}</p>
                                        </div>
                                        <div className="p-3 bg-purple-50 rounded-lg">
                                            <p className="text-xs text-purple-600 mb-1">Travelers</p>
                                            <p className="text-lg font-bold text-purple-700">{selectedItinerary.travelers.adults + selectedItinerary.travelers.children}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Day Navigation */}
                                <div className="px-6 py-3 border-b overflow-x-auto">
                                    <div className="flex gap-2">
                                        {selectedItinerary.dayPlan.map(day => (
                                            <button
                                                key={day.day}
                                                onClick={() => setActiveDay(day.day)}
                                                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                                                    activeDay === day.day
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-100 hover:bg-gray-200'
                                                }`}
                                            >
                                                Day {day.day}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Day Details */}
                                <div className="p-6">
                                    {selectedItinerary.dayPlan.filter(d => d.day === activeDay).map(day => (
                                        <div key={day.day}>
                                            <div className="flex justify-between items-center mb-4">
                                                <div>
                                                    <h3 className="font-semibold text-lg">{day.title}</h3>
                                                    <p className="text-sm text-gray-500">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                                                </div>
                                                <span className="text-sm text-green-600 font-medium">₹{day.estimatedCost.toLocaleString()}</span>
                                            </div>

                                            {/* Timeline */}
                                            <div className="space-y-4">
                                                {day.activities.map((activity, idx) => (
                                                    <div key={idx} className="flex gap-4">
                                                        <div className="flex flex-col items-center">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                                activity.type === 'meal' ? 'bg-orange-100 text-orange-600' :
                                                                activity.type === 'activity' ? 'bg-blue-100 text-blue-600' :
                                                                'bg-green-100 text-green-600'
                                                            }`}>
                                                                {activity.type === 'meal' ? '🍽️' : activity.type === 'activity' ? '🎯' : '🌴'}
                                                            </div>
                                                            {idx < day.activities.length - 1 && (
                                                                <div className="w-0.5 h-full bg-gray-200 my-1"></div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 pb-4">
                                                            <div className="flex justify-between">
                                                                <p className="font-medium">{activity.activity}</p>
                                                                <span className="text-sm text-gray-500">{activity.time}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Flight & Hotel Suggestions */}
                                {(selectedItinerary.flights || selectedItinerary.hotels) && (
                                    <div className="px-6 pb-6 grid grid-cols-2 gap-4">
                                        {selectedItinerary.flights && (
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <h4 className="font-medium mb-2">Suggested Flights</h4>
                                                <div className="text-sm">
                                                    <p>{selectedItinerary.flights.outbound.airline} {selectedItinerary.flights.outbound.flightNo}</p>
                                                    <p className="text-gray-500">{selectedItinerary.flights.outbound.departure} - {selectedItinerary.flights.outbound.arrival}</p>
                                                    <p className="text-green-600 font-medium mt-1">₹{selectedItinerary.flights.outbound.price}</p>
                                                </div>
                                            </div>
                                        )}
                                        {selectedItinerary.hotels && selectedItinerary.hotels[0] && (
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <h4 className="font-medium mb-2">Suggested Hotel</h4>
                                                <div className="text-sm">
                                                    <p>{selectedItinerary.hotels[0].name}</p>
                                                    <p className="text-gray-500">{'⭐'.repeat(selectedItinerary.hotels[0].rating)}</p>
                                                    <p className="text-green-600 font-medium mt-1">₹{selectedItinerary.hotels[0].pricePerNight}/night</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Create Your First Itinerary</h3>
                                <p className="text-gray-500 mb-6">Fill in the details on the left to generate a personalized travel itinerary</p>

                                {/* Recent Itineraries */}
                                {itineraries.length > 0 && (
                                    <div className="text-left mt-8">
                                        <h4 className="font-medium mb-3">Recent Itineraries</h4>
                                        <div className="space-y-2">
                                            {itineraries.map(it => (
                                                <button
                                                    key={it.id}
                                                    onClick={() => setSelectedItinerary(it)}
                                                    className="w-full p-3 bg-gray-50 rounded-lg text-left hover:bg-gray-100 flex justify-between items-center"
                                                >
                                                    <div>
                                                        <p className="font-medium">{it.destination}</p>
                                                        <p className="text-sm text-gray-500">{it.days} days • {it.template}</p>
                                                    </div>
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(it.createdAt).toLocaleDateString()}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Upgrade Modal */}
            {showUpgradeModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Upgrade to Pro</h2>
                            <p className="text-gray-600">Unlock full itinerary builder features</p>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>10 itineraries per day (vs 2 on Free)</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Up to 30-day trips (vs 5 days on Free)</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Export to PDF, DOCX, HTML</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>10 AI images per day</span>
                            </div>
                        </div>

                        <div className="text-center mb-6">
                            <span className="text-4xl font-bold">₹299</span>
                            <span className="text-gray-500">/month</span>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowUpgradeModal(false)}
                                className="flex-1 py-3 border rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpgrade}
                                className="flex-1 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-medium"
                            >
                                Upgrade Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItineraryBuilder;
