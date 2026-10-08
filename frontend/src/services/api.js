import axios from "axios";
import { API_BASE_URL } from "@/utils/constants";
import { useAuthStore } from "@/store/authStore";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.error?.message || error.response?.data?.message || (typeof error.response?.data?.error === "string" ? error.response.data.error : null) || error.message || "Request failed";

    if (status === 401) useAuthStore.getState().clearAuth();

    return Promise.reject(Object.assign(error, { status, message }));
  },
);

export default api;
