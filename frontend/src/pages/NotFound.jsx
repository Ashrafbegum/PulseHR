import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <main className="grid min-h-screen place-items-center bg-background px-6">
      <Card className="w-full max-w-sm p-9">
        <CardContent className="space-y-3 p-0">
          <span className="grid size-10 place-items-center rounded-2xl bg-primary text-lg font-semibold text-white shadow-card">P</span>
          <p className="eyebrow">PULSEHR</p>
          <h1 className="text-2xl font-semibold tracking-tight">Page not found.</h1>
          <p className="text-sm leading-6 text-muted-foreground">The page you are looking for does not exist or was moved.</p>
          <Button asChild className="mt-5 w-full">
            <Link to={isAuthenticated ? "/" : "/login"}>
              <Compass className="size-4" aria-hidden="true" />
              {isAuthenticated ? "Back to dashboard" : "Back to sign in"}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
