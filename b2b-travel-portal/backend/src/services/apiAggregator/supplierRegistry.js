/**
 * Supplier Registry
 * Manages registration and discovery of API suppliers
 * Supports 100+ suppliers with different formats
 */

const adapters = require('./adapters');

class SupplierRegistry {
    constructor() {
        this.suppliers = new Map();
        this.suppliersByType = new Map();

        // Initialize with default suppliers
        this.initializeDefaultSuppliers();
    }

    /**
     * Initialize default/common suppliers
     */
    initializeDefaultSuppliers() {
        // These are example supplier configurations
        // In production, load from database or config file

        const defaultSuppliers = [
            // GDS Providers
            {
                id: 'amadeus',
                name: 'Amadeus GDS',
                type: 'gds',
                priority: 1,
                active: true,
                timeout: 25000,
                responseFormat: 'amadeus',
                apiVersion: 'v2',
                endpoints: {
                    search: '/v2/shopping/flight-offers',
                    price: '/v1/shopping/flight-offers/pricing',
                    book: '/v1/booking/flight-orders'
                },
                rateLimit: { requests: 100, window: 60 },
                supportedRoutes: ['international', 'domestic'],
                features: ['realtime', 'ancillaries', 'seats']
            },
            {
                id: 'sabre',
                name: 'Sabre GDS',
                type: 'gds',
                priority: 2,
                active: true,
                timeout: 25000,
                responseFormat: 'sabre',
                apiVersion: 'v4',
                endpoints: {
                    search: '/v4/shop/flights',
                    price: '/v4/book/flights/price',
                    book: '/v4/book/flights'
                },
                rateLimit: { requests: 80, window: 60 },
                supportedRoutes: ['international', 'domestic'],
                features: ['realtime', 'ancillaries']
            },
            {
                id: 'travelport',
                name: 'Travelport Galileo',
                type: 'gds',
                priority: 3,
                active: true,
                timeout: 25000,
                responseFormat: 'travelport',
                apiVersion: 'v1',
                endpoints: {
                    search: '/air/shop',
                    price: '/air/price',
                    book: '/air/book'
                },
                rateLimit: { requests: 60, window: 60 },
                supportedRoutes: ['international'],
                features: ['realtime']
            },

            // Aggregators
            {
                id: 'skyscanner',
                name: 'Skyscanner',
                type: 'aggregator',
                priority: 5,
                active: true,
                timeout: 20000,
                responseFormat: 'skyscanner',
                apiVersion: 'v3',
                endpoints: {
                    search: '/apiservices/browsequotes/v1.0',
                    live: '/apiservices/pricing/v1.0'
                },
                rateLimit: { requests: 50, window: 60 },
                supportedRoutes: ['international', 'domestic'],
                features: ['cached', 'compare']
            },
            {
                id: 'kiwi',
                name: 'Kiwi.com',
                type: 'aggregator',
                priority: 6,
                active: true,
                timeout: 20000,
                responseFormat: 'kiwi',
                apiVersion: 'v2',
                endpoints: {
                    search: '/v2/search'
                },
                rateLimit: { requests: 100, window: 60 },
                supportedRoutes: ['international', 'domestic'],
                features: ['virtual-interlining', 'multi-city']
            },

            // Low Cost Carrier APIs
            {
                id: 'indigo',
                name: 'IndiGo Airlines',
                type: 'lcc',
                priority: 10,
                active: true,
                timeout: 15000,
                responseFormat: 'indigo',
                apiVersion: 'v1',
                endpoints: {
                    search: '/api/flights/search',
                    price: '/api/flights/fare',
                    book: '/api/booking/create'
                },
                rateLimit: { requests: 200, window: 60 },
                supportedRoutes: ['domestic', 'international'],
                features: ['realtime', 'ancillaries', 'meals'],
                carrierCode: '6E'
            },
            {
                id: 'spicejet',
                name: 'SpiceJet',
                type: 'lcc',
                priority: 11,
                active: true,
                timeout: 15000,
                responseFormat: 'spicejet',
                apiVersion: 'v1',
                endpoints: {
                    search: '/booking/search',
                    book: '/booking/create'
                },
                rateLimit: { requests: 150, window: 60 },
                supportedRoutes: ['domestic', 'international'],
                features: ['realtime'],
                carrierCode: 'SG'
            },
            {
                id: 'airasia',
                name: 'AirAsia',
                type: 'lcc',
                priority: 12,
                active: true,
                timeout: 15000,
                responseFormat: 'airasia',
                apiVersion: 'v2',
                endpoints: {
                    search: '/v2/flights/search'
                },
                rateLimit: { requests: 100, window: 60 },
                supportedRoutes: ['domestic', 'international'],
                features: ['realtime', 'bundle'],
                carrierCode: 'I5'
            },
            {
                id: 'goair',
                name: 'Go First',
                type: 'lcc',
                priority: 13,
                active: true,
                timeout: 15000,
                responseFormat: 'goair',
                apiVersion: 'v1',
                endpoints: {
                    search: '/api/search'
                },
                rateLimit: { requests: 100, window: 60 },
                supportedRoutes: ['domestic'],
                features: ['realtime'],
                carrierCode: 'G8'
            },

            // Full Service Carriers
            {
                id: 'airindia',
                name: 'Air India',
                type: 'fsc',
                priority: 20,
                active: true,
                timeout: 20000,
                responseFormat: 'airindia',
                apiVersion: 'v1',
                endpoints: {
                    search: '/api/flights/availability'
                },
                rateLimit: { requests: 80, window: 60 },
                supportedRoutes: ['domestic', 'international'],
                features: ['realtime', 'star-alliance'],
                carrierCode: 'AI'
            },
            {
                id: 'vistara',
                name: 'Vistara',
                type: 'fsc',
                priority: 21,
                active: true,
                timeout: 20000,
                responseFormat: 'vistara',
                apiVersion: 'v1',
                endpoints: {
                    search: '/flights/search'
                },
                rateLimit: { requests: 100, window: 60 },
                supportedRoutes: ['domestic', 'international'],
                features: ['realtime', 'premium'],
                carrierCode: 'UK'
            },

            // International Carriers
            {
                id: 'emirates',
                name: 'Emirates',
                type: 'fsc',
                priority: 30,
                active: true,
                timeout: 25000,
                responseFormat: 'emirates',
                apiVersion: 'v1',
                endpoints: {
                    search: '/api/flights/search'
                },
                rateLimit: { requests: 50, window: 60 },
                supportedRoutes: ['international'],
                features: ['realtime', 'premium', 'lounges'],
                carrierCode: 'EK'
            },
            {
                id: 'singapore',
                name: 'Singapore Airlines',
                type: 'fsc',
                priority: 31,
                active: true,
                timeout: 25000,
                responseFormat: 'singapore-airlines',
                apiVersion: 'v2',
                endpoints: {
                    search: '/v2/flights'
                },
                rateLimit: { requests: 50, window: 60 },
                supportedRoutes: ['international'],
                features: ['realtime', 'star-alliance'],
                carrierCode: 'SQ'
            },
            {
                id: 'qatar',
                name: 'Qatar Airways',
                type: 'fsc',
                priority: 32,
                active: true,
                timeout: 25000,
                responseFormat: 'qatar',
                apiVersion: 'v1',
                endpoints: {
                    search: '/api/availability'
                },
                rateLimit: { requests: 50, window: 60 },
                supportedRoutes: ['international'],
                features: ['realtime', 'oneworld'],
                carrierCode: 'QR'
            },
            {
                id: 'etihad',
                name: 'Etihad Airways',
                type: 'fsc',
                priority: 33,
                active: true,
                timeout: 25000,
                responseFormat: 'etihad',
                apiVersion: 'v1',
                endpoints: {
                    search: '/flights/search'
                },
                rateLimit: { requests: 50, window: 60 },
                supportedRoutes: ['international'],
                features: ['realtime'],
                carrierCode: 'EY'
            },

            // Consolidators
            {
                id: 'tripjack',
                name: 'TripJack',
                type: 'consolidator',
                priority: 40,
                active: true,
                timeout: 20000,
                responseFormat: 'tripjack',
                apiVersion: 'v1',
                endpoints: {
                    search: '/fms/v1/air-search-all',
                    price: '/fms/v1/review',
                    book: '/fms/v1/book'
                },
                rateLimit: { requests: 200, window: 60 },
                supportedRoutes: ['domestic', 'international'],
                features: ['multi-gds', 'lcc', 'realtime']
            },
            {
                id: 'tbo',
                name: 'TBO Holidays',
                type: 'consolidator',
                priority: 41,
                active: true,
                timeout: 20000,
                responseFormat: 'tbo',
                apiVersion: 'v1',
                endpoints: {
                    search: '/SharedServices/Air/Search',
                    price: '/SharedServices/Air/FareQuote',
                    book: '/SharedServices/Air/Book'
                },
                rateLimit: { requests: 150, window: 60 },
                supportedRoutes: ['domestic', 'international'],
                features: ['multi-gds', 'lcc']
            },
            {
                id: 'riya',
                name: 'Riya Travel',
                type: 'consolidator',
                priority: 42,
                active: true,
                timeout: 20000,
                responseFormat: 'riya',
                apiVersion: 'v2',
                endpoints: {
                    search: '/api/v2/flights/search'
                },
                rateLimit: { requests: 100, window: 60 },
                supportedRoutes: ['domestic', 'international'],
                features: ['consolidator-fares']
            },

            // Meta Search
            {
                id: 'google-flights',
                name: 'Google Flights',
                type: 'meta',
                priority: 50,
                active: true,
                timeout: 15000,
                responseFormat: 'google-qpx',
                apiVersion: 'v1',
                endpoints: {
                    search: '/qpxExpress/v1/trips/search'
                },
                rateLimit: { requests: 50, window: 60 },
                supportedRoutes: ['international', 'domestic'],
                features: ['compare', 'price-graph']
            }
        ];

        // Register all default suppliers
        defaultSuppliers.forEach(supplier => {
            this.register(supplier);
        });

        console.log(`[Registry] Initialized ${this.suppliers.size} suppliers`);
    }

    /**
     * Register a new supplier
     */
    register(config) {
        // Validate required fields
        if (!config.id || !config.name) {
            throw new Error('Supplier must have id and name');
        }

        // Create adapter based on response format
        const adapter = adapters.createAdapter(config);

        const supplier = {
            ...config,
            adapter,
            registeredAt: new Date().toISOString(),
            stats: {
                totalCalls: 0,
                successfulCalls: 0,
                averageResponseTime: 0
            }
        };

        this.suppliers.set(config.id, supplier);

        // Index by type
        const type = config.type || 'other';
        if (!this.suppliersByType.has(type)) {
            this.suppliersByType.set(type, []);
        }
        this.suppliersByType.get(type).push(config.id);

        console.log(`[Registry] Registered supplier: ${config.name} (${config.id})`);
        return supplier;
    }

    /**
     * Get a supplier by ID
     */
    get(id) {
        return this.suppliers.get(id);
    }

    /**
     * Get all suppliers
     */
    getAll() {
        return Array.from(this.suppliers.values());
    }

    /**
     * Get active suppliers for a search
     */
    getActiveSuppliers(searchType, params) {
        const activeSuppliers = [];

        for (const [id, supplier] of this.suppliers) {
            if (!supplier.active) continue;

            // Check if supplier supports this route type
            const routeType = this.determineRouteType(params);
            if (supplier.supportedRoutes && !supplier.supportedRoutes.includes(routeType)) {
                continue;
            }

            // Check if supplier supports the search type
            if (supplier.supportedSearchTypes && !supplier.supportedSearchTypes.includes(searchType)) {
                continue;
            }

            activeSuppliers.push(supplier);
        }

        // Sort by priority (lower = higher priority)
        activeSuppliers.sort((a, b) => (a.priority || 100) - (b.priority || 100));

        return activeSuppliers;
    }

    /**
     * Determine if route is domestic or international
     */
    determineRouteType(params) {
        const domesticCountries = ['IN'];
        const origin = params.origin?.substring(0, 2).toUpperCase();
        const destination = params.destination?.substring(0, 2).toUpperCase();

        // Simple check - in production, use airport database
        if (domesticCountries.includes(origin) && domesticCountries.includes(destination)) {
            return 'domestic';
        }
        return 'international';
    }

    /**
     * Get suppliers by type
     */
    getByType(type) {
        const ids = this.suppliersByType.get(type) || [];
        return ids.map(id => this.suppliers.get(id)).filter(Boolean);
    }

    /**
     * Activate/Deactivate supplier
     */
    setActive(id, active) {
        const supplier = this.suppliers.get(id);
        if (supplier) {
            supplier.active = active;
            console.log(`[Registry] Supplier ${id} ${active ? 'activated' : 'deactivated'}`);
            return true;
        }
        return false;
    }

    /**
     * Update supplier configuration
     */
    update(id, updates) {
        const supplier = this.suppliers.get(id);
        if (supplier) {
            Object.assign(supplier, updates);
            console.log(`[Registry] Supplier ${id} updated`);
            return supplier;
        }
        return null;
    }

    /**
     * Remove a supplier
     */
    remove(id) {
        const supplier = this.suppliers.get(id);
        if (supplier) {
            this.suppliers.delete(id);

            // Remove from type index
            for (const [type, ids] of this.suppliersByType) {
                const index = ids.indexOf(id);
                if (index > -1) {
                    ids.splice(index, 1);
                }
            }

            console.log(`[Registry] Supplier ${id} removed`);
            return true;
        }
        return false;
    }

    /**
     * Get registry statistics
     */
    getStats() {
        const stats = {
            totalSuppliers: this.suppliers.size,
            activeSuppliers: 0,
            byType: {},
            suppliers: []
        };

        for (const [id, supplier] of this.suppliers) {
            if (supplier.active) stats.activeSuppliers++;

            const type = supplier.type || 'other';
            stats.byType[type] = (stats.byType[type] || 0) + 1;

            stats.suppliers.push({
                id: supplier.id,
                name: supplier.name,
                type: supplier.type,
                active: supplier.active,
                priority: supplier.priority
            });
        }

        return stats;
    }
}

module.exports = SupplierRegistry;
