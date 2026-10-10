import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function PublicRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (isAuthenticated) {
    const from = location.state?.from?.pathname;
    return <Navigate to={from || "/"} replace />;
  }

  return children;
}
