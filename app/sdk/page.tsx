import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Code,
  Download,
  ExternalLink,
  BookOpen,
  Zap,
  Shield,
  Terminal,
  Package,
  Rocket,
  CheckCircle2,
  AlertTriangle,
  Info,
  Star,
  Github,
  Play,
  Clock,
  Users,
  TrendingUp,
  Settings,
  Database,
  Server,
  Layers,
  ArrowRight,
  Lightbulb,
  Target,
  Cpu,
} from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { CodeBlock } from "@/components/sdk/code-block"
import { InteractiveDemo } from "@/components/sdk/interactive-demo"
import { FeatureShowcase } from "@/components/sdk/feature-showcase"

export default function SDKPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 backdrop-blur-sm bg-background/95">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg md:text-xl font-semibold">LogHive SDK</span>
            </Link>
          </div>
          <nav className="hidden lg:flex items-center lg:space-x-6">
            <a href="#quickstart" className="text-sm font-medium hover:text-primary transition-colors">
              Quick Start
            </a>
            <a href="#examples" className="text-sm font-medium hover:text-primary transition-colors">
              Examples
            </a>
            <a href="#reference" className="text-sm font-medium hover:text-primary transition-colors">
              API Reference
            </a>
            <a href="#integrations" className="text-sm font-medium hover:text-primary transition-colors">
              Integrations
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6">
            <Rocket className="w-3 h-3 mr-1" />
            Developer Documentation
          </Badge>
          <h1 className="text-5xl md:text-5xl font-bold tracking-tight leading-16 mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Integrate LogHive
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              in Minutes
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Get started with our developer-friendly SDKs and REST API. Choose your preferred language and start logging
            immediately with enterprise-grade reliability.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12 text-sm">
            <div className="flex items-center space-x-2">
              <Download className="w-4 h-4 text-green-500" />
              <span className="font-medium">500K+</span>
              <span className="text-muted-foreground">Downloads</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">4.9/5</span>
              <span className="text-muted-foreground">Developer Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="font-medium">10K+</span>
              <span className="text-muted-foreground">Active Projects</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-purple-500" />
              <span className="font-medium">{"<2min"}</span>
              <span className="text-muted-foreground">Setup Time</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base" asChild>
              <Link href="#quickstart">
                <Rocket className="mr-2 w-4 h-4" />
                Quick Start Guide
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base bg-transparent" asChild>
              <Link href="#demo">
                <Play className="mr-2 w-4 h-4" />
                Try Interactive Demo
              </Link>
            </Button>
            <Button size="lg" variant="ghost" className="text-base" asChild>
              <Link href="https://github.com/remotelogger" target="_blank">
                <Github className="mr-2 w-4 h-4" />
                View on GitHub
              </Link>
            </Button>
          </div>
        </div>

        {/* Interactive Demo Section */}
        <section id="demo" className="mb-24">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Play className="w-3 h-3 mr-1" />
              Interactive Demo
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Try LogHive Live</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience our logging platform in action. Send test logs and see real-time visualization.
            </p>
          </div>
          <InteractiveDemo />
        </section>

        {/* Quick Start Section */}
        <section id="quickstart" className="mb-24">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Zap className="w-3 h-3 mr-1" />
              Quick Start
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Get Started in Under 2 Minutes</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Install the SDK, configure your project, and start logging immediately
            </p>
          </div>

          <Tabs defaultValue="nodejs" className="w-full flex flex-col items-center">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-5 w-full max-w-2xl">
                <TabsTrigger value="nodejs" className="flex items-center space-x-2">
                  <Package className="w-4 h-4" />
                  <span>Node.js</span>
                </TabsTrigger>
                <TabsTrigger value="python" className="flex items-center space-x-2">
                  <Code className="w-4 h-4" />
                  <span>Python</span>
                </TabsTrigger>
                <TabsTrigger value="go" className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Go</span>
                </TabsTrigger>
                <TabsTrigger value="java" className="flex items-center space-x-2">
                  <Server className="w-4 h-4" />
                  <span>Java</span>
                </TabsTrigger>
                <TabsTrigger value="curl" className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4" />
                  <span>cURL</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="nodejs" className="space-y-8 w-full ">
              <div className="grid lg:grid-cols-2 gap-8">
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
                      <CodeBlock language="bash" code="npm install @remotelogger-sdk" showCopy title="Terminal" />
                      <p className="text-sm text-muted-foreground mt-3">
                        Or use yarn: <code className="bg-muted px-1 rounded">yarn add @remotelogger/sdk</code>
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          2
                        </div>
                        <span>Initialize the Logger</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="javascript"
                        code={`import { LogHive } from '@remotelogger/sdk'

const logger = new LogHive({
  apiKey: process.env.REMOTELOGGER_API_KEY,
  project: 'my-awesome-app',
  environment: 'production',
  service: 'api-server',
  version: '1.0.0'
})`}
                        showCopy
                        title="logger.js"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          3
                        </div>
                        <span>Start Logging</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="javascript"
                        code={`// Basic logging
logger.info('User logged in', { 
  userId: 123, 
  email: 'user@example.com' 
})

logger.warn('High memory usage', { 
  usage: '85%', 
  threshold: '80%' 
})

logger.error('Database connection failed', { 
  error: 'Connection timeout',
  database: 'users',
  retryCount: 3
})

// Structured logging with context
logger.withContext({ 
  requestId: 'req_123',
  userId: 456 
}).info('Processing payment', {
  orderId: 'order_789',
  amount: 99.99,
  currency: 'USD'
})`}
                        showCopy
                        title="app.js"
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Pro Tip:</strong> Use environment variables for your API key to keep it secure. Never
                      commit API keys to version control.
                    </AlertDescription>
                  </Alert>

                  <Card>
                    <CardHeader>
                      <CardTitle>Advanced Configuration</CardTitle>
                      <CardDescription>Customize the SDK behavior for your needs</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="javascript"
                        code={`const logger = new LogHive({
  apiKey: process.env.REMOTELOGGER_API_KEY,
  project: 'my-app',
  environment: 'production',
  
  // Optional configuration
  batchSize: 100,           // Batch logs for performance
  flushInterval: 5000,      // Flush every 5 seconds
  maxRetries: 3,            // Retry failed requests
  timeout: 10000,           // Request timeout
  
  // Custom metadata for all logs
  defaultMetadata: {
    version: process.env.APP_VERSION,
    region: process.env.AWS_REGION,
    instance: process.env.INSTANCE_ID
  },
  
  // Error handling
  onError: (error) => {
    console.error('LogHive error:', error)
  }
})`}
                        showCopy
                        title="advanced-config.js"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Framework Integrations</CardTitle>
                      <CardDescription>Ready-made integrations for popular frameworks</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Express.js Middleware</h4>
                        <CodeBlock
                          language="javascript"
                          code={`import { expressMiddleware } from '@remotelogger/express'

app.use(expressMiddleware({
  logger,
  logRequests: true,
  logResponses: true,
  includeBody: false
}))`}
                          showCopy
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Next.js Integration</h4>
                        <CodeBlock
                          language="javascript"
                          code={`import { withLogHive } from '@remotelogger/nextjs'

export default withLogHive(handler, {
  logApiRoutes: true,
  logServerActions: true
})`}
                          showCopy
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="python" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
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
                      <CodeBlock language="bash" code="pip install remotelogger" showCopy title="Terminal" />
                      <p className="text-sm text-muted-foreground mt-3">
                        Or with poetry: <code className="bg-muted px-1 rounded">poetry add remotelogger</code>
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          2
                        </div>
                        <span>Initialize the Logger</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="python"
                        code={`import os
from remotelogger import LogHive

logger = LogHive(
    api_key=os.getenv('REMOTELOGGER_API_KEY'),
    project='my-awesome-app',
    environment='production',
    service='api-server',
    version='1.0.0'
)`}
                        showCopy
                        title="logger.py"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          3
                        </div>
                        <span>Start Logging</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="python"
                        code={`# Basic logging
logger.info("User logged in", {
    "user_id": 123,
    "email": "user@example.com"
})

logger.warning("High memory usage", {
    "usage": "85%",
    "threshold": "80%"
})

logger.error("Database connection failed", {
    "error": "Connection timeout",
    "database": "users",
    "retry_count": 3
})

# Context manager for structured logging
with logger.context(request_id="req_123", user_id=456):
    logger.info("Processing payment", {
        "order_id": "order_789",
        "amount": 99.99,
        "currency": "USD"
    })`}
                        showCopy
                        title="app.py"
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Django Integration</CardTitle>
                      <CardDescription>Seamless integration with Django projects</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="python"
                        code={`# settings.py
LOGGING = {
    'version': 1,
    'handlers': {
        'remotelogger': {
            'class': 'remotelogger.DjangoHandler',
            'api_key': os.getenv('REMOTELOGGER_API_KEY'),
            'project': 'my-django-app',
            'environment': os.getenv('ENVIRONMENT', 'development'),
        },
    },
    'loggers': {
        'django': {
            'handlers': ['remotelogger'],
            'level': 'INFO',
        },
    },
}

# views.py
import logging
logger = logging.getLogger(__name__)

def my_view(request):
    logger.info("Processing request", {
        "path": request.path,
        "method": request.method,
        "user_id": request.user.id if request.user.is_authenticated else None
    })`}
                        showCopy
                        title="Django Setup"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>FastAPI Integration</CardTitle>
                      <CardDescription>Automatic request/response logging</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="python"
                        code={`from fastapi import FastAPI
from remotelogger.fastapi import LogHiveMiddleware

app = FastAPI()

app.add_middleware(
    LogHiveMiddleware,
    api_key=os.getenv('REMOTELOGGER_API_KEY'),
    project='my-fastapi-app',
    log_requests=True,
    log_responses=True,
    include_request_body=False,
    include_response_body=False
)

@app.get("/users/{user_id}")
async def get_user(user_id: int):
    logger.info("Fetching user", {"user_id": user_id})
    return {"user_id": user_id}`}
                        showCopy
                        title="FastAPI Setup"
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="go" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
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
                        code="go get github.com/remotelogger/go-sdk"
                        showCopy
                        title="Terminal"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          2
                        </div>
                        <span>Initialize the Logger</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="go"
                        code={`package main

import (
    "os"
    "github.com/remotelogger/go-sdk"
)

func main() {
    logger := remotelogger.New(&remotelogger.Config{
        APIKey:      os.Getenv("REMOTELOGGER_API_KEY"),
        Project:     "my-awesome-app",
        Environment: "production",
        Service:     "api-server",
        Version:     "1.0.0",
    })
    defer logger.Close()
}`}
                        showCopy
                        title="main.go"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          3
                        </div>
                        <span>Start Logging</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="go"
                        code={`// Basic logging
logger.Info("User logged in", map[string]interface{}{
    "userId": 123,
    "email":  "user@example.com",
})

logger.Warn("High memory usage", map[string]interface{}{
    "usage":     "85%",
    "threshold": "80%",
})

logger.Error("Database connection failed", map[string]interface{}{
    "error":      "Connection timeout",
    "database":   "users",
    "retryCount": 3,
})

// Structured logging with context
ctx := logger.WithContext(context.Background(), map[string]interface{}{
    "requestId": "req_123",
    "userId":    456,
})

logger.InfoContext(ctx, "Processing payment", map[string]interface{}{
    "orderId":  "order_789",
    "amount":   99.99,
    "currency": "USD",
})`}
                        showCopy
                        title="logging.go"
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Gin Framework Integration</CardTitle>
                      <CardDescription>Middleware for Gin web framework</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="go"
                        code={`package main

import (
    "github.com/gin-gonic/gin"
    "github.com/remotelogger/go-sdk/gin"
)

func main() {
    r := gin.Default()
    
    // Add LogHive middleware
    r.Use(remotelogger_gin.Middleware(&remotelogger_gin.Config{
        Logger:           logger,
        LogRequests:      true,
        LogResponses:     true,
        SkipPaths:        []string{"/health"},
        IncludeBody:      false,
    }))
    
    r.GET("/users/:id", func(c *gin.Context) {
        userID := c.Param("id")
        logger.Info("Fetching user", map[string]interface{}{
            "userId": userID,
        })
        c.JSON(200, gin.H{"userId": userID})
    })
    
    r.Run(":8080")
}`}
                        showCopy
                        title="gin-server.go"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Error Handling</CardTitle>
                      <CardDescription>Comprehensive error logging and recovery</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="go"
                        code={`func processPayment(orderID string) error {
    defer func() {
        if r := recover(); r != nil {
            logger.Fatal("Payment processing panic", map[string]interface{}{
                "orderId": orderID,
                "panic":   r,
                "stack":   string(debug.Stack()),
            })
        }
    }()
    
    // Simulate payment processing
    if err := chargeCard(); err != nil {
        logger.Error("Card charge failed", map[string]interface{}{
            "orderId": orderID,
            "error":   err.Error(),
            "code":    err.Code,
        })
        return err
    }
    
    logger.Info("Payment processed successfully", map[string]interface{}{
        "orderId": orderID,
    })
    
    return nil
}`}
                        showCopy
                        title="error-handling.go"
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="java" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          1
                        </div>
                        <span>Add Dependency</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="xml"
                        code={`<!-- Maven -->
<dependency>
    <groupId>com.remotelogger</groupId>
    <artifactId>remotelogger-java</artifactId>
    <version>1.0.0</version>
</dependency>

<!-- Gradle -->
implementation 'com.remotelogger:remotelogger-java:1.0.0'`}
                        showCopy
                        title="pom.xml / build.gradle"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          2
                        </div>
                        <span>Initialize the Logger</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="java"
                        code={`import com.remotelogger.LogHive;
import com.remotelogger.LogHiveConfig;

public class Application {
    private static final LogHive logger = LogHive.builder()
        .apiKey(System.getenv("REMOTELOGGER_API_KEY"))
        .project("my-awesome-app")
        .environment("production")
        .service("api-server")
        .version("1.0.0")
        .build();
}`}
                        showCopy
                        title="Application.java"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          3
                        </div>
                        <span>Start Logging</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="java"
                        code={`import java.util.Map;

// Basic logging
logger.info("User logged in", Map.of(
    "userId", 123,
    "email", "user@example.com"
));

logger.warn("High memory usage", Map.of(
    "usage", "85%",
    "threshold", "80%"
));

logger.error("Database connection failed", Map.of(
    "error", "Connection timeout",
    "database", "users",
    "retryCount", 3
));

// Structured logging with builder pattern
logger.withContext("requestId", "req_123")
      .withContext("userId", 456)
      .info("Processing payment", Map.of(
          "orderId", "order_789",
          "amount", 99.99,
          "currency", "USD"
      ));`}
                        showCopy
                        title="LoggingExample.java"
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Spring Boot Integration</CardTitle>
                      <CardDescription>Auto-configuration for Spring Boot applications</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="yaml"
                        code={`# application.yml
remotelogger:
  api-key: \${REMOTELOGGER_API_KEY}
  project: my-spring-app
  environment: \${SPRING_PROFILES_ACTIVE:development}
  service: api-server
  version: @project.version@
  
  # Optional configuration
  batch-size: 100
  flush-interval: 5000
  max-retries: 3
  
  # Auto-logging configuration
  auto-logging:
    enabled: true
    log-requests: true
    log-responses: true
    include-headers: false
    include-body: false`}
                        showCopy
                        title="application.yml"
                      />
                      <div className="mt-4">
                        <CodeBlock
                          language="java"
                          code={`@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private LogHive logger;
    
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        logger.info("Fetching user", Map.of("userId", id));
        
        try {
            User user = userService.findById(id);
            logger.info("User found", Map.of(
                "userId", id,
                "username", user.getUsername()
            ));
            return user;
        } catch (UserNotFoundException e) {
            logger.error("User not found", Map.of(
                "userId", id,
                "error", e.getMessage()
            ));
            throw e;
        }
    }
}`}
                          showCopy
                          title="UserController.java"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="curl" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>REST API Endpoint</CardTitle>
                      <CardDescription>Direct HTTP API for any language or platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="bash"
                        code="POST https://api.remotelogger.dev/v1/logs"
                        showCopy
                        title="Base URL"
                      />
                      <div className="mt-4 space-y-2">
                        <h4 className="font-semibold text-sm">Authentication</h4>
                        <p className="text-sm text-muted-foreground">
                          Include your API key in the Authorization header:
                        </p>
                        <code className="block bg-muted p-2 rounded text-xs">
                          Authorization: Bearer your-api-key-here
                        </code>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Single Log Entry</CardTitle>
                      <CardDescription>Send individual log entries</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="bash"
                        code={`curl -X POST https://api.remotelogger.dev/v1/logs \\
  -H "Authorization: Bearer your-api-key-here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "project": "my-awesome-app",
    "level": "info",
    "message": "User logged in successfully",
    "metadata": {
      "userId": 123,
      "email": "user@example.com",
      "ip": "192.168.1.1",
      "userAgent": "Mozilla/5.0..."
    },
    "timestamp": "2024-01-27T14:32:15Z",
    "service": "auth-service",
    "environment": "production"
  }'`}
                        showCopy
                        title="Single Log"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Batch Logging</CardTitle>
                      <CardDescription>Send multiple logs in a single request for better performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="bash"
                        code={`curl -X POST https://api.remotelogger.dev/v1/logs/batch \\
  -H "Authorization: Bearer your-api-key-here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "project": "my-awesome-app",
    "environment": "production",
    "service": "api-server",
    "logs": [
      {
        "level": "info",
        "message": "Request started",
        "metadata": {
          "requestId": "req_123",
          "method": "POST",
          "path": "/api/users"
        },
        "timestamp": "2024-01-27T14:32:15Z"
      },
      {
        "level": "error",
        "message": "Database query failed",
        "metadata": {
          "requestId": "req_123",
          "query": "SELECT * FROM users",
          "error": "Connection timeout"
        },
        "timestamp": "2024-01-27T14:32:16Z"
      },
      {
        "level": "info",
        "message": "Request completed",
        "metadata": {
          "requestId": "req_123",
          "duration": 1250,
          "status": 500
        },
        "timestamp": "2024-01-27T14:32:17Z"
      }
    ]
  }'`}
                        showCopy
                        title="Batch Logs"
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Response Format</CardTitle>
                      <CardDescription>Standard API responses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-green-600">Success Response (200)</h4>
                          <CodeBlock
                            language="json"
                            code={`{
  "success": true,
  "message": "Logs received successfully",
  "logId": "log_abc123",
  "timestamp": "2024-01-27T14:32:15Z"
}`}
                            showCopy
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-red-600">Error Response (400/401/500)</h4>
                          <CodeBlock
                            language="json"
                            code={`{
  "success": false,
  "error": {
    "code": "INVALID_API_KEY",
    "message": "The provided API key is invalid",
    "details": {
      "field": "apiKey",
      "reason": "Key not found or expired"
    }
  },
  "timestamp": "2024-01-27T14:32:15Z"
}`}
                            showCopy
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Query Logs API</CardTitle>
                      <CardDescription>Retrieve and search your logs</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="bash"
                        code={`# Get recent logs
curl -X GET "https://api.remotelogger.dev/v1/logs?project=my-app&limit=100" \\
  -H "Authorization: Bearer your-api-key-here"

# Search logs with filters
curl -X GET "https://api.remotelogger.dev/v1/logs/search" \\
  -H "Authorization: Bearer your-api-key-here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "project": "my-app",
    "query": "error AND database",
    "filters": {
      "level": ["error", "fatal"],
      "service": "api-server",
      "timeRange": {
        "start": "2024-01-27T00:00:00Z",
        "end": "2024-01-27T23:59:59Z"
      }
    },
    "limit": 50,
    "offset": 0,
    "sort": "timestamp:desc"
  }'`}
                        showCopy
                        title="Query API"
                      />
                    </CardContent>
                  </Card>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Rate Limits:</strong> The API has rate limits of 1000 requests per minute per API key. Use
                      batch endpoints for high-volume logging.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Feature Showcase */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Target className="w-3 h-3 mr-1" />
              Advanced Features
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Powerful Logging Capabilities</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Go beyond basic logging with advanced features designed for production applications
            </p>
          </div>
          <FeatureShowcase />
        </section>

        {/* Configuration Reference */}
        <section id="reference" className="mb-24">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <BookOpen className="w-3 h-3 mr-1" />
              Configuration Reference
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Complete Configuration Guide</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive reference for all configuration options and parameters
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Required Parameters</CardTitle>
                <CardDescription>Essential configuration for all SDKs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-semibold text-sm">apiKey</h4>
                    <p className="text-sm text-muted-foreground">
                      Your project API key from the LogHive dashboard
                    </p>
                    <code className="text-xs bg-muted px-1 rounded">string, required</code>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-semibold text-sm">project</h4>
                    <p className="text-sm text-muted-foreground">Unique identifier for your project</p>
                    <code className="text-xs bg-muted px-1 rounded">string, required</code>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optional Parameters</CardTitle>
                <CardDescription>Customize SDK behavior</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-sm">environment</h4>
                    <p className="text-sm text-muted-foreground">Environment name (dev, staging, prod)</p>
                    <code className="text-xs bg-muted px-1 rounded">string, optional</code>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-sm">service</h4>
                    <p className="text-sm text-muted-foreground">Service or component identifier</p>
                    <code className="text-xs bg-muted px-1 rounded">string, optional</code>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-sm">version</h4>
                    <p className="text-sm text-muted-foreground">Application version</p>
                    <code className="text-xs bg-muted px-1 rounded">string, optional</code>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Options</CardTitle>
                <CardDescription>Optimize for your use case</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-sm">batchSize</h4>
                    <p className="text-sm text-muted-foreground">Number of logs to batch before sending</p>
                    <code className="text-xs bg-muted px-1 rounded">number, default: 100</code>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-sm">flushInterval</h4>
                    <p className="text-sm text-muted-foreground">Max time to wait before flushing (ms)</p>
                    <code className="text-xs bg-muted px-1 rounded">number, default: 5000</code>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-sm">maxRetries</h4>
                    <p className="text-sm text-muted-foreground">Number of retry attempts for failed requests</p>
                    <code className="text-xs bg-muted px-1 rounded">number, default: 3</code>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Log Levels</CardTitle>
                <CardDescription>Available logging levels and their use cases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="w-16 justify-center">
                        TRACE
                      </Badge>
                      <span className="text-sm">Finest-grained debugging information</span>
                    </div>
                    <code className="text-xs text-muted-foreground">10</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="w-16 justify-center">
                        DEBUG
                      </Badge>
                      <span className="text-sm">Detailed diagnostic information</span>
                    </div>
                    <code className="text-xs text-muted-foreground">20</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="default" className="w-16 justify-center">
                        INFO
                      </Badge>
                      <span className="text-sm">General application flow</span>
                    </div>
                    <code className="text-xs text-muted-foreground">30</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary" className="w-16 justify-center">
                        WARN
                      </Badge>
                      <span className="text-sm">Potentially harmful situations</span>
                    </div>
                    <code className="text-xs text-muted-foreground">40</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="destructive" className="w-16 justify-center">
                        ERROR
                      </Badge>
                      <span className="text-sm">Error events that don&apos;t stop execution</span>
                    </div>
                    <code className="text-xs text-muted-foreground">50</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="destructive" className="w-16 justify-center">
                        FATAL
                      </Badge>
                      <span className="text-sm">Critical errors causing termination</span>
                    </div>
                    <code className="text-xs text-muted-foreground">60</code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Integration Examples */}
        <section id="integrations" className="mb-24">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Layers className="w-3 h-3 mr-1" />
              Framework Integrations
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Ready-Made Integrations</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Drop-in solutions for popular frameworks and platforms
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Express.js",
                description: "Automatic request/response logging middleware",
                icon: Server,
                code: `app.use(remoteLoggerMiddleware({
  logger,
  logRequests: true,
  logResponses: true
}))`,
              },
              {
                name: "Next.js",
                description: "API routes and server actions logging",
                icon: Layers,
                code: `export default withLogHive(handler, {
  logApiRoutes: true,
  logServerActions: true
})`,
              },
              {
                name: "Django",
                description: "Django logging handler integration",
                icon: Database,
                code: `LOGGING = {
  'handlers': {
    'remotelogger': {
      'class': 'remotelogger.DjangoHandler'
    }
  }
}`,
              },
              {
                name: "FastAPI",
                description: "Async middleware for FastAPI applications",
                icon: Zap,
                code: `app.add_middleware(
  LogHiveMiddleware,
  api_key=api_key,
  project='my-app'
)`,
              },
              {
                name: "Spring Boot",
                description: "Auto-configuration and AOP logging",
                icon: Shield,
                code: `@EnableLogHive
@SpringBootApplication
public class Application {
  // Auto-configured
}`,
              },
              {
                name: "Gin (Go)",
                description: "Gin framework middleware",
                icon: Cpu,
                code: `r.Use(remotelogger_gin.Middleware(&Config{
  Logger: logger,
  LogRequests: true
}))`,
              },
            ].map((integration, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <integration.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <CardDescription className="text-sm">{integration.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CodeBlock language="javascript" code={integration.code} showCopy={false} />
                  <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
                    <BookOpen className="w-4 h-4 mr-2" />
                    View Documentation
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Best Practices */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Lightbulb className="w-3 h-3 mr-1" />
              Best Practices
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Production-Ready Logging</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Follow these guidelines to get the most out of LogHive in production
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Do&apos;s</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Use structured logging</h4>
                      <p className="text-sm text-muted-foreground">
                        Include relevant metadata as key-value pairs for better searchability
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Set appropriate log levels</h4>
                      <p className="text-sm text-muted-foreground">
                        Use DEBUG for development, INFO for general flow, ERROR for actual problems
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Include request context</h4>
                      <p className="text-sm text-muted-foreground">
                        Add request IDs, user IDs, and session info to trace requests
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Use environment variables</h4>
                      <p className="text-sm text-muted-foreground">
                        Store API keys and configuration in environment variables
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Enable batching</h4>
                      <p className="text-sm text-muted-foreground">
                        Use batch logging for high-volume applications to improve performance
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span>Don&apos;ts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Don&apos;t log sensitive data</h4>
                      <p className="text-sm text-muted-foreground">
                        Avoid logging passwords, API keys, credit card numbers, or PII
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Don&apos;t over-log in production</h4>
                      <p className="text-sm text-muted-foreground">
                        Excessive DEBUG logging can impact performance and costs
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Don&apos;t ignore error handling</h4>
                      <p className="text-sm text-muted-foreground">
                        Always handle SDK errors gracefully to avoid breaking your app
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Don&apos;t hardcode configuration</h4>
                      <p className="text-sm text-muted-foreground">
                        Use configuration files or environment variables instead
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Don&apos;t block the main thread</h4>
                      <p className="text-sm text-muted-foreground">
                        Ensure logging is asynchronous and doesn&apos;t impact application performance
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <BookOpen className="w-3 h-3 mr-1" />
              Additional Resources
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Learn More</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our comprehensive documentation and community resources
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <span>API Reference</span>
                </CardTitle>
                <CardDescription>Complete API documentation with examples</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/docs/api">
                    View Documentation
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="w-5 h-5 text-green-500" />
                  <span>Code Examples</span>
                </CardTitle>
                <CardDescription>Real-world examples and use cases</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/examples">
                    Browse Examples
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Github className="w-5 h-5 text-gray-500" />
                  <span>GitHub Repository</span>
                </CardTitle>
                <CardDescription>Open source SDKs and examples</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="https://github.com/remotelogger" target="_blank">
                    View on GitHub
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  <span>Community</span>
                </CardTitle>
                <CardDescription>Join our developer community</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Join Discord
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <span>Changelog</span>
                </CardTitle>
                <CardDescription>Latest updates and new features</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/changelog">
                    View Changelog
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-gray-500" />
                  <span>Migration Guides</span>
                </CardTitle>
                <CardDescription>Upgrade from other logging solutions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/migration">
                    Migration Guides
                    <ExternalLink className="w-4 h-4 ml-2" />
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
          <h2 className="text-3xl font-bold mb-4">Start Logging in Minutes</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Join thousands of developers who trust LogHive for their production applications
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base" asChild>
              <Link href="/dashboard">
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base bg-transparent">
              Schedule Demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            No credit card required • 10,000 free logs per month • Setup in under 2 minutes
          </p>
        </section>
      </div>
    </div>
  )
}
