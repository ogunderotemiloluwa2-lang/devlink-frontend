import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

/**
 * Generic fetch hook for GET requests with loading/error state.
 * @param {string} url - The API endpoint
 * @param {object} options - { immediate, deps }
 */
export function useApi(url, { immediate = true, deps = [] } = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(immediate);

  const fetchData = useCallback(async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(url);
      setData(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, ...deps]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate]);

  return { data, error, loading, refetch: fetchData };
}

/**
 * Fetch the current user's own profile + user data.
 */
export function useMyProfile() {
  return useApi("/profiles/me");
}

/**
 * Fetch a public profile by username.
 */
export function useProfile(username) {
  return useApi(username ? `/profiles/${username}` : null, {
    deps: [username],
  });
}

/**
 * Fetch the feed (posts from followed users + own posts).
 * @param {string|null} cursor - Cursor for pagination
 */
export function useFeed(cursor = null) {
  const [posts, setPosts] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFeed = useCallback(async (reset = false) => {
    if (!hasMore && !reset) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("mode", "following");
      if (cursor && !reset) params.set("cursor", cursor);
      const res = await api.get(`/posts/feed?${params.toString()}`);
      const { posts: newPosts, nextCursor: nc, hasMore: hm } = res.data;
      if (reset) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }
      setNextCursor(nc);
      setHasMore(hm);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [cursor, hasMore]);

  const loadMore = useCallback(() => {
    if (nextCursor) {
      fetchFeed();
    }
  }, [nextCursor, fetchFeed]);

  const refresh = useCallback(() => {
    setPosts([]);
    setNextCursor(null);
    setHasMore(true);
    fetchFeed(true);
  }, [fetchFeed]);

  useEffect(() => {
    fetchFeed(true);
  }, [fetchFeed]);

  return { posts, loading, error, hasMore, loadMore, refresh };
}

/**
 * Fetch trending posts.
 */
export function useTrendingPosts(window = 7) {
  return useApi(`/posts/trending?window=${window}`, { deps: [window] });
}

/**
 * Fetch conversations for the current user.
 */
export function useConversations() {
  return useApi("/conversations");
}

/**
 * Fetch messages for a conversation.
 */
export function useMessages(conversationId) {
  return useApi(
    conversationId ? `/conversations/${conversationId}/messages` : null,
    { deps: [conversationId] }
  );
}

/**
 * Fetch AI tools with optional filtering.
 */
export function useAITools(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  return useApi(`/ai-tools${queryString ? `?${queryString}` : ""}`, {
    deps: [JSON.stringify(params)],
  });
}

/**
 * Fetch communities with optional filtering.
 */
export function useCommunities(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  return useApi(`/communities${queryString ? `?${queryString}` : ""}`, {
    deps: [JSON.stringify(params)],
  });
}

/**
 * Fetch projects with optional filtering.
 */
export function useProjects(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  return useApi(`/projects${queryString ? `?${queryString}` : ""}`, {
    deps: [JSON.stringify(params)],
  });
}

/**
 * Fetch notifications for the current user.
 */
export function useNotifications(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  return useApi(`/notifications${queryString ? `?${queryString}` : ""}`, {
    deps: [JSON.stringify(params)],
  });
}

/**
 * Fetch skill metadata (levels and categories).
 */
export function useSkillMeta() {
  return useApi("/skills/meta");
}

/**
 * Fetch skill catalog for autocomplete.
 */
export function useSkillCatalog(query) {
  return useApi(query ? `/skills/catalog?q=${encodeURIComponent(query)}` : null, {
    deps: [query],
  });
}

/**
 * Fetch suggested developers to follow.
 */
export function useFollowSuggestions(limit = 10) {
  return useApi(`/follow/suggestions?limit=${limit}`);
}

/**
 * Fetch user's skills.
 */
export function useMySkills() {
  return useApi("/skills");
}

/**
 * Fetch user's bookmarks.
 */
export function useBookmarks(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  return useApi(`/bookmarks${queryString ? `?${queryString}` : ""}`, {
    deps: [JSON.stringify(params)],
  });
}

/**
 * Global search.
 */
export function useSearch(query, options = {}) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (q) => {
    if (!q) {
      setResults(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ q, ...options });
      const res = await api.get(`/search?${params.toString()}`);
      setResults(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(options)]);

  return { results, loading, error, search };
}
