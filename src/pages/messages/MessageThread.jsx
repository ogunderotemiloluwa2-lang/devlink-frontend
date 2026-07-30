import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/ui/avatar";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import { useToast } from "@/components/ui/toast";
import { cn, formatRelativeTime } from "@/lib/utils";
import api from "@/lib/api";

/**
 * Adapts a backend message to the shape expected by MessageThread.
 * Backend: { _id, sender: {name, username, avatarUrl}, content, createdAt, readBy }
 * Frontend: { id, from, text, sentAt, isOwn, isRead }
 */
function adaptMessage(msg, currentUserId) {
  if (!msg) return null;
  const isOwn = msg.sender?._id === currentUserId || msg.sender === currentUserId;
  const readBy = msg.readBy || [];
  const isRead = readBy.some((r) => r.user?._id === currentUserId || r.user === currentUserId);
  return {
    id: msg._id,
    from: isOwn ? "you" : (msg.sender?.username || "them"),
    fromName: msg.sender?.name || "",
    text: msg.content || "",
    sentAt: msg.createdAt || msg.sentAt || "",
    isOwn,
    isRead,
  };
}

export default function MessageThread({ conversationId, onBack }) {
  const { user } = useAuth();
  const socket = useSocket();
  const { toast } = useToast();
  const { data, loading, error, refetch } = useApi(
    conversationId ? `/conversations/${conversationId}/messages` : null,
    { deps: [conversationId] }
  );
  const { data: convData } = useApi(
    conversationId ? `/conversations/${conversationId}` : null,
    { deps: [conversationId] }
  );

  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [participant, setParticipant] = useState({ username: "", name: "" });
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (data?.messages) {
      const adapted = data.messages.map((m) => adaptMessage(m, user?._id)).filter(Boolean);
      setMessages(adapted);
    }
    // Get participant info from conversation data
    if (convData?.conversation) {
      const conv = convData.conversation;
      if (conv.type === "direct" && conv.otherParticipant) {
        setParticipant({
          username: conv.otherParticipant.username || "",
          name: conv.otherParticipant.name || "",
          avatarUrl: conv.otherParticipant.avatarUrl || "",
          isOnline: conv.isOnline || false,
        });
      }
    }
  }, [data, convData, user?._id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket: join conversation room and listen for real-time messages
  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit("conversation:join", conversationId, (resp) => {
      if (!resp?.ok) {
        console.warn("Could not join conversation room:", resp?.error);
      }
    });

    const handleNewMessage = (message) => {
      const adapted = adaptMessage(message, user?._id);
      if (adapted) {
        setMessages((prev) => {
          // Prevent duplicates if the message was already added (e.g., from REST response)
          if (prev.some((m) => m.id === adapted.id)) return prev;
          return [...prev, adapted];
        });
      }
    };

    const handleTypingUpdate = ({ userId, isTyping }) => {
      setTypingUsers((prev) => {
        const next = new Set(prev);
        if (isTyping) {
          next.add(userId);
        } else {
          next.delete(userId);
        }
        return next;
      });

      // Auto-clear typing after 3 seconds (safety net)
      if (isTyping) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          setTypingUsers((prev) => {
            const next = new Set(prev);
            next.delete(userId);
            return next;
          });
        }, 3000);
      }
    };

    socket.on("message:new", handleNewMessage);
    socket.on("typing:update", handleTypingUpdate);

    const handleConversationRead = ({ userId, readAt }) => {
      // Mark all messages from the other user as read
      if (userId === user?._id) return;
      setMessages((prev) =>
        prev.map((m) =>
          !m.isOwn ? { ...m, isRead: true } : m
        )
      );
    };

    socket.on("conversation:read", handleConversationRead);

    return () => {
      socket.emit("conversation:leave", conversationId);
      socket.off("message:new", handleNewMessage);
      socket.off("typing:update", handleTypingUpdate);
      socket.off("conversation:read", handleConversationRead);
      clearTimeout(typingTimeoutRef.current);
    };
  }, [socket, conversationId, user?._id]);

  // Mark conversation as read when it's opened
  useEffect(() => {
    if (!conversationId) return;
    api.post(`/conversations/${conversationId}/read`).catch(() => {});
  }, [conversationId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!draft.trim() || !conversationId || sending) return;
    setSending(true);
    try {
      const res = await api.post(`/conversations/${conversationId}/messages`, { content: draft });
      const newMsg = adaptMessage(res.data.message || res.data, user?._id);
      // Only add the message locally if the socket is not connected.
      // When the socket is connected, the "message:new" event will handle
      // adding it to avoid duplicates.
      if (newMsg && !socket) {
        setMessages((prev) => [...prev, newMsg]);
      }
      setDraft("");
      // Notify others that we stopped typing
      socket?.emit("typing:stop", { conversationId });
    } catch (err) {
      toast({ title: "Error", description: "Could not send message.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (e) => {
    setDraft(e.target.value);
    if (!socket || !conversationId) return;

    const isCurrentlyTyping = typingUsers.size > 0;
    const shouldStartTyping = e.target.value.length > 0 && !isCurrentlyTyping;

    if (shouldStartTyping) {
      socket.emit("typing:start", { conversationId });
    }

    // Debounce: stop typing after 1.5s of no input
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket?.emit("typing:stop", { conversationId });
    }, 1500);
  };

  const handleBlur = () => {
    socket?.emit("typing:stop", { conversationId });
    clearTimeout(typingTimeoutRef.current);
  };

  if (loading) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onBack} aria-label="Back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onBack} aria-label="Back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <p className="text-sm text-muted-foreground">Could not load messages.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onBack} aria-label="Back">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="relative">
          <UserAvatar username={participant.username} displayName={participant.name} className="h-8 w-8" />
          {participant.isOnline && (
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-400 ring-2 ring-background" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{participant.name || participant.username || "Conversation"}</p>
          {participant.isOnline && <p className="text-[10px] text-green-500">Online</p>}
          {typingUsers.size > 0 && (
            <p className="text-[10px] text-muted-foreground">Typing…</p>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4 scrollbar-thin">
        {messages.map((m) => {
          const isYou = m.isOwn;
          return (
            <div key={m.id} className={cn("flex", isYou ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[75%] space-y-1", isYou && "items-end")}>
                <div className={cn("rounded-lg px-3 py-2 text-sm", isYou ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground")}>
                  {m.text}
                </div>
                <div className={cn("flex items-center gap-1 text-[10px] text-muted-foreground", isYou && "justify-end")}>
                  <span>{formatRelativeTime(m.sentAt)}</span>
                  {isYou && (
                    <span className="text-xs">
                      {m.isRead ? "✓✓ Seen" : "✓✓"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-border p-3">
        <Input
          placeholder="Type a message…"
          value={draft}
          onChange={handleTyping}
          onBlur={handleBlur}
          disabled={sending}
        />
        <Button type="submit" size="icon" disabled={!draft.trim() || sending} aria-label="Send">
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
}
