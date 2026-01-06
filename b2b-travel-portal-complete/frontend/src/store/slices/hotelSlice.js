/**
 * Hotel Redux Slice
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hotelAPI } from '../../services/api';

export const searchHotels = createAsyncThunk(
    'hotels/search',
    async (searchParams, { rejectWithValue }) => {
        try {
            const response = await hotelAPI.search(searchParams);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Search failed');
        }
    }
);

export const getHotelDetails = createAsyncThunk(
    'hotels/details',
    async (hotelId, { rejectWithValue }) => {
        try {
            const response = await hotelAPI.getDetails(hotelId);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to get details');
        }
    }
);

const initialState = {
    searchParams: null,
    searchKey: null,
    hotels: [],
    filters: null,
    selectedHotel: null,
    hotelDetails: null,
    rooms: [],
    selectedRoom: null,
    loading: false,
    error: null
};

const hotelSlice = createSlice({
    name: 'hotels',
    initialState,
    reducers: {
        setSearchParams: (state, action) => {
            state.searchParams = action.payload;
        },
        selectHotel: (state, action) => {
            state.selectedHotel = action.payload;
        },
        selectRoom: (state, action) => {
            state.selectedRoom = action.payload;
        },
        clearHotels: (state) => {
            state.hotels = [];
            state.searchKey = null;
            state.selectedHotel = null;
            state.hotelDetails = null;
            state.rooms = [];
            state.selectedRoom = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchHotels.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchHotels.fulfilled, (state, action) => {
                state.loading = false;
                state.hotels = action.payload.hotels;
                state.searchKey = action.payload.searchKey;
                state.filters = action.payload.filters;
            })
            .addCase(searchHotels.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getHotelDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(getHotelDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.hotelDetails = action.payload.hotel;
                state.rooms = action.payload.rooms;
            })
            .addCase(getHotelDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setSearchParams, selectHotel, selectRoom, clearHotels } = hotelSlice.actions;
export default hotelSlice.reducer;
