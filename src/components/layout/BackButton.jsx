import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

/**
 * BackButton — a small, consistent back arrow used in page headers.
 *
 * Behavior:
 *  - If `href` is provided, renders a <Link> (declarative navigation).
 *  - Otherwise falls back to the router's `navigate(-1)` (imperative go-back).
 *  - On mobile, shows just the icon; on larger screens, shows icon + "Back" label.
 *
 * Pass `label` to override the default "Back" text.
 * Pass `className` to style the wrapper.
 */
export default function BackButton({ href, label = "Back", className }) {
  const navigate = useNavigate();

  const content = (
    <>
      <ArrowLeft className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </>
  );

  const baseClasses = cn(
    "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
    className
  );

  if (href) {
    return (
      <Link to={href} className={baseClasses} aria-label={label}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className={baseClasses}
      aria-label={label}
    >
      {content}
    </button>
  );
}
