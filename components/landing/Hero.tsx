import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Code, Construction, Play } from "lucide-react";
import Link from "next/link";
import { TrustIndicators } from "./TrustIndicators";
import { DashboardPreview } from "./DashboardPreview";

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-24 text-center relative">
      <Badge
        variant="secondary"
        className="px-3 border-amber-500 mb-6 animate-pulse"
      >
        <Construction className="w-3 h-3 mr-1" />
        <p>Under construction</p>
      </Badge>

      <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
        The Developer&apos;s
        <br />
        <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Logging Companion
        </span>
      </h1>

      <p className="text-lg md:text-2xl text-muted-foreground mb-8 max-w-2xl md:max-w-3xl mx-auto leading-relaxed">
        Visualize real-time logs, track error insights, and configure
        intelligent alert rules. Built for developers who demand{" "}
        <span className="text-primary font-semibold">clarity and control</span>.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <Link href={"/sdk"}>
          <Button size="lg" className="text-base px-8 py-6">
            Start Free Trial
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>

        {/* <Button
          size="lg"
          variant="outline"
          className="text-base px-8 py-6 bg-transparent"
          asChild
        >
          <Link href="#demo">
            <Play className="mr-2 w-4 h-4" />
            Watch Demo
          </Link>
        </Button> */}

        <Button
          size="lg"
          variant="ghost"
          className="text-base px-8 py-6"
          asChild
        >
          <Link href="/sdk">
            <Code className="mr-2 w-4 h-4" />
            View SDK
          </Link>
        </Button>
      </div>

      <TrustIndicators />

      {/* Dashboard Preview */}
      <div className="relative max-w-7xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-3xl" />
        <div className="relative">
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}
