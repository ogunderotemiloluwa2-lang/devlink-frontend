import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Rss,
  MessageSquare,
  Sparkles,
  Users,
  Globe2,
  Settings,
  User,
  Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useConversations } from "@/contexts/ConversationsContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/feed", label: "Feed", icon: Rss },
  { to: "/messages", label: "Messages", icon: MessageSquare },
  { to: "/discover", label: "Discover", icon: Users },
  { to: "/ai-hub", label: "AI Hub", icon: Sparkles },
  { to: "/collaboration-hub", label: "Collaboration Hub", icon: Users },
  { to: "/community", label: "Community", icon: Globe2 },
];

export default function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth();
  const { unreadCount } = useConversations();

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <Link to="/" className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground transition-transform hover:scale-105">
          <Code2 className="h-4 w-4" />
        </Link>
        <Link to="/" className="font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80">
          DevLink
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-foreground"
              )
            }
          >
            <span className="flex items-center gap-3">
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </span>
            {to === "/messages" && unreadCount > 0 && (
              <Badge className="h-5 px-1.5 text-xs">{unreadCount}</Badge>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-0.5 border-t border-sidebar-border px-2 py-3">
        <NavLink
          to={`/profile/${user?.username || ""}`}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-foreground"
            )
          }
        >
          <User className="h-4 w-4 shrink-0" />
          Profile
        </NavLink>
        <NavLink
          to="/settings/profile"
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-foreground"
            )
          }
        >
          <Settings className="h-4 w-4 shrink-0" />
          Settings
        </NavLink>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent/70 hover:text-foreground"
        >
          <Code2 className="h-4 w-4 shrink-0" />
          Log out
        </button>
      </div>

      {user && (
        <div className="flex items-center gap-2 border-t border-sidebar-border px-4 py-3">
          <UserAvatar username={user.username} displayName={user.name} className="h-8 w-8" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">@{user.username}</p>
          </div>
        </div>
      )}
    </div>
  );
}
