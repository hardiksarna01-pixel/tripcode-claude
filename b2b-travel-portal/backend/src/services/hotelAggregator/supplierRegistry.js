/**
 * Hotel Supplier Registry
 * Manages 50+ hotel API suppliers
 */

const defaultSuppliers = [
    // OTAs (Online Travel Agencies)
    {
        id: 'booking_com',
        name: 'Booking.com',
        type: 'ota',
        priority: 1,
        responseFormat: 'booking',
        timeout: 5000,
        rateLimit: { requests: 100, window: 60 },
        active: true,
        features: ['instant_confirmation', 'free_cancellation', 'pay_at_hotel'],
        coverage: ['global']
    },
    {
        id: 'expedia',
        name: 'Expedia',
        type: 'ota',
        priority: 2,
        responseFormat: 'expedia',
        timeout: 5000,
        rateLimit: { requests: 80, window: 60 },
        active: true,
        features: ['bundle_deals', 'loyalty_points'],
        coverage: ['global']
    },
    {
        id: 'agoda',
        name: 'Agoda',
        type: 'ota',
        priority: 3,
        responseFormat: 'agoda',
        timeout: 4000,
        rateLimit: { requests: 100, window: 60 },
        active: true,
        features: ['asia_specialist', 'secret_deals'],
        coverage: ['asia', 'global']
    },
    {
        id: 'makemytrip',
        name: 'MakeMyTrip',
        type: 'ota',
        priority: 5,
        responseFormat: 'mmt',
        timeout: 4000,
        rateLimit: { requests: 60, window: 60 },
        active: true,
        features: ['india_specialist'],
        coverage: ['india', 'international']
    },
    {
        id: 'goibibo',
        name: 'Goibibo',
        type: 'ota',
        priority: 6,
        responseFormat: 'goibibo',
        timeout: 4000,
        rateLimit: { requests: 60, window: 60 },
        active: true,
        features: ['gocash', 'india_specialist'],
        coverage: ['india']
    },
    {
        id: 'cleartrip',
        name: 'Cleartrip',
        type: 'ota',
        priority: 7,
        responseFormat: 'cleartrip',
        timeout: 4000,
        active: true,
        coverage: ['india', 'middle_east']
    },
    {
        id: 'yatra',
        name: 'Yatra',
        type: 'ota',
        priority: 8,
        responseFormat: 'yatra',
        timeout: 4000,
        active: true,
        coverage: ['india']
    },
    {
        id: 'trip_com',
        name: 'Trip.com',
        type: 'ota',
        priority: 4,
        responseFormat: 'trip',
        timeout: 5000,
        active: true,
        features: ['china_specialist'],
        coverage: ['asia', 'global']
    },

    // GDS (Global Distribution Systems)
    {
        id: 'amadeus_hotels',
        name: 'Amadeus Hotel',
        type: 'gds',
        priority: 10,
        responseFormat: 'amadeus',
        timeout: 6000,
        rateLimit: { requests: 50, window: 60 },
        active: true,
        features: ['gds_rates', 'corporate_rates'],
        coverage: ['global']
    },
    {
        id: 'sabre_hotels',
        name: 'Sabre Hospitality',
        type: 'gds',
        priority: 11,
        responseFormat: 'sabre',
        timeout: 6000,
        active: true,
        coverage: ['global']
    },
    {
        id: 'travelport_hotels',
        name: 'Travelport Hotels',
        type: 'gds',
        priority: 12,
        responseFormat: 'travelport',
        timeout: 6000,
        active: true,
        coverage: ['global']
    },

    // Wholesalers / Bedbanks
    {
        id: 'hotelbeds',
        name: 'Hotelbeds',
        type: 'wholesaler',
        priority: 15,
        responseFormat: 'hotelbeds',
        timeout: 5000,
        rateLimit: { requests: 100, window: 60 },
        active: true,
        features: ['b2b_rates', 'exclusive_inventory'],
        coverage: ['global']
    },
    {
        id: 'webbeds',
        name: 'WebBeds (Destinations of the World)',
        type: 'wholesaler',
        priority: 16,
        responseFormat: 'webbeds',
        timeout: 5000,
        active: true,
        coverage: ['global']
    },
    {
        id: 'juniper',
        name: 'Juniper',
        type: 'wholesaler',
        priority: 17,
        responseFormat: 'juniper',
        timeout: 5000,
        active: true,
        coverage: ['europe', 'global']
    },
    {
        id: 'restel',
        name: 'Restel',
        type: 'wholesaler',
        priority: 18,
        responseFormat: 'restel',
        timeout: 5000,
        active: true,
        coverage: ['spain', 'europe']
    },
    {
        id: 'gta',
        name: 'GTA (Gullivers Travel Associates)',
        type: 'wholesaler',
        priority: 19,
        responseFormat: 'gta',
        timeout: 5000,
        active: true,
        coverage: ['global']
    },
    {
        id: 'miki_travel',
        name: 'Miki Travel',
        type: 'wholesaler',
        priority: 20,
        responseFormat: 'miki',
        timeout: 5000,
        active: true,
        coverage: ['japan', 'asia']
    },
    {
        id: 'tourico',
        name: 'Tourico Holidays',
        type: 'wholesaler',
        priority: 21,
        responseFormat: 'tourico',
        timeout: 5000,
        active: true,
        coverage: ['global']
    },
    {
        id: 'tbo_holidays',
        name: 'TBO Holidays',
        type: 'wholesaler',
        priority: 22,
        responseFormat: 'tbo',
        timeout: 4000,
        active: true,
        features: ['india_b2b'],
        coverage: ['india', 'global']
    },
    {
        id: 'rategain',
        name: 'RateGain',
        type: 'wholesaler',
        priority: 23,
        responseFormat: 'rategain',
        timeout: 5000,
        active: true,
        coverage: ['global']
    },

    // Hotel Chains Direct
    {
        id: 'marriott',
        name: 'Marriott International',
        type: 'chain',
        priority: 30,
        responseFormat: 'marriott',
        timeout: 4000,
        active: true,
        features: ['bonvoy_points', 'best_rate_guarantee'],
        brands: ['Marriott', 'Sheraton', 'Westin', 'W Hotels', 'Ritz-Carlton', 'JW Marriott', 'Courtyard', 'Fairfield'],
        coverage: ['global']
    },
    {
        id: 'hilton',
        name: 'Hilton Worldwide',
        type: 'chain',
        priority: 31,
        responseFormat: 'hilton',
        timeout: 4000,
        active: true,
        features: ['honors_points', 'digital_key'],
        brands: ['Hilton', 'Conrad', 'DoubleTree', 'Hampton', 'Embassy Suites', 'Waldorf Astoria'],
        coverage: ['global']
    },
    {
        id: 'ihg',
        name: 'IHG Hotels & Resorts',
        type: 'chain',
        priority: 32,
        responseFormat: 'ihg',
        timeout: 4000,
        active: true,
        features: ['rewards_points'],
        brands: ['InterContinental', 'Holiday Inn', 'Crowne Plaza', 'Kimpton', 'Indigo'],
        coverage: ['global']
    },
    {
        id: 'accor',
        name: 'Accor Hotels',
        type: 'chain',
        priority: 33,
        responseFormat: 'accor',
        timeout: 4000,
        active: true,
        brands: ['Sofitel', 'Novotel', 'Mercure', 'ibis', 'Pullman', 'Fairmont'],
        coverage: ['global']
    },
    {
        id: 'wyndham',
        name: 'Wyndham Hotels',
        type: 'chain',
        priority: 34,
        responseFormat: 'wyndham',
        timeout: 4000,
        active: true,
        brands: ['Wyndham', 'Ramada', 'Days Inn', 'Super 8', 'La Quinta'],
        coverage: ['global']
    },
    {
        id: 'hyatt',
        name: 'Hyatt Hotels',
        type: 'chain',
        priority: 35,
        responseFormat: 'hyatt',
        timeout: 4000,
        active: true,
        brands: ['Hyatt', 'Grand Hyatt', 'Park Hyatt', 'Andaz', 'Hyatt Regency'],
        coverage: ['global']
    },
    {
        id: 'radisson',
        name: 'Radisson Hotel Group',
        type: 'chain',
        priority: 36,
        responseFormat: 'radisson',
        timeout: 4000,
        active: true,
        brands: ['Radisson', 'Radisson Blu', 'Park Inn', 'Park Plaza'],
        coverage: ['global']
    },

    // Budget Chains
    {
        id: 'oyo',
        name: 'OYO Rooms',
        type: 'budget',
        priority: 40,
        responseFormat: 'oyo',
        timeout: 3000,
        rateLimit: { requests: 100, window: 60 },
        active: true,
        features: ['budget_friendly', 'standardized'],
        coverage: ['india', 'southeast_asia', 'global']
    },
    {
        id: 'treebo',
        name: 'Treebo Hotels',
        type: 'budget',
        priority: 41,
        responseFormat: 'treebo',
        timeout: 3000,
        active: true,
        coverage: ['india']
    },
    {
        id: 'fabhotels',
        name: 'FabHotels',
        type: 'budget',
        priority: 42,
        responseFormat: 'fabhotels',
        timeout: 3000,
        active: true,
        coverage: ['india']
    },
    {
        id: 'zostel',
        name: 'Zostel',
        type: 'hostel',
        priority: 43,
        responseFormat: 'zostel',
        timeout: 3000,
        active: true,
        features: ['backpacker', 'social'],
        coverage: ['india']
    },

    // Vacation Rentals
    {
        id: 'airbnb',
        name: 'Airbnb',
        type: 'vacation_rental',
        priority: 50,
        responseFormat: 'airbnb',
        timeout: 5000,
        active: true,
        features: ['unique_stays', 'experiences'],
        coverage: ['global']
    },
    {
        id: 'vrbo',
        name: 'VRBO',
        type: 'vacation_rental',
        priority: 51,
        responseFormat: 'vrbo',
        timeout: 5000,
        active: true,
        features: ['vacation_homes', 'families'],
        coverage: ['global']
    },

    // Regional Specialists
    {
        id: 'hrs',
        name: 'HRS',
        type: 'regional',
        priority: 55,
        responseFormat: 'hrs',
        timeout: 4000,
        active: true,
        features: ['corporate_travel', 'europe_specialist'],
        coverage: ['europe', 'germany']
    },
    {
        id: 'jalan',
        name: 'Jalan',
        type: 'regional',
        priority: 56,
        responseFormat: 'jalan',
        timeout: 4000,
        active: true,
        coverage: ['japan']
    },
    {
        id: 'ctrip',
        name: 'Ctrip',
        type: 'regional',
        priority: 57,
        responseFormat: 'ctrip',
        timeout: 5000,
        active: true,
        coverage: ['china', 'asia']
    },

    // Luxury Specialists
    {
        id: 'small_luxury',
        name: 'Small Luxury Hotels',
        type: 'luxury',
        priority: 60,
        responseFormat: 'slh',
        timeout: 5000,
        active: true,
        features: ['boutique', 'luxury'],
        coverage: ['global']
    },
    {
        id: 'leading_hotels',
        name: 'Leading Hotels of the World',
        type: 'luxury',
        priority: 61,
        responseFormat: 'lhw',
        timeout: 5000,
        active: true,
        coverage: ['global']
    },
    {
        id: 'relais_chateaux',
        name: 'Relais & Châteaux',
        type: 'luxury',
        priority: 62,
        responseFormat: 'relais',
        timeout: 5000,
        active: true,
        features: ['gastronomy', 'luxury'],
        coverage: ['global']
    },

    // Meta Search Sources
    {
        id: 'trivago',
        name: 'Trivago',
        type: 'meta',
        priority: 70,
        responseFormat: 'trivago',
        timeout: 4000,
        active: true,
        features: ['price_comparison'],
        coverage: ['global']
    },
    {
        id: 'kayak_hotels',
        name: 'Kayak Hotels',
        type: 'meta',
        priority: 71,
        responseFormat: 'kayak',
        timeout: 4000,
        active: true,
        coverage: ['global']
    },
    {
        id: 'google_hotels',
        name: 'Google Hotels',
        type: 'meta',
        priority: 72,
        responseFormat: 'google',
        timeout: 3000,
        active: true,
        coverage: ['global']
    },
    {
        id: 'skyscanner_hotels',
        name: 'Skyscanner Hotels',
        type: 'meta',
        priority: 73,
        responseFormat: 'skyscanner',
        timeout: 4000,
        active: true,
        coverage: ['global']
    },
    {
        id: 'hotelscombined',
        name: 'HotelsCombined',
        type: 'meta',
        priority: 74,
        responseFormat: 'hotelscombined',
        timeout: 4000,
        active: true,
        coverage: ['global']
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
        console.log(`[HotelSupplierRegistry] Loaded ${this.suppliers.size} suppliers`);
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

    getForSearch(searchParams) {
        let suppliers = this.getActive();

        // Filter by coverage/region if specified
        if (searchParams.region) {
            suppliers = suppliers.filter(s =>
                s.coverage?.includes(searchParams.region) ||
                s.coverage?.includes('global')
            );
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
            timeout: config.timeout || 5000,
            stats: { searches: 0, successes: 0, failures: 0, avgResponseTime: 0 }
        };

        this.suppliers.set(config.id, supplier);
        console.log(`[HotelSupplierRegistry] Registered: ${config.name}`);
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
