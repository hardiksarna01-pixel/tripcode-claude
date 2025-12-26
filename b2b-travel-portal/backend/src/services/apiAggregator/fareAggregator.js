/**
 * Fare Aggregator
 * Combines, deduplicates, and ranks flights from multiple suppliers
 * to find the best fares
 */

class FareAggregator {
    constructor(options = {}) {
        this.options = {
            maxResults: options.maxResults || 100,
            deduplicateBy: options.deduplicateBy || 'flightSignature',
            sortBy: options.sortBy || 'price', // price, duration, departure, arrival, best
            preferredSuppliers: options.preferredSuppliers || [],
            priceTolerancePercent: options.priceTolerancePercent || 2, // Consider same if within 2%
            ...options
        };
    }

    /**
     * Aggregate flights from multiple suppliers
     */
    aggregateFlights(supplierResults, searchParams) {
        console.log(`[FareAggregator] Aggregating ${supplierResults.length} supplier results`);

        let allFlights = [];
        const supplierSummary = [];

        // Collect all flights from all suppliers
        for (const result of supplierResults) {
            if (result.success && result.flights && result.flights.length > 0) {
                // Tag each flight with supplier info
                const taggedFlights = result.flights.map(flight => ({
                    ...flight,
                    _supplier: {
                        id: result.supplierId,
                        name: result.supplierName,
                        responseTime: result.responseTime
                    }
                }));

                allFlights = allFlights.concat(taggedFlights);

                supplierSummary.push({
                    supplierId: result.supplierId,
                    supplierName: result.supplierName,
                    flightCount: result.flights.length,
                    minPrice: this.findMinPrice(result.flights),
                    maxPrice: this.findMaxPrice(result.flights),
                    responseTime: result.responseTime
                });
            }
        }

        console.log(`[FareAggregator] Total flights before processing: ${allFlights.length}`);

        // Normalize all flights to common format
        const normalizedFlights = allFlights.map(f => this.normalizeFlightData(f));

        // Deduplicate flights
        const uniqueFlights = this.deduplicateFlights(normalizedFlights);
        console.log(`[FareAggregator] Unique flights after dedup: ${uniqueFlights.length}`);

        // Apply filters from search params
        const filteredFlights = this.applyFilters(uniqueFlights, searchParams);

        // Sort flights
        const sortedFlights = this.sortFlights(filteredFlights, searchParams.sortBy || this.options.sortBy);

        // Limit results
        const limitedFlights = sortedFlights.slice(0, this.options.maxResults);

        // Calculate fare statistics
        const fareStats = this.calculateFareStats(limitedFlights);

        // Find best fare options
        const bestOptions = this.findBestOptions(limitedFlights);

        return {
            flights: limitedFlights,
            totalResults: uniqueFlights.length,
            returnedResults: limitedFlights.length,
            fareStats,
            bestOptions,
            supplierSummary,
            filters: this.getAvailableFilters(uniqueFlights)
        };
    }

    /**
     * Normalize flight data to common format
     */
    normalizeFlightData(flight) {
        // Handle different response formats
        const normalized = {
            id: flight.id || flight.flightId || flight.tripId || flight.flightKey || `flt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            supplier: flight._supplier,

            // Price information
            price: this.extractPrice(flight),
            priceBreakdown: this.extractPriceBreakdown(flight),

            // Flight details
            segments: this.extractSegments(flight),
            totalDuration: this.calculateTotalDuration(flight),

            // Journey info
            stops: this.countStops(flight),
            isDirect: this.countStops(flight) === 0,

            // Airlines
            airlines: this.extractAirlines(flight),
            operatingAirlines: this.extractOperatingAirlines(flight),

            // Departure/Arrival
            departureTime: this.extractDepartureTime(flight),
            arrivalTime: this.extractArrivalTime(flight),

            // Cabin and class
            cabinClass: flight.cabinClass || flight.cabin || 'economy',
            bookingClass: flight.bookingClass || flight.fareClass || 'Q',

            // Availability
            seatsAvailable: flight.seatsAvailable || flight.availability || 9,

            // Fare rules
            refundable: flight.refundable || false,
            changeable: flight.changeable !== false,

            // Baggage
            baggage: this.extractBaggage(flight),

            // Source info
            source: flight.source || 'API',

            // Signature for deduplication
            _signature: null,

            // Original data for reference
            _original: flight
        };

        // Generate signature for deduplication
        normalized._signature = this.generateFlightSignature(normalized);

        return normalized;
    }

    /**
     * Extract price from various formats
     */
    extractPrice(flight) {
        if (flight.price?.total) return flight.price.total;
        if (flight.fare?.total) return flight.fare.total;
        if (flight.totalPriceInfo?.totalFareDetail?.fC?.TF) return flight.totalPriceInfo.totalFareDetail.fC.TF;
        if (flight.MinPrice) return flight.MinPrice;
        if (typeof flight.fare === 'number') return flight.fare;
        if (typeof flight.price === 'number') return flight.price;
        return 0;
    }

    /**
     * Extract price breakdown
     */
    extractPriceBreakdown(flight) {
        const total = this.extractPrice(flight);

        if (flight.price?.base && flight.price?.fees) {
            return {
                base: flight.price.base,
                taxes: flight.price.fees,
                fees: 0,
                total
            };
        }

        if (flight.fare?.base && flight.fare?.taxes) {
            return {
                base: flight.fare.base,
                taxes: flight.fare.taxes,
                fees: 0,
                total
            };
        }

        // Estimate breakdown if not provided
        return {
            base: Math.round(total * 0.75),
            taxes: Math.round(total * 0.20),
            fees: Math.round(total * 0.05),
            total
        };
    }

    /**
     * Extract segments from various formats
     */
    extractSegments(flight) {
        // Amadeus format
        if (flight.itineraries?.[0]?.segments) {
            return flight.itineraries[0].segments.map(seg => ({
                origin: seg.departure?.iataCode || seg.departure?.airport,
                destination: seg.arrival?.iataCode || seg.arrival?.airport,
                departureTime: seg.departure?.at || seg.departure?.time,
                arrivalTime: seg.arrival?.at || seg.arrival?.time,
                airline: seg.carrierCode || seg.carrier,
                flightNumber: `${seg.carrierCode || seg.carrier}${seg.number || seg.flightNumber}`,
                duration: seg.duration,
                aircraft: seg.aircraft?.code || seg.aircraft
            }));
        }

        // TripJack format
        if (flight.sI) {
            return flight.sI.map(seg => ({
                origin: seg.da?.code || seg.departure?.code,
                destination: seg.aa?.code || seg.arrival?.code,
                departureTime: seg.da?.dateTime || seg.departure?.dateTime,
                arrivalTime: seg.aa?.dateTime || seg.arrival?.dateTime,
                airline: seg.fD?.aI?.code || seg.airline,
                flightNumber: `${seg.fD?.aI?.code || ''}${seg.fD?.fN || seg.flightNumber || ''}`,
                duration: seg.duration
            }));
        }

        // LCC format
        if (flight.departure && flight.arrival) {
            return [{
                origin: flight.departure.airport || flight.origin,
                destination: flight.arrival.airport || flight.destination,
                departureTime: flight.departure.time || flight.departureTime,
                arrivalTime: flight.arrival.time || flight.arrivalTime,
                airline: flight.carrier || flight.airline,
                flightNumber: flight.flightNumber,
                duration: flight.duration
            }];
        }

        // Generic format
        if (flight.segments) {
            return flight.segments.map(seg => ({
                origin: seg.origin || seg.departure?.airport,
                destination: seg.destination || seg.arrival?.airport,
                departureTime: seg.departureTime || seg.departure?.time,
                arrivalTime: seg.arrivalTime || seg.arrival?.time,
                airline: seg.airline || seg.carrier,
                flightNumber: seg.flightNumber,
                duration: seg.duration
            }));
        }

        return [];
    }

    /**
     * Count stops
     */
    countStops(flight) {
        const segments = this.extractSegments(flight);
        return Math.max(0, segments.length - 1);
    }

    /**
     * Calculate total duration
     */
    calculateTotalDuration(flight) {
        const segments = this.extractSegments(flight);
        if (segments.length === 0) return 0;

        const firstDep = new Date(segments[0].departureTime);
        const lastArr = new Date(segments[segments.length - 1].arrivalTime);

        return Math.round((lastArr - firstDep) / 60000); // Duration in minutes
    }

    /**
     * Extract airlines
     */
    extractAirlines(flight) {
        const segments = this.extractSegments(flight);
        const airlines = new Set(segments.map(s => s.airline).filter(Boolean));
        return Array.from(airlines);
    }

    /**
     * Extract operating airlines
     */
    extractOperatingAirlines(flight) {
        return this.extractAirlines(flight);
    }

    /**
     * Extract departure time
     */
    extractDepartureTime(flight) {
        const segments = this.extractSegments(flight);
        if (segments.length > 0) {
            return segments[0].departureTime;
        }
        return flight.departureTime || flight.departure?.time;
    }

    /**
     * Extract arrival time
     */
    extractArrivalTime(flight) {
        const segments = this.extractSegments(flight);
        if (segments.length > 0) {
            return segments[segments.length - 1].arrivalTime;
        }
        return flight.arrivalTime || flight.arrival?.time;
    }

    /**
     * Extract baggage information
     */
    extractBaggage(flight) {
        return {
            cabin: flight.baggage?.cabin || '7 kg',
            checkin: flight.baggage?.checkin || '15 kg'
        };
    }

    /**
     * Generate unique signature for flight deduplication
     */
    generateFlightSignature(flight) {
        const segments = flight.segments || [];
        const segmentSig = segments.map(s =>
            `${s.flightNumber}_${s.departureTime}_${s.arrivalTime}`
        ).join('|');

        return `${segmentSig}_${flight.cabinClass}`;
    }

    /**
     * Deduplicate flights keeping best price for each unique flight
     */
    deduplicateFlights(flights) {
        const uniqueMap = new Map();

        for (const flight of flights) {
            const sig = flight._signature;

            if (uniqueMap.has(sig)) {
                const existing = uniqueMap.get(sig);
                // Keep the one with lower price, or add as alternative
                if (flight.price < existing.price) {
                    existing._alternatives = existing._alternatives || [];
                    existing._alternatives.push({
                        supplier: existing.supplier,
                        price: existing.price
                    });
                    uniqueMap.set(sig, {
                        ...flight,
                        _alternatives: existing._alternatives
                    });
                } else {
                    existing._alternatives = existing._alternatives || [];
                    existing._alternatives.push({
                        supplier: flight.supplier,
                        price: flight.price
                    });
                }
            } else {
                uniqueMap.set(sig, flight);
            }
        }

        return Array.from(uniqueMap.values());
    }

    /**
     * Apply search filters
     */
    applyFilters(flights, params) {
        let filtered = flights;

        // Direct flights only
        if (params.directOnly) {
            filtered = filtered.filter(f => f.isDirect);
        }

        // Maximum stops
        if (params.maxStops !== undefined) {
            filtered = filtered.filter(f => f.stops <= params.maxStops);
        }

        // Price range
        if (params.minPrice) {
            filtered = filtered.filter(f => f.price >= params.minPrice);
        }
        if (params.maxPrice) {
            filtered = filtered.filter(f => f.price <= params.maxPrice);
        }

        // Airline filter
        if (params.airlines && params.airlines.length > 0) {
            filtered = filtered.filter(f =>
                f.airlines.some(a => params.airlines.includes(a))
            );
        }

        // Departure time range
        if (params.departureTimeFrom || params.departureTimeTo) {
            filtered = filtered.filter(f => {
                const depTime = new Date(f.departureTime);
                const hours = depTime.getHours();
                if (params.departureTimeFrom && hours < parseInt(params.departureTimeFrom)) return false;
                if (params.departureTimeTo && hours > parseInt(params.departureTimeTo)) return false;
                return true;
            });
        }

        // Refundable only
        if (params.refundableOnly) {
            filtered = filtered.filter(f => f.refundable);
        }

        return filtered;
    }

    /**
     * Sort flights by various criteria
     */
    sortFlights(flights, sortBy) {
        const sortedFlights = [...flights];

        switch (sortBy) {
            case 'price':
            case 'cheapest':
                sortedFlights.sort((a, b) => a.price - b.price);
                break;

            case 'duration':
            case 'fastest':
                sortedFlights.sort((a, b) => a.totalDuration - b.totalDuration);
                break;

            case 'departure':
            case 'earliest':
                sortedFlights.sort((a, b) =>
                    new Date(a.departureTime) - new Date(b.departureTime)
                );
                break;

            case 'arrival':
                sortedFlights.sort((a, b) =>
                    new Date(a.arrivalTime) - new Date(b.arrivalTime)
                );
                break;

            case 'best':
            case 'recommended':
                // Score based on price, duration, and stops
                sortedFlights.sort((a, b) => {
                    const scoreA = this.calculateBestScore(a, flights);
                    const scoreB = this.calculateBestScore(b, flights);
                    return scoreA - scoreB;
                });
                break;

            default:
                sortedFlights.sort((a, b) => a.price - b.price);
        }

        return sortedFlights;
    }

    /**
     * Calculate best score for ranking
     */
    calculateBestScore(flight, allFlights) {
        const prices = allFlights.map(f => f.price);
        const durations = allFlights.map(f => f.totalDuration).filter(d => d > 0);

        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const minDuration = Math.min(...durations);
        const maxDuration = Math.max(...durations);

        // Normalize price (0-100, lower is better)
        const priceScore = maxPrice > minPrice
            ? ((flight.price - minPrice) / (maxPrice - minPrice)) * 100
            : 0;

        // Normalize duration (0-100, lower is better)
        const durationScore = flight.totalDuration > 0 && maxDuration > minDuration
            ? ((flight.totalDuration - minDuration) / (maxDuration - minDuration)) * 100
            : 0;

        // Stops penalty (0, 20, 40 for 0, 1, 2+ stops)
        const stopsScore = Math.min(flight.stops, 2) * 20;

        // Weight: 50% price, 30% duration, 20% stops
        return (priceScore * 0.5) + (durationScore * 0.3) + (stopsScore * 0.2);
    }

    /**
     * Calculate fare statistics
     */
    calculateFareStats(flights) {
        if (flights.length === 0) {
            return { min: 0, max: 0, avg: 0, median: 0 };
        }

        const prices = flights.map(f => f.price).sort((a, b) => a - b);

        return {
            min: prices[0],
            max: prices[prices.length - 1],
            avg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
            median: prices[Math.floor(prices.length / 2)]
        };
    }

    /**
     * Find best options (cheapest, fastest, best value)
     */
    findBestOptions(flights) {
        if (flights.length === 0) {
            return { cheapest: null, fastest: null, bestValue: null };
        }

        // Cheapest
        const cheapest = flights.reduce((min, f) =>
            f.price < min.price ? f : min
            , flights[0]);

        // Fastest (non-zero duration)
        const withDuration = flights.filter(f => f.totalDuration > 0);
        const fastest = withDuration.length > 0
            ? withDuration.reduce((min, f) =>
                f.totalDuration < min.totalDuration ? f : min
                , withDuration[0])
            : cheapest;

        // Best value (considering price and duration)
        const bestValue = [...flights].sort((a, b) =>
            this.calculateBestScore(a, flights) - this.calculateBestScore(b, flights)
        )[0];

        return {
            cheapest: {
                id: cheapest.id,
                price: cheapest.price,
                airlines: cheapest.airlines,
                duration: cheapest.totalDuration,
                stops: cheapest.stops
            },
            fastest: {
                id: fastest.id,
                price: fastest.price,
                airlines: fastest.airlines,
                duration: fastest.totalDuration,
                stops: fastest.stops
            },
            bestValue: {
                id: bestValue.id,
                price: bestValue.price,
                airlines: bestValue.airlines,
                duration: bestValue.totalDuration,
                stops: bestValue.stops
            }
        };
    }

    /**
     * Get available filters based on results
     */
    getAvailableFilters(flights) {
        const airlines = new Set();
        const stops = new Set();
        const cabinClasses = new Set();

        flights.forEach(f => {
            f.airlines.forEach(a => airlines.add(a));
            stops.add(f.stops);
            cabinClasses.add(f.cabinClass);
        });

        const prices = flights.map(f => f.price);
        const durations = flights.map(f => f.totalDuration).filter(d => d > 0);

        return {
            airlines: Array.from(airlines).sort(),
            stops: Array.from(stops).sort((a, b) => a - b),
            cabinClasses: Array.from(cabinClasses),
            priceRange: {
                min: Math.min(...prices),
                max: Math.max(...prices)
            },
            durationRange: {
                min: durations.length > 0 ? Math.min(...durations) : 0,
                max: durations.length > 0 ? Math.max(...durations) : 0
            }
        };
    }

    /**
     * Find minimum price in flight list
     */
    findMinPrice(flights) {
        const prices = flights.map(f => this.extractPrice(f));
        return Math.min(...prices);
    }

    /**
     * Find maximum price in flight list
     */
    findMaxPrice(flights) {
        const prices = flights.map(f => this.extractPrice(f));
        return Math.max(...prices);
    }
}

module.exports = FareAggregator;
