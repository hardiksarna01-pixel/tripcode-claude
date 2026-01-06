/**
 * AI Service - COMPLETE
 * AI Smart Search, Itinerary Builder, Image Generator, Billing, Usage Limits
 */

const config = require('../../config');

class AICompleteService {
    constructor() {
        this.providers = {
            openai: new OpenAIProvider(config.ai.openai),
            anthropic: new AnthropicProvider(config.ai.anthropic)
        };
        this.usageTracker = new AIUsageTracker();
        this.imageGenerator = new AIImageGenerator(config.ai.openai);
    }

    // ============================================
    // SMART SEARCH (Natural Language)
    // ============================================
    async smartSearch(query, userId, planType = 'free') {
        // Check usage limits
        await this.usageTracker.checkLimit(userId, 'smartSearch', planType);

        const prompt = `Parse this travel search query and extract structured parameters:

Query: "${query}"

Extract and return JSON with:
{
  "intent": "flight|hotel|bus|holiday|activity|insurance|visa|transfer",
  "origin": { "city": "", "code": "" },
  "destination": { "city": "", "code": "" },
  "departureDate": "YYYY-MM-DD",
  "returnDate": "YYYY-MM-DD or null",
  "tripType": "oneway|roundtrip|multicity",
  "passengers": { "adults": 1, "children": 0, "infants": 0 },
  "cabinClass": "economy|premium_economy|business|first",
  "hotelRooms": [{ "adults": 2, "children": 0 }],
  "checkIn": "YYYY-MM-DD",
  "checkOut": "YYYY-MM-DD",
  "preferences": [],
  "budget": { "min": null, "max": null, "currency": "INR" },
  "flexible": true|false,
  "specialRequests": []
}`;

        const provider = this.providers[config.ai.provider];
        const response = await provider.complete(prompt);

        // Track usage
        await this.usageTracker.recordUsage(userId, 'smartSearch', response.usage);

        try {
            return JSON.parse(response.content);
        } catch {
            return { rawQuery: query, parsed: false, suggestion: response.content };
        }
    }

    // ============================================
    // AI ITINERARY BUILDER
    // ============================================
    async buildItinerary(preferences, userId, planType = 'free') {
        await this.usageTracker.checkLimit(userId, 'itinerary', planType);

        const prompt = `Create a detailed travel itinerary:

Destination: ${preferences.destination}
Duration: ${preferences.days} days
Travelers: ${preferences.travelers} people
Budget: ${preferences.budget} ${preferences.currency || 'INR'}
Travel Style: ${preferences.travelStyle || 'balanced'}
Interests: ${preferences.interests?.join(', ') || 'general sightseeing'}
Start Date: ${preferences.startDate}
Special Requirements: ${preferences.specialRequirements || 'none'}

Create a comprehensive day-by-day itinerary with:
1. Morning, afternoon, and evening activities
2. Recommended restaurants and cuisine
3. Transportation between locations
4. Estimated costs for each activity
5. Tips and local insights
6. Alternative options for each day
7. Emergency contacts and important info

Return as structured JSON:
{
  "destination": "",
  "summary": "",
  "days": [
    {
      "day": 1,
      "date": "",
      "theme": "",
      "activities": [
        {
          "time": "",
          "activity": "",
          "location": "",
          "duration": "",
          "cost": 0,
          "tips": "",
          "alternatives": []
        }
      ],
      "meals": {
        "breakfast": { "place": "", "cuisine": "", "budget": "" },
        "lunch": { "place": "", "cuisine": "", "budget": "" },
        "dinner": { "place": "", "cuisine": "", "budget": "" }
      },
      "transport": [],
      "dailyBudget": 0
    }
  ],
  "totalBudget": 0,
  "packingList": [],
  "localTips": [],
  "emergencyContacts": []
}`;

        const provider = this.providers[config.ai.provider];
        const response = await provider.complete(prompt, 4000);

        await this.usageTracker.recordUsage(userId, 'itinerary', response.usage);

        try {
            return JSON.parse(response.content);
        } catch {
            return { rawItinerary: response.content };
        }
    }

    // ============================================
    // AI IMAGE GENERATOR
    // ============================================
    async generateImage(prompt, userId, planType = 'free', options = {}) {
        await this.usageTracker.checkLimit(userId, 'imageGeneration', planType);

        const result = await this.imageGenerator.generate(prompt, options);

        await this.usageTracker.recordUsage(userId, 'imageGeneration', { images: 1 });

        return result;
    }

    // ============================================
    // AI CHAT
    // ============================================
    async chat(messages, context, userId, planType = 'free') {
        await this.usageTracker.checkLimit(userId, 'chat', planType);

        const systemPrompt = `You are an expert travel assistant. You help users with:
- Finding flights, hotels, and travel packages
- Planning trips and creating itineraries
- Providing destination information and tips
- Answering travel-related questions
- Making booking recommendations

Current context:
- User type: ${context.userType || 'customer'}
- Currency: ${context.currency || 'INR'}
- Location: ${context.location || 'India'}

Be helpful, concise, and always prioritize user safety and satisfaction.`;

        const provider = this.providers[config.ai.provider];
        const response = await provider.chat([
            { role: 'system', content: systemPrompt },
            ...messages
        ]);

        await this.usageTracker.recordUsage(userId, 'chat', response.usage);

        return {
            message: response.content,
            tokens: response.usage
        };
    }

    // ============================================
    // PRICE PREDICTION
    // ============================================
    async predictPrice(route, travelDate, userId) {
        const prompt = `Analyze flight price trends for:
Route: ${route.origin} to ${route.destination}
Travel Date: ${travelDate}

Based on historical patterns, provide:
1. Current price estimate range
2. Best time to book (days before travel)
3. Price prediction for next 7 days
4. Factors affecting price
5. Confidence level

Return as JSON:
{
  "currentEstimate": { "low": 0, "high": 0, "currency": "INR" },
  "bestTimeToBook": { "days": 0, "reason": "" },
  "prediction": [
    { "date": "", "estimatedPrice": 0, "trend": "up|down|stable" }
  ],
  "factors": [],
  "confidence": "high|medium|low",
  "recommendation": ""
}`;

        const provider = this.providers[config.ai.provider];
        const response = await provider.complete(prompt);

        try {
            return JSON.parse(response.content);
        } catch {
            return { prediction: response.content };
        }
    }

    // ============================================
    // DESTINATION RECOMMENDATIONS
    // ============================================
    async getRecommendations(preferences, userId) {
        const prompt = `Recommend travel destinations based on:

Preferences:
- Budget: ${preferences.budget} ${preferences.currency || 'INR'}
- Duration: ${preferences.duration} days
- Travel Style: ${preferences.travelStyle}
- Interests: ${preferences.interests?.join(', ')}
- From: ${preferences.origin}
- Travel Month: ${preferences.month}
- Travelers: ${preferences.travelers}

Provide 5 destination recommendations with:
1. Why it matches preferences
2. Best time to visit
3. Estimated budget breakdown
4. Must-do activities
5. Unique experiences

Return as JSON array.`;

        const provider = this.providers[config.ai.provider];
        const response = await provider.complete(prompt);

        try {
            return JSON.parse(response.content);
        } catch {
            return { recommendations: response.content };
        }
    }

    // ============================================
    // USAGE & BILLING
    // ============================================
    async getUsage(userId) {
        return this.usageTracker.getUsage(userId);
    }

    async getBilling(userId) {
        return this.usageTracker.getBilling(userId);
    }
}

// ============================================
// AI IMAGE GENERATOR
// ============================================
class AIImageGenerator {
    constructor(config) {
        this.config = config;
        if (config.apiKey) {
            const OpenAI = require('openai');
            this.client = new OpenAI({ apiKey: config.apiKey });
        }
    }

    async generate(prompt, options = {}) {
        if (!this.client) {
            return { error: 'Image generation not configured' };
        }

        const response = await this.client.images.generate({
            model: options.model || 'dall-e-3',
            prompt: `Travel-related image: ${prompt}`,
            n: options.count || 1,
            size: options.size || '1024x1024',
            quality: options.quality || 'standard',
            style: options.style || 'natural'
        });

        return {
            images: response.data.map(img => ({
                url: img.url,
                revisedPrompt: img.revised_prompt
            }))
        };
    }
}

// ============================================
// AI USAGE TRACKER & BILLING
// ============================================
class AIUsageTracker {
    constructor() {
        this.usage = new Map();
        this.plans = {
            free: {
                smartSearch: 10,    // per day
                itinerary: 3,       // per day
                imageGeneration: 2, // per day
                chat: 50            // messages per day
            },
            basic: {
                smartSearch: 50,
                itinerary: 20,
                imageGeneration: 10,
                chat: 200
            },
            premium: {
                smartSearch: 500,
                itinerary: 100,
                imageGeneration: 50,
                chat: 1000
            },
            enterprise: {
                smartSearch: Infinity,
                itinerary: Infinity,
                imageGeneration: Infinity,
                chat: Infinity
            }
        };
        this.pricing = {
            smartSearch: 0.01,      // per request
            itinerary: 0.10,        // per generation
            imageGeneration: 0.50,  // per image
            chat: 0.001             // per message
        };
    }

    async checkLimit(userId, feature, planType = 'free') {
        const userUsage = this.getOrCreateUserUsage(userId);
        const today = new Date().toDateString();
        const plan = this.plans[planType];

        if (!userUsage.daily[today]) {
            userUsage.daily[today] = {};
        }

        const dailyUsage = userUsage.daily[today][feature] || 0;
        const limit = plan[feature];

        if (dailyUsage >= limit) {
            throw new Error(`Daily limit reached for ${feature}. Upgrade your plan for more.`);
        }
    }

    async recordUsage(userId, feature, tokens = {}) {
        const userUsage = this.getOrCreateUserUsage(userId);
        const today = new Date().toDateString();

        if (!userUsage.daily[today]) {
            userUsage.daily[today] = {};
        }

        userUsage.daily[today][feature] = (userUsage.daily[today][feature] || 0) + 1;
        userUsage.total[feature] = (userUsage.total[feature] || 0) + 1;
        userUsage.tokens[feature] = (userUsage.tokens[feature] || 0) + (tokens.total_tokens || 0);
        userUsage.cost += this.pricing[feature] || 0;
    }

    getOrCreateUserUsage(userId) {
        if (!this.usage.has(userId)) {
            this.usage.set(userId, {
                daily: {},
                total: {},
                tokens: {},
                cost: 0
            });
        }
        return this.usage.get(userId);
    }

    getUsage(userId) {
        return this.getOrCreateUserUsage(userId);
    }

    getBilling(userId) {
        const usage = this.getOrCreateUserUsage(userId);
        return {
            totalCost: usage.cost.toFixed(2),
            currency: 'USD',
            breakdown: Object.entries(usage.total).map(([feature, count]) => ({
                feature,
                count,
                unitPrice: this.pricing[feature],
                total: (count * this.pricing[feature]).toFixed(2)
            }))
        };
    }
}

// ============================================
// PROVIDERS
// ============================================
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
            return { content: 'AI not configured', usage: {} };
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

    async complete(prompt, maxTokens = 2000) {
        return this.chat([{ role: 'user', content: prompt }], maxTokens);
    }
}

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
            return { content: 'AI not configured', usage: {} };
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
                output_tokens: response.usage.output_tokens,
                total_tokens: response.usage.input_tokens + response.usage.output_tokens
            }
        };
    }

    async complete(prompt, maxTokens = 2000) {
        return this.chat([{ role: 'user', content: prompt }]);
    }
}

module.exports = new AICompleteService();
