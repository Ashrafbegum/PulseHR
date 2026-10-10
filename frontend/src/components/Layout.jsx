import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { navForRole } from "@/config/nav";
import { useAuthStore } from "@/store/authStore";
import Sidebar, { SidebarContent } from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

function MobileBottomNav() {
  const role = useAuthStore((state) => state.role);
  const items = navForRole(role).flatMap((section) => section.items);
  if (items.length < 2) return null;

  return (
    <nav aria-label="Mobile" className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-around gap-1 rounded-full bg-card p-2 shadow-overlay lg:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            aria-label={item.label}
            className={({ isActive }) => cn(
              "grid size-10 place-items-center rounded-full transition",
              isActive ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
          </NavLink>
        );
      })}
    </nav>
  );
}

export default function Layout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground lg:bg-[linear-gradient(130deg,hsl(var(--bg-shell)),hsl(var(--bg-shell-2)))] lg:p-4">
      <div className="mx-auto flex min-h-screen max-w-[1440px] gap-4 lg:h-[calc(100vh-2rem)] lg:min-h-0">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col rounded-none bg-background lg:overflow-hidden lg:rounded-lg lg:bg-surface lg:shadow-card">
          <div className="px-4 pt-4 sm:px-6 lg:px-8 lg:pt-6">
            <TopBar onMenu={() => setDrawerOpen(true)} />
          </div>
          <main className="min-w-0 flex-1 px-4 pb-24 pt-6 sm:px-6 lg:overflow-y-auto lg:px-8 lg:pb-10">
            {children || <Outlet />}
          </main>
        </div>
      </div>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="left" aria-label="Navigation drawer">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="min-h-0 flex-1">
            <SidebarContent collapsed={false} onNavigate={() => setDrawerOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <MobileBottomNav />
    </div>
  );
}
