/**
 * Hotel API Adapters
 * Transforms different supplier API formats to unified structure
 */

class BaseHotelAdapter {
    constructor(config) {
        this.config = config;
        this.baseUrl = config.baseUrl;
        this.apiKey = config.apiKey;
        this.timeout = config.timeout || 5000;
    }

    async search(params) {
        throw new Error('search() must be implemented');
    }

    async getDetails(hotelId) {
        throw new Error('getDetails() must be implemented');
    }

    async checkAvailability(hotelId, roomParams) {
        throw new Error('checkAvailability() must be implemented');
    }

    buildHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
        };
    }
}

/**
 * Booking.com Adapter
 */
class BookingAdapter extends BaseHotelAdapter {
    async search(params) {
        // Booking.com API format
        const request = {
            checkin: params.checkIn,
            checkout: params.checkOut,
            dest_id: params.destinationId,
            dest_type: 'city',
            room_number: params.rooms,
            adults_number: params.adults,
            children_number: params.children || 0,
            order_by: 'popularity',
            filter_by_currency: params.currency || 'INR',
            locale: 'en-gb',
            units: 'metric'
        };

        // Simulated response structure
        return {
            result: [],
            count: 0
        };
    }

    normalizeResponse(response) {
        return response.result?.map(hotel => ({
            id: hotel.hotel_id,
            name: hotel.hotel_name,
            address: hotel.address,
            city: hotel.city,
            country: hotel.country_trans,
            starRating: hotel.class,
            reviewScore: hotel.review_score,
            reviewCount: hotel.review_nr,
            latitude: hotel.latitude,
            longitude: hotel.longitude,
            mainPhoto: hotel.main_photo_url,
            photos: hotel.photos || [],
            rooms: hotel.rooms?.map(room => ({
                id: room.room_id,
                name: room.room_name,
                price: room.min_price,
                currency: room.currency,
                cancellation: room.is_free_cancellation ? 'free' : 'non-refundable',
                breakfast: room.breakfast_included,
                maxOccupancy: room.max_occupancy
            })),
            amenities: hotel.facilities || [],
            lowestPrice: hotel.min_total_price,
            currency: hotel.currency_code
        })) || [];
    }
}

/**
 * Expedia Adapter (EAN - Expedia Affiliate Network)
 */
class ExpediaAdapter extends BaseHotelAdapter {
    async search(params) {
        const request = {
            currency: params.currency || 'INR',
            eapid: 1,
            locale: 'en_IN',
            siteId: 300000001,
            destination: { regionId: params.destinationId },
            checkInDate: { day: params.checkInDay, month: params.checkInMonth, year: params.checkInYear },
            checkOutDate: { day: params.checkOutDay, month: params.checkOutMonth, year: params.checkOutYear },
            rooms: [{ adults: params.adults, children: params.childAges || [] }],
            resultsSize: 50,
            sort: 'RECOMMENDED'
        };

        return { properties: [] };
    }

    normalizeResponse(response) {
        return response.properties?.map(hotel => ({
            id: hotel.id,
            name: hotel.name,
            address: hotel.address?.addressLine,
            city: hotel.address?.city,
            starRating: hotel.star,
            reviewScore: hotel.reviews?.score,
            reviewCount: hotel.reviews?.total,
            latitude: hotel.coordinates?.latitude,
            longitude: hotel.coordinates?.longitude,
            mainPhoto: hotel.propertyImage?.image?.url,
            lowestPrice: hotel.price?.lead?.amount,
            currency: hotel.price?.lead?.currencyCode,
            amenities: hotel.amenities || []
        })) || [];
    }
}

/**
 * Hotelbeds Adapter (B2B Wholesaler)
 */
class HotelbedsAdapter extends BaseHotelAdapter {
    async search(params) {
        const request = {
            stay: {
                checkIn: params.checkIn,
                checkOut: params.checkOut
            },
            occupancies: [{
                rooms: params.rooms,
                adults: params.adults,
                children: params.children || 0
            }],
            destination: {
                code: params.destinationCode
            },
            filter: {
                minRate: params.minPrice,
                maxRate: params.maxPrice,
                minCategory: params.minStars,
                maxCategory: params.maxStars
            }
        };

        return { hotels: { hotels: [] } };
    }

    normalizeResponse(response) {
        return response.hotels?.hotels?.map(hotel => ({
            id: hotel.code,
            name: hotel.name,
            address: hotel.address?.content,
            city: hotel.city?.content,
            starRating: parseInt(hotel.categoryCode?.replace('EST', '')) || 0,
            latitude: hotel.latitude,
            longitude: hotel.longitude,
            mainPhoto: hotel.images?.[0]?.path,
            rooms: hotel.rooms?.map(room => ({
                id: room.code,
                name: room.name,
                price: room.rates?.[0]?.net,
                currency: hotel.currency,
                boardType: room.rates?.[0]?.boardCode,
                cancellation: room.rates?.[0]?.cancellationPolicies
            })),
            lowestPrice: Math.min(...(hotel.rooms?.flatMap(r => r.rates?.map(rt => parseFloat(rt.net))) || [0])),
            currency: hotel.currency
        })) || [];
    }
}

/**
 * Amadeus Hotel Adapter (GDS)
 */
class AmadeusHotelAdapter extends BaseHotelAdapter {
    async search(params) {
        const request = {
            cityCode: params.cityCode,
            checkInDate: params.checkIn,
            checkOutDate: params.checkOut,
            roomQuantity: params.rooms,
            adults: params.adults,
            radius: 50,
            radiusUnit: 'KM',
            hotelSource: 'ALL',
            includeClosed: false,
            bestRateOnly: true,
            currency: params.currency || 'INR'
        };

        return { data: [] };
    }

    normalizeResponse(response) {
        return response.data?.map(hotel => ({
            id: hotel.hotel?.hotelId,
            name: hotel.hotel?.name,
            address: hotel.hotel?.address?.lines?.join(', '),
            city: hotel.hotel?.address?.cityName,
            country: hotel.hotel?.address?.countryCode,
            starRating: parseInt(hotel.hotel?.rating) || 0,
            latitude: hotel.hotel?.latitude,
            longitude: hotel.hotel?.longitude,
            rooms: hotel.offers?.map(offer => ({
                id: offer.id,
                name: offer.room?.description?.text,
                price: parseFloat(offer.price?.total),
                currency: offer.price?.currency,
                boardType: offer.boardType,
                cancellation: offer.policies?.cancellation?.description?.text
            })),
            lowestPrice: Math.min(...(hotel.offers?.map(o => parseFloat(o.price?.total)) || [0])),
            currency: hotel.offers?.[0]?.price?.currency,
            amenities: hotel.hotel?.amenities || []
        })) || [];
    }
}

/**
 * OYO Rooms Adapter
 */
class OyoAdapter extends BaseHotelAdapter {
    async search(params) {
        return { data: { hotels: [] } };
    }

    normalizeResponse(response) {
        return response.data?.hotels?.map(hotel => ({
            id: hotel.id,
            name: hotel.name,
            address: hotel.address,
            city: hotel.city,
            starRating: hotel.rating || 3,
            reviewScore: hotel.avg_rating,
            reviewCount: hotel.rating_count,
            latitude: hotel.lat,
            longitude: hotel.lng,
            mainPhoto: hotel.images?.[0],
            rooms: hotel.room_types?.map(room => ({
                id: room.id,
                name: room.name,
                price: room.price,
                currency: 'INR',
                amenities: room.amenities
            })),
            lowestPrice: hotel.min_price,
            currency: 'INR',
            amenities: hotel.amenities || [],
            isOyo: true
        })) || [];
    }
}

/**
 * TBO Holidays Adapter
 */
class TboHotelAdapter extends BaseHotelAdapter {
    async search(params) {
        return { HotelSearchResult: { HotelResults: [] } };
    }

    normalizeResponse(response) {
        return response.HotelSearchResult?.HotelResults?.map(hotel => ({
            id: hotel.HotelCode,
            name: hotel.HotelName,
            address: hotel.HotelAddress,
            city: hotel.CityName,
            starRating: hotel.StarRating,
            reviewScore: hotel.TripAdvisorRating,
            latitude: hotel.Latitude,
            longitude: hotel.Longitude,
            mainPhoto: hotel.HotelPicture,
            rooms: hotel.Rooms?.map(room => ({
                id: room.RoomIndex,
                name: room.RoomTypeName,
                price: room.Price?.PublishedPrice,
                currency: room.Price?.CurrencyCode,
                boardType: room.MealType,
                cancellation: room.IsRefundable ? 'refundable' : 'non-refundable'
            })),
            lowestPrice: hotel.Price?.PublishedPrice,
            currency: hotel.Price?.CurrencyCode
        })) || [];
    }
}

/**
 * Generic REST API Adapter
 */
class GenericHotelAdapter extends BaseHotelAdapter {
    async search(params) {
        return { hotels: [] };
    }

    normalizeResponse(response) {
        return response.hotels?.map(hotel => ({
            id: hotel.id || hotel.hotelId || hotel.code,
            name: hotel.name || hotel.hotelName,
            address: hotel.address,
            city: hotel.city || hotel.cityName,
            starRating: hotel.stars || hotel.starRating || hotel.category,
            reviewScore: hotel.rating || hotel.reviewScore,
            latitude: hotel.latitude || hotel.lat,
            longitude: hotel.longitude || hotel.lng,
            mainPhoto: hotel.image || hotel.photo || hotel.thumbnail,
            lowestPrice: hotel.price || hotel.minPrice || hotel.rate,
            currency: hotel.currency || 'INR'
        })) || [];
    }
}

/**
 * Factory function to create appropriate adapter
 */
function createAdapter(supplierConfig) {
    const format = supplierConfig.responseFormat || 'generic';

    const adapters = {
        'booking': BookingAdapter,
        'expedia': ExpediaAdapter,
        'hotelbeds': HotelbedsAdapter,
        'webbeds': HotelbedsAdapter,
        'amadeus': AmadeusHotelAdapter,
        'sabre': AmadeusHotelAdapter,
        'travelport': AmadeusHotelAdapter,
        'oyo': OyoAdapter,
        'tbo': TboHotelAdapter,
        'mmt': GenericHotelAdapter,
        'goibibo': GenericHotelAdapter,
        'agoda': GenericHotelAdapter,
        'cleartrip': GenericHotelAdapter,
        'yatra': GenericHotelAdapter,
        'trip': GenericHotelAdapter,
        'marriott': GenericHotelAdapter,
        'hilton': GenericHotelAdapter,
        'ihg': GenericHotelAdapter,
        'accor': GenericHotelAdapter,
        'hyatt': GenericHotelAdapter
    };

    const AdapterClass = adapters[format.toLowerCase()] || GenericHotelAdapter;
    return new AdapterClass(supplierConfig);
}

module.exports = {
    createAdapter,
    BaseHotelAdapter,
    BookingAdapter,
    ExpediaAdapter,
    HotelbedsAdapter,
    AmadeusHotelAdapter,
    OyoAdapter,
    TboHotelAdapter,
    GenericHotelAdapter
};
