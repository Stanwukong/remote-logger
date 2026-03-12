import type { Metadata } from "next";
import { DocsSidebar, DocsMobileNav } from "@/components/docs";

export const metadata: Metadata = {
  title: "Documentation - Apperio",
  description:
    "Comprehensive documentation for Apperio: real-time logging, error tracking, and performance monitoring SDK.",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      {/* Mobile nav - visible only on small screens */}
      <DocsMobileNav />

      <div className="flex">
        {/* Desktop sidebar */}
        <DocsSidebar />

        {/* Main content area */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
