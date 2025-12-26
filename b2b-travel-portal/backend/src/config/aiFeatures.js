/**
 * AI Features Configuration
 * Image Generation and Itinerary Builder plans and limits
 */

// AI Feature Plans
const AI_FEATURE_PLANS = {
    FREE: {
        id: 'free',
        name: 'Free',
        price: 0,
        limits: {
            imagesPerDay: 2,
            itinerariesPerDay: 2,
            imageResolution: 'standard', // 512x512
            itineraryDays: 5, // Max trip days
            exportFormats: ['pdf']
        }
    },
    PRO: {
        id: 'pro',
        name: 'Pro',
        price: 299, // INR per month
        limits: {
            imagesPerDay: 10,
            itinerariesPerDay: 10,
            imageResolution: 'high', // 1024x1024
            itineraryDays: 30, // Max trip days
            exportFormats: ['pdf', 'docx', 'html'],
            priorityGeneration: true,
            customBranding: true
        }
    }
};

// Image Generation Styles
const IMAGE_STYLES = [
    { id: 'photorealistic', name: 'Photorealistic', description: 'Realistic travel photography style' },
    { id: 'artistic', name: 'Artistic', description: 'Artistic and painterly style' },
    { id: 'minimalist', name: 'Minimalist', description: 'Clean and minimal design' },
    { id: 'vintage', name: 'Vintage', description: 'Retro travel poster style' },
    { id: 'watercolor', name: 'Watercolor', description: 'Soft watercolor painting style' },
    { id: 'digital-art', name: 'Digital Art', description: 'Modern digital illustration' }
];

// Image Categories for Travel
const IMAGE_CATEGORIES = [
    { id: 'destination', name: 'Destination', prompts: ['scenic view of', 'beautiful landscape of', 'iconic landmarks of'] },
    { id: 'hotel', name: 'Hotels & Resorts', prompts: ['luxury hotel in', 'resort pool at', 'hotel lobby of'] },
    { id: 'adventure', name: 'Adventure', prompts: ['adventure sports in', 'hiking trail at', 'outdoor activities in'] },
    { id: 'culture', name: 'Culture & Heritage', prompts: ['traditional culture of', 'heritage site at', 'local festival in'] },
    { id: 'food', name: 'Food & Cuisine', prompts: ['local cuisine of', 'street food in', 'restaurant dining at'] },
    { id: 'beach', name: 'Beach & Islands', prompts: ['tropical beach at', 'island paradise of', 'sunset at beach in'] }
];

// Itinerary Templates
const ITINERARY_TEMPLATES = [
    { id: 'honeymoon', name: 'Honeymoon', description: 'Romantic getaway template', days: 7 },
    { id: 'family', name: 'Family Vacation', description: 'Family-friendly activities', days: 5 },
    { id: 'adventure', name: 'Adventure Trip', description: 'Thrill-seeking experiences', days: 4 },
    { id: 'cultural', name: 'Cultural Tour', description: 'Heritage and culture focused', days: 6 },
    { id: 'business', name: 'Business + Leisure', description: 'Work trip with leisure time', days: 3 },
    { id: 'weekend', name: 'Weekend Getaway', description: 'Quick weekend trip', days: 2 },
    { id: 'pilgrimage', name: 'Pilgrimage', description: 'Spiritual journey template', days: 5 },
    { id: 'luxury', name: 'Luxury Escape', description: 'Premium experiences', days: 7 }
];

// Popular Destinations with pre-built data
const POPULAR_DESTINATIONS = [
    { city: 'Goa', country: 'India', type: 'beach', highlights: ['Beaches', 'Nightlife', 'Portuguese Heritage'] },
    { city: 'Jaipur', country: 'India', type: 'cultural', highlights: ['Forts', 'Palaces', 'Handicrafts'] },
    { city: 'Kerala', country: 'India', type: 'nature', highlights: ['Backwaters', 'Ayurveda', 'Hill Stations'] },
    { city: 'Manali', country: 'India', type: 'adventure', highlights: ['Mountains', 'Trekking', 'Snow'] },
    { city: 'Dubai', country: 'UAE', type: 'luxury', highlights: ['Shopping', 'Desert Safari', 'Architecture'] },
    { city: 'Singapore', country: 'Singapore', type: 'urban', highlights: ['Gardens', 'Food', 'Theme Parks'] },
    { city: 'Bali', country: 'Indonesia', type: 'beach', highlights: ['Temples', 'Rice Terraces', 'Beaches'] },
    { city: 'Thailand', country: 'Thailand', type: 'mixed', highlights: ['Temples', 'Beaches', 'Street Food'] }
];

/**
 * Check if user has remaining quota
 */
const checkQuota = (usage, plan, feature) => {
    const planConfig = AI_FEATURE_PLANS[plan.toUpperCase()] || AI_FEATURE_PLANS.FREE;
    const limit = feature === 'image' ? planConfig.limits.imagesPerDay : planConfig.limits.itinerariesPerDay;
    const used = feature === 'image' ? usage.imagesUsedToday : usage.itinerariesUsedToday;

    return {
        allowed: used < limit,
        remaining: Math.max(0, limit - used),
        limit,
        used
    };
};

/**
 * Get plan details
 */
const getPlanDetails = (plan) => {
    return AI_FEATURE_PLANS[plan.toUpperCase()] || AI_FEATURE_PLANS.FREE;
};

module.exports = {
    AI_FEATURE_PLANS,
    IMAGE_STYLES,
    IMAGE_CATEGORIES,
    ITINERARY_TEMPLATES,
    POPULAR_DESTINATIONS,
    checkQuota,
    getPlanDetails
};
