const flightApiService = require('../services/flight-api.service');
const { catchAsync } = require('../utils/catchAsync');
const { airportsData, airlinesData } = require('../utils/staticData');
const { getFareType, getFareTypeApiParams, getAllFareTypes } = require('../config/fareTypes');

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
 * Get available fare types
 */
exports.getFareTypes = catchAsync(async (req, res) => {
    res.json({
        success: true,
        data: getAllFareTypes()
    });
});

/**
 * Search flights with special fare support and automatic fallback
 */
exports.searchFlights = catchAsync(async (req, res) => {
    const requestedFareType = req.body.fareType || 'REGULAR';
    const fareTypeConfig = getFareType(requestedFareType);
    const fareTypeApiParams = getFareTypeApiParams(requestedFareType);

    const baseSearchParams = {
        origin: req.body.origin,
        destination: req.body.destination,
        travelDate: req.body.travelDate,
        returnDate: req.body.returnDate,
        adults: req.body.adults || 1,
        children: req.body.children || 0,
        infants: req.body.infants || 0,
        classOfTravel: req.body.classOfTravel || 0,
        tripType: req.body.tripType || 0,
        airlineFilters: req.body.airlines || []
    };

    // Merge fare type API params
    const searchParams = {
        ...baseSearchParams,
        ...fareTypeApiParams
    };

    let result;
    let appliedFareType = requestedFareType;
    let fallbackUsed = false;
    let specialFaresFound = false;

    // First, try searching with the requested special fare type
    if (requestedFareType !== 'REGULAR') {
        try {
            result = await flightApiService.searchFlights(req.agentCredentials, searchParams);

            // Check if special fares were actually returned
            const allFlights = result.trips.flatMap(t => t.flights);
            specialFaresFound = allFlights.some(flight =>
                flight.fares?.some(fare =>
                    fare.fareType && fare.fareType.toLowerCase().includes(requestedFareType.toLowerCase().replace('_', ''))
                )
            );

            // If no special fares found or no flights at all, fallback to regular
            if (allFlights.length === 0 || !specialFaresFound) {
                fallbackUsed = true;
                appliedFareType = 'REGULAR';

                // Search again with regular fare
                const regularParams = {
                    ...baseSearchParams,
                    seniorCitizen: false,
                    studentFare: false,
                    defenceFare: false,
                    doctorNurseFare: false,
                    governmentFare: false
                };
                result = await flightApiService.searchFlights(req.agentCredentials, regularParams);
            }
        } catch (error) {
            // If special fare search fails, fallback to regular
            fallbackUsed = true;
            appliedFareType = 'REGULAR';

            const regularParams = {
                ...baseSearchParams,
                seniorCitizen: false,
                studentFare: false,
                defenceFare: false,
                doctorNurseFare: false,
                governmentFare: false
            };
            result = await flightApiService.searchFlights(req.agentCredentials, regularParams);
        }
    } else {
        // Regular fare search
        result = await flightApiService.searchFlights(req.agentCredentials, searchParams);
    }

    // Calculate summary stats
    const allFlights = result.trips.flatMap(t => t.flights);
    const lowestFare = allFlights.length > 0
        ? Math.min(...allFlights.map(f => f.fares[0]?.fareDetails[0]?.totalAmount || Infinity))
        : 0;

    // Mark flights with their fare type info
    const enhancedTrips = result.trips.map(trip => ({
        ...trip,
        flights: trip.flights.map(flight => ({
            ...flight,
            fares: flight.fares?.map(fare => ({
                ...fare,
                specialFareType: specialFaresFound ? requestedFareType : null,
                isSpecialFare: specialFaresFound && fare.fareType,
                fareTypeInfo: specialFaresFound ? fareTypeConfig : null
            }))
        }))
    }));

    res.json({
        success: true,
        data: {
            searchKey: result.searchKey,
            trips: enhancedTrips,
            fareTypeInfo: {
                requested: requestedFareType,
                applied: appliedFareType,
                fallbackUsed,
                specialFaresAvailable: specialFaresFound,
                fareTypeDetails: fareTypeConfig,
                message: fallbackUsed
                    ? `${fareTypeConfig.name} not available for this route. Showing best regular fares.`
                    : specialFaresFound
                        ? `Showing ${fareTypeConfig.name} - ${fareTypeConfig.discount || 'Special rates applied'}`
                        : null
            },
            summary: {
                totalFlights: allFlights.length,
                lowestFare,
                searchParams: {
                    ...baseSearchParams,
                    fareType: requestedFareType
                }
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
