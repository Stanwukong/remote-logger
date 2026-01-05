"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  User,
  Clock,
  MousePointer,
  Eye,
  AlertCircle,
  CheckCircle,
  Navigation,
  Globe,
  ChevronDown,
  ChevronRight,
  Loader2,
} from "lucide-react";

import { analyticsService } from "@/services/analytics.service";
import { Session, SessionEvent } from "@/types/analytics.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AnalyticsSessionsProps {
  projectId: string;
}

const AnalyticsSessions = ({ projectId }: AnalyticsSessionsProps) => {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [expandedEvents, setExpandedEvents] = useState<Set<number>>(new Set());

  // Queries
  const sessionsQuery = useQuery({
    queryKey: ["sessions", projectId],
    queryFn: () => analyticsService.getSessions(projectId, { limit: 20 }),
  });

  const timelineQuery = useQuery({
    queryKey: ["sessionTimeline", projectId, selectedSession?.id],
    queryFn: () =>
      selectedSession
        ? analyticsService.getSessionTimeline(projectId, selectedSession.id)
        : Promise.resolve([]),
    enabled: !!selectedSession,
  });

  const handleSessionClick = (session: Session) => {
    setSelectedSession(session);
    setExpandedEvents(new Set());
  };

  const toggleEventExpand = (index: number) => {
    setExpandedEvents((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "pageview":
        return <Eye className="w-4 h-4 text-blue-600" />;
      case "interaction":
        return <MousePointer className="w-4 h-4 text-green-600" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case "network":
        return <Globe className="w-4 h-4 text-purple-600" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "pageview":
        return "border-blue-300 bg-blue-50";
      case "interaction":
        return "border-green-300 bg-green-50";
      case "error":
        return "border-red-300 bg-red-50";
      case "network":
        return "border-purple-300 bg-purple-50";
      default:
        return "border-gray-300 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Session Explorer</h2>
        <p className="text-muted-foreground">
          Analyze user journeys and session behavior
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sessions List */}
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <div className="p-4 border-b bg-muted/50">
              <h3 className="text-sm font-semibold">Recent Sessions</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {sessionsQuery.data?.meta.count || 0} active sessions
              </p>
            </div>
            <div className="flex-1 h-[600px] overflow-y-auto pr-2">
              {sessionsQuery.isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {sessionsQuery.data?.data.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => handleSessionClick(session)}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedSession?.id === session.id
                          ? "bg-blue-50 border-l-4 border-blue-600"
                          : "hover:bg-muted/50 border-l-4 border-transparent"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">
                            {session.userId}
                          </span>
                        </div>
                        {session.hasErrors && (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(session.duration)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {session.pageViews} pages
                        </div>
                        <div>{session.device}</div>
                        <div>{session.country}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(session.startTime).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Session Details & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {selectedSession ? (
            <>
              {/* Session Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Session Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Duration
                      </div>
                      <div className="text-2xl font-bold">
                        {formatDuration(selectedSession.duration)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Page Views
                      </div>
                      <div className="text-2xl font-bold">
                        {selectedSession.pageViews}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Events
                      </div>
                      <div className="text-2xl font-bold">
                        {selectedSession.events}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Status
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          selectedSession.hasErrors
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {selectedSession.hasErrors ? "Has Errors" : "Healthy"}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Device:</span>{" "}
                      <span className="font-medium">
                        {selectedSession.device}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Browser:</span>{" "}
                      <span className="font-medium">
                        {selectedSession.browser}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Country:</span>{" "}
                      <span className="font-medium">
                        {selectedSession.country}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Entry:</span>{" "}
                      <span className="font-medium">
                        {selectedSession.entryPage}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Event Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

                    <div className="space-y-4">
                      {timelineQuery.isLoading ? (
                        <div className="flex justify-center p-8">
                          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                        </div>
                      ) : (
                        timelineQuery.data?.map(
                          (event: SessionEvent, index: number) => (
                            <div key={index} className="relative pl-12">
                              {/* Timeline dot */}
                              <div className="absolute left-4 top-2 w-4 h-4 rounded-full bg-background border-2 border-muted flex items-center justify-center z-10">
                                {getEventIcon(event.type)}
                              </div>

                              <div
                                className={`rounded-lg p-4 border-l-4 ${getEventColor(
                                  event.type
                                )} cursor-pointer`}
                                onClick={() => toggleEventExpand(index)}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-sm font-medium capitalize">
                                        {event.type}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {new Date(
                                          event.timestamp
                                        ).toLocaleTimeString()}
                                      </span>
                                    </div>
                                    {event.type === "pageview" && (
                                      <div className="text-sm text-foreground">
                                        <Navigation className="inline w-3 h-3 mr-1" />
                                        {event.url} • {event.duration}s on page
                                      </div>
                                    )}
                                    {event.type === "interaction" && (
                                      <div className="text-sm text-foreground">
                                        {event.action} on {event.element}
                                      </div>
                                    )}
                                    {event.type === "error" && (
                                      <div className="text-sm text-red-600 font-mono">
                                        {event.message}
                                      </div>
                                    )}
                                    {event.type === "network" && (
                                      <div className="text-sm text-foreground">
                                        <span
                                          className={`font-medium ${
                                            (event.status || 200) >= 400
                                              ? "text-red-600"
                                              : "text-green-600"
                                          }`}
                                        >
                                          {event.status}
                                        </span>{" "}
                                        {event.method} {event.url} •{" "}
                                        {event.duration}ms
                                      </div>
                                    )}
                                  </div>
                                  {expandedEvents.has(index) ? (
                                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                  )}
                                </div>

                                {expandedEvents.has(index) && (
                                  <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                                    <div className="font-mono bg-muted p-2 rounded overflow-x-auto">
                                      {JSON.stringify(event, null, 2)}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="h-full flex items-center justify-center p-12 text-center">
              <div>
                <User className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium mb-2">
                  Select a session to view details
                </h3>
                <p className="text-muted-foreground">
                  Click on any session from the list to see the full event
                  timeline
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSessions;
