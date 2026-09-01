import { Skeleton } from "@/components/layout/Skeleton";

export function ListRowSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-surface-border bg-surface-card p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-8 w-24 shrink-0 rounded-lg" />
    </div>
  );
}

export function ListRowSkeletonGroup({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <ListRowSkeleton key={i} />
      ))}
    </div>
  );
}
