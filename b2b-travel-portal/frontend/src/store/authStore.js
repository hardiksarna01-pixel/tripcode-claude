import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../services/api';

/**
 * Authentication Store
 * Manages user authentication state
 */
const useAuthStore = create(
    persist(
        (set, get) => ({
            // State
            agent: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // Actions
            login: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authApi.login(email, password);
                    const { token, agent } = response.data;

                    localStorage.setItem('authToken', token);

                    set({
                        agent,
                        token,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null
                    });

                    return { success: true };
                } catch (error) {
                    set({
                        isLoading: false,
                        error: error.error || 'Login failed'
                    });
                    return { success: false, error: error.error };
                }
            },

            register: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authApi.register(data);
                    const { token, agent } = response.data;

                    localStorage.setItem('authToken', token);

                    set({
                        agent,
                        token,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null
                    });

                    return { success: true };
                } catch (error) {
                    set({
                        isLoading: false,
                        error: error.error || 'Registration failed'
                    });
                    return { success: false, error: error.error };
                }
            },

            logout: () => {
                authApi.logout();
                set({
                    agent: null,
                    token: null,
                    isAuthenticated: false,
                    error: null
                });
            },

            checkAuth: async () => {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    set({ isAuthenticated: false });
                    return false;
                }

                try {
                    const response = await authApi.getMe();
                    set({
                        agent: response.data,
                        token,
                        isAuthenticated: true
                    });
                    return true;
                } catch (error) {
                    localStorage.removeItem('authToken');
                    set({
                        agent: null,
                        token: null,
                        isAuthenticated: false
                    });
                    return false;
                }
            },

            updateAgent: (updates) => {
                set((state) => ({
                    agent: { ...state.agent, ...updates }
                }));
            },

            clearError: () => {
                set({ error: null });
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                agent: state.agent,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
);

export default useAuthStore;
