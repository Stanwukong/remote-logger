"use client";

import { useState } from "react";
import { useAdminUsers, useUpdateUserRole } from "@/hooks/admin.hook";
import { useDebounce } from "@/hooks/useDebounce";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Shield,
  User,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

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

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const limit = 20;

  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useAdminUsers({
    page,
    limit,
    search: debouncedSearch || undefined,
    role: roleFilter !== "all" ? roleFilter : undefined,
  });

  const updateRole = useUpdateUserRole();

  const users = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateRole.mutateAsync({ userId, role: newRole });
      toast.success("User role updated successfully");
    } catch {
      toast.error("Failed to update user role");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="View and manage all platform users"
        badge={
          meta ? (
            <Badge variant="outline" className="text-text-muted">
              {meta.total} total
            </Badge>
          ) : undefined
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 bg-bg-surface border-border-subtle text-text-primary placeholder:text-text-muted"
          />
        </div>
        <div className="flex gap-1">
          {["all", "developer", "admin"].map((r) => (
            <Button
              key={r}
              variant={roleFilter === r ? "default" : "ghost"}
              size="sm"
              className={
                roleFilter === r
                  ? "bg-signal/15 text-signal hover:bg-signal/20 text-xs"
                  : "text-text-muted hover:text-text-primary text-xs"
              }
              onClick={() => {
                setRoleFilter(r);
                setPage(1);
              }}
            >
              {r === "all" ? "All Roles" : r.charAt(0).toUpperCase() + r.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card className="bg-bg-surface border-border-subtle overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-5 h-5 animate-spin text-text-muted" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-text-muted text-sm">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-subtle bg-bg-elevated/50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                      Role
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                      Auth
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-bg-elevated/30 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center text-xs font-medium text-text-muted border border-border-subtle">
                            {user.firstName?.[0]}
                            {user.lastName?.[0]}
                          </div>
                          <span className="text-text-primary font-medium">
                            {user.firstName} {user.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-text-secondary font-mono text-xs">
                        {user.email}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={user.role === "admin" ? "default" : "secondary"}
                          className={
                            user.role === "admin"
                              ? "bg-signal/15 text-signal border-signal/30"
                              : "bg-bg-elevated text-text-secondary"
                          }
                        >
                          {user.role === "admin" ? (
                            <Shield className="w-3 h-3 mr-1" />
                          ) : (
                            <User className="w-3 h-3 mr-1" />
                          )}
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-text-muted text-xs">
                        {user.joinedAt ? formatDate(user.joinedAt) : "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        {user.oauthProvider ? (
                          <Badge
                            variant="outline"
                            className="text-xs text-text-muted"
                          >
                            {user.oauthProvider}
                          </Badge>
                        ) : (
                          <span className="text-xs text-text-muted">
                            Email/Password
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-text-muted hover:text-text-primary"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-bg-surface border-border-subtle"
                          >
                            {user.role === "developer" ? (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleRoleChange(user._id, "admin")
                                }
                                className="text-text-primary hover:bg-bg-elevated cursor-pointer"
                              >
                                <Shield className="w-4 h-4 mr-2 text-signal" />
                                Promote to Admin
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleRoleChange(user._id, "developer")
                                }
                                className="text-text-primary hover:bg-bg-elevated cursor-pointer"
                              >
                                <User className="w-4 h-4 mr-2" />
                                Demote to Developer
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
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
            {Math.min(page * limit, meta.total)} of {meta.total} users
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
