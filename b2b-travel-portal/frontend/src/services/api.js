import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  adminLogin: (email, password) =>
    api.post('/admin/login', { email, password }),

  agentLogin: (email, password) =>
    api.post('/auth/login', { email, password }),

  agentRegister: (data) =>
    api.post('/auth/register', data),

  getProfile: () =>
    api.get('/auth/me'),
};

// Flights API
export const flightsAPI = {
  search: (params) =>
    api.post('/flights/search', params),

  reprice: (data) =>
    api.post('/flights/reprice', data),

  getSSR: (data) =>
    api.post('/flights/ssr', data),

  getSeatMap: (data) =>
    api.post('/flights/seatmap', data),

  getAirlines: () =>
    api.get('/flights/airlines'),

  getAirports: (query) =>
    api.get(`/flights/airports?query=${query}`),
};

// Bookings API
export const bookingsAPI = {
  create: (data) =>
    api.post('/bookings/create', data),

  confirm: (data) =>
    api.post('/bookings/confirm', data),

  getDetails: (refNo) =>
    api.get(`/bookings/${refNo}`),

  getHistory: (params) =>
    api.get('/bookings', { params }),

  cancel: (refNo, data) =>
    api.post(`/bookings/${refNo}/cancel`, data),
};

// Wallet API
export const walletAPI = {
  getBalance: () =>
    api.get('/wallet/balance'),

  getTransactions: () =>
    api.get('/wallet/transactions'),
};

// Admin API
export const adminAPI = {
  getDashboard: () =>
    api.get('/admin/dashboard'),

  // Agents
  getAgents: (params) =>
    api.get('/admin/agents', { params }),

  getAgent: (id) =>
    api.get(`/admin/agents/${id}`),

  updateAgent: (id, data) =>
    api.put(`/admin/agents/${id}`, data),

  updateAgentStatus: (id, data) =>
    api.put(`/admin/agents/${id}/status`, data),

  // Signup Requests
  getSignupRequests: (params) =>
    api.get('/admin/signup-requests', { params }),

  approveSignup: (id, data) =>
    api.post(`/admin/signup-requests/${id}/approve`, data),

  rejectSignup: (id, data) =>
    api.post(`/admin/signup-requests/${id}/reject`, data),

  // Schemes
  getSchemes: () =>
    api.get('/admin/schemes'),

  createScheme: (data) =>
    api.post('/admin/schemes', data),

  updateScheme: (id, data) =>
    api.put(`/admin/schemes/${id}`, data),

  // API Providers
  getApiProviders: () =>
    api.get('/admin/api-providers'),

  createApiProvider: (data) =>
    api.post('/admin/api-providers', data),

  updateApiProvider: (id, data) =>
    api.put(`/admin/api-providers/${id}`, data),

  // Groups
  getGroups: () =>
    api.get('/admin/groups'),

  createGroup: (data) =>
    api.post('/admin/groups', data),
};

export default api;
