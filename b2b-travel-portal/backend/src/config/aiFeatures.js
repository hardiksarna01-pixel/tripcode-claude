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

// Image Prompt Templates for Quick Generation
const IMAGE_PROMPT_TEMPLATES = [
    // Destination Marketing
    {
        id: 'hero-banner',
        name: 'Hero Banner',
        category: 'marketing',
        icon: '🖼️',
        description: 'Eye-catching banner for website or social media',
        prompt: 'Stunning panoramic view of {destination} at golden hour, dramatic sky, professional travel photography, wide angle, perfect for website banner',
        style: 'photorealistic',
        aspectRatio: '16:9'
    },
    {
        id: 'instagram-post',
        name: 'Instagram Post',
        category: 'marketing',
        icon: '📱',
        description: 'Square format for social media',
        prompt: 'Beautiful travel moment in {destination}, vibrant colors, Instagram-worthy composition, lifestyle photography, natural lighting',
        style: 'photorealistic',
        aspectRatio: '1:1'
    },
    {
        id: 'travel-poster',
        name: 'Vintage Travel Poster',
        category: 'marketing',
        icon: '🎨',
        description: 'Retro-style promotional poster',
        prompt: 'Vintage travel poster of {destination}, art deco style, bold colors, iconic landmarks, retro typography space at top',
        style: 'vintage',
        aspectRatio: '2:3'
    },

    // Accommodation
    {
        id: 'luxury-hotel',
        name: 'Luxury Hotel View',
        category: 'accommodation',
        icon: '🏨',
        description: 'Upscale hotel room with view',
        prompt: 'Luxury hotel room in {destination} with stunning view, elegant interiors, king bed, floor-to-ceiling windows, warm lighting',
        style: 'photorealistic',
        aspectRatio: '16:9'
    },
    {
        id: 'resort-pool',
        name: 'Resort Pool Scene',
        category: 'accommodation',
        icon: '🏊',
        description: 'Inviting pool area',
        prompt: 'Beautiful infinity pool at a luxury resort in {destination}, tropical setting, lounge chairs, palm trees, crystal clear water',
        style: 'photorealistic',
        aspectRatio: '16:9'
    },
    {
        id: 'boutique-stay',
        name: 'Boutique Homestay',
        category: 'accommodation',
        icon: '🏡',
        description: 'Cozy local accommodation',
        prompt: 'Charming boutique homestay in {destination}, traditional architecture, cozy interiors, local decor, warm and inviting atmosphere',
        style: 'photorealistic',
        aspectRatio: '4:3'
    },

    // Experiences
    {
        id: 'adventure-activity',
        name: 'Adventure Activity',
        category: 'experiences',
        icon: '🧗',
        description: 'Thrilling outdoor adventure',
        prompt: 'Exciting adventure activity in {destination}, action shot, dramatic landscape, thrill-seeking tourists, professional sports photography',
        style: 'photorealistic',
        aspectRatio: '16:9'
    },
    {
        id: 'cultural-experience',
        name: 'Cultural Experience',
        category: 'experiences',
        icon: '🎭',
        description: 'Local culture and traditions',
        prompt: 'Authentic cultural experience in {destination}, traditional performance, colorful costumes, local artisans, cultural immersion',
        style: 'photorealistic',
        aspectRatio: '4:3'
    },
    {
        id: 'food-tour',
        name: 'Food & Culinary',
        category: 'experiences',
        icon: '🍽️',
        description: 'Local food and dining',
        prompt: 'Delicious local cuisine of {destination}, beautifully plated dishes, street food scene, food photography, appetizing presentation',
        style: 'photorealistic',
        aspectRatio: '1:1'
    },
    {
        id: 'sunset-moment',
        name: 'Romantic Sunset',
        category: 'experiences',
        icon: '🌅',
        description: 'Magical sunset scene',
        prompt: 'Breathtaking sunset in {destination}, silhouette of landmarks, golden and pink sky, romantic atmosphere, couple enjoying view',
        style: 'photorealistic',
        aspectRatio: '16:9'
    },

    // Nature & Landscapes
    {
        id: 'mountain-vista',
        name: 'Mountain Vista',
        category: 'nature',
        icon: '🏔️',
        description: 'Majestic mountain landscape',
        prompt: 'Majestic mountain landscape near {destination}, snow-capped peaks, lush valleys, dramatic clouds, nature photography',
        style: 'photorealistic',
        aspectRatio: '16:9'
    },
    {
        id: 'beach-paradise',
        name: 'Beach Paradise',
        category: 'nature',
        icon: '🏖️',
        description: 'Pristine beach scene',
        prompt: 'Pristine tropical beach in {destination}, turquoise water, white sand, palm trees, paradise island vibes, aerial view',
        style: 'photorealistic',
        aspectRatio: '16:9'
    },
    {
        id: 'wildlife-safari',
        name: 'Wildlife Safari',
        category: 'nature',
        icon: '🦁',
        description: 'Wildlife and safari experience',
        prompt: 'Amazing wildlife safari near {destination}, exotic animals in natural habitat, golden hour lighting, wildlife photography',
        style: 'photorealistic',
        aspectRatio: '16:9'
    },

    // Special Occasions
    {
        id: 'honeymoon-romance',
        name: 'Honeymoon Romance',
        category: 'occasions',
        icon: '💑',
        description: 'Romantic couple moment',
        prompt: 'Romantic honeymoon scene in {destination}, couple enjoying private moment, candle-lit dinner, rose petals, luxury setting',
        style: 'photorealistic',
        aspectRatio: '4:3'
    },
    {
        id: 'family-vacation',
        name: 'Family Fun',
        category: 'occasions',
        icon: '👨‍👩‍👧‍👦',
        description: 'Family enjoying together',
        prompt: 'Happy family vacation in {destination}, parents with kids, fun activities, joyful moments, family-friendly attractions',
        style: 'photorealistic',
        aspectRatio: '16:9'
    },
    {
        id: 'group-celebration',
        name: 'Group Celebration',
        category: 'occasions',
        icon: '🎉',
        description: 'Friends or group trip',
        prompt: 'Group of friends celebrating in {destination}, party atmosphere, group photo moment, fun and excitement, travel buddies',
        style: 'photorealistic',
        aspectRatio: '16:9'
    }
];

// Itinerary Templates with detailed configurations
const ITINERARY_TEMPLATES = [
    {
        id: 'honeymoon',
        name: 'Honeymoon',
        icon: '💑',
        description: 'Romantic getaway for newlyweds',
        days: 7,
        travelers: { adults: 2, children: 0 },
        budget: 'luxury',
        interests: ['romance', 'relaxation', 'dining', 'spa'],
        includeFlights: true,
        includeHotels: true,
        notes: 'Focus on private experiences, candlelight dinners, couples spa, and romantic sunset spots'
    },
    {
        id: 'family',
        name: 'Family Vacation',
        icon: '👨‍👩‍👧‍👦',
        description: 'Fun-filled trip for the whole family',
        days: 5,
        travelers: { adults: 2, children: 2 },
        budget: 'moderate',
        interests: ['family-friendly', 'theme-parks', 'nature', 'educational'],
        includeFlights: true,
        includeHotels: true,
        notes: 'Include kid-friendly activities, theme parks, interactive museums, and family restaurants'
    },
    {
        id: 'adventure',
        name: 'Adventure Trip',
        icon: '🧗',
        description: 'Thrill-seeking outdoor experiences',
        days: 4,
        travelers: { adults: 2, children: 0 },
        budget: 'moderate',
        interests: ['adventure', 'trekking', 'sports', 'nature'],
        includeFlights: true,
        includeHotels: true,
        notes: 'Include adventure sports, hiking trails, camping options, and outdoor activities'
    },
    {
        id: 'cultural',
        name: 'Cultural Tour',
        icon: '🏛️',
        description: 'Heritage and culture exploration',
        days: 6,
        travelers: { adults: 2, children: 0 },
        budget: 'moderate',
        interests: ['history', 'culture', 'museums', 'heritage'],
        includeFlights: true,
        includeHotels: true,
        notes: 'Visit historical monuments, museums, local markets, and experience traditional arts'
    },
    {
        id: 'business',
        name: 'Business + Leisure',
        icon: '💼',
        description: 'Work trip with leisure time',
        days: 3,
        travelers: { adults: 1, children: 0 },
        budget: 'premium',
        interests: ['business', 'convenience', 'dining', 'nightlife'],
        includeFlights: true,
        includeHotels: true,
        notes: 'Central hotel location, fast WiFi, meeting spaces, and evening entertainment options'
    },
    {
        id: 'weekend',
        name: 'Weekend Getaway',
        icon: '🌴',
        description: 'Quick 2-day escape',
        days: 2,
        travelers: { adults: 2, children: 0 },
        budget: 'moderate',
        interests: ['relaxation', 'sightseeing', 'dining'],
        includeFlights: false,
        includeHotels: true,
        notes: 'Compact itinerary covering major highlights, nearby destination, road trip friendly'
    },
    {
        id: 'pilgrimage',
        name: 'Pilgrimage',
        icon: '🙏',
        description: 'Spiritual journey',
        days: 5,
        travelers: { adults: 2, children: 0 },
        budget: 'budget',
        interests: ['spiritual', 'temples', 'meditation', 'peace'],
        includeFlights: true,
        includeHotels: true,
        notes: 'Include darshan timings, temple protocols, vegetarian food options, and spiritual experiences'
    },
    {
        id: 'luxury',
        name: 'Luxury Escape',
        icon: '👑',
        description: 'Premium all-inclusive experience',
        days: 7,
        travelers: { adults: 2, children: 0 },
        budget: 'luxury',
        interests: ['luxury', 'spa', 'fine-dining', 'exclusive'],
        includeFlights: true,
        includeHotels: true,
        notes: '5-star hotels, private transfers, fine dining, spa treatments, and VIP experiences'
    },
    {
        id: 'backpacker',
        name: 'Backpacker Trip',
        icon: '🎒',
        description: 'Budget-friendly exploration',
        days: 10,
        travelers: { adults: 1, children: 0 },
        budget: 'budget',
        interests: ['backpacking', 'hostels', 'local-food', 'offbeat'],
        includeFlights: true,
        includeHotels: true,
        notes: 'Hostels, street food, public transport, hidden gems, and local experiences'
    },
    {
        id: 'senior',
        name: 'Senior Citizen Tour',
        icon: '👴',
        description: 'Relaxed pace for seniors',
        days: 6,
        travelers: { adults: 2, children: 0 },
        budget: 'moderate',
        interests: ['relaxation', 'heritage', 'nature', 'accessibility'],
        includeFlights: true,
        includeHotels: true,
        notes: 'Wheelchair accessible, minimal walking, comfortable stays, medical facilities nearby'
    }
];

// Quick-Start Itinerary Templates (Pre-built for popular destinations)
const QUICK_START_ITINERARIES = [
    {
        id: 'goa-beach-5d',
        name: 'Goa Beach Holiday',
        destination: 'Goa',
        days: 5,
        icon: '🏖️',
        description: 'Sun, sand, and seafood in Goa',
        template: 'family',
        highlights: ['Baga Beach', 'Old Goa Churches', 'Dudhsagar Falls', 'Night Markets'],
        bestFor: ['couples', 'friends', 'families'],
        bestSeason: 'October to March'
    },
    {
        id: 'rajasthan-heritage-7d',
        name: 'Rajasthan Royal Heritage',
        destination: 'Jaipur, Udaipur, Jodhpur',
        days: 7,
        icon: '🏰',
        description: 'Explore the land of kings',
        template: 'cultural',
        highlights: ['Amber Fort', 'City Palace', 'Mehrangarh Fort', 'Lake Pichola'],
        bestFor: ['couples', 'history-lovers', 'photographers'],
        bestSeason: 'October to March'
    },
    {
        id: 'kerala-backwaters-6d',
        name: 'Kerala Backwaters & Hills',
        destination: 'Munnar, Alleppey, Kovalam',
        days: 6,
        icon: '🌿',
        description: 'God\'s own country experience',
        template: 'honeymoon',
        highlights: ['Tea Gardens', 'Houseboat Stay', 'Ayurveda Spa', 'Beach Sunset'],
        bestFor: ['couples', 'nature-lovers', 'wellness'],
        bestSeason: 'September to March'
    },
    {
        id: 'himachal-adventure-5d',
        name: 'Himachal Adventure',
        destination: 'Manali, Solang Valley',
        days: 5,
        icon: '🏔️',
        description: 'Mountains and adventure sports',
        template: 'adventure',
        highlights: ['Rohtang Pass', 'Paragliding', 'River Rafting', 'Old Manali'],
        bestFor: ['adventure-seekers', 'friends', 'solo'],
        bestSeason: 'March to June, October to November'
    },
    {
        id: 'dubai-luxury-5d',
        name: 'Dubai Luxury Experience',
        destination: 'Dubai',
        days: 5,
        icon: '🌃',
        description: 'Glamour and entertainment',
        template: 'luxury',
        highlights: ['Burj Khalifa', 'Desert Safari', 'Dubai Mall', 'Palm Jumeirah'],
        bestFor: ['couples', 'families', 'shoppers'],
        bestSeason: 'November to March'
    },
    {
        id: 'bali-romance-7d',
        name: 'Bali Romantic Escape',
        destination: 'Bali, Indonesia',
        days: 7,
        icon: '🌺',
        description: 'Island paradise for couples',
        template: 'honeymoon',
        highlights: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Seminyak Beach', 'Spa Retreats'],
        bestFor: ['honeymooners', 'couples'],
        bestSeason: 'April to October'
    },
    {
        id: 'varanasi-spiritual-4d',
        name: 'Varanasi Spiritual Journey',
        destination: 'Varanasi',
        days: 4,
        icon: '🕉️',
        description: 'Sacred city on the Ganges',
        template: 'pilgrimage',
        highlights: ['Ganga Aarti', 'Kashi Vishwanath', 'Boat Ride', 'Sarnath'],
        bestFor: ['spiritual-seekers', 'photographers', 'culture-enthusiasts'],
        bestSeason: 'October to March'
    },
    {
        id: 'singapore-family-5d',
        name: 'Singapore Family Fun',
        destination: 'Singapore',
        days: 5,
        icon: '🎢',
        description: 'Theme parks and attractions',
        template: 'family',
        highlights: ['Universal Studios', 'Sentosa Island', 'Gardens by the Bay', 'Night Safari'],
        bestFor: ['families', 'kids'],
        bestSeason: 'Year-round'
    },
    {
        id: 'ladakh-road-10d',
        name: 'Ladakh Road Trip',
        destination: 'Leh, Nubra Valley, Pangong',
        days: 10,
        icon: '🏍️',
        description: 'Ultimate Himalayan road adventure',
        template: 'adventure',
        highlights: ['Khardung La', 'Pangong Lake', 'Nubra Valley', 'Monasteries'],
        bestFor: ['bikers', 'adventure-seekers', 'photographers'],
        bestSeason: 'June to September'
    },
    {
        id: 'thailand-mixed-6d',
        name: 'Thailand Complete',
        destination: 'Bangkok, Pattaya, Phuket',
        days: 6,
        icon: '🛕',
        description: 'Temples, beaches, and nightlife',
        template: 'family',
        highlights: ['Grand Palace', 'Phi Phi Islands', 'Floating Markets', 'Thai Cuisine'],
        bestFor: ['everyone'],
        bestSeason: 'November to February'
    }
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
    IMAGE_PROMPT_TEMPLATES,
    ITINERARY_TEMPLATES,
    QUICK_START_ITINERARIES,
    POPULAR_DESTINATIONS,
    checkQuota,
    getPlanDetails
};
