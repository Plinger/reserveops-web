"use client";

import { useQuery } from "@tanstack/react-query";
import { type FormEvent, useId, useState } from "react";
import { getTestnetInventory, type Inventory } from "@/lib/api/client";

const EXAMPLE_SPONSOR =
  "GAJTATXHDK44KZDJ3345E67GUFYJXRUPVMOMP37JFL7NHCXEOUFQS2AB";
const ADDRESS_PATTERN = /^G[A-Z2-7]{55}$/;

const coverageText: Record<Inventory["summary"]["coverage"], string> = {
  reconciled: "Observed reserve units reconcile",
  partial: "Some reserve units are not itemized",
  inconsistent: "Counts changed or do not agree",
  truncated: "Result reached the preview page limit",
  moving_ledger: "Ledger advanced during inspection",
};

function shortAddress(address: string) {
  return `${address.slice(0, 8)}…${address.slice(-6)}`;
}

export function InventoryExplorer() {
  const [draft, setDraft] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [fieldError, setFieldError] = useState("");
  const id = useId();
  const { data, error, isFetching, refetch } = useQuery({
    queryKey: ["testnet-inventory", submitted],
    queryFn: ({ signal }) => getTestnetInventory(submitted, signal),
    enabled: Boolean(submitted),
    retry: false,
    staleTime: 0,
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const address = draft.trim().toUpperCase();
    if (!ADDRESS_PATTERN.test(address)) {
      setFieldError("Enter a Stellar G-address with 56 characters.");
      return;
    }
    setFieldError("");
    if (address === submitted) void refetch();
    else setSubmitted(address);
  }

  function loadExample() {
    setDraft(EXAMPLE_SPONSOR);
    setFieldError("");
    if (submitted === EXAMPLE_SPONSOR) void refetch();
    else setSubmitted(EXAMPLE_SPONSOR);
  }

  return (
    <div className="pt-10">
      <form
        onSubmit={submit}
        className="rounded-[1.5rem] border border-[#cbdce0] bg-white p-5 shadow-[0_12px_35px_rgba(25,57,70,0.05)] sm:p-7"
      >
        <div className="flex flex-wrap items-end justify-between gap-2">
          <label
            htmlFor={`${id}-sponsor`}
            className="text-sm font-bold text-[#183341]"
          >
            Sponsor account address
          </label>
          <button
            type="button"
            onClick={loadExample}
            className="text-sm font-semibold text-[#126d75] underline underline-offset-4 hover:text-[#084c54] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147c83]"
          >
            Inspect testnet example
          </button>
        </div>
        <p id={`${id}-help`} className="mt-2 text-sm text-[#506974]">
          Use a public G-address. No wallet connection or private key is needed.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            id={`${id}-sponsor`}
            type="text"
            autoComplete="off"
            spellCheck={false}
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              if (fieldError) setFieldError("");
            }}
            aria-invalid={Boolean(fieldError)}
            aria-describedby={
              fieldError ? `${id}-help ${id}-error` : `${id}-help`
            }
            placeholder="G…"
            className="min-w-0 flex-1 rounded-xl border border-[#abc3ca] bg-[#f9fcfc] px-4 py-3 font-mono text-sm text-[#183341] placeholder:text-[#78929a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147c83]"
          />
          <button
            type="submit"
            disabled={isFetching}
            className="rounded-xl bg-[#147c83] px-6 py-3 text-sm font-bold text-white hover:bg-[#0d666d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147c83] disabled:cursor-wait disabled:opacity-60"
          >
            {isFetching ? "Inspecting…" : "Inspect sponsor"}
          </button>
        </div>
        {fieldError && (
          <p
            id={`${id}-error`}
            role="alert"
            className="mt-3 text-sm font-semibold text-[#a53b2d]"
          >
            {fieldError}
          </p>
        )}
      </form>

      <div className="mt-8" aria-live="polite" aria-busy={isFetching}>
        {!submitted && <EmptyState />}
        {submitted && isFetching && !data && (
          <p
            role="status"
            className="rounded-2xl border border-[#cbdce0] bg-white p-7 text-[#506974]"
          >
            Reading current testnet sponsorships…
          </p>
        )}
        {submitted && error && (
          <div
            role="alert"
            className="rounded-2xl border border-[#edc2b9] bg-[#fff7f5] p-6 text-[#7b3027]"
          >
            <p className="font-bold">Inventory unavailable</p>
            <p className="mt-1 text-sm">
              {error instanceof Error ? error.message : "Please try again."}
            </p>
          </div>
        )}
        {data && <InventoryResult report={data} isRefreshing={isFetching} />}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <section className="grid gap-5 rounded-2xl border border-dashed border-[#abc3ca] bg-[#eaf2f3] p-7 sm:grid-cols-[auto_1fr] sm:items-center">
      <div
        aria-hidden="true"
        className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#abc3ca] font-mono text-xl text-[#147c83]"
      >
        ∑
      </div>
      <div>
        <h2 className="text-lg font-bold">Start with a sponsor address</h2>
        <p className="mt-1 text-sm leading-6 text-[#506974]">
          The report will show current sponsored entries, reserve units, and any
          gap between the itemized entries and the sponsor&apos;s total.
        </p>
      </div>
    </section>
  );
}

function InventoryResult({
  report,
  isRefreshing,
}: {
  report: Inventory;
  isRefreshing: boolean;
}) {
  const { summary } = report;
  const freshness = new Date(report.observedAt).toLocaleString();
  const knownPercent =
    summary.totalSponsorReserveUnits > 0
      ? Math.min(
          100,
          Math.max(
            0,
            Math.round(
              (summary.explainedReserveUnits /
                summary.totalSponsorReserveUnits) *
                100,
            ),
          ),
        )
      : 100;
  return (
    <section aria-labelledby="results-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#147c83]">
            Current observation
          </p>
          <h2
            id="results-heading"
            className="mt-1 text-2xl font-bold tracking-tight"
          >
            Sponsorship inventory
          </h2>
        </div>
        <p className="text-sm text-[#506974]">
          {isRefreshing ? "Refreshing report…" : `Observed ${freshness}`}
        </p>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1.35fr)_minmax(230px,.65fr)]">
        <div className="rounded-[1.5rem] bg-[#183341] p-6 text-white sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b7d8d8]">
            Total sponsored reserve requirement
          </p>
          <p className="mt-5 font-['Trebuchet_MS',Arial,sans-serif] text-5xl font-bold tracking-[-0.055em] sm:text-6xl">
            {summary.totalSponsorReserveXlm}{" "}
            <span className="text-2xl tracking-normal text-[#b7d8d8]">XLM</span>
          </p>
          <p className="mt-3 text-sm text-[#c8d8dc]">
            {summary.totalSponsorReserveUnits} base-reserve units reported by
            Horizon for this sponsor.
          </p>
          <div
            className="mt-8 h-2 overflow-hidden rounded-full bg-[#496574]"
            aria-hidden="true"
          >
            <div
              className="h-full rounded-full bg-[#56c5bc]"
              style={{ width: `${knownPercent}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-[#d8e9e9]">
            {summary.explainedReserveUnits} units itemized ·{" "}
            {summary.unaccountedReserveUnits} unaccounted
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-[#cbdce0] bg-white p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#506974]">
            Coverage
          </p>
          <p className="mt-4 text-xl font-bold leading-snug">
            {coverageText[summary.coverage]}
          </p>
          <dl className="mt-7 grid grid-cols-3 gap-3 border-t border-[#e2e9eb] pt-5 text-sm">
            <div>
              <dt className="text-[#607983]">Accounts</dt>
              <dd className="mt-1 text-xl font-bold">{summary.accountCount}</dd>
            </div>
            <div>
              <dt className="text-[#607983]">Trustlines</dt>
              <dd className="mt-1 text-xl font-bold">
                {summary.trustlineCount}
              </dd>
            </div>
            <div>
              <dt className="text-[#607983]">Signers</dt>
              <dd className="mt-1 text-xl font-bold">{summary.signerCount}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-[#cbdce0] bg-white">
        <div className="flex flex-wrap justify-between gap-2 border-b border-[#e2e9eb] px-5 py-4">
          <h3 className="font-bold">Itemized entries</h3>
          <span className="text-sm text-[#607983]">
            {report.entries.length} found · {report.accountsInspected} accounts
            inspected
          </span>
        </div>
        {report.entries.length === 0 ? (
          <p className="p-6 text-sm text-[#506974]">
            No supported sponsored entries were found in this preview. Review
            the coverage information before treating this as a complete
            inventory.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead className="bg-[#f4f8f9] text-[#506974]">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Entry
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Owner
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Detail
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-right font-semibold"
                  >
                    Reserve
                  </th>
                </tr>
              </thead>
              <tbody>
                {report.entries.map((entry, index) => (
                  <tr
                    key={`${entry.kind}-${entry.owner}-${entry.asset ?? entry.signerKey ?? index}`}
                    className="border-t border-[#e2e9eb]"
                  >
                    <td className="px-5 py-4 font-semibold capitalize">
                      {entry.kind}
                    </td>
                    <td className="px-5 py-4 font-mono" title={entry.owner}>
                      {shortAddress(entry.owner)}
                    </td>
                    <td
                      className="max-w-64 truncate px-5 py-4 font-mono text-xs text-[#506974]"
                      title={
                        entry.asset ?? entry.signerKey ?? "Account reserve"
                      }
                    >
                      {entry.asset ?? entry.signerKey ?? "Account reserve"}
                    </td>
                    <td className="px-5 py-4 text-right font-semibold tabular-nums">
                      {entry.reserveXlm} XLM
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="mt-5 rounded-2xl border border-[#d4e1e4] bg-[#eaf2f3] p-5 text-sm leading-6 text-[#36545f]">
        <h3 className="font-bold text-[#183341]">How to read this report</h3>
        <p className="mt-2">
          Observed across Horizon ledgers{" "}
          {report.ledgerWindow.start.toLocaleString()}–
          {report.ledgerWindow.end.toLocaleString()}. Reserve amounts are
          minimum-balance requirements on the sponsor&apos;s account, not
          transfers to customers.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          {report.limitations.map((limit) => (
            <li key={limit}>{limit}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
