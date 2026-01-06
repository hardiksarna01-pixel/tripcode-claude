import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';

// Layouts
import AgentLayout from './components/layouts/AgentLayout';
import AdminLayout from './components/layouts/AdminLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Agent Pages
import AgentDashboard from './pages/agent/Dashboard';
import FlightSearch from './pages/agent/FlightSearch';
import Bookings from './pages/agent/Bookings';
import BookingDetails from './pages/agent/BookingDetails';
import Wallet from './pages/agent/Wallet';
import Profile from './pages/agent/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AgentManagement from './pages/admin/AgentManagement';
import SignupApprovals from './pages/admin/SignupApprovals';
import GroupManagement from './pages/admin/GroupManagement';
import SchemeManagement from './pages/admin/SchemeManagement';
import ApiProviders from './pages/admin/ApiProviders';
import BrandingTheme from './pages/admin/BrandingTheme';
import B2CPortal from './pages/admin/B2CPortal';
import B2BPortal from './pages/admin/B2BPortal';
import TenantManagement from './pages/admin/TenantManagement';
import CustomDomains from './pages/admin/CustomDomains';
import EmailTemplates from './pages/admin/EmailTemplates';
import BookingReports from './pages/admin/BookingReports';
import RevenueReports from './pages/admin/RevenueReports';
import SystemSettings from './pages/admin/SystemSettings';

// Protected Route Components
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const AgentRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
};

function App() {
  const { isAuthenticated, isAdmin } = useAuthStore();

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          isAuthenticated ? (
            isAdmin ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage />
          )
        } />
        <Route path="/admin/login" element={
          isAuthenticated && isAdmin ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <AdminLoginPage />
          )
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />
        } />

        {/* Agent Routes */}
        <Route path="/" element={
          <AgentRoute>
            <AgentLayout />
          </AgentRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<AgentDashboard />} />
          <Route path="flights" element={<FlightSearch />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="bookings/:id" element={<BookingDetails />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="agents" element={<AgentManagement />} />
          <Route path="agents/approvals" element={<SignupApprovals />} />
          <Route path="groups" element={<GroupManagement />} />
          <Route path="schemes" element={<SchemeManagement />} />
          <Route path="api-providers" element={<ApiProviders />} />
          <Route path="branding" element={<BrandingTheme />} />
          <Route path="b2c-portal" element={<B2CPortal />} />
          <Route path="b2b-portal" element={<B2BPortal />} />
          <Route path="tenants" element={<TenantManagement />} />
          <Route path="domains" element={<CustomDomains />} />
          <Route path="email-templates" element={<EmailTemplates />} />
          <Route path="reports/bookings" element={<BookingReports />} />
          <Route path="reports/revenue" element={<RevenueReports />} />
          <Route path="settings" element={<SystemSettings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-300">404</h1>
              <p className="text-gray-500 mt-2">Page not found</p>
              <a href="/dashboard" className="text-blue-500 hover:underline mt-4 inline-block">
                Go to Dashboard
              </a>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
