import { useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/toast";
import ToolCard from "./ToolCard";
import EmptyState from "@/components/states/EmptyState";
import { useApi, useAITools } from "@/hooks/useApi";
import { cn } from "@/lib/utils";

/**
 * Adapts a backend AI tool document to the shape expected by ToolCard.
 * Backend: { _id, name, tagline, description, category, pricing, ratingAvg, reviewsCount, tags, websiteUrl, ... }
 * Frontend: { id, name, tagline, description, category, pricing, rating, reviews, tags, websiteUrl }
 */
function adaptTool(tool) {
  if (!tool) return null;
  return {
    id: tool._id || tool.id,
    name: tool.name,
    tagline: tool.tagline,
    description: tool.description,
    category: tool.category,
    pricing: tool.pricing,
    rating: tool.ratingAvg ?? tool.rating ?? 0,
    reviews: tool.reviewsCount ?? tool.reviews ?? 0,
    tags: tool.tags || [],
    websiteUrl: tool.websiteUrl || "",
  };
}

export default function AIHub() {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedTool, setSelectedTool] = useState(null);

  // Fetch all tools (featured first, sorted by rating)
  const { data: toolsData, loading, error, refetch } = useAITools({ sort: "rating", featured: false });
  // Fetch distinct categories from the backend
  const { data: categoriesData } = useApi("/ai-tools/categories");

  const tools = useMemo(() => {
    if (!toolsData?.tools) return [];
    return toolsData.tools.map(adaptTool).filter(Boolean);
  }, [toolsData]);

  const aiToolCategories = useMemo(() => {
    return categoriesData?.categories || [];
  }, [categoriesData]);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory = category === "All" || tool.category === category;
      const matchesQuery =
        !query.trim() ||
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.tagline.toLowerCase().includes(query.toLowerCase()) ||
        tool.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      return matchesCategory && matchesQuery;
    });
  }, [query, category, tools]);

  if (loading) {
    return (
      <div className="container max-w-6xl space-y-6 py-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">AI Hub</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A directory of AI-powered developer tools, reviewed by people who've shipped with them.
          </p>
        </div>
        <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-6xl space-y-6 py-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">AI Hub</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A directory of AI-powered developer tools, reviewed by people who've shipped with them.
          </p>
        </div>
        <EmptyState
          icon={Sparkles}
          title="Something went wrong"
          description="Could not load AI tools. Please try again."
        />
        <Button onClick={refetch} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl space-y-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">AI Hub</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A directory of AI-powered developer tools, reviewed by people who've shipped with them.
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tools…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setCategory("All")}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            category === "All" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent"
          )}
        >
          All
        </button>
        {aiToolCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              category === cat ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredTools.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No tools match your search"
          description="Try a different keyword or clear the category filter."
        />
      ) : (
        <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onSelect={setSelectedTool} />
          ))}
        </div>
      )}

      <Sheet open={!!selectedTool} onOpenChange={(open) => !open && setSelectedTool(null)}>
        <SheetContent side="right" className="w-full sm:w-96">
          {selectedTool && (
            <div className="flex h-full flex-col p-6">
              <SheetTitle>{selectedTool.name}</SheetTitle>
              <p className="mt-1 text-sm text-muted-foreground">{selectedTool.tagline}</p>

              <div className="mt-4 flex items-center gap-2">
                <Badge variant="secondary">{selectedTool.category}</Badge>
                <Badge variant="outline">{selectedTool.pricing}</Badge>
                <span className="text-xs text-muted-foreground">
                  ★ {selectedTool.rating} · {selectedTool.reviews.toLocaleString()} reviews
                </span>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-foreground/90">{selectedTool.description}</p>

              <div className="mt-5">
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTool.tags.map((tag) => (
                    <Badge key={tag} variant="mono">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                className="mt-auto"
                onClick={() => {
                  if (selectedTool.websiteUrl) {
                    window.open(selectedTool.websiteUrl, "_blank", "noopener,noreferrer");
                  } else {
                    toast({ title: "No website", description: "This tool doesn't have a website link yet." });
                  }
                }}
              >
                Visit tool
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
