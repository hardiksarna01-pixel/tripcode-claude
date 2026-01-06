import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    EnvelopeIcon,
    PhoneIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    LockClosedIcon,
    EyeIcon,
    EyeSlashIcon,
    GlobeAltIcon,
    CheckCircleIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: enter email/phone, 2: enter OTP, 3: new password, 4: success
    const [method, setMethod] = useState('email'); // email, phone
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        otp: ['', '', '', '', '', ''],
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleOtpChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtp = [...formData.otp];
            newOtp[index] = value;
            setFormData(prev => ({ ...prev, otp: newOtp }));

            // Auto-focus next input
            if (value && index < 5) {
                document.getElementById(`otp-${index + 1}`)?.focus();
            }
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    const startResendTimer = () => {
        setResendTimer(60);
        const interval = setInterval(() => {
            setResendTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const sendResetLink = async () => {
        setLoading(true);
        setError('');

        try {
            const payload = method === 'email'
                ? { email: formData.email }
                : { phone: formData.phone };

            await api.post('/auth/forgot-password', payload);
            setStep(2);
            startResendTimer();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        setLoading(true);
        setError('');

        const otp = formData.otp.join('');
        if (otp.length !== 6) {
            setError('Please enter the complete OTP');
            setLoading(false);
            return;
        }

        try {
            const payload = {
                [method]: method === 'email' ? formData.email : formData.phone,
                otp
            };

            await api.post('/auth/verify-reset-otp', payload);
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async () => {
        setLoading(true);
        setError('');

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.newPassword.length < 8) {
            setError('Password must be at least 8 characters');
            setLoading(false);
            return;
        }

        try {
            const payload = {
                [method]: method === 'email' ? formData.email : formData.phone,
                otp: formData.otp.join(''),
                newPassword: formData.newPassword
            };

            await api.post('/auth/reset-password', payload);
            setStep(4);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async () => {
        if (resendTimer > 0) return;
        await sendResetLink();
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
                    <Link to="/" className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                        <GlobeAltIcon className="w-8 h-8 text-white" />
                        <span className="text-2xl font-bold text-white">TripCode</span>
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    {step < 4 && (
                        <>
                            {/* Progress Indicator */}
                            <div className="flex items-center justify-center gap-2 mb-6">
                                {[1, 2, 3].map(s => (
                                    <div
                                        key={s}
                                        className={`w-3 h-3 rounded-full transition ${
                                            s <= step ? 'bg-blue-600' : 'bg-gray-200'
                                        }`}
                                    />
                                ))}
                            </div>

                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    {step === 1 && <EnvelopeIcon className="w-8 h-8 text-blue-600" />}
                                    {step === 2 && <ShieldCheckIcon className="w-8 h-8 text-blue-600" />}
                                    {step === 3 && <LockClosedIcon className="w-8 h-8 text-blue-600" />}
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {step === 1 && 'Forgot Password?'}
                                    {step === 2 && 'Verify OTP'}
                                    {step === 3 && 'Reset Password'}
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    {step === 1 && "No worries, we'll send you reset instructions."}
                                    {step === 2 && `Enter the 6-digit code sent to your ${method}`}
                                    {step === 3 && 'Enter your new password below'}
                                </p>
                            </div>
                        </>
                    )}

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Step 1: Enter Email/Phone */}
                    {step === 1 && (
                        <div className="space-y-4">
                            {/* Method Toggle */}
                            <div className="flex gap-4 mb-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={method === 'email'}
                                        onChange={() => setMethod('email')}
                                        className="text-blue-600"
                                    />
                                    <span className="text-sm text-gray-600">Email</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={method === 'phone'}
                                        onChange={() => setMethod('phone')}
                                        className="text-blue-600"
                                    />
                                    <span className="text-sm text-gray-600">Phone</span>
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {method === 'email' ? 'Email Address' : 'Phone Number'}
                                </label>
                                <div className="relative">
                                    {method === 'email' ? (
                                        <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    ) : (
                                        <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    )}
                                    <input
                                        type={method === 'email' ? 'email' : 'tel'}
                                        name={method}
                                        value={method === 'email' ? formData.email : formData.phone}
                                        onChange={handleChange}
                                        placeholder={method === 'email' ? 'Enter your email' : 'Enter your phone number'}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                onClick={sendResetLink}
                                disabled={loading || !(formData.email || formData.phone)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Send Reset Code
                                        <ArrowRightIcon className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Step 2: Enter OTP */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="flex gap-2 justify-center">
                                {formData.otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        className="w-12 h-14 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                ))}
                            </div>

                            <button
                                onClick={verifyOtp}
                                disabled={loading || formData.otp.some(d => !d)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Verify Code
                                        <ArrowRightIcon className="w-5 h-5" />
                                    </>
                                )}
                            </button>

                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Didn't receive the code?{' '}
                                    {resendTimer > 0 ? (
                                        <span className="text-gray-400">Resend in {resendTimer}s</span>
                                    ) : (
                                        <button
                                            onClick={resendOtp}
                                            className="text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            Resend Code
                                        </button>
                                    )}
                                </p>
                            </div>

                            <button
                                onClick={() => setStep(1)}
                                className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 text-sm"
                            >
                                <ArrowLeftIcon className="w-4 h-4" />
                                Change {method}
                            </button>
                        </div>
                    )}

                    {/* Step 3: New Password */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <div className="relative">
                                    <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        placeholder="Enter new password"
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                <div className="relative">
                                    <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm new password"
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Password Requirements */}
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs font-medium text-gray-700 mb-2">Password Requirements:</p>
                                <ul className="text-xs text-gray-600 space-y-1">
                                    <li className={formData.newPassword.length >= 8 ? 'text-green-600' : ''}>
                                        • At least 8 characters
                                    </li>
                                    <li className={/[A-Z]/.test(formData.newPassword) ? 'text-green-600' : ''}>
                                        • One uppercase letter
                                    </li>
                                    <li className={/[a-z]/.test(formData.newPassword) ? 'text-green-600' : ''}>
                                        • One lowercase letter
                                    </li>
                                    <li className={/[0-9]/.test(formData.newPassword) ? 'text-green-600' : ''}>
                                        • One number
                                    </li>
                                </ul>
                            </div>

                            <button
                                onClick={resetPassword}
                                disabled={loading || !formData.newPassword || !formData.confirmPassword}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Reset Password
                                        <CheckCircleIcon className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Step 4: Success */}
                    {step === 4 && (
                        <div className="text-center py-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircleIcon className="w-10 h-10 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset!</h2>
                            <p className="text-gray-600 mb-6">
                                Your password has been successfully reset. You can now login with your new password.
                            </p>
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
                            >
                                Go to Login
                                <ArrowRightIcon className="w-5 h-5" />
                            </Link>
                        </div>
                    )}

                    {/* Back to Login Link */}
                    {step < 4 && (
                        <div className="mt-6 text-center">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"
                            >
                                <ArrowLeftIcon className="w-4 h-4" />
                                Back to Login
                            </Link>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-6 text-center text-white/60 text-sm">
                    © 2024 TripCode. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
