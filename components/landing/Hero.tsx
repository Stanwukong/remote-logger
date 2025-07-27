// components/landing/Hero.tsx
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Code, Star } from "lucide-react"
import Link from "next/link"
import { FeaturePreview } from "./FeaturePreview"

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-24 text-center">
      <Badge variant="secondary" className="p-2 mb-6">
        <Star className="w-3 h-3 mr-1" />
        The Developer's Logging Companion
      </Badge>
      <h1 className="text-5xl md:text-6xl font-bold leading-relaxed tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
        RemoteLogger
      </h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
        Visualize real-time logs, track error insights, and configure intelligent alert rules. Built for developers
        who demand clarity and control.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
        <Button size="lg" className="text-base" asChild>
          <Link href="/dashboard">
            Get Started <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" className="text-base bg-transparent" asChild>
          <Link href="/sdk">
            <Code className="mr-2 w-4 h-4" />
            View SDK
          </Link>
        </Button>
      </div>

      <FeaturePreview />
    </section>
  )
}