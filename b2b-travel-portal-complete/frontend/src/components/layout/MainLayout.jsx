/**
 * Main Layout Component
 * Public and Agent portal layout with optional sidebar
 */

import React, { useState } from 'react';
import { Outlet, Link, useLocation, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from './Header';
import Footer from './Footer';
import {
    HomeIcon,
    TicketIcon,
    WalletIcon,
    ChartBarIcon,
    UserIcon,
    GlobeAltIcon,
    BuildingOfficeIcon,
    CubeIcon,
    HeartIcon,
    DocumentTextIcon,
    AcademicCapIcon,
    BanknotesIcon,
    Bars3Icon
} from '@heroicons/react/24/outline';

const MainLayout = ({ showSidebar = false, sidebarType = null }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const agentMenuItems = [
        { name: 'Dashboard', path: '/agent/dashboard', icon: HomeIcon },
        { name: 'My Bookings', path: '/agent/bookings', icon: TicketIcon },
        { name: 'Wallet', path: '/agent/wallet', icon: WalletIcon },
        { name: 'Commissions', path: '/agent/commissions', icon: BanknotesIcon },
        { name: 'Reports', path: '/agent/reports', icon: ChartBarIcon },
        { name: 'Flights', path: '/agent/flights', icon: GlobeAltIcon },
        { name: 'Hotels', path: '/agent/hotels', icon: BuildingOfficeIcon },
        { name: 'Buses', path: '/agent/buses', icon: CubeIcon },
        { name: 'Holidays', path: '/agent/holidays', icon: HeartIcon },
        { name: 'Visa', path: '/agent/visa', icon: DocumentTextIcon },
        { name: 'Insurance', path: '/agent/insurance', icon: DocumentTextIcon },
        { name: 'Certifications', path: '/agent/certifications', icon: AcademicCapIcon },
        { name: 'Profile', path: '/agent/profile', icon: UserIcon },
    ];

    const customerMenuItems = [
        { name: 'Dashboard', path: '/my/dashboard', icon: HomeIcon },
        { name: 'My Bookings', path: '/my/bookings', icon: TicketIcon },
        { name: 'Profile', path: '/my/profile', icon: UserIcon },
    ];

    const menuItems = sidebarType === 'agent' ? agentMenuItems : customerMenuItems;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center px-4">
                {showSidebar && (
                    <button
                        onClick={toggleSidebar}
                        className="p-2 hover:bg-gray-100 rounded-lg mr-4"
                    >
                        <Bars3Icon className="w-6 h-6 text-gray-600" />
                    </button>
                )}
                <Link to="/" className="flex items-center gap-2">
                    <span className="text-2xl">✈</span>
                    <span className="font-bold text-xl text-gray-900">TravelPortal</span>
                </Link>
                <div className="ml-auto flex items-center gap-3">
                    {isAuthenticated && user && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                                {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{user?.firstName}</span>
                        </div>
                    )}
                </div>
            </header>

            <div className="flex pt-16">
                {/* Sidebar */}
                {showSidebar && sidebarOpen && (
                    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
                        <div className="p-4">
                            {/* User Info */}
                            <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 rounded-lg">
                                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">{user?.firstName} {user?.lastName}</p>
                                    <p className="text-sm text-gray-500 truncate">{user?.companyName || 'Agent'}</p>
                                </div>
                            </div>

                            {/* Wallet Balance */}
                            {sidebarType === 'agent' && (
                                <div className="mb-4 p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-white">
                                    <p className="text-sm opacity-90">Wallet Balance</p>
                                    <p className="text-xl font-bold">₹{user?.walletBalance?.toLocaleString() || '50,000'}</p>
                                </div>
                            )}

                            {/* Navigation */}
                            <nav className="space-y-1">
                                {menuItems.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                                isActive
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            }`
                                        }
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {item.name}
                                    </NavLink>
                                ))}
                            </nav>
                        </div>
                    </aside>
                )}

                {/* Main Content */}
                <main className={`flex-1 min-h-[calc(100vh-64px)] transition-all ${showSidebar && sidebarOpen ? 'ml-64' : ''}`}>
                    <div className="p-6">
                        <Outlet />
                    </div>
                </main>
            </div>

            {!showSidebar && <Footer />}
        </div>
    );
};

export default MainLayout;
