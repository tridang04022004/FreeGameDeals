import type { SortOption, Deal, Store, StoreLink } from './types';

const CHEAPSHARK_BASE = 'https://www.cheapshark.com';

/**
 * Build the CheapShark deal redirect URL for a given dealID.
 */
export function buildDealUrl(dealID: string): string {
  return `${CHEAPSHARK_BASE}/redirect?dealID=${encodeURIComponent(dealID)}`;
}

/**
 * Build the Steam store URL for a given steamAppID.
 */
export function buildSteamUrl(steamAppID: string): string {
  return `https://store.steampowered.com/app/${steamAppID}`;
}

/**
 * Build the URL for a store icon, routed through our own proxy.
 *
 * WHY: CheapShark is behind Cloudflare which blocks cross-origin browser
 * requests (Referer from a different domain) with HTTP 429. Serving the icon
 * through /api/store-icon means the browser sends a same-origin request, and
 * our server fetches from CheapShark without a Referer — which always succeeds.
 */
export function buildStoreIconUrl(iconPath: string): string {
  return `/api/store-icon?path=${encodeURIComponent(iconPath)}`;
}

/**
 * Format a Unix timestamp as a human-readable date string.
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a Date object or ISO string as a "last updated" label.
 */
export function formatLastUpdated(date: Date | number): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

/**
 * Sort deals client-side by the given sort option.
 */
export function sortDeals(deals: Deal[], sortBy: SortOption): Deal[] {
  const sorted = [...deals];

  switch (sortBy) {
    case 'dealRating':
      return sorted.sort((a, b) => parseFloat(b.dealRating) - parseFloat(a.dealRating));
    case 'releaseDate':
      return sorted.sort((a, b) => b.releaseDate - a.releaseDate);
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sorted;
  }
}

/**
 * Format a USD price string (e.g. "29.99" → "$29.99").
 */
export function formatPrice(price: string): string {
  const num = parseFloat(price);
  if (isNaN(num)) return price;
  return `$${num.toFixed(2)}`;
}

/**
 * Build store-specific URL with fallback hierarchy.
 * Returns the best available direct link based on storeID and available data.
 */
export function buildStoreUrl(deal: Deal, store?: Store): StoreLink {
  const storeID = deal.storeID;
  const steamAppID = deal.steamAppID;
  const title = deal.title;

  // Steam: direct link if steamAppID exists
  if (storeID === '1' && steamAppID) {
    return {
      url: buildSteamUrl(steamAppID),
      label: 'View on Steam',
      type: 'direct'
    };
  }

  // Epic: ALWAYS search Epic, never fallback to Steam
  if (storeID === '25') {
    return {
      url: `https://store.epicgames.com/en-US/browse?q=${encodeURIComponent(title)}`,
      label: 'Search on Epic Games',
      type: 'search'
    };
  }

  // GOG: search
  if (storeID === '7') {
    return {
      url: `https://www.gog.com/en/games?query=${encodeURIComponent(title)}`,
      label: 'Search on GOG',
      type: 'search'
    };
  }

  // Humble: search
  if (storeID === '11') {
    return {
      url: `https://www.humblebundle.com/store/search?search=${encodeURIComponent(title)}`,
      label: 'Search on Humble',
      type: 'search'
    };
  }

  // Fanatical: search
  if (storeID === '15') {
    return {
      url: `https://www.fanatical.com/en/search?search=${encodeURIComponent(title)}`,
      label: 'Search on Fanatical',
      type: 'search'
    };
  }

  // Fallback: Steam if available, else CheapShark
  if (steamAppID) {
    return {
      url: buildSteamUrl(steamAppID),
      label: 'View on Steam',
      type: 'direct'
    };
  }

  // Last resort: CheapShark homepage
  return {
    url: 'https://www.cheapshark.com',
    label: 'View on CheapShark',
    type: 'cheapshark'
  };
}
