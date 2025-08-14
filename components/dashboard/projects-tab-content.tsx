// src/components/dashboard/projects-tab-content.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Define a type for an individual project card
export interface ProjectCardData {
  name: string;
  status: "healthy" | "warning" | "critical";
  logCount?: string;
  errors: number;
  uptime: string;
  lastActivity: string;
  id: string; // Add an ID for unique linking
}

interface ProjectsTabContentProps {
  projects: ProjectCardData[];
}

export function ProjectsTabContent({ projects }: ProjectsTabContentProps) {
  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Project Overview</h3>
          <Button variant="outline" size="sm" asChild>
            <Link href="/projects">
              View All Projects
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{project.name}</CardTitle>
                  <Badge
                    variant={
                      project.status === "healthy" ? "default" : "secondary"
                    }
                  >
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Logs</span>
                    <div className="font-semibold">{project.logCount}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Errors</span>
                    <div className="font-semibold text-destructive">
                      {project.errors}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Uptime</span>
                    <div className="font-semibold">{project.uptime}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last Activity</span>
                    <div className="font-semibold">{project.lastActivity}</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  asChild
                >
                  <Link href={`/projects/${project.id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}

// Example data for parent component
export const defaultProjectsData: ProjectCardData[] = [
  {
    id: "web-application-id", // Added unique ID
    name: "Web Application",
    status: "healthy",
    logCount: "45.2K",
    errors: 12,
    uptime: "99.9%",
    lastActivity: "2 minutes ago",
  },
  {
    id: "api-service-id", // Added unique ID
    name: "API Service",
    status: "warning",
    logCount: "128.7K",
    errors: 3,
    uptime: "99.5%",
    lastActivity: "1 minute ago",
  },
  {
    id: "background-workers-id", // Added unique ID
    name: "Background Workers",
    status: "healthy",
    logCount: "89.1K",
    errors: 0,
    uptime: "100%",
    lastActivity: "30 seconds ago",
  },
];
