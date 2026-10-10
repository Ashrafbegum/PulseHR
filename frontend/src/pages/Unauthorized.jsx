import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Unauthorized() {
  const role = useAuthStore((state) => state.role);

  return (
    <main className="grid min-h-screen place-items-center bg-background px-6">
      <Card className="w-full max-w-sm p-9">
        <CardContent className="space-y-3 p-0">
          <span className="grid size-12 place-items-center rounded-full bg-danger/10 text-danger">
            <ShieldAlert className="size-6" aria-hidden="true" />
          </span>
          <p className="eyebrow">PULSEHR</p>
          <h1 className="text-2xl font-semibold tracking-tight">Not authorized.</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            {role
              ? `Your role (${role}) does not have access to that page.`
              : "You do not have access to that page."}
          </p>
          <Button asChild className="mt-5 w-full">
            <Link to="/">Back to dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
