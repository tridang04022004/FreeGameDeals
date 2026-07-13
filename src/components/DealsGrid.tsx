'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Deal, Store, SortOption } from '@/lib/types';
import { sortDeals } from '@/lib/utils';
import { GameCard } from './GameCard';
import { StoreFilter } from './StoreFilter';
import { SortControls } from './SortControls';
import { LoadMore } from './LoadMore';
import { EmptyState } from './EmptyState';

interface DealsGridProps {
  initialDeals: Deal[];
  initialHasMore: boolean;
  stores: Store[];
}

export function DealsGrid({ initialDeals, initialHasMore, stores }: DealsGridProps) {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('dealRating');

  // Build store lookup map for card rendering
  const storeMap = useMemo(
    () => Object.fromEntries(stores.map((s) => [s.storeID, s])),
    [stores]
  );

  // Client-side filter + sort
  const displayDeals = useMemo(() => {
    let filtered = deals;
    if (selectedStores.length > 0) {
      filtered = deals.filter((d) => selectedStores.includes(d.storeID));
    }
    return sortDeals(filtered, sortBy);
  }, [deals, selectedStores, sortBy]);

  const hasFilters = selectedStores.length > 0;

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const nextPage = page + 1;
      const params = new URLSearchParams({ pageNumber: String(nextPage) });
      const res = await fetch(`/api/deals?${params.toString()}`);

      if (!res.ok) throw new Error('Failed to fetch more deals');

      const data = await res.json();
      setDeals((prev) => [...prev, ...data.deals]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch (err) {
      console.error('Load more error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page]);

  return (
    <div>
      {/* Controls bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <StoreFilter
            stores={stores}
            selected={selectedStores}
            onChange={setSelectedStores}
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Sort:</span>
          <SortControls value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      {/* Results count */}
      {displayDeals.length > 0 && (
        <p className="text-xs text-[var(--text-muted)] mb-4">
          Showing <strong className="text-[var(--text-secondary)]">{displayDeals.length}</strong> free deal
          {displayDeals.length !== 1 ? 's' : ''}
          {hasFilters ? ' matching your filters' : ''}
        </p>
      )}

      {/* Grid or empty state */}
      {displayDeals.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {displayDeals.map((deal) => (
              <GameCard
                key={deal.dealID}
                deal={deal}
                store={storeMap[deal.storeID]}
              />
            ))}
          </div>

          {/* Load more — only shown if not filtering (we already have all data client-side) */}
          {!hasFilters && (
            <LoadMore
              onLoadMore={loadMore}
              isLoading={isLoading}
              hasMore={hasMore}
            />
          )}
        </>
      )}
    </div>
  );
}
