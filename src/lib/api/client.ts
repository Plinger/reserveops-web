import { z } from "zod";
import { config } from "@/lib/config/env";
const healthSchema = z.object({
  status: z.literal("ok"),
  service: z.literal("reserveops-api"),
  network: z.literal("testnet"),
});
export async function getHealth(signal?: AbortSignal) {
  const response = await fetch(config.apiUrl.replace(/\/$/, "") + "/health", {
    signal: signal
      ? AbortSignal.any([signal, AbortSignal.timeout(5000)])
      : AbortSignal.timeout(5000),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("API returned HTTP " + response.status);
  return healthSchema.parse(await response.json());
}

const entrySchema = z.object({
  kind: z.enum(["account", "trustline", "signer"]),
  owner: z.string(),
  asset: z.string().optional(),
  signerKey: z.string().optional(),
  signerType: z.string().optional(),
  reserveUnits: z.number().int(),
  reserveStroops: z.string(),
  reserveXlm: z.string(),
});

export const inventorySchema = z.object({
  network: z.literal("testnet"),
  sponsor: z.string(),
  source: z.url(),
  observedAt: z.iso.datetime(),
  ledgerWindow: z.object({ start: z.number().int(), end: z.number().int() }),
  baseReserveLedger: z.number().int(),
  baseReserveStroops: z.string(),
  pagesRead: z.number().int(),
  accountsInspected: z.number().int(),
  truncated: z.boolean(),
  entries: z.array(entrySchema),
  summary: z.object({
    accountCount: z.number().int(),
    trustlineCount: z.number().int(),
    signerCount: z.number().int(),
    explainedReserveUnits: z.number().int(),
    totalSponsorReserveUnits: z.number().int(),
    unaccountedReserveUnits: z.number().int(),
    explainedStroops: z.string(),
    explainedXlm: z.string(),
    totalSponsorReserveStroops: z.string(),
    totalSponsorReserveXlm: z.string(),
    coverage: z.enum([
      "reconciled",
      "partial",
      "inconsistent",
      "truncated",
      "moving_ledger",
    ]),
  }),
  limitations: z.array(z.string()),
});

export type Inventory = z.infer<typeof inventorySchema>;

export async function getTestnetInventory(
  sponsor: string,
  signal?: AbortSignal,
) {
  const response = await fetch(
    `${config.apiUrl.replace(/\/$/, "")}/v1/testnet/sponsors/${encodeURIComponent(sponsor)}/inventory`,
    { signal, cache: "no-store" },
  );
  if (!response.ok) {
    if (response.status === 400)
      throw new Error(
        "The Stellar address is invalid. Check for a missing or mistyped character.",
      );
    if (response.status === 404)
      throw new Error("This sponsor account was not found on Stellar testnet.");
    if (response.status === 429)
      throw new Error("Too many requests. Wait a minute and try again.");
    if (response.status === 502)
      throw new Error("Stellar testnet is unavailable. Try again shortly.");
    throw new Error(`Could not load the inventory (HTTP ${response.status}).`);
  }
  return inventorySchema.parse(await response.json());
}
