import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FolderTree,
  Calculator,
  Server,
  Palette,
  Globe,
  Building,
  Globe2,
  Mail,
  BarChart3,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    agentManagement: true,
    commissionSchemes: false,
    apiSuppliers: false,
    whiteLabel: false,
    reports: false,
    system: false,
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

  // Admin-only menu structure
  const adminMenuSections = [
    {
      id: 'dashboard',
      label: 'Admin Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
      type: 'link'
    },
    {
      id: 'agentManagement',
      label: 'Agent Management',
      icon: Users,
      type: 'section',
      items: [
        { path: '/admin/agents', icon: Users, label: 'All Agents' },
        { path: '/admin/agents/approvals', icon: UserCheck, label: 'Signup Approvals' },
        { path: '/admin/groups', icon: FolderTree, label: 'Agent Groups' },
      ]
    },
    {
      id: 'commissionSchemes',
      label: 'Commission & Schemes',
      icon: Calculator,
      type: 'section',
      items: [
        { path: '/admin/schemes', icon: Calculator, label: 'Manage Schemes' },
      ]
    },
    {
      id: 'apiSuppliers',
      label: 'API & Suppliers',
      icon: Server,
      type: 'section',
      items: [
        { path: '/admin/api-providers', icon: Server, label: 'API Providers' },
      ]
    },
    {
      id: 'whiteLabel',
      label: 'White Label',
      icon: Palette,
      type: 'section',
      items: [
        { path: '/admin/branding', icon: Palette, label: 'Branding & Theme' },
        { path: '/admin/b2c-portal', icon: Globe, label: 'B2C Consumer Portal' },
        { path: '/admin/b2b-portal', icon: Building, label: 'B2B Agent Portal' },
        { path: '/admin/tenants', icon: Building, label: 'Tenant Management' },
        { path: '/admin/domains', icon: Globe2, label: 'Custom Domains' },
        { path: '/admin/email-templates', icon: Mail, label: 'Email Templates' },
      ]
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: BarChart3,
      type: 'section',
      items: [
        { path: '/admin/reports/bookings', icon: BarChart3, label: 'Booking Reports' },
        { path: '/admin/reports/revenue', icon: DollarSign, label: 'Revenue Reports' },
      ]
    },
    {
      id: 'system',
      label: 'System',
      icon: Settings,
      type: 'section',
      items: [
        { path: '/admin/settings', icon: Settings, label: 'System Settings' },
      ]
    },
  ];

  const NavItem = ({ item }) => (
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
      <item.icon size={18} />
      {sidebarOpen && <span>{item.label}</span>}
    </NavLink>
  );

  const MenuSection = ({ section }) => {
    if (section.type === 'link') {
      return <NavItem item={{ path: section.path, icon: section.icon, label: section.label }} />;
    }

    const isExpanded = expandedSections[section.id];

    return (
      <div className="mb-1">
        <button
          onClick={() => toggleSection(section.id)}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors text-sm
            ${isExpanded ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <div className="flex items-center gap-3">
            <section.icon size={18} />
            {sidebarOpen && <span className="font-medium">{section.label}</span>}
          </div>
          {sidebarOpen && (
            isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />
          )}
        </button>
        {isExpanded && sidebarOpen && (
          <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-4">
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-600 text-white h-16 fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-blue-800 rounded"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">T</span>
            </div>
            <h1 className="text-xl font-bold">TripCode Admin</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium">{user?.name || user?.email}</p>
            <p className="text-xs text-blue-200">{user?.role || 'Administrator'}</p>
          </div>
          <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center">
            <span className="font-semibold">
              {user?.name?.[0] || user?.email?.[0] || 'A'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-blue-800 hover:bg-blue-900 rounded transition-colors"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow-lg z-40 transition-all duration-300 overflow-y-auto
          ${sidebarOpen ? 'w-72' : 'w-20'}
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

          {/* Admin Label */}
          <div className={`mb-4 pb-4 border-b ${!sidebarOpen && 'lg:hidden'}`}>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Admin Panel
            </span>
          </div>

          {/* Menu Sections */}
          <div className="flex-1 space-y-1">
            {adminMenuSections.map((section) => (
              <MenuSection key={section.id} section={section} />
            ))}
          </div>

          {/* Admin info at bottom */}
          <div className={`border-t pt-4 mt-4 ${!sidebarOpen && 'lg:hidden'}`}>
            <div className="flex items-center gap-3 px-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {user?.name?.[0] || user?.email?.[0] || 'A'}
                </span>
              </div>
              {sidebarOpen && (
                <div>
                  <p className="text-sm font-medium">{user?.name || 'Super Admin'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'admin@tripcode.com'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'}`}>
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
