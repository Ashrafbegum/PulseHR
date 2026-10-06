import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      role: null,
      isAuthenticated: false,
      setAuth: ({ token, user }) =>
        set({
          token: token || null,
          user: user || null,
          role: user?.role || null,
          isAuthenticated: Boolean(token && user),
        }),
      setUser: (user) => set({ user, role: user?.role || null, isAuthenticated: Boolean(user) }),
      clearAuth: () => set({ token: null, user: null, role: null, isAuthenticated: false }),
    }),
    {
      name: "pulsehr-auth",
      partialize: ({ token, user, role, isAuthenticated }) => ({ token, user, role, isAuthenticated }),
    },
  ),
);
