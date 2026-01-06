/**
 * Auth Context
 * Authentication state management
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const adminToken = localStorage.getItem('adminAccessToken');

            if (token) {
                const response = await api.get('/auth/me');
                setUser(response.data.data);
            }

            if (adminToken) {
                const response = await api.get('/admin/auth/me', {
                    headers: { Authorization: `Bearer ${adminToken}` }
                });
                setAdmin(response.data.data);
            }
        } catch (error) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('adminAccessToken');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { user: userData, accessToken, refreshToken } = response.data.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setUser(userData);

        return userData;
    };

    const register = async (data) => {
        const response = await api.post('/auth/register', data);
        return response.data;
    };

    const adminLogin = async (email, password) => {
        const response = await api.post('/admin/auth/login', { email, password });
        const { user: adminData, accessToken, refreshToken } = response.data.data;

        localStorage.setItem('adminAccessToken', accessToken);
        localStorage.setItem('adminRefreshToken', refreshToken);
        setAdmin(adminData);

        return adminData;
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
    };

    const adminLogout = () => {
        localStorage.removeItem('adminAccessToken');
        localStorage.removeItem('adminRefreshToken');
        setAdmin(null);
    };

    const updateProfile = async (data) => {
        const response = await api.put('/auth/profile', data);
        setUser(prev => ({ ...prev, ...response.data.data }));
        return response.data;
    };

    const value = {
        user,
        admin,
        loading,
        isAuthenticated: !!user,
        isAdminAuthenticated: !!admin,
        login,
        register,
        adminLogin,
        logout,
        adminLogout,
        updateProfile,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
