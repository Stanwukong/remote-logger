import { Card, CardContent, CardHeader } from "../ui/card"
import { Skeleton } from "./Skeleton"

export function CardSkeleton({ 
  showHeader = true, 
  headerLines = 2, 
  contentLines = 4,
  className = ""
}: {
  showHeader?: boolean
  headerLines?: number
  contentLines?: number
  className?: string
}) {
  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader>
          {Array.from({ length: headerLines }).map((_, i) => (
            <Skeleton key={i} className={`h-4 ${i === 0 ? 'w-32' : 'w-48'}`} />
          ))}
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: contentLines }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}