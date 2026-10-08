import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

function getTokenExpiry(token) {
  try { const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))); return Number(payload.exp) * 1000 || null; }
  catch { return null; }
}

export default function useAuth() {
  const auth = useAuthStore();
  useEffect(() => {
    if (!auth.token) return undefined;
    const expiry = getTokenExpiry(auth.token);
    if (!expiry) return undefined;
    const timeout = window.setTimeout(auth.clearAuth, Math.max(0, expiry - Date.now()));
    return () => window.clearTimeout(timeout);
  }, [auth.token, auth.clearAuth]);
  return auth;
}
