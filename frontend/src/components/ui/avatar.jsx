import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

function Avatar({ className, ...props }) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn("relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-primary-soft text-sm font-semibold text-primary", className)}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  );
}

function AvatarFallback({ className, ...props }) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn("grid size-full place-items-center", className)}
      {...props}
    />
  );
}

function AvatarStack({ className, children, ...props }) {
  return (
    <div data-slot="avatar-stack" className={cn("flex items-center", className)} {...props}>
      {children}
    </div>
  );
}

export { Avatar, AvatarImage, AvatarFallback, AvatarStack };
