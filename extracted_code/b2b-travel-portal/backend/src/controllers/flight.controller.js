const flightApiService = require('../services/flight-api.service');
const { catchAsync } = require('../utils/catchAsync');
const { airportsData, airlinesData } = require('../utils/staticData');

/**
 * Get sector availability
 */
exports.getSectorAvailability = catchAsync(async (req, res) => {
    const result = await flightApiService.getSectorAvailability(req.agentCredentials);
    
    res.json({
        success: true,
        data: result
    });
});

/**
 * Search flights
 */
exports.searchFlights = catchAsync(async (req, res) => {
    const searchParams = {
        origin: req.body.origin,
        destination: req.body.destination,
        travelDate: req.body.travelDate,
        returnDate: req.body.returnDate,
        adults: req.body.adults || 1,
        children: req.body.children || 0,
        infants: req.body.infants || 0,
        classOfTravel: req.body.classOfTravel || 0,
        tripType: req.body.tripType || 0,
        airlineFilters: req.body.airlines || [],
        seniorCitizen: req.body.seniorCitizen || false,
        studentFare: req.body.studentFare || false,
        defenceFare: req.body.defenceFare || false
    };

    const result = await flightApiService.searchFlights(req.agentCredentials, searchParams);

    // Calculate summary stats
    const allFlights = result.trips.flatMap(t => t.flights);
    const lowestFare = allFlights.length > 0 
        ? Math.min(...allFlights.map(f => f.fares[0]?.fareDetails[0]?.totalAmount || Infinity))
        : 0;

    res.json({
        success: true,
        data: {
            searchKey: result.searchKey,
            trips: result.trips,
            summary: {
                totalFlights: allFlights.length,
                lowestFare,
                searchParams
            }
        }
    });
});

/**
 * Reprice selected flights
 */
exports.repriceFlights = catchAsync(async (req, res) => {
    const { searchKey, selectedFlights } = req.body;

    const result = await flightApiService.repriceFlights(
        req.agentCredentials,
        searchKey,
        selectedFlights
    );

    res.json({
        success: true,
        data: result
    });
});

/**
 * Get SSR (ancillary services)
 */
exports.getSSR = catchAsync(async (req, res) => {
    const { searchKey, flightKey } = req.body;

    const result = await flightApiService.getSSR(
        req.agentCredentials,
        searchKey,
        flightKey
    );

    // Group SSR by type
    const groupedSSR = {};
    result.ssrFlights.forEach(flight => {
        flight.ssrOptions.forEach(ssr => {
            const typeName = ssr.ssrTypeName || 'OTHER';
            if (!groupedSSR[typeName]) {
                groupedSSR[typeName] = [];
            }
            groupedSSR[typeName].push(ssr);
        });
    });

    res.json({
        success: true,
        data: {
            raw: result,
            grouped: groupedSSR
        }
    });
});

/**
 * Get seat map
 */
exports.getSeatMap = catchAsync(async (req, res) => {
    const { searchKey, flightKey } = req.body;

    const result = await flightApiService.getSeatMap(
        req.agentCredentials,
        searchKey,
        flightKey
    );

    res.json({
        success: true,
        data: result
    });
});

/**
 * Get supported airlines list
 */
exports.getAirlines = catchAsync(async (req, res) => {
    res.json({
        success: true,
        data: airlinesData
    });
});

/**
 * Get airports list
 */
exports.getAirports = catchAsync(async (req, res) => {
    const { query } = req.query;
    
    let airports = airportsData;
    if (query) {
        const searchTerm = query.toLowerCase();
        airports = airportsData.filter(airport => 
            airport.code.toLowerCase().includes(searchTerm) ||
            airport.city.toLowerCase().includes(searchTerm) ||
            airport.name.toLowerCase().includes(searchTerm)
        );
    }

    res.json({
        success: true,
        data: airports.slice(0, 20) // Limit results
    });
});
