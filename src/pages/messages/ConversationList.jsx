import { UserAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";

export default function ConversationList({ conversations, activeId, onSelect }) {
  return (
    <div className="divide-y divide-border overflow-y-auto scrollbar-thin">
      {conversations.map((conv) => {
        const isActive = conv.id === activeId;
        const status = conv.lastMessageStatus;
        const showTick = status === "sent" || status === "delivered" || status === "seen";
        const tickColor = status === "seen" ? "text-blue-500" : "text-muted-foreground";
        return (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={cn(
              "flex w-full items-start gap-3 px-4 py-3 text-left transition-all duration-200 hover:bg-accent/60",
              isActive && "bg-accent/50"
            )}
          >
            <UserAvatar username={conv.participant} displayName={conv.participantName} className="h-10 w-10 shrink-0 ring-2 ring-background" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold">{conv.participantName || conv.participant}</p>
                <span className="shrink-0 text-xs text-muted-foreground/70">
                  {formatRelativeTime(conv.lastMessageAt)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <p className="truncate text-xs text-muted-foreground/80">{conv.lastMessageText}</p>
                {showTick && (
                  <span className={cn("text-xs", tickColor)}>
                    {status === "seen" ? "✓✓ Seen" : status === "delivered" ? "✓✓" : "✓"}
                  </span>
                )}
              </div>
            </div>
            {conv.unread > 0 && (
              <Badge className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                {conv.unread}
              </Badge>
            )}
          </button>
        );
      })}
    </div>
  );
}
