import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

function Label({ className, ...props }) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn("mb-2 block text-sm font-medium text-foreground", className)}
      {...props}
    />
  );
}

export { Label };
