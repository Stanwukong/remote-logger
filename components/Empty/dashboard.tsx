import React from "react";
import { EmptyState } from "./empty-state";
import {
  Activity,
  AlertTriangle,
  Clock,
  FolderPlus,
  Users,
} from "lucide-react";
import { NewProjectModal } from "../dashboard/new-project-modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const EmptyDashboardPage = () => {
  return (
    <div className="space-y-8 p-6 md:px-8 lg:p-10">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary">
          Dashboard
        </h1>
        <p className="text-text-secondary">
          Monitor your applications and track performance
        </p>
      </div>

      <EmptyState
        icon={FolderPlus}
        title="Welcome to Apperio!"
        description="Get started by creating your first project. Once you have projects set up, you'll see comprehensive analytics, error tracking, and performance metrics right here."
      >
        <div className="space-y-4">
          <NewProjectModal />
          <div className="text-sm text-text-muted">
            <p className="mb-2">After creating a project, you&apos;ll be able to:</p>
            <ul className="text-left space-y-1">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-signal" />
                Monitor real-time logs and errors
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-signal" />
                Track application performance metrics
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-signal" />
                Set up alerts and notifications
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-signal" />
                Analyze user activity and trends
              </li>
            </ul>
          </div>
        </div>
      </EmptyState>

      {/* Preview of what the dashboard will look like */}
      <Card className="border-dashed border-2 border-border-subtle">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 font-display text-text-primary">
            <Activity className="w-5 h-5 text-signal" />
            <span>Dashboard Preview</span>
          </CardTitle>
          <CardDescription className="text-text-muted">
            Here&apos;s what your dashboard will look like once you start logging
            data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 opacity-50">
            <div className="bg-bg-surface border border-border-subtle p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="w-4 h-4 text-signal" />
                <span className="text-sm font-medium text-text-secondary">Total Logs</span>
              </div>
              <div className="text-2xl font-bold font-mono text-text-primary">24,567</div>
              <div className="text-xs text-status-ok">+12% from last week</div>
            </div>
            <div className="bg-bg-surface border border-border-subtle p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-status-danger" />
                <span className="text-sm font-medium text-text-secondary">Active Errors</span>
              </div>
              <div className="text-2xl font-bold font-mono text-text-primary">23</div>
              <div className="text-xs text-status-danger">+3 new today</div>
            </div>
            <div className="bg-bg-surface border border-border-subtle p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-data-info" />
                <span className="text-sm font-medium text-text-secondary">Active Users</span>
              </div>
              <div className="text-2xl font-bold font-mono text-text-primary">1,234</div>
              <div className="text-xs text-status-ok">+8% this month</div>
            </div>
            <div className="bg-bg-surface border border-border-subtle p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-status-warn" />
                <span className="text-sm font-medium text-text-secondary">Avg Response</span>
              </div>
              <div className="text-2xl font-bold font-mono text-text-primary">245ms</div>
              <div className="text-xs text-status-warn">+12ms slower</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyDashboardPage;
