import React, { useState, useEffect } from 'react';
import useFlightStore from '../store/flightStore';
import useAuthStore from '../store/authStore';

// Fare type configuration with icons and colors
const FARE_TYPE_CONFIG = {
  REGULAR: { icon: '✈️', color: 'gray', bgColor: 'bg-gray-100', borderColor: 'border-gray-300' },
  STUDENT: { icon: '🎓', color: 'blue', bgColor: 'bg-blue-50', borderColor: 'border-blue-400' },
  SENIOR_CITIZEN: { icon: '👴', color: 'purple', bgColor: 'bg-purple-50', borderColor: 'border-purple-400' },
  ARMED_FORCES: { icon: '🎖️', color: 'green', bgColor: 'bg-green-50', borderColor: 'border-green-400' },
  DOCTOR_NURSE: { icon: '⚕️', color: 'red', bgColor: 'bg-red-50', borderColor: 'border-red-400' },
  GOVERNMENT: { icon: '🏛️', color: 'orange', bgColor: 'bg-orange-50', borderColor: 'border-orange-400' }
};

const FlightSearchPage = () => {
  const {
    searchParams,
    setSearchParams,
    searchFlights,
    isSearching,
    searchResults,
    fareTypeInfo,
    availableFareTypes,
    loadFareTypes,
    swapCities
  } = useFlightStore();

  const { agent } = useAuthStore();

  // Get agent preferences with defaults
  const agentPreferences = agent?.preferences || {
    defaultTripType: 'ONE_WAY',
    autoSelectTripType: true,
    fareDisplayMode: 'TOTAL',
    defaultClassOfTravel: 0,
    defaultAdults: 1,
    defaultChildren: 0,
    defaultInfants: 0,
    showFareBreakdown: true
  };

  // Map trip type from preferences
  const getInitialTripType = () => {
    switch (agentPreferences.defaultTripType) {
      case 'ROUND_TRIP': return 'roundtrip';
      case 'MULTI_CITY': return 'multicity';
      default: return 'oneway';
    }
  };

  const [tripType, setTripType] = useState(getInitialTripType());
  const [localParams, setLocalParams] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    adults: agentPreferences.defaultAdults || 1,
    children: agentPreferences.defaultChildren || 0,
    infants: agentPreferences.defaultInfants || 0,
    classOfTravel: ['economy', 'business', 'first'][agentPreferences.defaultClassOfTravel] || 'economy',
    fareType: 'REGULAR'
  });

  // Load fare types on component mount
  useEffect(() => {
    loadFareTypes();
  }, [loadFareTypes]);

  // Update defaults when agent preferences change
  useEffect(() => {
    if (agent?.preferences) {
      setTripType(getInitialTripType());
      setLocalParams(prev => ({
        ...prev,
        adults: agentPreferences.defaultAdults || prev.adults,
        children: agentPreferences.defaultChildren || prev.children,
        infants: agentPreferences.defaultInfants || prev.infants,
        classOfTravel: ['economy', 'business', 'first'][agentPreferences.defaultClassOfTravel] || prev.classOfTravel
      }));
    }
  }, [agent?.preferences]);

  // Popular airports
  const airports = [
    { code: 'DEL', city: 'New Delhi', name: 'Indira Gandhi International' },
    { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji' },
    { code: 'BLR', city: 'Bangalore', name: 'Kempegowda International' },
    { code: 'MAA', city: 'Chennai', name: 'Chennai International' },
    { code: 'CCU', city: 'Kolkata', name: 'Netaji Subhas Chandra Bose' },
    { code: 'HYD', city: 'Hyderabad', name: 'Rajiv Gandhi International' },
    { code: 'IXU', city: 'Aurangabad', name: 'Aurangabad Airport' },
    { code: 'GOI', city: 'Goa', name: 'Goa International' }
  ];

  // Get fare types from store or use defaults
  const fareTypes = availableFareTypes.length > 0 ? availableFareTypes : [
    { code: 'REGULAR', name: 'Regular', discount: null },
    { code: 'STUDENT', name: 'Student', discount: 'Up to 10% off' },
    { code: 'SENIOR_CITIZEN', name: 'Senior Citizen', discount: 'Up to 8% off' },
    { code: 'ARMED_FORCES', name: 'Armed Forces', discount: 'Up to 15% off' },
    { code: 'DOCTOR_NURSE', name: 'Doctor & Nurses', discount: 'Up to 10% off' }
  ];

  const handleSearch = async () => {
    // Auto-select trip type logic:
    // If round trip is selected but no return date, auto-select one way
    let effectiveTripType = tripType;
    if (tripType === 'roundtrip' && !localParams.returnDate && agentPreferences.autoSelectTripType) {
      effectiveTripType = 'oneway';
    }

    // Map local params to API format
    const apiParams = {
      origin: localParams.origin,
      destination: localParams.destination,
      travelDate: localParams.departureDate,
      returnDate: effectiveTripType === 'roundtrip' ? localParams.returnDate : undefined,
      adults: localParams.adults,
      children: localParams.children,
      infants: localParams.infants,
      classOfTravel: localParams.classOfTravel === 'economy' ? 0 : localParams.classOfTravel === 'business' ? 1 : 2,
      tripType: effectiveTripType === 'oneway' ? 0 : 1,
      fareType: localParams.fareType,
      // Include fare display preference for backend processing
      fareDisplayMode: agentPreferences.fareDisplayMode
    };

    setSearchParams(apiParams);

    try {
      await searchFlights();
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleSwapCities = () => {
    setLocalParams(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin
    }));
  };

  const handleFareTypeChange = (fareCode) => {
    setLocalParams(prev => ({ ...prev, fareType: fareCode }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700">
      {/* Search Box */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-2xl p-6">
          {/* Trip Type Tabs */}
          <div className="flex space-x-4 mb-6">
            {['oneway', 'roundtrip', 'multicity'].map((type) => (
              <button
                key={type}
                onClick={() => setTripType(type)}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  tripType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type === 'oneway' ? 'One Way' : type === 'roundtrip' ? 'Round Trip' : 'Multi City'}
              </button>
            ))}
          </div>

          {/* Search Form */}
          <div className="grid grid-cols-12 gap-4">
            {/* From */}
            <div className="col-span-3 relative">
              <label className="block text-sm font-medium text-gray-500 mb-1">FROM</label>
              <select
                value={localParams.origin}
                onChange={(e) => setLocalParams(prev => ({ ...prev, origin: e.target.value }))}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
              >
                <option value="">Select City</option>
                {airports.map(airport => (
                  <option key={airport.code} value={airport.code}>
                    {airport.city} ({airport.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="col-span-1 flex items-end justify-center pb-3">
              <button
                onClick={handleSwapCities}
                className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition"
              >
                ⇄
              </button>
            </div>

            {/* To */}
            <div className="col-span-3">
              <label className="block text-sm font-medium text-gray-500 mb-1">TO</label>
              <select
                value={localParams.destination}
                onChange={(e) => setLocalParams(prev => ({ ...prev, destination: e.target.value }))}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
              >
                <option value="">Select City</option>
                {airports.map(airport => (
                  <option key={airport.code} value={airport.code}>
                    {airport.city} ({airport.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Departure */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-500 mb-1">DEPARTURE</label>
              <input
                type="date"
                value={localParams.departureDate}
                onChange={(e) => setLocalParams(prev => ({ ...prev, departureDate: e.target.value }))}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Return */}
            {tripType === 'roundtrip' && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">RETURN</label>
                <input
                  type="date"
                  value={localParams.returnDate}
                  onChange={(e) => setLocalParams(prev => ({ ...prev, returnDate: e.target.value }))}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
            )}

            {/* Travellers & Class */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-500 mb-1">TRAVELLERS & CLASS</label>
              <div className="p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500">
                <div className="font-semibold">{localParams.adults + localParams.children + localParams.infants} Traveller(s)</div>
                <div className="text-sm text-gray-500 capitalize">{localParams.classOfTravel}</div>
              </div>
            </div>
          </div>

          {/* Special Fares Section */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-3">
              <span className="text-sm font-semibold text-gray-700 mr-2">Select Fare Type:</span>
              <span className="text-xs text-gray-500">(Special fares may offer additional discounts)</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {fareTypes.map((fare) => {
                const config = FARE_TYPE_CONFIG[fare.code] || FARE_TYPE_CONFIG.REGULAR;
                const isSelected = localParams.fareType === fare.code;

                return (
                  <button
                    key={fare.code}
                    onClick={() => handleFareTypeChange(fare.code)}
                    className={`flex items-center px-4 py-2 rounded-lg border-2 transition-all ${
                      isSelected
                        ? `${config.bgColor} ${config.borderColor} ring-2 ring-offset-1 ring-${config.color}-300`
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2 text-lg">{config.icon}</span>
                    <div className="text-left">
                      <div className={`font-medium text-sm ${isSelected ? `text-${config.color}-700` : 'text-gray-700'}`}>
                        {fare.name}
                      </div>
                      {fare.discount && (
                        <div className={`text-xs ${isSelected ? `text-${config.color}-600` : 'text-gray-500'}`}>
                          {fare.discount}
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <span className="ml-2 text-green-600">✓</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Fare type info tooltip */}
            {localParams.fareType !== 'REGULAR' && (
              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-xs text-yellow-700">
                  <strong>Note:</strong> {
                    localParams.fareType === 'STUDENT' ? 'Valid student ID required at check-in. Age: 12-26 years.' :
                    localParams.fareType === 'SENIOR_CITIZEN' ? 'Valid age proof required. Passenger must be 60+ years.' :
                    localParams.fareType === 'ARMED_FORCES' ? 'Defence ID card required at check-in.' :
                    localParams.fareType === 'DOCTOR_NURSE' ? 'Medical council registration or hospital ID required.' :
                    localParams.fareType === 'GOVERNMENT' ? 'Government ID and LTC certificate required.' :
                    'Special documentation may be required.'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Search Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleSearch}
              disabled={isSearching || !localParams.origin || !localParams.destination || !localParams.departureDate}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-12 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Searching {localParams.fareType !== 'REGULAR' ? `${fareTypes.find(f => f.code === localParams.fareType)?.name || ''} ` : ''}Fares...
                </span>
              ) : (
                'SEARCH FLIGHTS'
              )}
            </button>
          </div>
        </div>

        {/* Fare Type Info Banner (shown after search) */}
        {fareTypeInfo && (
          <FareTypeInfoBanner fareTypeInfo={fareTypeInfo} />
        )}

        {/* Search Results */}
        {searchResults && (
          <div className="mt-8">
            <FlightResults
              results={searchResults}
              fareTypeInfo={fareTypeInfo}
              fareDisplayMode={agentPreferences.fareDisplayMode}
              passengerCount={localParams.adults + localParams.children + localParams.infants}
              showFareBreakdown={agentPreferences.showFareBreakdown}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Fare Type Info Banner Component
const FareTypeInfoBanner = ({ fareTypeInfo }) => {
  if (!fareTypeInfo) return null;

  const { requested, applied, fallbackUsed, specialFaresAvailable, message } = fareTypeInfo;
  const config = FARE_TYPE_CONFIG[requested] || FARE_TYPE_CONFIG.REGULAR;

  if (fallbackUsed) {
    return (
      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center">
        <span className="text-2xl mr-3">⚠️</span>
        <div>
          <p className="font-medium text-amber-800">
            {message || `${fareTypeInfo.fareTypeDetails?.name} not available for this route`}
          </p>
          <p className="text-sm text-amber-600">
            Showing best available regular fares instead. Try different dates or routes for special fares.
          </p>
        </div>
      </div>
    );
  }

  if (specialFaresAvailable && requested !== 'REGULAR') {
    return (
      <div className={`mt-4 p-4 ${config.bgColor} border ${config.borderColor} rounded-lg flex items-center`}>
        <span className="text-2xl mr-3">{config.icon}</span>
        <div>
          <p className="font-medium text-gray-800">
            {message || `Showing ${fareTypeInfo.fareTypeDetails?.name}`}
          </p>
          <p className="text-sm text-gray-600">
            {fareTypeInfo.fareTypeDetails?.eligibility}
          </p>
        </div>
        <span className="ml-auto bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          Special Fare Applied
        </span>
      </div>
    );
  }

  return null;
};

// Flight Results Component
const FlightResults = ({ results, fareTypeInfo, fareDisplayMode = 'TOTAL', passengerCount = 1, showFareBreakdown = true }) => {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [sortBy, setSortBy] = useState('price');
  const [displayMode, setDisplayMode] = useState(fareDisplayMode);

  // Use mock data if no real data
  const flights = results.trips?.[0]?.flights || mockFlightResults.flights;

  // Calculate display fare based on mode
  const getDisplayFare = (price) => {
    if (displayMode === 'PER_PERSON') {
      return Math.round(price / passengerCount);
    }
    return price;
  };

  return (
    <div className="flex gap-6">
      {/* Filters Sidebar */}
      <div className="w-64 bg-white rounded-lg shadow-md p-4">
        <h3 className="font-bold mb-4">Filters</h3>

        {/* Fare Display Mode Toggle */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm text-gray-700 mb-2">Fare Display</h4>
          <div className="flex gap-2">
            <button
              onClick={() => setDisplayMode('TOTAL')}
              className={`flex-1 py-1 px-2 text-xs rounded ${
                displayMode === 'TOTAL' ? 'bg-blue-600 text-white' : 'bg-white border'
              }`}
            >
              Total
            </button>
            <button
              onClick={() => setDisplayMode('PER_PERSON')}
              className={`flex-1 py-1 px-2 text-xs rounded ${
                displayMode === 'PER_PERSON' ? 'bg-blue-600 text-white' : 'bg-white border'
              }`}
            >
              Per Person
            </button>
          </div>
        </div>

        {/* Fare Type Filter Info */}
        {fareTypeInfo && fareTypeInfo.requested !== 'REGULAR' && (
          <div className="mb-4 p-2 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-sm text-blue-800 mb-1">Active Fare Type</h4>
            <p className="text-xs text-blue-600">
              {fareTypeInfo.fareTypeDetails?.name}
              {fareTypeInfo.fallbackUsed && ' (Unavailable)'}
            </p>
          </div>
        )}

        {/* Stops Filter */}
        <div className="mb-4">
          <h4 className="font-medium mb-2">Stops</h4>
          {['Non-stop', '1 Stop', '2+ Stops'].map((stop) => (
            <label key={stop} className="flex items-center mb-1">
              <input type="checkbox" className="mr-2" />
              {stop}
            </label>
          ))}
        </div>

        {/* Airlines Filter */}
        <div className="mb-4">
          <h4 className="font-medium mb-2">Airlines</h4>
          {['IndiGo', 'SpiceJet', 'Air India', 'Vistara', 'Go First'].map((airline) => (
            <label key={airline} className="flex items-center mb-1">
              <input type="checkbox" className="mr-2" />
              {airline}
            </label>
          ))}
        </div>

        {/* Price Range */}
        <div className="mb-4">
          <h4 className="font-medium mb-2">Price Range</h4>
          <input
            type="range"
            min="0"
            max="50000"
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>₹0</span>
            <span>₹50,000</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1">
        {/* Sort Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Found {flights?.length || 0} flights
            {fareTypeInfo?.specialFaresAvailable && (
              <span className="ml-2 text-green-600 font-medium">
                • Special fares available
              </span>
            )}
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setSortBy('price')}
              className={`px-4 py-2 rounded ${sortBy === 'price' ? 'bg-blue-100 text-blue-600' : ''}`}
            >
              Cheapest
            </button>
            <button
              onClick={() => setSortBy('duration')}
              className={`px-4 py-2 rounded ${sortBy === 'duration' ? 'bg-blue-100 text-blue-600' : ''}`}
            >
              Fastest
            </button>
            <button
              onClick={() => setSortBy('departure')}
              className={`px-4 py-2 rounded ${sortBy === 'departure' ? 'bg-blue-100 text-blue-600' : ''}`}
            >
              Departure
            </button>
          </div>
        </div>

        {/* Flight Cards */}
        {flights?.map((flight, index) => (
          <FlightCard
            key={index}
            flight={flight}
            isSelected={selectedFlight === index}
            onSelect={() => setSelectedFlight(index)}
            fareTypeInfo={fareTypeInfo}
            displayMode={displayMode}
            passengerCount={passengerCount}
            showFareBreakdown={showFareBreakdown}
          />
        ))}
      </div>
    </div>
  );
};

// Individual Flight Card
const FlightCard = ({ flight, isSelected, onSelect, fareTypeInfo, displayMode = 'TOTAL', passengerCount = 1, showFareBreakdown = true }) => {
  const isSpecialFare = fareTypeInfo?.specialFaresAvailable && fareTypeInfo?.requested !== 'REGULAR';
  const config = isSpecialFare ? FARE_TYPE_CONFIG[fareTypeInfo.requested] : null;

  // Calculate display fare based on mode
  const totalFare = flight.price || 0;
  const displayFare = displayMode === 'PER_PERSON' ? Math.round(totalFare / passengerCount) : totalFare;
  const fareLabel = displayMode === 'PER_PERSON' ? 'per person' : `total (${passengerCount} pax)`;

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 mb-4 cursor-pointer transition ${
        isSelected ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'
      } ${isSpecialFare ? `border-l-4 ${config?.borderColor}` : ''}`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        {/* Airline Info */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
            {flight.airlineCode}
          </div>
          <div>
            <div className="font-medium">{flight.airlineName}</div>
            <div className="text-sm text-gray-500">{flight.flightNumber}</div>
          </div>
        </div>

        {/* Time & Route */}
        <div className="flex items-center space-x-8">
          <div className="text-center">
            <div className="text-xl font-bold">{flight.departureTime}</div>
            <div className="text-sm text-gray-500">{flight.origin}</div>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-500">{flight.duration}</div>
            <div className="w-24 h-0.5 bg-gray-300 relative my-1">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
            <div className="text-xs text-green-600">{flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop`}</div>
          </div>

          <div className="text-center">
            <div className="text-xl font-bold">{flight.arrivalTime}</div>
            <div className="text-sm text-gray-500">{flight.destination}</div>
          </div>
        </div>

        {/* Price */}
        <div className="text-right">
          {isSpecialFare && (
            <div className="flex items-center justify-end mb-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${config?.bgColor} ${config?.borderColor} border`}>
                {config?.icon} {fareTypeInfo.fareTypeDetails?.name}
              </span>
            </div>
          )}
          <div className="text-2xl font-bold text-blue-600">₹{displayFare?.toLocaleString()}</div>
          <div className="text-sm text-gray-500">{fareLabel}</div>
          {displayMode === 'PER_PERSON' && passengerCount > 1 && (
            <div className="text-xs text-gray-400">Total: ₹{totalFare?.toLocaleString()}</div>
          )}
          {isSpecialFare && fareTypeInfo.fareTypeDetails?.discount && (
            <div className="text-xs text-green-600 font-medium">
              {fareTypeInfo.fareTypeDetails.discount}
            </div>
          )}
          <button className="mt-2 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">
            Book Now
          </button>
        </div>
      </div>

      {/* Expandable Details */}
      {isSelected && (
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Baggage:</span>
              <span className="ml-2">{flight.baggage}</span>
            </div>
            <div>
              <span className="text-gray-500">Refundable:</span>
              <span className={`ml-2 ${flight.refundable ? 'text-green-600' : 'text-red-600'}`}>
                {flight.refundable ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Seats Available:</span>
              <span className="ml-2">{flight.seatsAvailable}</span>
            </div>
            {isSpecialFare && (
              <div>
                <span className="text-gray-500">Fare Type:</span>
                <span className="ml-2 text-green-600 font-medium">
                  {fareTypeInfo.fareTypeDetails?.name}
                </span>
              </div>
            )}
          </div>
          {isSpecialFare && fareTypeInfo.fareTypeDetails?.documentsRequired?.length > 0 && (
            <div className="mt-3 p-2 bg-yellow-50 rounded-md">
              <p className="text-xs text-yellow-700">
                <strong>Required Documents:</strong> {fareTypeInfo.fareTypeDetails.documentsRequired.join(', ')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Mock flight results for demo
const mockFlightResults = {
  flights: [
    {
      airlineCode: '6E',
      airlineName: 'IndiGo',
      flightNumber: '6E-6474',
      origin: 'DEL',
      destination: 'BOM',
      departureTime: '06:00',
      arrivalTime: '08:15',
      duration: '2h 15m',
      stops: 0,
      price: 4599,
      baggage: '15 KG + 7 KG',
      refundable: true,
      seatsAvailable: 9
    },
    {
      airlineCode: 'SG',
      airlineName: 'SpiceJet',
      flightNumber: 'SG-8721',
      origin: 'DEL',
      destination: 'BOM',
      departureTime: '07:30',
      arrivalTime: '09:50',
      duration: '2h 20m',
      stops: 0,
      price: 3899,
      baggage: '15 KG + 7 KG',
      refundable: false,
      seatsAvailable: 5
    },
    {
      airlineCode: 'AI',
      airlineName: 'Air India',
      flightNumber: 'AI-865',
      origin: 'DEL',
      destination: 'BOM',
      departureTime: '09:00',
      arrivalTime: '11:30',
      duration: '2h 30m',
      stops: 0,
      price: 5299,
      baggage: '25 KG + 7 KG',
      refundable: true,
      seatsAvailable: 12
    },
    {
      airlineCode: 'UK',
      airlineName: 'Vistara',
      flightNumber: 'UK-945',
      origin: 'DEL',
      destination: 'BOM',
      departureTime: '14:15',
      arrivalTime: '16:30',
      duration: '2h 15m',
      stops: 0,
      price: 6199,
      baggage: '15 KG + 7 KG',
      refundable: true,
      seatsAvailable: 7
    }
  ]
};

export default FlightSearchPage;
