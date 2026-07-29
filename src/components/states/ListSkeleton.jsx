import { Skeleton } from "@/components/ui/skeleton";

export default function ListSkeleton({ rows = 4, className }) {
  return (
    <div className={className}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 border-b border-border py-4 last:border-0">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3.5 w-full max-w-md" />
            <Skeleton className="h-3.5 w-2/3 max-w-sm" />
          </div>
        </div>
      ))}
    </div>
  );
}
