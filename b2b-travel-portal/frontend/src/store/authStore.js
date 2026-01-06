import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,

      login: (userData, token) => {
        const isAdmin = userData.type === 'admin' || userData.role === 'SUPER_ADMIN' || userData.role === 'ADMIN';
        set({
          user: userData,
          token,
          isAuthenticated: true,
          isAdmin,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      },

      getToken: () => get().token,
      getUser: () => get().user,
      checkIsAdmin: () => get().isAdmin,
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
