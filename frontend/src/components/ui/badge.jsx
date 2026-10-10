import { cn } from "@/lib/utils";
import { badgeVariants } from "@/lib/badgeVariants";
import { getStatus } from "@/lib/statusMap";

function Badge({ className, tone = "muted", ...props }) {
  return <span data-slot="badge" className={cn(badgeVariants({ tone }), className)} {...props} />;
}

// Icon + text always: reads tone/icon/label from the central status map.
function StatusBadge({ domain, status, className, ...props }) {
  const entry = getStatus(domain, status);
  const Icon = entry.icon;
  return (
    <Badge tone={entry.tone} className={className} {...props}>
      {Icon && <Icon className="size-3.5" aria-hidden="true" />}
      {entry.label}
    </Badge>
  );
}

export { Badge, StatusBadge };
