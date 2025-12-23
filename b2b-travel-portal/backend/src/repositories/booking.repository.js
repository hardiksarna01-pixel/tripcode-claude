const db = require('../config/database');

/**
 * Booking Repository
 * Handles all database operations for bookings
 */
class BookingRepository {
    /**
     * Create a new booking
     */
    async create(bookingData) {
        const {
            agentId,
            agentCode,
            groupId,
            schemeId,
            apiProviderId,
            airlinePnr,
            supplierRefNo,
            travelType,
            bookingType,
            adultCount,
            childCount,
            infantCount,
            baseFare,
            taxes,
            apiCommission,
            apiPlb,
            apiTds,
            serviceFee,
            markup,
            agentCommission,
            agentTds,
            agentGstOnCommission,
            grossAmount,
            netAmount,
            ourProfit,
            paxMobile,
            paxEmail,
            searchResponse,
            bookingResponse
        } = bookingData;

        // Generate booking reference number
        const bookingRefNo = await this.generateBookingRefNo();

        const result = await db.query(
            `INSERT INTO bookings (
                booking_ref_no, agent_id, agent_code, group_id, scheme_id,
                api_provider_id, airline_pnr, supplier_ref_no, travel_type, booking_type,
                adult_count, child_count, infant_count, base_fare, taxes,
                api_commission, api_plb, api_tds, service_fee, markup,
                agent_commission, agent_tds, agent_gst_on_commission,
                gross_amount, net_amount, our_profit,
                pax_mobile, pax_email, search_response, booking_response,
                status, payment_status
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
                $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
                'PENDING', 'UNPAID'
            ) RETURNING *`,
            [
                bookingRefNo, agentId, agentCode, groupId, schemeId,
                apiProviderId, airlinePnr, supplierRefNo, travelType, bookingType,
                adultCount, childCount, infantCount, baseFare, taxes,
                apiCommission, apiPlb, apiTds, serviceFee, markup,
                agentCommission, agentTds, agentGstOnCommission,
                grossAmount, netAmount, ourProfit,
                paxMobile, paxEmail,
                searchResponse ? JSON.stringify(searchResponse) : null,
                bookingResponse ? JSON.stringify(bookingResponse) : null
            ]
        );

        return result.rows[0];
    }

    /**
     * Add passengers to booking
     */
    async addPassengers(bookingId, passengers) {
        const values = passengers.map((pax, index) => {
            return `($1, $${index * 9 + 2}, $${index * 9 + 3}, $${index * 9 + 4}, $${index * 9 + 5}, $${index * 9 + 6}, $${index * 9 + 7}, $${index * 9 + 8}, $${index * 9 + 9}, $${index * 9 + 10})`;
        }).join(', ');

        const params = [bookingId];
        passengers.forEach(pax => {
            params.push(
                pax.paxId, pax.paxType, pax.title, pax.firstName, pax.lastName,
                pax.gender, pax.dob, pax.baseFare, pax.taxes
            );
        });

        await db.query(
            `INSERT INTO booking_passengers (
                booking_id, pax_id, pax_type, title, first_name, last_name,
                gender, dob, base_fare, taxes
            ) VALUES ${values}`,
            params
        );
    }

    /**
     * Add segments to booking
     */
    async addSegments(bookingId, segments) {
        for (const segment of segments) {
            await db.query(
                `INSERT INTO booking_segments (
                    booking_id, segment_id, leg_index, airline_code, flight_number,
                    origin, destination, departure_datetime, arrival_datetime,
                    duration, fare_class, fare_basis
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                [
                    bookingId, segment.segmentId, segment.legIndex, segment.airlineCode,
                    segment.flightNumber, segment.origin, segment.destination,
                    segment.departureDateTime, segment.arrivalDateTime,
                    segment.duration, segment.fareClass, segment.fareBasis
                ]
            );
        }
    }

    /**
     * Find booking by reference number
     */
    async findByRefNo(refNo) {
        const result = await db.query(
            `SELECT b.*,
                    json_agg(DISTINCT bp.*) as passengers,
                    json_agg(DISTINCT bs.*) as segments
             FROM bookings b
             LEFT JOIN booking_passengers bp ON b.id = bp.booking_id
             LEFT JOIN booking_segments bs ON b.id = bs.booking_id
             WHERE b.booking_ref_no = $1
             GROUP BY b.id`,
            [refNo]
        );
        return result.rows[0] || null;
    }

    /**
     * Find booking by ID
     */
    async findById(id) {
        const result = await db.query(
            `SELECT b.*,
                    json_agg(DISTINCT bp.*) as passengers,
                    json_agg(DISTINCT bs.*) as segments
             FROM bookings b
             LEFT JOIN booking_passengers bp ON b.id = bp.booking_id
             LEFT JOIN booking_segments bs ON b.id = bs.booking_id
             WHERE b.id = $1
             GROUP BY b.id`,
            [id]
        );
        return result.rows[0] || null;
    }

    /**
     * Update booking status
     */
    async updateStatus(refNo, status, additionalData = {}) {
        const updates = ['status = $2', 'updated_at = NOW()'];
        const params = [refNo, status];
        let paramIndex = 3;

        if (additionalData.ticketStatus) {
            updates.push(`ticket_status = $${paramIndex++}`);
            params.push(additionalData.ticketStatus);
        }

        if (additionalData.paymentStatus) {
            updates.push(`payment_status = $${paramIndex++}`);
            params.push(additionalData.paymentStatus);
        }

        if (additionalData.airlinePnr) {
            updates.push(`airline_pnr = $${paramIndex++}`);
            params.push(additionalData.airlinePnr);
        }

        if (status === 'TICKETED') {
            updates.push(`ticketing_date = NOW()`);
        }

        if (status === 'CANCELLED') {
            updates.push(`cancellation_date = NOW()`);
        }

        if (additionalData.ticketResponse) {
            updates.push(`ticket_response = $${paramIndex++}`);
            params.push(JSON.stringify(additionalData.ticketResponse));
        }

        const result = await db.query(
            `UPDATE bookings SET ${updates.join(', ')} WHERE booking_ref_no = $1 RETURNING *`,
            params
        );

        return result.rows[0];
    }

    /**
     * Update passenger ticket numbers
     */
    async updatePassengerTickets(bookingId, ticketData) {
        for (const ticket of ticketData) {
            await db.query(
                `UPDATE booking_passengers
                 SET ticket_number = $1, seat_number = $2
                 WHERE booking_id = $3 AND pax_id = $4`,
                [ticket.ticketNumber, ticket.seatNumber, bookingId, ticket.paxId]
            );
        }
    }

    /**
     * Get booking history for agent
     */
    async getAgentBookings(agentId, filters = {}) {
        const {
            status,
            fromDate,
            toDate,
            limit = 20,
            offset = 0
        } = filters;

        let query = `
            SELECT b.*,
                   json_agg(DISTINCT bs.*) as segments
            FROM bookings b
            LEFT JOIN booking_segments bs ON b.id = bs.booking_id
            WHERE b.agent_id = $1
        `;
        const params = [agentId];
        let paramIndex = 2;

        if (status) {
            query += ` AND b.status = $${paramIndex++}`;
            params.push(status);
        }

        if (fromDate) {
            query += ` AND b.booking_date >= $${paramIndex++}`;
            params.push(fromDate);
        }

        if (toDate) {
            query += ` AND b.booking_date <= $${paramIndex++}`;
            params.push(toDate);
        }

        query += ` GROUP BY b.id ORDER BY b.booking_date DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
        params.push(limit, offset);

        const result = await db.query(query, params);
        return result.rows;
    }

    /**
     * Get booking statistics for agent
     */
    async getAgentStats(agentId, period = 'month') {
        let dateFilter = '';
        switch (period) {
            case 'today':
                dateFilter = "AND booking_date >= CURRENT_DATE";
                break;
            case 'week':
                dateFilter = "AND booking_date >= CURRENT_DATE - INTERVAL '7 days'";
                break;
            case 'month':
                dateFilter = "AND booking_date >= CURRENT_DATE - INTERVAL '30 days'";
                break;
            case 'year':
                dateFilter = "AND booking_date >= CURRENT_DATE - INTERVAL '1 year'";
                break;
        }

        const result = await db.query(
            `SELECT
                COUNT(*) as total_bookings,
                COUNT(*) FILTER (WHERE status = 'TICKETED') as ticketed_bookings,
                COUNT(*) FILTER (WHERE status = 'CANCELLED') as cancelled_bookings,
                SUM(gross_amount) as total_gross,
                SUM(net_amount) as total_net,
                SUM(agent_commission) as total_commission
             FROM bookings
             WHERE agent_id = $1 ${dateFilter}`,
            [agentId]
        );

        return result.rows[0];
    }

    /**
     * Generate unique booking reference number
     */
    async generateBookingRefNo() {
        const prefix = 'TRV';
        const date = new Date();
        const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;

        const result = await db.query(
            "SELECT booking_ref_no FROM bookings WHERE booking_ref_no LIKE $1 ORDER BY booking_ref_no DESC LIMIT 1",
            [`${prefix}${dateStr}%`]
        );

        if (result.rows.length === 0) {
            return `${prefix}${dateStr}0001`;
        }

        const lastRef = result.rows[0].booking_ref_no;
        const lastNumber = parseInt(lastRef.slice(-4), 10);
        return `${prefix}${dateStr}${String(lastNumber + 1).padStart(4, '0')}`;
    }

    /**
     * Record notification sent
     */
    async recordNotification(refNo, type) {
        const column = {
            whatsapp: 'whatsapp_sent',
            email: 'email_sent',
            sms: 'sms_sent'
        }[type];

        const timestampColumn = `${column.replace('_sent', '')}_sent_at`;

        if (column) {
            await db.query(
                `UPDATE bookings SET ${column} = true, ${timestampColumn} = NOW() WHERE booking_ref_no = $1`,
                [refNo]
            );
        }
    }
}

module.exports = new BookingRepository();
