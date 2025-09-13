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
    <div className="min-h-screen scrollbar-hide bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 backdrop-blur-sm bg-background/95">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">Monita</span>
            </Link>
            <div className="flex items-center space-x-2 ml-4">
              <Badge variant="secondary" className="text-xs">
                <Package className="w-3 h-3 mr-1" />
                v1.0.1
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Star className="w-3 h-3 mr-1 text-yellow-500" />
                MIT
              </Badge>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="#quickstart"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Quick Start
            </a>
            <a
              href="#features"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Features
            </a>
            <a
              href="#examples"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Examples
            </a>
            <a
              href="#reference"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              API Reference
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="default" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-12 max-w-full overflow-hidden scrollbar-hide">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6">
            <Sparkles className="w-3 h-3 mr-1" />
            Zero-Config Auto-Instrumentation
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent px-2">
            Monita SDK
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Intelligent Logging
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed px-4 sm:px-0">
            A powerful, TypeScript-first logging SDK with automatic error
            tracking, performance monitoring, and user interaction capture.
            Similar to Sentry and LogRocket, but with full control over your
            data.
          </p>

          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-12 text-xs sm:text-sm px-4 sm:px-0">
            <div className="flex items-center space-x-2">
              <Bug className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 flex-shrink-0" />
              <span className="font-medium">Auto Error Tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              <Gauge className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
              <span className="font-medium">Performance Monitoring</span>
            </div>
            <div className="flex items-center space-x-2">
              <Network className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
              <span className="font-medium">Network Tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              <MousePointer className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
              <span className="font-medium">User Interactions</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 flex-shrink-0" />
              <span className="font-medium">Privacy-First</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-12 text-xs sm:text-sm px-4 sm:px-0">
            {/* <div className="flex items-center space-x-2">
              <Download className="w-4 h-4 text-green-500" />
              <span className="font-medium">500K+</span>
              <span className="text-muted-foreground">Downloads</span>
            </div> */}
            <div className="flex items-center space-x-2">
              <Package className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
              <span className="font-medium">~50KB</span>
              <span className="text-muted-foreground">Gzipped</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
              <span className="font-medium">{"<30s"}</span>
              <span className="text-muted-foreground">Setup Time</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 flex-shrink-0" />
              <span className="font-medium">Zero Config</span>
              <span className="text-muted-foreground">Required</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <Button size="lg" className="text-sm sm:text-base w-full sm:w-auto" asChild>
              <Link href="#quickstart">
                <Rocket className="mr-2 w-4 h-4" />
                Quick Start Guide
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-sm sm:text-base bg-transparent w-full sm:w-auto"
              asChild
            >
              <Link href="#demo">
                <Play className="mr-2 w-4 h-4" />
                Try Interactive Demo
              </Link>
            </Button>
            <Button size="lg" variant="ghost" className="text-sm sm:text-base w-full sm:w-auto" asChild>
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

        {/* Auto-Capture Features */}
        <section id="features" className="mb-24">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Brain className="w-3 h-3 mr-1" />
              Auto-Instrumentation
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              What Gets Captured Automatically
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
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
                color: "text-red-500",
                bgColor: "bg-red-500/10",
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
                color: "text-blue-500",
                bgColor: "bg-blue-500/10",
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
                color: "text-green-500",
                bgColor: "bg-green-500/10",
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
                color: "text-purple-500",
                bgColor: "bg-purple-500/10",
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
                color: "text-orange-500",
                bgColor: "bg-orange-500/10",
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
                color: "text-pink-500",
                bgColor: "bg-pink-500/10",
                features: [
                  "Click events",
                  "Scroll tracking",
                  "Form interactions",
                  "Element selectors",
                ],
              },
            ].map((feature, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 ${feature.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <feature.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${feature.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base sm:text-lg leading-tight">{feature.title}</CardTitle>
                      <Badge variant="outline" className="text-xs mt-1">
                        {feature.level}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-sm mt-3">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start text-xs sm:text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className="w-3 h-3 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section id="demo" className="mb-24">
          <div className="text-center mb-12 px-4 sm:px-0">
            <Badge variant="outline" className="mb-4">
              <Play className="w-3 h-3 mr-1" />
              Interactive Demo
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Try Monita Live</h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Experience auto-instrumentation in action. Trigger events and see
              real-time capture.
            </p>
          </div>
          <div className="px-3 sm:px-0">
            <InteractiveDemo />
          </div>
        </section>

        {/* Quick Start Section */}
        <section id="quickstart" className="mb-24">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Zap className="w-3 h-3 mr-1" />
              Zero-Config Setup
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Get Started in 30 Seconds
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Install, initialize, and start capturing events automatically
            </p>
          </div>

          <Tabs defaultValue="basic" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-2 gap-1 sm:gap-2 md:grid-cols-4 w-full max-w-full mb-4 px-2 sm:px-0">
                <TabsTrigger
                  value="basic"
                  className="flex items-center space-x-1 sm:space-x-2 py-2 sm:py-3 text-xs sm:text-sm"
                >
                  <Rocket className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">Basic Setup</span>
                </TabsTrigger>
                <TabsTrigger
                  value="advanced"
                  className="flex items-center space-x-1 sm:space-x-2 py-2 sm:py-3 text-xs sm:text-sm"
                >
                  <Settings className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">Advanced</span>
                </TabsTrigger>
                <TabsTrigger
                  value="frameworks"
                  className="flex items-center space-x-1 sm:space-x-2 py-2 sm:py-3 text-xs sm:text-sm"
                >
                  <Layers className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">Frameworks</span>
                </TabsTrigger>
                <TabsTrigger
                  value="environments"
                  className="flex items-center space-x-1 sm:space-x-2 py-2 sm:py-3 text-xs sm:text-sm"
                >
                  <Globe className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">Environments</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="basic" className="space-y-8 mt-4 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
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
                      <div className="flex gap-2 mt-3 text-sm text-muted-foreground">
                        <span>Or:</span>
                        <code className="bg-muted px-1 rounded">
                          yarn add monita
                        </code>
                        <code className="bg-muted px-1 rounded">
                          pnpm add monita
                        </code>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
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

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
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
                  <Alert>
                    <Sparkles className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Zero Configuration Required!</strong> The SDK
                      automatically starts capturing errors, performance
                      metrics, network requests, and page views as soon as you
                      initialize it.
                    </AlertDescription>
                  </Alert>

                  <Card>
                    <CardHeader>
                      <CardTitle>What Happens Automatically</CardTitle>
                      <CardDescription>
                        Events captured without any additional code
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Bug className="w-4 h-4 text-red-500" />
                          <div>
                            <h4 className="font-semibold text-sm">
                              Error Tracking
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              Uncaught exceptions and promise rejections
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Gauge className="w-4 h-4 text-blue-500" />
                          <div>
                            <h4 className="font-semibold text-sm">
                              Performance Monitoring
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              Core Web Vitals, page load times
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Network className="w-4 h-4 text-green-500" />
                          <div>
                            <h4 className="font-semibold text-sm">
                              Network Requests
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              Fetch/XHR monitoring with timing
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Globe className="w-4 h-4 text-purple-500" />
                          <div>
                            <h4 className="font-semibold text-sm">
                              Page Views
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              Navigation and SPA route changes
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Bundle Impact</CardTitle>
                      <CardDescription>
                        Lightweight and performant
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <Package className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                          <div className="font-semibold">~50KB</div>
                          <div className="text-xs text-muted-foreground">
                            Gzipped
                          </div>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <Activity className="w-6 h-6 mx-auto mb-2 text-green-500" />
                          <div className="font-semibold">Minimal</div>
                          <div className="text-xs text-muted-foreground">
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
                  <Card>
                    <CardHeader>
                      <CardTitle>Auto-Capture Configuration</CardTitle>
                      <CardDescription>
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

                  <Card>
                    <CardHeader>
                      <CardTitle>Context Management</CardTitle>
                      <CardDescription>
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
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Optimization</CardTitle>
                      <CardDescription>
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

                  <Card>
                    <CardHeader>
                      <CardTitle>Privacy & Security</CardTitle>
                      <CardDescription>
                        Built-in data protection
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <Lock className="w-4 h-4 text-green-500 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-sm">
                              URL Sanitization
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              Removes token, key, password, secret query
                              parameters
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Fingerprint className="w-4 h-4 text-green-500 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-sm">
                              Form Protection
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              Keyboard events don&apos;t capture actual
                              keystrokes
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Eye className="w-4 h-4 text-green-500 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-sm">
                              Element Safety
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              Uses CSS selectors, not text content
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Database className="w-4 h-4 text-green-500 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-sm">
                              No Storage
                            </h4>
                            <p className="text-xs text-muted-foreground">
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
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                          <Layers className="w-4 h-4 text-blue-500" />
                        </div>
                        <span>React Integration</span>
                      </CardTitle>
                      <CardDescription>
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

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                          <Zap className="w-4 h-4 text-green-500" />
                        </div>
                        <span>Vue.js Integration</span>
                      </CardTitle>
                      <CardDescription>
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
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                          <Server className="w-4 h-4 text-purple-500" />
                        </div>
                        <span>Next.js Integration</span>
                      </CardTitle>
                      <CardDescription>
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

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                          <Smartphone className="w-4 h-4 text-orange-500" />
                        </div>
                        <span>React Native (Coming Soon)</span>
                      </CardTitle>
                      <CardDescription>
                        Mobile app monitoring and crash reporting
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <Rocket className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="font-semibold mb-2">
                          React Native Support
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Full React Native support is coming soon with native
                          crash reporting and performance monitoring.
                        </p>
                        <Badge variant="outline">
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
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                          <Code className="w-4 h-4 text-blue-500" />
                        </div>
                        <span>Development Configuration</span>
                      </CardTitle>
                      <CardDescription>
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

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                          <TestTube className="w-4 h-4 text-yellow-500" />
                        </div>
                        <span>Staging Configuration</span>
                      </CardTitle>
                      <CardDescription>
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
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                          <Shield className="w-4 h-4 text-green-500" />
                        </div>
                        <span>Production Configuration</span>
                      </CardTitle>
                      <CardDescription>
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

                  <Card>
                    <CardHeader>
                      <CardTitle>Environment Comparison</CardTitle>
                      <CardDescription>
                        Configuration differences at a glance
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <div className="min-w-full px-4 sm:px-0">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 pr-2">Setting</th>
                                <th className="text-center py-2 px-1 sm:px-2">Dev</th>
                                <th className="text-center py-2 px-1 sm:px-2">Staging</th>
                                <th className="text-center py-2 px-1 sm:px-2">Prod</th>
                              </tr>
                            </thead>
                            <tbody className="space-y-2">
                              <tr className="border-b">
                                <td className="py-2 pr-2 text-xs sm:text-sm">Min Log Level</td>
                                <td className="text-center px-1 sm:px-2 text-xs sm:text-sm">DEBUG</td>
                                <td className="text-center px-1 sm:px-2 text-xs sm:text-sm">INFO</td>
                                <td className="text-center px-1 sm:px-2 text-xs sm:text-sm">WARN</td>
                              </tr>
                              <tr className="border-b">
                                <td className="py-2 pr-2 text-xs sm:text-sm">Console Messages</td>
                                <td className="text-center px-1 sm:px-2 text-xs sm:text-sm">✅</td>
                                <td className="text-center px-1 sm:px-2 text-xs sm:text-sm">✅</td>
                                <td className="text-center px-1 sm:px-2 text-xs sm:text-sm">❌</td>
                              </tr>
                              <tr className="border-b">
                                <td className="py-2 pr-2 text-xs sm:text-sm">User Interactions</td>
                                <td className="text-center px-1 sm:px-2 text-xs sm:text-sm">✅</td>
                                <td className="text-center px-1 sm:px-2 text-xs sm:text-sm">❌</td>
                                <td className="text-center px-1 sm:px-2 text-xs sm:text-sm">❌</td>
                              </tr>
                              <tr className="border-b">
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

        {/* Feature Showcase */}
        <section className="mb-24">
          <div className="text-center mb-12 px-4 sm:px-0">
            <Badge variant="outline" className="mb-4">
              <Target className="w-3 h-3 mr-1" />
              Advanced Capabilities
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Beyond Basic Logging</h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Comprehensive observability with intelligent automation and
              privacy protection
            </p>
          </div>
          <div className="px-3 sm:px-0">
            <FeatureShowcase />
          </div>
        </section>

        {/* API Reference */}
        <section id="reference" className="mb-24">
          <div className="text-center mb-12 px-4 sm:px-0">
            <Badge variant="outline" className="mb-4">
              <BookOpen className="w-3 h-3 mr-1" />
              API Reference
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Complete API Documentation
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Comprehensive reference for all methods, options, and
              configuration
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                  <span className="text-sm sm:text-base">Core Methods</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Essential logging methods</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <div className="space-y-2">
                  <code className="text-xs sm:text-sm bg-muted px-2 py-1 rounded block break-all">
                    logger.info(message, data?)
                  </code>
                  <code className="text-xs sm:text-sm bg-muted px-2 py-1 rounded block break-all">
                    logger.warn(message, data?)
                  </code>
                  <code className="text-xs sm:text-sm bg-muted px-2 py-1 rounded block break-all">
                    logger.error(message, error?)
                  </code>
                  <code className="text-xs sm:text-sm bg-muted px-2 py-1 rounded block break-all">
                    logger.debug(message, data?)
                  </code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  <Bug className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
                  <span className="text-sm sm:text-base">Exception Handling</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Advanced error capture</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <div className="space-y-2">
                  <code className="text-xs sm:text-sm bg-muted px-2 py-1 rounded block break-all">
                    captureException(error, context?)
                  </code>
                  <code className="text-xs sm:text-sm bg-muted px-2 py-1 rounded block break-all">
                    captureMessage(message, level, data?)
                  </code>
                  <code className="text-xs sm:text-sm bg-muted px-2 py-1 rounded block break-all">
                    addBreadcrumb(message, category?)
                  </code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm sm:text-base">Context Management</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Global and scoped context</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <div className="space-y-2">
                  <code className="text-xs sm:text-sm bg-muted px-2 py-1 rounded block break-all">
                    setContext(context)
                  </code>
                  <code className="text-xs sm:text-sm bg-muted px-2 py-1 rounded block break-all">
                    clearContext()
                  </code>
                  <code className="text-xs sm:text-sm bg-muted px-2 py-1 rounded block break-all">
                    withContext(context, callback)
                  </code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 flex-shrink-0" />
                  <span className="text-sm sm:text-base">Performance</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Performance monitoring methods
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <div className="space-y-2">
                  <code className="text-xs sm:text-sm bg-muted px-2 py-1 rounded block break-all">
                    startTimer(name)
                  </code>
                  <code className="text-xs sm:text-sm bg-muted px-2 py-1 rounded block break-all">
                    endTimer(name)
                  </code>
                  <code className="text-xs sm:text-sm bg-muted px-2 py-1 rounded block break-all">
                    measureFunction(fn, name?)
                  </code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                  <span className="text-sm sm:text-base">Lifecycle</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">SDK lifecycle management</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <div className="space-y-2">
                  <code className="text-xs sm:text-sm bg-muted px-2 py-1 rounded block break-all">
                    logger.flush()
                  </code>
                  <code className="text-xs sm:text-sm bg-muted px-2 py-1 rounded block break-all">
                    logger.close()
                  </code>
                  <code className="text-xs sm:text-sm bg-muted px-2 py-1 rounded block break-all">
                    logger.isEnabled()
                  </code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  <Workflow className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                  <span className="text-sm sm:text-base">Configuration</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Runtime configuration</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <div className="space-y-2">
                  <code className="text-xs sm:text-sm bg-muted px-2 py-1 rounded block break-all">
                    logger.setLogLevel(level)
                  </code>
                  <code className="text-xs sm:text-sm bg-muted px-2 py-1 rounded block break-all">
                    logger.enable() / logger.disable()
                  </code>
                  <code className="text-xs sm:text-sm bg-muted px-2 py-1 rounded block break-all">
                    logger.updateConfig(config)
                  </code>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Best Practices */}
        <section className="mb-24">
          <div className="text-center mb-12 px-4 sm:px-0">
            <Badge variant="outline" className="mb-4">
              <Lightbulb className="w-3 h-3 mr-1" />
              Best Practices
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Production-Ready Implementation
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Follow these guidelines to maximize the value of
              auto-instrumentation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Recommended Practices</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs sm:text-sm">
                        Trust auto-instrumentation
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Let the SDK capture most events automatically - manual
                        logging should be minimal
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs sm:text-sm">
                        Set meaningful context
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Use setContext() to add user ID, feature flags, and
                        business context
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs sm:text-sm">
                        Configure by environment
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Use different log levels and capture settings for
                        dev/staging/prod
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs sm:text-sm">
                        Add breadcrumbs for complex flows
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Use breadcrumbs to trace user journeys through
                        multi-step processes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs sm:text-sm">
                        Monitor bundle size impact
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        The SDK is lightweight (~50KB) but monitor your bundle
                        analyzer
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Common Pitfalls</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs sm:text-sm">
                        Don&apos;t over-log manually
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Auto-capture handles most cases - excessive manual
                        logging creates noise
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs sm:text-sm">
                        Don&apos;t enable all features in production
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        User interactions and console messages can be very
                        verbose
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs sm:text-sm">
                        Don&apos;t ignore privacy settings
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Review auto-sanitization settings and add custom filters
                        if needed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs sm:text-sm">
                        Don&apos;t forget error boundaries
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Add React/Vue error boundaries for comprehensive error
                        capture
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs sm:text-sm">
                        Don&apos;t block initialization
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Initialize the SDK early but don&apos;t block app
                        startup on SDK errors
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="mb-24">
          <div className="text-center mb-12 px-4 sm:px-0">
            <Badge variant="outline" className="mb-4">
              <GitBranch className="w-3 h-3 mr-1" />
              Roadmap
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">What&apos;s Coming Next</h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
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
                color: "text-blue-500",
                bgColor: "bg-blue-500/10",
              },
              {
                icon: Rocket,
                title: "Expo Integration",
                description: "Seamless integration with Expo managed workflow",
                status: "Planned",
                version: "v2.3",
                color: "text-purple-500",
                bgColor: "bg-purple-500/10",
              },
              {
                icon: Eye,
                title: "Advanced Session Replay",
                description: "Visual session replay with privacy controls",
                status: "Research",
                version: "v2.4",
                color: "text-green-500",
                bgColor: "bg-green-500/10",
              },
              {
                icon: Palette,
                title: "Custom Dashboard Widgets",
                description: "Build custom visualizations for your metrics",
                status: "Planned",
                version: "v2.5",
                color: "text-orange-500",
                bgColor: "bg-orange-500/10",
              },
              {
                icon: MessageCircle,
                title: "Slack/Teams Integrations",
                description: "Real-time alerts and notifications",
                status: "Planned",
                version: "v2.6",
                color: "text-pink-500",
                bgColor: "bg-pink-500/10",
              },
              {
                icon: Network,
                title: "GraphQL Request Tracing",
                description: "Detailed GraphQL query and mutation tracking",
                status: "Research",
                version: "v2.7",
                color: "text-indigo-500",
                bgColor: "bg-indigo-500/10",
              },
            ].map((item, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 ${item.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${item.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-sm sm:text-lg leading-tight">{item.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {item.version}
                        </Badge>
                        <Badge
                          variant={
                            item.status === "In Progress"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-xs sm:text-sm mt-3 leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Resources */}
        <section className="mb-24">
          <div className="text-center mb-12 px-4 sm:px-0">
            <Badge variant="outline" className="mb-4">
              <BookOpen className="w-3 h-3 mr-1" />
              Resources & Support
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Learn More</h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Comprehensive documentation, examples, and community support
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                  <span className="text-sm sm:text-base">Full Documentation</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Complete guides, tutorials, and API reference
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  variant="outline"
                  className="w-full bg-transparent text-xs sm:text-sm"
                  asChild
                >
                  <Link href="https://loghive.vercel.app/sdk" target="_blank">
                    View Documentation
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  <Code className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm sm:text-base">Code Examples</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Real-world examples and integration patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  variant="outline"
                  className="w-full bg-transparent text-xs sm:text-sm"
                  asChild
                >
                  <Link
                    href="https://github.com/Stanwukong/loghive-sdk"
                    target="_blank"
                  >
                    Browse Examples
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  <Github className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                  <span className="text-sm sm:text-base">GitHub Repository</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Open source SDK and community contributions
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  variant="outline"
                  className="w-full bg-transparent text-xs sm:text-sm"
                  asChild
                >
                  <Link href="https://github.com/loghive/sdk" target="_blank">
                    View on GitHub
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* <Card className="hover:shadow-md transition-shadow">
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

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                  <span className="text-sm sm:text-base">Changelog</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Latest updates and new features
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  variant="outline"
                  className="w-full bg-transparent text-xs sm:text-sm"
                  asChild
                >
                  <Link
                    href="https://github.com/Stanwukong/loghive-sdk/blob/main/CHANGELOG.md"
                    target="_blank"
                  >
                    View Changelog
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
                  <span className="text-sm sm:text-base">Support</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Get help from our support team
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  variant="outline"
                  className="w-full bg-transparent text-xs sm:text-sm"
                  asChild
                >
                  <Link href="mailto:stanleyajanaku@gmail.com">
                    Contact Support
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Get Started CTA */}
        <section className="text-center py-16 bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl border border-primary/20">
          <Badge variant="secondary" className="mb-6">
            <Rocket className="w-3 h-3 mr-1" />
            Ready to Start?
          </Badge>
          <h2 className="text-3xl font-bold mb-4">
            Start Auto-Capturing in 30 Seconds
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Join thousands of developers who trust Monita SDK for comprehensive
            auto-instrumentation
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 px-4 sm:px-0">
            <Button size="lg" className="text-sm sm:text-base w-full sm:w-auto" asChild>
              <Link href="/dashboard">
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-sm sm:text-base bg-transparent w-full sm:w-auto"
            >
              Schedule Demo
            </Button>
            <Button size="lg" variant="ghost" className="text-sm sm:text-base w-full sm:w-auto" asChild>
              <Link
                href="https://github.com/Stanwukong/loghive-sdk"
                target="_blank"
              >
                <Github className="mr-2 w-4 h-4" />
                Star on GitHub
              </Link>
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground px-4 sm:px-0">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
              <span>10,000 free events per month</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
              <span>Zero-config auto-instrumentation</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
