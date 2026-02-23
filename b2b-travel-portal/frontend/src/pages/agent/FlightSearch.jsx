import React, { useState } from 'react';
import { Plane, Calendar, Users, Search, ArrowRightLeft } from 'lucide-react';
import DatePicker from 'react-datepicker';
import toast from 'react-hot-toast';
import { flightAPI } from '../../services/api';
import 'react-datepicker/dist/react-datepicker.css';

const FlightSearch = () => {
  const [tripType, setTripType] = useState('oneWay');
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    departureDate: new Date(),
    returnDate: null,
    adults: 1,
    children: 0,
    infants: 0,
    cabinClass: 'ECONOMY',
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const response = await flightAPI.search({
        ...searchParams,
        tripType,
      });
      setResults(response.data.flights || []);
    } catch (error) {
      toast.error('Failed to search flights');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const swapCities = () => {
    setSearchParams(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Search Flights</h1>
        <p className="text-gray-500">Find the best flights for your customers</p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {/* Trip Type */}
        <div className="flex gap-4 mb-6">
          {['oneWay', 'roundTrip'].map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={tripType === type}
                onChange={() => setTripType(type)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-gray-700">
                {type === 'oneWay' ? 'One Way' : 'Round Trip'}
              </span>
            </label>
          ))}
        </div>

        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Origin */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <div className="relative">
                <Plane className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="City or Airport"
                  value={searchParams.origin}
                  onChange={(e) => setSearchParams({ ...searchParams, origin: e.target.value.toUpperCase() })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="hidden md:flex items-end justify-center pb-3">
              <button
                type="button"
                onClick={swapCities}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <ArrowRightLeft className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Destination */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <div className="relative">
                <Plane className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 rotate-90" />
                <input
                  type="text"
                  placeholder="City or Airport"
                  value={searchParams.destination}
                  onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value.toUpperCase() })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Departure Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departure</label>
              <DatePicker
                selected={searchParams.departureDate}
                onChange={(date) => setSearchParams({ ...searchParams, departureDate: date })}
                minDate={new Date()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                dateFormat="dd MMM yyyy"
              />
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Return Date (if round trip) */}
            {tripType === 'roundTrip' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Return</label>
                <DatePicker
                  selected={searchParams.returnDate}
                  onChange={(date) => setSearchParams({ ...searchParams, returnDate: date })}
                  minDate={searchParams.departureDate}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  dateFormat="dd MMM yyyy"
                />
              </div>
            )}

            {/* Passengers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
              <select
                value={searchParams.adults}
                onChange={(e) => setSearchParams({ ...searchParams, adults: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <option key={n} value={n}>{n} Adult{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            {/* Cabin Class */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <select
                value={searchParams.cabinClass}
                onChange={(e) => setSearchParams({ ...searchParams, cabinClass: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="ECONOMY">Economy</option>
                <option value="PREMIUM_ECONOMY">Premium Economy</option>
                <option value="BUSINESS">Business</option>
                <option value="FIRST">First Class</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                {loading ? 'Searching...' : 'Search Flights'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Search Results */}
      {searched && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">
            {results.length > 0 ? `${results.length} Flights Found` : 'No Flights Found'}
          </h2>

          {results.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Plane className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No flights available for the selected route and date.</p>
              <p className="text-sm mt-2">Try different dates or destinations.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((flight) => (
                <div
                  key={flight.id}
                  className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-xs font-bold">{flight.airline}</span>
                      </div>
                      <div>
                        <p className="font-semibold">{flight.departureTime}</p>
                        <p className="text-sm text-gray-500">{flight.origin}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-400">{flight.duration}</p>
                        <div className="w-24 h-px bg-gray-300 relative">
                          <Plane className="w-4 h-4 text-blue-500 absolute -top-2 right-0" />
                        </div>
                        <p className="text-xs text-gray-400">{flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`}</p>
                      </div>
                      <div>
                        <p className="font-semibold">{flight.arrivalTime}</p>
                        <p className="text-sm text-gray-500">{flight.destination}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        ₹{flight.price?.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">per person</p>
                      <button className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlightSearch;
