import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Users, MapPin, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/states/EmptyState";
import { useUsers } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/toast";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

export default function Discover() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [followStates, setFollowStates] = useState({});
  const [followersCounts, setFollowersCounts] = useState({});

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { users, loading, error, hasMore, loadMore, refresh } = useUsers(
    debouncedQuery ? { q: debouncedQuery } : {}
  );

  // Infinite scroll
  const observer = useRef();
  const lastUserRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMore]
  );

  // Initialize follow states from user data
  useEffect(() => {
    const initialStates = {};
    const initialCounts = {};
    users.forEach((u) => {
      const username = u.username || "";
      initialStates[username] = u.isFollowing || false;
      initialCounts[username] = u.followersCount || 0;
    });
    setFollowStates((prev) => ({ ...prev, ...initialStates }));
    setFollowersCounts((prev) => ({ ...prev, ...initialCounts }));
  }, [users]);

  const toggleFollow = async (username) => {
    try {
      await api.post(`/follow/${username}`);
      setFollowStates((prev) => ({ ...prev, [username]: !prev[username] }));
      setFollowersCounts((prev) => ({
        ...prev,
        [username]: prev[username] + (followStates[username] ? -1 : 1),
      }));
    } catch (err) {
      toast({ title: "Error", description: "Could not update follow status.", variant: "destructive" });
    }
  };

  const handleMessage = async (username) => {
    try {
      const res = await api.post("/conversations", { participantUsername: username });
      const conversationId = res.data.conversation._id;
      navigate(`/messages?c=${conversationId}`);
    } catch (err) {
      toast({ title: "Error", description: "Could not start conversation.", variant: "destructive" });
    }
  };

  if (error && users.length === 0) {
    return (
      <div className="container max-w-6xl py-8">
        <EmptyState
          icon={Users}
          title="Something went wrong"
          description="Could not load users. Please try again."
          action={
            <Button variant="outline" size="sm" onClick={refresh}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="container max-w-6xl space-y-6 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Discover People</h1>
        <p className="text-sm text-muted-foreground">
          Find developers, follow them, and start conversations. Scroll to load more.
        </p>
      </div>

      {/* Search bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by name or username…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Results count */}
      {!loading && users.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {users.length} {users.length === 1 ? "person" : "people"} found
        </p>
      )}

      {/* User grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((u, index) => {
          const isLast = index === users.length - 1;
          const username = u.username || "";
          const isFollowing = followStates[username] || false;
          const displayName = u.name || username;
          const headline = u.headline || u.role || "";

          return (
            <Card
              key={username || u._id}
              ref={isLast ? lastUserRef : null}
              className="group card-hover"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Link to={`/profile/${username}`} className="flex items-center gap-3">
                    <UserAvatar username={username} displayName={displayName} className="h-12 w-12" />
                    <div>
                      <p className="font-semibold">{displayName}</p>
                      <p className="text-sm text-muted-foreground">@{username}</p>
                      {headline && <p className="text-xs text-muted-foreground">{headline}</p>}
                    </div>
                  </Link>
                  {u.openToWork && (
                    <Badge variant="success" className="text-xs">
                      Open to work
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Location */}
                {u.location && (
                  <div className="mb-3 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {u.location}
                  </div>
                )}

                {/* Stats */}
                <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{followersCounts[username] || u.followersCount || 0} followers</span>
                  <span>{u.followingCount || 0} following</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant={isFollowing ? "outline" : "default"}
                    size="sm"
                    className="flex-1"
                    onClick={() => toggleFollow(username)}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleMessage(username)}
                  >
                    <MessageCircle className="mr-1 h-3 w-3" /> Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Loading skeletons */}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={`skeleton-${i}`} className="card-hover">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-16" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="mb-3 flex flex-wrap gap-1">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-5 w-10" />
                </div>
                <Skeleton className="mb-4 h-3 w-20" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* End of results */}
      {!loading && !hasMore && users.length > 0 && (
        <p className="text-center text-sm text-muted-foreground py-4">
          You've seen all users.
        </p>
      )}

      {/* No results */}
      {!loading && users.length === 0 && debouncedQuery && (
        <EmptyState
          icon={Users}
          title="No users found"
          description={`No developers match "${debouncedQuery}". Try a different search.`}
          action={
            <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
              Clear search
            </Button>
          }
        />
      )}
    </div>
  );
}
