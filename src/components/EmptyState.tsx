interface EmptyStateProps {
  hasFilters: boolean;
}

export function EmptyState({ hasFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      <div className="nb-border nb-shadow-pink w-24 h-24 flex items-center justify-center bg-[var(--bg-surface)]">
        <svg
          className="w-12 h-12 text-[var(--text-muted)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <div className="text-center max-w-sm">
        <h2 className="text-2xl font-black text-[var(--text-primary)] mb-2">
          {hasFilters ? 'No deals match your filters' : 'No free deals right now'}
        </h2>
        <p className="text-sm text-[var(--text-muted)]">
          {hasFilters
            ? 'Try selecting a different store or clearing your filters.'
            : 'Check back soon — CheapShark updates throughout the day and we refresh every 24 hours.'}
        </p>
      </div>

      {hasFilters && (
        <p className="text-xs text-[var(--text-muted)]">
          Tip: Click <strong className="text-[var(--text-secondary)]">All Stores</strong> to see every available free deal.
        </p>
      )}
    </div>
  );
}
