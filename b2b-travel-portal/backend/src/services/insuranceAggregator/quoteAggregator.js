/**
 * Insurance Quote Aggregator
 * Fetches quotes from multiple insurance providers in parallel
 */

const supplierRegistry = require('./supplierRegistry');
const { InsuranceAdapterFactory } = require('./adapters');

class InsuranceQuoteAggregator {
    constructor(options = {}) {
        this.timeout = options.timeout || 8000;
        this.minResponses = options.minResponses || 3;
        this.earlyReturnThreshold = options.earlyReturnThreshold || 0.6; // Return when 60% respond
    }

    /**
     * Get quotes from all enabled suppliers
     */
    async getQuotes(searchParams) {
        const startTime = Date.now();

        // Validate search params
        this.validateSearchParams(searchParams);

        // Get applicable suppliers based on search criteria
        const suppliers = this.getApplicableSuppliers(searchParams);

        if (suppliers.length === 0) {
            return {
                success: false,
                error: 'No insurance providers available for the specified criteria',
                searchParams,
                timestamp: new Date().toISOString()
            };
        }

        // Fetch quotes in parallel with smart timeout
        const quotes = await this.fetchQuotesParallel(suppliers, searchParams);

        // Aggregate and sort results
        const aggregatedQuotes = this.aggregateQuotes(quotes, searchParams);

        return {
            success: true,
            searchParams,
            totalSuppliers: suppliers.length,
            respondedSuppliers: quotes.filter(q => q.success).length,
            totalPlans: aggregatedQuotes.length,
            responseTime: Date.now() - startTime,
            quotes: aggregatedQuotes,
            comparison: this.generateComparison(aggregatedQuotes),
            recommendations: this.getRecommendations(aggregatedQuotes, searchParams),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Validate search parameters
     */
    validateSearchParams(params) {
        if (!params.tripType) {
            params.tripType = 'domestic';
        }
        if (!params.travelers || params.travelers.length === 0) {
            params.travelers = [{ age: 30 }];
        }
        if (!params.duration) {
            params.duration = 7;
        }
        return params;
    }

    /**
     * Get suppliers applicable for the search criteria
     */
    getApplicableSuppliers(searchParams) {
        let suppliers = supplierRegistry.getEnabledSuppliers();

        // Filter by trip type
        if (searchParams.tripType) {
            suppliers = suppliers.filter(s =>
                s.coverageTypes.includes(searchParams.tripType) ||
                s.coverageTypes.includes('international') && searchParams.tripType === 'schengen'
            );
        }

        // Filter by coverage type (student, senior, etc.)
        if (searchParams.coverageType) {
            suppliers = suppliers.filter(s =>
                s.coverageTypes.includes(searchParams.coverageType)
            );
        }

        // Filter by required features
        if (searchParams.requiredFeatures && searchParams.requiredFeatures.length > 0) {
            suppliers = suppliers.filter(s =>
                searchParams.requiredFeatures.every(f => s.features.includes(f))
            );
        }

        // Filter by minimum cover amount
        if (searchParams.minCoverAmount) {
            suppliers = suppliers.filter(s =>
                s.maxCoverAmount >= searchParams.minCoverAmount
            );
        }

        return suppliers;
    }

    /**
     * Fetch quotes from all suppliers in parallel with smart timeout
     */
    async fetchQuotesParallel(suppliers, searchParams) {
        const results = [];
        const targetResponses = Math.ceil(suppliers.length * this.earlyReturnThreshold);

        const fetchPromises = suppliers.map(async (supplier) => {
            const adapter = InsuranceAdapterFactory.createAdapter(supplier);
            const startTime = Date.now();

            try {
                const result = await Promise.race([
                    adapter.getQuote(searchParams),
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('Timeout')), supplier.timeout || this.timeout)
                    )
                ]);

                const responseTime = Date.now() - startTime;
                supplierRegistry.updateStatus(supplier.id, true, responseTime);

                return {
                    success: true,
                    supplierId: supplier.id,
                    supplierName: supplier.name,
                    responseTime,
                    plans: result.plans || []
                };
            } catch (error) {
                supplierRegistry.updateStatus(supplier.id, false, 0);

                return {
                    success: false,
                    supplierId: supplier.id,
                    supplierName: supplier.name,
                    error: error.message,
                    plans: []
                };
            }
        });

        // Smart timeout - return early when enough suppliers respond
        return new Promise((resolve) => {
            let resolved = false;
            let completedCount = 0;

            const checkComplete = (result) => {
                results.push(result);
                completedCount++;

                const successfulResults = results.filter(r => r.success);

                // Return early if we have enough successful responses
                if (!resolved && (
                    successfulResults.length >= targetResponses ||
                    completedCount === suppliers.length
                )) {
                    resolved = true;
                    resolve(results);
                }
            };

            fetchPromises.forEach(promise => {
                promise.then(checkComplete).catch(err => {
                    checkComplete({ success: false, error: err.message, plans: [] });
                });
            });

            // Absolute timeout
            setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    resolve(results);
                }
            }, this.timeout);
        });
    }

    /**
     * Aggregate and sort all quotes
     */
    aggregateQuotes(supplierResults, searchParams) {
        const allPlans = [];

        supplierResults.forEach(result => {
            if (result.success && result.plans) {
                result.plans.forEach(plan => {
                    allPlans.push({
                        ...plan,
                        supplierResponseTime: result.responseTime
                    });
                });
            }
        });

        // Sort by default (price low to high)
        const sortBy = searchParams.sortBy || 'price';
        return this.sortQuotes(allPlans, sortBy);
    }

    /**
     * Sort quotes by specified criteria
     */
    sortQuotes(quotes, sortBy) {
        switch (sortBy) {
            case 'price':
                return quotes.sort((a, b) => a.premium.total - b.premium.total);
            case 'price_desc':
                return quotes.sort((a, b) => b.premium.total - a.premium.total);
            case 'coverage':
                return quotes.sort((a, b) => b.coverage.sumInsured - a.coverage.sumInsured);
            case 'supplier':
                return quotes.sort((a, b) => a.supplierName.localeCompare(b.supplierName));
            case 'features':
                return quotes.sort((a, b) => (b.features?.length || 0) - (a.features?.length || 0));
            default:
                return quotes;
        }
    }

    /**
     * Generate comparison summary
     */
    generateComparison(quotes) {
        if (quotes.length === 0) return null;

        const prices = quotes.map(q => q.premium.total);
        const coverages = quotes.map(q => q.coverage.sumInsured);

        return {
            totalPlans: quotes.length,
            priceRange: {
                min: Math.min(...prices),
                max: Math.max(...prices),
                average: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
            },
            coverageRange: {
                min: Math.min(...coverages),
                max: Math.max(...coverages),
                average: Math.round(coverages.reduce((a, b) => a + b, 0) / coverages.length)
            },
            supplierBreakdown: this.getSupplierBreakdown(quotes),
            featureAnalysis: this.analyzeFeatures(quotes)
        };
    }

    /**
     * Get supplier breakdown
     */
    getSupplierBreakdown(quotes) {
        const breakdown = {};
        quotes.forEach(q => {
            if (!breakdown[q.supplierId]) {
                breakdown[q.supplierId] = {
                    name: q.supplierName,
                    planCount: 0,
                    lowestPrice: Infinity,
                    highestCoverage: 0
                };
            }
            breakdown[q.supplierId].planCount++;
            breakdown[q.supplierId].lowestPrice = Math.min(breakdown[q.supplierId].lowestPrice, q.premium.total);
            breakdown[q.supplierId].highestCoverage = Math.max(breakdown[q.supplierId].highestCoverage, q.coverage.sumInsured);
        });
        return breakdown;
    }

    /**
     * Analyze features across all plans
     */
    analyzeFeatures(quotes) {
        const featureCount = {};
        quotes.forEach(q => {
            (q.features || []).forEach(f => {
                featureCount[f] = (featureCount[f] || 0) + 1;
            });
        });

        return Object.entries(featureCount)
            .map(([feature, count]) => ({
                feature,
                count,
                availability: Math.round((count / quotes.length) * 100) + '%'
            }))
            .sort((a, b) => b.count - a.count);
    }

    /**
     * Get recommendations based on search criteria
     */
    getRecommendations(quotes, searchParams) {
        if (quotes.length === 0) return [];

        const recommendations = [];

        // Best value (good coverage at low price)
        const valueScores = quotes.map(q => ({
            quote: q,
            score: (q.coverage.sumInsured / q.premium.total) * (q.features?.length || 1)
        }));
        valueScores.sort((a, b) => b.score - a.score);
        if (valueScores[0]) {
            recommendations.push({
                type: 'best_value',
                label: 'Best Value',
                quote: valueScores[0].quote,
                reason: 'Optimal balance of coverage and price'
            });
        }

        // Cheapest option
        const cheapest = quotes.reduce((min, q) => q.premium.total < min.premium.total ? q : min);
        if (cheapest && cheapest !== valueScores[0]?.quote) {
            recommendations.push({
                type: 'budget',
                label: 'Budget Friendly',
                quote: cheapest,
                reason: 'Lowest premium option'
            });
        }

        // Most comprehensive
        const mostFeatures = quotes.reduce((max, q) =>
            (q.features?.length || 0) > (max.features?.length || 0) ? q : max
        );
        if (mostFeatures && mostFeatures !== valueScores[0]?.quote) {
            recommendations.push({
                type: 'comprehensive',
                label: 'Most Comprehensive',
                quote: mostFeatures,
                reason: 'Maximum coverage and features'
            });
        }

        // Highest coverage
        const highestCoverage = quotes.reduce((max, q) =>
            q.coverage.sumInsured > max.coverage.sumInsured ? q : max
        );
        if (highestCoverage && !recommendations.find(r => r.quote.quoteId === highestCoverage.quoteId)) {
            recommendations.push({
                type: 'highest_coverage',
                label: 'Maximum Protection',
                quote: highestCoverage,
                reason: 'Highest sum insured amount'
            });
        }

        return recommendations;
    }

    /**
     * Get quote by ID
     */
    async getQuoteById(quoteId) {
        // In production, this would fetch from cache/database
        // For now, return a placeholder
        return {
            found: false,
            message: 'Quote not found or expired'
        };
    }

    /**
     * Compare specific plans
     */
    comparePlans(planIds, allQuotes) {
        const plansToCompare = allQuotes.filter(q => planIds.includes(q.quoteId));

        if (plansToCompare.length < 2) {
            return { error: 'Need at least 2 plans to compare' };
        }

        const comparison = {
            plans: plansToCompare,
            features: this.compareFeatures(plansToCompare),
            coverage: this.compareCoverage(plansToCompare),
            price: this.comparePrices(plansToCompare)
        };

        return comparison;
    }

    compareFeatures(plans) {
        const allFeatures = new Set();
        plans.forEach(p => (p.features || []).forEach(f => allFeatures.add(f)));

        return Array.from(allFeatures).map(feature => ({
            feature,
            plans: plans.map(p => ({
                planId: p.planId,
                included: (p.features || []).includes(feature)
            }))
        }));
    }

    compareCoverage(plans) {
        const coverageTypes = ['sumInsured', 'medicalExpenses', 'tripCancellation', 'baggageLoss', 'personalAccident'];

        return coverageTypes.map(type => ({
            type,
            plans: plans.map(p => ({
                planId: p.planId,
                value: p.coverage[type] || 0
            }))
        }));
    }

    comparePrices(plans) {
        return {
            plans: plans.map(p => ({
                planId: p.planId,
                supplierName: p.supplierName,
                base: p.premium.base,
                gst: p.premium.gst,
                total: p.premium.total
            })),
            cheapest: plans.reduce((min, p) => p.premium.total < min.premium.total ? p : min).planId,
            mostExpensive: plans.reduce((max, p) => p.premium.total > max.premium.total ? p : max).planId,
            priceDifference: Math.max(...plans.map(p => p.premium.total)) - Math.min(...plans.map(p => p.premium.total))
        };
    }
}

module.exports = InsuranceQuoteAggregator;
