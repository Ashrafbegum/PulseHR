import { Link, useNavigate, useParams } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import useApi from "@/hooks/useApi";

export default function ResetPassword() {
  const api = useApi(); const { token } = useParams(); const navigate = useNavigate();
  return <AuthForm title="Choose a new password" description="Make it strong and memorable. Use at least 8 characters." submitLabel="Update password" fields={[{ name: "password", label: "New password", type: "password", autoComplete: "new-password" }, { name: "confirmPassword", label: "Confirm new password", type: "password", autoComplete: "new-password" }]} onSubmit={async ({ password, confirmPassword }) => { if (password !== confirmPassword) throw new Error("Passwords do not match."); await api.post("/auth/reset-password", { token, password }); navigate("/login", { replace: true, state: { notice: "Password updated. Sign in with your new password." } }); }} footer={<>Need a new reset link? <Link to="/forgot-password">Request one</Link></>} />;
}
