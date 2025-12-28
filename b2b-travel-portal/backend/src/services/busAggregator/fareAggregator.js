/**
 * Bus Fare Aggregator
 * Aggregates, deduplicates, and ranks bus results from multiple suppliers
 */

class FareAggregator {
    constructor(options = {}) {
        this.config = {
            maxResultsPerSearch: options.maxResults || 150
        };
    }

    /**
     * Aggregate buses from multiple suppliers
     */
    aggregateBuses(supplierResults, searchParams) {
        // Collect all buses
        let allBuses = [];
        supplierResults
            .filter(r => r.success && r.buses)
            .forEach(result => {
                allBuses = allBuses.concat(result.buses);
            });

        // Deduplicate buses
        const uniqueBuses = this.deduplicateBuses(allBuses);

        // Apply filters
        let filteredBuses = this.applyFilters(uniqueBuses, searchParams);

        // Sort and rank
        filteredBuses = this.sortBuses(filteredBuses, searchParams.sortBy || 'departure');

        // Limit results
        const buses = filteredBuses.slice(0, this.config.maxResultsPerSearch);

        // Calculate statistics
        const stats = this.calculateStats(buses, allBuses);

        // Find best options
        const bestOptions = this.findBestOptions(buses);

        // Generate filters
        const filters = this.generateFilters(buses);

        return {
            buses,
            stats,
            bestOptions,
            filters
        };
    }

    /**
     * Deduplicate buses across suppliers
     */
    deduplicateBuses(buses) {
        const busMap = new Map();

        buses.forEach(bus => {
            const signature = this.generateBusSignature(bus);

            if (busMap.has(signature)) {
                const existing = busMap.get(signature);
                // Keep the one with lower price
                if ((bus.pricing?.baseFare || 0) < (existing.pricing?.baseFare || 0)) {
                    bus.otherSuppliers = existing.otherSuppliers || [];
                    bus.otherSuppliers.push({
                        supplierId: existing.supplierId,
                        price: existing.pricing?.baseFare
                    });
                    busMap.set(signature, bus);
                } else {
                    existing.otherSuppliers = existing.otherSuppliers || [];
                    existing.otherSuppliers.push({
                        supplierId: bus.supplierId,
                        price: bus.pricing?.baseFare
                    });
                }
            } else {
                busMap.set(signature, bus);
            }
        });

        return Array.from(busMap.values());
    }

    /**
     * Generate bus signature for deduplication
     */
    generateBusSignature(bus) {
        const operator = (bus.operator?.name || '').toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20);
        const departure = bus.schedule?.departureTime || '';
        const busType = bus.busType?.category || '';

        return `${operator}_${departure}_${busType}`;
    }

    /**
     * Apply search filters
     */
    applyFilters(buses, params) {
        return buses.filter(bus => {
            // Price filter
            if (params.minPrice && bus.pricing?.baseFare < params.minPrice) {
                return false;
            }
            if (params.maxPrice && bus.pricing?.baseFare > params.maxPrice) {
                return false;
            }

            // AC filter
            if (params.acOnly && !bus.busType?.ac) {
                return false;
            }

            // Sleeper filter
            if (params.sleeperOnly && !bus.busType?.sleeper) {
                return false;
            }

            // Operator filter
            if (params.operators?.length > 0) {
                const operatorName = bus.operator?.name?.toLowerCase() || '';
                const matches = params.operators.some(op =>
                    operatorName.includes(op.toLowerCase())
                );
                if (!matches) return false;
            }

            // Departure time filter
            if (params.departureAfter) {
                const depTime = this.parseTime(bus.schedule?.departureTime);
                const filterTime = this.parseTime(params.departureAfter);
                if (depTime < filterTime) return false;
            }
            if (params.departureBefore) {
                const depTime = this.parseTime(bus.schedule?.departureTime);
                const filterTime = this.parseTime(params.departureBefore);
                if (depTime > filterTime) return false;
            }

            // Rating filter
            if (params.minRating && (bus.ratings?.overall || 0) < params.minRating) {
                return false;
            }

            // Amenity filter
            if (params.amenities?.length > 0) {
                const busAmenities = bus.amenities || [];
                const hasAllAmenities = params.amenities.every(a =>
                    busAmenities.includes(a)
                );
                if (!hasAllAmenities) return false;
            }

            return true;
        });
    }

    /**
     * Parse time string to minutes from midnight
     */
    parseTime(timeStr) {
        if (!timeStr) return 0;
        const match = timeStr.match(/(\d{1,2}):(\d{2})/);
        if (match) {
            return parseInt(match[1]) * 60 + parseInt(match[2]);
        }
        return 0;
    }

    /**
     * Sort buses by criteria
     */
    sortBuses(buses, sortBy) {
        switch (sortBy) {
            case 'price_low':
                return buses.sort((a, b) =>
                    (a.pricing?.baseFare || 0) - (b.pricing?.baseFare || 0)
                );

            case 'price_high':
                return buses.sort((a, b) =>
                    (b.pricing?.baseFare || 0) - (a.pricing?.baseFare || 0)
                );

            case 'duration':
                return buses.sort((a, b) =>
                    (a.schedule?.durationMinutes || 999) - (b.schedule?.durationMinutes || 999)
                );

            case 'rating':
                return buses.sort((a, b) =>
                    (b.ratings?.overall || 0) - (a.ratings?.overall || 0)
                );

            case 'departure':
            default:
                return buses.sort((a, b) =>
                    this.parseTime(a.schedule?.departureTime) - this.parseTime(b.schedule?.departureTime)
                );

            case 'arrival':
                return buses.sort((a, b) =>
                    this.parseTime(a.schedule?.arrivalTime) - this.parseTime(b.schedule?.arrivalTime)
                );

            case 'seats':
                return buses.sort((a, b) =>
                    (b.seats?.available || 0) - (a.seats?.available || 0)
                );
        }
    }

    /**
     * Find best options
     */
    findBestOptions(buses) {
        if (buses.length === 0) return {};

        return {
            cheapest: buses.reduce((min, b) =>
                (b.pricing?.baseFare || Infinity) < (min.pricing?.baseFare || Infinity) ? b : min
            ),
            bestRated: buses.reduce((max, b) =>
                (b.ratings?.overall || 0) > (max.ratings?.overall || 0) ? b : max
            ),
            fastest: buses.reduce((min, b) =>
                (b.schedule?.durationMinutes || 999) < (min.schedule?.durationMinutes || 999) ? b : min
            ),
            earliestDeparture: buses.reduce((min, b) =>
                this.parseTime(b.schedule?.departureTime) < this.parseTime(min.schedule?.departureTime) ? b : min
            ),
            mostSeats: buses.reduce((max, b) =>
                (b.seats?.available || 0) > (max.seats?.available || 0) ? b : max
            )
        };
    }

    /**
     * Calculate statistics
     */
    calculateStats(buses, allBuses) {
        const prices = buses
            .map(b => b.pricing?.baseFare)
            .filter(p => p && p > 0);

        const durations = buses
            .map(b => b.schedule?.durationMinutes)
            .filter(d => d && d > 0);

        return {
            totalFound: buses.length,
            beforeDedup: allBuses.length,
            duplicatesRemoved: allBuses.length - buses.length,
            priceRange: {
                min: prices.length > 0 ? Math.min(...prices) : 0,
                max: prices.length > 0 ? Math.max(...prices) : 0,
                avg: prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0
            },
            durationRange: {
                min: durations.length > 0 ? Math.min(...durations) : 0,
                max: durations.length > 0 ? Math.max(...durations) : 0,
                avg: durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0
            },
            busTypeDistribution: this.getBusTypeDistribution(buses),
            operatorDistribution: this.getOperatorDistribution(buses),
            departureDistribution: this.getDepartureDistribution(buses)
        };
    }

    /**
     * Get bus type distribution
     */
    getBusTypeDistribution(buses) {
        const distribution = {
            ac: 0,
            nonAc: 0,
            sleeper: 0,
            seater: 0,
            volvo: 0,
            ordinary: 0
        };

        buses.forEach(bus => {
            if (bus.busType?.ac) distribution.ac++;
            else distribution.nonAc++;

            if (bus.busType?.sleeper) distribution.sleeper++;
            if (bus.busType?.seater) distribution.seater++;
            if (bus.busType?.category === 'volvo') distribution.volvo++;
            if (bus.busType?.category === 'ordinary') distribution.ordinary++;
        });

        return distribution;
    }

    /**
     * Get operator distribution
     */
    getOperatorDistribution(buses) {
        const distribution = {};
        buses.forEach(bus => {
            const operator = bus.operator?.name || 'Unknown';
            distribution[operator] = (distribution[operator] || 0) + 1;
        });
        return distribution;
    }

    /**
     * Get departure time distribution
     */
    getDepartureDistribution(buses) {
        const distribution = {
            morning: 0,    // 6:00 - 12:00
            afternoon: 0,  // 12:00 - 18:00
            evening: 0,    // 18:00 - 22:00
            night: 0       // 22:00 - 6:00
        };

        buses.forEach(bus => {
            const time = this.parseTime(bus.schedule?.departureTime);
            const hours = Math.floor(time / 60);

            if (hours >= 6 && hours < 12) distribution.morning++;
            else if (hours >= 12 && hours < 18) distribution.afternoon++;
            else if (hours >= 18 && hours < 22) distribution.evening++;
            else distribution.night++;
        });

        return distribution;
    }

    /**
     * Generate filter options from results
     */
    generateFilters(buses) {
        const prices = buses.map(b => b.pricing?.baseFare).filter(Boolean);
        const operatorCounts = {};
        const busTypeCounts = {};
        const amenityCounts = {};

        buses.forEach(bus => {
            // Count operators
            const operator = bus.operator?.name;
            if (operator) {
                operatorCounts[operator] = (operatorCounts[operator] || 0) + 1;
            }

            // Count bus types
            const busType = bus.busType?.category || 'standard';
            busTypeCounts[busType] = (busTypeCounts[busType] || 0) + 1;

            // Count amenities
            (bus.amenities || []).forEach(amenity => {
                amenityCounts[amenity] = (amenityCounts[amenity] || 0) + 1;
            });
        });

        return {
            priceRange: {
                min: prices.length > 0 ? Math.min(...prices) : 0,
                max: prices.length > 0 ? Math.max(...prices) : 0
            },
            operators: Object.entries(operatorCounts)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count),
            busTypes: Object.entries(busTypeCounts)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count),
            amenities: Object.entries(amenityCounts)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count),
            departureSlots: [
                { name: 'Morning (6AM - 12PM)', value: 'morning', start: '06:00', end: '12:00' },
                { name: 'Afternoon (12PM - 6PM)', value: 'afternoon', start: '12:00', end: '18:00' },
                { name: 'Evening (6PM - 10PM)', value: 'evening', start: '18:00', end: '22:00' },
                { name: 'Night (10PM - 6AM)', value: 'night', start: '22:00', end: '06:00' }
            ],
            acOptions: [
                { name: 'AC', value: true, count: buses.filter(b => b.busType?.ac).length },
                { name: 'Non-AC', value: false, count: buses.filter(b => !b.busType?.ac).length }
            ],
            seatTypes: [
                { name: 'Sleeper', value: 'sleeper', count: buses.filter(b => b.busType?.sleeper).length },
                { name: 'Seater', value: 'seater', count: buses.filter(b => b.busType?.seater).length },
                { name: 'Semi-Sleeper', value: 'semi', count: buses.filter(b => b.busType?.semiSleeper).length }
            ]
        };
    }
}

module.exports = FareAggregator;
