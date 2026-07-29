import { UserAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";

export default function ConversationList({ conversations, activeId, onSelect }) {
  return (
    <div className="divide-y divide-border overflow-y-auto scrollbar-thin">
      {conversations.map((conv) => {
        const isActive = conv.id === activeId;
        return (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={cn(
              "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/60",
              isActive && "bg-accent"
            )}
          >
            <UserAvatar username={conv.participant} displayName={conv.participantName} className="h-9 w-9 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium">{conv.participantName || conv.participant}</p>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatRelativeTime(conv.lastMessageAt)}
                </span>
              </div>
              <p className="truncate text-xs text-muted-foreground">{conv.lastMessageText}</p>
            </div>
            {conv.unread > 0 && <Badge className="shrink-0 px-1.5">{conv.unread}</Badge>}
          </button>
        );
      })}
    </div>
  );
}
