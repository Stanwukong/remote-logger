import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ChartCardProps {
  title: string
  description: string
  type: "bar" | "line" | "pie"
  data?: any
}

export function ChartCard({ title, description, type, data }: ChartCardProps) {
  // Mock chart visualization with more sophisticated rendering
  const renderChart = () => {
    switch (type) {
      case "bar":
        return (
          <div className="flex items-end space-x-2 h-32">
            {(data?.datasets?.[0]?.data || [40, 60, 30, 80, 45, 70, 55]).map((height: number, index: number) => (
              <div
                key={index}
                className="bg-primary/20 rounded-t flex-1 relative group"
                style={{ height: `${(height / 100) * 100}%` }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {height}
                </div>
              </div>
            ))}
          </div>
        )
      case "line":
        return (
          <div className="relative h-32">
            <svg className="w-full h-full" viewBox="0 0 300 100">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polyline
                fill="url(#gradient)"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                points="0,80 50,60 100,70 150,40 200,50 250,30 300,45"
              />
              <polyline
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                points="0,80 50,60 100,70 150,40 200,50 250,30 300,45"
              />
              {[
                { x: 0, y: 80 },
                { x: 50, y: 60 },
                { x: 100, y: 70 },
                { x: 150, y: 40 },
                { x: 200, y: 50 },
                { x: 250, y: 30 },
                { x: 300, y: 45 },
              ].map((point, index) => (
                <circle
                  key={index}
                  cx={point.x}
                  cy={point.y}
                  r="3"
                  fill="hsl(var(--primary))"
                  className="hover:r-4 transition-all cursor-pointer"
                />
              ))}
            </svg>
          </div>
        )
      case "pie":
        return (
          <div className="flex items-center justify-center h-32">
            <svg className="w-24 h-24" viewBox="0 0 42 42">
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="hsl(var(--muted))" strokeWidth="3" />
              <circle
                cx="21"
                cy="21"
                r="15.915"
                fill="transparent"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeDasharray="60 40"
                strokeDashoffset="25"
                className="transition-all duration-500 hover:stroke-width-4"
              />
              <circle
                cx="21"
                cy="21"
                r="15.915"
                fill="transparent"
                stroke="hsl(var(--destructive))"
                strokeWidth="3"
                strokeDasharray="25 75"
                strokeDashoffset="85"
                className="transition-all duration-500 hover:stroke-width-4"
              />
            </svg>
            <div className="ml-4 space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full" />
                <span>Success (60%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-destructive rounded-full" />
                <span>Errors (25%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-muted rounded-full" />
                <span>Other (15%)</span>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{renderChart()}</CardContent>
    </Card>
  )
}
