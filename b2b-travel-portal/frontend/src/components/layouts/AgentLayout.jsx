import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Wallet,
  BarChart3,
  Calculator,
  User,
  GraduationCap,
  BookOpen,
  Library,
  PlayCircle,
  FileCheck,
  Award,
  FileText,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

/**
 * AGENT LAYOUT - STRICTLY FOR AGENTS ONLY
 * This layout contains ONLY agent-specific menu items.
 * NO admin or superadmin options should EVER appear here.
 *
 * Agent Pages (16 total):
 * Dashboard, Bookings, Wallet, Reports, Commissions, Profile,
 * Certification Hub, My Courses, Courses Catalog, Course Details,
 * Course Player, Exam Portal, My Certificates, Membership Application
 */
const AgentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // AGENT-ONLY MENU ITEMS - 16 items as specified
  const agentMenuItems = [
    { path: '/agent/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/agent/bookings', icon: ClipboardList, label: 'Bookings' },
    { path: '/agent/wallet', icon: Wallet, label: 'Wallet' },
    { path: '/agent/reports', icon: BarChart3, label: 'Reports' },
    { path: '/agent/commissions', icon: Calculator, label: 'Commissions' },
    { path: '/agent/profile', icon: User, label: 'Profile' },

    // Certification Hub Section
    { type: 'divider', label: 'CERTIFICATION HUB' },
    { path: '/agent/certification-hub', icon: GraduationCap, label: 'Certification Hub' },
    { path: '/agent/my-courses', icon: BookOpen, label: 'My Courses' },
    { path: '/agent/courses-catalog', icon: Library, label: 'Courses Catalog' },
    { path: '/agent/course-details', icon: FileText, label: 'Course Details' },
    { path: '/agent/course-player', icon: PlayCircle, label: 'Course Player' },
    { path: '/agent/exam-portal', icon: FileCheck, label: 'Exam Portal' },
    { path: '/agent/my-certificates', icon: Award, label: 'My Certificates' },
    { path: '/agent/membership-application', icon: FileText, label: 'Membership Application' },
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
          `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
            isActive
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`
        }
        onClick={() => setMobileMenuOpen(false)}
      >
        <item.icon size={20} />
        {sidebarOpen && <span>{item.label}</span>}
      </NavLink>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header - Agent Branding */}
      <header className="bg-blue-600 text-white h-16 fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-blue-700 rounded"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">T</span>
            </div>
            <h1 className="text-xl font-bold">TripCode</h1>
            <span className="text-xs bg-blue-500 px-2 py-0.5 rounded ml-2">AGENT</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium">{user?.companyName || user?.name || 'Agent'}</p>
            <p className="text-xs text-blue-200">{user?.email}</p>
          </div>
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="font-semibold">
              {user?.name?.[0] || user?.email?.[0] || 'A'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded transition-colors"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Sidebar - AGENT ONLY */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow-lg z-40 transition-all duration-300 overflow-y-auto
          ${sidebarOpen ? 'w-64' : 'w-20'}
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-4 h-full flex flex-col">
          {/* Toggle button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex absolute -right-3 top-6 bg-blue-600 text-white p-1 rounded-full shadow"
          >
            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>

          {/* Agent Panel Label */}
          <div className={`mb-4 pb-4 border-b ${!sidebarOpen && 'hidden'}`}>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Agent Panel
            </span>
          </div>

          {/* Menu Items - AGENT ONLY */}
          <nav className="flex-1 space-y-1">
            {agentMenuItems.map((item, index) => (
              <NavItem key={item.path || index} item={item} />
            ))}
          </nav>

          {/* User info at bottom */}
          <div className={`border-t pt-4 mt-4 ${!sidebarOpen && 'hidden'}`}>
            <div className="flex items-center gap-3 px-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {user?.name?.[0] || user?.email?.[0] || 'A'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">{user?.companyName || 'Agent'}</p>
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

export default AgentLayout;
