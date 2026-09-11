interface ResultsBarProps {
  count: number;
  hasFilters: boolean;
  onClearFilters: () => void;
}

export default function ResultsBar({ count, hasFilters, onClearFilters }: ResultsBarProps) {
  return (
    <div className="results-bar">
      <div className="results-info">
        <strong>{count}</strong>
        <span>{count === 1 ? "contact" : "contacts"}</span>
      </div>

      {hasFilters && (
        <button
          className="clear-filters"
          type="button"
          onClick={onClearFilters}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}