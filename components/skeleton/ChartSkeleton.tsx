import { Skeleton } from "./Skeleton";

export function ChartSkeleton({ height = "h-64" }: { height?: string }) {
  return (
    <div className={`${height} flex items-end justify-center space-x-2 p-4`}>
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton
          key={i}
          className="w-8"
          style={{ height: `${Math.random() * 80 + 20}%` }}
        />
      ))}
    </div>
  )
}