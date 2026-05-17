import { ChangeEvent } from "react";
import { leadSources, leadStatuses, LeadSource, LeadStatus } from "../types";
import Button from "./Button";
import Card from "./Card";
import Input from "./Input";

interface FilterBarProps {
  searchValue: string;
  statusValue: "" | LeadStatus;
  sourceValue: "" | LeadSource;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: "" | LeadStatus) => void;
  onSourceChange: (value: "" | LeadSource) => void;
  onReset: () => void;
}

const FilterBar = ({
  searchValue,
  statusValue,
  sourceValue,
  onSearchChange,
  onStatusChange,
  onSourceChange,
  onReset,
}: FilterBarProps) => {
  const hasActiveFilters = Boolean(searchValue || statusValue || sourceValue);

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(event.target.value as "" | LeadStatus);
  };

  const handleSourceChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onSourceChange(event.target.value as "" | LeadSource);
  };

  return (
    <Card
      className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1.7fr)_repeat(2,minmax(180px,0.9fr))_auto]"
      hoverable
    >
      <Input
        containerClassName="md:col-span-2 xl:col-span-1"
        label="Search Leads"
        type="text"
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search by name or email"
        className={searchValue ? "border-accent/60 bg-accent/5" : undefined}
        icon={
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M8.75 15.5a6.75 6.75 0 1 1 0-13.5 6.75 6.75 0 0 1 0 13.5Z" />
            <path d="m13.5 13.5 4 4" />
          </svg>
        }
      />

      <Input
        as="select"
        label="Status"
        value={statusValue}
        onChange={handleStatusChange}
        className={statusValue ? "border-accent/60 bg-accent/5" : undefined}
      >
        <option value="">All Statuses</option>
        {leadStatuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </Input>

      <Input
        as="select"
        label="Source"
        value={sourceValue}
        onChange={handleSourceChange}
        className={sourceValue ? "border-accent/60 bg-accent/5" : undefined}
      >
        <option value="">All Sources</option>
        {leadSources.map((source) => (
          <option key={source} value={source}>
            {source}
          </option>
        ))}
      </Input>

      <div className="flex items-end">
        <Button
          type="button"
          variant={hasActiveFilters ? "secondary" : "ghost"}
          className="w-full xl:w-auto"
          onClick={onReset}
        >
          Reset Filters
        </Button>
      </div>
    </Card>
  );
};

export default FilterBar;
