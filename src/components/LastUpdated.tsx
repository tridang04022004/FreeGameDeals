import { formatLastUpdated } from '@/lib/utils';

interface LastUpdatedProps {
  fetchedAt: number; // Unix ms timestamp
}

export function LastUpdated({ fetchedAt }: LastUpdatedProps) {
  return (
    <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
      <svg className="w-3.5 h-3.5 text-[#3b82f6] shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
      Data cached · Last refreshed {formatLastUpdated(fetchedAt)}
    </p>
  );
}
