import { useEffect, useState } from "react";
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
} from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { profiles, communities, aiTools } from "@/lib/demo-data";

const pages = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Feed", to: "/feed", icon: Rss },
  { label: "Messages", to: "/messages", icon: MessageSquare },
  { label: "AI Hub", to: "/ai-hub", icon: Sparkles },
  { label: "Collaboration Hub", to: "/collaboration-hub", icon: Users2 },
  { label: "Community", to: "/community", icon: Globe2 },
  { label: "Settings", to: "/settings/profile", icon: Settings },
];

export default function CommandPalette({ open, onOpenChange }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onOpenChange]);

  const go = (to) => {
    onOpenChange(false);
    navigate(to);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search DevLink…" />
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
        <CommandGroup heading="People">
          {profiles.slice(0, 6).map((p) => (
            <CommandItem key={p.username} onSelect={() => go(`/profile/${p.username}`)}>
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              {p.name}
              <span className="ml-auto text-xs text-muted-foreground">@{p.username}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Communities">
          {communities.slice(0, 4).map((c) => (
            <CommandItem key={c.id} onSelect={() => go(`/community/${c.slug}`)}>
              <Globe2 className="h-4 w-4 text-muted-foreground" />
              {c.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="AI Tools">
          {aiTools.slice(0, 4).map((t) => (
            <CommandItem key={t.id} onSelect={() => go("/ai-hub")}>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              {t.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
