import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { MessageSquare, Send } from "lucide-react";
import ConversationList from "./ConversationList";
import MessageThread from "./MessageThread";
import EmptyState from "@/components/states/EmptyState";
import { useApi, useConversations } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

/**
 * Adapts a backend conversation to the shape expected by ConversationList/MessageThread.
 * Backend: { _id, type, participants, otherParticipant: {name, username, avatarUrl}, unreadCount, lastMessage: {preview, sentAt, readBy, deliveredTo, sender}, lastActivityAt }
 * Frontend: { id, participant, lastMessageAt, unread, lastMessageText, lastMessageStatus, lastMessageSender }
 */
function adaptConversation(conv, currentUserId) {
  if (!conv) return null;
  const other = conv.otherParticipant || (conv.participants?.find((p) => p.user?._id !== currentUserId)?.user);
  const lastMsg = conv.lastMessage || {};
  const lastMsgSenderId = lastMsg.sender?._id || lastMsg.sender;
  const isOwnLastMessage = lastMsgSenderId?.toString() === currentUserId?.toString();
  const readBy = lastMsg.readBy || [];
  const deliveredTo = lastMsg.deliveredTo || [];
  // For own last message: check if the other participant has read/delivered it
  const isReadByOther = isOwnLastMessage && readBy.some((r) => {
    const readerId = r.user?._id || r.user;
    return readerId?.toString() !== currentUserId?.toString();
  });
  const isDeliveredByOther = isOwnLastMessage && deliveredTo.some((d) => {
    const deliveredId = d.user?._id || d.user;
    return deliveredId?.toString() !== currentUserId?.toString();
  });
  return {
    id: conv._id,
    participant: other?.username || "",
    participantName: other?.name || "",
    participantAvatar: other?.avatarUrl || "",
    lastMessageAt: lastMsg.sentAt || conv.lastActivityAt || "",
    lastMessageText: lastMsg.preview || "",
    unread: conv.unreadCount || 0,
    lastMessageStatus: isReadByOther ? "seen" : isDeliveredByOther ? "delivered" : isOwnLastMessage ? "sent" : "read",
    lastMessageSender: isOwnLastMessage ? "me" : (other?.name || other?.username || ""),
  };
}

export default function Messages() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeId, setActiveId] = useState(searchParams.get("c") || null);
  const { data, loading, error, refetch } = useConversations();
  const { toast } = useToast();
  const errorToastShownRef = useRef(false);

  const conversations = data?.conversations || [];

  // Show error toast only once per error (not on every re-render)
  useEffect(() => {
    if (error && !errorToastShownRef.current) {
      // Don't show toast for 401 errors (auth issues are handled elsewhere)
      if (error.statusCode !== 401) {
        toast({ title: "Error", description: "Could not load conversations.", variant: "destructive" });
      }
      errorToastShownRef.current = true;
    }
    // Reset the ref when error clears
    if (!error) {
      errorToastShownRef.current = false;
    }
  }, [error, toast]);

  // Auto-select conversation from URL param only (don't auto-select first conversation)
  useEffect(() => {
    const c = searchParams.get("c");
    if (c && conversations.find((conv) => conv._id === c)) {
      setActiveId(c);
    }
  }, [conversations, searchParams]);

  // Mark all conversations as read when the messages page is opened
  useEffect(() => {
    if (conversations.length > 0) {
      conversations.forEach((conv) => {
        if (conv.unreadCount > 0) {
          api.post(`/conversations/${conv._id}/read`).catch(() => {});
        }
      });
      // Update local state to clear unread counts immediately
      refetch();
    }
  }, [conversations]);

  const handleSelect = (id) => {
    setActiveId(id);
    setSearchParams({ c: id });
  };

  const handleBack = () => {
    setActiveId(null);
    setSearchParams({});
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
    // Error toast is handled in the useEffect above to avoid duplicates
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-3.5rem)]">
      <div
        className={cn(
          "w-full shrink-0 border-r border-border bg-background/95 lg:w-80",
          activeId ? "hidden lg:block" : "block"
        )}
      >
        <div className="border-b border-border bg-background/95 px-4 py-3 shadow-sm">
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
          <MessageThread conversationId={activeConversation._id} onBack={handleBack} />
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
