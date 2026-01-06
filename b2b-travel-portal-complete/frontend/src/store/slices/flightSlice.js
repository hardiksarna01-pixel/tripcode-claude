/**
 * Flight Redux Slice
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { flightAPI } from '../../services/api';

export const searchFlights = createAsyncThunk(
    'flights/search',
    async (searchParams, { rejectWithValue }) => {
        try {
            const response = await flightAPI.search(searchParams);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Search failed');
        }
    }
);

export const repriceFllight = createAsyncThunk(
    'flights/reprice',
    async ({ searchKey, flightKey }, { rejectWithValue }) => {
        try {
            const response = await flightAPI.reprice({ searchKey, flightKey });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Reprice failed');
        }
    }
);

const initialState = {
    searchParams: null,
    searchKey: null,
    flights: [],
    filters: null,
    selectedFlight: null,
    repriceResult: null,
    loading: false,
    repricing: false,
    error: null
};

const flightSlice = createSlice({
    name: 'flights',
    initialState,
    reducers: {
        setSearchParams: (state, action) => {
            state.searchParams = action.payload;
        },
        selectFlight: (state, action) => {
            state.selectedFlight = action.payload;
        },
        clearFlights: (state) => {
            state.flights = [];
            state.searchKey = null;
            state.selectedFlight = null;
            state.repriceResult = null;
            state.error = null;
        },
        applyFilters: (state, action) => {
            // Filter logic would go here
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchFlights.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchFlights.fulfilled, (state, action) => {
                state.loading = false;
                state.flights = action.payload.flights;
                state.searchKey = action.payload.searchKey;
                state.filters = action.payload.filters;
            })
            .addCase(searchFlights.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(repriceFllight.pending, (state) => {
                state.repricing = true;
            })
            .addCase(repriceFllight.fulfilled, (state, action) => {
                state.repricing = false;
                state.repriceResult = action.payload;
            })
            .addCase(repriceFllight.rejected, (state, action) => {
                state.repricing = false;
                state.error = action.payload;
            });
    }
});

export const { setSearchParams, selectFlight, clearFlights, applyFilters } = flightSlice.actions;
export default flightSlice.reducer;
