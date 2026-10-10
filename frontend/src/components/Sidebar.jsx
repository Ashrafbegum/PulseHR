import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronsLeft, ChevronsRight, LogOut } from "lucide-react";
import { navForRole } from "@/config/nav";
import { useAuthStore } from "@/store/authStore";
import useLogout from "@/hooks/useLogout";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const COLLAPSED_KEY = "pulsehr-sidebar-collapsed";

function SidebarContent({ collapsed, onNavigate }) {
  const role = useAuthStore((state) => state.role);
  const handleLogout = useLogout();
  const sections = navForRole(role);

  return (
    <div className="flex h-full flex-col gap-6">
      <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between gap-2 px-2")}>
        {!collapsed && (
          <span className="inline-flex items-center gap-2.5 text-xl font-semibold tracking-tight">
            <span className="grid size-10 place-items-center rounded-2xl bg-primary text-lg font-semibold text-white shadow-card">P</span>
            pulse<span className="text-primary">hr</span>
          </span>
        )}
        {collapsed && (
          <span className="grid size-10 place-items-center rounded-2xl bg-primary text-lg font-semibold text-white shadow-card" aria-hidden="true">P</span>
        )}
      </div>

      <nav aria-label="Primary" className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.label} className="flex flex-col gap-1">
            {!collapsed && (
              <p className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.label}
              </p>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={onNavigate}
                  title={collapsed ? item.label : undefined}
                  aria-label={collapsed ? item.label : undefined}
                  className={({ isActive }) => cn(
                    "flex h-10 items-center gap-3 rounded-full px-4 text-sm font-medium transition",
                    collapsed && "justify-center px-0",
                    isActive
                      ? "bg-primary text-white shadow-card"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {!collapsed && item.badge ? (
                    <span className="ml-auto rounded-full bg-danger px-2 py-0.5 text-xs font-semibold text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="flex flex-col gap-1">
        <Button
          variant="ghost"
          onClick={handleLogout}
          aria-label="Log out"
          title={collapsed ? "Log out" : undefined}
          className={cn("w-full text-danger hover:bg-danger/10 hover:text-danger", collapsed ? "justify-center px-0" : "justify-start")}
        >
          <LogOut className="size-4 shrink-0" aria-hidden="true" />
          {!collapsed && "Log out"}
        </Button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return window.localStorage.getItem(COLLAPSED_KEY) === "true";
    } catch {
      return false;
    }
  });

  function toggle() {
    setCollapsed((prev) => {
      try {
        window.localStorage.setItem(COLLAPSED_KEY, String(!prev));
      } catch {
        // Private mode: collapse lasts for the session only.
      }
      return !prev;
    });
  }

  return (
    <aside
      aria-label="Sidebar"
      className={cn(
        "relative hidden h-[calc(100vh-2rem)] shrink-0 flex-col rounded-lg bg-card p-4 shadow-card transition-all lg:flex",
        collapsed ? "w-20" : "w-70",
      )}
    >
      <SidebarContent collapsed={collapsed} />
      <button
        type="button"
        onClick={toggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
        className="absolute -right-4 top-8 grid size-8 place-items-center rounded-full border border-border bg-card text-muted-foreground shadow-card transition hover:text-foreground"
      >
        {collapsed ? <ChevronsRight className="size-4" aria-hidden="true" /> : <ChevronsLeft className="size-4" aria-hidden="true" />}
      </button>
    </aside>
  );
}

export { SidebarContent };
