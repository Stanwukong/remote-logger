import { notFound } from "next/navigation";
import { Metadata } from "next";
import { findDocBySlug, findSectionBySlug, getAllDocSlugs } from "@/lib/docs/navigation";

/* ─── Content page imports ─────────────────────────────────────────────── */
import IntroductionPage from "@/lib/docs/content/introduction";
import QuickStartPage from "@/lib/docs/content/quickstart";
import InstallationPage from "@/lib/docs/content/installation";
import SdkOverviewPage from "@/lib/docs/content/sdk/overview";
import SdkConfigurationPage from "@/lib/docs/content/sdk/configuration";
import AutoInstrumentationPage from "@/lib/docs/content/sdk/auto-instrumentation";
import ErrorTrackingPage from "@/lib/docs/content/sdk/error-tracking";
import WebVitalsPage from "@/lib/docs/content/sdk/web-vitals";
import TracingPage from "@/lib/docs/content/sdk/tracing";
import DataSanitizationPage from "@/lib/docs/content/sdk/data-sanitization";
import ApiAuthenticationPage from "@/lib/docs/content/api/authentication";
import ApiLogsPage from "@/lib/docs/content/api/logs";
import ApiProjectsPage from "@/lib/docs/content/api/projects";
import ApiAlertsPage from "@/lib/docs/content/api/alerts";
import ApiDashboardsPage from "@/lib/docs/content/api/dashboards";
import ReactGuidePage from "@/lib/docs/content/guides/react";
import NextjsGuidePage from "@/lib/docs/content/guides/nextjs";

/* ─── Slug-to-component mapping ────────────────────────────────────────── */
const pageComponents: Record<string, React.ComponentType> = {
  introduction: IntroductionPage,
  quickstart: QuickStartPage,
  installation: InstallationPage,
  "sdk/overview": SdkOverviewPage,
  "sdk/configuration": SdkConfigurationPage,
  "sdk/auto-instrumentation": AutoInstrumentationPage,
  "sdk/error-tracking": ErrorTrackingPage,
  "sdk/web-vitals": WebVitalsPage,
  "sdk/tracing": TracingPage,
  "sdk/data-sanitization": DataSanitizationPage,
  "api/authentication": ApiAuthenticationPage,
  "api/logs": ApiLogsPage,
  "api/projects": ApiProjectsPage,
  "api/alerts": ApiAlertsPage,
  "api/dashboards": ApiDashboardsPage,
  "guides/react": ReactGuidePage,
  "guides/nextjs": NextjsGuidePage,
};

/* ─── Static params for SSG ────────────────────────────────────────────── */
export function generateStaticParams() {
  return getAllDocSlugs().map((slug) => ({
    slug: slug.split("/"),
  }));
}

/* ─── Metadata ─────────────────────────────────────────────────────────── */
interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const fullSlug = slug.join("/");
  const doc = findDocBySlug(fullSlug);
  const section = findSectionBySlug(fullSlug);

  if (!doc) {
    return { title: "Not Found - Apperio Docs" };
  }

  return {
    title: `${doc.title} - ${section?.title || "Docs"} - Apperio`,
    description: doc.description || `${doc.title} documentation for Apperio`,
  };
}

/* ─── Page component ───────────────────────────────────────────────────── */
export default async function DocsPage({ params }: PageProps) {
  const { slug } = await params;
  const fullSlug = slug.join("/");
  const PageComponent = pageComponents[fullSlug];

  if (!PageComponent) {
    notFound();
  }

  return <PageComponent />;
}
