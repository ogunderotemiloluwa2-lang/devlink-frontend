import { Link } from "react-router-dom";
import { Rss, FolderGit2, Activity } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import PostCard from "@/pages/feed/PostCard";
import ProjectCard from "@/pages/collaboration-hub/ProjectCard";
import EmptyState from "@/components/states/EmptyState";
import { useApi } from "@/hooks/useApi";
import { adaptPost, formatRelativeTime } from "@/lib/utils";

export default function ProfileTabs({ profile }) {
  // Fetch posts by this author using the search endpoint
  const { data: searchResults, loading: postsLoading } = useApi(
    `/search?q=${encodeURIComponent(profile.username)}&type=posts`,
    { deps: [profile.username] }
  );

  const authorPosts = (searchResults?.posts || []).map(adaptPost);
  const ownedProjects = [];

  const activity = [
    { id: "a1", text: `Pushed commits to ${profile.pinnedRepo || "their repo"}`, time: new Date().toISOString() },
    { id: "a2", text: "Joined the Frontend Craft community", time: "2026-07-18T14:00:00Z" },
  ];

  return (
    <div className="container max-w-4xl py-6">
      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts" className="gap-1.5">
            <Rss className="h-3.5 w-3.5" /> Posts
          </TabsTrigger>
          <TabsTrigger value="projects" className="gap-1.5">
            <FolderGit2 className="h-3.5 w-3.5" /> Projects
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-1.5">
            <Activity className="h-3.5 w-3.5" /> Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          {postsLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 animate-pulse rounded-md bg-muted" />
              ))}
            </div>
          ) : authorPosts.length === 0 ? (
            <EmptyState icon={Rss} title="No posts yet" description={`${profile.name} hasn't posted anything yet.`} />
          ) : (
            authorPosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </TabsContent>

        <TabsContent value="projects" className="grid gap-4 sm:grid-cols-2">
          {ownedProjects.length === 0 ? (
            <EmptyState
              icon={FolderGit2}
              title="No public projects"
              description={`${profile.name} isn't looking for collaborators right now.`}
              className="sm:col-span-2"
            />
          ) : (
            ownedProjects.map((proj) => <ProjectCard key={proj.id} project={proj} />)
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-3">
          {activity.map((a) => (
            <div key={a.id} className="flex items-center justify-between border-b border-border pb-3 text-sm last:border-0">
              <span className="text-foreground/90">{a.text}</span>
              <span className="shrink-0 text-xs text-muted-foreground">{formatRelativeTime(a.time)}</span>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
