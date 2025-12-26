import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';

// Auth Components
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';

// Layout
import Layout from './components/Layout';

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
import SchemeManagement from './components/admin/SchemeManagement';
import ApiProviderManagement from './components/admin/ApiProviderManagement';
import AgentSignupApprovals from './components/admin/AgentSignupApprovals';
import AgentDefaultSettings from './components/admin/AgentDefaultSettings';

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
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <LoginPage />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <RegisterPage />
                        </PublicRoute>
                    }
                />

                {/* Protected Routes with Layout */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/flights"
                    element={
                        <ProtectedRoute>
                            <FlightSearchPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/booking"
                    element={
                        <ProtectedRoute>
                            <FlightBookingPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/bookings"
                    element={
                        <ProtectedRoute>
                            <BookingHistory />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/wallet"
                    element={
                        <ProtectedRoute>
                            <WalletPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/markups"
                    element={
                        <ProtectedRoute>
                            <MarkupManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/customers"
                    element={
                        <ProtectedRoute>
                            <CustomerManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/fare-calendar"
                    element={
                        <ProtectedRoute>
                            <FareCalendar />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/group-booking"
                    element={
                        <ProtectedRoute>
                            <GroupBooking />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/reports"
                    element={
                        <ProtectedRoute>
                            <ReportsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/invoices"
                    element={
                        <ProtectedRoute>
                            <InvoiceManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <AgentSettings />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <AgentSettings />
                        </ProtectedRoute>
                    }
                />

                {/* Admin Routes */}
                <Route
                    path="/admin/schemes"
                    element={
                        <ProtectedRoute>
                            <SchemeManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/api-providers"
                    element={
                        <ProtectedRoute>
                            <ApiProviderManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/signup-approvals"
                    element={
                        <ProtectedRoute>
                            <AgentSignupApprovals />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/agent-settings"
                    element={
                        <ProtectedRoute>
                            <AgentDefaultSettings />
                        </ProtectedRoute>
                    }
                />

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
