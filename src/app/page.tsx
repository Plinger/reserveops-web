import { InventoryExplorer } from "@/features/inventory/inventory-explorer";
import { ApiStatus } from "@/features/system/api-status";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f3f7f8] text-[#183341]">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-5 sm:px-8 lg:px-12">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#cbdce0] pb-5">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#147c83] text-lg font-bold text-white"
            >
              R
            </span>
            <span className="text-lg font-extrabold tracking-[-0.04em]">
              ReserveOps
            </span>
          </div>
          <span className="rounded-full border border-[#cbdce0] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#42606b]">
            Stellar testnet · preview
          </span>
        </header>

        <section className="grid gap-8 border-b border-[#cbdce0] py-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,.8fr)] lg:items-end lg:gap-14 lg:py-16">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#147c83]">
              Sponsored reserve inventory
            </p>
            <h1 className="max-w-3xl font-['Trebuchet_MS',Arial,sans-serif] text-[clamp(2.7rem,6vw,5.6rem)] leading-[1.02] font-bold tracking-[-0.055em]">
              See where your reserve is held.
            </h1>
          </div>
          <p className="max-w-md text-base leading-7 text-[#506974]">
            Enter a sponsor address to inspect its current account, trustline,
            and signer commitments. ReserveOps compares the entries it finds
            with Stellar&apos;s total for that sponsor.
          </p>
        </section>

        <InventoryExplorer />

        <footer className="mt-16 grid gap-5 border-t border-[#cbdce0] pt-6 text-sm text-[#506974] md:grid-cols-2">
          <p>
            Public testnet data only. This preview does not determine whether
            sponsorship can be revoked.
          </p>
          <div className="md:text-right">
            <ApiStatus />
          </div>
        </footer>
      </div>
    </main>
  );
}
