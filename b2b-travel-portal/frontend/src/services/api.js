import axios from 'axios';
import useAuthStore from '../store/authStore';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  adminLogin: (credentials) => api.post('/auth/admin/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/me'),
};

// Agent API
export const agentAPI = {
  getDashboard: () => api.get('/agents/dashboard'),
  getProfile: () => api.get('/agents/profile'),
  updateProfile: (data) => api.put('/agents/profile', data),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAgents: (params) => api.get('/admin/agents', { params }),
  getAgent: (id) => api.get(`/admin/agents/${id}`),
  createAgent: (data) => api.post('/admin/agents', data),
  updateAgent: (id, data) => api.put(`/admin/agents/${id}`, data),
  blockAgent: (id, reason) => api.post(`/admin/agents/${id}/block`, { reason }),
  unblockAgent: (id) => api.post(`/admin/agents/${id}/unblock`),

  // Signup approvals
  getSignupRequests: (params) => api.get('/admin/signup-requests', { params }),
  approveSignup: (id, data) => api.post(`/admin/signup-requests/${id}/approve`, data),
  rejectSignup: (id, reason) => api.post(`/admin/signup-requests/${id}/reject`, { reason }),

  // Groups
  getGroups: () => api.get('/admin/groups'),
  createGroup: (data) => api.post('/admin/groups', data),
  updateGroup: (id, data) => api.put(`/admin/groups/${id}`, data),

  // Schemes
  getSchemes: () => api.get('/admin/schemes'),
  createScheme: (data) => api.post('/admin/schemes', data),
  updateScheme: (id, data) => api.put(`/admin/schemes/${id}`, data),

  // API Providers
  getApiProviders: () => api.get('/admin/api-providers'),
  createApiProvider: (data) => api.post('/admin/api-providers', data),
  updateApiProvider: (id, data) => api.put(`/admin/api-providers/${id}`, data),
  toggleApiProvider: (id) => api.post(`/admin/api-providers/${id}/toggle`),

  // Wallet operations
  creditWallet: (agentId, data) => api.post(`/admin/wallet/${agentId}/credit`, data),
  debitWallet: (agentId, data) => api.post(`/admin/wallet/${agentId}/debit`, data),

  // Reports
  getBookingReports: (params) => api.get('/admin/reports/bookings', { params }),
  getRevenueReports: (params) => api.get('/admin/reports/revenue', { params }),
};

// Booking API
export const bookingAPI = {
  getBookings: (params) => api.get('/bookings', { params }),
  getBooking: (id) => api.get(`/bookings/${id}`),
  createBooking: (data) => api.post('/bookings', data),
  cancelBooking: (id, reason) => api.post(`/bookings/${id}/cancel`, { reason }),
};

// Wallet API
export const walletAPI = {
  getBalance: () => api.get('/wallet/balance'),
  getTransactions: (params) => api.get('/wallet/transactions', { params }),
};

// Flight API
export const flightAPI = {
  search: (params) => api.post('/flights/search', params),
  getDetails: (flightId) => api.get(`/flights/${flightId}`),
  getFareRules: (flightId) => api.get(`/flights/${flightId}/fare-rules`),
};

export default api;
