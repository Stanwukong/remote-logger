import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings } from "lucide-react"
import type { Project } from "@/types/analytics"

interface ProjectHeaderProps {
  project: Project
  allProjects: Project[]
  currentProjectId: string
}

export function ProjectHeader({ project, allProjects, currentProjectId }: ProjectHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">
              {project.name}
            </h1>
            <Badge variant="outline" className="text-xs">
              {project.environment}
            </Badge>
            <Badge
              variant={
                project.status === "healthy" 
                  ? "default" 
                  : project.status === "warning" 
                    ? "secondary" 
                    : "destructive"
              }
              className="text-xs"
            >
              {project.status}
            </Badge>
          </div>
          <p className="text-sm md:text-base text-muted-foreground">
            Detailed analytics and monitoring for this project
          </p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <Select defaultValue={currentProjectId}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {allProjects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                <Link href={`/projects/${p.id}`} className="block w-full">
                  {p.name}
                </Link>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" className="whitespace-nowrap">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  )
}