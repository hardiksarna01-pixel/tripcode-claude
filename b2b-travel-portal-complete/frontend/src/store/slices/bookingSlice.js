/**
 * Booking Redux Slice
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookingAPI } from '../../services/api';

export const fetchBookings = createAsyncThunk(
    'bookings/fetch',
    async (params, { rejectWithValue }) => {
        try {
            const response = await bookingAPI.list(params);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch bookings');
        }
    }
);

export const fetchBookingDetails = createAsyncThunk(
    'bookings/details',
    async (bookingId, { rejectWithValue }) => {
        try {
            const response = await bookingAPI.getDetails(bookingId);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch booking');
        }
    }
);

export const cancelBooking = createAsyncThunk(
    'bookings/cancel',
    async ({ bookingId, reason }, { rejectWithValue }) => {
        try {
            const response = await bookingAPI.cancel(bookingId, { reason });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Cancellation failed');
        }
    }
);

const initialState = {
    bookings: [],
    currentBooking: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0
    },
    filters: {
        status: null,
        productType: null,
        dateRange: null
    },
    loading: false,
    error: null
};

const bookingSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        setPage: (state, action) => {
            state.pagination.page = action.payload;
        },
        clearCurrentBooking: (state) => {
            state.currentBooking = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = action.payload.bookings;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchBookingDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBookingDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.currentBooking = action.payload;
            })
            .addCase(fetchBookingDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(cancelBooking.fulfilled, (state, action) => {
                const index = state.bookings.findIndex(b => b.id === action.payload.id);
                if (index !== -1) {
                    state.bookings[index] = action.payload;
                }
                if (state.currentBooking?.id === action.payload.id) {
                    state.currentBooking = action.payload;
                }
            });
    }
});

export const { setFilters, setPage, clearCurrentBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
