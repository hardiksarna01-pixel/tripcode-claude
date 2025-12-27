/**
 * Bus Aggregator Controller
 * Handles multi-supplier bus searches with 40+ operator integrations
 */

const busAggregator = require('../services/busAggregator');
const { catchAsync } = require('../utils/catchAsync');

/**
 * Search buses across all registered suppliers
 */
exports.searchBuses = catchAsync(async (req, res) => {
    const searchParams = {
        source: req.body.source,
        sourceId: req.body.sourceId,
        sourceState: req.body.sourceState,
        destination: req.body.destination,
        destinationId: req.body.destinationId,
        destState: req.body.destState,
        date: req.body.date,
        returnDate: req.body.returnDate,
        minPrice: req.body.minPrice,
        maxPrice: req.body.maxPrice,
        acOnly: req.body.acOnly || false,
        sleeperOnly: req.body.sleeperOnly || false,
        operators: req.body.operators || [],
        departureAfter: req.body.departureAfter,
        departureBefore: req.body.departureBefore,
        minRating: req.body.minRating,
        amenities: req.body.amenities || [],
        sortBy: req.body.sortBy || 'departure',
        limit: req.body.limit || 100
    };

    // Validate required fields
    if (!searchParams.source || !searchParams.destination) {
        return res.status(400).json({
            success: false,
            error: 'Source and destination are required'
        });
    }

    if (!searchParams.date) {
        return res.status(400).json({
            success: false,
            error: 'Travel date is required'
        });
    }

    try {
        const result = await busAggregator.searchBuses(searchParams);

        res.json({
            success: true,
            data: {
                buses: result.buses,
                stats: result.stats,
                bestOptions: result.bestOptions,
                filters: result.filters,
                meta: {
                    searchParams,
                    responseTime: result.responseTime,
                    fromCache: result.fromCache,
                    suppliersQueried: result.suppliersQueried,
                    suppliersResponded: result.suppliersResponded,
                    totalBuses: result.buses.length
                }
            }
        });
    } catch (error) {
        console.error('[BusAggregatorController] Search error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Search failed'
        });
    }
});

/**
 * Get bus details
 */
exports.getBusDetails = catchAsync(async (req, res) => {
    const { busId } = req.params;
    const { supplierId } = req.query;

    if (!supplierId) {
        return res.status(400).json({
            success: false,
            error: 'Supplier ID is required'
        });
    }

    const details = await busAggregator.getBusDetails(busId, supplierId);

    res.json({
        success: true,
        data: details
    });
});

/**
 * Get seat layout for a bus
 */
exports.getSeatLayout = catchAsync(async (req, res) => {
    const { busId, supplierId } = req.body;

    if (!busId || !supplierId) {
        return res.status(400).json({
            success: false,
            error: 'Bus ID and Supplier ID are required'
        });
    }

    const seatLayout = await busAggregator.getSeatLayout(busId, supplierId);

    res.json({
        success: true,
        data: seatLayout
    });
});

/**
 * Block seats temporarily
 */
exports.blockSeats = catchAsync(async (req, res) => {
    const { busId, supplierId, seats, passengerInfo } = req.body;

    if (!busId || !supplierId || !seats || seats.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Bus ID, Supplier ID, and seats are required'
        });
    }

    const blockResult = await busAggregator.blockSeats(busId, supplierId, seats, passengerInfo);

    res.json({
        success: true,
        data: blockResult
    });
});

/**
 * Get list of all registered suppliers
 */
exports.getSuppliers = catchAsync(async (req, res) => {
    const suppliers = busAggregator.getSuppliers();

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
    const health = await busAggregator.healthCheck();

    res.json({
        success: true,
        data: health
    });
});

/**
 * Get aggregator statistics
 */
exports.getStats = catchAsync(async (req, res) => {
    const stats = busAggregator.getStats();

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
        const supplier = busAggregator.registerSupplier(supplierConfig);

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
        const count = busAggregator.cacheManager.invalidateByPattern(pattern);
        res.json({
            success: true,
            message: `Cleared ${count} cache entries matching pattern: ${pattern}`
        });
    } else {
        busAggregator.cacheManager.clear();
        res.json({
            success: true,
            message: 'All cache cleared'
        });
    }
});
