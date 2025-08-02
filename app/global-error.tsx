"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <CardTitle>Application Error</CardTitle>
              <CardDescription>
                A critical error occurred that prevented the application from loading properly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-3 rounded text-sm font-mono text-muted-foreground">
                {error.message || "Unknown critical error"}
              </div>
              <div className="flex flex-col gap-2">
                <Button onClick={reset} className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload Application
                </Button>
                <Button variant="outline" onClick={() => (window.location.href = "/")} className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Go to Homepage
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  )
}
