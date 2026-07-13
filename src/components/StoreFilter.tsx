'use client';

import { buildStoreIconUrl } from '@/lib/utils';
import type { Store } from '@/lib/types';

interface StoreFilterProps {
  stores: Store[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function StoreFilter({ stores, selected, onChange }: StoreFilterProps) {
  const allSelected = selected.length === 0;

  const toggleStore = (storeID: string) => {
    if (selected.includes(storeID)) {
      onChange(selected.filter((id) => id !== storeID));
    } else {
      onChange([...selected, storeID]);
    }
  };

  const clearAll = () => onChange([]);

  return (
    <div className="flex flex-wrap items-center gap-2 max-w-full" role="group" aria-label="Filter by store" style={{ maxWidth: 'calc(5 * 150px + 4 * 0.5rem)' }}>
      {/* All Stores pill */}
      <button
        id="store-filter-all"
        onClick={clearAll}
        aria-pressed={allSelected}
        className={`
          nb-border nb-hover flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wide transition-all
          ${allSelected
            ? 'bg-[#3b82f6] text-white nb-shadow-blue'
            : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] nb-shadow hover:bg-[var(--bg-surface-2)]'
          }
        `}
      >
        All Stores
      </button>

      {/* Per-store pills */}
      {stores.map((store) => {
        const isActive = selected.includes(store.storeID);
        return (
          <button
            key={store.storeID}
            id={`store-filter-${store.storeID}`}
            onClick={() => toggleStore(store.storeID)}
            aria-pressed={isActive}
            className={`
              nb-border nb-hover flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-all
              ${isActive
                ? 'bg-[#ec4899] text-white nb-shadow-pink'
                : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] nb-shadow hover:bg-[var(--bg-surface-2)]'
              }
            `}
          >
            <img
              src={buildStoreIconUrl(store.images.icon)}
              alt={store.storeName}
              width={14}
              height={14}
              className="object-contain"
            />
            <span className="hidden sm:inline">{store.storeName}</span>
          </button>
        );
      })}
    </div>
  );
}
