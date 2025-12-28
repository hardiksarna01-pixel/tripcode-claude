/**
 * UI Redux Slice
 * Global UI state management
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    theme: 'light',
    sidebarOpen: true,
    loading: false,
    modal: {
        isOpen: false,
        type: null,
        data: null
    },
    toast: {
        show: false,
        message: '',
        type: 'info'
    },
    searchHistory: []
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        openModal: (state, action) => {
            state.modal = {
                isOpen: true,
                type: action.payload.type,
                data: action.payload.data || null
            };
        },
        closeModal: (state) => {
            state.modal = {
                isOpen: false,
                type: null,
                data: null
            };
        },
        showToast: (state, action) => {
            state.toast = {
                show: true,
                message: action.payload.message,
                type: action.payload.type || 'info'
            };
        },
        hideToast: (state) => {
            state.toast.show = false;
        },
        addToSearchHistory: (state, action) => {
            const exists = state.searchHistory.find(
                s => JSON.stringify(s) === JSON.stringify(action.payload)
            );
            if (!exists) {
                state.searchHistory = [action.payload, ...state.searchHistory.slice(0, 9)];
            }
        },
        clearSearchHistory: (state) => {
            state.searchHistory = [];
        }
    }
});

export const {
    toggleTheme,
    toggleSidebar,
    setLoading,
    openModal,
    closeModal,
    showToast,
    hideToast,
    addToSearchHistory,
    clearSearchHistory
} = uiSlice.actions;

export default uiSlice.reducer;
