import { NextRequest, NextResponse } from 'next/server';
import { warmCache } from '@/lib/cheapshark';

export async function GET(request: NextRequest) {
  // Validate Vercel cron secret (auto-injected by Vercel on deployment)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('[cron/refresh] Starting cache warm...');
    const totalDeals = await warmCache();
    console.log(`[cron/refresh] Warmed cache with ${totalDeals} deals`);

    return NextResponse.json({
      success: true,
      totalDeals,
      refreshedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[cron/refresh] Error:', error);
    return NextResponse.json(
      { error: 'Cache refresh failed', detail: String(error) },
      { status: 500 }
    );
  }
}
