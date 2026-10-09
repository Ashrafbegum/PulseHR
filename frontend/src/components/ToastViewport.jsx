import { useEffect } from "react";
import { useAppStore } from "@/store/appStore";

function Toast({ notification, onDismiss }) {
  useEffect(() => {
    const timeout = window.setTimeout(() => onDismiss(notification.id), 5000);
    return () => window.clearTimeout(timeout);
  }, [notification.id, onDismiss]);

  const isError = notification.type === "error";
  return (
    <div
      className={`flex max-w-sm items-start gap-3 rounded-lg border bg-card p-4 text-card-foreground shadow-lg ${
        isError ? "border-destructive" : "border-border"
      }`}
      role={isError ? "alert" : "status"}
    >
      <div className="min-w-0 flex-1">
        {notification.title && <p className="text-sm font-semibold">{notification.title}</p>}
        <p className="text-sm text-muted-foreground">{notification.message}</p>
      </div>
      <button
        className="text-sm text-muted-foreground hover:text-foreground"
        type="button"
        onClick={() => onDismiss(notification.id)}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
}

export default function ToastViewport() {
  const notifications = useAppStore((state) => state.notifications);
  const removeNotification = useAppStore((state) => state.removeNotification);

  return (
    <div className="fixed right-4 top-4 z-50 flex flex-col gap-3" aria-live="polite">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          onDismiss={removeNotification}
        />
      ))}
    </div>
  );
}
