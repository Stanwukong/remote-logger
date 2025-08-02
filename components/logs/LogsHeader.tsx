import { Download, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

// --- Component: LogsHeader ---
interface LogsHeaderProps {
  onRefresh: () => void;
  onExport: () => void;
}

export const LogsHeader: React.FC<LogsHeaderProps> = ({ onRefresh, onExport }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Logs Explorer</h1>
      <p className="text-muted-foreground">Search and analyze logs across all your projects</p>
    </div>
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" onClick={onExport}>
        <Download className="w-4 h-4 mr-2" />
        Export
      </Button>
      <Button variant="outline" size="sm" onClick={onRefresh}>
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh
      </Button>
    </div>
  </div>
);