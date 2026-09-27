"use client";
import { useQuery } from "@tanstack/react-query";
import { getHealth } from "@/lib/api/client";
export function ApiStatus() {
  const { data, isPending, isError, refetch, isFetching } = useQuery({
    queryKey: ["api-health"],
    queryFn: ({ signal }) => getHealth(signal),
  });
  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
      <p role="status" className="text-sm text-slate-700">
        {isPending
          ? "Checking API connection…"
          : isError
            ? "API unavailable. Start the backend to connect."
            : "API connected · " +
              data.network +
              ". Database readiness is checked separately."}
      </p>
      <button
        type="button"
        disabled={isFetching}
        onClick={() => void refetch()}
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:opacity-50"
      >
        {isFetching ? "Checking…" : "Check connection"}
      </button>
    </div>
  );
}
