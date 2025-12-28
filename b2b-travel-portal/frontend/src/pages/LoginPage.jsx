import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { Plane, Lock, Mail, ArrowRight, Building2 } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { adminLogin, agentLogin, isLoading, error, clearError } = useAuthStore();

  const [loginType, setLoginType] = useState('admin'); // 'admin' or 'agent'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    clearError();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    let result;
    if (loginType === 'admin') {
      result = await adminLogin(email, password);
    } else {
      result = await agentLogin(email, password);
    }

    if (result.success) {
      toast.success('Login successful!');
      navigate(loginType === 'admin' ? '/admin' : '/dashboard');
    } else {
      toast.error(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-500 to-primary-700 p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Plane className="h-10 w-10 text-white" />
            <span className="text-3xl font-bold text-white">Flyshop</span>
          </div>
          <p className="text-primary-100 mt-2">B2B Travel Portal</p>
        </div>

        <div className="text-white">
          <h1 className="text-4xl font-bold leading-tight">
            Book Flights.<br />
            Grow Business.<br />
            Earn More.
          </h1>
          <p className="mt-6 text-primary-100 text-lg">
            Access the best fares, instant ticketing, and real-time booking management.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-primary-200 text-sm">Active Agents</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">50K+</div>
              <div className="text-primary-200 text-sm">Bookings/Month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">99.9%</div>
              <div className="text-primary-200 text-sm">Uptime</div>
            </div>
          </div>
        </div>

        <div className="text-primary-200 text-sm">
          &copy; 2024 Flyshop. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <Plane className="h-8 w-8 text-primary-500" />
            <span className="text-2xl font-bold text-gray-800">Flyshop</span>
          </div>

          {/* Login Type Toggle */}
          <div className="flex bg-white rounded-lg p-1 shadow-sm mb-8">
            <button
              onClick={() => setLoginType('admin')}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                loginType === 'admin'
                  ? 'bg-primary-500 text-white shadow'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Building2 className="inline-block h-4 w-4 mr-2" />
              Admin Login
            </button>
            <button
              onClick={() => setLoginType('agent')}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                loginType === 'agent'
                  ? 'bg-primary-500 text-white shadow'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Plane className="inline-block h-4 w-4 mr-2" />
              Agent Login
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {loginType === 'admin' ? 'Admin Portal' : 'Agent Portal'}
            </h2>
            <p className="text-gray-500 mb-8">
              Enter your credentials to continue
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            {loginType === 'agent' && (
              <p className="mt-6 text-center text-gray-500 text-sm">
                Don't have an account?{' '}
                <a href="/register" className="text-primary-500 hover:text-primary-600 font-medium">
                  Register here
                </a>
              </p>
            )}

            {loginType === 'admin' && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 text-center">
                  Demo credentials:<br />
                  <span className="font-mono">admin@flyshop.com / admin123</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
