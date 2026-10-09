import { NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useAppStore } from "@/store/appStore";

export default function Layout({ children }) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const addNotification = useAppStore((state) => state.addNotification);

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      addNotification({
        type: "error",
        title: "Sign out problem",
        message: error.message,
      });
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <NavLink to="/" className="text-lg font-semibold">PulseHR</NavLink>
          <div className="flex items-center gap-4 text-sm">
            {user && <span className="text-muted-foreground">{user.name || user.email}</span>}
            {user && <button className="underline underline-offset-4" onClick={handleLogout}>Sign out</button>}
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-6 py-8">{children || <Outlet />}</main>
    </div>
  );
}
