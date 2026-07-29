import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api, { setAccessToken as setApiAccessToken } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearAuth = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setApiAccessToken(null);
  }, []);

  // On mount: try to refresh the access token from the httpOnly refresh cookie
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const res = await api.post("/auth/refresh");
        if (!cancelled) {
          setAccessToken(res.data.accessToken);
          setApiAccessToken(res.data.accessToken);
          // Fetch the current user
          const meRes = await api.get("/auth/me");
          setUser(meRes.data.user);
        }
      } catch (err) {
        // Not authenticated — that's fine for public pages
        if (!cancelled) clearAuth();
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [clearAuth]);

  const login = async (identifier, password) => {
    const res = await api.post("/auth/login", { identifier, password });
    setAccessToken(res.data.accessToken);
    setApiAccessToken(res.data.accessToken);
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (name, username, email, password) => {
    const res = await api.post("/auth/register", { name, username, email, password });
    setAccessToken(res.data.accessToken);
    setApiAccessToken(res.data.accessToken);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      // Ignore errors on logout
    }
    clearAuth();
  };

  const refreshUser = useCallback(async () => {
    try {
      const meRes = await api.get("/auth/me");
      setUser(meRes.data.user);
      return meRes.data.user;
    } catch (err) {
      return null;
    }
  }, []);

  const value = {
    user,
    accessToken,
    loading,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-2 text-sm text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return children; // Let the router handle redirect
  }
  return children;
}
