"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Bookmark, Star, X, Plus, Loader2 } from "lucide-react";
import {
  useSavedSearches,
  useCreateSavedSearch,
  useDeleteSavedSearch,
} from "@/hooks/log.hooks";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface SavedSearch {
  _id: string;
  name: string;
  filters: {
    search?: string;
    levels?: string[];
    services?: string[];
    environments?: string[];
    eventTypes?: string[];
    timeRange?: string;
  };
  isDefault?: boolean;
  createdAt: string;
}

interface SavedSearchSelectorProps {
  projectId: string;
  currentFilters: {
    search?: string;
    levels?: string[];
    services?: string[];
    environments?: string[];
    eventTypes?: string[];
    timeRange?: string;
  };
  onLoadSearch: (filters: SavedSearch["filters"]) => void;
  className?: string;
}

function countActiveFilters(
  filters: SavedSearch["filters"]
): number {
  let count = 0;
  if (filters.search) count++;
  if (filters.levels && filters.levels.length > 0) count++;
  if (filters.services && filters.services.length > 0) count++;
  if (filters.environments && filters.environments.length > 0) count++;
  if (filters.eventTypes && filters.eventTypes.length > 0) count++;
  if (filters.timeRange) count++;
  return count;
}

export function SavedSearchSelector({
  projectId,
  currentFilters,
  onLoadSearch,
  className,
}: SavedSearchSelectorProps) {
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [newSearchName, setNewSearchName] = useState("");
  const [open, setOpen] = useState(false);

  const { data: savedSearches = [] } = useSavedSearches(projectId);
  const createMutation = useCreateSavedSearch();
  const deleteMutation = useDeleteSavedSearch();

  const handleSave = () => {
    const trimmed = newSearchName.trim();
    if (!trimmed) return;

    createMutation.mutate(
      {
        projectId,
        data: {
          name: trimmed,
          filters: currentFilters,
        },
      },
      {
        onSuccess: () => {
          setNewSearchName("");
          setShowSaveForm(false);
        },
      }
    );
  };

  const handleDelete = (
    e: React.MouseEvent,
    searchId: string
  ) => {
    e.stopPropagation();
    deleteMutation.mutate({ projectId, searchId });
  };

  const handleLoad = (filters: SavedSearch["filters"]) => {
    onLoadSearch(filters);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setShowSaveForm(false);
      setNewSearchName("");
    }
  };

  const searches = Array.isArray(savedSearches) ? savedSearches : [];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-1.5 border-border-subtle text-text-secondary hover:text-text-primary",
            className
          )}
        >
          <Bookmark className="size-3.5" />
          <span>Saved</span>
          {searches.length > 0 && (
            <Badge
              variant="secondary"
              className="ml-0.5 px-1.5 py-0 text-[10px] h-4 min-w-4 justify-center"
            >
              {searches.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-72 bg-bg-surface border-border-subtle p-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2.5">
          <span className="text-sm font-medium text-text-primary">
            Saved Searches
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-xs text-signal hover:text-signal hover:bg-signal/10"
            onClick={(e) => {
              e.preventDefault();
              setShowSaveForm((prev) => !prev);
              setNewSearchName("");
            }}
          >
            <Plus className="size-3" />
            Save Current
          </Button>
        </div>

        {/* Inline save form */}
        {showSaveForm && (
          <>
            <DropdownMenuSeparator className="bg-border-subtle m-0" />
            <div className="px-3 py-2.5 flex items-center gap-2">
              <Input
                value={newSearchName}
                onChange={(e) => setNewSearchName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search name..."
                className="h-7 text-xs bg-bg-base border-border-subtle focus-visible:border-signal focus-visible:ring-signal/20"
                autoFocus
              />
              <Button
                variant="signal"
                size="sm"
                className="h-7 px-3 text-xs shrink-0"
                onClick={handleSave}
                disabled={
                  !newSearchName.trim() || createMutation.isPending
                }
              >
                {createMutation.isPending ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </>
        )}

        <DropdownMenuSeparator className="bg-border-subtle m-0" />

        {/* Search list */}
        <div className="max-h-64 overflow-y-auto py-1">
          {searches.length === 0 ? (
            <div className="px-3 py-6 text-center">
              <Bookmark className="size-8 mx-auto mb-2 text-text-muted opacity-40" />
              <p className="text-xs text-text-muted">
                No saved searches yet
              </p>
              <p className="text-[11px] text-text-muted mt-0.5">
                Save your current filters to reuse them later
              </p>
            </div>
          ) : (
            searches.map((search: SavedSearch) => {
              const filterCount = countActiveFilters(search.filters);
              return (
                <div
                  key={search._id}
                  className="group flex items-center gap-2 px-3 py-2 mx-1 rounded-md cursor-pointer transition-colors hover:bg-signal/10"
                  onClick={() => handleLoad(search.filters)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleLoad(search.filters);
                    }
                  }}
                >
                  {/* Default star */}
                  {search.isDefault && (
                    <Star className="size-3 text-signal fill-signal shrink-0" />
                  )}

                  {/* Name */}
                  <span
                    className={cn(
                      "text-sm truncate flex-1",
                      search.isDefault
                        ? "text-signal font-medium"
                        : "text-text-primary"
                    )}
                  >
                    {search.name}
                  </span>

                  {/* Filter count badge */}
                  {filterCount > 0 && (
                    <Badge
                      variant="outline"
                      className="shrink-0 h-5 px-1.5 text-[10px] text-text-muted border-border-subtle"
                    >
                      {filterCount} {filterCount === 1 ? "filter" : "filters"}
                    </Badge>
                  )}

                  {/* Delete button */}
                  <button
                    className="shrink-0 opacity-0 group-hover:opacity-100 p-0.5 rounded transition-all text-text-muted hover:text-status-danger hover:bg-status-danger/10"
                    onClick={(e) => handleDelete(e, search._id)}
                    aria-label={`Delete "${search.name}" saved search`}
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : (
                      <X className="size-3" />
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
