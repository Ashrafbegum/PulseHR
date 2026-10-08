export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/signup",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    me: "/auth/me",
    logout: "/auth/logout",
  },
  employees: "/employees",
  leave: "/leave",
  notifications: "/notifications",
};

export const USER_ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  EMPLOYEE: "employee",
};

export const LEAVE_TYPES = {
  ANNUAL: "annual",
  SICK: "sick",
  PERSONAL: "personal",
  UNPAID: "unpaid",
};

export const LEAVE_STATUSES = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};
