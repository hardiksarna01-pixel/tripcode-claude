/**
 * Sidebar Component
 * Navigation sidebar for agent/customer portals
 */

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    HomeIcon,
    TicketIcon,
    WalletIcon,
    ChartBarIcon,
    UserIcon,
    UsersIcon,
    Cog6ToothIcon,
    BuildingOfficeIcon,
    CreditCardIcon,
    DocumentTextIcon,
    GlobeAltIcon,
    KeyIcon,
    PaintBrushIcon,
    EnvelopeIcon,
    TagIcon,
    CubeIcon,
    BanknotesIcon,
    ClipboardDocumentListIcon,
    HeartIcon,
    BellIcon
} from '@heroicons/react/24/outline';
import './Sidebar.css';

const Sidebar = ({ isOpen, type, user }) => {
    const location = useLocation();

    const agentMenuItems = [
        {
            title: 'Main',
            items: [
                { name: 'Dashboard', path: '/agent/dashboard', icon: HomeIcon },
                { name: 'My Bookings', path: '/agent/bookings', icon: TicketIcon },
                { name: 'Wallet', path: '/agent/wallet', icon: WalletIcon },
                { name: 'Reports', path: '/agent/reports', icon: ChartBarIcon },
            ]
        },
        {
            title: 'Search & Book',
            items: [
                { name: 'Flights', path: '/flights', icon: GlobeAltIcon },
                { name: 'Hotels', path: '/hotels', icon: BuildingOfficeIcon },
                { name: 'Bus', path: '/bus', icon: CubeIcon },
                { name: 'Holidays', path: '/holidays', icon: HeartIcon },
                { name: 'Activities', path: '/activities', icon: TicketIcon },
                { name: 'Insurance', path: '/insurance', icon: DocumentTextIcon },
                { name: 'Visa', path: '/visa', icon: DocumentTextIcon },
                { name: 'Transfers', path: '/transfers', icon: CubeIcon },
            ]
        },
        {
            title: 'Tools',
            items: [
                { name: 'AI Trip Planner', path: '/trip-planner', icon: ChartBarIcon },
                { name: 'Fare Calendar', path: '/fare-calendar', icon: ClipboardDocumentListIcon },
            ]
        },
        {
            title: 'Account',
            items: [
                { name: 'Profile', path: '/agent/profile', icon: UserIcon },
                { name: 'Notifications', path: '/agent/notifications', icon: BellIcon },
            ]
        }
    ];

    const customerMenuItems = [
        {
            title: 'Main',
            items: [
                { name: 'Dashboard', path: '/my/dashboard', icon: HomeIcon },
                { name: 'My Bookings', path: '/my/bookings', icon: TicketIcon },
                { name: 'Saved Travelers', path: '/my/travelers', icon: UsersIcon },
            ]
        },
        {
            title: 'Account',
            items: [
                { name: 'Profile', path: '/my/profile', icon: UserIcon },
                { name: 'Notifications', path: '/my/notifications', icon: BellIcon },
            ]
        }
    ];

    const menuItems = type === 'agent' ? agentMenuItems : customerMenuItems;

    return (
        <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-content">
                {/* User Info */}
                <div className="sidebar-user">
                    <div className="user-avatar">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    {isOpen && (
                        <div className="user-info">
                            <span className="user-name">{user?.firstName} {user?.lastName}</span>
                            <span className="user-type">{user?.companyName || 'Customer'}</span>
                        </div>
                    )}
                </div>

                {/* Wallet Balance (Agent only) */}
                {type === 'agent' && isOpen && (
                    <div className="wallet-balance">
                        <span className="balance-label">Wallet Balance</span>
                        <span className="balance-amount">₹{user?.walletBalance?.toLocaleString() || '0'}</span>
                    </div>
                )}

                {/* Navigation Menu */}
                <nav className="sidebar-nav">
                    {menuItems.map((section, idx) => (
                        <div key={idx} className="nav-section">
                            {isOpen && <h4 className="nav-section-title">{section.title}</h4>}
                            <ul className="nav-list">
                                {section.items.map((item) => (
                                    <li key={item.path}>
                                        <NavLink
                                            to={item.path}
                                            className={({ isActive }) =>
                                                `nav-item ${isActive ? 'active' : ''}`
                                            }
                                            title={item.name}
                                        >
                                            <item.icon className="nav-icon" />
                                            {isOpen && <span className="nav-text">{item.name}</span>}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
