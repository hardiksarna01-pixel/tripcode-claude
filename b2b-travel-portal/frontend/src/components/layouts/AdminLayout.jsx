import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  DollarSign,
  BarChart3,
  Calculator,
  Server,
  UserCog,
  Settings,
  HeadphonesIcon,
  Percent,
  CreditCard,
  UserCheck,
  Bell,
  FileText,
  LineChart,
  Plane,
  Building,
  Bus,
  Palmtree,
  FileCheck,
  Shield,
  Tag,
  Mail,
  Wallet,
  GraduationCap,
  BookOpen,
  HelpCircle,
  Award,
  TrendingUp,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

/**
 * ADMIN LAYOUT - STRICTLY FOR ADMINS ONLY
 * This layout contains ONLY admin-specific menu items.
 * NO agent or superadmin options should EVER appear here.
 *
 * Admin Pages (33 total):
 * Dashboard, Agents, Bookings, Finance, Reports, Markup, Suppliers,
 * Users, Settings, Support, Commissions, Credit Management, Customers,
 * Notifications, Audit Logs, Analytics, Flights, Hotels, Buses,
 * Holidays, Visa, Insurance, Promo Codes, Email Templates, Payment Gateway,
 * Certification Management, Course Builder, Question Bank,
 * Certificate Templates, Revenue Analytics
 */
const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    products: false,
    certification: false,
  });
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // ADMIN-ONLY MENU ITEMS - 33 items as specified
  const adminMenuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/agents', icon: Users, label: 'Agents' },
    { path: '/admin/bookings', icon: ClipboardList, label: 'Bookings' },
    { path: '/admin/finance', icon: DollarSign, label: 'Finance' },
    { path: '/admin/reports', icon: BarChart3, label: 'Reports' },
    { path: '/admin/markup', icon: Percent, label: 'Markup' },
    { path: '/admin/suppliers', icon: Server, label: 'Suppliers' },
    { path: '/admin/users', icon: UserCog, label: 'Users' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
    { path: '/admin/support', icon: HeadphonesIcon, label: 'Support' },
    { path: '/admin/commissions', icon: Calculator, label: 'Commissions' },
    { path: '/admin/credit-management', icon: CreditCard, label: 'Credit Management' },
    { path: '/admin/customers', icon: UserCheck, label: 'Customers' },
    { path: '/admin/notifications', icon: Bell, label: 'Notifications' },
    { path: '/admin/audit-logs', icon: FileText, label: 'Audit Logs' },
    { path: '/admin/analytics', icon: LineChart, label: 'Analytics' },

    // Products Section
    { type: 'divider', label: 'PRODUCTS' },
    { path: '/admin/flights', icon: Plane, label: 'Flights' },
    { path: '/admin/hotels', icon: Building, label: 'Hotels' },
    { path: '/admin/buses', icon: Bus, label: 'Buses' },
    { path: '/admin/holidays', icon: Palmtree, label: 'Holidays' },
    { path: '/admin/visa', icon: FileCheck, label: 'Visa' },
    { path: '/admin/insurance', icon: Shield, label: 'Insurance' },

    // Settings Section
    { type: 'divider', label: 'CONFIGURATION' },
    { path: '/admin/promo-codes', icon: Tag, label: 'Promo Codes' },
    { path: '/admin/email-templates', icon: Mail, label: 'Email Templates' },
    { path: '/admin/payment-gateway', icon: Wallet, label: 'Payment Gateway' },

    // Certification Section
    { type: 'divider', label: 'CERTIFICATION' },
    { path: '/admin/certification-management', icon: GraduationCap, label: 'Certification Management' },
    { path: '/admin/course-builder', icon: BookOpen, label: 'Course Builder' },
    { path: '/admin/question-bank', icon: HelpCircle, label: 'Question Bank' },
    { path: '/admin/certificate-templates', icon: Award, label: 'Certificate Templates' },
    { path: '/admin/revenue-analytics', icon: TrendingUp, label: 'Revenue Analytics' },
  ];

  const NavItem = ({ item }) => {
    if (item.type === 'divider') {
      return (
        <div className={`mt-6 mb-2 px-4 ${!sidebarOpen && 'hidden'}`}>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {item.label}
          </span>
        </div>
      );
    }

    return (
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm ${
            isActive
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`
        }
        onClick={() => setMobileMenuOpen(false)}
      >
        <item.icon size={18} />
        {sidebarOpen && <span>{item.label}</span>}
      </NavLink>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header - Admin Branding */}
      <header className="bg-gradient-to-r from-indigo-700 to-indigo-600 text-white h-16 fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-indigo-800 rounded"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-indigo-600 font-bold text-lg">T</span>
            </div>
            <h1 className="text-xl font-bold">TripCode</h1>
            <span className="text-xs bg-indigo-500 px-2 py-0.5 rounded ml-2">ADMIN</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium">{user?.name || user?.email}</p>
            <p className="text-xs text-indigo-200">{user?.role || 'Administrator'}</p>
          </div>
          <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
            <span className="font-semibold">
              {user?.name?.[0] || user?.email?.[0] || 'A'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-800 hover:bg-indigo-900 rounded transition-colors"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Sidebar - ADMIN ONLY */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow-lg z-40 transition-all duration-300 overflow-y-auto
          ${sidebarOpen ? 'w-64' : 'w-20'}
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-4 h-full flex flex-col">
          {/* Toggle button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex absolute -right-3 top-6 bg-indigo-600 text-white p-1 rounded-full shadow"
          >
            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>

          {/* Admin Panel Label */}
          <div className={`mb-4 pb-4 border-b ${!sidebarOpen && 'hidden'}`}>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Admin Panel
            </span>
          </div>

          {/* Menu Items - ADMIN ONLY */}
          <nav className="flex-1 space-y-1">
            {adminMenuItems.map((item, index) => (
              <NavItem key={item.path || index} item={item} />
            ))}
          </nav>

          {/* User info at bottom */}
          <div className={`border-t pt-4 mt-4 ${!sidebarOpen && 'hidden'}`}>
            <div className="flex items-center gap-3 px-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-semibold">
                  {user?.name?.[0] || user?.email?.[0] || 'A'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <div className="p-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
