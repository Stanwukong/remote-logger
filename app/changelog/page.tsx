"use client";

import { useState } from "react";
import { useChangelog } from "@/hooks/public.hooks";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Tag,
  Loader2,
  XCircle,
  Sparkles,
  Wrench,
  Bug,
  Shield,
  Zap,
} from "lucide-react";

type Category =
  | "feature"
  | "improvement"
  | "bugfix"
  | "security"
  | "performance";

const categories: Array<{ value: string; label: string }> = [
  { value: "", label: "All" },
  { value: "feature", label: "Features" },
  { value: "improvement", label: "Improvements" },
  { value: "bugfix", label: "Bug Fixes" },
  { value: "security", label: "Security" },
  { value: "performance", label: "Performance" },
];

const categoryConfig: Record<
  Category,
  { colorClass: string; bgClass: string; borderClass: string; icon: typeof Sparkles }
> = {
  feature: {
    colorClass: "text-signal",
    bgClass: "bg-signal/10",
    borderClass: "border-signal/20",
    icon: Sparkles,
  },
  improvement: {
    colorClass: "text-data-info",
    bgClass: "bg-data-info/10",
    borderClass: "border-data-info/20",
    icon: Wrench,
  },
  bugfix: {
    colorClass: "text-status-danger",
    bgClass: "bg-status-danger/10",
    borderClass: "border-status-danger/20",
    icon: Bug,
  },
  security: {
    colorClass: "text-status-warn",
    bgClass: "bg-status-warn/10",
    borderClass: "border-status-warn/20",
    icon: Shield,
  },
  performance: {
    colorClass: "text-data-purple",
    bgClass: "bg-data-purple/10",
    borderClass: "border-data-purple/20",
    icon: Zap,
  },
};

function CategoryBadge({ category }: { category: Category }) {
  const config = categoryConfig[category];
  const Icon = config.icon;
  const label =
    category === "bugfix"
      ? "Bug Fix"
      : category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${config.colorClass} ${config.bgClass} ${config.borderClass}`}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

function ChangelogEntry({
  version,
  title,
  date,
  category,
  description,
  highlights,
  isLast,
}: {
  version: string;
  title: string;
  date: string;
  category: Category;
  description: string;
  highlights: string[];
  isLast: boolean;
}) {
  const config = categoryConfig[category];
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative flex gap-6">
      {/* Timeline line and dot */}
      <div className="flex flex-col items-center">
        <div
          className={`w-3 h-3 rounded-full border-2 mt-1.5 ${config.bgClass} ${config.borderClass}`}
        />
        {!isLast && (
          <div className="w-px flex-1 bg-border-subtle mt-2" />
        )}
      </div>

      {/* Content */}
      <div className={`pb-10 flex-1 ${isLast ? "" : ""}`}>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="outline" className="font-mono text-xs">
            v{version}
          </Badge>
          <CategoryBadge category={category} />
          <span className="text-xs text-text-muted">{formattedDate}</span>
        </div>

        <h3 className="text-lg font-display font-bold text-text-primary mb-2">
          {title}
        </h3>

        <p className="text-sm text-text-secondary leading-relaxed mb-3">
          {description}
        </p>

        {highlights.length > 0 && (
          <ul className="space-y-1.5">
            {highlights.map((highlight, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-text-muted"
              >
                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${config.bgClass}`} />
                {highlight}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function ChangelogPage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const limit = 10;

  const { data, isLoading, isError } = useChangelog({
    page,
    limit,
    category: category || undefined,
  });

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-display font-bold text-text-primary">
          Changelog
        </h1>
        <p className="text-sm text-text-muted mt-1">
          New features, improvements, and fixes shipped to Apperio
        </p>
      </div>

      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => {
              setCategory(cat.value);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              category === cat.value
                ? "bg-signal/10 text-signal border border-signal/20"
                : "bg-bg-surface text-text-muted border border-border-subtle hover:text-text-primary hover:border-border-accent"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-6 h-6 text-signal animate-spin" />
          <p className="text-sm text-text-muted">Loading changelog...</p>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <XCircle className="w-8 h-8 text-status-danger" />
          <p className="text-sm text-text-muted">
            Unable to load changelog entries. Please try again later.
          </p>
        </div>
      )}

      {/* Entries timeline */}
      {data && data.entries.length > 0 && (
        <div>
          {data.entries.map((entry, index) => (
            <ChangelogEntry
              key={entry._id}
              version={entry.version}
              title={entry.title}
              date={entry.date}
              category={entry.category}
              description={entry.description}
              highlights={entry.highlights}
              isLast={index === data.entries.length - 1}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {data && data.entries.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Tag className="w-8 h-8 text-text-muted" />
          <p className="text-sm text-text-muted">
            No changelog entries found
            {category ? " for this category" : ""}.
          </p>
        </div>
      )}

      {/* Pagination */}
      {data && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-bg-surface border border-border-subtle text-text-muted hover:text-text-primary hover:border-border-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Previous
          </button>
          <span className="text-xs text-text-muted">
            Page {data.meta.page} of {data.meta.totalPages}
          </span>
          <button
            onClick={() =>
              setPage((p) => Math.min(data.meta.totalPages, p + 1))
            }
            disabled={page >= data.meta.totalPages}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-bg-surface border border-border-subtle text-text-muted hover:text-text-primary hover:border-border-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
