import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Admin Login
      adminLogin: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.adminLogin(email, password);
          const { token, admin } = response.data.data;

          localStorage.setItem('token', token);

          set({
            user: admin,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true };
        } catch (error) {
          const message = error.response?.data?.error || 'Login failed';
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      // Agent Login
      agentLogin: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.agentLogin(email, password);
          const { token, agent } = response.data.data;

          localStorage.setItem('token', token);

          set({
            user: { ...agent, role: 'AGENT' },
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true };
        } catch (error) {
          const message = error.response?.data?.error || 'Login failed';
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      // Logout
      logout: () => {
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
