/**
 * Itinerary Builder Controller
 * AI-powered travel itinerary generation with usage limits
 * Uses Claude API for intelligent itinerary generation
 */

const {
    AI_FEATURE_PLANS,
    ITINERARY_TEMPLATES,
    POPULAR_DESTINATIONS,
    checkQuota,
    getPlanDetails
} = require('../config/aiFeatures');

const claudeService = require('../services/claude.service');

// In-memory storage (replace with database in production)
const userUsage = new Map();
const itineraries = new Map();
const userSubscriptions = new Map();

/**
 * Get daily usage reset time
 */
const getResetTime = () => {
    const now = new Date();
    const reset = new Date(now);
    reset.setHours(0, 0, 0, 0);
    reset.setDate(reset.getDate() + 1);
    return reset;
};

/**
 * Get or initialize user usage
 */
const getUserUsage = (userId) => {
    let usage = userUsage.get(userId);
    const now = new Date();

    if (!usage || new Date(usage.resetAt) <= now) {
        usage = {
            userId,
            imagesUsedToday: 0,
            itinerariesUsedToday: 0,
            resetAt: getResetTime().toISOString(),
            totalImagesGenerated: usage?.totalImagesGenerated || 0,
            totalItinerariesGenerated: usage?.totalItinerariesGenerated || 0
        };
        userUsage.set(userId, usage);
    }

    return usage;
};

/**
 * Get user's AI feature plan
 */
const getUserPlan = (userId) => {
    return userSubscriptions.get(userId) || 'FREE';
};

/**
 * Get itinerary templates and config
 */
const getConfig = async (req, res) => {
    try {
        const userId = req.user?.id || 'demo';
        const plan = getUserPlan(userId);
        const planDetails = getPlanDetails(plan);

        res.json({
            templates: ITINERARY_TEMPLATES,
            popularDestinations: POPULAR_DESTINATIONS,
            currentPlan: plan,
            planDetails,
            maxDays: planDetails.limits.itineraryDays,
            exportFormats: planDetails.limits.exportFormats
        });
    } catch (error) {
        console.error('Error getting config:', error);
        res.status(500).json({ error: 'Failed to get configuration' });
    }
};

/**
 * Get usage statistics
 */
const getUsage = async (req, res) => {
    try {
        const userId = req.user?.id || 'demo';
        const plan = getUserPlan(userId);
        const usage = getUserUsage(userId);
        const planDetails = getPlanDetails(plan);

        const quota = checkQuota(usage, plan, 'itinerary');

        res.json({
            plan,
            usage: {
                used: usage.itinerariesUsedToday,
                limit: planDetails.limits.itinerariesPerDay,
                remaining: quota.remaining
            },
            resetAt: usage.resetAt,
            lifetime: {
                total: usage.totalItinerariesGenerated
            }
        });
    } catch (error) {
        console.error('Error getting usage:', error);
        res.status(500).json({ error: 'Failed to get usage statistics' });
    }
};

/**
 * Generate AI itinerary
 */
const generateItinerary = async (req, res) => {
    try {
        const userId = req.user?.id || 'demo';
        const {
            destination,
            startDate,
            endDate,
            travelers,
            budget,
            interests,
            templateId,
            includeFlights = true,
            includeHotels = true,
            includeActivities = true,
            notes
        } = req.body;

        if (!destination || !startDate || !endDate) {
            return res.status(400).json({ error: 'Destination, start date, and end date are required' });
        }

        // Calculate days
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        // Check plan limits
        const plan = getUserPlan(userId);
        const planDetails = getPlanDetails(plan);

        if (days > planDetails.limits.itineraryDays) {
            return res.status(400).json({
                error: `Your plan allows up to ${planDetails.limits.itineraryDays} days. Please upgrade for longer trips.`,
                maxDays: planDetails.limits.itineraryDays,
                requestedDays: days
            });
        }

        // Check quota
        const usage = getUserUsage(userId);
        const quota = checkQuota(usage, plan, 'itinerary');

        if (!quota.allowed) {
            return res.status(429).json({
                error: 'Daily itinerary generation limit reached',
                limit: quota.limit,
                used: quota.used,
                resetAt: usage.resetAt,
                upgradeMessage: plan === 'FREE'
                    ? 'Upgrade to Pro plan for 10 itineraries per day at just ₹299/month'
                    : null
            });
        }

        // Get template if specified
        const template = templateId ? ITINERARY_TEMPLATES.find(t => t.id === templateId) : null;

        // Generate itinerary ID
        const itineraryId = `itin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        let generatedData;
        let dayPlan;
        let summary;
        let flights = null;
        let hotels = null;

        // Try to generate using Claude API
        if (claudeService.isAvailable()) {
            try {
                console.log('Generating itinerary with Claude API...');
                generatedData = await claudeService.generateItinerary({
                    destination,
                    startDate,
                    endDate,
                    travelers: travelers || { adults: 2, children: 0 },
                    budget,
                    interests,
                    template: template?.name,
                    includeFlights,
                    includeHotels,
                    notes
                });

                dayPlan = generatedData.dayPlan || [];
                summary = generatedData.summary || {
                    totalDays: days,
                    totalEstimatedCost: dayPlan.reduce((sum, day) => sum + (day.estimatedDailyCost || 5000), 0),
                    currency: 'INR',
                    highlights: generatedData.summary?.highlights || []
                };
                flights = includeFlights ? generatedData.flightSuggestions : null;
                hotels = includeHotels ? generatedData.hotelSuggestions : null;

                console.log('Claude API itinerary generated successfully');
            } catch (claudeError) {
                console.error('Claude API error, falling back to mock:', claudeError.message);
                // Fall back to mock generation
                generatedData = null;
            }
        }

        // Fallback to mock generation if Claude is not available or fails
        if (!generatedData) {
            console.log('Using fallback mock itinerary generation');
            dayPlan = [];
            for (let i = 0; i < days; i++) {
                const currentDate = new Date(start);
                currentDate.setDate(start.getDate() + i);

                const dayActivities = generateDayActivities(destination, i + 1, days, interests, template);

                dayPlan.push({
                    day: i + 1,
                    date: currentDate.toISOString().split('T')[0],
                    title: dayActivities.title,
                    activities: dayActivities.activities,
                    meals: dayActivities.meals,
                    accommodation: i < days - 1 ? dayActivities.accommodation : null,
                    tips: dayActivities.tips,
                    estimatedCost: dayActivities.estimatedCost
                });
            }

            const totalEstimatedCost = dayPlan.reduce((sum, day) => sum + day.estimatedCost, 0);
            summary = {
                totalDays: days,
                totalEstimatedCost,
                currency: 'INR',
                highlights: extractHighlights(dayPlan)
            };
            flights = includeFlights ? generateFlightSuggestions(destination, startDate, endDate) : null;
            hotels = includeHotels ? generateHotelSuggestions(destination, days, budget) : null;
        }

        const itinerary = {
            id: itineraryId,
            userId,
            destination,
            startDate,
            endDate,
            days,
            travelers: travelers || { adults: 2, children: 0 },
            budget,
            interests: interests || [],
            template: template?.name || 'Custom',
            includeFlights,
            includeHotels,
            includeActivities,
            notes,
            dayPlan,
            summary,
            flights,
            hotels,
            packingList: generatedData?.packingList || [],
            weatherInfo: generatedData?.weatherInfo || null,
            importantContacts: generatedData?.importantContacts || null,
            generatedBy: claudeService.isAvailable() && generatedData ? 'claude' : 'fallback',
            status: 'completed',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Store itinerary
        itineraries.set(itineraryId, itinerary);

        // Update usage
        usage.itinerariesUsedToday++;
        usage.totalItinerariesGenerated++;
        userUsage.set(userId, usage);

        res.status(201).json({
            message: 'Itinerary generated successfully',
            itinerary,
            usage: {
                remaining: quota.remaining - 1,
                limit: quota.limit,
                resetAt: usage.resetAt
            }
        });
    } catch (error) {
        console.error('Error generating itinerary:', error);
        res.status(500).json({ error: 'Failed to generate itinerary' });
    }
};

/**
 * Get user's itineraries
 */
const getItineraries = async (req, res) => {
    try {
        const userId = req.user?.id || 'demo';
        const { page = 1, limit = 10 } = req.query;

        const userItineraries = Array.from(itineraries.values())
            .filter(it => it.userId === userId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const start = (page - 1) * limit;
        const paginatedItineraries = userItineraries.slice(start, start + parseInt(limit));

        res.json({
            itineraries: paginatedItineraries.map(it => ({
                id: it.id,
                destination: it.destination,
                startDate: it.startDate,
                endDate: it.endDate,
                days: it.days,
                template: it.template,
                status: it.status,
                createdAt: it.createdAt
            })),
            total: userItineraries.length,
            page: parseInt(page),
            totalPages: Math.ceil(userItineraries.length / limit)
        });
    } catch (error) {
        console.error('Error getting itineraries:', error);
        res.status(500).json({ error: 'Failed to get itineraries' });
    }
};

/**
 * Get single itinerary
 */
const getItinerary = async (req, res) => {
    try {
        const { itineraryId } = req.params;
        const itinerary = itineraries.get(itineraryId);

        if (!itinerary) {
            return res.status(404).json({ error: 'Itinerary not found' });
        }

        res.json(itinerary);
    } catch (error) {
        console.error('Error getting itinerary:', error);
        res.status(500).json({ error: 'Failed to get itinerary' });
    }
};

/**
 * Update itinerary
 */
const updateItinerary = async (req, res) => {
    try {
        const userId = req.user?.id || 'demo';
        const { itineraryId } = req.params;
        const updates = req.body;

        const itinerary = itineraries.get(itineraryId);

        if (!itinerary) {
            return res.status(404).json({ error: 'Itinerary not found' });
        }

        if (itinerary.userId !== userId) {
            return res.status(403).json({ error: 'Not authorized to update this itinerary' });
        }

        // Update allowed fields
        const allowedUpdates = ['notes', 'dayPlan', 'travelers', 'budget'];
        allowedUpdates.forEach(field => {
            if (updates[field] !== undefined) {
                itinerary[field] = updates[field];
            }
        });

        itinerary.updatedAt = new Date().toISOString();
        itineraries.set(itineraryId, itinerary);

        res.json({ message: 'Itinerary updated successfully', itinerary });
    } catch (error) {
        console.error('Error updating itinerary:', error);
        res.status(500).json({ error: 'Failed to update itinerary' });
    }
};

/**
 * Delete itinerary
 */
const deleteItinerary = async (req, res) => {
    try {
        const userId = req.user?.id || 'demo';
        const { itineraryId } = req.params;

        const itinerary = itineraries.get(itineraryId);

        if (!itinerary) {
            return res.status(404).json({ error: 'Itinerary not found' });
        }

        if (itinerary.userId !== userId) {
            return res.status(403).json({ error: 'Not authorized to delete this itinerary' });
        }

        itineraries.delete(itineraryId);

        res.json({ message: 'Itinerary deleted successfully' });
    } catch (error) {
        console.error('Error deleting itinerary:', error);
        res.status(500).json({ error: 'Failed to delete itinerary' });
    }
};

/**
 * Export itinerary
 */
const exportItinerary = async (req, res) => {
    try {
        const userId = req.user?.id || 'demo';
        const { itineraryId } = req.params;
        const { format = 'pdf' } = req.query;

        const itinerary = itineraries.get(itineraryId);

        if (!itinerary) {
            return res.status(404).json({ error: 'Itinerary not found' });
        }

        const plan = getUserPlan(userId);
        const planDetails = getPlanDetails(plan);

        if (!planDetails.limits.exportFormats.includes(format)) {
            return res.status(403).json({
                error: `${format.toUpperCase()} export not available on your plan`,
                availableFormats: planDetails.limits.exportFormats,
                upgradeMessage: 'Upgrade to Pro for more export options'
            });
        }

        // In production, generate actual file
        res.json({
            message: `Itinerary exported as ${format.toUpperCase()}`,
            downloadUrl: `/api/v1/itineraries/${itineraryId}/download?format=${format}`,
            format,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        });
    } catch (error) {
        console.error('Error exporting itinerary:', error);
        res.status(500).json({ error: 'Failed to export itinerary' });
    }
};

/**
 * Duplicate itinerary
 */
const duplicateItinerary = async (req, res) => {
    try {
        const userId = req.user?.id || 'demo';
        const { itineraryId } = req.params;

        const original = itineraries.get(itineraryId);

        if (!original) {
            return res.status(404).json({ error: 'Itinerary not found' });
        }

        const newId = `itin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const duplicate = {
            ...original,
            id: newId,
            userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        itineraries.set(newId, duplicate);

        res.status(201).json({
            message: 'Itinerary duplicated successfully',
            itinerary: duplicate
        });
    } catch (error) {
        console.error('Error duplicating itinerary:', error);
        res.status(500).json({ error: 'Failed to duplicate itinerary' });
    }
};

// Helper functions
function generateDayActivities(destination, dayNum, totalDays, interests, template) {
    const morningActivities = [
        { time: '07:00', activity: 'Breakfast at hotel', duration: '1 hour', type: 'meal' },
        { time: '08:30', activity: `Visit ${destination} local market`, duration: '2 hours', type: 'sightseeing' },
        { time: '10:30', activity: 'Explore historical monuments', duration: '2 hours', type: 'cultural' }
    ];

    const afternoonActivities = [
        { time: '13:00', activity: 'Lunch at local restaurant', duration: '1.5 hours', type: 'meal' },
        { time: '14:30', activity: 'Guided city tour', duration: '3 hours', type: 'tour' }
    ];

    const eveningActivities = [
        { time: '18:00', activity: 'Sunset viewpoint visit', duration: '1.5 hours', type: 'sightseeing' },
        { time: '20:00', activity: 'Dinner and local entertainment', duration: '2 hours', type: 'meal' }
    ];

    const titles = {
        1: `Arrival & ${destination} Welcome`,
        [totalDays]: `Farewell ${destination}`,
        default: `Exploring ${destination} - Day ${dayNum}`
    };

    return {
        title: titles[dayNum] || titles.default,
        activities: [...morningActivities, ...afternoonActivities, ...eveningActivities],
        meals: {
            breakfast: { included: true, venue: 'Hotel' },
            lunch: { included: false, suggestion: 'Local restaurant' },
            dinner: { included: false, suggestion: 'Recommended restaurant' }
        },
        accommodation: {
            name: `${destination} Grand Hotel`,
            type: 'Hotel',
            rating: 4
        },
        tips: [
            'Carry water bottle and sunscreen',
            'Best time to visit monuments is early morning',
            'Try local street food with caution'
        ],
        estimatedCost: 5000 + Math.floor(Math.random() * 3000)
    };
}

function extractHighlights(dayPlan) {
    return dayPlan.slice(0, 3).map(day => day.title);
}

function generateFlightSuggestions(destination, startDate, endDate) {
    return {
        outbound: [
            {
                airline: 'IndiGo',
                flightNo: '6E-1234',
                departure: '06:00',
                arrival: '08:30',
                price: 5500,
                class: 'Economy'
            },
            {
                airline: 'Air India',
                flightNo: 'AI-567',
                departure: '09:00',
                arrival: '11:30',
                price: 6200,
                class: 'Economy'
            }
        ],
        return: [
            {
                airline: 'IndiGo',
                flightNo: '6E-5678',
                departure: '18:00',
                arrival: '20:30',
                price: 5800,
                class: 'Economy'
            }
        ]
    };
}

function generateHotelSuggestions(destination, days, budget) {
    return [
        {
            name: `${destination} Grand Hotel`,
            rating: 4,
            pricePerNight: 4500,
            totalPrice: 4500 * (days - 1),
            amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant'],
            location: 'City Center'
        },
        {
            name: `${destination} Budget Inn`,
            rating: 3,
            pricePerNight: 2500,
            totalPrice: 2500 * (days - 1),
            amenities: ['WiFi', 'Restaurant'],
            location: 'Near Airport'
        }
    ];
}

module.exports = {
    getConfig,
    getUsage,
    generateItinerary,
    getItineraries,
    getItinerary,
    updateItinerary,
    deleteItinerary,
    exportItinerary,
    duplicateItinerary
};
