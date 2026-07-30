import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const ConversationsContext = createContext(null);

export function ConversationsProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const fetchedRef = useRef(false);

  const fetchConversations = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/conversations");
      const convs = res.data?.conversations || [];
      setConversations(convs);
      const total = convs.reduce((sum, c) => {
        const p = c.participants?.find(
          (p) => p.user?._id === user?._id || p.user === user?._id
        );
        return sum + (p?.unreadCount || 0);
      }, 0);
      setUnreadCount(total);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Fetch conversations once when the user is authenticated
  useEffect(() => {
    if (isAuthenticated && user && !fetchedRef.current) {
      fetchedRef.current = true;
      fetchConversations();
    }
  }, [isAuthenticated, user, fetchConversations]);

  // Reset fetchedRef when user changes (logout/login)
  useEffect(() => {
    if (!isAuthenticated) {
      fetchedRef.current = false;
      setConversations([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated]);

  const markAllRead = useCallback(async () => {
    if (!conversations.length) return;
    try {
      await Promise.all(
        conversations.map((c) => api.post(`/conversations/${c._id}/read`))
      );
      setConversations((prev) =>
        prev.map((c) => ({
          ...c,
          unreadCount: 0,
          participants: c.participants?.map((p) =>
            p.user?._id === user?._id || p.user === user?._id
              ? { ...p, unreadCount: 0 }
              : p
          ),
        }))
      );
      setUnreadCount(0);
    } catch (err) {
      // Ignore errors
    }
  }, [conversations, user]);

  const value = {
    conversations,
    loading,
    error,
    unreadCount,
    refetch: fetchConversations,
    markAllRead,
  };

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  );
}

export function useConversations() {
  const context = useContext(ConversationsContext);
  if (!context) {
    throw new Error("useConversations must be used within a ConversationsProvider");
  }
  return context;
}
