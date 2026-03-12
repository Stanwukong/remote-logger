"use client";

import { useState } from "react";
import { useAdminOrganizations } from "@/hooks/admin.hook";
import { useDebounce } from "@/hooks/useDebounce";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Building2,
  Loader2,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const planColors: Record<string, string> = {
  developer: "bg-bg-elevated text-text-secondary",
  starter: "bg-data-info/10 text-data-info",
  professional: "bg-signal/15 text-signal",
  team: "bg-data-purple/10 text-data-purple",
  enterprise: "bg-status-warn/10 text-status-warn",
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AdminOrganizationsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 20;

  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useAdminOrganizations({
    page,
    limit,
    search: debouncedSearch || undefined,
  });

  const organizations = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organization Management"
        description="View and manage all platform organizations"
        badge={
          meta ? (
            <Badge variant="outline" className="text-text-muted">
              {meta.total} total
            </Badge>
          ) : undefined
        }
      />

      {/* Search */}
      <div className="max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <Input
            placeholder="Search by name or slug..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 bg-bg-surface border-border-subtle text-text-primary placeholder:text-text-muted"
          />
        </div>
      </div>

      {/* Table */}
      <Card className="bg-bg-surface border-border-subtle overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-5 h-5 animate-spin text-text-muted" />
            </div>
          ) : organizations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-text-muted gap-3">
              <Building2 className="w-10 h-10 text-text-muted/50" />
              <p className="text-sm">No organizations found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-subtle bg-bg-elevated/50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                      Members
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {organizations.map((org) => (
                    <tr
                      key={org._id}
                      className="hover:bg-bg-elevated/30 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-signal/10 flex items-center justify-center text-signal text-xs font-bold border border-signal/20">
                            {org.name?.[0]?.toUpperCase() ?? "O"}
                          </div>
                          <span className="text-text-primary font-medium">
                            {org.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-text-muted font-mono text-xs">
                        {org.slug}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant="secondary"
                          className={
                            planColors[org.plan] ?? planColors.developer
                          }
                        >
                          {org.plan}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-text-secondary">
                        {org.members?.length ?? 0}
                      </td>
                      <td className="py-3 px-4">
                        {org.ownerId ? (
                          <div>
                            <span className="text-text-primary text-xs">
                              {org.ownerId.firstName} {org.ownerId.lastName}
                            </span>
                            <br />
                            <span className="text-text-muted font-mono text-xs">
                              {org.ownerId.email}
                            </span>
                          </div>
                        ) : (
                          <span className="text-text-muted text-xs">N/A</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-text-muted text-xs">
                        {org.createdAt ? formatDate(org.createdAt) : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {meta && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-text-muted">
            Showing {(page - 1) * limit + 1}-
            {Math.min(page * limit, meta.total)} of {meta.total} organizations
          </p>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="text-text-muted hover:text-text-primary"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="flex items-center px-3 text-xs text-text-secondary">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="text-text-muted hover:text-text-primary"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
