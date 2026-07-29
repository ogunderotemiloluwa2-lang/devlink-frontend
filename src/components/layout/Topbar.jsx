import { Search, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import NotificationsPopover from "./NotificationsPopover";
import BackButton from "./BackButton";
import { useAuth } from "@/contexts/AuthContext";

export default function Topbar({ onOpenCommandPalette, onOpenMobileNav, showBackButton }) {
  const isMac =
    typeof navigator !== "undefined" && navigator.platform.toUpperCase().includes("MAC");
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/80 px-3 backdrop-blur sm:px-4">
      {/* Mobile: hamburger menu (always first) */}
      <Button variant="ghost" size="icon" className="h-8 w-8 lg:hidden" onClick={onOpenMobileNav} aria-label="Open menu">
        <Menu className="h-4 w-4" />
      </Button>

      {/* Back button — shown on inner pages */}
      {showBackButton && <BackButton />}

      {/* Search — visible on desktop, hidden on mobile (use icon button instead) */}
      <div className="hidden flex-1 md:block">
        <div
          className="flex h-8 items-center gap-2 rounded-md border border-input bg-secondary/50 px-3 text-sm text-muted-foreground transition-all hover:bg-secondary hover:shadow-sm md:max-w-sm"
          onClick={onOpenCommandPalette}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onOpenCommandPalette()}
        >
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1 text-left">Search DevLink…</span>
          <kbd className="hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground sm:inline">
            {isMac ? "⌘K" : "Ctrl K"}
          </kbd>
        </div>
      </div>

      {/* Actions */}
      <div className="ml-auto flex items-center gap-1">
        {/* Mobile: search icon button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 md:hidden"
          onClick={onOpenCommandPalette}
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>

        <div className="hidden sm:flex items-center gap-1">
          <NotificationsPopover />
          <ThemeToggle />
        </div>

        {user && (
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={logout} aria-label="Log out">
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>
    </header>
  );
}
