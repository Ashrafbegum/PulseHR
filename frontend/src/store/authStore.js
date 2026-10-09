import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as authService from "@/services/authService";
import { getAccessToken, setAccessToken } from "@/services/tokenStorage";

function getErrorMessage(error) {
  return error?.message || "Authentication failed. Please try again.";
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: getAccessToken(),
      role: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      setAuth: ({ token, user }) => {
        setAccessToken(token);
        set({
          token: token || null,
          user: user || null,
          role: user?.role || null,
          isAuthenticated: Boolean(token && user),
          error: null,
        });
      },
      setUser: (user) =>
        set((state) => ({
          user: user || null,
          role: user?.role || null,
          isAuthenticated: Boolean(state.token && user),
        })),
      setToken: (token) => {
        setAccessToken(token);
        set((state) => ({
          token: token || null,
          isAuthenticated: Boolean(token && state.user),
        }));
      },
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const auth = await authService.login(email, password);
          get().setAuth(auth);
          return auth;
        } catch (error) {
          set({ error: getErrorMessage(error) });
          throw error;
        } finally {
          set({ loading: false });
        }
      },
      logout: async () => {
        set({ loading: true, error: null });
        let logoutError;
        try {
          await authService.logout();
        } catch (error) {
          logoutError = error;
        } finally {
          setAccessToken(null);
          set({
            user: null,
            token: null,
            role: null,
            isAuthenticated: false,
            loading: false,
            error: logoutError ? getErrorMessage(logoutError) : null,
          });
        }
        if (logoutError) throw logoutError;
      },
      refresh: async () => {
        set({ loading: true, error: null });
        try {
          const auth = await authService.refresh();
          get().setToken(auth.token);
          if (auth.user) get().setUser(auth.user);
          return auth;
        } catch (error) {
          setAccessToken(null);
          set({
            user: null,
            token: null,
            role: null,
            isAuthenticated: false,
            error: getErrorMessage(error),
          });
          if (window.location.pathname !== "/login") window.location.assign("/login");
          throw error;
        } finally {
          set({ loading: false });
        }
      },
      clearAuth: () => {
        setAccessToken(null);
        set({
          token: null,
          user: null,
          role: null,
          isAuthenticated: false,
          error: null,
        });
      },
    }),
    {
      name: "pulsehr-auth",
      partialize: ({ user, role }) => ({ user, role }),
      merge: (persistedState, currentState) => {
        const token = getAccessToken();
        const user = persistedState?.user || null;
        return {
          ...currentState,
          user,
          role: user?.role || persistedState?.role || null,
          token,
          isAuthenticated: Boolean(token && user),
        };
      },
    },
  ),
);
