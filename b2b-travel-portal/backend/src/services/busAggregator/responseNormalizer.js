/**
 * Bus Response Normalizer
 * Converts different operator formats to unified bus structure
 */

class ResponseNormalizer {
    /**
     * Normalize buses from any supplier format
     */
    static normalizeBuses(response, supplierId, format) {
        if (!response) return [];

        try {
            switch (format?.toLowerCase()) {
                case 'redbus':
                    return ResponseNormalizer.normalizeRedbus(response, supplierId);
                case 'abhibus':
                    return ResponseNormalizer.normalizeAbhibus(response, supplierId);
                case 'paytm':
                    return ResponseNormalizer.normalizePaytm(response, supplierId);
                case 'mmt':
                case 'goibibo':
                    return ResponseNormalizer.normalizeMmt(response, supplierId);
                case 'ksrtc':
                case 'apsrtc':
                case 'tsrtc':
                case 'msrtc':
                case 'gsrtc':
                case 'upsrtc':
                    return ResponseNormalizer.normalizeStateTransport(response, supplierId, format);
                case 'vrl':
                case 'srs':
                case 'orange':
                case 'kallada':
                    return ResponseNormalizer.normalizePrivateOperator(response, supplierId, format);
                case 'intrcity':
                case 'zingbus':
                    return ResponseNormalizer.normalizeSmartBus(response, supplierId, format);
                default:
                    return ResponseNormalizer.normalizeGeneric(response, supplierId);
            }
        } catch (error) {
            console.error(`[BusResponseNormalizer] Error normalizing ${format}:`, error.message);
            return [];
        }
    }

    /**
     * RedBus format
     */
    static normalizeRedbus(response, supplierId) {
        const buses = response.availableTrips || response.inventories || [];
        return buses.map(bus => ({
            id: `${supplierId}_${bus.id}`,
            externalId: bus.id,
            supplierId,
            operator: {
                name: bus.travels,
                id: bus.operatorId,
                logo: bus.operatorLogo
            },
            busType: ResponseNormalizer.normalizeBusType(bus.busType),
            busTypeRaw: bus.busType,
            route: {
                source: bus.source || bus.boardingTimes?.[0]?.location,
                sourceId: bus.sourceId,
                destination: bus.destination || bus.droppingTimes?.[0]?.location,
                destinationId: bus.destinationId,
                viaStops: bus.viaRoutes || []
            },
            schedule: {
                departureTime: bus.departureTime,
                arrivalTime: bus.arrivalTime,
                duration: bus.duration,
                durationMinutes: ResponseNormalizer.parseDuration(bus.duration)
            },
            boarding: bus.boardingTimes?.map(b => ({
                id: b.bpId,
                name: b.bpName,
                location: b.location,
                time: b.time,
                address: b.address,
                landmark: b.landmark,
                contactNumber: b.contactNumber
            })) || [],
            dropping: bus.droppingTimes?.map(d => ({
                id: d.dpId,
                name: d.dpName,
                location: d.location,
                time: d.time
            })) || [],
            seats: {
                available: bus.availableSeats,
                total: bus.totalSeats,
                layout: bus.seatLayout
            },
            pricing: {
                baseFare: bus.fares?.[0] || bus.fare,
                currency: 'INR',
                fareBreakup: bus.fareBreakup
            },
            ratings: {
                overall: bus.rating,
                count: bus.ratingCount,
                cleanliness: bus.cleanlinessRating,
                punctuality: bus.punctualityRating,
                staff: bus.staffRating
            },
            amenities: ResponseNormalizer.normalizeAmenities(bus.amenities || []),
            policies: {
                cancellation: bus.cancellationPolicy,
                partialCancellation: bus.partialCancellationAllowed,
                idRequired: bus.idProofRequired
            },
            features: {
                liveTracking: bus.liveTrackingAvailable,
                mTicket: bus.mTicketEnabled,
                primo: bus.primo
            },
            source: 'redbus'
        }));
    }

    /**
     * AbhiBus format
     */
    static normalizeAbhibus(response, supplierId) {
        const buses = response.buses || response.services || [];
        return buses.map(bus => ({
            id: `${supplierId}_${bus.busId || bus.id}`,
            externalId: bus.busId || bus.id,
            supplierId,
            operator: {
                name: bus.operatorName || bus.travels,
                id: bus.operatorId
            },
            busType: ResponseNormalizer.normalizeBusType(bus.busTypeName || bus.busType),
            busTypeRaw: bus.busTypeName || bus.busType,
            route: {
                source: bus.sourceCity,
                destination: bus.destCity
            },
            schedule: {
                departureTime: bus.depTime || bus.departureTime,
                arrivalTime: bus.arrTime || bus.arrivalTime,
                duration: bus.duration,
                durationMinutes: ResponseNormalizer.parseDuration(bus.duration)
            },
            seats: {
                available: bus.availableSeats,
                womenSeats: bus.womenSeats,
                womenSeatsAvailable: bus.womenSeatsAvailable
            },
            pricing: {
                baseFare: bus.fare || bus.minFare,
                currency: 'INR'
            },
            ratings: {
                overall: bus.rating,
                count: bus.totalRatings
            },
            amenities: ResponseNormalizer.normalizeAmenities(bus.amenities || []),
            features: {
                liveTracking: bus.gpsEnabled,
                womenOnly: bus.womenSeatsAvailable > 0
            },
            source: 'abhibus'
        }));
    }

    /**
     * Paytm format
     */
    static normalizePaytm(response, supplierId) {
        const buses = response.body?.buses || response.buses || [];
        return buses.map(bus => ({
            id: `${supplierId}_${bus.id}`,
            externalId: bus.id,
            supplierId,
            operator: {
                name: bus.operator
            },
            busType: ResponseNormalizer.normalizeBusType(bus.busType),
            schedule: {
                departureTime: bus.depTime,
                arrivalTime: bus.arrTime,
                duration: bus.duration
            },
            seats: {
                available: bus.seatsAvailable
            },
            pricing: {
                baseFare: bus.fare,
                currency: 'INR',
                cashback: bus.cashback
            },
            ratings: {
                overall: bus.ratings?.overall
            },
            source: 'paytm'
        }));
    }

    /**
     * MakeMyTrip/Goibibo format
     */
    static normalizeMmt(response, supplierId) {
        const buses = response.buses || response.data?.buses || [];
        return buses.map(bus => ({
            id: `${supplierId}_${bus.id || bus.busId}`,
            externalId: bus.id || bus.busId,
            supplierId,
            operator: {
                name: bus.operator || bus.operatorName
            },
            busType: ResponseNormalizer.normalizeBusType(bus.busType),
            schedule: {
                departureTime: bus.departureTime || bus.depTime,
                arrivalTime: bus.arrivalTime || bus.arrTime,
                duration: bus.duration
            },
            seats: {
                available: bus.availableSeats || bus.seatsAvailable
            },
            pricing: {
                baseFare: bus.fare || bus.price,
                currency: 'INR'
            },
            ratings: {
                overall: bus.rating
            },
            amenities: ResponseNormalizer.normalizeAmenities(bus.amenities || []),
            source: supplierId
        }));
    }

    /**
     * State Transport format (KSRTC, APSRTC, etc.)
     */
    static normalizeStateTransport(response, supplierId, format) {
        const buses = response.services || response.trips || response.buses || [];
        const operatorName = format.toUpperCase();

        return buses.map(bus => ({
            id: `${supplierId}_${bus.serviceId || bus.tripId || bus.id}`,
            externalId: bus.serviceId || bus.tripId || bus.id,
            supplierId,
            operator: {
                name: bus.operatorName || operatorName,
                isGovernment: true
            },
            busType: ResponseNormalizer.normalizeBusType(bus.busType || bus.serviceType),
            busTypeRaw: bus.busType || bus.serviceType,
            serviceClass: bus.serviceClass || bus.category,
            route: {
                source: bus.fromStation || bus.source,
                destination: bus.toStation || bus.destination,
                routeNo: bus.routeNo,
                viaStops: bus.viaStations || []
            },
            schedule: {
                departureTime: bus.departureTime || bus.depTime,
                arrivalTime: bus.arrivalTime || bus.arrTime,
                duration: bus.journeyHours || bus.duration,
                frequency: bus.frequency
            },
            seats: {
                available: bus.availableSeats || bus.seatsAvailable,
                total: bus.totalSeats
            },
            pricing: {
                baseFare: bus.fare || bus.baseFare,
                currency: 'INR',
                reservationCharge: bus.reservationCharge,
                gst: bus.gst,
                totalFare: bus.totalFare
            },
            policies: {
                cancellation: bus.cancellationPolicy,
                refundable: bus.isRefundable
            },
            features: {
                isGovernment: true,
                reservationCategory: bus.category
            },
            source: format
        }));
    }

    /**
     * Private Operator format (VRL, SRS, etc.)
     */
    static normalizePrivateOperator(response, supplierId, format) {
        const buses = response.trips || response.buses || response.services || [];
        const operatorNames = {
            'vrl': 'VRL Travels',
            'srs': 'SRS Travels',
            'orange': 'Orange Tours',
            'kallada': 'Kallada Travels'
        };

        return buses.map(bus => ({
            id: `${supplierId}_${bus.tripCode || bus.id}`,
            externalId: bus.tripCode || bus.id,
            supplierId,
            operator: {
                name: bus.operator || operatorNames[format] || format.toUpperCase()
            },
            busType: ResponseNormalizer.normalizeBusType(bus.busType),
            route: {
                source: bus.origin || bus.source,
                destination: bus.dest || bus.destination
            },
            schedule: {
                departureTime: bus.departure || bus.departureTime,
                arrivalTime: bus.arrival || bus.arrivalTime,
                duration: bus.duration
            },
            seats: {
                available: bus.seats || bus.availableSeats
            },
            pricing: {
                baseFare: bus.fare || bus.price,
                currency: 'INR'
            },
            amenities: ResponseNormalizer.normalizeAmenities(bus.facilities || bus.amenities || []),
            coach: bus.coachNo,
            source: format
        }));
    }

    /**
     * Smart Bus format (IntrCity, Zingbus)
     */
    static normalizeSmartBus(response, supplierId, format) {
        const buses = response.data || response.trips || [];
        return buses.map(bus => ({
            id: `${supplierId}_${bus.tripId || bus.id}`,
            externalId: bus.tripId || bus.id,
            supplierId,
            operator: {
                name: format === 'intrcity' ? 'IntrCity SmartBus' : 'Zingbus',
                isSmartBus: true
            },
            busType: ResponseNormalizer.normalizeBusType(bus.busType),
            schedule: {
                departureTime: bus.departureTime || bus.departure,
                arrivalTime: bus.arrivalTime || bus.arrival,
                duration: bus.duration || bus.travelTime
            },
            seats: {
                available: bus.availableSeats
            },
            pricing: {
                baseFare: bus.fare || bus.price,
                currency: 'INR'
            },
            ratings: {
                overall: bus.rating
            },
            amenities: ['wifi', 'charging', 'entertainment', 'snacks', 'water'],
            features: {
                isSmartBus: true,
                liveTracking: true,
                entertainment: true,
                chargingPorts: true
            },
            source: format
        }));
    }

    /**
     * Generic fallback format
     */
    static normalizeGeneric(response, supplierId) {
        const buses = response.buses || response.trips || response.services || response.data || [];
        return buses.map(bus => ({
            id: `${supplierId}_${bus.id || bus.busId || bus.tripId}`,
            externalId: bus.id || bus.busId || bus.tripId,
            supplierId,
            operator: {
                name: bus.operator || bus.operatorName || bus.travels || 'Unknown'
            },
            busType: ResponseNormalizer.normalizeBusType(bus.busType || bus.type),
            route: {
                source: bus.source || bus.origin || bus.fromCity,
                destination: bus.destination || bus.dest || bus.toCity
            },
            schedule: {
                departureTime: bus.departureTime || bus.depTime || bus.departure,
                arrivalTime: bus.arrivalTime || bus.arrTime || bus.arrival,
                duration: bus.duration || bus.travelTime
            },
            seats: {
                available: bus.availableSeats || bus.seats || bus.seatsAvailable
            },
            pricing: {
                baseFare: bus.fare || bus.price || bus.amount,
                currency: 'INR'
            },
            ratings: {
                overall: bus.rating
            },
            source: supplierId
        }));
    }

    /**
     * Normalize bus type to standard categories
     */
    static normalizeBusType(busType) {
        if (!busType) return { category: 'standard', ac: false, sleeper: false };

        const type = busType.toLowerCase();

        return {
            category: type.includes('volvo') ? 'volvo' :
                     type.includes('mercedes') ? 'mercedes' :
                     type.includes('scania') ? 'scania' :
                     type.includes('multi') ? 'multi_axle' :
                     type.includes('deluxe') ? 'deluxe' :
                     type.includes('super') ? 'super_deluxe' :
                     type.includes('ordinary') ? 'ordinary' :
                     'standard',
            ac: type.includes('a/c') || type.includes('ac') || type.includes('a.c'),
            sleeper: type.includes('sleeper'),
            seater: type.includes('seater') || type.includes('push back'),
            semiSleeper: type.includes('semi') && type.includes('sleeper'),
            luxury: type.includes('luxury') || type.includes('volvo') || type.includes('mercedes'),
            raw: busType
        };
    }

    /**
     * Parse duration string to minutes
     */
    static parseDuration(duration) {
        if (!duration) return 0;
        if (typeof duration === 'number') return duration;

        const match = duration.match(/(\d+)\s*h(?:rs?|ours?)?\s*(?:(\d+)\s*m(?:ins?)?)?/i);
        if (match) {
            const hours = parseInt(match[1]) || 0;
            const mins = parseInt(match[2]) || 0;
            return (hours * 60) + mins;
        }
        return 0;
    }

    /**
     * Normalize amenities to standard list
     */
    static normalizeAmenities(amenities) {
        const amenityMapping = {
            'wifi': ['wifi', 'wi-fi', 'internet'],
            'charging': ['charging', 'usb', 'power'],
            'ac': ['ac', 'a/c', 'air conditioning', 'air-conditioning'],
            'blanket': ['blanket', 'blankets'],
            'water': ['water', 'water bottle', 'drinking water'],
            'snacks': ['snacks', 'refreshments'],
            'entertainment': ['tv', 'entertainment', 'movie', 'video'],
            'toilet': ['toilet', 'restroom', 'washroom'],
            'reading_light': ['reading light', 'reading lamp'],
            'gps': ['gps', 'tracking', 'live tracking'],
            'cctv': ['cctv', 'camera', 'surveillance'],
            'emergency_exit': ['emergency', 'emergency exit'],
            'first_aid': ['first aid', 'medical kit'],
            'fire_extinguisher': ['fire extinguisher']
        };

        const normalized = [];
        amenities.forEach(amenity => {
            const name = (typeof amenity === 'string' ? amenity : amenity.name || '')
                .toLowerCase();

            for (const [standard, variants] of Object.entries(amenityMapping)) {
                if (variants.some(v => name.includes(v))) {
                    if (!normalized.includes(standard)) {
                        normalized.push(standard);
                    }
                    break;
                }
            }
        });

        return normalized;
    }
}

module.exports = ResponseNormalizer;
