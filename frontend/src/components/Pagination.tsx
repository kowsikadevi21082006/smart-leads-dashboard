import Button from "./Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}: PaginationProps) => {
  return (
    <div className="flex flex-col gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-text-secondary">
        Page <span className="font-semibold text-text-primary">{currentPage}</span> of{" "}
        <span className="font-semibold text-text-primary">{Math.max(totalPages, 1)}</span>
      </p>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onPrevious}
          disabled={currentPage <= 1}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={onNext}
          disabled={currentPage >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
