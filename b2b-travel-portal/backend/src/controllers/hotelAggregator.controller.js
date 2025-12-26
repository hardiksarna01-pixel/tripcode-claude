/**
 * Hotel Aggregator Controller
 * Handles multi-supplier hotel searches with 50+ API integrations
 */

const hotelAggregator = require('../services/hotelAggregator');
const { catchAsync } = require('../utils/catchAsync');

/**
 * Search hotels across all registered suppliers
 */
exports.searchHotels = catchAsync(async (req, res) => {
    const searchParams = {
        destination: req.body.destination,
        destinationId: req.body.destinationId,
        cityCode: req.body.cityCode,
        checkIn: req.body.checkIn,
        checkOut: req.body.checkOut,
        rooms: req.body.rooms || 1,
        adults: req.body.adults || 2,
        children: req.body.children || 0,
        childAges: req.body.childAges || [],
        currency: req.body.currency || 'INR',
        minPrice: req.body.minPrice,
        maxPrice: req.body.maxPrice,
        minStars: req.body.minStars,
        maxStars: req.body.maxStars,
        minRating: req.body.minRating,
        amenities: req.body.amenities || [],
        propertyTypes: req.body.propertyTypes || [],
        sortBy: req.body.sortBy || 'recommended',
        limit: req.body.limit || 100
    };

    // Validate required fields
    if (!searchParams.destination && !searchParams.destinationId && !searchParams.cityCode) {
        return res.status(400).json({
            success: false,
            error: 'Destination is required'
        });
    }

    if (!searchParams.checkIn || !searchParams.checkOut) {
        return res.status(400).json({
            success: false,
            error: 'Check-in and check-out dates are required'
        });
    }

    try {
        const result = await hotelAggregator.searchHotels(searchParams);

        res.json({
            success: true,
            data: {
                hotels: result.hotels,
                stats: result.stats,
                bestOptions: result.bestOptions,
                filters: result.filters,
                meta: {
                    searchParams,
                    responseTime: result.responseTime,
                    fromCache: result.fromCache,
                    suppliersQueried: result.suppliersQueried,
                    suppliersResponded: result.suppliersResponded,
                    totalHotels: result.hotels.length
                }
            }
        });
    } catch (error) {
        console.error('[HotelAggregatorController] Search error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Search failed'
        });
    }
});

/**
 * Get hotel details
 */
exports.getHotelDetails = catchAsync(async (req, res) => {
    const { hotelId } = req.params;
    const { supplierId } = req.query;

    if (!supplierId) {
        return res.status(400).json({
            success: false,
            error: 'Supplier ID is required'
        });
    }

    const details = await hotelAggregator.getHotelDetails(hotelId, supplierId);

    res.json({
        success: true,
        data: details
    });
});

/**
 * Check room availability
 */
exports.checkAvailability = catchAsync(async (req, res) => {
    const { hotelId, supplierId, checkIn, checkOut, rooms, adults, children } = req.body;

    if (!hotelId || !supplierId) {
        return res.status(400).json({
            success: false,
            error: 'Hotel ID and Supplier ID are required'
        });
    }

    const availability = await hotelAggregator.checkAvailability(hotelId, supplierId, {
        checkIn,
        checkOut,
        rooms,
        adults,
        children
    });

    res.json({
        success: true,
        data: availability
    });
});

/**
 * Get list of all registered suppliers
 */
exports.getSuppliers = catchAsync(async (req, res) => {
    const suppliers = hotelAggregator.getSuppliers();

    const supplierList = suppliers.map(s => ({
        id: s.id,
        name: s.name,
        type: s.type,
        active: s.active,
        priority: s.priority,
        coverage: s.coverage,
        features: s.features,
        timeout: s.timeout
    }));

    // Group by type
    const byType = supplierList.reduce((acc, supplier) => {
        const type = supplier.type || 'other';
        if (!acc[type]) acc[type] = [];
        acc[type].push(supplier);
        return acc;
    }, {});

    res.json({
        success: true,
        data: {
            total: supplierList.length,
            active: supplierList.filter(s => s.active).length,
            byType,
            suppliers: supplierList
        }
    });
});

/**
 * Get aggregator health status
 */
exports.getHealth = catchAsync(async (req, res) => {
    const health = await hotelAggregator.healthCheck();

    res.json({
        success: true,
        data: health
    });
});

/**
 * Get aggregator statistics
 */
exports.getStats = catchAsync(async (req, res) => {
    const stats = hotelAggregator.getStats();

    res.json({
        success: true,
        data: stats
    });
});

/**
 * Register a new supplier
 */
exports.registerSupplier = catchAsync(async (req, res) => {
    const supplierConfig = req.body;

    if (!supplierConfig.id || !supplierConfig.name) {
        return res.status(400).json({
            success: false,
            error: 'Supplier ID and name are required'
        });
    }

    try {
        const supplier = hotelAggregator.registerSupplier(supplierConfig);

        res.status(201).json({
            success: true,
            message: `Supplier ${supplier.name} registered successfully`,
            data: {
                id: supplier.id,
                name: supplier.name,
                type: supplier.type,
                active: supplier.active
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Clear aggregator cache
 */
exports.clearCache = catchAsync(async (req, res) => {
    const { pattern } = req.body;

    if (pattern) {
        const count = hotelAggregator.cacheManager.invalidateByPattern(pattern);
        res.json({
            success: true,
            message: `Cleared ${count} cache entries matching pattern: ${pattern}`
        });
    } else {
        hotelAggregator.cacheManager.clear();
        res.json({
            success: true,
            message: 'All cache cleared'
        });
    }
});
