import { useAuthStore } from "@/store/authStore";
import { useAppStore } from "@/store/appStore";

// Shared sign-out flow (previously inline in Layout). Behavior unchanged.
export default function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  const addNotification = useAppStore((state) => state.addNotification);

  return async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      addNotification({
        type: "error",
        title: "Sign out problem",
        message: error.message,
      });
    }
  };
}
