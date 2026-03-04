"use client";

import { Project } from "@/types/project.types";
import { HealthRing } from "./HealthRing";
import { SignalDot } from "@/components/shared/SignalDot";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Activity, Users, Server, BarChart3 } from "lucide-react";

interface OverviewTabProps {
  analytics: Project["analytics"];
  recommendations: Project["recommendations"];
  project: Project["project"];
}

export function OverviewTab({ analytics, recommendations, project }: OverviewTabProps) {
  const healthScore = recommendations?.healthScore ?? 0;
  const overview = analytics?.overview;
  const errorRate = overview?.errorRate ?? 0;
  const serviceBreakdown = analytics?.usage?.serviceBreakdown ?? [];
  const environmentBreakdown = analytics?.usage?.environmentBreakdown ?? [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Overview */}
        <div className="lg:col-span-2 bg-bg-surface border border-border-subtle rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-2 text-text-primary">
            <Activity className="w-5 h-5 text-signal" />
            <h3 className="font-display font-semibold">System Health</h3>
          </div>
          <p className="text-sm text-text-secondary">
            Overall system performance and reliability metrics
          </p>

          <div className="flex items-center justify-between">
            <HealthRing score={healthScore} size="lg" />
            <div className="text-right">
              <p className="text-xs text-text-muted">Last updated</p>
              <p className="text-sm font-mono text-text-secondary">
                {overview?.lastUpdated ? new Date(overview.lastUpdated).toLocaleString() : "N/A"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Error Rate</span>
              <span className="font-mono text-text-primary">
                {errorRate}%
              </span>
            </div>
            <div className="h-2 bg-bg-base rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(errorRate, 100)}%`,
                  backgroundColor:
                    errorRate > 10
                      ? "var(--status-danger)"
                      : errorRate > 5
                      ? "var(--status-warn)"
                      : "var(--status-ok)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="bg-bg-surface border border-border-subtle rounded-lg p-6">
          <div className="flex items-center gap-2 text-text-primary mb-4">
            <Users className="w-5 h-5 text-data-info" />
            <h3 className="font-display font-semibold">Team</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="bg-bg-elevated border border-border-faint">
                <AvatarFallback className="text-text-primary bg-bg-elevated">
                  {(project.ownerId?.firstName?.[0] ?? project.name?.[0] ?? "O").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-text-primary">
                  {project.ownerId?.firstName} {project.ownerId?.lastName}
                </p>
                <p className="text-xs text-text-muted truncate">
                  {project.ownerId?.email}
                </p>
              </div>
              <Badge variant="outline" className="text-signal border-signal/30 text-xs">
                Owner
              </Badge>
            </div>

            {project.teamMembers?.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border-faint">
                {project.teamMembers.slice(0, 3).map((member) => (
                  <div key={member._id} className="flex items-center gap-3">
                    <Avatar className="w-7 h-7 bg-bg-elevated border border-border-faint">
                      <AvatarFallback className="text-xs text-text-secondary bg-bg-elevated">
                        {(member.user?.firstName?.[0] ?? "?").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-secondary truncate">
                        {member.user?.firstName} {member.user?.lastName}
                      </p>
                    </div>
                    <span className="text-xs text-text-muted capitalize">{member.role}</span>
                  </div>
                ))}
                {project.teamMembers.length > 3 && (
                  <p className="text-xs text-text-muted">
                    +{project.teamMembers.length - 3} more
                  </p>
                )}
              </div>
            )}

            <div className="pt-3 border-t border-border-faint space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Rate Limit</span>
                <span className="font-mono text-text-secondary">
                  {project.rateLimitConfig?.maxRequestsPerMinute}/min
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Burst Window</span>
                <span className="font-mono text-text-secondary">
                  {project.rateLimitConfig?.burstLimit}m
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service & Environment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Activity */}
        <div className="bg-bg-surface border border-border-subtle rounded-lg p-6">
          <div className="flex items-center gap-2 text-text-primary mb-4">
            <Server className="w-5 h-5 text-data-info" />
            <h3 className="font-display font-semibold">Service Activity</h3>
          </div>
          <div className="space-y-3">
            {serviceBreakdown.length === 0 ? (
              <p className="text-sm text-text-muted">No service data available</p>
            ) : (
              serviceBreakdown.map((service) => (
                <div
                  key={service._id}
                  className="flex items-center justify-between p-3 bg-bg-base border border-border-faint rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <SignalDot status="info" size="sm" />
                    <div>
                      <p className="text-sm font-medium text-text-primary">{service._id}</p>
                      <p className="text-xs text-text-muted">
                        Last: {new Date(service.lastActivity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-text-primary">
                      {service.requestCount.toLocaleString()}
                    </p>
                    <p className="text-xs text-text-muted">requests</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Environment Stats */}
        <div className="bg-bg-surface border border-border-subtle rounded-lg p-6">
          <div className="flex items-center gap-2 text-text-primary mb-4">
            <BarChart3 className="w-5 h-5 text-data-purple" />
            <h3 className="font-display font-semibold">Environment Stats</h3>
          </div>
          <div className="space-y-4">
            {environmentBreakdown.length === 0 ? (
              <p className="text-sm text-text-muted">No environment data available</p>
            ) : (
              environmentBreakdown.map((env) => {
                const successRate = env.requestCount > 0
                  ? Math.round(((env.requestCount - env.errorCount) / env.requestCount) * 100)
                  : 100;
                return (
                  <div key={env._id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="capitalize bg-bg-elevated text-text-secondary border-border-subtle">
                        {env._id}
                      </Badge>
                      <div className="text-right">
                        <span className="font-display font-bold text-text-primary">
                          {env.requestCount.toLocaleString()}
                        </span>
                        <span className="text-xs text-text-muted ml-1">requests</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-text-muted">Success Rate</span>
                        <span className="text-text-secondary">{successRate}%</span>
                      </div>
                      <div className="h-1.5 bg-bg-base rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${successRate}%`,
                            backgroundColor:
                              successRate >= 95
                                ? "var(--status-ok)"
                                : successRate >= 80
                                ? "var(--status-warn)"
                                : "var(--status-danger)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
