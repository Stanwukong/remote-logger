"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Sun,
  Moon,
  Monitor,
  Clock,
  RefreshCw,
  Star,
  Trash2,
  Loader2,
} from "lucide-react";
import { useFavorites, useRemoveFavorite } from "@/hooks/userPreference.hook";
import { useLogHiveStore, type TimeRange } from "@/store/loghive-store";
import { toast } from "sonner";
import Link from "next/link";

const timeRangeOptions: { label: string; value: TimeRange }[] = [
  { label: "1 hour", value: "1h" },
  { label: "6 hours", value: "6h" },
  { label: "24 hours", value: "24h" },
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
];

const refreshIntervals = [
  { label: "10 seconds", value: 10000 },
  { label: "30 seconds", value: 30000 },
  { label: "1 minute", value: 60000 },
  { label: "5 minutes", value: 300000 },
];

export default function PreferencesPage() {
  const { data: favoritesData, isLoading: favoritesLoading } = useFavorites();
  const removeFavorite = useRemoveFavorite();

  const theme = useLogHiveStore((s) => s.theme);
  const setTheme = useLogHiveStore((s) => s.setTheme);
  const selectedTimeRange = useLogHiveStore((s) => s.selectedTimeRange);
  const setTimeRange = useLogHiveStore((s) => s.setTimeRange);
  const autoRefreshEnabled = useLogHiveStore((s) => s.autoRefreshEnabled);
  const setAutoRefreshEnabled = useLogHiveStore((s) => s.setAutoRefreshEnabled);
  const autoRefreshInterval = useLogHiveStore((s) => s.autoRefreshInterval);
  const setAutoRefreshInterval = useLogHiveStore(
    (s) => s.setAutoRefreshInterval
  );

  const favorites = Array.isArray(favoritesData) ? favoritesData : [];

  const handleRemoveFavorite = (projectId: string) => {
    removeFavorite.mutate(projectId, {
      onSuccess: () => toast.success("Removed from favorites"),
      onError: () => toast.error("Failed to remove from favorites"),
    });
  };

  const themeOptions = [
    { label: "Dark", value: "dark" as const, icon: Moon },
    { label: "Light", value: "light" as const, icon: Sun },
    { label: "System", value: "system" as const, icon: Monitor },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold tracking-tight text-text-primary flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-signal/10 flex items-center justify-center">
            <Heart className="w-5 h-5 text-signal" />
          </div>
          Preferences
        </h1>
        <p className="text-text-secondary mt-1 ml-[46px]">
          Customize your dashboard experience
        </p>
      </div>

      {/* Theme Selection */}
      <Card className="bg-bg-surface border-border-subtle">
        <CardHeader>
          <CardTitle className="font-display text-text-primary flex items-center gap-2">
            <Sun className="w-5 h-5 text-signal" />
            Appearance
          </CardTitle>
          <CardDescription className="text-text-muted">
            Choose your preferred theme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isActive = theme === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all duration-200 ${
                    isActive
                      ? "bg-signal/10 border-signal text-signal"
                      : "bg-bg-elevated border-border-subtle text-text-secondary hover:border-border-accent hover:text-text-primary"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Default Time Range */}
      <Card className="bg-bg-surface border-border-subtle">
        <CardHeader>
          <CardTitle className="font-display text-text-primary flex items-center gap-2">
            <Clock className="w-5 h-5 text-data" />
            Default Time Range
          </CardTitle>
          <CardDescription className="text-text-muted">
            Set the default time range for dashboards and charts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {timeRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeRange(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                  selectedTimeRange === option.value
                    ? "bg-signal/10 border-signal text-signal"
                    : "bg-bg-elevated border-border-subtle text-text-secondary hover:border-border-accent hover:text-text-primary"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Auto-refresh */}
      <Card className="bg-bg-surface border-border-subtle">
        <CardHeader>
          <CardTitle className="font-display text-text-primary flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-data" />
            Auto-Refresh
          </CardTitle>
          <CardDescription className="text-text-muted">
            Automatically refresh dashboard data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between p-4 rounded-lg bg-bg-elevated border border-border-subtle">
            <div>
              <Label className="text-text-primary text-sm font-medium">
                Enable Auto-Refresh
              </Label>
              <p className="text-sm text-text-muted mt-0.5">
                Automatically fetch new data at regular intervals
              </p>
            </div>
            <Switch
              checked={autoRefreshEnabled}
              onCheckedChange={setAutoRefreshEnabled}
            />
          </div>

          {autoRefreshEnabled && (
            <div className="space-y-2">
              <Label className="text-text-secondary text-sm">
                Refresh Interval
              </Label>
              <div className="flex flex-wrap gap-2">
                {refreshIntervals.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAutoRefreshInterval(option.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                      autoRefreshInterval === option.value
                        ? "bg-signal/10 border-signal text-signal"
                        : "bg-bg-elevated border-border-subtle text-text-secondary hover:border-border-accent hover:text-text-primary"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Favorite Projects */}
      <Card className="bg-bg-surface border-border-subtle">
        <CardHeader>
          <CardTitle className="font-display text-text-primary flex items-center gap-2">
            <Star className="w-5 h-5 text-status-warn" />
            Favorite Projects
          </CardTitle>
          <CardDescription className="text-text-muted">
            Quick access to your starred projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          {favoritesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-signal" />
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-8">
              <Star className="w-10 h-10 text-text-muted mx-auto mb-3 opacity-40" />
              <p className="text-sm text-text-muted">
                No favorite projects yet.
              </p>
              <p className="text-xs text-text-muted mt-1">
                Star projects from the projects page to see them here.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {favorites.map((fav: any) => (
                <div
                  key={fav.projectId || fav._id}
                  className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated border border-border-subtle hover:border-border-accent transition-colors"
                >
                  <Link
                    href={`/projects/${fav.projectId || fav._id}`}
                    className="flex items-center gap-3 flex-1 min-w-0"
                  >
                    <div className="w-8 h-8 rounded-md bg-signal/10 flex items-center justify-center shrink-0">
                      <Star className="w-4 h-4 text-signal" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {fav.name || fav.projectName || "Unnamed Project"}
                      </p>
                      {fav.description && (
                        <p className="text-xs text-text-muted truncate">
                          {fav.description}
                        </p>
                      )}
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleRemoveFavorite(fav.projectId || fav._id)
                    }
                    disabled={removeFavorite.isPending}
                    className="text-text-muted hover:text-status-danger hover:bg-status-danger/10 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
