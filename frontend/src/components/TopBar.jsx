import { useEffect, useState } from "react";
import { ChevronDown, LogOut, Menu, Moon, Sun } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import useLogout from "@/hooks/useLogout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initialsOf } from "@/lib/initials";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    window.localStorage.setItem("pulsehr-theme", theme);
  } catch {
    // Private mode: theme lasts for the session only.
  }
}

function readTheme() {
  try {
    const saved = window.localStorage.getItem("pulsehr-theme");
    if (saved === "dark" || saved === "light") return saved;
  } catch {
    // Fall through to system preference.
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function TopBar({ onMenu }) {
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const handleLogout = useLogout();
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <header className="flex items-center gap-3">
      <Button
        variant="outline"
        size="icon"
        onClick={onMenu}
        aria-label="Open navigation"
        className="rounded-full border-border bg-card lg:hidden"
      >
        <Menu className="size-4" aria-hidden="true" />
      </Button>

      <div className="ml-auto flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={user ? `Account menu for ${user.name || user.email}` : "Account menu"}
              className="flex h-10 items-center gap-2.5 rounded-full border border-border bg-card py-1 pl-1 pr-3 shadow-card transition hover:text-foreground"
            >
              <Avatar className="size-8">
                {user?.avatar ? <AvatarImage src={user.avatar} alt="" /> : null}
                <AvatarFallback>{initialsOf(user?.name, user?.email)}</AvatarFallback>
              </Avatar>
              <span className="hidden text-left leading-tight sm:block">
                <span className="block max-w-32 truncate text-sm font-semibold">{user?.name || user?.email || "Account"}</span>
                {role && <span className="block text-xs capitalize text-muted-foreground">{role}</span>}
              </span>
              <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <span className="block truncate text-sm font-semibold normal-case tracking-normal text-foreground">
                {user?.name || user?.email}
              </span>
              {role && <span className="block text-xs font-normal capitalize">{role}</span>}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="size-4" aria-hidden="true" /> : <Moon className="size-4" aria-hidden="true" />}
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-danger">
              <LogOut className="size-4" aria-hidden="true" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
