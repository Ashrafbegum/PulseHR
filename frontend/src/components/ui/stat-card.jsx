import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

function StatCard({ label, value, unit, icon: Icon, className, ...props }) {
  return (
    <Card className={cn("p-6", className)} {...props}>
      <CardContent className="flex items-start justify-between gap-4 p-0">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-semibold tracking-tight tabular">
            {value}
            {unit && <span className="ml-1.5 align-middle text-sm font-normal text-muted-foreground">{unit}</span>}
          </p>
        </div>
        {Icon && (
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
            <Icon className="size-5" aria-hidden="true" />
          </span>
        )}
      </CardContent>
    </Card>
  );
}

export { StatCard };
