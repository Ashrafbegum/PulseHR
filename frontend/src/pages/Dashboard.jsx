import { useAuthStore } from "@/store/authStore";

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="eyebrow">PULSEHR · OVERVIEW</p>
        <h1 className="text-2xl font-semibold">
          Welcome{user?.name ? `, ${user.name}` : ""}.
        </h1>
        <p className="text-sm text-muted-foreground">
          {user?.email || "You are signed in to your PulseHR workspace."}
        </p>
      </header>
      <section className="rounded-lg border bg-card p-6 text-sm text-card-foreground">
        <p className="font-medium">Your workspace is ready.</p>
        <p className="mt-1 text-muted-foreground">
          Additional PulseHR modules will appear here as backend endpoints become
          available.
        </p>
      </section>
    </div>
  );
}
