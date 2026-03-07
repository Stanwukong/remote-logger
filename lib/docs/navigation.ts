export interface DocItem {
  title: string;
  slug: string;
  description?: string;
}

export interface DocSection {
  title: string;
  items: DocItem[];
}

export const docsNavigation: DocSection[] = [
  {
    title: "Getting Started",
    items: [
      {
        title: "Introduction",
        slug: "introduction",
        description: "What is Monita and why you need it",
      },
      {
        title: "Quick Start",
        slug: "quickstart",
        description: "Get up and running in 5 minutes",
      },
      {
        title: "Installation",
        slug: "installation",
        description: "Install the SDK and configure your project",
      },
    ],
  },
  {
    title: "SDK",
    items: [
      {
        title: "Overview",
        slug: "sdk/overview",
        description: "Core logging API and methods",
      },
      {
        title: "Configuration",
        slug: "sdk/configuration",
        description: "All configuration options explained",
      },
      {
        title: "Auto-Instrumentation",
        slug: "sdk/auto-instrumentation",
        description: "Automatic event capture setup",
      },
      {
        title: "Error Tracking",
        slug: "sdk/error-tracking",
        description: "Capture and group errors automatically",
      },
      {
        title: "Web Vitals",
        slug: "sdk/web-vitals",
        description: "Core Web Vitals monitoring",
      },
      {
        title: "Tracing",
        slug: "sdk/tracing",
        description: "Distributed tracing and spans",
      },
      {
        title: "Data Sanitization",
        slug: "sdk/data-sanitization",
        description: "PII detection and redaction",
      },
    ],
  },
  {
    title: "API Reference",
    items: [
      {
        title: "Authentication",
        slug: "api/authentication",
        description: "JWT, API keys, and OAuth",
      },
      {
        title: "Logs",
        slug: "api/logs",
        description: "Log ingestion and querying",
      },
      {
        title: "Projects",
        slug: "api/projects",
        description: "Project management endpoints",
      },
      {
        title: "Alerts",
        slug: "api/alerts",
        description: "Alert rules and events",
      },
      {
        title: "Dashboards",
        slug: "api/dashboards",
        description: "Dashboard and analytics endpoints",
      },
    ],
  },
  {
    title: "Guides",
    items: [
      {
        title: "React Integration",
        slug: "guides/react",
        description: "Best practices for React apps",
      },
      {
        title: "Next.js Integration",
        slug: "guides/nextjs",
        description: "Server and client-side setup",
      },
    ],
  },
];

/** Flatten all doc items for lookup */
export function getAllDocSlugs(): string[] {
  return docsNavigation.flatMap((section) =>
    section.items.map((item) => item.slug)
  );
}

/** Find a doc item by slug */
export function findDocBySlug(slug: string): DocItem | undefined {
  for (const section of docsNavigation) {
    const found = section.items.find((item) => item.slug === slug);
    if (found) return found;
  }
  return undefined;
}

/** Find the section a slug belongs to */
export function findSectionBySlug(slug: string): DocSection | undefined {
  return docsNavigation.find((section) =>
    section.items.some((item) => item.slug === slug)
  );
}

/** Get previous and next docs for pagination */
export function getAdjacentDocs(slug: string): {
  prev: DocItem | null;
  next: DocItem | null;
} {
  const allItems = docsNavigation.flatMap((section) => section.items);
  const currentIndex = allItems.findIndex((item) => item.slug === slug);

  return {
    prev: currentIndex > 0 ? allItems[currentIndex - 1] : null,
    next:
      currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null,
  };
}
