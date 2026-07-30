import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeft, Send, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/ui/avatar";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import { useToast } from "@/components/ui/toast";
import { cn, formatRelativeTime } from "@/lib/utils";
import api from "@/lib/api";
import { Link } from "react-router-dom";

/**
 * Adapts a backend message to the shape expected by MessageThread.
 * Backend: { _id, sender: {name, username, avatarUrl}, content, createdAt, readBy, deliveredTo }
 * Frontend: { id, from, text, sentAt, isOwn, isRead, isDelivered }
 *
 * Read receipt logic:
 * - For own messages:
 *   - "✓" (single check) = message sent but not delivered
 *   - "✓✓" (double check) = message delivered (recipient is online/active)
 *   - "✓✓ Seen" = message has been read by the other participant
 * - For received messages: show "✓✓ Seen" when the current user has read it
 */
function adaptMessage(msg, currentUserId) {
  if (!msg) return null;
  const isOwn = msg.sender?._id === currentUserId || msg.sender === currentUserId;
  const readBy = msg.readBy || [];
  const deliveredTo = msg.deliveredTo || [];
  // For own messages: isRead means the OTHER participant has read it
  // For received messages: isRead means the current user has read it
  const isRead = readBy.some((r) => {
    const readerId = r.user?._id || r.user;
    return readerId !== currentUserId;
  });
  // For own messages: isDelivered means the OTHER participant has received it
  const isDelivered = deliveredTo.some((d) => {
    const deliveredId = d.user?._id || d.user;
    return deliveredId !== currentUserId;
  });
  return {
    id: msg._id,
    from: isOwn ? "you" : (msg.sender?.username || "them"),
    fromName: msg.sender?.name || "",
    text: msg.content || "",
    sentAt: msg.createdAt || msg.sentAt || "",
    isOwn,
    isRead,
    isDelivered,
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
          // For received messages (not own), mark as delivered since we received it via socket
          const isDelivered = adapted.isOwn ? adapted.isDelivered : true;
          return [...prev, { ...adapted, isDelivered }];
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
      // When the other participant reads the conversation, mark our own messages as seen
      if (userId === user?._id) return;
      setMessages((prev) =>
        prev.map((m) =>
          m.isOwn ? { ...m, isRead: true } : m
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
        <div className="flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={onBack} aria-label="Back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
            <div className="space-y-1">
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              <div className="h-3 w-16 animate-pulse rounded bg-muted" />
            </div>
          </div>
          <Button variant="ghost" size="icon" className="hidden lg:inline-flex" onClick={onBack} aria-label="Back to conversations">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={cn("flex", i % 2 === 0 ? "justify-start" : "justify-end")}>
              <div className="h-4 w-3/4 max-w-[75%] animate-pulse rounded-2xl bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={onBack} aria-label="Back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <p className="text-sm text-muted-foreground">Could not load messages.</p>
          </div>
          <Button variant="ghost" size="icon" className="hidden lg:inline-flex" onClick={onBack} aria-label="Back to conversations">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onBack} aria-label="Back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="relative">
            <UserAvatar username={participant.username} displayName={participant.name} className="h-9 w-9 ring-2 ring-background" />
            {participant.isOnline && (
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-background" />
            )}
          </div>
          <div className="min-w-0">
            {participant.username ? (
              <Link to={`/profile/${participant.username}`} className="truncate text-sm font-semibold hover:underline">
                {participant.name || participant.username || "Conversation"}
              </Link>
            ) : (
              <p className="truncate text-sm font-semibold">{participant.name || participant.username || "Conversation"}</p>
            )}
            {participant.isOnline && <p className="text-[10px] text-green-500">Online</p>}
            {typingUsers.size > 0 && (
              <p className="text-[10px] text-muted-foreground">Typing…</p>
            )}
          </div>
        </div>
        {/* Desktop back button - shown alongside conversation list */}
        <Button variant="ghost" size="icon" className="hidden lg:inline-flex" onClick={onBack} aria-label="Back to conversations">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4 scrollbar-thin">
        {messages.map((m) => {
          const isYou = m.isOwn;
          return (
            <div key={m.id} className={cn("flex", isYou ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[75%] space-y-1", isYou && "items-end")}>
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                    isYou
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent text-accent-foreground"
                  )}
                >
                  {m.text}
                </div>
                <div className={cn("flex items-center gap-1.5 text-[10px] text-muted-foreground", isYou && "justify-end")}>
                  <span>{formatRelativeTime(m.sentAt)}</span>
                  {isYou && (
                    <span className="text-xs">
                      {m.isRead ? "✓✓ Seen" : m.isDelivered ? "✓✓" : "✓"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-border bg-background/95 p-3 shadow-sm">
        <Input
          placeholder="Type a message…"
          value={draft}
          onChange={handleTyping}
          onBlur={handleBlur}
          disabled={sending}
          className="border-border/50 focus:border-primary"
        />
        <Button type="submit" size="icon" disabled={!draft.trim() || sending} aria-label="Send" className="bg-primary text-primary-foreground hover:bg-primary/90">
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
}
