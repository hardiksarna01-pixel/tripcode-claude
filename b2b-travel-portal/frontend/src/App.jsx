import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';

// THREE SEPARATE LAYOUTS - NEVER MIX
import AgentLayout from './components/layouts/AgentLayout';
import AdminLayout from './components/layouts/AdminLayout';
import SuperAdminLayout from './components/layouts/SuperAdminLayout';

// Auth Pages - Separate login for agents vs admin/superadmin
import LoginPage from './pages/auth/LoginPage';           // For AGENTS only
import AdminLoginPage from './pages/auth/AdminLoginPage'; // For ADMIN & SUPER ADMIN
import RegisterPage from './pages/auth/RegisterPage';

// AGENT PAGES
import AgentDashboard from './pages/agent/Dashboard';
import AgentBookings from './pages/agent/Bookings';
import AgentWallet from './pages/agent/Wallet';
import AgentProfile from './pages/agent/Profile';
import AgentFlightSearch from './pages/agent/FlightSearch';
import AgentBookingDetails from './pages/agent/BookingDetails';

// ADMIN PAGES
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

// Generic placeholder page for routes not yet implemented
const PlaceholderPage = ({ title }) => (
  <div className="bg-white rounded-xl shadow-sm p-8">
    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
    <p className="text-gray-500 mt-2">This page is under construction.</p>
  </div>
);

/**
 * STRICT ROUTE PROTECTION COMPONENTS
 * Each panel has its own guard that ONLY allows the correct role
 */

// AGENT ROUTE GUARD - Only allows agents
const AgentRoute = ({ children }) => {
  const { isAuthenticated, userRole } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If not an agent, redirect to appropriate panel
  if (userRole === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  if (userRole === 'SUPER_ADMIN') {
    return <Navigate to="/superadmin/dashboard" replace />;
  }

  return children;
};

// ADMIN ROUTE GUARD - Only allows admins
const AdminRoute = ({ children }) => {
  const { isAuthenticated, userRole } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Only allow ADMIN role
  if (userRole !== 'ADMIN') {
    if (userRole === 'SUPER_ADMIN') {
      return <Navigate to="/superadmin/dashboard" replace />;
    }
    return <Navigate to="/agent/dashboard" replace />;
  }

  return children;
};

// SUPER ADMIN ROUTE GUARD - Only allows super admins
const SuperAdminRoute = ({ children }) => {
  const { isAuthenticated, userRole } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Only allow SUPER_ADMIN role
  if (userRole !== 'SUPER_ADMIN') {
    if (userRole === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/agent/dashboard" replace />;
  }

  return children;
};

function App() {
  const { isAuthenticated, userRole } = useAuthStore();

  // Helper to redirect based on role
  const getDefaultRoute = () => {
    if (!isAuthenticated) return '/login';
    if (userRole === 'SUPER_ADMIN') return '/superadmin/dashboard';
    if (userRole === 'ADMIN') return '/admin/dashboard';
    return '/agent/dashboard';
  };

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* ============================================
            PUBLIC ROUTES - Login Pages (MUST BE FIRST)
        ============================================= */}

        {/* /login - AGENTS ONLY */}
        <Route path="login" element={
          isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <LoginPage />
        } />

        {/* /register - New agent registration */}
        <Route path="register" element={
          isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <RegisterPage />
        } />

        {/* ============================================
            AGENT PANEL (/agent/*) - 16 pages
            STRICTLY FOR AGENTS ONLY
        ============================================= */}
        <Route path="agent" element={
          <AgentRoute>
            <AgentLayout />
          </AgentRoute>
        }>
          <Route index element={<Navigate to="/agent/dashboard" replace />} />
          <Route path="dashboard" element={<AgentDashboard />} />
          <Route path="bookings" element={<AgentBookings />} />
          <Route path="booking/:id" element={<AgentBookingDetails />} />
          <Route path="wallet" element={<AgentWallet />} />
          <Route path="flights" element={<AgentFlightSearch />} />
          <Route path="profile" element={<AgentProfile />} />
          <Route path="reports" element={<PlaceholderPage title="Reports" />} />
          <Route path="commissions" element={<PlaceholderPage title="Commissions" />} />
          <Route path="certification-hub" element={<PlaceholderPage title="Certification Hub" />} />
          <Route path="my-courses" element={<PlaceholderPage title="My Courses" />} />
          <Route path="courses-catalog" element={<PlaceholderPage title="Courses Catalog" />} />
          <Route path="course-details" element={<PlaceholderPage title="Course Details" />} />
          <Route path="course-player" element={<PlaceholderPage title="Course Player" />} />
          <Route path="exam-portal" element={<PlaceholderPage title="Exam Portal" />} />
          <Route path="my-certificates" element={<PlaceholderPage title="My Certificates" />} />
          <Route path="membership-application" element={<PlaceholderPage title="Membership Application" />} />
        </Route>

        {/* ============================================
            ADMIN PANEL (/admin/*) - 33 pages + login
            Login is public, rest requires ADMIN role
        ============================================= */}
        <Route path="admin">
          {/* Public: Admin Login */}
          <Route path="login" element={
            isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <AdminLoginPage />
          } />

          {/* Protected Admin Routes */}
          <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="agents" element={<AgentManagement />} />
            <Route path="signup-approvals" element={<SignupApprovals />} />
            <Route path="groups" element={<GroupManagement />} />
            <Route path="schemes" element={<SchemeManagement />} />
            <Route path="api-providers" element={<ApiProviders />} />
            <Route path="branding-theme" element={<BrandingTheme />} />
            <Route path="b2c-portal" element={<B2CPortal />} />
            <Route path="b2b-portal" element={<B2BPortal />} />
            <Route path="tenant-management" element={<TenantManagement />} />
            <Route path="custom-domains" element={<CustomDomains />} />
            <Route path="email-templates" element={<EmailTemplates />} />
            <Route path="booking-reports" element={<BookingReports />} />
            <Route path="revenue-reports" element={<RevenueReports />} />
            <Route path="system-settings" element={<SystemSettings />} />
            <Route path="bookings" element={<PlaceholderPage title="Bookings" />} />
            <Route path="finance" element={<PlaceholderPage title="Finance" />} />
            <Route path="reports" element={<PlaceholderPage title="Reports" />} />
            <Route path="markup" element={<PlaceholderPage title="Markup" />} />
            <Route path="suppliers" element={<PlaceholderPage title="Suppliers" />} />
            <Route path="users" element={<PlaceholderPage title="Users" />} />
            <Route path="settings" element={<SystemSettings />} />
            <Route path="support" element={<PlaceholderPage title="Support" />} />
            <Route path="commissions" element={<PlaceholderPage title="Commissions" />} />
            <Route path="credit-management" element={<PlaceholderPage title="Credit Management" />} />
            <Route path="customers" element={<PlaceholderPage title="Customers" />} />
            <Route path="notifications" element={<PlaceholderPage title="Notifications" />} />
            <Route path="audit-logs" element={<PlaceholderPage title="Audit Logs" />} />
            <Route path="analytics" element={<RevenueReports />} />
          </Route>
        </Route>

        {/* ============================================
            SUPER ADMIN PANEL (/superadmin/*) - 14 pages
            STRICTLY FOR SUPER ADMINS ONLY
        ============================================= */}
        <Route path="superadmin" element={
          <SuperAdminRoute>
            <SuperAdminLayout />
          </SuperAdminRoute>
        }>
          <Route index element={<Navigate to="/superadmin/dashboard" replace />} />
          <Route path="dashboard" element={<PlaceholderPage title="Super Admin Dashboard" />} />
          <Route path="companies" element={<PlaceholderPage title="Companies" />} />
          <Route path="plans" element={<PlaceholderPage title="Plans" />} />
          <Route path="billing" element={<PlaceholderPage title="Billing" />} />
          <Route path="users" element={<PlaceholderPage title="Users" />} />
          <Route path="api-management" element={<PlaceholderPage title="API Management" />} />
          <Route path="system-health" element={<PlaceholderPage title="System Health" />} />
          <Route path="global-settings" element={<PlaceholderPage title="Global Settings" />} />
          <Route path="supplier-hub" element={<PlaceholderPage title="Supplier Hub" />} />
          <Route path="reports" element={<PlaceholderPage title="Reports" />} />
          <Route path="audit-logs" element={<PlaceholderPage title="Audit Logs" />} />
          <Route path="feature-flags" element={<PlaceholderPage title="Feature Flags" />} />
          <Route path="announcements" element={<PlaceholderPage title="Announcements" />} />
          <Route path="analytics" element={<PlaceholderPage title="Analytics" />} />
        </Route>

        {/* ============================================
            REDIRECTS & 404
        ============================================= */}

        {/* Root redirect */}
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />

        {/* Legacy /dashboard redirect to /agent/dashboard */}
        <Route path="dashboard" element={<Navigate to="/agent/dashboard" replace />} />

        {/* 404 */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-300">404</h1>
              <p className="text-gray-500 mt-2">Page not found</p>
              <a
                href={getDefaultRoute()}
                className="text-blue-500 hover:underline mt-4 inline-block"
              >
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
