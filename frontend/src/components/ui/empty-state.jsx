import { cn } from "@/lib/utils";

function EmptyState({ icon: Icon, title, message, action, className, ...props }) {
  return (
    <div
      data-slot="empty-state"
      className={cn("flex flex-col items-center gap-2 rounded-md bg-card px-6 py-12 text-center shadow-card", className)}
      {...props}
    >
      {Icon && (
        <span className="grid size-12 place-items-center rounded-full bg-primary-soft text-primary">
          <Icon className="size-6" aria-hidden="true" />
        </span>
      )}
      {title && <p className="text-base font-semibold">{title}</p>}
      {message && <p className="max-w-sm text-sm text-muted-foreground">{message}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export { EmptyState };
