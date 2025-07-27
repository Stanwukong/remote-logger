import { LogLine } from "./LogLine";

export function FeaturePreview() {
  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur-3xl" />
      <div className="relative bg-card border border-border/50 rounded-2xl p-8 shadow-2xl">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="h-2 bg-muted rounded-full" />
          <div className="h-2 bg-primary/60 rounded-full" />
          <div className="h-2 bg-muted rounded-full" />
        </div>
        <div className="space-y-3">
          <LogLine status="success" />
          <LogLine status="warning" />
          <LogLine status="error" />
        </div>
      </div>
    </div>
  )
}