import axios from 'axios';

/**
 * API Service
 * Handles all HTTP requests to the backend
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response) {
            // Handle specific error codes
            switch (error.response.status) {
                case 401:
                    // Clear auth and redirect to login
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('agent');
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                    break;
                case 403:
                    console.error('Access forbidden');
                    break;
                case 429:
                    console.error('Rate limit exceeded');
                    break;
                default:
                    break;
            }
            return Promise.reject(error.response.data);
        }
        return Promise.reject({ error: 'Network error. Please check your connection.' });
    }
);

/**
 * Authentication API
 */
export const authApi = {
    login: (email, password) =>
        api.post('/auth/login', { email, password }),

    register: (data) =>
        api.post('/auth/register', data),

    getMe: () =>
        api.get('/auth/me'),

    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('agent');
    }
};

/**
 * Flight API
 */
export const flightApi = {
    getSectors: () =>
        api.get('/flights/sectors'),

    search: (searchParams) =>
        api.post('/flights/search', searchParams),

    reprice: (searchKey, selectedFlights) =>
        api.post('/flights/reprice', { searchKey, selectedFlights }),

    getSSR: (searchKey, flightKey) =>
        api.post('/flights/ssr', { searchKey, flightKey }),

    getSeatMap: (searchKey, flightKey) =>
        api.post('/flights/seatmap', { searchKey, flightKey }),

    getAirlines: () =>
        api.get('/flights/airlines'),

    getAirports: (query) =>
        api.get('/flights/airports', { params: { query } })
};

/**
 * Booking API
 */
export const bookingApi = {
    create: (bookingData) =>
        api.post('/bookings/create', bookingData),

    confirm: (bookingRefNo, airlinePnr, clientRefNo) =>
        api.post('/bookings/confirm', { bookingRefNo, airlinePnr, clientRefNo }),

    getDetails: (refNo, airlinePnr) =>
        api.get(`/bookings/${refNo}`, { params: { airlinePnr } }),

    getHistory: (filters) =>
        api.get('/bookings', { params: filters }),

    cancel: (refNo, cancellationType) =>
        api.post(`/bookings/${refNo}/cancel`, { cancellationType }),

    releasePnr: (refNo, airlinePnr) =>
        api.post(`/bookings/${refNo}/release`, { airlinePnr })
};

/**
 * Wallet API
 */
export const walletApi = {
    getBalance: () =>
        api.get('/wallet/balance'),

    getTransactions: (filters) =>
        api.get('/wallet/transactions', { params: filters }),

    getSummary: (period) =>
        api.get('/wallet/summary', { params: { period } })
};

/**
 * Agent API
 */
export const agentApi = {
    getProfile: () =>
        api.get('/agents/profile'),

    updateProfile: (data) =>
        api.put('/agents/profile', data),

    changePassword: (currentPassword, newPassword) =>
        api.post('/agents/change-password', { currentPassword, newPassword }),

    getStats: (period) =>
        api.get('/agents/stats', { params: { period } })
};

/**
 * Admin API
 */
export const adminApi = {
    // Agent Management
    getAgents: (filters) =>
        api.get('/admin/agents', { params: filters }),

    approveAgent: (agentId) =>
        api.post(`/admin/agents/${agentId}/approve`),

    rejectAgent: (agentId, reason) =>
        api.post(`/admin/agents/${agentId}/reject`, { reason }),

    blockAgent: (agentId, reason) =>
        api.post(`/admin/agents/${agentId}/block`, { reason }),

    // Scheme Management
    getSchemes: () =>
        api.get('/admin/schemes'),

    createScheme: (data) =>
        api.post('/admin/schemes', data),

    updateScheme: (id, data) =>
        api.put(`/admin/schemes/${id}`, data),

    // API Provider Management
    getApiProviders: () =>
        api.get('/admin/api-providers'),

    createApiProvider: (data) =>
        api.post('/admin/api-providers', data),

    updateApiProvider: (id, data) =>
        api.put(`/admin/api-providers/${id}`, data),

    // Group Management
    getGroups: () =>
        api.get('/admin/groups'),

    createGroup: (data) =>
        api.post('/admin/groups', data),

    // Reports
    getBookingReport: (filters) =>
        api.get('/admin/reports/bookings', { params: filters }),

    getRevenueReport: (filters) =>
        api.get('/admin/reports/revenue', { params: filters }),

    // Signup Requests
    getSignupRequests: (filters) =>
        api.get('/admin/signup-requests', { params: filters })
};

export default api;
