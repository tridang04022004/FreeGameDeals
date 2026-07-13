import type { Deal, Store } from './types';

const BASE_URL = 'https://www.cheapshark.com/api/1.0';
const USER_AGENT = 'FreeGameDeals/1.0 (tridang0402@gmail.com)';

const DEFAULT_HEADERS: HeadersInit = {
  'User-Agent': USER_AGENT,
  Accept: 'application/json',
};

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3,
  baseDelay = 500
): Promise<Response> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const res = await fetch(url, { ...options, headers: { ...DEFAULT_HEADERS, ...options.headers } });

    if (res.status === 429) {
      const retryAfter = res.headers.get('Retry-After');
      const delay = retryAfter ? parseInt(retryAfter, 10) * 1000 : baseDelay * Math.pow(2, attempt);
      if (attempt < retries - 1) {
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
    }

    return res;
  }
  throw new Error(`Failed to fetch ${url} after ${retries} retries`);
}

export interface FetchDealsOptions {
  pageNumber?: number;
  storeID?: string;
}

/**
 * Fetch free promotional deals from CheapShark.
 * Only returns games where isOnSale=1, salePrice=0.00, normalPrice>0
 * (i.e. paid games that are temporarily free — promo giveaways).
 */
export async function fetchDeals(options: FetchDealsOptions = {}): Promise<{ deals: Deal[]; hasMore: boolean }> {
  const { pageNumber = 0, storeID } = options;

  const params = new URLSearchParams({
    upperPrice: '0',
    pageSize: '60',
    pageNumber: String(pageNumber),
    ...(storeID ? { storeID } : {}),
  });

  const url = `${BASE_URL}/deals?${params.toString()}`;
  const res = await fetchWithRetry(url);

  if (!res.ok) {
    throw new Error(`CheapShark /deals responded with ${res.status}`);
  }

  const raw: Deal[] = await res.json();

  // Filter: promo giveaways only (paid games temporarily set to $0)
  const deals = raw.filter(
    (d) =>
      d.isOnSale === '1' &&
      parseFloat(d.salePrice) === 0 &&
      parseFloat(d.normalPrice) > 0
  );

  // hasMore: if raw length equals pageSize, there might be more pages
  const hasMore = raw.length === 60;

  return { deals, hasMore };
}

/**
 * Fetch all active stores from CheapShark.
 */
export async function fetchStores(): Promise<Store[]> {
  const url = `${BASE_URL}/stores`;
  const res = await fetchWithRetry(url);

  if (!res.ok) {
    throw new Error(`CheapShark /stores responded with ${res.status}`);
  }

  const raw: Store[] = await res.json();
  return raw.filter((s) => Number(s.isActive) === 1);
}

/**
 * Warm the ISR cache by paginating through all free deal pages.
 * Stops when an empty page is returned to avoid aggressive scraping.
 */
export async function warmCache(): Promise<number> {
  let page = 0;
  let total = 0;

  while (true) {
    const params = new URLSearchParams({
      upperPrice: '0',
      pageSize: '60',
      pageNumber: String(page),
    });

    const url = `${BASE_URL}/deals?${params.toString()}`;
    const res = await fetchWithRetry(url);

    if (!res.ok) break;

    const data: Deal[] = await res.json();
    if (data.length === 0) break;

    total += data.length;
    page++;

    // Safety cap: never paginate beyond 5 pages to respect CheapShark ToS
    if (page >= 5) break;

    // Small delay between pages to be polite
    await new Promise((r) => setTimeout(r, 300));
  }

  return total;
}
