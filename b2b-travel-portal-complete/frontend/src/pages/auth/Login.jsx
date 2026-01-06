import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    EnvelopeIcon,
    LockClosedIcon,
    EyeIcon,
    EyeSlashIcon,
    ArrowRightIcon,
    PhoneIcon,
    BuildingOfficeIcon,
    UserIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const Login = () => {
    const navigate = useNavigate();
    const [loginType, setLoginType] = useState('agent'); // agent, customer
    const [loginMethod, setLoginMethod] = useState('email'); // email, phone
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        password: '',
        rememberMe: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showOtpLogin, setShowOtpLogin] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setError('');
    };

    const handleOtpChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Auto-focus next input
            if (value && index < 5) {
                document.getElementById(`otp-${index + 1}`)?.focus();
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const loginData = {
                email: formData.email,
                password: formData.password
            };

            const response = await api.post('/auth/login', loginData);

            if (response.data.success && response.data.data) {
                const { user, accessToken, refreshToken } = response.data.data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('user', JSON.stringify(user));

                // Force navigation with window.location for immediate effect
                if (user.type === 'agent') {
                    window.location.href = '/agent/dashboard';
                } else {
                    window.location.href = '/my/dashboard';
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpLogin = async () => {
        setLoading(true);
        try {
            const response = await api.post('/auth/verify-otp', {
                [loginMethod]: loginMethod === 'email' ? formData.email : formData.phone,
                otp: otp.join(''),
                userType: loginType
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate(loginType === 'agent' ? '/agent/dashboard' : '/customer/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const sendOtp = async () => {
        setLoading(true);
        try {
            await api.post('/auth/send-otp', {
                [loginMethod]: loginMethod === 'email' ? formData.email : formData.phone,
                userType: loginType
            });
            setShowOtpLogin(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                        <GlobeAltIcon className="w-8 h-8 text-white" />
                        <span className="text-2xl font-bold text-white">TripCode</span>
                    </div>
                    <p className="text-white/80 mt-4">B2B Travel Portal</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                        <p className="text-gray-600 mt-1">Sign in to continue to your account</p>
                    </div>

                    {/* Login Type Tabs */}
                    <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setLoginType('agent')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${
                                loginType === 'agent'
                                    ? 'bg-white text-blue-600 shadow'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <BuildingOfficeIcon className="w-4 h-4" />
                            Agent Login
                        </button>
                        <button
                            onClick={() => setLoginType('customer')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${
                                loginType === 'customer'
                                    ? 'bg-white text-blue-600 shadow'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <UserIcon className="w-4 h-4" />
                            Customer Login
                        </button>
                    </div>

                    {/* Login Method Toggle */}
                    <div className="flex gap-4 mb-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="loginMethod"
                                checked={loginMethod === 'email'}
                                onChange={() => setLoginMethod('email')}
                                className="text-blue-600"
                            />
                            <span className="text-sm text-gray-600">Email</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="loginMethod"
                                checked={loginMethod === 'phone'}
                                onChange={() => setLoginMethod('phone')}
                                className="text-blue-600"
                            />
                            <span className="text-sm text-gray-600">Phone</span>
                        </label>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {!showOtpLogin ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email/Phone Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {loginMethod === 'email' ? 'Email Address' : 'Phone Number'}
                                </label>
                                <div className="relative">
                                    {loginMethod === 'email' ? (
                                        <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    ) : (
                                        <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    )}
                                    <input
                                        type={loginMethod === 'email' ? 'email' : 'tel'}
                                        name={loginMethod}
                                        value={loginMethod === 'email' ? formData.email : formData.phone}
                                        onChange={handleChange}
                                        placeholder={loginMethod === 'email' ? 'Enter your email' : 'Enter your phone number'}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <EyeSlashIcon className="w-5 h-5" />
                                        ) : (
                                            <EyeIcon className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                        className="rounded text-blue-600"
                                    />
                                    <span className="text-sm text-gray-600">Remember me</span>
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-blue-600 hover:text-blue-700"
                                >
                                    Forgot Password?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRightIcon className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        /* OTP Verification */
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600 text-center">
                                Enter the 6-digit OTP sent to your {loginMethod}
                            </p>
                            <div className="flex gap-2 justify-center">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                ))}
                            </div>
                            <button
                                onClick={handleOtpLogin}
                                disabled={loading || otp.some(d => !d)}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-medium disabled:opacity-50"
                            >
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </button>
                            <button
                                onClick={() => setShowOtpLogin(false)}
                                className="w-full text-gray-600 text-sm hover:text-gray-900"
                            >
                                Back to Password Login
                            </button>
                        </div>
                    )}

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-sm text-gray-500">or</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* OTP Login Button */}
                    {!showOtpLogin && (
                        <button
                            onClick={sendOtp}
                            disabled={!(formData.email || formData.phone)}
                            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50"
                        >
                            Login with OTP
                        </button>
                    )}

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Register Now
                            </Link>
                        </p>
                    </div>

                    {/* Admin Login Link */}
                    <div className="mt-4 text-center">
                        <Link
                            to="/admin/login"
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            Admin Login →
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center text-white/60 text-sm">
                    © 2024 TripCode. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default Login;
