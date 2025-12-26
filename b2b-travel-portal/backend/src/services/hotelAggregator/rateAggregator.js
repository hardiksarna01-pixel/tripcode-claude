/**
 * Hotel Rate Aggregator
 * Aggregates, deduplicates, and ranks hotel results from multiple suppliers
 */

class RateAggregator {
    constructor(options = {}) {
        this.config = {
            deduplicationThreshold: options.deduplicationThreshold || 0.85,
            maxResultsPerSearch: options.maxResults || 200
        };
    }

    /**
     * Aggregate hotels from multiple suppliers
     */
    aggregateHotels(supplierResults, searchParams) {
        // Collect all hotels
        let allHotels = [];
        supplierResults
            .filter(r => r.success && r.hotels)
            .forEach(result => {
                allHotels = allHotels.concat(result.hotels);
            });

        // Deduplicate hotels
        const uniqueHotels = this.deduplicateHotels(allHotels);

        // Apply filters
        let filteredHotels = this.applyFilters(uniqueHotels, searchParams);

        // Sort and rank
        filteredHotels = this.sortHotels(filteredHotels, searchParams.sortBy || 'recommended');

        // Limit results
        const hotels = filteredHotels.slice(0, this.config.maxResultsPerSearch);

        // Calculate statistics
        const stats = this.calculateStats(hotels, allHotels);

        // Find best options
        const bestOptions = this.findBestOptions(hotels);

        // Generate filters
        const filters = this.generateFilters(hotels);

        return {
            hotels,
            stats,
            bestOptions,
            filters
        };
    }

    /**
     * Deduplicate hotels across suppliers
     */
    deduplicateHotels(hotels) {
        const hotelMap = new Map();

        hotels.forEach(hotel => {
            // Generate hotel signature
            const signature = this.generateHotelSignature(hotel);

            if (hotelMap.has(signature)) {
                // Merge with existing - keep the one with lower price
                const existing = hotelMap.get(signature);
                if (hotel.pricing?.lowestPrice < existing.pricing?.lowestPrice) {
                    // Keep new hotel but merge supplier info
                    hotel.otherSuppliers = existing.otherSuppliers || [];
                    hotel.otherSuppliers.push({
                        supplierId: existing.supplierId,
                        price: existing.pricing?.lowestPrice
                    });
                    hotelMap.set(signature, hotel);
                } else {
                    // Keep existing but add this supplier
                    existing.otherSuppliers = existing.otherSuppliers || [];
                    existing.otherSuppliers.push({
                        supplierId: hotel.supplierId,
                        price: hotel.pricing?.lowestPrice
                    });
                }
            } else {
                hotelMap.set(signature, hotel);
            }
        });

        return Array.from(hotelMap.values());
    }

    /**
     * Generate hotel signature for deduplication
     */
    generateHotelSignature(hotel) {
        // Use name + location for matching
        const name = (hotel.name || '').toLowerCase()
            .replace(/[^a-z0-9]/g, '')
            .substring(0, 30);

        const lat = hotel.location?.latitude
            ? Math.round(hotel.location.latitude * 1000) / 1000
            : 0;
        const lng = hotel.location?.longitude
            ? Math.round(hotel.location.longitude * 1000) / 1000
            : 0;

        return `${name}_${lat}_${lng}`;
    }

    /**
     * Apply search filters
     */
    applyFilters(hotels, params) {
        return hotels.filter(hotel => {
            // Price filter
            if (params.minPrice && hotel.pricing?.lowestPrice < params.minPrice) {
                return false;
            }
            if (params.maxPrice && hotel.pricing?.lowestPrice > params.maxPrice) {
                return false;
            }

            // Star rating filter
            if (params.minStars && hotel.starRating < params.minStars) {
                return false;
            }
            if (params.maxStars && hotel.starRating > params.maxStars) {
                return false;
            }

            // Review score filter
            if (params.minRating && hotel.reviews?.score < params.minRating) {
                return false;
            }

            // Amenity filter
            if (params.amenities?.length > 0) {
                const hotelAmenities = hotel.amenities || [];
                const hasAllAmenities = params.amenities.every(a =>
                    hotelAmenities.includes(a)
                );
                if (!hasAllAmenities) return false;
            }

            // Property type filter
            if (params.propertyTypes?.length > 0) {
                if (!params.propertyTypes.includes(hotel.propertyType)) {
                    return false;
                }
            }

            return true;
        });
    }

    /**
     * Sort hotels by criteria
     */
    sortHotels(hotels, sortBy) {
        switch (sortBy) {
            case 'price_low':
                return hotels.sort((a, b) =>
                    (a.pricing?.lowestPrice || 0) - (b.pricing?.lowestPrice || 0)
                );

            case 'price_high':
                return hotels.sort((a, b) =>
                    (b.pricing?.lowestPrice || 0) - (a.pricing?.lowestPrice || 0)
                );

            case 'rating':
                return hotels.sort((a, b) =>
                    (b.reviews?.score || 0) - (a.reviews?.score || 0)
                );

            case 'stars':
                return hotels.sort((a, b) =>
                    (b.starRating || 0) - (a.starRating || 0)
                );

            case 'recommended':
            default:
                // Score-based ranking
                return hotels.sort((a, b) =>
                    this.calculateRecommendationScore(b) - this.calculateRecommendationScore(a)
                );
        }
    }

    /**
     * Calculate recommendation score
     */
    calculateRecommendationScore(hotel) {
        let score = 0;

        // Rating score (0-35 points)
        score += (hotel.reviews?.score || 0) * 3.5;

        // Star rating (0-25 points)
        score += (hotel.starRating || 0) * 5;

        // Price score - lower is better (0-20 points)
        const price = hotel.pricing?.lowestPrice || 10000;
        score += Math.max(0, 20 - (price / 1000));

        // Review count bonus (0-10 points)
        const reviewCount = hotel.reviews?.count || 0;
        score += Math.min(10, reviewCount / 100);

        // Amenity bonus (0-10 points)
        const amenityCount = hotel.amenities?.length || 0;
        score += Math.min(10, amenityCount);

        // Multiple supplier bonus (indicates popularity)
        if (hotel.otherSuppliers?.length > 0) {
            score += hotel.otherSuppliers.length * 2;
        }

        return score;
    }

    /**
     * Find best options
     */
    findBestOptions(hotels) {
        if (hotels.length === 0) return {};

        return {
            cheapest: hotels.reduce((min, h) =>
                (h.pricing?.lowestPrice || Infinity) < (min.pricing?.lowestPrice || Infinity) ? h : min
            ),
            bestRated: hotels.reduce((max, h) =>
                (h.reviews?.score || 0) > (max.reviews?.score || 0) ? h : max
            ),
            bestValue: hotels.reduce((best, h) => {
                const valueScore = (h.reviews?.score || 0) / Math.log10((h.pricing?.lowestPrice || 1000) + 1);
                const bestScore = (best.reviews?.score || 0) / Math.log10((best.pricing?.lowestPrice || 1000) + 1);
                return valueScore > bestScore ? h : best;
            }),
            topStars: hotels.reduce((max, h) =>
                (h.starRating || 0) > (max.starRating || 0) ? h : max
            ),
            mostPopular: hotels.reduce((max, h) =>
                (h.reviews?.count || 0) > (max.reviews?.count || 0) ? h : max
            )
        };
    }

    /**
     * Calculate statistics
     */
    calculateStats(hotels, allHotels) {
        const prices = hotels
            .map(h => h.pricing?.lowestPrice)
            .filter(p => p && p > 0);

        return {
            totalFound: hotels.length,
            beforeDedup: allHotels.length,
            duplicatesRemoved: allHotels.length - hotels.length,
            priceRange: {
                min: prices.length > 0 ? Math.min(...prices) : 0,
                max: prices.length > 0 ? Math.max(...prices) : 0,
                avg: prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0
            },
            starDistribution: this.getStarDistribution(hotels),
            supplierDistribution: this.getSupplierDistribution(hotels)
        };
    }

    /**
     * Get star rating distribution
     */
    getStarDistribution(hotels) {
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        hotels.forEach(h => {
            const stars = Math.round(h.starRating || 0);
            if (stars >= 1 && stars <= 5) {
                distribution[stars]++;
            }
        });
        return distribution;
    }

    /**
     * Get supplier distribution
     */
    getSupplierDistribution(hotels) {
        const distribution = {};
        hotels.forEach(h => {
            const supplier = h.supplierId || 'unknown';
            distribution[supplier] = (distribution[supplier] || 0) + 1;
        });
        return distribution;
    }

    /**
     * Generate filter options from results
     */
    generateFilters(hotels) {
        const prices = hotels.map(h => h.pricing?.lowestPrice).filter(Boolean);
        const amenityCounts = {};
        const propertyCounts = {};

        hotels.forEach(hotel => {
            // Count amenities
            (hotel.amenities || []).forEach(amenity => {
                amenityCounts[amenity] = (amenityCounts[amenity] || 0) + 1;
            });

            // Count property types
            if (hotel.propertyType) {
                propertyCounts[hotel.propertyType] = (propertyCounts[hotel.propertyType] || 0) + 1;
            }
        });

        return {
            priceRange: {
                min: prices.length > 0 ? Math.min(...prices) : 0,
                max: prices.length > 0 ? Math.max(...prices) : 0
            },
            starRatings: [1, 2, 3, 4, 5].map(star => ({
                star,
                count: hotels.filter(h => Math.round(h.starRating) === star).length
            })),
            amenities: Object.entries(amenityCounts)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 15),
            propertyTypes: Object.entries(propertyCounts)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
        };
    }
}

module.exports = RateAggregator;
