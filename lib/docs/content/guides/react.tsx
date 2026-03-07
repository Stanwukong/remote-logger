import {
  DocsContent,
  DocH2,
  DocP,
  DocUl,
  DocLi,
  DocStrong,
  DocCallout,
  CodeBlock,
  InlineCode,
  DocsTableOfContents,
  type TocItem,
} from "@/components/docs";

const toc: TocItem[] = [
  { id: "setup", title: "Setup", level: 2 },
  { id: "provider-pattern", title: "MonitaProvider Pattern", level: 2 },
  { id: "error-boundaries", title: "Error Boundaries", level: 2 },
  { id: "hook-usage", title: "Custom Hook Usage", level: 2 },
  { id: "component-logging", title: "Component-Level Logging", level: 2 },
  { id: "performance-tracking", title: "Performance Tracking", level: 2 },
  { id: "best-practices", title: "Best Practices", level: 2 },
];

export default function ReactGuidePage() {
  return (
    <div className="flex">
      <DocsContent
        slug="guides/react"
        title="React Integration"
        description="Best practices for integrating Monita with React applications."
      >
        <DocH2 id="setup">Setup</DocH2>
        <DocP>
          Install the SDK and initialize it at the root of your React
          application, before any components render:
        </DocP>
        <CodeBlock
          language="bash"
          code="npm install monita"
        />
        <CodeBlock
          language="typescript"
          filename="src/index.tsx"
          code={`import React from "react";
import ReactDOM from "react-dom/client";
import Monita from "monita";
import App from "./App";

// Initialize BEFORE rendering
Monita.init({
  projectId: process.env.REACT_APP_MONITA_PROJECT_ID!,
  apiKey: process.env.REACT_APP_MONITA_API_KEY!,
  environment: process.env.NODE_ENV,
  autoCapture: {
    errors: true,
    performance: true,
    network: true,
    console: false,
    pageviews: true,
  },
});

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`}
        />

        <DocH2 id="provider-pattern">MonitaProvider Pattern</DocH2>
        <DocP>
          Create a context provider to make Monita accessible throughout
          your component tree and to handle initialization lifecycle:
        </DocP>
        <CodeBlock
          language="typescript"
          filename="src/providers/MonitaProvider.tsx"
          code={`import { createContext, useContext, useEffect, useRef } from "react";
import Monita from "monita";

interface MonitaContextValue {
  log: typeof Monita;
}

const MonitaContext = createContext<MonitaContextValue | null>(null);

export function MonitaProvider({
  children,
  projectId,
  apiKey,
}: {
  children: React.ReactNode;
  projectId: string;
  apiKey: string;
}) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      Monita.init({
        projectId,
        apiKey,
        environment: process.env.NODE_ENV,
        autoCapture: {
          errors: true,
          performance: true,
          network: true,
        },
      });
      initialized.current = true;
    }

    // Flush on unmount
    return () => {
      Monita.flush();
    };
  }, [projectId, apiKey]);

  return (
    <MonitaContext.Provider value={{ log: Monita }}>
      {children}
    </MonitaContext.Provider>
  );
}

export function useMonita() {
  const context = useContext(MonitaContext);
  if (!context) {
    throw new Error("useMonita must be used within a MonitaProvider");
  }
  return context.log;
}`}
        />
        <DocP>Use the provider in your app root:</DocP>
        <CodeBlock
          language="typescript"
          filename="src/App.tsx"
          code={`import { MonitaProvider } from "./providers/MonitaProvider";
import { Dashboard } from "./pages/Dashboard";

function App() {
  return (
    <MonitaProvider
      projectId={process.env.REACT_APP_MONITA_PROJECT_ID!}
      apiKey={process.env.REACT_APP_MONITA_API_KEY!}
    >
      <Dashboard />
    </MonitaProvider>
  );
}`}
        />

        <DocH2 id="error-boundaries">Error Boundaries</DocH2>
        <DocP>
          Create an error boundary that automatically reports rendering errors
          to Monita:
        </DocP>
        <CodeBlock
          language="typescript"
          filename="src/components/MonitaErrorBoundary.tsx"
          code={`import React from "react";
import Monita from "monita";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class MonitaErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    Monita.error("React component error", {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      componentStack: info.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Usage:
// <MonitaErrorBoundary fallback={<ErrorFallback />}>
//   <MyComponent />
// </MonitaErrorBoundary>`}
        />

        <DocCallout type="tip">
          Wrap individual feature sections with separate error boundaries.
          This way, a crash in one section does not take down the entire
          application, and each crash is reported with the correct component
          context.
        </DocCallout>

        <DocH2 id="hook-usage">Custom Hook Usage</DocH2>
        <DocP>
          Create custom hooks for common logging patterns:
        </DocP>
        <CodeBlock
          language="typescript"
          filename="src/hooks/useMonitaAction.ts"
          code={`import { useCallback } from "react";
import Monita from "monita";

/**
 * Hook for logging user actions with consistent formatting
 */
export function useMonitaAction(component: string) {
  const logAction = useCallback(
    (action: string, data?: Record<string, any>) => {
      Monita.info(component + ": " + action, {
        component,
        action,
        ...data,
      });
    },
    [component]
  );

  const logError = useCallback(
    (action: string, error: unknown, data?: Record<string, any>) => {
      Monita.error(component + ": " + action + " failed", {
        component,
        action,
        error,
        ...data,
      });
    },
    [component]
  );

  return { logAction, logError };
}

// Usage in a component:
function CheckoutPage() {
  const { logAction, logError } = useMonitaAction("CheckoutPage");

  const handleSubmit = async (order: Order) => {
    logAction("submit_order", { orderId: order.id });
    try {
      await submitOrder(order);
      logAction("order_success", { orderId: order.id });
    } catch (err) {
      logError("submit_order", err, { orderId: order.id });
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}`}
        />

        <DocH2 id="component-logging">Component-Level Logging</DocH2>
        <DocP>
          Log component lifecycle events for debugging render issues:
        </DocP>
        <CodeBlock
          language="typescript"
          code={`import { useEffect } from "react";
import Monita from "monita";

function UserProfile({ userId }: { userId: string }) {
  // Log component mount/unmount
  useEffect(() => {
    Monita.debug("UserProfile mounted", { userId });
    return () => {
      Monita.debug("UserProfile unmounted", { userId });
    };
  }, [userId]);

  // Log data fetching
  useEffect(() => {
    Monita.debug("Fetching user data", { userId });
    fetchUser(userId)
      .then((user) => {
        Monita.info("User data loaded", {
          userId,
          loadTime: performance.now(),
        });
      })
      .catch((err) => {
        Monita.error("Failed to load user data", {
          userId,
          error: err,
        });
      });
  }, [userId]);

  return <div>...</div>;
}`}
        />

        <DocH2 id="performance-tracking">Performance Tracking</DocH2>
        <DocP>
          Track component render performance with the{" "}
          <InlineCode>Performance API</InlineCode>:
        </DocP>
        <CodeBlock
          language="typescript"
          code={`import { useEffect, useRef } from "react";
import Monita from "monita";

function useRenderPerformance(componentName: string) {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current += 1;
    const renderTime = performance.now() - startTime.current;

    if (renderTime > 16) {
      // Longer than one frame (60fps)
      Monita.warn("Slow render detected", {
        component: componentName,
        renderTime: Math.round(renderTime),
        renderCount: renderCount.current,
      });
    }

    startTime.current = performance.now();
  });
}

// Usage:
function HeavyComponent() {
  useRenderPerformance("HeavyComponent");
  return <div>...</div>;
}`}
        />

        <DocH2 id="best-practices">Best Practices</DocH2>
        <DocUl>
          <DocLi>
            <DocStrong>Initialize once</DocStrong> -- Call{" "}
            <InlineCode>Monita.init()</InlineCode> in your entry file, not
            inside components. Use a ref guard to prevent double-init in
            StrictMode.
          </DocLi>
          <DocLi>
            <DocStrong>Use error boundaries</DocStrong> -- Wrap feature
            sections with <InlineCode>MonitaErrorBoundary</InlineCode> for
            automatic React error reporting.
          </DocLi>
          <DocLi>
            <DocStrong>Log meaningful context</DocStrong> -- Include
            component names, user IDs, and relevant state in log data.
          </DocLi>
          <DocLi>
            <DocStrong>Avoid over-logging</DocStrong> -- Use{" "}
            <InlineCode>debug</InlineCode> level for development details
            and set <InlineCode>logLevel: "info"</InlineCode> in production.
          </DocLi>
          <DocLi>
            <DocStrong>Flush on navigation</DocStrong> -- Call{" "}
            <InlineCode>Monita.flush()</InlineCode> before page unload or
            significant navigation events.
          </DocLi>
        </DocUl>
      </DocsContent>
      <DocsTableOfContents items={toc} />
    </div>
  );
}
