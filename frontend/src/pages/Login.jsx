import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import useApi from "@/hooks/useApi";
import { useAuthStore } from "@/store/authStore";

export default function Login() {
  const api = useApi(); const navigate = useNavigate(); const location = useLocation(); const setAuth = useAuthStore((state) => state.setAuth);
  return <AuthForm title="Welcome back" description="Sign in to continue to your PulseHR workspace." submitLabel="Sign in" fields={[{ name: "email", label: "Work email", type: "email", autoComplete: "email", placeholder: "you@company.com" }, { name: "password", label: "Password", type: "password", autoComplete: "current-password" }]} onSubmit={async (values) => { const result = await api.post("/auth/login", values); const data = result.data || result; if (data.token && data.user) setAuth({ token: data.token, user: data.user }); navigate(location.state?.from?.pathname || "/", { replace: true }); }} footer={<>New to PulseHR? <Link to="/register">Create an account</Link></>}><div className="form-inline"><span>Use your work credentials</span><Link to="/forgot-password">Forgot password?</Link></div></AuthForm>;
}
