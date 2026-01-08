import React, { useState } from 'react';

const FlightSearchPage = () => {
  const [tripType, setTripType] = useState('roundtrip');
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    classOfTravel: 'economy',
    directFlight: false,
    specialFare: ''
  });

  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleSearch = async () => {
    setLoading(true);
    try {
      // In real app, call API
      // const response = await flightService.search(searchParams);
      // setSearchResults(response.data);
      
      // Mock response for demo
      setTimeout(() => {
        setSearchResults(mockFlightResults);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Search failed:', error);
      setLoading(false);
    }
  };

  const swapCities = () => {
    setSearchParams(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin
    }));
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
                value={searchParams.origin}
                onChange={(e) => setSearchParams(prev => ({ ...prev, origin: e.target.value }))}
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
                onClick={swapCities}
                className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition"
              >
                ⇄
              </button>
            </div>

            {/* To */}
            <div className="col-span-3">
              <label className="block text-sm font-medium text-gray-500 mb-1">TO</label>
              <select
                value={searchParams.destination}
                onChange={(e) => setSearchParams(prev => ({ ...prev, destination: e.target.value }))}
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
                value={searchParams.departureDate}
                onChange={(e) => setSearchParams(prev => ({ ...prev, departureDate: e.target.value }))}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Return */}
            {tripType === 'roundtrip' && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">RETURN</label>
                <input
                  type="date"
                  value={searchParams.returnDate}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, returnDate: e.target.value }))}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
            )}

            {/* Travellers & Class */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-500 mb-1">TRAVELLERS & CLASS</label>
              <div className="p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500">
                <div className="font-semibold">{searchParams.adults + searchParams.children + searchParams.infants} Traveller(s)</div>
                <div className="text-sm text-gray-500 capitalize">{searchParams.classOfTravel}</div>
              </div>
            </div>
          </div>

          {/* Special Fares */}
          <div className="flex space-x-4 mt-4">
            <span className="text-sm text-gray-500">Special Fares:</span>
            {['Regular', 'Student', 'Senior Citizen', 'Armed Forces', 'Doctor & Nurses'].map((fare) => (
              <label key={fare} className="flex items-center text-sm">
                <input
                  type="radio"
                  name="specialFare"
                  value={fare.toLowerCase()}
                  checked={searchParams.specialFare === fare.toLowerCase()}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, specialFare: e.target.value }))}
                  className="mr-1"
                />
                {fare}
              </label>
            ))}
          </div>

          {/* Search Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleSearch}
              disabled={loading || !searchParams.origin || !searchParams.destination || !searchParams.departureDate}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-12 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Searching...
                </span>
              ) : (
                'SEARCH FLIGHTS'
              )}
            </button>
          </div>
        </div>

        {/* Search Results */}
        {searchResults && (
          <div className="mt-8">
            <FlightResults results={searchResults} />
          </div>
        )}
      </div>
    </div>
  );
};

// Flight Results Component
const FlightResults = ({ results }) => {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [sortBy, setSortBy] = useState('price');
  const [filters, setFilters] = useState({
    stops: [],
    airlines: [],
    priceRange: [0, 50000]
  });

  return (
    <div className="flex gap-6">
      {/* Filters Sidebar */}
      <div className="w-64 bg-white rounded-lg shadow-md p-4">
        <h3 className="font-bold mb-4">Filters</h3>
        
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
            Found {results.flights?.length || 0} flights
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
        {results.flights?.map((flight, index) => (
          <FlightCard
            key={index}
            flight={flight}
            isSelected={selectedFlight === index}
            onSelect={() => setSelectedFlight(index)}
          />
        ))}
      </div>
    </div>
  );
};

// Individual Flight Card
const FlightCard = ({ flight, isSelected, onSelect }) => (
  <div
    className={`bg-white rounded-lg shadow-md p-4 mb-4 cursor-pointer transition ${
      isSelected ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'
    }`}
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
        <div className="text-2xl font-bold text-blue-600">₹{flight.price.toLocaleString()}</div>
        <div className="text-sm text-gray-500">per adult</div>
        <button className="mt-2 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">
          Book Now
        </button>
      </div>
    </div>

    {/* Expandable Details */}
    {isSelected && (
      <div className="mt-4 pt-4 border-t">
        <div className="grid grid-cols-3 gap-4 text-sm">
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
        </div>
      </div>
    )}
  </div>
);

// Mock flight results
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
