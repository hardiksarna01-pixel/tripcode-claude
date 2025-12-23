const db = require('../config/database');

/**
 * Scheme Repository
 * Handles all scheme-related database operations
 */
class SchemeRepository {
    /**
     * Create a new scheme
     */
    async create(schemeData) {
        const {
            schemeName,
            schemeCode,
            description,
            domesticServiceFeeType,
            domesticServiceFeeValue,
            domesticMarkupOnBase,
            domesticCommissionShare,
            intlServiceFeeType,
            intlServiceFeeValue,
            intlMarkupOnBase,
            intlCommissionShare,
            applyGst,
            gstRate,
            applyTds,
            tdsRate,
            allowCredit,
            maxCreditLimit,
            autoTicket,
            blockTicketAllowed,
            blockTicketDurationHours,
            createdBy
        } = schemeData;

        const result = await db.query(
            `INSERT INTO schemes (
                scheme_name, scheme_code, description,
                domestic_service_fee_type, domestic_service_fee_value,
                domestic_markup_on_base, domestic_commission_share,
                intl_service_fee_type, intl_service_fee_value,
                intl_markup_on_base, intl_commission_share,
                apply_gst, gst_rate, apply_tds, tds_rate,
                allow_credit, max_credit_limit, auto_ticket,
                block_ticket_allowed, block_ticket_duration_hours,
                created_by
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
            RETURNING *`,
            [
                schemeName, schemeCode, description,
                domesticServiceFeeType, domesticServiceFeeValue,
                domesticMarkupOnBase, domesticCommissionShare,
                intlServiceFeeType, intlServiceFeeValue,
                intlMarkupOnBase, intlCommissionShare,
                applyGst, gstRate, applyTds, tdsRate,
                allowCredit, maxCreditLimit, autoTicket,
                blockTicketAllowed, blockTicketDurationHours,
                createdBy
            ]
        );

        return result.rows[0];
    }

    /**
     * Find scheme by ID
     */
    async findById(id) {
        const result = await db.query(
            'SELECT * FROM schemes WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    }

    /**
     * Find scheme by code
     */
    async findByCode(schemeCode) {
        const result = await db.query(
            'SELECT * FROM schemes WHERE scheme_code = $1',
            [schemeCode]
        );
        return result.rows[0] || null;
    }

    /**
     * Update scheme
     */
    async update(id, updateData) {
        const allowedFields = [
            'scheme_name', 'description',
            'domestic_service_fee_type', 'domestic_service_fee_value',
            'domestic_markup_on_base', 'domestic_commission_share',
            'intl_service_fee_type', 'intl_service_fee_value',
            'intl_markup_on_base', 'intl_commission_share',
            'apply_gst', 'gst_rate', 'apply_tds', 'tds_rate',
            'allow_credit', 'max_credit_limit', 'auto_ticket',
            'block_ticket_allowed', 'block_ticket_duration_hours',
            'is_active'
        ];

        const updates = [];
        const values = [];
        let paramIndex = 1;

        for (const [key, value] of Object.entries(updateData)) {
            const snakeKey = this.toSnakeCase(key);
            if (allowedFields.includes(snakeKey)) {
                updates.push(`${snakeKey} = $${paramIndex++}`);
                values.push(value);
            }
        }

        if (updates.length === 0) {
            return this.findById(id);
        }

        updates.push(`updated_at = NOW()`);
        values.push(id);

        const result = await db.query(
            `UPDATE schemes SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
            values
        );

        return result.rows[0];
    }

    /**
     * List all schemes
     */
    async list(filters = {}) {
        const { isActive, limit = 100, offset = 0 } = filters;

        let query = 'SELECT * FROM schemes WHERE 1=1';
        const params = [];
        let paramIndex = 1;

        if (isActive !== undefined) {
            query += ` AND is_active = $${paramIndex++}`;
            params.push(isActive);
        }

        query += ` ORDER BY scheme_name ASC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
        params.push(limit, offset);

        const result = await db.query(query, params);
        return result.rows;
    }

    /**
     * Delete scheme (soft delete by deactivating)
     */
    async delete(id) {
        const result = await db.query(
            'UPDATE schemes SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING *',
            [id]
        );
        return result.rows[0];
    }

    /**
     * Add API configuration for scheme
     */
    async addApiConfig(schemeId, apiConfig) {
        const {
            apiProviderId,
            isEnabled,
            overrideServiceFee,
            customServiceFeeType,
            customServiceFeeValue,
            customMarkupOnBase,
            customCommissionShare,
            allowedAirlines,
            blockedAirlines
        } = apiConfig;

        const result = await db.query(
            `INSERT INTO scheme_api_config (
                scheme_id, api_provider_id, is_enabled,
                override_service_fee, custom_service_fee_type,
                custom_service_fee_value, custom_markup_on_base,
                custom_commission_share, allowed_airlines, blocked_airlines
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            ON CONFLICT (scheme_id, api_provider_id) DO UPDATE SET
                is_enabled = EXCLUDED.is_enabled,
                override_service_fee = EXCLUDED.override_service_fee,
                custom_service_fee_type = EXCLUDED.custom_service_fee_type,
                custom_service_fee_value = EXCLUDED.custom_service_fee_value,
                custom_markup_on_base = EXCLUDED.custom_markup_on_base,
                custom_commission_share = EXCLUDED.custom_commission_share,
                allowed_airlines = EXCLUDED.allowed_airlines,
                blocked_airlines = EXCLUDED.blocked_airlines
            RETURNING *`,
            [
                schemeId, apiProviderId, isEnabled,
                overrideServiceFee, customServiceFeeType,
                customServiceFeeValue, customMarkupOnBase,
                customCommissionShare, allowedAirlines, blockedAirlines
            ]
        );

        return result.rows[0];
    }

    /**
     * Get API configurations for scheme
     */
    async getApiConfigs(schemeId) {
        const result = await db.query(
            `SELECT sac.*, ap.provider_name, ap.provider_code
             FROM scheme_api_config sac
             JOIN api_providers ap ON sac.api_provider_id = ap.id
             WHERE sac.scheme_id = $1`,
            [schemeId]
        );
        return result.rows;
    }

    /**
     * Add airline rule for scheme
     */
    async addAirlineRule(schemeId, airlineRule) {
        const {
            airlineCode,
            travelType,
            fareClass,
            serviceFeeType,
            serviceFeeValue,
            markupOnBase,
            commissionShare,
            isEnabled
        } = airlineRule;

        const result = await db.query(
            `INSERT INTO scheme_airline_rules (
                scheme_id, airline_code, travel_type, fare_class,
                service_fee_type, service_fee_value, markup_on_base,
                commission_share, is_enabled
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (scheme_id, airline_code, fare_class) DO UPDATE SET
                travel_type = EXCLUDED.travel_type,
                service_fee_type = EXCLUDED.service_fee_type,
                service_fee_value = EXCLUDED.service_fee_value,
                markup_on_base = EXCLUDED.markup_on_base,
                commission_share = EXCLUDED.commission_share,
                is_enabled = EXCLUDED.is_enabled
            RETURNING *`,
            [
                schemeId, airlineCode, travelType, fareClass,
                serviceFeeType, serviceFeeValue, markupOnBase,
                commissionShare, isEnabled
            ]
        );

        return result.rows[0];
    }

    /**
     * Get airline rules for scheme
     */
    async getAirlineRules(schemeId) {
        const result = await db.query(
            'SELECT * FROM scheme_airline_rules WHERE scheme_id = $1 ORDER BY airline_code',
            [schemeId]
        );
        return result.rows;
    }

    /**
     * Calculate fare with scheme rules
     */
    async calculateFare(schemeId, fareData) {
        const scheme = await this.findById(schemeId);
        if (!scheme) {
            throw new Error('Scheme not found');
        }

        const { baseFare, taxes, travelType, airlineCode, fareClass } = fareData;

        // Check for airline-specific rules
        const airlineRuleResult = await db.query(
            `SELECT * FROM scheme_airline_rules
             WHERE scheme_id = $1 AND airline_code = $2
               AND (fare_class = $3 OR fare_class IS NULL)
               AND (travel_type = $4 OR travel_type = 2)
               AND is_enabled = true
             ORDER BY fare_class DESC NULLS LAST
             LIMIT 1`,
            [schemeId, airlineCode, fareClass, travelType]
        );

        const airlineRule = airlineRuleResult.rows[0];

        // Use airline rule if exists, otherwise use scheme defaults
        const isDomestic = travelType === 0;
        let serviceFeeType, serviceFeeValue, markupOnBase, commissionShare;

        if (airlineRule) {
            serviceFeeType = airlineRule.service_fee_type;
            serviceFeeValue = parseFloat(airlineRule.service_fee_value);
            markupOnBase = parseFloat(airlineRule.markup_on_base);
            commissionShare = parseFloat(airlineRule.commission_share);
        } else {
            serviceFeeType = isDomestic ? scheme.domestic_service_fee_type : scheme.intl_service_fee_type;
            serviceFeeValue = isDomestic ? parseFloat(scheme.domestic_service_fee_value) : parseFloat(scheme.intl_service_fee_value);
            markupOnBase = isDomestic ? parseFloat(scheme.domestic_markup_on_base) : parseFloat(scheme.intl_markup_on_base);
            commissionShare = isDomestic ? parseFloat(scheme.domestic_commission_share) : parseFloat(scheme.intl_commission_share);
        }

        // Calculate amounts
        const serviceFee = serviceFeeType === 'FLAT'
            ? serviceFeeValue
            : (baseFare * serviceFeeValue / 100);

        const markup = baseFare * markupOnBase / 100;
        const grossAmount = baseFare + taxes + serviceFee + markup;

        // Calculate commission (if any from API)
        const apiCommission = fareData.apiCommission || 0;
        const agentCommission = apiCommission * commissionShare / 100;

        // Calculate GST and TDS on commission
        let gstOnCommission = 0;
        let tdsOnCommission = 0;

        if (scheme.apply_gst && agentCommission > 0) {
            gstOnCommission = agentCommission * parseFloat(scheme.gst_rate) / 100;
        }

        if (scheme.apply_tds && agentCommission > 0) {
            tdsOnCommission = agentCommission * parseFloat(scheme.tds_rate) / 100;
        }

        const netAmount = grossAmount - agentCommission + gstOnCommission + tdsOnCommission;

        return {
            baseFare,
            taxes,
            serviceFee,
            markup,
            grossAmount,
            apiCommission,
            agentCommission,
            gstOnCommission,
            tdsOnCommission,
            netAmount,
            ourProfit: serviceFee + markup + (apiCommission - agentCommission)
        };
    }

    /**
     * Convert camelCase to snake_case
     */
    toSnakeCase(str) {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    }
}

module.exports = new SchemeRepository();
