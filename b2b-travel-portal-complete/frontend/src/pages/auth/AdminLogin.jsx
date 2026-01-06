import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    EnvelopeIcon,
    LockClosedIcon,
    EyeIcon,
    EyeSlashIcon,
    ArrowRightIcon,
    ShieldCheckIcon,
    GlobeAltIcon,
    KeyIcon,
    DevicePhoneMobileIcon,
    ComputerDesktopIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: credentials, 2: 2FA
    const [adminType, setAdminType] = useState('admin'); // admin, superadmin
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberDevice: false
    });
    const [twoFactorCode, setTwoFactorCode] = useState(['', '', '', '', '', '']);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [twoFactorMethod, setTwoFactorMethod] = useState('authenticator'); // authenticator, email, sms

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setError('');
    };

    const handleTwoFactorChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newCode = [...twoFactorCode];
            newCode[index] = value;
            setTwoFactorCode(newCode);

            // Auto-focus next input
            if (value && index < 5) {
                document.getElementById(`2fa-${index + 1}`)?.focus();
            }
        }
    };

    const handleTwoFactorKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !twoFactorCode[index] && index > 0) {
            document.getElementById(`2fa-${index - 1}`)?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/admin/auth/login', {
                email: formData.email,
                password: formData.password
            });

            if (response.data.requires2FA) {
                setStep(2);
                setTwoFactorMethod(response.data.twoFactorMethod || 'authenticator');
            } else if (response.data.success && response.data.data) {
                const { user, accessToken, refreshToken } = response.data.data;
                localStorage.setItem('adminToken', accessToken);
                localStorage.setItem('adminRefreshToken', refreshToken);
                localStorage.setItem('admin', JSON.stringify(user));

                if (user.role === 'super_admin') {
                    navigate('/superadmin/dashboard');
                } else {
                    navigate('/admin/dashboard');
                }
            }
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const verifyTwoFactor = async () => {
        setLoading(true);
        setError('');

        const code = twoFactorCode.join('');
        if (code.length !== 6) {
            setError('Please enter the complete 6-digit code');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/auth/admin/verify-2fa', {
                email: formData.email,
                code,
                rememberDevice: formData.rememberDevice,
                adminType
            });

            if (response.data.token) {
                localStorage.setItem('adminToken', response.data.token);
                localStorage.setItem('admin', JSON.stringify(response.data.admin));

                if (adminType === 'superadmin') {
                    navigate('/superadmin/dashboard');
                } else {
                    navigate('/admin/dashboard');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid verification code');
        } finally {
            setLoading(false);
        }
    };

    const resend2FACode = async () => {
        try {
            await api.post('/auth/admin/resend-2fa', {
                email: formData.email,
                method: twoFactorMethod,
                adminType
            });
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend code');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
                        <GlobeAltIcon className="w-8 h-8 text-blue-400" />
                        <span className="text-2xl font-bold text-white">TripCode</span>
                    </div>
                    <p className="text-gray-400 mt-4">Administration Portal</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/10">
                    {step === 1 && (
                        <>
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ShieldCheckIcon className="w-8 h-8 text-blue-400" />
                                </div>
                                <h1 className="text-2xl font-bold text-white">Admin Login</h1>
                                <p className="text-gray-400 mt-1">Secure access to administration panel</p>
                            </div>

                            {/* Admin Type Tabs */}
                            <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-lg">
                                <button
                                    onClick={() => setAdminType('admin')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${
                                        adminType === 'admin'
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <ComputerDesktopIcon className="w-4 h-4" />
                                    Admin
                                </button>
                                <button
                                    onClick={() => setAdminType('superadmin')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${
                                        adminType === 'superadmin'
                                            ? 'bg-purple-600 text-white'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <KeyIcon className="w-4 h-4" />
                                    Super Admin
                                </button>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm flex items-center gap-2">
                                    <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="admin@tripcode.com"
                                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Enter your password"
                                            className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                        >
                                            {showPassword ? (
                                                <EyeSlashIcon className="w-5 h-5" />
                                            ) : (
                                                <EyeIcon className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="rememberDevice"
                                            checked={formData.rememberDevice}
                                            onChange={handleChange}
                                            className="rounded bg-white/5 border-white/20 text-blue-600"
                                        />
                                        <span className="text-sm text-gray-400">Remember this device</span>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition disabled:opacity-50 ${
                                        adminType === 'superadmin'
                                            ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white'
                                            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                                    }`}
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Sign In Securely
                                            <ArrowRightIcon className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    )}

                    {/* Step 2: Two-Factor Authentication */}
                    {step === 2 && (
                        <>
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <DevicePhoneMobileIcon className="w-8 h-8 text-green-400" />
                                </div>
                                <h1 className="text-2xl font-bold text-white">Two-Factor Authentication</h1>
                                <p className="text-gray-400 mt-2">
                                    {twoFactorMethod === 'authenticator' && 'Enter the code from your authenticator app'}
                                    {twoFactorMethod === 'email' && 'Enter the code sent to your email'}
                                    {twoFactorMethod === 'sms' && 'Enter the code sent to your phone'}
                                </p>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm flex items-center gap-2">
                                    <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            <div className="space-y-6">
                                {/* 2FA Method Selector */}
                                <div className="flex gap-2 bg-white/5 p-1 rounded-lg">
                                    {['authenticator', 'email', 'sms'].map(method => (
                                        <button
                                            key={method}
                                            onClick={() => setTwoFactorMethod(method)}
                                            className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition ${
                                                twoFactorMethod === method
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            {method}
                                        </button>
                                    ))}
                                </div>

                                {/* 6-Digit Code Input */}
                                <div className="flex gap-2 justify-center">
                                    {twoFactorCode.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`2fa-${index}`}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleTwoFactorChange(index, e.target.value)}
                                            onKeyDown={(e) => handleTwoFactorKeyDown(index, e)}
                                            className="w-12 h-14 text-center text-xl font-bold bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={verifyTwoFactor}
                                    disabled={loading || twoFactorCode.some(d => !d)}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Verify & Continue
                                            <ArrowRightIcon className="w-5 h-5" />
                                        </>
                                    )}
                                </button>

                                {twoFactorMethod !== 'authenticator' && (
                                    <button
                                        onClick={resend2FACode}
                                        className="w-full text-gray-400 hover:text-white text-sm"
                                    >
                                        Didn't receive the code? Resend
                                    </button>
                                )}

                                <button
                                    onClick={() => {
                                        setStep(1);
                                        setTwoFactorCode(['', '', '', '', '', '']);
                                    }}
                                    className="w-full text-gray-500 hover:text-gray-300 text-sm"
                                >
                                    ← Back to Login
                                </button>
                            </div>
                        </>
                    )}

                    {/* Security Notice */}
                    <div className="mt-6 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <div className="flex items-start gap-2">
                            <ShieldCheckIcon className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-yellow-200/80">
                                <p className="font-medium">Security Notice</p>
                                <p className="mt-1">This is a secure admin portal. All login attempts are logged and monitored. Unauthorized access is prohibited.</p>
                            </div>
                        </div>
                    </div>

                    {/* Regular User Login Link */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="text-gray-400 hover:text-white text-sm"
                        >
                            Not an admin? User Login →
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center text-gray-500 text-sm">
                    © 2024 TripCode. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
