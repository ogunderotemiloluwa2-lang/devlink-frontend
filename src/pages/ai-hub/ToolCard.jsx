import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ToolCard({ tool, onSelect }) {
  return (
    <Card
      className="min-w-0 cursor-pointer card-hover"
      onClick={() => onSelect(tool)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect(tool)}
    >
      <CardContent className="flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium">{tool.name}</p>
          <Badge variant="outline" className="shrink-0">
            {tool.pricing}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{tool.tagline}</p>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-foreground/80">{tool.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <Badge variant="secondary">{tool.category}</Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-current text-warning" /> {tool.rating}
            <span className="ml-0.5">({tool.reviews.toLocaleString()})</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
