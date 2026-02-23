/**
 * Redux Store Configuration
 */

import { configureStore } from '@reduxjs/toolkit';
import flightReducer from './slices/flightSlice';
import hotelReducer from './slices/hotelSlice';
import bookingReducer from './slices/bookingSlice';
import walletReducer from './slices/walletSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
    reducer: {
        flights: flightReducer,
        hotels: hotelReducer,
        bookings: bookingReducer,
        wallet: walletReducer,
        ui: uiReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});

export default store;
