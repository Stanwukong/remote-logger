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
import { Lightbulb, TrendingUp, AlertTriangle, RefreshCw } from "lucide-react";
import {
  useProjectInsights,
  useInvalidateInsightsCache,
} from "@/hooks/useInsights";

export default function ProjectInsightsPage() {
  const params = useParams<{ projectId: string }>();
  const projectId =
    typeof params?.projectId === "string" ? params.projectId : "";

  const { data: insights, isLoading } = useProjectInsights(projectId, {
    timeRange: 24,
    includeRecommendations: true,
  });
  const invalidateMutation = useInvalidateInsightsCache();

  const handleRefresh = () => {
    invalidateMutation.mutate(projectId);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse" />
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
            <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No insights available
            </h3>
            <p className="text-muted-foreground">
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
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Lightbulb className="w-8 h-8" />
            Project Insights
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered recommendations and anomaly detection
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={invalidateMutation.isPending}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">
              Total Logs
            </p>
            <p className="text-3xl font-bold mt-2">
              {insights.summary.totalLogs.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">
              Error Rate
            </p>
            <p className="text-3xl font-bold mt-2 text-red-600">
              {insights.summary.errorRate.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">
              Warning Rate
            </p>
            <p className="text-3xl font-bold mt-2 text-yellow-600">
              {insights.summary.warningRate.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">
              Avg Logs/Hour
            </p>
            <p className="text-3xl font-bold mt-2">
              {insights.summary.averageLogsPerHour.toFixed(0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="recommendations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="issues">Top Issues</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          {insights.recommendations.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  No recommendations at this time
                </p>
              </CardContent>
            </Card>
          ) : (
            insights.recommendations.map((rec, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{rec.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {rec.description}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        rec.priority === "high"
                          ? "destructive"
                          : rec.priority === "medium"
                          ? "default"
                          : "secondary"
                      }
                      className="capitalize"
                    >
                      {rec.priority}
                    </Badge>
                  </div>
                </CardHeader>
                {rec.actionable && (
                  <CardContent>
                    <Badge variant="outline" className="text-green-600">
                      Actionable
                    </Badge>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-4">
          {insights.anomalies.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No anomalies detected</p>
              </CardContent>
            </Card>
          ) : (
            insights.anomalies.map((anomaly, index) => (
              <Card key={index} className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        <CardTitle className="text-lg capitalize">
                          {anomaly.type}
                        </CardTitle>
                      </div>
                      <CardDescription>{anomaly.description}</CardDescription>
                    </div>
                    <Badge
                      variant={
                        anomaly.severity === "high"
                          ? "destructive"
                          : anomaly.severity === "medium"
                          ? "default"
                          : "secondary"
                      }
                      className="capitalize"
                    >
                      {anomaly.severity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Detected {new Date(anomaly.detectedAt).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Log Volume Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge
                  variant={
                    insights.trends.logVolume === "increasing"
                      ? "default"
                      : insights.trends.logVolume === "decreasing"
                      ? "secondary"
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
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Error Rate Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge
                  variant={
                    insights.trends.errorRate === "increasing"
                      ? "destructive"
                      : insights.trends.errorRate === "decreasing"
                      ? "default"
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
                <p className="text-muted-foreground">No issues identified</p>
              </CardContent>
            </Card>
          ) : (
            insights.topIssues.map((issue, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{issue.issue}</CardTitle>
                      <CardDescription className="mt-2">
                        Occurred {issue.count} times
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        issue.impact === "high"
                          ? "destructive"
                          : issue.impact === "medium"
                          ? "default"
                          : "secondary"
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
