import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Repeat2, Share, FolderGit2, Bookmark, Code, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import api from "@/lib/api";

export default function PostCard({ post }) {
  // Adapted backend data: author as username string, with authorName/authorAvatar
  const author = {
    username: post.author || "unknown",
    name: post.authorName || post.author || "Unknown",
    avatarUrl: post.authorAvatar || null,
  };
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [bookmarked, setBookmarked] = useState(post.isBookmarked || false);
  const [votedOption, setVotedOption] = useState(null);
  const { toast } = useToast();

  const toggleLike = async () => {
    try {
      const res = await api.post(`/posts/${post.id}/like`);
      setLiked(res.data.liked);
      setLikeCount((prev) => (res.data.liked ? prev + 1 : Math.max(prev - 1, 0)));
    } catch (err) {
      toast({ title: "Error", description: "Could not update like.", variant: "destructive" });
    }
  };

  const toggleBookmark = async () => {
    try {
      const res = await api.post(`/posts/${post.id}/bookmark`);
      setBookmarked(res.data.bookmarked);
    } catch (err) {
      toast({ title: "Error", description: "Could not update bookmark.", variant: "destructive" });
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/feed`;
    const shareData = { title: "DevLink post", text: post.content || "Check out this post on DevLink", url };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: "Link copied", description: "Post link copied to clipboard." });
      }
    } catch (err) {
      // User cancelled share — ignore
    }
  };

  const poll = post.poll;
  const totalVotes = poll ? poll.totalVotes + (votedOption !== null ? 1 : 0) : 0;

  const typeIcons = {
    "project-update": FolderGit2,
    code: Code,
    poll: BarChart3,
  };
  const TypeIcon = typeIcons[post.type] || null;

  return (
    <Card className="group card-hover">
      <CardContent className="p-5">
        <div className="flex gap-3">
          <Link to={`/profile/${author.username}`} className="shrink-0">
            <UserAvatar username={author.username} displayName={author.name} className="h-9 w-9" />
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm">
              <Link to={`/profile/${author.username}`} className="font-medium hover:underline">
                {author.name}
              </Link>
              <span className="text-muted-foreground">@{author.username}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{formatRelativeTime(post.createdAt)}</span>
              {post.type === "project-update" && (
                <Badge variant="secondary" className="ml-1 gap-1">
                  <FolderGit2 className="h-3 w-3" /> Project update
                </Badge>
              )}
              {post.type === "code" && (
                <Badge variant="secondary" className="ml-1 gap-1">
                  <Code className="h-3 w-3" /> Code
                </Badge>
              )}
              {post.type === "poll" && (
                <Badge variant="secondary" className="ml-1 gap-1">
                  <BarChart3 className="h-3 w-3" /> Poll
                </Badge>
              )}
            </div>

            <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-foreground/90 group-hover:text-foreground/100">{post.content}</p>

            {poll && (
              <div className="mt-3 space-y-1.5">
                {poll.options.map((opt) => {
                  const optVotes = opt.votes + (votedOption === opt.label ? 1 : 0);
                  const pct = totalVotes ? Math.round((optVotes / totalVotes) * 100) : 0;
                  const isSelected = votedOption === opt.label;
                  return (
                    <button
                      key={opt.label}
                      onClick={() => setVotedOption(opt.label)}
                      disabled={votedOption !== null}
                      className={cn(
                        "relative w-full overflow-hidden rounded-md border border-border px-3 py-2 text-left text-sm transition-colors",
                        votedOption === null && "hover:border-primary/50",
                        isSelected && "border-primary"
                      )}
                    >
                      <div
                        className="absolute inset-y-0 left-0 bg-primary/10 transition-all"
                        style={{ width: `${votedOption !== null ? pct : 0}%` }}
                      />
                      <div className="relative flex items-center justify-between">
                        <span>{opt.label}</span>
                        {votedOption !== null && (
                          <span className="text-xs text-muted-foreground">{pct}%</span>
                        )}
                      </div>
                    </button>
                  );
                })}
                <p className="text-xs text-muted-foreground">{totalVotes.toLocaleString()} votes</p>
              </div>
            )}

            {post.tags?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="mono">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="mt-3 flex items-center gap-5 text-muted-foreground">
              <button
                onClick={toggleLike}
                className={cn("flex items-center gap-1.5 text-xs transition-colors hover:text-destructive", liked && "text-destructive")}
              >
                <Heart className={cn("h-3.5 w-3.5", liked && "fill-current")} />
                {likeCount.toLocaleString()}
              </button>
              <span className="flex items-center gap-1.5 text-xs">
                <MessageCircle className="h-3.5 w-3.5" />
                {post.comments.toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5 text-xs">
                <Repeat2 className="h-3.5 w-3.5" />
                {post.reposts.toLocaleString()}
              </span>
              <button
                onClick={handleShare}
                className="ml-auto flex items-center gap-1.5 text-xs hover:text-foreground"
                aria-label="Share post"
              >
                <Share className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={toggleBookmark}
                className={cn("flex items-center gap-1.5 text-xs transition-colors hover:text-primary", bookmarked && "text-primary")}
              >
                <Bookmark className={cn("h-3.5 w-3.5", bookmarked && "fill-current")} />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
