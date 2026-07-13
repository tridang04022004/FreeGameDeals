import { NextRequest, NextResponse } from 'next/server';
import { fetchDeals } from '@/lib/cheapshark';

export const revalidate = 86400; // 24 hours ISR

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pageNumber = parseInt(searchParams.get('pageNumber') ?? '0', 10);
  const storeID = searchParams.get('storeID') ?? undefined;

  try {
    const { deals, hasMore } = await fetchDeals({ pageNumber, storeID });

    return NextResponse.json(
      { deals, hasMore, fetchedAt: Date.now() },
      {
        headers: {
          'Cache-Control': 's-maxage=86400, stale-while-revalidate=3600',
        },
      }
    );
  } catch (error) {
    console.error('[/api/deals] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deals from CheapShark' },
      { status: 502 }
    );
  }
}
