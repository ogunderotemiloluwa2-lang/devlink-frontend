import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";
import { avatarProps } from "@/lib/avatar";

const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn("relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full", className)}
    {...props}
  />
));
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image ref={ref} className={cn("aspect-square h-full w-full", className)} {...props} />
));
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn("flex h-full w-full items-center justify-center rounded-full font-medium", className)}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

// Convenience wrapper: renders a deterministic color-coded initials avatar
// for a given username/displayName, with no image dependency.
function UserAvatar({ username, displayName, className, textClassName }) {
  const { initials, color } = avatarProps(username, displayName);
  return (
    <Avatar className={className}>
      <AvatarFallback
        style={{ backgroundColor: `hsl(${color} / 0.16)`, color: `hsl(${color})` }}
        className={cn("text-xs", textClassName)}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

export { Avatar, AvatarImage, AvatarFallback, UserAvatar };
