import { cn } from '@/lib/utils';

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded bg-bg-elevated', className)} />
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6 p-1">
      {/* Metric cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border-subtle bg-bg-surface p-5 space-y-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
      {/* Primary chart */}
      <div className="rounded-lg border border-border-subtle bg-bg-surface p-6">
        <Skeleton className="h-4 w-40 mb-4" />
        <Skeleton className="h-[250px] w-full" />
      </div>
      {/* Two-col grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-lg border border-border-subtle bg-bg-surface p-6">
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-[180px] w-full" />
        </div>
        <div className="rounded-lg border border-border-subtle bg-bg-surface p-6">
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-[180px] w-full" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 8 }: { rows?: number }) {
  return (
    <div className="space-y-4 p-1">
      {/* Filter bar skeleton */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
      {/* Table rows */}
      <div className="rounded-lg border border-border-subtle bg-bg-surface overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 px-4 py-3 border-b border-border-subtle">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-24 ml-auto" />
          <Skeleton className="h-3 w-20" />
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-border-subtle last:border-b-0">
            <Skeleton className="h-5 w-5 rounded-full" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-3.5 w-[60%]" />
              <Skeleton className="h-3 w-[30%]" />
            </div>
            <Skeleton className="h-3 w-20 ml-auto" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
