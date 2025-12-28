/**
 * AI Service
 * AI-powered features using OpenAI/Anthropic
 */

const config = require('../../config');

class AIService {
    constructor() {
        this.provider = this.initProvider();
    }

    initProvider() {
        switch (config.ai.provider) {
            case 'anthropic':
                return new AnthropicProvider(config.ai.anthropic);
            default:
                return new OpenAIProvider(config.ai.openai);
        }
    }

    /**
     * Chat with AI assistant
     */
    async chat(messages, context = {}) {
        const systemPrompt = this.buildSystemPrompt(context);

        const response = await this.provider.chat([
            { role: 'system', content: systemPrompt },
            ...messages
        ]);

        return {
            message: response.content,
            tokens: response.usage,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Plan a trip based on user preferences
     */
    async planTrip(preferences) {
        const prompt = `Plan a detailed trip itinerary based on these preferences:

Destination: ${preferences.destination}
Duration: ${preferences.duration} days
Budget: ${preferences.budget}
Travel Style: ${preferences.travelStyle}
Interests: ${preferences.interests?.join(', ')}
Number of Travelers: ${preferences.travelers}
Travel Dates: ${preferences.startDate} to ${preferences.endDate}

Please provide:
1. Day-by-day itinerary
2. Recommended accommodations
3. Must-visit attractions
4. Local cuisine recommendations
5. Transportation suggestions
6. Estimated daily budget breakdown
7. Packing tips
8. Local customs and etiquette`;

        const response = await this.provider.complete(prompt);

        return {
            itinerary: this.parseItinerary(response.content),
            rawContent: response.content,
            generatedAt: new Date().toISOString()
        };
    }

    /**
     * Get personalized recommendations
     */
    async getRecommendations(userProfile, context) {
        const prompt = `Based on the user profile and context, provide personalized travel recommendations:

User Profile:
- Past destinations: ${userProfile.pastDestinations?.join(', ')}
- Preferred travel style: ${userProfile.travelStyle}
- Budget range: ${userProfile.budgetRange}
- Interests: ${userProfile.interests?.join(', ')}

Current Context:
- Looking for: ${context.lookingFor}
- Season: ${context.season}
- Duration: ${context.duration}

Provide 5 personalized destination recommendations with reasoning.`;

        const response = await this.provider.complete(prompt);

        return {
            recommendations: this.parseRecommendations(response.content),
            rawContent: response.content
        };
    }

    /**
     * Predict best time to book
     */
    async predictBestTimeToBook(route, travelDate) {
        const prompt = `Analyze the best time to book flights for:
Route: ${route.origin} to ${route.destination}
Travel Date: ${travelDate}

Consider:
1. Historical pricing patterns
2. Seasonal demand
3. Airlines operating this route
4. Major events/holidays

Provide booking recommendation with confidence level.`;

        const response = await this.provider.complete(prompt);

        return {
            recommendation: response.content,
            confidence: 0.8
        };
    }

    /**
     * Natural language search
     */
    async naturalLanguageSearch(query) {
        const prompt = `Parse this natural language travel query and extract structured search parameters:

Query: "${query}"

Extract:
- Trip type (flight, hotel, package, etc.)
- Origin city/airport
- Destination city/airport
- Departure date
- Return date (if applicable)
- Number of passengers
- Cabin class preference
- Any special requirements

Return as JSON format.`;

        const response = await this.provider.complete(prompt);

        try {
            return JSON.parse(response.content);
        } catch {
            return { rawQuery: query, parsed: false };
        }
    }

    /**
     * Generate destination description
     */
    async generateDestinationContent(destination) {
        const prompt = `Write engaging travel content for ${destination}:

Include:
1. Brief overview (2-3 sentences)
2. Best time to visit
3. Top 5 attractions
4. Local food highlights
5. Travel tips

Keep it informative and inspiring.`;

        const response = await this.provider.complete(prompt);
        return response.content;
    }

    /**
     * Analyze booking patterns
     */
    async analyzeBookingPatterns(bookings) {
        const summary = this.summarizeBookings(bookings);

        const prompt = `Analyze these booking patterns and provide insights:

${summary}

Provide:
1. Key trends
2. Revenue opportunities
3. Recommendations for improvement
4. Predicted busy periods`;

        const response = await this.provider.complete(prompt);
        return response.content;
    }

    // Helper methods
    buildSystemPrompt(context) {
        return `You are an AI travel assistant for a B2B/B2C travel portal.
You help users with:
- Finding flights, hotels, and holiday packages
- Trip planning and itinerary creation
- Travel recommendations
- Booking assistance

Current user context:
- User type: ${context.userType || 'guest'}
- Location: ${context.location || 'India'}
- Currency: ${context.currency || 'INR'}

Be helpful, concise, and always prioritize user safety.
For bookings, guide users to use the platform's search and booking features.`;
    }

    parseItinerary(content) {
        // Parse the AI response into structured itinerary
        return {
            days: [],
            summary: content
        };
    }

    parseRecommendations(content) {
        // Parse recommendations into structured format
        return [];
    }

    summarizeBookings(bookings) {
        return `Total bookings: ${bookings.length}
Total revenue: ${bookings.reduce((sum, b) => sum + b.amount, 0)}
Products: ${[...new Set(bookings.map(b => b.productType))].join(', ')}`;
    }
}

/**
 * OpenAI Provider
 */
class OpenAIProvider {
    constructor(config) {
        this.config = config;
        if (config.apiKey) {
            const OpenAI = require('openai');
            this.client = new OpenAI({ apiKey: config.apiKey });
        }
    }

    async chat(messages) {
        if (!this.client) {
            return { content: 'AI service not configured', usage: {} };
        }

        const response = await this.client.chat.completions.create({
            model: this.config.model || 'gpt-4',
            messages,
            max_tokens: 2000,
            temperature: 0.7
        });

        return {
            content: response.choices[0].message.content,
            usage: response.usage
        };
    }

    async complete(prompt) {
        return this.chat([{ role: 'user', content: prompt }]);
    }
}

/**
 * Anthropic Provider
 */
class AnthropicProvider {
    constructor(config) {
        this.config = config;
        if (config.apiKey) {
            const Anthropic = require('@anthropic-ai/sdk');
            this.client = new Anthropic({ apiKey: config.apiKey });
        }
    }

    async chat(messages) {
        if (!this.client) {
            return { content: 'AI service not configured', usage: {} };
        }

        const systemMessage = messages.find(m => m.role === 'system');
        const chatMessages = messages.filter(m => m.role !== 'system');

        const response = await this.client.messages.create({
            model: this.config.model || 'claude-3-sonnet-20240229',
            max_tokens: 2000,
            system: systemMessage?.content || '',
            messages: chatMessages.map(m => ({
                role: m.role === 'assistant' ? 'assistant' : 'user',
                content: m.content
            }))
        });

        return {
            content: response.content[0].text,
            usage: {
                input_tokens: response.usage.input_tokens,
                output_tokens: response.usage.output_tokens
            }
        };
    }

    async complete(prompt) {
        return this.chat([{ role: 'user', content: prompt }]);
    }
}

module.exports = new AIService();
