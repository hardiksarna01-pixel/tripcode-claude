/**
 * Group Booking Controller
 * Handles group booking requests (10+ passengers)
 */

const catchAsync = require('../utils/catchAsync');

// In-memory storage for demo
let groupRequests = new Map();
let groupRequestIdCounter = 1;

const GROUP_REQUEST_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    QUOTED: 'quoted',
    ACCEPTED: 'accepted',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    EXPIRED: 'expired'
};

const GROUP_PURPOSES = ['corporate', 'wedding', 'tour', 'sports', 'educational', 'religious', 'other'];

/**
 * Create group booking request
 */
exports.createRequest = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;
    const {
        origin, destination, departureDate, returnDate,
        passengers, purpose, preferredAirlines, cabinClass,
        isFlexibleDate, flexibleDays, specialRequirements,
        contactName, contactEmail, contactPhone
    } = req.body;

    // Validation
    if (!origin || !destination || !departureDate || !passengers) {
        return res.status(400).json({
            success: false,
            error: 'Origin, destination, departure date, and passenger count are required'
        });
    }

    if (passengers < 10) {
        return res.status(400).json({
            success: false,
            error: 'Group booking requires minimum 10 passengers'
        });
    }

    const request = {
        id: groupRequestIdCounter++,
        requestNumber: `GRP${Date.now().toString().slice(-8)}`,
        agentId,

        // Flight details
        origin,
        destination,
        departureDate,
        returnDate: returnDate || null,
        isRoundTrip: !!returnDate,

        // Passenger details
        passengers: parseInt(passengers),
        cabinClass: cabinClass || 0, // 0 = Economy

        // Preferences
        purpose: purpose || 'other',
        preferredAirlines: preferredAirlines || [],
        isFlexibleDate: isFlexibleDate || false,
        flexibleDays: flexibleDays || 2,
        specialRequirements: specialRequirements || '',

        // Contact
        contactName: contactName || '',
        contactEmail: contactEmail || '',
        contactPhone: contactPhone || '',

        // Quotes
        quotes: [],
        selectedQuote: null,

        // Status
        status: GROUP_REQUEST_STATUS.PENDING,
        statusHistory: [{
            status: GROUP_REQUEST_STATUS.PENDING,
            timestamp: new Date().toISOString(),
            note: 'Request submitted'
        }],

        // Timestamps
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };

    groupRequests.set(request.id, request);

    res.status(201).json({
        success: true,
        data: request,
        message: 'Group booking request submitted. You will receive quotes within 24-48 hours.'
    });
});

/**
 * Get all group requests for agent
 */
exports.getRequests = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;
    const { status, page = 1, limit = 10 } = req.query;

    let agentRequests = Array.from(groupRequests.values()).filter(r => r.agentId === agentId);

    if (status) {
        agentRequests = agentRequests.filter(r => r.status === status);
    }

    // Sort by date (newest first)
    agentRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Paginate
    const offset = (page - 1) * limit;
    const paginatedRequests = agentRequests.slice(offset, offset + parseInt(limit));

    res.json({
        success: true,
        data: {
            requests: paginatedRequests,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: agentRequests.length,
                totalPages: Math.ceil(agentRequests.length / limit)
            }
        }
    });
});

/**
 * Get single group request
 */
exports.getRequest = catchAsync(async (req, res) => {
    const { id } = req.params;
    const agentId = req.user.agentId;

    const request = groupRequests.get(parseInt(id));

    if (!request || request.agentId !== agentId) {
        return res.status(404).json({
            success: false,
            error: 'Group request not found'
        });
    }

    res.json({
        success: true,
        data: request
    });
});

/**
 * Update group request
 */
exports.updateRequest = catchAsync(async (req, res) => {
    const { id } = req.params;
    const agentId = req.user.agentId;
    const updateData = req.body;

    const request = groupRequests.get(parseInt(id));

    if (!request || request.agentId !== agentId) {
        return res.status(404).json({
            success: false,
            error: 'Group request not found'
        });
    }

    if (request.status !== GROUP_REQUEST_STATUS.PENDING) {
        return res.status(400).json({
            success: false,
            error: 'Cannot modify request after processing has started'
        });
    }

    const updatedRequest = {
        ...request,
        ...updateData,
        id: request.id,
        requestNumber: request.requestNumber,
        agentId: request.agentId,
        status: request.status,
        updatedAt: new Date().toISOString()
    };

    groupRequests.set(request.id, updatedRequest);

    res.json({
        success: true,
        data: updatedRequest
    });
});

/**
 * Cancel group request
 */
exports.cancelRequest = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    const agentId = req.user.agentId;

    const request = groupRequests.get(parseInt(id));

    if (!request || request.agentId !== agentId) {
        return res.status(404).json({
            success: false,
            error: 'Group request not found'
        });
    }

    if ([GROUP_REQUEST_STATUS.CONFIRMED, GROUP_REQUEST_STATUS.CANCELLED].includes(request.status)) {
        return res.status(400).json({
            success: false,
            error: 'Cannot cancel this request'
        });
    }

    request.status = GROUP_REQUEST_STATUS.CANCELLED;
    request.statusHistory.push({
        status: GROUP_REQUEST_STATUS.CANCELLED,
        timestamp: new Date().toISOString(),
        note: reason || 'Cancelled by agent'
    });
    request.updatedAt = new Date().toISOString();

    groupRequests.set(request.id, request);

    res.json({
        success: true,
        message: 'Group request cancelled successfully'
    });
});

/**
 * Accept quote for group request
 */
exports.acceptQuote = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { quoteId } = req.body;
    const agentId = req.user.agentId;

    const request = groupRequests.get(parseInt(id));

    if (!request || request.agentId !== agentId) {
        return res.status(404).json({
            success: false,
            error: 'Group request not found'
        });
    }

    if (request.status !== GROUP_REQUEST_STATUS.QUOTED) {
        return res.status(400).json({
            success: false,
            error: 'No quotes available to accept'
        });
    }

    const quote = request.quotes.find(q => q.id === quoteId);
    if (!quote) {
        return res.status(404).json({
            success: false,
            error: 'Quote not found'
        });
    }

    request.selectedQuote = quote;
    request.status = GROUP_REQUEST_STATUS.ACCEPTED;
    request.statusHistory.push({
        status: GROUP_REQUEST_STATUS.ACCEPTED,
        timestamp: new Date().toISOString(),
        note: `Quote ${quote.id} accepted`
    });
    request.updatedAt = new Date().toISOString();

    groupRequests.set(request.id, request);

    res.json({
        success: true,
        data: request,
        message: 'Quote accepted. Proceed with payment to confirm booking.'
    });
});

/**
 * Add quote to group request (Admin function)
 */
exports.addQuote = catchAsync(async (req, res) => {
    const { id } = req.params;
    const quoteData = req.body;

    const request = groupRequests.get(parseInt(id));

    if (!request) {
        return res.status(404).json({
            success: false,
            error: 'Group request not found'
        });
    }

    const quote = {
        id: `Q${Date.now().toString().slice(-6)}`,
        airline: quoteData.airline,
        airlineCode: quoteData.airlineCode,
        flightNumbers: quoteData.flightNumbers || [],
        departureTime: quoteData.departureTime,
        arrivalTime: quoteData.arrivalTime,
        duration: quoteData.duration,
        farePerPax: quoteData.farePerPax,
        totalFare: quoteData.farePerPax * request.passengers,
        taxes: quoteData.taxes || 0,
        grandTotal: (quoteData.farePerPax * request.passengers) + (quoteData.taxes || 0),
        commission: quoteData.commission || 0,
        seats: quoteData.seats || request.passengers,
        baggage: quoteData.baggage || '15kg',
        meals: quoteData.meals || 'Included',
        cancellationPolicy: quoteData.cancellationPolicy || 'Non-refundable',
        validUntil: quoteData.validUntil || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        notes: quoteData.notes || '',
        createdAt: new Date().toISOString()
    };

    request.quotes.push(quote);
    request.status = GROUP_REQUEST_STATUS.QUOTED;
    request.statusHistory.push({
        status: GROUP_REQUEST_STATUS.QUOTED,
        timestamp: new Date().toISOString(),
        note: `Quote added from ${quote.airline}`
    });
    request.updatedAt = new Date().toISOString();

    groupRequests.set(request.id, request);

    res.json({
        success: true,
        data: request
    });
});

/**
 * Get group booking purposes
 */
exports.getPurposes = catchAsync(async (req, res) => {
    res.json({
        success: true,
        data: GROUP_PURPOSES.map(p => ({
            value: p,
            label: p.charAt(0).toUpperCase() + p.slice(1)
        }))
    });
});

/**
 * Get group request statistics
 */
exports.getStats = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;

    const agentRequests = Array.from(groupRequests.values()).filter(r => r.agentId === agentId);

    const stats = {
        total: agentRequests.length,
        pending: agentRequests.filter(r => r.status === GROUP_REQUEST_STATUS.PENDING).length,
        processing: agentRequests.filter(r => r.status === GROUP_REQUEST_STATUS.PROCESSING).length,
        quoted: agentRequests.filter(r => r.status === GROUP_REQUEST_STATUS.QUOTED).length,
        confirmed: agentRequests.filter(r => r.status === GROUP_REQUEST_STATUS.CONFIRMED).length,
        cancelled: agentRequests.filter(r => r.status === GROUP_REQUEST_STATUS.CANCELLED).length,
        totalPassengers: agentRequests.reduce((sum, r) => sum + r.passengers, 0)
    };

    res.json({
        success: true,
        data: stats
    });
});
