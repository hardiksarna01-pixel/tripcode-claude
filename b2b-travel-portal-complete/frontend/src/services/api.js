/**
 * API Service
 * Axios instance with interceptors
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 errors
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
                        refreshToken
                    });

                    const { accessToken } = response.data.data;
                    localStorage.setItem('accessToken', accessToken);

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

// API methods
export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
    getProfile: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
    changePassword: (data) => api.put('/auth/change-password', data)
};

export const flightAPI = {
    search: (data) => api.post('/flights/search', data),
    reprice: (data) => api.post('/flights/reprice', data),
    getSSR: (data) => api.post('/flights/ssr', data),
    getSeatMap: (data) => api.post('/flights/seatmap', data),
    getFareRules: (data) => api.post('/flights/fare-rules', data),
    book: (data) => api.post('/flights/book', data),
    confirmBooking: (bookingId) => api.post(`/flights/book/${bookingId}/confirm`),
    getAirports: () => api.get('/flights/airports'),
    getAirlines: () => api.get('/flights/airlines')
};

export const hotelAPI = {
    search: (data) => api.post('/hotels/search', data),
    getDetails: (hotelId) => api.get(`/hotels/details/${hotelId}`),
    getRooms: (data) => api.post('/hotels/rooms', data),
    book: (data) => api.post('/hotels/book', data),
    confirmBooking: (bookingId) => api.post(`/hotels/book/${bookingId}/confirm`),
    getDestinations: () => api.get('/hotels/destinations')
};

export const busAPI = {
    search: (data) => api.post('/bus/search', data),
    getSeatLayout: (data) => api.post('/bus/seat-layout', data),
    book: (data) => api.post('/bus/book', data),
    getCities: () => api.get('/bus/cities')
};

export const holidayAPI = {
    search: (data) => api.post('/holidays/search', data),
    getPackages: (params) => api.get('/holidays/packages', { params }),
    getPackageDetails: (id) => api.get(`/holidays/packages/${id}`),
    createInquiry: (data) => api.post('/holidays/inquiry', data)
};

export const bookingAPI = {
    list: (params) => api.get('/bookings', { params }),
    getDetails: (bookingId) => api.get(`/bookings/${bookingId}`),
    cancel: (bookingId, data) => api.post(`/bookings/${bookingId}/cancel`, data),
    getInvoice: (bookingId) => api.get(`/bookings/${bookingId}/invoice`),
    getVoucher: (bookingId) => api.get(`/bookings/${bookingId}/voucher`)
};

export const walletAPI = {
    getBalance: () => api.get('/wallet/balance'),
    getTransactions: (params) => api.get('/wallet/transactions', { params }),
    topup: (data) => api.post('/wallet/topup', data),
    verifyTopup: (orderId) => api.post(`/wallet/topup/${orderId}/verify`),
    getStatement: (params) => api.get('/wallet/statement', { params })
};

export const aiAPI = {
    chat: (messages, context) => api.post('/ai/chat', { messages, context }),
    planTrip: (preferences) => api.post('/ai/trip-planner', preferences),
    getRecommendations: (data) => api.post('/ai/recommend', data),
    predictPrice: (data) => api.post('/ai/price-prediction', data)
};

export default api;
