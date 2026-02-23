/**
 * Header Component
 * Main navigation header
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    Bars3Icon,
    XMarkIcon,
    UserIcon,
    ArrowRightOnRectangleIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';
import './Header.css';

const Header = ({ showSidebar, sidebarOpen, toggleSidebar }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const navLinks = [
        { name: 'Flights', path: '/flights' },
        { name: 'Hotels', path: '/hotels' },
        { name: 'Bus', path: '/bus' },
        { name: 'Holidays', path: '/holidays' },
        { name: 'Activities', path: '/activities' },
        { name: 'Insurance', path: '/insurance' },
        { name: 'Visa', path: '/visa' },
        { name: 'Transfers', path: '/transfers' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="main-header">
            <div className="header-container">
                {/* Sidebar Toggle (when sidebar is shown) */}
                {showSidebar && (
                    <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
                        <Bars3Icon />
                    </button>
                )}

                {/* Logo */}
                <Link to="/" className="logo">
                    <span className="logo-icon">✈</span>
                    <span className="logo-text">TravelPortal</span>
                </Link>

                {/* Desktop Navigation */}
                {!showSidebar && (
                    <nav className="desktop-nav">
                        {navLinks.map((link) => (
                            <Link key={link.path} to={link.path} className="nav-link">
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                )}

                {/* Right Section */}
                <div className="header-right">
                    {isAuthenticated ? (
                        <div className="user-menu-wrapper">
                            <button
                                className="user-menu-btn"
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                            >
                                <div className="user-avatar">
                                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                                </div>
                                <span className="user-name">{user?.firstName}</span>
                                <ChevronDownIcon className="chevron" />
                            </button>

                            {userMenuOpen && (
                                <div className="user-dropdown">
                                    <div className="dropdown-header">
                                        <span className="user-full-name">
                                            {user?.firstName} {user?.lastName}
                                        </span>
                                        <span className="user-email">{user?.email}</span>
                                    </div>
                                    <div className="dropdown-divider" />
                                    <Link
                                        to={user?.type === 'agent' ? '/agent/dashboard' : '/my/dashboard'}
                                        className="dropdown-item"
                                        onClick={() => setUserMenuOpen(false)}
                                    >
                                        <UserIcon />
                                        <span>Dashboard</span>
                                    </Link>
                                    <Link
                                        to={user?.type === 'agent' ? '/agent/profile' : '/my/profile'}
                                        className="dropdown-item"
                                        onClick={() => setUserMenuOpen(false)}
                                    >
                                        <UserIcon />
                                        <span>Profile</span>
                                    </Link>
                                    <div className="dropdown-divider" />
                                    <button className="dropdown-item logout" onClick={handleLogout}>
                                        <ArrowRightOnRectangleIcon />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn btn-outline">Login</Link>
                            <Link to="/register" className="btn btn-primary">Register</Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    {!showSidebar && (
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <XMarkIcon /> : <Bars3Icon />}
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && !showSidebar && (
                <nav className="mobile-nav">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className="mobile-nav-link"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>
            )}
        </header>
    );
};

export default Header;
