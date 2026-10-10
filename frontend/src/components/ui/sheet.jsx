import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

function Sheet({ ...props }) {
  return <DialogPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }) {
  return <DialogPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

const sheetVariants = cva(
  "fixed z-50 flex flex-col gap-4 bg-card p-6 shadow-overlay transition",
  {
    variants: {
      side: {
        right: "inset-y-0 right-0 h-full w-3/4 rounded-l-lg sm:max-w-sm",
        left: "inset-y-0 left-0 h-full w-3/4 rounded-r-lg sm:max-w-sm",
        bottom: "inset-x-0 bottom-0 h-auto rounded-t-lg",
      },
    },
    defaultVariants: { side: "right" },
  },
);

function SheetContent({ className, side = "right", children, ...props }) {
  return (
    <DialogPrimitive.Portal data-slot="sheet-portal">
      <DialogPrimitive.Overlay
        data-slot="sheet-overlay"
        className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-[2px]"
      />
      <DialogPrimitive.Content data-slot="sheet-content" className={cn(sheetVariants({ side }), className)} {...props}>
        {children}
        <DialogPrimitive.Close
          aria-label="Close panel"
          className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-border bg-card text-muted-foreground transition hover:text-foreground"
        >
          <X className="size-4" aria-hidden="true" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

function SheetHeader({ className, ...props }) {
  return <div data-slot="sheet-header" className={cn("flex flex-col gap-1 pr-10", className)} {...props} />;
}

function SheetTitle({ className, ...props }) {
  return <DialogPrimitive.Title data-slot="sheet-title" className={cn("text-xl font-semibold tracking-tight", className)} {...props} />;
}

function SheetDescription({ className, ...props }) {
  return <DialogPrimitive.Description data-slot="sheet-description" className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription };
