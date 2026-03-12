"use client";

import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Activity,
  Zap,
  Check,
  CheckCircle,
  Scan,
  ShieldAlert,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  useProjectInsights,
  useInvalidateInsightsCache,
  useEnrichedInsights,
  useAskQuestion,
  useOptimizationSuggestions,
} from "@/hooks/useInsights";
import {
  useAnomalies,
  useAnomalyStats,
  useAcknowledgeAnomaly,
  useResolveAnomaly,
  useTriggerScan,
} from "@/hooks/anomaly.hook";
import { AnomalyInsightCarousel } from "@/components/shared/AnomalyInsightCarousel";
import { MetricCard } from "@/components/shared/MetricCard";
import { NLQueryBar } from "@/components/shared/NLQueryBar";
import { AnomalyType } from "@/types/anomaly.types";

// Map anomaly type to icon
const typeIcons: Record<AnomalyType, React.ReactNode> = {
  log_volume_spike: <TrendingUp className="w-5 h-5" />,
  error_rate_increase: <AlertTriangle className="w-5 h-5" />,
  response_time_degradation: <Activity className="w-5 h-5" />,
  error_spike: <Zap className="w-5 h-5" />,
};

export default function ProjectInsightsPage() {
  const params = useParams<{ projectId: string }>();
  const projectId =
    typeof params?.projectId === "string" ? params.projectId : "";

  // Statistical insights
  const { data: insights, isLoading } = useProjectInsights(projectId, {
    timeRange: 24,
    includeRecommendations: true,
  });
  const invalidateMutation = useInvalidateInsightsCache();

  // Enriched insights (AI summary)
  const { data: enrichedData } = useEnrichedInsights(projectId, { timeRange: 24 });

  // NLQ mutation
  const askMutation = useAskQuestion();

  // Optimization suggestions
  const { data: suggestionsData } = useOptimizationSuggestions(projectId);

  // Anomaly data
  const { data: anomalyData } = useAnomalies(projectId, { resolved: false, limit: 20 });
  const { data: anomalyStats } = useAnomalyStats(projectId);
  const acknowledgeMutation = useAcknowledgeAnomaly();
  const resolveMutation = useResolveAnomaly();
  const scanMutation = useTriggerScan();

  const anomalies = anomalyData?.data || [];
  const suggestions = suggestionsData?.suggestions || [];

  const handleRefresh = () => {
    invalidateMutation.mutate(projectId);
  };

  const handleAskQuestion = (question: string) => {
    askMutation.mutate({ projectId, question });
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 w-48 bg-bg-elevated rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-bg-elevated rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <Lightbulb className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              No insights available
            </h3>
            <p className="text-text-secondary">
              Insights will appear once we have enough data to analyze
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-text-primary">
            <Lightbulb className="w-8 h-8 text-signal" />
            Project Insights
          </h1>
          <p className="text-text-secondary mt-1">
            AI-powered recommendations and anomaly detection
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scanMutation.mutate(projectId)}
            disabled={scanMutation.isPending}
            className="border-border-faint"
          >
            <Scan className="w-4 h-4 mr-2" />
            Scan Now
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={invalidateMutation.isPending}
            className="border-border-faint"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* AI Summary Card */}
      {enrichedData?.aiSummary && (
        <div className="bg-bg-surface border border-border-faint rounded-xl p-5 border-l-[3px] border-l-signal">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-signal" />
            <span className="bg-signal/10 text-signal text-[11px] rounded px-2 py-0.5 font-medium">
              AI
            </span>
            <span className="text-sm font-medium text-text-primary">
              Health Summary
            </span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
            {enrichedData.aiSummary}
          </p>
          <p className="text-xs text-text-muted italic mt-2">
            Based on {insights.summary.totalLogs.toLocaleString()} events in the last 24h
            {enrichedData.anomalyCount > 0 && ` · ${enrichedData.anomalyCount} open anomalies`}
          </p>
        </div>
      )}

      {/* Anomaly Insight Carousel — Watchdog-style, always visible */}
      {anomalies.length > 0 && (
        <AnomalyInsightCarousel anomalies={anomalies} />
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          label="Total Logs"
          value={insights.summary.totalLogs.toLocaleString()}
          icon={<Activity className="w-4 h-4" />}
        />
        <MetricCard
          label="Error Rate"
          value={`${insights.summary.errorRate.toFixed(2)}%`}
          icon={<AlertTriangle className="w-4 h-4" />}
          variant={insights.summary.errorRate > 5 ? "danger" : "default"}
        />
        <MetricCard
          label="Open Anomalies"
          value={String(
            (anomalyStats?.openCritical || 0) +
              (anomalyStats?.openWarnings || 0) +
              (anomalyStats?.openInfo || 0)
          )}
          icon={<ShieldAlert className="w-4 h-4" />}
          variant={anomalyStats?.openCritical ? "danger" : "default"}
        />
        <MetricCard
          label="Avg Logs/Hour"
          value={insights.summary.averageLogsPerHour.toFixed(0)}
          icon={<Clock className="w-4 h-4" />}
        />
      </div>

      {/* Ask a Question — Honeycomb NLQ pattern */}
      <div>
        <h2 className="text-sm font-display font-semibold text-text-primary mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-signal" />
          Ask a Question
        </h2>
        <NLQueryBar
          onSubmit={handleAskQuestion}
          response={askMutation.data ? { answer: askMutation.data.answer, source: askMutation.data.source } : null}
          isLoading={askMutation.isPending}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="anomalies" className="space-y-6">
        <TabsList>
          <TabsTrigger value="anomalies">
            Anomalies
            {anomalies.length > 0 && (
              <Badge variant="status-danger" className="ml-1.5 text-[10px]">
                {anomalies.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="suggestions">
            Suggestions
            {suggestions.length > 0 && (
              <Badge variant="signal" className="ml-1.5 text-[10px]">
                {suggestions.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="issues">Top Issues</TabsTrigger>
        </TabsList>

        {/* Anomalies Tab */}
        <TabsContent value="anomalies" className="space-y-4">
          {/* Anomaly Stats Row */}
          {anomalyStats && (
            <div className="grid grid-cols-3 gap-4">
              <Card className="border-l-[3px] border-l-status-danger">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
                    Open Critical
                  </p>
                  <p className="text-2xl font-bold text-status-danger mt-1">
                    {anomalyStats.openCritical}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-l-[3px] border-l-status-warn">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
                    Open Warnings
                  </p>
                  <p className="text-2xl font-bold text-status-warn mt-1">
                    {anomalyStats.openWarnings}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-l-[3px] border-l-status-ok">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
                    Resolved Today
                  </p>
                  <p className="text-2xl font-bold text-status-ok mt-1">
                    {anomalyStats.resolvedToday}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Anomaly List */}
          {anomalies.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <ShieldAlert className="w-10 h-10 text-text-muted mx-auto mb-3" />
                <p className="text-text-secondary">No anomalies detected</p>
                <p className="text-xs text-text-muted mt-1">
                  Anomalies are automatically detected every 5 minutes
                </p>
              </CardContent>
            </Card>
          ) : (
            anomalies.map((anomaly) => (
              <Card
                key={anomaly._id}
                className={`border-l-[3px] ${
                  anomaly.severity === "critical"
                    ? "border-l-status-danger"
                    : anomaly.severity === "warning"
                    ? "border-l-status-warn"
                    : "border-l-level-info"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={
                            anomaly.severity === "critical"
                              ? "text-status-danger"
                              : anomaly.severity === "warning"
                              ? "text-status-warn"
                              : "text-text-muted"
                          }
                        >
                          {typeIcons[anomaly.type]}
                        </span>
                        <CardTitle className="text-base text-text-primary">
                          {anomaly.type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-text-secondary">
                        {anomaly.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          anomaly.severity === "critical"
                            ? "status-danger"
                            : anomaly.severity === "warning"
                            ? "status-warn"
                            : "level-info"
                        }
                      >
                        {anomaly.severity}
                      </Badge>
                      <span className="text-xs font-mono text-text-muted">
                        {anomaly.deviation}σ
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-text-muted">
                      Detected {new Date(anomaly.detectedAt).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2">
                      {!anomaly.acknowledged && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => acknowledgeMutation.mutate(anomaly._id)}
                          disabled={acknowledgeMutation.isPending}
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Acknowledge
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-status-ok"
                        onClick={() => resolveMutation.mutate(anomaly._id)}
                        disabled={resolveMutation.isPending}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Resolve
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Optimization Suggestions Tab (AI + Heuristic) */}
        <TabsContent value="suggestions" className="space-y-4">
          {suggestions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Sparkles className="w-10 h-10 text-text-muted mx-auto mb-3" />
                <p className="text-text-secondary">
                  No optimization suggestions at this time
                </p>
                <p className="text-xs text-text-muted mt-1">
                  Suggestions are generated based on your log patterns and error data
                </p>
              </CardContent>
            </Card>
          ) : (
            suggestions.map((suggestion, index) => (
              <Card
                key={index}
                className={`border-l-[3px] hover:border-border-subtle hover:-translate-y-px transition-all ${
                  suggestion.priority === "high"
                    ? "border-l-status-danger"
                    : suggestion.priority === "medium"
                    ? "border-l-status-warn"
                    : "border-l-signal"
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-base text-text-primary">
                          {suggestion.title}
                        </CardTitle>
                        {suggestion.source === "ai" && (
                          <span className="bg-signal/10 text-signal text-[10px] rounded px-1.5 py-0.5 font-medium flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            AI
                          </span>
                        )}
                      </div>
                      <CardDescription className="text-text-secondary line-clamp-3">
                        {suggestion.description}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        suggestion.priority === "high"
                          ? "status-danger"
                          : suggestion.priority === "medium"
                          ? "status-warn"
                          : "signal"
                      }
                      className="capitalize"
                    >
                      {suggestion.priority}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {insights.recommendations.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-text-secondary">
                  No recommendations at this time
                </p>
              </CardContent>
            </Card>
          ) : (
            insights.recommendations.map((rec, index) => (
              <Card key={index} className="border-l-[3px] border-l-signal">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base text-text-primary">
                        {rec.title}
                      </CardTitle>
                      <CardDescription className="mt-2 text-text-secondary">
                        {rec.description}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        rec.priority === "high"
                          ? "status-danger"
                          : rec.priority === "medium"
                          ? "status-warn"
                          : "signal"
                      }
                      className="capitalize"
                    >
                      {rec.priority}
                    </Badge>
                  </div>
                </CardHeader>
                {rec.actionable && (
                  <CardContent>
                    <Badge variant="status-ok">Actionable</Badge>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-text-primary">
                  <TrendingUp className="w-5 h-5 text-signal" />
                  Log Volume Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge
                  variant={
                    insights.trends.logVolume === "increasing"
                      ? "status-warn"
                      : insights.trends.logVolume === "decreasing"
                      ? "signal"
                      : "outline"
                  }
                  className="capitalize text-lg"
                >
                  {insights.trends.logVolume}
                </Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-text-primary">
                  <AlertTriangle className="w-5 h-5 text-status-danger" />
                  Error Rate Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge
                  variant={
                    insights.trends.errorRate === "increasing"
                      ? "status-danger"
                      : insights.trends.errorRate === "decreasing"
                      ? "status-ok"
                      : "outline"
                  }
                  className="capitalize text-lg"
                >
                  {insights.trends.errorRate}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          {insights.topIssues.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-text-secondary">No issues identified</p>
              </CardContent>
            </Card>
          ) : (
            insights.topIssues.map((issue, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base text-text-primary">
                        {issue.issue}
                      </CardTitle>
                      <CardDescription className="mt-2 text-text-secondary">
                        Occurred {issue.count} times
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        issue.impact === "high"
                          ? "status-danger"
                          : issue.impact === "medium"
                          ? "status-warn"
                          : "signal"
                      }
                      className="capitalize"
                    >
                      {issue.impact} impact
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
