import { Activity } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-12">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold">RemoteLogger</span>
        </div>
        <p>Built for developers, by developers. © 2024 RemoteLogger.</p>
      </div>
    </footer>
  )
}