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
import {
  ExternalLink,
  BookOpen,
  Zap,
  Shield,
  Terminal,
  Package,
  Rocket,
  CheckCircle2,
  Star,
  Github,
  Clock,
  Settings,
  Layers,
  ArrowRight,
  Activity,
  Eye,
  MousePointer,
  Network,
  Bug,
  Gauge,
  Globe,
  Lock,
  Sparkles,
  Brain,
  Fingerprint,
  GitBranch,
  ChevronRight,
  Radar,
  Timer,
  Cpu,
  FileCode,
  AlertTriangle,
  Hash,
  Heart,
  Copy,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { InteractiveDemo } from "@/components/sdk/interactive-demo";
import { CodeBlock } from "@/components/sdk/code-block";
import { FeatureShowcase } from "@/components/sdk/feature-showcase";

export default function SDKPage() {
  const [installCopied, setInstallCopied] = useState(false);

  const handleCopyInstall = async () => {
    await navigator.clipboard.writeText("npm install monita");
    setInstallCopied(true);
    setTimeout(() => setInstallCopied(false), 2000);
  };

  return (
    <div className="min-h-screen scrollbar-hide bg-bg-void">
      {/* ================================================================
          SECTION 1: HEADER — Sticky glassmorphism nav
          ================================================================ */}
      <header className="sticky top-0 z-50 glass-nav border-b border-border-faint">
        <div className="container mx-auto px-4 py-3.5 flex items-center justify-between">
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
                v1.2.2
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
          <nav className="hidden lg:flex items-center space-x-6">
            <a
              href="#quickstart"
              className="text-sm font-medium text-text-secondary hover:text-signal transition-colors duration-150"
            >
              Quick Start
            </a>
            <a
              href="#auto-instrumentation"
              className="text-sm font-medium text-text-secondary hover:text-signal transition-colors duration-150"
            >
              Features
            </a>
            <a
              href="#frameworks"
              className="text-sm font-medium text-text-secondary hover:text-signal transition-colors duration-150"
            >
              Frameworks
            </a>
            <a
              href="#api-reference"
              className="text-sm font-medium text-text-secondary hover:text-signal transition-colors duration-150"
            >
              API Reference
            </a>
          </nav>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Button variant="signal" size="sm" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, var(--signal) 50%, transparent 100%)",
            opacity: 0.15,
          }}
        />
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-12 max-w-6xl overflow-hidden scrollbar-hide">
        {/* ================================================================
            SECTION 2: HERO — Title, stats, install command, CTAs
            ================================================================ */}
        <div
          className="relative text-center mb-20 -mx-3 sm:-mx-4 px-3 sm:px-4 py-16 sm:py-24 overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, var(--bg-void) 0%, var(--bg-base) 50%, var(--bg-surface) 100%)",
          }}
        >
          <div className="absolute inset-0 bg-dot-grid opacity-30" />
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
                Full-Stack Observability SDK
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-[-0.03em] mb-6 px-2">
              <span className="text-text-primary">Monita SDK</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-3xl mx-auto mb-8 leading-relaxed px-4 sm:px-0">
              Auto-instrumentation, distributed tracing, PII protection, and resilient delivery
              in a single TypeScript package. Like Sentry + LogRocket, but with full control.
            </p>

            {/* Framework badges */}
            <div className="flex flex-wrap justify-center gap-2 mb-8 px-4 sm:px-0">
              {[
                { label: "TypeScript", icon: FileCode },
                { label: "React", icon: Layers },
                { label: "Next.js", icon: Globe },
              ].map((fw) => (
                <div
                  key={fw.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm"
                >
                  <fw.icon className="w-3.5 h-3.5 text-signal" />
                  <span className="text-xs font-medium text-text-primary">
                    {fw.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Key stats */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-10 text-xs sm:text-sm px-4 sm:px-0">
              <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                <Package className="w-3.5 h-3.5 text-data flex-shrink-0" />
                <span className="font-medium text-text-primary">~50KB</span>
                <span className="text-text-muted">gzipped</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                <Clock className="w-3.5 h-3.5 text-data-bright flex-shrink-0" />
                <span className="font-medium text-text-primary">{"<30s"}</span>
                <span className="text-text-muted">setup</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                <Zap className="w-3.5 h-3.5 text-signal flex-shrink-0" />
                <span className="font-medium text-text-primary">15+</span>
                <span className="text-text-muted">features</span>
              </div>
            </div>

            {/* Install command inline */}
            <div className="flex justify-center mb-10 px-4 sm:px-0">
              <button
                onClick={handleCopyInstall}
                className="flex items-center gap-3 px-5 py-3 rounded-lg bg-bg-void/80 border border-white/[0.08] hover:border-signal/30 transition-all duration-200 group cursor-pointer"
              >
                <Terminal className="w-4 h-4 text-text-muted" />
                <code className="font-mono text-sm text-text-primary">
                  npm install monita
                </code>
                <span className="text-text-muted group-hover:text-signal transition-colors">
                  {installCopied ? (
                    <CheckCircle2 className="w-4 h-4 text-signal" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </span>
              </button>
            </div>

            {/* CTAs */}
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
                <Link
                  href="https://github.com/Stanwukong/loghive-sdk"
                  target="_blank"
                >
                  <Github className="mr-2 w-4 h-4" />
                  View on GitHub
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-sm sm:text-base text-text-secondary hover:text-text-primary w-full sm:w-auto"
                asChild
              >
                <Link
                  href="https://npmjs.com/package/monita"
                  target="_blank"
                >
                  <Package className="mr-2 w-4 h-4" />
                  npm: monita
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* ================================================================
            SECTION 3: QUICK START — Framework tabs (Vanilla TS / React / Next.js)
            ================================================================ */}
        <section id="quickstart" className="mb-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-signal/20 bg-signal-muted backdrop-blur-sm mb-4">
              <Zap className="w-3 h-3 text-signal" />
              <span className="text-xs font-display font-semibold uppercase tracking-[0.06em] text-signal">
                Get Started
              </span>
            </div>
            <h2 className="text-3xl font-display font-bold mb-4 text-text-primary">
              Quick Start
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Three steps. Any framework. Under 30 seconds.
            </p>
          </div>

          <Tabs defaultValue="vanilla" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-3 gap-1 w-full max-w-lg bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                <TabsTrigger
                  value="vanilla"
                  className="flex items-center gap-1.5 py-2.5 text-xs sm:text-sm data-[state=active]:bg-signal/10 data-[state=active]:text-signal transition-all duration-200"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Vanilla TS</span>
                </TabsTrigger>
                <TabsTrigger
                  value="react"
                  className="flex items-center gap-1.5 py-2.5 text-xs sm:text-sm data-[state=active]:bg-signal/10 data-[state=active]:text-signal transition-all duration-200"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>React</span>
                </TabsTrigger>
                <TabsTrigger
                  value="nextjs"
                  className="flex items-center gap-1.5 py-2.5 text-xs sm:text-sm data-[state=active]:bg-signal/10 data-[state=active]:text-signal transition-all duration-200"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Next.js</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Vanilla TypeScript */}
            <TabsContent value="vanilla" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StepCard step={1} title="Install">
                  <CodeBlock
                    language="bash"
                    code="npm install monita"
                    showCopy
                    title="Terminal"
                  />
                  <div className="flex gap-2 mt-3 text-xs text-text-muted">
                    <span>Or:</span>
                    <code className="font-mono text-text-code">yarn add monita</code>
                    <code className="font-mono text-text-code">pnpm add monita</code>
                  </div>
                </StepCard>

                <StepCard step={2} title="Initialize">
                  <CodeBlock
                    language="typescript"
                    code={`import { Monita } from "monita";

const logger = new Monita({
  apiKey: "your-api-key",
  projectId: "your-project-id",
  environment: "production",
  serviceName: "my-web-app",
});`}
                    showCopy
                    title="app.ts"
                  />
                </StepCard>

                <StepCard step={3} title="Log">
                  <CodeBlock
                    language="typescript"
                    code={`// Manual logging (optional)
logger.info("User signed up", {
  plan: "pro",
});

// Auto-capture is already active:
// Errors, performance, network,
// page views, console, interactions`}
                    showCopy
                    title="usage.ts"
                  />
                </StepCard>
              </div>
            </TabsContent>

            {/* React */}
            <TabsContent value="react" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StepCard step={1} title="Install">
                  <CodeBlock
                    language="bash"
                    code="npm install monita @monita/react"
                    showCopy
                    title="Terminal"
                  />
                </StepCard>

                <StepCard step={2} title="Wrap Provider">
                  <CodeBlock
                    language="tsx"
                    code={`import { MonitaProvider } from "@monita/react";

function App() {
  return (
    <MonitaProvider config={{
      apiKey: "your-api-key",
      projectId: "your-project-id",
      environment: "production",
    }}>
      <YourApp />
    </MonitaProvider>
  );
}`}
                    showCopy
                    title="App.tsx"
                  />
                </StepCard>

                <StepCard step={3} title="Use Hooks">
                  <CodeBlock
                    language="tsx"
                    code={`import { useMonita, useLogError }
  from "@monita/react";

function Dashboard() {
  const logger = useMonita();
  const logError = useLogError();

  const handleClick = () => {
    logger.info("Button clicked");
  };

  return <button onClick={handleClick}>
    Track
  </button>;
}`}
                    showCopy
                    title="Dashboard.tsx"
                  />
                </StepCard>
              </div>
            </TabsContent>

            {/* Next.js */}
            <TabsContent value="nextjs" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StepCard step={1} title="Install">
                  <CodeBlock
                    language="bash"
                    code="npm install monita @monita/nextjs"
                    showCopy
                    title="Terminal"
                  />
                </StepCard>

                <StepCard step={2} title="Add Middleware">
                  <CodeBlock
                    language="typescript"
                    code={`// middleware.ts
import { withMonitaMiddleware }
  from "@monita/nextjs";
import { NextResponse } from "next/server";

const middleware = () => NextResponse.next();

export default withMonitaMiddleware(
  middleware,
  {
    apiKey: "your-api-key",
    projectId: "your-project-id",
  }
);`}
                    showCopy
                    title="middleware.ts"
                  />
                </StepCard>

                <StepCard step={3} title="Server Logger">
                  <CodeBlock
                    language="typescript"
                    code={`// app/api/users/route.ts
import { createServerLogger }
  from "@monita/nextjs";

const logger = createServerLogger({
  apiKey: "your-api-key",
  projectId: "your-project-id",
});

export async function GET() {
  logger.info("Users fetched");
  return Response.json({ ok: true });
}`}
                    showCopy
                    title="route.ts"
                  />
                </StepCard>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* ================================================================
            SECTION 4: AUTO-INSTRUMENTATION — 7 cards + Web Vitals deep dive
            ================================================================ */}
        <section id="auto-instrumentation" className="mb-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-signal/20 bg-signal-muted backdrop-blur-sm mb-4">
              <Brain className="w-3 h-3 text-signal" />
              <span className="text-xs font-display font-semibold uppercase tracking-[0.06em] text-signal">
                Auto-Instrumentation
              </span>
            </div>
            <h2 className="text-3xl font-display font-bold mb-4 text-text-primary">
              7 Categories. Zero Config.
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Everything captured automatically. Toggle each category on or off.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                icon: Bug,
                title: "Errors",
                desc: "window.onerror, unhandledrejection, full stack traces",
                color: "text-status-danger",
                bg: "bg-status-danger/5",
                config: "errors: true",
              },
              {
                icon: Gauge,
                title: "Performance",
                desc: "PerformanceObserver for navigation, resource, paint timing",
                color: "text-data",
                bg: "bg-data/5",
                config: "performance: true",
              },
              {
                icon: Activity,
                title: "Web Vitals",
                desc: "LCP, CLS, INP with good/needs-improvement/poor ratings",
                color: "text-signal",
                bg: "bg-signal/5",
                config: "performance: true",
              },
              {
                icon: Network,
                title: "Network",
                desc: "fetch/XHR interception with timing, status, request/response size",
                color: "text-data-bright",
                bg: "bg-data-bright/5",
                config: "networkRequests: true",
              },
              {
                icon: Terminal,
                title: "Console",
                desc: "console.error() and console.warn() capture with arguments",
                color: "text-status-warn",
                bg: "bg-status-warn/5",
                config: "consoleMessages: true",
              },
              {
                icon: Globe,
                title: "Page Views",
                desc: "SPA route change detection via History API patching",
                color: "text-level-info",
                bg: "bg-level-info/5",
                config: "pageViews: true",
              },
              {
                icon: MousePointer,
                title: "Interactions",
                desc: "Click/scroll tracking with CSS selectors, not text content",
                color: "text-data",
                bg: "bg-data/5",
                config: "userInteractions: true",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] hover:border-signal/20 hover:bg-white/[0.05] transition-all duration-300"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className={`w-9 h-9 ${feature.bg} rounded-lg flex items-center justify-center`}
                    >
                      <feature.icon className={`w-4.5 h-4.5 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-sm text-text-primary">
                      {feature.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs text-text-secondary leading-relaxed">
                    {feature.desc}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <code className="text-[10px] font-mono text-text-code bg-bg-elevated/50 px-2 py-1 rounded block">
                    {feature.config}
                  </code>
                </CardContent>
              </Card>
            ))}

            {/* Web Vitals deep dive card -- spans the last column */}
            <Card className="bg-white/[0.03] backdrop-blur-md border border-signal/10 relative overflow-hidden">
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, var(--signal) 50%, transparent 100%)",
                  opacity: 0.3,
                }}
              />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-text-primary font-display flex items-center gap-2">
                  <Radar className="w-4 h-4 text-signal" />
                  Web Vitals Thresholds
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {[
                  {
                    metric: "LCP",
                    good: "< 2.5s",
                    mid: "2.5-4s",
                    poor: "> 4s",
                  },
                  {
                    metric: "CLS",
                    good: "< 0.1",
                    mid: "0.1-0.25",
                    poor: "> 0.25",
                  },
                  {
                    metric: "INP",
                    good: "< 200ms",
                    mid: "200-500ms",
                    poor: "> 500ms",
                  },
                ].map((v) => (
                  <div key={v.metric} className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-semibold text-text-primary w-8">
                      {v.metric}
                    </span>
                    <span className="text-rating-good">{v.good}</span>
                    <span className="text-text-muted">/</span>
                    <span className="text-rating-needs-improvement">{v.mid}</span>
                    <span className="text-text-muted">/</span>
                    <span className="text-rating-poor">{v.poor}</span>
                  </div>
                ))}
                <p className="text-[10px] text-text-muted pt-1">
                  Each metric auto-rated. Data includes URL, element, and navigation type.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Configuration example */}
          <div className="max-w-2xl mx-auto">
            <CodeBlock
              language="typescript"
              code={`const logger = new Monita({
  apiKey: "your-api-key",
  projectId: "your-project-id",
  autoCapture: {
    errors: true,              // Uncaught errors + promise rejections
    performance: true,         // Navigation, resource, paint timing + Web Vitals
    networkRequests: true,     // fetch/XHR with timing and size
    pageViews: true,           // SPA route changes via History API
    consoleMessages: false,    // console.error/warn (can be noisy)
    userInteractions: false,   // click/scroll tracking (verbose)
  },
});`}
              showCopy
              title="auto-capture-config.ts"
            />
          </div>
        </section>

        {/* ================================================================
            SECTION 5: DISTRIBUTED TRACING
            ================================================================ */}
        <section id="tracing" className="mb-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-signal/20 bg-signal-muted backdrop-blur-sm mb-4">
              <GitBranch className="w-3 h-3 text-signal" />
              <span className="text-xs font-display font-semibold uppercase tracking-[0.06em] text-signal">
                Distributed Tracing
              </span>
            </div>
            <h2 className="text-3xl font-display font-bold mb-4 text-text-primary">
              Trace Requests Across Services
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              W3C Trace Context propagation. Start spans, link operations, and follow requests
              from browser to backend.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
              <CardHeader>
                <CardTitle className="text-text-primary font-display flex items-center gap-2">
                  <Timer className="w-4 h-4 text-signal" />
                  Span API
                </CardTitle>
                <CardDescription className="text-text-secondary">
                  Create spans to measure operations and propagate context
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  language="typescript"
                  code={`// Start a span for a database query
const spanId = logger.startSpan("db-query", {
  db: "users",
  operation: "findById",
});

// ... perform the operation ...
const user = await db.users.findById(id);

// End the span (duration auto-calculated)
logger.endSpan(spanId);

// Nested spans for complex operations
const parentSpan = logger.startSpan("checkout");
  const validateSpan = logger.startSpan("validate-cart");
  // ... validate ...
  logger.endSpan(validateSpan);

  const paymentSpan = logger.startSpan("process-payment");
  // ... charge ...
  logger.endSpan(paymentSpan);
logger.endSpan(parentSpan);`}
                  showCopy
                  title="tracing.ts"
                />
              </CardContent>
            </Card>

            <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
              <CardHeader>
                <CardTitle className="text-text-primary font-display flex items-center gap-2">
                  <Network className="w-4 h-4 text-data" />
                  W3C Trace Propagation
                </CardTitle>
                <CardDescription className="text-text-secondary">
                  Automatic traceparent header injection and extraction across HTTP boundaries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <CodeBlock
                  language="typescript"
                  code={`// TracePropagator automatically injects
// W3C traceparent headers into outgoing requests:
//
// traceparent: 00-{traceId}-{spanId}-01
//
// This links frontend spans to backend spans,
// enabling full request waterfall visualization.

// The SDK patches fetch() to auto-inject headers.
// No manual instrumentation needed.`}
                  showCopy
                  title="propagation.ts"
                />

                {/* Visual waterfall concept */}
                <div className="space-y-1.5 pt-2">
                  <p className="text-xs text-text-muted font-medium uppercase tracking-wider mb-2">
                    Request Waterfall
                  </p>
                  {[
                    { label: "Browser: checkout", width: "100%", color: "bg-signal/40" },
                    { label: "  API: /api/orders", width: "75%", color: "bg-data/40" },
                    { label: "    DB: insert order", width: "40%", color: "bg-data-bright/40" },
                    { label: "    Stripe: charge", width: "55%", color: "bg-status-warn/40" },
                  ].map((span, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-text-muted w-36 truncate">
                        {span.label}
                      </span>
                      <div className="flex-1 h-4 rounded bg-white/[0.02]">
                        <div
                          className={`h-full rounded ${span.color}`}
                          style={{ width: span.width }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ================================================================
            SECTION 6: PRIVACY & DATA PROTECTION
            ================================================================ */}
        <section id="privacy" className="mb-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-signal/20 bg-signal-muted backdrop-blur-sm mb-4">
              <Shield className="w-3 h-3 text-signal" />
              <span className="text-xs font-display font-semibold uppercase tracking-[0.06em] text-signal">
                Privacy & Data Protection
              </span>
            </div>
            <h2 className="text-3xl font-display font-bold mb-4 text-text-primary">
              Built-In PII Protection
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              9 built-in patterns, 3 presets, custom rules, and a full audit trail.
              GDPR-friendly by default.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* PII patterns table */}
            <Card className="lg:col-span-1 bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
              <CardHeader>
                <CardTitle className="text-text-primary font-display text-base flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-signal" />
                  Built-in Patterns
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {[
                    "Email addresses",
                    "Phone numbers",
                    "Social Security Numbers",
                    "Credit card numbers",
                    "IP addresses",
                    "JWT tokens",
                    "API keys",
                    "Password fields",
                    "Dates of birth",
                  ].map((pattern, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm text-text-secondary"
                    >
                      <CheckCircle2 className="w-3 h-3 text-signal flex-shrink-0" />
                      <span>{pattern}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Presets comparison */}
            <Card className="lg:col-span-1 bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
              <CardHeader>
                <CardTitle className="text-text-primary font-display text-base flex items-center gap-2">
                  <Settings className="w-4 h-4 text-data" />
                  Presets
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {[
                  {
                    name: "STRICT",
                    desc: "All 9 patterns + URL sanitization",
                    badge: "text-status-ok border-status-ok/20 bg-status-ok/10",
                  },
                  {
                    name: "BALANCED",
                    desc: "Email, phone, SSN, credit card, passwords",
                    badge: "text-data border-data/20 bg-data/10",
                  },
                  {
                    name: "LENIENT",
                    desc: "Only passwords and credit cards",
                    badge: "text-status-warn border-status-warn/20 bg-status-warn/10",
                  },
                ].map((preset) => (
                  <div
                    key={preset.name}
                    className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                  >
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono mb-1.5 ${preset.badge}`}
                    >
                      {preset.name}
                    </Badge>
                    <p className="text-xs text-text-secondary">{preset.desc}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Code example */}
            <Card className="lg:col-span-1 bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
              <CardHeader>
                <CardTitle className="text-text-primary font-display text-base flex items-center gap-2">
                  <Lock className="w-4 h-4 text-data-bright" />
                  Custom Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CodeBlock
                  language="typescript"
                  code={`const logger = new Monita({
  apiKey: "your-api-key",
  projectId: "your-project-id",
  sanitization: {
    preset: "BALANCED",
    customRules: [
      {
        pattern: /ACCT-\\d{8}/g,
        replacement: "[ACCOUNT_ID]",
      },
    ],
  },
});

// Audit trail access:
const trail = logger
  .getSanitizationAuditTrail();
// [{field, pattern, action, ts}]`}
                  showCopy
                  title="sanitization.ts"
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ================================================================
            SECTION 7: RESILIENCE & RELIABILITY (FeatureShowcase)
            ================================================================ */}
        <section id="resilience" className="mb-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-signal/20 bg-signal-muted backdrop-blur-sm mb-4">
              <Shield className="w-3 h-3 text-signal" />
              <span className="text-xs font-display font-semibold uppercase tracking-[0.06em] text-signal">
                Resilience & Reliability
              </span>
            </div>
            <h2 className="text-3xl font-display font-bold mb-4 text-text-primary">
              Built to Never Drop Logs
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Circuit breaker, offline queue, payload compression, and real-time health metrics
            </p>
          </div>
          <FeatureShowcase />
        </section>

        {/* ================================================================
            SECTION 8: ADVANCED CAPABILITIES
            ================================================================ */}
        <section id="advanced" className="mb-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-signal/20 bg-signal-muted backdrop-blur-sm mb-4">
              <Cpu className="w-3 h-3 text-signal" />
              <span className="text-xs font-display font-semibold uppercase tracking-[0.06em] text-signal">
                Advanced Capabilities
              </span>
            </div>
            <h2 className="text-3xl font-display font-bold mb-4 text-text-primary">
              Beyond Basic Logging
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Pattern detection, remote configuration, breadcrumbs, and the enhanced logger factory
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pattern Detection */}
            <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
              <CardHeader>
                <CardTitle className="text-text-primary font-display flex items-center gap-2">
                  <Radar className="w-4 h-4 text-status-danger" />
                  Pattern Detection
                </CardTitle>
                <CardDescription className="text-text-secondary">
                  Detects recurring errors and error spikes in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  language="typescript"
                  code={`const logger = new Monita({
  apiKey: "your-api-key",
  projectId: "your-project-id",
  patternDetection: {
    recurringErrors: {
      window: 60000,       // 1 minute window
      threshold: 5,        // 5 occurrences
    },
    errorSpikes: {
      baselineWindow: 300000, // 5 min baseline
      spikeMultiplier: 3,    // 3x normal rate
    },
  },
  onPatternDetected: (pattern) => {
    console.warn("Pattern:", pattern.type);
    // "recurring-error" | "error-spike"
  },
});`}
                  showCopy
                  title="pattern-detection.ts"
                />
              </CardContent>
            </Card>

            {/* Remote Config */}
            <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
              <CardHeader>
                <CardTitle className="text-text-primary font-display flex items-center gap-2">
                  <Settings className="w-4 h-4 text-data" />
                  Remote Configuration
                </CardTitle>
                <CardDescription className="text-text-secondary">
                  Change log level, sampling rate, and auto-capture toggles without redeploying
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  language="typescript"
                  code={`const logger = new Monita({
  apiKey: "your-api-key",
  projectId: "your-project-id",

  // Remote config polling
  remoteConfigUrl: "https://your-api/config",
  remoteConfigInterval: 300000, // 5 minutes

  // Changes applied at runtime:
  // - Log level (trace -> warn)
  // - Sampling rate (100% -> 10%)
  // - Auto-capture toggles
  // - Custom rules
  // No restart needed!
});`}
                  showCopy
                  title="remote-config.ts"
                />
              </CardContent>
            </Card>

            {/* Breadcrumbs */}
            <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
              <CardHeader>
                <CardTitle className="text-text-primary font-display flex items-center gap-2">
                  <Hash className="w-4 h-4 text-data-bright" />
                  Breadcrumb Manager
                </CardTitle>
                <CardDescription className="text-text-secondary">
                  Trail of last 50 actions with environment snapshots, auto-attached to error reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  language="typescript"
                  code={`// Add breadcrumbs manually
logger.addBreadcrumb(
  "User clicked checkout",
  "user-action",
  { cartItems: 3, total: 99.99 }
);

logger.addBreadcrumb(
  "Navigated to /checkout",
  "navigation"
);

logger.addBreadcrumb(
  "POST /api/orders succeeded",
  "network",
  { status: 201, duration: 342 }
);

// Breadcrumbs auto-included in error reports
// Categories: user-action, navigation,
// network, console, error, custom`}
                  showCopy
                  title="breadcrumbs.ts"
                />
              </CardContent>
            </Card>

            {/* Enhanced Logger Factory */}
            <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
              <CardHeader>
                <CardTitle className="text-text-primary font-display flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-signal" />
                  Enhanced Logger Factory
                </CardTitle>
                <CardDescription className="text-text-secondary">
                  All advanced managers in one call: context, sessions, custom events, feature flags, A/B testing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  language="typescript"
                  code={`import { createEnhancedLogger } from "monita";

const {
  logger,
  contextManager,   // Scoped context management
  sessionManager,   // Auto session tracking
  eventTracker,     // Custom business events
  featureFlagLogger,// Feature flag tracking
  abTestLogger,     // A/B test variant logging
  performanceMonitor,// Custom perf measurements
} = createEnhancedLogger({
  apiKey: "your-api-key",
  projectId: "your-project-id",
});

// Track business events
eventTracker.track("purchase", {
  amount: 99.99, plan: "pro"
});

// Log A/B test variants
abTestLogger.logVariant(
  "pricing-test", "variant-b"
);`}
                  showCopy
                  title="enhanced-logger.ts"
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ================================================================
            SECTION 8.5: INTERACTIVE DEMO
            ================================================================ */}
        <section id="demo" className="mb-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-signal/20 bg-signal-muted backdrop-blur-sm mb-4">
              <Activity className="w-3 h-3 text-signal" />
              <span className="text-xs font-display font-semibold uppercase tracking-[0.06em] text-signal">
                Interactive Demo
              </span>
            </div>
            <h2 className="text-3xl font-display font-bold mb-4 text-text-primary">
              Try It Live
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Send manual logs and simulate auto-captured events in real-time
            </p>
          </div>
          <InteractiveDemo />
        </section>

        {/* ================================================================
            SECTION 9: FRAMEWORK SDKs — @monita/react & @monita/nextjs
            ================================================================ */}
        <section id="frameworks" className="mb-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-signal/20 bg-signal-muted backdrop-blur-sm mb-4">
              <Layers className="w-3 h-3 text-signal" />
              <span className="text-xs font-display font-semibold uppercase tracking-[0.06em] text-signal">
                Framework SDKs
              </span>
            </div>
            <h2 className="text-3xl font-display font-bold mb-4 text-text-primary">
              First-Class Framework Support
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Dedicated packages for React and Next.js with idiomatic APIs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* @monita/react */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-data/10 rounded-xl flex items-center justify-center">
                  <Layers className="w-5 h-5 text-data" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-text-primary">
                    @monita/react
                  </h3>
                  <p className="text-xs text-text-secondary">
                    React Context Provider, hooks, and Error Boundary
                  </p>
                </div>
              </div>

              <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-text-primary">
                    MonitaProvider
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CodeBlock
                    language="tsx"
                    code={`import { MonitaProvider } from "@monita/react";

// Wrap your app root
<MonitaProvider config={{
  apiKey: "your-api-key",
  projectId: "your-project-id",
  environment: "production",
}}>
  <App />
</MonitaProvider>`}
                    showCopy
                    title="MonitaProvider.tsx"
                  />
                </CardContent>
              </Card>

              <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-text-primary">Hooks</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CodeBlock
                    language="tsx"
                    code={`import {
  useMonita,
  useLogError,
  useTrackEvent,
  usePerformance,
} from "@monita/react";

function MyComponent() {
  const logger = useMonita();       // Core logger
  const logError = useLogError();   // Error logging
  const track = useTrackEvent();    // Event tracking
  const perf = usePerformance();    // Perf measurement

  const handleSubmit = async () => {
    perf.start("form-submit");
    try {
      await submitForm();
      track("form_submitted", { form: "signup" });
    } catch (err) {
      logError(err, { form: "signup" });
    }
    perf.end("form-submit");
  };
}`}
                    showCopy
                    title="hooks.tsx"
                  />
                </CardContent>
              </Card>

              <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-text-primary">
                    MonitaErrorBoundary
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CodeBlock
                    language="tsx"
                    code={`import { MonitaErrorBoundary }
  from "@monita/react";

<MonitaErrorBoundary
  fallback={<ErrorPage />}
>
  <FeatureComponent />
</MonitaErrorBoundary>

// Automatically captures:
// - Error name, message, stack
// - Component tree (componentStack)
// - Breadcrumbs at time of crash`}
                    showCopy
                    title="ErrorBoundary.tsx"
                  />
                </CardContent>
              </Card>
            </div>

            {/* @monita/nextjs */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-signal/10 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-signal" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-text-primary">
                    @monita/nextjs
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Middleware wrapper, server logger, and API route handler
                  </p>
                </div>
              </div>

              <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-text-primary">
                    withMonitaMiddleware
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CodeBlock
                    language="typescript"
                    code={`// middleware.ts
import { withMonitaMiddleware }
  from "@monita/nextjs";
import { NextResponse } from "next/server";

const middleware = (request) => {
  return NextResponse.next();
};

export default withMonitaMiddleware(
  middleware,
  {
    apiKey: process.env.MONITA_API_KEY!,
    projectId: "your-project-id",
  }
);

// Automatically logs every request:
// method, path, status, duration, user-agent`}
                    showCopy
                    title="middleware.ts"
                  />
                </CardContent>
              </Card>

              <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-text-primary">
                    createServerLogger
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CodeBlock
                    language="typescript"
                    code={`// lib/logger.ts
import { createServerLogger }
  from "@monita/nextjs";

export const logger = createServerLogger({
  apiKey: process.env.MONITA_API_KEY!,
  projectId: "your-project-id",
  environment: process.env.NODE_ENV,
});

// Use in any server component or route:
import { logger } from "@/lib/logger";

export async function GET() {
  logger.info("Fetching users");
  const users = await db.users.findAll();
  return Response.json(users);
}`}
                    showCopy
                    title="server-logger.ts"
                  />
                </CardContent>
              </Card>

              <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-text-primary">
                    withMonita (Route Wrapper)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CodeBlock
                    language="typescript"
                    code={`import { withMonita } from "@monita/nextjs";

// Wraps route with auto error catching
export const GET = withMonita(
  async (request) => {
    const data = await fetchData();
    return Response.json(data);
  },
  {
    apiKey: process.env.MONITA_API_KEY!,
    projectId: "your-project-id",
  }
);

// Errors auto-captured with:
// route, method, headers, request body`}
                    showCopy
                    title="route-wrapper.ts"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 10: CONFIGURATION REFERENCE
            ================================================================ */}
        <section id="config" className="mb-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-signal/20 bg-signal-muted backdrop-blur-sm mb-4">
              <Settings className="w-3 h-3 text-signal" />
              <span className="text-xs font-display font-semibold uppercase tracking-[0.06em] text-signal">
                Configuration
              </span>
            </div>
            <h2 className="text-3xl font-display font-bold mb-4 text-text-primary">
              Full Configuration Reference
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Every option in LoggerConfig, documented
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <CodeBlock
              language="typescript"
              code={`interface LoggerConfig {
  // Required
  apiKey: string;                    // Your project API key
  projectId: string;                 // Your project ID

  // Identity & Environment
  environment?: string;              // "production" | "staging" | "development"
  serviceName?: string;              // Service identifier

  // Log Control
  minLogLevel?: LogLevel;            // Minimum level to capture (default: TRACE)
  batchSize?: number;                // Logs per batch (default: 10)
  flushInterval?: number;            // Flush interval in ms (default: 5000)
  maxRetries?: number;               // Max retry attempts (default: 3)
  maxBreadcrumbs?: number;           // Breadcrumb trail size (default: 50)

  // Auto-Capture
  autoCapture?: {
    errors?: boolean;                // Uncaught errors (default: true)
    performance?: boolean;           // Performance + Web Vitals (default: true)
    networkRequests?: boolean;       // fetch/XHR monitoring (default: true)
    pageViews?: boolean;             // SPA route changes (default: true)
    consoleMessages?: boolean;       // console.error/warn (default: false)
    userInteractions?: boolean;      // click/scroll tracking (default: false)
  };

  // Resilience
  circuitBreaker?: {
    failureThreshold?: number;       // Failures before open (default: 5)
    resetTimeout?: number;           // Recovery timeout ms (default: 30000)
    halfOpenRequests?: number;       // Probe requests (default: 1)
  };
  offlineQueue?: {
    maxSize?: number;                // Max queued logs (default: 500)
    priorityEviction?: boolean;      // Priority-based eviction (default: true)
  };
  compression?: boolean;             // Gzip payloads (default: false)

  // Privacy
  sanitization?: {
    preset?: "STRICT" | "BALANCED" | "LENIENT";
    customRules?: Array<{
      pattern: RegExp;
      replacement: string;
    }>;
  };

  // Pattern Detection
  patternDetection?: {
    recurringErrors?: { window: number; threshold: number };
    errorSpikes?: { baselineWindow: number; spikeMultiplier: number };
  };
  onPatternDetected?: (pattern: DetectedPattern) => void;

  // Remote Config
  remoteConfigUrl?: string;          // Config endpoint URL
  remoteConfigInterval?: number;     // Poll interval ms (default: 300000)

  // Callbacks
  onError?: (error: Error) => void;  // SDK error handler
  debug?: boolean;                   // Enable SDK debug logs (default: false)
}`}
              showCopy
              showLineNumbers
              title="LoggerConfig"
            />
          </div>
        </section>

        {/* ================================================================
            SECTION 11: API REFERENCE
            ================================================================ */}
        <section id="api-reference" className="mb-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-signal/20 bg-signal-muted backdrop-blur-sm mb-4">
              <BookOpen className="w-3 h-3 text-signal" />
              <span className="text-xs font-display font-semibold uppercase tracking-[0.06em] text-signal">
                API Reference
              </span>
            </div>
            <h2 className="text-3xl font-display font-bold mb-4 text-text-primary">
              Complete Method Reference
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Every method on the Monita logger instance, organized by domain
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Rocket,
                title: "Core Logging",
                color: "text-signal",
                bg: "bg-signal/5",
                methods: [
                  { sig: "trace(message, data?)", desc: "Trace-level log" },
                  { sig: "debug(message, data?)", desc: "Debug-level log" },
                  { sig: "info(message, data?)", desc: "Info-level log" },
                  { sig: "warn(message, data?)", desc: "Warning-level log" },
                  { sig: "error(message, error?)", desc: "Error-level log" },
                  { sig: "fatal(message, error?)", desc: "Fatal-level log" },
                ],
              },
              {
                icon: Bug,
                title: "Error Capture",
                color: "text-status-danger",
                bg: "bg-status-danger/5",
                methods: [
                  {
                    sig: "captureException(error, ctx?)",
                    desc: "Structured error capture",
                  },
                  {
                    sig: "captureMessage(msg, level, data?)",
                    desc: "Structured message",
                  },
                  {
                    sig: "addBreadcrumb(msg, cat?, data?)",
                    desc: "Add breadcrumb",
                  },
                ],
              },
              {
                icon: GitBranch,
                title: "Distributed Tracing",
                color: "text-data",
                bg: "bg-data/5",
                methods: [
                  {
                    sig: "startSpan(name, attrs?)",
                    desc: "Start a trace span",
                  },
                  { sig: "endSpan(spanId)", desc: "End a trace span" },
                ],
              },
              {
                icon: Settings,
                title: "Context",
                color: "text-data-bright",
                bg: "bg-data-bright/5",
                methods: [
                  { sig: "setContext(context)", desc: "Set global context" },
                  { sig: "clearContext()", desc: "Clear global context" },
                ],
              },
              {
                icon: Activity,
                title: "Lifecycle",
                color: "text-status-warn",
                bg: "bg-status-warn/5",
                methods: [
                  { sig: "flush()", desc: "Force flush buffer" },
                  { sig: "destroy()", desc: "Cleanup and shutdown" },
                ],
              },
              {
                icon: Eye,
                title: "Observability",
                color: "text-level-info",
                bg: "bg-level-info/5",
                methods: [
                  {
                    sig: "getHealthMetrics()",
                    desc: "SDK health stats",
                  },
                  {
                    sig: "getSanitizationAuditTrail()",
                    desc: "PII audit log",
                  },
                ],
              },
            ].map((section, index) => (
              <Card
                key={index}
                className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] hover:border-signal/20 hover:bg-white/[0.05] transition-all duration-300"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm text-text-primary">
                    <div
                      className={`w-7 h-7 ${section.bg} rounded-lg flex items-center justify-center`}
                    >
                      <section.icon className={`w-3.5 h-3.5 ${section.color}`} />
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-1.5">
                  {section.methods.map((method, idx) => (
                    <div key={idx}>
                      <code className="text-xs font-mono text-text-code bg-bg-elevated/50 px-2 py-1 rounded block break-all">
                        {method.sig}
                      </code>
                      <p className="text-[10px] text-text-muted mt-0.5 ml-2">
                        {method.desc}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ================================================================
            SECTION 12: RESOURCES & CTA
            ================================================================ */}
        <section className="mb-16">
          {/* Resources */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {[
              {
                icon: Github,
                title: "GitHub",
                desc: "Source code and issues",
                href: "https://github.com/Stanwukong/loghive-sdk",
                color: "text-text-secondary",
              },
              {
                icon: Package,
                title: "npm",
                desc: "Package registry",
                href: "https://npmjs.com/package/monita",
                color: "text-status-danger",
              },
              {
                icon: BookOpen,
                title: "Documentation",
                desc: "Full guides and reference",
                href: "https://loghive.vercel.app/sdk",
                color: "text-data",
              },
              {
                icon: Heart,
                title: "Support",
                desc: "Get help from the team",
                href: "mailto:stanleyajanaku@gmail.com",
                color: "text-signal",
              },
            ].map((resource, index) => (
              <Link
                key={index}
                href={resource.href}
                target="_blank"
                className="group"
              >
                <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] hover:border-signal/20 hover:bg-white/[0.05] hover:-translate-y-0.5 transition-all duration-300 h-full">
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-center gap-3">
                      <resource.icon className={`w-5 h-5 ${resource.color}`} />
                      <div>
                        <h3 className="font-display font-semibold text-sm text-text-primary group-hover:text-signal transition-colors">
                          {resource.title}
                        </h3>
                        <p className="text-xs text-text-muted">{resource.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-text-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Final CTA */}
          <div className="relative text-center py-16 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-md" />
            <div
              className="absolute inset-0 rounded-3xl"
              style={{
                border: "1px solid transparent",
                background:
                  "linear-gradient(var(--bg-base), var(--bg-base)) padding-box, linear-gradient(135deg, var(--signal) 0%, transparent 40%, transparent 60%, var(--signal) 100%) border-box",
                opacity: 0.2,
              }}
            />
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
                Full Observability in 30 Seconds
              </h2>
              <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-8">
                Install Monita SDK and start capturing errors, performance, network requests,
                and user interactions automatically.
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
                  <CheckCircle2 className="w-3.5 h-3.5 text-signal flex-shrink-0" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-signal flex-shrink-0" />
                  <span>10,000 free events / month</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-signal flex-shrink-0" />
                  <span>MIT licensed, open source</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ================================================================
   Step Card — Reusable numbered step wrapper for Quick Start
   ================================================================ */
function StepCard({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-text-primary">
          <div className="w-6 h-6 bg-signal rounded-full flex items-center justify-center text-bg-void text-xs font-bold font-mono flex-shrink-0">
            {step}
          </div>
          <span className="text-sm font-display">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}
