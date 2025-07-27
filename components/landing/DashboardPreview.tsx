import { LogEntries } from "./LogEntries";
import { MockChart } from "./MockChart";
import { StatsCards } from "./StatCards";

export function DashboardPreview() {
  return (
    <div className="relative max-w-6xl mx-auto">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-3xl" />
      <div className="relative bg-card border border-border/50 rounded-2xl p-8 shadow-2xl">
        {/* Mock Browser Header */}
        <div className="flex items-center space-x-2 mb-6">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div>
          <div className="flex-1 bg-muted rounded-md h-6 flex items-center px-3">
            <span className="text-xs text-muted-foreground">app.loghive.dev/dashboard</span>
          </div>
        </div>

        <div className="space-y-6">
          <StatsCards />
          <MockChart />
          <LogEntries />
        </div>
      </div>
    </div>
  )
}