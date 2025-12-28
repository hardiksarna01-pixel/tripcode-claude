import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../services/api';

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
          const response = await authApi.login(email, password);
          const data = response.data || response;
          const { token, user } = data;

          localStorage.setItem('authToken', token);

          set({
            user: user || data.admin,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true };
        } catch (error) {
          const message = error?.error || error?.message || 'Login failed';
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      // Agent Login
      agentLogin: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(email, password);
          const { token, agent } = response.data || response;

          localStorage.setItem('authToken', token);

          set({
            user: { ...agent, role: 'AGENT' },
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true };
        } catch (error) {
          const message = error?.error || error?.message || 'Login failed';
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      // Logout
      logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('agent');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Check if user is authenticated (for route protection)
      checkAuth: async () => {
        const state = get();
        if (state.token && state.isAuthenticated) {
          return true;
        }
        // Check localStorage for persisted auth
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
          try {
            const response = await authApi.getMe();
            if (response?.data || response?.user) {
              set({
                user: response.data || response.user,
                token: storedToken,
                isAuthenticated: true,
              });
              return true;
            }
          } catch {
            // Token invalid, clear it
            localStorage.removeItem('authToken');
            set({ user: null, token: null, isAuthenticated: false });
          }
        }
        return false;
      },

      // Generic login (auto-detect admin or agent)
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(email, password);
          const data = response.data || response;
          const { token, user, userType } = data;

          localStorage.setItem('authToken', token);

          set({
            user: user || data.admin || data.agent,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true, userType };
        } catch (error) {
          const message = error?.error || error?.message || 'Login failed';
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },
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
