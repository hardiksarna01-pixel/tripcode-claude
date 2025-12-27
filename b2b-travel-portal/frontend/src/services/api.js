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
            switch (error.response.status) {
                case 401:
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

    getFareTypes: () =>
        api.get('/flights/fare-types'),

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

    cancel: (refNo, cancellationType, passengers) =>
        api.post(`/bookings/${refNo}/cancel`, { cancellationType, passengers }),

    releasePnr: (refNo, airlinePnr) =>
        api.post(`/bookings/${refNo}/release`, { airlinePnr }),

    getCancellationCharges: (refNo) =>
        api.get(`/bookings/${refNo}/cancellation-charges`)
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
        api.get('/wallet/summary', { params: { period } }),

    addFunds: (amount, paymentMethod, reference) =>
        api.post('/wallet/add-funds', { amount, paymentMethod, reference }),

    requestCreditIncrease: (requestedLimit, reason) =>
        api.post('/wallet/request-credit', { requestedLimit, reason })
};

/**
 * Markup API
 */
export const markupApi = {
    getConfig: () =>
        api.get('/markups/config'),

    getMarkups: () =>
        api.get('/markups'),

    createMarkup: (data) =>
        api.post('/markups', data),

    updateMarkup: (id, data) =>
        api.put(`/markups/${id}`, data),

    deleteMarkup: (id) =>
        api.delete(`/markups/${id}`),

    toggleMarkup: (id) =>
        api.post(`/markups/${id}/toggle`)
};

/**
 * Customer API
 */
export const customerApi = {
    getCustomers: (filters) =>
        api.get('/customers', { params: filters }),

    getCustomer: (id) =>
        api.get(`/customers/${id}`),

    createCustomer: (data) =>
        api.post('/customers', data),

    updateCustomer: (id, data) =>
        api.put(`/customers/${id}`, data),

    deleteCustomer: (id) =>
        api.delete(`/customers/${id}`),

    searchCustomers: (query) =>
        api.get('/customers/search', { params: { q: query } }),

    getFrequentTravelers: () =>
        api.get('/customers/frequent'),

    importCustomers: (customers) =>
        api.post('/customers/import', { customers }),

    getCustomerBookings: (id) =>
        api.get(`/customers/${id}/bookings`)
};

/**
 * Analytics API
 */
export const analyticsApi = {
    getDashboardStats: (period) =>
        api.get('/analytics/dashboard', { params: { period } }),

    getBookingAnalytics: (period, groupBy) =>
        api.get('/analytics/bookings', { params: { period, groupBy } }),

    getRevenueAnalytics: (period) =>
        api.get('/analytics/revenue', { params: { period } }),

    getTopRoutes: (period, limit) =>
        api.get('/analytics/top-routes', { params: { period, limit } }),

    getTopAirlines: (period) =>
        api.get('/analytics/top-airlines', { params: { period } }),

    getPerformanceMetrics: (period) =>
        api.get('/analytics/performance', { params: { period } }),

    getMonthlySummary: (year) =>
        api.get('/analytics/monthly', { params: { year } }),

    getCommissionReport: (period) =>
        api.get('/analytics/commission', { params: { period } }),

    exportReport: (type, format, period) =>
        api.get('/analytics/export', { params: { type, format, period } })
};

/**
 * Invoice API
 */
export const invoiceApi = {
    getInvoices: (filters) =>
        api.get('/invoices', { params: filters }),

    getInvoice: (id) =>
        api.get(`/invoices/${id}`),

    getInvoiceByBooking: (bookingRef) =>
        api.get(`/invoices/booking/${bookingRef}`),

    generateInvoice: (data) =>
        api.post('/invoices/generate', data),

    downloadInvoice: (id) =>
        api.get(`/invoices/${id}/download`),

    emailInvoice: (id, email) =>
        api.post(`/invoices/${id}/email`, { email }),

    addGstDetails: (id, gstDetails) =>
        api.put(`/invoices/${id}/gst`, gstDetails),

    getGstSummary: (params) =>
        api.get('/invoices/gst-summary', { params }),

    getGstProfiles: () =>
        api.get('/invoices/gst-profiles')
};

/**
 * Group Booking API
 */
export const groupBookingApi = {
    getRequests: (filters) =>
        api.get('/group-bookings', { params: filters }),

    getRequest: (id) =>
        api.get(`/group-bookings/${id}`),

    createRequest: (data) =>
        api.post('/group-bookings', data),

    updateRequest: (id, data) =>
        api.put(`/group-bookings/${id}`, data),

    cancelRequest: (id, reason) =>
        api.post(`/group-bookings/${id}/cancel`, { reason }),

    acceptQuote: (id, quoteId) =>
        api.post(`/group-bookings/${id}/accept-quote`, { quoteId }),

    getPurposes: () =>
        api.get('/group-bookings/purposes'),

    getStats: () =>
        api.get('/group-bookings/stats')
};

/**
 * Fare Calendar API
 */
export const fareCalendarApi = {
    getCalendar: (origin, destination, month, year, cabinClass) =>
        api.get('/fare-calendar/calendar', {
            params: { origin, destination, month, year, cabinClass }
        }),

    getTrend: (origin, destination, days) =>
        api.get('/fare-calendar/trend', {
            params: { origin, destination, days }
        }),

    getFlexibleFares: (origin, destination, departureDate, flexDays) =>
        api.get('/fare-calendar/flexible', {
            params: { origin, destination, departureDate, flexDays }
        }),

    comparePrices: (origin, destination, dates) =>
        api.post('/fare-calendar/compare', { origin, destination, dates }),

    // Price Alerts
    getAlerts: (active) =>
        api.get('/fare-calendar/alerts', { params: { active } }),

    getAlert: (id) =>
        api.get(`/fare-calendar/alerts/${id}`),

    createAlert: (data) =>
        api.post('/fare-calendar/alerts', data),

    updateAlert: (id, data) =>
        api.put(`/fare-calendar/alerts/${id}`, data),

    deleteAlert: (id) =>
        api.delete(`/fare-calendar/alerts/${id}`),

    toggleAlert: (id) =>
        api.post(`/fare-calendar/alerts/${id}/toggle`)
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

/**
 * Tenant API (SaaS/White-label)
 */
export const tenantApi = {
    // Plans
    getPlans: () =>
        api.get('/tenants/plans'),

    // Tenant CRUD
    createTenant: (data) =>
        api.post('/tenants', data),

    getTenant: (tenantId) =>
        api.get(`/tenants/${tenantId}`),

    updateTenant: (tenantId, data) =>
        api.put(`/tenants/${tenantId}`, data),

    listTenants: (filters) =>
        api.get('/tenants', { params: filters }),

    // Branding
    updateBranding: (tenantId, branding) =>
        api.put(`/tenants/${tenantId}/branding`, branding),

    // Custom Domain
    setCustomDomain: (tenantId, domain) =>
        api.post(`/tenants/${tenantId}/domain`, { domain }),

    // Plan Management
    changePlan: (tenantId, newPlan) =>
        api.post(`/tenants/${tenantId}/change-plan`, { newPlan }),

    // Usage
    getUsage: (tenantId) =>
        api.get(`/tenants/${tenantId}/usage`),

    // Suspend/Reactivate
    suspendTenant: (tenantId, reason) =>
        api.post(`/tenants/${tenantId}/suspend`, { reason }),

    reactivateTenant: (tenantId) =>
        api.post(`/tenants/${tenantId}/reactivate`)
};

/**
 * API Key Management
 */
export const apiKeyApi = {
    getEndpoints: () =>
        api.get('/api-keys/endpoints'),

    generateKeys: (tenantId) =>
        api.post('/api-keys/generate', { tenantId }),

    getKeys: (tenantId) =>
        api.get(`/api-keys/${tenantId}`),

    getUsageStats: (tenantId) =>
        api.get(`/api-keys/${tenantId}/usage`),

    rotateKey: (tenantId, keyType) =>
        api.post('/api-keys/rotate', { tenantId, keyType }),

    revokeKey: (key) =>
        api.post('/api-keys/revoke', { key })
};

/**
 * Subscription API
 */
export const subscriptionApi = {
    getSubscription: (tenantId) =>
        api.get(`/subscriptions/${tenantId}`),

    startSubscription: (tenantId, plan, paymentMethodId) =>
        api.post(`/subscriptions/${tenantId}/start`, { plan, paymentMethodId }),

    cancelSubscription: (tenantId, reason, cancelImmediately) =>
        api.post(`/subscriptions/${tenantId}/cancel`, { reason, cancelImmediately }),

    changePlan: (tenantId, newPlan, applyImmediately) =>
        api.post(`/subscriptions/${tenantId}/change-plan`, { newPlan, applyImmediately }),

    getBillingHistory: (tenantId, page, limit) =>
        api.get(`/subscriptions/${tenantId}/billing-history`, { params: { page, limit } }),

    getInvoice: (invoiceId) =>
        api.get(`/subscriptions/invoices/${invoiceId}`),

    processPayment: (tenantId, invoiceId, paymentMethodId, amount) =>
        api.post(`/subscriptions/${tenantId}/pay`, { invoiceId, paymentMethodId, amount }),

    addPaymentMethod: (tenantId, type, details) =>
        api.post(`/subscriptions/${tenantId}/payment-methods`, { type, details }),

    getRevenueSummary: (period) =>
        api.get('/subscriptions/admin/revenue', { params: { period } })
};

/**
 * Partner API
 */
export const partnerApi = {
    getTiers: () =>
        api.get('/partners/tiers'),

    registerPartner: (data) =>
        api.post('/partners/register', data),

    getPartner: (partnerId) =>
        api.get(`/partners/${partnerId}`),

    updatePartner: (partnerId, data) =>
        api.put(`/partners/${partnerId}`, data),

    listPartners: (filters) =>
        api.get('/partners', { params: filters }),

    getReferrals: (partnerId, status) =>
        api.get(`/partners/${partnerId}/referrals`, { params: { status } }),

    trackReferral: (referralCode, tenantId, plan, subscriptionAmount) =>
        api.post('/partners/track-referral', { referralCode, tenantId, plan, subscriptionAmount }),

    getCommissions: (partnerId, period) =>
        api.get(`/partners/${partnerId}/commissions`, { params: { period } }),

    requestPayout: (partnerId) =>
        api.post(`/partners/${partnerId}/request-payout`),

    approvePartner: (partnerId) =>
        api.post(`/partners/${partnerId}/approve`),

    rejectPartner: (partnerId, reason) =>
        api.post(`/partners/${partnerId}/reject`, { reason })
};

/**
 * Image Generator API
 */
export const imageGeneratorApi = {
    getConfig: () =>
        api.get('/image-generator/config'),

    getUsage: () =>
        api.get('/image-generator/usage'),

    generate: (data) =>
        api.post('/image-generator/generate', data),

    getHistory: (page, limit) =>
        api.get('/image-generator/history', { params: { page, limit } }),

    getImage: (imageId) =>
        api.get(`/image-generator/${imageId}`),

    deleteImage: (imageId) =>
        api.delete(`/image-generator/${imageId}`)
};

/**
 * AI Subscription API
 * IMPORTANT: AI subscriptions are billed DIRECTLY to the platform
 * White-label partners do NOT receive any revenue from AI subscriptions
 */
export const aiSubscriptionApi = {
    // Get current AI subscription status
    getSubscription: () =>
        api.get('/ai-subscription'),

    // Subscribe to AI Pro plan (billed directly to platform)
    subscribePro: (data) =>
        api.post('/ai-subscription/subscribe', data),

    // Cancel AI Pro subscription
    cancel: (data) =>
        api.post('/ai-subscription/cancel', data),

    // Get AI billing history
    getBillingHistory: (page, limit) =>
        api.get('/ai-subscription/billing', { params: { page, limit } }),

    // Get platform AI revenue (Super Admin only)
    getPlatformRevenue: (period) =>
        api.get('/ai-subscription/platform-revenue', { params: { period } })
};

/**
 * Itinerary Builder API
 */
export const itineraryApi = {
    getConfig: () =>
        api.get('/itineraries/config'),

    getUsage: () =>
        api.get('/itineraries/usage'),

    generate: (data) =>
        api.post('/itineraries/generate', data),

    getItineraries: (page, limit) =>
        api.get('/itineraries', { params: { page, limit } }),

    getItinerary: (itineraryId) =>
        api.get(`/itineraries/${itineraryId}`),

    updateItinerary: (itineraryId, data) =>
        api.put(`/itineraries/${itineraryId}`, data),

    deleteItinerary: (itineraryId) =>
        api.delete(`/itineraries/${itineraryId}`),

    exportItinerary: (itineraryId, format) =>
        api.get(`/itineraries/${itineraryId}/export`, { params: { format } }),

    duplicateItinerary: (itineraryId) =>
        api.post(`/itineraries/${itineraryId}/duplicate`)
};

export default api;
