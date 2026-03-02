import React from "react";
import { EmptyState } from "./empty-state";
import { NewProjectModal } from "../dashboard/new-project-modal";
import { Calendar, Download, FileText, Filter, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Select, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";


const EmptyLogsPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Logs</h1>
        <p className="text-muted-foreground">
          Search and analyze your application logs
        </p>
      </div>

      <EmptyState
        icon={FileText}
        title="No logs to display"
        description="Start by creating a project and integrating our SDK into your application. Once you begin logging events, they'll appear here with powerful search and filtering capabilities."
      >
        <div className="space-y-4">
          <NewProjectModal />
          <div className="text-sm text-muted-foreground max-w-lg">
            <p className="mb-3">The logs explorer will help you:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-data-info" />
                <span>Search through log messages</span>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-status-ok" />
                <span>Filter by level and service</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-data-purple" />
                <span>Filter by date ranges</span>
              </div>
              <div className="flex items-center space-x-2">
                <Download className="w-4 h-4 text-status-warn" />
                <span>Export logs for analysis</span>
              </div>
            </div>
          </div>
        </div>
      </EmptyState>

      {/* Preview of log interface */}
      <Card className="border-dashed border-2 border-muted-foreground/25">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Log Explorer Preview</span>
          </CardTitle>
          <CardDescription>
            Here&apos;s what the log interface will look like with data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mock search bar */}
          <div className="flex items-center space-x-4 opacity-50">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search logs..." className="pl-10" disabled />
            </div>
            <Select disabled>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
            </Select>
            <Button variant="outline" disabled>
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Mock log entries */}
          <div className="space-y-3 opacity-50">
            <div className="flex items-start space-x-3 p-3 border rounded-lg">
              <div className="w-2 h-2 bg-level-error rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant="destructive" className="text-xs">
                    ERROR
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    2024-01-15 14:30:25
                  </span>
                </div>
                <p className="text-sm">
                  Database connection timeout in user authentication service
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 border rounded-lg">
              <div className="w-2 h-2 bg-level-warn rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant="secondary" className="text-xs">
                    WARN
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    2024-01-15 14:29:18
                  </span>
                </div>
                <p className="text-sm">
                  High memory usage detected: 85% of available memory in use
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 border rounded-lg">
              <div className="w-2 h-2 bg-level-info rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    INFO
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    2024-01-15 14:28:45
                  </span>
                </div>
                <p className="text-sm">
                  User login successful for user@example.com
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyLogsPage;
