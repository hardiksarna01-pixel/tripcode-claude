/**
 * Main Layout Component
 * Public and Agent portal layout with optional sidebar
 */

import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import './MainLayout.css';

const MainLayout = ({ showSidebar = false, sidebarType = null }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className={`main-layout ${showSidebar ? 'with-sidebar' : ''}`}>
            <Header
                showSidebar={showSidebar}
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
            />

            <div className="main-content-wrapper">
                {showSidebar && (
                    <Sidebar
                        isOpen={sidebarOpen}
                        type={sidebarType}
                        user={user}
                    />
                )}

                <main className={`main-content ${showSidebar && sidebarOpen ? 'sidebar-open' : ''}`}>
                    <Outlet />
                </main>
            </div>

            {!showSidebar && <Footer />}
        </div>
    );
};

export default MainLayout;
