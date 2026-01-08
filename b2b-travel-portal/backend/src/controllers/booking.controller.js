const flightApiService = require('../services/flight-api.service');
const { catchAsync } = require('../utils/catchAsync');

/**
 * Create a new booking (temp booking)
 */
exports.createBooking = catchAsync(async (req, res) => {
    const {
        searchKey,
        flightKey,
        passengers,
        contact,
        gstDetails,
        ssrSelections,
        blockTicket
    } = req.body;

    // Validate passengers
    if (!passengers || passengers.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'At least one passenger is required'
        });
    }

    const bookingData = {
        searchKey,
        flightKey,
        passengers,
        contact,
        gstDetails,
        ssrSelections: ssrSelections || [],
        blockTicket: blockTicket || false
    };

    const result = await flightApiService.createTempBooking(
        req.agentCredentials,
        bookingData
    );

    res.status(201).json({
        success: true,
        message: blockTicket ? 'Booking held successfully' : 'Booking created successfully',
        data: result
    });
});

/**
 * Confirm booking and issue ticket
 */
exports.confirmBooking = catchAsync(async (req, res) => {
    const { bookingRefNo, airlinePnr, clientRefNo } = req.body;

    // Step 1: Add payment (debit wallet)
    const paymentResult = await flightApiService.addPayment(
        req.agentCredentials,
        bookingRefNo,
        0, // BOOKING transaction type
        clientRefNo || ''
    );

    // Step 2: Issue ticket
    const ticketResult = await flightApiService.issueTicket(
        req.agentCredentials,
        bookingRefNo,
        airlinePnr || ''
    );

    // Step 3: Get full booking details
    const bookingDetails = await flightApiService.getBookingDetails(
        req.agentCredentials,
        bookingRefNo
    );

    res.json({
        success: true,
        message: 'Ticket issued successfully',
        data: {
            payment: paymentResult,
            ticket: ticketResult,
            booking: bookingDetails
        }
    });
});

/**
 * Get booking details
 */
exports.getBookingDetails = catchAsync(async (req, res) => {
    const { refNo } = req.params;
    const { airlinePnr } = req.query;

    const result = await flightApiService.getBookingDetails(
        req.agentCredentials,
        refNo,
        airlinePnr || ''
    );

    res.json({
        success: true,
        data: result
    });
});

/**
 * Get booking history
 */
exports.getBookingHistory = catchAsync(async (req, res) => {
    const { fromDate, toDate, month, year, type } = req.query;

    const filters = {
        fromDate,
        toDate,
        month,
        year,
        type: type ? parseInt(type) : 0
    };

    const result = await flightApiService.getBookingHistory(
        req.agentCredentials,
        filters
    );

    res.json({
        success: true,
        data: result
    });
});

/**
 * Cancel booking
 */
exports.cancelBooking = catchAsync(async (req, res) => {
    const { refNo } = req.params;
    const { cancellationType } = req.body;

    const result = await flightApiService.cancelBooking(
        req.agentCredentials,
        refNo,
        cancellationType || 0
    );

    res.json({
        success: true,
        message: 'Booking cancelled successfully',
        data: result
    });
});

/**
 * Release blocked PNR
 */
exports.releasePnr = catchAsync(async (req, res) => {
    const { refNo } = req.params;
    const { airlinePnr } = req.body;

    const result = await flightApiService.releasePnr(
        req.agentCredentials,
        refNo,
        airlinePnr || ''
    );

    res.json({
        success: true,
        message: 'PNR released successfully',
        data: result
    });
});

/**
 * Add post-booking SSR
 */
exports.addPostBookingSSR = catchAsync(async (req, res) => {
    const { refNo } = req.params;
    const { ssrSelections, airlinePnr } = req.body;

    // This would involve multiple API calls:
    // 1. Air_GetPostSSR - Get available SSR
    // 2. Air_InitiatePostSSR - Select SSR
    // 3. AddPayment - Pay for SSR
    // 4. Air_ConfirmPostSSR - Confirm SSR

    // For now, return a placeholder
    res.json({
        success: true,
        message: 'Post-booking SSR feature - implement full flow',
        data: { refNo, ssrSelections }
    });
});
