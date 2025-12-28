import { create } from 'zustand';
import { flightApi } from '../services/api';

const useFlightStore = create((set, get) => ({
  // Search state
  searchParams: null,
  searchResults: null,
  searchKey: null,
  isSearching: false,
  searchError: null,

  // Selected flight state
  selectedFlights: [],
  repriceData: null,
  isRepricing: false,

  // SSR state
  ssrData: null,
  selectedSSR: [],
  isLoadingSSR: false,

  // Seat map state
  seatMapData: null,
  selectedSeats: [],
  isLoadingSeatMap: false,

  // Static data
  airlines: [],
  airports: [],
  sectors: [],

  // Fare types
  availableFareTypes: [],
  fareTypeInfo: {
    REGULAR: { name: 'Regular', description: 'Standard fares for all passengers' },
    ARMED_FORCES: { name: 'Armed Forces', description: 'Special fares for defense personnel' },
    STUDENT: { name: 'Student', description: 'Discounted fares for students with valid ID' },
    SENIOR_CITIZEN: { name: 'Senior Citizen', description: 'Special fares for passengers 60+' },
    DOCTORS_NURSES: { name: 'Doctors & Nurses', description: 'Healthcare professional fares' },
  },
  isLoadingFareTypes: false,

  // Actions
  setSearchParams: (params) => set({ searchParams: params }),

  searchFlights: async (params) => {
    set({ isSearching: true, searchError: null, searchResults: null });
    try {
      const response = await flightApi.search(params);
      set({
        searchResults: response.data || response,
        searchKey: response.data?.searchKey || response.searchKey,
        searchParams: params,
        isSearching: false,
      });
      return { success: true, data: response };
    } catch (error) {
      const message = error?.error || error?.message || 'Search failed';
      set({ searchError: message, isSearching: false });
      return { success: false, error: message };
    }
  },

  selectFlight: (flight) => {
    const { selectedFlights } = get();
    const exists = selectedFlights.find(f => f.flightKey === flight.flightKey);
    if (!exists) {
      set({ selectedFlights: [...selectedFlights, flight] });
    }
  },

  deselectFlight: (flightKey) => {
    const { selectedFlights } = get();
    set({ selectedFlights: selectedFlights.filter(f => f.flightKey !== flightKey) });
  },

  clearSelectedFlights: () => set({ selectedFlights: [] }),

  repriceFlights: async () => {
    const { searchKey, selectedFlights } = get();
    if (!searchKey || selectedFlights.length === 0) return { success: false };

    set({ isRepricing: true });
    try {
      const response = await flightApi.reprice(searchKey, selectedFlights);
      set({
        repriceData: response.data || response,
        isRepricing: false,
      });
      return { success: true, data: response };
    } catch (error) {
      set({ isRepricing: false });
      return { success: false, error: error?.error || 'Reprice failed' };
    }
  },

  getSSR: async () => {
    const { searchKey, repriceData } = get();
    const flightKey = repriceData?.flightKey;
    if (!searchKey || !flightKey) return { success: false };

    set({ isLoadingSSR: true });
    try {
      const response = await flightApi.getSSR(searchKey, flightKey);
      set({
        ssrData: response.data || response,
        isLoadingSSR: false,
      });
      return { success: true, data: response };
    } catch (error) {
      set({ isLoadingSSR: false });
      return { success: false, error: error?.error || 'Failed to load SSR' };
    }
  },

  selectSSR: (ssr) => {
    const { selectedSSR } = get();
    set({ selectedSSR: [...selectedSSR, ssr] });
  },

  deselectSSR: (ssrCode) => {
    const { selectedSSR } = get();
    set({ selectedSSR: selectedSSR.filter(s => s.code !== ssrCode) });
  },

  getSeatMap: async () => {
    const { searchKey, repriceData } = get();
    const flightKey = repriceData?.flightKey;
    if (!searchKey || !flightKey) return { success: false };

    set({ isLoadingSeatMap: true });
    try {
      const response = await flightApi.getSeatMap(searchKey, flightKey);
      set({
        seatMapData: response.data || response,
        isLoadingSeatMap: false,
      });
      return { success: true, data: response };
    } catch (error) {
      set({ isLoadingSeatMap: false });
      return { success: false, error: error?.error || 'Failed to load seat map' };
    }
  },

  selectSeat: (seat) => {
    const { selectedSeats } = get();
    set({ selectedSeats: [...selectedSeats, seat] });
  },

  deselectSeat: (seatNumber) => {
    const { selectedSeats } = get();
    set({ selectedSeats: selectedSeats.filter(s => s.seatNumber !== seatNumber) });
  },

  loadAirlines: async () => {
    try {
      const response = await flightApi.getAirlines();
      set({ airlines: response.data || response || [] });
    } catch (error) {
      console.error('Failed to load airlines:', error);
    }
  },

  loadAirports: async () => {
    try {
      const response = await flightApi.getAirports('');
      set({ airports: response.data || response || [] });
    } catch (error) {
      console.error('Failed to load airports:', error);
    }
  },

  searchAirports: async (query) => {
    try {
      const response = await flightApi.getAirports(query);
      return response.data || response || [];
    } catch (error) {
      console.error('Failed to search airports:', error);
      return [];
    }
  },

  loadSectors: async () => {
    try {
      const response = await flightApi.getSectors();
      set({ sectors: response.data || response || [] });
    } catch (error) {
      console.error('Failed to load sectors:', error);
    }
  },

  loadFareTypes: async () => {
    set({ isLoadingFareTypes: true });
    try {
      const response = await flightApi.getFareTypes();
      const fareTypes = response.data || response || [];
      set({
        availableFareTypes: fareTypes,
        isLoadingFareTypes: false
      });
    } catch (error) {
      console.error('Failed to load fare types:', error);
      // Set default fare types on error
      set({
        availableFareTypes: [
          { code: 'REGULAR', name: 'Regular', description: 'Standard fares' },
          { code: 'ARMED_FORCES', name: 'Armed Forces', description: 'Defense personnel fares' },
          { code: 'STUDENT', name: 'Student', description: 'Student fares' },
          { code: 'SENIOR_CITIZEN', name: 'Senior Citizen', description: 'Senior citizen fares' },
        ],
        isLoadingFareTypes: false
      });
    }
  },

  swapCities: () => {
    const { searchParams } = get();
    if (searchParams) {
      set({
        searchParams: {
          ...searchParams,
          origin: searchParams.destination,
          destination: searchParams.origin,
        }
      });
    }
  },

  // Reset all state
  reset: () => set({
    searchParams: null,
    searchResults: null,
    searchKey: null,
    isSearching: false,
    searchError: null,
    selectedFlights: [],
    repriceData: null,
    isRepricing: false,
    ssrData: null,
    selectedSSR: [],
    isLoadingSSR: false,
    seatMapData: null,
    selectedSeats: [],
    isLoadingSeatMap: false,
  }),
}));

export default useFlightStore;
