/**
 * Response Normalizer
 * Transforms different API response formats to a unified structure
 */

class ResponseNormalizer {
    /**
     * Normalize flights from various API formats
     */
    static normalizeFlights(response, supplierId, format) {
        try {
            switch (format?.toLowerCase()) {
                case 'amadeus':
                    return ResponseNormalizer.normalizeAmadeus(response);
                case 'tripjack':
                    return ResponseNormalizer.normalizeTripJack(response);
                case 'skyscanner':
                    return ResponseNormalizer.normalizeSkyscanner(response);
                case 'sabre':
                    return ResponseNormalizer.normalizeSabre(response);
                case 'travelport':
                    return ResponseNormalizer.normalizeTravelport(response);
                case 'tbo':
                    return ResponseNormalizer.normalizeTBO(response);
                case 'indigo':
                case 'spicejet':
                case 'airasia':
                case 'goair':
                    return ResponseNormalizer.normalizeLCC(response, format);
                case 'kiwi':
                    return ResponseNormalizer.normalizeKiwi(response);
                default:
                    return ResponseNormalizer.normalizeGeneric(response);
            }
        } catch (error) {
            console.error(`[Normalizer] Error normalizing ${format}:`, error.message);
            return [];
        }
    }

    /**
     * Amadeus format
     */
    static normalizeAmadeus(response) {
        const flights = response?.flights || response?.data || [];
        return flights.map(flight => ({
            id: flight.id,
            price: parseFloat(flight.price?.total) || 0,
            currency: flight.price?.currency || 'INR',
            priceBreakdown: {
                base: parseFloat(flight.price?.base) || 0,
                taxes: parseFloat(flight.price?.fees) || 0
            },
            itineraries: flight.itineraries || [],
            validatingAirline: flight.validatingAirlineCodes?.[0],
            source: 'GDS',
            bookingClass: flight.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.class,
            cabinClass: flight.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin,
            lastTicketingDate: flight.lastTicketingDate
        }));
    }

    /**
     * TripJack format
     */
    static normalizeTripJack(response) {
        const trips = response?.searchResult?.tripInfos || [];
        return trips.map(trip => ({
            id: trip.tripId,
            price: trip.totalPriceInfo?.totalFareDetail?.fC?.TF || 0,
            currency: 'INR',
            priceBreakdown: {
                base: trip.totalPriceInfo?.totalFareDetail?.fC?.BF || 0,
                taxes: trip.totalPriceInfo?.totalFareDetail?.fC?.TAF || 0
            },
            sI: trip.sI, // Keep original segment info
            itineraries: [{
                segments: (trip.sI || []).map(seg => ({
                    departure: {
                        iataCode: seg.da?.code,
                        at: seg.da?.dateTime
                    },
                    arrival: {
                        iataCode: seg.aa?.code,
                        at: seg.aa?.dateTime
                    },
                    carrierCode: seg.fD?.aI?.code,
                    number: seg.fD?.fN,
                    duration: `PT${Math.floor(seg.duration / 60)}H${seg.duration % 60}M`
                }))
            }],
            source: 'CONSOLIDATOR'
        }));
    }

    /**
     * Skyscanner format
     */
    static normalizeSkyscanner(response) {
        const quotes = response?.Quotes || [];
        const carriers = new Map(
            (response?.Carriers || []).map(c => [c.CarrierId, c])
        );

        return quotes.map(quote => {
            const carrier = carriers.get(quote.OutboundLeg?.CarrierIds?.[0]);
            return {
                id: `sky_${quote.QuoteId}`,
                price: quote.MinPrice || 0,
                currency: 'INR',
                isDirect: quote.Direct,
                itineraries: [{
                    segments: [{
                        departure: {
                            at: quote.OutboundLeg?.DepartureDate
                        },
                        carrierCode: carrier?.Code,
                        carrierName: carrier?.Name
                    }]
                }],
                source: 'META',
                indicative: true // Prices are indicative
            };
        });
    }

    /**
     * Sabre format
     */
    static normalizeSabre(response) {
        const itineraries = response?.groupedItineraryResponse?.itineraryGroups?.[0]?.itineraries || [];
        return itineraries.map((itin, index) => ({
            id: `sabre_${index}`,
            price: itin.pricingInformation?.[0]?.fare?.totalFare?.totalPrice || 0,
            currency: itin.pricingInformation?.[0]?.fare?.totalFare?.currency || 'INR',
            itineraries: [{
                segments: (itin.legs?.[0]?.schedules || []).map(sched => ({
                    departure: {
                        iataCode: sched.departure?.airport,
                        at: sched.departure?.dateTime
                    },
                    arrival: {
                        iataCode: sched.arrival?.airport,
                        at: sched.arrival?.dateTime
                    },
                    carrierCode: sched.carrier?.marketing,
                    number: sched.carrier?.marketingFlightNumber
                }))
            }],
            source: 'GDS'
        }));
    }

    /**
     * Travelport format
     */
    static normalizeTravelport(response) {
        const airPriceResults = response?.AirPriceRsp?.AirPriceResult || [];
        return airPriceResults.map((result, index) => ({
            id: `tvp_${index}`,
            price: parseFloat(result.AirPricingSolution?.TotalPrice?.replace(/[^0-9.]/g, '')) || 0,
            currency: 'INR',
            itineraries: [{
                segments: (result.AirPricingSolution?.AirSegment || []).map(seg => ({
                    departure: {
                        iataCode: seg.Origin,
                        at: seg.DepartureTime
                    },
                    arrival: {
                        iataCode: seg.Destination,
                        at: seg.ArrivalTime
                    },
                    carrierCode: seg.Carrier,
                    number: seg.FlightNumber
                }))
            }],
            source: 'GDS'
        }));
    }

    /**
     * TBO format
     */
    static normalizeTBO(response) {
        const results = response?.Results?.[0] || [];
        return results.map((result, index) => ({
            id: result.ResultIndex || `tbo_${index}`,
            price: result.Fare?.PublishedFare || 0,
            currency: result.Fare?.Currency || 'INR',
            priceBreakdown: {
                base: result.Fare?.BaseFare || 0,
                taxes: result.Fare?.Tax || 0,
                fees: result.Fare?.OtherCharges || 0
            },
            itineraries: [{
                segments: (result.Segments?.[0] || []).map(seg => ({
                    departure: {
                        iataCode: seg.Origin?.Airport?.AirportCode,
                        at: seg.Origin?.DepTime
                    },
                    arrival: {
                        iataCode: seg.Destination?.Airport?.AirportCode,
                        at: seg.Destination?.ArrTime
                    },
                    carrierCode: seg.Airline?.AirlineCode,
                    number: seg.Airline?.FlightNumber,
                    duration: `PT${seg.Duration}M`
                }))
            }],
            source: 'CONSOLIDATOR',
            isRefundable: result.IsRefundable,
            isLCC: result.IsLCC
        }));
    }

    /**
     * LCC (Low Cost Carrier) format
     */
    static normalizeLCC(response, format) {
        const flights = response?.data?.flights || response?.flights || [];
        return flights.map(flight => ({
            id: flight.flightKey || flight.flightId,
            price: flight.fare?.total || flight.price || 0,
            currency: flight.currency || 'INR',
            priceBreakdown: {
                base: flight.fare?.base || 0,
                taxes: flight.fare?.taxes || 0
            },
            itineraries: [{
                segments: [{
                    departure: {
                        iataCode: flight.departure?.airport || flight.origin,
                        at: flight.departure?.time || flight.departureTime
                    },
                    arrival: {
                        iataCode: flight.arrival?.airport || flight.destination,
                        at: flight.arrival?.time || flight.arrivalTime
                    },
                    carrierCode: flight.carrier || flight.airline,
                    number: flight.flightNumber
                }]
            }],
            source: 'LCC',
            seatsAvailable: flight.availability,
            carrierFormat: format
        }));
    }

    /**
     * Kiwi format
     */
    static normalizeKiwi(response) {
        const flights = response?.data || [];
        return flights.map(flight => ({
            id: flight.id,
            price: flight.price || 0,
            currency: flight.currency || 'INR',
            itineraries: [{
                segments: (flight.route || []).map(seg => ({
                    departure: {
                        iataCode: seg.flyFrom,
                        at: new Date(seg.dTime * 1000).toISOString()
                    },
                    arrival: {
                        iataCode: seg.flyTo,
                        at: new Date(seg.aTime * 1000).toISOString()
                    },
                    carrierCode: seg.airline,
                    number: `${seg.airline}${seg.flight_no}`
                }))
            }],
            source: 'AGGREGATOR',
            deepLink: flight.deep_link,
            virtualInterlining: flight.virtual_interlining
        }));
    }

    /**
     * Generic format (fallback)
     */
    static normalizeGeneric(response) {
        const flights = response?.flights || response?.data?.flights || response || [];

        if (!Array.isArray(flights)) {
            return [];
        }

        return flights.map((flight, index) => ({
            id: flight.id || flight.flightId || `gen_${index}`,
            price: flight.price || flight.fare || flight.totalPrice || 0,
            currency: flight.currency || 'INR',
            itineraries: flight.itineraries || [{
                segments: flight.segments || [{
                    departure: {
                        iataCode: flight.origin || flight.departure?.airport,
                        at: flight.departureTime || flight.departure?.time
                    },
                    arrival: {
                        iataCode: flight.destination || flight.arrival?.airport,
                        at: flight.arrivalTime || flight.arrival?.time
                    },
                    carrierCode: flight.airline || flight.carrier,
                    number: flight.flightNumber
                }]
            }],
            source: 'GENERIC'
        }));
    }

    /**
     * Validate normalized flight
     */
    static validateFlight(flight) {
        const required = ['id', 'price'];
        for (const field of required) {
            if (!flight[field] && flight[field] !== 0) {
                return false;
            }
        }
        return true;
    }
}

module.exports = ResponseNormalizer;
