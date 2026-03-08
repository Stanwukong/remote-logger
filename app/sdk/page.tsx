"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Code,
  ExternalLink,
  BookOpen,
  Zap,
  Shield,
  Terminal,
  Package,
  Rocket,
  CheckCircle2,
  AlertTriangle,
  Star,
  Github,
  Play,
  Clock,
  TrendingUp,
  Settings,
  Database,
  Server,
  Layers,
  ArrowRight,
  Lightbulb,
  Target,
  Activity,
  Eye,
  MousePointer,
  Network,
  Bug,
  Gauge,
  Globe,
  Lock,
  Smartphone,
  RefreshCw,
  Heart,
  MessageCircle,
  GitBranch,
  Sparkles,
  Brain,
  Fingerprint,
  Workflow,
  Palette,
  TestTube,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { InteractiveDemo } from "@/components/sdk/interactive-demo";
import { CodeBlock } from "@/components/sdk/code-block";
import { FeatureShowcase } from "@/components/sdk/feature-showcase";

export default function SDKPage() {
  return (
    <div className="min-h-screen scrollbar-hide bg-bg-void">
      {/* ================================================================
          HEADER — Glassmorphism nav with Monita SVG logo
          ================================================================ */}
      <header className="sticky top-0 z-50 glass-nav border-b border-border-faint">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center gap-2.5">
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                className="text-signal"
              >
                <path
                  d="M4 20L4 16L8 12L12 18L18 8L22 14L24 10"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="4" cy="20" r="2" fill="currentColor" />
                <circle cx="24" cy="10" r="2" fill="currentColor" />
              </svg>
              <span className="font-display font-semibold text-lg text-text-primary tracking-[-0.02em]">
                monita
              </span>
            </Link>
            <div className="items-center space-x-2 ml-4 hidden md:flex">
              <Badge
                variant="secondary"
                className="text-xs bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm"
              >
                <Package className="w-3 h-3 mr-1" />
                v1.0.3
              </Badge>
              <Badge
                variant="outline"
                className="text-xs border-white/[0.06]"
              >
                <Star className="w-3 h-3 mr-1 text-data" />
                MIT
              </Badge>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="#quickstart"
              className="text-sm font-medium text-text-secondary hover:text-signal transition-colors duration-150"
            >
              Quick Start
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-text-secondary hover:text-signal transition-colors duration-150"
            >
              Features
            </a>
            <a
              href="#examples"
              className="text-sm font-medium text-text-secondary hover:text-signal transition-colors duration-150"
            >
              Examples
            </a>
            <a
              href="#reference"
              className="text-sm font-medium text-text-secondary hover:text-signal transition-colors duration-150"
            >
              API Reference
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="signal" size="sm" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
        {/* Subtle glow line under header */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, var(--signal) 50%, transparent 100%)",
            opacity: 0.15,
          }}
        />
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-12 max-w-full overflow-hidden scrollbar-hide">
        {/* ================================================================
            HERO SECTION — Observatory dark gradient with dot-grid
            ================================================================ */}
        <div
          className="relative text-center mb-16 -mx-3 sm:-mx-4 px-3 sm:px-4 py-16 sm:py-24 overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, var(--bg-void) 0%, var(--bg-base) 50%, var(--bg-surface) 100%)",
          }}
        >
          {/* Background dot grid */}
          <div className="absolute inset-0 bg-dot-grid opacity-30" />

          {/* Radial glow behind hero */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, var(--signal-glow) 0%, transparent 70%)",
              opacity: 0.4,
            }}
          />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-signal/20 bg-signal-muted backdrop-blur-sm mb-6">
              <Sparkles className="w-3 h-3 text-signal" />
              <span className="text-xs font-display font-semibold uppercase tracking-[0.08em] text-signal">
                Zero-Config Auto-Instrumentation
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-[-0.03em] mb-6 px-2">
              <span className="text-text-primary">Monita SDK </span>
              <br className="md:hidden" />
              <span className="gradient-text-signal">
                Intelligent Logging
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-3xl mx-auto mb-10 leading-relaxed px-4 sm:px-0">
              A powerful, TypeScript-first logging SDK with automatic error
              tracking, performance monitoring, and user interaction capture.
              Similar to Sentry and LogRocket, but with full control over your
              data.
            </p>

            {/* Feature Highlights */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-12 text-xs sm:text-sm px-4 sm:px-0">
              <div className="flex items-center space-x-2">
                <Bug className="w-3 h-3 sm:w-4 sm:h-4 text-status-danger flex-shrink-0" />
                <span className="font-medium text-text-primary">Auto Error Tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <Gauge className="w-3 h-3 sm:w-4 sm:h-4 text-data flex-shrink-0" />
                <span className="font-medium text-text-primary">Performance Monitoring</span>
              </div>
              <div className="flex items-center space-x-2">
                <Network className="w-3 h-3 sm:w-4 sm:h-4 text-signal flex-shrink-0" />
                <span className="font-medium text-text-primary">Network Tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <MousePointer className="w-3 h-3 sm:w-4 sm:h-4 text-data-bright flex-shrink-0" />
                <span className="font-medium text-text-primary">User Interactions</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-status-warn flex-shrink-0" />
                <span className="font-medium text-text-primary">Privacy-First</span>
              </div>
            </div>

            {/* Quick Stats — Glass cards */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-12 text-xs sm:text-sm px-4 sm:px-0">
              <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                <Package className="w-3 h-3 sm:w-4 sm:h-4 text-data flex-shrink-0" />
                <span className="font-medium text-text-primary">~50KB</span>
                <span className="text-text-muted">Gzipped</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-data-bright flex-shrink-0" />
                <span className="font-medium text-text-primary">{"<30s"}</span>
                <span className="text-text-muted">Setup Time</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-signal flex-shrink-0" />
                <span className="font-medium text-text-primary">Zero Config</span>
                <span className="text-text-muted">Required</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
              <Button
                variant="signal"
                size="lg"
                className="text-sm sm:text-base font-display font-bold w-full sm:w-auto"
                asChild
              >
                <Link href="#quickstart">
                  <Rocket className="mr-2 w-4 h-4" />
                  Quick Start Guide
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-sm sm:text-base bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] hover:border-signal/30 transition-all duration-200 w-full sm:w-auto"
                asChild
              >
                <Link href="#demo">
                  <Play className="mr-2 w-4 h-4" />
                  Try Interactive Demo
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-sm sm:text-base text-text-secondary hover:text-text-primary w-full sm:w-auto"
                asChild
              >
                <Link
                  href="https://github.com/Stanwukong/loghive-sdk"
                  target="_blank"
                >
                  <Github className="mr-2 w-4 h-4" />
                  View on GitHub
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* ================================================================
            AUTO-CAPTURE FEATURES — Glass-morphism cards
            ================================================================ */}
        <section id="features" className="mb-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-signal/20 bg-signal-muted backdrop-blur-sm mb-4">
              <Brain className="w-3 h-3 text-signal" />
              <span className="text-xs font-display font-semibold uppercase tracking-[0.06em] text-signal">
                Auto-Instrumentation
              </span>
            </div>
            <h2 className="text-3xl font-display font-bold mb-4 text-text-primary">
              What Gets Captured Automatically
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              With zero configuration, the SDK automatically captures
              comprehensive telemetry data
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
            {[
              {
                icon: Bug,
                title: "Errors",
                description: "Uncaught exceptions, promise rejections",
                level: "ERROR",
                color: "text-status-danger",
                bgColor: "bg-status-danger/5",
                features: [
                  "JavaScript errors",
                  "Promise rejections",
                  "Stack traces",
                  "Source maps",
                ],
              },
              {
                icon: Gauge,
                title: "Performance",
                description: "Page loads, resource timing, Core Web Vitals",
                level: "DEBUG/INFO/WARN",
                color: "text-data",
                bgColor: "bg-data/5",
                features: [
                  "Core Web Vitals",
                  "Resource timing",
                  "Navigation timing",
                  "Memory usage",
                ],
              },
              {
                icon: Network,
                title: "Network",
                description: "Fetch/XHR requests with status and timing",
                level: "DEBUG/WARN/ERROR",
                color: "text-signal",
                bgColor: "bg-signal/5",
                features: [
                  "HTTP requests",
                  "Response times",
                  "Status codes",
                  "Request/response size",
                ],
              },
              {
                icon: Globe,
                title: "Page Views",
                description: "Navigation and SPA route changes",
                level: "INFO",
                color: "text-data-bright",
                bgColor: "bg-data-bright/5",
                features: [
                  "Page navigation",
                  "SPA routing",
                  "Referrer tracking",
                  "Session duration",
                ],
              },
              {
                icon: Terminal,
                title: "Console",
                description: "console.error() and console.warn() calls",
                level: "ERROR/WARN",
                color: "text-status-warn",
                bgColor: "bg-status-warn/5",
                features: [
                  "Console errors",
                  "Console warnings",
                  "Stack traces",
                  "Arguments capture",
                ],
              },
              {
                icon: MousePointer,
                title: "Interactions",
                description: "User clicks, scrolls (optional)",
                level: "DEBUG/TRACE",
                color: "text-pink-400",
                bgColor: "bg-pink-400/5",
                features: [
                  "Click events",
                  "Scroll tracking",
                  "Form interactions",
                  "Element selectors",
                ],
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] hover:border-signal/20 hover:bg-white/[0.05] transition-all duration-300"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 ${feature.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <feature.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${feature.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base sm:text-lg leading-tight text-text-primary">
                        {feature.title}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className="text-xs mt-1 border-white/[0.08] text-text-secondary"
                      >
                        {feature.level}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-sm mt-3 text-text-secondary">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start text-xs sm:text-sm text-text-secondary"
                      >
                        <CheckCircle2 className="w-3 h-3 text-signal mr-2 flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ================================================================
            INTERACTIVE DEMO SECTION
            ================================================================ */}
        <section id="demo" className="mb-24">
          <div className="text-center mb-12 px-4 sm:px-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-signal/20 bg-signal-muted backdrop-blur-sm mb-4">
              <Play className="w-3 h-3 text-signal" />
              <span className="text-xs font-display font-semibold uppercase tracking-[0.06em] text-signal">
                Interactive Demo
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-4 text-text-primary">
              Try Monita Live
            </h2>
            <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto">
              Experience auto-instrumentation in action. Trigger events and see
              real-time capture.
            </p>
          </div>
          <div className="px-3 sm:px-0">
            <InteractiveDemo />
          </div>
        </section>

        {/* ================================================================
            QUICK START SECTION — Glass tabs, signal-green steps
            ================================================================ */}
        <section id="quickstart" className="mb-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-signal/20 bg-signal-muted backdrop-blur-sm mb-4">
              <Zap className="w-3 h-3 text-signal" />
              <span className="text-xs font-display font-semibold uppercase tracking-[0.06em] text-signal">
                Zero-Config Setup
              </span>
            </div>
            <h2 className="text-3xl font-display font-bold mb-4 text-text-primary">
              Get Started in 30 Seconds
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Install, initialize, and start capturing events automatically
            </p>
          </div>

          <Tabs defaultValue="basic" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-2 gap-1 sm:gap-2 md:grid-cols-4 w-full max-w-full mb-4 px-2 sm:px-0 bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                <TabsTrigger
                  value="basic"
                  className="flex items-center space-x-1 sm:space-x-2 py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-signal/10 data-[state=active]:text-signal transition-all duration-200"
                >
                  <Rocket className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">Basic Setup</span>
                </TabsTrigger>
                <TabsTrigger
                  value="advanced"
                  className="flex items-center space-x-1 sm:space-x-2 py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-signal/10 data-[state=active]:text-signal transition-all duration-200"
                >
                  <Settings className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">Advanced</span>
                </TabsTrigger>
                <TabsTrigger
                  value="frameworks"
                  className="flex items-center space-x-1 sm:space-x-2 py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-signal/10 data-[state=active]:text-signal transition-all duration-200"
                >
                  <Layers className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">Frameworks</span>
                </TabsTrigger>
                <TabsTrigger
                  value="environments"
                  className="flex items-center space-x-1 sm:space-x-2 py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-signal/10 data-[state=active]:text-signal transition-all duration-200"
                >
                  <Globe className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">Environments</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="basic" className="space-y-8 mt-4 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <div className="space-y-6">
                  <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-text-primary">
                        <div className="w-6 h-6 bg-signal rounded-full flex items-center justify-center text-bg-void text-xs font-bold">
                          1
                        </div>
                        <span>Install the SDK</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="bash"
                        code="npm install monita"
                        showCopy
                        title="Terminal"
                      />
                      <div className="flex gap-2 mt-3 text-sm text-text-secondary">
                        <span>Or:</span>
                        <code className="bg-bg-elevated px-1 rounded font-mono text-text-code">
                          yarn add monita
                        </code>
                        <code className="bg-bg-elevated px-1 rounded font-mono text-text-code">
                          pnpm add monita
                        </code>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-text-primary">
                        <div className="w-6 h-6 bg-signal rounded-full flex items-center justify-center text-bg-void text-xs font-bold">
                          2
                        </div>
                        <span>Initialize with Auto-Instrumentation</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="typescript"
                        code={`import { Monita } from "monita";

// Initialize with auto-instrumentation
const logger = new Monita({
  apiKey: "your-api-key",
  projectId: "your-project-id",
  environment: "production",
  serviceName: "my-web-app",
});

// That's it! Auto-capture is already working:
// ✅ JavaScript errors are automatically captured
// ✅ Network requests are monitored
// ✅ Performance metrics are collected
// ✅ Page views are tracked`}
                        showCopy
                        title="app.ts"
                      />
                    </CardContent>
                  </Card>

                  <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-text-primary">
                        <div className="w-6 h-6 bg-signal rounded-full flex items-center justify-center text-bg-void text-xs font-bold">
                          3
                        </div>
                        <span>Optional Manual Logging</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="typescript"
                        code={`// Manual logging (optional - auto-capture handles most cases)
logger.info("User started checkout");
logger.error("Payment failed", new Error("Card declined"));

// Enhanced logging with context
logger.setContext({
  userId: "12345",
  feature: "checkout",
  experimentId: "ab-test-v2",
});

// Capture exceptions with additional context
logger.captureException(new Error("Something broke"), {
  component: "PaymentForm",
  action: "submit",
});`}
                        showCopy
                        title="manual-logging.ts"
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Alert className="bg-signal/5 border-signal/20">
                    <Sparkles className="h-4 w-4 text-signal" />
                    <AlertDescription className="text-text-secondary">
                      <strong className="text-text-primary">Zero Configuration Required!</strong> The SDK
                      automatically starts capturing errors, performance
                      metrics, network requests, and page views as soon as you
                      initialize it.
                    </AlertDescription>
                  </Alert>

                  {/* "What Happens Automatically" card with subtle glow border */}
                  <Card
                    className="bg-white/[0.03] backdrop-blur-md border border-signal/10 relative overflow-hidden"
                  >
                    {/* Top signal-green accent line */}
                    <div
                      className="absolute top-0 left-0 right-0 h-px"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent 0%, var(--signal) 50%, transparent 100%)",
                        opacity: 0.3,
                      }}
                    />
                    <CardHeader>
                      <CardTitle className="text-text-primary font-display">What Happens Automatically</CardTitle>
                      <CardDescription className="text-text-secondary">
                        Events captured without any additional code
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Bug className="w-4 h-4 text-status-danger" />
                          <div>
                            <h4 className="font-semibold text-sm text-text-primary">
                              Error Tracking
                            </h4>
                            <p className="text-xs text-text-secondary">
                              Uncaught exceptions and promise rejections
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Gauge className="w-4 h-4 text-data" />
                          <div>
                            <h4 className="font-semibold text-sm text-text-primary">
                              Performance Monitoring
                            </h4>
                            <p className="text-xs text-text-secondary">
                              Core Web Vitals, page load times
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Network className="w-4 h-4 text-signal" />
                          <div>
                            <h4 className="font-semibold text-sm text-text-primary">
                              Network Requests
                            </h4>
                            <p className="text-xs text-text-secondary">
                              Fetch/XHR monitoring with timing
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Globe className="w-4 h-4 text-data-bright" />
                          <div>
                            <h4 className="font-semibold text-sm text-text-primary">
                              Page Views
                            </h4>
                            <p className="text-xs text-text-secondary">
                              Navigation and SPA route changes
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Bundle Impact — Signal green metrics */}
                  <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="text-text-primary font-display">Bundle Impact</CardTitle>
                      <CardDescription className="text-text-secondary">
                        Lightweight and performant
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-lg">
                          <Package className="w-6 h-6 mx-auto mb-2 text-signal" />
                          <div className="font-semibold text-text-primary">~50KB</div>
                          <div className="text-xs text-text-muted">
                            Gzipped
                          </div>
                        </div>
                        <div className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-lg">
                          <Activity className="w-6 h-6 mx-auto mb-2 text-signal" />
                          <div className="font-semibold text-text-primary">Minimal</div>
                          <div className="text-xs text-text-muted">
                            CPU Impact
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <div className="space-y-6">
                  <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="text-text-primary font-display">Auto-Capture Configuration</CardTitle>
                      <CardDescription className="text-text-secondary">
                        Fine-tune what gets captured automatically
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="typescript"
                        code={`import { Monita, LogLevel } from "monita";

const logger = new Monita({
  apiKey: "your-api-key",
  projectId: "your-project-id",

  // Configure auto-capture behavior
  autoCapture: {
    errors: true, // Uncaught errors (recommended)
    performance: true, // Performance metrics (recommended)
    networkRequests: true, // HTTP requests (recommended)
    pageViews: true, // Page navigation (recommended)
    consoleMessages: false, // Console.error/warn (can be noisy)
    userInteractions: false, // Clicks, scrolls (very verbose)

    // Customize log levels for different events
    logLevels: {
      networkSuccess: LogLevel.TRACE, // Quiet successful requests
      performanceFast: LogLevel.TRACE, // Quiet fast performance
      interactions: LogLevel.DEBUG, // User interactions
      console: {
        error: LogLevel.FATAL, // Escalate console errors
        warn: LogLevel.ERROR, // Escalate console warnings
      },
    },
  },
});`}
                        showCopy
                        title="advanced-config.ts"
                      />
                    </CardContent>
                  </Card>

                  <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="text-text-primary font-display">Context Management</CardTitle>
                      <CardDescription className="text-text-secondary">
                        Global context included in all events
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="typescript"
                        code={`// Set global context (included in all logs)
logger.setContext({
  userId: "12345",
  feature: "checkout",
  experimentId: "ab-test-v2",
  userPlan: "premium",
});

// Context is automatically included in all events
logger.error("Payment failed"); // Will include userId, feature, etc.

// Add breadcrumbs for debugging
logger.addBreadcrumb("User clicked pay button", "user-action");
logger.addBreadcrumb("Validation passed", "validation");
logger.addBreadcrumb("API call started", "network");

// Enhanced exception capture
logger.captureException(new Error("Payment processing failed"), {
  component: "PaymentForm",
  action: "submit",
  paymentMethod: "credit_card",
  amount: 99.99,
});`}
                        showCopy
                        title="context-management.ts"
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="text-text-primary font-display">Performance Optimization</CardTitle>
                      <CardDescription className="text-text-secondary">
                        Configure batching and delivery
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="typescript"
                        code={`const logger = new Monita({
  apiKey: "your-api-key",
  projectId: "your-project-id",

  // Performance settings
  batchSize: 50, // Batch events for efficiency
  flushInterval: 3000, // Flush every 3 seconds
  maxRetries: 3, // Retry failed requests

  // Memory management
  maxBreadcrumbs: 50, // Limit breadcrumb history
  maxEvents: 100, // Limit event buffer

  // Network optimization
  compression: true, // Compress payloads
  timeout: 10000, // Request timeout

  // Privacy settings
  sanitizeUrls: true, // Remove sensitive URL params
  sanitizeForms: true, // Protect form data

  // Error handling
  onError: (error) => {
    console.warn('Monita SDK error:', error);
  },
});`}
                        showCopy
                        title="performance-config.ts"
                      />
                    </CardContent>
                  </Card>

                  <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="text-text-primary font-display">Privacy & Security</CardTitle>
                      <CardDescription className="text-text-secondary">
                        Built-in data protection
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <Lock className="w-4 h-4 text-signal mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-sm text-text-primary">
                              URL Sanitization
                            </h4>
                            <p className="text-xs text-text-secondary">
                              Removes token, key, password, secret query
                              parameters
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Fingerprint className="w-4 h-4 text-signal mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-sm text-text-primary">
                              Form Protection
                            </h4>
                            <p className="text-xs text-text-secondary">
                              Keyboard events don&apos;t capture actual
                              keystrokes
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Eye className="w-4 h-4 text-signal mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-sm text-text-primary">
                              Element Safety
                            </h4>
                            <p className="text-xs text-text-secondary">
                              Uses CSS selectors, not text content
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Database className="w-4 h-4 text-signal mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-sm text-text-primary">
                              No Storage
                            </h4>
                            <p className="text-xs text-text-secondary">
                              No localStorage/sessionStorage usage
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="frameworks" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <div className="space-y-6">
                  <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-text-primary">
                        <div className="w-8 h-8 bg-data/5 rounded-lg flex items-center justify-center">
                          <Layers className="w-4 h-4 text-data" />
                        </div>
                        <span>React Integration</span>
                      </CardTitle>
                      <CardDescription className="text-text-secondary">
                        Error boundaries and hooks
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="typescript"
                        code={`import { Monita } from "monita";
import React from "react";

// Initialize SDK
const logger = new Monita({
  apiKey: process.env.REACT_APP_MONITA_API_KEY,
  projectId: "my-react-app",
  environment: process.env.NODE_ENV,
});

// Error Boundary Component
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: any) {
    logger.captureException(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
      component: errorInfo.componentStack?.split('\\n')[1],
    });
  }

  render() {
    if (this.state?.hasError) {
      return <div>Something went wrong.</div>;
    }
    return this.props.children;
  }
}

// Custom Hook for Context
function useMonitaContext(userId: string, userPlan: string) {
  React.useEffect(() => {
    logger.setContext({
      userId,
      userPlan,
      component: 'UserDashboard',
    });
  }, [userId, userPlan]);
}`}
                        showCopy
                        title="react-integration.tsx"
                      />
                    </CardContent>
                  </Card>

                  <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-text-primary">
                        <div className="w-8 h-8 bg-signal/5 rounded-lg flex items-center justify-center">
                          <Zap className="w-4 h-4 text-signal" />
                        </div>
                        <span>Vue.js Integration</span>
                      </CardTitle>
                      <CardDescription className="text-text-secondary">
                        Global error handler and composition API
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="typescript"
                        code={`import { createApp } from 'vue';
import { Monita } from 'monita';

const logger = new Monita({
  apiKey: process.env.VUE_APP_MONITA_API_KEY,
  projectId: 'my-vue-app',
  environment: process.env.NODE_ENV,
});

const app = createApp(App);

// Global error handler
app.config.errorHandler = (error, instance, info) => {
  logger.captureException(error, {
    vueInfo: info,
    component: instance?.$options.name || instance?.$options.__name,
    lifecycle: info,
  });
};

// Composition API helper
import { onMounted } from 'vue';

export function useMonita() {
  onMounted(() => {
    logger.addBreadcrumb('Component mounted', 'lifecycle');
  });

  const trackEvent = (event: string, data?: any) => {
    logger.info(event, data);
  };

  return { trackEvent };
}`}
                        showCopy
                        title="vue-integration.ts"
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-text-primary">
                        <div className="w-8 h-8 bg-data-bright/5 rounded-lg flex items-center justify-center">
                          <Server className="w-4 h-4 text-data-bright" />
                        </div>
                        <span>Next.js Integration</span>
                      </CardTitle>
                      <CardDescription className="text-text-secondary">
                        App Router and Pages Router support
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="typescript"
                        code={`// app/layout.tsx (App Router)
import { Monita } from 'monita';

const logger = new Monita({
  apiKey: process.env.MONITA_API_KEY,
  projectId: 'my-nextjs-app',
  environment: process.env.NODE_ENV,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// API Route monitoring (app/api/users/route.ts)
export async function GET(request: Request) {
  try {
    const users = await fetchUsers();
    logger.info('Users fetched successfully', {
      count: users.length,
      route: '/api/users',
    });
    return Response.json(users);
  } catch (error) {
    logger.captureException(error, {
      route: '/api/users',
      method: 'GET',
    });
    throw error;
  }
}`}
                        showCopy
                        title="nextjs-integration.tsx"
                      />
                    </CardContent>
                  </Card>

                  <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-text-primary">
                        <div className="w-8 h-8 bg-status-warn/5 rounded-lg flex items-center justify-center">
                          <Smartphone className="w-4 h-4 text-status-warn" />
                        </div>
                        <span>React Native (Coming Soon)</span>
                      </CardTitle>
                      <CardDescription className="text-text-secondary">
                        Mobile app monitoring and crash reporting
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <Rocket className="w-12 h-12 mx-auto mb-4 text-text-muted" />
                        <h3 className="font-semibold mb-2 text-text-primary">
                          React Native Support
                        </h3>
                        <p className="text-sm text-text-secondary mb-4">
                          Full React Native support is coming soon with native
                          crash reporting and performance monitoring.
                        </p>
                        <Badge
                          variant="outline"
                          className="border-white/[0.08] text-text-secondary"
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          Coming soon.
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="environments" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <div className="space-y-6">
                  <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-text-primary">
                        <div className="w-8 h-8 bg-data/5 rounded-lg flex items-center justify-center">
                          <Code className="w-4 h-4 text-data" />
                        </div>
                        <span>Development Configuration</span>
                      </CardTitle>
                      <CardDescription className="text-text-secondary">
                        Verbose logging for debugging
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="typescript"
                        code={`import { Monita, LogLevel } from "monita";

const devLogger = new Monita({
  apiKey: process.env.MONITA_DEV_API_KEY,
  projectId: "my-app-dev",
  environment: "development",

  // Development-specific settings
  minLogLevel: LogLevel.DEBUG, // Capture everything

  autoCapture: {
    errors: true,
    performance: true,
    networkRequests: true,
    pageViews: true,
    consoleMessages: true, // Capture all console output
    userInteractions: true, // Useful for debugging UX
  },

  // More verbose in development
  batchSize: 1, // Send immediately
  flushInterval: 1000, // Flush every second

  // Debug mode
  debug: true, // Enable SDK debug logs

  onError: (error) => {
    console.error('Monita SDK error:', error);
  },
});`}
                        showCopy
                        title="development.ts"
                      />
                    </CardContent>
                  </Card>

                  <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-text-primary">
                        <div className="w-8 h-8 bg-status-warn/5 rounded-lg flex items-center justify-center">
                          <TestTube className="w-4 h-4 text-status-warn" />
                        </div>
                        <span>Staging Configuration</span>
                      </CardTitle>
                      <CardDescription className="text-text-secondary">
                        Production-like with extra debugging
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="typescript"
                        code={`const stagingLogger = new Monita({
  apiKey: process.env.MONITA_STAGING_API_KEY,
  projectId: "my-app-staging",
  environment: "staging",

  // Staging-specific settings
  minLogLevel: LogLevel.INFO, // Skip debug logs

  autoCapture: {
    errors: true,
    performance: true,
    networkRequests: true,
    pageViews: true,
    consoleMessages: true, // Still useful for testing
    userInteractions: false, // Reduce noise
  },

  // Balanced performance
  batchSize: 25,
  flushInterval: 2000,

  // Additional context for staging
  defaultContext: {
    buildId: process.env.BUILD_ID,
    deploymentId: process.env.DEPLOYMENT_ID,
    testSuite: process.env.TEST_SUITE,
  },
});`}
                        showCopy
                        title="staging.ts"
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-text-primary">
                        <div className="w-8 h-8 bg-signal/5 rounded-lg flex items-center justify-center">
                          <Shield className="w-4 h-4 text-signal" />
                        </div>
                        <span>Production Configuration</span>
                      </CardTitle>
                      <CardDescription className="text-text-secondary">
                        Optimized for performance and reliability
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="typescript"
                        code={`const prodLogger = new Monita({
  apiKey: process.env.MONITA_PROD_API_KEY,
  projectId: "my-app-prod",
  environment: "production",

  // Production-optimized settings
  minLogLevel: LogLevel.WARN, // Only warnings and errors

  autoCapture: {
    errors: true, // Critical for production
    performance: true, // Monitor performance
    networkRequests: true, // Track API issues
    pageViews: true, // Analytics
    consoleMessages: false, // Skip in production
    userInteractions: false, // Reduce noise
  },

  // Optimized for performance
  batchSize: 100, // Larger batches
  flushInterval: 5000, // Less frequent flushes
  maxRetries: 5, // More resilient

  // Production context
  defaultContext: {
    version: process.env.APP_VERSION,
    region: process.env.AWS_REGION,
    instance: process.env.INSTANCE_ID,
  },

  // Graceful error handling
  onError: () => {
    // Silent in production
  },
});`}
                        showCopy
                        title="production.ts"
                      />
                    </CardContent>
                  </Card>

                  <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="text-text-primary font-display">Environment Comparison</CardTitle>
                      <CardDescription className="text-text-secondary">
                        Configuration differences at a glance
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <div className="min-w-full px-4 sm:px-0">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-white/[0.06]">
                                <th className="text-left py-2 pr-2 text-text-primary">Setting</th>
                                <th className="text-center py-2 px-1 sm:px-2 text-text-primary">Dev</th>
                                <th className="text-center py-2 px-1 sm:px-2 text-text-primary">Staging</th>
                                <th className="text-center py-2 px-1 sm:px-2 text-text-primary">Prod</th>
                              </tr>
                            </thead>
                            <tbody className="space-y-2 text-text-secondary">
                              <tr className="border-b border-white/[0.04]">
                                <td className="py-2 pr-2 text-xs sm:text-sm">Min Log Level</td>
                                <td className="text-center px-1 sm:px-2 text-xs sm:text-sm">DEBUG</td>
                                <td className="text-center px-1 sm:px-2 text-xs sm:text-sm">INFO</td>
                                <td className="text-center px-1 sm:px-2 text-xs sm:text-sm">WARN</td>
                              </tr>
                              <tr className="border-b border-white/[0.04]">
                                <td className="py-2 pr-2 text-xs sm:text-sm">Console Messages</td>
                                <td className="text-center px-1 sm:px-2 text-xs sm:text-sm text-signal">&#10003;</td>
                                <td className="text-center px-1 sm:px-2 text-xs sm:text-sm text-signal">&#10003;</td>
                                <td className="text-center px-1 sm:px-2 text-xs sm:text-sm text-status-danger">&#10007;</td>
                              </tr>
                              <tr className="border-b border-white/[0.04]">
                                <td className="py-2 pr-2 text-xs sm:text-sm">User Interactions</td>
                                <td className="text-center px-1 sm:px-2 text-xs sm:text-sm text-signal">&#10003;</td>
                                <td className="text-center px-1 sm:px-2 text-xs sm:text-sm text-status-danger">&#10007;</td>
                                <td className="text-center px-1 sm:px-2 text-xs sm:text-sm text-status-danger">&#10007;</td>
                              </tr>
                              <tr className="border-b border-white/[0.04]">
                                <td className="py-2 pr-2 text-xs sm:text-sm">Batch Size</td>
                                <td className="text-center px-1 sm:px-2 text-xs sm:text-sm">1</td>
                                <td className="text-center px-1 sm:px-2 text-xs sm:text-sm">25</td>
                                <td className="text-center px-1 sm:px-2 text-xs sm:text-sm">100</td>
                              </tr>
                              <tr>
                                <td className="py-2 pr-2 text-xs sm:text-sm">Flush Interval</td>
                                <td className="text-center px-1 sm:px-2 text-xs sm:text-sm">1s</td>
                                <td className="text-center px-1 sm:px-2 text-xs sm:text-sm">2s</td>
                                <td className="text-center px-1 sm:px-2 text-xs sm:text-sm">5s</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* ================================================================
            FEATURE SHOWCASE
            ================================================================ */}
        <section className="mb-24">
          <div className="text-center mb-12 px-4 sm:px-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-signal/20 bg-signal-muted backdrop-blur-sm mb-4">
              <Target className="w-3 h-3 text-signal" />
              <span className="text-xs font-display font-semibold uppercase tracking-[0.06em] text-signal">
                Advanced Capabilities
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-4 text-text-primary">
              Beyond Basic Logging
            </h2>
            <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto">
              Comprehensive observability with intelligent automation and
              privacy protection
            </p>
          </div>
          <div className="px-3 sm:px-0">
            <FeatureShowcase />
          </div>
        </section>

        {/* ================================================================
            API REFERENCE — Glass cards with hover glow
            ================================================================ */}
        <section id="reference" className="mb-24">
          <div className="text-center mb-12 px-4 sm:px-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-signal/20 bg-signal-muted backdrop-blur-sm mb-4">
              <BookOpen className="w-3 h-3 text-signal" />
              <span className="text-xs font-display font-semibold uppercase tracking-[0.06em] text-signal">
                API Reference
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-4 text-text-primary">
              Complete API Documentation
            </h2>
            <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto">
              Comprehensive reference for all methods, options, and
              configuration
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: Rocket,
                title: "Core Methods",
                description: "Essential logging methods",
                color: "text-data",
                bgColor: "bg-data/5",
                methods: [
                  "logger.info(message, data?)",
                  "logger.warn(message, data?)",
                  "logger.error(message, error?)",
                  "logger.debug(message, data?)",
                ],
              },
              {
                icon: Bug,
                title: "Exception Handling",
                description: "Advanced error capture",
                color: "text-status-danger",
                bgColor: "bg-status-danger/5",
                methods: [
                  "captureException(error, context?)",
                  "captureMessage(message, level, data?)",
                  "addBreadcrumb(message, category?)",
                ],
              },
              {
                icon: Settings,
                title: "Context Management",
                description: "Global and scoped context",
                color: "text-signal",
                bgColor: "bg-signal/5",
                methods: [
                  "setContext(context)",
                  "clearContext()",
                  "withContext(context, callback)",
                ],
              },
              {
                icon: Activity,
                title: "Performance",
                description: "Performance monitoring methods",
                color: "text-data-bright",
                bgColor: "bg-data-bright/5",
                methods: [
                  "startTimer(name)",
                  "endTimer(name)",
                  "measureFunction(fn, name?)",
                ],
              },
              {
                icon: RefreshCw,
                title: "Lifecycle",
                description: "SDK lifecycle management",
                color: "text-status-warn",
                bgColor: "bg-status-warn/5",
                methods: [
                  "logger.flush()",
                  "logger.close()",
                  "logger.isEnabled()",
                ],
              },
              {
                icon: Workflow,
                title: "Configuration",
                description: "Runtime configuration",
                color: "text-text-secondary",
                bgColor: "bg-white/[0.03]",
                methods: [
                  "logger.setLogLevel(level)",
                  "logger.enable() / logger.disable()",
                  "logger.updateConfig(config)",
                ],
              },
            ].map((section, index) => (
              <Card
                key={index}
                className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] hover:border-signal/20 hover:bg-white/[0.05] transition-all duration-300"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-text-primary">
                    <section.icon className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${section.color}`} />
                    <span className="text-sm sm:text-base">{section.title}</span>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm text-text-secondary">
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <div className="space-y-2">
                    {section.methods.map((method, idx) => (
                      <code
                        key={idx}
                        className="text-xs sm:text-sm bg-bg-elevated px-2 py-1 rounded block break-all font-mono text-text-code"
                      >
                        {method}
                      </code>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ================================================================
            BEST PRACTICES — Observatory tokens
            ================================================================ */}
        <section className="mb-24">
          <div className="text-center mb-12 px-4 sm:px-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-signal/20 bg-signal-muted backdrop-blur-sm mb-4">
              <Lightbulb className="w-3 h-3 text-signal" />
              <span className="text-xs font-display font-semibold uppercase tracking-[0.06em] text-signal">
                Best Practices
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-4 text-text-primary">
              Production-Ready Implementation
            </h2>
            <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto">
              Follow these guidelines to maximize the value of
              auto-instrumentation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="space-y-6">
              <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-text-primary">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-signal flex-shrink-0" />
                    <span className="text-sm sm:text-base">Recommended Practices</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  {[
                    {
                      title: "Trust auto-instrumentation",
                      desc: "Let the SDK capture most events automatically - manual logging should be minimal",
                    },
                    {
                      title: "Set meaningful context",
                      desc: "Use setContext() to add user ID, feature flags, and business context",
                    },
                    {
                      title: "Configure by environment",
                      desc: "Use different log levels and capture settings for dev/staging/prod",
                    },
                    {
                      title: "Add breadcrumbs for complex flows",
                      desc: "Use breadcrumbs to trace user journeys through multi-step processes",
                    },
                    {
                      title: "Monitor bundle size impact",
                      desc: "The SDK is lightweight (~50KB) but monitor your bundle analyzer",
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-signal mt-1 flex-shrink-0" />
                      <div className="min-w-0">
                        <h4 className="font-semibold text-xs sm:text-sm text-text-primary">
                          {item.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-text-primary">
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-status-danger flex-shrink-0" />
                    <span className="text-sm sm:text-base">Common Pitfalls</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  {[
                    {
                      title: "Don\u2019t over-log manually",
                      desc: "Auto-capture handles most cases - excessive manual logging creates noise",
                    },
                    {
                      title: "Don\u2019t enable all features in production",
                      desc: "User interactions and console messages can be very verbose",
                    },
                    {
                      title: "Don\u2019t ignore privacy settings",
                      desc: "Review auto-sanitization settings and add custom filters if needed",
                    },
                    {
                      title: "Don\u2019t forget error boundaries",
                      desc: "Add React/Vue error boundaries for comprehensive error capture",
                    },
                    {
                      title: "Don\u2019t block initialization",
                      desc: "Initialize the SDK early but don\u2019t block app startup on SDK errors",
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-status-danger mt-1 flex-shrink-0" />
                      <div className="min-w-0">
                        <h4 className="font-semibold text-xs sm:text-sm text-text-primary">
                          {item.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ================================================================
            ROADMAP — Glass cards, Observatory status badges
            ================================================================ */}
        <section className="mb-24">
          <div className="text-center mb-12 px-4 sm:px-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-signal/20 bg-signal-muted backdrop-blur-sm mb-4">
              <GitBranch className="w-3 h-3 text-signal" />
              <span className="text-xs font-display font-semibold uppercase tracking-[0.06em] text-signal">
                Roadmap
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-4 text-text-primary">
              What&apos;s Coming Next
            </h2>
            <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto">
              Upcoming features and improvements to the Monita SDK
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: Smartphone,
                title: "React Native Support",
                description:
                  "Native crash reporting and performance monitoring for mobile apps",
                status: "In Progress",
                version: "v2.2",
                color: "text-signal",
                bgColor: "bg-signal/5",
                statusColor: "bg-signal/10 text-signal border-signal/20",
              },
              {
                icon: Rocket,
                title: "Expo Integration",
                description: "Seamless integration with Expo managed workflow",
                status: "Planned",
                version: "v2.3",
                color: "text-data",
                bgColor: "bg-data/5",
                statusColor: "bg-data/10 text-data border-data/20",
              },
              {
                icon: Eye,
                title: "Advanced Session Replay",
                description: "Visual session replay with privacy controls",
                status: "Research",
                version: "v2.4",
                color: "text-data-bright",
                bgColor: "bg-data-bright/5",
                statusColor: "bg-data-bright/10 text-data-bright border-data-bright/20",
              },
              {
                icon: Palette,
                title: "Custom Dashboard Widgets",
                description: "Build custom visualizations for your metrics",
                status: "Planned",
                version: "v2.5",
                color: "text-status-warn",
                bgColor: "bg-status-warn/5",
                statusColor: "bg-data/10 text-data border-data/20",
              },
              {
                icon: MessageCircle,
                title: "Slack/Teams Integrations",
                description: "Real-time alerts and notifications",
                status: "Planned",
                version: "v2.6",
                color: "text-pink-400",
                bgColor: "bg-pink-400/5",
                statusColor: "bg-data/10 text-data border-data/20",
              },
              {
                icon: Network,
                title: "GraphQL Request Tracing",
                description: "Detailed GraphQL query and mutation tracking",
                status: "Research",
                version: "v2.7",
                color: "text-data",
                bgColor: "bg-data/5",
                statusColor: "bg-data-bright/10 text-data-bright border-data-bright/20",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] hover:border-signal/20 hover:bg-white/[0.05] transition-all duration-300"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 ${item.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${item.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-sm sm:text-lg leading-tight text-text-primary">
                        {item.title}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge
                          variant="outline"
                          className="text-xs border-white/[0.08] text-text-secondary"
                        >
                          {item.version}
                        </Badge>
                        <Badge
                          className={`text-xs border ${item.statusColor}`}
                        >
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-xs sm:text-sm mt-3 leading-relaxed text-text-secondary">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* ================================================================
            RESOURCES — Glass cards with hover lift
            ================================================================ */}
        <section className="mb-24">
          <div className="text-center mb-12 px-4 sm:px-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-signal/20 bg-signal-muted backdrop-blur-sm mb-4">
              <BookOpen className="w-3 h-3 text-signal" />
              <span className="text-xs font-display font-semibold uppercase tracking-[0.06em] text-signal">
                Resources & Support
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-4 text-text-primary">
              Learn More
            </h2>
            <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto">
              Comprehensive documentation, examples, and community support
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: BookOpen,
                title: "Full Documentation",
                description: "Complete guides, tutorials, and API reference",
                color: "text-data",
                href: "https://loghive.vercel.app/sdk",
                label: "View Documentation",
              },
              {
                icon: Code,
                title: "Code Examples",
                description: "Real-world examples and integration patterns",
                color: "text-signal",
                href: "https://github.com/Stanwukong/loghive-sdk",
                label: "Browse Examples",
              },
              {
                icon: Github,
                title: "GitHub Repository",
                description: "Open source SDK and community contributions",
                color: "text-text-secondary",
                href: "https://github.com/loghive/sdk",
                label: "View on GitHub",
              },
              {
                icon: TrendingUp,
                title: "Changelog",
                description: "Latest updates and new features",
                color: "text-status-warn",
                href: "https://github.com/Stanwukong/loghive-sdk/blob/main/CHANGELOG.md",
                label: "View Changelog",
              },
              {
                icon: Heart,
                title: "Support",
                description: "Get help from our support team",
                color: "text-status-danger",
                href: "mailto:stanleyajanaku@gmail.com",
                label: "Contact Support",
              },
            ].map((resource, index) => (
              <Card
                key={index}
                className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] hover:border-signal/20 hover:bg-white/[0.05] hover:-translate-y-0.5 transition-all duration-300"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-text-primary">
                    <resource.icon className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${resource.color}`} />
                    <span className="text-sm sm:text-base">{resource.title}</span>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm text-text-secondary">
                    {resource.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button
                    variant="outline"
                    className="w-full text-xs sm:text-sm bg-white/[0.03] border-white/[0.08] hover:bg-signal/10 hover:border-signal/20 hover:text-signal transition-all duration-200"
                    asChild
                  >
                    <Link href={resource.href} target="_blank">
                      {resource.label}
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}

            {/* Commented out Discord community card preserved from original */}
            {/* <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-purple-500" />
                  <span>Discord Community</span>
                </CardTitle>
                <CardDescription>Join our developer community for support</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="https://discord.gg/loghive" target="_blank">
                    Join Discord
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card> */}
          </div>
        </section>

        {/* ================================================================
            FINAL CTA — Full-width glass section with signal gradient
            ================================================================ */}
        <section
          className="relative text-center py-16 rounded-3xl overflow-hidden"
        >
          {/* Background glass effect */}
          <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-md" />
          {/* Gradient border effect */}
          <div
            className="absolute inset-0 rounded-3xl"
            style={{
              border: "1px solid transparent",
              background:
                "linear-gradient(var(--bg-base), var(--bg-base)) padding-box, linear-gradient(135deg, var(--signal) 0%, transparent 40%, transparent 60%, var(--signal) 100%) border-box",
              opacity: 0.2,
            }}
          />
          {/* Radial glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, var(--signal-glow) 0%, transparent 70%)",
              opacity: 0.5,
            }}
          />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-signal/20 bg-signal-muted backdrop-blur-sm mb-6">
              <Rocket className="w-3 h-3 text-signal" />
              <span className="text-xs font-display font-semibold uppercase tracking-[0.06em] text-signal">
                Ready to Start?
              </span>
            </div>
            <h2 className="text-3xl font-display font-bold mb-4 text-text-primary">
              Start Auto-Capturing in 30 Seconds
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-8">
              Join thousands of developers who trust Monita SDK for comprehensive
              auto-instrumentation
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 px-4 sm:px-0">
              <Button
                variant="signal"
                size="lg"
                className="text-sm sm:text-base font-display font-bold w-full sm:w-auto"
                asChild
              >
                <Link href="/dashboard">
                  Get Started Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-sm sm:text-base bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] hover:border-signal/30 transition-all duration-200 w-full sm:w-auto"
              >
                Schedule Demo
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-sm sm:text-base text-text-secondary hover:text-text-primary w-full sm:w-auto"
                asChild
              >
                <Link
                  href="https://github.com/Stanwukong/loghive-sdk"
                  target="_blank"
                >
                  <Github className="mr-2 w-4 h-4" />
                  Star on GitHub
                </Link>
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-text-secondary px-4 sm:px-0">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-signal flex-shrink-0" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-signal flex-shrink-0" />
                <span>10,000 free events per month</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-signal flex-shrink-0" />
                <span>Zero-config auto-instrumentation</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
