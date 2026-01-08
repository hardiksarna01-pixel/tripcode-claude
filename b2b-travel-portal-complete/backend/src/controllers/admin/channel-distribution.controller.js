/**
 * Channel Distribution Controller
 * Manages API suppliers, fare types, and product distribution between B2B and B2C
 */

const crypto = require('crypto');

// Supplier configurations
const suppliers = new Map();
const fareTypeConfigs = new Map();
const channelConfigs = new Map();
const performanceMetrics = new Map();

// Initialize default suppliers
const initializeSuppliers = () => {
    const defaultSuppliers = [
        {
            id: 'amadeus',
            name: 'Amadeus GDS',
            type: 'flights',
            status: 'active',
            fareTypes: ['published', 'net', 'corporate', 'special', 'consolidator'],
            b2bEnabled: true,
            b2cEnabled: true,
            b2cRestrictedFareTypes: ['net', 'consolidator', 'special'],
            priority: 1,
            avgResponseTime: 450,
            successRate: 99.2
        },
        {
            id: 'sabre',
            name: 'Sabre GDS',
            type: 'flights',
            status: 'active',
            fareTypes: ['published', 'net', 'private', 'web', 'corporate'],
            b2bEnabled: true,
            b2cEnabled: true,
            b2cRestrictedFareTypes: ['net', 'private'],
            priority: 2,
            avgResponseTime: 380,
            successRate: 98.8
        },
        {
            id: 'galileo',
            name: 'Galileo/Travelport',
            type: 'flights',
            status: 'active',
            fareTypes: ['published', 'net', 'negotiated', 'corporate'],
            b2bEnabled: true,
            b2cEnabled: false,
            b2cRestrictedFareTypes: ['net', 'negotiated'],
            priority: 3,
            avgResponseTime: 520,
            successRate: 97.5
        },
        {
            id: 'mystifly',
            name: 'Mystifly LCC',
            type: 'flights',
            status: 'active',
            fareTypes: ['instant', 'revalidation', 'special'],
            b2bEnabled: true,
            b2cEnabled: true,
            b2cRestrictedFareTypes: ['special'],
            priority: 4,
            avgResponseTime: 280,
            successRate: 96.5
        },
        {
            id: 'tripjack',
            name: 'TripJack',
            type: 'flights',
            status: 'active',
            fareTypes: ['sme', 'retail', 'corporate', 'deal'],
            b2bEnabled: true,
            b2cEnabled: true,
            b2cRestrictedFareTypes: ['sme', 'deal'],
            priority: 5,
            avgResponseTime: 320,
            successRate: 98.2
        },
        {
            id: 'hotelbeds',
            name: 'Hotelbeds',
            type: 'hotels',
            status: 'active',
            fareTypes: ['net', 'package', 'freenight', 'earlybird'],
            b2bEnabled: true,
            b2cEnabled: true,
            b2cRestrictedFareTypes: ['net'],
            priority: 1,
            avgResponseTime: 650,
            successRate: 97.8
        },
        {
            id: 'booking_com',
            name: 'Booking.com Connectivity',
            type: 'hotels',
            status: 'active',
            fareTypes: ['standard', 'genius', 'mobile', 'member'],
            b2bEnabled: false,
            b2cEnabled: true,
            b2cRestrictedFareTypes: [],
            priority: 2,
            avgResponseTime: 420,
            successRate: 99.5
        },
        {
            id: 'rategain',
            name: 'RateGain Hotels',
            type: 'hotels',
            status: 'active',
            fareTypes: ['contracted', 'dynamic', 'opaque', 'package'],
            b2bEnabled: true,
            b2cEnabled: true,
            b2cRestrictedFareTypes: ['contracted', 'opaque'],
            priority: 3,
            avgResponseTime: 580,
            successRate: 96.2
        },
        {
            id: 'redbus',
            name: 'RedBus API',
            type: 'buses',
            status: 'active',
            fareTypes: ['standard', 'primo', 'business'],
            b2bEnabled: true,
            b2cEnabled: true,
            b2cRestrictedFareTypes: [],
            priority: 1,
            avgResponseTime: 180,
            successRate: 99.1
        },
        {
            id: 'abhibus',
            name: 'AbhiBus API',
            type: 'buses',
            status: 'active',
            fareTypes: ['regular', 'flexi', 'corporate'],
            b2bEnabled: true,
            b2cEnabled: true,
            b2cRestrictedFareTypes: ['corporate'],
            priority: 2,
            avgResponseTime: 220,
            successRate: 98.4
        }
    ];

    defaultSuppliers.forEach(s => suppliers.set(s.id, s));

    // Initialize channel configs
    channelConfigs.set('b2b', {
        id: 'b2b',
        name: 'B2B Channel',
        description: 'For travel agents and partners',
        products: {
            flights: { enabled: true, suppliers: ['amadeus', 'sabre', 'galileo', 'mystifly', 'tripjack'] },
            hotels: { enabled: true, suppliers: ['hotelbeds', 'rategain'] },
            buses: { enabled: true, suppliers: ['redbus', 'abhibus'] },
            holidays: { enabled: true, suppliers: [] },
            visa: { enabled: true, suppliers: [] },
            insurance: { enabled: true, suppliers: [] }
        },
        markup: { type: 'percentage', value: 0 },
        caching: { enabled: false, ttl: 0 },
        rateLimit: { enabled: false, requestsPerMinute: 0 }
    });

    channelConfigs.set('b2c', {
        id: 'b2c',
        name: 'B2C Channel',
        description: 'For end customers',
        products: {
            flights: { enabled: true, suppliers: ['amadeus', 'sabre', 'mystifly', 'tripjack'] },
            hotels: { enabled: true, suppliers: ['hotelbeds', 'booking_com', 'rategain'] },
            buses: { enabled: true, suppliers: ['redbus', 'abhibus'] },
            holidays: { enabled: true, suppliers: [] },
            visa: { enabled: false, suppliers: [] },
            insurance: { enabled: true, suppliers: [] }
        },
        markup: { type: 'percentage', value: 2.5 },
        caching: { enabled: true, ttl: 300 },
        rateLimit: { enabled: true, requestsPerMinute: 60 }
    });
};

initializeSuppliers();

class ChannelDistributionController {
    /**
     * Get all suppliers with their B2B/B2C configurations
     */
    async getSuppliers(req, res) {
        try {
            const { type, channel } = req.query;
            let result = Array.from(suppliers.values());

            if (type) {
                result = result.filter(s => s.type === type);
            }

            if (channel === 'b2b') {
                result = result.filter(s => s.b2bEnabled);
            } else if (channel === 'b2c') {
                result = result.filter(s => s.b2cEnabled);
            }

            res.json({
                success: true,
                data: {
                    suppliers: result,
                    productTypes: ['flights', 'hotels', 'buses', 'holidays', 'visa', 'insurance'],
                    fareTypeDefinitions: {
                        flights: {
                            published: 'Standard published fares visible to all',
                            net: 'Net fares with agent markup - B2B only',
                            corporate: 'Corporate negotiated rates',
                            special: 'Special promotional fares - B2B only',
                            consolidator: 'Consolidator fares - B2B only',
                            private: 'Private fares - B2B only',
                            web: 'Web-only fares',
                            instant: 'Instant ticketing fares',
                            revalidation: 'Requires revalidation before booking'
                        },
                        hotels: {
                            net: 'Net rates with markup - B2B only',
                            standard: 'Standard rates for all',
                            package: 'Package rates',
                            contracted: 'Contracted rates - B2B only',
                            dynamic: 'Dynamic pricing rates',
                            opaque: 'Opaque/hidden hotel rates - B2B only'
                        }
                    }
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, error: { message: error.message } });
        }
    }

    /**
     * Update supplier configuration
     */
    async updateSupplier(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;

            const supplier = suppliers.get(id);
            if (!supplier) {
                return res.status(404).json({ success: false, error: { message: 'Supplier not found' } });
            }

            const updatedSupplier = { ...supplier, ...updates, id };
            suppliers.set(id, updatedSupplier);

            res.json({
                success: true,
                data: updatedSupplier,
                message: 'Supplier configuration updated'
            });
        } catch (error) {
            res.status(500).json({ success: false, error: { message: error.message } });
        }
    }

    /**
     * Toggle supplier for B2B/B2C channel
     */
    async toggleSupplierChannel(req, res) {
        try {
            const { id } = req.params;
            const { channel, enabled } = req.body;

            const supplier = suppliers.get(id);
            if (!supplier) {
                return res.status(404).json({ success: false, error: { message: 'Supplier not found' } });
            }

            if (channel === 'b2b') {
                supplier.b2bEnabled = enabled;
            } else if (channel === 'b2c') {
                supplier.b2cEnabled = enabled;
            }

            suppliers.set(id, supplier);

            res.json({
                success: true,
                data: supplier,
                message: `Supplier ${enabled ? 'enabled' : 'disabled'} for ${channel.toUpperCase()}`
            });
        } catch (error) {
            res.status(500).json({ success: false, error: { message: error.message } });
        }
    }

    /**
     * Update B2C restricted fare types for a supplier
     */
    async updateFareTypeRestrictions(req, res) {
        try {
            const { id } = req.params;
            const { restrictedFareTypes } = req.body;

            const supplier = suppliers.get(id);
            if (!supplier) {
                return res.status(404).json({ success: false, error: { message: 'Supplier not found' } });
            }

            supplier.b2cRestrictedFareTypes = restrictedFareTypes;
            suppliers.set(id, supplier);

            res.json({
                success: true,
                data: supplier,
                message: 'Fare type restrictions updated for B2C'
            });
        } catch (error) {
            res.status(500).json({ success: false, error: { message: error.message } });
        }
    }

    /**
     * Get channel configuration (B2B or B2C)
     */
    async getChannelConfig(req, res) {
        try {
            const { channel } = req.params;
            const config = channelConfigs.get(channel);

            if (!config) {
                return res.status(404).json({ success: false, error: { message: 'Channel not found' } });
            }

            // Enrich with supplier details
            const enrichedProducts = {};
            for (const [product, settings] of Object.entries(config.products)) {
                enrichedProducts[product] = {
                    ...settings,
                    supplierDetails: settings.suppliers.map(sid => suppliers.get(sid)).filter(Boolean)
                };
            }

            res.json({
                success: true,
                data: {
                    ...config,
                    products: enrichedProducts
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, error: { message: error.message } });
        }
    }

    /**
     * Update channel configuration
     */
    async updateChannelConfig(req, res) {
        try {
            const { channel } = req.params;
            const updates = req.body;

            const config = channelConfigs.get(channel);
            if (!config) {
                return res.status(404).json({ success: false, error: { message: 'Channel not found' } });
            }

            const updatedConfig = { ...config, ...updates, id: channel };
            channelConfigs.set(channel, updatedConfig);

            res.json({
                success: true,
                data: updatedConfig,
                message: 'Channel configuration updated'
            });
        } catch (error) {
            res.status(500).json({ success: false, error: { message: error.message } });
        }
    }

    /**
     * Toggle product for a channel
     */
    async toggleChannelProduct(req, res) {
        try {
            const { channel, product } = req.params;
            const { enabled, suppliers: supplierIds } = req.body;

            const config = channelConfigs.get(channel);
            if (!config) {
                return res.status(404).json({ success: false, error: { message: 'Channel not found' } });
            }

            if (!config.products[product]) {
                return res.status(404).json({ success: false, error: { message: 'Product not found' } });
            }

            if (enabled !== undefined) {
                config.products[product].enabled = enabled;
            }
            if (supplierIds) {
                config.products[product].suppliers = supplierIds;
            }

            channelConfigs.set(channel, config);

            res.json({
                success: true,
                data: config.products[product],
                message: 'Product configuration updated'
            });
        } catch (error) {
            res.status(500).json({ success: false, error: { message: error.message } });
        }
    }

    /**
     * Get distribution overview for dashboard
     */
    async getDistributionOverview(req, res) {
        try {
            const allSuppliers = Array.from(suppliers.values());
            const b2bConfig = channelConfigs.get('b2b');
            const b2cConfig = channelConfigs.get('b2c');

            const overview = {
                totalSuppliers: allSuppliers.length,
                b2b: {
                    activeSuppliers: allSuppliers.filter(s => s.b2bEnabled).length,
                    products: Object.entries(b2bConfig.products).filter(([_, v]) => v.enabled).length,
                    totalFareTypes: allSuppliers.filter(s => s.b2bEnabled).reduce((sum, s) => sum + s.fareTypes.length, 0)
                },
                b2c: {
                    activeSuppliers: allSuppliers.filter(s => s.b2cEnabled).length,
                    products: Object.entries(b2cConfig.products).filter(([_, v]) => v.enabled).length,
                    restrictedFareTypes: allSuppliers.reduce((sum, s) => sum + s.b2cRestrictedFareTypes.length, 0),
                    cacheEnabled: b2cConfig.caching.enabled,
                    cacheTTL: b2cConfig.caching.ttl
                },
                byProduct: {
                    flights: {
                        b2bSuppliers: allSuppliers.filter(s => s.type === 'flights' && s.b2bEnabled).length,
                        b2cSuppliers: allSuppliers.filter(s => s.type === 'flights' && s.b2cEnabled).length
                    },
                    hotels: {
                        b2bSuppliers: allSuppliers.filter(s => s.type === 'hotels' && s.b2bEnabled).length,
                        b2cSuppliers: allSuppliers.filter(s => s.type === 'hotels' && s.b2cEnabled).length
                    },
                    buses: {
                        b2bSuppliers: allSuppliers.filter(s => s.type === 'buses' && s.b2bEnabled).length,
                        b2cSuppliers: allSuppliers.filter(s => s.type === 'buses' && s.b2cEnabled).length
                    }
                },
                performance: {
                    avgResponseTime: Math.round(allSuppliers.reduce((sum, s) => sum + s.avgResponseTime, 0) / allSuppliers.length),
                    avgSuccessRate: (allSuppliers.reduce((sum, s) => sum + s.successRate, 0) / allSuppliers.length).toFixed(1)
                }
            };

            res.json({ success: true, data: overview });
        } catch (error) {
            res.status(500).json({ success: false, error: { message: error.message } });
        }
    }

    /**
     * Get fare type distribution matrix
     */
    async getFareTypeMatrix(req, res) {
        try {
            const allSuppliers = Array.from(suppliers.values());

            const matrix = allSuppliers.map(supplier => ({
                supplierId: supplier.id,
                supplierName: supplier.name,
                type: supplier.type,
                fareTypes: supplier.fareTypes.map(ft => ({
                    code: ft,
                    b2bEnabled: true,
                    b2cEnabled: !supplier.b2cRestrictedFareTypes.includes(ft),
                    description: getFareTypeDescription(ft)
                }))
            }));

            res.json({ success: true, data: matrix });
        } catch (error) {
            res.status(500).json({ success: false, error: { message: error.message } });
        }
    }

    /**
     * Bulk update fare type restrictions
     */
    async bulkUpdateFareRestrictions(req, res) {
        try {
            const { updates } = req.body;
            // updates: [{ supplierId, fareType, b2cEnabled }]

            updates.forEach(update => {
                const supplier = suppliers.get(update.supplierId);
                if (supplier) {
                    if (update.b2cEnabled) {
                        supplier.b2cRestrictedFareTypes = supplier.b2cRestrictedFareTypes.filter(
                            ft => ft !== update.fareType
                        );
                    } else {
                        if (!supplier.b2cRestrictedFareTypes.includes(update.fareType)) {
                            supplier.b2cRestrictedFareTypes.push(update.fareType);
                        }
                    }
                    suppliers.set(update.supplierId, supplier);
                }
            });

            res.json({
                success: true,
                message: `Updated ${updates.length} fare type restrictions`
            });
        } catch (error) {
            res.status(500).json({ success: false, error: { message: error.message } });
        }
    }

    /**
     * Get B2C optimization settings
     */
    async getB2COptimization(req, res) {
        try {
            const b2cConfig = channelConfigs.get('b2c');
            const b2cSuppliers = Array.from(suppliers.values()).filter(s => s.b2cEnabled);

            const optimization = {
                caching: b2cConfig.caching,
                rateLimit: b2cConfig.rateLimit,
                markup: b2cConfig.markup,
                supplierPriorities: b2cSuppliers
                    .sort((a, b) => a.priority - b.priority)
                    .map(s => ({
                        id: s.id,
                        name: s.name,
                        type: s.type,
                        priority: s.priority,
                        avgResponseTime: s.avgResponseTime,
                        successRate: s.successRate
                    })),
                recommendations: [
                    {
                        type: 'cache',
                        message: b2cConfig.caching.enabled
                            ? `Caching enabled with ${b2cConfig.caching.ttl}s TTL`
                            : 'Enable caching to improve response times',
                        priority: b2cConfig.caching.enabled ? 'info' : 'warning'
                    },
                    {
                        type: 'supplier',
                        message: b2cSuppliers.length < 3
                            ? 'Consider enabling more suppliers for better coverage'
                            : `${b2cSuppliers.length} suppliers active for B2C`,
                        priority: b2cSuppliers.length < 3 ? 'warning' : 'info'
                    }
                ]
            };

            res.json({ success: true, data: optimization });
        } catch (error) {
            res.status(500).json({ success: false, error: { message: error.message } });
        }
    }

    /**
     * Update B2C optimization settings
     */
    async updateB2COptimization(req, res) {
        try {
            const { caching, rateLimit, markup, supplierPriorities } = req.body;
            const b2cConfig = channelConfigs.get('b2c');

            if (caching) b2cConfig.caching = caching;
            if (rateLimit) b2cConfig.rateLimit = rateLimit;
            if (markup) b2cConfig.markup = markup;

            if (supplierPriorities) {
                supplierPriorities.forEach(sp => {
                    const supplier = suppliers.get(sp.id);
                    if (supplier) {
                        supplier.priority = sp.priority;
                        suppliers.set(sp.id, supplier);
                    }
                });
            }

            channelConfigs.set('b2c', b2cConfig);

            res.json({
                success: true,
                data: b2cConfig,
                message: 'B2C optimization settings updated'
            });
        } catch (error) {
            res.status(500).json({ success: false, error: { message: error.message } });
        }
    }
}

function getFareTypeDescription(fareType) {
    const descriptions = {
        published: 'Standard published fare',
        net: 'Net fare for agents',
        corporate: 'Corporate negotiated rate',
        special: 'Special promotional fare',
        consolidator: 'Consolidator bulk fare',
        private: 'Private contracted fare',
        web: 'Web-only fare',
        instant: 'Instant confirmation fare',
        revalidation: 'Requires price revalidation',
        standard: 'Standard rate',
        package: 'Package deal rate',
        contracted: 'Contracted rate',
        dynamic: 'Dynamic pricing',
        opaque: 'Hidden/opaque rate'
    };
    return descriptions[fareType] || fareType;
}

module.exports = new ChannelDistributionController();
