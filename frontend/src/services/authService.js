import api from "./api";

function getPayload(response) {
  return response.data?.data ?? response.data;
}

function getAccessToken(payload) {
  return payload?.accessToken ?? payload?.token ?? null;
}

export async function signup(email, password, name, additionalFields = {}) {
  const response = await api.post("/auth/signup", {
    email,
    password,
    name,
    ...additionalFields,
  });
  const payload = getPayload(response);
  return { ...payload, token: getAccessToken(payload), user: payload?.user ?? null };
}

export async function login(email, password) {
  const response = await api.post("/auth/login", { email, password });
  const payload = getPayload(response);
  const token = getAccessToken(payload);
  if (!token) throw new Error("Login response did not include an access token");
  return { ...payload, token, user: payload?.user ?? null };
}

export async function refresh() {
  const response = await api.post("/auth/refresh", {}, { skipAuthRefresh: true });
  const payload = getPayload(response);
  const token = getAccessToken(payload);
  if (!token) throw new Error("Refresh response did not include an access token");
  return { ...payload, token };
}

export async function logout() {
  const response = await api.post("/auth/logout", {}, { skipAuthRefresh: true });
  return getPayload(response);
}

export async function forgotPassword(email) {
  const response = await api.post("/auth/forgot-password", { email });
  return getPayload(response);
}

export async function resetPassword(token, newPassword) {
  const response = await api.post("/auth/reset-password", { token, password: newPassword });
  return getPayload(response);
}

export async function getCurrentUser() {
  const response = await api.get("/auth/me");
  const payload = getPayload(response);
  return payload?.user ?? payload;
}
