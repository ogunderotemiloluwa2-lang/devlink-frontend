import { useState, useEffect } from "react";
import { Bell, Heart, MessageCircle, UserPlus, Users2, Mail } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/avatar";
import EmptyState from "@/components/states/EmptyState";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import api from "@/lib/api";

const iconByType = {
  follow: UserPlus,
  like: Heart,
  comment: MessageCircle,
  reply: MessageCircle,
  mention: MessageCircle,
  collab: Users2,
  message: Mail,
  projectInvite: Users2,
  communityInvite: Users2,
};

export default function NotificationsPopover() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/notifications");
      setItems(res.data.notifications || []);
    } catch (err) {
      toast({ title: "Error", description: "Could not load notifications.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = items.filter((n) => !n.isRead).length;

  const markAllRead = async () => {
    try {
      await Promise.all(
        items.filter((n) => !n.isRead).map((n) => api.patch(`/notifications/${n._id}/read`))
      );
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      toast({ title: "Error", description: "Could not mark notifications as read.", variant: "destructive" });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-primary" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs text-primary hover:underline">
              Mark all as read
            </button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto scrollbar-thin">
          {loading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
                    <div className="h-2 w-1/2 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="You're all caught up"
              description="New activity will show up here."
              className="border-0"
            />
          ) : (
            items.map((n) => {
              const actor = n.actor;
              const Icon = iconByType[n.type] ?? Bell;
              return (
                <div
                  key={n._id}
                  className={cn(
                    "flex gap-3 border-b border-border px-4 py-3 last:border-0",
                    !n.isRead && "bg-accent/40"
                  )}
                >
                  <UserAvatar
                    username={actor?.username || "system"}
                    displayName={actor?.name || "DevLink"}
                    className="h-8 w-8"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug">
                      {actor && <span className="font-medium">{actor.name}</span>}{" "}
                      <span className="text-muted-foreground">{n.text}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{formatRelativeTime(n.createdAt)}</p>
                  </div>
                  <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
