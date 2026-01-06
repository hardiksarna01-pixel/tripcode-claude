import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Plane,
  ClipboardList,
  Wallet,
  User,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

const AgentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const agentMenuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/flights', icon: Plane, label: 'Search Flights' },
    { path: '/bookings', icon: ClipboardList, label: 'My Bookings' },
    { path: '/wallet', icon: Wallet, label: 'Wallet' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      <header className="bg-blue-600 text-white h-16 fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-blue-700 rounded"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-xl font-bold">TripCode</h1>
          <nav className="hidden md:flex items-center gap-2 ml-8">
            <NavLink to="/flights" className="px-4 py-2 rounded hover:bg-blue-700">
              FLIGHT
            </NavLink>
            <NavLink to="/bookings" className="px-4 py-2 rounded hover:bg-blue-700">
              BOOKINGS
            </NavLink>
            <NavLink to="/wallet" className="px-4 py-2 rounded hover:bg-blue-700">
              WALLET
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium">{user?.name || user?.email}</p>
            <p className="text-xs text-blue-200">Agent</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow-lg z-40 transition-all duration-300
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

          {/* Menu Section */}
          <div className="flex-1">
            <p className={`text-xs font-semibold text-gray-400 uppercase mb-4 ${!sidebarOpen && 'lg:hidden'}`}>
              Agent Menu
            </p>
            <nav className="space-y-2">
              {agentMenuItems.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
            </nav>
          </div>

          {/* User info at bottom */}
          <div className={`border-t pt-4 ${!sidebarOpen && 'lg:hidden'}`}>
            <div className="flex items-center gap-3 px-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {user?.name?.[0] || user?.email?.[0] || 'A'}
                </span>
              </div>
              {sidebarOpen && (
                <div>
                  <p className="text-sm font-medium">{user?.name || 'Agent'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              )}
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
