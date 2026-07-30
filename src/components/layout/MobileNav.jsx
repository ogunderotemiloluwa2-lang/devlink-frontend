import { NavLink } from "react-router-dom";
import { LayoutDashboard, Rss, MessageSquare, Globe2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useConversations } from "@/hooks/useApi";
import Sidebar from "./Sidebar";

const bottomItems = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/feed", label: "Feed", icon: Rss },
  { to: "/ai-hub", label: "AI", icon: Sparkles },
  { to: "/messages", label: "Messages", icon: MessageSquare },
  { to: "/discover", label: "Discover", icon: Users2 },
  { to: "/community", label: "Community", icon: Globe2 },
];

export function MobileBottomNav() {
  const { user } = useAuth();
  const { data: convData } = useConversations();
  const conversations = convData?.conversations || [];
  const unreadCount = conversations.reduce((sum, c) => {
    const p = c.participants?.find((p) => p.user?._id === user?._id || p.user === user?._id);
    return sum + (p?.unreadCount || 0);
  }, 0);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-center justify-around gap-1 border-t border-border bg-background/95 pb-safe-area-inset-bottom backdrop-blur lg:hidden">
      {bottomItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "relative flex flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-1.5 text-[10px] font-medium transition-all duration-200",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={cn(
                  "relative flex h-10 w-10 items-center justify-center rounded-full transition-all",
                  isActive
                    ? "scale-110 bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent"
                )}
              >
                <Icon className="h-5 w-5" />
                {to === "/messages" && unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 min-w-[16px] px-0.5 text-[9px]">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
              </div>
              <span className="mt-0.5">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export function MobileNavSheet({ open, onOpenChange }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0">
        <Sidebar onNavigate={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  );
}
