/**
 * Auth Layout Component
 * Layout wrapper for authentication pages (Login, Register, etc.)
 */

import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex flex-col">
            {/* Header */}
            <header className="py-6 px-8">
                <Link to="/" className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-xl">T</span>
                    </div>
                    <span className="text-white text-2xl font-bold">TravelPortal</span>
                </Link>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-2xl p-8">
                        <Outlet />
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 text-center text-white/70 text-sm">
                <p>&copy; {new Date().getFullYear()} TravelPortal. All rights reserved.</p>
                <div className="mt-2 space-x-4">
                    <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    <Link to="/help" className="hover:text-white transition-colors">Help</Link>
                </div>
            </footer>
        </div>
    );
};

export default AuthLayout;
