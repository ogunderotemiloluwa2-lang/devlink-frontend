import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date to a relative time string (e.g. "2h ago", "3d ago").
 */
export function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

/**
 * Adapter: convert a backend Post document to the shape the frontend components expect.
 * Backend shape: { _id, author: { _id, name, username, avatarUrl }, type, content,
 *   hashtags, likesCount, commentsCount, sharesCount, createdAt, media, poll, ... }
 * Frontend shape: { id, author: "username", type, content, tags, likes, comments,
 *   reposts, createdAt, ... }
 */
export function adaptPost(post) {
  if (!post) return null;

  const author = typeof post.author === "object" && post.author
    ? post.author
    : { username: post.author || "unknown", name: post.author || "Unknown" };

  return {
    id: post._id || post.id,
    author: author.username || author,
    authorName: author.name || author.username || "Unknown",
    authorAvatar: author.avatarUrl || null,
    type: post.type || "text",
    content: post.content || "",
    tags: post.hashtags || [],
    likes: post.likesCount || 0,
    comments: post.commentsCount || 0,
    reposts: post.sharesCount || 0,
    createdAt: post.createdAt || post.created_at,
    isLiked: post.isLiked || false,
    isBookmarked: post.isBookmarked || false,
    media: post.media || [],
    poll: post.poll
      ? {
          options: (post.poll.options || []).map((opt) => ({
            label: opt.text || opt.label,
            votes: opt.votes || 0,
          })),
          totalVotes: (post.poll.options || []).reduce((sum, opt) => sum + (opt.votes || 0), 0),
        }
      : null,
    codeSnippet: post.codeSnippet || null,
    link: post.link || null,
    project: post.project
      ? typeof post.project === "object"
        ? post.project.slug
        : post.project
      : null,
  };
}

/**
 * Adapter: convert a backend Profile document to the frontend profile shape.
 */
export function adaptProfile(profileData) {
  if (!profileData) return null;

  // The backend returns { profile: {...}, isPrivate, isFollowing } or just the profile object
  const profile = profileData.profile || profileData;

  return {
    username: profile.username || "unknown",
    name: profile.name || profile.username || "Unknown",
    headline: profile.headline || "",
    role: profile.role || "Developer",
    company: profile.company || "",
    location: profile.location || "",
    bio: profile.bio || "",
    about: profile.about || "",
    avatarUrl: profile.avatarUrl || null,
    coverImageUrl: profile.coverImageUrl || null,
    stack: profile.stack || profile.skills?.map((s) => s.name) || [],
    skills: profile.skills || [],
    followers: profile.followersCount || 0,
    following: profile.followingCount || 0,
    joined: profile.joined || profile.createdAt,
    github: profile.links?.github || "",
    website: profile.links?.website || "",
    pinnedRepo: profile.pinnedRepo || "",
    openToWork: profile.openToWork || false,
    openToCollab: profile.openToCollab || false,
    isOwner: profile.isOwner || false,
    isFollowing: profile.isFollowing || false,
    experience: profile.experience || null,
    links: profile.links || {},
  };
}
