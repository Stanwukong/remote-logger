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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your applications and track performance
        </p>
      </div>

      <EmptyState
        icon={FolderPlus}
        title="Welcome to LogHive!"
        description="Get started by creating your first project. Once you have projects set up, you'll see comprehensive analytics, error tracking, and performance metrics right here."
      >
        <div className="space-y-4">
          <NewProjectModal />
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">After creating a project, you&apos;ll be able to:</p>
            <ul className="text-left space-y-1">
              <li>• Monitor real-time logs and errors</li>
              <li>• Track application performance metrics</li>
              <li>• Set up alerts and notifications</li>
              <li>• Analyze user activity and trends</li>
            </ul>
          </div>
        </div>
      </EmptyState>

      {/* Preview of what the dashboard will look like */}
      <Card className="border-dashed border-2 border-muted-foreground/25">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Dashboard Preview</span>
          </CardTitle>
          <CardDescription>
            Here&apos;s what your dashboard will look like once you start logging
            data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 opacity-50">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">Total Logs</span>
              </div>
              <div className="text-2xl font-bold">24,567</div>
              <div className="text-xs text-green-600">+12% from last week</div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">Active Errors</span>
              </div>
              <div className="text-2xl font-bold">23</div>
              <div className="text-xs text-red-600">+3 new today</div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Active Users</span>
              </div>
              <div className="text-2xl font-bold">1,234</div>
              <div className="text-xs text-green-600">+8% this month</div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Avg Response</span>
              </div>
              <div className="text-2xl font-bold">245ms</div>
              <div className="text-xs text-yellow-600">+12ms slower</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyDashboardPage;
