import { Link } from "react-router-dom";
import { ArrowUpRight, Users, Star, MessageCircle, Sparkles, Rss, GitFork, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/avatar";
import EmptyState from "@/components/states/EmptyState";
import { useMyProfile, useFeed, useAITools, useFollowSuggestions, useProjects } from "@/hooks/useApi";
import { adaptPost, formatRelativeTime } from "@/lib/utils";

export default function Dashboard() {
  const { data: myProfile, loading: profileLoading } = useMyProfile();
  const { posts: feedPosts, loading: feedLoading } = useFeed();
  const { data: aiToolsData, loading: toolsLoading } = useAITools({ featured: true });
  const { data: projectsData, loading: projectsLoading } = useProjects({ status: "active", visibility: "public" });
  const { data: suggestionsData, loading: suggestionsLoading } = useFollowSuggestions(4);

  const user = myProfile?.user;
  const profile = myProfile?.profile;
  const statsData = myProfile?.stats;

  const recentPosts = feedPosts?.slice(0, 3).map(adaptPost) || [];
  const suggestedCollaborators = suggestionsData?.users || [];
  const trendingTools = aiToolsData?.tools?.slice().sort((a, b) => b.rating - a.rating).slice(0, 3) || [];
  const trendingProjects = projectsData?.projects?.slice().sort((a, b) => (b.starsCount || 0) - (a.starsCount || 0)).slice(0, 3) || [];

  const stats = [
    { label: "Followers", value: profile?.followersCount || 0, icon: Users, trend: "+12 this week" },
    { label: "Profile views (7d)", value: profile?.profileViews || 0, icon: ArrowUpRight, trend: "+8% from last week" },
    { label: "Post likes (7d)", value: statsData?.totalPostLikes || 0, icon: Star, trend: "+21% from last week" },
  ];

  const displayName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="container max-w-6xl space-y-8 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back, {displayName}</h1>
        <p className="text-sm text-muted-foreground">Here's what's happening across your network today.</p>
      </div>

      <div className="grid min-w-0 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="group card-hover">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">{s.value.toLocaleString()}</p>
                <p className="mt-0.5 text-xs text-muted-foreground/70">{s.trend}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 transition-colors group-hover:bg-primary/20">
                <s.icon className="h-4 w-4 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid min-w-0 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-base">
              <Rss className="h-4 w-4" /> Recent activity
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/feed">View feed</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {feedLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-md bg-muted" />
                ))}
              </div>
            ) : recentPosts.length === 0 ? (
              <EmptyState title="No recent activity" description="Posts from your network will show up here." />
            ) : (
              recentPosts.map((post) => (
                <div key={post.id} className="group flex gap-3 border-b border-border pb-4 last:border-0 last:pb-0">
                  <UserAvatar username={post.author} displayName={post.authorName} className="h-8 w-8" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Link to={`/profile/${post.author}`} className="font-medium hover:underline">
                        {post.authorName}
                      </Link>
                      <span className="text-xs text-muted-foreground">{formatRelativeTime(post.createdAt)}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-foreground/90 group-hover:text-foreground/100">{post.content}</p>
                  </div>
                  <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground/50 group-hover:text-muted-foreground transition-opacity" />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" /> Suggested collaborators
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestionsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-14 animate-pulse rounded-md bg-muted" />
                ))}
              </div>
            ) : suggestedCollaborators.length === 0 ? (
              <EmptyState title="No suggestions" description="We'll show people to follow here." />
            ) : (
              suggestedCollaborators.map((p) => (
                <div key={p.username} className="group flex items-center gap-3">
                  <UserAvatar username={p.username} displayName={p.name} className="h-8 w-8" />
                  <div className="min-w-0 flex-1">
                    <Link to={`/profile/${p.username}`} className="block truncate text-sm font-medium hover:underline">
                      {p.name}
                    </Link>
                    <p className="truncate text-xs text-muted-foreground">{p.headline || p.role}</p>
                  </div>
                  <Button variant="outline" size="sm" className="group-hover:border-primary/50">
                    Follow
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-base">
              <GitFork className="h-4 w-4" /> Projects looking for help
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/collaboration-hub">Browse all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {projectsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-md bg-muted" />
                ))}
              </div>
            ) : trendingProjects.length === 0 ? (
              <EmptyState title="No projects found" description="No projects are currently looking for help." />
            ) : (
              trendingProjects.map((project) => (
                <div key={project._id || project.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="min-w-0 truncate font-mono text-sm font-medium">{project.name}</p>
                    <Badge variant="secondary" className="shrink-0">{project.visibility}</Badge>
                  </div>
                  <p className="mt-1 truncate text-sm text-muted-foreground">{project.tagline}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4" /> Trending AI tools
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/ai-hub">Explore</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {toolsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 animate-pulse rounded-md bg-muted" />
                ))}
              </div>
            ) : trendingTools.length === 0 ? (
              <EmptyState title="No tools found" description="No trending AI tools right now." />
            ) : (
              trendingTools.map((tool) => (
                <div key={tool._id || tool.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{tool.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{tool.tagline}</p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    ★ {tool.rating}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
