import { Link } from "react-router-dom";
import { Star, Users2, GitFork } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";

export default function ProjectCard({ project }) {
  const ownerUsername = project.owner || project.ownerUsername || "";
  const ownerName = project.ownerName || project.owner || "";
  const ownerAvatar = project.ownerAvatar || "";

  return (
    <Card className="min-w-0 flex h-full flex-col card-hover">
      <CardContent className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <p className="font-mono text-sm font-medium">{project.name}</p>
          <Badge variant="secondary" className="shrink-0">
            {project.stage}
          </Badge>
        </div>
        <p className="mt-1 text-sm font-medium text-foreground/90">{project.tagline}</p>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">{project.description}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <Badge key={s} variant="mono">
              {s}
            </Badge>
          ))}
        </div>

        <div className="mt-3">
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">Looking for</p>
          <div className="flex flex-wrap gap-1.5">
            {project.rolesNeeded.map((role) => (
              <Badge key={role} variant="outline">
                {role}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          {ownerUsername && (
            <Link to={`/profile/${ownerUsername}`} className="flex items-center gap-2">
              <UserAvatar username={ownerUsername} displayName={ownerName} className="h-6 w-6" />
              <span className="text-xs font-medium hover:underline">{ownerName || ownerUsername}</span>
            </Link>
          )}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3" /> {project.stars?.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="h-3 w-3" /> {project.contributors}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
