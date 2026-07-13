import { NextResponse } from 'next/server';
import { fetchStores } from '@/lib/cheapshark';

export const revalidate = 86400; // 24 hours ISR

export async function GET() {
  try {
    const stores = await fetchStores();

    return NextResponse.json(
      { stores, fetchedAt: Date.now() },
      {
        headers: {
          'Cache-Control': 's-maxage=86400, stale-while-revalidate=3600',
        },
      }
    );
  } catch (error) {
    console.error('[/api/stores] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stores from CheapShark' },
      { status: 502 }
    );
  }
}
