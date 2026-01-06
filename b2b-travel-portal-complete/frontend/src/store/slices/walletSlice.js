/**
 * Wallet Redux Slice
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { walletAPI } from '../../services/api';

export const fetchBalance = createAsyncThunk(
    'wallet/balance',
    async (_, { rejectWithValue }) => {
        try {
            const response = await walletAPI.getBalance();
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch balance');
        }
    }
);

export const fetchTransactions = createAsyncThunk(
    'wallet/transactions',
    async (params, { rejectWithValue }) => {
        try {
            const response = await walletAPI.getTransactions(params);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch transactions');
        }
    }
);

export const initiateTopup = createAsyncThunk(
    'wallet/topup',
    async (data, { rejectWithValue }) => {
        try {
            const response = await walletAPI.topup(data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to initiate topup');
        }
    }
);

const initialState = {
    balance: 0,
    creditBalance: 0,
    transactions: [],
    pagination: {
        page: 1,
        limit: 20,
        total: 0
    },
    topupOrder: null,
    loading: false,
    error: null
};

const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        clearTopupOrder: (state) => {
            state.topupOrder = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBalance.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBalance.fulfilled, (state, action) => {
                state.loading = false;
                state.balance = action.payload.balance;
                state.creditBalance = action.payload.creditBalance || 0;
            })
            .addCase(fetchBalance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchTransactions.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = action.payload.transactions;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(initiateTopup.fulfilled, (state, action) => {
                state.topupOrder = action.payload;
            });
    }
});

export const { clearTopupOrder } = walletSlice.actions;
export default walletSlice.reducer;
