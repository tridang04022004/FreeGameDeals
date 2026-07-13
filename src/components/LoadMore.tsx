'use client';

interface LoadMoreProps {
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
}

export function LoadMore({ onLoadMore, isLoading, hasMore }: LoadMoreProps) {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center mt-10">
      <button
        id="load-more-btn"
        onClick={onLoadMore}
        disabled={isLoading}
        className={`
          nb-border nb-shadow nb-hover px-8 py-4 text-sm font-black uppercase tracking-widest transition-all
          ${isLoading
            ? 'bg-[var(--bg-surface-2)] text-[var(--text-muted)] cursor-not-allowed'
            : 'bg-[#3b82f6] text-white hover:bg-[#2563eb]'
          }
        `}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Loading more…
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Load More Free Games
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v10.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </span>
        )}
      </button>
    </div>
  );
}
