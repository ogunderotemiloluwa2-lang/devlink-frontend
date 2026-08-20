import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Users, MessageSquare, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import PostCard from "@/pages/feed/PostCard";
import EmptyState from "@/components/states/EmptyState";
import BackButton from "@/components/layout/BackButton";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/components/ui/toast";
import { adaptPost } from "@/lib/utils";
import api from "@/lib/api";

export default function CommunityDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const { data: communityData, loading: communityLoading, error: communityError } = useApi(`/communities/${id}`);
  const { data: postsData, loading: postsLoading, error: postsError } = useApi(`/communities/${id}/posts`);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (communityData?.community) {
      setJoined(communityData.community.isMember || false);
    }
  }, [communityData]);

  const community = communityData?.community;
  const communityPosts = useMemo(() => {
    if (!postsData?.posts) return [];
    return postsData.posts.map(adaptPost).filter(Boolean);
  }, [postsData]);

  const handleJoin = async () => {
    try {
      if (joined) {
        await api.post(`/communities/${id}/leave`);
        setJoined(false);
        toast({ title: "Left", description: "You've left this community." });
      } else {
        await api.post(`/communities/${id}/join`);
        setJoined(true);
        toast({ title: "Joined", description: "You've joined this community." });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Could not update membership.",
        variant: "destructive",
      });
    }
  };

  if (communityLoading) {
    return (
      <div className="container max-w-4xl space-y-6 py-8">
        <BackButton href="/community" className="mb-4" />
        <div className="h-6 w-48 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (communityError || !community) {
    return (
      <div className="container max-w-4xl py-16">
        <EmptyState
          icon={Globe2}
          title="Community not found"
          description="This community may have been removed or the link is incorrect."
          action={
            <Button variant="outline" size="sm" asChild>
              <Link to="/community">Back to communities</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl space-y-6 py-8">
      <BackButton href="/community" className="mb-4" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Globe2 className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">{community.name}</h1>
          </div>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">{community.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {community.topics.map((t) => (
              <Badge key={t} variant="mono">
                #{t}
              </Badge>
            ))}
          </div>
        </div>
        <Button variant={joined ? "outline" : "default"} onClick={handleJoin} className="shrink-0">
          {joined ? "Joined" : "Join community"}
        </Button>
      </div>

      <div className="flex items-center gap-5 border-y border-border py-3 text-sm">
        <span className="flex items-center gap-1.5">
          <Users className="h-4 w-4 text-muted-foreground" />
          <strong className="font-semibold">{community.membersCount?.toLocaleString() || 0}</strong>
          <span className="text-muted-foreground">members</span>
        </span>
        <span className="flex items-center gap-1.5">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <strong className="font-semibold">{community.postsCount?.toLocaleString() || 0}</strong>
          <span className="text-muted-foreground">posts</span>
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-sm font-medium text-muted-foreground">Recent posts</h2>
          {postsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : postsError ? (
            <EmptyState
              icon={MessageSquare}
              title="Could not load posts"
              description="There was an error loading community posts."
            />
          ) : communityPosts.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No posts yet"
              description="Be the first to share something in this community."
            />
          ) : (
            communityPosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>

        <div>
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">Rules</h2>
          <ul className="space-y-2 text-sm">
            {community.rules?.map((rule, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-muted-foreground">{i + 1}.</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
