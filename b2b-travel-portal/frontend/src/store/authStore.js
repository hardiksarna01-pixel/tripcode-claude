import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * AUTH STORE - Handles authentication and role management
 *
 * Roles:
 * - AGENT: Regular travel agent (uses /agent/* routes)
 * - ADMIN: Company administrator (uses /admin/* routes)
 * - SUPER_ADMIN: Platform super administrator (uses /superadmin/* routes)
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      userRole: null, // 'AGENT' | 'ADMIN' | 'SUPER_ADMIN'

      /**
       * Login handler - determines role from user data
       */
      login: (userData, token) => {
        // Determine user role
        let userRole = 'AGENT'; // Default to agent

        if (userData.role === 'SUPER_ADMIN' || userData.type === 'superadmin') {
          userRole = 'SUPER_ADMIN';
        } else if (userData.role === 'ADMIN' || userData.type === 'admin') {
          userRole = 'ADMIN';
        }

        set({
          user: userData,
          token,
          isAuthenticated: true,
          userRole,
        });
      },

      /**
       * Logout handler - clears all auth state
       */
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          userRole: null,
        });
      },

      // Getters
      getToken: () => get().token,
      getUser: () => get().user,
      getUserRole: () => get().userRole,

      // Role checks
      isAgent: () => get().userRole === 'AGENT',
      isAdmin: () => get().userRole === 'ADMIN',
      isSuperAdmin: () => get().userRole === 'SUPER_ADMIN',
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
