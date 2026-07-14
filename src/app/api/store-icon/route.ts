import { NextRequest, NextResponse } from 'next/server';

// Proxy CheapShark store icons through our own domain.
//
// WHY: CheapShark is served by Cloudflare which enforces hotlink protection.
// When a browser requests https://www.cheapshark.com/img/stores/icons/*.png
// directly, it sends a cross-site Referer header (your Vercel domain), which
// Cloudflare blocks with a 429. Server-side fetches (no Referer) return 200.
//
// Calling /api/store-icon?path=/img/stores/icons/0.png from the browser sends
// a same-origin request to Vercel, which then fetches from CheapShark without
// a Referer — getting the image and streaming it back to the browser.

const CHEAPSHARK_BASE = 'https://www.cheapshark.com';

// Cache icons for 7 days — they essentially never change.
const CACHE_MAX_AGE = 60 * 60 * 24 * 7;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');

  // Validate: must be a non-empty string starting with /img/stores/icons/
  if (
    !path ||
    typeof path !== 'string' ||
    !path.startsWith('/img/stores/icons/') ||
    path.includes('..')
  ) {
    return new NextResponse('Invalid icon path', { status: 400 });
  }

  const upstreamUrl = `${CHEAPSHARK_BASE}${path}`;

  try {
    const res = await fetch(upstreamUrl, {
      // Deliberately omit Referer/Origin — this is the whole point of the proxy.
      headers: {
        'User-Agent': 'FreeGameDeals/1.0 (tridang0402@gmail.com)',
        Accept: 'image/png,image/*,*/*',
      },
      // Reuse the CDN-cached response across requests on the same edge worker.
      next: { revalidate: CACHE_MAX_AGE },
    });

    if (!res.ok) {
      return new NextResponse(`Upstream error: ${res.status}`, {
        status: res.status >= 500 ? 502 : res.status,
      });
    }

    const contentType = res.headers.get('content-type') ?? 'image/png';
    const imageBuffer = await res.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // Cache aggressively: CDN (s-maxage) + browser (max-age)
        'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, s-maxage=${CACHE_MAX_AGE}, immutable`,
      },
    });
  } catch (err) {
    console.error('[/api/store-icon] Failed to proxy icon:', upstreamUrl, err);
    return new NextResponse('Failed to fetch icon', { status: 502 });
  }
}
