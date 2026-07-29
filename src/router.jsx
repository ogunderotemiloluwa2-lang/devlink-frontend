import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/contexts/AuthContext";

import Landing from "@/pages/landing";
import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";
import Dashboard from "@/pages/dashboard";
import Feed from "@/pages/feed";
import Profile from "@/pages/profile";
import Messages from "@/pages/messages";
import AIHub from "@/pages/ai-hub";
import CollaborationHub from "@/pages/collaboration-hub";
import CommunityList from "@/pages/community";
import CommunityDetail from "@/pages/community-detail";
import Settings from "@/pages/settings";
import SettingsProfile from "@/pages/settings/SettingsProfile";
import SettingsAccount from "@/pages/settings/SettingsAccount";
import SettingsNotifications from "@/pages/settings/SettingsNotifications";
import SettingsAppearance from "@/pages/settings/SettingsAppearance";
import NotFound from "@/pages/not-found";

function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

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
    return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />;
  }

  return children;
}

function PublicOnly({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return children;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/sign-in"
        element={
          <PublicOnly>
            <SignIn />
          </PublicOnly>
        }
      />
      <Route
        path="/sign-up"
        element={
          <PublicOnly>
            <SignUp />
          </PublicOnly>
        }
      />

      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/ai-hub" element={<AIHub />} />
        <Route path="/collaboration-hub" element={<CollaborationHub />} />
        <Route path="/community" element={<CommunityList />} />
        <Route path="/community/:id" element={<CommunityDetail />} />

        <Route path="/settings" element={<Settings />}>
          <Route index element={<Navigate to="/settings/profile" replace />} />
          <Route path="profile" element={<SettingsProfile />} />
          <Route path="account" element={<SettingsAccount />} />
          <Route path="notifications" element={<SettingsNotifications />} />
          <Route path="appearance" element={<SettingsAppearance />} />
        </Route>
      </Route>

      {/* Public profile - accessible without authentication */}
      <Route path="/profile/:username" element={<Profile />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
