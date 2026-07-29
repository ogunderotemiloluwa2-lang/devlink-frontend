import { Link } from "react-router-dom";
import { Globe2, Users2, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/states/EmptyState";
import { useCommunities } from "@/hooks/useApi";
import { useMemo } from "react";

/**
 * Adapts a backend community document to the shape expected by the UI.
 * Backend: { _id, name, slug, description, topics, membersCount, postsCount }
 * Frontend: { id, name, slug, description, topics, members, posts }
 */
function adaptCommunity(c) {
  if (!c) return null;
  return {
    id: c._id,
    name: c.name,
    slug: c.slug,
    description: c.description || "",
    topics: c.topics || [],
    members: c.membersCount ?? 0,
    posts: c.postsCount ?? 0,
  };
}

export default function CommunityList() {
  const { data, loading, error, refetch } = useCommunities({ sort: "recent" });

  const communities = useMemo(() => {
    if (!data?.communities) return [];
    return data.communities.map(adaptCommunity).filter(Boolean);
  }, [data]);

  if (loading) {
    return (
      <div className="container max-w-5xl space-y-6 py-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Community</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Focused spaces for the corners of engineering you actually work in.
          </p>
        </div>
        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="card-hover">
              <CardContent className="p-5">
                <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                <div className="mt-1 h-4 w-full animate-pulse rounded bg-muted" />
                <div className="mt-1 h-4 w-5/6 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-5xl space-y-6 py-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Community</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Focused spaces for the corners of engineering you actually work in.
          </p>
        </div>
        <EmptyState icon={Globe2} title="Something went wrong" description="Could not load communities." />
        <Button onClick={refetch} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl space-y-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Community</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Focused spaces for the corners of engineering you actually work in.
        </p>
      </div>

      {communities.length === 0 ? (
        <EmptyState icon={Globe2} title="No communities yet" description="Check back soon." />
      ) : (
        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          {communities.map((c) => (
            <Card key={c.id} className="card-hover">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <Link to={`/community/${c.slug}`} className="font-medium hover:underline">
                    {c.name}
                  </Link>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.topics.map((t) => (
                    <Badge key={t} variant="mono">
                      #{t}
                    </Badge>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users2 className="h-3 w-3" /> {c.members.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" /> {c.posts.toLocaleString()}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/community/${c.slug}`}>View</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
