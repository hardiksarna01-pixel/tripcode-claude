/**
 * Bus Supplier Registry
 * Manages 40+ bus operators and aggregators
 */

const defaultSuppliers = [
    // Major Aggregators
    {
        id: 'redbus',
        name: 'RedBus',
        type: 'aggregator',
        priority: 1,
        responseFormat: 'redbus',
        timeout: 4000,
        rateLimit: { requests: 100, window: 60 },
        active: true,
        features: ['real_time_tracking', 'instant_booking', 'seat_selection'],
        coverage: ['india', 'southeast_asia', 'latam']
    },
    {
        id: 'abhibus',
        name: 'AbhiBus',
        type: 'aggregator',
        priority: 2,
        responseFormat: 'abhibus',
        timeout: 4000,
        rateLimit: { requests: 80, window: 60 },
        active: true,
        features: ['women_seats', 'gps_tracking'],
        coverage: ['india']
    },
    {
        id: 'paytm_bus',
        name: 'Paytm Bus',
        type: 'aggregator',
        priority: 3,
        responseFormat: 'paytm',
        timeout: 4000,
        active: true,
        features: ['cashback', 'wallet_payment'],
        coverage: ['india']
    },
    {
        id: 'makemytrip_bus',
        name: 'MakeMyTrip Bus',
        type: 'aggregator',
        priority: 4,
        responseFormat: 'mmt',
        timeout: 4000,
        active: true,
        coverage: ['india']
    },
    {
        id: 'goibibo_bus',
        name: 'Goibibo Bus',
        type: 'aggregator',
        priority: 5,
        responseFormat: 'goibibo',
        timeout: 4000,
        active: true,
        features: ['gocash'],
        coverage: ['india']
    },
    {
        id: 'cleartrip_bus',
        name: 'Cleartrip Bus',
        type: 'aggregator',
        priority: 6,
        responseFormat: 'cleartrip',
        timeout: 4000,
        active: true,
        coverage: ['india']
    },
    {
        id: 'yatra_bus',
        name: 'Yatra Bus',
        type: 'aggregator',
        priority: 7,
        responseFormat: 'yatra',
        timeout: 4000,
        active: true,
        coverage: ['india']
    },
    {
        id: 'ixigo_bus',
        name: 'Ixigo Bus',
        type: 'aggregator',
        priority: 8,
        responseFormat: 'ixigo',
        timeout: 4000,
        active: true,
        features: ['price_alerts'],
        coverage: ['india']
    },
    {
        id: 'confirmtkt',
        name: 'ConfirmTkt',
        type: 'aggregator',
        priority: 9,
        responseFormat: 'confirmtkt',
        timeout: 4000,
        active: true,
        coverage: ['india']
    },
    {
        id: 'travelyaari',
        name: 'Travelyaari',
        type: 'aggregator',
        priority: 10,
        responseFormat: 'travelyaari',
        timeout: 4000,
        active: true,
        coverage: ['india']
    },

    // State Transport Corporations
    {
        id: 'ksrtc_karnataka',
        name: 'KSRTC Karnataka',
        type: 'state_transport',
        priority: 15,
        responseFormat: 'ksrtc',
        timeout: 5000,
        active: true,
        features: ['govt_operator', 'reliable'],
        coverage: ['karnataka']
    },
    {
        id: 'ksrtc_kerala',
        name: 'KSRTC Kerala',
        type: 'state_transport',
        priority: 16,
        responseFormat: 'ksrtc_kerala',
        timeout: 5000,
        active: true,
        coverage: ['kerala']
    },
    {
        id: 'apsrtc',
        name: 'APSRTC',
        type: 'state_transport',
        priority: 17,
        responseFormat: 'apsrtc',
        timeout: 5000,
        active: true,
        coverage: ['andhra_pradesh']
    },
    {
        id: 'tsrtc',
        name: 'TSRTC',
        type: 'state_transport',
        priority: 18,
        responseFormat: 'tsrtc',
        timeout: 5000,
        active: true,
        coverage: ['telangana']
    },
    {
        id: 'msrtc',
        name: 'MSRTC',
        type: 'state_transport',
        priority: 19,
        responseFormat: 'msrtc',
        timeout: 5000,
        active: true,
        coverage: ['maharashtra']
    },
    {
        id: 'gsrtc',
        name: 'GSRTC',
        type: 'state_transport',
        priority: 20,
        responseFormat: 'gsrtc',
        timeout: 5000,
        active: true,
        coverage: ['gujarat']
    },
    {
        id: 'upsrtc',
        name: 'UPSRTC',
        type: 'state_transport',
        priority: 21,
        responseFormat: 'upsrtc',
        timeout: 5000,
        active: true,
        coverage: ['uttar_pradesh']
    },
    {
        id: 'rsrtc',
        name: 'RSRTC',
        type: 'state_transport',
        priority: 22,
        responseFormat: 'rsrtc',
        timeout: 5000,
        active: true,
        coverage: ['rajasthan']
    },
    {
        id: 'tnstc',
        name: 'TNSTC / SETC',
        type: 'state_transport',
        priority: 23,
        responseFormat: 'tnstc',
        timeout: 5000,
        active: true,
        coverage: ['tamil_nadu']
    },
    {
        id: 'hrtc',
        name: 'HRTC',
        type: 'state_transport',
        priority: 24,
        responseFormat: 'hrtc',
        timeout: 5000,
        active: true,
        coverage: ['himachal_pradesh']
    },
    {
        id: 'pepsu',
        name: 'PEPSU / Punjab Roadways',
        type: 'state_transport',
        priority: 25,
        responseFormat: 'pepsu',
        timeout: 5000,
        active: true,
        coverage: ['punjab']
    },

    // Private Operators
    {
        id: 'vrl_travels',
        name: 'VRL Travels',
        type: 'private',
        priority: 30,
        responseFormat: 'vrl',
        timeout: 4000,
        active: true,
        features: ['sleeper', 'ac', 'volvo'],
        coverage: ['karnataka', 'maharashtra', 'goa']
    },
    {
        id: 'srs_travels',
        name: 'SRS Travels',
        type: 'private',
        priority: 31,
        responseFormat: 'srs',
        timeout: 4000,
        active: true,
        features: ['sleeper', 'multi_axle'],
        coverage: ['karnataka', 'maharashtra', 'tamil_nadu']
    },
    {
        id: 'orange_tours',
        name: 'Orange Tours & Travels',
        type: 'private',
        priority: 32,
        responseFormat: 'orange',
        timeout: 4000,
        active: true,
        coverage: ['andhra_pradesh', 'telangana']
    },
    {
        id: 'kallada',
        name: 'Kallada Travels',
        type: 'private',
        priority: 33,
        responseFormat: 'kallada',
        timeout: 4000,
        active: true,
        coverage: ['kerala', 'karnataka', 'tamil_nadu']
    },
    {
        id: 'sea_bird',
        name: 'Sea Bird Tourist',
        type: 'private',
        priority: 34,
        responseFormat: 'seabird',
        timeout: 4000,
        active: true,
        coverage: ['maharashtra', 'karnataka', 'goa']
    },
    {
        id: 'neeta_travels',
        name: 'Neeta Travels',
        type: 'private',
        priority: 35,
        responseFormat: 'neeta',
        timeout: 4000,
        active: true,
        features: ['luxury', 'volvo'],
        coverage: ['maharashtra', 'gujarat']
    },
    {
        id: 'purple_bus',
        name: 'Purple Bus',
        type: 'private',
        priority: 36,
        responseFormat: 'purple',
        timeout: 4000,
        active: true,
        coverage: ['maharashtra', 'karnataka']
    },
    {
        id: 'shrinath',
        name: 'Shrinath Travel Agency',
        type: 'private',
        priority: 37,
        responseFormat: 'shrinath',
        timeout: 4000,
        active: true,
        coverage: ['rajasthan', 'gujarat', 'maharashtra']
    },
    {
        id: 'hans_travels',
        name: 'Hans Travels',
        type: 'private',
        priority: 38,
        responseFormat: 'hans',
        timeout: 4000,
        active: true,
        coverage: ['delhi', 'punjab', 'himachal']
    },
    {
        id: 'zingbus',
        name: 'Zingbus',
        type: 'private',
        priority: 39,
        responseFormat: 'zingbus',
        timeout: 3000,
        active: true,
        features: ['tech_enabled', 'gps'],
        coverage: ['north_india']
    },
    {
        id: 'intrcity',
        name: 'IntrCity SmartBus',
        type: 'private',
        priority: 40,
        responseFormat: 'intrcity',
        timeout: 3000,
        active: true,
        features: ['smart_bus', 'entertainment'],
        coverage: ['north_india']
    },

    // Luxury Operators
    {
        id: 'volvo_bus',
        name: 'Volvo Bus',
        type: 'luxury',
        priority: 45,
        responseFormat: 'volvo',
        timeout: 4000,
        active: true,
        features: ['ac', 'sleeper', 'charging'],
        busTypes: ['multi_axle', 'b9r', 'b11r']
    },
    {
        id: 'scania',
        name: 'Scania Metrolink',
        type: 'luxury',
        priority: 46,
        responseFormat: 'scania',
        timeout: 4000,
        active: true,
        features: ['premium', 'recliner']
    },
    {
        id: 'mercedes_bus',
        name: 'Mercedes-Benz Bus',
        type: 'luxury',
        priority: 47,
        responseFormat: 'mercedes',
        timeout: 4000,
        active: true,
        features: ['luxury', 'premium']
    }
];

class SupplierRegistry {
    constructor() {
        this.suppliers = new Map();
        this.loadDefaults();
    }

    loadDefaults() {
        defaultSuppliers.forEach(supplier => {
            this.suppliers.set(supplier.id, {
                ...supplier,
                stats: {
                    searches: 0,
                    successes: 0,
                    failures: 0,
                    avgResponseTime: 0
                }
            });
        });
        console.log(`[BusSupplierRegistry] Loaded ${this.suppliers.size} suppliers`);
    }

    get(id) {
        return this.suppliers.get(id);
    }

    getAll() {
        return Array.from(this.suppliers.values());
    }

    getActive() {
        return this.getAll().filter(s => s.active);
    }

    getByType(type) {
        return this.getAll().filter(s => s.type === type && s.active);
    }

    getForRoute(searchParams) {
        let suppliers = this.getActive();

        // Filter by coverage if route specified
        if (searchParams.sourceState || searchParams.destState) {
            suppliers = suppliers.filter(s => {
                // Always include aggregators
                if (s.type === 'aggregator') return true;

                // Check state coverage
                const coverage = s.coverage || [];
                return coverage.includes(searchParams.sourceState?.toLowerCase()) ||
                       coverage.includes(searchParams.destState?.toLowerCase()) ||
                       coverage.includes('india');
            });
        }

        // Sort by priority
        suppliers.sort((a, b) => a.priority - b.priority);

        return suppliers;
    }

    register(config) {
        if (!config.id || !config.name) {
            throw new Error('Supplier id and name are required');
        }

        const supplier = {
            ...config,
            active: config.active !== false,
            priority: config.priority || 100,
            timeout: config.timeout || 4000,
            stats: { searches: 0, successes: 0, failures: 0, avgResponseTime: 0 }
        };

        this.suppliers.set(config.id, supplier);
        console.log(`[BusSupplierRegistry] Registered: ${config.name}`);
        return supplier;
    }

    update(id, updates) {
        const supplier = this.suppliers.get(id);
        if (!supplier) return null;

        Object.assign(supplier, updates);
        return supplier;
    }

    remove(id) {
        return this.suppliers.delete(id);
    }

    updateStats(id, responseTime, success) {
        const supplier = this.suppliers.get(id);
        if (!supplier) return;

        supplier.stats.searches++;
        if (success) {
            supplier.stats.successes++;
            const total = supplier.stats.successes;
            supplier.stats.avgResponseTime = Math.round(
                ((supplier.stats.avgResponseTime * (total - 1)) + responseTime) / total
            );
        } else {
            supplier.stats.failures++;
        }
    }
}

module.exports = SupplierRegistry;
