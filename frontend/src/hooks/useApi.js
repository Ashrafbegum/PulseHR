import { useCallback, useState } from "react";
import api from "@/services/api";

export function getApiError(error) {
  return error?.response?.data?.error?.message || error?.response?.data?.message || error?.message || "Request failed. Please try again.";
}

export default function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const request = useCallback(async (method, url, data, config) => {
    setLoading(true); setError("");
    try { const response = await api.request({ method, url, data, ...config }); return response.data; }
    catch (cause) { const message = getApiError(cause); setError(message); throw Object.assign(cause, { message }); }
    finally { setLoading(false); }
  }, []);
  return { loading, error, clearError: () => setError(""), request, get: (url, config) => request("get", url, undefined, config), post: (url, data, config) => request("post", url, data, config), put: (url, data, config) => request("put", url, data, config), patch: (url, data, config) => request("patch", url, data, config), delete: (url, config) => request("delete", url, undefined, config) };
}
