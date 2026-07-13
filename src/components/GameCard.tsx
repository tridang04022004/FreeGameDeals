import Image from 'next/image';
import type { Deal, Store } from '@/lib/types';
import { buildDealUrl, buildStoreUrl, buildStoreIconUrl, formatPrice, formatDate } from '@/lib/utils';

interface GameCardProps {
  deal: Deal;
  store?: Store;
}

function StarIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export function GameCard({ deal, store }: GameCardProps) {
  const dealRating = parseFloat(deal.dealRating);
  const steamPercent = parseInt(deal.steamRatingPercent, 10);
  const metacritic = parseInt(deal.metacriticScore, 10);

  const hasDealRating = dealRating > 0;
  const hasSteamRating = steamPercent > 0;
  const hasMetacritic = metacritic > 0;

  const storeLink = buildStoreUrl(deal, store);
  const showStoreBadge = storeLink.type !== 'cheapshark';
  const dealUrl = buildDealUrl(deal.dealID);
  const storeIconUrl = store ? buildStoreIconUrl(store.images.icon) : null;

  const ratingColor =
    dealRating >= 8 ? '#ec4899' : dealRating >= 5 ? '#60a5fa' : '#94a3b8';

  return (
    <article className="nb-border nb-shadow nb-hover flex flex-col bg-[var(--bg-surface)] overflow-hidden group">
      {/* Thumbnail */}
      <div className="card-thumb-wrap relative w-full aspect-video bg-[var(--bg-surface-2)]" style={{ position: 'relative' }}>
        <a href={storeLink.url} target="_blank" rel="noopener noreferrer" aria-label={storeLink.label}>
          <Image
            src={deal.thumb}
            alt={deal.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </a>

        {/* FREE badge */}
        <div className="free-badge absolute top-2 right-2 bg-[#ec4899] text-white text-xs font-black px-2 py-1 nb-border uppercase tracking-widest select-none">
          FREE
        </div>

        {/* Store link badge — shown when we have a direct or search link */}
        {showStoreBadge && (
          <a
            href={storeLink.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={storeLink.label}
            title={storeLink.label}
            className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 hover:bg-black/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors"
          >
            {storeLink.type === 'direct' ? (
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.252 0-2.265-1.014-2.265-2.265z"/>
              </svg>
            ) : (
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            )}
            {storeLink.label}
          </a>
        )}
      </div>

      {/* Ratings row — hero */}
      {(hasDealRating || hasSteamRating || hasMetacritic) && (
        <div className="flex items-center gap-3 px-3 pt-3 flex-wrap">
          {hasDealRating && (
            <div className="flex items-center gap-1" title="Deal Rating">
              <StarIcon className="w-4 h-4" style={{ color: ratingColor }} />
              <span className="text-sm font-black" style={{ color: ratingColor }}>
                {dealRating.toFixed(1)}
              </span>
            </div>
          )}
          {hasSteamRating && (
            <div
              className="flex items-center gap-1 text-xs font-bold text-[var(--text-secondary)]"
              title={`${deal.steamRatingText} — ${steamPercent}% positive`}
            >
              <svg className="w-3.5 h-3.5 text-[#60a5fa]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2zm0-8h2v6h-2z" />
              </svg>
              <span>{steamPercent}%</span>
              {deal.steamRatingText && (
                <span className="hidden sm:inline text-[var(--text-muted)]">· {deal.steamRatingText}</span>
              )}
            </div>
          )}
          {hasMetacritic && (
            <div
              className="flex items-center gap-1 text-xs font-bold"
              title={`Metacritic: ${metacritic}`}
            >
              <span
                className="nb-border px-1.5 py-0.5 text-xs font-black"
                style={{
                  background: metacritic >= 75 ? '#22c55e' : metacritic >= 50 ? '#eab308' : '#ef4444',
                  color: '#fff',
                  fontSize: '11px',
                }}
              >
                {metacritic}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Card body */}
      <div className="flex flex-col flex-1 p-3 gap-2">
        {/* Title */}
        <div className="flex items-start justify-between gap-2">
          <a
            href={dealUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-black text-[var(--text-primary)] hover:text-[#3b82f6] transition-colors leading-tight line-clamp-2"
            title={deal.title}
          >
            {deal.title}
          </a>
        </div>

        {/* Price row */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[var(--text-muted)] line-through">
            {formatPrice(deal.normalPrice)}
          </span>
          <span className="text-sm font-black text-[#ec4899]">100% OFF</span>
        </div>

        {/* Release date */}
        {deal.releaseDate > 0 && (
          <p className="text-xs text-[var(--text-muted)]">Released {formatDate(deal.releaseDate)}</p>
        )}

        {/* Store + CTA */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-[var(--bg-surface-2)]">
          {/* Store logo */}
          <div className="flex items-center gap-1.5">
            {storeIconUrl && (
              <Image
                src={storeIconUrl}
                alt={store!.storeName}
                width={16}
                height={16}
                className="object-contain"
              />
            )}
            {store && (
              <span className="text-xs font-bold text-[var(--text-muted)] truncate max-w-[80px]">
                {store.storeName}
              </span>
            )}
          </div>

          {/* Get Deal button */}
          <a
            id={`deal-${deal.dealID.slice(0, 8)}`}
            href={storeLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="nb-border nb-shadow-blue nb-hover-pink flex items-center gap-1.5 bg-[#3b82f6] text-white text-xs font-black px-3 py-2 uppercase tracking-wide transition-all hover:bg-[#2563eb]"
          >
            GET DEAL
            <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}
