'use client';

import type { SortOption } from '@/lib/types';

interface SortControlsProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'dealRating', label: 'Best Deal' },
  { value: 'releaseDate', label: 'Newest' },
  { value: 'title', label: 'A → Z' },
];

export function SortControls({ value, onChange }: SortControlsProps) {
  return (
    <div
      className="flex items-stretch nb-border nb-shadow overflow-hidden"
      role="group"
      aria-label="Sort deals"
    >
      {OPTIONS.map((opt, i) => (
        <div
          key={opt.value}
          className={`flex-1 flex ${i < OPTIONS.length - 1 ? 'border-r-2 border-[var(--border-color)]' : ''}`}
        >
          <button
            id={`sort-${opt.value}`}
            onClick={() => onChange(opt.value)}
            aria-pressed={value === opt.value}
            className={`
              w-full px-3 py-2 text-xs font-black uppercase tracking-wide transition-all
              ${value === opt.value
                ? 'bg-[#3b82f6] text-white'
                : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-2)]'
              }
            `}
          >
            {opt.label}
          </button>
        </div>
      ))}
    </div>
  );
}
