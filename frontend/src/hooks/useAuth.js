import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

function getTokenExpiry(token) {
  try { const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))); return Number(payload.exp) * 1000 || null; }
  catch { return null; }
}

export default function useAuth() {
  const token = useAuthStore((state) => state.token);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  useEffect(() => {
    if (!token) return undefined;
    const expiry = getTokenExpiry(token);
    if (!expiry) {
      clearAuth();
      return undefined;
    }
    const timeout = window.setTimeout(clearAuth, Math.max(0, expiry - Date.now()));
    return () => window.clearTimeout(timeout);
  }, [token, clearAuth]);
  return useAuthStore();
}
