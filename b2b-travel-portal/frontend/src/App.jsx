import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Auth Components
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';

// Layout
import Layout from './components/Layout';

// Placeholder Component
import PlaceholderPage from './components/PlaceholderPage';

// Main Components
import Dashboard from './components/Dashboard';
import FlightSearchPage from './components/FlightSearchPage';
import FlightBookingPage from './components/FlightBookingPage';
import AgentSettings from './components/AgentSettings';
import BookingHistory from './components/BookingHistory';
import WalletPage from './components/WalletPage';
import MarkupManagement from './components/MarkupManagement';
import CustomerManagement from './components/CustomerManagement';
import FareCalendar from './components/FareCalendar';
import GroupBooking from './components/GroupBooking';
import ReportsPage from './components/ReportsPage';
import InvoiceManagement from './components/InvoiceManagement';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import SchemeManagement from './components/admin/SchemeManagement';
import ApiProviderManagement from './components/admin/ApiProviderManagement';
import AgentSignupApprovals from './components/admin/AgentSignupApprovals';
import AgentDefaultSettings from './components/admin/AgentDefaultSettings';

// Super Admin Components (SaaS/White-label)
import SuperAdminDashboard from './components/superadmin/SuperAdminDashboard';
import ApiDocumentation from './components/superadmin/ApiDocumentation';
import WhiteLabelSettings from './components/superadmin/WhiteLabelSettings';

/**
 * Protected Route Component with Layout
 */
const ProtectedRoute = ({ children, withLayout = true }) => {
    const { isAuthenticated, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (withLayout) {
        return <Layout>{children}</Layout>;
    }

    return children;
};

/**
 * Public Route Component (redirects to dashboard if authenticated)
 */
const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useAuthStore();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

/**
 * Main App Component
 */
const App = () => {
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

                {/* Dashboard */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

                {/* Flights */}
                <Route path="/flights" element={<ProtectedRoute><FlightSearchPage /></ProtectedRoute>} />
                <Route path="/booking" element={<ProtectedRoute><FlightBookingPage /></ProtectedRoute>} />
                <Route path="/bookings" element={<ProtectedRoute><BookingHistory /></ProtectedRoute>} />
                <Route path="/fare-calendar" element={<ProtectedRoute><FareCalendar /></ProtectedRoute>} />
                <Route path="/group-booking" element={<ProtectedRoute><GroupBooking /></ProtectedRoute>} />

                {/* Hotels */}
                <Route path="/hotels" element={<ProtectedRoute><PlaceholderPage title="Search Hotels" description="Search and book hotels worldwide" /></ProtectedRoute>} />
                <Route path="/hotel-bookings" element={<ProtectedRoute><PlaceholderPage title="Hotel Bookings" description="View and manage your hotel bookings" /></ProtectedRoute>} />

                {/* Buses */}
                <Route path="/buses" element={<ProtectedRoute><PlaceholderPage title="Search Buses" description="Book bus tickets across routes" /></ProtectedRoute>} />
                <Route path="/bus-bookings" element={<ProtectedRoute><PlaceholderPage title="Bus Bookings" description="View and manage your bus bookings" /></ProtectedRoute>} />

                {/* Insurance */}
                <Route path="/insurance" element={<ProtectedRoute><PlaceholderPage title="Travel Insurance" description="Protect your customers with travel insurance" /></ProtectedRoute>} />
                <Route path="/insurance-policies" element={<ProtectedRoute><PlaceholderPage title="My Policies" description="View and manage insurance policies" /></ProtectedRoute>} />

                {/* Visa & Forex */}
                <Route path="/visa" element={<ProtectedRoute><PlaceholderPage title="Visa Services" description="Apply for visas for various countries" /></ProtectedRoute>} />
                <Route path="/forex" element={<ProtectedRoute><PlaceholderPage title="Forex Exchange" description="Currency exchange services" /></ProtectedRoute>} />
                <Route path="/forex-cards" element={<ProtectedRoute><PlaceholderPage title="Forex Cards" description="Prepaid forex travel cards" /></ProtectedRoute>} />

                {/* Holidays */}
                <Route path="/holidays" element={<ProtectedRoute><PlaceholderPage title="Holiday Packages" description="Browse and book holiday packages" /></ProtectedRoute>} />
                <Route path="/holiday-bookings" element={<ProtectedRoute><PlaceholderPage title="Package Bookings" description="View and manage holiday bookings" /></ProtectedRoute>} />

                {/* Activities */}
                <Route path="/activities" element={<ProtectedRoute><PlaceholderPage title="Tours & Activities" description="Book tours and activities" /></ProtectedRoute>} />
                <Route path="/transfers" element={<ProtectedRoute><PlaceholderPage title="Airport Transfers" description="Book airport pickup and drop services" /></ProtectedRoute>} />

                {/* Customers */}
                <Route path="/customers" element={<ProtectedRoute><CustomerManagement /></ProtectedRoute>} />

                {/* Finance */}
                <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
                <Route path="/payments" element={<ProtectedRoute><PlaceholderPage title="Payment History" description="View all payment transactions and gateway records" /></ProtectedRoute>} />
                <Route path="/markups" element={<ProtectedRoute><MarkupManagement /></ProtectedRoute>} />
                <Route path="/invoices" element={<ProtectedRoute><InvoiceManagement /></ProtectedRoute>} />
                <Route path="/tds" element={<ProtectedRoute><PlaceholderPage title="TDS Management" description="Track TDS deductions and generate TDS certificates" /></ProtectedRoute>} />
                <Route path="/ledger" element={<ProtectedRoute><PlaceholderPage title="Account Ledger" description="Complete financial ledger with all transactions" /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />

                {/* AI Tools */}
                <Route path="/ai-search" element={<ProtectedRoute><PlaceholderPage title="AI Smart Search" description="Natural language flight search powered by AI" /></ProtectedRoute>} />
                <Route path="/ai-itinerary" element={<ProtectedRoute><PlaceholderPage title="AI Itinerary Builder" description="Create complete travel itineraries with AI" /></ProtectedRoute>} />
                <Route path="/ai-image-search" element={<ProtectedRoute><PlaceholderPage title="AI Image Search" description="Search destinations using images" /></ProtectedRoute>} />
                <Route path="/ai-assistant" element={<ProtectedRoute><PlaceholderPage title="AI Travel Assistant" description="Chat with AI for travel recommendations" /></ProtectedRoute>} />
                <Route path="/price-alerts" element={<ProtectedRoute><PlaceholderPage title="Price Alerts" description="Get notified when prices drop" /></ProtectedRoute>} />
                <Route path="/price-predictor" element={<ProtectedRoute><PlaceholderPage title="Price Predictor" description="AI-powered price predictions" /></ProtectedRoute>} />

                {/* Settings */}
                <Route path="/settings" element={<ProtectedRoute><AgentSettings /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><AgentSettings /></ProtectedRoute>} />

                {/* ============ ADMIN ROUTES ============ */}

                {/* Admin Dashboard */}
                <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

                {/* Agent Management */}
                <Route path="/admin/agents" element={<ProtectedRoute><PlaceholderPage title="All Agents" description="View and manage all registered agents" /></ProtectedRoute>} />
                <Route path="/admin/signup-approvals" element={<ProtectedRoute><AgentSignupApprovals /></ProtectedRoute>} />
                <Route path="/admin/agent-settings" element={<ProtectedRoute><AgentDefaultSettings /></ProtectedRoute>} />

                {/* Commission & Schemes */}
                <Route path="/admin/schemes" element={<ProtectedRoute><SchemeManagement /></ProtectedRoute>} />
                <Route path="/admin/markups" element={<ProtectedRoute><PlaceholderPage title="Global Markups" description="Configure global markup rules" /></ProtectedRoute>} />

                {/* API & Suppliers */}
                <Route path="/admin/api-providers" element={<ProtectedRoute><ApiProviderManagement /></ProtectedRoute>} />
                <Route path="/admin/hotel-suppliers" element={<ProtectedRoute><PlaceholderPage title="Hotel Suppliers" description="Manage hotel API integrations" /></ProtectedRoute>} />
                <Route path="/admin/bus-suppliers" element={<ProtectedRoute><PlaceholderPage title="Bus Suppliers" description="Manage bus API integrations" /></ProtectedRoute>} />
                <Route path="/admin/insurance-suppliers" element={<ProtectedRoute><PlaceholderPage title="Insurance Providers" description="Manage insurance API integrations (ICICI Lombard, HDFC Ergo, Bajaj Allianz, Tata AIG)" /></ProtectedRoute>} />
                <Route path="/admin/payment-gateways" element={<ProtectedRoute><PlaceholderPage title="Payment Gateways" description="Configure payment gateway integrations (Razorpay, PayU, CCAvenue, Paytm, PhonePe)" /></ProtectedRoute>} />

                {/* White Label */}
                <Route path="/admin/white-label" element={<ProtectedRoute><WhiteLabelSettings /></ProtectedRoute>} />
                <Route path="/admin/b2c-portal" element={<ProtectedRoute><PlaceholderPage title="B2C Consumer Portal" description="Configure your customer-facing website" /></ProtectedRoute>} />
                <Route path="/admin/b2b-portal" element={<ProtectedRoute><PlaceholderPage title="B2B Agent Portal" description="Configure your agent portal" /></ProtectedRoute>} />
                <Route path="/admin/tenants" element={<ProtectedRoute><PlaceholderPage title="Tenant Management" description="Manage white-label tenants" /></ProtectedRoute>} />
                <Route path="/admin/domains" element={<ProtectedRoute><PlaceholderPage title="Custom Domains" description="Configure custom domain mappings" /></ProtectedRoute>} />
                <Route path="/admin/email-templates" element={<ProtectedRoute><PlaceholderPage title="Email Templates" description="Customize email templates" /></ProtectedRoute>} />

                {/* Reports & Analytics */}
                <Route path="/admin/bookings" element={<ProtectedRoute><PlaceholderPage title="All Bookings" description="View all bookings across agents" /></ProtectedRoute>} />
                <Route path="/admin/reports" element={<ProtectedRoute><PlaceholderPage title="Admin Reports" description="Generate administrative reports" /></ProtectedRoute>} />
                <Route path="/admin/analytics" element={<ProtectedRoute><PlaceholderPage title="Analytics Dashboard" description="View detailed analytics and insights" /></ProtectedRoute>} />

                {/* System */}
                <Route path="/admin/api-keys" element={<ProtectedRoute><PlaceholderPage title="API Keys" description="Manage API keys and access tokens" /></ProtectedRoute>} />
                <Route path="/api-docs" element={<ApiDocumentation />} />

                {/* Super Admin Routes */}
                <Route path="/superadmin" element={<ProtectedRoute withLayout={false}><SuperAdminDashboard /></ProtectedRoute>} />
                <Route path="/superadmin/dashboard" element={<ProtectedRoute withLayout={false}><SuperAdminDashboard /></ProtectedRoute>} />
                <Route path="/superadmin/white-label" element={<ProtectedRoute><WhiteLabelSettings /></ProtectedRoute>} />

                {/* Default Route */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* 404 Route */}
                <Route
                    path="*"
                    element={
                        <div className="min-h-screen flex items-center justify-center bg-gray-100">
                            <div className="text-center">
                                <h1 className="text-6xl font-bold text-gray-300">404</h1>
                                <p className="text-gray-500 mt-2">Page not found</p>
                                <a href="/dashboard" className="text-blue-600 hover:underline mt-4 inline-block">
                                    Go to Dashboard
                                </a>
                            </div>
                        </div>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
