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

// Public/Home Page
import Home from './pages/home/Home';

// Flight Pages
import FlightSearch from './pages/flights/FlightSearch';
import FlightResults from './pages/flights/FlightResults';
import FlightBooking from './pages/flights/FlightBooking';

// Hotel Pages
import HotelSearch from './pages/hotels/HotelSearch';
import HotelResults from './pages/hotels/HotelResults';
import HotelBooking from './pages/hotels/HotelBooking';

// Bus Pages
import BusSearch from './pages/bus/BusSearch';
import BusResults from './pages/bus/BusResults';
import BusSeatSelection from './pages/bus/BusSeatSelection';

// Holiday Packages
import HolidayPackages from './pages/holidays/HolidayPackages';

// Visa Pages
import VisaApplication from './pages/visa/VisaApplication';

// Insurance Pages
import InsuranceSearch from './pages/insurance/InsuranceSearch';

// Forex Pages
import ForexServices from './pages/forex/ForexServices';

// Finance Pages
import GSTTDSCalculation from './pages/finance/GSTTDSCalculation';

// Payment Pages
import PaymentGatewayPage from './pages/payment/PaymentGateway';

// AI Tools
import AIChatbot from './pages/ai/AIChatbot';
import AIImageGenerator from './pages/ai/AIImageGenerator';
import AITripPlanner from './pages/ai/AITripPlanner';

// Agent Portal Pages
import AgentDashboard from './pages/agent/Dashboard';
import AgentBookings from './pages/agent/Bookings';
import AgentWallet from './pages/agent/Wallet';
import AgentReports from './pages/agent/Reports';
import AgentCommissions from './pages/agent/Commissions';
import AgentProfile from './pages/agent/Profile';

// Customer Pages
import CustomerDashboard from './pages/customer/Dashboard';
import CustomerBookings from './pages/customer/Bookings';
import CustomerProfile from './pages/customer/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminAgents from './pages/admin/Agents';
import AdminBookings from './pages/admin/Bookings';
import AdminFinance from './pages/admin/Finance';
import AdminReports from './pages/admin/Reports';
import AdminMarkup from './pages/admin/Markup';
import AdminSuppliers from './pages/admin/Suppliers';
import AdminUsers from './pages/admin/Users';
import AdminSettings from './pages/admin/Settings';
import AdminSupport from './pages/admin/Support';
import AdminCommissions from './pages/admin/Commissions';
import AdminCreditManagement from './pages/admin/CreditManagement';
import AdminCustomers from './pages/admin/Customers';
import AdminNotifications from './pages/admin/Notifications';
import AdminAuditLogs from './pages/admin/AuditLogs';
import AdminAnalytics from './pages/admin/Analytics';
import AdminFlights from './pages/admin/Flights';
import AdminHotels from './pages/admin/Hotels';
import AdminBuses from './pages/admin/Buses';
import AdminHolidays from './pages/admin/Holidays';
import AdminVisa from './pages/admin/Visa';
import AdminInsurance from './pages/admin/Insurance';
import AdminPromoCodes from './pages/admin/PromoCodes';
import AdminEmailTemplates from './pages/admin/EmailTemplates';
import AdminPaymentGateway from './pages/admin/PaymentGateway';
import AdminCertificationManagement from './pages/admin/CertificationManagement';
import AdminCourseBuilder from './pages/admin/CourseBuilder';
import AdminQuestionBank from './pages/admin/QuestionBank';
import AdminCertificateTemplates from './pages/admin/CertificateTemplates';
import AdminCertificationRevenue from './pages/admin/CertificationRevenue';
import AdminGroups from './pages/admin/Groups';
import AdminSchemes from './pages/admin/Schemes';

// Admin Whitelabel Pages
import { Branding, Themes, DomainSettings, CustomPages, WhitelabelDashboard } from './pages/admin/whitelabel';

// Admin API Pages
import { ApiKeys, ApiDocumentation, Webhooks, Integrations, IntegrationHub } from './pages/admin/api';

// Admin PNR Pages
import { PNRManagement, PNRHistory, PNRNotifications } from './pages/admin/pnr';

// Agent PNR Pages
import {
    PNRDashboard as AgentPNRDashboard,
    IssueTicket,
    ReissueTicket,
    DateChange,
    Cancellation,
    VoidRequest
} from './pages/agent/pnr';

// Certification Pages (Agent/Public)
import CertificationHub from './pages/certification/CertificationHub';
import MyCourses from './pages/certification/MyCourses';
import CoursesCatalog from './pages/certification/CoursesCatalog';
import CourseDetails from './pages/certification/CourseDetails';
import CoursePlayer from './pages/certification/CoursePlayer';
import ExamPortal from './pages/certification/ExamPortal';
import MyCertificates from './pages/certification/MyCertificates';
import MembershipApplication from './pages/certification/MembershipApplication';

// Super Admin Pages
import SuperAdminDashboard from './pages/superadmin/Dashboard';
import SuperAdminCompanies from './pages/superadmin/Companies';
import SuperAdminPlans from './pages/superadmin/Plans';
import SuperAdminBilling from './pages/superadmin/Billing';
import SuperAdminUsers from './pages/superadmin/Users';
import SuperAdminAPIManagement from './pages/superadmin/APIManagement';
import SuperAdminSystemHealth from './pages/superadmin/SystemHealth';
import SuperAdminGlobalSettings from './pages/superadmin/GlobalSettings';
import SuperAdminSupplierHub from './pages/superadmin/SupplierHub';
import SuperAdminReports from './pages/superadmin/Reports';
import SuperAdminAuditLogs from './pages/superadmin/AuditLogs';
import SuperAdminFeatureFlags from './pages/superadmin/FeatureFlags';
import SuperAdminAnnouncements from './pages/superadmin/Announcements';
import SuperAdminAnalytics from './pages/superadmin/Analytics';

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
                                <Route path="/hotels/book" element={<HotelBooking />} />

                                {/* Buses */}
                                <Route path="/buses" element={<BusSearch />} />
                                <Route path="/buses/results" element={<BusResults />} />
                                <Route path="/buses/seats" element={<BusSeatSelection />} />

                                {/* Holiday Packages */}
                                <Route path="/holidays" element={<HolidayPackages />} />
                                <Route path="/holidays/:id" element={<HolidayPackages />} />

                                {/* Visa Services */}
                                <Route path="/visa" element={<VisaApplication />} />
                                <Route path="/visa/:country" element={<VisaApplication />} />

                                {/* Insurance */}
                                <Route path="/insurance" element={<InsuranceSearch />} />

                                {/* Forex Services */}
                                <Route path="/forex" element={<ForexServices />} />

                                {/* AI Tools */}
                                <Route path="/ai/chatbot" element={<AIChatbot />} />
                                <Route path="/ai/trip-planner" element={<AITripPlanner />} />
                                <Route path="/ai/image-generator" element={<AIImageGenerator />} />

                                {/* Payment */}
                                <Route path="/payment" element={<PaymentGatewayPage />} />
                                <Route path="/payment/:bookingId" element={<PaymentGatewayPage />} />

                                {/* Certification & Training Hub (Public) */}
                                <Route path="/certifications" element={<CertificationHub />} />
                                <Route path="/certifications/courses" element={<CoursesCatalog />} />
                                <Route path="/certifications/courses/:id" element={<CourseDetails />} />
                                <Route path="/certifications/membership/:associationCode" element={<MembershipApplication />} />
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
                                <Route path="commissions" element={<AgentCommissions />} />
                                <Route path="profile" element={<AgentProfile />} />

                                {/* Agent Booking Routes */}
                                <Route path="flights" element={<FlightSearch />} />
                                <Route path="flights/results" element={<FlightResults />} />
                                <Route path="flights/book" element={<FlightBooking />} />
                                <Route path="hotels" element={<HotelSearch />} />
                                <Route path="hotels/results" element={<HotelResults />} />
                                <Route path="hotels/book" element={<HotelBooking />} />
                                <Route path="buses" element={<BusSearch />} />
                                <Route path="buses/results" element={<BusResults />} />
                                <Route path="buses/seats" element={<BusSeatSelection />} />
                                <Route path="holidays" element={<HolidayPackages />} />
                                <Route path="visa" element={<VisaApplication />} />
                                <Route path="insurance" element={<InsuranceSearch />} />
                                <Route path="forex" element={<ForexServices />} />
                                <Route path="gst-tds" element={<GSTTDSCalculation />} />

                                {/* Agent AI Tools */}
                                <Route path="ai/chatbot" element={<AIChatbot />} />
                                <Route path="ai/trip-planner" element={<AITripPlanner />} />
                                <Route path="ai/image-generator" element={<AIImageGenerator />} />

                                {/* Agent PNR Management Routes */}
                                <Route path="pnr" element={<AgentPNRDashboard />} />
                                <Route path="pnr/issue" element={<IssueTicket />} />
                                <Route path="pnr/reissue" element={<ReissueTicket />} />
                                <Route path="pnr/date-change" element={<DateChange />} />
                                <Route path="pnr/cancellation" element={<Cancellation />} />
                                <Route path="pnr/void" element={<VoidRequest />} />

                                {/* Agent Certification Routes */}
                                <Route path="certifications" element={<CertificationHub />} />
                                <Route path="certifications/my-courses" element={<MyCourses />} />
                                <Route path="certifications/courses" element={<CoursesCatalog />} />
                                <Route path="certifications/courses/:id" element={<CourseDetails />} />
                                <Route path="certifications/learn/:enrollmentId" element={<CoursePlayer />} />
                                <Route path="certifications/exam/:examId" element={<ExamPortal />} />
                                <Route path="certifications/my-certificates" element={<MyCertificates />} />
                                <Route path="certifications/membership/:associationCode" element={<MembershipApplication />} />
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

                                {/* Customer AI Tools */}
                                <Route path="ai/chatbot" element={<AIChatbot />} />
                                <Route path="ai/trip-planner" element={<AITripPlanner />} />
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
                                <Route path="agents" element={<AdminAgents />} />
                                <Route path="groups" element={<AdminGroups />} />
                                <Route path="schemes" element={<AdminSchemes />} />
                                <Route path="bookings" element={<AdminBookings />} />
                                <Route path="finance" element={<AdminFinance />} />
                                <Route path="reports" element={<AdminReports />} />
                                <Route path="markup" element={<AdminMarkup />} />
                                <Route path="suppliers" element={<AdminSuppliers />} />
                                <Route path="users" element={<AdminUsers />} />
                                <Route path="settings" element={<AdminSettings />} />
                                <Route path="support" element={<AdminSupport />} />
                                <Route path="commissions" element={<AdminCommissions />} />
                                <Route path="credit" element={<AdminCreditManagement />} />
                                <Route path="customers" element={<AdminCustomers />} />
                                <Route path="notifications" element={<AdminNotifications />} />
                                <Route path="audit-logs" element={<AdminAuditLogs />} />
                                <Route path="analytics" element={<AdminAnalytics />} />
                                <Route path="flights" element={<AdminFlights />} />
                                <Route path="hotels" element={<AdminHotels />} />
                                <Route path="buses" element={<AdminBuses />} />
                                <Route path="holidays" element={<AdminHolidays />} />
                                <Route path="visa" element={<AdminVisa />} />
                                <Route path="insurance" element={<AdminInsurance />} />
                                <Route path="promo-codes" element={<AdminPromoCodes />} />
                                <Route path="email-templates" element={<AdminEmailTemplates />} />
                                <Route path="payment-gateway" element={<AdminPaymentGateway />} />

                                {/* Certification Management */}
                                <Route path="certifications" element={<AdminCertificationManagement />} />
                                <Route path="certifications/courses" element={<AdminCourseBuilder />} />
                                <Route path="certifications/courses/new" element={<AdminCourseBuilder />} />
                                <Route path="certifications/courses/:id/edit" element={<AdminCourseBuilder />} />
                                <Route path="certifications/questions" element={<AdminQuestionBank />} />
                                <Route path="certifications/templates" element={<AdminCertificateTemplates />} />
                                <Route path="certifications/revenue" element={<AdminCertificationRevenue />} />

                                {/* Admin AI Tools */}
                                <Route path="ai/chatbot" element={<AIChatbot />} />
                                <Route path="ai/trip-planner" element={<AITripPlanner />} />
                                <Route path="ai/image-generator" element={<AIImageGenerator />} />
                                <Route path="ai/analytics" element={<AdminAnalytics />} />

                                {/* Admin PNR Management Routes */}
                                <Route path="pnr" element={<PNRManagement />} />
                                <Route path="pnr/issue" element={<PNRManagement />} />
                                <Route path="pnr/reissue" element={<PNRManagement />} />
                                <Route path="pnr/date-change" element={<PNRManagement />} />
                                <Route path="pnr/cancellation" element={<PNRManagement />} />
                                <Route path="pnr/void" element={<PNRManagement />} />
                                <Route path="pnr/history" element={<PNRHistory />} />
                                <Route path="pnr/notifications" element={<PNRNotifications />} />

                                {/* Admin Whitelabel Routes */}
                                <Route path="whitelabel" element={<WhitelabelDashboard />} />
                                <Route path="whitelabel/b2b" element={<WhitelabelDashboard />} />
                                <Route path="whitelabel/b2c" element={<WhitelabelDashboard />} />
                                <Route path="whitelabel/branding" element={<Branding />} />
                                <Route path="whitelabel/themes" element={<Themes />} />
                                <Route path="whitelabel/domain" element={<DomainSettings />} />
                                <Route path="whitelabel/pages" element={<CustomPages />} />

                                {/* Admin API Routes */}
                                <Route path="api/hub" element={<IntegrationHub />} />
                                <Route path="api/keys" element={<ApiKeys />} />
                                <Route path="api/docs" element={<ApiDocumentation />} />
                                <Route path="api/webhooks" element={<Webhooks />} />
                                <Route path="api/integrations" element={<Integrations />} />
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
                                <Route path="companies" element={<SuperAdminCompanies />} />
                                <Route path="plans" element={<SuperAdminPlans />} />
                                <Route path="billing" element={<SuperAdminBilling />} />
                                <Route path="users" element={<SuperAdminUsers />} />
                                <Route path="api" element={<SuperAdminAPIManagement />} />
                                <Route path="system-health" element={<SuperAdminSystemHealth />} />
                                <Route path="settings" element={<SuperAdminGlobalSettings />} />
                                <Route path="suppliers" element={<SuperAdminSupplierHub />} />
                                <Route path="reports" element={<SuperAdminReports />} />
                                <Route path="audit-logs" element={<SuperAdminAuditLogs />} />
                                <Route path="feature-flags" element={<SuperAdminFeatureFlags />} />
                                <Route path="announcements" element={<SuperAdminAnnouncements />} />
                                <Route path="analytics" element={<SuperAdminAnalytics />} />

                                {/* Super Admin AI Tools */}
                                <Route path="ai/chatbot" element={<AIChatbot />} />
                                <Route path="ai/trip-planner" element={<AITripPlanner />} />
                                <Route path="ai/image-generator" element={<AIImageGenerator />} />
                                <Route path="ai/analytics" element={<SuperAdminAnalytics />} />

                                {/* Super Admin PNR Operations Routes */}
                                <Route path="pnr" element={<PNRManagement />} />
                                <Route path="pnr/pending" element={<PNRManagement />} />
                                <Route path="pnr/issue" element={<PNRManagement />} />
                                <Route path="pnr/reissue" element={<PNRManagement />} />
                                <Route path="pnr/date-change" element={<PNRManagement />} />
                                <Route path="pnr/cancellation" element={<PNRManagement />} />
                                <Route path="pnr/void" element={<PNRManagement />} />
                                <Route path="pnr/history" element={<PNRHistory />} />
                                <Route path="pnr/notifications" element={<PNRNotifications />} />

                                {/* Super Admin Whitelabel Routes */}
                                <Route path="whitelabel" element={<WhitelabelDashboard />} />
                                <Route path="whitelabel/b2b" element={<WhitelabelDashboard />} />
                                <Route path="whitelabel/b2c" element={<WhitelabelDashboard />} />
                                <Route path="whitelabel/tenants" element={<WhitelabelDashboard />} />
                                <Route path="whitelabel/platform" element={<Branding />} />
                                <Route path="whitelabel/themes" element={<Themes />} />
                                <Route path="whitelabel/domains" element={<DomainSettings />} />
                                <Route path="whitelabel/templates" element={<CustomPages />} />

                                {/* Super Admin API Routes */}
                                <Route path="api/hub" element={<IntegrationHub />} />
                                <Route path="api/gateway" element={<IntegrationHub />} />
                                <Route path="api/keys" element={<ApiKeys />} />
                                <Route path="api/rate-limits" element={<ApiDocumentation />} />
                                <Route path="api/docs" element={<ApiDocumentation />} />
                                <Route path="api/webhooks" element={<Webhooks />} />
                                <Route path="api/integrations" element={<Integrations />} />
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
