"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Home, RefreshCw, Bug, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  const getErrorMessage = () => {
    if (error.message.includes("fetch")) {
      return {
        title: "Connection Error",
        description:
          "We're having trouble connecting to our servers. Please check your internet connection and try again.",
        suggestion: "This might be a temporary network issue.",
      }
    }

    if (error.message.includes("404")) {
      return {
        title: "Page Not Found",
        description: "The page you're looking for doesn't exist or has been moved.",
        suggestion: "Double-check the URL or navigate back to the dashboard.",
      }
    }

    if (error.message.includes("auth")) {
      return {
        title: "Authentication Error",
        description: "Your session has expired or you don't have permission to access this resource.",
        suggestion: "Please log in again to continue.",
      }
    }

    return {
      title: "Something went wrong",
      description: "An unexpected error occurred while loading this page.",
      suggestion: "This error has been logged and our team has been notified.",
    }
  }

  const errorInfo = getErrorMessage()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Error Icon */}
        <div className="text-center">
          <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-12 h-12 text-destructive" />
          </div>
          <h1 className="text-4xl font-bold mb-2">{errorInfo.title}</h1>
          <p className="text-xl text-muted-foreground">{errorInfo.description}</p>
        </div>

        {/* Error Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bug className="w-5 h-5" />
              <span>Error Details</span>
            </CardTitle>
            <CardDescription>{errorInfo.suggestion}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error Message */}
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-mono text-muted-foreground break-all">
                {error.message || "Unknown error occurred"}
              </p>
              {error.digest && <p className="text-xs text-muted-foreground mt-2">Error ID: {error.digest}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={reset} className="flex-1">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button variant="outline" asChild className="flex-1 bg-transparent">
                <Link href="/dashboard">
                  <Home className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Link>
              </Button>
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              If this error persists, please contact our support team with the error details above.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/support">Contact Support</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/docs">View Documentation</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
