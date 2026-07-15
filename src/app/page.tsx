import { fetchDeals, fetchStores } from "@/lib/cheapshark";
import { DealsGrid } from "@/components/DealsGrid";
import { Footer } from "@/components/Footer";

export const revalidate = 86400; // 24h ISR

export default async function HomePage() {
  // Parallel fetch: deals (page 0) + stores
  const [dealsResult, stores] = await Promise.all([
    fetchDeals({ pageNumber: 0 }),
    fetchStores(),
  ]);

  const fetchedAt = Date.now();

  return (
    <main>
      {/* Hero section */}
      <section className="border-b-2 border-[var(--border-color)] bg-[var(--bg-surface)] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="nb-border nb-shadow-pink bg-[#ec4899] text-white text-xs font-black px-3 py-1 uppercase tracking-widest">
                  100% OFF
                </span>
                <span className="nb-border nb-shadow bg-[var(--bg-surface-2)] text-[var(--text-muted)] text-xs font-bold px-3 py-1 uppercase tracking-widest">
                  PC Only
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-none tracking-tight text-[var(--text-primary)]">
                Free Game Deals,{" "}
                <span className="gradient-text">Just That.</span>
              </h1>
              <p className="mt-3 text-base text-[var(--text-secondary)] max-w-xl">
                I know this sounds sketchy, but I'm just a broke b*tch who wants
                to collect games even though I never play most of them, so I
                make this site that tracks every paid PC games that are
                currently being given away for free across{" "}
                <span className="font-bold text-[#3b82f6]">
                  {stores.length} stores
                </span>
                , deals are refreshed every 24 hours. You get the game directly
                from the stores, I don't provide any downloads.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-4 flex-shrink-0">
              <div className="nb-border nb-shadow-blue bg-[var(--bg-surface-2)] px-5 py-4 text-center">
                <p className="text-3xl font-black text-[#3b82f6]">
                  {dealsResult.deals.length}
                </p>
                <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mt-1">
                  Free Now
                </p>
              </div>
              <div className="nb-border nb-shadow-pink bg-[var(--bg-surface-2)] px-5 py-4 text-center">
                <p className="text-3xl font-black text-[#ec4899]">
                  {stores.length}
                </p>
                <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mt-1">
                  Stores
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deals grid section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DealsGrid
          initialDeals={dealsResult.deals}
          initialHasMore={dealsResult.hasMore}
          stores={stores}
        />
      </section>

      <Footer fetchedAt={fetchedAt} />
    </main>
  );
}
