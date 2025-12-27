/**
 * Aggregator Controller
 * Handles multi-supplier flight searches with 100+ API integrations
 */

const apiAggregator = require('../services/apiAggregator');
const { catchAsync } = require('../utils/catchAsync');

/**
 * Search flights across all registered suppliers
 * Returns aggregated, deduplicated, and ranked results
 */
exports.searchFlights = catchAsync(async (req, res) => {
    const startTime = Date.now();

    const searchParams = {
        origin: req.body.origin,
        destination: req.body.destination,
        departureDate: req.body.departureDate || req.body.travelDate,
        returnDate: req.body.returnDate,
        adults: req.body.adults || 1,
        children: req.body.children || 0,
        infants: req.body.infants || 0,
        cabinClass: req.body.cabinClass || req.body.classOfTravel || 'economy',
        directOnly: req.body.directOnly || false,
        maxPrice: req.body.maxPrice,
        airlines: req.body.airlines || [],
        sortBy: req.body.sortBy || 'bestValue', // price, duration, bestValue
        limit: req.body.limit || 100
    };

    // Validate required fields
    if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
        return res.status(400).json({
            success: false,
            error: 'Origin, destination, and departure date are required'
        });
    }

    try {
        const result = await apiAggregator.searchFlights(searchParams);

        res.json({
            success: true,
            data: {
                flights: result.flights,
                stats: result.stats,
                bestOptions: result.bestOptions,
                filters: result.filters,
                meta: {
                    searchParams,
                    responseTime: result.responseTime,
                    fromCache: result.fromCache,
                    suppliersQueried: result.suppliersQueried,
                    suppliersResponded: result.suppliersResponded,
                    totalFlights: result.flights.length
                }
            }
        });
    } catch (error) {
        console.error('[AggregatorController] Search error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Search failed'
        });
    }
});

/**
 * Get list of all registered suppliers
 */
exports.getSuppliers = catchAsync(async (req, res) => {
    const suppliers = apiAggregator.getSuppliers();

    const supplierList = suppliers.map(s => ({
        id: s.id,
        name: s.name,
        type: s.type,
        active: s.active,
        priority: s.priority,
        responseFormat: s.responseFormat,
        supportedRoutes: s.supportedRoutes,
        features: s.features,
        rateLimit: s.rateLimit,
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
 * Get aggregator and supplier health status
 */
exports.getHealth = catchAsync(async (req, res) => {
    const health = await apiAggregator.healthCheck();

    res.json({
        success: true,
        data: health
    });
});

/**
 * Get aggregator statistics
 */
exports.getStats = catchAsync(async (req, res) => {
    const stats = apiAggregator.getStats();

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

    // Validate required fields
    if (!supplierConfig.id || !supplierConfig.name) {
        return res.status(400).json({
            success: false,
            error: 'Supplier ID and name are required'
        });
    }

    try {
        const supplier = apiAggregator.registerSupplier(supplierConfig);

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
 * Update supplier configuration
 */
exports.updateSupplier = catchAsync(async (req, res) => {
    const { supplierId } = req.params;
    const updates = req.body;

    const registry = apiAggregator.supplierRegistry;
    const updated = registry.update(supplierId, updates);

    if (!updated) {
        return res.status(404).json({
            success: false,
            error: `Supplier ${supplierId} not found`
        });
    }

    res.json({
        success: true,
        message: `Supplier ${supplierId} updated`,
        data: {
            id: updated.id,
            name: updated.name,
            active: updated.active
        }
    });
});

/**
 * Remove a supplier
 */
exports.removeSupplier = catchAsync(async (req, res) => {
    const { supplierId } = req.params;

    const registry = apiAggregator.supplierRegistry;
    const removed = registry.remove(supplierId);

    if (!removed) {
        return res.status(404).json({
            success: false,
            error: `Supplier ${supplierId} not found`
        });
    }

    res.json({
        success: true,
        message: `Supplier ${supplierId} removed`
    });
});

/**
 * Clear aggregator cache
 */
exports.clearCache = catchAsync(async (req, res) => {
    const { pattern } = req.body;

    if (pattern) {
        const count = apiAggregator.cacheManager.invalidateByPattern(pattern);
        res.json({
            success: true,
            message: `Cleared ${count} cache entries matching pattern: ${pattern}`
        });
    } else {
        apiAggregator.cacheManager.clear();
        res.json({
            success: true,
            message: 'All cache cleared'
        });
    }
});
