import { CalendarCheck, Clock, Inbox } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import PageHeader from "@/components/PageHeader";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/ui/stat-card";
import { formatDate } from "@/lib/datetime";

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome${user?.name ? `, ${user.name.split(" ")[0]}` : ""}`}
        subtitle={`${formatDate(new Date())} · ${user?.email || "Your PulseHR workspace"}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Attendance today" value="—" unit="not tracked yet" icon={Clock} />
        <StatCard label="Pending leave" value="—" unit="requests" icon={CalendarCheck} />
        <StatCard label="Inbox" value="—" unit="updates" icon={Inbox} />
      </div>

      <EmptyState
        icon={Inbox}
        title="Nothing to show yet"
        message="Attendance, leave and team modules will appear here once their services are connected."
      />
    </div>
  );
}
