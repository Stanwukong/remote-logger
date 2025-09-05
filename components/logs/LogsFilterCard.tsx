import { useCallback, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CalendarIcon, Code, Filter, Search, Server, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { Checkbox } from "../ui/checkbox";
import { getLevelIcon } from "@/lib/utils";

// --- Component: LogsFilterCard ---
interface LogsFilterCardProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange | undefined) => void;
  selectedLevels: string[];
  onSelectedLevelsChange: (levels: string[]) => void;
  selectedProjects: string[];
  onSelectedProjectsChange: (projects: string[]) => void;
  selectedServices: string[];
  onSelectedServicesChange: (services: string[]) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
  availableProjects: {
    id: string;
    name: string;
  }[];
  availableServices: string[];
  availableLevels: string[];
}

export const LogsFilterCard: React.FC<LogsFilterCardProps> = ({
  searchTerm,
  onSearchTermChange,
  dateRange,
  onDateRangeChange,
  selectedLevels,
  onSelectedLevelsChange,
  selectedProjects,
  onSelectedProjectsChange,
  selectedServices,
  onSelectedServicesChange,
  onClearFilters,
  activeFiltersCount,
  availableProjects,
  availableServices,
  availableLevels,
}) => {
  // Debounce search term input
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchTermChange(localSearchTerm);
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [localSearchTerm, onSearchTermChange]);

  const handleCheckboxChange = useCallback(
    (
      currentSelection: string[],
      item: string,
      setter: (newSelection: string[]) => void
    ) => {
      if (currentSelection.includes(item)) {
        setter(currentSelection.filter((i) => i !== item));
      } else {
        setter([...currentSelection, item]);
      }
    },
    []
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount} active
              </Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <X className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search & Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search Messages</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="search"
                placeholder="Search log messages, services, projects..."
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-transparent"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  autoFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={onDateRangeChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Multi-select Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Log Levels */}
          <div className="space-y-2">
            <Label>Log Levels</Label>
            <div className="space-y-2">
              {availableLevels.map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox
                    id={`level-${level}`}
                    checked={selectedLevels.includes(level)}
                    onCheckedChange={() =>
                      handleCheckboxChange(
                        selectedLevels,
                        level,
                        onSelectedLevelsChange
                      )
                    }
                  />
                  <Label
                    htmlFor={`level-${level}`}
                    className="flex items-center space-x-2"
                  >
                    {getLevelIcon(level)}
                    <span className="capitalize">{level}</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="space-y-2">
            <Label>Projects</Label>
            <div className="space-y-2">
              {availableProjects.map((project) => (
                <div key={project.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`project-${project}`}
                    checked={selectedProjects.includes(project.id)}
                    onCheckedChange={() =>
                      handleCheckboxChange(
                        selectedProjects,
                        project.id,
                        onSelectedProjectsChange
                      )
                    }
                  />
                  <Label
                    htmlFor={`project-${project.name}`}
                    className="flex items-center space-x-2"
                  >
                    <Server className="w-4 h-4" />
                    <span>{project.name}</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-2">
            <Label>Services</Label>
            <div className="space-y-2">
              {availableServices.map((service) => (
                <div key={service} className="flex items-center space-x-2">
                  <Checkbox
                    id={`service-${service}`}
                    checked={selectedServices.includes(service)}
                    onCheckedChange={() =>
                      handleCheckboxChange(
                        selectedServices,
                        service,
                        onSelectedServicesChange
                      )
                    }
                  />
                  <Label
                    htmlFor={`service-${service}`}
                    className="flex items-center space-x-2"
                  >
                    <Code className="w-4 h-4" />
                    <span className="capitalize">{service}</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
