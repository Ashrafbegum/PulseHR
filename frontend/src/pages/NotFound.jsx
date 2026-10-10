import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function NotFound() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <main className="error-page">
      <div>
        <span className="brand-mark">P</span>
        <p className="eyebrow">PULSEHR</p>
        <h1>Page not found.</h1>
        <p>The page you are looking for does not exist or was moved.</p>
        <Link
          className="submit-button button-link"
          to={isAuthenticated ? "/" : "/login"}
        >
          {isAuthenticated ? "Back to dashboard" : "Back to sign in"}
        </Link>
      </div>
    </main>
  );
}
