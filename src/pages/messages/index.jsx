import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MessageSquare, Send } from "lucide-react";
import ConversationList from "./ConversationList";
import MessageThread from "./MessageThread";
import EmptyState from "@/components/states/EmptyState";
import { useApi, useConversations } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

/**
 * Adapts a backend conversation to the shape expected by ConversationList/MessageThread.
 * Backend: { _id, type, participants, otherParticipant: {name, username, avatarUrl}, unreadCount, lastMessage: {preview, sentAt}, lastActivityAt }
 * Frontend: { id, participant, lastMessageAt, unread, lastMessageText }
 */
function adaptConversation(conv, currentUserId) {
  if (!conv) return null;
  const other = conv.otherParticipant || (conv.participants?.find((p) => p.user?._id !== currentUserId)?.user);
  return {
    id: conv._id,
    participant: other?.username || "",
    participantName: other?.name || "",
    participantAvatar: other?.avatarUrl || "",
    lastMessageAt: conv.lastMessage?.sentAt || conv.lastActivityAt || "",
    lastMessageText: conv.lastMessage?.preview || "",
    unread: conv.unreadCount || 0,
  };
}

export default function Messages() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeId, setActiveId] = useState(searchParams.get("c") || null);
  const { data, loading, error, refetch } = useConversations();
  const { toast } = useToast();

  const conversations = data?.conversations || [];

  // Auto-select conversation from URL param, or first conversation on load
  useEffect(() => {
    const c = searchParams.get("c");
    if (c && conversations.find((conv) => conv._id === c)) {
      setActiveId(c);
    } else if (!activeId && conversations.length > 0) {
      setActiveId(conversations[0]._id);
    }
  }, [conversations, activeId, searchParams]);

  const handleSelect = (id) => {
    setActiveId(id);
    setSearchParams({ c: id });
  };

  const activeConversation = conversations.find((c) => c._id === activeId);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)]">
        <div className="w-full shrink-0 border-r border-border lg:w-80">
          <div className="border-b border-border px-4 py-3">
            <h1 className="text-lg font-semibold tracking-tight">Messages</h1>
          </div>
          <div className="divide-y divide-border overflow-y-auto">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3">
                <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-muted" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    toast({ title: "Error", description: "Could not load conversations.", variant: "destructive" });
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-3.5rem)]">
      <div
        className={cn(
          "w-full shrink-0 border-r border-border lg:block lg:w-80",
          activeId ? "hidden" : "block"
        )}
      >
        <div className="border-b border-border px-4 py-3">
          <h1 className="text-lg font-semibold tracking-tight">Messages</h1>
        </div>
        {conversations.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No conversations yet"
            description="Messages from your network will appear here."
            className="m-4"
          />
        ) : (
          <ConversationList
            conversations={conversations.map((c) => adaptConversation(c, user?._id))}
            activeId={activeId}
            onSelect={handleSelect}
          />
        )}
      </div>

      <div className={cn("min-w-0 flex-1", !activeId && "hidden lg:block")}>
        {activeConversation ? (
          <MessageThread conversationId={activeConversation._id} onBack={() => setActiveId(null)} />
        ) : (
          <EmptyState
            icon={MessageSquare}
            title="Select a conversation"
            description="Pick someone from the list to see your message history."
            className="mx-auto mt-16 max-w-sm border-0"
          />
        )}
      </div>
    </div>
  );
}
