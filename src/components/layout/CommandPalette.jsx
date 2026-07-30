import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Rss,
  MessageSquare,
  Sparkles,
  Users2,
  Globe2,
  Settings,
  User as UserIcon,
  Search,
  Loader2,
} from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import api from "@/lib/api";

const pages = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Feed", to: "/feed", icon: Rss },
  { label: "Messages", to: "/messages", icon: MessageSquare },
  { label: "AI Hub", to: "/ai-hub", icon: Sparkles },
  { label: "Collaboration Hub", to: "/collaboration-hub", icon: Users2 },
  { label: "Community", to: "/community", icon: Globe2 },
  { label: "Discover", to: "/discover", icon: Users2 },
  { label: "Settings", to: "/settings/profile", icon: Settings },
];

export default function CommandPalette({ open, onOpenChange }) {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        setSearchLoading(true);
        api
          .get(`/search?q=${encodeURIComponent(searchQuery.trim())}&limit=5`)
          .then((res) => {
            setSearchResults(res.data);
            setSearchLoading(false);
          })
          .catch(() => {
            setSearchResults(null);
            setSearchLoading(false);
          });
      } else {
        setSearchResults(null);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const go = (to) => {
    onOpenChange(false);
    navigate(to);
  };

  const handleSearchInput = (value) => {
    setSearchQuery(value);
  };

  const developers = searchResults?.developers || [];

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search DevLink…"
        onValueChange={handleSearchInput}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          {pages.map((p) => (
            <CommandItem key={p.to} onSelect={() => go(p.to)}>
              <p.icon className="h-4 w-4 text-muted-foreground" />
              {p.label}
            </CommandItem>
          ))}
        </CommandGroup>
        {searchQuery.trim().length >= 2 && (
          <>
            {searchLoading ? (
              <CommandGroup heading="People">
                <CommandItem disabled>
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  Searching…
                </CommandItem>
              </CommandGroup>
            ) : developers.length > 0 ? (
              <CommandGroup heading="People">
                {developers.map((p) => (
                  <CommandItem
                    key={p.username}
                    onSelect={() => go(`/profile/${p.username}`)}
                  >
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    {p.name}
                    <span className="ml-auto text-xs text-muted-foreground">@{p.username}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
