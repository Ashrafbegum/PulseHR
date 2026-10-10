import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProtectedRoute({ children, roles }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.role);
  const loading = useAuthStore((state) => state.loading);
  const location = useLocation();

  if (loading && !isAuthenticated) {
    return (
      <div
        className="grid min-h-screen place-items-center bg-background px-6"
        role="status"
        aria-busy="true"
        aria-label="Verifying session"
      >
        <div className="w-full max-w-sm space-y-3">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  if (roles?.length && !roles.includes(role)) return <Navigate to="/unauthorized" replace />;
  return children || <Outlet />;
}
