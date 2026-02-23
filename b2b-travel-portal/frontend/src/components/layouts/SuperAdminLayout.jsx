import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Receipt,
  Users,
  Server,
  Activity,
  Settings,
  Truck,
  BarChart3,
  FileText,
  Flag,
  Megaphone,
  LineChart,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

/**
 * SUPER ADMIN LAYOUT - STRICTLY FOR SUPER ADMINS ONLY
 * This layout contains ONLY super admin-specific menu items.
 * NO agent or regular admin options should EVER appear here.
 *
 * Super Admin Pages (14 total):
 * Dashboard, Companies, Plans, Billing, Users, API Management,
 * System Health, Global Settings, Supplier Hub, Reports, Audit Logs,
 * Feature Flags, Announcements, Analytics
 */
const SuperAdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // SUPER ADMIN-ONLY MENU ITEMS - 14 items as specified
  const superAdminMenuItems = [
    { path: '/superadmin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/superadmin/companies', icon: Building2, label: 'Companies' },
    { path: '/superadmin/plans', icon: CreditCard, label: 'Plans' },
    { path: '/superadmin/billing', icon: Receipt, label: 'Billing' },
    { path: '/superadmin/users', icon: Users, label: 'Users' },
    { path: '/superadmin/api-management', icon: Server, label: 'API Management' },
    { path: '/superadmin/system-health', icon: Activity, label: 'System Health' },
    { path: '/superadmin/global-settings', icon: Settings, label: 'Global Settings' },
    { path: '/superadmin/supplier-hub', icon: Truck, label: 'Supplier Hub' },
    { path: '/superadmin/reports', icon: BarChart3, label: 'Reports' },
    { path: '/superadmin/audit-logs', icon: FileText, label: 'Audit Logs' },
    { path: '/superadmin/feature-flags', icon: Flag, label: 'Feature Flags' },
    { path: '/superadmin/announcements', icon: Megaphone, label: 'Announcements' },
    { path: '/superadmin/analytics', icon: LineChart, label: 'Analytics' },
  ];

  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
          isActive
            ? 'bg-purple-600 text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`
      }
      onClick={() => setMobileMenuOpen(false)}
    >
      <item.icon size={20} />
      {sidebarOpen && <span>{item.label}</span>}
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header - Super Admin Branding */}
      <header className="bg-gradient-to-r from-purple-700 to-purple-600 text-white h-16 fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-purple-800 rounded"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-purple-600 font-bold text-lg">T</span>
            </div>
            <h1 className="text-xl font-bold">TripCode</h1>
            <span className="text-xs bg-purple-500 px-2 py-0.5 rounded ml-2">SUPER ADMIN</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium">{user?.name || user?.email}</p>
            <p className="text-xs text-purple-200">Super Administrator</p>
          </div>
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="font-semibold">
              {user?.name?.[0] || user?.email?.[0] || 'S'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-purple-800 hover:bg-purple-900 rounded transition-colors"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Sidebar - SUPER ADMIN ONLY */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow-lg z-40 transition-all duration-300 overflow-y-auto
          ${sidebarOpen ? 'w-64' : 'w-20'}
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-4 h-full flex flex-col">
          {/* Toggle button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex absolute -right-3 top-6 bg-purple-600 text-white p-1 rounded-full shadow"
          >
            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>

          {/* Super Admin Panel Label */}
          <div className={`mb-4 pb-4 border-b ${!sidebarOpen && 'hidden'}`}>
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
              Super Admin Panel
            </span>
          </div>

          {/* Menu Items - SUPER ADMIN ONLY */}
          <nav className="flex-1 space-y-1">
            {superAdminMenuItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </nav>

          {/* User info at bottom */}
          <div className={`border-t pt-4 mt-4 ${!sidebarOpen && 'hidden'}`}>
            <div className="flex items-center gap-3 px-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-semibold">
                  {user?.name?.[0] || user?.email?.[0] || 'S'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">{user?.name || 'Super Admin'}</p>
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

export default SuperAdminLayout;
