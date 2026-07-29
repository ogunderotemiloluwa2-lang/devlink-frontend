import { useMemo, useState } from "react";
import { Search, Users2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProjectCard from "./ProjectCard";
import EmptyState from "@/components/states/EmptyState";
import { useProjects } from "@/hooks/useApi";
import { cn } from "@/lib/utils";

/**
 * Adapts a backend Project document to the shape expected by ProjectCard.
 * Backend: { _id, name, tagline, description, stack, rolesNeeded, stage, owner: {name, username, avatarUrl}, starsCount, membersCount }
 * Frontend: { id, name, tagline, description, stack, rolesNeeded, stage, owner, stars, contributors }
 */
function adaptProject(project) {
  if (!project) return null;
  return {
    id: project._id || project.id,
    name: project.name,
    tagline: project.tagline || "",
    description: project.description || "",
    stack: project.stack || [],
    rolesNeeded: project.rolesNeeded || [],
    stage: project.stage || "Idea",
    owner: project.owner?.username || project.owner || "",
    ownerName: project.owner?.name || "",
    ownerAvatar: project.owner?.avatarUrl || "",
    stars: project.starsCount ?? 0,
    contributors: project.membersCount ?? 0,
  };
}

export default function CollaborationHub() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("All roles");
  const [stack, setStack] = useState("All stacks");

  const { data, loading, error, refetch } = useProjects({ sort: "recent" });

  const projects = useMemo(() => {
    if (!data?.projects) return [];
    return data.projects.map(adaptProject).filter(Boolean);
  }, [data]);

  const allRoles = useMemo(
    () => [...new Set(projects.flatMap((p) => p.rolesNeeded))].sort(),
    [projects]
  );
  const allStacks = useMemo(
    () => [...new Set(projects.flatMap((p) => p.stack))].sort(),
    [projects]
  );

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesQuery =
        !query.trim() ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.tagline.toLowerCase().includes(query.toLowerCase());
      const matchesRole = role === "All roles" || p.rolesNeeded.includes(role);
      const matchesStack = stack === "All stacks" || p.stack.includes(stack);
      return matchesQuery && matchesRole && matchesStack;
    });
  }, [query, role, stack, projects]);

  if (loading) {
    return (
      <div className="container max-w-6xl space-y-6 py-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Collaboration Hub</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real projects looking for collaborators — filter by the role or stack you bring.
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
          <h1 className="text-2xl font-semibold tracking-tight">Collaboration Hub</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real projects looking for collaborators — filter by the role or stack you bring.
          </p>
        </div>
        <EmptyState
          icon={Users2}
          title="Something went wrong"
          description="Could not load projects. Please try again."
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
        <h1 className="text-2xl font-semibold tracking-tight">Collaboration Hub</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Real projects looking for collaborators — filter by the role or stack you bring.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={cn(
            "h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          )}
        >
          <option>All roles</option>
          {allRoles.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <select
          value={stack}
          onChange={(e) => setStack(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option>All stacks</option>
          {allStacks.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={Users2}
          title="No projects match your filters"
          description="Try clearing a filter or searching a different keyword."
        />
      ) : (
        <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
