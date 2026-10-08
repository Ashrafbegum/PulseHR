import { Link, useNavigate } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import useApi from "@/hooks/useApi";
import { useAuthStore } from "@/store/authStore";

export default function Register() {
  const api = useApi(); const navigate = useNavigate(); const setAuth = useAuthStore((state) => state.setAuth);
  return <AuthForm title="Create your account" description="Set up your PulseHR workspace in a few steps." submitLabel="Create account" fields={[{ name: "name", label: "Full name", autoComplete: "name" }, { name: "email", label: "Work email", type: "email", autoComplete: "email", placeholder: "you@company.com" }, { name: "phone", label: "Phone number", type: "tel", autoComplete: "tel" }, { name: "password", label: "Password", type: "password", autoComplete: "new-password" }]} onSubmit={async (values) => { const result = await api.post("/auth/signup", values); const data = result.data || result; if (data.token && data.user) { setAuth({ token: data.token, user: data.user }); navigate("/", { replace: true }); } else navigate("/login", { replace: true, state: { notice: "Account created. Sign in to continue." } }); }} footer={<>Already have an account? <Link to="/login">Sign in</Link></>} />;
}
