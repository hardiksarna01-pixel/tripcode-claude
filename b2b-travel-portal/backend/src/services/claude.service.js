/**
 * Claude API Service
 * Handles all interactions with Anthropic's Claude API
 */

const Anthropic = require('@anthropic-ai/sdk');

// Initialize Anthropic client
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

// Model configuration
const CLAUDE_MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 4096;

/**
 * Generate travel itinerary using Claude
 */
const generateItinerary = async ({
    destination,
    startDate,
    endDate,
    travelers,
    budget,
    interests,
    template,
    includeFlights,
    includeHotels,
    notes
}) => {
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;

    const prompt = `You are an expert travel planner specializing in Indian and international destinations. Create a detailed day-by-day travel itinerary.

TRIP DETAILS:
- Destination: ${destination}
- Travel Dates: ${startDate} to ${endDate} (${days} days)
- Travelers: ${travelers.adults} adults, ${travelers.children || 0} children
- Budget Level: ${budget || 'moderate'}
- Interests: ${interests?.join(', ') || 'general sightseeing'}
- Trip Type: ${template || 'custom'}
${notes ? `- Special Notes: ${notes}` : ''}

Please generate a comprehensive itinerary in the following JSON format:

{
    "summary": {
        "destination": "${destination}",
        "totalDays": ${days},
        "highlights": ["highlight1", "highlight2", "highlight3"],
        "bestTimeToVisit": "month range",
        "totalEstimatedCost": number_in_INR,
        "currency": "INR"
    },
    "dayPlan": [
        {
            "day": 1,
            "date": "${startDate}",
            "title": "Day title",
            "activities": [
                {
                    "time": "08:00",
                    "activity": "Activity description",
                    "duration": "2 hours",
                    "type": "meal|activity|sightseeing|leisure|travel",
                    "location": "Location name",
                    "estimatedCost": number_in_INR,
                    "tips": "Optional tip"
                }
            ],
            "meals": {
                "breakfast": {"venue": "Place name", "cuisine": "type", "estimatedCost": number},
                "lunch": {"venue": "Place name", "cuisine": "type", "estimatedCost": number},
                "dinner": {"venue": "Place name", "cuisine": "type", "estimatedCost": number}
            },
            "accommodation": {
                "name": "Hotel name",
                "area": "Location area",
                "type": "Hotel/Resort/Hostel",
                "estimatedCost": number_per_night
            },
            "dailyTips": ["tip1", "tip2"],
            "estimatedDailyCost": number_in_INR
        }
    ],
    ${includeFlights ? `"flightSuggestions": {
        "outbound": [
            {"airline": "Airline", "flightNo": "XX-1234", "departure": "06:00", "arrival": "08:30", "from": "DEL", "to": "${destination.substring(0, 3).toUpperCase()}", "estimatedPrice": number}
        ],
        "return": [
            {"airline": "Airline", "flightNo": "XX-5678", "departure": "18:00", "arrival": "20:30", "estimatedPrice": number}
        ]
    },` : ''}
    ${includeHotels ? `"hotelSuggestions": [
        {
            "name": "Hotel Name",
            "rating": 4,
            "area": "Location",
            "pricePerNight": number,
            "amenities": ["WiFi", "Pool", "Gym"],
            "bookingTip": "Booking advice"
        }
    ],` : ''}
    "packingList": ["item1", "item2"],
    "importantContacts": {
        "emergencyNumber": "112",
        "touristHelpline": "1363",
        "localPolice": "100"
    },
    "weatherInfo": {
        "expectedTemperature": "20-30°C",
        "conditions": "sunny/rainy/etc",
        "recommendation": "What to wear"
    }
}

Ensure:
1. Activities are realistic and properly timed
2. Costs are in Indian Rupees (INR) and realistic for ${budget || 'moderate'} budget
3. Include local food recommendations
4. Add practical tips for each day
5. Consider travel time between locations
6. Balance activity with rest time
7. Include popular attractions and hidden gems

Return ONLY valid JSON, no additional text.`;

    try {
        const response = await anthropic.messages.create({
            model: CLAUDE_MODEL,
            max_tokens: MAX_TOKENS,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ]
        });

        // Extract the text content
        const content = response.content[0].text;

        // Parse JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        throw new Error('Failed to parse itinerary response');
    } catch (error) {
        console.error('Claude API error:', error);
        throw error;
    }
};

/**
 * Enhance image prompt using Claude
 */
const enhanceImagePrompt = async ({
    destination,
    style,
    category,
    originalPrompt
}) => {
    const prompt = `You are an expert at creating prompts for AI image generation. Create an enhanced, detailed prompt for generating a travel/tourism image.

INPUT:
- Destination: ${destination || 'Not specified'}
- Style: ${style || 'photorealistic'}
- Category: ${category || 'destination'}
- Original prompt: ${originalPrompt || destination}

Create a detailed image generation prompt that:
1. Describes the scene vividly
2. Includes lighting, mood, and atmosphere
3. Specifies composition and framing
4. Incorporates the requested style
5. Highlights iconic elements of the destination

Return ONLY the enhanced prompt text, nothing else. The prompt should be 2-3 sentences, around 50-100 words.

Example output format:
"A breathtaking aerial view of the Taj Mahal at golden hour, with warm sunlight casting long shadows across the reflecting pools. The pristine white marble dome glows against a dramatic orange and pink sky, while lush Mughal gardens frame the iconic monument. Shot in photorealistic style with cinematic composition."`;

    try {
        const response = await anthropic.messages.create({
            model: CLAUDE_MODEL,
            max_tokens: 500,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ]
        });

        return response.content[0].text.trim().replace(/^["']|["']$/g, '');
    } catch (error) {
        console.error('Claude API error:', error);
        // Return a basic enhanced prompt as fallback
        return `Beautiful ${style || 'photorealistic'} image of ${destination || originalPrompt}, professional travel photography, vibrant colors, stunning composition`;
    }
};

/**
 * Generate travel recommendations
 */
const generateRecommendations = async ({
    destination,
    duration,
    travelStyle,
    budget
}) => {
    const prompt = `As a travel expert, provide concise recommendations for ${destination}.

Duration: ${duration} days
Style: ${travelStyle || 'leisure'}
Budget: ${budget || 'moderate'}

Return JSON with:
{
    "mustVisit": ["place1", "place2", "place3"],
    "hiddenGems": ["gem1", "gem2"],
    "localFood": ["dish1", "dish2", "dish3"],
    "bestAreas": ["area1", "area2"],
    "avoidTouristTraps": ["tip1", "tip2"],
    "bestTimeToVisit": "months",
    "budgetTips": ["tip1", "tip2"]
}

Return ONLY valid JSON.`;

    try {
        const response = await anthropic.messages.create({
            model: CLAUDE_MODEL,
            max_tokens: 1000,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ]
        });

        const content = response.content[0].text;
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        throw new Error('Failed to parse recommendations');
    } catch (error) {
        console.error('Claude API error:', error);
        throw error;
    }
};

/**
 * Answer travel-related questions
 */
const answerTravelQuestion = async (question, context = {}) => {
    const prompt = `You are a helpful travel assistant. Answer the following travel-related question concisely.

${context.destination ? `Context: Trip to ${context.destination}` : ''}
${context.dates ? `Dates: ${context.dates}` : ''}

Question: ${question}

Provide a helpful, accurate, and concise answer. If you're unsure, say so.`;

    try {
        const response = await anthropic.messages.create({
            model: CLAUDE_MODEL,
            max_tokens: 500,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ]
        });

        return response.content[0].text.trim();
    } catch (error) {
        console.error('Claude API error:', error);
        throw error;
    }
};

/**
 * Check if Claude API is available
 */
const isAvailable = () => {
    return !!process.env.ANTHROPIC_API_KEY;
};

module.exports = {
    generateItinerary,
    enhanceImagePrompt,
    generateRecommendations,
    answerTravelQuestion,
    isAvailable
};
