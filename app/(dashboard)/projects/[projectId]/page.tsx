/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  Activity,
  AlertTriangle,
  Users,
  FileText,
  ArrowLeft,
  Settings,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  TrendingUp,
  TrendingDown,
  Clock,
  Shield,
  Zap,
  Target,
  Server,
  Calendar,
  BarChart3,
  List,
} from "lucide-react";
import { useProject } from "@/hooks/project.hooks";
import { Project } from "@/types/project.types";

// Utility components
const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: any;
  trend?: "up" | "down" | "neutral";
  variant?: "default" | "success" | "warning" | "destructive";
}) => {
  const colorClasses = {
    default: "text-blue-600",
    success: "text-green-600",
    warning: "text-yellow-600",
    destructive: "text-red-600",
  };

  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : null;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Icon className="h-5 w-5 text-muted-foreground" />
          {TrendIcon && <TrendIcon className="h-4 w-4 text-muted-foreground" />}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={`text-3xl font-bold ${colorClasses[variant]}`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const HealthIndicator = ({
  score,
  status,
}: {
  score: number;
  status: string;
}) => {
  const getHealthColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getHealthVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-muted"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 28}`}
            strokeDashoffset={`${2 * Math.PI * 28 * (1 - score / 100)}`}
            className={getHealthColor(score).replace("bg-", "text-")}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold">{score}</span>
        </div>
      </div>
      <div>
        <p className="font-medium">Health Score</p>
        <Badge variant={getHealthVariant(score) as any} className="capitalize">
          {status}
        </Badge>
      </div>
    </div>
  );
};

export default function ProjectDashboard() {
  const params = useParams<{ projectId: string }>();
  const router = useRouter();
  const projectId =
    typeof params?.projectId === "string" ? params.projectId : "";
  const { data: projectData, isLoading } = useProject(projectId);
  

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!projectData || !projectData.project) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold">Project not found</h2>
          <p className="text-muted-foreground mt-2">
            The project you are looking for does not exist.
          </p>
          <div className="mt-4">
            <Button asChild>
              <Link href="/projects">Back to Projects</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  console.log("PROJECT DATA:", projectData);

  const { project, analytics, recommendations } = projectData as Project;

  const healthScore = recommendations.healthScore || 0;

  const healthStatus =
    healthScore >= 80
      ? "excellent"
      : healthScore >= 60
      ? "good"
      : healthScore >= 40
      ? "fair"
      : "poor";

  

  if (!project) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold">Project not found</h2>
          <p className="text-muted-foreground mt-2">
            The project you are looking for does not exist.
          </p>
          <div className="mt-4">
            <Button asChild>
              <Link href="/projects">Back to Projects</Link>
          </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/projects">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  {project.name}
                </h1>
                <Badge
                  variant={!project.isActive ? "default" : "secondary"}
                  className="text-sm"
                >
                  {!project.isActive ? "Active" : "Archived"}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <Server className="w-4 h-4" />
                <span>ID: {project._id}</span>
                <span>•</span>
                <Calendar className="w-4 h-4" />
                <span>
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push(`/projects/${project._id}/settings`)}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button size="sm" asChild>
              <Link href={`/logs?projectId=${project._id}`}>
                <Eye className="w-4 h-4 mr-2" />
                View Logs
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Logs"
            value={analytics.overview.totalLogs}
            subtitle="Last 7 days"
            icon={FileText}
            trend="neutral"
          />

          <MetricCard
            title="Error Rate"
            value={`${analytics.overview.errorRate}%`}
            subtitle={`${analytics.overview.errorLogs} errors`}
            icon={AlertTriangle}
            trend="up"
            variant={
              analytics.overview.errorRate > 10 ? "destructive" : "warning"
            }
          />

          <MetricCard
            title="Success Rate"
            value={`${Math.round(
              (analytics.performance.metrics.successfulRequests /
                analytics.performance.metrics.totalRequests) *
                100
            )}%`}
            subtitle={`${analytics.performance.metrics.successfulRequests}/${analytics.performance.metrics.totalRequests} requests`}
            icon={CheckCircle}
            variant="success"
          />

          <MetricCard
            title="Team Members"
            value={project.teamMembers?.length ?? 0}
            subtitle="Active contributors"
            icon={Users}
            trend="neutral"
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="recommendations">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Health Overview */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    System Health
                  </CardTitle>
                  <CardDescription>
                    Overall system performance and reliability metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <HealthIndicator
                      score={healthScore}
                      status={healthStatus}
                    />
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Last updated
                      </p>
                      <p className="text-sm font-medium">
                        {new Date(
                          analytics.overview.lastUpdated
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Error Rate</span>
                      <span className="font-medium">
                        {analytics.overview.errorRate}%
                      </span>
                    </div>
                    <Progress
                      value={analytics.overview.errorRate}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Team */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Team
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Owner</span>
                      <Badge variant="outline">
                        {project.teamMembers[0]?.role}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {(project.name?.[0] ?? "").toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">Owner</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {project.ownerId.firstName +
                            " " +
                            project.ownerId.lastName}
                        </p>
                      </div>
                    </div>
                    <div className="pt-2 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Rate Limit</span>
                        <span className="font-mono">
                          {project.rateLimitConfig.maxRequestsPerMinute}/min
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Burst Limit</span>
                        <span className="font-mono">
                          {project.rateLimitConfig.burstLimit}m
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
        </div>

            {/* Service Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    Service Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.usage.serviceBreakdown.map((service) => (
                      <div
                        key={service._id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <div>
                            <p className="font-medium text-sm">{service._id}</p>
                            <p className="text-xs text-muted-foreground">
                              Last active:{" "}
                              {new Date(service.lastActivity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{service.requestCount}</p>
                          <p className="text-xs text-muted-foreground">
                            requests
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Environment Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.usage.environmentBreakdown.map((env) => (
                      <div key={env._id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="capitalize">
                              {env._id}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <span className="font-bold">
                              {env.requestCount}
                            </span>
                            <span className="text-sm text-muted-foreground ml-1">
                              requests
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Success Rate</span>
                            <span>
                              {Math.round(
                                ((env.requestCount - env.errorCount) /
                                  env.requestCount) *
                                  100
                              )}
                              %
                            </span>
                          </div>
                          <Progress
                            value={
                              ((env.requestCount - env.errorCount) /
                                env.requestCount) *
                              100
                            }
                            className="h-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
        </TabsContent>

          <TabsContent value="errors" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Error Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Error Analysis
                  </CardTitle>
                  <CardDescription>Breakdown by severity level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.errors.analysis.map((error, index) => {
                      const config = {
                        error: {
                          color: "text-red-600",
                          bg: "bg-red-50 border-red-200",
                          icon: XCircle,
                        },
                        warn: {
                          color: "text-yellow-600",
                          bg: "bg-yellow-50 border-yellow-200",
                          icon: AlertCircle,
                        },
                        fatal: {
                          color: "text-red-800",
                          bg: "bg-red-100 border-red-300",
                          icon: XCircle,
                        },
                      }[error._id.level] || {
                        color: "text-gray-600",
                        bg: "bg-gray-50",
                        icon: Info,
                      };

                      return (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border ${config.bg}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <config.icon className="h-4 w-4" />
                              <span className="font-medium capitalize">
                                {error._id.level}
                              </span>
                            </div>
                            <Badge variant="outline" className={config.color}>
                              {error.count} occurrences
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                            <div>Service: {error._id.service}</div>
                            <div>Environment: {error._id.environment}</div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Last:{" "}
                            {new Date(error.lastOccurrence).toLocaleString()}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Top Errors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Critical Issues
                  </CardTitle>
                  <CardDescription>
                    Most frequent error patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.errors.topErrors.map((error) => (
                      <div
                        key={error._id}
                        className="p-4 border rounded-lg bg-red-50 border-red-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-medium text-sm text-red-800">
                            {error._id}
                          </h4>
                          <Badge variant="destructive" className="text-xs">
                            {error.count} times
                          </Badge>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              Services:
                            </span>
                            {error.services.map((service) => (
                              <Badge
                                key={service}
                                variant="outline"
                                className="h-5"
                              >
                                {service}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              Environments:
                            </span>
                            {error.environments.map((env) => (
                              <Badge
                                key={env}
                                variant="secondary"
                                className="h-5"
                              >
                                {env}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-muted-foreground">
                            Last seen:{" "}
                            {new Date(error.lastSeen).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
        </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <MetricCard
                title="Total Requests"
                value={analytics.performance.metrics.totalRequests}
                subtitle="Last period"
                icon={Activity}
              />

              <MetricCard
                title="Successful Requests"
                value={analytics.performance.metrics.successfulRequests}
                subtitle={`${Math.round(
                  (analytics.performance.metrics.successfulRequests /
                    analytics.performance.metrics.totalRequests) *
                    100
                )}% success rate`}
                icon={CheckCircle}
                variant="success"
              />

              <MetricCard
                title="Average Response Time"
                value={analytics.performance.metrics.avgResponseTime?.toFixed()}
                subtitle="Needs attention"
                icon={XCircle}
                variant="destructive"
              />

              
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Performance Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert
                    variant={
                      analytics.performance.health === "poor"
                        ? "destructive"
                        : "default"
                    }
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      System health is currently{" "}
                      <strong>{analytics.performance.health}</strong> based on
                      recent performance metrics.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Key Insights</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {analytics.usage.insights.map((insight, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Time Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Average Response Time
                </CardTitle>
                <CardDescription>
                  Historical trend of response times (in ms)
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analytics.responseTime.history}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="avgResponseTime"
                      stroke="#8884d8"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
        </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Usage Patterns */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Usage Patterns
                  </CardTitle>
                  <CardDescription>
                    Activity distribution and trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">Peak Activity</h4>
                        <Badge variant="outline" className="text-blue-600">
                          16:00 Wed
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Highest traffic occurs during hour 16 on weekday 3
                      </p>
                    </div>

                    {analytics.usage.insights.map((insight, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{insight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Configuration
                  </CardTitle>
                  <CardDescription>Current project settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">API Key</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                        >
                          Regenerate
                        </Button>
                      </div>
                      <div className="p-2 bg-muted rounded font-mono text-xs break-all">
                        {project.apiKey}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Rate Limiting</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="p-2 border rounded text-center">
                          <div className="font-bold">
                            {project.rateLimitConfig?.maxRequestsPerMinute}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            per minute
                          </div>
                        </div>
                        <div className="p-2 border rounded text-center">
                          <div className="font-bold">
                            {project.rateLimitConfig?.burstLimit}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            window (mins)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
        </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Action Items
                    <Badge
                      variant={
                        recommendations.priority === "high"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {recommendations.priority} priority
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Recommended improvements based on current metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {Object.entries(recommendations.categories).map(
                      ([category, items]) => (
                        <div key={category} className="space-y-3">
                          <h4 className="font-medium text-sm capitalize flex items-center gap-2">
                            {category === "performance" && (
                              <Zap className="w-4 h-4" />
                            )}
                            {category === "reliability" && (
                              <Shield className="w-4 h-4" />
                            )}
                            {category === "optimization" && (
                              <TrendingUp className="w-4 h-4" />
                            )}
                            {category === "monitoring" && (
                              <Activity className="w-4 h-4" />
                            )}
                            {category}
                          </h4>
                          <ul className="space-y-2">
                            {items.map((item, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                              >
                                <List className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                                <span className="text-sm leading-relaxed">
                                  {item}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
