import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

/**
 * Login Page Component
 */
const LoginPage = () => {
    const navigate = useNavigate();
    const { login, isLoading, error, isAuthenticated, user, clearError } = useAuthStore();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (isAuthenticated && user) {
            // Redirect based on user role
            if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' || user.permissions?.length > 0) {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        return () => clearError();
    }, [clearError]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(formData.email, formData.password);
        if (result.success) {
            // Navigation will be handled by the useEffect above
        }
    };

    const fillDemoCredentials = (type) => {
        if (type === 'admin') {
            setFormData({ email: 'admin@flyshop.com', password: 'admin123' });
        } else {
            setFormData({ email: 'agent@flyshop.com', password: 'agent123' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">TripCode</h1>
                    <p className="text-blue-200">B2B Travel Portal</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Sign In
                    </h2>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span className="text-sm text-gray-600">Remember me</span>
                            </label>
                            <a href="#forgot" className="text-sm text-blue-600 hover:underline">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 text-center mb-3 font-medium">Demo Credentials (click to fill)</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => fillDemoCredentials('admin')}
                                className="p-2 bg-purple-100 text-purple-700 rounded-lg text-xs hover:bg-purple-200 transition"
                            >
                                <span className="font-semibold block">Admin</span>
                                <span className="text-purple-500">admin@flyshop.com</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => fillDemoCredentials('agent')}
                                className="p-2 bg-blue-100 text-blue-700 rounded-lg text-xs hover:bg-blue-200 transition"
                            >
                                <span className="font-semibold block">Agent</span>
                                <span className="text-blue-500">agent@flyshop.com</span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-blue-600 font-medium hover:underline">
                                Register as Agent
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-blue-200 text-sm">
                    <p>&copy; 2024 TripCode. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
