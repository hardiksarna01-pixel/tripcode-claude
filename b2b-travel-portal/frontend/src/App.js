import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// Pages
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AgentDashboard from './pages/AgentDashboard';
import FlightSearchPage from './components/FlightSearchPage';
import FlightBookingPage from './components/FlightBookingPage';

// Admin Components
import AgentSignupApprovals from './components/admin/AgentSignupApprovals';
import SchemeManagement from './components/admin/SchemeManagement';
import ApiProviderManagement from './components/admin/ApiProviderManagement';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          isAuthenticated ? (
            <Navigate to={user?.role === 'SUPER_ADMIN' ? '/admin' : '/dashboard'} replace />
          ) : (
            <LoginPage />
          )
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="SUPER_ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/agents/approvals" element={
          <ProtectedRoute requiredRole="SUPER_ADMIN">
            <AgentSignupApprovals />
          </ProtectedRoute>
        } />
        <Route path="/admin/schemes" element={
          <ProtectedRoute requiredRole="SUPER_ADMIN">
            <SchemeManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/api-providers" element={
          <ProtectedRoute requiredRole="SUPER_ADMIN">
            <ApiProviderManagement />
          </ProtectedRoute>
        } />

        {/* Agent Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AgentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/flights/search" element={
          <ProtectedRoute>
            <FlightSearchPage />
          </ProtectedRoute>
        } />
        <Route path="/flights/booking" element={
          <ProtectedRoute>
            <FlightBookingPage />
          </ProtectedRoute>
        } />

        {/* Default Route */}
        <Route path="/" element={
          isAuthenticated ? (
            <Navigate to={user?.role === 'SUPER_ADMIN' ? '/admin' : '/dashboard'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } />

        {/* 404 */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-300">404</h1>
              <p className="text-xl text-gray-500 mt-4">Page not found</p>
              <a href="/" className="mt-6 inline-block px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                Go Home
              </a>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
