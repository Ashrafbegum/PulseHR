import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cn } from "@/lib/utils";

function SegmentedControl({ className, ...props }) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="segmented-control"
      className={cn("inline-flex w-fit items-center gap-1 rounded-full bg-muted p-1", className)}
      {...props}
    />
  );
}

function SegmentedOption({ className, ...props }) {
  return (
    <ToggleGroupPrimitive.Item
      data-slot="segmented-option"
      className={cn(
        "inline-flex h-10 items-center justify-center gap-1.5 rounded-full px-5 text-sm font-medium text-muted-foreground transition hover:text-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-primary data-[state=on]:text-white data-[state=on]:shadow-card",
        className,
      )}
      {...props}
    />
  );
}

export { SegmentedControl, SegmentedOption };
