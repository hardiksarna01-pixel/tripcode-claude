/**
 * Main Application Component
 * B2B/B2C Travel Portal
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './store';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import AuthLayout from './components/layout/AuthLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import AdminLogin from './pages/auth/AdminLogin';

// Public Pages
import Home from './pages/Home';
import FlightSearch from './pages/flights/FlightSearch';
import FlightResults from './pages/flights/FlightResults';
import FlightBooking from './pages/flights/FlightBooking';
import HotelSearch from './pages/hotels/HotelSearch';
import HotelResults from './pages/hotels/HotelResults';
import HotelDetails from './pages/hotels/HotelDetails';
import HotelBooking from './pages/hotels/HotelBooking';
import BusSearch from './pages/bus/BusSearch';
import BusResults from './pages/bus/BusResults';
import HolidayPackages from './pages/holidays/HolidayPackages';
import HolidayDetails from './pages/holidays/HolidayDetails';
import Activities from './pages/activities/Activities';
import Insurance from './pages/insurance/Insurance';
import Visa from './pages/visa/Visa';
import Transfers from './pages/transfers/Transfers';

// Agent Portal Pages
import AgentDashboard from './pages/agent/Dashboard';
import AgentBookings from './pages/agent/Bookings';
import AgentWallet from './pages/agent/Wallet';
import AgentReports from './pages/agent/Reports';
import AgentProfile from './pages/agent/Profile';

// Customer Pages
import CustomerDashboard from './pages/customer/Dashboard';
import CustomerBookings from './pages/customer/Bookings';
import CustomerProfile from './pages/customer/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminAgents from './pages/admin/Agents';
import AdminGroups from './pages/admin/Groups';
import AdminSchemes from './pages/admin/Schemes';
import AdminSuppliers from './pages/admin/Suppliers';
import AdminMarkup from './pages/admin/Markup';
import AdminFinance from './pages/admin/Finance';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';
import AdminWhitelabel from './pages/admin/Whitelabel';
import AdminTemplates from './pages/admin/Templates';
import AdminApiKeys from './pages/admin/ApiKeys';

// Super Admin Pages
import SuperAdminDashboard from './pages/superadmin/Dashboard';
import SuperAdminTenants from './pages/superadmin/Tenants';
import SuperAdminAdmins from './pages/superadmin/Admins';

// AI Features
import AITripPlanner from './pages/ai/TripPlanner';
import AIChat from './pages/ai/Chat';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="loading-screen">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.type)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

// Admin Protected Route
const AdminRoute = ({ children }) => {
    const { admin, isAdminAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="loading-screen">Loading...</div>;
    }

    if (!isAdminAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

function App() {
    return (
        <Provider store={store}>
            <AuthProvider>
                <Router>
                    <div className="app">
                        <Routes>
                            {/* Auth Routes */}
                            <Route element={<AuthLayout />}>
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/forgot-password" element={<ForgotPassword />} />
                                <Route path="/admin/login" element={<AdminLogin />} />
                            </Route>

                            {/* Public Routes */}
                            <Route element={<MainLayout />}>
                                <Route path="/" element={<Home />} />

                                {/* Flights */}
                                <Route path="/flights" element={<FlightSearch />} />
                                <Route path="/flights/results" element={<FlightResults />} />
                                <Route path="/flights/book" element={<FlightBooking />} />

                                {/* Hotels */}
                                <Route path="/hotels" element={<HotelSearch />} />
                                <Route path="/hotels/results" element={<HotelResults />} />
                                <Route path="/hotels/:hotelId" element={<HotelDetails />} />
                                <Route path="/hotels/book" element={<HotelBooking />} />

                                {/* Bus */}
                                <Route path="/bus" element={<BusSearch />} />
                                <Route path="/bus/results" element={<BusResults />} />

                                {/* Holidays */}
                                <Route path="/holidays" element={<HolidayPackages />} />
                                <Route path="/holidays/:packageId" element={<HolidayDetails />} />

                                {/* Other Products */}
                                <Route path="/activities" element={<Activities />} />
                                <Route path="/insurance" element={<Insurance />} />
                                <Route path="/visa" element={<Visa />} />
                                <Route path="/transfers" element={<Transfers />} />

                                {/* AI Features */}
                                <Route path="/trip-planner" element={<AITripPlanner />} />
                                <Route path="/ai-chat" element={<AIChat />} />
                            </Route>

                            {/* Agent Portal Routes */}
                            <Route
                                path="/agent/*"
                                element={
                                    <ProtectedRoute allowedRoles={['agent']}>
                                        <MainLayout showSidebar={true} sidebarType="agent" />
                                    </ProtectedRoute>
                                }
                            >
                                <Route path="dashboard" element={<AgentDashboard />} />
                                <Route path="bookings" element={<AgentBookings />} />
                                <Route path="wallet" element={<AgentWallet />} />
                                <Route path="reports" element={<AgentReports />} />
                                <Route path="profile" element={<AgentProfile />} />
                            </Route>

                            {/* Customer Routes */}
                            <Route
                                path="/my/*"
                                element={
                                    <ProtectedRoute allowedRoles={['customer']}>
                                        <MainLayout showSidebar={true} sidebarType="customer" />
                                    </ProtectedRoute>
                                }
                            >
                                <Route path="dashboard" element={<CustomerDashboard />} />
                                <Route path="bookings" element={<CustomerBookings />} />
                                <Route path="profile" element={<CustomerProfile />} />
                            </Route>

                            {/* Admin Routes */}
                            <Route
                                path="/admin/*"
                                element={
                                    <AdminRoute>
                                        <AdminLayout />
                                    </AdminRoute>
                                }
                            >
                                <Route path="dashboard" element={<AdminDashboard />} />
                                <Route path="agents/*" element={<AdminAgents />} />
                                <Route path="groups" element={<AdminGroups />} />
                                <Route path="schemes" element={<AdminSchemes />} />
                                <Route path="suppliers" element={<AdminSuppliers />} />
                                <Route path="markup" element={<AdminMarkup />} />
                                <Route path="finance/*" element={<AdminFinance />} />
                                <Route path="reports" element={<AdminReports />} />
                                <Route path="settings/*" element={<AdminSettings />} />
                                <Route path="whitelabel" element={<AdminWhitelabel />} />
                                <Route path="templates" element={<AdminTemplates />} />
                                <Route path="api-keys" element={<AdminApiKeys />} />
                            </Route>

                            {/* Super Admin Routes */}
                            <Route
                                path="/superadmin/*"
                                element={
                                    <AdminRoute>
                                        <AdminLayout isSuperAdmin={true} />
                                    </AdminRoute>
                                }
                            >
                                <Route path="dashboard" element={<SuperAdminDashboard />} />
                                <Route path="tenants" element={<SuperAdminTenants />} />
                                <Route path="admins" element={<SuperAdminAdmins />} />
                            </Route>

                            {/* 404 */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>

                        <Toaster
                            position="top-right"
                            toastOptions={{
                                duration: 4000,
                                style: {
                                    background: '#363636',
                                    color: '#fff',
                                },
                            }}
                        />
                    </div>
                </Router>
            </AuthProvider>
        </Provider>
    );
}

export default App;
