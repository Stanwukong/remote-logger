import { Button } from "../ui/button";

// --- Component: LogsPagination ---
interface LogsPaginationProps {
  filteredCount: number;
  currentPage: number;
  itemsPerPage: number;
  onPrevious: () => void;
  onNext: () => void;
}

export const LogsPagination: React.FC<LogsPaginationProps> = ({
  filteredCount,
  currentPage,
  itemsPerPage,
  onPrevious,
  onNext,
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredCount);
  const totalPages = Math.ceil(filteredCount / itemsPerPage);

  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="text-sm text-muted-foreground">
        Showing {startIndex}-{endIndex} of {filteredCount} results
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={onPrevious} disabled={currentPage === 1}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={onNext} disabled={currentPage === totalPages || filteredCount === 0}>
          Next
        </Button>
      </div>
    </div>
  );
};