/**
 * Bus API Adapters
 * Transforms different operator API formats to unified structure
 */

class BaseBusAdapter {
    constructor(config) {
        this.config = config;
        this.baseUrl = config.baseUrl;
        this.apiKey = config.apiKey;
        this.timeout = config.timeout || 4000;
    }

    async search(params) {
        throw new Error('search() must be implemented');
    }

    async getDetails(busId) {
        throw new Error('getDetails() must be implemented');
    }

    async getSeatLayout(busId) {
        throw new Error('getSeatLayout() must be implemented');
    }

    async blockSeats(busId, seats, passengerInfo) {
        throw new Error('blockSeats() must be implemented');
    }
}

/**
 * RedBus Adapter
 */
class RedBusAdapter extends BaseBusAdapter {
    async search(params) {
        const request = {
            source: params.sourceId,
            destination: params.destinationId,
            doj: params.date, // DD-MM-YYYY
            currency: 'INR'
        };

        // Simulated response
        return { availableTrips: [] };
    }

    normalizeResponse(response) {
        return response.availableTrips?.map(bus => ({
            id: bus.id,
            operator: bus.travels,
            busType: bus.busType,
            departureTime: bus.departureTime,
            arrivalTime: bus.arrivalTime,
            duration: bus.duration,
            source: bus.boardingTimes?.[0]?.location,
            destination: bus.droppingTimes?.[0]?.location,
            availableSeats: bus.availableSeats,
            fare: bus.fares?.[0],
            rating: bus.rating,
            amenities: bus.amenities,
            liveTracking: bus.liveTrackingAvailable,
            cancellationPolicy: bus.cancellationPolicy
        })) || [];
    }
}

/**
 * AbhiBus Adapter
 */
class AbhiBusAdapter extends BaseBusAdapter {
    async search(params) {
        return { buses: [] };
    }

    normalizeResponse(response) {
        return response.buses?.map(bus => ({
            id: bus.busId,
            operator: bus.operatorName,
            busType: bus.busTypeName,
            departureTime: bus.depTime,
            arrivalTime: bus.arrTime,
            duration: bus.duration,
            availableSeats: bus.availableSeats,
            fare: bus.fare,
            rating: bus.rating,
            amenities: bus.amenities,
            womenSeats: bus.womenSeats
        })) || [];
    }
}

/**
 * State Transport (KSRTC/APSRTC etc) Adapter
 */
class StateTransportAdapter extends BaseBusAdapter {
    async search(params) {
        return { services: [] };
    }

    normalizeResponse(response) {
        return response.services?.map(bus => ({
            id: bus.serviceId || bus.tripId,
            operator: bus.operatorName || 'State Transport',
            busType: bus.busType || bus.serviceType,
            departureTime: bus.departureTime,
            arrivalTime: bus.arrivalTime,
            duration: bus.journeyHours,
            source: bus.fromStation,
            destination: bus.toStation,
            availableSeats: bus.availableSeats,
            fare: bus.fare || bus.baseFare,
            isGovt: true,
            reservationCategory: bus.category
        })) || [];
    }
}

/**
 * VRL Travels Adapter
 */
class VRLAdapter extends BaseBusAdapter {
    async search(params) {
        return { trips: [] };
    }

    normalizeResponse(response) {
        return response.trips?.map(bus => ({
            id: bus.tripCode,
            operator: 'VRL Travels',
            busType: bus.busType,
            departureTime: bus.departure,
            arrivalTime: bus.arrival,
            duration: bus.duration,
            source: bus.origin,
            destination: bus.dest,
            availableSeats: bus.seats,
            fare: bus.fare,
            amenities: bus.facilities,
            coach: bus.coachNo
        })) || [];
    }
}

/**
 * Paytm Bus Adapter
 */
class PaytmBusAdapter extends BaseBusAdapter {
    async search(params) {
        return { body: { buses: [] } };
    }

    normalizeResponse(response) {
        return response.body?.buses?.map(bus => ({
            id: bus.id,
            operator: bus.operator,
            busType: bus.busType,
            departureTime: bus.depTime,
            arrivalTime: bus.arrTime,
            duration: bus.duration,
            availableSeats: bus.seatsAvailable,
            fare: bus.fare,
            rating: bus.ratings?.overall,
            cashback: bus.cashback
        })) || [];
    }
}

/**
 * IntrCity SmartBus Adapter
 */
class IntrCityAdapter extends BaseBusAdapter {
    async search(params) {
        return { data: [] };
    }

    normalizeResponse(response) {
        return response.data?.map(bus => ({
            id: bus.tripId,
            operator: 'IntrCity SmartBus',
            busType: bus.busType,
            departureTime: bus.departureTime,
            arrivalTime: bus.arrivalTime,
            duration: bus.duration,
            availableSeats: bus.availableSeats,
            fare: bus.fare,
            rating: bus.rating,
            amenities: ['wifi', 'charging', 'entertainment', 'snacks'],
            isSmartBus: true,
            liveTracking: true
        })) || [];
    }
}

/**
 * Zingbus Adapter
 */
class ZingbusAdapter extends BaseBusAdapter {
    async search(params) {
        return { trips: [] };
    }

    normalizeResponse(response) {
        return response.trips?.map(bus => ({
            id: bus.id,
            operator: 'Zingbus',
            busType: bus.busType,
            departureTime: bus.departure,
            arrivalTime: bus.arrival,
            duration: bus.travelTime,
            availableSeats: bus.availableSeats,
            fare: bus.price,
            rating: bus.rating,
            amenities: bus.amenities,
            liveTracking: true
        })) || [];
    }
}

/**
 * Generic Bus Adapter
 */
class GenericBusAdapter extends BaseBusAdapter {
    async search(params) {
        return { buses: [] };
    }

    normalizeResponse(response) {
        const buses = response.buses || response.trips || response.services || response.data || [];
        return buses.map(bus => ({
            id: bus.id || bus.busId || bus.tripId,
            operator: bus.operator || bus.operatorName || bus.travels,
            busType: bus.busType || bus.type,
            departureTime: bus.departureTime || bus.depTime || bus.departure,
            arrivalTime: bus.arrivalTime || bus.arrTime || bus.arrival,
            duration: bus.duration || bus.travelTime,
            source: bus.source || bus.origin || bus.fromCity,
            destination: bus.destination || bus.dest || bus.toCity,
            availableSeats: bus.availableSeats || bus.seats || bus.seatsAvailable,
            fare: bus.fare || bus.price || bus.amount,
            rating: bus.rating
        }));
    }
}

/**
 * Factory function to create appropriate adapter
 */
function createAdapter(supplierConfig) {
    const format = supplierConfig.responseFormat || 'generic';

    const adapters = {
        'redbus': RedBusAdapter,
        'abhibus': AbhiBusAdapter,
        'paytm': PaytmBusAdapter,
        'ksrtc': StateTransportAdapter,
        'ksrtc_kerala': StateTransportAdapter,
        'apsrtc': StateTransportAdapter,
        'tsrtc': StateTransportAdapter,
        'msrtc': StateTransportAdapter,
        'gsrtc': StateTransportAdapter,
        'upsrtc': StateTransportAdapter,
        'rsrtc': StateTransportAdapter,
        'tnstc': StateTransportAdapter,
        'hrtc': StateTransportAdapter,
        'pepsu': StateTransportAdapter,
        'vrl': VRLAdapter,
        'intrcity': IntrCityAdapter,
        'zingbus': ZingbusAdapter,
        'mmt': GenericBusAdapter,
        'goibibo': GenericBusAdapter,
        'cleartrip': GenericBusAdapter,
        'yatra': GenericBusAdapter,
        'ixigo': GenericBusAdapter
    };

    const AdapterClass = adapters[format.toLowerCase()] || GenericBusAdapter;
    return new AdapterClass(supplierConfig);
}

module.exports = {
    createAdapter,
    BaseBusAdapter,
    RedBusAdapter,
    AbhiBusAdapter,
    StateTransportAdapter,
    VRLAdapter,
    PaytmBusAdapter,
    IntrCityAdapter,
    ZingbusAdapter,
    GenericBusAdapter
};
