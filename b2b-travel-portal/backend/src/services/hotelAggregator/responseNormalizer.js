/**
 * Hotel Response Normalizer
 * Converts different supplier formats to unified hotel structure
 */

class ResponseNormalizer {
    /**
     * Normalize hotels from any supplier format
     */
    static normalizeHotels(response, supplierId, format) {
        if (!response) return [];

        try {
            switch (format?.toLowerCase()) {
                case 'booking':
                    return ResponseNormalizer.normalizeBooking(response, supplierId);
                case 'expedia':
                    return ResponseNormalizer.normalizeExpedia(response, supplierId);
                case 'agoda':
                    return ResponseNormalizer.normalizeAgoda(response, supplierId);
                case 'hotelbeds':
                case 'webbeds':
                    return ResponseNormalizer.normalizeHotelbeds(response, supplierId);
                case 'amadeus':
                    return ResponseNormalizer.normalizeAmadeus(response, supplierId);
                case 'sabre':
                    return ResponseNormalizer.normalizeSabre(response, supplierId);
                case 'tbo':
                    return ResponseNormalizer.normalizeTbo(response, supplierId);
                case 'oyo':
                    return ResponseNormalizer.normalizeOyo(response, supplierId);
                case 'mmt':
                case 'goibibo':
                    return ResponseNormalizer.normalizeMmt(response, supplierId);
                case 'marriott':
                case 'hilton':
                case 'ihg':
                case 'accor':
                case 'hyatt':
                    return ResponseNormalizer.normalizeChain(response, supplierId, format);
                case 'trivago':
                case 'kayak':
                case 'google':
                    return ResponseNormalizer.normalizeMeta(response, supplierId);
                default:
                    return ResponseNormalizer.normalizeGeneric(response, supplierId);
            }
        } catch (error) {
            console.error(`[ResponseNormalizer] Error normalizing ${format}:`, error.message);
            return [];
        }
    }

    /**
     * Booking.com format
     */
    static normalizeBooking(response, supplierId) {
        const hotels = response.result || response.hotels || [];
        return hotels.map(hotel => ({
            id: `${supplierId}_${hotel.hotel_id}`,
            externalId: hotel.hotel_id,
            supplierId,
            name: hotel.hotel_name,
            description: hotel.hotel_description,
            address: {
                line1: hotel.address,
                city: hotel.city,
                state: hotel.region,
                country: hotel.country_trans,
                postalCode: hotel.zip,
                full: `${hotel.address}, ${hotel.city}, ${hotel.country_trans}`
            },
            location: {
                latitude: parseFloat(hotel.latitude),
                longitude: parseFloat(hotel.longitude)
            },
            starRating: parseInt(hotel.class) || 0,
            reviews: {
                score: hotel.review_score,
                count: hotel.review_nr,
                scoreWord: hotel.review_score_word
            },
            images: {
                main: hotel.main_photo_url?.replace('square60', 'max500'),
                gallery: hotel.photos?.map(p => p.url_max) || []
            },
            rooms: hotel.rooms?.map(room => ResponseNormalizer.normalizeRoom(room, supplierId, 'booking')),
            pricing: {
                lowestPrice: hotel.min_total_price,
                currency: hotel.currency_code || 'INR',
                pricePerNight: hotel.composite_price_breakdown?.gross_amount_per_night?.value
            },
            amenities: ResponseNormalizer.normalizeAmenities(hotel.facilities || [], 'booking'),
            policies: {
                checkIn: hotel.checkin?.from,
                checkOut: hotel.checkout?.until,
                cancellation: hotel.is_free_cancellation ? 'free' : 'standard'
            },
            badges: hotel.badges || [],
            propertyType: hotel.accommodation_type_name,
            source: 'booking.com'
        }));
    }

    /**
     * Expedia format
     */
    static normalizeExpedia(response, supplierId) {
        const hotels = response.properties || response.data?.propertySearch?.properties || [];
        return hotels.map(hotel => ({
            id: `${supplierId}_${hotel.id}`,
            externalId: hotel.id,
            supplierId,
            name: hotel.name,
            address: {
                line1: hotel.address?.addressLine,
                city: hotel.address?.city,
                country: hotel.address?.countryCode,
                full: hotel.address?.obfuscatedAddress
            },
            location: {
                latitude: hotel.coordinates?.latitude,
                longitude: hotel.coordinates?.longitude
            },
            starRating: parseFloat(hotel.star) || 0,
            reviews: {
                score: hotel.reviews?.score,
                count: hotel.reviews?.total
            },
            images: {
                main: hotel.propertyImage?.image?.url,
                gallery: hotel.images?.map(i => i.url) || []
            },
            pricing: {
                lowestPrice: hotel.price?.lead?.amount,
                currency: hotel.price?.lead?.currencyCode || 'INR',
                strikethrough: hotel.price?.strikeOut?.amount
            },
            amenities: ResponseNormalizer.normalizeAmenities(hotel.amenities || [], 'expedia'),
            propertyType: hotel.propertyType,
            source: 'expedia'
        }));
    }

    /**
     * Agoda format
     */
    static normalizeAgoda(response, supplierId) {
        const hotels = response.results || [];
        return hotels.map(hotel => ({
            id: `${supplierId}_${hotel.hotelId}`,
            externalId: hotel.hotelId,
            supplierId,
            name: hotel.hotelName,
            address: {
                line1: hotel.address,
                city: hotel.cityName,
                country: hotel.countryName,
                full: hotel.fullAddress
            },
            location: {
                latitude: hotel.latitude,
                longitude: hotel.longitude
            },
            starRating: hotel.starRating,
            reviews: {
                score: hotel.reviewScore,
                count: hotel.numberOfReviews
            },
            images: {
                main: hotel.heroImage,
                gallery: hotel.images || []
            },
            pricing: {
                lowestPrice: hotel.dailyRate,
                currency: hotel.currency || 'INR',
                discountPercent: hotel.discountPercentage
            },
            amenities: ResponseNormalizer.normalizeAmenities(hotel.facilities || [], 'agoda'),
            source: 'agoda'
        }));
    }

    /**
     * Hotelbeds/Webbeds format
     */
    static normalizeHotelbeds(response, supplierId) {
        const hotels = response.hotels?.hotels || [];
        return hotels.map(hotel => ({
            id: `${supplierId}_${hotel.code}`,
            externalId: hotel.code,
            supplierId,
            name: hotel.name,
            address: {
                line1: hotel.address?.content,
                city: hotel.city?.content,
                country: hotel.countryCode,
                postalCode: hotel.postalCode
            },
            location: {
                latitude: parseFloat(hotel.latitude),
                longitude: parseFloat(hotel.longitude)
            },
            starRating: parseInt(hotel.categoryCode?.replace(/[^0-9]/g, '')) || 0,
            images: {
                main: hotel.images?.[0]?.path ? `https://photos.hotelbeds.com/giata/${hotel.images[0].path}` : null,
                gallery: hotel.images?.map(i => `https://photos.hotelbeds.com/giata/${i.path}`) || []
            },
            rooms: hotel.rooms?.map(room => ({
                id: room.code,
                name: room.name,
                rates: room.rates?.map(rate => ({
                    rateKey: rate.rateKey,
                    price: parseFloat(rate.net),
                    currency: hotel.currency,
                    boardType: rate.boardCode,
                    boardName: rate.boardName,
                    cancellation: rate.cancellationPolicies,
                    rooms: rate.rooms,
                    adults: rate.adults,
                    children: rate.children
                }))
            })),
            pricing: {
                lowestPrice: Math.min(...(hotel.rooms?.flatMap(r =>
                    r.rates?.map(rt => parseFloat(rt.net))
                ) || [0])),
                currency: hotel.currency
            },
            source: 'hotelbeds'
        }));
    }

    /**
     * Amadeus GDS format
     */
    static normalizeAmadeus(response, supplierId) {
        const hotels = response.data || [];
        return hotels.map(item => ({
            id: `${supplierId}_${item.hotel?.hotelId}`,
            externalId: item.hotel?.hotelId,
            supplierId,
            name: item.hotel?.name,
            address: {
                line1: item.hotel?.address?.lines?.join(', '),
                city: item.hotel?.address?.cityName,
                country: item.hotel?.address?.countryCode,
                postalCode: item.hotel?.address?.postalCode
            },
            location: {
                latitude: item.hotel?.latitude,
                longitude: item.hotel?.longitude
            },
            starRating: parseInt(item.hotel?.rating) || 0,
            chainCode: item.hotel?.chainCode,
            rooms: item.offers?.map(offer => ({
                id: offer.id,
                name: offer.room?.description?.text,
                type: offer.room?.type,
                beds: offer.room?.beds,
                price: parseFloat(offer.price?.total),
                currency: offer.price?.currency,
                boardType: offer.boardType,
                cancellation: offer.policies?.cancellation?.description?.text,
                guarantee: offer.policies?.guarantee
            })),
            pricing: {
                lowestPrice: Math.min(...(item.offers?.map(o => parseFloat(o.price?.total)) || [0])),
                currency: item.offers?.[0]?.price?.currency
            },
            amenities: ResponseNormalizer.normalizeAmenities(item.hotel?.amenities || [], 'amadeus'),
            source: 'amadeus'
        }));
    }

    /**
     * Sabre GDS format
     */
    static normalizeSabre(response, supplierId) {
        const hotels = response.HotelAvailResponse?.HotelInfo || [];
        return hotels.map(hotel => ({
            id: `${supplierId}_${hotel.HotelCode}`,
            externalId: hotel.HotelCode,
            supplierId,
            name: hotel.HotelName,
            address: {
                line1: hotel.Address?.AddressLine,
                city: hotel.Address?.CityName,
                country: hotel.Address?.CountryCode
            },
            location: {
                latitude: hotel.Position?.Latitude,
                longitude: hotel.Position?.Longitude
            },
            starRating: hotel.StarRating,
            chainCode: hotel.ChainCode,
            pricing: {
                lowestPrice: hotel.RateRange?.MinRate,
                currency: hotel.RateRange?.CurrencyCode
            },
            source: 'sabre'
        }));
    }

    /**
     * TBO format
     */
    static normalizeTbo(response, supplierId) {
        const hotels = response.HotelSearchResult?.HotelResults || [];
        return hotels.map(hotel => ({
            id: `${supplierId}_${hotel.HotelCode}`,
            externalId: hotel.HotelCode,
            supplierId,
            name: hotel.HotelName,
            address: {
                line1: hotel.HotelAddress,
                city: hotel.CityName,
                country: hotel.CountryName
            },
            location: {
                latitude: parseFloat(hotel.Latitude),
                longitude: parseFloat(hotel.Longitude)
            },
            starRating: hotel.StarRating,
            reviews: {
                score: hotel.TripAdvisorRating,
                count: hotel.TripAdvisorReviewCount
            },
            images: {
                main: hotel.HotelPicture,
                gallery: hotel.Images || []
            },
            rooms: hotel.Rooms?.map(room => ({
                id: room.RoomIndex,
                name: room.RoomTypeName,
                price: room.Price?.PublishedPrice,
                currency: room.Price?.CurrencyCode,
                boardType: room.MealType,
                isRefundable: room.IsRefundable,
                cancellation: room.CancellationPolicy
            })),
            pricing: {
                lowestPrice: hotel.Price?.PublishedPrice,
                currency: hotel.Price?.CurrencyCode || 'INR'
            },
            source: 'tbo'
        }));
    }

    /**
     * OYO format
     */
    static normalizeOyo(response, supplierId) {
        const hotels = response.data?.hotels || response.hotels || [];
        return hotels.map(hotel => ({
            id: `${supplierId}_${hotel.id}`,
            externalId: hotel.id,
            supplierId,
            name: hotel.name,
            address: {
                line1: hotel.address,
                city: hotel.city,
                area: hotel.locality,
                full: `${hotel.address}, ${hotel.locality}, ${hotel.city}`
            },
            location: {
                latitude: hotel.lat,
                longitude: hotel.lng
            },
            starRating: 3, // OYO standardized
            reviews: {
                score: hotel.avg_rating,
                count: hotel.rating_count
            },
            images: {
                main: hotel.images?.[0],
                gallery: hotel.images || []
            },
            rooms: hotel.room_types?.map(room => ({
                id: room.id,
                name: room.name,
                price: room.price,
                currency: 'INR',
                amenities: room.amenities
            })),
            pricing: {
                lowestPrice: hotel.min_price,
                currency: 'INR',
                discountPercent: hotel.discount_percentage
            },
            amenities: ResponseNormalizer.normalizeAmenities(hotel.amenities || [], 'oyo'),
            isOyo: true,
            source: 'oyo'
        }));
    }

    /**
     * MakeMyTrip/Goibibo format
     */
    static normalizeMmt(response, supplierId) {
        const hotels = response.data?.hotels || response.hotels || [];
        return hotels.map(hotel => ({
            id: `${supplierId}_${hotel.id || hotel.hotelId}`,
            externalId: hotel.id || hotel.hotelId,
            supplierId,
            name: hotel.name || hotel.hotelName,
            address: {
                line1: hotel.address,
                city: hotel.city,
                area: hotel.area || hotel.locality
            },
            location: {
                latitude: hotel.latitude,
                longitude: hotel.longitude
            },
            starRating: hotel.starRating || hotel.stars,
            reviews: {
                score: hotel.rating || hotel.guestRating,
                count: hotel.reviewCount
            },
            images: {
                main: hotel.image || hotel.primaryImage,
                gallery: hotel.images || []
            },
            pricing: {
                lowestPrice: hotel.price || hotel.displayPrice,
                currency: 'INR',
                strikethrough: hotel.strikePrice
            },
            amenities: ResponseNormalizer.normalizeAmenities(hotel.amenities || [], 'mmt'),
            source: supplierId
        }));
    }

    /**
     * Hotel chain format (Marriott, Hilton, IHG, etc.)
     */
    static normalizeChain(response, supplierId, chainName) {
        const hotels = response.data?.hotels || response.hotels || [];
        return hotels.map(hotel => ({
            id: `${supplierId}_${hotel.id || hotel.hotelCode}`,
            externalId: hotel.id || hotel.hotelCode,
            supplierId,
            name: hotel.name || hotel.hotelName,
            brandName: hotel.brand || chainName,
            address: {
                line1: hotel.address?.line1 || hotel.address,
                city: hotel.address?.city || hotel.city,
                country: hotel.address?.country || hotel.country
            },
            location: {
                latitude: hotel.coordinates?.lat || hotel.latitude,
                longitude: hotel.coordinates?.lng || hotel.longitude
            },
            starRating: hotel.starRating || hotel.category,
            reviews: {
                score: hotel.guestReviews?.rating,
                count: hotel.guestReviews?.numberOfReviews
            },
            images: {
                main: hotel.media?.heroImage,
                gallery: hotel.media?.images || []
            },
            pricing: {
                lowestPrice: hotel.lowestRate?.amount,
                currency: hotel.lowestRate?.currency || 'INR',
                pointsRequired: hotel.lowestRate?.points
            },
            loyaltyProgram: hotel.loyaltyProgram,
            amenities: ResponseNormalizer.normalizeAmenities(hotel.amenities || [], 'chain'),
            source: chainName
        }));
    }

    /**
     * Meta search format (Trivago, Kayak, Google Hotels)
     */
    static normalizeMeta(response, supplierId) {
        const hotels = response.results || response.hotels || [];
        return hotels.map(hotel => ({
            id: `${supplierId}_${hotel.id}`,
            externalId: hotel.id,
            supplierId,
            name: hotel.name,
            address: {
                city: hotel.city,
                country: hotel.country
            },
            location: {
                latitude: hotel.lat,
                longitude: hotel.lng
            },
            starRating: hotel.stars || hotel.class,
            reviews: {
                score: hotel.rating,
                count: hotel.reviewCount
            },
            images: {
                main: hotel.image,
                gallery: hotel.photos || []
            },
            pricing: {
                lowestPrice: hotel.cheapestPrice || hotel.minPrice,
                currency: hotel.currency || 'INR',
                priceComparison: hotel.prices?.map(p => ({
                    provider: p.provider,
                    price: p.price,
                    link: p.deepLink
                }))
            },
            source: supplierId
        }));
    }

    /**
     * Generic fallback format
     */
    static normalizeGeneric(response, supplierId) {
        const hotels = response.hotels || response.data || response.results || [];
        return hotels.map(hotel => ({
            id: `${supplierId}_${hotel.id || hotel.hotelId || hotel.code}`,
            externalId: hotel.id || hotel.hotelId || hotel.code,
            supplierId,
            name: hotel.name || hotel.hotelName,
            address: {
                line1: hotel.address,
                city: hotel.city || hotel.cityName,
                country: hotel.country
            },
            location: {
                latitude: hotel.latitude || hotel.lat,
                longitude: hotel.longitude || hotel.lng
            },
            starRating: hotel.stars || hotel.starRating || hotel.category || 0,
            reviews: {
                score: hotel.rating || hotel.reviewScore,
                count: hotel.reviewCount
            },
            images: {
                main: hotel.image || hotel.photo || hotel.thumbnail
            },
            pricing: {
                lowestPrice: hotel.price || hotel.rate || hotel.minPrice,
                currency: hotel.currency || 'INR'
            },
            source: supplierId
        }));
    }

    /**
     * Normalize room data
     */
    static normalizeRoom(room, supplierId, format) {
        return {
            id: room.room_id || room.id || room.code,
            name: room.room_name || room.name || room.roomTypeName,
            description: room.description,
            beds: room.beds || room.bed_configuration,
            maxOccupancy: room.max_occupancy || room.maxGuests,
            price: room.price || room.min_price || room.rate,
            currency: room.currency || 'INR',
            boardType: room.board_type || room.mealPlan,
            breakfast: room.breakfast_included || room.includesBreakfast,
            cancellation: room.cancellation_policy || room.refundable,
            amenities: room.facilities || room.amenities || []
        };
    }

    /**
     * Normalize amenities across formats
     */
    static normalizeAmenities(amenities, format) {
        const amenityMapping = {
            'wifi': ['wifi', 'free_wifi', 'internet', 'wlan', 'wireless'],
            'parking': ['parking', 'free_parking', 'valet_parking', 'car_park'],
            'pool': ['pool', 'swimming_pool', 'outdoor_pool', 'indoor_pool'],
            'gym': ['gym', 'fitness', 'fitness_center', 'exercise'],
            'spa': ['spa', 'wellness', 'sauna', 'massage'],
            'restaurant': ['restaurant', 'dining', 'food', 'breakfast'],
            'bar': ['bar', 'lounge', 'pub'],
            'ac': ['ac', 'air_conditioning', 'climate_control'],
            'tv': ['tv', 'television', 'cable_tv', 'flat_screen'],
            'room_service': ['room_service', '24hr_room_service'],
            'laundry': ['laundry', 'dry_cleaning'],
            'business_center': ['business_center', 'meeting_rooms', 'conference'],
            'airport_shuttle': ['airport_shuttle', 'transfer', 'pickup'],
            'pet_friendly': ['pets', 'pet_friendly', 'dogs_allowed']
        };

        const normalized = [];
        amenities.forEach(amenity => {
            const name = (typeof amenity === 'string' ? amenity : amenity.name || amenity.description || '')
                .toLowerCase().replace(/[\s-]/g, '_');

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
