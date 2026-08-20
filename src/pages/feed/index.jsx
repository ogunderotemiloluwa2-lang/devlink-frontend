import { useState, useEffect, useCallback } from "react";
import { Rss } from "lucide-react";
import PostCard from "./PostCard";
import PostComposer from "./PostComposer";
import EmptyState from "@/components/states/EmptyState";
import ListSkeleton from "@/components/states/ListSkeleton";
import { useFeed, useMyProfile } from "@/hooks/useApi";
import { adaptPost } from "@/lib/utils";

export default function Feed() {
  const { posts, loading, error, hasMore, loadMore, refresh } = useFeed();
  const { data: myProfile } = useMyProfile();
  const [localPosts, setLocalPosts] = useState([]);

  // Adapt backend posts to frontend shape
  const adaptedPosts = posts.map(adaptPost);

  const handleNewPost = (post) => {
    // Optimistically add the post locally
    if (myProfile?.user && post) {
      const optimisticPost = {
        id: `local-${Date.now()}`,
        author: myProfile.user.username,
        authorName: myProfile.user.name,
        type: post.type || "text",
        content: post.content || "",
        tags: post.hashtags || [],
        likes: 0,
        comments: 0,
        reposts: 0,
        createdAt: new Date().toISOString(),
        isLiked: false,
        isBookmarked: false,
      };
      setLocalPosts((prev) => [optimisticPost, ...prev]);
    }
  };

  // Show local posts first, then backend posts (excluding any that match local)
  const displayPosts = [...localPosts, ...adaptedPosts.filter((p) => !localPosts.some((lp) => lp.id === p.id))];

  if (error) {
    return (
      <div className="container max-w-2xl space-y-4 py-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Feed</h1>
          <p className="mt-1 text-sm text-muted-foreground">Updates from developers you follow.</p>
        </div>
        <EmptyState
          icon={Rss}
          title="Something went wrong"
          description={error.message || "Could not load your feed. Try refreshing."}
          action={
            <button onClick={refresh} className="text-sm text-primary hover:underline">
              Retry
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl space-y-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Feed</h1>
        <p className="mt-1 text-sm text-muted-foreground">Updates from developers you follow.</p>
      </div>

      <PostComposer onPost={handleNewPost} currentUser={myProfile?.user} />

      {loading && adaptedPosts.length === 0 ? (
        <ListSkeleton rows={5} />
      ) : displayPosts.length === 0 ? (
        <EmptyState
          icon={Rss}
          title="Your feed is empty"
          description="Follow developers or join a community to start seeing posts here."
        />
      ) : (
        <div className="space-y-4">
          {displayPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {hasMore && !loading && (
        <button
          onClick={loadMore}
          className="w-full rounded-md border border-border px-4 py-2 text-center text-sm font-medium transition-all hover:bg-secondary hover:shadow-sm"
        >
          Load more
        </button>
      )}
    </div>
  );
}
