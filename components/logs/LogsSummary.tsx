import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

// --- Component: LogsSummary ---
interface LogsSummaryProps {
  filteredCount: number;
  totalCount: number;
  activeFiltersCount: number;
  onSortChange: (value: string) => void;
}

export const LogsSummary: React.FC<LogsSummaryProps> = ({
  filteredCount,
  totalCount,
  activeFiltersCount,
  onSortChange,
}) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <div className="flex items-center space-x-4 flex-wrap gap-2">
      <span className="text-sm text-muted-foreground">
        Showing {filteredCount} of {totalCount} logs
      </span>
      {activeFiltersCount > 0 && (
        <Badge variant="outline">
          {activeFiltersCount} filter{activeFiltersCount !== 1 ? "s" : ""} applied
        </Badge>
      )}
    </div>
    <div className="flex items-center space-x-2">
      <Select defaultValue="newest" onValueChange={onSortChange}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="level">By Level</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);