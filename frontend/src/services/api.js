import axios from "axios";
import { useAppStore } from "@/store/appStore";
import { API_BASE_URL } from "@/utils/constants";
import { getAccessToken, setAccessToken } from "./tokenStorage";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let refreshPromise;

function getResponsePayload(data) {
  return data?.data ?? data;
}

function notifyNetworkError(error) {
  if (!error.response && !axios.isCancel(error)) {
    useAppStore.getState().addNotification({
      type: "error",
      title: "Connection problem",
      message: "Unable to reach the server. Check your connection and try again.",
    });
  }
}

async function refreshAccessToken() {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    const payload = getResponsePayload(response.data);
    const token = payload?.accessToken ?? payload?.token;

    if (!token) throw new Error("Refresh response did not include an access token");

    setAccessToken(token);
    const { useAuthStore } = await import("@/store/authStore");
    useAuthStore.getState().setToken(token);
    return token;
  } catch (error) {
    notifyNetworkError(error);
    throw error;
  }
}

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const config = error.config;
    const url = config?.url || "";
    const isAuthEndpoint = /\/auth\/(login|signup|refresh|logout|forgot-password|reset-password)(?:$|\?)/.test(url);

    if (status === 401 && config && !config._retry && !config.skipAuthRefresh && !isAuthEndpoint) {
      config._retry = true;
      try {
        refreshPromise ||= refreshAccessToken().finally(() => {
          refreshPromise = undefined;
        });
        const token = await refreshPromise;
        config.headers.Authorization = `Bearer ${token}`;
        return api(config);
      } catch (refreshError) {
        setAccessToken(null);
        const { useAuthStore } = await import("@/store/authStore");
        useAuthStore.getState().clearAuth();
        if (window.location.pathname !== "/login") window.location.assign("/login");
        return Promise.reject(refreshError);
      }
    }

    notifyNetworkError(error);

    const message = error.response?.data?.error?.message
      || error.response?.data?.message
      || (typeof error.response?.data?.error === "string" ? error.response.data.error : null)
      || error.message
      || "Request failed";

    return Promise.reject(Object.assign(error, { status, message }));
  },
);

export default api;
