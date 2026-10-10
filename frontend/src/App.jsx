import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import useAuth from "@/hooks/useAuth";
import ToastViewport from "@/components/ToastViewport";
import { TooltipProvider } from "@/components/ui/tooltip";

const StyleGuide = import.meta.env.DEV ? lazy(() => import("@/pages/StyleGuide")) : null;

function AuthExpiry() { useAuth(); return null; }

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthExpiry />
        <ToastViewport />
        <TooltipProvider>
        <Routes>
          {/* Public auth routes: keep signed-in users out */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path="/reset-password/:token" element={<PublicRoute><ResetPassword /></PublicRoute>} />
          <Route path="/reset-password" element={<Navigate to="/forgot-password" replace />} />

          {/* Protected app routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Navigate to="/" replace />} />
            </Route>
            {StyleGuide && (
              <Route
                path="/dev/style-guide"
                element={(
                  <Suspense fallback={null}>
                    <StyleGuide />
                  </Suspense>
                )}
              />
            )}
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
