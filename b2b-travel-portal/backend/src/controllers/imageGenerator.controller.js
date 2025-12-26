/**
 * Image Generator Controller
 * AI-powered travel image generation with usage limits
 */

const {
    AI_FEATURE_PLANS,
    IMAGE_STYLES,
    IMAGE_CATEGORIES,
    checkQuota,
    getPlanDetails
} = require('../config/aiFeatures');
const claudeService = require('../services/claude.service');
const { getAgentPlan } = require('./aiSubscription.controller');

// In-memory storage (replace with database in production)
const userUsage = new Map();
const generatedImages = new Map();
// NOTE: Subscriptions are now managed by aiSubscription.controller.js
// This ensures billing goes directly to platform, not white-label partners

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
 * Uses centralized AI subscription service (platform-direct billing)
 */
const getUserPlan = (userId) => {
    return getAgentPlan(userId);
};

/**
 * Get available styles and categories
 */
const getConfig = async (req, res) => {
    try {
        const userId = req.user?.id || 'demo';
        const plan = getUserPlan(userId);
        const planDetails = getPlanDetails(plan);

        res.json({
            styles: IMAGE_STYLES,
            categories: IMAGE_CATEGORIES,
            currentPlan: plan,
            planDetails,
            allPlans: Object.values(AI_FEATURE_PLANS)
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

        const imageQuota = checkQuota(usage, plan, 'image');
        const itineraryQuota = checkQuota(usage, plan, 'itinerary');

        res.json({
            plan,
            planDetails,
            usage: {
                images: {
                    used: usage.imagesUsedToday,
                    limit: planDetails.limits.imagesPerDay,
                    remaining: imageQuota.remaining
                },
                itineraries: {
                    used: usage.itinerariesUsedToday,
                    limit: planDetails.limits.itinerariesPerDay,
                    remaining: itineraryQuota.remaining
                }
            },
            resetAt: usage.resetAt,
            lifetime: {
                totalImages: usage.totalImagesGenerated,
                totalItineraries: usage.totalItinerariesGenerated
            }
        });
    } catch (error) {
        console.error('Error getting usage:', error);
        res.status(500).json({ error: 'Failed to get usage statistics' });
    }
};

/**
 * Generate travel image
 */
const generateImage = async (req, res) => {
    try {
        const userId = req.user?.id || 'demo';
        const { prompt, style, category, destination, aspectRatio = '1:1' } = req.body;

        if (!prompt && !destination) {
            return res.status(400).json({ error: 'Prompt or destination is required' });
        }

        // Check quota
        const plan = getUserPlan(userId);
        const usage = getUserUsage(userId);
        const quota = checkQuota(usage, plan, 'image');

        if (!quota.allowed) {
            return res.status(429).json({
                error: 'Daily image generation limit reached',
                limit: quota.limit,
                used: quota.used,
                resetAt: usage.resetAt,
                upgradeMessage: plan === 'FREE'
                    ? 'Upgrade to Pro plan for 10 images per day at just ₹299/month'
                    : null
            });
        }

        // Build enhanced prompt using Claude AI if available
        let enhancedPrompt = prompt || `Beautiful travel photograph of ${destination}`;
        let promptEnhancedBy = 'basic';

        // Try Claude API for prompt enhancement
        if (claudeService.isAvailable()) {
            try {
                console.log('Enhancing prompt with Claude API...');
                const styleConfig = style ? IMAGE_STYLES.find(s => s.id === style) : null;
                enhancedPrompt = await claudeService.enhanceImagePrompt({
                    destination,
                    style: styleConfig?.description || style || 'photorealistic',
                    category,
                    originalPrompt: prompt || destination
                });
                promptEnhancedBy = 'claude';
                console.log('Prompt enhanced by Claude');
            } catch (claudeError) {
                console.error('Claude API error for prompt enhancement:', claudeError.message);
                // Fall back to basic enhancement
            }
        }

        // Fallback to basic prompt enhancement if Claude is not available or failed
        if (promptEnhancedBy === 'basic') {
            if (category) {
                const categoryConfig = IMAGE_CATEGORIES.find(c => c.id === category);
                if (categoryConfig) {
                    const randomPromptPrefix = categoryConfig.prompts[Math.floor(Math.random() * categoryConfig.prompts.length)];
                    enhancedPrompt = `${randomPromptPrefix} ${destination || prompt}`;
                }
            }

            if (style) {
                const styleConfig = IMAGE_STYLES.find(s => s.id === style);
                if (styleConfig) {
                    enhancedPrompt += `, ${styleConfig.description} style`;
                }
            }

            enhancedPrompt += ', high quality, professional travel photography, vibrant colors';
        }

        // Simulate image generation (in production, call actual AI API)
        const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const planDetails = getPlanDetails(plan);

        // Simulated image URLs (in production, these would come from the AI service)
        const simulatedImages = [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
            'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
            'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800',
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'
        ];

        const generatedImage = {
            id: imageId,
            userId,
            prompt: enhancedPrompt,
            originalPrompt: prompt || destination,
            promptEnhancedBy,
            style,
            category,
            destination,
            aspectRatio,
            resolution: planDetails.limits.imageResolution,
            imageUrl: simulatedImages[Math.floor(Math.random() * simulatedImages.length)],
            thumbnailUrl: simulatedImages[Math.floor(Math.random() * simulatedImages.length)],
            createdAt: new Date().toISOString(),
            status: 'completed'
        };

        // Store generated image
        generatedImages.set(imageId, generatedImage);

        // Update usage
        usage.imagesUsedToday++;
        usage.totalImagesGenerated++;
        userUsage.set(userId, usage);

        res.status(201).json({
            message: 'Image generated successfully',
            image: generatedImage,
            usage: {
                remaining: quota.remaining - 1,
                limit: quota.limit,
                resetAt: usage.resetAt
            }
        });
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ error: 'Failed to generate image' });
    }
};

/**
 * Get generated images history
 */
const getHistory = async (req, res) => {
    try {
        const userId = req.user?.id || 'demo';
        const { page = 1, limit = 20 } = req.query;

        const userImages = Array.from(generatedImages.values())
            .filter(img => img.userId === userId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const start = (page - 1) * limit;
        const paginatedImages = userImages.slice(start, start + parseInt(limit));

        res.json({
            images: paginatedImages,
            total: userImages.length,
            page: parseInt(page),
            totalPages: Math.ceil(userImages.length / limit)
        });
    } catch (error) {
        console.error('Error getting history:', error);
        res.status(500).json({ error: 'Failed to get image history' });
    }
};

/**
 * Get single image details
 */
const getImage = async (req, res) => {
    try {
        const { imageId } = req.params;
        const image = generatedImages.get(imageId);

        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }

        res.json(image);
    } catch (error) {
        console.error('Error getting image:', error);
        res.status(500).json({ error: 'Failed to get image' });
    }
};

/**
 * Delete generated image
 */
const deleteImage = async (req, res) => {
    try {
        const userId = req.user?.id || 'demo';
        const { imageId } = req.params;
        const image = generatedImages.get(imageId);

        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }

        if (image.userId !== userId) {
            return res.status(403).json({ error: 'Not authorized to delete this image' });
        }

        generatedImages.delete(imageId);

        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ error: 'Failed to delete image' });
    }
};

/**
 * Subscribe to Pro plan
 * DEPRECATED: Use /api/v1/ai-subscription/subscribe instead
 * This endpoint redirects to the centralized AI subscription service
 * which ensures billing goes directly to platform (not white-label partners)
 */
const subscribePro = async (req, res) => {
    // Redirect to the proper AI subscription endpoint
    res.status(308).json({
        message: 'Please use the AI subscription endpoint for billing',
        redirectTo: '/api/v1/ai-subscription/subscribe',
        note: 'AI feature subscriptions are billed directly by the platform'
    });
};

/**
 * Cancel Pro subscription
 * DEPRECATED: Use /api/v1/ai-subscription/cancel instead
 */
const cancelSubscription = async (req, res) => {
    // Redirect to the proper AI subscription endpoint
    res.status(308).json({
        message: 'Please use the AI subscription endpoint',
        redirectTo: '/api/v1/ai-subscription/cancel',
        note: 'AI feature subscriptions are managed directly by the platform'
    });
};

module.exports = {
    getConfig,
    getUsage,
    generateImage,
    getHistory,
    getImage,
    deleteImage,
    subscribePro,
    cancelSubscription
};
