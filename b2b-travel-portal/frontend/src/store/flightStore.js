import { create } from 'zustand';
import { flightApi } from '../services/api';

/**
 * Flight Store
 * Manages flight search and booking state
 */
const useFlightStore = create((set, get) => ({
    // Search State
    searchParams: {
        origin: '',
        destination: '',
        travelDate: '',
        returnDate: '',
        adults: 1,
        children: 0,
        infants: 0,
        classOfTravel: 0,
        tripType: 0,
        airlines: [],
        fareType: 'REGULAR'
    },
    searchResults: null,
    searchKey: null,
    isSearching: false,
    searchError: null,
    fareTypeInfo: null,

    // Available fare types
    availableFareTypes: [],
    isLoadingFareTypes: false,

    // Selected Flight State
    selectedFlights: [],
    repriceResults: null,
    isRepricing: false,
    repriceError: null,

    // SSR State
    ssrOptions: null,
    selectedSSR: [],
    isLoadingSSR: false,

    // Seat Map State
    seatMap: null,
    selectedSeats: [],
    isLoadingSeatMap: false,

    // Static Data
    airports: [],
    airlines: [],

    // Actions
    setSearchParams: (params) => {
        set((state) => ({
            searchParams: { ...state.searchParams, ...params }
        }));
    },

    loadFareTypes: async () => {
        set({ isLoadingFareTypes: true });
        try {
            const response = await flightApi.getFareTypes();
            set({
                availableFareTypes: response.data,
                isLoadingFareTypes: false
            });
            return response.data;
        } catch (error) {
            set({ isLoadingFareTypes: false });
            // Default fare types if API fails
            set({
                availableFareTypes: [
                    { code: 'REGULAR', name: 'Regular Fare', discount: null },
                    { code: 'STUDENT', name: 'Student Fare', discount: 'Up to 10% off' },
                    { code: 'SENIOR_CITIZEN', name: 'Senior Citizen', discount: 'Up to 8% off' },
                    { code: 'ARMED_FORCES', name: 'Armed Forces', discount: 'Up to 15% off' },
                    { code: 'DOCTOR_NURSE', name: 'Doctor & Nurses', discount: 'Up to 10% off' }
                ]
            });
        }
    },

    searchFlights: async () => {
        const { searchParams } = get();
        set({ isSearching: true, searchError: null, searchResults: null, fareTypeInfo: null });

        try {
            const response = await flightApi.search(searchParams);
            set({
                searchResults: response.data,
                searchKey: response.data.searchKey,
                fareTypeInfo: response.data.fareTypeInfo,
                isSearching: false
            });
            return response.data;
        } catch (error) {
            set({
                isSearching: false,
                searchError: error.error || 'Search failed'
            });
            throw error;
        }
    },

    selectFlight: (tripId, flight, fare) => {
        set((state) => {
            const newSelections = [...state.selectedFlights];
            const existingIndex = newSelections.findIndex(s => s.tripId === tripId);

            const selection = {
                tripId,
                flightId: flight.flightId,
                fareId: fare.fareId,
                flight,
                fare
            };

            if (existingIndex >= 0) {
                newSelections[existingIndex] = selection;
            } else {
                newSelections.push(selection);
            }

            return { selectedFlights: newSelections };
        });
    },

    clearSelectedFlights: () => {
        set({ selectedFlights: [], repriceResults: null });
    },

    repriceFlights: async () => {
        const { searchKey, selectedFlights } = get();
        if (!searchKey || selectedFlights.length === 0) {
            return;
        }

        set({ isRepricing: true, repriceError: null });

        try {
            const flightsToReprice = selectedFlights.map(s => ({
                flightId: s.flightId,
                fareId: s.fareId
            }));

            const response = await flightApi.reprice(searchKey, flightsToReprice);
            set({
                repriceResults: response.data,
                isRepricing: false
            });
            return response.data;
        } catch (error) {
            set({
                isRepricing: false,
                repriceError: error.error || 'Reprice failed'
            });
            throw error;
        }
    },

    loadSSR: async (flightKey) => {
        const { searchKey } = get();
        if (!searchKey) return;

        set({ isLoadingSSR: true });

        try {
            const response = await flightApi.getSSR(searchKey, flightKey);
            set({
                ssrOptions: response.data,
                isLoadingSSR: false
            });
            return response.data;
        } catch (error) {
            set({ isLoadingSSR: false });
            throw error;
        }
    },

    selectSSR: (paxId, ssrKey) => {
        set((state) => {
            const newSelections = [...state.selectedSSR];
            const existing = newSelections.find(s => s.paxId === paxId && s.ssrKey === ssrKey);

            if (existing) {
                return {
                    selectedSSR: newSelections.filter(s => !(s.paxId === paxId && s.ssrKey === ssrKey))
                };
            } else {
                return {
                    selectedSSR: [...newSelections, { paxId, ssrKey }]
                };
            }
        });
    },

    loadSeatMap: async (flightKey) => {
        const { searchKey } = get();
        if (!searchKey) return;

        set({ isLoadingSeatMap: true });

        try {
            const response = await flightApi.getSeatMap(searchKey, flightKey);
            set({
                seatMap: response.data,
                isLoadingSeatMap: false
            });
            return response.data;
        } catch (error) {
            set({ isLoadingSeatMap: false });
            throw error;
        }
    },

    selectSeat: (paxId, seatNumber) => {
        set((state) => {
            const newSeats = state.selectedSeats.filter(s => s.paxId !== paxId);
            return {
                selectedSeats: [...newSeats, { paxId, seatNumber }]
            };
        });
    },

    loadAirports: async () => {
        try {
            const response = await flightApi.getAirports();
            set({ airports: response.data });
        } catch (error) {
            console.error('Failed to load airports:', error);
        }
    },

    loadAirlines: async () => {
        try {
            const response = await flightApi.getAirlines();
            set({ airlines: response.data });
        } catch (error) {
            console.error('Failed to load airlines:', error);
        }
    },

    resetSearch: () => {
        set({
            searchResults: null,
            searchKey: null,
            selectedFlights: [],
            repriceResults: null,
            ssrOptions: null,
            selectedSSR: [],
            seatMap: null,
            selectedSeats: [],
            searchError: null,
            repriceError: null,
            fareTypeInfo: null
        });
    },

    swapCities: () => {
        set((state) => ({
            searchParams: {
                ...state.searchParams,
                origin: state.searchParams.destination,
                destination: state.searchParams.origin
            }
        }));
    }
}));

export default useFlightStore;
